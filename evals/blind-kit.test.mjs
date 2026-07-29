import test from 'node:test'
import assert from 'node:assert/strict'

import { parseAnswers, rng } from './blind-kit.mjs'

const KEY = { 1: 1, 2: 2, 3: 1 }
const HEADER = 'lettore,coppia,migliore,umana'

test('parseAnswers accetta un CSV completo e coerente', () => {
  const { reader, rows } = parseAnswers(`${HEADER}\nanna,1,1,1\nanna,2,pari,\nanna,3,2,nonso\n`, KEY, 'r.csv')
  assert.equal(reader, 'anna')
  assert.equal(rows.length, 3)
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
