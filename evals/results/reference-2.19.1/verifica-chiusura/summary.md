# Esecuzione suite — audit-2.19.1-chiusura
skill sha256=d312127f79dfadb2ef5c8ee76428f97469f5d22a75519f5ff574b8a8e7fc83f3 · git=345a9c4+dirty
editor=claude-sonnet-5 · judge=claude-opus-5 · split=dev · run/eval=1
modelli risolti: claude-sonnet-5, claude-opus-5 · costo API dichiarato: $2.5017

**Pass rate complessivo: 19/20 (95%) · invenzioni totali: 0**

Testo non conforme: 0 · note/consulenza/formato non conformi: 1 (categorie sovrapponibili, errori del giudice esclusi).

| target | pass | fail | err | invenzioni |
|---|---|---|---|---|
| minimal | 4 | 0 | 0 | 0 |
| improve | 3 | 1 | 0 | 0 |
| semantic | 4 | 0 | 0 | 0 |
| mixed | 3 | 0 | 0 | 0 |
| advice | 4 | 0 | 0 | 0 |
| exact | 1 | 0 | 0 | 0 |

| split | pass | fail | err | invenzioni |
|---|---|---|---|---|
| dev | 19 | 1 | 0 | 0 |

| id | nome | target | pass/run |
|---|---|---|---|
| 2 | bipolare-informativo | minimal | 1/1 |
| 3 | bipolare-ornamentale | improve | 0/1 |
| 7 | documentazione-tecnica | minimal | 1/1 |
| 12 | citazione-non-verificabile | semantic | 1/1 |
| 13 | bipolare-misto | mixed | 1/1 |
| 18 | domanda-qual-e | advice | 1/1 |
| 19 | domanda-d-eufonica | advice | 1/1 |
| 27 | bipolare-varianti | mixed | 1/1 |
| 34 | diagnosi-senza-riscrittura | advice | 1/1 |
| 47 | asindeto-legittimo | exact | 1/1 |
| 48 | asindeto-elenchi-confusi | improve | 1/1 |
| 49 | negazioni-esempi-audit | mixed | 1/1 |
| 50 | copy-prestazioni-limiti | improve | 1/1 |
| 51 | correzione-nota-richiesta | minimal | 1/1 |
| 52 | domanda-asindeto | advice | 1/1 |
| 53 | modalita-attribuzione | semantic | 1/1 |
| 54 | copy-concretezza-fornita | improve | 1/1 |
| 55 | ruolo-canale-proprieta | semantic | 1/1 |
| 56 | nota-provenienza-da-confermare | semantic | 1/1 |
| 57 | apostrofo-nota-circoscritta | minimal | 1/1 |