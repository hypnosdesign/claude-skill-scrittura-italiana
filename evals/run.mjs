#!/usr/bin/env node
// Runner riproducibile per la suite di eval di scrittura-italiana.
//
// Per ogni eval in evals.json: inietta una versione della skill come system
// prompt (via `claude -p --append-system-prompt-file`), esegue il prompt,
// giudica l'output contro le sue `expectations`, e persiste input, snapshot
// della skill e della suite, hash dei contenuti, output, transcript del giudice
// e tempi sotto evals/results/.
//
// Riproducibilità: le chiamate LLM NON sono deterministiche. Qui
// "riproducibile" significa *artefatti persistiti + run multipli per stabilità*,
// non output byte-identici. Per un A/B vecchia-vs-nuova skill, lancia due volte
// con --skill diverso (es. una versione estratta da git) e --label diverso.
//
// Uso:
//   node evals/run.mjs                          # single-file completo, split dev, 1 run
//   node evals/run.mjs --skill /tmp/old.md --label baseline --model sonnet
//   node evals/run.mjs --ids 2,3,13 --runs 3 --judge-model opus
//   node evals/run.mjs --split held-out
//   node evals/run.mjs --validate-only
//
// Flag: --skill <file> --label <s> --model <m> --judge-model <m> --runs <n>
//       --ids <csv> --split <dev|held-out|all> --suite <file> --manifest <file>
//       --out <dir> --validate-only

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const safe = (fn, fb) => { try { return fn() } catch { return fb } }

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)
  const skillFile = resolve(args.skill ?? join(REPO, 'scrittura-italiana-single-file.md'))
  const suiteFile = resolve(args.suite ?? join(HERE, 'evals.json'))
  const manifestFile = resolve(args.manifest ?? join(HERE, 'manifest.json'))
  const label = String(args.label ?? 'new')
  const editorModel = String(args.model ?? 'sonnet')
  const judgeModel = String(args['judge-model'] ?? 'opus')
  const runs = Number(args.runs ?? 1)
  const splitFilter = String(args.split ?? 'dev')
  const onlyIds = args.ids ? new Set(String(args.ids).split(',').map(Number)) : null
  const claudeBin = process.env.CLAUDE_BIN || 'claude'

  for (const [kind, file] of [['skill', skillFile], ['suite', suiteFile], ['manifest', manifestFile]]) {
    if (!existsSync(file)) throw new Error(`${kind} non trovato: ${file}`)
  }
  if (!Number.isInteger(runs) || runs < 1) throw new Error('--runs richiede un intero positivo')
  if (!['all', 'dev', 'held-out'].includes(splitFilter)) throw new Error('--split accetta dev, held-out o all')
  if (onlyIds && [...onlyIds].some(id => !Number.isInteger(id) || id < 1)) throw new Error('--ids richiede interi positivi separati da virgola')

  const skillText = readFileSync(skillFile, 'utf8')
  const suiteText = readFileSync(suiteFile, 'utf8')
  const manifestText = readFileSync(manifestFile, 'utf8')
  const suite = JSON.parse(suiteText)
  const manifest = JSON.parse(manifestText)
  validateSuite(suite, manifest)
  const meta = Object.fromEntries(manifest.evals.map(m => [m.id, m]))
  if (onlyIds) {
    const unknown = [...onlyIds].filter(id => !meta[id])
    if (unknown.length) throw new Error(`--ids contiene id assenti dalla suite: ${unknown.join(',')}`)
  }
  const fingerprints = {
    skill: sha256(skillText),
    suite: sha256(suiteText),
    manifest: sha256(manifestText),
  }

  const selected = suite.evals.filter(e => {
    const m = meta[e.id]
    return (!onlyIds || onlyIds.has(e.id)) && (splitFilter === 'all' || m.split === splitFilter)
  })
  if (selected.length === 0) throw new Error('nessun eval selezionato')

  const gitSha = safe(() => execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim(), 'nogit')
  const dirty = safe(() => execFileSync('git', ['status', '--porcelain'], { cwd: REPO, encoding: 'utf8' }).trim().length > 0, false)
  const claudeVer = safe(() => execFileSync(claudeBin, ['--version'], { encoding: 'utf8', env: claudeEnv() }).trim(), '?')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')

  console.log(`skill=${skillFile} sha256=${fingerprints.skill.slice(0, 12)} | git=${gitSha}${dirty ? '+dirty' : ''}`)
  console.log(`editor=${editorModel} judge=${judgeModel}${editorModel === judgeModel ? ' [ATTENZIONE: stesso modello]' : ''} | split=${splitFilter} | ${selected.length} eval × ${runs} run`)
  if (args['validate-only']) {
    console.log(`suite valida: ${suite.evals.length} eval; dev=${manifest.evals.filter(x => x.split === 'dev').length}; held-out=${manifest.evals.filter(x => x.split === 'held-out').length}`)
    return { validated: true, fingerprints, splitFilter, ids: selected.map(e => e.id) }
  }

  const outDir = resolve(args.out ?? join(HERE, 'results', `${stamp}__${label}`))
  if (existsSync(outDir)) throw new Error(`directory di output già esistente: ${outDir}`)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'skill.md'), skillText)
  writeFileSync(join(outDir, 'suite.json'), suiteText)
  writeFileSync(join(outDir, 'manifest.json'), manifestText)
  const runMeta = {
    schemaVersion: 2,
    label,
    stamp,
    argv,
    git: { sha: gitSha, dirty },
    skill: { source: skillFile, sha256: fingerprints.skill, bytes: Buffer.byteLength(skillText) },
    suite: { source: suiteFile, sha256: fingerprints.suite, bytes: Buffer.byteLength(suiteText) },
    manifest: { source: manifestFile, sha256: fingerprints.manifest, bytes: Buffer.byteLength(manifestText) },
    editorModel,
    judgeModel,
    sameModel: editorModel === judgeModel,
    runs,
    splitFilter,
    claudeVer,
    node: process.version,
    ids: selected.map(e => e.id),
  }
  writeFileSync(join(outDir, 'meta.json'), JSON.stringify(runMeta, null, 2))

  const rows = []
  for (const e of selected) {
    const m = meta[e.id]
    for (let run = 1; run <= runs; run++) {
      let output = null
      let editorDurationMs = null
      let judged = null
      try {
        const edited = callClaude(e.prompt, ['--append-system-prompt-file', skillFile], editorModel)
        output = edited.text
        editorDurationMs = edited.durationMs
        judged = judge(e, output, m, judgeModel)
      } catch (err) {
        const message = formatExecError(err)
        output ??= `[ERRORE EDITOR: ${message}]`
        judged = {
          verdict: { pass: null, invented: null, expectations: [], notes: `errore: ${message}`.slice(0, 300) },
          prompt: null,
          raw: null,
          durationMs: null,
        }
      }
      const row = {
        id: e.id,
        name: m.name,
        genre: m.genre,
        target: m.target,
        split: m.split,
        run,
        prompt: e.prompt,
        expectations: e.expectations,
        expectedOutput: e.expected_output ?? null,
        output,
        editorDurationMs,
        judgeDurationMs: judged.durationMs,
        judgePrompt: judged.prompt,
        judgeRaw: judged.raw,
        verdict: judged.verdict,
      }
      rows.push(row)
      appendFileSync(join(outDir, 'results.jsonl'), JSON.stringify(row) + '\n')
      const v = judged.verdict
      console.log(`#${String(e.id).padStart(2)} ${m.name.padEnd(26)} run${run}: ${v.pass === null ? 'ERR' : v.pass ? 'PASS' : 'FAIL'}${v.invented ? ` inv=${v.invented}` : ''}  ${v.notes ?? ''}`)
    }
  }

  const summary = aggregate(rows)
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
  const md = renderSummary(summary, runMeta)
  writeFileSync(join(outDir, 'summary.md'), md)
  console.log('\n' + md + `\n→ artefatti: ${outDir}`)
  return { outDir, summary, meta: runMeta }
}

