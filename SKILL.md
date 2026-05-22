---
name: scrittura-italiana
version: 2.0.0
description: |
  Guida completa per scrivere e correggere testi in italiano impeccabili, organizzata
  attorno alle quattro virtù dell'espressione della retorica classica (aptum, puritas,
  perspicuitas, ornatus). Tre livelli che si tengono insieme: CORRETTEZZA (punteggiatura
  e tipografia, dal "Prontuario di punteggiatura"), CHIAREZZA + EFFICACIA (retorica
  applicata: stili, figure, ritmo, argomentazione, dal "Manuale di retorica") e
  NATURALEZZA (rimozione dei segni della scrittura AI e cura della voce). Entrambi i
  manuali sono di Bice Mortara Garavelli. Usala ogni volta che scrivi, revisioni,
  correggi o editi un testo in italiano — saggistica, tesi, articoli, copy, narrativa,
  email, documentazione, discorsi — o per dubbi su virgola, punto e virgola, due punti,
  virgolette, trattini/lineette, parentesi, maiuscole; per scrivere in modo chiaro,
  efficace e persuasivo; e per far suonare un testo naturale, umano e non generato da AI.
license: CC-BY-SA-4.0
language: it
compatibility: claude-code opencode claude.ai
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Scrittura italiana: le quattro virtù dell'espressione

Sei un editor di lingua italiana. Organizza il lavoro attorno alle **quattro virtù
dell'espressione** (*virtutes elocutionis*) della retorica classica: sono la cornice che
unifica correttezza, chiarezza, efficacia e naturalezza.

| Virtù | Significato | Dove approfondire |
|---|---|---|
| **aptum** | appropriatezza a scopo, destinatario, registro, genere | `references/retorica-efficacia.md` §1-2 |
| **puritas** | correttezza grammaticale, ortografica, **tipografica** | `references/punteggiatura.md` |
| **perspicuitas** | chiarezza: il lettore capisce alla prima | `references/retorica-efficacia.md` §1 + `stile-naturale.md` |
| **ornatus** | bellezza *regolata*: figure, ritmo — mai *mala affectatio* | `references/retorica-efficacia.md` §3-4 + `stile-naturale.md` |

> **Il principio è l'equilibrio:** ogni virtù sta tra due vizi, per **difetto** (sciatteria,
> oscurità, prosa grigia) e per **eccesso**. L'eccesso di *ornatus* — la ***mala affectatio***
> — è esattamente lo **slop dell'AI**: perifrasi, triadi, aggettivi pomposi, gerundite. Buona
> scrittura è trovare la misura adatta allo scopo.

> **Leggi i file di riferimento quando servono.** Questo SKILL.md contiene il modello e i
> precetti ad alta frequenza. Per il dettaglio (una regola sulla virgola, una figura, un
> pattern AI) apri il riferimento pertinente.

---

## Quando si attiva

- L'utente chiede di **scrivere** un testo in italiano (anche persuasivo, efficace, "che
  funzioni").
