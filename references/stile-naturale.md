# Stile naturale italiano — rimuovere i segni dell'AI e dare voce

Riferimento per far suonare un testo italiano **naturale, umano, con una voce**.
Adattato dalla guida "Signs of AI writing" (WikiProject AI Cleanup), riscritta per
l'italiano. Complementare a `punteggiatura.md`: lì la *correttezza*, qui la *naturalezza*.

> L'italiano AI-generato è spesso peggiore dell'inglese: eredita strutture inglesi
> tradotte male (gerundi, trattini lunghi, capitalizzazione dei titoli, virgolette curve)
> e ci aggiunge i tic dell'italiano accademico-giornalistico (avverbi in *-mente*,
> perifrasi astratte, latinismi, burocratese). Suona "tradotto da una macchina che ha
> studiato all'università": pomposo, prevedibile, senza ritmo.

---

## Dare voce (non basta togliere i tic)

Una prosa "pulita ma morta" è riconoscibile quanto lo slop: periodi tutti uguali, solo
cronaca neutra, nessuna opinione, nessuna prima persona, niente ironia. Per iniettare voce:

- **Avere opinioni.** Reagire ai fatti, non solo riportarli.
- **Variare il ritmo.** Periodi brevi e secchi. Poi periodi lunghi, che si prendono il
  loro tempo. Alternare.
- **Riconoscere la complessità.** Gli umani hanno sentimenti misti. *"Mi colpisce, ma c'è
  qualcosa che mi mette a disagio"* batte *"È interessante"*.
- **Usare "io" dove ci sta.** Onesto, non poco professionale (in saggistica/divulgazione
  sempre; nelle tesi recenti spesso accettato — esserne consapevoli).
- **Lasciare un po' di disordine.** Digressioni, incisi, pensieri a metà sono umani.
- **Essere specifici sui sentimenti.** Non *"è preoccupante"* ma il dettaglio concreto
  che lo rende tale.

**Calibrazione voce:** se l'utente fornisce un campione del proprio scrivere, analizzalo
prima (lunghezza periodi, livello lessicale, abitudini di punteggiatura, tic, uso di
tu/Lei) e **replica quella voce**, non limitarti a togliere i tic.

**Autorità = impegno, non tono.** «Se non rendi quel che scrivi al meglio delle tue possibilità, che
scrivi a fare? […] poi non ti giustificare» (Carver). L'autorità non è un tono assertivo: è il
rifiuto di scrivere sotto le proprie possibilità. Un testo «fatto di fretta, e si vede» lo dice al
lettore, che lo registra.

---

## A. Pattern di contenuto

**1. Inflazione di significato.** *rappresenta/costituisce/incarna, si configura come, è
una testimonianza di, gioca un ruolo cruciale/vitale/fondamentale, riflette una tendenza
più ampia, punto di svolta, pietra miliare, snodo cruciale, panorama in evoluzione, lascia
un'impronta indelebile, profondamente radicato, patrimonio inestimabile.* → Gonfia
l'importanza di qualunque cosa. Di' cosa è successo, in concreto. **Hype della scoperta**
(scienza, tech, medicina, startup): *rivoluzionario, epocale, senza precedenti, cambierà tutto,
svolta storica, cura definitiva, potrebbe un giorno risolvere…* → descrivi cosa è stato fatto, da
chi, con quale margine; non cosa potrebbe essere un giorno (vedi `spiegare-con-chiarezza.md` §8).

**2. Rilievo mediatico esagerato.** *ampia copertura mediatica, citata in numerose testate,
solida presenza sui social, voce autorevole del settore.* → Un fatto datato e specifico
vale più di un elenco di testate.

**3. Analisi superficiali col gerundio.** *sottolineando, evidenziando, garantendo,
riflettendo, contribuendo a, configurandosi come* in coda alla frase per simulare
profondità. → Vedi §14.

**4. Linguaggio promozionale.** *vanta, vibrante, ricco, dinamico, sfaccettato, immerso/
incastonato/adagiato, nel cuore di, all'incrocio tra, rinomato, mozzafiato, suggestivo,
incantevole, pittoresco, gioiello, perla, scrigno.* → Vedi §33.

**5. Attribuzioni vaghe.** *osservatori del settore, secondo molti studiosi, gli esperti
ritengono, fonti autorevoli, si dice/si ritiene* (senza soggetto). → Cita la fonte o togli
l'affermazione.

**6. Sezioni "Sfide e prospettive future".** *Nonostante alcune sfide… Nonostante le
difficoltà… il futuro appare…* → Chiusura formulaica con apertura ottimistica vuota.
Sostituisci con un fatto concreto.

---

## B. Lingua e grammatica

**7. Vocabolario AI ad alta frequenza.** *cruciale, fondamentale, imprescindibile;
evidenziare, sottolineare, mettere in luce; valorizzare, esaltare; intricato, articolato,
sfaccettato, stratificato; intreccio, mosaico, trama, tessuto, ordito; panorama, scenario,
contesto, orizzonte; testimoniare; duraturo, imperituro, indelebile; vibrante, vivace,
dinamico; pregevole, prezioso, inestimabile; abbracciare, racchiudere, incarnare; sinergia,
dialogo; delicato equilibrio, sapiente miscela.* → Il problema è la **densità**: diradare.

**8. Perifrasi al posto di "è/sono".** *si configura come, si pone come, si presenta come,
si rivela, si erge a, assurge a, costituisce, rappresenta, risulta essere, appare come.*
→ Usa **è / sono / ha**.

