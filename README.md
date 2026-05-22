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

1. **aptum** — appropriatezza a scopo, destinatario, registro e **livello di controllo** del
   testo (editoriale vs web/social): nel testo informale le convenzioni da tastiera — virgolette
   dritte, accenti "da tastiera" — non sono errori e non vanno corrette.
2. **puritas** — correttezza **tipografica** (virgola, punto e virgola, due punti, virgolette
   caporali « » vs dritte, trattino vs lineetta, maiuscole, sigle) e **di parola** (accenti,
   omofoni come *da/dà*, *qual è*, *un po'*, *sé stesso*, plurali difficili, *tu/te*).
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
    ├── punteggiatura.md          # puritas (segni): 15 schede, regole, errori, esempi
    ├── dubbi-e-errori.md         # puritas (parole): accenti, omofoni, plurali,
    │                             #   pronomi, ortografia, congiuntivo, preposizioni
    ├── retorica-efficacia.md     # aptum/perspicuitas/ornatus: 4 virtù, 3 stili,
    │                             #   repertorio di figure, compositio, tópoi
    └── stile-naturale.md         # anti-slop: 36 pattern AI + "Dare voce" + audit
```

`SKILL.md` è autosufficiente per i casi frequenti; i file in `references/` vengono consultati
quando serve il dettaglio (*progressive disclosure*).

## Documentazione

- **[FAQ.md](FAQ.md)** — domande ricorrenti (per testi umani o AI? non è un autocorrettore? mi impone uno stile?…).
- **[ESEMPI.md](ESEMPI.md)** — casi *prima → dopo* (testo AI, revisione di testo umano, registro informale).
- **[scrittura-italiana-single-file.md](scrittura-italiana-single-file.md)** — tutta la skill in un file, per Gemini/ChatGPT e assistenti senza supporto nativo alle Skill.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — come contribuire.

## Installazione

### Via `npx skills` (consigliato — multi-agente)

Installazione in un comando, da [skills.sh](https://www.skills.sh) (rileva da solo gli agent
installati: Claude Code, Cursor, Copilot…):

```bash
npx skills add hypnosdesign/claude-skill-scrittura-italiana
```

### Claude Code (CLI) — manuale

Clona dentro la cartella delle skill personali:

```bash
git clone https://github.com/hypnosdesign/claude-skill-scrittura-italiana \
  ~/.claude/skills/scrittura-italiana
```

Oppure, per un singolo progetto, in `.claude/skills/scrittura-italiana` nella radice del repo.
Riavvia/riapri Claude Code: la skill comparirà tra quelle disponibili.

### Claude Desktop / claude.ai

1. Scarica lo **zip** della skill: dalla pagina GitHub → *Code → Download ZIP* (oppure usa
   `scrittura-italiana.zip` allegato alle [Release](../../releases)).
2. Apri Claude → **Impostazioni → Capabilities (Funzionalità) → Skills**.
3. **Carica** la cartella `scrittura-italiana` (o il suo `.zip`). I file in `references/`
   viaggiano con la skill: la skill li legge dal proprio sandbox quando servono.

> La funzionalità **Skills** nelle app consumer richiede che *code execution* sia attivo
> (dipende dal piano: Pro/Max/Team/Enterprise). Se non vedi "Skills" in Impostazioni,
> abilitala lì o aggiorna l'app. Claude Desktop e claude.ai condividono lo stesso account:
> una skill caricata è disponibile in entrambi.

### Altri assistenti (Gemini, ChatGPT…)

- **Gemini CLI** e altri agent compatibili col formato Agent Skills: usa lo stesso
  `npx skills add hypnosdesign/claude-skill-scrittura-italiana` (rileva l'agent installato).
- **App Gemini, Custom GPT di ChatGPT** e simili (niente supporto nativo alle Skill): usa la
  **[versione in un solo file](scrittura-italiana-single-file.md)** — incolla quel documento
  nelle istruzioni di un *Gem* / Custom GPT, o caricalo come file di conoscenza. La skill è
  istruzioni in markdown: qualsiasi LLM capace ne segue le regole; si perde solo l'attivazione
  automatica e il caricamento on-demand dei riferimenti.

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

> 📄 Esempi completi e commentati in **[ESEMPI.md](ESEMPI.md)**: testo generato dall'AI,
> revisione di un testo umano (con la regola spiegata), e quando la skill *non* corregge
> (registro informale). Qui sotto, alcuni casi rapidi.

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
- **Dubbi ed errori comuni** (accenti, omofoni, plurali, pronomi…) — regole *sintetizzate e
  riscritte* da Manolo Trinci, *Le basi proprio della grammatica*, Bompiani (2019).
  Sono norme e nozioni della lingua, patrimonio comune; le definizioni e gli esempi della
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
(Laterza, 2003); the rhetoric layer distills her *Manuale di retorica* (Bompiani); the
common-mistakes layer rewrites rules from M. Trinci, *Le basi proprio della grammatica*
(Bompiani, 2019). These are facts of usage and classical-rhetoric concepts, not copyrightable;
the skill's wording and examples are original, not a reproduction. The style layer adapts
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
