# Changelog

Tutte le modifiche rilevanti a *scrittura-italiana* sono documentate qui.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto adotta
il [Versionamento Semantico](https://semver.org/lang/it/).

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

[2.4.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.4.0
[2.3.2]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.3.2
[2.3.1]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.3.1
[2.3.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.3.0
[2.2.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.2.0
[2.1.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.1.0
[2.0.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v2.0.0
[1.0.0]: https://github.com/hypnosdesign/claude-skill-scrittura-italiana/releases/tag/v1.0.0