// ---------- helpers ----------
function callClaude(prompt, extraFlags, model) {
  const started = process.hrtime.bigint()
  const text = execFileSync(process.env.CLAUDE_BIN || 'claude', ['-p', ...extraFlags, '--model', model], {
    input: prompt,
    cwd: tmpdir(),
    env: claudeEnv(),
    encoding: 'utf8',
    timeout: 240000,
    maxBuffer: 16 * 1024 * 1024,
  }).trim()
  return { text, durationMs: elapsedMs(started) }
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
    'Rispondi SOLO con un oggetto JSON su UNA riga, senza markdown:\n{"pass": true|false, "invented": <int>, "expectations": [true|false, ...], "notes": "<una frase>"}\n"pass" è true SOLO se tutte le aspettative sono true e invented=0.',
  ].filter(Boolean).join('\n\n')
  try {
    const judged = callClaude(jp, [], model)
    return {
      verdict: parseVerdict(judged.text, e.expectations.length),
      prompt: jp,
      raw: judged.text,
      durationMs: judged.durationMs,
    }
  } catch (err) {
    return {
      verdict: invalidVerdict(`errore giudice: ${formatExecError(err)}`.slice(0, 300)),
      prompt: jp,
      raw: null,
      durationMs: null,
    }
  }
}

