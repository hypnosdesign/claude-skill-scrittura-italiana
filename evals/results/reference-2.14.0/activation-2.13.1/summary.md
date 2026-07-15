# Attivazione e instradamento — client reale
model=claude-sonnet-5 · cli=2.1.210 (Claude Code) · skill sha256=79beec47c25e · git=af735a5

- **Attivazione (positivi):** 16/18 (89%)
- **Attivazioni spurie (negativi):** 0/10 (0%)
- **Routing — skill attiva:** 5/6 (83%) · **riferimento atteso aperto:** 3/6 (50%)
- errori harness: 2 · costo API dichiarato: $5.7212

| caso | skill | riferimenti letti | atteso | hit |
|---|---|---|---|---|
| 31 | ✔ | stile-naturale | stile-naturale | ✔ |
| 32 | ✔ | — | dubbi-e-errori | ✘ |
| 33 | ✔ | punteggiatura | punteggiatura | ✔ |
| 34 | ✔ | — | retorica-efficacia o stile-naturale | ✘ |
| 35 | ✘ | — | spiegare-con-chiarezza | ✘ |
| 36 | ✔ | narrativa | narrativa | ✔ |