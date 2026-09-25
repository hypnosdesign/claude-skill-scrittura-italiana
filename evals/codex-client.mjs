// Client sperimentale: thread effimero, nessuna scrittura o delega, riferimenti in memoria.
import { spawn, execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createInterface } from 'node:readline'
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const GPT_MODELS = ['gpt-6-sol', 'gpt-5.6-terra', 'gpt-6-luna']
export const GPT_POLICY = Object.freeze({
  version: 2, provider: 'openai', effort: 'medium', sandbox: 'read-only', approval: 'never',
  ephemeral: true, autoActivation: false, referenceTool: 'skill_reference.read_reference', maxReads: 15,
  referenceOutputTokens: 65536,
  disabled: ['shell_tool', 'multi_agent', 'apps', 'plugins', 'memories', 'hooks',
    'browser_use', 'browser_use_external', 'computer_use', 'image_generation',
    'view_image', 'goals', 'sleep_tool', 'skill_search'],
})
export const hash = text => createHash('sha256').update(text).digest('hex')

export function referenceTool(references) {
  return { type: 'namespace', name: 'skill_reference', description: 'Riferimenti della skill attiva.',
    tools: [{ type: 'function', name: 'read_reference', deferLoading: false,
    description: 'Leggi per intero un riferimento della skill attiva. Scegli il file quando le istruzioni della skill lo richiedono.',
    inputSchema: { type: 'object', properties: { path: { type: 'string', enum: Object.keys(references) } },
      required: ['path'], additionalProperties: false } }] }
}

export function referenceReply(params, references, reads) {
  if (params.tool !== 'read_reference' || params.namespace !== 'skill_reference'
    || !Object.hasOwn(references, params.arguments?.path)
    || reads.length >= GPT_POLICY.maxReads) throw new Error('lettura non consentita o limite superato')
  const path = params.arguments.path, text = references[path]
  reads.push({ path, sha256: hash(text), bytes: Buffer.byteLength(text) })
  return { success: true, contentItems: [{ type: 'inputText', text }] }
}

export function verifyThread(receipt, model, instructionHashes = {}) {
  if (receipt.model !== model || receipt.modelProvider !== 'openai'
    || receipt.approvalPolicy !== 'never' || receipt.sandbox?.type !== 'readOnly'
    || receipt.reasoningEffort !== GPT_POLICY.effort
    || (receipt.instructionSources ?? []).some(path => !instructionHashes[path]
      || hash(readFileSync(path)) !== instructionHashes[path])) {
    throw new Error('modello, istruzioni o isolamento del thread non conformi')
  }
}

let localConfig
function configuration() {
  if (localConfig) return localConfig
  const bin = process.env.CODEX_BIN || 'codex'
  const servers = JSON.parse(execFileSync(bin, ['mcp', 'list', '--json'], { encoding: 'utf8', timeout: 15000 }))
  const config = { mcp_servers: {}, project_doc_max_bytes: 0, web_search: 'disabled', developer_instructions: '',
    tool_output_token_limit: GPT_POLICY.referenceOutputTokens,
    'features.code_mode.enabled': false,
    'features.code_mode.direct_only_tool_namespaces': ['skill_reference'],
    model_reasoning_effort: GPT_POLICY.effort, suppress_unstable_features_warning: true,
    'features.skip_host_skill_discovery': true }
  for (const feature of GPT_POLICY.disabled) config[`features.${feature}`] = false
  // Un trasporto inerte rende valida anche la voce scoperta fuori da config.toml.
  // enabled=false evita l'avvio: nessuna configurazione personale viene riscritta.
  for (const { name, transport } of servers) {
    if (transport.type === 'stdio') config[`mcp_servers.${name}.command`] = '/usr/bin/false'
    else if (transport.type === 'streamable_http') config[`mcp_servers.${name}.url`] = 'http://127.0.0.1:1'
    else throw new Error('trasporto MCP non riconosciuto: impossibile isolarlo')
    config[`mcp_servers.${name}.enabled`] = false
  }
  const personalInstructions = join(homedir(), '.codex/AGENTS.md')
  const instructionHashes = existsSync(personalInstructions)
    ? { [personalInstructions]: hash(readFileSync(personalInstructions)) } : {}
  localConfig = { bin, config, instructionHashes, version: execFileSync(bin, ['--version'], { encoding: 'utf8' }).trim() }
  return localConfig
}

