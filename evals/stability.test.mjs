import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { loadArm, main, normalizeMeta } from './stability.mjs'
import { JUDGE_POLICY } from './run.mjs'

function writeArm(root, name, {
  noSkill = false,
  rows,
  ids = [...new Set(rows.map(r => r.id))],
  runs = Math.max(...rows.map(r => r.run)),
  suiteSha = 's1',
  manifestSha = 'm1',
  editorModel = 'fake-editor',
  judgeModel = 'fake-judge',
  judgePolicy = JUDGE_POLICY,
}) {
  const dir = join(root, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'meta.json'), JSON.stringify({
    editorModel, judgeModel, judgePolicy, splitFilter: 'all',
    skill: noSkill ? { noSkill: true } : { sha256: 'a'.repeat(64) },
    ids, runs,
    suite: { sha256: suiteSha },
    manifest: { sha256: manifestSha },
  }))
  writeFileSync(join(dir, 'results.jsonl'), rows.map(r => JSON.stringify(r)).join('\n') + '\n')
  return dir
}

function row(id, run, pass, {
  invented = 0,
  name = `caso-${id}`,
  editorModels = ['fake-editor-resolved'],
  judgeModels = ['fake-judge-resolved'],
  editorModelMismatch = false,
  judgeModelMismatch = false,
} = {}) {
  return { id, name, target: 'minimal', split: 'dev', run, editorModels, judgeModels, judgePolicy: JUDGE_POLICY, editorModelMismatch, judgeModelMismatch, verdict: { pass, invented } }
}

test('policy diverse, ignote o incoerenti nelle righe impediscono confronti e fusioni', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-policy-test-'))
  try {
    const A = writeArm(root, 'A', { rows: [row(1, 1, true)] })
    for (const [name, judgePolicy] of [['old', { sha256: 'old' }], ['unknown', null]]) {
      const B = writeArm(root, name, { rows: [row(1, 1, true)], judgePolicy })
      assert.match(main([A, B]), /confronto NON valido.*judge policy/)
      assert.throws(() => loadArm([A, B]), /judge policy/)
    }
    const badRow = { ...row(1, 1, true), judgePolicy: { sha256: 'other' } }
    const C = writeArm(root, 'row-mismatch', { rows: [badRow] })
    assert.match(main([A, C]), /judge policy delle righe/)
    assert.throws(() => loadArm([A, C]), /judge policy delle righe/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('normalizeMeta legge correttamente un rejudge', () => {
  const meta = normalizeMeta({
    kind: 'rejudge', judgeModel: 'judge-2',
    source: {
      editorModel: 'editor-1', skill: { noSkill: true }, suite: { sha256: 's' },
      manifest: { sha256: 'm' }, runs: 3, splitFilter: 'all', ids: [1],
    },
  })
  assert.equal(meta.editorModel, 'editor-1')
  assert.equal(meta.judgeModel, 'judge-2')
  assert.equal(meta.skill.noSkill, true)
  assert.equal(meta.manifest.sha256, 'm')
  assert.equal(meta.runs, 3)
})

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
    assert.doesNotMatch(out, /confronto NON valido/)
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
    assert.match(out, /confronto NON valido.*fingerprint suite diverso/)
    assert.doesNotMatch(out, /medie:/)
    assert.throws(() => main([A, B, A]), /troppi argomenti/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('modelli risolti diversi o fallback del modello pinnato → nessun delta', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const A = writeArm(root, 'A', {
      editorModel: 'claude-fable-5',
      rows: [row(1, 1, true, { editorModels: ['claude-fable-5'] })],
    })
    const B = writeArm(root, 'B', {
      noSkill: true,
      editorModel: 'claude-fable-5',
      rows: [row(1, 1, true, { editorModels: ['claude-opus-5'] })],
    })
    const out = main([A, B])
    assert.match(out, /confronto NON valido/)
    assert.match(out, /modello editor richiesto ≠ risolto|modello editor risolto diverso/)
    assert.doesNotMatch(out, /medie:/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('fallback identico del giudice pinnato → nessun delta comunque', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const opts = {
      judgeModel: 'claude-opus-4-8',
      rows: [row(1, 1, true, { judgeModels: ['claude-opus-5'] })],
    }
    const A = writeArm(root, 'A', opts)
    const B = writeArm(root, 'B', { ...opts, noSkill: true })
    const out = main([A, B])
    assert.match(out, /modello giudice richiesto ≠ risolto/)
    assert.doesNotMatch(out, /medie:/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('run incompleto o in errore → nessun delta', () => {
  const root = mkdtempSync(join(tmpdir(), 'stab-'))
  try {
    const A = writeArm(root, 'A', {
      ids: [1, 2], runs: 1,
      rows: [row(1, 1, true)],
    })
    const B = writeArm(root, 'B', {
      noSkill: true, ids: [1, 2], runs: 1,
      rows: [row(1, 1, true), row(2, 1, null)],
    })
    const out = main([A, B])
    assert.match(out, /confronto NON valido/)
    assert.match(out, /righe attese ma assenti|verdetti in errore/)
    assert.doesNotMatch(out, /medie:/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
