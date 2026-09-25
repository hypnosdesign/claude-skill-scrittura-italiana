#!/usr/bin/env node
// Prove GPT separate dagli artefatti Claude: non ne completano né fondono i bracci.
import { mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync, cpSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { callCodex, GPT_POLICY, GPT_MODELS, hash } from './codex-client.mjs'
import { JUDGE_POLICY, JUDGE_POLICY_SNAPSHOT, JUDGE_SYSTEM_PROMPT, buildJudgePrompt } from './judge-policy.mjs'
import { parseVerdict } from './run.mjs'
import { calibrationMismatch } from './calibrate-judge.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REGRESSION_IDS = [7,15,28,34,37,58,59,60,61,62,63,64,65,66]
const STUDY_IDS = [7,19,20,24,26,27,28,34,35,40,58,60,65,66]
const FOLLOWUP_IDS = [...new Set([...REGRESSION_IDS, 20,24,27,40])].sort((a, b) => a - b)
const CONTROL_IDS = [15,24,34,37,40]
const read = path => JSON.parse(readFileSync(path, 'utf8'))
const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n')
const text = path => readFileSync(path, 'utf8')

export function prepare(dir, editor = 'gpt-5.6-terra', controlIds = CONTROL_IDS) {
  if (!GPT_MODELS.includes(editor)) throw new Error('editor non autorizzato')
  const devIds = new Set(read(join(ROOT, 'evals/manifest.json')).evals.filter(e => e.split === 'dev').map(e => e.id))
  if (!controlIds.length || new Set(controlIds).size !== controlIds.length || controlIds.some(id => !devIds.has(id))) {
    throw new Error('il controllo richiede ID dev unici')
  }
  if (existsSync(dir)) throw new Error('directory già esistente')
  mkdirSync(dir, { recursive: true })
  cpSync(join(ROOT, 'references'), join(dir, 'references'), { recursive: true })
  const paths = {
    'base.md': 'SKILL.md', 'compact.md': 'evals/experiments/compact-SKILL.md',
    'single-file.md': 'scrittura-italiana-single-file.md', 'suite.json': 'evals/evals.json',
    'manifest.json': 'evals/manifest.json', 'calibration.json': 'evals/judge-calibration.json',
  }
  for (const [to, from] of Object.entries(paths)) cpSync(join(ROOT, from), join(dir, to))
  save(join(dir, 'judge-policy.json'), JUDGE_POLICY_SNAPSHOT)
  const files = [...Object.keys(paths), 'judge-policy.json', ...readdirSync(join(dir, 'references')).filter(f => f.endsWith('.md')).map(f => `references/${f}`)]
  save(join(dir, 'plan.json'), { schemaVersion: 1, stamp: new Date().toISOString(), editor,
    judge: 'gpt-6-sol', crosscheck: 'gpt-6-luna', runs: 2, regressionIds: REGRESSION_IDS,
    studyIds: STUDY_IDS, followupIds: FOLLOWUP_IDS, controlIds, policy: GPT_POLICY, judgePolicy: JUDGE_POLICY,
    files: Object.fromEntries(files.map(f => [f, hash(readFileSync(join(dir, f)))])),
    limits: ['Solo casi dev, nessuna valutazione umana indipendente.',
      'Instradamento con tool di lettura controllato: non misura attivazione automatica in Claude o Codex.',
      'Istruzioni personali residue registrate per impronta e uguali fra chiamate; non è un ambiente totalmente ermetico.',
      'Costo fatturato non disponibile nel client; token e tempi vengono conservati.'] })
  return { dir, prepared: true }
}

export function validate(dir) {
  const plan = read(join(dir, 'plan.json'))
  if (JSON.stringify(plan.policy) !== JSON.stringify(GPT_POLICY) || plan.judgePolicy.sha256 !== JUDGE_POLICY.sha256) {
    throw new Error('policy diversa: preparare uno studio nuovo')
  }
  for (const [file, expected] of Object.entries(plan.files)) {
    if (file.startsWith('/') || file.split('/').includes('..') || hash(readFileSync(join(dir, file))) !== expected) {
      throw new Error(`snapshot alterato: ${file}`)
    }
  }
  const suite = read(join(dir, 'suite.json')), manifest = read(join(dir, 'manifest.json'))
  const cases = id => {
    const e = suite.evals.find(e => e.id === id), m = manifest.evals.find(e => e.id === id)
    if (!e || m?.split !== 'dev') throw new Error(`caso non dev: ${id}`)
    return { ...e, target: m.target }
  }
  return { plan, cases }
}

async function measured(dir, key, input) {
  const path = join(dir, `${key}.json`)
  const fingerprint = hash(JSON.stringify(input))
  let result
  if (existsSync(path)) {
    result = read(path)
    if (result.fingerprint !== fingerprint || result.model !== input.model || !result.output?.trim()
      || JSON.stringify(result.policy) !== JSON.stringify(GPT_POLICY)) throw new Error(`artefatto incompatibile: ${key}`)
  } else {
    try {
      result = { fingerprint, ...await callCodex(input) }
      save(path, result)
    } catch (error) {
      save(join(dir, `${key}-error-${Date.now()}.json`), { message: error.message, artifact: error.artifact })
      throw error
    }
  }
  const clientPath = join(dir, 'client.json')
  const client = { version: result.version, instructionHashes: result.instructionHashes }
  if (existsSync(clientPath)) {
    if (JSON.stringify(read(clientPath)) !== JSON.stringify(client)) throw new Error('client o istruzioni globali cambiati')
  } else save(clientPath, client)
  return result
}

async function judgeOutput(dir, key, e, output, model) {
  const result = await measured(dir, key, { model, instructions: JUDGE_SYSTEM_PROMPT,
    prompt: buildJudgePrompt(e, output, { target: e.target }) })
  const verdict = parseVerdict(result.output, e.expectations.length)
  if (verdict.pass === null) throw new Error(`verdetto non valido: ${key}`)
  return { verdict, artifact: `${key}.json` }
}

export async function run(mode, dir) {
  if (mode === 'prepare') return prepare(dir)
  const { plan, cases } = validate(dir)
  if (mode === 'probe') {
    const rows = []
    for (const model of GPT_MODELS) {
      const result = await measured(dir, `probe-${model}`, { model,
        instructions: 'Leggi references/prova.md con read_reference, poi restituisci solo il codice contenuto nel file.',
        prompt: 'Leggi il riferimento e restituisci il codice.', references: { 'references/prova.md': 'Codice: CAMPIONE_731' } })
      if (result.output.trim() !== 'CAMPIONE_731' || result.reads.length !== 1) throw new Error(`probe fallito: ${model}`)
      rows.push({ model, pass: true, durationMs: result.durationMs })
      console.log(`probe ${model}: OK`)
    }
    save(join(dir, 'probe-summary.json'), rows); return rows
  }
  if (mode === 'calibrate') {
    const rows = []
    for (const c of read(join(dir, 'calibration.json')).cases) {
      const judged = await judgeOutput(dir, `calibration-${c.id}`, c, c.output, plan.judge)
      const mismatches = calibrationMismatch(c, judged.verdict)
      rows.push({ id: c.id, ...judged, mismatches })
      save(join(dir, 'calibration-summary.json'), rows)
      console.log(`calibrazione ${c.id}: ${mismatches.length ? 'DIVERGE ' + mismatches.join('; ') : 'OK'}`)
    }
    return { count: rows.length, divergent: rows.filter(r => r.mismatches.length) }
  }
  if (!['regression', 'study', 'focused', 'followup', 'control', 'control-crosscheck', 'crosscheck'].includes(mode)) throw new Error('modo non valido')
  if (mode === 'followup' && !plan.followupIds) throw new Error('preparare un nuovo snapshot con il piano di seguito')
  if (mode.startsWith('control') && !plan.controlIds) throw new Error('preparare uno snapshot con il piano di controllo')
  const references = Object.fromEntries(Object.keys(plan.files).filter(f => f.startsWith('references/')).map(f => [f, text(join(dir, f))]))
  const ids = mode === 'study' ? plan.studyIds : mode === 'focused'
    ? plan.regressionIds.filter(id => !plan.studyIds.includes(id))
    : mode === 'followup' ? plan.followupIds : mode.startsWith('control') ? plan.controlIds
    : mode === 'crosscheck' ? [7,28,58,65,66] : plan.regressionIds
  if (mode === 'focused') save(join(dir, 'focused-plan.json'), { ids, runs: plan.runs, arm: 'compact',
    reason: 'Casi della regressione non inclusi nel confronto: verifica supplementare prima di una possibile adozione.' })
  const rows = []
  for (const id of ids) for (let repetition = 1; repetition <= plan.runs; repetition++) {
    // Ordine alternato fra ripetizioni: nessun braccio sempre prima dell'altro.
    const arms = mode === 'study' ? (repetition === 1 ? ['base', 'compact'] : ['compact', 'base'])
      : mode === 'focused' ? ['compact'] : ['single-file']
    for (const arm of arms) {
      const e = cases(id), key = `editor-${arm}-${id}-${repetition}`
      if (mode.endsWith('crosscheck') && !existsSync(join(dir, `${key}.json`))) throw new Error('prima eseguire regression o control')
      const result = await measured(dir, key, { model: plan.editor, instructions: text(join(dir, `${arm}.md`)),
        prompt: e.prompt, ...(arm === 'single-file' ? {} : { references }) })
      const judgeModel = mode.endsWith('crosscheck') ? plan.crosscheck : plan.judge
      const judged = await judgeOutput(dir, `judge-${judgeModel}-${arm}-${id}-${repetition}`, e, result.output, judgeModel)
      rows.push({ id, repetition, arm, editorArtifact: `${key}.json`, ...judged,
        editorDurationMs: result.durationMs, usage: result.usage, reads: result.reads })
      save(join(dir, `${mode}-summary.json`), { planned: ids.length * plan.runs * arms.length,
        completed: rows.length, pass: rows.filter(r => r.verdict.pass).length, rows })
      console.log(`${mode} #${id} run${repetition} ${arm}: ${judged.verdict.pass ? 'PASS' : 'FAIL'} ${judged.verdict.notes}`)
    }
  }
  return { completed: rows.length, pass: rows.filter(r => r.verdict.pass).length }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [mode, out, editor, ...extra] = process.argv.slice(2)
    if (!out || extra.length || (editor && mode !== 'prepare')) throw new Error('uso: gpt-study.mjs MODO DIR; prepare DIR [EDITOR]')
    console.log(JSON.stringify(mode === 'prepare' ? prepare(resolve(out), editor) : await run(mode, resolve(out)), null, 2))
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
