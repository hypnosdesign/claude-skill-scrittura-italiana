# Esempi (prima → dopo)

![Version](https://img.shields.io/badge/version-2.12.2-blue.svg)

Cosa fa la skill, su testi reali. Il caso d'uso principale è **umanizzare** un testo che "sa
di AI" (§1); ma è un humanizer con i superpoteri, perciò sa anche correggere, chiarire e dare
voce. Tre cose da tenere a mente:

- **Funziona sia su testi AI sia su testi umani.** Su quelli AI rende di più (vedi §1); su
  quelli umani fa da revisore che *spiega* la regola (§2).
- **Non impone uno stile.** Toglie errori e tic, e può seguire la tua voce se le dai un
  campione. Non riscrive di testa sua: la indirizzi tu.
- **Rispetta il registro.** Su un testo informale (chat, social) *non* applica la tipografia
  editoriale: le convenzioni da tastiera non sono errori (§3).

Tutti gli esempi sono originali e illustrativi.

---

## 1. Testo generato dall'AI — il caso d'uso principale

Scenario tipico: parti da appunti o da un brainstorming, li fai stendere a un modello, e
l'output "sa di AI".

**Prima** (perifrasi, gerundite, triadi, avverbi in *-mente*, em dash all'inglese):

> Il nostro nuovo servizio si configura come una soluzione innovativa che rivoluziona il modo
> di lavorare, offrendo efficienza, flessibilità e scalabilità — garantendo al contempo
> un'esperienza utente fluida e intuitiva. In un panorama in continua evoluzione, rappresenta
> un punto di svolta fondamentale per le aziende che vogliono restare competitive.

**Informazioni fornite dall'autore:** il servizio automatizza gli ordini dal carrello alla
spedizione; è stato provato in beta; nel campione osservato ha ridotto di circa un terzo il tempo
dedicato agli inserimenti manuali.

**Dopo** (verbo diretto, frasi che respirano, niente slop):

> Il nuovo servizio automatizza la gestione degli ordini, dal carrello alla spedizione. Nel
> test beta, il tempo dedicato agli inserimenti manuali è sceso di circa un terzo.

*Cosa è cambiato*
- **puritas/ornatus:** via le perifrasi (*si configura come* → il verbo diretto), la triade
  (*efficienza, flessibilità e scalabilità*), la gerundite (*offrendo… garantendo…*), l'em dash.
- **perspicuitas:** un'idea per frase; un dato concreto al posto delle formule vuote.
- **tono:** un'affermazione verificabile al posto dell'enfasi da brochure.

> Nota: il "dopo" usa soltanto le informazioni del blocco precedente. Se l'autore non le avesse
> fornite, la skill dovrebbe segnalare il vuoto o lasciare un segnaposto, non inventare una beta o
> una percentuale plausibile.

---

## 2. Testo scritto da un essere umano — revisione che spiega

Qui la skill fa da correttore, ma a ogni intervento dice *perché*. Si impara usandola: è più
un tutor che una stampella.

**Prima:**

> Non so qual'è il problema, ma il rapporto che ti ho mandato, non è ancora stato letto da
> nessuno e francamente mi sembra strano perchè era urgente.

**Dopo:**

> Non so qual è il problema, ma il rapporto che ti ho mandato non è ancora stato letto da
> nessuno e, francamente, mi sembra strano: era urgente.

*Cosa è cambiato (con la regola)*
- `qual'è` → **qual è**: *qual* è un troncamento, non un'elisione → niente apostrofo.
- `il rapporto…, non è` → tolta la **virgola tra soggetto e verbo** (non si separano se contigui).
- `francamente` tra **due virgole**: è un inciso, va aperto e chiuso.
- `perché` con l'**accento acuto** (e qui un **due punti** rende meglio il nesso causale).

---

## 3. Registro: quando la skill *non* corregge

La stessa frase cambia norme a seconda del contesto. La skill riconosce il **livello di
controllo** del testo e non "ipercorregge" l'informale.

**Testo non controllato** (commento, chat) — lasciato com'è:

> boh non so perche ma "qual è" me lo sbaglio sempre, comunque figo sto tool lo provo

→ Nessuna correzione di tipografia: virgolette dritte, `perche` da tastiera, niente caporali.
In questo registro **sono scelte legittime, non errori**.

**Testo controllato** (lo stesso contenuto, ma per un articolo) — normalizzato:

> Non so perché, ma «qual è» lo sbaglio sempre. Comunque questo strumento mi convince: lo provo.

→ Qui sì: accenti corretti, caporali, punteggiatura piena.

---

## 4. Micro-dubbi (risposte lampo)

| ✗ | ✓ | Regola |
|---|---|---|
| un pò | un po' | troncamento di *poco*: apostrofo, mai accento |
| qual'è | qual è | troncamento: niente apostrofo |
| Maria, corre | Maria corre | niente virgola tra soggetto e verbo |
| se stesso *(o)* sé stesso | sé stesso | acuto consigliato per uniformità |
| da/dà confusi | da (prep.) / dà (verbo) | accento solo sul verbo |
| i programmi, che non guardo | i programmi che non guardo | relativa restrittiva: niente virgola |
| ti ho confuso per tuo fratello | ti ho confuso con tuo fratello | si confonde *con*, non *per* |
| effettuare un controllo | controllare | verbo pieno, non «verbo vuoto + astratto» |
| pensavo che ha ragione | pensavo che avesse ragione | *consecutio*: il passato regge il congiuntivo imperfetto |
| se avrei tempo, verrei | se avessi tempo, verrei | mai il condizionale nella protasi del periodo ipotetico |
| ci siamo visti virtualmente | ci siamo visti online | *virtualmente* = «di fatto», non «a distanza» |

⚠ **Preferenza, non errore:** nel registro sorvegliato si preferiscono *e io, a ogni costo*;
*ed io, ad ogni costo* restano varianti tradizionali e non vanno marcate con ✗. La *d* eufonica
è raccomandata soprattutto davanti alla stessa vocale e in locuzioni cristallizzate come
*ad esempio* e *ad eccezione*.

---

## 5. Antilingua, cliché e costruzione del testo

Le novità della 2.3.0: l'affettazione "all'italiana" (la parola "scelta" al posto di quella
comune), le frasi fatte, e l'architettura del testo (come si entra e come si chiude).

**Prima** (antilingua, burocratese, cliché, chiusura che "lancia un messaggio"):

> In data odierna il sottoscritto si è recato presso la struttura al fine di effettuare un
> sopralluogo. Le criticità riscontrate sono molteplici e a 360 gradi. In conclusione, sono
> certo che, con impegno e determinazione, sapremo trasformare ogni sfida in un'opportunità.

**Problemi indicati dall'autore:** impianto elettrico fuori norma; tetto che perde; due uscite di
sicurezza bloccate; interventi necessari prima della riapertura.

**Dopo** (parole comuni, verbo pieno, niente frasi fatte, chiusura asciutta):

> Oggi sono andato a vedere la struttura. I problemi sono parecchi: l'impianto elettrico è
> fuori norma, il tetto perde, due uscite di sicurezza sono bloccate. Vanno sistemati prima
> della riapertura.

*Cosa è cambiato*
- **antilingua:** *recarsi presso → andare a*, *effettuare un sopralluogo → vedere*, *criticità
  → problemi*, *in data odierna → oggi* (parola comune e verbo pieno).
- **cliché:** via *a 360 gradi* e la chiusura *"trasformare ogni sfida in un'opportunità"*.
- **dispositio + individuazione:** la conclusione che "lancia un messaggio" edificante diventa
  un fatto concreto (cosa sistemare, entro quando); il generico *molteplici* lascia il posto
  all'elenco dei problemi reali.

> **Nota:** il "dopo" esplicita i problemi del blocco fornito dall'autore. La skill non li
> *indovina*: se l'input non li dice, chiede o lascia un segnaposto (vedi `stile-naturale.md`
> §70, §75).