**9. Parallelismi negativi — la famiglia del tic bipolare.** *"Non solo… ma anche", "Non
si tratta tanto di X quanto di Y"*; code tipo *"nessuna ambiguità", "niente sprechi"*. →
Afferma in positivo. Caso a parte, **il più diffuso e il più sfuggente**, è la **definizione
bipolare** *«non è X, ma è Y»*: l'AI definisce una cosa dicendo prima cosa *non* è, poi
cosa è. Sembra precisione, è un tic. Su un saggio di 40.000 parole se ne contano facilmente
50-70: una grep ingenua sulla forma letterale ne trova zero, perché il pattern vive in
**almeno cinque varianti morfosintattiche** che vanno tutte censite prima di dichiarare
"pulito" un testo.

**Le cinque varianti del bipolare** (da cercare tutte, non solo la prima):

- (a) **Inversione del polo:** *«X, non Y»* — *«è strutturale, non decorativa»*, *«è
  co-attore, non substrato»*. Stessa identica bipolarità, ordine invertito.
- (b) **Plurali e tempi diversi del verbo essere:** *non sono X ma Y*, *non viene X ma Y*,
  *non hanno X ma Y*, *non era X ma Y*, *non saranno X ma Y*, *non si tratta di X ma di
  Y*. Es. *«non sono interpretate ma usate»*, *«non viene dall'interno ma da fonti
  esterne»*.
- (c) **Senza secondo "è" dopo "ma":** *«non è X ma Y»* dove Y non comincia con *è*. Es.
  *«non è il caso controllato dall'autore, ma un organismo vivente»*.
- (d) **Bipolare con i due punti — statisticamente il più frequente nei testi accademici
  accurati:** *«non è X: è Y»*. Es. *«non è un guasto da riparare: è la forma ordinaria
  del linguaggio»*; *«non è metafora: è la condizione strutturale del nostro abitare le
  parole»*. È la variante meno intuitiva da riconoscere — la grep su *"non è… ma"* non
  la prende — ed è quella che sopravvive a tutte le passate.
- (e) **Bipolare con "e non":** *«è X, e non Y»*, *«è X e non Y»*. Es. *«la carne di
  Merleau-Ponty 1964 è la simpoiesi di Haraway 2016 in un altro lessico, e non è la
  fenomenologia umanistica»*.

**Riscrittura: assertiva pura, non per inversione.** L'errore tipico è "correggere"
*«non è X, ma è Y»* in *«è Y, non X»*: non è una correzione, è la **variante (a)** della
stessa famiglia — la bipolarità resta, solo più compatta. La riscrittura corretta
**elimina del tutto il polo negativo**. Il tic attraversa i generi: ecco quattro esempi
da generi diversi, per mostrare che non è un problema solo di prosa accademica.

| genere | ✗ pseudo-correzione (inversione) | ✓ assertiva pura |
|---|---|---|
| saggistica filosofica | *non è metafora, ma è la condizione strutturale* → *è la condizione strutturale, non una metafora* | *è la condizione strutturale del nostro abitare le parole* |
| accademico (forma con due punti) | *non è X: è Y* → *è Y, non X* | *è Y* (e basta) |
| giornalismo | *la protesta non è una rivolta, ma una richiesta di ascolto* → *la protesta è una richiesta di ascolto, non una rivolta* | *la protesta è una richiesta di ascolto* |
| copy/professionale | *il nostro servizio non è solo un'assistenza tecnica: è un partner di crescita* → *il nostro servizio è un partner di crescita, non solo assistenza tecnica* | *il nostro servizio accompagna la tua crescita* |

Se serve segnalare al lettore il contrasto con la lettura comune, fallo con una **clausola
breve a margine** (*«contro la lettura corrente, è Y»*, *«più che una metafora, è Y»*) —
non rimettendo X in posizione speculare.

**Quando il polo negativo va PRESERVATO (con motivazione esplicita).** Non tutto va
tagliato: la grep produce falsi positivi e in 5 casi la negazione fa lavoro genuino.

1. **Citazioni dirette.** Il polo negativo è dentro caporali di un autore: intoccabile.
   Es. Dawkins, *«cieco perché non vede dinanzi a sé, non pianifica conseguenze, non ha
   in vista alcun fine»*.
2. **Anafora retorica triadica** *«non X, non Y, non Z»*: figura legittima, falso
   positivo della grep. Es. *«Non è prodotto per essere ricevuto da un destinatario
   esterno, non è codificato secondo una grammatica condivisibile, non porta in sé
   un'intenzione comunicativa»*.
3. **Frase-tesi-manifesto in apertura** di capitolo o sezione: il polo negativo è la
   lettura standard che il testo deve smentire programmaticamente — tagliarlo svuota la
   mossa. Es. *«la non-condivisione di codice fra specie è la condizione operativa del
   dispositivo, non il suo limite»*.
4. **Distinzione filosofica cardine** che esclude esplicitamente la posizione di un
   autore contrastato. Es. Uexküll, *«il tempo non è un contenitore neutro ma un prodotto
   del soggetto»* — il polo «contenitore neutro» è la posizione kantiana che Uexküll
   smonta, e va detta.
5. **Definizioni in glossario o cappello tecnico**, dove la chiarificazione bipolare è
   didascalica per il lettore. Es. *«la plant blindness non è il rapporto cieco con il
   segno né la cecità reciproca della triade, ma la marginalità del vegetale nello
   sguardo umano»*.

In tutti gli altri casi, **taglia il polo negativo**.

**Workflow di audit per testi lunghi** (saggi, tesi, libri). Procedi a **3 giri minimi + 1
di pulizia**, in quest'ordine:

1. **Giro 1 — letterale:** *«non è X, ma è Y»* (`non è … ma è`). La forma "da manuale".
2. **Giro 2 — inversione:** *«X, non Y»* (`, non `). Pattern (a). È quello che sfugge
   perché *sembra* già una correzione.
