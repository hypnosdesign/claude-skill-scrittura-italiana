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
// Flag: --skill <file> --no-skill --label <s> --model <m> --judge-model <m> --runs <n>
//       --ids <csv> --split <dev|held-out|all> --suite <file> --manifest <file>
//       --out <dir> --resume <dir> --fail-under <0..1> --validate-only
//
// --no-skill esegue il braccio "baseline nuda" (nessun system prompt): misura cosa
// fa il modello da solo, per quantificare il valore aggiunto della skill.
// Ogni chiamata usa `--output-format json`: la riga persiste anche gli ID dei
// modelli effettivamente risolti (gli alias tipo `sonnet` cambiano nel tempo) e
// il costo API dichiarato dal CLI.
// --resume <dir> riprende un run interrotto: riesegue solo le coppie (caso, run)
// assenti o in errore, ad append sullo stesso results.jsonl (le righe vecchie
// restano come storia; il riepilogo tiene l'ultima riga valida per coppia).
// I fingerprint di skill/suite/manifest e i modelli devono coincidere col run
// originale: riprendere con una suite diversa è un errore, non un merge.
// Su un errore da limite di sessione (429) il runner ABORTISCE invece di
// macinare chiamate destinate a fallire; riprendi poi con --resume.
// --fail-under <r> rende il run usabile come gate: exit ≠ 0 se il pass rate
// scende sotto r o se ci sono verdetti in errore.
// --rejudge <dir> rigiudica gli output GIÀ persistiti di un run (nessuna chiamata
// all'editor): isola la varianza del giudice da quella dell'editor e permette un
// secondo giudice (--judge-model) sugli stessi testi. Ogni riga nuova conserva il
// verdetto originale in `originalVerdict`; il riepilogo conta accordi e divergenze.

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
  if (args.rejudge) return rejudgeMain(args, argv)
  const noSkill = Boolean(args['no-skill'])
  if (noSkill && args.skill) throw new Error('--no-skill e --skill sono alternativi')
  const skillFile = noSkill ? null : resolve(args.skill ?? join(REPO, 'scrittura-italiana-single-file.md'))
  const suiteFile = resolve(args.suite ?? join(HERE, 'evals.json'))
  const manifestFile = resolve(args.manifest ?? join(HERE, 'manifest.json'))
  const label = String(args.label ?? 'new')
  const editorModel = String(args.model ?? 'sonnet')
  const judgeModel = String(args['judge-model'] ?? 'opus')
  const runs = Number(args.runs ?? 1)
  const splitFilter = String(args.split ?? 'dev')
  const onlyIds = args.ids ? new Set(String(args.ids).split(',').map(Number)) : null
  const claudeBin = process.env.CLAUDE_BIN || 'claude'
  const resumeDir = args.resume ? resolve(String(args.resume)) : null
  const failUnder = args['fail-under'] !== undefined ? Number(args['fail-under']) : null
  if (resumeDir && args.out) throw new Error('--resume e --out sono alternativi')
  if (failUnder !== null && !(failUnder >= 0 && failUnder <= 1)) throw new Error('--fail-under richiede un numero fra 0 e 1')

  const requiredFiles = [['suite', suiteFile], ['manifest', manifestFile]]
  if (!noSkill) requiredFiles.unshift(['skill', skillFile])
  for (const [kind, file] of requiredFiles) {
    if (!existsSync(file)) throw new Error(`${kind} non trovato: ${file}`)
  }
  if (!Number.isInteger(runs) || runs < 1) throw new Error('--runs richiede un intero positivo')
  if (!['all', 'dev', 'held-out'].includes(splitFilter)) throw new Error('--split accetta dev, held-out o all')
  if (onlyIds && [...onlyIds].some(id => !Number.isInteger(id) || id < 1)) throw new Error('--ids richiede interi positivi separati da virgola')

  const skillText = noSkill ? '' : readFileSync(skillFile, 'utf8')
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
    skill: noSkill ? null : sha256(skillText),
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

  console.log(noSkill
    ? `skill=NESSUNA (baseline nuda) | git=${gitSha}${dirty ? '+dirty' : ''}`
    : `skill=${skillFile} sha256=${fingerprints.skill.slice(0, 12)} | git=${gitSha}${dirty ? '+dirty' : ''}`)
  console.log(`editor=${editorModel} judge=${judgeModel}${editorModel === judgeModel ? ' [ATTENZIONE: stesso modello]' : ''} | split=${splitFilter} | ${selected.length} eval × ${runs} run`)
  if (args['validate-only']) {
    console.log(`suite valida: ${suite.evals.length} eval; dev=${manifest.evals.filter(x => x.split === 'dev').length}; held-out=${manifest.evals.filter(x => x.split === 'held-out').length}`)
    return { validated: true, fingerprints, splitFilter, ids: selected.map(e => e.id) }
  }

  let outDir
  let priorRows = []
  let done = new Set()
  let runMeta
  if (resumeDir) {
    outDir = resumeDir
    if (!existsSync(join(outDir, 'meta.json'))) throw new Error(`--resume: meta.json non trovato in ${outDir}`)
    const prev = JSON.parse(readFileSync(join(outDir, 'meta.json'), 'utf8'))
    const mismatches = []
    if ((prev.skill?.sha256 ?? null) !== fingerprints.skill) mismatches.push('skill')
    if (prev.suite?.sha256 !== fingerprints.suite) mismatches.push('suite')
    if (prev.manifest?.sha256 !== fingerprints.manifest) mismatches.push('manifest')
    if (prev.editorModel !== editorModel) mismatches.push('editor model')
    if (prev.judgeModel !== judgeModel) mismatches.push('judge model')
    if (prev.runs !== runs) mismatches.push('runs')
    if (prev.splitFilter !== splitFilter) mismatches.push('split')
    if (mismatches.length) throw new Error(`--resume: il run originale differisce per ${mismatches.join(', ')} — riprendere non è un merge`)
    const prevIds = new Set(prev.ids ?? [])
    const extra = selected.map(e => e.id).filter(id => !prevIds.has(id))
    if (extra.length) throw new Error(`--resume: casi assenti dal run originale: ${extra.join(', ')}`)
    priorRows = safe(() => readFileSync(join(outDir, 'results.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)), [])
    done = new Set(priorRows.filter(r => r.verdict?.pass !== null).map(r => `${r.id}:${r.run}`))
    runMeta = { ...prev, resumes: [...(prev.resumes ?? []), { stamp, argv }] }
    writeFileSync(join(outDir, 'meta.json'), JSON.stringify(runMeta, null, 2))
    console.log(`resume: ${done.size} coppie (caso, run) già valide, ${selected.length * runs - done.size} da eseguire`)
  } else {
    outDir = resolve(args.out ?? join(HERE, 'results', `${stamp}__${label}`))
    if (existsSync(outDir)) throw new Error(`directory di output già esistente: ${outDir}`)
    mkdirSync(outDir, { recursive: true })
    if (!noSkill) writeFileSync(join(outDir, 'skill.md'), skillText)
    writeFileSync(join(outDir, 'suite.json'), suiteText)
    writeFileSync(join(outDir, 'manifest.json'), manifestText)
    runMeta = {
      schemaVersion: 3,
      label,
      stamp,
      argv,
      git: { sha: gitSha, dirty },
      skill: noSkill
        ? { source: null, sha256: null, bytes: 0, noSkill: true }
        : { source: skillFile, sha256: fingerprints.skill, bytes: Buffer.byteLength(skillText) },
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
  }

  let aborted = null
  const rows = []
  outer: for (const e of selected) {
    const m = meta[e.id]
    for (let run = 1; run <= runs; run++) {
      if (done.has(`${e.id}:${run}`)) continue
      let output = null
      let editorDurationMs = null
      let editorModels = []
      let editorCostUsd = null
      let editorCliExitError = false
      let editorModelMismatch = false
      let judged = null
      try {
        const edited = callClaude(e.prompt, noSkill ? [] : ['--append-system-prompt-file', skillFile], editorModel)
        output = edited.text
        editorDurationMs = edited.durationMs
        editorModels = edited.models
        editorCostUsd = edited.costUsd
        editorCliExitError = Boolean(edited.cliExitError)
        // Il CLI può ripiegare in silenzio su un ALTRO modello (successo il 29-07: tre
        // chiamate `claude-fable-5` risolte da opus-5). Con un ID pinnato richiesto,
        // l'assenza dell'ID fra i modelli risolti va marcata: i confronti fra bracci
        // pretendono la parità di modello riga per riga.
        const mainModels = editorModels.filter(x => !/haiku/i.test(x))
        editorModelMismatch = editorModel.startsWith('claude-') && mainModels.length > 0 && !mainModels.includes(editorModel)
        judged = judge(e, output, m, judgeModel)
      } catch (err) {
        const message = formatExecError(err)
        output ??= `[ERRORE EDITOR: ${message}]`
        judged = {
          verdict: { pass: null, invented: null, expectations: [], notes: `errore: ${message}`.slice(0, 300) },
          prompt: null,
          raw: null,
          durationMs: null,
          models: [],
          costUsd: null,
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
        editorModels,
        editorCostUsd,
        editorCliExitError,
        editorModelMismatch,
        judgeDurationMs: judged.durationMs,
        judgeModels: judged.models ?? [],
        judgeCostUsd: judged.costUsd ?? null,
        judgePrompt: judged.prompt,
        judgeRaw: judged.raw,
        verdict: judged.verdict,
      }
      rows.push(row)
      appendFileSync(join(outDir, 'results.jsonl'), JSON.stringify(row) + '\n')
      const v = judged.verdict
      console.log(`#${String(e.id).padStart(2)} ${m.name.padEnd(26)} run${run}: ${v.pass === null ? 'ERR' : v.pass ? 'PASS' : 'FAIL'}${v.invented ? ` inv=${v.invented}` : ''}  ${v.notes ?? ''}`)
      if (v.pass === null && isSessionLimit(`${v.notes ?? ''} ${output ?? ''}`)) {
        aborted = `limite di sessione/rate (429) al caso #${e.id} run${run}: interrompo invece di accumulare errori. Riprendi con --resume ${outDir}`
        console.error(`\n⚠ ${aborted}`)
        break outer
      }
    }
  }

  const summary = aggregate([...priorRows, ...rows])
  if (aborted) summary.aborted = aborted
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
  const md = renderSummary(summary, runMeta)
  writeFileSync(join(outDir, 'summary.md'), md)
  console.log('\n' + md + `\n→ artefatti: ${outDir}`)
  const gate = failUnder === null ? null : {
    failUnder,
    passRate: summary.passRate,
    errCount: summary.err,
    ok: !aborted && summary.err === 0 && summary.passRate >= failUnder,
  }
  if (gate && !gate.ok) console.error(`gate fallito: pass rate ${summary.passRate} (soglia ${failUnder}), err=${summary.err}${aborted ? ', run abortito' : ''}`)
  return { outDir, summary, meta: runMeta, aborted, gate }
}

// Errori da limite di sessione o rate limit: inutile proseguire, si riprende con --resume.
export function isSessionLimit(text) {
  return /\b429\b|usage limit|rate.?limit|limit reached|limite di sessione/i.test(String(text))
}

// Con --resume (o con la fusione di un blocco supplementare in stability.mjs) lo
// stesso (caso, run) può comparire più volte: la PRIMA riga con verdetto valido
// vince — un supplemento riempie i buchi, non sovrascrive misure già valide —
// mentre una riga in errore è sostituibile da qualunque riga successiva.
export function dedupeRows(rows) {
  const byKey = new Map()
  for (const r of rows) {
    const k = `${r.id}:${r.run}`
    const prev = byKey.get(k)
    if (!prev || prev.verdict?.pass === null) byKey.set(k, r)
  }
  return [...byKey.values()]
}

// Rigiudica gli output persistiti di un run: stesse righe, giudice (eventualmente)
// diverso, zero chiamate all'editor. Le righe in errore editor vengono saltate.
function rejudgeMain(args, argv) {
  const srcDir = resolve(String(args.rejudge))
  const judgeModel = String(args['judge-model'] ?? 'opus')
  const label = String(args.label ?? 'rejudge')
  const onlyIds = args.ids ? new Set(String(args.ids).split(',').map(Number)) : null
  for (const flag of ['skill', 'no-skill', 'model', 'runs', 'split', 'resume']) {
    if (args[flag] !== undefined) throw new Error(`--rejudge non accetta --${flag}: usa gli output così come sono`)
  }
  if (!existsSync(join(srcDir, 'results.jsonl'))) throw new Error(`--rejudge: results.jsonl non trovato in ${srcDir}`)
  const srcMeta = safe(() => JSON.parse(readFileSync(join(srcDir, 'meta.json'), 'utf8')), {})
  // Si rigiudica ogni riga con un OUTPUT editoriale valido — inclusi i casi in cui il
  // PRIMO giudice era andato in errore: sono i candidati ideali (l'output c'è, il
  // verdetto no). L'accordo si calcola solo dove esiste un verdetto originale valido.
  const srcRows = dedupeRows(readFileSync(join(srcDir, 'results.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)))
    .filter(r => typeof r.output === 'string' && !r.output.startsWith('[ERRORE EDITOR'))
    .filter(r => !onlyIds || onlyIds.has(r.id))
  if (srcRows.length === 0) throw new Error('--rejudge: nessuna riga rigiudicabile (serve un output editoriale valido)')

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const outDir = resolve(args.out ?? join(HERE, 'results', `${stamp}__${label}`))
  if (existsSync(outDir)) throw new Error(`directory di output già esistente: ${outDir}`)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'meta.json'), JSON.stringify({
    schemaVersion: 3, kind: 'rejudge', label, stamp, argv,
    source: { dir: srcDir, editorModel: srcMeta.editorModel ?? null, judgeModel: srcMeta.judgeModel ?? null, skill: srcMeta.skill ?? null, suite: srcMeta.suite ?? null },
    judgeModel, rows: srcRows.length, node: process.version,
  }, null, 2))

  console.log(`rejudge: ${srcRows.length} righe da ${srcDir} · giudice originale=${srcMeta.judgeModel ?? '?'} · nuovo=${judgeModel}`)
  const rows = []
  const divergent = []
  for (const r of srcRows) {
    const judged = judge({ prompt: r.prompt, expectations: r.expectations, expected_output: r.expectedOutput }, r.output, { target: r.target }, judgeModel)
    const row = { ...r, originalVerdict: r.verdict, verdict: judged.verdict, judgePrompt: judged.prompt, judgeRaw: judged.raw, judgeDurationMs: judged.durationMs, judgeModels: judged.models ?? [], judgeCostUsd: judged.costUsd ?? null }
    rows.push(row)
    appendFileSync(join(outDir, 'results.jsonl'), JSON.stringify(row) + '\n')
    const before = r.verdict?.pass ?? null
    const after = judged.verdict.pass
    const beforeTxt = before === null ? 'ERR' : before ? 'PASS' : 'FAIL'
    const mark = after === null ? 'ERR' : before === null ? '+' : after === before ? '=' : '≠'
    if (after !== null && before !== null && after !== before) divergent.push({ id: r.id, run: r.run, before, after })
    console.log(`#${String(r.id).padStart(2)} ${String(r.name ?? '').padEnd(26)} run${r.run}: ${beforeTxt} → ${after === null ? 'ERR' : after ? 'PASS' : 'FAIL'} ${mark}`)
    if (after === null && isSessionLimit(String(judged.verdict.notes ?? ''))) {
      console.error('⚠ limite di sessione: interrompo il rejudge')
      break
    }
  }
  const valid = rows.filter(r => r.verdict.pass !== null)
  const comparable = valid.filter(r => r.originalVerdict?.pass !== null)
  const recovered = valid.filter(r => r.originalVerdict?.pass === null)
  const agree = comparable.filter(r => r.verdict.pass === r.originalVerdict.pass).length
  const summary = {
    rows: rows.length, valid: valid.length, comparable: comparable.length, agree,
    agreementRate: comparable.length ? +(agree / comparable.length).toFixed(3) : null,
    recovered: recovered.map(r => ({ id: r.id, run: r.run, pass: r.verdict.pass })),
    divergent,
    judgeErrors: rows.length - valid.length,
    costUsd: +rows.reduce((s, r) => s + (r.judgeCostUsd || 0), 0).toFixed(4),
  }
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
  const md = [
    `# Rejudge — ${label}`,
    `origine: ${srcDir} (editor ${srcMeta.editorModel ?? '?'}, giudice ${srcMeta.judgeModel ?? '?'}) · nuovo giudice: ${judgeModel}`,
    `\n**Accordo fra i giudici: ${agree}/${comparable.length}${comparable.length ? ` (${Math.round((agree / comparable.length) * 100)}%)` : ''}** · errori giudice: ${summary.judgeErrors} · costo: $${summary.costUsd}`,
    recovered.length ? `\nRecuperati (primo giudice in errore, ora giudicati): ${recovered.map(r => `#${r.id} run${r.run} → ${r.pass ? 'PASS' : 'FAIL'}`).join(' · ')}` : '',
    divergent.length ? `\nDivergenze: ${divergent.map(d => `#${d.id} run${d.run} ${d.before ? 'PASS' : 'FAIL'}→${d.after ? 'PASS' : 'FAIL'}`).join(' · ')}` : '\nNessuna divergenza.',
  ].filter(Boolean).join('\n')
  writeFileSync(join(outDir, 'summary.md'), md)
  console.log('\n' + md + `\n→ artefatti: ${outDir}`)
  return { outDir, summary }
}

// ---------- helpers ----------
// `--disallowedTools "*"` toglie gli strumenti del CLI: il benchmark è
// testo-dentro/testo-fuori. Senza questo vincolo l'editor può «andare agentico» — è
// successo: sul caso #15 ha cercato config.json nel tmpdir e risposto in inglese col
// percorso della sandbox, contato (giustamente) come invenzione. Un flake di harness,
// non un dato sull'editing. (La variante `--tools ''` lascia i tool nel prompt e i
// tentativi negati fanno uscire il CLI in errore: scartata dopo prova.)
function callClaude(prompt, extraFlags, model) {
  const started = process.hrtime.bigint()
  try {
    const raw = execFileSync(process.env.CLAUDE_BIN || 'claude', ['-p', ...extraFlags, '--model', model, '--output-format', 'json', '--disallowedTools', '*'], {
      input: prompt,
      cwd: tmpdir(),
      env: claudeEnv(),
      encoding: 'utf8',
      timeout: 240000,
      maxBuffer: 16 * 1024 * 1024,
    }).trim()
    return { ...parseCliEnvelope(raw), durationMs: elapsedMs(started) }
  } catch (err) {
    // Il CLI 2.1.x ogni tanto esce con codice ≠ 0 stampando comunque un envelope
    // completo di `result` (visto ~4 volte su ~60 chiamate il 29-07-2026). Se il
    // result c'è, la risposta è valida: salvarla — dichiarandolo — è più onesto
    // che buttare una misura pagata. Senza result, l'errore resta un errore.
    const salvage = parseCliEnvelope(String(err?.stdout ?? '').trim())
    if (salvage.text && salvage.models.length) {
      return { ...salvage, durationMs: elapsedMs(started), cliExitError: true }
    }
    throw err
  }
}

// Estrae testo, ID dei modelli risolti e costo dall'envelope `--output-format json`
// del CLI. Fallback onesto: se l'output non è l'envelope atteso (CLI più vecchio,
// bin di test), viene trattato come testo puro, senza metadati di modello.
export function parseCliEnvelope(raw) {
  try {
    const v = JSON.parse(raw)
    if (v && typeof v === 'object' && typeof v.result === 'string') {
      return {
        text: v.result.trim(),
        models: Object.keys(v.modelUsage ?? {}),
        costUsd: typeof v.total_cost_usd === 'number' ? v.total_cost_usd : null,
      }
    }
  } catch {
    // non era JSON: testo puro
  }
  return { text: raw, models: [], costUsd: null }
}

// Regole di severità per livello di conservazione (manifest schema 3).
export const LEVEL_RULES = {
  exact: 'exact — il testo NON va modificato: qualunque cambiamento oltre gli spazi bianchi è un difetto.',
  minimal: 'minimal — sono ammesse SOLO le correzioni di errori oggettivi (ortografia, accordi, punteggiatura sbagliata); ogni ritocco stilistico non richiesto è un difetto.',
  semantic: 'semantic — la forma può cambiare, ma significato, fatti, polarità, modalità, condizioni e voce devono restare intatti.',
  improve: 'improve — l\'output deve migliorare il testo secondo le aspettative, senza inventare contenuti.',
  mixed: 'mixed — alcune parti vanno migliorate e altre preservate, come dettagliano le aspettative.',
  advice: 'advice — è una domanda di lingua: giudica la risposta (correttezza della regola, pertinenza dell\'esempio), non un testo revisionato.',
}

function judge(e, output, m, model) {
  const jp = [
    'Sei un valutatore severo e imparziale di editing in italiano. Giudichi un OUTPUT contro ASPETTATIVE verificabili. Non sei indulgente: ai livelli "exact" e "minimal" qualunque modifica non necessaria è un difetto.',
    `LIVELLO: ${LEVEL_RULES[m.target] ?? m.target ?? '?'}`,
    `PROMPT dato all'editor (contiene l'input fra """):\n"""${e.prompt}"""`,
    `OUTPUT prodotto dall'editor:\n"""${output}"""`,
    'IMPORTANTE: se l\'editor dichiara che non serve alcun intervento (es. «testo già corretto», «nessuna modifica necessaria») o commenta senza riprodurre il testo, considera l\'output IDENTICO all\'input. Ai livelli "exact" e "minimal" questo SODDISFA le aspettative di conservazione (zero modifiche = comportamento corretto). Giudica eventuali commenti/note dell\'editor come metadati, non come parte del testo revisionato.',
    'ASPETTATIVE (ognuna deve essere rispettata):\n' + e.expectations.map((x, i) => `${i + 1}. ${x}`).join('\n'),
    e.expected_output ? `Atteso (indicativo): ${e.expected_output}` : '',
    'Conta le INVENZIONI — qualunque contenuto presente nell\'OUTPUT ma assente dall\'input del prompt: entità, numeri, date, luoghi, fonti, conteggi; E ANCHE affermazioni fattuali nuove, definizioni o glosse di termini (anche se corrette: «X, cioè …» aggiunto conta), rapporti causali, condizioni o eccezioni nuove, conclusioni non presenti, modalità promosse (un «suggerisce» reso «dimostra»). NON sono invenzioni: i rimandi alle sezioni interne della skill o dei suoi riferimenti (es. «§9», «Parte B», «stile-naturale.md») — sono tracciabilità del criterio applicato, non fonti fattuali — e le riformulazioni che non aggiungono contenuto.',
    'Rispondi SOLO con un oggetto JSON su UNA riga, senza markdown:\n{"pass": true|false, "invented": <int>, "expectations": [true|false, ...], "notes": "<una frase>"}\n"pass" è true SOLO se tutte le aspettative sono true e invented=0.',
  ].filter(Boolean).join('\n\n')
  try {
    const judged = callClaude(jp, [], model)
    return {
      verdict: parseVerdict(judged.text, e.expectations.length),
      prompt: jp,
      raw: judged.text,
      durationMs: judged.durationMs,
      models: judged.models,
      costUsd: judged.costUsd,
    }
  } catch (err) {
    return {
      verdict: invalidVerdict(`errore giudice: ${formatExecError(err)}`.slice(0, 300)),
      prompt: jp,
      raw: null,
      durationMs: null,
      models: [],
      costUsd: null,
    }
  }
}

// Primo oggetto JSON bilanciato nel testo (il vecchio match greedy `{...}` falliva
// se il giudice faceva seguire al verdetto altro testo con una graffa).
export function extractJsonObject(raw) {
  for (let start = raw.indexOf('{'); start !== -1; start = raw.indexOf('{', start + 1)) {
    let depth = 0
    let inString = false
    let escaped = false
    for (let i = start; i < raw.length; i++) {
      const ch = raw[i]
      if (escaped) { escaped = false; continue }
      if (ch === '\\') { escaped = inString; continue }
      if (ch === '"') { inString = !inString; continue }
      if (inString) continue
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) {
          try { return JSON.parse(raw.slice(start, i + 1)) } catch { break }
        }
      }
    }
  }
  return null
}

export function parseVerdict(raw, nExp) {
  if (!Number.isInteger(nExp) || nExp < 1) {
    return invalidVerdict('numero di aspettative non valido')
  }
  const v = extractJsonObject(raw)
  if (!v || typeof v !== 'object') return invalidVerdict(`verdetto non parsabile: ${raw.slice(0, 120)}`)
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
}

function invalidVerdict(notes) {
  return { pass: null, invented: null, expectations: [], notes }
}

const VALID_TARGETS = ['exact', 'minimal', 'semantic', 'improve', 'mixed', 'advice']

export function validateSuite(suite, manifest) {
  if (!suite || !Array.isArray(suite.evals) || suite.evals.length === 0) throw new Error('suite.evals deve essere un array non vuoto')
  if (!manifest || !Array.isArray(manifest.evals)) throw new Error('manifest.evals deve essere un array')
  if (manifest.schema_version !== 3) throw new Error('manifest.schema_version deve essere 3')

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
    if (!VALID_TARGETS.includes(m.target)) throw new Error(`manifest ${m.id}: target non valido (ammessi: ${VALID_TARGETS.join(', ')})`)
    if (!['dev', 'held-out'].includes(m.split)) throw new Error(`manifest ${m.id}: split deve essere dev o held-out`)
  }
  for (const id of suiteIds) if (!manifestIds.has(id)) throw new Error(`eval ${id} assente dal manifest`)
  return true
}

function aggregate(allRows) {
  const rows = dedupeRows(allRows)
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
  const err = rows.filter(r => r.verdict.pass === null).length
  const invented = rows.reduce((s, r) => s + (r.verdict.invented || 0), 0)
  const costUsd = +allRows.reduce((s, r) => s + (r.editorCostUsd || 0) + (r.judgeCostUsd || 0), 0).toFixed(4)
  const modelsUsed = [...new Set(rows.flatMap(r => [...(r.editorModels || []), ...(r.judgeModels || [])]))]
  // Editor e giudice devono restare modelli diversi anche da RISOLTI, non solo
  // come alias; le chiamate ausiliarie del CLI (haiku) non contano.
  const editorResolved = new Set(rows.flatMap(r => r.editorModels || []))
  const judgeResolved = new Set(rows.flatMap(r => r.judgeModels || []))
  const resolvedOverlap = [...editorResolved].filter(m => judgeResolved.has(m) && !/haiku/i.test(m))
  const modelMismatches = rows.filter(r => r.editorModelMismatch).map(r => `#${r.id} run${r.run}`)
  // per-eval stabilità su più run
  const perEval = {}
  for (const r of rows) {
    perEval[r.id] ??= { name: r.name, target: r.target, pass: 0, n: 0 }
    perEval[r.id].n++
    if (r.verdict.pass === true) perEval[r.id].pass++
  }
  return { total, pass, err, passRate: total ? +(pass / total).toFixed(3) : 0, invented, costUsd, modelsUsed, resolvedOverlap, modelMismatches, byTarget: by('target'), bySplit: by('split'), perEval }
}

function renderSummary(s, h) {
  const L = []
  L.push(`# Esecuzione suite — ${h.label}`)
  L.push(h.skill.noSkill ? `skill=NESSUNA (baseline nuda) · git=${h.git.sha}${h.git.dirty ? '+dirty' : ''}` : `skill sha256=${h.skill.sha256} · git=${h.git.sha}${h.git.dirty ? '+dirty' : ''}`)
  L.push(`editor=${h.editorModel} · judge=${h.judgeModel} · split=${h.splitFilter} · run/eval=${h.runs}`)
  L.push(`modelli risolti: ${s.modelsUsed.length ? s.modelsUsed.join(', ') : 'n/d'} · costo API dichiarato: ${s.costUsd ? `$${s.costUsd}` : 'n/d'}`)
  if (s.resolvedOverlap?.length) L.push(`\n⚠ **editor e giudice condividono modelli risolti: ${s.resolvedOverlap.join(', ')}**`)
  if (s.modelMismatches?.length) L.push(`\n⚠ **modello richiesto ≠ risolto (fallback del CLI) su: ${s.modelMismatches.join(', ')} — righe non comparabili fra bracci**`)
  if (s.aborted) L.push(`\n⚠ **RUN ABORTITO: ${s.aborted}**`)
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
    'skill', 'no-skill', 'suite', 'manifest', 'label', 'model', 'judge-model',
    'runs', 'ids', 'split', 'out', 'resume', 'fail-under', 'validate-only', 'rejudge',
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
    const result = main()
    if (result?.aborted) process.exit(2)
    if (result?.gate && !result.gate.ok) process.exit(1)
  } catch (err) {
    console.error(`errore: ${err.message}`)
    process.exit(1)
  }
}
