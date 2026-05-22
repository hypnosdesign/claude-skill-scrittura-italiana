# scrittura-italiana — skill per Claude

> Guida completa per **scrivere e correggere testi in italiano impeccabili**, organizzata
> attorno alle **quattro virtù dell'espressione** della retorica classica: correttezza
> (punteggiatura e tipografia), chiarezza ed efficacia (retorica applicata), naturalezza
> (senza i segni della scrittura AI).
>
> *A Claude [Agent Skill](https://docs.claude.com/en/docs/claude-code/skills) for writing
> and editing flawless Italian, organized around the four classical virtues of style:
> correctness (punctuation & typography), clarity & effectiveness (applied rhetoric), and
> naturalness (anti-AI). Content is in Italian.*

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

## Cos'è

Una skill che dà a Claude il quadro completo per scrivere in italiano, organizzato attorno
alle **quattro virtù dell'espressione** (*virtutes elocutionis*) della retorica classica:

1. **aptum** — appropriatezza a scopo, destinatario, registro.
2. **puritas** — correttezza grammaticale e **tipografica**: virgola, punto e virgola, due
   punti, virgolette (caporali « » vs dritte), trattino vs lineetta, maiuscole, sigle.
3. **perspicuitas** — chiarezza: il lettore capisce alla prima.
4. **ornatus** — bellezza *regolata*: figure, ritmo, argomentazione. Il suo eccesso (la
   *mala affectatio*) è esattamente lo **slop dell'AI** — perifrasi, gerundite, triadi,
   avverbi in *-mente*, aggettivi pomposi — che la skill riconosce e rimuove (36 pattern).

Il principio guida è l'**equilibrio**: ogni virtù sta tra due vizi, per difetto (sciatteria,
oscurità) e per eccesso (slop). La differenza rispetto a un semplice "umanizzatore": qui c'è
sia il livello prescrittivo (punteggiatura) sia quello costruttivo (retorica applicata), con
un **workflow ordinato** che va dalla struttura alla pelle.

## Struttura

```
.
├── SKILL.md                      # modello (4 virtù), workflow, principî cardine
└── references/
    ├── punteggiatura.md          # puritas: 15 schede di segni, regole, errori, esempi
    ├── retorica-efficacia.md     # aptum/perspicuitas/ornatus: 4 virtù, 3 stili,
    │                             #   repertorio di figure, compositio, tópoi
    └── stile-naturale.md         # anti-slop: 36 pattern AI + "Dare voce" + audit
```

`SKILL.md` è autosufficiente per i casi frequenti; i file in `references/` vengono consultati
quando serve il dettaglio (*progressive disclosure*).

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
  Bice Mortara Garavelli, *Prontuario di punteggiatura*, Laterza (2003).
- **Retorica ed efficacia** (4 virtù, stili, figure, *compositio*, *tópoi*) — concetti
  *distillati e riformulati* da Bice Mortara Garavelli, *Manuale di retorica*, Bompiani.
  Sono nozioni della retorica classica, patrimonio comune; le definizioni e gli esempi della
  skill sono originali, **non** una riproduzione dei libri. Per lo studio approfondito,
  leggete le opere: sono i riferimenti sull'argomento.
- **Stile / pattern anti-AI** — adattamento italiano di
  [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
  (WikiProject AI Cleanup), disponibile sotto **CC BY-SA 4.0**. In conformità con il
  *share-alike*, anche questa skill è rilasciata sotto la stessa licenza.

## In English

**scrittura-italiana** is a Claude [Agent Skill](https://docs.claude.com/en/docs/claude-code/skills)
that gives Claude the full framework for **writing and editing Italian**. The skill's
content is in Italian (it has to be), but here's what it does and how to use it.

### What it does — the four virtues of style

The skill is organized around the four classical *virtutes elocutionis*:

1. **aptum** — appropriateness to purpose, audience, register.
2. **puritas** — grammatical and typographical correctness: comma, semicolon, colon,
   quotation marks (Italian guillemets « » vs straight quotes), hyphen vs dash, capitalization,
   acronyms.
3. **perspicuitas** — clarity: the reader gets it on first read.
4. **ornatus** — *measured* beauty: figures, rhythm, argumentation. Its excess (*mala
   affectatio*) is exactly AI slop — periphrasis, trailing gerunds, forced triads, *-mente*
   adverbs — which the skill detects and removes (36 patterns).

The guiding principle is **balance**: each virtue sits between two vices, by deficiency
(sloppiness, obscurity) and by excess (slop). Unlike a generic "humanizer", this skill carries
both the prescriptive layer (punctuation) and the constructive one (applied rhetoric), with an
**ordered workflow** from structure to surface, ending in an anti-AI audit.

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

Punctuation rules are synthesized from B. Mortara Garavelli, *Prontuario di punteggiatura*
(Laterza, 2003); the rhetoric layer distills her *Manuale di retorica* (Bompiani). These are
facts of usage and classical-rhetoric concepts, not copyrightable; the skill's wording and
examples are original, not a reproduction. The style layer adapts
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
