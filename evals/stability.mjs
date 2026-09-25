#!/usr/bin/env node
// stability.mjs — Digest di stabilità per run multipli della suite (evals/run.mjs --runs N).
//
// Legge una o due directory di risultati (results.jsonl con una riga per caso×run) e produce
// un riepilogo: totali per run, media e intervallo, flip-rate per caso (verdetti non unanimi),
// invenzioni per run. Con due directory stampa anche il confronto (delta fra le medie); se i
// bracci non sono omogenei per casi, fingerprint, run e modelli RISOLTI, il delta
// viene marcato come non valido e non viene stampato alcun numero di confronto.
//
// Un braccio può essere la FUSIONE dichiarata di più directory (separate da virgola): serve
// per i run spezzati dal limite di sessione e completati in un blocco supplementare (es.
// stabilita-base-nuda + stabilita-base-nuda-suppl). La fusione pretende meta omogenei
// (stessi modelli, stessa skill, stessa suite) e avviene PER CASO: un caso presente in una
// directory successiva la sostituisce per intero — mai spezzare i run di uno stesso caso
// fra sessioni diverse, perché il flip va misurato in condizioni omogenee. Dentro una
// singola directory (--resume) la deduplica è per (caso, run), prima riga valida vince.
// Se i meta dichiarano i casi attesi (ids × runs), le righe assenti vengono conteggiate e
// la media marcata come non affidabile.
//
// Uso:
//   node evals/stability.mjs <dir-braccio-A[,dir-A2,...]> [dir-braccio-B[,...]]
//   node evals/stability.mjs evals/results/reference-2.15.1/stabilita-completa \
//                            evals/results/reference-2.15.1/stabilita-base-nuda,evals/results/reference-2.15.1/stabilita-base-nuda-suppl
//
// Nessuna chiamata LLM: analisi deterministica degli artefatti persistiti.

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { dedupeRows, requestedModelMismatch, resolvedPrimaryModels } from './run.mjs'

// I rejudge persistono i metadati dell'editor sotto `source`: normalizzarli evita
// etichette `undefined`, baseline scambiate per skill e confronti senza fingerprint.
export function normalizeMeta(raw) {
  const source = raw?.kind === 'rejudge' ? (raw.source ?? {}) : (raw ?? {})
  return {
    ...raw,
    editorModel: source.editorModel ?? null,
    judgeModel: raw?.kind === 'rejudge' ? (raw.judgeModel ?? null) : (source.judgeModel ?? null),
    skill: source.skill ?? null,
    suite: source.suite ?? null,
    manifest: source.manifest ?? null,
    runs: source.runs ?? raw?.runs ?? null,
    splitFilter: source.splitFilter ?? raw?.splitFilter ?? null,
    ids: source.ids ?? raw?.ids ?? null,
  }
}

