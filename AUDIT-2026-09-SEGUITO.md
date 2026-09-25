# Audit di settembre: punti 4–7

Base: `0681a9b`, versione 2.19.1. Questo seguito conserva l'ambito dell'audit
originale: non sostituisce i quattro punti con i limiti residui del primo intervento.
Le modifiche locali al kit cieco e la sua aggiunta al workflow skill-quality sono
preesistenti e conservate. Al workflow si aggiungono i test context-study e gpt-study.
Il push richiesto prima di questo lavoro è già stato eseguito.

## Coda

| Punto | Criterio di chiusura | Stato |
|---|---|---|
| 4. Default conservativo che annulla il line edit richiesto | Prosa revisionabile al livello richiesto; codice, dati e vincoli protetti; casi nuovi e regressioni | #58 e #60 passano in entrambe le ripetizioni e nei due bracci; la tendenza opposta a ritoccare testi già chiari è ancora seguita in M |
| 5. Conversione delle virgolette coerenti | Precedenza unica, riferimenti allineati; nuove prove su curve, dritte, annidamento, conversione richiesta e codice | #61, #62, #64 e #65 passano due volte nella terza regressione; in #63 resta una conversione collaterale dell'apostrofo, seguita in M |
| 6. Lettura obbligatoria onerosa | Candidata con nucleo e letture mirate; confronto con base corretta su fedeltà, qualità, costo e tempi; decisione motivata, senza eliminare regole prima della misura | Chiuso con mancata adozione: confronto v2 completo, risparmio osservato ma perdite semantiche e letture omesse; costo fatturato non disponibile, equivalente API dichiarato |
| 7. Conclusioni sperimentali e artefatti 2.19.0 | Nessuna equivalenza/non inferiorità dedotta dalla parità del pass rate; artefatti recuperati e verificati, oppure assenza dichiarata senza spacciare le cifre per riproducibili | Chiuso sul piano documentale: artefatti A/B non recuperati, limite dichiarato accanto ai conteggi; nuovo tentativo conservato |
| J. Preferenza tipografica replicata in conflitto nei riferimenti | Eliminare il mandato implicito ai caporali in retorica; distinguere uniformità da annidamento e codice | Chiuso nei sorgenti e nelle prove di preservazione/annidamento; la punteggiatura del dialogo è seguita in Q |
| K. Rimandi numerici errati nelle note generate | Non incentivare citazioni interne superflue; citazioni eventualmente richieste verificabili, senza chiamare corretto un rimando non controllato | Nessun rimando spurio nei quattro output Sol di #34, riletti; corrette anche le localizzazioni dei gerundi nella candidata finale |
| L. Harness di attivazione insufficiente per confrontare la lettura | Snapshot di tutti i riferimenti e dei casi; transcript, risposta finale, uso token, tempi e modello effettivo; errori e fallback non validi | Implementato e verificato nel client GPT, con tre probe reali; misura letture, non attivazione automatica. Probe Claude non ripetuto |
| M. Normalizzazione non richiesta di apostrofi e markup | Conservare anche segni validi e formattazione in proofread; ricontrollare #15 e #28 con input nuovi | Migliorato, non stabile su Terra: un fail ciascuno in #15, #59 e #63 nella terza regressione. La candidata finale Sol passa questi tre casi due volte, con conferma della rilettura |
| N. Il runner legge il sorgente vivo dopo averne salvato lo snapshot | Ogni chiamata usa lo snapshot; resume rifiuta snapshot mancanti o alterati; prova mutando il sorgente durante il run | Chiuso: prova per mutazione superata |
| O. Nota che inventa un soggetto sempre esplicito | Non aggiungere inventari di qualità non richiesti; verificare le strutture descritte; aspettativa #7 esplicita | #7 invariato e senza note in entrambe le prove della terza regressione; nelle diagnosi Terra resta l'etichetta imprecisa «gerundi in coda», assente negli output Sol riletti |
| P. Strumenti e ambiente del client non abbastanza isolati | Esporre soltanto strumenti di lettura; niente MCP, esecuzione, scrittura, delega o richieste interattive; disabilitare memorie e attività in background; registrare la policy e appaiare il limite dei turni | Verificati probe GPT e 112 ricevute del confronto v2. Resta registrato l'AGENTS.md personale inapplicabile: non si rivendica isolamento totale |
| Q. Uniformazione incompleta fra estratti di una raccolta | Applicare anche la posizione dei segni rispetto alle virgolette del campione approvato; dichiarare le scelte senza cambiare il capitolo approvato | La candidata finale passa #37 due volte con Sol e la rilettura conferma punteggiatura e nota; i fallimenti precedenti restano conservati |
| R. Riferimenti restituiti interi dal tool ma troncati nel contesto GPT | Evitare il limite intermedio di code-mode; verificare la consegna integrale prima di confrontare letture e qualità | Chiuso: tool diretto verificato e confronto v2 completo; il primo studio interrotto a 37/56 è escluso |
| S. Perdita semantica nella candidata compatta | Non promuovere una riduzione che perde informazioni; conservare risultati e motivazione della decisione | Chiuso con mancata adozione: la candidata perde due volte «non è tecnico» in #27; risultati e decisione conservati |
| T. Qualità residua nel copy, nella voce e nel saggio | Conservare i fail e verificare le correzioni senza sommare i risultati | #20 passa nella terza regressione e #24 nella candidata finale Sol; rimangono formule non risolte in #6 e #40. In #35 restano da distinguere omissioni e incoerenze del giudice |
| U. Accordo fra giudici con motivazioni non affidabili | Non trattare l'accordo binario come verifica dei motivi; controllare i passaggi contestati contro il testo | Nel primo controllo Sol, Luna concorda su 10/10 ma motiva male #40; nel finale promuove due errori confermati dalla rilettura. Non viene usato per certificare i pass |
| V. Attenuazione della modalità mentre si rifiutano dati inventati | Rifiutare l'invenzione senza modificare la forza delle affermazioni fornite | Aperto: #44 run2 della candidata finale sostituisce «limita» con «può limitare». Il rifiuto delle statistiche inventate è corretto ma non basta a promuovere l'output |