export function parseVerdict(raw, nExp) {
  if (!Number.isInteger(nExp) || nExp < 1) {
    return invalidVerdict('numero di aspettative non valido')
  }
  const m = raw.match(/\{[\s\S]*\}/)
  if (!m) return invalidVerdict(`verdetto non parsabile: ${raw.slice(0, 120)}`)
  try {
    const v = JSON.parse(m[0])
    if (typeof v.pass !== 'boolean') return invalidVerdict('pass deve essere booleano')
    if (!Number.isInteger(v.invented) || v.invented < 0) return invalidVerdict('invented deve essere un intero non negativo')
    if (!Array.isArray(v.expectations) || v.expectations.length !== nExp || v.expectations.some(x => typeof x !== 'boolean')) {
      return invalidVerdict(`expectations deve contenere esattamente ${nExp} booleani`)
    }
    const computedPass = v.expectations.every(Boolean) && v.invented === 0
    const mismatch = v.pass === computedPass ? '' : ` [pass dichiarato=${v.pass}, ricalcolato=${computedPass}]`
    return {
      pass: computedPass,
      invented: v.invented,
      expectations: v.expectations,
      notes: (String(v.notes ?? '') + mismatch).slice(0, 300),
    }
  } catch {
    return invalidVerdict(`JSON invalido: ${m[0].slice(0, 120)}`)
  }
}

function invalidVerdict(notes) {
  return { pass: null, invented: null, expectations: [], notes }
}

