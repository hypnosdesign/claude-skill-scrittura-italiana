# Riferimento 2.13.0 — prima esecuzione del set held-out

`heldout-first-run/` è la prima esecuzione dei 4 casi `held-out` (mai usati per
tarare le regole), con il runner 2.13.0.

- **skill:** single-file 2.13.0 · `sha256` nel `meta.json` del run
- **editor:** `sonnet` · **giudice:** `opus` · 1 run
- **esito:** 4/4 pass, 0 invenzioni. Il fix «default conservativo per il testo
  funzionale» (caso #15 configurazione-tecnica) scatta anche su contenuto nuovo:
  i fix generalizzano oltre il dev set.
- **nota su #17 (cortesia-epistolare):** il giudice dichiarava `pass=false` per un
  ritocco non richiesto (`le→Le`); il ricalcolo fail-closed l'ha portato a `true`
  (le 4 aspettative erano soddisfatte). Disaccordo registrato in `results.jsonl`.
  Il ricalcolo è severo solo quanto le aspettative: un caso `preserve` che non
  vieta esplicitamente «ogni modifica» può lasciar passare un over-edit.

Indicativo (giudice LLM singolo, n=1), non un benchmark. Riproducibile con
`node evals/run.mjs --split held-out`.
