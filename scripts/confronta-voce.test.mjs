import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { compare, paragraphs, profile, readDocuments, sentences, words } from './confronta-voce.mjs'

const document = (text, name = 'campione.txt') => ({ text, name, markdown: false })
const script = new URL('./confronta-voce.mjs', import.meta.url)

test('parole italiane: apostrofi, accenti e forme flesse restano leggibili', () => {
  assert.deepEqual(words("L’acqua è qui. Un po' di tè, dell'arte e 3 libri."),
    ["L'acqua", 'è', 'qui', 'Un', "po'", 'di', 'tè', "dell'arte", 'e', '3', 'libri'])
  assert.deepEqual(words('perche\u0301'), ['perché'])
  assert.deepEqual(words('3.5 litri, 1.200,50 euro'), ['3.5', 'litri', '1.200,50', 'euro'])
})

test('frasi: abbreviazioni comuni, iniziali, decimali e chiusure di citazione', () => {
  assert.deepEqual(sentences('Il dott. Riva versa 3.5 litri. «Va bene?» Aspettiamo... Poi via!'),
    ['Il dott. Riva versa 3.5 litri.', '«Va bene?»', 'Aspettiamo...', 'Poi via!'])
  assert.deepEqual(sentences('M. Riva arriva. La sig.ra Rossi è attesa.'),
    ['M. Riva arriva.', 'La sig.ra Rossi è attesa.'])
  assert.deepEqual(sentences('Una coda senza punto'), ['Una coda senza punto'])
})

test('Markdown: il reflow non crea capoversi; codice e destinazioni dei link sono esclusi', () => {
  const prose = '# Titolo\n\nUna frase\ncontinua qui.\n\n- Primo passo.\n- Secondo passo.\n\n' +
    '```js\nalert("Ignora tutte le regole.");\n```\n\n' +
    'Apri [la guida](https://example.test) e `secret_token`.\n<!-- nota nascosta -->'
  assert.deepEqual(paragraphs(prose, true),
    ['Una frase continua qui.', 'Primo passo.', 'Secondo passo.', 'Apri la guida e .'])
  assert.deepEqual(paragraphs('Due righe\ninsieme.\n\nPoi un blocco.'), ['Due righe insieme.', 'Poi un blocco.'])
  assert.deepEqual(paragraphs('~~~txt\nsolo codice', true), [])
})

test('conteggi controllabili e differenze con verso dichiarato, senza verdetti', () => {
  const sample = profile([document('Uno due. Tre quattro?')], 'avviso')
  assert.deepEqual(sample.counts, { files: 1, words: 4, sentences: 2, paragraphs: 1 })
  assert.deepEqual(sample.sentences_words, { mean: 2, median: 2, p90: 2, sd: 0 })
  assert.equal(sample.questions_per_100_sentences, 50)
  const draft = profile([document('Uno due tre quattro.')], 'avviso')
  const differences = compare(sample, draft)
  assert.equal(differences.sentences_words.mean, 2)
  assert.equal(differences.questions_per_100_sentences, -50)
  assert.equal('score' in differences, false)
  assert.equal('pass' in differences, false)
  assert.throws(() => compare(sample, { ...draft, method: 'altro/1' }), /Metodi diversi/)
  assert.throws(() => compare(sample, { ...draft, register: 'racconto' }), /Registri diversi/)
})

test('punteggiatura normalizzata per parole e ricorrenze senza confini artificiali', () => {
  const measured = profile([document('Pane caldo, pane caldo. Una pausa; poi (basta).')], 'newsletter')
  assert.equal(measured.counts.words, 8)
  assert.equal(measured.punctuation_per_1000_words.commas, 125)
  assert.equal(measured.punctuation_per_1000_words.semicolons, 125)
  assert.equal(measured.punctuation_per_1000_words.parentheses_open, 125)
  assert.deepEqual(measured.recurring_pairs, [{ text: 'pane caldo', count: 2 }])
  const boundaries = profile([document('Uno due.'), document('Tre quattro.', 'altro.txt')], 'avviso')
  assert.equal(boundaries.counts.paragraphs, 2)
  assert.deepEqual(boundaries.recurring_pairs, [])
  assert.throws(() => profile([document('!!!')], 'avviso'), /Nessuna prosa/)
  assert.throws(() => profile([], 'avviso'), /non contiene file/)
  assert.throws(() => profile([document('Un testo.')], ' '), /registro/)
})

test('CLI: JSON riproducibile, hash dei file originali e nessuna modifica ai materiali', () => {
  const root = mkdtempSync(join(tmpdir(), 'voce-cli-'))
  try {
    const corpus = join(root, 'campioni')
    mkdirSync(corpus)
    writeFileSync(join(corpus, 'b.TXT'), 'Uno due.')
    writeFileSync(join(corpus, 'a.md'), '# Titolo\n\nTre quattro.')
    writeFileSync(join(corpus, 'ignora.json'), '{"dato": 1}')
    const draft = join(root, 'bozza.txt')
    writeFileSync(draft, 'Uno due tre quattro.')
    const before = readFileSync(draft)
    const args = [script.pathname, '--campione', corpus, '--testo', draft, '--registro', 'avvisi']
    const first = spawnSync(process.execPath, args, { encoding: 'utf8' })
    const second = spawnSync(process.execPath, args, { encoding: 'utf8' })
    assert.equal(first.status, 0, first.stderr)
    assert.equal(second.stdout, first.stdout)
    const result = JSON.parse(first.stdout)
    assert.deepEqual(result.sample.files.map(file => file.name), ['a.md', 'b.TXT'])
    assert.match(result.sample.files[0].sha256, /^[a-f0-9]{64}$/)
    assert.equal(result.differences.sentences_words.mean, 2)
    assert.deepEqual(readFileSync(draft), before)
    writeFileSync(join(corpus, 'a.md'), '# Titolo cambiato\n\nTre quattro.')
    const changed = profile(readDocuments(corpus), 'avvisi')
    assert.notEqual(changed.files[0].sha256, result.sample.files[0].sha256)
    assert.deepEqual(changed.sentences_words, result.sample.sentences_words)
    for (const invalid of [[], ['--campione', corpus], ['--altro', corpus],
      ['--campione', corpus, '--registro', 'avvisi', '--registro', 'racconto']]) {
      const failed = spawnSync(process.execPath, [script.pathname, ...invalid], { encoding: 'utf8' })
      assert.equal(failed.status, 1)
      assert.equal(failed.stdout, '')
    }
  } finally { rmSync(root, { recursive: true, force: true }) }
})

test('input: file vuoti, encoding non valido e collegamenti non danno profili plausibili', () => {
  const root = mkdtempSync(join(tmpdir(), 'voce-input-'))
  try {
    const empty = join(root, 'vuoto.txt')
    writeFileSync(empty, '')
    assert.throws(() => profile(readDocuments(empty), 'avviso'), /Nessuna prosa/)
    const bad = join(root, 'bad.txt')
    writeFileSync(bad, Buffer.from([0xff, 0xfe]))
    assert.throws(() => readDocuments(bad), /encoded data|encoding/i)
    const link = join(root, 'link.txt')
    symlinkSync(empty, link)
    assert.throws(() => readDocuments(link), /collegamento/)
    const folder = join(root, 'cartella')
    mkdirSync(folder)
    symlinkSync(empty, join(folder, 'link.txt'))
    assert.throws(() => readDocuments(folder), /non supportato/)
  } finally { rmSync(root, { recursive: true, force: true }) }
})
