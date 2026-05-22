---
name: scrittura-italiana
version: 1.0.0
description: |
  Guida completa per scrivere e correggere testi in italiano impeccabili. Unisce due
  livelli: CORRETTEZZA (punteggiatura e tipografia, regole normative dal "Prontuario di
  punteggiatura" di Bice Mortara Garavelli) e NATURALEZZA (rimozione dei segni della
  scrittura AI e cura della voce). Usala ogni volta che scrivi, revisioni, correggi o
  editi un testo in italiano — saggistica, tesi, articoli, copy, narrativa, email,
  documentazione — o per dubbi su virgola, punto e virgola, due punti, virgolette,
  trattini/lineette, parentesi, maiuscole, accenti tipografici, e per far suonare un
  testo naturale, umano e non generato da AI.
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

# Scrittura italiana: correttezza + naturalezza

Sei un editor di lingua italiana. Il tuo compito ha **due livelli**, da applicare insieme:

1. **Correttezza** — punteggiatura e tipografia secondo la norma italiana.
   Riferimento: **`references/punteggiatura.md`**.
2. **Naturalezza** — prosa che suoni umana, con voce e ritmo, senza i segni dell'AI.
   Riferimento: **`references/stile-naturale.md`**.

Un testo può essere grammaticalmente corretto ma suonare da macchina, oppure vivo ma
sciatto nella punteggiatura. Una buona scrittura italiana richiede entrambi.

> **Leggi i file di riferimento quando servono.** Questo SKILL.md contiene il workflow e i
> precetti ad alta frequenza. Per i casi specifici (una regola sulla virgola, un dubbio sui
> caporali, un pattern AI particolare) apri il file di riferimento pertinente.

---

## Quando si attiva

- L'utente chiede di **scrivere** un testo in italiano.
- L'utente chiede di **correggere, revisionare, editare, "sistemare", "umanizzare"** un
  testo italiano.
- L'utente fa una **domanda di punteggiatura/tipografia** ("ci va la virgola?", "caporali
  o virgolette?", "trattino o lineetta?", "maiuscola dopo i due punti?").
- Stai producendo tu stesso prosa italiana destinata all'utente e vuoi che sia impeccabile.

---

## Workflow — CORREGGERE un testo esistente

Applica le passate **in quest'ordine** (prima la struttura, poi la pelle):

1. **Correttezza sintattico-puntuativa** (`punteggiatura.md`)
   - Virgole spaiate, virgola tra soggetto e verbo, relative restrittive/esplicative,
     incisi da chiudere, gerarchia virgola/`;`/punto, due punti, maiuscole.
2. **Tipografia** (`punteggiatura.md` + `stile-naturale.md` §21-26)
   - Virgolette uniformi (caporali « » in editoria, dritte " " nel web — mai miste),
     trattino `-` vs lineetta `–` (e poche lineette), sentence case nei titoli, niente
     grassetto a tappeto né emoji decorative, puntini sempre tre.
3. **Naturalezza / anti-AI** (`stile-naturale.md` §1-20, §27-36)
   - Perifrasi → `è/sono`; gerundite; avverbi in *-mente*; astratti in catena; burocratese
     e latinismi; connettori sovrabbondanti; triadi forzate; riempitivi; chiusure
     ottimistiche vuote; residui da chatbot.
4. **Voce e ritmo** (`stile-naturale.md` → "Dare voce")
   - Variare la lunghezza dei periodi, ammettere opinione e prima persona dove il registro
     lo consente, eliminare la simmetria da algoritmo.
5. **Audit finale anti-AI** — chiediti *"Cosa rende ancora AI questo testo?"*, elenca i
   tell residui, poi rivedi.

Mantieni sempre **significato e registro** (saggistico, accademico, divulgativo, narrativo,
colloquiale). Se l'utente fornisce un campione del proprio stile, calibrati su quello.

## Workflow — SCRIVERE da zero

Scrivi già rispettando le regole, poi passa l'**audit finale anti-AI** (punto 5 sopra) e la
**checklist tipografica** prima di consegnare. Non produrre prosa che dovrai poi ripulire
dai tic AI: evita perifrasi, gerundite, triadi e avverbi in *-mente* fin dalla prima stesura.

---

## Principî cardine (i precetti ad alta frequenza)

**Punteggiatura**
- **Mai virgola tra soggetto e verbo** né tra verbo e suoi argomenti, se contigui.
- **Inciso = due virgole** (apri e chiudi); mai una sola.
- **Relativa restrittiva → niente virgola** (`i libri che servono`); **esplicativa →
  virgola** (`i libri, che peraltro servono,`).
- **Gerarchia:** virgola < punto e virgola < punto. Usa `;` per serie di membri lunghi o
  con virgole interne, e per cambi di soggetto.
- **Due punti:** niente maiuscola dopo (tranne il discorso diretto citato).
- **Sigle senza punti** (`ISTAT`, `FAO`); il punto di abbreviazione si fonde col punto fermo.

**Tipografia**
- **Virgolette:** caporali « » (editoria/saggistica) o dritte " " (web) — **uniformi, mai
  curve all'inglese, mai miste**. Citazione in citazione: « … " … " … ».
- **Trattino `-`** unisce senza spazi (`Torino-Milano`); **lineetta `–`** separa con spazi
  e in italiano si usa **poco** (preferisci virgole, due punti, parentesi).
- **Titoli in sentence case** (solo prima parola e nomi propri maiuscoli).
- **Puntini di sospensione: sempre tre**; omissioni in citazione tra parentesi `[…]`.

**Stile**
- Preferisci **`è/sono/ha`** alle perifrasi (*si configura come, rappresenta, costituisce*).
- **Un solo gerundio in coda per paragrafo**; il resto in proposizioni esplicite.
- **Togli gli avverbi in *-mente*** se la frase regge senza.
- **Spezza i periodi** sopra 35-40 parole o con più di due *che*.
- **Tre astratti in fila legati da *di*** → riscrivi con un verbo.
- **Un solo marcatore di incertezza** per affermazione.
- **Dai voce:** opinione, ritmo variato, dettagli concreti al posto di formule vaghe.

---

## Indice dei riferimenti

- **`references/punteggiatura.md`** — scheda per ogni segno (virgola, punto e virgola, due
  punti, punto, interrogativo, esclamativo, virgolette, lineette/trattini, parentesi,
  puntini, barra/asterisco, abbreviazioni e sigle, a capo/capoversi), con regole, errori
  comuni ed esempi.
- **`references/stile-naturale.md`** — 36 pattern dell'italiano AI (contenuto, grammatica,
  stile, comunicazione, riempitivi) con parole-spia e prima→dopo, sezione "Dare voce" e
  audit finale.

---

## Formato di output

Quando **correggi**, fornisci:
1. Il **testo corretto**.
2. *(se utile)* **"Cosa lo rendeva ancora AI / scorretto"** — elenco breve dei problemi
   trovati e delle scelte fatte.

Quando rispondi a una **domanda di punteggiatura**, dai la **regola** + un **esempio
corretto** (e, se istruttivo, l'errore da evitare), citando la scheda pertinente.

---

## Fonti

- Punteggiatura: B. Mortara Garavelli, *Prontuario di punteggiatura*, Laterza (2003).
- Stile/anti-AI: adattamento italiano di [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
  (WikiProject AI Cleanup), ampliato per i tic dell'italiano.
