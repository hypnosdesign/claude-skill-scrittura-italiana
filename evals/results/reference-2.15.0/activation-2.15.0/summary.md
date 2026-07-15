# Attivazione e instradamento — client reale
model=claude-sonnet-5 · cli=2.1.210 (Claude Code) · skill sha256=2012445cecbe · git=71f44da

- **Attivazione (positivi):** 2/2 (100%)
- **Attivazioni spurie (negativi):** n/d
- **Routing — skill attiva:** 5/6 (83%) · **riferimento atteso aperto:** 3/6 (50%)
- errori harness: 0 · costo API dichiarato: $1.6015

| caso | skill | riferimenti letti | atteso | hit |
|---|---|---|---|---|
| 31 | ✔ | stile-naturale | stile-naturale | ✔ |
| 32 | ✔ | — | dubbi-e-errori | ✘ |
| 33 | ✔ | punteggiatura | punteggiatura | ✔ |
| 34 | ✔ | — | retorica-efficacia o stile-naturale | ✘ |
| 35 | ✘ | — | spiegare-con-chiarezza | ✘ |
| 36 | ✔ | narrativa | narrativa | ✔ |