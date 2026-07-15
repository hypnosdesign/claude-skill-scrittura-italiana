# Changelog

Tutte le modifiche rilevanti a *scrittura-italiana* sono documentate qui.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto adotta
il [Versionamento Semantico](https://semver.org/lang/it/).

## [2.13.1] — 2026-07-15

**Puritas su sé stessa: refusi nel corpo della skill e fonti citate male.** Patch emersa da un
audit interno completo (efficacia + struttura, `AUDIT-2026-07`): nessuna regola cambia; si
correggono errori materiali del testo e attribuzioni bibliografiche, tutte verificate sulle
edizioni effettivamente usate per la distillazione (colophon) o su fonti editoriali.

### Corretto

- **Refusi nel corpo di SKILL.md** (il testo sempre caricato): «vai cercato il punto debole» →
  «va cercato»; «Interveni» → «Intervieni»; «fèrmati» → «fermati» (accento tonico interno, grafia
  non standard in prosa; così «allìneati» → «allineati» in `CONTRIBUTING.md`). In
  `stile-naturale.md` §9, caporale doppio *«…ma Y»»* → *«…ma Y»*.
- **Fonti — otto iniziali d'autore sbagliate, un titolo e due anni imprecisi:** **M.** (non C.)
  Birattari; **B.** (non G.) Barattelli (il Mulino, 2015); **E.** (non A.) Perini (Giunti,
  **2016**, non 2018); **F.** (non E.) Rigotti, *Il filo del pensiero* (il Mulino **2002**,
  ed. Orthotes 2021 — non 2020); **M.** (non F.) Massai; **M. Martino e M. Alfieri** (non
  «F. Martino e A. Alfieri»); **F.** (non A.) Julita. E il titolo Dardano-Trifone: il manuale
  distillato è ***Grammatica italiana. Con nozioni di linguistica*** (Zanichelli, 1995), non
  *La lingua italiana*. Aggiornati `SKILL.md`, `README.md` e i cappelli dei riferimenti; le
  voci storiche di questo changelog restano come furono scritte (sono un registro). La lezione
  è quella della guardia sui fatti: le attribuzioni si verificano sulla fonte, anche le proprie.

### Aggiunto

- **CI deterministica della skill** (`.github/workflows/skill-quality.yml`): a ogni PR e push
  girano i test del runner, la validazione della suite (`--validate-only`), il controllo di
  freschezza del single-file (ricostruzione + diff) e la guardia sulla lunghezza della
  `description` (`scripts/check-description.mjs`, soglia prudenziale 1000 su limite 1024).
  Zero chiamate LLM: costo nullo, nessun risultato instabile.

## [2.13.0] — 2026-06-19

**Provenienza verificabile e benchmark fail-closed.** Questa versione non aggiunge nuovi pattern
stilistici e non rivendica un guadagno comportamentale: corregge l'infrastruttura che misura la
skill, dopo che l'audit della 2.12.2 ha mostrato che i conteggi erano plausibili ma non
riproducibili da un clone pulito.

### Runner e artefatti

- **Fingerprint dei contenuti:** `evals/run.mjs` calcola SHA-256 separati della skill, della
  suite e del manifest realmente usati. L'HEAD Git e lo stato dirty restano metadati distinti:
  una baseline estratta in `/tmp` non può più ereditare falsamente lo SHA della candidata.
- **Snapshot completo:** ogni run salva copie byte-identiche di `skill.md`, `suite.json` e
  `manifest.json`; ogni riga conserva prompt, aspettative, output atteso, output dell'editor,
  prompt e risposta grezza del giudice, verdetto e durata delle due chiamate.
- **Verdetto fail-closed:** `pass`, `invented` e l'array delle aspettative sono validati per
  tipo, cardinalità e dominio. `pass` viene ricalcolato da tutte le aspettative vere e da
  `invented === 0`; stringhe come `"false"`, conteggi negativi o array incompleti diventano
  errori invece di passare per coercizione.
- **Copertura estesa della policy:** il default del runner è il single-file completo
  (nucleo + nove reference), non il solo `SKILL.md`. Questo misura le istruzioni combinate,
  non il trigger o il caricamento on-demand del formato Agent Skills. Il default separa editor
  (`sonnet`) e giudice (`opus`); l'uso dello stesso modello resta possibile ma viene segnalato.
- **Validazione senza costi:** `--validate-only` controlla schema, corrispondenza suite/manifest,
  selezione e fingerprint senza chiamare modelli. Aggiunti sei test deterministici in
  `evals/run.test.mjs`.

### Suite e disclosure

- **Split congelato:** i 13 casi già osservati sono marcati `dev`; quattro nuovi casi
  `held-out` coprono tesi filosofica, configurazione tecnica, transizioni accademiche e cortesia
  epistolare. Il manifest passa allo schema 2; lo split vive nel file e non può più essere
  assegnato arbitrariamente da CLI.
  Il runner usa `dev` per default: l'held-out va richiesto esplicitamente. Il set è pubblico e
  va inteso come regressione congelata, non come segreto statistico.
- **Artefatti storici versionati:** i quattro run disponibili della 2.12.2 sono conservati in
  `evals/results/reference-2.12.2/`. La nota di accompagnamento esplicita SHA impropri,
  working tree dirty, giudice uguale all'editor e snapshot mancanti.
- **Claim post-fix declassato:** il risultato «documentazione tecnica 3/3» era stato dichiarato
  senza persistirne il run. `REFERENCE.md` lo tratta ora come claim storico non verificabile,
  non come evidenza.

### Limiti

- La candidata 2.13.0 non è ancora stata sottoposta a un A/B comportamentale completo.
- Il runner registra i tempi ma non i token, che il percorso CLI usato non espone.
- L'iniezione del single-file non esercita la progressive disclosure del client Agent Skills;
  per isolare il nucleo si può eseguire esplicitamente `--skill SKILL.md`.
- Naturalezza e voce restano valutazioni parzialmente soggettive: serve ancora un confronto
  cieco umano oltre al giudice LLM.

## [2.12.2] — 2026-06-19

**Chiusura delle incoerenze residue della 2.12.1, più la prima esecuzione misurata della suite.**
Patch applicata dopo audit statico; in più aggiunge il **runner riproducibile** (`evals/run.mjs`)
e la **prima esecuzione A/B** con artefatti persistiti — la suite passa da «non eseguita» a
*eseguita e auditabile*. Da quella misura emerge e viene chiusa una regressione di over-editing
sulla documentazione tecnica.

### Corretto

- **Bipolare ed eval:** la 2.12.1 aveva spedito due gold incompatibili con §9, perché
  trasformavano negazioni informative nella variante inversa *Y, non X*. I gold non vengono più
  «corretti» per inversione. `evals/01`
  separa un antonimo davvero ridondante (*gratuito / a pagamento*) dal falso antonimo
  *modulare / monolitico* e preserva la forma originaria delle esclusioni informative;
  `evals/02` toglie soltanto la glossa vuota e conserva *«non è il corpo individuale, ma il
  tessuto comune»* senza invertirlo.
- **Fact-check e output:** senza richiesta di verifica, citazioni e dati restano verbatim;
  l'eventuale avvertenza va in una nota separata, non come marcatore inserito nel testo. Il
  livello d'intervento e l'audit dei tell restano interni salvo utilità o richiesta dell'utente.
  La guida alla coesione chiarisce inoltre che la vicinanza fra fatti non autorizza a inventare
  causa, scopo o concessione.
- **Voce e checklist positiva:** rimosso il residuo *«Dai voce: opinione, dettagli concreti»*;
  specificità, voce e ritmo non sono più quote da riempire e non prevalgono sulle esigenze della
  documentazione tecnica.
- **Parte J:** §73 e §75 rinominati come **invarianti** modale ed epistemica, non pattern
  stilistici; il conteggio pubblico distingue ora 73 pattern + 2 invarianti.
- **Esempi autosufficienti:** `ESEMPI.md` ora separa esplicitamente input, informazioni fornite
  dall'autore e output nei casi servizio, sopralluogo e chip. Nel singolo esempio il numero del
  chip resta invariato fra prima e dopo; rispetto alla 2.12.1, l'ambiguo *200 trilioni* è stato
  sostituito con *200.000 miliardi*. La lezione sul falso amico inglese *trillion* resta in una
  nota separata e documentata. Anche l'esempio di coesione dichiara ora le relazioni causali e
  finali fornite dall'autore: collegare frasi non autorizza a inventare nessi.
- **D eufonica:** ripristinate le locuzioni cristallizzate oltre *ad esempio* (*ad eccezione,
  dare ad intendere, fino ad ora*) senza trasformare le altre varianti tradizionali in errori.

### Struttura ed eval

- **Frontmatter portabile:** `version` e `language` spostati sotto `metadata`; `allowed-tools`
  convertito nella stringa prevista dalla specifica Agent Skills. I tool autorizzati non cambiano.
- **Suite canonica:** il custom `evals/casi-misura.json` è sostituito da `evals/evals.json` nel
  formato di `skill-creator`, con 13 prompt completi, output attesi e aspettative verificabili
  (incluso il falso antonimo *modulare / monolitico*). `evals/manifest.json` conserva nomi
  semantici, generi e partizione storica *preserve/improve*; l'aspettativa non osservabile
  sull'«intenzione» del revisore è stata sostituita con condizioni verificabili sull'output.
  `evals/README.md` congela gli SHA della prova storica (`e56cd74` → `29ed162`) e dichiara la
  suite 2.12.2 non ancora eseguita.
- **Progressive disclosure:** aggiunte mappe rapide ai quattro riferimenti sopra le 300 righe.

### Runner e prima esecuzione misurata

- **`evals/run.mjs` — runner riproducibile.** Esegue la suite iniettando una versione della skill
  come system prompt (`claude -p --append-system-prompt-file`), giudica ogni output contro le sue
  `expectations` e **persiste gli artefatti** (skill+SHA, modello, input, output, verdetto, pass
  rate) in `evals/results/`. Supporta A/B vecchia-vs-nuova (`--skill`), run multipli (`--runs`),
  sottoinsiemi (`--ids`), split held-out e corpora esterni (`--suite`). Documentato in
  `evals/README.md` con il limite onesto di riproducibilità (LLM non deterministico → artefatti
  persistiti + run multipli, non output identici; giudice LLM, da affiancare a controllo umano).
- **Prima A/B (nuova 2.12.2 vs baseline 2.11.0 `e56cd74`, editor+giudice sonnet).** Risultati in
  `evals/results/REFERENCE.md`. Pareggio 11/13, ma **modi di fallire opposti**: la nuova **non
  inventa entità (0 su 25 esecuzioni) contro 8 del baseline** ed evita l'inversione del bipolare;
  il prezzo era un over-editing della documentazione tecnica. Caveat dichiarati: giudice singolo
  (LLM, fact-checkato), iniezione del solo `SKILL.md`, n piccolo, *preserve = zero modifiche* è
  un criterio severo.
- **Corretto — over-editing su testo funzionale (regressione misurata).** `SKILL.md`, sezione
  *Livello di intervento*: nuova guardia che impone il **default più conservativo** per
  documentazione tecnica, API, codice, dati strutturati, testo legale, procedure e riferimenti —
  correggere gli errori e fermarsi, senza rifiniture di stile (niente backtick, niente
  riformulazioni di frasi corrette). Verificato sulla misura: il caso *documentazione-tecnica*
  passa da **0/4 a 3/3**, senza danni collaterali sugli *improve*.

## [2.12.1] — 2026-06-19

**Correzioni da un quarto audit esterno: contraddizioni semantiche e onestà empirica.** Patch che
risolve difetti reali della 2.12.0, alcuni introdotti da me.

### Corretto
- **`evals/02` — contraddizione risolta.** L'eval chiedeva al punto 4 (*«la carne non è il corpo
  individuale, ma il tessuto comune»*) sia di riscriverlo in assertiva pura sia di preservarlo. Ora
  è chiaro: si toglie la glossa vuota *«in questo senso preciso»* (§59) ma si **preserva
  l'esclusione** *«non il corpo individuale»* (caso 6 di §9 — *carne* esclude la lettura di default).
  Criteri PASS/FAIL e nota allineati.
