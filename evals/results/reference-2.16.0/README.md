# Riferimento 2.16.0 — superficie nuova, misura ripulita

Prodotto il 29 luglio 2026, dall'ondata P del quinto audit. Editor `claude-sonnet-5`,
giudice `claude-opus-4-8`. Le modifiche misurate: tre compiti nuovi (tradurre verso
l'italiano, riassumere, discorso per l'ascolto), lavoro in sessione, diagnosi-only, quattro
schede di punteggiatura; suite estesa a 33 dev + 6 held-out (i sei casi nuovi #34-39).

I bracci di **decontaminazione** della suite (#5, #13, routing #31) stanno nel riferimento
precedente: `reference-2.15.1/deconta-*` e addendum del suo README.

## Casi dev nuovi — `p-nuovi/` + `p-nuovi-bis/`: 6/6, 0 invenzioni

| id | nome | esito |
|---|---|---|
| 34 | diagnosi-senza-riscrittura | ✔ (referto ancorato, nessuna riscrittura) |
| 35 | traduzione-calchi | ✔ (*make sense/consistent/realize/evidence* resi senza calchi) |
| 36 | sessione-iterativa | ✔ al 2º giro (vedi onestà) |
| 37 | scheda-redazionale | ✔ al 2º giro (verdetto troncato al 1º) |
| 38 | domanda-punto-virgolette | ✔ |
| 39 | domanda-elenchi | ✔ |

**Onestà su #36:** al primo giro 0/1 — il veto dell'utente era rispettato (il cuore del
caso) ma l'editor non scioglieva *«procedendo alla implementazione»* nel verbo pieno
richiesto da §38. L'aspettativa doppia è stata spacchettata in due (stessa severità, verdetto
diagnostico) e il caso ripassato 1/1: resta **severo e osservato**, non ammorbidito.
**#37:** primo verdetto del giudice troncato a metà JSON → err fail-closed; pulito alla
ripetizione (l'output dell'editor era corretto già al primo giro).

## Canarini di conservazione — `p-canarini/`: 4/4, 0 invenzioni

#4 chat, #7 doc-tecnica, #13 bipolare (decontaminato), #26 istruzioni annidate: il contenuto
nuovo non riapre l'over-editing né l'ipercorrezione.

## Instradamento della candidata — isolamento obbligatorio

**Scoperta di metodo:** con una copia personale installata in `~/.claude/skills`, il client
la preferisce alla copia di progetto della workdir — i run `p-routing-42-43/` misuravano la
**2.15.1 installata**, non la candidata (#43 non apriva nulla: comportamento vecchio,
coerente). Le misure valide sono quelle **isolate** (copia personale spostata fuori da
`skills/` e ripristinata a fine run; spostarla *dentro* `skills/` con un altro nome non
basta: il client la carica col nome di backup). In corsa è stato corretto anche un bug del
classificatore su macOS (workdir `/var/…` vs path risolti `/private/var/…`: `realpathSync`).

| caso | esito |
|---|---|
| #42 riassumere (`p-routing-cand/`) | ✔ apre `retorica-efficacia` |
| #43 tradurre (`p-routing-cand/` + `p-tradurre-cand-r2..r3/`) | **1/3**: attiva sempre, apre di rado |
| #43 dopo la clausola («una traduzione di poche righe» fra le categorie della brevità) — `p-tradurre-cand-r4..r6/` | **3/3** ✔ |
| #34 discorso (`p-discorso-cand-r1..r3/`) | **3/3** (era 2/3 sulla 2.15.1: la `description` con «discorsi» chiude la candidata 2.15.2) |
| #35 spiega (`p-spiega-cand/`) | ✘ 0/1 — il confine noto e deliberato coi negativi, invariato |

Nota di metodo: la clausola è scritta **per categorie** (la traduzione breve), non ricalcata
sul prompt di misura — stesso criterio della 2.15.1.

## Attivazioni spurie — `p-negativi-cand/`: 0/15

Con la description nuova («tradurre», «discorsi»), sui 10 negativi storici più i 5 di
confine (#37-41): zero attivazioni. In particolare «Traduci **in inglese**…» (IT→EN, fuori
perimetro) non fa scattare la skill.

## Held-out — `heldout-2.16.0/` (+ `heldout-2.16.0-16-suppl/`): 5/6, 0 invenzioni

#14, #15, #31, #32, #33 ✔. **#16 (transizioni-accademiche, improve): 1/3 oggi** — la sua
storia è un coin-flip dichiarato (✘ in 2.15.0, ✔ in 2.15.1) su un'aspettativa graduata:
resta **osservato, mai ritoccato**.

## Riproduzione

```bash
node evals/run.mjs --ids 34,35,36,37,38,39 --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/run.mjs --ids 4,7,13,26 --model claude-sonnet-5 --judge-model claude-opus-4-8
node evals/run.mjs --split held-out --model claude-sonnet-5 --judge-model claude-opus-4-8
# instradamento della candidata: SOLO con la copia personale spostata fuori da ~/.claude/skills
node evals/activation.mjs --ids 42,43 && node evals/activation.mjs --kind negative
```

⚠ Un braccio alla volta; su 429 il runner ora abortisce e riparte con `--resume`.
