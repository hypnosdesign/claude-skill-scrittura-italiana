# Spiegare con chiarezza — dal concetto astratto al lettore

Riferimento per chi scrive, corregge o genera **testi esplicativi**: documentazione tecnica,
articoli divulgativi, schede didattiche, tutorial, testi scientifici per non specialisti.
Complementa `retorica-efficacia.md` (perspicuitas) e `stile-naturale.md` (anti-slop): qui il
fuoco è *spiegare bene una cosa difficile*. Distillato da D. Gouthier, *Scrivere di scienza*
(Codice, 2019); esempi originali.

> «Se non si è chiari non c'è messaggio affatto. Chiarezza non è sinonimo di semplicità: è
> rendere palese la complessità.» — Primo Levi

---

## 1. Chiarezza ≠ semplificazione

**Chiarezza** = rendere palese la complessità, comprese le qualifiche e i limiti.
**Semplificazione** = ridurre, livellare, togliere le sfumature. L'AI le confonde di continuo,
e nel "levigare" un testo per renderlo scorrevole spesso elimina proprio ciò che lo rende vero.

✗ semplificazione → *I vaccini sono sicuri e proteggono tutti.*
✓ chiarezza → *I vaccini proteggono la grande maggioranza di chi li riceve; in una piccola
percentuale danno effetti lievi, rarissimamente gravi. Il bilancio rischio/beneficio è
nettamente favorevole.*

La prima frase è più semplice; la seconda è più chiara. La prima convince i già convinti, la
seconda dà strumenti a chi ha dubbi.

> **Segnale d'allarme:** se "rendere fluido" un testo ha tolto le condizioni, le eccezioni e i
> margini, non l'hai reso chiaro — l'hai reso impreciso.

---

## 2. Rigore ed efficacia sono in tensione

Chi spiega a un pubblico non esperto affronta un compromesso strutturale: **più rigore =
meno efficacia, e viceversa**. Non si possono avere entrambi al massimo.
- **Più rigore** (tutte le qualifiche, tutti i margini) → inattaccabile ma pesante.
- **Più efficacia** (esempi, immagini, ritmo) → coinvolgente ma parziale.

> **Regola.** Scegli *consapevolmente* dove stare, in base a destinatario e scopo: verso
> l'efficacia per il grande pubblico, verso il rigore per i decisori tecnici. **Dichiarare** le
> semplificazioni («per semplicità qui ignoriamo X») è più onesto che finto rigore.

⚠ Il testo AI tende a *sembrare* rigoroso (hedging e avverbi di incertezza a raffica) senza
esserlo, e a non essere efficace: il peggio dei due estremi (vedi `stile-naturale.md` §31).

---

## 3. Astratto → concreto: la catena dell'esempio

L'astrazione senza esempi dà al lettore l'**illusione** di aver capito: ha capito le parole,
non la cosa. Tre strumenti, dal più puntuale al più narrativo:
- **Esempio:** il caso singolo che mostra il concetto in azione. Va *guidato*, non lasciato da
  interpretare.
- **Caso di studio:** un caso emblematico che non perde di generalità — il rappresentante del
  fenomeno.
- **Aneddoto:** il ponte narrativo tra ciò che il lettore sa e ciò che deve capire. Non è
  "fuffa": spesso è la via più breve.

✗ *La teoria dei gruppi descrive strutture algebriche con un'operazione associativa, un elemento
neutro e gli inversi.*
✓ *Pensa ai modi di girare un triangolo equilatero senza cambiarne l'aspetto: tre rotazioni e
tre ribaltamenti. Combinandone due ne ottieni sempre una delle sei, e ogni mossa si può disfare.
Quelle sei mosse formano un "gruppo" — la stessa struttura che descrive la simmetria delle
molecole e regge la crittografia.*

> **Regola.** Formula almeno un esempio per ogni concetto astratto. Non è obbligatorio metterlo
> nel testo finale, ma deve esistere nel tuo materiale di lavoro: se non sai farlo, non hai
> ancora capito abbastanza per spiegarlo.

---

## 4. I numeri: confronta, scala, converti

