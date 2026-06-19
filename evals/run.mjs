#!/usr/bin/env node
// Runner riproducibile per la suite di eval di scrittura-italiana.
//
// Per ogni eval in evals.json: inietta una versione della skill come system
// prompt (via `claude -p --append-system-prompt-file`), esegue il prompt,
// giudica l'output contro le sue `expectations`, e PERSISTE tutto
// (input, skill+SHA, modello, output, verdetto) sotto evals/results/.
//
// Riproducibilità: le chiamate LLM NON sono deterministiche. Qui
// "riproducibile" significa *artefatti persistiti + run multipli per stabilità*,
// non output byte-identici. Per un A/B vecchia-vs-nuova skill, lancia due volte
// con --skill diverso (es. una versione estratta da git) e --label diverso.
//
// Uso:
//   node evals/run.mjs                          # skill = SKILL.md (working tree), 1 run
//   node evals/run.mjs --skill /tmp/old.md --label baseline --model sonnet
//   node evals/run.mjs --ids 2,3,13 --runs 3 --judge-model sonnet
//   node evals/run.mjs --held-out 13            # marca alcuni id come held-out
//
// Flag: --skill <file> --label <s> --model <m> --judge-model <m> --runs <n>
//       --ids <csv> --held-out <csv> --out <dir>

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const safe = (fn, fb) => { try { return fn() } catch { return fb } }

const args = parseArgs(process.argv.slice(2))
const skillFile = resolve(args.skill ?? join(REPO, 'SKILL.md'))
const label = args.label ?? 'new'
const editorModel = args.model ?? 'sonnet'
const judgeModel = args['judge-model'] ?? editorModel
const runs = Number(args.runs ?? 1)
const onlyIds = args.ids ? new Set(args.ids.split(',').map(Number)) : null
const heldOut = new Set(String(args['held-out'] ?? '').split(',').filter(Boolean).map(Number))

if (!existsSync(skillFile)) { console.error(`skill non trovata: ${skillFile}`); process.exit(1) }
const suiteFile = resolve(args.suite ?? join(HERE, 'evals.json'))
const suite = JSON.parse(readFileSync(suiteFile, 'utf8'))
const manifest = existsSync(join(HERE, 'manifest.json')) ? JSON.parse(readFileSync(join(HERE, 'manifest.json'), 'utf8')) : { evals: [] }
const meta = Object.fromEntries((manifest.evals ?? []).map(m => [m.id, m]))

const sha = safe(() => execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim(), 'nogit')
const dirty = safe(() => execFileSync('git', ['status', '--porcelain'], { cwd: REPO, encoding: 'utf8' }).trim().length > 0, false)
const claudeVer = safe(() => execFileSync('claude', ['--version'], { encoding: 'utf8' }).trim(), '?')
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const outDir = resolve(args.out ?? join(HERE, 'results', `${stamp}__${label}`))
mkdirSync(outDir, { recursive: true })

const evals = suite.evals.filter(e => !onlyIds || onlyIds.has(e.id))
console.log(`skill=${skillFile} (${sha}${dirty ? '+dirty' : ''}) | editor=${editorModel} judge=${judgeModel} | ${evals.length} eval × ${runs} run\n`)

const rows = []
for (const e of evals) {
  const m = meta[e.id] ?? {}
  for (let run = 1; run <= runs; run++) {
    let output, verdict
    try {
      output = callClaude(e.prompt, ['--append-system-prompt-file', skillFile], editorModel)
      verdict = judge(e, output, m, judgeModel)
    } catch (err) {
      output = output ?? `[ERRORE EDITOR: ${err.message}]`
      verdict = { pass: null, invented: null, expectations: [], notes: `errore: ${err.message}` }
    }
    const row = { id: e.id, name: m.name, genre: m.genre, target: m.target, split: heldOut.has(e.id) ? 'held-out' : 'dev', run, output, verdict }
    rows.push(row)
    appendFileSync(join(outDir, 'results.jsonl'), JSON.stringify(row) + '\n')
    console.log(`#${String(e.id).padStart(2)} ${(m.name ?? '').padEnd(22)} run${run}: ${verdict.pass === null ? '????' : verdict.pass ? 'PASS' : 'FAIL'}${verdict.invented ? ` inv=${verdict.invented}` : ''}  ${verdict.notes ?? ''}`)
  }
}

const summary = aggregate(rows)
writeFileSync(join(outDir, 'meta.json'), JSON.stringify({ skillFile, label, sha, dirty, editorModel, judgeModel, runs, claudeVer, node: process.version, stamp, ids: evals.map(e => e.id) }, null, 2))
writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
const md = renderSummary(summary, { label, sha, dirty, editorModel, judgeModel, runs })
writeFileSync(join(outDir, 'summary.md'), md)
console.log('\n' + md + `\n→ artefatti: ${outDir}`)

// ---------- helpers ----------
function callClaude(prompt, extraFlags, model) {
  return execFileSync('claude', ['-p', ...extraFlags, '--model', model], {
    input: prompt, cwd: tmpdir(), encoding: 'utf8', timeout: 240000, maxBuffer: 16 * 1024 * 1024,
  }).trim()
}

