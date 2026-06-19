#!/usr/bin/env node
// package-skill.mjs — Crea il pacchetto-skill caricabile su Claude Desktop / claude.ai.
//
// Lo zip "Source code" di GitHub contiene TUTTO il repo (evals, docs, script, GIF) e
// include l'artefatto `evals/results/.../skill.md`: su filesystem case-insensitive (macOS)
// vale come secondo `SKILL.md`, e l'uploader rifiuta lo zip («exactly one SKILL.md»).
// Questo script produce invece il payload pulito: SOLO `SKILL.md` + `references/`, alla
// radice dello zip, con un unico SKILL.md.
//
// Uso (manutentori, a ogni release):
//   node scripts/package-skill.mjs
//   gh release upload vX.Y.Z dist/scrittura-italiana-X.Y.Z.zip
//
// Output: dist/scrittura-italiana-<versione>.zip  (dist/ è gitignored)

import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = dirname(dirname(fileURLToPath(import.meta.url)));
const skill = join(repo, "SKILL.md");
const refs = join(repo, "references");

// — preflight —
if (!existsSync(skill)) fail(`manca SKILL.md in ${repo}`);
if (!existsSync(refs)) fail(`manca references/ in ${repo}`);

const fm = readFileSync(skill, "utf8").split(/^---$/m)[1] ?? "";
const version = (fm.match(/version:\s*"?(\d+\.\d+\.\d+)"?/) ?? [])[1];
if (!version) fail("versione non trovata nel frontmatter di SKILL.md (metadata.version)");

// — staging: solo il payload, alla radice —
const stage = mkdtempSync(join(tmpdir(), "skill-pkg-"));
cpSync(skill, join(stage, "SKILL.md"));
cpSync(refs, join(stage, "references"), { recursive: true });

const dist = join(repo, "dist");
mkdirSync(dist, { recursive: true });
const out = join(dist, `scrittura-italiana-${version}.zip`);
rmSync(out, { force: true });

// `zip` è standard su macOS/Linux; -X niente metadati extra, escludi i .DS_Store
execSync(`zip -rX "${out}" SKILL.md references -x '*.DS_Store'`, { cwd: stage, stdio: "pipe" });
rmSync(stage, { recursive: true, force: true });

// — verifica: esattamente un SKILL.md (case-insensitive) —
const listing = execSync(`unzip -l "${out}"`, { encoding: "utf8" });
const skillCount = (listing.match(/^\s*\d+.*\bskill\.md\b/gim) ?? []).length;
if (skillCount !== 1) fail(`lo zip contiene ${skillCount} SKILL.md (atteso 1)`);

const kb = Math.round(statSync(out).size / 1024);
const files = (listing.match(/\.md$/gim) ?? []).length;
console.log(`✓ ${out}`);
console.log(`  versione ${version} · ${files} file .md (SKILL.md + ${files - 1} reference) · ${kb} KB · un solo SKILL.md`);

function fail(msg) {
  console.error(`✗ package-skill: ${msg}`);
  process.exit(1);
}
