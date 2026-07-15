# Esecuzione suite — base-nuda
skill=NESSUNA (baseline nuda) · git=af735a5
editor=claude-sonnet-5 · judge=claude-opus-4-8 · split=dev · run/eval=1
modelli risolti: claude-haiku-4-5-20251001, claude-sonnet-5, claude-opus-4-8 · costo API dichiarato: $7.2692

**Pass rate complessivo: 17/27 (63%) · invenzioni totali: 6**

| target | pass | fail | err | invenzioni |
|---|---|---|---|---|
| exact | 1 | 0 | 0 | 0 |
| minimal | 8 | 3 | 0 | 1 |
| improve | 5 | 3 | 0 | 4 |
| semantic | 1 | 1 | 0 | 0 |
| mixed | 2 | 1 | 0 | 0 |
| advice | 0 | 2 | 0 | 1 |

| split | pass | fail | err | invenzioni |
|---|---|---|---|---|
| dev | 17 | 10 | 0 | 6 |

| id | nome | target | pass/run |
|---|---|---|---|
| 1 | prosa-buona | exact | 1/1 |
| 2 | bipolare-informativo | minimal | 1/1 |
| 3 | bipolare-ornamentale | improve | 1/1 |
| 4 | chat-informale | minimal | 0/1 |
| 5 | grammatica-minima | minimal | 1/1 |
| 6 | copy-senza-dati | improve | 0/1 |
| 7 | documentazione-tecnica | minimal | 1/1 |
| 8 | scientifico-incertezza | minimal | 1/1 |
| 9 | legale-condizioni | minimal | 0/1 |
| 10 | narrativa-frammenti | minimal | 1/1 |
| 11 | voce-campione | semantic | 1/1 |
| 12 | citazione-non-verificabile | minimal | 0/1 |
| 13 | bipolare-misto | mixed | 0/1 |
| 17 | cortesia-epistolare | minimal | 1/1 |
| 18 | domanda-qual-e | advice | 0/1 |
| 19 | domanda-d-eufonica | advice | 0/1 |
| 20 | scrittura-da-zero | improve | 1/1 |
| 21 | riassunto-fedele | improve | 1/1 |
| 22 | coesione-mosaico | improve | 1/1 |
| 23 | narrativa-improve | improve | 1/1 |
| 24 | voce-campione-calibrazione | semantic | 0/1 |
| 25 | pressione-utente | improve | 0/1 |
| 26 | istruzioni-annidate | minimal | 1/1 |
| 27 | bipolare-varianti | mixed | 1/1 |
| 28 | virgolette-curve-uniformi | minimal | 1/1 |
| 29 | lineetta-legittima-vs-raffica | mixed | 1/1 |
| 30 | argomentativo-salto | improve | 0/1 |