---

## 6. Coesione: ricucire un testo «a mosaico»

Un tell tipico dell'AI: frasi tutte vere, tutte corrette, ma scollegate — le potresti riordinare
senza che il senso cambi. Non argomenta: cataloga. Qui la skill rimette il **filo**.

**Prima** (giustapposizione: nessun nesso di causa, conseguenza o scopo):

> Il borgo conta meno di mille abitanti. La scuola ha chiuso nel 2009. Molti giovani si sono
> trasferiti in città. Il comune ha avviato un piano di ripopolamento. Le case costano poco.

**Relazioni confermate dall'autore:** gli abitanti diminuiscono ogni anno; la chiusura della
scuola e il trasferimento dei giovani contribuiscono al calo; il piano mira a invertire la
tendenza e considera il basso costo delle case una leva per il ripopolamento.

**Dopo** (tema/rema e connettivi giusti: il testo ha una direzione):

> Il borgo conta meno di mille abitanti, e ogni anno sono di meno: la scuola ha chiuso nel 2009 e
> i giovani si sono trasferiti in città. Per invertire la rotta il comune ha avviato un piano di
> ripopolamento — e una leva ce l'ha già: qui le case costano poco.

*Cosa è cambiato*
- **coesione:** ogni frase si aggancia alla precedente (la fine di una diventa l'inizio della
  successiva); il *test del mosaico* non passa più, l'ordine ora conta.
- **connettivi giusti:** la causa (i due punti = *perché*) e lo scopo (*per invertire la rotta*)
  rendono esplicite le relazioni confermate dall'autore, al posto della fila di punti fermi.
- **nessun nesso inventato:** fatti e relazioni vengono dai due blocchi precedenti. Se l'autore
  non conferma causa e scopo, il revisore può migliorare i richiami lessicali, ma non deve
  fabbricare un ragionamento. (Vedi `coesione-e-connettivi.md` e `stile-naturale.md` §50, §75.)

---

## 7. Divulgazione: spiegare con chiarezza (non semplificare)

