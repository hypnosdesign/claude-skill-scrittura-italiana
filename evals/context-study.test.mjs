import test from 'node:test'
import assert from 'node:assert/strict'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { prepare, loadRun, grade, summarize, compare } from './context-study.mjs'
import { JUDGE_POLICY } from './run.mjs'
import { CLIENT_POLICY } from './activation.mjs'

const hash = s => createHash('sha256').update(s).digest('hex')
const json = (f, v) => writeFileSync(f, JSON.stringify(v))
function fixture(dir, text = 'nucleo') {
  mkdirSync(join(dir, 'skill/references'), { recursive: true })
  writeFileSync(join(dir, 'skill/SKILL.md'), text)
  writeFileSync(join(dir, 'skill/references/guida.md'), 'guida')
  const cases = JSON.stringify({ cases: [{ id: 11, sourceId: 1, run: 1, kind: 'positive',
    target: 'exact', prompt: 'Conserva.', expectations: ['Conserva.'] }] })
  writeFileSync(join(dir, 'cases.json'), cases)
  const meta = { ids: [11], model: 'claude-sonnet-5', casesSha: hash(cases), claudeVer: 'fake1', hermetic: true, clientPolicy: CLIENT_POLICY,
    skillFiles: { 'SKILL.md': hash(text), 'references/guida.md': hash('guida') } }
  json(join(dir, 'meta.json'), meta)
  const row = { id: 11, prompt: 'Conserva.', output: 'Testo.', models: ['claude-sonnet-5'],
    skillFired: true, activationAttribution: 'project-hermetic', personalCopyReads: [],
    referenceReads: [], transcriptFile: 'transcript-11.jsonl', costUsd: 0.1, durationMs: 100, maxTurns: 15,
    usage: { input_tokens: 10, cache_creation_input_tokens: 20, cache_read_input_tokens: 30 } }
  writeFileSync(join(dir, 'results.jsonl'), JSON.stringify(row) + '\n')
  writeFileSync(join(dir, row.transcriptFile), JSON.stringify({ type: 'result', result: row.output }) + '\n')
  const judgment = { id: 11, sourceId: 1, run: 1, outputSha: hash(row.output), model: 'claude-opus-5',
    models: ['claude-opus-5'], policy: JUDGE_POLICY, casesSha: meta.casesSha,
    verdict: { pass: true, textOk: true, responseOk: true, expectations: [true], invented: 0, notes: '' } }
  writeFileSync(join(dir, 'study-judgments.jsonl'), JSON.stringify(judgment) + '\n')
  return { meta, row, judgment }
}

test('studio: prepara due bracci con riferimenti identici e soli casi dev ripetuti', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-study-'))
  try {
    const out = join(root, 'prepared')
    assert.equal(prepare(out).cases, 28)
    const cases = JSON.parse(readFileSync(join(out, 'cases.json'))).cases
    assert.equal(new Set(cases.map(c => c.id)).size, 28)
    assert.ok(cases.every(c => ![14,16,31,32,33,46].includes(c.sourceId)))
    assert.equal(readFileSync(join(out, 'base/references/stile-naturale.md'), 'utf8'), readFileSync(join(out, 'compact/references/stile-naturale.md'), 'utf8'))
    assert.notEqual(readFileSync(join(out, 'base/SKILL.md'), 'utf8'), readFileSync(join(out, 'compact/SKILL.md'), 'utf8'))
    assert.throws(() => prepare(out), /già esistente/)
  } finally { rmSync(root, { recursive: true, force: true }) }
})

test('studio: dati incompleti, contaminati, alterati o non appaiati bloccano il confronto', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-study-'))
  try {
    const a = join(root, 'a'), b = join(root, 'b')
    const original = fixture(a); fixture(b, 'nucleo compatto')
    assert.equal(compare(a,b).passDelta, 0)
    assert.equal(summarize(a).processedInputTokens, 60)
    json(join(a, 'meta.json'), { ...original.meta, clientPolicy: undefined })
    assert.throws(() => compare(a,b), /policy del client/)
    json(join(a, 'meta.json'), original.meta)
    for (const delta of [{ error: 'errore' }, { models: ['claude-opus-5'] }, { skillFired: false }, { personalCopyReads: ['personale'] }, { output: '' }, { maxTurns: undefined }]) {
      writeFileSync(join(a, 'results.jsonl'), JSON.stringify({ ...original.row, ...delta }) + '\n')
      assert.throws(() => loadRun(a), /non valido/)
    }
    writeFileSync(join(a, 'results.jsonl'), JSON.stringify({ ...original.row, maxTurns: 3 }) + '\n')
    assert.throws(() => compare(a,b), /non appaiati/)
    writeFileSync(join(a, 'results.jsonl'), JSON.stringify(original.row) + '\n')
    writeFileSync(join(a, 'study-judgments.jsonl'), '')
    assert.throws(() => summarize(a), /incompleti/)
    writeFileSync(join(a, 'study-judgments.jsonl'), JSON.stringify({ ...original.judgment, outputSha: 'falso' }) + '\n')
    assert.throws(() => summarize(a), /incoerente/)
    writeFileSync(join(a, 'study-judgments.jsonl'), JSON.stringify(original.judgment) + '\n')
    json(join(a, 'meta.json'), { ...original.meta, claudeVer: 'altro client' })
    assert.throws(() => compare(a,b), /non appaiati/)
    json(join(a, 'meta.json'), original.meta)
    writeFileSync(join(a, 'skill/references/guida.md'), 'modificata')
    assert.throws(() => loadRun(a), /alterato/)
  } finally { rmSync(root, { recursive: true, force: true }) }
})

test('studio: giudizi persistiti e resume non sostituisce un verdetto valido (CLI simulato)', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-study-'))
  const previous = process.env.CLAUDE_BIN, log = console.log
  try {
    const run = join(root, 'run'); fixture(run)
    writeFileSync(join(run, 'study-judgments.jsonl'), '')
    // La prima calibrazione non deve già contenere righe senza policy.
    rmSync(join(run, 'study-judgments.jsonl'))
    const fake = join(root, 'cli.mjs')
    writeFileSync(fake, `#!/usr/bin/env node
console.log(JSON.stringify({ result: JSON.stringify({ pass: false, textOk: false, responseOk: true,
expectations: [false], invented: 0, notes: 'errore fissato' }), modelUsage: { 'claude-opus-5': {} }, total_cost_usd: 0.01 }))
`)
    chmodSync(fake, 0o755)
    process.env.CLAUDE_BIN = fake; console.log = () => {}
    assert.equal(grade(run).pass, 0)
    const saved = readFileSync(join(run, 'study-judgments.jsonl'), 'utf8')
    assert.equal(grade(run).pass, 0)
    assert.equal(readFileSync(join(run, 'study-judgments.jsonl'), 'utf8'), saved)
    json(join(run, 'study-judge-policy.json'), { changed: true })
    assert.throws(() => grade(run), /policy.*cambiata/)
  } finally {
    if (previous === undefined) delete process.env.CLAUDE_BIN
    else process.env.CLAUDE_BIN = previous
    console.log = log
    rmSync(root, { recursive: true, force: true })
  }
})