3. **Giro 3 — due punti:** *«non è X: è Y»* (`non è … :`). Pattern (d). La variante più
   frequente nei testi accademici accurati.
4. **Giro 4 (pulizia) — plurali, tempi, *e non*:** *non sono*, *non viene*, *non hanno*,
   *non era*, *non saranno*, *non si tratta di*; e *«è X, e non Y»* (`, e non`). Pattern
   (b) ed (e).

**Copertura attesa:** i tre giri minimi catturano la grande maggioranza delle occorrenze
in un testo accademico medio; il quarto giro chiude la coda (plurali, tempi diversi, *e
non*). La proporzione varia col genere — il copy è più ricco di (a) e (d), la prosa
giornalistica di (b) — e con lo stile dell'autore. Dichiara un testo "pulito" solo dopo
che **tutti e quattro** i giri danno zero occorrenze non motivate.

5. **Censimento per file/capitolo, in batch.** Presenta tutte le occorrenze di un capitolo
   insieme — non una per una — così l'utente vede la densità e decide in blocco.
6. **Per ogni occorrenza, 2-3 opzioni:** (a) preserva motivatamente — citando uno dei 5
   casi di preservazione; (b) riscrivi assertiva pura; (c) compromesso (clausola a
   margine). **Decide l'utente**; tu applichi.

**Spia di densità (euristica indicativa, da tarare sul tipo di testo):** se in un capitolo
di 3.000-5.000 parole ne conti più di 4-5, il tic sta colonizzando la voce, non
punteggiandola — interviene anche se ogni singola occorrenza è motivabile in astratto. Non
è una misura empirica: è una soglia di lavoro che si alza per la saggistica filosofica e
si abbassa per il copy.

> **Attenzione: il pattern si annida anche dentro l'apparato di citazione.** Quando l'AI
> espone la citazione di un autore con una glossa esplicativa, la formula bipolare riemerge
> dentro la glossa come se fosse parte dell'esposizione neutra del pensiero altrui. Es. *«La
> parola decisiva, "carne" (chair nel francese originale), non designa il corpo individuale
> dell'osservatore né la materia delle cose, ma il tessuto comune che li tiene insieme»* — la
> struttura *«X non designa Y né Z, ma A»* è bipolare ternaria, generata nell'esposizione,
> non è citazione diretta dell'autore. In audit, controlla **esplicitamente** anche le frasi
> di glossa che accompagnano le citazioni: chi legge tende a trattarle come "parte della
> citazione" e quindi intoccabili, ed è lì che il tic sopravvive.

**10. Regola del tre.** Triadi forzate (*innovazione, ispirazione e nuove prospettive*).
Se ne conti tre o quattro in un paragrafo, è AI.

**11. Variazione elegante (e antonomasie).** Rotazione compulsiva di sinonimi e perifrasi pur
di non ripetere un nome: *Federer → il tennista svizzero*, *Montale → il poeta ligure*, *i
Baustelle → il gruppo musicale toscano*. **La ripetizione non è il male:** ripeti pure il nome,
anche a poca distanza — la variazione forzata si sente, ed è un tell (la si avverte come
artificio). Stessa cosa per le **antonomasie** da sussidiario (*il Sommo Poeta, il Cigno di
Busseto, la nostra eroina*): chiama le cose e le persone col loro nome.

**12. False scale ("da X a Y").** *"dal Big Bang alla rete cosmica, dalla nascita delle
stelle alla materia oscura"* dove X e Y non stanno su una scala sensata. → Elenca e basta.

**13. Voce passiva e frammenti senza soggetto.** L'italiano usa passivo e *si* impersonale
più dell'inglese: calibra. Sospetto quando nasconde l'agente dove servirebbe, o accumula
*"viene utilizzato / viene gestito / viene processato"*. → Soggetto esplicito.

**14. Gerundite — il gerundio pleonastico in coda.** Uno dei tell più riconoscibili.
Frasi che dovrebbero finire si estendono con *"…generando…, …portando a…, …creando…,
…risultando in…, …andando a…"*. Spesso anche grammaticalmente scorretto. → **Regola:** se
in un paragrafo conti più di un gerundio, riscrivi il resto in proposizioni esplicite.

**15. Avverbi in -mente a raffica.** *particolarmente, significativamente, sostanzialmente,
fondamentalmente, effettivamente, sicuramente, praticamente, principalmente, profondamente,
generalmente, essenzialmente, indubbiamente.* → **Regola:** prova a togliere ogni avverbio
in *-mente*; se la frase regge senza, è meglio. **Gli intensificatori** (*estremamente,
assolutamente, incredibilmente, straordinariamente*) non potenziano: sottraggono. *Una mattina
estremamente gelida* fa meno freddo di *una mattina gelida*; *sono assolutamente deciso* insinua
già un dubbio. (Sul meccanismo vedi `revisione-e-proprieta.md` §3.)

