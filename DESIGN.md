---
name: Scrittura italiana
description: Un foglio di revisione contemporaneo per chi scrive in italiano.
colors:
  cobalt-proof: "oklch(48% 0.205 264)"
  cobalt-deep: "oklch(27% 0.095 264)"
  coral-pencil: "oklch(82% 0.18 31)"
  paper-cool: "oklch(97% 0.012 244)"
  paper-blue: "oklch(93% 0.025 252)"
  ink-navy: "oklch(22% 0.038 258)"
  ink-muted: "oklch(47% 0.035 258)"
  line-blue: "oklch(83% 0.04 254)"
  evidence-green: "oklch(56% 0.115 151)"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "clamp(3.5rem, 10vw, 8rem)"
    fontWeight: 750
    lineHeight: 0.88
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 2.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 450
    lineHeight: 1.58
    letterSpacing: "normal"
  label:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  xs: "3px"
  sm: "6px"
  md: "14px"
spacing:
  xs: "0.375rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "clamp(4rem, 9vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.coral-pencil}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.2rem"
  button-secondary:
    backgroundColor: "{colors.paper-cool}"
    textColor: "{colors.cobalt-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.2rem"
  callout:
    backgroundColor: "{colors.paper-blue}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
---

# Design System: Scrittura italiana

## Overview

**Creative North Star: "Il foglio sotto revisione"**

Il sistema ricorda una prova di stampa riletta alla luce chiara di una biblioteca universitaria. Non imita il libro antico né il terminale: rende visibili tagli, scelte e margini attraverso grandi campi cromatici, segni editoriali e testo leggibile. La pagina deve apparire competente, concreta e viva.

La landing usa il cobalto come superficie identitaria; la documentazione torna su carta fredda per sostenere letture lunghe. Il corallo funziona come matita del revisore, mai come decorazione casuale. La struttura alterna pieni e vuoti, esempi annotati e fasce di testo, evitando griglie di card intercambiabili.

**Key Characteristics:**

- Cobalto impegnato, carta fredda e corallo da revisione.
- Un'unica famiglia tipografica progettata per la leggibilità.
- Segni editoriali ingranditi come immagini funzionali.
- Gerarchia netta, contenuto progressivo e rigore documentale.
- Movimento raro, breve e sempre disattivabile.

## Colors

Una palette piena ma disciplinata: il cobalto identifica, il corallo interviene, i neutri freddi fanno leggere.

### Primary

- **Cobalto di prova** (`oklch(48% 0.205 264)`): hero, navigazione, fasce identitarie e collegamenti principali.
- **Cobalto profondo** (`oklch(27% 0.095 264)`): testo su fondi chiari e superfici scure secondarie.

### Secondary

- **Matita corallo** (`oklch(82% 0.18 31)`): correzioni, CTA primaria, stati attivi e segni di attenzione. Supera il rapporto 3:1 sul cobalto anche nel testo grande.
- **Verde di riscontro** (`oklch(56% 0.115 151)`): soltanto per esiti verificati e informazioni conservate.

### Neutral

- **Carta fredda** (`oklch(97% 0.012 244)`): fondo di lettura principale.
- **Carta azzurra** (`oklch(93% 0.025 252)`): esempi, callout e superfici informative.
- **Inchiostro navale** (`oklch(22% 0.038 258)`): testo principale.
- **Inchiostro attenuato** (`oklch(47% 0.035 258)`): testo secondario.
- **Riga azzurra** (`oklch(83% 0.04 254)`): separatori e bordi strutturali.

**The Pencil Rule.** Il corallo deve indicare un'azione, una modifica o un punto che richiede attenzione. Non riempie superfici decorative.

## Typography

**Display Font:** Atkinson Hyperlegible Next (con Atkinson Hyperlegible e Arial come fallback)
**Body Font:** Atkinson Hyperlegible Next (con Atkinson Hyperlegible e Arial come fallback)

**Character:** una sola voce tipografica, accessibile e senza costume editoriale. Il contrasto nasce da scala, peso e densità, non dall'accostamento prevedibile fra serif e monospace.

### Hierarchy

