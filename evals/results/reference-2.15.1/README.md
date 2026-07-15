# Riferimento 2.15.1 — chiusura del backlog di giugno

Prodotta il 15 luglio 2026, coda dell'audit `AUDIT-2026-07`. Editor `claude-sonnet-5`,
giudice `claude-opus-4-8`, n=1 per cella. **Nessuno skew di provenienza:** le due suite
hanno misurato il single-file poi committato (sha256 `c9d3ef4a…`), l'harness di attivazione
lo `SKILL.md` poi committato (sha256 `b1abb957…`).

Le modifiche misurate sono quattro, tutte nel nucleo: `sé stesso` qualificato come norma
oscillante, precetto virgolette distinto in produzione vs rispetto dello stile esistente,
riga di instradamento «spiegare / divulgare (anche breve)», clausola di brevità nel
contratto di lettura.

## `activation-2.15.1/` — instradamento 6/6 (dal 3/6 della baseline 2.13.1)

| caso | riferimento atteso | letto | hit |
|---|---|---|---|
| 31 line edit tesi | stile-naturale | stile-naturale | ✔ |
| 32 d eufonica | dubbi-e-errori | dubbi-e-errori (+cliché) | ✔ |
| 33 virgolette libro | punteggiatura | punteggiatura | ✔ |
| **34 discorso d'occasione** | retorica-efficacia o stile-naturale | **retorica-efficacia** | **✔** |
| **35 spiegare divulgativo** | spiegare-con-chiarezza | **spiegare-con-chiarezza** | **✔** |
| 36 apertura racconto | narrativa | narrativa | ✔ |

#34 e #35 erano il residuo noto (si attivavano e rispondevano in 3 turni senza aprire
nulla): #35 cade con la riga dedicata, #34 con la clausola di brevità. Sanity positivi 2/2
(#8 «riassumi», #15 «appunti→email» continuano ad attivare). ⚠ n=1: fotografia, non un
benchmark; la clausola è scritta per categorie, non ricalcata sui prompt di misura (nota di
metodo nel CHANGELOG 2.15.1).

## `conferme-2.15.1/` — 7/7, 0 invenzioni

Stessi casi e stessa suite/giudice delle conferme 2.15.0 (fingerprint nei `meta.json`): qui
il confronto uno-a-uno è lecito. #28 (virgolette curve uniformi) resta PASS anche col
precetto del nucleo riformulato; i canarini di conservazione (#4 chat, #7 doc-tecnica,
#26 istruzioni annidate) non mostrano danni collaterali.

## `heldout-2.15.1/` — 6/6, 0 invenzioni (gate, non tuning)

Primo giro pieno del set rinnovato: 14 ✔ · 15 ✔ · 16 ✔ · 31 ✔ · 32 ✔ · 33 ✔.
Storia di #16 (transizioni accademiche): ✔ a giugno (set vecchio), ✘ nel run 2.15.0, ✔ qui —
oscillazione da campione singolo su un'aspettativa graduata. Resta osservato, mai ritoccato.

## Riproduzione

```bash
node evals/run.mjs --ids 12,19,22,28,4,7,26 --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/run.mjs --split held-out --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/activation.mjs --ids 8,15,31,32,33,34,35,36
```