**16. Accumulo di sostantivi astratti.** *processo, dimensione, prospettiva, modalità,
contesto, ambito, dinamica, configurazione, valorizzazione, ottimizzazione, declinazione,
articolazione.* Catene genitive (*"il processo di valorizzazione della dimensione
esperienziale"*). → **Regola:** tre astratti in fila legati da *di* → riscrivi con un verbo.

**17. Latinismi e francesismi pretenziosi.** *in primis, de facto, ergo, ipso facto, ex
post/ex ante, prima facie, a fortiori, in nuce, tout court, en passant.* Alcuni sono
normali in contesto tecnico (*ad hoc, ex post*); diventano tell quando si accumulano o
sono fuori registro.

**18. Burocratese.** *provvedere a, porre in essere, addivenire a, al fine di / allo scopo
di, in ottemperanza a, nell'ambito di, in seno a, in virtù di, in ragione di, in ordine a,
con riferimento a, sulla base di quanto previsto.* → Linguaggio diretto.

**19. Periodi a subordinate annidate.** Tre-quattro subordinate incassate con *che*
polifunzionali ambigui. → **Regola:** se un periodo supera 35-40 parole o ha più di due
*che*, spezzalo.

**20. Connettori sovrabbondanti.** *altresì, peraltro, d'altro canto, ciò nonostante,
cionondimeno, nondimeno, pertanto, perciò, dunque, di conseguenza, ovvero, vale a dire,
nello specifico, tuttavia, inoltre, per di più, oltretutto.* → L'italiano umano lascia
molti nessi impliciti; evita i connettori troppo formali fuori registro.

---

## C. Stile e tipografia (rimandano a `punteggiatura.md`)

**21. Trattino lungo (em dash) — tell DOPPIO in italiano.** La tipografia italiana usa
poco la lineetta lunga: si appoggia su virgole, due punti, parentesi, punto e virgola.
Tanti `—` (o un mix incoerente di `-`, `–`, `—`) = tradotto o AI. → **Regola:** di default
sostituisci ogni em dash con virgola, due punti, parentesi o punto.

**22. Grassetto a tappeto.** Evidenziazioni meccaniche di definizioni e sigle. → Togli.

**23. Liste con header in linea.** Ogni voce inizia con un termine in **grassetto:** più
definizione. Schema da manuale aziendale/LinkedIn. → Prosa scorrevole o liste semplici.
*Varianti:* (a) **articolo tutto a bullet** dove la prosa scorrerebbe meglio; (b)
**segmentazione eccessiva**, un sottotitolo per ogni paragrafo anche breve (*Benefici / Vantaggi
/ Conclusione*), che simula profondità senza averla. → Se due-tre punti si leggono meglio come
frase, ricomponi in prosa; se il sottotitolo ripete il paragrafo, toglilo.

**24. Capitalizzazione anglosassone nei titoli.** L'italiano usa **sentence case** (solo
prima parola e nomi propri). ✗ `Negoziazioni Strategiche E Partenariati` →
✓ `Negoziazioni strategiche e partenariati`. (Mantieni *eBay, iPhone* e affini.)

**25. Emoji** decorative su titoli/bullet → fuori posto in italiano formale/saggistico.

**26. Virgolette curve all'inglese.** L'AI infila `" "` e `' '` curve, spesso miste a
dritte. → Editoria/saggistica: **caporali « »**. Web/divulgazione: **virgolette dritte " "**
uniformi. Mai mescolare. (Vedi `punteggiatura.md` → Virgolette.)

---

## D. Comunicazione (residui da chatbot)

**27. Artefatti collaborativi.** *Spero ti sia utile!, Fammi sapere se…, Ottima domanda!,
Certamente!, Ecco a te…, Volentieri!* → Togliere del tutto.

**28. Disclaimer da knowledge cutoff.** *alla data di…, fino al mio ultimo aggiornamento,
sulla base delle informazioni disponibili, sebbene i dettagli siano limitati.* → Togliere.

**29. Tono adulatorio.** *Ottima domanda! Hai assolutamente ragione! Hai colto nel segno!*
→ Andare al punto.

---

## E. Riempitivi, cautele, chiusure

**30. Frasi riempitive.** *"Al fine di raggiungere questo obiettivo"* → *"Per raggiungerlo"*;
*"In ragione del fatto che"* → *"Perché"*; *"In questo preciso momento storico"* → *"Oggi"*;
*"possiede la capacità di elaborare"* → *"può elaborare"*; *"È importante notare come i dati
mostrino"* → *"I dati mostrano"*.

**31. Hedging eccessivo.** *"Si potrebbe potenzialmente forse argomentare che…"* →
**Regola:** un solo marcatore di incertezza per affermazione (*potrebbe*, *forse*, *sembra*).

**32. Conclusioni generiche positive.** *il futuro si prospetta brillante, tempi
entusiasmanti ci attendono, una nuova era, un orizzonte di possibilità, un viaggio ricco
di promesse.* → Sostituisci con un fatto concreto e verificabile. **Variante "morale a goccia"
(2024–25):** la chiusura edificante che si dà un'aria concreta con la grana minima — *ognuno di
noi può fare la differenza, un giorno alla volta, una scelta alla volta*; *il cambiamento inizia
da te, oggi stesso*. Stessa cura: un fatto concreto, o niente.

**33. Aggettivi turistico-promozionali.** *mozzafiato, suggestivo, incantevole, pittoresco,
caratteristico, pregevole, imperdibile, gioiello, perla, scrigno, antico borgo, maestoso,
secolare, millenario, inebriante, avvolgente, autentico/genuino (figurati), ricco di
fascino.* Tipici dei finti articoli di viaggio. → Fatti: dove si trova, da quando, cosa
conserva.

**34. Tropi di autorità persuasiva.** *la vera domanda è, in sostanza, in fin dei conti,
in ultima analisi, a ben vedere, ciò che realmente conta, il nocciolo della questione.*
→ Spesso introducono un'osservazione ordinaria con cerimonia in più.

**35. Segnaletica e annunci.** *Approfondiamo, andiamo a vedere, vediamo insieme, scopriamo
come, entriamo nel vivo, ecco cosa devi sapere, senza ulteriori indugi.* → Fallo, non
annunciarlo.

**36. Header frammentati.** Dopo un titolo, una frase generica che ripete il titolo come
"riscaldamento". → Entra subito nel contenuto.

---

## F. L'antilingua — l'affettazione all'italiana

