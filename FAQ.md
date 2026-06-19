# FAQ

![Version](https://img.shields.io/badge/version-2.12.2-blue.svg)

Domande ricorrenti su *scrittura-italiana*. Per esempi concreti vedi **[ESEMPI.md](ESEMPI.md)**.

### È un humanizer? Fa sembrare umano un testo scritto dall'AI?

Sì, è il suo gancio principale: incolli un testo che "sa di AI" e te lo restituisce naturale —
via perifrasi, gerundite, triadi, avverbi in *-mente*, trattini lunghi, antilingua, cliché,
chiusure ottimistiche vuote. La differenza con un humanizer qualsiasi: non fa
trova-e-sostituisci, **conosce l'italiano**, perciò te lo rende anche corretto (punteggiatura,
tipografia), chiaro ed efficace. Funziona anche su **testi tuoi**: lì fa da revisore che
*spiega* la regola, soprattutto quando parti da appunti o da una "brutta" stesa da un modello.

### Non è solo un correttore come quello di Word?

Fa molto di più. Un correttore vede refusi e accordi; questa skill lavora anche su punteggiatura
fine, registro, figure retoriche, ritmo, coesione lessicale e sui tic ricorrenti dell'italiano
generato dall'AI. E non riscrive di testa sua: la indirizzi tu, propone e spiega.

### Cosa copre, oltre a punteggiatura e anti-AI?

Tutto l'arco della scrittura. Oltre alla **costruzione del testo** (*dispositio*: come iniziare,
articolare e chiudere), all'**antilingua** (l'affettazione "all'italiana": *recarsi* per *andare*,
*criticità* per *problemi*) e a un repertorio di **frasi fatte e cliché**, dalla v2.4.0 ci sono:
**sintassi** (congiuntivo vs indicativo, *consecutio temporum*, periodo ipotetico, accordo del
participio); **coesione e coerenza** (il "filo" tra frasi e capoversi, i connettivi giusti);
**argomentazione** (costruire una tesi, riassumere); **divulgazione** (spiegare cose complesse:
numeri, termini tecnici, metafore esplicative); **narrativa** (l'idea, il punto di vista); e
**revisione** (trovare la parola giusta, limare a freddo). Insomma, dalla virgola all'architettura
del discorso. Distillata da una libreria di manuali italiani (Serianni, Mortara Garavelli, Giunta,
Pontiggia, Rigotti e altri).

### Non mi rende pigro o "incapace"?

È il contrario: per usarla bene devi capire *perché* qualcosa è un errore, e ogni correzione
arriva con la regola e la fonte (Mortara Garavelli, non un "secondo me"). È più vicina a un
tutor che a una stampella. E togliere la fatica meccanica dei soliti refusi serve proprio a
concentrarsi su struttura, ritmo e voce, dove «scrivere meglio» succede davvero.

### Non scambia un "tono da AI" con un altro "tono da AI"?

No: non impone uno stile. Rimuove errori e tic, e può **seguire la tua voce** se le dai un
campione del tuo modo di scrivere. Le scelte stilistiche volute restano tue.

### Mi corregge anche i messaggi informali (chat, social)?

No, se il registro è quello. La skill riconosce il **livello di controllo** del testo: nel
testo non controllato (web, chat, commenti) le convenzioni da tastiera — virgolette dritte,
accenti «da tastiera», niente caporali — non sono errori e non vengono toccate. Le norme
editoriali si applicano solo al testo controllato (o se le chiedi esplicitamente).

### Funziona con il mio assistente / in che lingua?

I contenuti sono in **italiano** (deve esserlo). Funziona con Claude Code, Claude Desktop,
claude.ai e gli altri agent compatibili con il formato Agent Skills (Cursor, Copilot…) via
`npx skills add hypnosdesign/claude-skill-scrittura-italiana`.

### Come la uso, in pratica?

Installala, poi chiedi a Claude di scrivere o correggere un testo — dicendo **se è tuo o
generato dall'AI** e **in che registro** (editoriale o informale). Se vuoi che mantenga la tua
voce, incolla un campione del tuo modo di scrivere.

### È gratis? Che licenza ha?

Sì, è gratis e open-source, sotto **CC BY-SA 4.0**: puoi usarla, modificarla e ridistribuirla
(anche per fini commerciali) citando la fonte e mantenendo la stessa licenza.

### Posso contribuire o proporre un manuale da «distillare»?

Sì, con piacere: pattern dell'italiano-AI mancanti, casi di punteggiatura, esempi migliori, o
manuali di riferimento da cui estrarre regole. Apri una issue o una pull request — vedi
**[CONTRIBUTING.md](CONTRIBUTING.md)**.
