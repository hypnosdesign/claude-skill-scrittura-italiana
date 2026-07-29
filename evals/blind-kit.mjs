#!/usr/bin/env node
// blind-kit.mjs — Kit per il confronto CIECO UMANO su naturalezza e voce.
//
// Genera coppie (con skill / senza skill) sugli stessi prompt, in ordine
// randomizzato con seed, e produce: il foglio per i lettori (anonimo), il
// template delle risposte e la chiave (che resta nella directory del kit, MAI
// da mostrare ai lettori prima della compilazione). Poi calcola i punteggi.
//
// A differenza del runner, qui l'editor riceve l'istruzione di rispondere col
// SOLO testo finale: le note editoriali della skill (virtù, §) smaschererebbero
// il braccio. Nessun giudice LLM: il giudice è il lettore umano.
//
// Uso:
//   node evals/blind-kit.mjs --build --seed 42 --out evals/results/blind-kit-1
//   node evals/blind-kit.mjs --score evals/results/blind-kit-1 risposte-anna.csv risposte-luca.csv
//
// Flag build: --seed <int> (obbligatorio) --ids <csv> --model <m> --skill <file> --out <dir>
// Bersaglio dichiarato (AUDIT-2026-07 §8): preferenza per il braccio con skill ≥ 70%.

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseCliEnvelope, requestedModelMismatch, resolvedPrimaryModels } from './run.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const DEFAULT_IDS = [3, 6, 16, 20, 21, 22, 23, 30, 40, 42]

// PRNG deterministico (mulberry32): stesso seed → stesso ordine delle versioni.
export function rng(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function sameArray(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i])
}

// Un confronto cieco resta valido solo se i due output provengono dallo stesso
// modello principale realmente risolto. Conservare i due bracci separati evita
// che l'unione dei modelUsage nasconda un fallback asimmetrico.
export function validatePairModels(requested, skillModels, bareModels, label = 'coppia') {
  const skillPrimary = resolvedPrimaryModels(skillModels, requested)
  const barePrimary = resolvedPrimaryModels(bareModels, requested)
  if (!skillPrimary.length || !barePrimary.length) throw new Error(`${label}: modello risolto assente in almeno un braccio`)
  if (requestedModelMismatch(requested, skillModels)) throw new Error(`${label}: braccio skill risolto da ${skillPrimary.join('+')} invece di ${requested}`)
  if (requestedModelMismatch(requested, bareModels)) throw new Error(`${label}: braccio nudo risolto da ${barePrimary.join('+')} invece di ${requested}`)
  if (!sameArray(skillPrimary, barePrimary)) throw new Error(`${label}: modelli risolti diversi fra i bracci (${skillPrimary.join('+')} vs ${barePrimary.join('+')})`)
  return { skillPrimary, barePrimary }
}

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)
  if (args.score) return score(args, argv)
  if (!args.build) throw new Error('specifica --build o --score <dir>')
  return build(args, argv)
}