function judge(e, output, m, model) {
  const jp = [
    'Sei un valutatore severo e imparziale di editing in italiano. Giudichi un OUTPUT contro ASPETTATIVE verificabili. Non sei indulgente: per un caso "preserve" qualunque modifica non necessaria è un difetto.',
    `TIPO: ${m.target ?? '?'} (preserve = non va toccato; improve = deve migliorare; mixed = entrambi).`,
    `PROMPT dato all'editor (contiene l'input fra """):\n"""${e.prompt}"""`,
    `OUTPUT prodotto dall'editor:\n"""${output}"""`,
    'IMPORTANTE: se l\'editor dichiara che non serve alcun intervento (es. «testo già corretto», «nessuna modifica necessaria») o commenta senza riprodurre il testo, considera l\'output IDENTICO all\'input. Per un caso "preserve" questo SODDISFA le aspettative di conservazione (zero modifiche = comportamento corretto). Giudica eventuali commenti/note dell\'editor come metadati, non come parte del testo revisionato.',
    'ASPETTATIVE (ognuna deve essere rispettata):\n' + e.expectations.map((x, i) => `${i + 1}. ${x}`).join('\n'),
    e.expected_output ? `Atteso (indicativo): ${e.expected_output}` : '',
    'Conta le INVENZIONI: entità, numeri, date, luoghi, fonti o conteggi presenti nell\'OUTPUT ma assenti dall\'input del prompt.',
    'Rispondi SOLO con un oggetto JSON su UNA riga, senza markdown:\n{"pass": true|false, "invented": <int>, "expectations": [true|false, ...], "notes": "<una frase>"}\n"pass" è true SOLO se tutte le aspettative sono true e invented=0 (salvo che un\'aspettativa ammetta esplicitamente un\'aggiunta).',
  ].filter(Boolean).join('\n\n')
  const raw = callClaude(jp, [], model)
  return parseVerdict(raw, e.expectations.length)
}

function parseVerdict(raw, nExp) {
  const m = raw.match(/\{[\s\S]*\}/)
  if (!m) return { pass: null, invented: null, expectations: [], notes: `verdetto non parsabile: ${raw.slice(0, 120)}` }
  try {
    const v = JSON.parse(m[0])
    return { pass: !!v.pass, invented: Number(v.invented ?? 0), expectations: Array.isArray(v.expectations) ? v.expectations : [], notes: String(v.notes ?? '').slice(0, 200) }
  } catch {
    return { pass: null, invented: null, expectations: [], notes: `JSON invalido: ${m[0].slice(0, 120)}` }
  }
}

function aggregate(rows) {
  const by = (key) => {
    const g = {}
    for (const r of rows) {
      const k = r[key] ?? '?'
      g[k] ??= { pass: 0, fail: 0, err: 0, invented: 0 }
      if (r.verdict.pass === null) g[k].err++
      else if (r.verdict.pass) g[k].pass++
      else g[k].fail++
      g[k].invented += r.verdict.invented || 0
    }
    return g
  }
  const total = rows.length
  const pass = rows.filter(r => r.verdict.pass === true).length
  const invented = rows.reduce((s, r) => s + (r.verdict.invented || 0), 0)
  // per-eval stabilità su più run
  const perEval = {}
  for (const r of rows) {
    perEval[r.id] ??= { name: r.name, target: r.target, pass: 0, n: 0 }
    perEval[r.id].n++
    if (r.verdict.pass === true) perEval[r.id].pass++
  }
  return { total, pass, passRate: total ? +(pass / total).toFixed(3) : 0, invented, byTarget: by('target'), bySplit: by('split'), perEval }
}

function renderSummary(s, h) {
  const L = []
  L.push(`# Esecuzione suite — ${h.label} (${h.sha}${h.dirty ? '+dirty' : ''})`)
  L.push(`editor=${h.editorModel} · judge=${h.judgeModel} · run/eval=${h.runs}`)
  L.push(`\n**Pass rate complessivo: ${s.pass}/${s.total} (${(s.passRate * 100).toFixed(0)}%) · invenzioni totali: ${s.invented}**\n`)
  L.push('| target | pass | fail | err | invenzioni |')
  L.push('|---|---|---|---|---|')
  for (const [k, v] of Object.entries(s.byTarget)) L.push(`| ${k} | ${v.pass} | ${v.fail} | ${v.err} | ${v.invented} |`)
  L.push('\n| id | nome | target | pass/run |')
  L.push('|---|---|---|---|')
  for (const [id, v] of Object.entries(s.perEval)) L.push(`| ${id} | ${v.name ?? ''} | ${v.target ?? ''} | ${v.pass}/${v.n} |`)
  return L.join('\n')
}

function parseArgs(argv) {
  const o = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      if (v !== undefined) o[k] = v
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) o[k] = argv[++i]
      else o[k] = true
    }
  }
  return o
}