- **`stile-naturale.md` §9 / `SKILL.md` — bipolare: default coerente col contratto.** «Nel dubbio,
  taglia» → **«nel dubbio, preserva»** (la fedeltà semantica viene prima della pulizia). Il test
  diventa di **implicazione nel contesto** (*nel dominio, «è Y» implica già «non X»?*), non
  lessicale; aggiunto l'avviso sui **falsi antonimi** (*modulare/monolitica*: un *modular monolith*
  è entrambi). Taglio riservato ai casi *chiaramente* ornamentali (elevazione, antonimi netti).
- **`evals/01` — gold dell'esclusione.** *«è organizzativa più che tecnica»* (concede il tecnico)
  → *«è organizzativa, non tecnica»* (preserva l'esclusione). Note e criteri aggiornati.
  **Nota 2.12.2:** anche questa correzione era incoerente con il divieto d'inversione; la 2.12.2
  preserva la forma informativa originale.
- **`SKILL.md` «Dare voce» / livello deep:** «dai opinione, prima persona» → **«fai emergere
  l'opinione e la prima persona già presenti o ricavabili dal campione»**; deep rewrite «dà voce»
  → «preserva o ricostruisce la voce disponibile».
- **`SKILL.md` — protocollo per citazioni/dati non verificabili:** se l'utente chiede fact-check e
  hai strumenti → verifica; altrimenti conserva e marca «da verificare»; mai confermare, correggere
  o arricchire un'attribuzione senza fonte.
- **`README.md` — esempio del museo autosufficiente:** blocco *«fatti forniti dall'autore»*
  inserito **tra** prima e dopo, così la trasformazione non insegna più ad aggiungere fatti.
- **`stile-naturale.md` Parte J:** §66 calibrato per registro (*«Resto a disposizione»* è
  appropriato in una mail, non slop); §73/§75 marcati come **invarianti di conservazione**, non
  tell stilistici; checklist «dato + voce reale» non più attesa nel copy.
- **`dubbi-e-errori.md` — d eufonica:** unica eccezione cristallizzata *ad esempio*; *ad ogni / ad
  ogni costo* trattati coerentemente come varianti sconsigliate, non più elencati come eccezioni.
- **`CHANGELOG` — ordine e onestà:** 2.12.0 rimesso in cima (era sotto 2.11.0); conteggio casi
  corretto (**8 preserve / 4 improve**, non «metà e metà»); la prova A/B ridichiarata **prova di
  sviluppo con test leakage e output non persistiti — indizi, non dimostrazioni**; «tre campi»
  riclassificato come over-editing, non invenzione fattuale.
- **`stile-naturale.md` §9 — «uno dei 5 casi»** → **6 casi**.

### Noto, non risolto (backlog)
- **Frontmatter non pienamente portabile** secondo lo standard agentskills.io (`allowed-tools` come
  lista anziché stringa; `version`/`language` fuori da `metadata`): funziona in Claude Code ma non
  giustificava il «struttura tutta pulita» dichiarato nell'audit. Non modificato per non rischiare
  il client primario; da affrontare con verifica.
- Resta aperto un **benchmark riproducibile e indipendente** (held-out set, output persistiti,
  più run, baseline senza skill, controlli deterministici): finché non c'è, ogni claim di efficacia
  è un indizio.

## [2.12.0] — 2026-06-19

**Fedeltà semantica e controllo dei falsi positivi.** Risposta a una terza tornata di audit
esterni, condotta con metodo: audit read-only indipendente delle ipotesi (6 verificatori), poi
correzioni, poi una **prova A/B di sviluppo** baseline (HEAD) vs modificato su 12 casi (**8
*preserve*, 4 *improve***), giudicata su invenzioni, polarità, modalità e voce. ⚠ *Prova su
development set, non benchmark indipendente:* gli output non sono persistiti, n≤4 per cella, e le
regole sono state ritoccate dopo aver osservato i fallimenti sugli stessi casi (test leakage). I
risultati sono **indizi, non dimostrazioni**. La priorità non è togliere più tic: è **non inventare
contenuto, non alterare il significato, non appiattire la voce**.

### Aggiunto
- **`SKILL.md` — Contratto di conservazione.** Guardia esplicita che unifica le altre: in
  revisione non si inventano fatti/date/quantità/nomi, citazioni, rapporti causali, confronti
  numerici, opinioni/emozioni/prima persona, conclusioni; si preservano polarità informative,
  modalità (*può/sembra/è*), condizioni, eccezioni, grado di certezza, voce dell'autore. Vuoti →
  segnaposto, non invenzioni. *La prova suggerisce un beneficio* (da confermare con un benchmark
  vero): sui casi modalità/legale/citazione il modificato preserva dove il baseline sovra-editava
  o aggiungeva materiale (baseline: 2 aggiunte sul caso citazione, 1 sul caso scientifico;
  modificato: 0).
- **`SKILL.md` — Livello di intervento** (`proofread` / `line edit` / `deep rewrite`): affianca
  le quattro virtù senza sostituirle; si inferisce dal verbo, si chiede solo se cambia
  materialmente l'output.
- **`evals/03-falsi-positivi.md`** (in 2.11.0) e **`evals/casi-misura.json`** — suite di 12 casi
  per la misura A/B, con assertion verificabili. Il JSON custom sarà poi migrato al formato
  canonico `evals/evals.json` nella 2.12.2.

### Modificato
- **`stile-naturale.md` §9 — bipolare: test antonimi/categorie + 6° caso.** La regola resta a
  **default "taglia"** (assertiva pura), ma esplicita *quando preservare*: l'**esclusione di
  categoria** con X = lettura di default del lettore (*«non è una scelta tecnica: è organizzativa»*)
  porta informazione e va conservata; antonimi (*modulare/monolitica*) ed **elevazione** del copy
  (*«non un semplice X, ma Y»*) vanno tagliati. Corretto di conseguenza il gold di `evals/01`
  (occorrenza 4 non va più ridotta ad assertiva secca: perdeva il contrasto). *Misura:* il caso
  della **negazione informativa è ora preservato 4/4**; vedi però i limiti residui.
- **`stile-naturale.md` «Dare voce» — argine spostato prima degli imperativi**: le mosse di voce
  valgono **solo dove la voce è dell'autore o ricostruibile da un campione**; "io" non più
  "sempre" ma dove l'autore lo userebbe. Chiude la falla della soggettività fabbricata.
- **`SKILL.md` — le soglie numeriche dichiarate euristiche**, non leggi (da tarare su genere/
  registro); "regola del tre" e checklist "dato + voce reale" con clausola di genere.
- **`dubbi-e-errori.md` — d eufonica:** *ed ora, ad ogni* non più marcati `✗` come errori, ma
  varianti tradizionali sconsigliate solo nel registro sorvegliato.
- **`stile-naturale.md` Parte J:** §72 (verbi-ombrello) ridimensionata — non è una blacklist, si
  caccia la *mossa* non la parola; §68/§69 con clausola di falso positivo; §74 (calchi semantici)
  separata per gravità (errori di proprietà vs varianti tollerate).

### Limiti residui (misurati, non risolti)
- **Elevazione del copy** (*«non è un semplice X, ma Y»*): il modello la maschera coi due punti
  invece di scioglierla — **baseline 0/4, modificato 1/4**. È una limitazione del modello che la
  regola non rimuove in modo affidabile; nessuna regressione (entrambe le versioni falliscono).
- **Over-editing su documentazione tecnica**: su un elenco di campi legittimo il modello tende a
  scioglierlo e ad aggiungere una meta-spiegazione («tre campi») — **4/4 fail**, su regola non
  modificata in questa versione. (Nota: «tre campi» è *over-editing*, non invenzione fattuale — il
  numero è ricavabile dall'elenco.) Il contratto di conservazione non basta a prevenirlo: resta in
  backlog.
- **Chat informale**: lieve tendenza a ritocchi non richiesti (*perdonatemi→scusatemi*); per lo
  più rumore.

## [2.11.0] — 2026-06-18

**Il secondo imprinting: lo slop da assistente, e gli argini contro l'over-editing.** Risposta a
due audit esterni convergenti. Se la Parte B raccoglie i calchi *strutturali* dall'inglese, una
nuova **Parte J** raccoglie i tell di *registro* che vengono dall'essere un assistente
conversazionale — i generi (chat, email, social, divulgazione) che la skill promette ma su cui la
saggistica non bastava. Dieci pattern validati su corpus AI reale (generato e analizzato, non *a
sentimento*), con un cardine unico: *lo slop sostituisce un soggetto reale, una cautela reale o
una fonte reale con un effetto di profondità*. In parallelo, tre argini contro il rischio numero
uno di un humanizer — rovinare prosa già buona o inventare umanità.

### Aggiunto
- **`stile-naturale.md` Parte J §66–75** — slop conversazionale/da assistente, struttura da
  chatbot e markdown compulsivo (calibrato per genere), falso bilanciamento/hedging di servizio,
  pivot al "significato più ampio", **concretezza finta**, *noi/ci* cosmico (slop relazionale),
  verbi-ombrello pseudo-poetici (*abitare, attraversare, restituire*), **slop modale** (erosione
  delle qualificazioni: *suggerisce→dimostra, può→è, correlazione→causa*), **calchi semantici/
  falsi amici** (*fare senso, evidenza, consistente, supportare, basato su*), **slop epistemico**
  (nessi e fonti aggiunti in riscrittura). Ogni pattern con discrimine slop/legittimo e rischio
  di falso positivo.
- **`evals/03-falsi-positivi.md`** — nuovo eval contro l'**over-editing**: cinque testi umani e
  corretti (chat informale, saggistica colta, doc tecnica con elenco legittimo, narrativa con
  frammenti/lineette, copy social) che la skill deve lasciare **intatti**. Metrica-chiave: tasso
  di modifiche indebite (target zero), con confronto cieco vs baseline senza skill.

### Modificato
- **`stile-naturale.md` → «Dare voce»** — aggiunto l'**argine «dare voce ≠ fabbricare
  soggettività»**: opinioni, prima persona, emozioni e "imperfezioni" non dell'autore sono esse
  stesse slop (umanità simulata). La voce si preserva o si ricostruisce da un campione; in assenza
  d'autore, prosa naturale e asciutta, non finta interiorità.
- **`README.md` / `ESEMPI.md`** — gli esempi *prima→dopo* che esplicitavano fatti concreti (museo,
  criticità, benchmark del chip) ora chiariscono che **i fatti sono forniti dall'autore**, non
  inventati dalla skill: davanti a un vuoto la skill chiede o usa un segnaposto. Allinea gli
  esempi alla guardia fattuale (SKILL.md), che prima contraddicevano.
- **`evals/02-prosa-saggistica.md`** — annotato perché l'output di riferimento conserva una
  negazione (*«il tessuto comune, non il corpo individuale»* = distinzione filosofica cardine,
  preservazione §9) e un em dash isolato (lineetta editoriale, non la raffica di §21): l'eval non
  contraddice più le regole senza spiegarlo.
- **`SKILL.md`** — audit finale e indice rimandano alla Parte J e all'argine sulla voce.
- **Conteggi e badge** — `README` "57 → 75 pattern"; badge versione di `FAQ.md` ed `ESEMPI.md`
  allineati (erano fermi a 2.6.0).

## [2.10.1] — 2026-06-18

**Fix di regressione introdotta in 2.10.0.**

### Corretto
- **Collisione di numerazione in `stile-naturale.md`.** Il *pronome soggetto ridondante*, aggiunto
  in 2.10.0 come §21, collideva con il §21 esistente (*trattino lungo / em dash*) e rompeva il
  rimando `punteggiatura.md → stile-naturale.md §21` (che punta all'em dash). Il pronome soggetto
  è stato **fuso nel §13** (*voce passiva e frammenti senza soggetto*), di cui è il rovescio dello
  stesso calco inglese sul soggetto; §21 torna a indicare solo l'em dash.
- **Rimando impreciso.** Nel cappello §B, `punteggiatura.md §327` (numero di riga, non di sezione)
  → `punteggiatura.md` «Maiuscole e minuscole».

## [2.10.0] — 2026-06-18

**L'imprinting inglese: i calchi strutturali dell'italiano AI.** Distillato da una conversazione
con la linguista Y. Pani su lingua e modelli linguistici: la tesi che molti segni dell'italiano
"da AI" non sono lessicali (anglismi) ma **strutturali** — l'AI calca la sintassi inglese anche
scrivendo in italiano. Riconosciuto il cluster, si aggiungono due tell finora assenti e una
precisazione, riusando la numerazione esistente di `stile-naturale.md` Parte B (nessun rimando
incrociato §13/§14/§15/§24 toccato).

### Aggiunto
- **`stile-naturale.md` §B — cappello *«L'imprinting inglese»***: nota che unifica il cluster di
  tell strutturali (passivo §13, gerundite §14, aggettivo anteposto §15, pronome soggetto §21,
  frasi brevi paratattiche §19, *title case* in `punteggiatura.md` §327). Spia comune: una
  costruzione *grammaticalmente possibile* ma che un nativo non sceglierebbe, perché suona "tradotta".
- **`stile-naturale.md` §21 — *Pronome soggetto ridondante*** (nuovo item): in italiano il soggetto
  è di norma implicito; *io penso… io credo…* davanti a ogni verbo (o la terza persona ripetuta) è
  calco dall'obbligo inglese. Regola di taglio, con rinvio a §11 per non forzare la variazione.

### Modificato
- **`stile-naturale.md` §19** — aggiunta nota sul vizio opposto alle subordinate annidate: la
  **corsa di frasi brevi paratattiche**, neutra in inglese ma in italiano segno di povertà (nessi
  scaricati sul punto fermo). Non un divieto della frase breve: sospetto verso il *blocco uniforme*.
- **`stile-naturale.md` §15** — riga sull'**aggettivo valutativo anteposto** (*uno straordinario
  risultato*) come calco inglese: in italiano dà affettazione; posporre o tagliare.

## [2.9.0] — 2026-06-06

**Le mosse del divulgatore + calibrazione di registro misurabile.** Primo distillato da un
corpus di prosa italiana *nativa e umana* (non da manuali normativi): due divulgatori
scientifici indipendenti — M. Ferrari (*Le piante non sono animali verdi*) e G. Vallortigara
(*Pensieri della mosca con la testa storta*) — più L. Floridi (*Pensare l'infosfera*, tr.
Durante) come voce di conferma su materia diversa. Tre pattern espositivi convergono fra loro
(verificati anche su base quantitativa: domande 23–29/10k parole, glosse esplicative 14–15/10k,
esclamativi ~2/10k) e un contrasto di registro misurato emerge da G. Simondon (*Del modo di
esistenza degli oggetti tecnici*, tr. Caridi: periodo medio ~32 parole, domande ~3/10k,
impersonale).

### Aggiunto
- **`spiegare-con-chiarezza.md` §9** — nuova sezione *Le mosse del divulgatore: glossa,
  domanda, segnavia*: (1) **glossa lampo** del termine tecnico (*cioè/ovvero* nella stessa
  frase); (2) **domanda-motore** che struttura il ragionamento per problemi, distinta dalla
  domanda retorica-amo pubblicitaria (rimando al pattern 46 di `stile-naturale.md`); (3)
  **segnavia** asciutti vs metadiscorso burocratico; nota sul tono (enfasi dal ritmo, non dal
  `!`). Sintesi di Parte G aggiornata.

### Modificato
- **`stile-naturale.md` → «Dare voce» / Calibrazione voce** — la calibrazione, prima sintetica,
  diventa una griglia di dimensioni concrete (ritmo e *varianza*, persona io/noi/impersonale,
  dose di inciso, densità di domande, punteggiatura di pensiero, glossa del tecnico) + nota
  *«il registro è un fascio di scelte, e si misura»* con i due estremi (divulgazione viva vs
  trattato ad alta astrazione) come ancore di taratura.

## [2.8.0] — 2026-05-26

**Tic della prosa saggistico-accademica AI.** Otto pattern nuovi emersi dallo stesso audit
della v2.7.0 (libro accademico ~44k parole), specifici del sotto-genere in cui l'AI scrive
di teoria, cita autori, costruisce argomentazioni. Registro diverso dal copy e dal
divulgativo, con tic propri che né il vocabolario AI generico né l'antilingua scolastica
catturano.

### Aggiunto
- **`stile-naturale.md` § I (58-65)** — nuova sezione *Tic della prosa saggistico-accademica
  AI*: §58 catene di transizione fra autori (*«X arriva in soccorso da una direzione…»*);
  §59 glossa metalinguistica vuota (*«in questo senso preciso»*, pseudo-precisione); §60
  termini metalinguistici-ombrello dell'accademica umanistica (*posta concettuale, cifra,
  asse, mossa, postura*) con spia di densità; §61 autoriferimento metatestuale formale
  (*«il presente paragrafo»*); §62 meta-frasi che annunciano la sintesi prima di farla
  (*«Le N voci convergono in un'unica conclusione: …»*); §63 *«Resta vero che X»* come
  chiusura paragrafo; §64 autovalutazioni di precisione (*«L'implicazione è esatta»*); §65
  *«La pertinenza di X per Y è…»* come incipit applicativo. Ogni voce con esempi
  prima/dopo dal corpus auditato e differenziazione dai pattern vicini.
- **`stile-naturale.md` §9** — nota in coda: il pattern bipolare si annida anche dentro
  l'apparato di citazione (glossa esplicativa scambiata per "parte della citazione"
  intoccabile).
- **`evals/02-prosa-saggistica.md`** — secondo eval della skill: paragrafo con 4+ tic
  saggistici sovrapposti, output atteso e FAIL tipici (incluso il bipolare annidato in
  glossa e la sostituzione di un tic con un altro della stessa famiglia).
- **`evals/01-tic-bipolare.md`** — aggiunto FAIL per il pattern bipolare annidato nella
  glossa di citazione.

## [2.7.0] — 2026-05-26

**Famiglia del tic bipolare** «non è X ma Y». Lezione emersa da un audit reale su un libro
accademico ~44k parole: la forma letterale è solo una di **cinque varianti morfosintattiche**,
e la riscrittura per inversione («è Y, non X») è una pseudo-correzione che lascia in piedi il tic.

### Aggiunto
- **`stile-naturale.md` §9** — espansione completa dei *Parallelismi negativi*: cinque varianti
  del bipolare (letterale, inversione, plurali/tempi, senza secondo «è», due punti, «e non»);
  regola «riscrittura assertiva pura, non per inversione» con tabella di esempi da quattro generi
  (filosofia, accademico, giornalismo, copy); cinque casi di preservazione motivata (citazioni,
  anafore triadiche, frasi-tesi, distinzioni filosofiche con autore contrastato, glossari);
  workflow di audit a 3 giri minimi + 1 di pulizia, con grep per ciascun giro; spia di densità
  come euristica indicativa.
- **`SKILL.md`** — riga di richiamo nei Principî cardine (ornatus / anti-AI) con disambiguazione
  esplicita («tic di naturalezza, qui per contiguità con la voce anti-AI») e rimando al §9.
- **`evals/01-tic-bipolare.md`** — primo eval della skill: spot check qualitativo con paragrafo
  a 4 occorrenze miste delle varianti, output atteso, criteri PASS/FAIL, e lista di FAIL tipici
  da intercettare (incluso il caso della pseudo-correzione per inversione).

## [2.6.0] — 2026-05-23

Il **mestiere narrativo** entra nella skill, da Gotham Writers' Workshop, *Lezioni di scrittura
creativa*, e R. Carver, *Il mestiere di scrivere*. `narrativa.md` passa da 6 a 15 sezioni.

### Aggiunto
- **`narrativa.md`** — §7 personaggio (desiderio, contrasto, rivelato dalle azioni); §8 trama,
  conflitto, struttura (causa-effetto, domanda drammatica, inizio che «lancia»); §9 mostrare e
  raccontare (con equilibrio; correlativo oggettivo; dettaglio "carico"); §10 dialogo (sottotesto,
  «disse» invisibile); §11 descrizione e ambientazione (i sensi, il dettaglio significativo); §12
  tensione e non detto (la «minaccia sotto la superficie», niente trucchi, lo scorcio — Carver); §13
  voce narrativa; §14 tema; §15 revisione della narrativa (prima il disegno grande).
- **`revisione-e-proprieta.md`** — la precisione come onestà (Carver via Pound); *terra/suolo* (le
  ramificazioni parassite della parola "scelta"); §5b riscrivere per *scoprire*, non solo per togliere.
- **`stile-naturale.md`** — §57 *niente trucchi* (contro la scrittura "chic" e lo sperimentalismo
  gratuito); note su autorità-impegno ("Dare voce") e sullo stupore come fonte della concretezza (§42).

### Note
- **Goldsmith, *Ctrl+C Ctrl+V*** è stato valutato e **scartato**: il libro (avanguardia
  concettuale: voce che sparisce, appropriazione, illeggibilità) è agli antipodi degli scopi della
  skill; nessun materiale azionabile.

### Modificato
- **`SKILL.md`** → `version: 2.6.0`; conteggio pattern anti-AI 56 → 57; indice e Fonti aggiornati.
  Single-file rigenerato.

## [2.5.0] — 2026-05-23

Rinforzo grammaticale da due grammatiche di riferimento: M. Dardano e P. Trifone, *La lingua
italiana* (1995), e A. Perini, *Grammatica italiana per tutti* (2018). `dubbi-e-errori.md` si
estende dalla morfologia di base alla **morfosintassi**.

### Aggiunto
- **`dubbi-e-errori.md`** — §19 posizione dell'aggettivo (cambia significato: *vecchio amico* ≠
  *amico vecchio*); §20 articolo partitivo; §21 pronomi combinati (*glielo, gliene*) + enclitici dopo
  imperativi tronchi (*dimmi, fammelo*); §22 risalita del clitico con servili e causativi (*fare/
  lasciare*); §23 *Lei* di cortesia (accordo col genere della persona); §24 comparativi e superlativi
  organici (*migliore/ottimo*; ✗ *più migliore, molto ottimo*); §25 *si* passivante vs impersonale
  (+ *ci si*, ausiliare *essere* nei composti); §26 concessive (*benché* + congiuntivo / *anche se* +
  indicativo); §27 temporali (*prima che* + congiuntivo / *dopo che* + indicativo); §28 dislocazione a
  sinistra (ripresa pronominale); §29 frase scissa; §30 periodo ipotetico misto; §31 articolo davanti
  a possessivi (parentela) e cognomi.
- **`dubbi-e-errori.md`** (secondo passaggio) — §32 forme dell'articolo (*il/lo/gli, un/uno*: *lo
  studente, gli gnocchi, uno zaino*); §33 genere che cambia significato (*il fine/la fine*); §34
  concordanza del verbo (soggetti multipli, collettivi, *la maggior parte*); §35 concordanza
  dell'aggettivo con più nomi (genere misto → maschile plurale); §36 numerali (*mille/mila*,
  *ventitré*, *milioni di*, *entrambi/ambedue*); §37 indefiniti (*qualche/ogni* + singolare,
  *nessuno/ciascuno*, *alcuno*).
