import test from 'node:test'
import assert from 'node:assert/strict'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

test('sync-site --write aggiorna i dati ma non nasconde errori HTML o link rotti', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-site-sync-'))
  try {
    for (const dir of ['scripts', 'docs', 'references', 'evals']) mkdirSync(join(root, dir))
    cpSync(new URL('./sync-site.mjs', import.meta.url), join(root, 'scripts/sync-site.mjs'))
    writeFileSync(join(root, 'SKILL.md'), '---\nmetadata:\n  version: "2.19.1"\n---\n')
    writeFileSync(join(root, 'references/stile-naturale.md'), '**1. Pattern.**\n')
    writeFileSync(join(root, 'evals/manifest.json'), '{"evals":[{"split":"dev"}]}')
    const html = '<html lang="it"><head><meta name="description" content="Prova"></head><body>' +
      '<a class="skip-link" href="#main">Salta</a><main id="main"><h1>Prova</h1>' +
      '<span data-project-version>old</span></main></body></html>'
    const page = join(root, 'docs/index.html')
    const run = (...args) => spawnSync(process.execPath, [join(root, 'scripts/sync-site.mjs'), ...args], { encoding: 'utf8' })
    writeFileSync(page, html)
    assert.equal(run().status, 1, 'i dati obsoleti sono segnalati')
    assert.equal(run('--write').status, 0)
    assert.match(readFileSync(page, 'utf8'), /data-project-version>2\.19\.1/)
    assert.equal(run().status, 0)
    for (const bad of [html.replace('</main>', '<h1>Duplicato</h1></main>'),
      html.replace('</main>', '<a href="inesistente.html">Link</a></main>')]) {
      writeFileSync(page, bad)
      const result = run('--write')
      assert.equal(result.status, 1, 'anche dopo la sincronizzazione il gate deve fallire')
      assert.doesNotMatch(result.stdout, /"updated": true/)
    }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
