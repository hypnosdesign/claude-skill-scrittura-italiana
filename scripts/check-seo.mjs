#!/usr/bin/env node
// Controlli dei metadati statici del sito, senza servizi o credenziali esterne.
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BASE = 'https://hypnosdesign.github.io/claude-skill-scrittura-italiana/';
const decode = value => value?.replace(/&(?:amp|quot|apos|lt|gt|#39|#x27);/g, entity => ({
  '&amp;': '&', '&quot;': '"', '&apos;': "'", '&#39;': "'", '&#x27;': "'", '&lt;': '<', '&gt;': '>'
})[entity]);
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)]
  .map(([, key, value]) => [key, decode(value)]));

export function checkSeo(root) {
  const docs = join(root, 'docs');
  const version = readFileSync(join(root, 'SKILL.md'), 'utf8').match(/^\s*version:\s*"([^"]+)"/m)?.[1];
  const files = readdirSync(docs).filter(name => name.endsWith('.html')).sort();
  const errors = [], titles = new Set(), descriptions = new Set(), nodes = new Map(), expectedUrls = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  for (const name of files) {
    const html = readFileSync(join(docs, name), 'utf8');
    const expected = BASE + (name === 'index.html' ? '' : name);
    expectedUrls.push(expected);
    const meta = new Map([...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => {
      const attrs = attributes(tag); return [attrs.name ?? attrs.property, attrs.content];
    }));
    const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1]);
    const description = meta.get('description');
    check(title && !titles.has(title), `${name}: title mancante o duplicato`);
    check(description && !descriptions.has(description), `${name}: description mancante o duplicata`);
    titles.add(title); descriptions.add(description);
    const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .filter(attrs => attrs.rel === 'canonical');
    check(canonicals.length === 1 && canonicals[0].href === expected, `${name}: canonical errato`);
    check(!/\bnoindex\b/i.test(meta.get('robots') ?? ''), `${name}: noindex presente`);
    for (const [key, value] of [['og:title', title], ['twitter:title', title],
      ['og:description', description], ['twitter:description', description], ['og:url', expected],
      ['og:image', BASE + 'assets/og-image.png'], ['twitter:image', BASE + 'assets/og-image.png'],
      ['twitter:card', 'summary_large_image'], ['og:locale', 'it_IT'], ['og:image:width', '1200'],
      ['og:image:height', '630']]) {
      check(meta.get(key) === value, `${name}: ${key} assente o incoerente`);
    }
    check(meta.get('og:image:alt') && meta.get('twitter:image:alt'), `${name}: testo alternativo social assente`);
    try {
      const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      check(scripts.length === 1, `${name}: serve un blocco JSON-LD`);
      const schema = JSON.parse(scripts[0][1]);
      check(schema['@context'] === 'https://schema.org', `${name}: contesto JSON-LD errato`);
      const page = schema['@graph'].find(node => node['@type'] === 'WebPage');
      check(page?.url === expected && page.name === title && page.description === description &&
        page.inLanguage === 'it' && page.isPartOf?.['@id'] === BASE + '#sito' &&
        page.about?.['@id'] === BASE + '#skill', `${name}: WebPage incoerente con i metadati`);
      for (const node of schema['@graph']) {
        check(!nodes.has(node['@id']), `${name}: identificatore JSON-LD duplicato`);
        nodes.set(node['@id'], node);
      }
    } catch (error) { errors.push(`${name}: JSON-LD non valido (${error.message})`); }
  }
  const site = nodes.get(BASE + '#sito'), skill = nodes.get(BASE + '#skill');
  check(site?.['@type'] === 'WebSite' && site.url === BASE, 'WebSite assente o incoerente');
  check(skill?.['@type'] === 'CreativeWork' && skill.version === version && skill.encodingFormat === 'text/markdown',
    'Risorsa editoriale o versione JSON-LD incoerente');
  for (const node of nodes.values()) {
    for (const property of ['isPartOf', 'about']) {
      if (node[property]) check(nodes.has(node[property]['@id']), `Riferimento JSON-LD non risolto: ${node[property]['@id']}`);
    }
  }
  const sitemap = readFileSync(join(docs, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url)).sort();
  check(JSON.stringify(urls) === JSON.stringify(expectedUrls.sort()), 'Sitemap diversa dagli URL canonici del sito');
  const png = readFileSync(join(docs, 'assets/og-image.png'));
  check(png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, 'Immagine social: formato o dimensioni incoerenti');
  return { pages: files.length, errors };
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const result = checkSeo(join(dirname(fileURLToPath(import.meta.url)), '..'));
  if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1; }
  else console.log(`SEO verificata: ${result.pages} pagine, metadati, JSON-LD, anteprime e sitemap coerenti.`);
}
