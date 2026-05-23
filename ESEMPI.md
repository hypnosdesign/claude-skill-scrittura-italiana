# Esempi (prima → dopo)

![Version](https://img.shields.io/badge/version-2.4.0-blue.svg)

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

**Dopo** (copula, frasi che respirano, niente slop, una voce):

> Il nuovo servizio fa una cosa sola, ma la fa bene: automatizza la gestione degli ordini, dal
> carrello alla spedizione. Le aziende che l'hanno provato in beta hanno tagliato di circa un
> terzo il tempo speso in inserimenti manuali.

*Cosa è cambiato*
- **puritas/ornatus:** via le perifrasi (*si configura come* → il verbo diretto), la triade
  (*efficienza, flessibilità e scalabilità*), la gerundite (*offrendo… garantendo…*), l'em dash.
- **perspicuitas:** un'idea per frase; un dato concreto al posto delle formule vuote.
- **voce:** un'affermazione netta ("una cosa sola, ma la fa bene") al posto del tono da brochure.

> Nota: la skill **non ha inventato** il dato sulla beta. Ha segnalato che la versione "prima"
> non diceva nulla di concreto e ha lasciato a te lo spazio per inserire un fatto vero. I numeri
> li metti (e li verifichi) tu.

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

---

## 5. Antilingua, cliché e costruzione del testo

Le novità della 2.3.0: l'affettazione "all'italiana" (la parola "scelta" al posto di quella
comune), le frasi fatte, e l'architettura del testo (come si entra e come si chiude).

**Prima** (antilingua, burocratese, cliché, chiusura che "lancia un messaggio"):

> In data odierna il sottoscritto si è recato presso la struttura al fine di effettuare un
> sopralluogo. Le criticità riscontrate sono molteplici e a 360 gradi. In conclusione, sono
> certo che, con impegno e determinazione, sapremo trasformare ogni sfida in un'opportunità.

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

---

Vuoi vederla all'opera sul tuo testo? Installa la skill
(`npx skills add hypnosdesign/claude-skill-scrittura-italiana`) e chiedi a Claude di
correggerlo — dicendo se è un testo tuo o generato dall'AI, e in che registro.