- **`punteggiatura.md`** — nuova sezione *Maiuscole e minuscole* (mesi/giorni e nazionalità in
  minuscolo, anti-calco inglese; quando va la maiuscola).
- Integrazioni puntuali: §7 forestierismi a plurale invariabile (*i film*, *i computer*) ed
  eccezioni *-essa* (✓ *dottoressa*); §9 *piuttosto che* ≠ *o/oppure*, *neanche/neppure/nemmeno* +
  *non*, preposizioni improprie + *di*, ausiliare dei servili col clitico; §13 accordo del participio
  reso più preciso (clitico → obbligatorio, *che* → facoltativo).

### Modificato
- **`SKILL.md`** → `version: 2.5.0`; indice e Fonti aggiornati (Dardano-Trifone, Perini). Single-file
  rigenerato.

## [2.4.1] — 2026-05-23

Audit di completamento sui manuali della 2.4.0: integrate le ultime lacune di rilievo.

### Aggiunto
- **`dubbi-e-errori.md`** — §16 *passato remoto vs prossimo* (criterio psicologico, variazione
  geografica); §17 *superlativi impliciti* (*più ottimale, molto unico*) e stime incoerenti
  (*circa una cinquantina*); §18 *proprietà delle parole — usi impropri* (*snocciolare, minare,
  blitz, escalation*; restrizioni semantiche *controverso/abbiente/pregiato*; coppie
  *legislatura≠legislazione, transizione≠transazione*).