Lo slop *prima* dell'AI, e che l'AI amplifica. È la malattia descritta da Calvino
(*L'antilingua*), Savinio ("la teoria dell'eleganza") e Giunta: chi scrive scambia la
semplicità per sciatteria e sostituisce la parola viva con quella "scelta", per darsi un tono.
Risultato: una prosa che tiene a distanza invece di comunicare.

**37. Sostituzione colta.** Preferisci **sempre** la parola comune a quella "elegante" (di
default; non è una Legge, ma una direzione):

| ✗ "scelto" | ✓ comune | | ✗ "scelto" | ✓ comune |
|---|---|---|---|---|
| attendere | aspettare | | decesso | morte |
| recarsi | andare | | effettuare | fare |
| giungere | arrivare | | optare per | scegliere |
| dimora/abitazione | casa | | utilizzare | usare |
| acquistare | comprare | | visionare | vedere |
| problematica | problema | | tematica | tema |
| tipologia | tipo | | maggiormente | più |
| evento fieristico | fiera | | terminare | finire |

→ Per *costituire/rappresentare/risultare* al posto di **è/sono/ha** vedi §8.

**38. Verbo generico + sostantivo astratto.** Un verbo vuoto seguito da un nome astratto che ne
porta il senso, al posto del verbo pieno. → *effettuare un controllo* → **controllare**; *fare
un incontro* → **incontrare**; *procedere alla verifica* → **verificare**; *dare comunicazione*
→ **comunicare**; *portare a compimento* → **concludere**; *sottoporre a esame* → **esaminare**;
*porre attenzione* → **fare attenzione**. **Regola:** se "verbo + nome astratto" si dice con un
solo verbo, usalo. **Nominalizzazione (sottotipo AI):** l'AI preferisce il sostantivo d'azione al
verbo — *l'acquisizione delle competenze è utile al miglioramento delle capacità* → *acquisire
competenze è utile a migliorare le capacità*. È lo **stile nominale** (il nome che schiaccia il
verbo: *le dichiarazioni del ministro* per *il ministro dichiara*); riportalo al verbo pieno.

**39. Parole di plastica (aziendalese alla moda).** *criticità, attenzionare, concretizzare,
ottimizzare, problematizzare, evidenziare, implementare, efficientare, tempistica, progettualità,
professionalità, percorso (figurato), focalizzare, approcciare, rapportarsi, interloquire.* →
Appesantiscono e non aggiungono nulla. Linguaggio diretto. (Repertorio in
`cliche-e-parole-alla-moda.md`.)

**40. Less is more — togli i parassiti.** Regola di Orwell: *se puoi togliere una parola,
toglila*.
- **aggettivi/avverbi inutili:** *un seno armonioso e prominente* → *un bel seno*; *via i
  "beastly adjectives"* (Dahl). Scuoti il testo e fa' cadere gli avverbi superflui (Simenon).
- **sostantivo-parassita generico:** *descrizioni di carattere realistico* → *descrizioni
  realistiche*; *perfetto in termini di clima* → *ha un clima perfetto*; *il processo di
  elaborazione* → *l'elaborazione* (un'elaborazione *è già* un processo).
- **«quello che è» superfluo:** *vorrei parlare di quelli che sono i miei gusti* → *dei miei
  gusti*; *ci ha raccontato quelle che sono le sue paure* → *le sue paure*.

---

## G. Verità e misura — contro pathos, vaghezza, timidezza

**41. Tieniti un'ottava sotto (contro il pathos kitsch).** La retorica emotiva è slop dei
sentimenti: melodramma, stile a singhiozzo, sottolineature strappalacrime — *«un boato dentro
l'anima», «la bellezza distrutta», «cosa vedono quegli occhi?»*. Più la materia è grave
(tragedie, lutti), più il tono va tenuto **sobrio**: *understatement*, non effettacci. Niente
commenti emotivi indebiti nel testo oggettivo (*purtroppo, per fortuna*). → Vedi anche
`retorica-efficacia.md` §6 (buona vs cattiva retorica).

**42. Individuazione — concreto batte generico.** Non *animali* ma *pinguini*; non *una
staccionata* ma *una staccionata color avio*. Dai un nome alle cose, soprattutto se un nome ce
l'hanno. Bandisci le **informazioni vuote**: *«ha influenzato Camus e altri autori del
Novecento»* (chi? quali?) → di' *chi/cosa/quando*, o non dire niente. (Collega §2, §5.) Il dettaglio
concreto nasce dall'**interesse vero**, non dalla regola: «a volte lo scrittore deve restare a bocca
aperta davanti a qualcosa — un tramonto o una scarpa vecchia» (Carver). Un dettaglio che non ha
sorpreso te, raramente sorprenderà il lettore: se è concreto ma neutro, l'hai inserito, non visto.

