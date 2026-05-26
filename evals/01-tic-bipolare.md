# Eval — Tic bipolare (§9 di `stile-naturale.md`)

Test che la skill, davanti a un paragrafo con **più varianti del tic bipolare mescolate**
e a una **occorrenza legittima da preservare**, riscriva assertiva pura nei casi giusti e
flagghi la preservazione nel caso giusto. Senza questo eval, la lezione del §9 rischia di
perdersi al prossimo audit.

---

## Input

Paragrafo con 4 occorrenze del pattern bipolare, di cui:
- 3 da riscrivere assertiva pura (varianti diverse: letterale, due punti, inversione)
- 1 da preservare (citazione diretta — caso 1 dei 5 di preservazione)

```
La piattaforma non è un semplice strumento di gestione, ma è un sistema di
orchestrazione dei flussi. La sua architettura è modulare, non monolitica: ogni
componente lavora in isolamento. Come scriveva Postman, «la tecnologia non è mai
neutrale, ma porta sempre con sé un'ideologia». Per questo l'adozione non è una
scelta tecnica: è una scelta organizzativa che coinvolge ruoli, processi e
responsabilità.
```

Occorrenze attese al censimento:
1. *non è un semplice strumento di gestione, ma è un sistema…* → variante letterale
2. *è modulare, non monolitica* → variante (a) inversione
3. *«la tecnologia non è mai neutrale, ma porta…»* → preservare (citazione, caso 1)
4. *non è una scelta tecnica: è una scelta organizzativa* → variante (d) due punti

## Output atteso

Riscrittura assertiva pura per (1), (2), (4); preservazione motivata per (3).

```
La piattaforma è un sistema di orchestrazione dei flussi. La sua architettura è
modulare: ogni componente lavora in isolamento. Come scriveva Postman, «la tecnologia
non è mai neutrale, ma porta sempre con sé un'ideologia». Per questo l'adozione è una
scelta organizzativa che coinvolge ruoli, processi e responsabilità.
```

Con note esplicite della skill, per esempio:
- (1) Riscritta assertiva pura: tagliato il polo «strumento di gestione», che era una
  definizione bipolare standard.
- (2) Riscritta assertiva pura: tagliato il polo «monolitica», che era una variante (a)
  per inversione.
- (3) **Preservata** (citazione diretta, caso 1 dei 5): il polo «neutrale» è dentro
  caporali di un autore, intoccabile.
- (4) Riscritta assertiva pura: tagliato il polo «scelta tecnica», che era una variante
  (d) con due punti.

## Criteri di valutazione

**PASS** se l'output:
- elimina del tutto il polo negativo in (1), (2), (4) — non lo inverte;
- **non riscrive (3)**, lasciando intatta la citazione;
- nelle note motiva la preservazione di (3) citando esplicitamente "citazione diretta"
  o il caso 1;
- nelle note classifica correttamente almeno 2 delle 3 riscritte per variante (letterale
  / inversione / due punti).

**FAIL tipici** da intercettare:
- (1) o (4) riscritti per inversione: *«è un sistema di orchestrazione, non un semplice
  strumento»* — è la pseudo-correzione vietata dal §9.
- (3) modificata o "ripulita": violazione del caso 1 di preservazione.
- Tutte le occorrenze trattate come un unico pattern, senza riconoscere le varianti.
- Nessuna nota di motivazione sulla preservazione: la skill deve mostrare il *perché*,
  non solo il *cosa*.

## Note

- L'eval è di tipo *spot check* qualitativo, da eseguire a mano davanti alla skill
  caricata. Non c'è un runner automatico: la skill è prompt-based.
- Se in futuro si vuole un eval più ricco, aggiungere un secondo test con (b) plurali/
  tempi e (e) *e non*, e un test di falso positivo (anafora triadica genuina che la
  skill non deve riscrivere — caso 2 di preservazione).
