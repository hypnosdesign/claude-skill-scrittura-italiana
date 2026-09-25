import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { GPT_POLICY, referenceTool, referenceReply, verifyThread } from './codex-client.mjs'
import { prepare, validate } from './gpt-study.mjs'

test('GPT: letture ristrette ai riferimenti congelati, niente traversal o altri strumenti', () => {
  const refs = { 'references/a.md': 'Testo completo.' }, reads = []
  assert.deepEqual(referenceTool(refs).tools[0].inputSchema.properties.path.enum, ['references/a.md'])
  const p = { namespace: 'skill_reference', tool: 'read_reference', arguments: { path: 'references/a.md' } }
  assert.equal(referenceReply(p, refs, reads).contentItems[0].text, 'Testo completo.')
  assert.equal(reads[0].bytes, Buffer.byteLength('Testo completo.'))
  assert.match(reads[0].sha256, /^[a-f0-9]{64}$/)
  for (const path of ['../../segreto', '__proto__', 'references/assente.md']) {
    assert.throws(() => referenceReply({ ...p, arguments: { path } }, refs, []), /non consentita/)
  }
  assert.throws(() => referenceReply({ ...p, tool: 'exec' }, refs, []), /non consentita/)
  assert.throws(() => referenceReply(p, refs, Array(GPT_POLICY.maxReads).fill({})), /limite/)
})

test('GPT: modello e restrizioni devono essere confermati dal client', () => {
  const r = { model: 'gpt-6-sol', modelProvider: 'openai', approvalPolicy: 'never',
    sandbox: { type: 'readOnly' }, reasoningEffort: 'medium', instructionSources: [] }
  verifyThread(r, 'gpt-6-sol')
  for (const delta of [{ model: 'altro' }, { modelProvider: 'altro' }, { approvalPolicy: 'on-request' },
    { sandbox: { type: 'dangerFullAccess' } }, { reasoningEffort: 'high' }, { instructionSources: ['/sconosciuto'] }]) {
    assert.throws(() => verifyThread({ ...r, ...delta }, 'gpt-6-sol'), /non conformi/)
  }
})

test('GPT: snapshot, policy e split devono rimanere invariati', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-gpt-test-'))
  try {
    const dir = join(root, 'study'); prepare(dir)
    const original = validate(dir)
    assert.equal(original.plan.regressionIds.length, 14)
    assert.equal(original.plan.studyIds.length, 14)
    assert.deepEqual(original.plan.followupIds, [7,15,20,24,27,28,34,37,40,58,59,60,61,62,63,64,65,66])
    assert.deepEqual(original.plan.controlIds, [15,24,34,37,40])
    const control = join(root, 'control'); prepare(control, 'gpt-6-sol')
    assert.equal(validate(control).plan.editor, 'gpt-6-sol')
    assert.throws(() => prepare(join(root, 'invalid'), 'altro'), /non autorizzato/)
    assert.throws(() => prepare(join(root, 'heldout'), 'gpt-6-sol', [14]), /ID dev/)
    assert.throws(() => prepare(join(root, 'duplicate'), 'gpt-6-sol', [24,24]), /ID dev/)
    assert.equal(original.cases(58).target, 'mixed')
    assert.throws(() => original.cases(14), /non dev/)
    assert.throws(() => prepare(dir), /già esistente/)
    const file = join(dir, 'base.md'), before = readFileSync(file)
    writeFileSync(file, 'alterato')
    assert.throws(() => validate(dir), /snapshot alterato/)
    writeFileSync(file, before)
    const path = join(dir, 'plan.json'), p = JSON.parse(readFileSync(path))
    p.policy = { ...p.policy, effort: 'low' }; writeFileSync(path, JSON.stringify(p))
    assert.throws(() => validate(dir), /policy diversa/)
  } finally { rmSync(root, { recursive: true, force: true }) }
})
