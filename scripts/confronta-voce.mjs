#!/usr/bin/env node
// Conteggi descrittivi su campioni indicati dall'utente. Nessuna riscrittura o scrittura su disco.
import { createHash } from 'node:crypto'
import { lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const METHOD = 'scrittura-voce/1'
const extensions = new Set(['.txt', '.md', '.markdown'])
const abbreviations = new Set(['sig', 'sig.ra', 'dott', 'prof', 'avv', 'art', 'pag', 'cfr', 'ecc'])
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const round = value => Math.round(value * 1000) / 1000
const mean = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
const rate = (count, words) => round(count * 1000 / words)

export function words(text) {
  return text.normalize('NFC').replace(/[’ʼ]/gu, "'")
    .match(/\p{N}+(?:[.,]\p{N}+)*|[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*'?/gu) ?? []
}

export function paragraphs(text, markdown = false) {
  const blocks = []
  let lines = []
  let fence = null
  const flush = () => {
    if (lines.length) blocks.push(lines.join(' '))
    lines = []
  }
  const source = text.replace(/\r\n?/gu, '\n')
  const cleaned = markdown ? source.replace(/<!--[\s\S]*?-->/gu, '') : source
  for (let line of cleaned.split('\n')) {
    if (markdown) {
      const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/u)?.[1]
      if (fence) {
        if (marker && marker[0] === fence[0] && marker.length >= fence.length &&
            /^\s{0,3}(?:`+|~+)\s*$/u.test(line)) fence = null
        continue
      }
      if (marker) { flush(); fence = marker; continue }
      if (/^\s{0,3}#{1,6}\s|^\s*(?:[-*_]\s*){3,}$/u.test(line)) { flush(); continue }
      // Gli URL restano fuori dai conteggi; il testo visibile del link resta.
      line = line.replace(/(`+)[\s\S]*?\1/gu, '').replace(/!?\[([^\]]*)\]\([^)]*\)/gu, '$1')
      line = line.replace(/https?:\/\/\S+/gu, '').replace(/^\s*>\s?/u, '')
      if (/^\s*(?:[-+*]|\d+[.)])\s+/u.test(line)) {
        flush()
        line = line.replace(/^\s*(?:[-+*]|\d+[.)])\s+/u, '')
      }
    }
    if (!line.trim()) flush()
    else lines.push(line.trim())
  }
  flush()
  return blocks.filter(block => words(block).length)
}

