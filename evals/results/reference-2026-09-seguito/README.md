# Seguito dell'audit del 25 settembre 2026

Il seguito richiesto con Terra 5.6, Sol 6 e Luna 6 è nel [resoconto GPT](GPT.md).
I nuovi risultati non completano né correggono il tentativo Claude descritto qui sotto.

## Primo tentativo sui punti 4 e 5

`tentativo-4-5/` conserva la prima candidata estesa, prima delle correzioni su apostrofi,
markup e note. Skill SHA-256:
`86e39cbcce72d12ed19ee15850e68da07b503eb89579a5a0c8211b8ecc916feb`.

Erano previsti 12 casi per due ripetizioni. Il runner si è fermato al limite di sessione
del CLI: **8 verdetti validi (5 pass, 3 fail), un errore e 15 coppie non eseguite**.
I tre fail sono #15 run2 (backtick aggiunti) e #28 in entrambe le ripetizioni (apostrofo
valido convertito). Le virgolette curve in #28 sono state conservate, ma questo non
rende conformi le risposte. #58 run1 non ha prodotto un output dell'editor.

La rilettura ha inoltre trovato una nota falsa nel pass di #7 run1 («il soggetto è sempre
esplicito», mentre *invia* ha soggetto sottinteso). Il verdetto automatico è conservato,
ma non accettato come prova editoriale. Le cinque promozioni del giudice non sono quindi
cinque risposte integralmente corrette certificate dalla revisione.

Il 5/9 del riepilogo automatico include l'errore tecnico nel denominatore; non è il
risultato dell'intero piano. Il messaggio del provider indicava ripristino alle 18:30
(Europe/Rome). Non si sono convertiti errori o casi mancanti in successi.

Modelli effettivi degli otto casi validi: `claude-sonnet-5` e `claude-opus-5`.
Il modello assente nella chiamata fallita non è un fallback osservato verso un altro
modello. Gli snapshot di skill, suite e manifest sono stati verificati contro i metadati.
La candidata è stata poi modificata: questo tentativo resta storico, non va mescolato
con le prove della versione successiva.
