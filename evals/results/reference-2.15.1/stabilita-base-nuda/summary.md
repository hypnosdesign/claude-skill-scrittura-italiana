# Esecuzione suite — stabilita-base-nuda
skill=NESSUNA (baseline nuda) · git=35e8166
editor=claude-sonnet-5 · judge=claude-opus-4-8 · split=dev · run/eval=3
modelli risolti: claude-haiku-4-5-20251001, claude-sonnet-5, claude-opus-4-8 · costo API dichiarato: $19.0953

**Pass rate complessivo: 55/81 (68%) · invenzioni totali: 6**

| target | pass | fail | err | invenzioni |
|---|---|---|---|---|
| exact | 3 | 0 | 0 | 0 |
| minimal | 24 | 5 | 1 | 0 |
| improve | 15 | 6 | 3 | 2 |
| semantic | 8 | 1 | 0 | 1 |
| mixed | 1 | 6 | 2 | 0 |
| advice | 4 | 2 | 0 | 3 |

| split | pass | fail | err | invenzioni |
|---|---|---|---|---|
| dev | 55 | 20 | 6 | 6 |

| id | nome | target | pass/run |
|---|---|---|---|
| 1 | prosa-buona | exact | 3/3 |
| 2 | bipolare-informativo | minimal | 3/3 |
| 3 | bipolare-ornamentale | improve | 3/3 |
| 4 | chat-informale | minimal | 0/3 |
| 5 | grammatica-minima | minimal | 3/3 |
| 6 | copy-senza-dati | improve | 3/3 |
| 7 | documentazione-tecnica | minimal | 2/3 |
| 8 | scientifico-incertezza | minimal | 3/3 |
| 9 | legale-condizioni | minimal | 3/3 |
| 10 | narrativa-frammenti | minimal | 3/3 |
| 11 | voce-campione | semantic | 3/3 |
| 12 | citazione-non-verificabile | semantic | 2/3 |
| 13 | bipolare-misto | mixed | 1/3 |
| 17 | cortesia-epistolare | minimal | 3/3 |
| 18 | domanda-qual-e | advice | 3/3 |
| 19 | domanda-d-eufonica | advice | 1/3 |
| 20 | scrittura-da-zero | improve | 1/3 |
| 21 | riassunto-fedele | improve | 1/3 |
| 22 | coesione-mosaico | improve | 3/3 |
| 23 | narrativa-improve | improve | 3/3 |
| 24 | voce-campione-calibrazione | semantic | 3/3 |
| 25 | pressione-utente | improve | 1/3 |
| 26 | istruzioni-annidate | minimal | 3/3 |
| 27 | bipolare-varianti | mixed | 0/3 |
| 28 | virgolette-curve-uniformi | minimal | 1/3 |
| 29 | lineetta-legittima-vs-raffica | mixed | 0/3 |
| 30 | argomentativo-salto | improve | 0/3 |