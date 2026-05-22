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
git clone https://github.com/<utente>/claude-skill-scrittura-italiana \
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

## Licenza

[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/) —
vedi il file [`LICENSE`](LICENSE).

Puoi usarla, modificarla e ridistribuirla, anche per fini commerciali, a patto di **citare la
fonte** e di **rilasciare le opere derivate sotto la stessa licenza**.

## Contribuire

Segnalazioni e proposte sono benvenute via issue o pull request: nuovi pattern dell'italiano
AI, precisazioni sulle regole di punteggiatura, esempi migliori, refusi. Per le regole di
punteggiatura, indica sempre la fonte o l'uso attestato.
