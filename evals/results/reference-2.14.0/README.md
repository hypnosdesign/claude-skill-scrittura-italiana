# Riferimento 2.14.0 — prima misura a quattro bracci + attivazione nel client reale

Prodotta il 15 luglio 2026 durante l'audit `AUDIT-2026-07`, **prima** del commit della
candidata (metodo: misurare, poi committare). Editor `claude-sonnet-5`, giudice
`claude-opus-4-8` (ID pinnati), 27 casi dev della suite estesa, **n=1 per cella**.

## I quattro bracci

| directory | braccio | pass | invenzioni |
|---|---|---|---|
| `base-nuda/` | nessuna skill (baseline nuda) | 17/27 | 6 |
| `nucleo-2.13.1/` | solo `SKILL.md` 2.13.1 | 25/27 | 1 |
| `completa-2.13.1/` | single-file 2.13.1 | 24/27 | 1 |
| `candidata-2.14.0/` | single-file candidato (sha256 `9b86af2e…`) | 24/27 | 1 |

Il single-file poi committato nella v2.14.0 è **byte-identico** a quello misurato in
`candidata-2.14.0/skill.md` (stessa sha256): la provenienza è verificabile con `shasum`.

## Come va letto (con onestà)

- **Il dato robusto è il delta con la baseline nuda:** senza skill il modello ipercorregge
  la chat informale, inventa sotto pressione (3 invenzioni sul caso #25), aggiunge nel
  legale e nell'argomentativo, erode i gradi («poco utile»→«inutile») e sbaglia la
  spiegazione di *qual è*. Con la skill: 6 invenzioni → 1.
- **Nucleo vs completa (25 vs 24) è entro il rumore n=1**: la suite attuale contiene pochi
  casi *reference-sensitive*; il delta del single-file non è dimostrato né escluso da
  questa misura.
- **Candidata = completa (24 = 24): nessuna regressione dall'Ondata 2.** Le due divergenze
  singole (#12, #22) sono rumore su gold poi ricalibrato.
- **Tre fail sono stati diagnosticati, non ignorati:** #19 era un artefatto del giudice
  (contava i rimandi «Parte B §9» come fonte inventata — corretto nel runner DOPO questi
  run, che restano giudicati col criterio vecchio); #12 aveva livello sbagliato (`minimal`
  con un prompt che chiede revisione stilistica → ricalibrato `semantic`); #28 falliva per
  un conflitto interno alla skill (guardia di registro vs §26), corretto nella 2.15.0.
  Su #28 il modello nudo passa: era la skill a causare la conversione delle virgolette.
- n=1 per cella: **indicativo, non un benchmark**. Nessun run su più giri di stabilità in
  questa tornata.

## Attivazione e instradamento (`activation-2.13.1/`)

Prima misura nel **client reale** (skill 2.13.1 installata come skill di progetto, non
iniettata), `evals/activation.mjs`, modello `claude-sonnet-5`:

- **positivi 18/20** (i 2 mancati — «riassumi», «appunti→email» — includono le righe con
  errore CLI da tetto `--max-turns`, in cui la skill risultava comunque attivata; il
  summary.md interno riporta 16/18 perché il vecchio harness escludeva gli errori dal
  denominatore);
- **spurie 0/10**;
- **routing: 3/6** aperture del riferimento atteso (la skill si attiva ma risponde «a
  memoria» — il collo di bottiglia che la tabella di instradamento della 2.14.0 aggredisce).

I tre inneschi mancati (#8, #15, #35) erano assenti dalla `description`: integrata nella
2.15.0 e rimisurata (v. `reference-2.15.0/`).

## Riproduzione

```bash
node evals/run.mjs --no-skill --label base-nuda --model claude-sonnet-5 --judge-model claude-opus-4-8
git show v2.13.1:SKILL.md > /tmp/skill-2.13.1.md
node evals/run.mjs --skill /tmp/skill-2.13.1.md --label nucleo --model claude-sonnet-5 --judge-model claude-opus-4-8
git show v2.13.1:scrittura-italiana-single-file.md > /tmp/sf-2.13.1.md
node evals/run.mjs --skill /tmp/sf-2.13.1.md --label completa --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/run.mjs --label candidata --model claude-sonnet-5 --judge-model claude-opus-4-8   # dal tree v2.14.0
node evals/activation.mjs   # skill 2.13.1 come skill di progetto
```

Gli output non saranno byte-identici (LLM non deterministici): riproducibile = artefatti
persistiti + fingerprint, come da `evals/README.md`. Nota: questi run furono giudicati con
la suite alla sua fingerprint registrata in ogni `meta.json` (prima delle ricalibrazioni
di #12 e del giudice).
