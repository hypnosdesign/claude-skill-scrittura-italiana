# Eval della skill

`evals.json` è la suite canonica: contiene prompt realistici, output attesi e aspettative
verificabili nel formato di `skill-creator`. I tre file Markdown restano spot check commentati
per i casi che richiedono una spiegazione editoriale più estesa.

`manifest.json` (schema 3) conserva nome semantico, genere, **livello di conservazione**
(`exact` / `minimal` / `semantic` / `improve` / `mixed` / `advice` — il vecchio `preserve`
era troppo generico: non distingueva «zero modifiche» da «solo il necessario» da «forma
libera, invarianti intatti») e split congelato.

**Storia dello split.** I casi 1–13 sono i `dev` storici; 14–16 sono held-out dalla 2.13.0;
**17 è stato declassato a `dev`** dopo la prima esecuzione (osservato e discusso: non è più
un held-out pulito). I casi 18–30 estendono il dev set (luglio 2026, da `AUDIT-2026-07`):
domande di lingua, scrittura da zero, riassunto, coesione, narrativa in miglioramento,
calibrazione su campione, due casi avversariali (pressione dell'utente, istruzioni annidate
nel testo), varianti bipolari, tipografia (virgolette curve, lineette). I casi **31–33 sono
held-out** (email con errore reale, divulgazione con hype, chat con emoji); 34–45 estendono
il dev set (2.16.0 e 2.17.0). **Anche 15 è stato declassato a `dev`** (29 lug 2026, rilevato
dal sesto audit): il suo fallimento ha motivato l'estensione della guardia sul testo
operativo, quindi è diventato un test di regressione — al suo posto l'held-out **46**
(procedura operativa, mai osservata). Non usare gli output held-out per ritoccare le regole:
servono a misurare la generalizzazione della versione candidata.

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
- prompt, aspettative, output atteso, output dell'editor, policy di sistema, prompt e risposta grezza del giudice;
- modello, versione CLI/Node e durata di editor e giudice;
- verdetto validato in modalità fail-closed: tipi, cardinalità e conteggi non validi diventano
  errori; `pass` viene ricalcolato dalle singole aspettative e da `invented === 0`.

```bash
node evals/run.mjs --validate-only                   # schema + fingerprint, zero chiamate LLM
node evals/run.mjs --split dev --label new-dev       # 27 casi di sviluppo
node evals/run.mjs --split held-out --label new-ho   # 6 casi congelati
node evals/run.mjs --ids 7,8,12,13 --runs 3          # sottoinsieme, 3 run/eval
node evals/run.mjs --no-skill --label baseline-nuda  # braccio SENZA skill (valore aggiunto)
```

**Tre bracci per leggere il valore.** `--no-skill` misura il modello nudo (quanto
aggiunge la skill in assoluto); `--skill SKILL.md` misura il solo nucleo; il default
single-file misura la policy completa. Il delta nucleo↔single-file quantifica ciò che i
riferimenti aggiungono — e quindi quanto vale l'instradamento.

**Modelli: pinnare gli ID nei run di riferimento.** Gli alias (`sonnet`, `opus`) risolvono
a modelli diversi nel tempo: un A/B fra skill eseguito con alias in date diverse confonde la
variabile skill con la variabile modello. Nei run di riferimento usa gli ID completi
(es. `--model claude-sonnet-5 --judge-model claude-opus-4-8`); in ogni caso ogni riga
persiste gli **ID risolti** e il costo dichiarato dal CLI (`--output-format json`).

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

## Stabilità su più run (`stability.mjs`)

`--runs 3` produce una riga per caso×run; `stability.mjs` le digerisce senza chiamate LLM:

```bash
node evals/run.mjs --runs 3 --model claude-sonnet-5 --judge-model claude-opus-4-8 --out r/A
node evals/run.mjs --no-skill --runs 3 --model claude-sonnet-5 --judge-model claude-opus-4-8 --out r/B
node evals/stability.mjs r/A r/B
```

Riporta pass per run **sui soli verdetti validi**, media e intervallo (solo se i run sono
completi), invenzioni per run, casi unanimi e **flip** (verdetti contraddittori fra run dello
stesso caso). Un run in **errore non è un verdetto**: non conta né come pass né come flip, e
i run incompleti disattivano media e intervallo. Il flip misura la varianza dell'intera
pipeline (editor + giudice insieme), non del solo editor.

Un braccio può essere la **fusione dichiarata** di più directory, separate da virgola
(`node evals/stability.mjs r/A r/B1,r/B2`): serve per i run spezzati dal limite di sessione
e completati con `--resume` o con un blocco supplementare. La fusione pretende meta omogenei
  (stessi modelli, stessa skill, stessa suite e stesso manifest), deduplica per (caso, run) preferendo i verdetti
validi, e se i meta dichiarano i casi attesi segnala le **righe assenti** (media marcata come
  non affidabile). Il confronto fra bracci è fail-closed: niente delta se casi×run, target,
  split, fingerprint, completezza o modelli principali realmente risolti non coincidono.

