# Seguito GPT — 25 settembre 2026

## Decisione sul nucleo compatto

**Non promuovere questa candidata.** Riduce letture e token, ma perde informazioni:
in entrambe le ripetizioni di #27 elimina «non è tecnico», conservato dalla base.
La decisione non dipende da una piccola differenza nel pass rate né da un giudizio
sulla preferenza dei lettori. La candidata rimane in `evals/experiments/`, fuori dal pacchetto.

Il confronto completo comprende 14 casi dev × 2 ripetizioni × 2 bracci. Editor
`gpt-5.6-terra`, giudice `gpt-6-sol`, effort `medium`, CLI 0.156.1. L'ordine dei
bracci viene invertito nella seconda ripetizione. Le 112 ricevute del client
confermano i modelli richiesti e il sandbox read-only senza rete.

| Misura dell'editor | Base | Compatta |
|---|---:|---:|
| Verdetti automatici positivi | 19/28 | 18/28 |
| Token d'ingresso processati | 1.199.663 | 627.331 |
| Di cui da cache | 706.048 | 358.400 |
| Token d'uscita, inclusi quelli di ragionamento | 5.916 | 4.826 |
| Letture di riferimenti | 18 | 9 |
| Byte restituiti dai riferimenti | 1.053.108 | 569.941 |
| Tempo totale delle chiamate editor | 234,402 s | 202,737 s |
| Mediana per chiamata editor | 6,992 s | 5,966 s |
| Equivalente a tariffa API, non costo fatturato | $1,1994 | $0,6675 |

I token processati sommano i passaggi di ciascun thread: non sono la dimensione di
un singolo contesto. I tempi comprendono l'avvio del client, non il giudice né il
tempo totale dello studio. Non dimostrano un vantaggio stabile di latenza.

