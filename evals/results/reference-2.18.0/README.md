# Riferimento 2.18.0 — il riposizionamento non costa attivazione

Prodotto il 29 luglio 2026 (settimo audit: comunicazione). L'unica modifica che tocca il
runtime della skill è la **`description` categoria-first** («Skill editoriale per
l'italiano: corregge, chiarisce, riscrive… anche da humanizer…», 853 caratteri): la
domanda di misura è se il riordino costi attivazione.

## `attivazione-positivi/` — 20/20

Con la copia personale spostata fuori da `~/.claude/skills` (assenza **verificata
dall'harness**, meta `personalCopyAbsent: true`): 20 invocazioni osservate su 20 prompt
positivi, **zero ambigue** — 7 attribuzioni `project-read` (letture provate della copia di
progetto) + 13 `project-isolated` (invocazione senza path con omonima personale assente).

## `attivazione-negativi/` — spurie 0/15

Stessi 15 negativi della 2.16.0 (10 storici + 5 di confine, inclusi «Traduci in inglese»,
estrazione dati, riassunto EN→EN): zero attivazioni.

## Riproduzione

```bash
# spostare prima la copia personale fuori da ~/.claude/skills (l'harness verifica)
node evals/activation.mjs --kind positive
node evals/activation.mjs --kind negative
```

⚠ n=1 per caso, modello `claude-sonnet-5`, CLI 2.1.220: fotografia del client, non
proprietà stabile. Costi dichiarati: $4.85 + $1.02.
