#!/usr/bin/env node
// Esperimento di lettura nel client reale, separato dai benchmark a skill iniettata.
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { judge, JUDGE_POLICY, parseVerdict, requestedModelMismatch, isSessionLimit } from './run.mjs'
import { JUDGE_POLICY_SNAPSHOT } from './judge-policy.mjs'
import { CLIENT_POLICY } from './activation.mjs'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MODEL = 'claude-sonnet-5'
const JUDGE = 'claude-opus-5'
const IDS = [7, 19, 20, 24, 26, 27, 28, 34, 35, 40, 58, 60, 65, 66]
const read = path => JSON.parse(readFileSync(path, 'utf8'))
const sha = value => createHash('sha256').update(value).digest('hex')
const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n')
const lines = path => existsSync(path) ? readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : []

export function prepare(outDir) {
  if (existsSync(outDir)) throw new Error('directory dello studio già esistente')
  const suite = read(join(REPO, 'evals/evals.json'))
  const manifest = read(join(REPO, 'evals/manifest.json'))
  const cases = IDS.flatMap(sourceId => {
    const e = suite.evals.find(e => e.id === sourceId)
    const m = manifest.evals.find(e => e.id === sourceId)
    if (!e || m?.split !== 'dev') throw new Error(`caso ${sourceId} assente o non dev`)
    return [1, 2].map(run => ({ id: sourceId * 10 + run, sourceId, run, kind: 'positive',
      target: m.target, prompt: e.prompt, expectations: e.expectations, expected_output: e.expected_output }))
  })
  mkdirSync(outDir, { recursive: true })
  for (const arm of ['base', 'compact']) {
    mkdirSync(join(outDir, arm))
    cpSync(join(REPO, 'SKILL.md'), join(outDir, arm, 'SKILL.md'))
    cpSync(join(REPO, 'references'), join(outDir, arm, 'references'), { recursive: true })
  }
  cpSync(join(REPO, 'evals/experiments/compact-SKILL.md'), join(outDir, 'compact/SKILL.md'))
  save(join(outDir, 'cases.json'), { cases })
  save(join(outDir, 'plan.json'), { schemaVersion: 1, model: MODEL, judgeModel: JUDGE, ids: IDS,
    runs: 2, casesSha: sha(readFileSync(join(outDir, 'cases.json'))),
    decision: 'Confronto esplorativo appaiato: rilettura di tutti gli output, nessuna equivalenza o superiorità dedotta dalla parità. Non promuovere la candidata con perdite semantiche nuove non risolte.',
    humanReview: 'Non disponibile; esclusa su indicazione dell’utente, limite da dichiarare.' })
  return { outDir, cases: cases.length }
}

export function loadRun(dir) {
  const meta = read(join(dir, 'meta.json'))
  if (JSON.stringify(meta.clientPolicy) !== JSON.stringify(CLIENT_POLICY)) throw new Error('policy del client assente o diversa')
  const casesBytes = readFileSync(join(dir, 'cases.json'))
  if (sha(casesBytes) !== meta.casesSha) throw new Error('snapshot dei casi incoerente')
  if (!meta.skillFiles?.['SKILL.md']) throw new Error('snapshot della skill assente')
  for (const [file, hash] of Object.entries(meta.skillFiles)) {
    if (file.startsWith('/') || file.split('/').includes('..')) throw new Error('path di snapshot non valido')
    if (sha(readFileSync(join(dir, 'skill', file))) !== hash) throw new Error(`snapshot alterato: ${file}`)
  }
  const cases = JSON.parse(casesBytes).cases
  const rows = lines(join(dir, 'results.jsonl'))
  if (meta.model !== MODEL || cases.length !== rows.length || new Set(rows.map(r => r.id)).size !== rows.length
    || JSON.stringify([...meta.ids].sort((a,b) => a-b)) !== JSON.stringify(cases.map(c => c.id).sort((a,b) => a-b))) {
    throw new Error('run incompleto, duplicato o modello richiesto diverso')
  }
  for (const c of cases) {
    const r = rows.find(r => r.id === c.id)
    if (!r || r.prompt !== c.prompt || r.error || !r.output?.trim() || r.modelMismatch
      || !Number.isInteger(r.maxTurns) || r.maxTurns < 1
      || requestedModelMismatch(MODEL, r.models) || !r.skillFired
      || r.activationAttribution === 'ambiguous' || r.personalCopyReads?.length) {
      throw new Error(`caso ${c.id} non valido, non attribuito o contaminato`)
    }
    if (!r.transcriptFile || r.transcriptFile !== `transcript-${c.id}.jsonl`
      || !existsSync(join(dir, r.transcriptFile))) throw new Error(`transcript ${c.id} assente`)
  }
  return { meta, cases, rows }
}

