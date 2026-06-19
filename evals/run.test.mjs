import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { main, parseVerdict, validateSuite } from './run.mjs'

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
    schema_version: 2,
    evals: [{ id: 1, name: 'n', genre: 'g', target: 'preserve', split: 'dev' }],
  }
  assert.equal(validateSuite(suite, validManifest), true)
  assert.throws(
    () => validateSuite(suite, { schema_version: 2, evals: [{ ...validManifest.evals[0], split: undefined }] }),
    /split/,
  )
  assert.throws(
    () => validateSuite({ ...suite, evals: [...suite.evals, suite.evals[0]] }, validManifest),
    /duplicato/,
  )
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
  } else if (process.argv.includes('--append-system-prompt-file')) {
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
    assert.deepEqual(checked.ids, Array.from({ length: 13 }, (_, i) => i + 1))
    assert.throws(() => main(['--validate-only', '--ids', '999']), /assenti dalla suite/)
    assert.throws(() => main(['--splt', 'dev']), /flag sconosciuto/)
  } finally {
    console.log = log
  }
})