Un dato senza contesto non informa: intimorisce o viene ignorato. Tre tecniche:
1. **Confronta** con un numero della stessa natura, noto al lettore. *384.000 km Terra-Luna →
   circa dieci volte il giro del mondo.*
2. **Dai l'ordine di grandezza** prima del dettaglio: decine, migliaia, milioni. Un'analisi con
   sette cifre decimali non è precisione, è rumore.
3. **Converti in concreto:** *un milione di euro* → quante ore di lezione? quanti km di strada?

⚠ **Falsa precisione:** non riportare più cifre significative di quante ne abbia la misura.
Sette decimali su un sondaggio sono finta autorevolezza.

✗ *L'acceleratore raggiunge 13 TeV con luminosità di 10³⁴ cm⁻² s⁻¹.*
✓ *L'acceleratore spinge i protoni a energie diecimila volte la loro massa a riposo — per ogni
particella, quanto un moscerino in volo; solo che ne fa scontrare miliardi al secondo.*

---

## 5. Il termine tecnico: barriera o risonanza?

Un termine specialistico non è sempre un ostacolo: dipende da come lo gestisci.

| Postura | Quando | Come |
|---|---|---|
| **Definire subito** | il termine serve al discorso che segue | «il bosone di Higgs — la particella legata al campo che dà massa —» |
| **Evitare** | il termine non aggiunge comprensione | parafrasi con linguaggio naturale |
| **Lasciare con risonanza** | vuoi evocare il senso, non spiegarlo nel dettaglio | usalo nel contesto giusto, senza fermarti a definirlo |

> **Chi comanda.** È chi scrive a rispondere al *lettore*, non alla fonte. Se il ricercatore
> dice *luminosità integrata*, non è detto che il lettore debba leggerlo. Scegli il termine che
> serve al lettore, non quello che impressiona l'esperto.

⚠ Attento alla falsa chiarezza per sostituzione: rimpiazzare ogni termine con una perifrasi
vaga non spiega, banalizza. *La particella della massa* è peggio di *bosone di Higgs* con una
breve apposizione.

---

## 6. La metafora esplicativa — potente e infida

Una buona metafora porta il lettore da A a B; una metafora non governata lo porta da A a C
senza che né lui né tu ve ne accorgiate. (Diversa dalla metafora *morta*, che non fa danni
perché nessuno la visualizza più: vedi `cliche-e-parole-alla-moda.md` §5.)

> **Regola.** Dopo un'analogia esplicativa, **chiudi lo scarto**: mostra dove la somiglianza si
> ferma.

✗ *L'atomo è come un sistema solare in miniatura.* (il lettore si porta a casa orbite precise,
comete, traiettorie: un modello sbagliato che dura decenni)
✓ *L'atomo è stato paragonato a un sistema solare: un nucleo al centro, gli elettroni intorno.
L'immagine aiuta, ma fermati qui — gli elettroni non percorrono orbite come i pianeti: la loro
posizione è una nuvola di probabilità.*

**Come scegliere il termine di paragone:** dev'essere vicino all'esperienza del *lettore*, non
a quella dell'autore. La metafora giusta non è la prima che ti viene in mente.

---

## 7. Essenzialità e ridondanza utile

- **Essenzialità.** Ogni concetto che il lettore deve reggere occupa spazio mentale:
  sovraccaricare lo fa scappare. *Serve* davvero quella citazione, quel concetto, quella
  digressione? Un testo asciutto nella sostanza arriva più di uno che esibisce tutta la
  competenza dell'autore. (Esercizio: prendi 20 righe, riducile a 10 **tagliando**, non
  riassumendo; ciò che resta è il nucleo.)
- **Ridondanza utile.** Nel testo esplicativo una certa ridondanza è *funzionale*: spiegare lo
  stesso punto con parole diverse, poi con un esempio, poi con un'immagine — ogni passaggio
  recupera chi non aveva capito il precedente. Diversa dalla ridondanza burocratica (tre
  sinonimi al posto di uno: vedi `stile-naturale.md` §10–11), che ripete senza aggiungere.

---

