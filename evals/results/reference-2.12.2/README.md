# Snapshot storico 2.12.2

Questa directory conserva i quattro run che sostengono i conteggi pubblicati in
`../REFERENCE.md`: esecuzione completa candidata/baseline e tre repliche aggiuntive
dei casi 7, 8, 12 e 13.

È una **prova storica incompleta**, non un benchmark conforme al runner 2.13.0:

- la candidata era una working tree non committata sopra `72655ae`;
- il campo `sha` registra l'HEAD del repository, non l'hash del file skill iniettato;
- candidato e baseline riportano quindi lo stesso SHA, benché la baseline provenga da
  `/tmp/skill-2.11.0.md`;
- i record non includono snapshot di skill/suite, prompt del giudice o hash dei contenuti;
- tutti i casi erano di sviluppo e editor e giudice usavano entrambi `sonnet`;
- la dichiarata ri-misura post-fix del caso 7 (**3/3**) non fu persistita e non è
  verificabile da questi file.

I dati sono versionati per consentire il controllo dei conteggi realmente disponibili,
non per promuoverli retroattivamente a prova riproducibile.