La precedenza suggerita nell'audit originale viene precisata: una richiesta esplicita
di conversione deve prevalere sullo stile esistente. La conservazione prevale invece
sulle preferenze predefinite e sulle richieste generiche come «per una rivista».

## Verifiche e limiti

I casi 58–66 sono nuovi casi dev, non held-out. I sei casi held-out restano congelati.
I risultati automatici saranno accompagnati da controlli letterali sui dati protetti
e da rilettura degli output. Una valutazione cieca svolta dall'assistente non sarà
presentata come valutazione umana indipendente.

### Stato del 25 settembre, prima del ripristino della quota

- 50 test locali superati con `node --test evals/*.test.mjs scripts/sync-site.test.mjs`;
  cinque appartengono al modulo blind-form preesistente, rimasto separato.
- Suite valida: 66 casi, 60 dev e 6 held-out. Description: 853 caratteri. Versioni
  coerenti, build single-file, packaging e controllo read-only del sito superati.
- Il validatore generico di skill-creator non parte perché manca PyYAML: non è contato
  fra i controlli superati e non sono state installate dipendenze.
- La candidata compatta resta in `evals/experiments/compact-SKILL.md`, separata dal
  pacchetto. Lo studio conserva i due nuclei, gli stessi riferimenti e i casi prima
  delle chiamate; richiede parità di client, isolamento, modelli e policy.
- L'utente ha scelto di procedere con le verifiche disponibili, dichiarando il limite
  dell'assenza di una valutazione umana indipendente.

Il [primo tentativo](evals/results/reference-2026-09-seguito/README.md) ha prodotto
otto verdetti validi: cinque pass automatici e tre fail, poi un errore al nono tentativo.
Il CLI ha indicato limite di sessione fino alle **18:30 Europe/Rome**. Il processo è
terminato: non è un benchmark ancora in esecuzione. Restavano 15 coppie non eseguite.

