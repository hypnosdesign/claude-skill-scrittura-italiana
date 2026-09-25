#!/usr/bin/env node
// Solo giudice: gli output e le etichette sono fissati prima delle chiamate.
// node evals/calibrate-judge.mjs --model <id> --runs 2 --out <nuova-directory>
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
import { judge, JUDGE_POLICY, requestedModelMismatch, isSessionLimit } from './run.mjs'
import { JUDGE_POLICY_SNAPSHOT } from './judge-policy.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
export function calibrationMismatch(c, verdict) {
  const errors = Object.entries(c.expected).filter(([k, v]) => verdict[k] !== v)
    .map(([k, v]) => `${k}: atteso ${v}, ottenuto ${verdict[k]}`)
  if (c.minInvented && !(verdict.invented >= c.minInvented)) errors.push(`invented < ${c.minInvented}`)
  return errors
}

export function main(argv = process.argv.slice(2)) {
  const args = {}
  for (let i = 0; i < argv.length; i += 2) {
    if (!['--model', '--runs', '--out', '--fixtures'].includes(argv[i]) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error('flag o valore non valido')
    args[argv[i].slice(2)] = argv[i + 1]
  }
  const model = args.model ?? 'opus'
  const runs = Number(args.runs ?? 1)
  if (!Number.isInteger(runs) || runs < 1) throw new Error('runs deve essere positivo')
  const raw = readFileSync(resolve(args.fixtures ?? join(HERE, 'judge-calibration.json')), 'utf8')
  const { cases } = JSON.parse(raw)
  if (!Array.isArray(cases) || !cases.length || new Set(cases.map(c => c.id)).size !== cases.length) throw new Error('casi mancanti o duplicati')
  if (cases.some(c => !c.prompt || typeof c.output !== 'string' || !c.expectations?.length || typeof c.expected?.pass !== 'boolean')) throw new Error('caso incompleto')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const outDir = resolve(args.out ?? join(HERE, 'results', `${stamp}__judge-calibration`))
  if (existsSync(outDir)) throw new Error('directory di output già esistente')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'fixtures.json'), raw)
  writeFileSync(join(outDir, 'judge-policy.json'), JSON.stringify(JUDGE_POLICY_SNAPSHOT, null, 2))
  writeFileSync(join(outDir, 'meta.json'), JSON.stringify({ kind: 'judge-calibration', stamp, model, runs,
    judgePolicy: JUDGE_POLICY, fixturesSha256: createHash('sha256').update(raw).digest('hex'), node: process.version }, null, 2))
  const rows = []
  let aborted = false
  outer: for (const c of cases) {
    for (let run = 1; run <= runs; run++) {
      const result = judge({ prompt: c.prompt, expectations: c.expectations }, c.output, { target: c.target }, model)
      const mismatches = calibrationMismatch(c, result.verdict)
      const modelMismatch = requestedModelMismatch(model, result.models)
      const row = { id: c.id, run, ...result, mismatches, modelMismatch }
      rows.push(row)
      appendFileSync(join(outDir, 'results.jsonl'), JSON.stringify(row) + '\n')
      console.log(`${c.id} run${run}: ${!mismatches.length && !modelMismatch ? 'OK' : 'FAIL'} ${mismatches.join('; ')}`)
      if (result.verdict.pass === null && isSessionLimit(result.verdict.notes)) { aborted = true; break outer }
    }
  }
  const failed = rows.filter(r => r.mismatches.length || r.modelMismatch)
  const summary = { expected: cases.length * runs, completed: rows.length, failed: failed.map(r => ({ id: r.id, run: r.run, mismatches: r.mismatches, modelMismatch: r.modelMismatch })),
    costUsd: +rows.reduce((sum, r) => sum + (r.costUsd || 0), 0).toFixed(4), aborted,
    ok: !aborted && rows.length === cases.length * runs && failed.length === 0 }
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
  console.log(JSON.stringify(summary, null, 2))
  return { outDir, summary }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { if (!main().summary.ok) process.exitCode = 1 } catch (e) { console.error(e.message); process.exitCode = 1 }
}
