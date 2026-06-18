# Changelog

Tutte le modifiche rilevanti a *scrittura-italiana* sono documentate qui.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto adotta
il [Versionamento Semantico](https://semver.org/lang/it/).

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
