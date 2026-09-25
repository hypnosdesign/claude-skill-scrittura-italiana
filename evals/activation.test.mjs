import test from 'node:test'
import assert from 'node:assert/strict'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { analyzeEvents, readCompletion, main, CLIENT_POLICY } from './activation.mjs'
import { isSessionLimit } from './run.mjs'

const toolEvent = (...content) => ({ message: { content } })
const skill = { type: 'tool_use', name: 'Skill', input: { skill: 'scrittura-italiana' } }
const read = file_path => ({ type: 'tool_use', name: 'Read', input: { file_path } })

test('una misura conserva risposta, costo e token separati, senza perdere il modello risolto', () => {
  const usage = { input_tokens: 100, cache_read_input_tokens: 500, output_tokens: 30 }
  const result = readCompletion([{ type: 'result', subtype: 'success', result: 'Testo.',
    usage, total_cost_usd: 0.02, num_turns: 3, modelUsage: { 'claude-sonnet-5': {} } }], 'claude-sonnet-5')
  assert.equal(result.output, 'Testo.')
  assert.equal(result.error, null)
  assert.equal(result.modelMismatch, false)
  assert.equal(result.costUsd, 0.02)
  assert.deepEqual(result.usage, usage)
})

test('output mancanti, turni esauriti e fallback non sono prove valide', () => {
  assert.match(readCompletion([], 'claude-sonnet-5').error, /assente/)
  assert.match(readCompletion([{ type: 'result', subtype: 'error_max_turns', is_error: true }], 'claude-sonnet-5').error, /non riuscito/)
  const empty = readCompletion([{ type: 'result', subtype: 'success', result: '' }], 'claude-sonnet-5')
  assert.match(empty.error, /assente/)
  assert.equal(empty.modelMismatch, true)
  const fallback = readCompletion([{ type: 'result', subtype: 'success', result: 'Testo.', modelUsage: { 'claude-opus-5': {} } }], 'claude-sonnet-5')
  assert.equal(fallback.modelMismatch, true)
  const limit = readCompletion([{ type: 'result', subtype: 'success', is_error: true,
    api_error_status: 429, result: 'Session limit' }], 'claude-sonnet-5')
  assert.equal(isSessionLimit(limit.error), true, 'il dettaglio 429 deve arrivare al controllo di arresto')
})

test('main salva riferimenti, casi, transcript e output; gli errori producono failed', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-activation-test-'))
  const fake = join(root, 'cli.mjs')
  const source = join(root, 'source')
  const cases = join(root, 'cases.json')
  mkdirSync(join(source, 'references'), { recursive: true })
  writeFileSync(join(source, 'SKILL.md'), 'nucleo')
  writeFileSync(join(source, 'references', 'guida.md'), 'riferimento originale')
  writeFileSync(cases, JSON.stringify({ cases: [{ id: 901, kind: 'positive', prompt: 'Correggi.' }] }))
  writeFileSync(fake, `#!/usr/bin/env node
if (process.argv.includes('--version')) console.log('fake-cli 1')
else {
  for (const key of ['CLAUDE_CODE_DISABLE_AUTO_MEMORY', 'CLAUDE_CODE_DISABLE_CLAUDE_MDS', 'CLAUDE_CODE_DISABLE_BACKGROUND_TASKS']) {
    if (process.env[key] !== '1') throw Error('isolamento assente: ' + key)
  }
  for (const flag of ['--restricted', '--strict-mcp-config', '--no-session-persistence']) {
    if (!process.argv.includes(flag)) throw Error('protezione assente: ' + flag)
  }
  if (process.argv[process.argv.indexOf('--tools') + 1] !== 'Skill,Read,Glob,Grep') throw Error('strumenti non limitati')
  if (process.argv[process.argv.indexOf('--permission-prompts') + 1] !== 'none') throw Error('richieste interattive permesse')
  console.log(JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Skill', input: { skill: 'scrittura-italiana' } }] } }))
  const fail = process.argv.includes('fake-fail')
  console.log(JSON.stringify({ type: 'result', subtype: 'success', is_error: fail,
    api_error_status: fail ? 429 : undefined, result: fail ? 'session limit' : 'Testo corretto.',
    total_cost_usd: 0.01, num_turns: 2, usage: { input_tokens: 100, output_tokens: 3 },
    modelUsage: { 'claude-sonnet-5': {} } }))
}
`)
  chmodSync(fake, 0o755)
  const previous = process.env.CLAUDE_BIN
  const log = console.log, error = console.error
  console.log = console.error = () => {}
  process.env.CLAUDE_BIN = fake
  try {
    const args = ['--cases', cases, '--skill-src', source, '--hermetic']
    const result = main([...args, '--out', join(root, 'ok'), '--model', 'claude-sonnet-5'])
    assert.equal(result.failed, false)
    assert.equal(result.rows[0].output, 'Testo corretto.')
    assert.equal(result.rows[0].skillFired, true)
    assert.equal(result.rows[0].maxTurns, 6)
    assert.equal(readFileSync(join(result.outDir, 'skill/references/guida.md'), 'utf8'), 'riferimento originale')
    assert.equal(readFileSync(join(result.outDir, 'cases.json'), 'utf8'), readFileSync(cases, 'utf8'))
    const meta = JSON.parse(readFileSync(join(result.outDir, 'meta.json')))
    assert.deepEqual(meta.clientPolicy, CLIENT_POLICY)
    assert.equal(meta.skillFiles['references/guida.md'], createHash('sha256').update('riferimento originale').digest('hex'))
    assert.match(readFileSync(join(result.outDir, result.rows[0].transcriptFile), 'utf8'), /Testo corretto/)
    const failed = main([...args, '--out', join(root, 'fail'), '--model', 'fake-fail'])
    assert.equal(failed.failed, true)
    assert.match(failed.aborted, /limite/)
    assert.throws(() => main([...args, '--ids', '999', '--out', join(root, 'invalid')]), /id assenti/)
    assert.throws(() => main([...args, '--max-turns', 'NaN', '--out', join(root, 'invalid-turns')]), /intero positivo/)
  } finally {
    if (previous === undefined) delete process.env.CLAUDE_BIN
    else process.env.CLAUDE_BIN = previous
    console.log = log; console.error = error
    rmSync(root, { recursive: true, force: true })
  }
})

