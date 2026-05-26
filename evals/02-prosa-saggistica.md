# Eval — Tic della prosa saggistico-accademica AI (§58-65 di `stile-naturale.md`)

Test che la skill, davanti a un paragrafo che mescola più tic del sotto-genere
saggistico-accademico, li riconosca tutti e riscriva asciutto mantenendo argomento e
voce. Spot check qualitativo, no runner automatico.

---

## Input

Paragrafo con almeno 4 dei tic codificati in §58-65, sovrapposti come tipicamente accade
nella prosa AI accademica.

```
La pertinenza di queste figure per il nostro caso è strutturale. Merleau-Ponty
arriva in soccorso da una direzione filologicamente diversa ma argomentativamente
identica, portando la posta concettuale del paragrafo sul piano della percezione:
la carne non è, in questo senso preciso, il corpo individuale, ma il tessuto
comune. Galloway aggiunge la chiusura sul piano dei media digitali. Le tre voci
convergono in un'unica conclusione, che il presente paragrafo pone alla porta
della propria sintesi: la non-condivisione di codice è la condizione operativa
del dispositivo. La somiglianza con il caso BG è precisa.
```

Occorrenze attese al censimento:

1. *La pertinenza di queste figure per il nostro caso è strutturale* → §65 (incipit
   applicativo)
2. *Merleau-Ponty arriva in soccorso da una direzione filologicamente diversa ma
   argomentativamente identica, portando…* → §58 (catena di transizione)
3. *la posta concettuale del paragrafo* → §60 (nome-ombrello accademico)
4. *la carne non è, in questo senso preciso, il corpo individuale, ma il tessuto comune*
   → §59 (glossa metalinguistica vuota) **e** §9 (bipolare letterale annidato nella
   glossa, vedi nota in coda al §9)
5. *Galloway aggiunge la chiusura sul piano dei media digitali* → §58 (seconda
   transizione)
6. *Le tre voci convergono in un'unica conclusione, che il presente paragrafo pone alla
   porta della propria sintesi* → §62 (meta-frase di sintesi) **+** §61
   (autoriferimento metatestuale)
7. *La somiglianza con il caso BG è precisa* → §64 (autovalutazione di precisione)

## Output atteso

Riscrittura asciutta che elimina tutti i tic mantenendo argomento e voce. Esempio:

```
Merleau-Ponty parte da una filologia diversa e arriva alla stessa conclusione: la
carne è il tessuto comune, non il corpo individuale dell'osservatore. Galloway
prolunga il punto sul piano dei media digitali. La non-condivisione di codice è la
condizione operativa del dispositivo — è quel che accade anche in BG.
```

(Risultato accettabile: rese diverse vanno bene se eliminano i tic e conservano il
contenuto teorico. Quello sopra è una baseline, non l'unica forma corretta.)

## Criteri di valutazione

**PASS** se l'output:
- elimina o riformula tutte le occorrenze numerate sopra;
- riconosce esplicitamente almeno 4 dei tic per categoria (§58/§59/§60/§61/§62/§64/§65)
  nelle note di riscrittura;
- non sostituisce un tic con un altro della stessa famiglia (es. togliere la catena di
  transizione §58 ma rimettere una meta-frase §62 al suo posto);
- riconosce il bipolare annidato nella glossa al punto 4 e lo riscrive in assertiva
  pura (non per inversione).

**FAIL tipici** da intercettare:
- Riscrittura "cosmetica" che alleggerisce ma lascia in piedi le formule-tipo (catene di
  transizione, meta-frasi di sintesi).
- Bipolare al punto 4 lasciato dentro la glossa perché "è esposizione del pensiero
  altrui" — è la trappola codificata nella nota in coda al §9.
- **Sostituzione di un tic con un altro della stessa famiglia.** Il caso più sottile
  dell'eval: la skill riconosce il tic e lo "corregge", ma scambia un membro della
  famiglia con un altro membro della stessa famiglia. Triade esplicita:
  - *input:* «la posta concettuale del paragrafo è la non-condivisione di codice»
  - *output errato:* «la cifra del paragrafo è la non-condivisione di codice»
  - *output corretto:* «il paragrafo dice che la non-condivisione di codice è la
    condizione operativa del dispositivo» (oppure: «qui il punto è la non-condivisione
    di codice»)

  *Posta concettuale* e *cifra* sono entrambi membri di §60 (nomi-ombrello accademici):
  il revisore frettoloso vede il problema, fa la sostituzione laterale e si convince di
  aver corretto. Il fix vero richiede di nominare il referente concreto. Il fail vale
  anche per §58 (catena di transizione *«arriva in soccorso»* → *«giunge in aiuto»*) e
  per §59 (glossa *«in questo senso preciso»* → *«strictly speaking»* / *«tecnicamente»*).
- Output che taglia troppo, perdendo l'aggancio fra autori e tesi: la skill deve
  asciugare, non riassumere.

## Note

- Eval di spot check qualitativo come `01-tic-bipolare.md`.
- Se in futuro si vuole separare meglio, aggiungere eval distinti per le coppie §58+§62
  (tic strutturali di paragrafo) e §59+§60 (tic lessicali di precisione/astrazione).
