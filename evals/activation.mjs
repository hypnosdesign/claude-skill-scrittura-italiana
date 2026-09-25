#!/usr/bin/env node
// Harness di attivazione e instradamento nel CLIENT REALE (skill installata, non iniettata).
//
// Misura i due anelli che il runner della suite non può vedere:
//   1. ATTIVAZIONE  — la skill parte sulle richieste giuste (positive) e non parte
//      su quelle fuori perimetro (negative)?
//   2. INSTRADAMENTO — sui compiti per genere (routing), il modello apre i
//      riferimenti attesi in `references/`?
//
// Come funziona: copia SKILL.md + references/ in una directory di lavoro temporanea
// come skill DI PROGETTO (`.claude/skills/scrittura-italiana`), poi esegue
// `claude -p --output-format stream-json` con cwd in quella directory e ispeziona
// gli eventi: tool_use `Skill` → invocazione; tool_use `Read` nella copia di
// progetto → attribuzione alla candidata; tool_use `Read` su references/ →
// instradamento. Il solo evento `Skill` non espone il path risolto: fuori dalla
// modalità ermetica resta quindi ambiguo se esiste una copia personale omonima.
//
// Limiti onesti: è una misura del comportamento del client (che può cambiare col
// CLI), n piccolo, un solo modello per run. Indicativa, non un benchmark.
// L'ambiente NON è ermetico per default: HOME resta quello reale, quindi skill
// personali (inclusa un'eventuale copia di scrittura-italiana in ~/.claude/skills)
// possono entrare nella misura. La memoria automatica e i CLAUDE.md sono disabilitati.
// Per questo l'harness CLASSIFICA
// separatamente invocazione, attribuzione provata alla copia di progetto e letture
// della copia personale. Con --hermetic HOME e XDG_* puntano a una
// home usa-e-getta nella workdir: isola davvero, ma su macchine dove le
// credenziali del CLI vivono in ~/.claude (non nel keychain) può rompere l'auth —
// per questo è opt-in.
//
// Uso:
//   node evals/activation.mjs --probe                 # 1 positivo + 1 routing, per verificare l'harness
//   node evals/activation.mjs                         # tutti i casi
//   node evals/activation.mjs --kind negative         # solo un sottoinsieme
//   node evals/activation.mjs --ids 31,32 --max-turns 15
//   node evals/activation.mjs --skill-src /percorso/skill-candidata
//
// Flag: --model <m> --kind <positive|negative|routing|all> --ids <csv>
//       --max-turns <n> --out <dir> --skill-src <dir> --probe --hermetic
//       --keep-workdir

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isSessionLimit, requestedModelMismatch } from './run.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const safe = (fn, fb) => { try { return fn() } catch { return fb } }
export const CLIENT_POLICY = Object.freeze({
  tools: ['Skill', 'Read', 'Glob', 'Grep'], restricted: true, strictMcp: true,
  permissionPrompts: 'none', noSessionPersistence: true,
  env: {
    CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1',
    CLAUDE_CODE_DISABLE_CLAUDE_MDS: '1',
    CLAUDE_CODE_DISABLE_BACKGROUND_TASKS: '1',
  },
})

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)
  const model = String(args.model ?? 'claude-sonnet-5')
  const kindFilter = String(args.kind ?? 'all')
  const onlyIds = args.ids ? new Set(String(args.ids).split(',').map(Number)) : null
  const skillSrc = resolve(args['skill-src'] ?? REPO)
  const claudeBin = process.env.CLAUDE_BIN || 'claude'
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  if (args['max-turns'] !== undefined && (!Number.isInteger(Number(args['max-turns'])) || Number(args['max-turns']) < 1)) {
    throw new Error('--max-turns richiede un intero positivo')
  }

  const casesFile = resolve(args.cases ?? join(HERE, 'activation-cases.json'))
  const all = JSON.parse(readFileSync(casesFile, 'utf8')).cases
  if (!Array.isArray(all) || all.some(c => !Number.isInteger(c.id) || typeof c.prompt !== 'string'
    || !['positive', 'negative', 'routing'].includes(c.kind))
    || new Set(all.map(c => c.id)).size !== all.length) throw new Error('casi di attivazione non validi')
  if (onlyIds && [...onlyIds].some(id => !all.some(c => c.id === id))) throw new Error('id assenti dai casi')
  let selected = all.filter(c =>
    (!onlyIds || onlyIds.has(c.id)) && (kindFilter === 'all' || c.kind === kindFilter))
  if (args.probe) selected = [all.find(c => c.kind === 'positive'), all.find(c => c.kind === 'routing')].filter(Boolean)
  if (selected.length === 0) throw new Error('nessun caso selezionato')

  // Skill di progetto in una dir di lavoro pulita (fuori da ogni repo).
  const workDir = mkdtempSync(join(tmpdir(), 'scrittura-activation-'))
  const skillDir = join(workDir, '.claude', 'skills', 'scrittura-italiana')
  mkdirSync(skillDir, { recursive: true })
  cpSync(join(skillSrc, 'SKILL.md'), join(skillDir, 'SKILL.md'))
  cpSync(join(skillSrc, 'references'), join(skillDir, 'references'), { recursive: true })
  const skillSha = sha256(readFileSync(join(skillDir, 'SKILL.md'), 'utf8'))
  const hermetic = Boolean(args.hermetic)
  let fakeHome = null
  if (hermetic) {
    fakeHome = join(workDir, 'home')
    for (const sub of ['', '.config', '.cache', '.local/share']) mkdirSync(join(fakeHome, sub), { recursive: true })
  }
  // Terzo canale di prova, verificato e non dichiarato: se in ~/.claude/skills NON esiste
  // un'omonima al momento del run (l'operatore l'ha spostata via), un'invocazione del tool
  // Skill senza path può essere solo la copia di progetto — attribuzione `project-isolated`.
  const personalHomonym = join(homedir(), '.claude', 'skills', 'scrittura-italiana')
  const personalCopyAbsent = !hermetic && !existsSync(personalHomonym)

  const outDir = resolve(args.out ?? join(HERE, 'results', `${stamp}__activation`))
  if (existsSync(outDir)) throw new Error(`directory di output già esistente: ${outDir}`)
  mkdirSync(outDir, { recursive: true })
  cpSync(skillDir, join(outDir, 'skill'), { recursive: true })
  cpSync(casesFile, join(outDir, 'cases.json'))
  const files = ['SKILL.md', ...readdirSync(join(skillDir, 'references')).filter(f => f.endsWith('.md')).map(f => `references/${f}`)].sort()
  const skillFiles = Object.fromEntries(files.map(f => [f, sha256(readFileSync(join(skillDir, f)))]))

  const claudeVer = safe(() => execFileSync(claudeBin, ['--version'], { encoding: 'utf8', env: claudeEnv() }).trim(), '?')
  const gitSha = safe(() => execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim(), 'nogit')
  writeFileSync(join(outDir, 'meta.json'), JSON.stringify({
    schemaVersion: 3, stamp, argv, model, kindFilter, git: gitSha, hermetic,
    clientPolicy: CLIENT_POLICY,
    personalCopyAbsent, personalHomonym,
    skillSrc, skillSha, skillFiles, casesSha: sha256(readFileSync(casesFile)), workDir, claudeVer, node: process.version,
    ids: selected.map(c => c.id),
  }, null, 2))

  console.log(`skill di progetto: ${skillSrc} (SKILL.md sha256=${skillSha.slice(0, 12)}) · model=${model} · ${selected.length} casi`)

  let aborted = null
  const rows = []
  for (const c of selected) {
    const maxTurns = Number(args['max-turns'] ?? (c.kind === 'routing' ? 15 : 6))
    const row = runCase(c, { claudeBin, model, maxTurns, workDir, fakeHome, personalCopyAbsent })
    row.transcriptFile = `transcript-${c.id}.jsonl`
    writeFileSync(join(outDir, row.transcriptFile), row.raw)
    delete row.raw
    rows.push(row)
    appendFileSync(join(outDir, 'results.jsonl'), JSON.stringify(row) + '\n')
    const mark = row.error ? 'ERR' : row.skillFired ? 'FIRE' : row.activationAttribution === 'ambiguous' ? '?' : 'no'
    const reads = row.referenceReads.length ? ` reads=[${row.referenceReads.join(', ')}]` : ''
    const leak = row.personalCopyReads?.length ? ' ⚠copia-personale' : ''
    console.log(`#${String(c.id).padStart(2)} ${c.kind.padEnd(8)} skill=${mark}${reads}${leak}${row.error ? ` (${row.error.slice(0, 80)})` : ''}`)
    if (row.error && isSessionLimit(row.error)) {
      aborted = `limite di sessione/rate (429) al caso #${c.id}: interrompo. I casi restanti non sono stati eseguiti.`
      console.error(`\n⚠ ${aborted}`)
      break
    }
  }

  const summary = summarize(rows)
  summary.modelMismatches = rows.filter(r => r.modelMismatch).length
  if (aborted) summary.aborted = aborted
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
  const md = renderSummary(summary, { model, claudeVer, skillSha, gitSha })
  writeFileSync(join(outDir, 'summary.md'), md)
  console.log('\n' + md + `\n→ artefatti: ${outDir}`)
  if (args['keep-workdir']) console.log(`workdir conservata: ${workDir}`)
  else safe(() => rmSync(workDir, { recursive: true, force: true }), null)
  return { outDir, summary, rows, aborted, failed: Boolean(aborted || summary.errors || summary.modelMismatches) }
}