## 8. Anti-hype — la scienza non è «meravigliosa»

L'enfasi della scoperta è slop specifico del comunicato stampa e della divulgazione gonfia:
non avvicina la scienza, la allontana, perché crea aspettative che vengono deluse.

**Parole-spia:** *rivoluzionario, epocale, senza precedenti, cambierà tutto, svolta storica,
cura definitiva, potrebbe un giorno risolvere/eliminare, gli scienziati hanno finalmente
dimostrato.*

> **Regola.** Descrivi cosa è stato fatto — concretamente, da chi, con quale metodo e con quale
> margine d'incertezza. Se la cosa è importante, i fatti lo diranno. Un «Wow!» può essere un
> gancio, non il punto d'arrivo.

✗ *I ricercatori hanno fatto una scoperta rivoluzionaria che potrebbe cambiare per sempre la
cura del cancro.*
✓ *Un gruppo dell'Università di X ha individuato una proteina che nei topi riduce di un terzo la
crescita di alcuni tumori. I test sull'uomo, se arriveranno, sono lontani anni.*

(Vedi anche `cliche-e-parole-alla-moda.md` → cliché del discorso scientifico.)

---

## 9. Le mosse del divulgatore: glossa, domanda, segnavia

Tre riflessi ricorrono in chi spiega bene a un pubblico non specialista — convergono anche
su materie lontane (botanica, neuroscienze, filosofia: M. Ferrari, G. Vallortigara, L.
Floridi). Non sono ornamenti: sono il modo in cui l'astratto resta camminabile.

- **Glossa lampo del termine.** Il termine tecnico, appena introdotto, è sciolto *subito* in
  parole comuni — con *cioè / ovvero / ossia*, nella stessa frase, non in nota e non più
  tardi. *«autotrofi, cioè che si nutrono da sé»*; *«cianobatteri, ovvero batteri azzurri»*.
  È la versione riflessa del §5 «definire subito»: nel divulgativo non è una scelta caso per
  caso, è un automatismo (nei testi citati, in media una glossa ogni ~700 parole).

- **La domanda come motore.** La *vera* domanda che apre il passo successivo e mette il
  lettore nella condizione di porsela con te: *«È possibile che tutto ciò sia inevitabile? Che
  non se ne potesse fare a meno?»*. Struttura il ragionamento per problemi, non per
  affermazioni: usala per **aprire**, poi rispondi. ⚠ Da non confondere con la domanda
  retorica-amo pubblicitaria (*«Stanchi di…?»*), che è un tic: vedi `stile-naturale.md`,
  pattern 46. La differenza: la domanda-motore *fa avanzare il contenuto*, l'amo no.

- **I segnavia.** Brevi segnali di percorso che dicono al lettore dove si trova e dove si va:
  *«Fine della parentesi»*, *«Siamo arrivati a un punto importante»*, *«guardiamo il tutto con
  la nostra prospettiva di mammiferi»*. Orientano senza appesantire — asciutti, spesso
  ironici. L'opposto del metadiscorso burocratico (*«come si evincerà dal paragrafo che
  segue…»*).

> **Tono.** Nei tre autori, **quasi zero punti esclamativi**: l'enfasi viene dal ritmo
> (un periodo breve e secco dopo uno lungo) e dall'understatement, non dal `!`. La meraviglia
> si mostra, non si dichiara (→ §8 anti-hype). Per la *voce* — opinione, prima persona,
> ironia — vedi `stile-naturale.md` → «Dare voce».

---

## In sintesi

Spiegare bene = **saperne più di quanto scrivi** → **astratto → concreto** (esempi, casi,
aneddoti) → **numeri contestualizzati** (confronto, scala, conversione) → **termini tecnici
governati** (quelli del lettore, non della fonte, *glossati* al volo) → **metafore chiuse**
(mostra dove si rompono) → **essenzialità** (taglia il non necessario, tieni la ridondanza
utile) → **chiarezza, non semplificazione** → **zero hype** → **mosse del divulgatore**
(glossa lampo, domanda-motore, segnavia; enfasi dal ritmo, non dal `!`).
