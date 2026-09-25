# Esecuzione suite — audit-2.19.1-finale
skill sha256=81182306704a88a65fd8dad9b5040513520da7065d7a0ca60ebfac45008bc3f6 · git=345a9c4+dirty
editor=claude-sonnet-5 · judge=claude-opus-5 · split=dev · run/eval=2
modelli risolti: claude-sonnet-5, claude-opus-5 · costo API dichiarato: $2.1586

**Pass rate complessivo: 20/20 (100%) · invenzioni totali: 0**

Testo non conforme: 0 · note/consulenza/formato non conformi: 0 (categorie sovrapponibili, errori del giudice esclusi).

| target | pass | fail | err | invenzioni |
|---|---|---|---|---|
| exact | 2 | 0 | 0 | 0 |
| improve | 6 | 0 | 0 | 0 |
| mixed | 2 | 0 | 0 | 0 |
| minimal | 2 | 0 | 0 | 0 |
| advice | 2 | 0 | 0 | 0 |
| semantic | 6 | 0 | 0 | 0 |

| split | pass | fail | err | invenzioni |
|---|---|---|---|---|
| dev | 20 | 0 | 0 | 0 |

| id | nome | target | pass/run |
|---|---|---|---|
| 47 | asindeto-legittimo | exact | 2/2 |
| 48 | asindeto-elenchi-confusi | improve | 2/2 |
| 49 | negazioni-esempi-audit | mixed | 2/2 |
| 50 | copy-prestazioni-limiti | improve | 2/2 |
| 51 | correzione-nota-richiesta | minimal | 2/2 |
| 52 | domanda-asindeto | advice | 2/2 |
| 53 | modalita-attribuzione | semantic | 2/2 |
| 54 | copy-concretezza-fornita | improve | 2/2 |
| 55 | ruolo-canale-proprieta | semantic | 2/2 |
| 56 | nota-provenienza-da-confermare | semantic | 2/2 |