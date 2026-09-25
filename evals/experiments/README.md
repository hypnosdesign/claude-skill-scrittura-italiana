# Confronto del nucleo compatto

## Seguito con GPT, richiesto il 25 settembre

Il limite di sessione Claude ha interrotto il primo tentativo. Su richiesta dell'utente,
le nuove prove usano `gpt-5.6-terra` come editor, `gpt-6-sol` come giudice e
`gpt-6-luna` per un controllo incrociato mirato. Gli artefatti restano separati:
non si completa un braccio Claude con output GPT e non si confrontano i loro tassi.

```sh
node evals/gpt-study.mjs prepare evals/results/gpt-nuovo-run
node evals/gpt-study.mjs probe evals/results/gpt-nuovo-run
node evals/gpt-study.mjs calibrate evals/results/gpt-nuovo-run
node evals/gpt-study.mjs regression evals/results/gpt-nuovo-run
node evals/gpt-study.mjs study evals/results/gpt-nuovo-run
node evals/gpt-study.mjs crosscheck evals/results/gpt-nuovo-run
```

Usare una directory nuova: il piano v2 non aggiorna né riprende gli artefatti v1.
`followup` esegue due ripetizioni single-file sui 14 casi di regressione e sui casi
20, 24, 27 e 40, aggiunti dopo i rilievi del confronto. `focused` copre invece i sette
casi di regressione assenti dallo studio, sulla sola candidata compatta; serve soltanto
se si valuta ancora di promuoverla. Entrambe le selezioni sono dichiarate prima delle chiamate.

Per il controllo mirato dei rilievi rimasti con Terra, `prepare DIR gpt-6-sol` congela
una directory separata con Sol come editor. `control DIR` esegue #15, #24, #34, #37
e #40, due volte; `control-crosscheck DIR` fa giudicare gli stessi dieci output a Luna.
La selezione è diagnostica, successiva all'osservazione dei fail: non è un benchmark
indipendente della superiorità di un modello. Il primo giudizio usa lo stesso modello
dell'editor Sol; per questo si conservano anche il controllo Luna e la rilettura manuale.

`node evals/experiments/export-gpt.mjs SORGENTE DESTINAZIONE_NUOVA` produce gli estratti
condivisibili, con hash degli originali e senza transcript nativi, stderr, ID o percorsi
personali. Non sostituisce gli originali e non produce file riutilizzabili per il resume.

Le chiamate completate vengono riutilizzate solo con input, policy, client e istruzioni
globali invariati, incluse le bocciature. Gli errori tecnici restano in file separati.
Il giudice conserva la policy v2 già fissata; la calibrazione non ne cambia le etichette.

Il [client Codex](https://learn.chatgpt.com/docs/app-server) conferma modello e restrizioni
prima di ogni chiamata. Ogni caso parte in un thread effimero read-only, senza delega,
connettori utilizzabili o ricerca web. I riferimenti vengono forniti per intero dal tool
controllato `skill_reference.read_reference`; sono registrati nome, byte e SHA-256. Il test misura
le scelte di lettura con la skill già attiva, **non l'attivazione automatica** nel client.

Il client segnala ancora il file personale `AGENTS.md`: la sua impronta deve restare
identica fra chiamate. La copia locale contiene soltanto il routing MrWolf, inapplicabile
alla directory temporanea dello studio; non è corretto definire l'ambiente del tutto
ermetico. Non vengono copiati segreti né cambiate impostazioni personali. Token e tempi
sono misurati; il costo fatturato non è restituito e rimane `null`, non zero.

Il confronto usa gli stessi 14 casi dev e due ripetizioni per braccio. L'ordine base/compatta
è invertito nella seconda ripetizione. Restano necessari la rilettura degli output e una
decisione motivata: nessuna equivalenza o preferenza umana è dimostrata da questi dati.

La policy client v2 espone il riferimento direttamente, senza il limite intermedio
di code-mode, e fissa `tool_output_token_limit` a 65.536. Il primo confronto v1,
interrotto a 37/56, non dimostra la qualità né il costo della lettura integrale.
La ripetizione v2 usa una directory nuova: `evals/results/gpt-context-direct-2026-09-25`.

## Protocollo Claude precedente

`compact-SKILL.md` è una candidata sperimentale, non la skill distribuita. Mantiene
la stessa description e usa gli stessi nove riferimenti della base corretta; cambia
il nucleo e rende condizionale la lettura del catalogo completo per il line edit.
Non si eliminano i riferimenti prima di misurare l'effetto del cambiamento.

Lo studio confronta 14 casi dev, due volte per braccio: conservazione, grammatica
oscillante, scrittura da brief, voce, istruzioni annidate, negazioni, tipografia,
diagnosi, traduzione, saggio lungo, documentazione e codice. Lo split held-out non cambia.
I casi e gli snapshot vengono congelati prima delle chiamate.

```sh
node evals/context-study.mjs --prepare evals/results/context-study-prepared
node evals/activation.mjs --cases evals/results/context-study-prepared/cases.json --skill-src evals/results/context-study-prepared/base --model claude-sonnet-5 --hermetic --max-turns 15 --out evals/results/context-study-base
node evals/activation.mjs --cases evals/results/context-study-prepared/cases.json --skill-src evals/results/context-study-prepared/compact --model claude-sonnet-5 --hermetic --max-turns 15 --out evals/results/context-study-compact
node evals/context-study.mjs --grade evals/results/context-study-base
node evals/context-study.mjs --grade evals/results/context-study-compact
node evals/context-study.mjs --compare evals/results/context-study-base evals/results/context-study-compact
```

Eseguire un comando alla volta. Fermarsi su errori, limiti di sessione, contaminazione
o modelli diversi da quelli richiesti. La modalità ermetica può non trovare le credenziali:
verificare con un probe prima dello studio; non copiare segreti nelle directory di prova.
`--grade` riprende i soli giudizi tecnicamente invalidi, senza sostituire bocciature valide.

Il confronto richiede stessi casi, client, isolamento, modelli, riferimenti e limite
dei turni per caso. Conserva
istruzioni, transcript, output, verdetti, policy, tempi e costi. I token d'ingresso
processati includono cache e passaggi multipli: non sono la dimensione del contesto unico.
Il costo riportato riguarda l'editor; quello del giudice resta nei singoli giudizi.

Il client espone soltanto `Skill`, `Read`, `Glob` e `Grep`, con modalità restricted,
configurazione MCP vuota e richieste di permesso interattive disabilitate. Non basta
autorizzare le letture: gli strumenti di scrittura, esecuzione e delega non devono essere
disponibili. Questa policy è registrata e verificata prima del confronto. Il transcript
resta negli artefatti dello studio; non si conserva una sessione riapribile del client.

Per ogni chiamata sono disabilitati memoria automatica, caricamento dei `CLAUDE.md`
e attività in background, tramite le [variabili documentate del client](https://code.claude.com/docs/en/env-vars).
La configurazione vale solo per il processo di prova, non modifica quella dell'utente.
I test locali verificano gli argomenti e l'ambiente passati al CLI simulato; il probe
reale resta necessario per verificare il comportamento della versione installata.

Rileggere tutti gli output prima di decidere: una parità di pass rate non dimostra
equivalenza. Le perdite semantiche nuove impediscono la promozione finché non sono risolte.
Il giudice è fallibile e i casi sono dev. Su indicazione dell'utente si procede senza
valutazione umana indipendente: non formulare conclusioni sulla preferenza dei lettori.

Test locali (nessuna chiamata ai modelli):

```sh
node --test evals/context-study.test.mjs evals/activation.test.mjs evals/run.test.mjs
```
