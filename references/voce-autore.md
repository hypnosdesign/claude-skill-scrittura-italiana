# Profilare e mantenere la voce di un autore

Apri questa guida quando l'utente chiede una scheda di voce da riutilizzare o fornisce
più campioni per una riscrittura. Per un singolo adattamento breve bastano le dimensioni
in «Dare voce» di `references/stile-naturale.md`. La scheda serve a scegliere interventi
coerenti con un autore in un contesto preciso; il contenuto del nuovo testo viene dal
suo brief, non dai fatti raccontati nei campioni.

## 1. Delimitare i materiali

Identifica autore, destinazione e registro dei campioni. Se la stessa persona scrive
avvisi al pubblico e racconti, descrivi quei contesti separatamente. Non mediare le
due voci. Segnala l'eventuale intervento di altri editor o assistenti quando è noto;
non dedurre l'autenticità dalla forma del testo.

Distinguere **voce osservata** e **voce richiesta** cambia il lavoro. La prima descrive
i materiali disponibili. La seconda raccoglie le preferenze espresse dall'utente,
anche quando chiede di cambiare abitudini. Se dice «mantieni il mio stile ma elimina
gli incisi», registra sia gli incisi osservati sia la richiesta di ridurli.
Chiedi una precisazione soltanto quando questa distinzione modifica la consegna.

Un campione breve consente osservazioni circoscritte. Non descrivere un tratto come
stabile senza riscontri in passaggi o testi diversi. «Nessuna domanda nei due brani
letti» non significa «l'autore non usa mai domande». L'assenza osservata diventa una
preferenza da applicare soltanto se l'utente la conferma.

## 2. Preparare una scheda utilizzabile

La scheda distingue i seguenti elementi; usa solo quelli sostenuti dal materiale.

| Elemento | Cosa riportare |
|---|---|
| Campo d'uso | autore, destinatario, genere, registro e scopo |
| Materiali | nomi o etichette dei campioni, date se note, limiti della selezione |
| Conteggi disponibili | misura, unità, metodo e campione a cui si riferisce |
| Caratteristiche osservate | tratto, breve passo che lo mostra e sua posizione |
| Preferenze richieste | indicazioni dell'utente, distinte dalle abitudini osservate |
| Scelte operative | cosa conservare o modificare in questo genere di testo |

Per le osservazioni considera persona grammaticale, lessico, ritmo, incisi,
punteggiatura, aperture, chiusure e rapporto con il lettore. Non compilare tutte le
dimensioni per forza. Un conteggio deve essere realmente effettuato: non attribuire
al corpus medie, frequenze o percentuali stimate a impressione. Senza uno strumento
usa una descrizione qualitativa con un esempio, oppure dichiara il conteggio manuale
e la porzione esaminata.

Esempio originale, ricavato da due brevi avvisi:

> Materiali: avviso A «Il laboratorio apre alle nove. Portate il grembiule.»;
> avviso B «La sala chiude alle sei. Lasciate liberi i tavoli.»
> Osservazione: in entrambi, una frase dà l'orario e la successiva indica un'azione.
> Scelta operativa per altri avvisi: rendere riconoscibili orario e azione richiesta.
> Limite: questi due avvisi non descrivono lo stile dell'autore nella narrativa.

Consegna la scheda in chat quando è richiesta. Salvala in un file solo se l'utente
chiede di conservarla, scegliendo una destinazione che non sostituisca i campioni.
Per riutilizzarla basta fornirla insieme al nuovo brief; non richiede un'installazione
o una modifica delle istruzioni globali dell'assistente.

## 3. Applicare la scheda

Conserva le scelte d'autore documentate quando il livello di revisione le permette.
Un inciso o una formula ricorrente non va eliminato soltanto perché compare anche
nella prosa generata. La regolarità di un avviso può essere funzionale: non imporre
un'alternanza di frasi brevi e lunghe.

Le preferenze richieste valgono per il nuovo lavoro e non cambiano retroattivamente
la descrizione dei campioni. In proofread correggi solo gli errori autorizzati;
una scheda di voce non amplia il livello d'intervento. Le licenze narrative e le
convenzioni valide seguono la guardia di registro in `SKILL.md`.

Prima di consegnare controlla due aspetti separatamente: il testo conserva i fatti,
le condizioni e la modalità del brief? Le scelte di persona, ritmo e lessico sono
coerenti con la scheda e con le preferenze richieste? Non trasportare nel nuovo testo
aneddoti, opinioni, nomi o cifre presi dai campioni per riprodurne la voce.

## 4. Confronto facoltativo delle misure

Con Node.js 22 o successivo, lo strumento locale `scripts/confronta-voce.mjs` produce
JSON su standard output. Legge file `.txt`, `.md` o `.markdown`, oppure i file di
questi tipi presenti direttamente in una cartella. Non modifica i materiali.

```bash
node scripts/confronta-voce.mjs --campione campioni/ --registro newsletter
node scripts/confronta-voce.mjs --campione campioni/ --testo bozza.md --registro newsletter
```

Il primo comando descrive il campione; il secondo aggiunge le misure della bozza e
le differenze. Esegui il comando solo su richiesta di misura e con strumenti di
esecuzione disponibili. Il percorso dello script è relativo alla cartella della
skill; nel plugin corrisponde a `${CLAUDE_PLUGIN_ROOT}/scripts/confronta-voce.mjs`.
Se Node o lo script non sono disponibili, procedi con osservazioni documentate:
le altre funzioni della skill restano utilizzabili.

Lo strumento riporta lunghezze di frasi e capoversi, frequenze di punteggiatura,
domande e sequenze di parole ricorrenti. Registra versione del metodo e impronte
SHA-256 dei file; le differenze sono confrontabili soltanto con lo stesso metodo.
L'etichetta del registro è fornita dall'utente: lo script non verifica che tutti i
file appartengano davvero a quel registro. Usa raccolte coerenti e confronta testi
con funzione e dimensioni comparabili; una differenza può dipendere dall'argomento
o dal formato, non dalla voce.

Il conteggio è euristico: include i valori numerici come unità, conserva apostrofi
interni e forme flesse, non analizza la sintassi; abbreviazioni insolite possono
alterare i confini di frase. In Markdown
esclude titoli, blocchi e frammenti di codice, commenti HTML e destinazioni dei link.
Le righe consecutive formano un capoverso; gli elementi di elenco sono separati.
Un campione con poche frasi viene segnalato come breve, senza certificare la
rappresentatività degli altri campioni.

Leggi le differenze come domande da verificare: «la bozza contiene meno incisi;
è una scelta richiesta o abbiamo levigato la voce?». Nessun valore costituisce
un obiettivo obbligatorio, una prova di qualità o un rilevatore di autorialità.
Le ricorrenze possono dipendere dal lessico tecnico e vanno valutate nel contesto.
