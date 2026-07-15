# Contribuire a *scrittura-italiana*

Grazie per l'interesse. Questa skill vive dei contributi della community: nuovi pattern
dell'italiano generato da AI, precisazioni sulle regole di punteggiatura, esempi più chiari,
correzioni di refusi. *(Contributions welcome — guidelines below; English summary at the end.)*

## Cosa puoi contribuire

- **Nuovi pattern anti-AI** (`references/stile-naturale.md`): tic ricorrenti dell'italiano
  AI non ancora coperti, con parole-spia ed esempi *prima → dopo*.
- **Regole di punteggiatura** (`references/punteggiatura.md`): precisazioni, casi mancanti,
  esempi migliori. Sempre con fonte o uso attestato (vedi sotto).
- **Esempi** dimostrativi nel `README.md` o nei file di riferimento.
- **Correzioni**: refusi, link rotti, incoerenze tra `SKILL.md` e i riferimenti.

## Principî editoriali

Questa skill ha una linea precisa. Per restare coerenti:

1. **Precetti, non parafrasi.** Le regole sono operative e azionabili ("usa X quando…",
   "non mettere la virgola tra…"), non spiegazioni teoriche o storiche.
2. **Esempi brevi e originali.** Frasi minime che illustrano la regola. **Non** copiare passi
   estesi da libri o altre fonti protette: la skill è una rielaborazione, non un'antologia.
3. **Italiano, non inglese tradotto.** Gli esempi devono suonare come italiano vero.
4. **Niente regole inventate.** Per la punteggiatura, allineati a fonti autorevoli (Mortara
   Garavelli, Serianni, Treccani, Accademia della Crusca) o all'uso attestato, e **cita la
   fonte** nella PR. Per i pattern AI, porta almeno un esempio concreto reale.
5. **Coerenza interna.** Se aggiungi un pattern in `stile-naturale.md`, controlla che la
   numerazione e i rimandi in `SKILL.md` restino allineati.

## Come proporre una modifica

1. Apri prima una **issue** per modifiche non banali (nuove sezioni, cambi di struttura), così
   ne discutiamo l'inquadramento.
2. Fai un **fork** e lavora su un branch descrittivo (`pattern-doppi-spazi`, `virgola-vocativo`).
3. Mantieni le righe del Markdown entro ~90 caratteri, come il resto dei file.
4. Apri una **pull request** spiegando *cosa* cambi e *perché*, con la fonte se è una regola.

### Verifica rapida prima della PR

- I rimandi interni in `SKILL.md` puntano a file esistenti:
  ```bash
  grep -oE 'references/[a-z-]+\.md' SKILL.md | sort -u | while read r; do
    [ -f "$r" ] && echo "OK  $r" || echo "MANCANTE  $r"
  done
  ```
- Il frontmatter di `SKILL.md` è intatto (delimitatori `---`, campo `name`, `description`).
- Hai provato la modifica caricando la skill in Claude e verificando che si comporti come
  previsto su un testo di esempio.
- **Se hai modificato `SKILL.md` o un file in `references/`, rigenera la versione single-file:**
  ```bash
  python3 build-single-file.py
  ```
  e includi `scrittura-italiana-single-file.md` aggiornato nella PR (è un file generato, non
  va modificato a mano).

## Licenza dei contributi

Inviando un contributo accetti che venga rilasciato sotto **CC BY-SA 4.0**, la stessa licenza
del progetto. Non inviare materiale protetto da copyright altrui (testi di libri, articoli)
che non sia una tua rielaborazione originale o una citazione breve con fonte.

## Codice di condotta

Sii rispettoso e costruttivo. Le discussioni sulla lingua possono essere appassionate: porta
argomenti e fonti, non sentenze.

---

## In English

Contributions are welcome: new patterns of AI-generated Italian, punctuation refinements,
clearer examples, typo fixes. Keep rules **actionable** (precepts, not theory), examples
**short and original** (don't copy long passages from copyrighted sources), and **cite a
source** for any punctuation rule (Mortara Garavelli, Serianni, Treccani, Accademia della
Crusca, or attested usage). Open an issue first for non-trivial changes, then a pull request
explaining what and why. By contributing you agree to release your work under **CC BY-SA 4.0**.