- **Display** (750, `clamp(3.5rem, 10vw, 8rem)`, 0.88): promessa principale e parole-immagine.
- **Headline** (700, `clamp(2.25rem, 6vw, 5rem)`, 0.96): aperture di sezione e pagine della documentazione.
- **Title** (700, `clamp(1.35rem, 2.5vw, 2rem)`, 1.08): passaggi, esempi e blocchi operativi.
- **Body** (450, `1.125rem`, 1.58): lettura continua, con righe fra 45 e 72 caratteri.
- **Label** (650, `0.875rem`, 0.01em): navigazione, metadati e controlli, senza maiuscolo sistematico.

**The Read-It-Aloud Rule.** La gerarchia deve restare evidente senza ricorrere a etichette decorative sopra ogni titolo.

## Elevation

Il sistema è piatto per impostazione. La profondità deriva dalla sovrapposizione di fogli, dagli scarti di colore e da bordi netti. Le ombre compaiono soltanto sugli elementi che si sollevano in risposta all'interazione.

### Shadow Vocabulary

- **Foglio sollevato** (`box-shadow: 0 0.75rem 0 oklch(22% 0.038 258 / 0.12)`): demo e pannelli annotati, mai contenitori ordinari.
- **Azione attiva** (`box-shadow: 0 0.3rem 0 oklch(22% 0.038 258 / 0.22)`): pulsante primario in hover.

**The Flat-at-Rest Rule.** Un elemento non interattivo non riceve un'ombra per sembrare importante.

## Components

### Buttons

- **Shape:** rettangolo netto con raggio contenuto (`6px`).
- **Primary:** corallo con testo in inchiostro navale, peso 650 e padding `0.85rem 1.2rem`.
- **Hover / Focus:** lieve traslazione verticale, bordo di contrasto e anello esterno visibile da tastiera.
- **Secondary:** carta fredda su cobalto o trasparente su carta, sempre con bordo esplicito.

### Chips

- **Style:** usati solo per stato o filtro reale, non come fila di metriche decorative.
- **State:** testo e bordo cambiano insieme; il colore non è mai l'unico segnale.

### Cards / Containers

- **Corner Style:** `14px` per callout e fogli dimostrativi; nessun raggio sui grandi campi di pagina.
- **Background:** carta azzurra per esempi, carta fredda per documentazione.
- **Shadow Strategy:** soltanto per il foglio dimostrativo principale.
- **Border:** `1px` in riga azzurra o inchiostro navale.
- **Internal Padding:** da `1.25rem` a `2rem`, in base alla densità del contenuto.

### Inputs / Fields

- **Style:** sfondo carta fredda, bordo da `1px`, raggio `6px`, etichetta sempre visibile.
- **Focus:** bordo cobalto profondo e anello corallo esterno.
- **Error / Disabled:** errore testuale esplicito; stato disabilitato riconoscibile anche senza colore.

### Navigation

Navigazione compatta sul cobalto, con nome del progetto sempre disponibile. Lo stato corrente usa una sottolineatura spessa corallo e `aria-current`; su mobile diventa un pannello lineare controllabile da tastiera.

### Annotated Revision

Il componente distintivo mostra testo originale, interventi e invarianti conservate. Le cancellazioni restano leggibili, le aggiunte sono dichiarate e una legenda spiega ogni segno. Non usa un'immagine se il contenuto può restare testo accessibile.

## Do's and Don'ts

### Do:

- **Do** usare il cobalto su grandi superfici e la carta fredda per letture lunghe.
- **Do** mostrare prove, esempi e limiti vicino alle affermazioni che sostengono.
- **Do** mantenere il testo principale fra 45 e 72 caratteri per riga.
- **Do** usare segni editoriali come informazione, con una legenda accessibile.
- **Do** rispettare WCAG 2.2 AA, `prefers-reduced-motion` e navigazione completa da tastiera.

### Don't:

- **Don't** costruire una landing SaaS generica con gradienti, metriche decorative, badge e griglie di card intercambiabili.
- **Don't** usare display serif alla moda, etichette monospace ripetute, carta beige o un finto impianto da rivista.
- **Don't** usare terminali e codice come costume per un pubblico non tecnico.
- **Don't** trasformare la documentazione in accademismo austero, testo fitto o gerarchie opache.
- **Don't** promettere un “testo umano”, classificatori infallibili o benchmark definitivi.
- **Don't** usare gradient text, glassmorphism, bande laterali colorate o ombre decorative.
