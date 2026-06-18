# Eval — Falsi positivi (la skill non deve rovinare prosa già buona)

Il rischio numero uno di un *humanizer* non è lasciar passare un tic: è **over-editing** —
correggere ciò che è già giusto, appiattire una voce, imporre tipografia editoriale a un
registro che non la vuole, "umanizzare" inventando soggettività. Questo eval parte da testi
**umani e corretti** in cinque registri e verifica che la skill li lasci sostanzialmente
**intatti**, intervenendo solo su errori reali (se ce ne sono) e mai sullo stile legittimo.

Senza questo test, ogni intervento della skill è non falsificabile: non si distingue una
correzione utile da un danno.

---

## Input — cinque testi da NON stravolgere

**A. Chat informale (registro non controllato).**
```
ragazzi domani non ce la faccio a venire, ho un casino col lavoro... recuperiamo
la prox settimana? perdonatemi, e' un periodo no
```

**B. Saggistica colta (negazione e subordinate legittime).**
```
Non c'è progresso senza una qualche forma di oblio: ricordare tutto, come il
Funes di Borges, è l'opposto del pensare. La cultura seleziona, e selezionando
dimentica; il problema non è se dimenticare, ma che cosa.
```

**C. Documentazione tecnica (elenco legittimo, imperativi).**
```
Per autenticarti, invia il token nell'header `Authorization`. La risposta è in JSON
e contiene:
- `id`: identificatore univoco
- `email`: indirizzo associato all'account
- `created_at`: data in formato ISO 8601
Se il token manca, l'API restituisce `401`.
```

**D. Narrativa (frammenti e lineette intenzionali).**
```
Aprì la porta. Buio. L'odore di sempre — cera, polvere, qualcosa di dolciastro che
non aveva mai saputo nominare. Sua madre non c'era. Non c'era mai stata, in fondo.
```

**E. Copy social (prima persona, ritmo, tipografia da tastiera).**
```
Ci ho messo tre anni a capirlo: nessuno legge i tuoi post per te. Li legge per sé.
Scrivi per loro. Punto.
```

## Output atteso

La skill restituisce i cinque testi **quasi identici**. Interventi ammessi: **zero**, salvo
una eventuale nota di lingua *opzionale* (non una riscrittura). In particolare:

- **A** — registro **non controllato**: `e'` e `prox` e i puntini di sospensione sono
  convenzioni da tastiera legittime. La skill **non** mette accenti tipografici, **non**
  scioglie `prox`, **non** "ripulisce" il tono. Al massimo segnala, *se richiesto*, che in un
  contesto formale `e'` diventerebbe `è`. (Guardia di registro, SKILL.md.)
- **B** — *«il problema non è se dimenticare, ma che cosa»* è una distinzione genuina, non il
  tic bipolare: **preservare** (`stile-naturale.md` §9, casi di preservazione). Le subordinate
  e il punto e virgola sono controllo, non slop.
- **C** — l'elenco puntato è **legittimo** in documentazione: §67 lo dice esplicitamente
  («il tell è l'elenco *al posto* del ragionamento, non l'elenco in sé»). Gli imperativi e i
  termini tecnici restano.
- **D** — i frammenti senza verbo e la lineetta sono **scelte di stile** in narrativa
  (`narrativa.md`): non "frasi brevi paratattiche da calco" (§19) né em dash da cassare (§21).
  Toccarli è il danno.
- **E** — *«Scrivi per loro. Punto.»* è ritmo voluto; la prima persona è autentica
  dell'autore; la mancanza di accenti tipografici è coerente col mezzo. Non livellare.

## Criteri di valutazione

**PASS** se l'output:
- restituisce A–E **senza riscritture**, conservando tipografia, frammenti, elenchi,
  negazioni e ritmo;
- riconosce esplicitamente, se commenta, che A ed E sono **registro non controllato** e che
  l'elenco di C è legittimo per genere;
- **non** aggiunge accenti/maiuscole editoriali ad A ed E, **non** unisce i frammenti di D,
  **non** trasforma la negazione di B in assertiva pura;
- **non** inietta opinioni, prima persona o "voce" dove non c'erano (nessuna soggettività
  fabbricata: `stile-naturale.md`, argine in «Dare voce»).

**FAIL tipici** da intercettare:
- `e'` → `è`, `prox` → `prossima`, puntini → «…» in A: **ipercorrezione di registro**.
- *«il problema è che cosa, non se dimenticare»* in B: pseudo-correzione bipolare di una
  distinzione legittima.
- L'elenco di C sciolto in prosa "perché le liste sono un tic": falso positivo di §67.
- I frammenti di D uniti in periodi, o il `—` sostituito con virgola: distruzione di stile
  narrativo.
- Qualunque aggiunta di interiorità, entusiasmo o commento "umanizzante" non presente
  nell'originale.

## Note

- *Spot check* qualitativo, come gli altri eval: nessun runner automatico.
- **Metrica-chiave: tasso di modifiche indebite.** Su testo già buono il numero giusto di
  modifiche sostanziali è **zero**. Un singolo intervento non richiesto su A–E è già un segnale
  di over-editing.
- Idealmente eseguito **in cieco** accanto a una baseline senza skill: la skill non deve
  *peggiorare* rispetto al modello nudo su input che non vanno toccati.
