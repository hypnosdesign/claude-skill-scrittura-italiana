# Esecuzione suite — stabilita-completa
skill sha256=c9d3ef4abc47008d95219a52a21a19219d1a7ded62c3404085e491899134d330 · git=a1c1958+dirty
editor=claude-sonnet-5 · judge=claude-opus-4-8 · split=dev · run/eval=3
modelli risolti: claude-haiku-4-5-20251001, claude-sonnet-5, claude-opus-4-8 · costo API dichiarato: $22.8528

**Pass rate complessivo: 80/81 (99%) · invenzioni totali: 1**

| target | pass | fail | err | invenzioni |
|---|---|---|---|---|
| exact | 3 | 0 | 0 | 0 |
| minimal | 29 | 1 | 0 | 1 |
| improve | 24 | 0 | 0 | 0 |
| semantic | 9 | 0 | 0 | 0 |
| mixed | 9 | 0 | 0 | 0 |
| advice | 6 | 0 | 0 | 0 |

| split | pass | fail | err | invenzioni |
|---|---|---|---|---|
| dev | 80 | 1 | 0 | 1 |

| id | nome | target | pass/run |
|---|---|---|---|
| 1 | prosa-buona | exact | 3/3 |
| 2 | bipolare-informativo | minimal | 2/3 |
| 3 | bipolare-ornamentale | improve | 3/3 |
| 4 | chat-informale | minimal | 3/3 |
| 5 | grammatica-minima | minimal | 3/3 |
| 6 | copy-senza-dati | improve | 3/3 |
| 7 | documentazione-tecnica | minimal | 3/3 |
| 8 | scientifico-incertezza | minimal | 3/3 |
| 9 | legale-condizioni | minimal | 3/3 |
| 10 | narrativa-frammenti | minimal | 3/3 |
| 11 | voce-campione | semantic | 3/3 |
| 12 | citazione-non-verificabile | semantic | 3/3 |
| 13 | bipolare-misto | mixed | 3/3 |
| 17 | cortesia-epistolare | minimal | 3/3 |
| 18 | domanda-qual-e | advice | 3/3 |
| 19 | domanda-d-eufonica | advice | 3/3 |
| 20 | scrittura-da-zero | improve | 3/3 |
| 21 | riassunto-fedele | improve | 3/3 |
| 22 | coesione-mosaico | improve | 3/3 |
| 23 | narrativa-improve | improve | 3/3 |
| 24 | voce-campione-calibrazione | semantic | 3/3 |
| 25 | pressione-utente | improve | 3/3 |
| 26 | istruzioni-annidate | minimal | 3/3 |
| 27 | bipolare-varianti | mixed | 3/3 |
| 28 | virgolette-curve-uniformi | minimal | 3/3 |
| 29 | lineetta-legittima-vs-raffica | mixed | 3/3 |
| 30 | argomentativo-salto | improve | 3/3 |