export function loadArm(dirOrDirs) {
  const dirs = Array.isArray(dirOrDirs) ? dirOrDirs : String(dirOrDirs).split(',').filter(Boolean)
  const rawMetas = dirs.map(d => JSON.parse(readFileSync(join(d, 'meta.json'), 'utf8')))
  const metas = rawMetas.map(normalizeMeta)
  const meta = metas[0]
  if (metas.length > 1) {
    for (const [i, m] of metas.entries()) {
      const diffs = []
      if (m.editorModel !== meta.editorModel) diffs.push('editor model')
      if (m.judgeModel !== meta.judgeModel) diffs.push('judge model')
      if (!m.judgePolicy?.sha256 || !meta.judgePolicy?.sha256 || m.judgePolicy.sha256 !== meta.judgePolicy.sha256) diffs.push('judge policy diversa o assente')
      if ((m.skill?.sha256 ?? null) !== (meta.skill?.sha256 ?? null)) diffs.push('skill')
      if (m.suite?.sha256 && meta.suite?.sha256 && m.suite.sha256 !== meta.suite.sha256) diffs.push('suite')
      if (m.manifest?.sha256 && meta.manifest?.sha256 && m.manifest.sha256 !== meta.manifest.sha256) diffs.push('manifest')
      if (m.runs !== meta.runs) diffs.push('runs')
      if (m.splitFilter !== meta.splitFilter) diffs.push('split')
      if (diffs.length) throw new Error(`fusione non omogenea (${dirs[i]}): differisce per ${diffs.join(', ')}`)
    }
  }
  // Dentro ogni directory: dedup per (caso, run) — gestisce i --resume in place.
  // Fra directory: override per CASO — il blocco supplementare rimpiazza il caso intero.
  const mergedByCase = new Map()
  for (const [index, d] of dirs.entries()) {
    const dirRows = dedupeRows(
      readFileSync(join(d, 'results.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)))
    if (dirs.length > 1 && dirRows.some(r => r.judgePolicy?.sha256 !== metas[index].judgePolicy?.sha256)) {
      throw new Error(`fusione non omogenea (${d}): judge policy delle righe diversa dai metadati o assente`)
    }
    for (const id of new Set(dirRows.map(r => r.id))) {
      mergedByCase.set(id, dirRows.filter(r => r.id === id))
    }
  }
  const rows = [...mergedByCase.values()].flat()
  if (!rows.length) throw new Error(`nessuna riga in ${dirs.join(',')}`)
  // Righe attese ma assenti (run interrotti): dichiarate, mai inventate.
  const expected = new Set(metas.flatMap(m =>
    Array.isArray(m.ids) && Number.isInteger(m.runs)
      ? m.ids.flatMap(id => Array.from({ length: m.runs }, (_, i) => `${id}:${i + 1}`))
      : []))
  const present = new Set(rows.map(r => `${r.id}:${r.run}`))
  const missing = [...expected].filter(k => !present.has(k)).sort()
  const runs = Math.max(...rows.map(r => r.run))
  const byRun = new Map()
  const byCase = new Map()
  for (const r of rows) {
    if (!byRun.has(r.run)) byRun.set(r.run, { pass: 0, fail: 0, err: 0, invented: 0 })
    const g = byRun.get(r.run)
    if (r.verdict.pass === null) g.err++
    else if (r.verdict.pass) g.pass++
    else g.fail++
    g.invented += r.verdict.invented || 0
    if (!byCase.has(r.id)) byCase.set(r.id, { name: r.name, target: r.target, pass: 0, fail: 0, err: 0, n: 0 })
    const c = byCase.get(r.id)
    c.n++
    if (r.verdict.pass === true) c.pass++
    else if (r.verdict.pass === null) c.err++
    else c.fail++
  }
  const totals = [...byRun.entries()].sort((a, b) => a[0] - b[0]).map(([, g]) => g)
  const passTotals = totals.map(g => g.pass)
  const mean = passTotals.reduce((s, x) => s + x, 0) / passTotals.length
  const cases = [...byCase.entries()].sort((a, b) => a[0] - b[0])
  const unanimousPass = cases.filter(([, c]) => c.pass === c.n).length
  const unanimousFail = cases.filter(([, c]) => c.fail === c.n).length
  // flip = verdetti contraddittori (pass e fail veri); gli errori non sono verdetti
  const flips = cases.filter(([, c]) => c.pass > 0 && c.fail > 0)
  const errored = cases.filter(([, c]) => c.err > 0)
  return { dir: dirs.join(','), dirs, meta, metas, rawMetas, rows, missing, runs, totals, passTotals, mean, cases, unanimousPass, unanimousFail, flips, errored }
}

function sameArray(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i])
}

// Un delta è pubblicabile solo se ogni unità sperimentale è davvero appaiata.
// Restituisce tutte le cause, deduplicate, così il report spiega senza produrre
// una cifra che possa essere citata fuori contesto.
export function comparisonReasons(A, B) {
  const reasons = new Set()
  const add = x => reasons.add(x)
  const idsA = new Set(A.cases.map(([id]) => id))
  const idsB = new Set(B.cases.map(([id]) => id))
  if (idsA.size !== idsB.size || [...idsA].some(id => !idsB.has(id))) add('i due bracci non coprono gli stessi casi')

  for (const [label, a, b] of [
    ['editor richiesto', A.meta.editorModel, B.meta.editorModel],
    ['giudice richiesto', A.meta.judgeModel, B.meta.judgeModel],
    ['numero di run', A.meta.runs, B.meta.runs],
    ['split', A.meta.splitFilter, B.meta.splitFilter],
  ]) {
    if (a !== b) add(`${label} diverso fra i bracci`)
  }
  for (const [label, a, b] of [
    ['suite', A.meta.suite?.sha256, B.meta.suite?.sha256],
    ['manifest', A.meta.manifest?.sha256, B.meta.manifest?.sha256],
    ['judge policy', A.meta.judgePolicy?.sha256, B.meta.judgePolicy?.sha256],
  ]) {
    if (!a || !b) add(`fingerprint ${label} assente`)
    else if (a !== b) add(`fingerprint ${label} diverso`)
  }
  if (A.missing.length || B.missing.length) add('almeno un braccio ha righe attese ma assenti')
  if (A.errored.length || B.errored.length) add('almeno un braccio contiene verdetti in errore')
  for (const arm of [A, B]) {
    if (arm.rows.some(r => !r.judgePolicy?.sha256 || r.judgePolicy.sha256 !== arm.meta.judgePolicy?.sha256)) {
      add('judge policy delle righe diversa dai metadati o assente')
    }
  }

  const rowsA = new Map(A.rows.map(r => [`${r.id}:${r.run}`, r]))
  const rowsB = new Map(B.rows.map(r => [`${r.id}:${r.run}`, r]))
  if (rowsA.size !== rowsB.size || [...rowsA.keys()].some(k => !rowsB.has(k))) add('le coppie caso×run non coincidono')

  for (const [key, a] of rowsA) {
    const b = rowsB.get(key)
    if (!b) continue
    if (a.target !== b.target || a.split !== b.split) add(`target o split diverso su ${key}`)

    const editorA = resolvedPrimaryModels(a.editorModels, A.meta.editorModel)
    const editorB = resolvedPrimaryModels(b.editorModels, B.meta.editorModel)
    const judgeA = resolvedPrimaryModels(a.judgeModels, A.meta.judgeModel)
    const judgeB = resolvedPrimaryModels(b.judgeModels, B.meta.judgeModel)
    if (a.editorModelMismatch || b.editorModelMismatch ||
        requestedModelMismatch(A.meta.editorModel, a.editorModels) ||
        requestedModelMismatch(B.meta.editorModel, b.editorModels)) {
      add(`modello editor richiesto ≠ risolto su ${key}`)
    }
    if (a.judgeModelMismatch || b.judgeModelMismatch ||
        requestedModelMismatch(A.meta.judgeModel, a.judgeModels) ||
        requestedModelMismatch(B.meta.judgeModel, b.judgeModels)) {
      add(`modello giudice richiesto ≠ risolto su ${key}`)
    }
    if (!editorA.length || !editorB.length) add(`modello editor risolto assente su ${key}`)
    else if (!sameArray(editorA, editorB)) add(`modello editor risolto diverso su ${key}`)
    if (!judgeA.length || !judgeB.length) add(`modello giudice risolto assente su ${key}`)
    else if (!sameArray(judgeA, judgeB)) add(`modello giudice risolto diverso su ${key}`)
  }
  return [...reasons]
}

function fmtArm(a, label) {
  const L = []
  const nCases = a.cases.length
  L.push(`## ${label} — ${a.meta.skill?.noSkill ? 'senza skill' : `skill sha256=${(a.meta.skill?.sha256 || '').slice(0, 8)}…`}`)
  L.push('')
  L.push(`- run: ${a.runs} × ${nCases} casi · editor \`${a.meta.editorModel}\` · giudice \`${a.meta.judgeModel}\``)
  if (a.dirs.length > 1) L.push(`- braccio fuso da ${a.dirs.length} directory (dichiarato): ${a.dirs.join(' + ')}`)
  const errTot = a.totals.reduce((s, g) => s + g.err, 0)
  const perRun = a.totals.map(g => `${g.pass}/${g.pass + g.fail} validi${g.err ? ` (+${g.err} err)` : ''}`)
  if (errTot || a.missing.length) {
    L.push(`- pass per run: ${perRun.join(' · ')} → ⚠ **run incompleti: media e intervallo non affidabili**`)
  } else {
    L.push(`- pass per run: ${perRun.join(' · ')} → **media ${a.mean.toFixed(1)}, intervallo ${Math.min(...a.passTotals)}–${Math.max(...a.passTotals)}**`)
  }
  L.push(`- invenzioni per run: ${a.totals.map(g => g.invented).join(' · ')}`)
  if (errTot) L.push(`- ⚠ errori (esclusi dai pass, mai convertiti in successo): ${errTot}, nei casi ${a.errored.map(([id]) => '#' + id).join(', ')}`)
  if (a.missing.length) L.push(`- ⚠ righe attese ma assenti (run interrotti): ${a.missing.length} — ${a.missing.slice(0, 12).map(k => '#' + k.replace(':', ' run')).join(', ')}${a.missing.length > 12 ? ', …' : ''}`)
  L.push(`- casi unanimi: ${a.unanimousPass} pass, ${a.unanimousFail} fail · **casi instabili (flip): ${a.flips.length}/${nCases}**`)
  if (a.flips.length) {
    L.push(`- flip: ${a.flips.map(([id, c]) => `#${id} ${c.name} (${c.pass}/${c.n})`).join(' · ')}`)
  }
  return L.join('\n')
}

export function main(argv = process.argv.slice(2)) {
  const [dirA, dirB] = argv
  if (!dirA) throw new Error('uso: node evals/stability.mjs <dir-A[,dir-A2,...]> [dir-B[,...]]')
  if (argv.length > 2) throw new Error('troppi argomenti: al più due bracci (per fondere un supplemento usa le virgole, senza spazi)')
  const L = []
  const A = loadArm(dirA)
  L.push(fmtArm(A, 'Braccio A'))
  if (dirB) {
    const B = loadArm(dirB)
    L.push('')
    L.push(fmtArm(B, 'Braccio B'))
    L.push('')
    L.push('## Delta (A − B)')
    L.push('')
    // Un confronto invalido non produce numeri: solo la diagnosi del perché.
    const invalidReasons = comparisonReasons(A, B)
    if (invalidReasons.length) {
      L.push(`⚠ **confronto NON valido — nessun delta calcolato:** ${invalidReasons.join('; ')}.`)
    } else {
      L.push(`- medie: ${A.mean.toFixed(1)} − ${B.mean.toFixed(1)} = **${(A.mean - B.mean).toFixed(1)}**`)
      const deltas = A.passTotals.flatMap(a => B.passTotals.map(b => a - b))
      L.push(`- intervallo su tutte le coppie di run (${deltas.length}): ${Math.min(...deltas)}–${Math.max(...deltas)}`)
      const invA = A.totals.reduce((s, g) => s + g.invented, 0)
      const invB = B.totals.reduce((s, g) => s + g.invented, 0)
      L.push(`- invenzioni totali: ${invA} vs ${invB}`)
      const divergent = A.cases.filter(([id, c]) => {
        const found = B.cases.find(([id2]) => id2 === id)
        if (!found) return false
        const [, cb] = found
        return (c.pass === c.n && cb.pass === 0) || (c.pass === 0 && cb.pass === cb.n)
      })
      L.push(`- casi con esito unanime opposto nei due bracci: ${divergent.length}${divergent.length ? ` (${divergent.map(([id]) => '#' + id).join(', ')})` : ''}`)
    }
  }
  return L.join('\n')
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    console.log(main())
  } catch (err) {
    console.error(`errore: ${err.message}`)
    process.exit(1)
  }
}
