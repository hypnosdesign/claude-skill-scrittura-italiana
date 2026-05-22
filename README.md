# scrittura-italiana — skill per Claude

> Guida completa per **scrivere e correggere testi in italiano impeccabili**: punteggiatura
> e tipografia secondo la norma + stile naturale (senza i segni della scrittura AI).
>
> *A Claude [Agent Skill](https://docs.claude.com/en/docs/claude-code/skills) for writing
> and editing flawless Italian — punctuation & typography rules plus an "anti-AI", natural-voice
> style layer. Content is in Italian.*

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

## Cos'è

Una skill che dà a Claude il quadro completo delle regole per scrivere in italiano. Lavora
su **due livelli complementari**:

1. **Correttezza** — punteggiatura e tipografia secondo la norma italiana: virgola, punto e
   virgola, due punti, virgolette (caporali « » vs dritte), trattino vs lineetta, parentesi,
   puntini, maiuscole, abbreviazioni e sigle.
2. **Naturalezza** — riconosce e rimuove i 36 pattern tipici dell'italiano generato da AI
   (perifrasi, gerundite, avverbi in *-mente*, burocratese, triadi forzate, trattini lunghi
   all'inglese, capitalizzazione dei titoli…) e cura voce e ritmo.

La differenza rispetto a un semplice "umanizzatore": qui c'è anche il livello prescrittivo
della punteggiatura, e un **workflow ordinato** (prima la struttura, poi la pelle) che le
fonti separate non offrono.

## Struttura

```
.
├── SKILL.md                      # orchestratore: quando attivarsi, workflow, principî cardine
└── references/
    ├── punteggiatura.md          # 15 schede di segni, con regole, errori comuni ed esempi
    └── stile-naturale.md         # 36 pattern anti-AI + "Dare voce" + audit finale
```

`SKILL.md` è autosufficiente per i casi frequenti; i due file in `references/` vengono
consultati quando serve il dettaglio (*progressive disclosure*).

## Installazione

### Claude Code (CLI)

Clona dentro la cartella delle skill personali:

```bash
git clone https://github.com/hypnosdesign/claude-skill-scrittura-italiana \
  ~/.claude/skills/scrittura-italiana
```

Oppure, per un singolo progetto, in `.claude/skills/scrittura-italiana` nella radice del repo.
Riavvia/riapri Claude Code: la skill comparirà tra quelle disponibili.

### claude.ai / Claude Desktop

Carica la cartella come Skill dalle impostazioni (Capabilities → Skills), oppure comprimi la
cartella in `.zip` e caricala.

## Uso

La skill si attiva da sola quando chiedi di scrivere o correggere testo italiano, o quando fai
una domanda di punteggiatura. Esempi:

- «Correggi questo testo in italiano: …»
- «Scrivi l'introduzione della tesi su … in italiano»
- «Questa frase ci vuole la virgola prima di *che*?»
- «Rendi questo testo meno “da AI”, mantenendo il mio registro»

Se fornisci un **campione del tuo stile**, la skill calibra la voce su quello invece di
appiattire tutto a un italiano neutro.

## Esempi (prima → dopo)

### 1. Stile: rimuovere i segni dell'AI

**Prima** (perifrasi, gerundite, triadi, avverbi in *-mente*, chiusura ottimistica vuota):

> Il nuovo museo si configura come una testimonianza vivente del patrimonio cittadino,
> rappresentando un punto di svolta cruciale nel panorama culturale locale e contribuendo
> significativamente a valorizzare l'identità del territorio. Gli spazi, ampi e luminosi,
> sono stati sapientemente progettati per accogliere mostre, laboratori ed eventi. Il futuro
> si prospetta indubbiamente brillante.

**Dopo** (copula, frasi spezzate, fatti concreti, voce):

> Il museo ha aperto a marzo in un ex pastificio. Tre sale al piano terra ospitano la
> collezione permanente; quella al primo piano è riservata alle mostre temporanee. La prima,
> sui manifesti pubblicitari degli anni Trenta, resta aperta fino a giugno.

### 2. Punteggiatura: virgola tra soggetto e verbo

> ✗ `Il bollettino meteorologico, non lascia prevedere un miglioramento.`
> ✓ `Il bollettino meteorologico non lascia prevedere un miglioramento.`

La virgola non separa mai il soggetto dal suo verbo (salvo un inciso chiuso da **due** virgole:
`Il bollettino, da giorni ormai, non lascia prevedere…`).

### 3. Punteggiatura: relativa restrittiva vs esplicativa

> `Non seguo i programmi che mi sembrano scadenti.` → solo quelli scadenti (restrittiva, **niente** virgola)
> `Non seguo i programmi, che mi sembrano scadenti.` → tutti, e per inciso sono scadenti (esplicativa, **con** virgola)

La virgola cambia il significato della frase.

### 4. Tipografia: virgolette e trattino

> ✗ `Ha detto "sì" subito - senza pensarci.`
> ✓ `Ha detto «sì» subito, senza pensarci.` (caporali in editoria; la lineetta all'inglese
> diventa una virgola)

## Fonti e attribuzione

Questa skill è un'opera derivata e cita le sue fonti:

- **Punteggiatura e tipografia** — regole *sintetizzate e riscritte* da
  Bice Mortara Garavelli, *Prontuario di punteggiatura*, Laterza (2003). Le norme di
  punteggiatura sono fatti d'uso della lingua, non protetti da copyright; questo materiale è
  una rielaborazione originale con esempi brevi e illustrativi, **non** una riproduzione del
  libro. Per lo studio approfondito, leggete il libro: è la fonte di riferimento sull'argomento.
- **Stile / pattern anti-AI** — adattamento italiano di
  [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
  (WikiProject AI Cleanup), disponibile sotto **CC BY-SA 4.0**. In conformità con il
  *share-alike*, anche questa skill è rilasciata sotto la stessa licenza.

## In English

**scrittura-italiana** is a Claude [Agent Skill](https://docs.claude.com/en/docs/claude-code/skills)
that gives Claude the full set of rules for **writing and editing Italian**. The skill's
content is in Italian (it has to be), but here's what it does and how to use it.

### What it does — two layers

1. **Correctness** — Italian punctuation and typography by the book: comma, semicolon, colon,
   quotation marks (Italian guillemets « » vs straight quotes), hyphen vs dash, parentheses,
   ellipsis, capitalization, abbreviations and acronyms.
2. **Naturalness** — detects and removes the 36 patterns typical of AI-generated Italian
   (copula-avoidance periphrasis, trailing gerunds, *-mente* adverb pile-ups, bureaucratese,
   forced triads, English-style em dashes, title-case headings…) and restores voice and rhythm.

Unlike a generic "humanizer", this skill also carries the **prescriptive punctuation layer**
and an **ordered workflow**: fix structure first (syntax/punctuation → typography), then the
surface (anti-AI style → voice), then a final anti-AI audit.

### Install

```bash
# Claude Code (personal skills)
git clone https://github.com/hypnosdesign/claude-skill-scrittura-italiana \
  ~/.claude/skills/scrittura-italiana
```

For a single project, clone into `.claude/skills/scrittura-italiana` at the repo root. On
claude.ai / Claude Desktop, upload the folder (or a `.zip`) under Capabilities → Skills.

### Use

The skill triggers automatically when you ask Claude to write or edit Italian text, or ask a
punctuation question (e.g. *"Correggi questo testo"*, *"ci vuole la virgola prima di che?"*).
Provide a sample of your own writing and it will match your voice instead of flattening
everything to neutral Italian. See the **Esempi (prima → dopo)** section above for before/after
demonstrations.

### Sources & license

Punctuation rules are synthesized and rewritten from B. Mortara Garavelli, *Prontuario di
punteggiatura* (Laterza, 2003) — punctuation norms are facts of usage, not copyrightable, and
this is an original rework, not a reproduction. The style layer adapts
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
(CC BY-SA 4.0); per share-alike, this skill is released under the same license. Contributions
welcome via issues and pull requests — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Licenza

[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/) —
vedi il file [`LICENSE`](LICENSE).

Puoi usarla, modificarla e ridistribuirla, anche per fini commerciali, a patto di **citare la
fonte** e di **rilasciare le opere derivate sotto la stessa licenza**.

## Contribuire

Segnalazioni e proposte sono benvenute via issue o pull request: nuovi pattern dell'italiano
AI, precisazioni sulle regole di punteggiatura, esempi migliori, refusi. Leggi le linee guida
in [`CONTRIBUTING.md`](CONTRIBUTING.md). Per le regole di punteggiatura, indica sempre la fonte
o l'uso attestato.