export function validateSuite(suite, manifest) {
  if (!suite || !Array.isArray(suite.evals) || suite.evals.length === 0) throw new Error('suite.evals deve essere un array non vuoto')
  if (!manifest || !Array.isArray(manifest.evals)) throw new Error('manifest.evals deve essere un array')
  if (manifest.schema_version !== 2) throw new Error('manifest.schema_version deve essere 2')

  const suiteIds = new Set()
  for (const e of suite.evals) {
    if (!Number.isInteger(e.id) || e.id < 1 || suiteIds.has(e.id)) throw new Error(`id eval non valido o duplicato: ${e.id}`)
    suiteIds.add(e.id)
    if (typeof e.prompt !== 'string' || !e.prompt.trim()) throw new Error(`eval ${e.id}: prompt mancante`)
    if (!Array.isArray(e.expectations) || e.expectations.length === 0 || e.expectations.some(x => typeof x !== 'string' || !x.trim())) {
      throw new Error(`eval ${e.id}: expectations deve essere un array non vuoto di stringhe`)
    }
    if (e.files !== undefined && !Array.isArray(e.files)) throw new Error(`eval ${e.id}: files deve essere un array`)
  }

  const manifestIds = new Set()
  for (const m of manifest.evals) {
    if (!Number.isInteger(m.id) || m.id < 1 || manifestIds.has(m.id)) throw new Error(`id manifest non valido o duplicato: ${m.id}`)
    manifestIds.add(m.id)
    if (!suiteIds.has(m.id)) throw new Error(`manifest contiene id assente dalla suite: ${m.id}`)
    if (typeof m.name !== 'string' || !m.name.trim()) throw new Error(`manifest ${m.id}: name mancante`)
    if (typeof m.genre !== 'string' || !m.genre.trim()) throw new Error(`manifest ${m.id}: genre mancante`)
    if (!['preserve', 'improve', 'mixed'].includes(m.target)) throw new Error(`manifest ${m.id}: target non valido`)
    if (!['dev', 'held-out'].includes(m.split)) throw new Error(`manifest ${m.id}: split deve essere dev o held-out`)
  }
  for (const id of suiteIds) if (!manifestIds.has(id)) throw new Error(`eval ${id} assente dal manifest`)
  return true
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
  L.push(`# Esecuzione suite — ${h.label}`)
  L.push(`skill sha256=${h.skill.sha256} · git=${h.git.sha}${h.git.dirty ? '+dirty' : ''}`)
  L.push(`editor=${h.editorModel} · judge=${h.judgeModel} · split=${h.splitFilter} · run/eval=${h.runs}`)
  L.push(`\n**Pass rate complessivo: ${s.pass}/${s.total} (${(s.passRate * 100).toFixed(0)}%) · invenzioni totali: ${s.invented}**\n`)
  L.push('| target | pass | fail | err | invenzioni |')
  L.push('|---|---|---|---|---|')
  for (const [k, v] of Object.entries(s.byTarget)) L.push(`| ${k} | ${v.pass} | ${v.fail} | ${v.err} | ${v.invented} |`)
  L.push('\n| split | pass | fail | err | invenzioni |')
  L.push('|---|---|---|---|---|')
  for (const [k, v] of Object.entries(s.bySplit)) L.push(`| ${k} | ${v.pass} | ${v.fail} | ${v.err} | ${v.invented} |`)
  L.push('\n| id | nome | target | pass/run |')
  L.push('|---|---|---|---|')
  for (const [id, v] of Object.entries(s.perEval)) L.push(`| ${id} | ${v.name ?? ''} | ${v.target ?? ''} | ${v.pass}/${v.n} |`)
  return L.join('\n')
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

function elapsedMs(started) {
  return Number((process.hrtime.bigint() - started) / 1_000_000n)
}

function claudeEnv() {
  const env = { ...process.env }
  // Permette di lanciare la suite anche da una sessione Claude Code: il CLI blocca
  // esplicitamente le sessioni annidate quando eredita questa variabile.
  delete env.CLAUDECODE
  return env
}

function formatExecError(err) {
  const detail = String(err?.stderr || err?.stdout || '').trim()
  return detail || String(err?.message || err)
}

function parseArgs(argv) {
  const o = {}
  const allowed = new Set([
    'skill', 'suite', 'manifest', 'label', 'model', 'judge-model',
    'runs', 'ids', 'split', 'out', 'validate-only',
  ])
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      if (!allowed.has(k)) throw new Error(`flag sconosciuto: --${k}`)
      if (v !== undefined) o[k] = v
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) o[k] = argv[++i]
      else o[k] = true
    }
  }
  return o
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main()
  } catch (err) {
    console.error(`errore: ${err.message}`)
    process.exit(1)
  }
}