function build(args, argv) {
  const seed = Number(args.seed)
  if (!Number.isInteger(seed)) throw new Error('--seed <intero> è obbligatorio (riproducibilità della randomizzazione)')
  const model = String(args.model ?? 'claude-sonnet-5')
  const skillFile = resolve(args.skill ?? join(REPO, 'scrittura-italiana-single-file.md'))
  const ids = args.ids ? String(args.ids).split(',').map(Number) : DEFAULT_IDS
  const outDir = resolve(args.out ?? join(HERE, 'results', `blind-kit-seed${seed}`))
  if (existsSync(outDir)) throw new Error(`directory già esistente: ${outDir}`)
  const suite = JSON.parse(readFileSync(join(HERE, 'evals.json'), 'utf8'))
  const byId = Object.fromEntries(suite.evals.map(e => [e.id, e]))
  for (const id of ids) if (!byId[id]) throw new Error(`id assente dalla suite: ${id}`)

  mkdirSync(outDir, { recursive: true })
  try {
    const rand = rng(seed)
    const pairs = []
    console.log(`kit cieco: ${ids.length} coppie · editor ${model} · skill ${skillFile}`)
    for (const [i, id] of ids.entries()) {
      const e = byId[id]
      const prompt = `${e.prompt}\n\n(Rispondi con il SOLO testo finale, senza note, spiegazioni o titoli aggiunti.)`
      const withSkill = callClaude(prompt, ['--append-system-prompt-file', skillFile], model)
      const bare = callClaude(prompt, [], model)
      validatePairModels(model, withSkill.models, bare.models, `coppia ${i + 1} (#${id})`)
      const skillFirst = rand() < 0.5
      pairs.push({
        n: i + 1, id, name: nameOf(e.prompt),
        consegna: e.prompt,
        v1: skillFirst ? withSkill.text : bare.text,
        v2: skillFirst ? bare.text : withSkill.text,
        skillIs: skillFirst ? 1 : 2,
        costUsd: +((withSkill.costUsd || 0) + (bare.costUsd || 0)).toFixed(4),
        skillModels: withSkill.models,
        bareModels: bare.models,
      })
      console.log(`coppia ${i + 1}/${ids.length} (caso #${id}) pronta`)
    }

    // chiave e dati completi: restano QUI, non vanno ai lettori
    writeFileSync(join(outDir, 'coppie.json'), JSON.stringify({ seed, model, skillFile, stamp: new Date().toISOString(), pairs }, null, 2))

    const sheet = []
    sheet.push('# Confronto alla cieca — foglio del lettore\n')
    sheet.push('Due versioni dello stesso testo, rivedute da due sistemi diversi. Per ogni coppia rispondi a due domande, **senza confrontarti con gli altri lettori**:\n')
    sheet.push('1. **Migliore:** quale versione è scritta in un italiano più naturale ed efficace? (`1`, `2`, o `pari`)')
    sheet.push('2. **Umana:** quale delle due ti sembra rivista da un editor umano esperto? (`1`, `2`, o `nonso`)\n')
    sheet.push('Compila `risposte.csv` (una copia a testa, col tuo nome nel file) e riconsegnala. Non esiste risposta giusta: conta la tua impressione di lettore.\n')
    for (const p of pairs) {
      sheet.push(`\n---\n\n## Coppia ${p.n}\n`)
      sheet.push(`**La consegna data ai due sistemi:**\n\n> ${p.consegna.replaceAll('\n', '\n> ')}\n`)
      sheet.push(`### Versione 1\n\n${p.v1}\n`)
      sheet.push(`### Versione 2\n\n${p.v2}\n`)
    }
    writeFileSync(join(outDir, 'foglio-lettore.md'), sheet.join('\n'))
    writeFileSync(join(outDir, 'risposte.csv'), 'lettore,coppia,migliore,umana\n' + pairs.map(p => `NOME,${p.n},,`).join('\n') + '\n')
    writeFileSync(join(outDir, 'ISTRUZIONI.md'), [
      '# Come condurre il confronto cieco\n',
      '1. Servono **almeno 3 lettori** che leggono bene l\'italiano e non sanno quale sistema ha prodotto quale versione (nemmeno tu glielo dici).',
      '2. Dai a ciascuno `foglio-lettore.md` e una copia di `risposte.csv` (rinominata, es. `risposte-anna.csv`); si compila in autonomia, senza discuterne.',
      '3. **Non aprire `coppie.json`** davanti ai lettori: contiene la chiave.',
      '4. Raccolte le risposte:\n\n   ```bash\n   node evals/blind-kit.mjs --score <dir-del-kit> risposte-*.csv\n   ```\n',
      `5. Bersaglio dichiarato (audit di luglio): preferenza per il braccio con skill **≥ 70%** sulle coppie decise (i «pari» non contano nel rapporto, ma vanno riportati).`,
    ].join('\n'))
    console.log(`\n→ kit in ${outDir}\n  foglio-lettore.md (per i lettori) · risposte.csv (template) · ISTRUZIONI.md · coppie.json (CHIAVE: non mostrarla)`)
    const cost = +pairs.reduce((s, p) => s + p.costUsd, 0).toFixed(4)
    console.log(`  costo API dichiarato: $${cost}`)
    return { outDir, pairs: pairs.length, cost }
  } catch (err) {
    // La directory è stata creata da questa invocazione e non conteneva nulla prima:
    // un kit parziale non deve restare disponibile per errore.
    rmSync(outDir, { recursive: true, force: true })
    throw err
  }
}

