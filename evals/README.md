# Eval della skill

`evals.json` è la suite canonica: contiene prompt realistici, output attesi e aspettative
verificabili nel formato di `skill-creator`. I tre file Markdown restano spot check commentati
per i casi che richiedono una spiegazione editoriale più estesa.

`manifest.json` conserva i metadati utili all'analisi automatica senza introdurre campi non
previsti nello schema canonico: nome semantico, genere e obiettivo `preserve`, `improve` o
`mixed`. I casi storici 1–12 mantengono lo split originale di 8 `preserve` e 4 `improve`; il
caso 13, aggiunto nella 2.12.2, contiene deliberatamente interventi di entrambi i tipi.

## Provenienza della prova 2.12.0

La prova di sviluppo descritta nel changelog confrontava:

- baseline: `e56cd74` (2.11.0);
- candidata: `29ed162` (2.12.0).

Gli output, i prompt esatti di esecuzione, i giudizi e i metadati del modello non sono stati
persistiti. I risultati storici sono quindi indizi non riproducibili, non un benchmark. La suite
attuale non eredita quei punteggi.

**Aggiornamento 2.12.2: la suite è stata eseguita** con il runner qui sotto (`run.mjs`), con
artefatti persistiti e un A/B vecchia-vs-nuova. Sintesi e numeri in `results/REFERENCE.md`. Resta
un risultato indicativo (giudice LLM, n piccolo), non un benchmark definitivo: vale come prova
auditabile e riproducibile, da rinforzare con più run e un controllo cieco umano.

## Requisiti per un benchmark futuro

Per ogni iterazione vanno congelati gli SHA, salvati output e transcript, registrati modello e
configurazione, eseguiti più campioni sia con la skill sia con la baseline e separato il set di
sviluppo da quello held-out. Le verifiche semantiche devono controllare almeno entità, numeri,
citazioni, polarità, modalità, condizioni ed eccezioni; naturalezza e voce richiedono anche un
confronto cieco umano.

## Runner riproducibile (`run.mjs`)

`run.mjs` esegue la suite e **persiste gli artefatti**, coprendo i requisiti qui sopra (SHA
congelato, output salvati, modello/run registrati, split dev/held-out, controllo invenzioni).
Richiede Node e il CLI `claude` (usa l'auth esistente). Per ogni eval inietta una versione della
skill come system prompt (`claude -p --append-system-prompt-file <skill>`), esegue il prompt,
e un giudice valuta l'output contro le `expectations`.

```bash
node evals/run.mjs                                   # skill = SKILL.md (working tree)
node evals/run.mjs --ids 2,3,13 --runs 3             # sottoinsieme, 3 run/eval per stabilità
node evals/run.mjs --skill /tmp/old.md --label old   # A/B: confronta una versione storica
```

Estrai una versione storica con git per un confronto vecchia-vs-nuova:

```bash
git show e56cd74:SKILL.md > /tmp/skill-2.11.0.md
node evals/run.mjs --skill /tmp/skill-2.11.0.md --label baseline-2.11.0 --model sonnet
node evals/run.mjs --label new --model sonnet
```

Flag: `--skill <file>` (system prompt; default `SKILL.md`), `--suite <file>` (default `evals.json`;
si può puntare a un corpus reale esterno), `--label`, `--model`, `--judge-model`, `--runs`,
`--ids <csv>`, `--held-out <csv>`, `--out <dir>`.

Output in `evals/results/<timestamp>__<label>/`: `meta.json` (skill, SHA, modello, run, versioni),
`results.jsonl` (input, output, verdetto per ogni eval×run), `summary.{json,md}` (pass rate
complessivo, per target, per eval).

> **Limite di riproducibilità (onesto).** Le chiamate LLM **non sono deterministiche**: due run
> danno output diversi. Qui "riproducibile" = *artefatti persistiti + run multipli per stabilità*,
> non output byte-identici. Il giudizio è esso stesso un modello: per le aspettative più fini
> (naturalezza, voce) resta consigliato un controllo cieco umano. I pass rate sono indicativi del
> comportamento, non una metrica assoluta.
