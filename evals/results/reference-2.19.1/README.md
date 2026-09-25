# Verifiche 2.19.1 — audit del 25 settembre 2026

Questi artefatti verificano correzioni circoscritte, non una superiorità generale della
skill. La candidata deriva da `345a9c4` con modifiche locali; l'identità della skill è
data dal contenuto e dalla SHA-256 in `meta.json`, non dal solo commit base.

## Calibrazione del giudice

`calibrazione-pinned/` è la **calibrazione iniziale**: 20 output fissati prima delle chiamate, due giudizi ciascuno con
`claude-opus-5`. **40/40 giudizi corrispondono alle etichette**, 16 positivi e 24 negativi,
senza errori né fallback. Verificati separatamente anche `textOk`, `responseOk` e le
invenzioni nei casi che li specificano. Le etichette sono state preparate dall'assistente
durante l'audit: non sono valutazioni umane indipendenti né un held-out.

La lettura delle successive prove sull'editor ha mostrato limiti non coperti dai primi
20 casi: ruolo confuso con canale, suggerimenti di provenienza non confermata e rimandi
interni trattati come fonti inventate. `calibrazione-finale/` conserva la seconda policy e
26 casi contrastivi, sempre due volte: **52/52 giudizi coerenti con le etichette**,
22 positivi e 30 negativi, senza errori né cambi del modello richiesto. Verificati
copertura dei casi, campi etichettati e impronte di fixture e policy. Policy SHA-256:
`8cc0ce55c91d5ace82da34d7997f3c21eae2a9462e27a82e09fb641336440ae5`.

Nonostante il nome della directory, questa non è l'ultima policy: una successiva lettura
degli output ha richiesto controlli più precisi sulla portata delle spiegazioni e sulle
fonti. `calibrazione-chiusura/` verifica la policy conclusiva su 32 fixture, una volta
ciascuna: **32/32** esiti corrispondono alle etichette, 14 positivi e 18 negativi,
senza errori né cambi del modello. Verificati anche i campi etichettati e le impronte.
La policy ha SHA-256 `e11539c22f7e67793dc9bf06b4ed92de07453d606892585f945a01c40af43f9a`.
Le fixture precedenti non sono state rietichettate per ottenere un pass:
sono state aggiunte sei prove contrastive.

`calibrazione-integrazione/` aggiunge quattro fixture (due sulla descrizione del
troncamento, due sulla struttura sintattica), due volte ciascuna, **con la stessa
policy**: 7/8 giudizi coerenti. La spiegazione sbagliata sulla sillaba è stata accettata
una volta e respinta nell'altra. Non è un timeout né un'etichetta cambiata: è un falso
positivo osservato del giudice. La calibrazione integrativa termina con errore, come
deve. Le 36 fixture correnti totalizzano quindi **39/40 giudizi coerenti**, contando
i 32 del giro precedente e gli otto integrativi; non una calibrazione perfetta.

`calibrazione-probe/` conserva il giro preliminare con alias `opus` (risolto in
`claude-opus-5`): 19 giudizi validi coerenti con le etichette e un timeout sul caso
`glossa-separata`. Il timeout resta un errore, non un successo. Il giro completo a modello
fissato è distinto, non sostituisce le righe precedenti.

Le etichette non vengono inviate al giudice. `fixtures.json`, `judge-policy.json`,
prompt, risposte grezze, modelli, durate e costi permettono di controllare la prova.

```sh
node evals/calibrate-judge.mjs --model claude-opus-5 --runs 1 --out /tmp/calibrazione-2.19.1-nuova
```

## Regressioni della skill

`regressioni-nuove/` è il **tentativo iniziale**, non la prova finale: casi dev 47–54,
due esecuzioni per caso, con editor
`claude-sonnet-5` e giudice `claude-opus-5`. Comprendono asindeto valido e sequenza
confusa, esclusioni informative e ridondanze, prestazioni del copy, nota richiesta,
consulenza linguistica, modalità e concretezza senza aggiunte.