// Lettura FAIL-CLOSED delle risposte: intestazione esatta, valori ammessi, un solo
// lettore per file, esattamente una risposta per coppia, nessun lettore duplicato fra
// i file. Un CSV malformato è un errore, mai un dato che entra zitto nell'aggregato.
export function parseAnswers(text, key, fileName) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  if (lines[0] !== 'lettore,coppia,migliore,umana') throw new Error(`${fileName}: intestazione attesa "lettore,coppia,migliore,umana", trovata "${lines[0]}"`)
  const rows = []
  const seen = new Set()
  for (const [i, line] of lines.slice(1).entries()) {
    const parts = parseCsvLine(line).map(s => s.trim())
    if (parts.length !== 4) throw new Error(`${fileName} riga ${i + 2}: attese 4 colonne, trovate ${parts.length}`)
    const [reader, nRaw, migliore, umana] = parts
    if (!reader || reader === 'NOME') throw new Error(`${fileName} riga ${i + 2}: sostituisci "NOME" col nome del lettore`)
    const n = Number(nRaw)
    if (!key[n]) throw new Error(`${fileName} riga ${i + 2}: coppia ${nRaw} sconosciuta al kit`)
    if (seen.has(n)) throw new Error(`${fileName} riga ${i + 2}: coppia ${n} risposta due volte`)
    seen.add(n)
    if (!['1', '2', 'pari'].includes(migliore)) throw new Error(`${fileName} riga ${i + 2}: "migliore" deve essere 1, 2 o pari (trovato "${migliore}")`)
    if (!['1', '2', 'nonso', ''].includes(umana)) throw new Error(`${fileName} riga ${i + 2}: "umana" deve essere 1, 2, nonso o vuota (trovato "${umana}")`)
    rows.push({ reader, n, migliore, umana })
  }
  const readers = new Set(rows.map(r => r.reader))
  if (readers.size !== 1) throw new Error(`${fileName}: un file per lettore — trovati ${[...readers].join(', ')}`)
  const missing = Object.keys(key).map(Number).filter(n => !seen.has(n))
  if (missing.length) throw new Error(`${fileName}: coppie senza risposta: ${missing.join(', ')}`)
  return { reader: [...readers][0], rows }
}

// CSV minimale ma corretto per il formato del kit: supporta campi fra virgolette,
// virgole nei nomi e doppi apici escapati come "".
export function parseCsvLine(line) {
  const fields = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { field += '"'; i++; continue }
      quoted = !quoted
    } else if (ch === ',' && !quoted) {
      fields.push(field)
      field = ''
    } else {
      field += ch
    }
  }
  if (quoted) throw new Error('campo CSV con virgolette non chiuse')
  fields.push(field)
  return fields
}

