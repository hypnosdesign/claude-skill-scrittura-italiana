# Changelog

Tutte le modifiche rilevanti a *scrittura-italiana* sono documentate qui.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto adotta
il [Versionamento Semantico](https://semver.org/lang/it/).

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

[2.3.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.3.0
[2.2.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.2.0
[2.1.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.1.0
[2.0.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.0.0
[1.0.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v1.0.0
