import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { loadArm, main } from './stability.mjs'

function writeArm(root, name, { noSkill = false, rows, ids, runs, suiteSha }) {
  const dir = join(root, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'meta.json'), JSON.stringify({
    editorModel: 'fake-editor', judgeModel: 'fake-judge',
    skill: noSkill ? { noSkill: true } : { sha256: 'a'.repeat(64) },
    ...(ids ? { ids } : {}),
    ...(runs ? { runs } : {}),
    ...(suiteSha ? { suite: { sha256: suiteSha } } : {}),
  }))
  writeFileSync(join(dir, 'results.jsonl'), rows.map(r => JSON.stringify(r)).join('\n') + '\n')
  return dir
}

function row(id, run, pass, { invented = 0, name = `caso-${id}` } = {}) {
  return { id, name, target: 'minimal', split: 'dev', run, verdict: { pass, invented } }
}

test('loadArm: totali per run, flip e unanimi', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const dir = writeArm(root, 'A', {
      rows: [
        row(1, 1, true), row(1, 2, true), row(1, 3, true),    // unanime pass
        row(2, 1, false), row(2, 2, false), row(2, 3, false), // unanime fail
        row(3, 1, true), row(3, 2, false), row(3, 3, true),   // flip 2/3
        row(4, 1, null), row(4, 2, true), row(4, 3, true),    // errore: mai pass implicito
      ],
    })
    const a = loadArm(dir)
    assert.equal(a.runs, 3)
    assert.deepEqual(a.passTotals, [2, 2, 3])
    assert.equal(a.unanimousPass, 1)
    assert.equal(a.unanimousFail, 1)
    assert.deepEqual(a.flips.map(([id]) => id), [3], 'un errore non è un verdetto: il caso 4 non è un flip')
    assert.deepEqual(a.errored.map(([id]) => id), [4])
    assert.equal(a.totals.reduce((s, g) => s + g.err, 0), 1)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('main: delta fra bracci con gli stessi casi, e divergenze unanimi', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const A = writeArm(root, 'A', {
      rows: [row(1, 1, true), row(1, 2, true), row(2, 1, true), row(2, 2, true)],
    })
    const B = writeArm(root, 'B', {
      noSkill: true,
      rows: [row(1, 1, false, { invented: 2 }), row(1, 2, false, { invented: 1 }), row(2, 1, true), row(2, 2, true)],
    })
    const out = main([A, B])
    assert.match(out, /pass per run: 2\/2 validi · 2\/2 validi/)
    assert.match(out, /media 2\.0, intervallo 2–2/)
    assert.match(out, /senza skill/)
    assert.match(out, /medie: 2\.0 − 1\.0 = \*\*1\.0\*\*/)
    assert.match(out, /invenzioni totali: 0 vs 3/)
    assert.match(out, /esito unanime opposto nei due bracci: 1 \(#1\)/)
    assert.doesNotMatch(out, /non è un confronto valido/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('main: casi diversi fra i bracci → delta marcato non valido', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const A = writeArm(root, 'A', { rows: [row(1, 1, true)] })
    const B = writeArm(root, 'B', { rows: [row(9, 1, true)] })
    const out = main([A, B])
    assert.match(out, /confronto NON valido/)
    assert.doesNotMatch(out, /medie:/, 'un confronto invalido non produce numeri')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('braccio fuso da più directory: override per caso intero, meta omogenei obbligatori', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const A1 = writeArm(root, 'A1', {
      ids: [1, 2], runs: 1, suiteSha: 's1',
      rows: [row(1, 1, true), row(2, 1, null)],
    })
    const A2 = writeArm(root, 'A2', {
      ids: [2, 3], runs: 1, suiteSha: 's1',
      rows: [row(2, 1, true), row(3, 1, true)],
    })
    const out = main([`${A1},${A2}`])
    assert.match(out, /braccio fuso da 2 directory/)
    assert.match(out, /pass per run: 3\/3 validi/, 'il caso rimisurato nel supplemento sostituisce quello in errore')
    const A3 = writeArm(root, 'A3', { ids: [4], runs: 1, suiteSha: 's2', rows: [row(4, 1, true)] })
    assert.throws(() => main([`${A1},${A3}`]), /fusione non omogenea/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('fusione per caso intero: niente casi-chimera fra sessioni diverse', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    // Nel principale il caso 7 ha run1 in errore e run2 pass; il supplemento lo
    // rimisura per intero con due fail. Il caso deve venire TUTTO dal supplemento:
    // fail unanime, zero flip — non un ibrido pass/fail fra due sessioni.
    const A1 = writeArm(root, 'A1', {
      ids: [7], runs: 2, suiteSha: 's1',
      rows: [row(7, 1, null), row(7, 2, true)],
    })
    const A2 = writeArm(root, 'A2', {
      ids: [7], runs: 2, suiteSha: 's1',
      rows: [row(7, 1, false), row(7, 2, false)],
    })
    const out = main([`${A1},${A2}`])
    assert.match(out, /casi unanimi: 0 pass, 1 fail/)
    assert.match(out, /casi instabili \(flip\): 0\/1/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('righe attese ma assenti → media marcata non affidabile', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const A = writeArm(root, 'A', {
      ids: [1, 2], runs: 2,
      rows: [row(1, 1, true), row(1, 2, true), row(2, 1, true)],
    })
    const out = main([A])
    assert.match(out, /righe attese ma assenti \(run interrotti\): 1/)
    assert.match(out, /non affidabili/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('suite con fingerprint diversi fra i bracci → delta non valido; terzo argomento rifiutato', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const A = writeArm(root, 'A', { ids: [1], runs: 1, suiteSha: 's1', rows: [row(1, 1, true)] })
    const B = writeArm(root, 'B', { ids: [1], runs: 1, suiteSha: 's2', rows: [row(1, 1, true)], noSkill: true })
    const out = main([A, B])
    assert.match(out, /confronto NON valido.*fingerprint diversi/)
    assert.doesNotMatch(out, /medie:/)
    assert.throws(() => main([A, B, A]), /troppi argomenti/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