function runCase(c, { claudeBin, model, maxTurns, workDir, fakeHome, personalCopyAbsent = false }) {
  const started = process.hrtime.bigint()
  let raw = ''
  let error = null
  try {
    raw = execFileSync(claudeBin, [
      '-p', '--output-format', 'stream-json', '--verbose',
      '--model', model, '--max-turns', String(maxTurns),
      '--tools', CLIENT_POLICY.tools.join(','),
      '--allowedTools', CLIENT_POLICY.tools.join(','),
      '--restricted', '--strict-mcp-config', '--no-session-persistence',
      '--permission-prompts', CLIENT_POLICY.permissionPrompts,
    ], {
      input: c.prompt,
      cwd: workDir,
      env: claudeEnv(fakeHome),
      encoding: 'utf8',
      timeout: 360000,
      maxBuffer: 32 * 1024 * 1024,
    })
  } catch (err) {
    raw = String(err?.stdout ?? '')
    error = (String(err?.stderr || err?.message || err)).slice(0, 300)
  }

  const events = raw.split('\n').filter(Boolean).map(l => safe(() => JSON.parse(l), null)).filter(Boolean)
  // La copia di progetto vive nella workdir; qualunque altro path che contenga
  // `scrittura-italiana` (tipicamente ~/.claude/skills) è la copia personale:
  // va conteggiata come contaminazione, non come attivazione della candidata.
  // ⚠ macOS: la workdir nasce come /var/folders/… ma il client riporta i path
  // risolti /private/var/folders/… — si confronta sulla forma canonica.
  const realWorkDir = safe(() => realpathSync(workDir), workDir)
  const observed = analyzeEvents(events, { workDir, realWorkDir, hermetic: Boolean(fakeHome), personalCopyAbsent })
  const completion = readCompletion(events, model)
  error ||= completion.error
  const expected = c.expectReads ?? null
  const routingHit = expected ? observed.referenceReads.some(r => expected.some(e => r.includes(e))) : null

  return {
    id: c.id,
    kind: c.kind,
    prompt: c.prompt,
    raw,
    output: completion.output,
    usage: completion.usage,
    modelMismatch: completion.modelMismatch,
    ...observed,
    expectReads: expected,
    routingHit,
    numTurns: completion.numTurns,
    maxTurns,
    costUsd: completion.costUsd,
    models: completion.models,
    durationMs: Number((process.hrtime.bigint() - started) / 1_000_000n),
    error,
  }
}