export async function callCodex({ model, instructions, prompt, references = {}, timeoutMs = 240000 }) {
  if (!GPT_MODELS.includes(model)) throw new Error('modello GPT non autorizzato per questo studio')
  const { bin, config, version, instructionHashes } = configuration()
  const cwd = mkdtempSync(join(tmpdir(), 'scrittura-gpt-'))
  const args = ['app-server', '--stdio', ...Object.entries(config).flatMap(([k,v]) => ['-c', `${k}=${JSON.stringify(v)}`])]
  const child = spawn(bin, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] })
  const startedAt = performance.now(), trace = [], pending = new Map(), reads = []
  let nextId = 0, receipt, usage = null, stderr = '', output = '', completed = false
  let finish, fail
  const done = new Promise((resolve, reject) => { finish = resolve; fail = reject })
  // Evita rejection non gestite mentre thread/start è ancora in attesa.
  done.catch(() => {})
  const abort = error => { for (const p of pending.values()) p.reject(error); pending.clear(); fail(error) }
  const send = message => { trace.push({ direction: 'send', message }); child.stdin.write(JSON.stringify(message) + '\n') }
  const request = (method, params) => new Promise((resolve, reject) => {
    const id = ++nextId; pending.set(id, { resolve, reject }); send({ id, method, params })
  })
  const timer = setTimeout(() => abort(new Error('timeout del client Codex')), timeoutMs)
  const input = createInterface({ input: child.stdout })
  child.stderr.on('data', chunk => { stderr += String(chunk) })
  child.on('error', abort)
  child.on('exit', code => { if (!completed) abort(new Error(`client terminato prima del risultato (${code})`)) })
  input.on('line', line => {
    try {
      const message = JSON.parse(line)
      trace.push({ direction: 'receive', message })
      if (message.id !== undefined && !message.method) {
        const p = pending.get(message.id); if (!p) return
        pending.delete(message.id)
        if (message.error) p.reject(new Error(JSON.stringify(message.error)))
        else p.resolve(message.result)
      } else if (message.id !== undefined) {
        if (message.method !== 'item/tool/call') throw new Error(`richiesta inattesa: ${message.method}`)
        send({ id: message.id, result: referenceReply(message.params, references, reads) })
      } else if (message.method === 'thread/tokenUsage/updated') usage = message.params.tokenUsage
      else if (message.method === 'item/completed') {
        const item = message.params.item
        if (item.type === 'agentMessage' && item.phase === 'final_answer') output = item.text
        if (['commandExecution', 'fileChange', 'mcpToolCall', 'webSearch', 'collabAgentToolCall'].includes(item.type)) {
          throw new Error(`strumento inatteso: ${item.type}`)
        }
      } else if (message.method === 'turn/completed') {
        if (message.params.turn.status !== 'completed') throw new Error(JSON.stringify(message.params.turn.error ?? message.params.turn.status))
        completed = true; finish()
      }
    } catch (error) { abort(error) }
  })
  try {
    await request('initialize', { clientInfo: { name: 'scrittura_eval', version: '1.0.0' }, capabilities: { experimentalApi: true } })
    send({ method: 'initialized', params: {} })
    receipt = await request('thread/start', { model, modelProvider: 'openai', allowProviderModelFallback: false,
      cwd, approvalPolicy: 'never', sandbox: 'read-only', ephemeral: true, environments: [],
      baseInstructions: instructions, developerInstructions: '',
      dynamicTools: Object.keys(references).length ? [referenceTool(references)] : [] })
    verifyThread(receipt, model, instructionHashes)
    const mcp = await request('mcpServerStatus/list', { threadId: receipt.thread.id, limit: 100 })
    if (mcp.nextCursor || mcp.data.some(s => Object.keys(s.tools).length || s.resources.length || s.resourceTemplates.length)) {
      throw new Error('strumenti o risorse MCP presenti nel thread di prova')
    }
    await request('turn/start', { threadId: receipt.thread.id, model, effort: GPT_POLICY.effort,
      input: [{ type: 'text', text: prompt, text_elements: [] }] })
    await done
    if (!output.trim()) throw new Error('risposta finale assente')
    return { output, model: receipt.model, modelProvider: receipt.modelProvider, version,
      policy: GPT_POLICY, instructionHashes, usage, reads, durationMs: Math.round(performance.now() - startedAt),
      costUsd: null, costNote: 'Il client non restituisce un costo fatturato.', trace, stderr }
  } catch (error) {
    error.artifact = { requestedModel: model, receipt, trace, stderr, usage, reads, policy: GPT_POLICY }
    throw error
  } finally {
    clearTimeout(timer); completed = true; input.close(); child.stdin.end(); child.kill('SIGTERM')
    await new Promise(resolve => { if (child.exitCode !== null) resolve(); else child.once('exit', resolve) })
    rmSync(cwd, { recursive: true, force: true })
  }
}
