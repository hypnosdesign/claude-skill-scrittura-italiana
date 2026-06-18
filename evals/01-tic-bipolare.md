# Eval — Tic bipolare (§9 di `stile-naturale.md`)

Test che la skill, davanti a un paragrafo con **più varianti del tic bipolare mescolate**
e a una **occorrenza legittima da preservare**, riscriva assertiva pura nei casi giusti e
flagghi la preservazione nel caso giusto. Senza questo eval, la lezione del §9 rischia di
perdersi al prossimo audit.

---

## Input

Paragrafo con 4 occorrenze del pattern bipolare, di cui:
- 2 da riscrivere assertiva pura (poli ridondanti: l'elevazione *semplice… ma*; gli antonimi
  *modulare/monolitica*)
- 2 da preservare o compensare (1 citazione diretta; 1 **esclusione di categoria** —
  *tecnica* vs *organizzativa* non sono antonimi: il test antonimi/categorie di §9 li separa)

```
La piattaforma non è un semplice strumento di gestione, ma è un sistema di
orchestrazione dei flussi. La sua architettura è modulare, non monolitica: ogni
componente lavora in isolamento. Come scriveva Postman, «la tecnologia non è mai
neutrale, ma porta sempre con sé un'ideologia». Per questo l'adozione non è una
scelta tecnica: è una scelta organizzativa che coinvolge ruoli, processi e
responsabilità.
```

Occorrenze attese al censimento:
1. *non è un semplice strumento di gestione, ma è un sistema…* → variante letterale; polo
   **ornamentale** (elevazione *semplice… ma*) → taglia
2. *è modulare, non monolitica* → **antonimi** sullo stesso asse (*modulare* implica già *non
   monolitica*) → taglia, assertiva pura
3. *«la tecnologia non è mai neutrale, ma porta…»* → **preserva** (citazione, caso 1)
4. *non è una scelta tecnica: è una scelta organizzativa* → **categorie distinte** +
   lettura di default (chi adotta legge "tecnica"): *«è organizzativa»* non recupera
   l'avvertimento → **preserva o compensa**, non tagliare

## Output atteso

Riscrittura assertiva pura per (1) e (2); preservazione per (3); **esclusione preservata**
per (4).

```
La piattaforma è un sistema di orchestrazione dei flussi. La sua architettura è
modulare: ogni componente lavora in isolamento. Come scriveva Postman, «la tecnologia
non è mai neutrale, ma porta sempre con sé un'ideologia». Per questo adottarla è una
scelta organizzativa, non tecnica: coinvolge ruoli, processi e responsabilità.
```

Con note esplicite della skill, per esempio:
- (1) Riscritta assertiva pura: tagliato il polo «semplice strumento di gestione»,
  elevazione ornamentale già implicata da «sistema di orchestrazione».
- (2) Riscritta assertiva pura: tagliato «monolitica». **Nel contesto** (componenti in
  isolamento) «modulare» implica già «non monolitica», quindi ridondante. ⚠ Fuori
  contesto i due termini non sono antonimi netti (un *modular monolith* è entrambi): è
  l'**implicazione nel dominio** a decidere, non la parola.
- (3) **Preservata** (citazione diretta, caso 1): il polo «neutrale» è dentro caporali di
  un autore, intoccabile.
- (4) **Esclusione preservata**: «tecnica» e «organizzativa» NON sono antonimi (categorie
  distinte) e «tecnica» è la lettura di default — tagliarla perde l'avvertimento. Resa come
  esclusione *«è organizzativa, non tecnica»* (NON *«più che tecnica»*, che ammetterebbe il
  tecnico come secondario invece di escluderlo).

## Criteri di valutazione

**PASS** se l'output:
- elimina del tutto il polo negativo in (1) e (2) — non lo inverte;
- **conserva l'esclusione in (4)** (forma piena o esclusione esplicita *«è organizzativa, non
  tecnica»*), perché *tecnica* e *organizzativa* non sono antonimi e *tecnica* è la lettura di
  default: ridurlo a *«è una scelta organizzativa»* secco è **perdita di significato**; *«più
  che tecnica»* **non** basta (concede il tecnico anziché escluderlo);
- **non riscrive (3)**, lasciando intatta la citazione;
- nelle note distingue il trattamento col **test di implicazione nel contesto** (taglia (2):
  in contesto «modulare» implica «non monolitica»; preserva (4): «organizzativa» non implica
  «non tecnica») e motiva la preservazione di (3) come citazione.

**FAIL tipici** da intercettare:
- **(4) ridotta ad assertiva pura secca** *«è una scelta organizzativa»*: cancella il
  contrasto informativo — è il falso positivo del divieto formale che §9 ora vieta.
- (1) riscritta per inversione: *«è un sistema di orchestrazione, non un semplice
  strumento»* — pseudo-correzione vietata dal §9.
- (3) modificata o "ripulita": violazione del caso 1 di preservazione.
- Tutte le occorrenze trattate come un unico pattern, senza riconoscere le varianti.
- Nessuna nota di motivazione sulla preservazione: la skill deve mostrare il *perché*,
  non solo il *cosa*.
- **Pattern bipolare annidato nella glossa di una citazione**, scambiato per "parte della
  citazione" e quindi non riscritto. Test: dopo un virgolettato attribuito a un autore,
  segue una glossa esplicativa contenente *«X non designa Y, ma A»* (struttura bipolare
  ternaria o binaria). La skill deve trattare la glossa come prosa propria del testo —
  riscrivibile assertiva pura — non come materiale citato intoccabile. La nota in coda al
  §9 lo prescrive: se la skill lascia intatta la glossa adducendo "è citazione", è FAIL.

## Note

- L'eval è di tipo *spot check* qualitativo, da eseguire a mano davanti alla skill
  caricata. Non c'è un runner automatico: la skill è prompt-based.
- Se in futuro si vuole un eval più ricco, aggiungere un secondo test con (b) plurali/
  tempi e (e) *e non*, e un test di falso positivo (anafora triadica genuina che la
  skill non deve riscrivere — caso 2 di preservazione).
