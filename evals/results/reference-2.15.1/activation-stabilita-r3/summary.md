# Attivazione e instradamento — client reale
model=claude-sonnet-5 · cli=2.1.210 (Claude Code) · skill sha256=b1abb957646c · git=a1c1958

- **Attivazione (positivi):** n/d
- **Attivazioni spurie (negativi):** n/d
- **Routing — skill attiva:** 5/6 (83%) · **riferimento atteso aperto:** 4/6 (67%)
- errori harness: 1 · costo API dichiarato: $1.6309

| caso | skill | riferimenti letti | atteso | hit |
|---|---|---|---|---|
| 31 | ✔ | stile-naturale | stile-naturale | ✔ |
| 32 | ✔ | — | dubbi-e-errori | ✘ |
| 33 | ✔ | punteggiatura | punteggiatura | ✔ |
| 34 | ✔ | retorica-efficacia, cliche-e-parole-alla-moda | retorica-efficacia o stile-naturale | ✔ |
| 35 | ✘ | — | spiegare-con-chiarezza | ✘ |
| 36 | ✔ | narrativa, retorica-efficacia | narrativa | ✔ |