- **`stile-naturale.md`** — §56 *participi del burocratese* (participio presente con valore di
  relativa: *i componenti il comitato → i membri*; ablativo assoluto: *tenuto conto…, si procede →
  poiché…*).
- **`retorica-efficacia.md`** — §4 nota *testi destinati all'ascolto* (discorsi, podcast: periodi
  brevi, paratassi, niente incisi, connettivi espliciti — norme di Gadda per la radio).
- **`SKILL.md`** — guardia *anti-eco-chamber* nel workflow: per i testi argomentativi, esame
  critico esplicito (l'AI tende a confermare la tesi, non a contestarla).

### Modificato
- **`SKILL.md`** → `version: 2.4.1`; conteggio pattern anti-AI 55 → 56. Single-file rigenerato.

## [2.4.0] — 2026-05-23

Integrazione di **undici manuali** di lingua e scrittura italiana (lettura approfondita +
distillazione): Serianni (*Italiano*, 1997; *L'italiano: parlare scrivere digitare*, 2019;
*Leggere, scrivere, argomentare*, 2015), Birattari (2011), Barattelli (2015), Martino–Alfieri
(*Scrivere ganzo*, 2015), Massai (*L'idea narrativa*, 2015), Gouthier (*Scrivere di scienza*,
2019), Pontiggia (2020), Rigotti (*Il filo del pensiero*, 2020), Julita (*Scrivere con l'AI*,
2025). La skill passa da humanizer + correttore + retorica di base a **compagno di scrittura
completo**: coesione, argomentazione, divulgazione, narrativa, revisione.

### Aggiunto
- **Quattro nuovi riferimenti:**
  - **`coesione-e-connettivi.md`** — il filo del discorso: coesione (tema/rema, ganci, capoverso)
    vs coerenza (filo rosso); tassonomia dei connettivi (quattro famiglie + bilanciamento).
  - **`spiegare-con-chiarezza.md`** — divulgare e documentare: chiarezza ≠ semplificazione,
    astratto→concreto, numeri contestualizzati, termine tecnico, metafore esplicative, anti-hype.
  - **`narrativa.md`** — l'idea ("dinosauro") vs trama, le forme dell'idea, il punto di vista, la
    licenza sperimentale.
  - **`revisione-e-proprieta.md`** — *le mot juste* ("non esistono sinonimi"), collaudo letterale
    delle metafore, intensificatori, revisione a freddo (cavare dal pieno, lettore-cavia).
- **`SKILL.md`** — **Guardia sui fatti** (humanizer ≠ fact-checker: la responsabilità
  dell'accuratezza resta dell'utente); workflow e principî estesi alla coesione; *Quando si attiva*
  con i nuovi domini.
- **`dubbi-e-errori.md`** — **sintassi del verbo** (congiuntivo vs indicativo, *consecutio
  temporum*, periodo ipotetico, accordo del participio, modi espressivi, soggetto delle implicite)
  e il **digitato** (punto, punto e virgola, emoji, maiuscole espressive in chat); più *ed*
  eufonica, *anche se/se anche*, *lo stesso*, *virtualmente*.
- **`retorica-efficacia.md`** — costruire la tesi, riassumere, discorso riferito; triade
  parlato/scritto/digitato ed email come testo controllato; nuove figure (eufemismo, preterizione,
  perissologia); *pars destruens/construens*; *ars est celare artem*; spersonalizzazione.
- **`stile-naturale.md`** — pattern §44–§55 (antilingua scolastica, incipit "Nel mondo di…",
  domanda retorica d'apertura, capoversi omogenei, virgolettati inventati, testo "a mosaico",
  metafore miste, pleonasmi, doppie negazioni, coerenza di registro/persona); checklist positiva
  nell'audit; hype scientifico in §1.
- **`cliche-e-parole-alla-moda.md`** — plastismi e aggettivi obbligatori, cliché del discorso
  scientifico, anglismi spocchiosi, paradosso sapienziale vuoto, comicità involontaria, feticci
  *interessante/importante*.
- **`punteggiatura.md`** — due punti come connettivo (e norma sui segni adiacenti); abuso delle
  virgolette di distanziamento.

### Modificato
- **`SKILL.md`** → `version: 2.4.0`; tabella delle virtù, indice e Fonti aggiornati.
- **`build-single-file.py`** → 9 riferimenti (Parti A–I); rigenerato `scrittura-italiana-single-file.md`.

## [2.3.2] — 2026-05-23

### Cambiato
- **Riposizionamento:** la skill è presentata come *un humanizer con i superpoteri* — il gancio
  è l'umanizzazione (togliere i segni dell'AI), correttezza e retorica sono ciò che la
  distingue da un trova-e-sostituisci. Aggiornati `README.md` (hero + "Cos'è" + sezione
  inglese), la `description` di `SKILL.md` (guidata dall'umanizzazione, sempre ≤ 1024
  caratteri), `FAQ.md` (prima domanda) ed `ESEMPI.md` (intro).
