# Riferimento 2.13.0 — prima esecuzione del set held-out

`heldout-on-f30099c/` è la prima esecuzione dei 4 casi `held-out`, sul commit candidato
pulito (`git` nel `meta.json`: `f30099c`, `dirty:false`), con output scritto fuori dal repo e
poi versionato — così la provenienza git registrata è quella reale, non un tree sporco.

- **skill:** single-file 2.13.0 (sha256 nel `meta.json`) · **editor:** `sonnet` · **giudice:** `opus` · 1 run
- **esito:** 4/4 pass, 0 invenzioni.

## Come va letto (con onestà)

- **La 2.13.0 non cambia la policy editoriale.** Questo run valida il *comportamento ereditato
  dalla 2.12.2* e la nuova infrastruttura di misura, non una regola nuova.
- **4/4 è un *primo segnale* di generalizzazione, non la prova che i fix «non erano overfit».**
  Sono quattro casi con **una sola osservazione ciascuno**. Incoraggiante che il caso #15
  (`configurazione-tecnica`) faccia scattare la guardia «default conservativo per il testo
  funzionale» su contenuto mai visto, ma servono più run e più casi per dire di più.
- **#17 (`cortesia-epistolare`) ora è "osservato".** Il giudice dichiarava `pass=false` per un
  ritocco non richiesto (`le→Le`); il ricalcolo fail-closed l'ha portato a `true` perché le 4
  aspettative erano soddisfatte (disaccordo registrato in `results.jsonl`). Da questo momento
  #17 **non è più un held-out pulito**: se verrà usato per tarare la skill, va spostato in `dev`
  e sostituito da un nuovo held-out.

## Limiti

Giudice LLM singolo, n=1 per cella: **indicativo, non un benchmark**. Riproducibile con
`node evals/run.mjs --split held-out`.

## Backlog 2.14 (emerso da #17)

Il target `preserve` è troppo generico. Proposta: politica esplicita per caso —
`exact` (nessuna modifica), `minimal` (sole correzioni necessarie), `semantic` (forma
modificabile, invarianti intatti). Il ricalcolo fail-closed è corretto rispetto alle
aspettative dichiarate; è lo *schema* delle aspettative che oggi non distingue questi livelli.
