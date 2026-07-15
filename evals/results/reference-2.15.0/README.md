# Riferimento 2.15.0 — conferme, primo held-out nuovo, attivazione rimisurata

Prodotta il 15 luglio 2026, chiusura dell'audit `AUDIT-2026-07`. Editor `claude-sonnet-5`,
giudice `claude-opus-4-8`, n=1 per cella.

## `conferme-2.15.0/` — i casi diagnosticati, dopo i fix: 7/7, 0 invenzioni

Re-run dei quattro casi falliti o divergenti nella misura a quattro bracci (#12, #19, #22,
#28) più tre canarini di conservazione (#4 chat, #7 doc-tecnica, #26 istruzioni annidate).

| caso | prima | dopo | cosa è cambiato nel mezzo |
|---|---|---|---|
| #12 citazione | FAIL | PASS | gold ricalibrato (livello `semantic`, verbatim circoscritto a citazione e dato) |
| #19 d eufonica | FAIL (inv=1) | PASS | giudice corretto: i rimandi ai § della skill non sono «fonti inventate» |
| #22 coesione | FAIL (n=1) | PASS | nulla: era rumore |
| #28 virgolette curve | FAIL | **PASS** | **fix reale nella skill**: la guardia di registro non impone più i caporali su uno stile uniforme già scelto dal testo |
| #4, #7, #26 | PASS | PASS | canarini: nessun danno collaterale |

⚠ Questi 7/7 **non sono confrontabili uno-a-uno** con la tabella dei quattro bracci: #12 e
#19 sono giudicati con suite/giudice ricalibrati **dopo** quella misura (fingerprint diverse,
registrate nei `meta.json`). Il solo pass qui attribuibile a una modifica della skill è #28.

## `heldout-2.15.0/` — primo giro del set congelato nuovo: 5/6, 0 invenzioni

14 ✔ · 15 ✔ · **16 ✘** · 31 ✔ · 32 ✔ · 33 ✔.

Il fail di #16 (transizioni accademiche) è un adempimento parziale: due formule-ponte su tre
ridotte («porta il discorso sulle istituzioni» sopravvive alleggerita), zero invenzioni,
modalità preservata. Nel run di giugno (reference-2.13.0) lo stesso caso passava: n=1 in
entrambe le direzioni, su un'aspettativa graduata. Da tenere d'occhio, non da ritoccare (è
held-out). I tre held-out nuovi (31–33) passano al primo colpo, incluso il congiuntivo da
correggere dentro le formule di cortesia da preservare.

⚠ Nota di provenienza: entrambi i run della suite hanno misurato il single-file 2.15.0
*prima* delle due rifiniture di instradamento aggiunte in coda (trigger «norme oscillanti»
e apertura anticipata nello scrivere-da-zero): sha misurata `2f70e570…`, sha committata
`5d590e4b…`. Le rifiniture toccano solo la tabella di instradamento (misurate a parte con
l'harness qui sotto, `activation-2.15.0-bis/`).

## Attivazione e instradamento — la description integrata funziona

- `activation-2.15.0/` (post-description, pre-rifiniture): **#8 «riassumi» e #15
  «appunti→email» ora attivano la skill** (erano i due mancati della baseline). #35
  «spiega…» ancora no; routing invariato (3/6).
- `activation-2.15.0-bis/` (dopo le rifiniture di instradamento): **#32 (d eufonica) ora
  apre `dubbi-e-errori`** — il trigger incondizionato sulle norme oscillanti muove il
  comportamento; **#35 si attiva** (senza però aprire `spiegare-con-chiarezza`); #34 si
  attiva ma continua a non leggere.

Stato migliore osservato, caso per caso (routing): 31 ✔ · 32 ✔ · 33 ✔ · 34 ✘ · 35 ✘
(attiva, non legge) · 36 ✔ → **4/6** aperture attese, dal 3/6 della baseline 2.13.1.
⚠ Run diversi a n=1: fotografie, non un benchmark; #34 e #35 restano il residuo noto
dell'instradamento.

## Riproduzione

```bash
node evals/run.mjs --ids 12,19,22,28,4,7,26 --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/run.mjs --split held-out --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/activation.mjs --ids 8,15,35,31,32,33,34,36
```