- Nessuna modifica alle regole o ai contenuti dei riferimenti: cambia solo come la skill si
  presenta e viene attivata.

## [2.3.1] — 2026-05-23

### Corretto
- **`SKILL.md`**: accorciata la `description` (da ~1056 a 975 caratteri) per rientrare nel
  limite di **1024 caratteri** imposto dal caricamento delle Skill su Claude Desktop/claude.ai.
  Nessuna modifica al comportamento: stesse virtù, stessi contenuti, stesse parole-chiave di
  attivazione. Lo zip allegato alla release è rigenerato di conseguenza.

## [2.3.0] — 2026-05-23

Integrazione di C. Giunta, *Come non scrivere* (UTET, 2018): l'affettazione "all'italiana" e
la dimensione, prima assente, della **costruzione del testo**.

### Aggiunto
- Nuovo riferimento **`references/cliche-e-parole-alla-moda.md`**: parole alla moda, locuzioni
  e tormentoni, formule d'elogio trite, luoghi comuni e metafore morte (da evitare con misura).
- **`stile-naturale.md`** — sezione **F. L'antilingua** (sostituzione colta *attendere→aspettare*,
  verbo generico + astratto → verbo pieno, parole di plastica, *less is more*) e sezione
  **G. Verità e misura** (contro pathos kitsch, vaghezza, falsa modestia); più la sfumatura
  "le ripetizioni non sono il male" e le antonomasie.
