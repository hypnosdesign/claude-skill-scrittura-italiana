#!/usr/bin/env node
// Harness di attivazione e instradamento nel CLIENT REALE (skill installata, non iniettata).
//
// Misura i due anelli che il runner della suite non può vedere:
//   1. ATTIVAZIONE  — la skill parte sulle richieste giuste (positive) e non parte
//      su quelle fuori perimetro (negative)?
//   2. INSTRADAMENTO — sui compiti per genere (routing), il modello apre i
//      riferimenti attesi in `references/`?
//
// Come funziona: copia SKILL.md + references/ in una directory di lavoro temporanea
// come skill DI PROGETTO (`.claude/skills/scrittura-italiana`), poi esegue
// `claude -p --output-format stream-json` con cwd in quella directory e ispeziona
// gli eventi: tool_use `Skill` → attivazione; tool_use `Read` su references/ →
// instradamento. I percorsi letti rivelano anche QUALE copia della skill ha
// risposto (progetto vs installazione personale in ~/.claude/skills).
//
// Limiti onesti: è una misura del comportamento del client (che può cambiare col
// CLI), n piccolo, un solo modello per run. Indicativa, non un benchmark.
//
// Uso:
//   node evals/activation.mjs --probe                 # 1 positivo + 1 routing, per verificare l'harness
//   node evals/activation.mjs                         # tutti i casi
//   node evals/activation.mjs --kind negative         # solo un sottoinsieme
//   node evals/activation.mjs --ids 31,32 --max-turns 15
//   node evals/activation.mjs --skill-src /percorso/skill-candidata
//
// Flag: --model <m> --kind <positive|negative|routing|all> --ids <csv>
//       --max-turns <n> --out <dir> --skill-src <dir> --probe

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const safe = (fn, fb) => { try { return fn() } catch { return fb } }

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)
  const model = String(args.model ?? 'claude-sonnet-5')
  const kindFilter = String(args.kind ?? 'all')
  const onlyIds = args.ids ? new Set(String(args.ids).split(',').map(Number)) : null
  const skillSrc = resolve(args['skill-src'] ?? REPO)
  const claudeBin = process.env.CLAUDE_BIN || 'claude'
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')

  const casesFile = join(HERE, 'activation-cases.json')
  const all = JSON.parse(readFileSync(casesFile, 'utf8')).cases
  let selected = all.filter(c =>
    (!onlyIds || onlyIds.has(c.id)) && (kindFilter === 'all' || c.kind === kindFilter))
  if (args.probe) selected = [all.find(c => c.kind === 'positive'), all.find(c => c.kind === 'routing')].filter(Boolean)
  if (selected.length === 0) throw new Error('nessun caso selezionato')

  // Skill di progetto in una dir di lavoro pulita (fuori da ogni repo).
  const workDir = mkdtempSync(join(tmpdir(), 'scrittura-activation-'))
  const skillDir = join(workDir, '.claude', 'skills', 'scrittura-italiana')
  mkdirSync(skillDir, { recursive: true })
  cpSync(join(skillSrc, 'SKILL.md'), join(skillDir, 'SKILL.md'))
  cpSync(join(skillSrc, 'references'), join(skillDir, 'references'), { recursive: true })
  const skillSha = sha256(readFileSync(join(skillDir, 'SKILL.md'), 'utf8'))

  const outDir = resolve(args.out ?? join(HERE, 'results', `${stamp}__activation`))
  if (existsSync(outDir)) throw new Error(`directory di output già esistente: ${outDir}`)
  mkdirSync(outDir, { recursive: true })

  const claudeVer = safe(() => execFileSync(claudeBin, ['--version'], { encoding: 'utf8', env: claudeEnv() }).trim(), '?')
  const gitSha = safe(() => execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim(), 'nogit')
  writeFileSync(join(outDir, 'meta.json'), JSON.stringify({
    schemaVersion: 1, stamp, argv, model, kindFilter, git: gitSha,
    skillSrc, skillSha, workDir, claudeVer, node: process.version,
    ids: selected.map(c => c.id),
  }, null, 2))

  console.log(`skill di progetto: ${skillSrc} (SKILL.md sha256=${skillSha.slice(0, 12)}) · model=${model} · ${selected.length} casi`)

  const rows = []
  for (const c of selected) {
    const maxTurns = Number(args['max-turns'] ?? (c.kind === 'routing' ? 15 : 6))
    const row = runCase(c, { claudeBin, model, maxTurns, workDir })
    rows.push(row)
    appendFileSync(join(outDir, 'results.jsonl'), JSON.stringify(row) + '\n')
    const mark = row.error ? 'ERR' : row.skillFired ? 'FIRE' : 'no'
    const reads = row.referenceReads.length ? ` reads=[${row.referenceReads.join(', ')}]` : ''
    console.log(`#${String(c.id).padStart(2)} ${c.kind.padEnd(8)} skill=${mark}${reads}${row.error ? ` (${row.error.slice(0, 80)})` : ''}`)
  }

  const summary = summarize(rows)
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
  const md = renderSummary(summary, { model, claudeVer, skillSha, gitSha })
  writeFileSync(join(outDir, 'summary.md'), md)
  console.log('\n' + md + `\n→ artefatti: ${outDir}`)
  return { outDir, summary, rows }
}

