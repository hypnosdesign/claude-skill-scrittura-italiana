# Riferimento gen-5 (29 luglio 2026) — la skill su un editor di frontiera

Domanda del quinto audit: **su un modello più capace la skill serve ancora?** Editor
`claude-fable-5` (frontiera corrente), giudice `claude-opus-4-8` (lo stesso dei riferimenti),
skill 2.17.0 single-file, 13 casi mirati (canarini di conservazione, held-out completo, i tre
lunghi), n=1 per braccio.

## Il risultato

| | senza skill | con skill 2.17.0 |
|---|---|---|
| pass | 9/13 | **13/13** |
| invenzioni | 1 | **0** |

**La risposta è sì, ma il valore si sposta.** Il modello di frontiera passa DA SOLO tutti gli
improve (16, 32, 40, 41, 42): lo slop di base lo toglie senza aiuto. I quattro fallimenti del
braccio nudo sono tutti casi di **conservazione e governo**: #7 documentazione tecnica
(ritocchi non richiesti), #13 bipolare misto (distinzioni informative), #15 configurazione
(testo operativo), #26 istruzioni annidate. Sul modello forte il differenziale della skill
non è più «scrive meglio»: è **«sa quando non toccare, cosa preservare e da chi prendere
ordini»** — le guardie, il contratto di conservazione, il default conservativo.

## Secondo giudice (`rejudge-*-fable5/`)

Gli stessi output rigiudicati con `claude-fable-5` come secondo giudice
(`run.mjs --rejudge`, nessuna chiamata all'editor): accordo **12/12 (100%)** sul braccio con
skill, **11/12 (92%)** sul nudo — i quattro fallimenti nudi sono **tutti confermati**;
l'unica divergenza è #16 (il caso graduato di sempre), dove il secondo giudice è più severo
col nudo. ⚠ Dichiarato: è un giudice **della stessa famiglia** (Anthropic) su generazione e
modello diversi — mitiga il bias di modello, non quello di famiglia. Un giudice GPT/Gemini
resta da fare e richiede credenziali esterne; con `--rejudge` gli output sono già pronti da
sottoporre a qualunque giudice.

## Riproduzione

```bash
node evals/run.mjs --ids 4,7,13,26,14,15,16,31,32,33,40,41,42 --split all --model claude-fable-5 --judge-model claude-opus-4-8
node evals/run.mjs --ids ... --split all --no-skill --model claude-fable-5 --judge-model claude-opus-4-8
node evals/run.mjs --rejudge <dir> --judge-model claude-fable-5
```

Costi dichiarati dal CLI: braccio skill $5.86, nudo $2.05, i due rejudge $2.70.
