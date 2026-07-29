import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { main, parseAnswers, parseCsvLine, rng, validatePairModels } from './blind-kit.mjs'

const KEY = { 1: 1, 2: 2, 3: 1 }
const HEADER = 'lettore,coppia,migliore,umana'

test('parseAnswers accetta un CSV completo e coerente', () => {
  const { reader, rows } = parseAnswers(`${HEADER}\nanna,1,1,1\nanna,2,pari,\nanna,3,2,nonso\n`, KEY, 'r.csv')
  assert.equal(reader, 'anna')
  assert.equal(rows.length, 3)
})

test('parser CSV accetta virgole e virgolette nei nomi', () => {
  assert.deepEqual(parseCsvLine('"Rossi, Anna",1,2,"nonso"'), ['Rossi, Anna', '1', '2', 'nonso'])
  assert.deepEqual(parseCsvLine('"Anna ""Nina""",1,1,'), ['Anna "Nina"', '1', '1', ''])
  assert.throws(() => parseCsvLine('"Anna,1,1,'), /virgolette non chiuse/)
})

test('parità dei modelli risolti è obbligatoria per ogni coppia', () => {
  assert.deepEqual(
    validatePairModels('claude-sonnet-5', ['claude-haiku-4-5', 'claude-sonnet-5'], ['claude-sonnet-5']),
    { skillPrimary: ['claude-sonnet-5'], barePrimary: ['claude-sonnet-5'] },
  )
  assert.throws(() => validatePairModels('claude-sonnet-5', ['claude-opus-5'], ['claude-sonnet-5']), /invece di claude-sonnet-5/)
  assert.throws(() => validatePairModels('sonnet', ['claude-sonnet-5'], ['claude-opus-5']), /modelli risolti diversi/)
  assert.throws(() => validatePairModels('sonnet', [], ['claude-sonnet-5']), /modello risolto assente/)
})

test('parseAnswers è fail-closed su ogni difetto del CSV', () => {
  const cases = [
    ['intestazione', 'lettore;coppia;migliore;umana\nanna,1,1,1', /intestazione attesa/],
    ['NOME non sostituito', `${HEADER}\nNOME,1,1,1\nNOME,2,1,1\nNOME,3,1,1`, /sostituisci "NOME"/],
    ['coppia sconosciuta', `${HEADER}\nanna,9,1,1\nanna,2,1,1\nanna,3,1,1`, /coppia 9 sconosciuta/],
    ['coppia duplicata', `${HEADER}\nanna,1,1,1\nanna,1,2,1\nanna,2,1,1\nanna,3,1,1`, /risposta due volte/],
    ['valore migliore', `${HEADER}\nanna,1,3,1\nanna,2,1,1\nanna,3,1,1`, /"migliore" deve essere/],
    ['valore umana', `${HEADER}\nanna,1,1,boh\nanna,2,1,1\nanna,3,1,1`, /"umana" deve essere/],
    ['due lettori nello stesso file', `${HEADER}\nanna,1,1,1\nluca,2,1,1\nanna,3,1,1`, /un file per lettore/],
    ['coppia mancante', `${HEADER}\nanna,1,1,1\nanna,2,1,1`, /senza risposta: 3/],
    ['colonne mancanti', `${HEADER}\nanna,1,1\nanna,2,1,1\nanna,3,1,1`, /attese 4 colonne/],
  ]
  for (const [name, csv, re] of cases) {
    assert.throws(() => parseAnswers(csv, KEY, 'r.csv'), re, name)
  }
})

test('rng è deterministico a parità di seed', () => {
  const a = rng(42)
  const b = rng(42)
  const seqA = [a(), a(), a(), a()]
  const seqB = [b(), b(), b(), b()]
  assert.deepEqual(seqA, seqB)
  assert.notDeepEqual(seqA, [rng(7)(), rng(7)(), rng(7)(), rng(7)()])
  for (const x of seqA) assert.equal(x >= 0 && x < 1, true)
})

test('score richiede tre lettori unici e produce un aggregato solo su input completi', () => {
  const root = mkdtempSync(join(tmpdir(), 'blind-score-'))
  const kit = join(root, 'kit')
  mkdirSync(kit)
  writeFileSync(join(kit, 'coppie.json'), JSON.stringify({ pairs: [
    { n: 1, skillIs: 1 }, { n: 2, skillIs: 2 }, { n: 3, skillIs: 1 },
  ] }))
  const files = ['Anna', 'Luca', 'Marta'].map((reader, i) => {
    const file = join(root, `${reader}.csv`)
    writeFileSync(file, `${HEADER}\n${reader},1,1,1\n${reader},2,2,2\n${reader},3,${i === 2 ? 'pari' : '1'},1\n`)
    return file
  })
  const log = console.log
  console.log = () => {}
  try {
    assert.throws(() => main(['--score', kit, files[0]]), /almeno 3 lettori unici/)
    const scored = main(['--score', kit, ...files])
    assert.equal(scored.perReader.length, 3)
    assert.equal(scored.tot.skill, 8)
    assert.match(readFileSync(join(kit, 'esito.md'), 'utf8'), /Aggregato/)

    const duplicate = join(root, 'anna-2.csv')
    writeFileSync(duplicate, `${HEADER}\nanna,1,1,1\nanna,2,2,2\nanna,3,1,1\n`)
    assert.throws(() => main(['--score', kit, files[0], duplicate, files[1]]), /presente in più file/)
  } finally {
    console.log = log
    rmSync(root, { recursive: true, force: true })
  }
})
