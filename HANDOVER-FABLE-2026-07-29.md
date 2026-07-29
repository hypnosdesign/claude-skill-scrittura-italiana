# Handover per Fable — correzioni del sesto audit

Data: 29 luglio 2026  
Base verificata: commit `5d5c1d3` + correzioni Codex non ancora committate.

## Confine del lavoro

Le modifiche di comunicazione già in corso in `docs/index.html` e
`docs/assets/site.css` sono state preservate: Codex non le ha riscritte né formattate.
L'unico file del sito modificato da Codex è `docs/valutazione.html`, per correggere la
storia dell'held-out.

## Correzioni implementate

### 1. Giudice allineato al contratto e resistente alle istruzioni nei dati

In `evals/run.mjs` la policy del giudice è ora nel system prompt. Prompt dell'utente,
output dell'editor, aspettative ed eventuale output atteso vengono serializzati come JSON
non fidato. Il giudice riceve l'ordine esplicito di non eseguire istruzioni contenute in
quei campi.

Il contratto di conservazione copre ora anche:

- definizioni e glosse, anche vere;
- causalità, cronologia, condizioni, eccezioni e conclusioni;
- soggettività, opinioni, emozioni, ironia ed esperienze personali;
- ambito, polarità e rafforzamento o attenuazione della modalità;
- contenuto nuovo nelle note editoriali.

Ogni riga nuova conserva sia `judgeSystemPrompt` sia `judgePrompt`. I vecchi artefatti
non sono stati sovrascritti: i numeri già pubblicati non derivano ancora dalla nuova
separazione system/dati, anche se i rejudge “giudice-corretto” usavano già un metro di
conservazione ampliato.

### 2. Fallback dei modelli trattati in modo fail-closed

Il runner distingue i modelli principali dalle chiamate ausiliarie Haiku. Quando viene
richiesto un ID completo `claude-*`, zero modelli risolti, più modelli principali o un ID
diverso sono un mismatch. Il controllo vale sia per l'editor sia per il giudice.

Con `--fail-under`, qualunque mismatch fa fallire il gate anche se il pass rate supera la
soglia. Le righe riportano `editorModelMismatch` e `judgeModelMismatch`; il riepilogo
indica caso, run e ruolo coinvolto.

`evals/stability.mjs` non calcola più un delta se i bracci differiscono o sono incompleti
per uno di questi elementi:

- casi e coppie caso×run;
- fingerprint di suite e manifest;
- numero di run, target e split;
- errori o righe mancanti;
- modello editor o giudice richiesto/risolto.

I meta dei rejudge vengono normalizzati usando `source`; i due meta storici
`rejudge-*-giudice-corretto/meta.json` ora contengono manifest, run, split e ID mancanti.

Verifica concreta: il confronto sui 13 casi gen-5 stampa i due bracci ma rifiuta il delta,
segnalando i fallback #14, #32 e #42. Questo è il comportamento corretto.

### 3. Rejudge recuperabile

`--rejudge` accetta anche una riga in cui l'output editoriale è valido ma il primo giudice
era fallito. Queste righe sono riportate come `recovered` e non entrano artificialmente nel
denominatore dell'accordo fra giudici.

### 4. Kit cieco umano chiuso ai dati difettosi

`evals/blind-kit.mjs` ora:

- conserva separatamente i modelli risolti dei due bracci e rifiuta fallback o asimmetrie;
- elimina l'intera directory se la costruzione si interrompe, evitando kit parziali;
- legge correttamente CSV quotati, inclusi nomi con virgole e doppi apici;
- pretende una risposta per coppia, valori ammessi e lettori unici;
- non produce un aggregato con meno di tre lettori distinti.

### 5. Attivazione attribuita senza ambiguità nascosta

Il solo evento `Skill` del client non espone il path della copia omonima caricata. Prima
veniva contato come attivazione della candidata anche fuori da un ambiente ermetico.

`evals/activation.mjs` separa ora:

- invocazione osservata del tool `Skill`;
- lettura provata della copia nella workdir;
- lettura di una copia personale;
- invocazione ambigua.

Fuori da `--hermetic`, un'invocazione senza path non entra nei tassi attribuiti alla
candidata. In modalità ermetica può essere attribuita alla copia di progetto. È stato
anche corretto il confronto dei path: `/tmp/work-other` non appartiene a `/tmp/work`.

### 6. Held-out e documentazione della misura

Il #15 è `dev`, perché il suo fallimento è stato usato per estendere la guardia sul testo
operativo. Il set held-out corrente è #14, #16, #31, #32, #33 e #46. Il #46 è nuovo e non
è ancora stato misurato.