**43. Non sussurrare (falsa modestia citazionale).** Togli le perifrasi che attenuano il
giudizio o lo scaricano su "autorità" vaghe: *Dante può essere considerato il più grande poeta
italiano* → *Dante è il più grande poeta italiano*; *è ritenuto da più parti uno dei maggiori* →
*è stato uno dei maggiori*. Se è il tuo giudizio (e l'hanno chiesto a te), prenditelo. Diverso
dall'hedging §31: lì togli l'incertezza accumulata, qui la timidezza che si nasconde dietro gli
altri.

---

## H. Antilingua scolastica, copy e tic recenti

**44. Antilingua scolastica.** Registro pseudo-formale dei temi liceali (l'AI lo produce facile,
i suoi dati ne sono pieni): *egli/ella* → *lui/lei*; *ciò* → *questo / il fatto che*; *il quale* a
raffica → *che*; *allorché* → *quando*; *in seno a* → *in/dentro*; **aggettivo preposto**
innaturale (*importanti conseguenze* → *conseguenze importanti*); **verbi ricercati per banali**
(*osservare* → *guardare*, *constatare* → *notare*, *trascorrere* → *passare*, *terminare* →
*finire*). I pronomi soggetto *egli/essi* sopravvivono solo nella prosa scolastica: nello scritto
moderno **ripeti il nome**. → Completa la sezione F (antilingua).

**45. Incipit contestualizzante ("Nel mondo di…").** L'AI apre con una cornice
geografica/settoriale/temporale: *Nel mondo della gastronomia… / Nell'era digitale… / Nel
panorama attuale…*. Parole-spia in **prima** posizione: *nel mondo di, nell'industria, nel
panorama, nell'era di, in questo contesto*. → Entra subito nel soggetto. ✗ *Nel mondo degli
accessori tech, gli ombrelli smart rivoluzionano il mercato.* ✓ *L'ombrello di BrellaCiao ha un
GPS: lo perdi di rado.*

**46. Domanda retorica / "Se… allora" d'apertura.** Incipit pubblicitari abusati: *Stanchi della
solita pizza? / Se ami la buona cucina, non perderti…*. → Entra con un fatto o un dato. ✗
*Stanchi della solita pizza?* ✓ *Da Bella Napoli l'impasto lievita 72 ore.*

**47. Capoversi con attacco omogeneo.** Tutti i paragrafi iniziano con la stessa struttura (tutti
*Il/La…* + sintagma, o tutti con un avverbio). Letto ad alta voce è un metro meccanico. → Varia
gli attacchi: soggetto, complemento anteposto, frase breve nominale, subordinata in apertura.

**48. Sinestesie decorative (copy gastro-lifestyle).** *sinfonia di sapori, danza sul palato,
tripudio di gusti, opera d'arte commestibile, racconto di ingredienti.* → Descrivi in modo diretto,
o usa **una** metafora, non tre. ✗ *un cucchiaio che racconta una sinfonia di sapori* ✓ *un gusto
per cucchiaio: pistacchio, fragola, cioccolato amaro.*

**49. Parole vuote del copy professionale** ("potrebbe dirlo chiunque?"). *prodotti di qualità,
materie prime d'eccellenza, leader del settore, soluzioni innovative, al servizio del cliente.*
Test: la frase starebbe sul sito di cento concorrenti senza cambiare? Allora è vuota. → Un numero,
un dato, una caratteristica non condivisa. ✗ *Capi di alta qualità con materie prime d'eccellenza.*
✓ *Maglioni in cashmere di alpaca: non infeltriscono, spediti in 5 giorni.* (Collega §33, §42.)

**50. Testo "a mosaico".** Frasi corrette ma slegate: ognuna vera, nessuna connessa per
causa/conseguenza/concessione. Sintomo: puoi riordinarle senza che il senso cambi. ✗ *La
situazione è complessa. I dati mostrano un calo. Le aspettative erano alte. Bisogna riflettere.*
✓ *I dati calano nonostante le aspettative alte: la situazione è più complessa del previsto. Vale
la pena capire perché.* → Ogni frase risponda a «perché viene *qui*, dopo la precedente?». (Guida
positiva in `coesione-e-connettivi.md`.)

**51. Virgolettati e citazioni inventati.** L'AI produce virgolettati verosimili attribuiti a
persone reali, o a personaggi generici spacciati per veri: *«Come dice Piero, uno degli ultimi
pescatori…»* (Piero non esiste); *«Come disse Einstein, "…"»* (citazione mai pronunciata). →
Verifica ogni virgolettato attribuito a una persona reale; se è fittizio, dichiaralo. Mai spacciare
citazioni AI per documentazione. (Collega §5 e la guardia sui fatti in SKILL.md.)

**52. Metafore miste.** Due immagini incompatibili nella stessa frase → effetto comico
involontario. ✗ *la morsa del freddo incombeva sulla città* (la morsa stringe, non incombe); ✗
*gettare benzina sul fuoco aprendo una finestra di dialogo.* → Una sola immagine, sviluppala. (Sul
collaudo letterale vedi `revisione-e-proprieta.md` §4.)

**53. Pleonasmi e ridondanze lessicali.** L'aggettivo/avverbio è già contenuto nel nome o nel
verbo: *approccio iniziale, conclusione finale, esperienza passata, periodo di tempo, scendere
giù, tornare indietro, pianificare in anticipo, prerequisito necessario.* → Togli il di più. Anche
i **possessivi ridondanti** con parti del corpo se il soggetto è chiaro: *aprì i suoi occhi* →
*aprì gli occhi*.

**54. Doppie negazioni e forma negativa.** La litote ha valore retorico (attenuare, ironizzare);
fuori da quello, sciogli in positivo — si legge con meno sforzo. ✗ *non si può non ammettere che*
→ *bisogna ammettere che*; ✗ *non è privo di interesse* → *è interessante*; ✗ *non di rado* →
*spesso*.

**55. Coerenza di registro e di persona.** (a) *Cadute di stile:* un'intrusione di registro
diverso — *ci siamo confrontati sulle problematiche* in un messaggio tra amici; *risultati
veramente tanta roba* in una relazione. (b) *Deriva del punto di vista:* *tu/voi/Lei* che cambiano
nello stesso testo (*…se siete freddolosi… ti semplifica la vita… cosa volete di più?*). → Scegli
registro e persona all'inizio e tienili; in rilettura cerca *tu/ti/tuo* e *voi/vi/vostro*.

**56. Participi del burocratese.** Due costruzioni amministrative da sciogliere (completano §18):
- **participio presente con valore di relativa:** *i componenti il comitato* → *i membri del
  comitato* / *chi fa parte del comitato*; *gli aventi diritto* → *chi ha diritto*; *il personale
  frequentante il corso* → *…che frequenta il corso*.
- **ablativo assoluto / participio "sciolto"** (con soggetto diverso dalla reggente): *Tenuto conto
  della situazione, si procederà* → *Poiché la situazione…, si procederà*; *Esaminati i documenti, la
  pratica è respinta* → *Dopo aver esaminato i documenti…*.
→ Fuori dal linguaggio giuridico stretto, riscrivi con una subordinata esplicita (relativa, causale,
temporale).

**57. Niente trucchi — contro la scrittura "chic" e lo sperimentalismo gratuito.** «Niente trucchi.
Punto e basta» (Carver). Non sono trucchi solo i finali a sorpresa: lo sono anche la prosa oscura che
*simula* profondità, lo sperimentalismo formale usato «come licenza per scrivere in modo sciatto», la
scrittura «estremamente elaborata e chic» che tiene fuori il lettore, l'astrazione che copre la
mancanza di un'osservazione vera. → Una forma insolita è legittima quando **porta più chiarezza o più
forza** (McCarthy che toglie la punteggiatura dei dialoghi); se isola invece di connettere, è un
trucco. Test: sai dire *perché* hai usato quella forma? Se no, probabilmente è un trucco. (Collega
`retorica-efficacia.md` → "Errore vs licenza"; `narrativa.md` §6, §12.)

---

## I. Tic della prosa saggistico-accademica AI

Tic specifici del sotto-genere in cui l'AI scrive di teoria, cita autori, costruisce
argomentazioni — un registro diverso dal copy o dal divulgativo, con tic propri che né il
vocabolario AI generico (§7) né l'antilingua scolastica (§44) catturano del tutto. Esempi
tratti da un audit reale su una tesi accademica italiana ~44.000 parole.

**58. Catene di transizione fra autori.** L'AI in saggistica enumera autori connessi da
formule prefabbricate che fanno da ponte ma non aggiungono argomento: ogni autore *arriva
in soccorso*, *porta lo stesso argomento*, *aggiunge la chiusura*, *conferma da
un'angolatura diversa*, *lavora nella stessa direzione con un altro lessico*. Pattern del
genere: *«X + verbo-ponte + da Y direzione/angolatura/piano»*. Verbi-ponte ricorrenti:
*arriva, porta, aggiunge, conferma, lavora, opera, si muove, riprende, prolunga*.

✗ *Merleau-Ponty arriva in soccorso da una direzione filologicamente diversa ma
argomentativamente identica.* ✓ *Merleau-Ponty parte da una filologia diversa e arriva alla
stessa conclusione.* Oppure: sopprimere del tutto la transizione, se il paragrafo nuovo
parla da sé. → **Differenziazione:** non è §35 (segnaletica al lettore, *«vediamo
insieme»*); non è §11 (variazione elegante, sinonimi per lo stesso oggetto): qui la
formula-tipo si ripete per *oggetti diversi*, gli autori.

**59. Glossa metalinguistica vuota (pseudo-precisione).** Mosse di precisazione che non
precisano. *«in questo senso preciso», «nel senso stretto/forte/debole del termine», «in
modo dichiarato», «in senso proprio», «in senso tecnico», «dichiaratamente»*. Sembrano
rigorose, ma il referente preciso che la glossa promette di specificare quasi sempre
manca.

✗ *Il fenotipo nuovo è, in questo senso preciso, un condividuo temporale.* ✓ *Il fenotipo
nuovo è un condividuo temporale.* — La glossa va tolta. Se la precisazione serve davvero,
sostituiscila con la specificazione concreta che la glossa promette ma non dà: *«in senso
tecnico»* → *«in senso biologico»* / *«secondo Lenski»*. → **Differenziazione:** non è §31
(hedging, *«si potrebbe forse argomentare che»*), che attenua: qui la mossa è
*finto-rafforzativa*. Non è §34 (*«la vera domanda è»*), che rivendica autorità sul
lettore: qui si rivendica precisione filologica.

**60. Termini metalinguistici-ombrello dell'accademica umanistica.** Famiglia di
nomi-ombrello per astrazioni di livello superiore: *posta concettuale, cifra retorica,
asse identitario, matrice argomentativa, articolazione, mossa, operazione, gesto, figura,
postura, taglio, registro*. Singolarmente sono parole legittime, e la saggistica naturale
le usa. Il tic AI è la **densità**: in una pagina compaiono cinque o sei di questi
nomi-ombrello, uno per concetto.

✗ *La mossa wildiana, la cifra del progetto, la posta concettuale del paragrafo, l'asse
identitario del posizionamento.* ✓ *La distinzione wildiana fra real world e world of art;
ciò che distingue The Blind Gardeners; il punto del paragrafo; come il progetto si
colloca.* — Nomina il referente concreto. **Spia di densità:** se in un capoverso di 200
parole ci sono 3+ nomi-ombrello di questa famiglia, sta lavorando il tic. →
**Differenziazione:** non è §16 (astratti generici amministrativi, *processo, dimensione,
prospettiva*); non è §39 (aziendalese, *criticità, attenzionare*): qui il registro è
*accademico-teorico*, non burocratico né corporate.

**61. Autoriferimento metatestuale formale.** *«il presente paragrafo, la presente
sezione, questo Liber, il paragrafo che segue, la sezione successiva»*. Calco di prosa
accademica tradizionale (latino *praesens*, *infra*, *supra*); in piccola dose è
legittimo, ma l'AI ne abusa.

✗ *Il Merleau-Ponty di* Il visibile e l'invisibile, *quello che il presente paragrafo
adotta, è già un altro autore.* ✓ *Il Merleau-Ponty di* Il visibile e l'invisibile, *che
adottiamo qui, è già un altro autore.* — Nella maggioranza dei casi si toglie senza
perdita. Quando l'autoriferimento è davvero strutturale (annuncio dell'organizzazione del
libro), riformula in voce attiva: *«nel paragrafo successivo articoliamo»*. →
**Differenziazione:** non è §35 (segnaletica al lettore, *«approfondiamo»*): qui il testo
parla *di sé* in terza persona formale.