test('il solo tool Skill non viene attribuito alla candidata fuori dalla modalità ermetica', () => {
  const row = analyzeEvents([toolEvent(skill)], { workDir: '/tmp/work', realWorkDir: '/private/tmp/work' })
  assert.equal(row.skillInvoked, true)
  assert.equal(row.skillFired, false)
  assert.equal(row.activationAttribution, 'ambiguous')
})

test('una lettura nella workdir prova la candidata e alimenta il routing', () => {
  const row = analyzeEvents([
    toolEvent(skill, read('/private/tmp/work/.claude/skills/scrittura-italiana/references/saggio.md')),
  ], { workDir: '/tmp/work', realWorkDir: '/private/tmp/work' })
  assert.equal(row.skillFired, true)
  assert.equal(row.activationAttribution, 'project-read')
  assert.deepEqual(row.referenceReads, ['saggio'])
  assert.equal(row.personalCopyReads.length, 0)
})

test('la copia personale è contaminazione, non attivazione della candidata', () => {
  const row = analyzeEvents([
    toolEvent(skill, read('/Users/me/.claude/skills/scrittura-italiana/SKILL.md')),
  ], { workDir: '/tmp/work' })
  assert.equal(row.skillFired, false)
  assert.equal(row.activationAttribution, 'personal-read')
  assert.equal(row.personalCopyReads.length, 1)
})

test('in modalità ermetica il tool Skill è attribuibile alla skill di progetto', () => {
  const row = analyzeEvents([toolEvent(skill)], { workDir: '/tmp/work', hermetic: true })
  assert.equal(row.skillFired, true)
  assert.equal(row.activationAttribution, 'project-hermetic')
})

test('il confronto di path rispetta i confini di directory', () => {
  const row = analyzeEvents([
    toolEvent(read('/tmp/work-other/.claude/skills/scrittura-italiana/SKILL.md')),
  ], { workDir: '/tmp/work' })
  assert.equal(row.skillFired, false)
  assert.equal(row.personalCopyReads.length, 1)
})

test('omonima personale assente e verificata: invocazione senza path attribuita alla candidata', () => {
  const row = analyzeEvents([toolEvent(skill)], { workDir: '/tmp/work', personalCopyAbsent: true })
  assert.equal(row.skillFired, true)
  assert.equal(row.activationAttribution, 'project-isolated')
  // senza la prova di assenza, la stessa invocazione resta ambigua
  const ambiguo = analyzeEvents([toolEvent(skill)], { workDir: '/tmp/work' })
  assert.equal(ambiguo.skillFired, false)
  assert.equal(ambiguo.activationAttribution, 'ambiguous')
  // una lettura personale osservata vince sulla prova di assenza (evidenza > assunzione)
  const smentita = analyzeEvents([
    toolEvent(skill, read('/Users/me/.claude/skills/scrittura-italiana/SKILL.md')),
  ], { workDir: '/tmp/work', personalCopyAbsent: true })
  assert.equal(smentita.skillFired, false)
  assert.equal(smentita.activationAttribution, 'personal-read')
})