function runCase(c, { claudeBin, model, maxTurns, workDir }) {
  const started = process.hrtime.bigint()
  let raw = ''
  let error = null
  try {
    raw = execFileSync(claudeBin, [
      '-p', '--output-format', 'stream-json', '--verbose',
      '--model', model, '--max-turns', String(maxTurns),
      '--allowedTools', 'Skill Read Glob Grep',
    ], {
      input: c.prompt,
      cwd: workDir,
      env: claudeEnv(),
      encoding: 'utf8',
      timeout: 360000,
      maxBuffer: 32 * 1024 * 1024,
    })
  } catch (err) {
    raw = String(err?.stdout ?? '')
    error = (String(err?.stderr || err?.message || err)).slice(0, 300)
  }

  const events = raw.split('\n').filter(Boolean).map(l => safe(() => JSON.parse(l), null)).filter(Boolean)
  let skillFired = false
  let firedVia = null
  const readPaths = []
  for (const ev of events) {
    const blocks = ev?.message?.content
    if (!Array.isArray(blocks)) continue
    for (const b of blocks) {
      if (b?.type !== 'tool_use') continue
      if (b.name === 'Skill' && JSON.stringify(b.input ?? {}).includes('scrittura-italiana')) {
        skillFired = true
        firedVia = firedVia ?? 'Skill-tool'
      }
      if (b.name === 'Read' && typeof b.input?.file_path === 'string') {
        readPaths.push(b.input.file_path)
        if (b.input.file_path.includes('scrittura-italiana')) {
          skillFired = true
          firedVia = firedVia ?? 'Read-skill-file'
        }
      }
    }
  }
  const result = events.find(ev => ev?.type === 'result')
  const referenceReads = [...new Set(readPaths
    .filter(p => p.includes('references/'))
    .map(p => p.split('/').pop().replace(/\.md$/, '')))]
  const expected = c.expectReads ?? null
  const routingHit = expected ? referenceReads.some(r => expected.some(e => r.includes(e))) : null

  return {
    id: c.id,
    kind: c.kind,
    prompt: c.prompt,
    skillFired,
    firedVia,
    readPaths,
    referenceReads,
    expectReads: expected,
    routingHit,
    numTurns: result?.num_turns ?? null,
    costUsd: typeof result?.total_cost_usd === 'number' ? result.total_cost_usd : null,
    models: Object.keys(result?.modelUsage ?? {}),
    durationMs: Number((process.hrtime.bigint() - started) / 1_000_000n),
    error,
  }
}

function summarize(rows) {
  // Gli errori del CLI (tipicamente il tetto --max-turns raggiunto DOPO l'attivazione)
  // non invalidano la riga: skillFired e le letture arrivano dallo stream parziale.
  // Restano quindi nel denominatore; il conteggio errori è riportato a parte.
  const of = kind => rows.filter(r => r.kind === kind)
  const errors = rows.filter(r => r.error).length
  const pos = of('positive')
  const neg = of('negative')
  const rou = of('routing')
  return {
    total: rows.length,
    errors,
    costUsd: +rows.reduce((s, r) => s + (r.costUsd || 0), 0).toFixed(4),
    positive: { n: pos.length, fired: pos.filter(r => r.skillFired).length },
    negative: { n: neg.length, fired: neg.filter(r => r.skillFired).length },
    routing: {
      n: rou.length,
      fired: rou.filter(r => r.skillFired).length,
      expectedReadHit: rou.filter(r => r.routingHit).length,
      perCase: rou.map(r => ({ id: r.id, fired: r.skillFired, reads: r.referenceReads, expected: r.expectReads, hit: r.routingHit })),
    },
  }
}

function renderSummary(s, h) {
  const pct = (a, b) => (b ? `${a}/${b} (${Math.round((a / b) * 100)}%)` : 'n/d')
  const L = []
  L.push('# Attivazione e instradamento — client reale')
  L.push(`model=${h.model} · cli=${h.claudeVer} · skill sha256=${h.skillSha.slice(0, 12)} · git=${h.gitSha}`)
  L.push('')
  L.push(`- **Attivazione (positivi):** ${pct(s.positive.fired, s.positive.n)}`)
  L.push(`- **Attivazioni spurie (negativi):** ${pct(s.negative.fired, s.negative.n)}`)
  L.push(`- **Routing — skill attiva:** ${pct(s.routing.fired, s.routing.n)} · **riferimento atteso aperto:** ${pct(s.routing.expectedReadHit, s.routing.n)}`)
  L.push(`- errori harness: ${s.errors} · costo API dichiarato: $${s.costUsd}`)
  if (s.routing.perCase.length) {
    L.push('\n| caso | skill | riferimenti letti | atteso | hit |')
    L.push('|---|---|---|---|---|')
    for (const r of s.routing.perCase) {
      L.push(`| ${r.id} | ${r.fired ? '✔' : '✘'} | ${r.reads.join(', ') || '—'} | ${(r.expected ?? []).join(' o ')} | ${r.hit ? '✔' : '✘'} |`)
    }
  }
  return L.join('\n')
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

function claudeEnv() {
  const env = { ...process.env }
  delete env.CLAUDECODE
  return env
}

function parseArgs(argv) {
  const o = {}
  const allowed = new Set(['model', 'kind', 'ids', 'max-turns', 'out', 'skill-src', 'probe'])
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