La rilettura degli otto output ha confermato i ritocchi non richiesti (#15 e #28) e
trovato una nota falsa nel pass di #7 run1: *invia* ha soggetto sottinteso, non esplicito.
Questo pass automatico non è accettato come verifica editoriale. È il rilievo O, aggiunto
alla coda; i vecchi output e i vecchi giudizi restano intatti. Le correzioni successive
richiedono un nuovo run, non la somma dei risultati con quelli di questa candidata.

## Passaggio ai modelli GPT

Su richiesta dell'utente, il seguito passa a Terra 5.6 (editor), Sol 6 (giudice)
e Luna 6 (controllo incrociato). I tre modelli hanno superato un probe reale di lettura
con modello confermato dal client. I nuovi artefatti sono separati dal tentativo Claude.
La calibrazione e le regressioni ripartono sugli snapshot della candidata corretta;
non si importano i vecchi pass nel nuovo conteggio. I test locali sono ora 53, tutti superati.

Il [protocollo GPT](evals/experiments/README.md) precisa i limiti: instradamento con
letture controllate, non attivazione automatica; istruzioni globali residue registrate
per impronta; costo fatturato non disponibile; nessun lettore umano indipendente.
La quota Claude non impedisce più queste prove, ma il lavoro non è ancora concluso.

Il [resoconto GPT](evals/results/reference-2026-09-seguito/GPT.md) conserva risultati,
limiti del giudice, costi comparabili e decisione. Il confronto v2 è completo: 19/28
pass automatici per la base, 18/28 per la compatta. La compatta non viene adottata.
Non è una prova che la base sia generalmente superiore, né che sia priva di errori.

Le prime regressioni GPT confermano ritocchi non richiesti su #7 e #15 (rilievo M)
e un allineamento incompleto al capitolo approvato in #37 (nuovo rilievo Q). La nuova
correzione elimina l'eccezione vaga «formattazione necessaria al compito» e precisa
le convenzioni delle raccolte. Gli snapshot della prima prova GPT restano invariati:
la versione successiva deve essere verificata separatamente, senza sostituire i fail.

Risultati GPT acquisiti (policy client v1): calibrazione Sol 6, 36/36 fixture concordi;
prima regressione Terra 5.6, 22/28; controllo Luna 6, dieci verdetti concordi con Sol
(nove pass e un fail). La seconda candidata ottiene ancora 22/28: passano #63 e tutti
i nuovi casi #58–66, ma restano fail entrambe le ripetizioni di #7, #15 e #37.
Quindi M e Q non sono dichiarati risolti soltanto perché le istruzioni sono state chiarite.

Il confronto con letture via tool è stato interrotto per R. Il riferimento
`stile-naturale.md` aggiungeva circa 11.800 token al contesto, contro circa 20.000
quando fornito integralmente. Aumentare soltanto il budget di storia non bastava:
la chiamata indiretta via code-mode manteneva il limite intermedio. Con un namespace
diretto e budget 65.536 il probe consegna circa 20.100 token, coerenti con il riferimento
integrale. La policy v2 impedisce di riutilizzare o mescolare i vecchi bracci.
Calibrazione e regressioni single-file non usano quel tool e restano prove distinte valide.

La rilettura del confronto v2 trova anche una contraddizione ancora attiva nei riferimenti:
la scheda del dialogo imponeva la virgola esterna, mentre il nucleo chiedeva di seguire
il campione della collana (Q). Il riferimento sullo stile imponeva invece di variare
il ritmo «sempre», anche dopo un controllo minimo (M). Entrambe le istruzioni vengono
circoscritte, insieme alla richiesta di cercare a ogni costo residui «da AI» nell'audit.
I riferimenti ora ricordano che il livello di revisione prevale sulle tecniche proposte.
Lo snapshot `gpt-followup-contract-2026-09-25` verifica queste modifiche separatamente.
La prova precedente resta immutata; non viene aggiornata con gli output della correzione.

La terza regressione Terra termina con 27/36 pass automatici, senza errori tecnici.
Il controllo mirato con Sol come editor ottiene 4/10; Luna concorda sui dieci verdetti,
non su motivazioni tutte attendibili. Per #40 run2 sostiene che manchi l'arrivo prima
dell'apertura, che invece è presente: l'accordo sul fail non rende vera quella diagnosi.

Due ulteriori precisazioni distinguono l'adattamento della persona grammaticale dalle
esperienze inventate e rendono esplicita, nel formato di consegna, la nota sulle
uniformazioni editoriali anche in chat. Il controllo finale congela questi cambiamenti
prima delle chiamate: #6, #11, #15, #24, #34, #37, #40, #44, #55, #59 e #63, due volte.
La selezione è diagnostica su casi dev, non un nuovo held-out. Il cambio di modello
non cancella i fail di Terra né certifica una superiorità generale di Sol.

Il controllo finale Sol termina con 18/22 pass automatici. Passano due volte #11,
#15, #24, #34, #37, #55, #59 e #63; i quattro fail sono #6 run1, #40 in entrambe
le ripetizioni e #44 run2. Restano quindi rilievi aperti, compresa la nuova attenuazione
modale V. Luna ottiene 20/22, ma i due pass discordi (#40 run2 e #44 run2) non sono
accettati dalla rilettura: restano quattro errori. La candidata compatta è esclusa,
ma l'audit complessivo non è dichiarato chiuso. Tutti i processi di prova sono terminati.

Controlli finali locali: 53/53 test, versioni/description/sito, generazione single-file,
packaging e diff-check superati. Il limite PyYAML resta quello già dichiarato.
I file preesistenti del kit cieco sono invariati per SHA-256. Nessun commit o push
di questo seguito; HEAD e origin/main restano a `0681a9b`.

## Piano precedente per la ripresa delle prove Claude

Quando la quota torna disponibile, eseguire in sequenza:

1. Ricontrollo della candidata estesa sui casi #7, #15, #28, #34, #37 e #58–66, due
   ripetizioni. Leggere tutti gli output e verificare letteralmente codice e delimitatori.
2. Probe del client isolato; poi i due bracci preparati con `context-study.mjs`, secondo
   [il protocollo](evals/experiments/README.md). Se il probe non trova le credenziali,
   non copiare segreti e non dichiarare riuscito l'isolamento.
3. Giudizi, confronto di costo/tempi/letture e rilettura completa. Promuovere o scartare
   la candidata con motivazione; registrare e risolvere gli eventuali nuovi rilievi.
4. Verifica finale di sorgenti, file generato, pacchetto, documentazione e coda. Finché
   mancano queste prove, i punti comportamentali non sono chiusi e il goal resta aperto.