> **Operativo — un braccio alla volta.** Le esecuzioni lunghe vanno lanciate **in sequenza**,
> mai in parallelo: due bracci da 27×3 più un harness concorrenti esauriscono il limite di
> sessione del piano (`api_error_status: 429, "You've hit your session limit"`) e il runner,
> correttamente fail-closed, registra decine di errori — righe perse, mai convertite in pass.
> È successo il 15 lug 2026: il primo tentativo di misura di stabilità è morto a metà per
> questo; l'artefatto non è stato promosso a riferimento. Da allora il runner **abortisce**
> al primo errore da limite di sessione invece di macinare chiamate a vuoto, e riparte con
> `--resume <dir>`: riesegue solo le coppie (caso, run) assenti o in errore, ad append sullo
> stesso `results.jsonl` (fingerprint e modelli devono coincidere col run originale). Con
> `--fail-under <0..1>` il run diventa un gate: exit ≠ 0 sotto soglia, con errori o con
> fallback di un modello pinnato (editor o giudice).

## Attivazione e instradamento nel client reale (`activation.mjs`)

Il runner inietta la skill e quindi **non vede** i due anelli a monte: l'attivazione (la
skill parte?) e l'instradamento (i riferimenti vengono aperti?). `activation.mjs` li misura
nel client reale: copia la skill come skill di progetto in una directory temporanea, esegue
`claude -p --output-format stream-json` e ispeziona gli eventi (tool_use `Skill` e `Read`).

```bash
node evals/activation.mjs --probe          # 2 casi, per verificare l'harness
node evals/activation.mjs                  # 20 positivi + 15 negativi + 8 routing
node evals/activation.mjs --skill-src /percorso/candidata   # misurare una candidata
```

I casi vivono in `activation-cases.json`. Metriche: invocazioni osservate del tool `Skill`,
tasso di attivazione **attribuibile alla candidata** sui positivi, attivazioni spurie sui
negativi, e per i casi routing quali `references/*.md` sono stati letti rispetto all'atteso.
⚠ Misura il comportamento del client (che cambia col CLI e col modello): va letta come
fotografia datata, non come proprietà stabile della skill.

⚠ **L'ambiente non è ermetico per default:** HOME resta quello reale, quindi una copia
personale della skill in `~/.claude/skills` può rispondere al posto della candidata.
L'harness classifica i percorsi: `skillFired` e il routing contano **solo la copia di
progetto** nella workdir; le letture della copia personale finiscono in
`personalCopyReads` (contaminazione, riportata nel summary). Il solo evento `Skill` non
espone il path risolto: fuori dalla modalità ermetica viene riportato come invocazione
**ambigua** e non entra nei tassi attribuiti alla candidata. Con `--hermetic` HOME e
`XDG_*` puntano a una home usa-e-getta — isolamento vero, ma opt-in perché su macchine
dove le credenziali del CLI vivono su disco (non nel keychain) può rompere l'auth. La
workdir temporanea viene rimossa a fine run, salvo `--keep-workdir`.

## Rigiudicare senza rieseguire (`run.mjs --rejudge`)

`--rejudge <dir>` rigiudica gli output già persistiti di un run con un giudice (anche)
diverso, senza chiamate all'editor: isola la varianza del giudice, e permette un **secondo
giudice** sugli stessi testi. Ogni riga conserva il verdetto originale in `originalVerdict`;
il riepilogo riporta accordo e divergenze. Prima applicazione: `reference-gen5-2026-07`
(accordo 92-100% fra `claude-opus-4-8` e `claude-fable-5`; differenza descrittiva
con/senza skill confermata, ma il confronto completo non è appaiato per modello e quindi
non produce un delta pubblicabile).
⚠ Un giudice davvero **fuori famiglia** (GPT/Gemini) richiede credenziali esterne: gli
output persistiti sono già nel formato giusto per sottoporglieli.

## Confronto cieco umano (`blind-kit.mjs`)

Il giudice LLM non basta per «naturalezza e voce» (limite dichiarato da sempre): il kit
genera coppie con/senza skill sugli stessi prompt — **solo testo finale**, niente note
editoriali che smaschererebbero il braccio — in ordine randomizzato con seed, e produce
foglio del lettore, template risposte, chiave (che resta nel kit) e scoring:

```bash
node evals/blind-kit.mjs --build --seed "$SEED_CIECO_PRIVATO"  # intero nuovo, non condiviso
node evals/blind-kit.mjs --score <dir> risposte-*.csv
```

Protocollo: ≥3 lettori unici (lo scorer rifiuta meno di tre), in autonomia, senza sapere
quale braccio è quale; bersaglio dichiarato (AUDIT-2026-07 §8): **preferenza ≥ 70%** per la
skill sulle coppie decise. In build ogni coppia conserva separatamente i modelli risolti dei
due bracci e fallisce se non coincidono. Il kit generato NON va committato prima della
compilazione: contiene la chiave.
