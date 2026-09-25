# Eval — Tic bipolare (§9 di `stile-naturale.md`)

Test che la skill, davanti a più varianti del costrutto bipolare, distingua la ridondanza
formale dall'esclusione informativa. Il criterio non è la presenza di *non/ma* né una coppia
di parole apparentemente opposte: è l'implicazione nel contesto.

---

## Prompt

> Esegui un line edit conservativo del paragrafo. Riduci i costrutti ornamentali, ma non
> alterare citazioni, polarità o distinzioni informative. Restituisci il testo revisionato e
> una nota breve solo per le scelte non ovvie.

## Input

Il paragrafo contiene cinque occorrenze:

1. formula additiva da semplificare mantenendo entrambe le funzioni;
2. antonimia realmente ridondante da riscrivere;
3. falso antonimo da preservare;
4. citazione fornita dall'utente da preservare verbatim;
5. esclusione di categoria da preservare nella forma originaria.

```
La piattaforma non gestisce solo le pratiche: coordina anche i flussi.
Il piano di prova è gratuito, non a pagamento: si attiva
senza carta di credito. L'architettura è modulare, non monolitica: qui *modulare*
descrive i confini interni, *non monolitica* il modello di distribuzione. Nel documento fornito
dall'utente si legge: «la tecnologia non è mai neutrale, ma porta sempre con sé
un'ideologia». Per questo l'adozione non è una scelta tecnica: è una scelta
organizzativa che coinvolge ruoli, processi e responsabilità.
```

## Diagnosi attesa

1. *non gestisce solo le pratiche: coordina anche i flussi* → conserva gestione delle
   pratiche e coordinamento dei flussi; puoi esprimerli senza la cornice *non solo*.
2. *gratuito, non a pagamento* → implicazione necessaria nello stesso contesto: *gratuito*
   contiene già *non a pagamento*.
3. *modulare, non monolitica* → preserva. Il testo assegna esplicitamente i due termini ad
   assi distinti (confini interni e distribuzione); il secondo polo porta quindi informazione.
   Non basta etichettare le parole come antonimi.
4. Citazione diretta fornita dall'utente → preserva verbatim. Non è richiesto un fact-check;
   un eventuale dubbio sulla fonte andrebbe in una nota separata, non dentro il testo.
5. *non è una scelta tecnica: è una scelta organizzativa* → preserva. *Organizzativa* non
   implica *non tecnica* e il polo escluso corregge una lettura prevedibile.

## Output atteso

```
La piattaforma gestisce le pratiche e coordina i flussi. Il piano di prova è gratuito:
si attiva senza carta di credito. L'architettura è modulare, non monolitica: qui *modulare*
descrive i confini interni, *non monolitica* il modello di distribuzione. Nel documento fornito
dall'utente si legge: «la tecnologia non è mai neutrale, ma porta sempre con sé
un'ideologia». Per questo l'adozione non è una scelta tecnica: è una scelta organizzativa
che coinvolge ruoli, processi e responsabilità.
```

Rese diverse sono ammesse se mantengono gli stessi invarianti. Nei casi (3) e (5), però,
non serve «correggere» per inversione: se il costrutto è informativo, la forma originale è
legittima e può restare.

## Criteri di valutazione

**PASS** se l'output:

- semplifica (1) mantenendo entrambe le funzioni e riduce la ridondanza in (2);
- preserva integralmente (3), perché nel dominio descritto *modulare* e *non monolitica*
  qualificano assi diversi;
- lascia verbatim la citazione in (4), senza attribuzioni o fonti aggiunte;
- conserva la polarità e la forma informativa di (5), senza trasformarla in *«è
  organizzativa, non tecnica»* o *«più che tecnica»*;
- motiva le scelte con il test di implicazione nel contesto, non con una lista lessicale di
  antonimi.

**FAIL tipici**:

- tagliare *non monolitica* perché *modulare* viene trattato meccanicamente come antonimo;
- invertire (5) in *«è organizzativa, non tecnica»*: preserva il contenuto, ma reintroduce
  la variante formale che la regola invita a non fabbricare;
- attenuare (5) in *«più che tecnica»*, che concede ciò che l'originale esclude;
- modificare o arricchire la citazione in (4);
- eliminare la gestione delle pratiche in (1), lasciando soltanto il coordinamento.

## Note

- Spot check qualitativo: non costituisce un benchmark finché output e giudizi non vengono
  persistiti.
- Il caso (3) è un controllo di falso positivo; il caso (2) offre il contrasto realmente
  ridondante.
