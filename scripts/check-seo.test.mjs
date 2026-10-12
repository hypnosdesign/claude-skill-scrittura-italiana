import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkSeo } from './check-seo.mjs';

test('SEO: il gate individua regressioni di canonical, social, JSON-LD e sitemap', () => {
  const root = mkdtempSync(join(tmpdir(), 'scrittura-seo-'));
  try {
    cpSync(new URL('../docs', import.meta.url), join(root, 'docs'), { recursive: true });
    cpSync(new URL('../SKILL.md', import.meta.url), join(root, 'SKILL.md'));
    assert.deepEqual(checkSeo(root).errors, []);
    const page = join(root, 'docs/installazione.html'), original = readFileSync(page, 'utf8');
    for (const [mutate, expected] of [
      [html => html.replace('rel="canonical"', 'rel="alternate"'), /canonical errato/],
      [html => html.replace('property="og:image"', 'property="image"'), /og:image assente/],
      [html => html.replace('"@context":', 'invalid "@context":'), /JSON-LD non valido/],
      [html => html.replace('"#skill"', '"#missing"').replace('/#skill', '/#missing'), /WebPage incoerente|Riferimento JSON-LD/],
      [html => html.replace('<head>', '<head><meta name="robots" content="noindex">'), /noindex presente/]
    ]) {
      writeFileSync(page, mutate(original));
      assert.match(checkSeo(root).errors.join('\n'), expected);
    }
    writeFileSync(page, original);
    const sitemap = join(root, 'docs/sitemap.xml');
    writeFileSync(sitemap, readFileSync(sitemap, 'utf8').replace('metodo.html', 'pagina-assente.html'));
    assert.match(checkSeo(root).errors.join('\n'), /Sitemap diversa/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