Il giudice iniziale ha assegnato 15/16 pass. La lettura degli output ha però rilevato
che #50 perdeva il ruolo escluso dell'azienda e che #53 run1 suggeriva una provenienza
non confermata; inoltre il fail automatico su #53 run2 era dovuto a un rimando interno
corretto. Per questo **15/16 non prova la chiusura dei rilievi**. Policy, aspettativa #50
e skill sono state corrette prima del giro finale, aggiungendo anche #55–56.

`rejudge-rilievi/` applica la seconda policy ai quattro vecchi output #50 e #53,
senza richiamare l'editor. #50 run1 passa da PASS a FAIL; #53 run2 passa da FAIL a PASS
(il rimando interno non è una fonte inventata). #50 run2 va in timeout: non ha un
verdetto valido. #53 run1 resta PASS perché il giudice interpreta le cautele nelle
altre note come condizioni anche del suggerimento di provenienza. La lettura dell'audit
ritiene invece quel suggerimento ambiguo: **il rejudge non dimostra di aver eliminato
ogni falso positivo**. La skill ora richiede una conferma esplicita e #56 controlla
proprio questa condotta; la calibrazione include proposte con e senza tale condizione.

`regressioni-finali/` conserva la seconda candidata sui dieci casi dev 47–56,
due volte ciascuno, con editor `claude-sonnet-5` e giudice `claude-opus-5`. Il giudice
ha assegnato **20/20 pass**, ma la lettura ha rilevato almeno due difetti nelle note:
#51 run1 estendeva falsamente l'apostrofo alla sola elisione e #53 run1 chiamava
«inesistente» una fonte non identificata. Anche questo risultato automatico **non è
una prova di chiusura**. Sono stati aggiornati skill e policy e aggiunto il caso #57;
gli artefatti di questo tentativo restano intatti.

`verifica-chiusura/` prova tutti gli undici nuovi casi
47–57 e nove regressioni precedenti (#2, #3, #7, #12, #13, #18, #19, #27, #34),
una volta ciascuno, con gli stessi modelli fissati: **19/20 pass automatici**.
Il fail su #3 riguarda una variante in nota che ripropone il bipolare da eliminare.
La rilettura ha trovato anche la spiegazione sbagliata in #18 e una simmetria sintattica
inventata in #34. Sono stati corretti riferimento e istruzioni e rafforzate le
aspettative di #18 e #34. Non si presenta questo 19/20 come misura della candidata finale.

`note-conclusive/` verifica i sei casi interessati dagli ultimi interventi
(#3, #18, #34, #51, #53, #57), due volte ciascuno. L'identità della candidata è
`8fd1f4cb9fa46c2de222df59d13381bcd6a5e7acf95bc9d3b6fdac8c0b2e9d1b`.
Esito: **12/12 pass automatici**, senza errori tecnici né cambi del modello, con output
riletti per i difetti corretti. Snapshot, copertura e modelli delle dodici righe sono
stati verificati. È un ricontrollo mirato, non un nuovo run completo della suite:
non sommare il precedente 19/20 a questo 12/12, perché candidata e aspettative differiscono.

```sh
node evals/run.mjs --ids 2,3,7,12,13,18,19,27,34,47,48,49,50,51,52,53,54,55,56,57 --runs 1 --model claude-sonnet-5 --judge-model claude-opus-5 --fail-under 1 --out /tmp/regressioni-2.19.1-chiusura
node evals/run.mjs --ids 3,18,34,51,53,57 --runs 2 --model claude-sonnet-5 --judge-model claude-opus-5 --fail-under 1 --out /tmp/regressioni-2.19.1-note
```

Il riepilogo conclusivo delle prove è in [AUDIT-2026-09.md](../../../AUDIT-2026-09.md).
Le esecuzioni con la policy v2 non vanno confrontate con i pass rate storici del vecchio
giudice: occorre rigiudicare entrambi i bracci con lo stesso contratto.