`docs/valutazione.html` distingue ora:

- vecchio 6/6: storico ma contaminato dal tuning sul #15;
- cinque casi storici non contaminati: 5/5;
- nuovo #46: non misurato.

### 7. Packaging e CI

Lo staging temporaneo del packaging viene rimosso anche in caso di errore. La CI ora si
attiva anche quando cambia `scripts/package-skill.mjs`, costruisce davvero lo ZIP e include
i test dell'harness di attivazione. Restano attivi i controlli su versione, description,
suite/manifest e freschezza del single-file.

## Numeri che si possono comunicare

Usare queste formulazioni, mantenendo n e limiti vicini al numero:

- **Gen-5, conteggi descrittivi sugli stessi 13 prompt:** 11/13 con skill e 6/13 senza.
  Non chiamarlo A/B controllato: i bracci non sono interamente appaiati per modello.
- **Gen-5, confronto appaiato pulito:** 9/10 con skill e 4/10 senza, una sola osservazione
  per caso (`n=1`). È il confronto pubblicabile nell'artefatto attuale.
- **Held-out storico pulito:** 5/5 sui cinque casi non usati per tarare. Non scrivere che
  il set held-out corrente è 6/6: il #46 non è stato eseguito.
- **Suite di stabilità precedente:** si possono citare gli intervalli già documentati,
  sempre come fotografia del modello/CLI dichiarati e non come proprietà universale.

Da evitare finché non esistono nuovi dati:

- «11/13 contro 6/13 in un confronto controllato»;
- «6/6 held-out corrente» o «mai usati per tarare» riferito al vecchio set;
- «validato da umani»: il kit esiste, ma il protocollo a tre lettori non è ancora concluso;
- «giudizio indipendente»: i giudici attuali appartengono alla stessa famiglia;
- qualunque numero prodotto dai 13 casi completi come `delta`: il nuovo tool lo rifiuta.

In `docs/index.html` la frase corrente «11 casi su 13 contro 6» va quindi qualificata come
conteggio descrittivo oppure sostituita col dato controllato «9 su 10 contro 4, n=1».

## Verifiche eseguite

```bash
node --test evals/*.test.mjs
# 34/34 pass

node evals/run.mjs --validate-only
# suite valida: 46 eval; dev=40; held-out=6

node scripts/check-description.mjs
# 893 caratteri, soglia 900, limite hard 1024

node scripts/check-versions.mjs
# versione coerente: 2.17.0

python3 build-single-file.py
git diff --exit-code scrittura-italiana-single-file.md
# single-file aggiornato, nessun diff residuo

node scripts/package-skill.mjs
# ZIP 2.17.0 valido: un solo SKILL.md + 9 riferimenti

node evals/stability.mjs \
  evals/results/reference-gen5-2026-07/rejudge-skill-giudice-corretto \
  evals/results/reference-gen5-2026-07/rejudge-nudo-giudice-corretto
# nessun delta: confronto correttamente rifiutato per fallback del modello
```

## Prossimi passi consigliati

1. Integrare nel sito le qualifiche sopra senza sovrascrivere le correzioni tecniche.
2. Per un nuovo numero principale, eseguire un A/B appaiato `n=3` con ID modello completi,
   gate attivo e nuova policy del giudice; non sovrascrivere gli artefatti storici.
3. Eseguire il #46 una sola volta come held-out e congelare l'esito, senza ritoccare la
   skill in risposta a quel caso.
4. Concludere il confronto cieco con almeno tre lettori e pubblicare anche pari, campione e
   protocollo, non soltanto la percentuale finale.
5. Se serve il claim “indipendente”, rigiudicare gli output persistiti con una famiglia di
   modelli esterna.

## File toccati da Codex

- `.github/workflows/skill-quality.yml`
- `CHANGELOG.md`
- `README.md`
- `docs/valutazione.html`
- `evals/README.md`
- `evals/activation.mjs`, `evals/activation.test.mjs`
- `evals/blind-kit.mjs`, `evals/blind-kit.test.mjs`
- `evals/run.mjs`, `evals/run.test.mjs`
- `evals/stability.mjs`, `evals/stability.test.mjs`
- `evals/results/reference-gen5-2026-07/README.md`
- `evals/results/reference-gen5-2026-07/rejudge-*-giudice-corretto/meta.json`
- `scripts/package-skill.mjs`

`docs/index.html` e `docs/assets/site.css` risultano modificati nel worktree, ma sono il
lavoro di comunicazione già in corso di Fable e non fanno parte delle patch Codex.