**62. Meta-frasi che annunciano la sintesi prima di farla.** L'AI chiude paragrafi e
sezioni con frasi che annunciano la sintesi che immediatamente segue. *«Le N voci
convergono in un'unica conclusione: …»; «Il filo che le tiene è uno solo: …»; «In quattro
proposizioni il punto è: …»; «Tutto questo si riassume in: …»*. L'annuncio precede una
sintesi che il lettore vedrà comunque: ridondanza strutturale.

✗ *Le quattro voci convergono in un'unica conclusione, che il Liber pone alla porta della
propria sintesi: la non-condivisione di codice è la condizione operativa del dispositivo.*
✓ *La non-condivisione di codice è la condizione operativa del dispositivo.* — Togli
l'annuncio, lascia la sintesi sola. Se serve davvero un'apertura, un connettivo asciutto
(*«In sintesi:», «Insomma:», «Detto altrimenti:»*), non un auto-annuncio gonfiato. →
**Differenziazione:** non è §35 (segnaletica al lettore in imperativo, *«vediamo
insieme»*): qui è *constatativa-dichiarativa*, in terza persona. Non è §36 (header
frammentato, ridondanza fra titolo e prima frase): qui è interna al paragrafo.

**63. *«Resta vero che X»* come chiusura paragrafo.** Formula di chiusura che dà un'ultima
parola "che suona conclusiva senza esserlo". Varianti: *«Resta che X»*, *«Vale comunque
che X»*.

