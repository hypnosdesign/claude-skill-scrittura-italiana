#!/usr/bin/env node
// Guardia sulla lunghezza della `description` nel frontmatter di SKILL.md.
//
// Il caricamento delle Skill su Claude Desktop/claude.ai impone un limite di 1024
// caratteri, ma il validatore conta in modo più severo del semplice parse YAML:
// una description da ~936 caratteri parsati è già stata rifiutata in passato,
// mentre ~880 è passata. Soglia prudenziale: 900.

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const LIMIT = 900
const skillPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'SKILL.md')
const text = readFileSync(skillPath, 'utf8')

const fm = text.match(/^---\n([\s\S]*?)\n---\n/)
if (!fm) {
  console.error('errore: frontmatter non trovato in SKILL.md')
  process.exit(1)
}
const dm = fm[1].match(/description: \|\n((?: {2}.*\n)+)/)
if (!dm) {
  console.error('errore: description (blocco letterale "|") non trovata nel frontmatter')
  process.exit(1)
}
const desc = dm[1]
  .split('\n')
  .map(line => line.replace(/^ {2}/, ''))
  .join('\n')
  .trimEnd()
const n = desc.length

console.log(`description: ${n} caratteri (soglia ${LIMIT}, limite hard 1024)`)
if (n > LIMIT) {
  console.error(`errore: description oltre la soglia prudenziale (${n} > ${LIMIT})`)
  process.exit(1)
}
