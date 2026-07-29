import test from 'node:test'
import assert from 'node:assert/strict'

import { analyzeEvents } from './activation.mjs'

const toolEvent = (...content) => ({ message: { content } })
const skill = { type: 'tool_use', name: 'Skill', input: { skill: 'scrittura-italiana' } }
const read = file_path => ({ type: 'tool_use', name: 'Read', input: { file_path } })

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