// Senza una risposta finale verificabile il run non può misurare qualità o costo.
// Conservare separati input, cache e output evita di scambiare token fatturati per
// lunghezza delle letture; il transcript conserva il dettaglio degli strumenti.
export function readCompletion(events, model) {
  const result = events.filter(ev => ev?.type === 'result').at(-1)
  const models = Object.keys(result?.modelUsage ?? {})
  const output = typeof result?.result === 'string' ? result.result : null
  const error = !result ? 'evento result assente'
    : result.is_error || result.subtype !== 'success' ? `client non riuscito (${result.api_error_status ?? result.subtype ?? 'errore'}): ${result.result ?? ''}`
      : !output?.trim() ? 'risposta finale assente' : null
  return { output, error, models, modelMismatch: requestedModelMismatch(model, models),
    usage: result?.usage ?? null, numTurns: result?.num_turns ?? null,
    costUsd: typeof result?.total_cost_usd === 'number' ? result.total_cost_usd : null }
}

// Classificatore puro: testabile senza chiamare il client. `skillFired` significa
// "copia candidata attribuita", non semplicemente "tool Skill invocato".
export function analyzeEvents(events, { workDir, realWorkDir = workDir, hermetic = false, personalCopyAbsent = false }) {
  const inside = (p, root) => p === root || p.startsWith(`${root}/`)
  const isProjectPath = p => inside(p, workDir) || inside(p, realWorkDir)
  let skillInvoked = false
  const readPaths = []
  const projectCopyReads = []
  const personalCopyReads = []
  for (const ev of events) {
    const blocks = ev?.message?.content
    if (!Array.isArray(blocks)) continue
    for (const b of blocks) {
      if (b?.type !== 'tool_use') continue
      if (b.name === 'Skill' && JSON.stringify(b.input ?? {}).includes('scrittura-italiana')) {
        skillInvoked = true
      }
      if (b.name === 'Read' && typeof b.input?.file_path === 'string') {
        const p = b.input.file_path
        readPaths.push(p)
        if (p.includes('scrittura-italiana')) {
          if (isProjectPath(p)) {
            projectCopyReads.push(p)
          } else {
            personalCopyReads.push(p)
          }
        }
      }
    }
  }
  const referenceReads = [...new Set(readPaths
    .filter(p => isProjectPath(p) && p.includes('references/'))
    .map(p => p.split('/').pop().replace(/\.md$/, '')))]
  const projectObserved = projectCopyReads.length > 0
  const skillFired = projectObserved
    || (hermetic && skillInvoked)
    || (personalCopyAbsent && skillInvoked && !personalCopyReads.length)
  const activationAttribution = projectObserved
    ? 'project-read'
    : hermetic && skillInvoked
      ? 'project-hermetic'
      : personalCopyAbsent && skillInvoked && !personalCopyReads.length
        ? 'project-isolated'
        : personalCopyReads.length
          ? 'personal-read'
          : skillInvoked
            ? 'ambiguous'
            : 'none'
  return {
    skillInvoked,
    skillFired,
    firedVia: skillFired ? activationAttribution : null,
    activationAttribution,
    readPaths,
    referenceReads,
    projectCopyReads,
    personalCopyReads,
  }
}

