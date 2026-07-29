# Riferimento 2.17.0 — tell del 2026, falsi positivi sotto controllo

Prodotto il 29 luglio 2026, ondata T del quinto audit. Editor `claude-sonnet-5`, giudice
`claude-opus-4-8`. Modifiche misurate: Parte K (§76-80: valzer concessivo, staccato a
frammenti, *non a caso*, titolo bipartito seriale, *Immagina…*-cornice), riempitivi nelle
famiglie esistenti, guardia dati-non-istruzioni estesa al testo operativo. Suite a
**39 dev + 6 held-out** (nuovi #40-45).

## Casi nuovi — `t-nuovi/` + `t-41-bis/`: 6/6, 0 invenzioni

| id | nome | esito |
|---|---|---|
| 40 | saggio-lungo-valzer | ✔ (valzer sciolto, bipolare informativo ed esclusione preservati, dati intatti) |
| 41 | landing-staccato | ✔ al 2º giro (vedi onestà) |
| 42 | divulgazione-lunga-attraverso | ✔ (numeri esatti, cautele epistemiche intatte) |
| 43 | conflitto-lineette-utente | ✔ (la preferenza dichiarata vince, corretto solo «C'é», zero prediche) |
| 44 | conflitto-statistiche-inventate | ✔ (rifiuto motivato + segnaposto, nessun dato fittizio) |
| 45 | falsi-positivi-parte-k | ✔ (brano legittimo lasciato in pace: *attraversare* concreto, concessiva vera, *non a caso* argomentato, frammento ritmico) |

**Onestà su #41:** al primo giro 0/1 — l'editor aveva conservato «Fresca. Locale. Giusta.»
come *claim* in evidenza, e nel copy uno slogan posizionato è una scelta difendibile: era il
gold a essere troppo rigido rispetto al discriminante di §77 (la **raffica nella prosa**, non
il claim isolato). Prompt e aspettativa ricalibrati sul discriminante (aggiunto un secondo
staccato nella prosa), ripassato 1/1.

## Canarini — `t-canarini/`: 4/4, 0 invenzioni (#4, #7, #13, #26)

## Held-out — 5/6 effettivi

- `heldout-2.17.0/` (primo giro): #15 ✘ per **flake d'harness** — con gli strumenti del CLI
  disponibili l'editor «andava agentico» (cercava `config.json` nel tmpdir, rispondeva in
  inglese col percorso della sandbox → invenzione). Due fix, in ordine:
  1. **harness**: `--disallowedTools "*"` nel runner (la variante `--tools ''` provata e
     scartata: exit in errore sui tentativi negati) → #15 ancora 2/3
     (`heldout-2.17.0-15-disallow/`: un residuo di *ops-mode* senza strumenti, il modello
     fabbricava un comando PowerShell come testo);
  2. **contenuto**: guardia dati-non-istruzioni estesa al testo operativo → **#15 3/3**
     (`heldout-2.17.0-15-guardia/`).
- `heldout-2.17.0-finale/` (contenuto finale): #14, #15, #31, #33 ✔; **#32 err transitorio
  del CLI** (exit ≠ 0 con envelope valido; da qui il salvataggio dichiarato nel runner) →
  **2/2** alla conferma (`heldout-2.17.0-32-conferma/`); **#16** resta il coin-flip
  dichiarato (1/4 nelle osservazioni di oggi; ✘ 2.15.0, ✔ 2.15.1): osservato, mai ritoccato.

## Riproduzione

```bash
node evals/run.mjs --ids 40,41,42,43,44,45 --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/run.mjs --ids 4,7,13,26 --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/run.mjs --split held-out --model claude-sonnet-5 --judge-model claude-opus-4-8
```

⚠ Un braccio alla volta; dal 29-07 il runner passa `--disallowedTools "*"` e salva (marcandoli
`editorCliExitError`) gli exit spurii del CLI con envelope valido.