- **`retorica-efficacia.md`** — sezione **6. Costruire il testo (*dispositio*)**:
  iniziare/andare avanti/chiudere ("mai lanciare messaggi"), voce ed *ethos*, buona vs cattiva
  retorica.
- **`dubbi-e-errori.md`** — reggenze (*confondere con*, *capace di*…), collocazioni
  (*intraprendere ≠ direzioni*), modi di dire da non incrociare.
- **`ESEMPI.md`** — esempio §5 (antilingua, cliché, *dispositio*) e nuovi micro-dubbi.
- **`FAQ.md`** — voce "Cosa copre, oltre a punteggiatura e anti-AI?".
- Badge di versione in `README.md`, `ESEMPI.md`, `FAQ.md`.

### Modificato
- **`SKILL.md`** (`version: 2.3.0`): nuovi precetti (antilingua, *dispositio*, "ottava sotto"),
  indice dei riferimenti, workflow e Fonti aggiornati; descrizione ampliata.
- **`build-single-file.py`**: aggiunta la **Parte E** (cliché); rigenerato
  `scrittura-italiana-single-file.md`.

### Fonti
- C. Giunta, *Come non scrivere* (UTET, 2018), con i classici a cui rimanda: I. Calvino,
  *L'antilingua* (1965); G. Orwell, *Politics and the English Language* (1946); A. Savinio,
  *Nuova enciclopedia*.