function summarize(rows) {
  // Gli errori del CLI (tipicamente il tetto --max-turns raggiunto DOPO l'attivazione)
  // non invalidano la riga: skillFired e le letture arrivano dallo stream parziale.
  // Restano quindi nel denominatore; il conteggio errori è riportato a parte.
  const of = kind => rows.filter(r => r.kind === kind)
  const errors = rows.filter(r => r.error).length
  const pos = of('positive')
  const neg = of('negative')
  const rou = of('routing')
  return {
    total: rows.length,
    errors,
    skillInvocations: rows.filter(r => r.skillInvoked).length,
    ambiguousInvocations: rows.filter(r => r.activationAttribution === 'ambiguous').length,
    isolatedAttributions: rows.filter(r => r.activationAttribution === 'project-isolated').length,
    personalCopyReads: rows.reduce((s, r) => s + (r.personalCopyReads?.length || 0), 0),
    costUsd: +rows.reduce((s, r) => s + (r.costUsd || 0), 0).toFixed(4),
    positive: { n: pos.length, fired: pos.filter(r => r.skillFired).length },
    negative: { n: neg.length, fired: neg.filter(r => r.skillFired).length },
    routing: {
      n: rou.length,
      fired: rou.filter(r => r.skillFired).length,
      expectedReadHit: rou.filter(r => r.routingHit).length,
      perCase: rou.map(r => ({ id: r.id, fired: r.skillFired, reads: r.referenceReads, expected: r.expectReads, hit: r.routingHit })),
    },
  }
}

