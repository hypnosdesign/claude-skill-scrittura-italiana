# Esecuzione suite — audit-2.19.1-nuovi
skill sha256=6c5569cdb888a204d526ade2a0cf2ff69b62bf96a657982a9e879ae27b8af19c · git=345a9c4+dirty
editor=claude-sonnet-5 · judge=claude-opus-5 · split=dev · run/eval=2
modelli risolti: claude-sonnet-5, claude-opus-5 · costo API dichiarato: $1.7157

**Pass rate complessivo: 15/16 (94%) · invenzioni totali: 1**

Testo non conforme: 0 · note/consulenza/formato non conformi: 1 (categorie sovrapponibili, errori del giudice esclusi).

| target | pass | fail | err | invenzioni |
|---|---|---|---|---|
| exact | 2 | 0 | 0 | 0 |
| improve | 6 | 0 | 0 | 0 |
| mixed | 2 | 0 | 0 | 0 |
| minimal | 2 | 0 | 0 | 0 |
| advice | 2 | 0 | 0 | 0 |
| semantic | 1 | 1 | 0 | 1 |

| split | pass | fail | err | invenzioni |
|---|---|---|---|---|
| dev | 15 | 1 | 0 | 1 |

| id | nome | target | pass/run |
|---|---|---|---|
| 47 | asindeto-legittimo | exact | 2/2 |
| 48 | asindeto-elenchi-confusi | improve | 2/2 |
| 49 | negazioni-esempi-audit | mixed | 2/2 |
| 50 | copy-prestazioni-limiti | improve | 2/2 |
| 51 | correzione-nota-richiesta | minimal | 2/2 |
| 52 | domanda-asindeto | advice | 2/2 |
| 53 | modalita-attribuzione | semantic | 1/2 |
| 54 | copy-concretezza-fornita | improve | 2/2 |