## [2.2.0] — 2026-05-22

### Aggiunto
- **Guardia di registro (*aptum*)**: distinzione tra **testo controllato** (editoria, norme
  tipografiche piene) e **testo non controllato** (web, chat, social), dove le convenzioni da
  tastiera non sono errori e non vanno "ipercorrette".
- Documentazione: **`ESEMPI.md`** (casi prima→dopo), **`FAQ.md`** (obiezioni ricorrenti),
  **versione single-file** per assistenti senza supporto nativo alle Skill (Gemini, ChatGPT)
  con lo script **`build-single-file.py`**.
- Installazione via `npx skills` e compatibilità con Claude Desktop.

## [2.1.0] — 2026-05-22

### Aggiunto
- Livello **puritas a livello di parola**: nuovo **`references/dubbi-e-errori.md`** (accenti,
  omofoni, apostrofo/elisione/troncamento, *sé stesso*, ortografia, congiuntivo, plurali
  difficili, pronomi, preposizioni, *che* polivalente).

## [2.0.0] — 2026-05-22

### Aggiunto
- Livello **chiarezza ed efficacia**: nuovo **`references/retorica-efficacia.md`** con le
  **quattro virtù dell'espressione** (aptum, puritas, perspicuitas, ornatus), i tre stili,
  il repertorio di figure, la *compositio* e i *tópoi*.

### Modificato
- **`SKILL.md`** riformulato attorno alle quattro virtù, con workflow ordinato "dalla
  struttura alla pelle".

## [1.0.0] — 2026-05-22

### Aggiunto
- Prima versione della skill: **correttezza** (`references/punteggiatura.md`: punteggiatura e
  tipografia, dal *Prontuario di punteggiatura* di B. Mortara Garavelli) e **naturalezza**
  (`references/stile-naturale.md`: rimozione dei segni della scrittura AI, adattamento italiano
  di *Wikipedia: Signs of AI writing*).
- `README.md` bilingue, `CONTRIBUTING.md`, template per issue e pull request.

[2.6.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.6.0
[2.5.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.5.0
[2.4.1]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.4.1
[2.4.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.4.0
[2.3.2]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.3.2
[2.3.1]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.3.1
[2.3.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.3.0
[2.2.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.2.0
[2.1.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.1.0
[2.0.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.0.0
[1.0.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v1.0.0
