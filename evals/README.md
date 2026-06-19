# Eval della skill

`evals.json` è la suite canonica: contiene prompt realistici, output attesi e aspettative
verificabili nel formato di `skill-creator`. I tre file Markdown restano spot check commentati
per i casi che richiedono una spiegazione editoriale più estesa.

`manifest.json` conserva nome semantico, genere, obiettivo (`preserve`, `improve`,
`mixed`) e split congelato. I casi 1–13, già osservati durante lo sviluppo, sono `dev`;
i casi 14–17 sono il set `held-out` introdotto nella 2.13.0. Non usare gli output held-out
per ritoccare le regole: servono a misurare la generalizzazione della versione candidata.

## Provenienza della prova 2.12.0

La prova di sviluppo descritta nel changelog confrontava:

- baseline: `e56cd74` (2.11.0);
- candidata: `29ed162` (2.12.0).

Gli output, i prompt esatti di esecuzione, i giudizi e i metadati del modello non sono stati
persistiti. I risultati storici sono quindi indizi non riproducibili, non un benchmark. La suite
attuale non eredita quei punteggi.

**Aggiornamento 2.12.2:** la suite fu eseguita con una prima versione del runner. I quattro
run disponibili sono ora versionati in `results/reference-2.12.2/` e la sintesi è in
`results/REFERENCE.md`. Sono auditabili i conteggi degli output salvati, non la provenienza:
il vecchio runner registrava l'HEAD del repository invece dell'hash della skill iniettata e
non conservava skill, suite o transcript del giudice. La ri-misura post-fix 3/3 non fu salvata.

## Requisiti per un benchmark futuro

Il runner 2.13.0 copre provenienza, snapshot, transcript, tempi e split. Restano esterni al runner
il confronto cieco umano e l'eventuale conteggio token (il CLI `claude -p` non lo espone nel
formato usato qui). Le verifiche semantiche devono controllare almeno entità, numeri, citazioni,
polarità, modalità, condizioni ed eccezioni; naturalezza e voce richiedono anche giudizio umano.

## Runner riproducibile (`run.mjs`)

`run.mjs` richiede Node e il CLI `claude` (usa l'auth esistente). Per ogni eval inietta
la skill come system prompt, esegue il prompt e chiede a un secondo modello di valutarlo.
Il default è il **single-file completo** (nucleo + reference), con editor `sonnet` e giudice
`opus`, sul solo split `dev`; l'held-out richiede `--split held-out`. Scelte diverse
restano esplicite nei metadati. Il single-file misura la policy
combinata, non il meccanismo con cui un client Agent Skills decide quando aprire i reference.
Per misurare soltanto il nucleo usa `--skill SKILL.md`; trigger e progressive disclosure
richiedono un test separato nel client reale.

Prima di avviare chiamate LLM, il runner valida suite e manifest. Ogni run conserva:

- copia byte-identica di skill, suite e manifest;
- SHA-256 dei tre contenuti, separati dall'HEAD e dallo stato dirty del repository;
- prompt, aspettative, output atteso, output dell'editor, prompt e risposta grezza del giudice;
- modello, versione CLI/Node e durata di editor e giudice;
- verdetto validato in modalità fail-closed: tipi, cardinalità e conteggi non validi diventano
  errori; `pass` viene ricalcolato dalle singole aspettative e da `invented === 0`.

```bash
node evals/run.mjs --validate-only                   # schema + fingerprint, zero chiamate LLM
node evals/run.mjs --split dev --label new-dev       # 13 casi di sviluppo
node evals/run.mjs --split held-out --label new-ho   # 4 casi congelati
node evals/run.mjs --ids 7,8,12,13 --runs 3          # sottoinsieme, 3 run/eval
```

Estrai una versione storica con git per un confronto vecchia-vs-nuova:

```bash
git show daac4b0:scrittura-italiana-single-file.md > /tmp/skill-2.12.2.md
node evals/run.mjs --skill /tmp/skill-2.12.2.md --split dev --label baseline-2.12.2
node evals/run.mjs --split dev --label new-2.13.0
```

Flag: `--skill <file>` (default `scrittura-italiana-single-file.md`), `--suite <file>`,
`--manifest <file>`, `--label`, `--model`, `--judge-model`, `--runs`, `--ids <csv>`,
`--split <dev|held-out|all>` (default `dev`), `--out <dir>`, `--validate-only`.

Output in `evals/results/<timestamp>__<label>/`: `skill.md`, `suite.json`, `manifest.json`,
`meta.json`, `results.jsonl` e `summary.{json,md}`. I run ordinari restano ignorati da Git.
Per una release, copia soltanto i run scelti in una directory `results/reference-<versione>/`
e commettili insieme a una nota sui limiti.

> **Limite di riproducibilità (onesto).** Le chiamate LLM **non sono deterministiche**: due run
> danno output diversi. Qui "riproducibile" = *artefatti persistiti + run multipli per stabilità*,
> non output byte-identici. Il giudizio è esso stesso un modello: per le aspettative più fini
> (naturalezza, voce) resta consigliato un controllo cieco umano. I pass rate sono indicativi del
> comportamento, non una metrica assoluta.
