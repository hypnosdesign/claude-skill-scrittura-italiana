#!/usr/bin/env python3
"""
build-demo-gif.py — Genera le GIF demo "stile chat" per il README.

Tre scene, stesso layout chat (l'utente incolla, la skill *digita* la risposta):
  1. demo-umanizza.gif — un testo che "sa di AI" → versione umana (de-slop).
  2. demo-registro.gif — una chat informale lasciata com'è (niente ipercorrezione).
  3. demo-lingua.gif   — un dubbio di lingua risolto con regola + esempio.

Le risposte usano SOLO ciò che è nell'input (nessuna invenzione): le demo
rispettano il contratto di conservazione della skill stessa.

Output: assets/demo-*.gif (+ anteprima PNG dell'ultimo frame in /tmp).
Richiede Pillow. ⚠️ Rigenerare solo se si cambiano testi/colori.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent
ASSETS = BASE / "assets"

W, H = 1000, 600
MARGIN = 64

BG     = (0x16, 0x12, 0x0E)
PANEL  = (0x20, 0x1A, 0x14)
PANEL2 = (0x26, 0x20, 0x18)
LINE   = (0x35, 0x2D, 0x24)
INK    = (0xEC, 0xE6, 0xDE)
MUTED  = (0x9A, 0x8F, 0x82)
FAINT  = (0x6E, 0x64, 0x59)
RED    = (0xF0, 0x6A, 0x5B)
GREEN  = (0x57, 0xC9, 0x8B)
GREEN_DIM = (0x2C, 0x55, 0x40)
DOTS   = ((0xF0, 0x6A, 0x5B), (0xE3, 0xB3, 0x41), (0x57, 0xC9, 0x8B))
COL    = {None: INK, "r": RED, "g": GREEN}

SANS = "/System/Library/Fonts/SFNS.ttf"
MONO = "/System/Library/Fonts/Monaco.ttf"
CLOSERS = set(".,;:!?)»")  # niente spazio prima di questi


def font(path, size, bold=False):
    f = ImageFont.truetype(path, size)
    if bold:
        try:
            f.set_variation_by_name("Bold")
        except Exception:
            pass
    return f


f_title = font(SANS, 25, bold=True)
f_sub   = font(SANS, 16)
f_label = font(MONO, 16)
f_body  = font(SANS, 26)
f_note  = font(MONO, 17)

# --- scene -------------------------------------------------------------------
SCENES = [
    {
        "out": "demo-umanizza.gif",
        "sub": "incolla un testo, ottieni la versione umana",
        "user": [
            ("Il nostro servizio ", None), ("si configura come ", "r"),
            ("una soluzione innovativa che rivoluziona il modo di lavorare, ", None),
            ("automatizzando ", "r"),
            ("la gestione degli ordini dal carrello alla spedizione e ", None),
            ("offrendo efficienza, flessibilità e scalabilità", "r"), (". ", None),
            ("Il futuro si prospetta indubbiamente brillante.", "r"),
        ],
        "reply": [("Il servizio automatizza la gestione degli ordini, dal carrello alla spedizione.", None)],
        "note": "via perifrasi · gerundite · triade · chiusura vuota — il fatto resta",
    },
    {
        "out": "demo-registro.gif",
        "sub": "riconosce il registro: non ipercorregge",
        "user": [
            ("raga stasera non ce la faccio a finire il pezzo... ", None), ("e'", "g"),
            (" un casino, ", None), ("perche", "g"),
            (" ho avuto mille cose. lo mando domani presto, giuro", None),
        ],
        "reply": [
            ("Va bene così. In chat ", None), ("«e'», «perche»", "g"),
            (" e i puntini sono convenzioni da tastiera, non errori.", None),
        ],
        "note": "registro non controllato · niente ipercorrezione",
    },
    {
        "out": "demo-lingua.gif",
        "sub": "anche i dubbi di lingua: regola ed esempio",
        "user": [("qual è o qual'è?", None)],
        "reply": [
            ("Qual è", "g"),
            (", sempre senza apostrofo: «qual» è un troncamento, non un'elisione. Mai ", None),
            ("qual'è", "r"), (".", None),
        ],
        "note": "regola + esempio — è anche un consulente di lingua",
    },
]


def to_tokens(chunks):
    out = []
    for text, c in chunks:
        for w in text.split(" "):
            if w:
                out.append((w, c))
    return out


def wrap(tokens, fnt, max_w, space):
    lines, cur, cur_w = [], [], 0
    for word, c in tokens:
        ww = fnt.getlength(word)
        add = ww if (not cur or word[:1] in CLOSERS) else space + ww
        if cur and cur_w + add > max_w:
            lines.append(cur); cur, cur_w = [], 0
            add = ww
        cur.append((word, c)); cur_w += add
    if cur:
        lines.append(cur)
    return lines


def avatar(d, x, y, color, ring):
    d.ellipse([x, y, x + 22, y + 22], outline=ring, width=2)
    d.ellipse([x + 6, y + 6, x + 16, y + 16], fill=color)


def draw_lines(d, lines, x0, y0, space, lh, cursor=False):
    ty = y0
    for li, line in enumerate(lines):
        tx = x0
        for j, (word, c) in enumerate(line):
            if j > 0 and word[:1] not in CLOSERS:
                tx += space
            d.text((tx, ty), word, font=f_body, fill=COL[c])
            ww = f_body.getlength(word)
            if c:
                d.line([tx, ty + 31, tx + ww, ty + 31], fill=COL[c], width=2)
            tx += ww
        if cursor and li == len(lines) - 1:
            d.rectangle([tx + 2, ty + 3, tx + 5, ty + 30], fill=GREEN)
        ty += lh
    return ty


def render(scene, n_reply, show_note, cursor, dots):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    for i, c in enumerate(DOTS):
        d.ellipse([MARGIN + i * 22, 38, MARGIN + i * 22 + 13, 51], fill=c)
    d.text((MARGIN + 86, 33), "scrittura-italiana", font=f_title, fill=INK)
    d.text((MARGIN + 88, 66), scene["sub"], font=f_sub, fill=MUTED)
    d.line([MARGIN, 104, W - MARGIN, 104], fill=LINE, width=1)

    body_x = MARGIN + 44
    max_w = (W - MARGIN) - body_x - 24
    space = f_body.getlength(" ")
    lh = 38

    # utente
    uy = 132
    avatar(d, MARGIN, uy + 2, MUTED, FAINT)
    d.text((body_x, uy), "tu", font=f_label, fill=MUTED)
    uy += 30
    ulines = wrap(to_tokens(scene["user"]), f_body, max_w, space)
    ubh = len(ulines) * lh + 28
    d.rounded_rectangle([body_x - 16, uy - 8, W - MARGIN, uy + ubh - 12], radius=14, fill=PANEL)
    draw_lines(d, ulines, body_x, uy + 6, space, lh)

    # assistente
    ay = uy + ubh + 18
    avatar(d, MARGIN, ay + 2, GREEN, GREEN_DIM)
    d.text((body_x, ay), "scrittura-italiana", font=f_label, fill=GREEN)
    ay += 30
    rtokens = to_tokens(scene["reply"])
    shown = rtokens[:n_reply] if n_reply else []
    rlines = wrap(shown, f_body, max_w, space) or [[]]
    rbh = max(len(rlines), 1) * lh + 28
    d.rounded_rectangle([body_x - 16, ay - 8, W - MARGIN, ay + rbh - 12], radius=14, fill=PANEL2)
    if n_reply == 0:
        d.text((body_x, ay + 6), "sta scrivendo" + "." * dots, font=f_body, fill=MUTED)
    else:
        draw_lines(d, rlines, body_x, ay + 6, space, lh, cursor=cursor)

    if show_note:
        d.text((body_x, ay + rbh + 14), scene["note"], font=f_note, fill=GREEN)

    return img


def build(scene):
    frames, durations = [], []
    for dots in (1, 2, 3):
        frames.append(render(scene, 0, False, False, dots)); durations.append(360)
    total = len(to_tokens(scene["reply"]))
    for k in range(1, total + 1):
        frames.append(render(scene, k, False, True, 0)); durations.append(95)
    frames.append(render(scene, total, True, False, 0)); durations.append(2600)
    frames.append(render(scene, total, True, False, 0)); durations.append(700)

    out = ASSETS / scene["out"]
    pal = frames[-1].convert("P", palette=Image.ADAPTIVE, colors=128)
    pframes = [f.quantize(palette=pal, dither=Image.NONE) for f in frames]
    pframes[0].save(out, save_all=True, append_images=pframes[1:],
                    duration=durations, loop=0, optimize=True, disposal=2)
    frames[-2].save(f"/tmp/{scene['out'].replace('.gif', '')}.png")
    kb = out.stat().st_size / 1024
    print(f"  {scene['out']}: {len(pframes)} frame, {kb:.0f} KB")


def main():
    ASSETS.mkdir(exist_ok=True)
    print(f"Generate {W}x{H}:")
    for s in SCENES:
        build(s)


if __name__ == "__main__":
    main()
