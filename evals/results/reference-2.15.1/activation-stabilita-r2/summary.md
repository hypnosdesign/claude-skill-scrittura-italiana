# Attivazione e instradamento — client reale
model=claude-sonnet-5 · cli=2.1.210 (Claude Code) · skill sha256=b1abb957646c · git=a1c1958

- **Attivazione (positivi):** n/d
- **Attivazioni spurie (negativi):** n/d
- **Routing — skill attiva:** 4/6 (67%) · **riferimento atteso aperto:** 4/6 (67%)
- errori harness: 0 · costo API dichiarato: $1.6501

| caso | skill | riferimenti letti | atteso | hit |
|---|---|---|---|---|
| 31 | ✔ | stile-naturale | stile-naturale | ✔ |
| 32 | ✔ | dubbi-e-errori, cliche-e-parole-alla-moda | dubbi-e-errori | ✔ |
| 33 | ✔ | punteggiatura | punteggiatura | ✔ |
| 34 | ✘ | — | retorica-efficacia o stile-naturale | ✘ |
| 35 | ✘ | — | spiegare-con-chiarezza | ✘ |
| 36 | ✔ | narrativa, retorica-efficacia | narrativa | ✔ |