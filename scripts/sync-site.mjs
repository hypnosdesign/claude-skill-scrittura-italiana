#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");
const write = process.argv.includes("--write");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const skill = await readFile(join(root, "SKILL.md"), "utf8");
const style = await readFile(join(root, "references", "stile-naturale.md"), "utf8");
const manifest = JSON.parse(await readFile(join(root, "evals", "manifest.json"), "utf8"));

const version = skill.match(/^\s*version:\s*["']?([^"'\s]+)["']?/m)?.[1];
if (!version) throw new Error("Versione non trovata in SKILL.md");

const controls = [...style.matchAll(/^\*\*(\d+)\./gm)].map((match) => Number(match[1]));
const controlCount = Math.max(...controls);
const invariantCount = [...style.matchAll(/^\*\*\d+\. Invariante\b/gm)].length;
const patternCount = controlCount - invariantCount;
const referenceCount = (await readdir(join(root, "references"))).filter((name) => extname(name) === ".md").length;
const devCount = manifest.evals.filter((item) => item.split === "dev").length;
const heldoutCount = manifest.evals.filter((item) => item.split === "held-out").length;

const values = {
  "project-version": version,
  "pattern-count": String(patternCount),
  "invariant-count": String(invariantCount),
  "control-count": String(controlCount),
  "reference-count": String(referenceCount),
  "dev-count": String(devCount),
  "heldout-count": String(heldoutCount)
};

const htmlFiles = (await readdir(docs)).filter((name) => extname(name) === ".html").sort();
const stale = [];
const broken = [];
const invalid = [];
const pages = new Map();

for (const name of htmlFiles) {
  pages.set(name, await readFile(join(docs, name), "utf8"));
}

for (const name of htmlFiles) {
  const path = join(docs, name);
  let html = pages.get(name);
  const original = html;

  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`(<([a-z][a-z0-9]*)\\b[^>]*\\bdata-${key}\\b[^>]*>)[^<]*(<\\/\\2>)`, "gi");
    html = html.replace(pattern, `$1${value}$3`);
  }

  html = html.replace(/("softwareVersion"\s*:\s*")[^"]+("\s*)/, `$1${version}$2`);

  if (html !== original) {
    if (write) await writeFile(path, html);
    else stale.push(name);
  }

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) invalid.push(`${name}: id duplicati (${[...new Set(duplicateIds)].join(", ")})`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) invalid.push(`${name}: deve contenere un solo h1`);
  if ((html.match(/<main\b/g) ?? []).length !== 1) invalid.push(`${name}: deve contenere un solo main`);
  if (!/<html\s+lang="it">/.test(html)) invalid.push(`${name}: lang italiano assente`);
  if (!/<meta\s+name="description"\s+content="[^"]+">/.test(html)) invalid.push(`${name}: meta description assente`);
  if (!/class="skip-link"/.test(html)) invalid.push(`${name}: skip link assente`);
  if (/[—]/.test(html)) invalid.push(`${name}: contiene un em dash`);
  if (/(?:Fraunces|Newsreader|JetBrains Mono)/.test(html)) invalid.push(`${name}: contiene una famiglia tipografica dismessa`);

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:)/.test(target)) continue;
    const [pathPart, fragment] = target.split("#", 2);
    const local = pathPart.split("?", 1)[0];
    const targetFile = local || name;
    if (local) {
      try {
        await stat(resolve(docs, local));
      } catch {
        broken.push(`${name}: ${target}`);
      }
    }
    if (fragment && extname(targetFile) === ".html") {
      const targetHtml = pages.get(targetFile);
      if (targetHtml && !new RegExp(`\\bid="${escapeRegExp(fragment)}"`).test(targetHtml)) {
        broken.push(`${name}: frammento non trovato in ${target}`);
      }
    }
  }
}

const result = {
  version,
  patternCount,
  invariantCount,
  controlCount,
  referenceCount,
  devCount,
  heldoutCount,
  htmlFiles: htmlFiles.length
};

if (write && stale.length === 0) {
  console.log(JSON.stringify({ ...result, updated: true }, null, 2));
} else if (stale.length || broken.length || invalid.length) {
  if (stale.length) console.error(`Dati obsoleti in: ${stale.join(", ")}. Esegui node scripts/sync-site.mjs --write`);
  if (broken.length) console.error(`Link locali non risolti:\n${broken.join("\n")}`);
  if (invalid.length) console.error(`Controlli HTML falliti:\n${invalid.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ...result, status: "ok" }, null, 2));
}
