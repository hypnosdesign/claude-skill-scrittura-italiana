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

---

# Stabilità della misura — n=3 per cella (16 luglio 2026)

Primo punto di metodo di giugno chiuso: le fotografie a n=1 diventano stime con intervallo.
Stessa suite e stesso giudice ricalibrati per entrambi i bracci; digest deterministico con
`node evals/stability.mjs <dirA> <dirB>`.

## `stabilita-completa/` — con skill 2.15.1 (sha `c9d3ef4a…`)

**26/27 · 27/27 · 27/27 → media 26,7 (intervallo 26–27)** · invenzioni 1 · errori 0 ·
**1 caso instabile su 27** (#2 bipolare-informativo, 2/3). 26 casi passano all'unanimità.

## `stabilita-base-nuda/` + `stabilita-base-nuda-suppl/` — senza skill

Il braccio principale ha perso le ultime righe (#29, #30, più un timeout su #7) per il
**limite di sessione del piano** (429, reset 3:10); i tre casi sono stati rimisurati in un
**blocco supplementare dichiarato** dopo il reset — i due artefatti restano separati, mai
fusi in un finto run unico. Combinandoli *dichiaratamente* (24 casi dal principale + 3 dal
supplemento):

**16/26 · 18/27 · 20/26 validi → media 18,0 (intervallo 16–20)** · **invenzioni 9** ·
**8 casi instabili su 27** (#12, #13, #19, #20, #21, #25, #28, #30) · 2 righe in errore
residue (verdetti del giudice malformati, scartati dal fail-closed — mai promossi).

## Lettura

| | senza skill | con skill 2.15.1 |
|---|---|---|
| passaggi per run (validi) | 16–20 su 27 | **26–27 su 27** |
| invenzioni totali (3 run) | 9 | **1** |
| casi instabili (flip) | 8 su 27 | **1 su 27** |

- **Il finding nuovo: la skill non alza solo la media (+8,7) — stabilizza.** Il modello
  nudo oscilla su 8 casi e inventa sotto pressione in 2 run su 3; con la skill il
  comportamento è quasi deterministico a livello di verdetto.
- La media nuda 18,0 con la suite ricalibrata è coerente col 17/27 storico
  (pre-ricalibrazione); il 26,7 con skill supera il 24/27 storico perché quella misura
  includeva i due artefatti poi corretti (gold di #12, giudice su #19) e i fix reali 2.15.1.
- ⚠ n=3 stima la varianza **della pipeline intera** (editor + giudice insieme), non del solo
  editor; e 3 osservazioni bastano a distinguere i casi solidi dai coin-flip, non a stimare
  percentuali fini.

## `activation-stabilita-r2/`, `activation-stabilita-r3/` — instradamento su tre giri

Col giro registrato in `activation-2.15.1/`: aggregato grezzo **6/6 · 4/6 · 4/6** — ma la
scomposizione è più utile del totale:

- **lettura giusta, ad attivazione avvenuta: 14/14 righe valide** (#31, #33, #36: 3/3;
  #32: 2/2 più un timeout del CLI contato errore; #34: 2/2; #35: 1/1);
- ciò che oscilla è l'**attivazione** dei due prompt di confine: **#34 (discorso) 2/3** —
  «discorsi» manca dai generi della `description`, candidata per la 2.15.2 — e **#35
  (spiega…) 1/3**, che sta deliberatamente al confine coi negativi («Spiegami TCP/UDP»,
  spurie 0/10): spingerlo rischia attivazioni spurie, prezzo da misurare prima.

Il «6/6» della release 2.15.1 era il pescaggio fortunato di una distribuzione oscillante:
la tabella di instradamento ha risolto la *lettura*; il residuo è l'attivazione di confine.

## Riproduzione (stabilità)

```bash
node evals/run.mjs --runs 3 --model claude-sonnet-5 --judge-model claude-opus-4-8 --out A
node evals/run.mjs --no-skill --runs 3 --model claude-sonnet-5 --judge-model claude-opus-4-8 --out B
node evals/stability.mjs A B
node evals/activation.mjs --kind routing   # ×3 giri
```

⚠ Un braccio alla volta: il primo tentativo (bracci concorrenti) è morto a metà per il
limite di sessione e **non è stato promosso** a riferimento (nota in `evals/README.md`).
