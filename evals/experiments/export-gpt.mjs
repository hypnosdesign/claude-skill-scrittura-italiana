#!/usr/bin/env node
// Esporta le prove senza i metadati personali presenti nel transcript nativo.
// Il transcript originale resta nella directory locale, identificato per SHA-256.
import { mkdirSync, existsSync, readFileSync, writeFileSync, cpSync, readdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { hash } from '../codex-client.mjs'

const args = process.argv.slice(2)
if (args.length !== 2) throw new Error('indicare sorgente e destinazione nuova')
const [source, destination] = args.map(p => resolve(p))
if (existsSync(destination)) throw new Error('la destinazione deve essere nuova')
const read = path => JSON.parse(readFileSync(path, 'utf8'))
const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n')
const plan = read(join(source, 'plan.json'))
mkdirSync(destination, { recursive: true })
for (const [file, expected] of Object.entries(plan.files)) {
  if (file.startsWith('/') || file.split('/').includes('..')) throw new Error('path non valido')
  if (hash(readFileSync(join(source, file))) !== expected) throw new Error(`snapshot alterato: ${file}`)
  mkdirSync(dirname(join(destination, file)), { recursive: true })
  cpSync(join(source, file), join(destination, file), { recursive: true })
}
cpSync(join(source, 'plan.json'), join(destination, 'plan.json'))
const index = []
for (const file of readdirSync(source).filter(f => f.endsWith('.json'))) {
  if (file.endsWith('-summary.json')) {
    cpSync(join(source, file), join(destination, file)); continue
  }
  const data = read(join(source, file))
  if (!data.trace || !data.output) continue
  const receipt = data.trace.find(t => t.direction === 'receive' && t.message.id === 2 && t.message.result)?.message.result
  if (!receipt || receipt.model !== data.model) throw new Error(`ricevuta mancante o incoerente: ${file}`)
  const { fingerprint, output, model, modelProvider, version, policy, usage, reads, durationMs, costUsd, costNote } = data
  const record = { fingerprint, output, model, modelProvider, version, policy, usage, reads, durationMs, costUsd, costNote,
    instructionHashes: Object.values(data.instructionHashes),
    confirmed: { model: receipt.model, modelProvider: receipt.modelProvider,
      approvalPolicy: receipt.approvalPolicy, sandbox: receipt.sandbox, reasoningEffort: receipt.reasoningEffort },
    rawSha256: hash(readFileSync(join(source, file))),
    exportNote: 'Estratto: transcript, stderr, ID e percorsi personali omessi. Non è un artefatto di resume.' }
  save(join(destination, file), record)
  index.push({ file, rawSha256: record.rawSha256, exportedSha256: hash(readFileSync(join(destination, file))) })
}
save(join(destination, 'export-index.json'), index)
console.log(`${index.length} chiamate esportate in ${destination}`)