Quando si spiega qualcosa di tecnico, l'AI tende a *semplificare* (togliere le sfumature) e a
sparare numeri-totem senza contesto. La skill fa il contrario: contestualizza e qualifica.

**Prima** (hype + numero senza scala + chiusura vuota):

> Il nuovo chip esegue 200.000 miliardi di operazioni al secondo: una potenza di calcolo
> straordinaria che rivoluziona il settore.

**Dati di confronto forniti e verificati dall'autore:** le 200.000 miliardi di operazioni
equivalgono, per il carico descritto, a circa una giornata di un computer da ufficio di dieci
anni fa preso come riferimento; il chip dichiara prestazioni teoriche dieci volte superiori al
modello precedente; il beneficio effettivo dipende dai programmi che sfruttano il chip.

**Dopo** (numero contestualizzato + chiarezza al posto di semplificazione):

> Il nuovo chip esegue circa 200.000 miliardi di operazioni al secondo — in un secondo fa quello
> che un computer da ufficio di dieci anni fa avrebbe fatto in una giornata. Sulla carta è dieci
> volte il modello precedente; quanto serva davvero dipende dai programmi che lo sfrutteranno.

*Cosa è cambiato*
- **numero preservato e contestualizzato:** la cifra resta invariata; il **confronto** tangibile e
  l'ordine di grandezza (×10 sul modello precedente) provengono dai dati forniti.
- **chiarezza ≠ semplificazione:** *rivoluziona il settore* (slogan vuoto) → cosa cambia davvero,
  **con il suo limite** («dipende dai programmi»). Una qualifica in più, non in meno.
- **anti-hype:** via *straordinaria* e *rivoluziona* (`stile-naturale.md` §1; `spiegare-con-chiarezza.md`).

> **Nota — il confine da non superare:** il confronto e il ×10 provengono dal blocco precedente.
> Se non hai un termine di paragone reale, rendi leggibile la cifra e fermati lì: non fabbricare
> un benchmark verosimile (`stile-naturale.md` §73, §75).

> **Nota linguistica separata:** l'inglese *trillion* vale 10¹², mentre l'italiano *trilione*
> indica 10¹⁸. Se la fonte originale dice *200 trillion operations*, prima di rendere il numero
> verifica la scala; in italiano *200.000 miliardi* evita il falso amico. Questa conversione è
> lecita solo quando la fonte inglese e il valore sono noti, non come congettura editoriale
> ([Treccani](https://www.treccani.it/enciclopedia/trilione_%28Enciclopedia-della-Matematica%29/)).

---

## 8. Sintassi del verbo: congiuntivo, *consecutio*, periodo ipotetico

Errori frequenti anche in chi scrive bene — e che l'AI a volte replica. La skill li corregge
**spiegando la regola**.

**Prima:**

> Pensavo che era una buona idea, ma se l'avrei saputo che costava così tanto non l'avrei
> comprato. Speravo che me lo dicevi prima.

**Dopo:**

> Pensavo che fosse una buona idea; ma se l'avessi saputo che costava così tanto, non l'avrei
> comprato. Speravo che me lo dicessi prima.

*Cosa è cambiato (con la regola)*
- `pensavo che era` → **fosse**: *consecutio temporum*, il passato regge il congiuntivo imperfetto.
- `se l'avrei saputo` → **se l'avessi saputo**: nel periodo ipotetico **mai il condizionale nella
  protasi** (irrealtà = congiuntivo trapassato + condizionale passato).
- `speravo che me lo dicevi` → **dicessi**: dopo un verbo di speranza al passato, congiuntivo
  imperfetto. (Vedi `dubbi-e-errori.md` §11-12.)

---

## 9. Revisione: trovare la parola giusta

Non basta togliere lo slop: a volte serve *aggiungere precisione*. Qui la skill smonta gli
intensificatori che indeboliscono e collauda le metafore.

**Prima** (intensificatori, metafora-cliché, antilingua):

> Un libro estremamente avvincente, dallo stile graffiante, che affronta tematiche di assoluta
> attualità.

**Dopo** (l'aggettivo nudo o un'immagine precisa, parola comune):

> Un libro che non si molla, scritto con nervo, sui temi di oggi.

*Cosa è cambiato*
- **intensificatori:** *estremamente avvincente*, *assoluta attualità* → l'avverbio che potenzia in
  realtà sottrae; meglio l'immagine precisa («non si molla») o l'aggettivo nudo.
- **collaudo letterale:** *stile graffiante* è un cliché che alla lettera non regge (`revisione-e-proprieta.md` §4) → *scritto con nervo*.
- **antilingua:** *tematiche di attualità* → *i temi di oggi* (la parola comune batte quella "scelta").

---

Vuoi vederla all'opera sul tuo testo? Installa la skill
(`npx skills add hypnosdesign/claude-skill-scrittura-italiana`) e chiedi a Claude di
correggerlo — dicendo se è un testo tuo o generato dall'AI, e in che registro.