function renderSummary(s, h) {
  const pct = (a, b) => (b ? `${a}/${b} (${Math.round((a / b) * 100)}%)` : 'n/d')
  const L = []
  L.push('# Attivazione e instradamento — client reale')
  L.push(`model=${h.model} · cli=${h.claudeVer} · skill sha256=${h.skillSha.slice(0, 12)} · git=${h.gitSha}`)
  L.push('')
  L.push(`- **Attivazione (positivi):** ${pct(s.positive.fired, s.positive.n)}`)
  L.push(`- **Attivazioni spurie (negativi):** ${pct(s.negative.fired, s.negative.n)}`)
  L.push(`- **Routing — skill attiva:** ${pct(s.routing.fired, s.routing.n)} · **riferimento atteso aperto:** ${pct(s.routing.expectedReadHit, s.routing.n)}`)
  L.push(`- invocazioni del tool Skill osservate: ${s.skillInvocations} · attribuzione ambigua: ${s.ambiguousInvocations}`)
  L.push(`- errori harness: ${s.errors} · costo API dichiarato: $${s.costUsd}`)
  if (s.modelMismatches) L.push(`- ⚠ modello pinnato non rispettato: ${s.modelMismatches} casi; confronto non valido.`)
  if (s.ambiguousInvocations) L.push('- ⚠ Le invocazioni ambigue non entrano nei tassi di attivazione: ripetere con `--hermetic`, o spostare la copia personale fuori da `~/.claude/skills` (l\'harness verifica l\'assenza e attribuisce come `project-isolated`).')
  if (s.isolatedAttributions) L.push(`- attribuzioni \`project-isolated\`: ${s.isolatedAttributions} — omonima personale assente al momento del run, verificata dall'harness.`)
  if (s.personalCopyReads) L.push(`- ⚠ letture della copia PERSONALE della skill (contaminazione, escluse dai conteggi): ${s.personalCopyReads}`)
  if (s.aborted) L.push(`- ⚠ **RUN ABORTITO: ${s.aborted}**`)
  if (s.routing.perCase.length) {
    L.push('\n| caso | skill | riferimenti letti | atteso | hit |')
    L.push('|---|---|---|---|---|')
    for (const r of s.routing.perCase) {
      L.push(`| ${r.id} | ${r.fired ? '✔' : '✘'} | ${r.reads.join(', ') || '—'} | ${(r.expected ?? []).join(' o ')} | ${r.hit ? '✔' : '✘'} |`)
    }
  }
  return L.join('\n')
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

function claudeEnv(fakeHome = null) {
  const env = { ...process.env, ...CLIENT_POLICY.env }
  delete env.CLAUDECODE
  if (fakeHome) {
    env.HOME = fakeHome
    env.XDG_CONFIG_HOME = join(fakeHome, '.config')
    env.XDG_CACHE_HOME = join(fakeHome, '.cache')
    env.XDG_DATA_HOME = join(fakeHome, '.local', 'share')
  }
  return env
}

function parseArgs(argv) {
  const o = {}
  const allowed = new Set(['model', 'kind', 'ids', 'max-turns', 'out', 'skill-src', 'cases', 'probe', 'hermetic', 'keep-workdir'])
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      if (!allowed.has(k)) throw new Error(`flag sconosciuto: --${k}`)
      if (v !== undefined) o[k] = v
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) o[k] = argv[++i]
      else o[k] = true
    }
  }
  return o
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (main().failed) process.exitCode = 1
  } catch (err) {
    console.error(`errore: ${err.message}`)
    process.exit(1)
  }
}