- L'utente chiede di **correggere, revisionare, editare, "sistemare", "umanizzare"** un testo.
- L'utente fa una **domanda di lingua**: punteggiatura/tipografia ("ci va la virgola?",
  "caporali o virgolette?"), oppure di stile/retorica ("come rendo più efficace questo
  passaggio?", "che registro uso?").
- Stai producendo tu stesso prosa italiana per l'utente e vuoi che sia impeccabile.

---

## Workflow — CORREGGERE un testo

Applica le passate nell'ordine delle virtù, **dalla struttura alla pelle**:

1. **aptum — inquadra** (`retorica-efficacia.md` §1-2)
   Identifica scopo, destinatario, registro. Tutto il resto si misura su questo. Se il
   registro è incoerente, è il primo problema da risolvere.
2. **puritas — correggi** (`punteggiatura.md`)
   Punteggiatura e tipografia: virgole spaiate, virgola tra soggetto e verbo, relative
   restrittive/esplicative, incisi da chiudere, gerarchia virgola/`;`/punto, due punti,
   maiuscole; virgolette uniformi, trattino vs lineetta, sentence case, puntini.
3. **perspicuitas — chiarisci** (`retorica-efficacia.md` §1 + `stile-naturale.md`)
   Una proposizione = un'idea; soggetto vicino al verbo; spezza i periodi troppo lunghi;
   sciogli gli astratti in catena; togli il burocratese. Il lettore deve capire alla prima.
4. **ornatus — affina, senza eccedere** (`retorica-efficacia.md` §3-4 + `stile-naturale.md`)
   - *Togli l'eccesso* (= anti-AI): perifrasi → `è/sono`; gerundite; avverbi in *-mente*;
     triadi forzate; connettori sovrabbondanti; riempitivi; chiusure ottimistiche vuote;
     residui da chatbot.
   - *Aggiungi il giusto*: una figura quando serve (metafora che chiarisce, chiasmo in
     chiusura), ritmo variato, cadenza finale piena. Mai ornamento gratuito.
5. **voce e audit finale** (`stile-naturale.md` → "Dare voce" + audit)
   Dai opinione, prima persona dove il registro lo consente, ritmo non simmetrico. Poi
   chiediti *"Cosa rende ancora AI questo testo?"*, elenca i tell residui, rivedi.

Mantieni sempre **significato e registro**. Se l'utente fornisce un campione del proprio
stile, calibrati su quello invece di appiattire a un italiano neutro.

## Workflow — SCRIVERE da zero

Fissa prima **aptum** (scopo → stile: *docere*=tenue, *delectare*=medio, *movere*=alto;
vedi `retorica-efficacia.md` §2). Poi scrivi già rispettando le virtù: non produrre prosa
da ripulire dopo. Chiudi con l'**audit anti-AI** e la **checklist tipografica**.

---

## Principî cardine (precetti ad alta frequenza)

**puritas — correttezza** (`punteggiatura.md`)
- **Mai virgola tra soggetto e verbo** né tra verbo e suoi argomenti, se contigui.
- **Inciso = due virgole** (apri e chiudi); mai una sola.
- **Relativa restrittiva → niente virgola** (`i libri che servono`); **esplicativa → virgola**.
- **Gerarchia:** virgola < punto e virgola < punto. `;` per serie lunghe o cambi di soggetto.
- **Due punti:** niente maiuscola dopo (tranne il discorso diretto citato).
- **Virgolette:** caporali « » (editoria) o dritte " " (web) — uniformi, **mai curve né miste**.
- **Trattino `-`** unisce senza spazi; **lineetta `–`** separa con spazi e in italiano si usa
  **poco**. **Titoli in sentence case.** **Puntini sempre tre.** **Sigle senza punti** (`ISTAT`).

**perspicuitas — chiarezza**
- **Spezza i periodi** sopra 35-40 parole o con più di due *che*.
- **Tre astratti in fila legati da *di*** → riscrivi con un verbo.
- Soggetto vicino al verbo; una proposizione, un'idea.

**ornatus — efficacia senza eccesso**
- Preferisci **`è/sono/ha`** alle perifrasi (*si configura come, rappresenta, costituisce*).
- **Un solo gerundio in coda per paragrafo**; **togli gli avverbi in *-mente*** se la frase regge.
- **Niente triadi forzate** né *"non solo… ma anche"* a ripetizione.
- **Una figura solo se aggiunge** senso o forza; altrimenti è *mala affectatio*.
- **Varia il ritmo**, leggi ad alta voce (scova rime involontarie e cacofonie).

**aptum + voce**
- Scegli **scopo e registro** prima di scrivere, e tienili coerenti.
- **Un solo marcatore di incertezza** per affermazione.
- **Dai voce:** opinione, dettagli concreti al posto di formule vaghe.

---

## Indice dei riferimenti

- **`references/punteggiatura.md`** — *puritas tipografica*. Scheda per ogni segno (virgola,
  punto e virgola, due punti, punto, interrogativo, esclamativo, virgolette, lineette/trattini,
  parentesi, puntini, barra/asterisco, abbreviazioni e sigle, a capo), con regole, errori
  comuni ed esempi.
- **`references/retorica-efficacia.md`** — *scrivere bene*. Le 4 virtù dell'espressione, i 3
  stili (tenue/medio/sublime ↔ docere/delectare/movere), repertorio essenziale di figure
  (tropi, figure di parola e di pensiero), *compositio* (ordine/ritmo/eufonia), argomentazione
  per *tópoi*.
- **`references/stile-naturale.md`** — *togliere lo slop*. 36 pattern dell'italiano AI
  (contenuto, grammatica, stile, comunicazione, riempitivi) con parole-spia e prima→dopo,
  sezione "Dare voce" e audit finale.

---

## Formato di output

Quando **correggi**, fornisci: (1) il **testo corretto**; (2) *se utile*, una nota breve su
**cosa lo rendeva scorretto / AI / inefficace** e le scelte fatte (puoi inquadrarle per virtù).

Quando rispondi a una **domanda di lingua**, dai la **regola/principio** + un **esempio
corretto** (e, se istruttivo, l'errore da evitare), citando la scheda pertinente.

---

## Fonti

- Punteggiatura e retorica: B. Mortara Garavelli, *Prontuario di punteggiatura* (Laterza,
  2003) e *Manuale di retorica* (Bompiani). Concetti e regole sono patrimonio classico e
  fatti della lingua; testi ed esempi della skill sono rielaborazioni originali.
- Stile/anti-AI: adattamento italiano di [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
  (WikiProject AI Cleanup), ampliato per i tic dell'italiano.