export function sentences(text) {
  const result = []
  let start = 0
  for (let index = 0; index < text.length; index++) {
    if (!/[.!?]/u.test(text[index])) continue
    if (text[index] === '.') {
      if (/\d/u.test(text[index - 1] ?? '') && /\d/u.test(text[index + 1] ?? '')) continue
      const token = text.slice(start, index).match(/([\p{L}.]+)$/u)?.[1] ?? ''
      if (abbreviations.has(token.toLocaleLowerCase('it')) || /^\p{Lu}$/u.test(token)) continue
    }
    let end = index + 1
    while (end < text.length && /[.!?"'”’»)]/u.test(text[end])) end++
    if (end < text.length && !/\s/u.test(text[end])) continue
    const sentence = text.slice(start, end).trim()
    if (words(sentence).length) result.push(sentence)
    start = end
    index = end - 1
  }
  const last = text.slice(start).trim()
  if (words(last).length) result.push(last)
  return result
}

function distribution(values) {
  const average = mean(values)
  if (average === null) return { mean: null, median: null, p90: null, sd: null }
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return {
    mean: round(average),
    median: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
    p90: sorted[Math.ceil(sorted.length * 0.9) - 1],
    sd: round(Math.sqrt(mean(values.map(value => (value - average) ** 2))))
  }
}

export function profile(documents, register) {
  if (!register?.trim()) throw new Error('Indica il registro dei materiali con --registro.')
  if (!documents.length) throw new Error('Il campione non contiene file utilizzabili.')
  const blocks = []
  const phrases = []
  const repeats = new Map()
  const files = []
  for (const document of documents) {
    const extracted = paragraphs(document.text, document.markdown)
    if (!extracted.length) throw new Error(`Nessuna prosa utilizzabile in ${document.name}.`)
    blocks.push(...extracted)
    for (const block of extracted) {
      const split = sentences(block)
      phrases.push(...split)
      // Nessuna ricorrenza attraversa un confine di frase, paragrafo o file.
      for (const phrase of split) {
        const tokens = words(phrase).map(word => word.toLocaleLowerCase('it'))
        for (let index = 0; index + 1 < tokens.length; index++) {
          const pair = tokens.slice(index, index + 2).join(' ')
          repeats.set(pair, (repeats.get(pair) ?? 0) + 1)
        }
      }
    }
    files.push({ name: document.name, sha256: document.sha256 ?? hash(Buffer.from(document.text)),
      words: extracted.reduce((total, block) => total + words(block).length, 0) })
  }
  const text = blocks.join('\n\n')
  const totalWords = files.reduce((total, file) => total + file.words, 0)
  const sentenceLengths = phrases.map(phrase => words(phrase).length)
  const punctuation = Object.fromEntries([
    ['commas', /,/gu], ['semicolons', /;/gu], ['colons', /:/gu],
    ['parentheses_open', /\(/gu], ['dashes', /[–—]/gu]
  ].map(([name, pattern]) => [name, rate((text.match(pattern) ?? []).length, totalWords)]))
  return {
    method: METHOD,
    register: register.trim(),
    files,
    counts: { files: files.length, words: totalWords, sentences: phrases.length, paragraphs: blocks.length },
    sentences_words: distribution(sentenceLengths),
    paragraphs_words: distribution(blocks.map(block => words(block).length)),
    questions_per_100_sentences: round(phrases.filter(phrase => /\?["'”’»)]*$/u.test(phrase)).length * 100 / phrases.length),
    punctuation_per_1000_words: punctuation,
    recurring_pairs: [...repeats.entries()].filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      .slice(0, 10).map(([text, count]) => ({ text, count })),
    notes: [
      ...(phrases.length < 20 ? ['Campione breve: meno di 20 frasi, descrizione circoscritta ai materiali forniti.'] : []),
      'Registro dichiarato, non verificato automaticamente. Conteggi euristici, senza lemmatizzazione.',
      'Le misure non attestano qualità, autenticità o rappresentatività della voce.'
    ]
  }
}

export function compare(sample, draft) {
  if (sample.method !== draft.method) throw new Error('Metodi diversi: ricalcola entrambi i profili.')
  if (sample.register !== draft.register) throw new Error('Registri diversi: confronta materiali dello stesso contesto.')
  const delta = (left, right) => Object.fromEntries(Object.keys(left).map(key =>
    [key, left[key] === null || right[key] === null ? null : round(right[key] - left[key])]))
  return {
    direction: 'testo meno campione; nessuna soglia di conformità',
    sentences_words: delta(sample.sentences_words, draft.sentences_words),
    paragraphs_words: delta(sample.paragraphs_words, draft.paragraphs_words),
    punctuation_per_1000_words: delta(sample.punctuation_per_1000_words, draft.punctuation_per_1000_words),
    questions_per_100_sentences: round(draft.questions_per_100_sentences - sample.questions_per_100_sentences)
  }
}

export function readDocuments(input) {
  const path = resolve(input)
  const info = lstatSync(path)
  if (info.isSymbolicLink()) throw new Error('Indica un file o una cartella reale, non un collegamento simbolico.')
  let paths
  if (info.isFile()) paths = [path]
  else if (info.isDirectory()) paths = readdirSync(path).sort().map(name => join(path, name))
    .filter(file => extensions.has(extname(file).toLowerCase()))
  else throw new Error('Il percorso deve indicare un file regolare o una cartella.')
  if (!paths.length) throw new Error('Nessun file .txt, .md o .markdown nella cartella.')
  return paths.map(file => {
    const stat = lstatSync(file)
    if (!stat.isFile() || stat.isSymbolicLink() || !extensions.has(extname(file).toLowerCase())) {
      throw new Error(`File non supportato: ${basename(file)}.`)
    }
    const bytes = readFileSync(file)
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return { name: basename(file), sha256: hash(bytes), text, markdown: extname(file).toLowerCase() !== '.txt' }
  })
}

const help = `Uso (Node.js 22+):
  node scripts/confronta-voce.mjs --campione FILE_O_CARTELLA --registro ETICHETTA
  node scripts/confronta-voce.mjs --campione FILE_O_CARTELLA --testo FILE_O_CARTELLA --registro ETICHETTA
JSON su standard output. Nessun file viene scritto. Usa materiali dello stesso registro.
`

export function main(args = process.argv.slice(2)) {
  if (args.length === 1 && args[0] === '--help') { process.stdout.write(help); return }
  const options = {}
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index]
    const value = args[index + 1]
    if (!['--campione', '--testo', '--registro'].includes(option) || !value || value.startsWith('--') || options[option]) {
      throw new Error(`Argomento non valido o ripetuto: ${option}. Usa --help.`)
    }
    options[option] = value
  }
  if (!options['--campione'] || !options['--registro']) throw new Error('Servono --campione e --registro. Usa --help.')
  const sample = profile(readDocuments(options['--campione']), options['--registro'])
  const draft = options['--testo'] ? profile(readDocuments(options['--testo']), options['--registro']) : null
  process.stdout.write(JSON.stringify({ schema_version: 1, sample, ...(draft ? { draft, differences: compare(sample, draft) } : {}) }, null, 2) + '\n')
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try { main() } catch (error) { console.error(`confronta-voce: ${error.message}`); process.exitCode = 1 }
}
