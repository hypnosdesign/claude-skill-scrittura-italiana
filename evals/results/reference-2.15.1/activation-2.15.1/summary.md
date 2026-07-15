# Attivazione e instradamento — client reale
model=claude-sonnet-5 · cli=2.1.210 (Claude Code) · skill sha256=b1abb957646c · git=d4934d6

- **Attivazione (positivi):** 2/2 (100%)
- **Attivazioni spurie (negativi):** n/d
- **Routing — skill attiva:** 6/6 (100%) · **riferimento atteso aperto:** 6/6 (100%)
- errori harness: 0 · costo API dichiarato: $2.4877

| caso | skill | riferimenti letti | atteso | hit |
|---|---|---|---|---|
| 31 | ✔ | stile-naturale | stile-naturale | ✔ |
| 32 | ✔ | dubbi-e-errori, cliche-e-parole-alla-moda | dubbi-e-errori | ✔ |
| 33 | ✔ | punteggiatura | punteggiatura | ✔ |
| 34 | ✔ | retorica-efficacia | retorica-efficacia o stile-naturale | ✔ |
| 35 | ✔ | spiegare-con-chiarezza | spiegare-con-chiarezza | ✔ |
| 36 | ✔ | narrativa | narrativa | ✔ |