Il client non comunica la spesa: `costUsd` resta `null`. L'equivalente API applica
ai token osservati le tariffe standard di Terra verificate il 25 settembre: $2/M
in ingresso, $0,20/M dalla cache e $12/M in uscita. Formula:
`((input − cached) × 2 + cached × 0,20 + output × 12) / 1.000.000`.
Non risultano scritture cache né singole richieste sopra 272.000 token. Non è una
stima della fattura o del consumo della quota Codex.
[Tariffe del modello](https://developers.openai.com/api/docs/models/gpt-5.6-terra).

## Lettura degli output e limiti del giudice

- La compatta conserva meglio la documentazione già chiara (#7) e non inventa
  promesse nel copy (#20). Questi vantaggi non compensano la negazione persa in #27.
- La voce (#24), la traduzione (#35) e il saggio (#40) mostrano errori o interventi
  incompleti. Il quantificatore «la maggior parte» viene anche spostato dai contenuti
  noti al giudizio sull'utilità del corso: non è una semplice variante di stile.
- I controlli letterali e la rilettura confermano la conservazione di comandi,
  identificatori, valori, condizioni e ordine operativo in #58, #60 e #65; #66
  corregge soltanto il refuso in tutti e quattro gli output.
- I conteggi restano quelli del giudice, non etichette umane. In #28 il giudice
  boccia anche il nuovo apostrofo curvo in *po’*, pur lasciando invariato *d'uscita*:
  è distinto dalla conversione di un apostrofo già presente. In #35 tratta in modo
  diverso l'omissione di *your* nei due output della base. Questi giudizi non sono
  stati sostituiti con tentativi più favorevoli.
- Il pass della base #34 run2 non rende corretta l'etichetta «gerundi in coda»
  applicata anche a *Implementando*, che apre il periodo. La rilettura mantiene il
  rilievo, benché il giudice lo consideri non decisivo.

Le letture osservate non sono tutte quelle prescritte. Esempi non ambigui: la base
#7 run2 legge `spiegare-con-chiarezza.md` invece di `stile-naturale.md`; la compatta
non legge `retorica-efficacia.md` in #20 né `stile-naturale.md` in #35 run1.
Il risparmio osservato comprende quindi anche omissioni delle letture obbligatorie.
Non va presentato come il costo di due workflow entrambi eseguiti correttamente.

È uno studio di sviluppo su un solo editor e due ripetizioni, non una prova di
equivalenza, non inferiorità o superiorità generale. I sei casi held-out non sono
stati usati. L'utente ha scelto di procedere senza lettori umani indipendenti: non
si formulano conclusioni sulla loro preferenza, sulla naturalezza o sulla voce.

## Provenienza

- [Confronto valido v2](gpt-confronto-v2/study-summary.json): 56/56 output e giudizi,
  con snapshot di nuclei, riferimenti, suite, manifest e policy.
- [Prima regressione](gpt-primo-tentativo/regression-summary.json): 22/28.
  [Calibrazione Sol](gpt-primo-tentativo/calibration-summary.json): 36/36 fixture
  concordi, con etichette create dall'assistente, non da valutatori umani.
  [Controllo Luna](gpt-primo-tentativo/crosscheck-summary.json): dieci verdetti
  concordi con Sol, nove pass e un fail; non comprende tutti gli output del confronto.
- [Seconda regressione](gpt-seconda-regressione/regression-summary.json): 22/28;
  tutti i nuovi casi #58–66 passano due volte, ma #7, #15 e #37 falliscono entrambe.
- Lo studio v1 nel primo tentativo è **invalido per il confronto dei riferimenti**:
  interrotto a 37/56 dopo aver verificato il troncamento del tool indiretto.
  Non entra nei numeri qui sopra. La policy v2 usa un namespace diretto e un budget
  esplicito; calibrazione e regressioni single-file non dipendono da quel tool.

Le directory pubblicabili contengono estratti delle chiamate: output, uso token,
letture, tempi, modello confermato e restrizioni. Sono omessi transcript nativi,
stderr, ID e percorsi personali. L'indice riporta gli hash dell'originale locale
e dell'estratto; gli estratti non sono file di resume. Gli originali rimangono
nelle directory locali `evals/results/gpt-*`. L'esportazione usa
`evals/experiments/export-gpt.mjs`, senza alterare gli originali.

Il file personale `AGENTS.md` risulta ancora fra le istruzioni del client; la sua
impronta è registrata e invariata. Contiene soltanto il routing MrWolf, inapplicabile
alla directory temporanea. L'ambiente non è dichiarato completamente ermetico.

## Verifica delle correzioni successive

Le contraddizioni su ritmo, livello di revisione e punteggiatura della collana
sono state corrette dopo lo snapshot del confronto. La
[terza regressione Terra](gpt-terza-regressione/followup-summary.json) termina con
27/36 pass automatici, su 18 casi ripetuti due volte. I fail sono #15 run2,
#24 entrambi, #37 entrambi, #40 entrambi, #59 run1 e #63 run1. La rilettura conserva
inoltre il rilievo sui gerundi iniziali etichettati «in coda» nei due pass di #34.

Il [controllo mirato Sol](gpt-sol-controllo/control-summary.json), sulla stessa
candidata e sui casi #15, #24, #34, #37 e #40, termina con 4/10 pass: #15 e #34
superati due volte. [Luna concorda sui dieci pass/fail](gpt-sol-controllo/control-crosscheck-summary.json),
ma non è una conferma di tutte le motivazioni. Per esempio, in #40 run2 sostiene
che manchi l'arrivo degli studenti prima dell'apertura: la frase è invece presente.
In #40 run1 giudica una perdita la rimozione della cornice digitale, senza rilevare
i tic rimasti. Quelle motivazioni non sono accettate dalla rilettura, né riscritte
negli artefatti per far apparire migliore il controllo.

La candidata finale distingue l'adattamento richiesto della persona grammaticale
dall'invenzione di esperienze e include esplicitamente, nel formato di consegna,
la nota sulle uniformazioni fra estratti. Lo snapshot finale corrisponde ai sorgenti:

- `SKILL.md`: `2d0390a07c8e2f7c367bed5eba7b3199660de9f590966d384f95d637faff1322`;
- single-file: `0d17fbc28b5cf6848bef3dc19e91c33716f639443f41247434d40a645f1e01b6`.

Il [controllo finale Sol](gpt-candidata-finale/control-summary.json) usa #6, #11, #15, #24, #34, #37, #40, #44, #55, #59 e #63,
due volte, e ottiene **18/22 pass automatici**. Non si somma alle prove precedenti.
La voce richiesta (#24) e la nota con punteggiatura uniforme (#37) passano due volte;
anche la rilettura conferma gli interventi. #11, #15 e #59 restano invariati; #63
converte soltanto le virgolette. #55 conserva ruolo, canale, proprietà e frequenza.

Restano quattro output non conformi: #6 run1 mantiene formule generiche; #40
conserva in entrambe le prove strutture che doveva sciogliere; #44 run2 attenua
«limita la carriera» in «può limitare la carriera». In #44 entrambi gli output
rifiutano le statistiche inventate, ma questo non rende corretta l'attenuazione.
Questi rilievi restano aperti: non si dichiara concluso l'audit né affidabilità generale.

Il [controllo finale Luna](gpt-candidata-finale/control-crosscheck-summary.json)
ottiene 20/22, con accordo binario su 20/22 verdetti Sol. Le divergenze sono #40 run2
e #44 run2, promossi da Luna: la rilettura conferma invece i due fail Sol. Nel primo
rimangono la coppia concessiva e la chiusura-pivot; nel secondo la modalità è attenuata.
Il 20/22 di Luna non è dunque assunto come conteggio delle risposte corrette.

Controlli locali conclusi: 53 test superati; suite 66 casi, split 60 dev/6 held-out
invariato; description di 853 caratteri; versioni coerenti; single-file e pacchetto
rigenerati; controllo del sito e `git diff --check` superati. I tre file preesistenti
del kit cieco conservano le impronte rilevate prima del lavoro. Non sono stati
eseguiti commit o push di questo seguito e non è stata pubblicata una nuova versione.

Le selezioni successive sono diagnostiche e guidate dagli errori osservati, non
un benchmark indipendente o un confronto causale fra modelli. Il primo giudice
del controllo Sol usa lo stesso modello dell'editor; Luna e la rilettura aggiungono
verifiche, non una valutazione umana indipendente. Nessuno di questi risultati
cambia la decisione sulla candidata compatta testata.
