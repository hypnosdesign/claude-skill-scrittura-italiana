#!/usr/bin/env python3
"""
build-single-file.py — Genera `scrittura-italiana-single-file.md`.

Concatena SKILL.md + i file in references/ in un unico documento, pensato per gli
assistenti che NON supportano il formato Agent Skills (app Gemini come istruzioni di un
Gem, Custom GPT di ChatGPT, ecc.), dove i `references/` non si caricano separatamente.

I rimandi interni del tipo `references/x.md` vengono convertiti in rimandi alle Parti
(Parte A/B/C/…) così il documento resta coerente da solo.

Uso:
    python3 build-single-file.py

⚠️ Rigenerare a ogni modifica di SKILL.md o di references/.
"""

import re
from pathlib import Path

BASE = Path(__file__).resolve().parent
OUT = BASE / "scrittura-italiana-single-file.md"

# (file in references/, titolo della Parte, etichetta per i rimandi interni)
PARTS = [
    ("punteggiatura.md",              "Parte A — Punteggiatura e tipografia",          "Parte A"),
    ("dubbi-e-errori.md",             "Parte B — Dubbi e errori comuni",               "Parte B"),
    ("retorica-efficacia.md",         "Parte C — Scrivere con efficacia (retorica)",   "Parte C"),
    ("coesione-e-connettivi.md",      "Parte D — Coesione e connettivi",               "Parte D"),
    ("stile-naturale.md",             "Parte E — Stile naturale (anti-AI)",            "Parte E"),
    ("cliche-e-parole-alla-moda.md",  "Parte F — Cliché e parole alla moda",           "Parte F"),
    ("spiegare-con-chiarezza.md",     "Parte G — Spiegare con chiarezza (divulgare)",  "Parte G"),
    ("narrativa.md",                  "Parte H — Narrativa",                           "Parte H"),
    ("revisione-e-proprieta.md",      "Parte I — Revisione e proprietà della parola",  "Parte I"),
]

INTRO = """# scrittura-italiana — versione in un solo file

> **Cos'è.** È la skill *scrittura-italiana* (SKILL.md + i suoi 9 riferimenti) raccolta in un
> unico documento, per gli assistenti che **non** supportano il formato Agent Skills e quindi
> non caricano i file `references/` separati: app Gemini (come istruzioni di un *Gem*), Custom
> GPT di ChatGPT, ecc.
>
> **Come usarla.** Incolla questo intero file nelle istruzioni di sistema del tuo assistente
> (o caricalo come file di conoscenza). Su Claude (Code, Desktop, claude.ai) usa invece la
> skill vera e propria — vedi il [repository](https://github.com/hypnosdesign/claude-skill-scrittura-italiana).
>
> *Generato da `SKILL.md` + `references/` con `build-single-file.py`. Rigenerare quando la
> skill cambia.* Licenza CC BY-SA 4.0."""


def build() -> str:
    # SKILL.md senza frontmatter YAML e senza la nota "apri il file di riferimento"
    skill = (BASE / "SKILL.md").read_text(encoding="utf-8")
    skill_body = re.sub(r"^---\n.*?\n---\n", "", skill, count=1, flags=re.DOTALL).strip()
    skill_body = re.sub(
        r"> \*\*Leggi i file di riferimento.*?riferimento pertinente\.\n",
        "", skill_body, flags=re.DOTALL,
    )

    out = [INTRO, "\n\n---\n\n" + skill_body]
    for fname, title, _ in PARTS:
        body = (BASE / "references" / fname).read_text(encoding="utf-8").strip()
        body = re.sub(r"^#\s+.*\n", "", body, count=1)  # togli l'H1 originale del reference
        out.append(f"\n\n---\n\n# {title}\n\n{body.strip()}")

    doc = "".join(out)

    # Converte i rimandi ai file in rimandi interni alle Parti (con/senza backtick e prefisso)
    for fname, _, label in PARTS:
        doc = doc.replace(f"`references/{fname}`", f"**{label}**")
        doc = doc.replace(f"references/{fname}", label)
        doc = doc.replace(f"`{fname}`", f"**{label}**")
        doc = doc.replace(fname, label)

    return re.sub(r"\n{4,}", "\n\n\n", doc).strip() + "\n"


def main():
    doc = build()
    OUT.write_text(doc, encoding="utf-8")
    residui = len(re.findall(r"(punteggiatura|dubbi-e-errori|retorica-efficacia|coesione-e-connettivi|stile-naturale|cliche-e-parole-alla-moda|spiegare-con-chiarezza|narrativa|revisione-e-proprieta)\.md", doc))
    h1 = len(re.findall(r"^# ", doc, flags=re.M))
    print(f"Generato {OUT.name}: {h1} titoli H1, {len(doc):,} caratteri, rimandi a file residui: {residui}")
    if residui:
        print("⚠️  Attenzione: rimasti rimandi a file .md non convertiti.")


if __name__ == "__main__":
    main()