export function grade(dir) {
  const { cases, rows, meta } = loadRun(dir)
  const policyPath = join(dir, 'study-judge-policy.json')
  const resultPath = join(dir, 'study-judgments.jsonl')
  if (existsSync(policyPath)) {
    if (sha(JSON.stringify(read(policyPath))) !== JUDGE_POLICY.sha256) throw new Error('policy del giudice cambiata: usare un nuovo studio')
  } else {
    if (existsSync(resultPath)) throw new Error('giudizi senza policy')
    save(policyPath, JUDGE_POLICY_SNAPSHOT)
  }
  const prior = lines(resultPath)
  for (const p of prior) {
    const r = rows.find(r => r.id === p.id)
    if (!r || p.outputSha !== sha(r.output) || p.policy?.sha256 !== JUDGE_POLICY.sha256
      || p.casesSha !== meta.casesSha || p.model !== JUDGE) throw new Error('giudizio precedente incompatibile')
  }
  for (const c of cases) {
    const r = rows.find(r => r.id === c.id)
    if (prior.some(p => p.id === c.id && typeof p.verdict?.pass === 'boolean' && !p.modelMismatch)) continue
    const evaluated = judge(c, r.output, { target: c.target }, JUDGE)
    const record = { id: c.id, sourceId: c.sourceId, run: c.run, outputSha: sha(r.output),
      casesSha: meta.casesSha, model: JUDGE, policy: JUDGE_POLICY,
      modelMismatch: requestedModelMismatch(JUDGE, evaluated.models), ...evaluated }
    appendFileSync(resultPath, JSON.stringify(record) + '\n')
    console.log(`#${c.sourceId} run${c.run}: ${evaluated.verdict.pass === null ? 'ERR' : evaluated.verdict.pass ? 'PASS' : 'FAIL'}`)
    if (isSessionLimit(evaluated.raw ?? evaluated.verdict.notes)) throw new Error('limite del giudice; riprendere --grade sulla stessa directory')
    if (evaluated.verdict.pass === null || record.modelMismatch) throw new Error('giudizio non valido; correggere la causa e riprendere --grade sulla stessa directory')
  }
  return summarize(dir)
}

export function summarize(dir) {
  const { meta, cases, rows } = loadRun(dir)
  const judgments = lines(join(dir, 'study-judgments.jsonl'))
  const selected = cases.map(c => judgments.find(p => p.id === c.id && typeof p.verdict?.pass === 'boolean' && !p.modelMismatch))
  if (selected.some(p => !p)) throw new Error('giudizi incompleti o modello diverso')
  for (let i = 0; i < selected.length; i++) {
    const p = selected[i], c = cases[i], r = rows.find(r => r.id === c.id)
    const checked = parseVerdict(JSON.stringify(p.verdict), c.expectations.length)
    if (checked.pass === null || checked.pass !== p.verdict.pass || p.model !== JUDGE
      || requestedModelMismatch(JUDGE, p.models) || p.outputSha !== sha(r.output)
      || p.policy?.sha256 !== JUDGE_POLICY.sha256 || p.casesSha !== meta.casesSha) throw new Error('giudizio incoerente')
  }
  const total = values => values.every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0)
    ? values.reduce((a,b) => a+b, 0) : null
  const processedInput = rows.map(r => total(['input_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens'].map(k => r.usage?.[k])))
  return { casesSha: meta.casesSha, count: cases.length, pass: selected.filter(p => p.verdict.pass).length,
    textFailures: selected.filter(p => !p.verdict.textOk).length,
    responseFailures: selected.filter(p => !p.verdict.responseOk).length,
    editorCostUsd: total(rows.map(r => r.costUsd)), editorDurationMs: total(rows.map(r => r.durationMs)),
    processedInputTokens: total(processedInput),
    // Comprende cache e passaggi multipli: non è la lunghezza del contesto unico.
    coreWords: readFileSync(join(dir, 'skill/SKILL.md'), 'utf8').trim().split(/\s+/u).length,
    referencesRead: rows.map(r => ({ id: r.id, files: r.referenceReads })),
    perCase: selected.map(p => ({ id: p.id, sourceId: p.sourceId, run: p.run, pass: p.verdict.pass })) }
}

export function compare(baseDir, compactDir) {
  const baseRun = loadRun(baseDir), compactRun = loadRun(compactDir)
  const refs = run => JSON.stringify(Object.entries(run.meta.skillFiles).filter(([f]) => f !== 'SKILL.md').sort(([a],[b]) => a.localeCompare(b)))
  if (baseRun.meta.casesSha !== compactRun.meta.casesSha || baseRun.meta.claudeVer !== compactRun.meta.claudeVer
    || baseRun.meta.hermetic !== compactRun.meta.hermetic || refs(baseRun) !== refs(compactRun)
    || baseRun.rows.some(r => r.maxTurns !== compactRun.rows.find(c => c.id === r.id)?.maxTurns)) {
    throw new Error('bracci non appaiati per casi, riferimenti, client, isolamento o limite dei turni')
  }
  const base = summarize(baseDir), compact = summarize(compactDir)
  return { base, compact, passDelta: compact.pass - base.pass,
    limitation: 'Confronto descrittivo su dev, stesso modello e stessa policy. Nessuna prova di equivalenza, non inferiorità o preferenza umana. Rileggere gli output prima della decisione.' }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [mode, a, b, ...extra] = process.argv.slice(2)
    if (!a || extra.length || (b && mode !== '--compare')) throw new Error('uso: --prepare DIR | --grade RUN | --compare BASE COMPACT')
    const result = mode === '--prepare' ? prepare(resolve(a)) : mode === '--grade' ? grade(resolve(a))
      : mode === '--compare' && b ? compare(resolve(a), resolve(b)) : null
    if (!result) throw new Error('comando sconosciuto')
    console.log(JSON.stringify(result, null, 2))
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