✗ *Resta vero, in tutti i piani, che la cecità non è il fallimento del dispositivo.* ✓ *In
tutti i piani, la cecità non è il fallimento del dispositivo.* — Togli la formula, lascia
l'asserzione. → **Differenziazione:** non è §32 (chiusure ottimistiche edificanti, *«il
futuro si prospetta brillante»*): qui la chiusura è *dichiarativo-assertoria*, non
positiva.

**64. Autovalutazioni di precisione.** L'AI dichiara la qualità della propria analogia o
distinzione invece di lasciar parlare l'analogia: *«L'implicazione è esatta; La somiglianza
è precisa; La conseguenza è duplice; La distinzione è netta; Il parallelo è puntuale»*.

✗ *La somiglianza con il dispositivo BG è precisa: entrambi mettono in scena
l'inaccessibilità del segno.* ✓ *Entrambi mettono in scena l'inaccessibilità del segno.* —
Se l'analogia è davvero precisa, parla da sé; se non lo è, dichiararlo non la rende tale.
→ **Differenziazione:** non è §7 (vocabolario AI generico, *cruciale, fondamentale*): qui
gli aggettivi sono in posizione *metalinguistica-autovalutativa*, non descrittiva.

**65. *«La pertinenza/rilevanza di X per Y è…»* come incipit applicativo.** Apertura di
paragrafo quando si "aggancia" una cornice teorica appena evocata al caso specifico.
Varianti: *«Per Y l'implicazione è…», «Per il nostro caso la conseguenza è…», «Applicato
a Y, il concetto rende…»*.

✗ *La pertinenza di queste figure per The Blind Gardeners è strutturale. La triade di
emergenza è simpoietica nel senso di Dempster e Haraway.* ✓ *La triade di emergenza di The
Blind Gardeners è simpoietica nel senso di Dempster e Haraway.* — Entra direttamente
nell'applicazione, salta l'annuncio. → **Differenziazione:** parente di §62 (meta-frase
che annuncia), ma qui l'annuncio non riguarda *la sintesi* del paragrafo che chiude, bensì
*l'aggancio* del paragrafo che si apre.

## Audit finale anti-AI (passaggio obbligato)

Dopo la riscrittura, domandati: **"Cosa rende questo testo evidentemente generato da AI?"**
Elenca i tell residui. Poi: **"Ora rendilo non evidentemente AI"** e rivedi. Verifica che:

- suoni naturale letto ad alta voce;
- vari la struttura dei periodi senza forzature;
- usi dettagli specifici al posto di affermazioni vaghe;
- usi *è/sono/ha* dove c'era perifrasi pretenziosa;
- non sostituisca la parola comune con quella "scelta" (antilingua: *fare* non *effettuare*,
  *casa* non *abitazione*) e usi il verbo pieno al posto di "verbo vuoto + astratto";
- non tenga un tono più alto del necessario (niente pathos, niente paroloni: un'ottava sotto);
- rispetti le convenzioni tipografiche (vedi `punteggiatura.md`);
- non abbia più di un avverbio in *-mente* né più di un gerundio in coda per paragrafo;
- non abbia periodi sopra 35-40 parole senza ragione.

**Checklist positiva (non basta togliere — controlla che ci sia):** almeno un **dato specifico**
e verificato; almeno una **voce reale** (esperienza, opinione dell'autore, citazione verificabile);
**variazione ritmica** (periodi brevi e lunghi alternati); il testo **regge la lettura ad alta
voce** senza inciampi né rime involontarie. Se nessuna di queste ha risposta affermativa, il testo
è "pulito ma morto" — l'altra faccia, ugualmente riconoscibile, dello slop. → Vedi "Dare voce".
