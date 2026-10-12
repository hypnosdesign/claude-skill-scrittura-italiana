import test from 'node:test'
import assert from 'node:assert/strict'
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

test('ZIP: una skill, riferimenti e misuratore eseguibile; eval e test restano esclusi', () => {
  const root = mkdtempSync(join(tmpdir(), 'voce-package-'))
  try {
    for (const dir of ['scripts', 'references', 'evals']) mkdirSync(join(root, dir))
    for (const name of ['package-skill.mjs', 'confronta-voce.mjs']) {
      cpSync(new URL(name, import.meta.url), join(root, 'scripts', name))
    }
    writeFileSync(join(root, 'scripts', 'confronta-voce.test.mjs'), '// escluso')
    writeFileSync(join(root, 'SKILL.md'), '---\nmetadata:\n  version: "0.0.1"\n---\n# Skill\n')
    writeFileSync(join(root, 'references', 'voce-autore.md'), '# Profilo\n')
    writeFileSync(join(root, 'evals', 'SKILL.md'), '# Non distribuire\n')
    execFileSync(process.execPath, [join(root, 'scripts', 'package-skill.mjs')])
    const zip = join(root, 'dist', 'scrittura-italiana-0.0.1.zip')
    const names = execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).trim().split('\n')
    assert.deepEqual(names.filter(name => !name.endsWith('/')).sort(),
      ['SKILL.md', 'references/voce-autore.md', 'scripts/confronta-voce.mjs'])
    const unpacked = join(root, 'unpacked')
    execFileSync('unzip', ['-q', zip, '-d', unpacked])
    const corpus = join(root, 'prosa.txt')
    writeFileSync(corpus, 'La porta apre. Poi chiude.')
    const output = execFileSync(process.execPath, [join(unpacked, 'scripts/confronta-voce.mjs'),
      '--campione', corpus, '--registro', 'avviso'], { encoding: 'utf8' })
    assert.equal(JSON.parse(output).sample.counts.sentences, 2)
  } finally { rmSync(root, { recursive: true, force: true }) }
})
