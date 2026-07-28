#!/usr/bin/env node
// Guardia di coerenza della versione dichiarata nei vari canali.
//
// La versione vive in quattro posti che finora erano allineati solo per
// disciplina manuale: il frontmatter di SKILL.md (fonte di verità), i badge
// hardcoded di README/FAQ/ESEMPI e la prima release del CHANGELOG. Questo
// script li confronta e fallisce al primo disallineamento.

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = name => readFileSync(resolve(root, name), 'utf8')

const source = read('SKILL.md').match(/^\s*version:\s*["']?([^"'\s]+)["']?/m)?.[1]
if (!source) {
  console.error('errore: metadata.version non trovata nel frontmatter di SKILL.md')
  process.exit(1)
}

const mismatches = []

for (const name of ['README.md', 'FAQ.md', 'ESEMPI.md']) {
  const badge = read(name).match(/badge\/version-([0-9.]+)-/)?.[1]
  if (!badge) mismatches.push(`${name}: badge di versione non trovato`)
  else if (badge !== source) mismatches.push(`${name}: badge ${badge} ≠ frontmatter ${source}`)
}

const release = read('CHANGELOG.md').match(/^## \[(\d[0-9.]*)\]/m)?.[1]
if (!release) mismatches.push('CHANGELOG.md: nessuna release trovata')
else if (release !== source) mismatches.push(`CHANGELOG.md: prima release ${release} ≠ frontmatter ${source}`)

if (mismatches.length) {
  console.error(`versione frontmatter: ${source}`)
  for (const m of mismatches) console.error(`errore: ${m}`)
  process.exit(1)
}
console.log(`versione coerente: ${source} (frontmatter, badge README/FAQ/ESEMPI, CHANGELOG)`)