function score(args, argv) {
  const kitDir = resolve(String(args.score))
  const files = argv.filter(a => !a.startsWith('--') && a !== String(args.score))
  if (!files.length) throw new Error('--score richiede almeno un file di risposte CSV')
  const { pairs } = JSON.parse(readFileSync(join(kitDir, 'coppie.json'), 'utf8'))
  if (!Array.isArray(pairs) || !pairs.length) throw new Error('coppie.json non contiene coppie')
  const key = {}
  for (const p of pairs) {
    if (!Number.isInteger(p.n) || key[p.n]) throw new Error(`coppie.json: numero coppia non valido o duplicato (${p.n})`)
    if (![1, 2].includes(p.skillIs)) throw new Error(`coppie.json: skillIs non valido per la coppia ${p.n}`)
    key[p.n] = p.skillIs
  }
  const perReader = []
  const votes = {}   // coppia → {skill, bare, pari}
  const readerNames = new Set()
  for (const f of files) {
    const { reader, rows } = parseAnswers(readFileSync(resolve(f), 'utf8'), key, f)
    const readerKey = reader.toLocaleLowerCase('it')
    if (readerNames.has(readerKey)) throw new Error(`lettore "${reader}" presente in più file: ogni lettore risponde una volta sola`)
    readerNames.add(readerKey)
    let skill = 0, bare = 0, pari = 0, humanSkill = 0, humanAnswered = 0
    for (const { n, migliore, umana } of rows) {
      const k = key[n]
      votes[n] ??= { skill: 0, bare: 0, pari: 0 }
      if (migliore === 'pari') { pari++; votes[n].pari++ }
      else if (Number(migliore) === k) { skill++; votes[n].skill++ }
      else { bare++; votes[n].bare++ }
      if (umana === '1' || umana === '2') { humanAnswered++; if (Number(umana) === k) humanSkill++ }
    }
    const decided = skill + bare
    perReader.push({ file: f, reader, skill, bare, pari, rate: decided ? +(skill / decided).toFixed(3) : null, humanSkill, humanAnswered })
  }
  if (perReader.length < 3) throw new Error(`il protocollo richiede almeno 3 lettori unici (ricevuti ${perReader.length})`)
  const tot = perReader.reduce((a, r) => ({ skill: a.skill + r.skill, bare: a.bare + r.bare, pari: a.pari + r.pari, humanSkill: a.humanSkill + r.humanSkill, humanAnswered: a.humanAnswered + r.humanAnswered }), { skill: 0, bare: 0, pari: 0, humanSkill: 0, humanAnswered: 0 })
  const decided = tot.skill + tot.bare
  const L = []
  L.push('# Esito del confronto cieco\n')
  for (const r of perReader) L.push(`- ${r.file}: skill ${r.skill} · senza ${r.bare} · pari ${r.pari}${r.rate !== null ? ` → ${Math.round(r.rate * 100)}% per la skill` : ''} · «umana»: ${r.humanSkill}/${r.humanAnswered} alla skill`)
  L.push(`\n**Aggregato: skill ${tot.skill} · senza ${tot.bare} · pari ${tot.pari} → ${decided ? Math.round((tot.skill / decided) * 100) + '%' : 'n/d'} per la skill sulle coppie decise (bersaglio ≥ 70%)**`)
  L.push(`«Sembra rivista da un umano»: ${tot.humanSkill}/${tot.humanAnswered} alla skill`)
  const contested = Object.entries(votes).filter(([, v]) => v.skill > 0 && v.bare > 0).map(([n]) => `coppia ${n}`)
  if (contested.length) L.push(`\nCoppie contese fra i lettori: ${contested.join(', ')}`)
  const md = L.join('\n')
  writeFileSync(join(kitDir, 'esito.md'), md)
  console.log(md + `\n→ salvato in ${join(kitDir, 'esito.md')}`)
  return { perReader, tot }
}

function nameOf(prompt) {
  return prompt.split('\n')[0].slice(0, 60)
}

function callClaude(prompt, extraFlags, model) {
  const raw = execFileSync(process.env.CLAUDE_BIN || 'claude', ['-p', ...extraFlags, '--model', model, '--output-format', 'json', '--disallowedTools', '*'], {
    input: prompt, cwd: tmpdir(), env: claudeEnv(), encoding: 'utf8', timeout: 300000, maxBuffer: 16 * 1024 * 1024,
  }).trim()
  return parseCliEnvelope(raw)
}

function claudeEnv() {
  const env = { ...process.env }
  delete env.CLAUDECODE
  return env
}

function parseArgs(argv) {
  const o = {}
  const allowed = new Set(['build', 'score', 'seed', 'ids', 'model', 'skill', 'out'])
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const [k, v] = a.slice(2).split('=')
    if (!allowed.has(k)) throw new Error(`flag sconosciuto: --${k}`)
    if (v !== undefined) o[k] = v
    else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) o[k] = argv[++i]
    else o[k] = true
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
