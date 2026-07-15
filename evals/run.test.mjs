import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { main, parseCliEnvelope, parseVerdict, validateSuite } from './run.mjs'

test('parseVerdict accetta un verdetto coerente', () => {
  assert.deepEqual(
    parseVerdict('{"pass":true,"invented":0,"expectations":[true,true],"notes":"ok"}', 2),
    { pass: true, invented: 0, expectations: [true, true], notes: 'ok' },
  )
})

test('parseVerdict ricalcola pass invece di fidarsi del giudice', () => {
  const verdict = parseVerdict('{"pass":true,"invented":0,"expectations":[true,false],"notes":"errato"}', 2)
  assert.equal(verdict.pass, false)
  assert.match(verdict.notes, /ricalcolato=false/)
})

test('parseVerdict rifiuta tipi permissivi e conteggi impossibili', () => {
  assert.equal(parseVerdict('{"pass":"false","invented":0,"expectations":[true],"notes":""}', 1).pass, null)
  assert.equal(parseVerdict('{"pass":false,"invented":-1,"expectations":[false],"notes":""}', 1).pass, null)
  assert.equal(parseVerdict('{"pass":true,"invented":0,"expectations":[true],"notes":""}', 2).pass, null)
})

test('validateSuite richiede corrispondenza completa e split congelato', () => {
  const suite = {
    skill_name: 'x',
    evals: [{ id: 1, prompt: 'p', files: [], expectations: ['e'] }],
  }
  const validManifest = {
    schema_version: 3,
    evals: [{ id: 1, name: 'n', genre: 'g', target: 'minimal', split: 'dev' }],
  }
  assert.equal(validateSuite(suite, validManifest), true)
  assert.throws(
    () => validateSuite(suite, { schema_version: 3, evals: [{ ...validManifest.evals[0], split: undefined }] }),
    /split/,
  )
  assert.throws(
    () => validateSuite({ ...suite, evals: [...suite.evals, suite.evals[0]] }, validManifest),
    /duplicato/,
  )
  assert.throws(
    () => validateSuite(suite, { schema_version: 2, evals: validManifest.evals }),
    /schema_version/,
  )
  assert.throws(
    () => validateSuite(suite, { schema_version: 3, evals: [{ ...validManifest.evals[0], target: 'preserve' }] }),
    /target non valido/,
  )
})

test('parseCliEnvelope estrae testo, modelli e costo; fallback su testo puro', () => {
  const envelope = JSON.stringify({
    type: 'result',
    result: '  testo pulito  ',
    total_cost_usd: 0.12,
    modelUsage: { 'claude-sonnet-5': { inputTokens: 1 } },
  })
  assert.deepEqual(parseCliEnvelope(envelope), {
    text: 'testo pulito',
    models: ['claude-sonnet-5'],
    costUsd: 0.12,
  })
  // un JSON che non è l'envelope (es. il verdetto del giudice finto) resta testo puro
  const verdict = '{"pass":true,"invented":0,"expectations":[true],"notes":"ok"}'
  assert.deepEqual(parseCliEnvelope(verdict), { text: verdict, models: [], costUsd: null })
  assert.deepEqual(parseCliEnvelope('testo semplice'), { text: 'testo semplice', models: [], costUsd: null })
})

test('main persiste snapshot, fingerprint, transcript e tempi', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-eval-test-'))
  const fake = join(root, 'claude-fake.mjs')
  const out = join(root, 'run')
  writeFileSync(fake, `#!/usr/bin/env node
let input = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', chunk => { input += chunk })
process.stdin.on('end', () => {
  if (process.argv.includes('--version')) {
    process.stdout.write('fake-claude 1.0')
  } else if (process.argv.includes('fake-editor')) {
    process.stdout.write('Il bollettino meteorologico non lascia prevedere un miglioramento prima di lunedì, quindi conviene rimandare la gita.')
  } else {
    process.stdout.write(JSON.stringify({ pass: true, invented: 0, expectations: [true, true, true], notes: 'ok' }))
  }
})
`)
  chmodSync(fake, 0o755)

  const previous = process.env.CLAUDE_BIN
  const log = console.log
  process.env.CLAUDE_BIN = fake
  console.log = () => {}
  try {
    const result = main(['--ids', '5', '--out', out, '--model', 'fake-editor', '--judge-model', 'fake-judge'])
    assert.equal(result.summary.pass, 1)
    const meta = JSON.parse(readFileSync(join(out, 'meta.json'), 'utf8'))
    assert.match(meta.skill.sha256, /^[a-f0-9]{64}$/)
    assert.equal(
      meta.skill.sha256,
      createHash('sha256').update(readFileSync(join(out, 'skill.md'), 'utf8')).digest('hex'),
    )
    assert.equal(meta.sameModel, false)
    const row = JSON.parse(readFileSync(join(out, 'results.jsonl'), 'utf8').trim())
    assert.equal(row.verdict.pass, true)
    assert.equal(row.prompt.includes('bollettino meteorologico'), true)
    assert.equal(row.expectations.length, 3)
    assert.equal(row.judgePrompt.includes('ASPETTATIVE'), true)
    assert.equal(typeof row.editorDurationMs, 'number')
    assert.equal(typeof row.judgeDurationMs, 'number')
    assert.equal(readFileSync(join(out, 'skill.md'), 'utf8').length > 1000, true)
    assert.equal(readFileSync(join(out, 'suite.json'), 'utf8').includes('\"id\": 17'), true)
    assert.throws(
      () => main(['--ids', '5', '--out', out, '--model', 'fake-editor', '--judge-model', 'fake-judge']),
      /già esistente/,
    )

    // braccio baseline nuda: nessuna skill iniettata, meta onesto, stessa pipeline di giudizio
    const outNoSkill = join(root, 'run-no-skill')
    const bare = main(['--ids', '5', '--no-skill', '--out', outNoSkill, '--model', 'fake-editor', '--judge-model', 'fake-judge'])
    assert.equal(bare.summary.pass, 1)
    const bareMeta = JSON.parse(readFileSync(join(outNoSkill, 'meta.json'), 'utf8'))
    assert.equal(bareMeta.skill.noSkill, true)
    assert.equal(bareMeta.skill.sha256, null)
    assert.throws(
      () => main(['--ids', '5', '--no-skill', '--skill', fake, '--out', join(root, 'x'), '--model', 'fake-editor', '--judge-model', 'fake-judge']),
      /alternativi/,
    )
  } finally {
    console.log = log
    if (previous === undefined) delete process.env.CLAUDE_BIN
    else process.env.CLAUDE_BIN = previous
    rmSync(root, { recursive: true, force: true })
  }
})

test('main usa dev per default e rifiuta flag o id sconosciuti', () => {
  const log = console.log
  console.log = () => {}
  try {
    const checked = main(['--validate-only'])
    assert.equal(checked.splitFilter, 'dev')
    // dev = 1–13 (storici) + 17 (declassato da held-out: osservato) + 18–30 (estensione 2026-07)
    assert.deepEqual(checked.ids, [
      ...Array.from({ length: 13 }, (_, i) => i + 1),
      ...Array.from({ length: 14 }, (_, i) => i + 17),
    ])
    const heldOut = main(['--validate-only', '--split', 'held-out'])
    assert.deepEqual(heldOut.ids, [14, 15, 16, 31, 32, 33])
    assert.throws(() => main(['--validate-only', '--ids', '999']), /assenti dalla suite/)
    assert.throws(() => main(['--splt', 'dev']), /flag sconosciuto/)
  } finally {
    console.log = log
  }
})
