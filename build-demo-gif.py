#!/usr/bin/env python3
"""
build-demo-gif.py — Genera la GIF "prima → dopo" per l'hero del README.

Mostra un testo che "sa di AI" (PRIMA) e la sua versione umana (DOPO), con un
crossfade in loop. Output: assets/prima-dopo.gif (+ due PNG di anteprima in /tmp).

Richiede Pillow (non è una dipendenza della skill):
    python3 -m venv /tmp/gifenv && /tmp/gifenv/bin/pip install Pillow
    /tmp/gifenv/bin/python build-demo-gif.py

⚠️ Rigenerare solo se si cambiano testo/colori della demo.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent
OUT = BASE / "assets" / "prima-dopo.gif"

W, H = 1000, 560
MARGIN = 64

# Palette (dark, caldo come gli screenshot dell'app)
BG       = (0x16, 0x12, 0x0E)
PANEL    = (0x20, 0x1A, 0x14)
INK      = (0xEC, 0xE6, 0xDE)
MUTED    = (0x9A, 0x8F, 0x82)
RED      = (0xF0, 0x6A, 0x5B)
RED_DIM  = (0x6E, 0x33, 0x2C)
GREEN    = (0x57, 0xC9, 0x8B)
GREEN_DIM= (0x2C, 0x55, 0x40)
DOT_R, DOT_Y, DOT_G = (0xF0,0x6A,0x5B), (0xE3,0xB3,0x41), (0x57,0xC9,0x8B)


def font(path, size, bold=False):
    f = ImageFont.truetype(path, size)
    if bold:
        try:
            f.set_variation_by_name("Bold")
        except Exception:
            pass
    return f

SANS = "/System/Library/Fonts/SFNS.ttf"
MONO = "/System/Library/Fonts/Monaco.ttf"
f_title  = font(SANS, 26, bold=True)
f_sub    = font(SANS, 17)
f_pill   = font(MONO, 17)
f_body   = font(SANS, 31)
f_cap    = font(MONO, 16)


def wrap(tokens, fnt, max_w, space):
    """tokens: list[(word, highlight)]. Ritorna righe: list[list[(word,hl)]]."""
    lines, cur, cur_w = [], [], 0
    for word, hl in tokens:
        ww = fnt.getlength(word)
        add = ww if not cur else space + ww
        if cur and cur_w + add > max_w:
            lines.append(cur); cur, cur_w = [], 0
            add = ww
        cur.append((word, hl)); cur_w += add
    if cur:
        lines.append(cur)
    return lines


def tokens(chunks):
    """chunks: list[(text, highlight)] -> list[(word, highlight)]."""
    out = []
    for text, hl in chunks:
        for w in text.split(" "):
            if w:
                out.append((w, hl))
    return out


def render(state):
    accent     = RED if state == "prima" else GREEN
    accent_dim = RED_DIM if state == "prima" else GREEN_DIM
    pill_txt   = "PRIMA · sa di AI" if state == "prima" else "DOPO · suona umano"
    if state == "prima":
        chunks = [
            ("Il nostro servizio ", False),
            ("si configura come ", True),
            ("una soluzione innovativa che rivoluziona il modo di lavorare, ", False),
            ("offrendo ", True),
            ("efficienza, flessibilità e scalabilità", True),
            (". ", False),
            ("Il futuro si prospetta indubbiamente brillante.", True),
        ]
        caption = "perifrasi · triadi · gerundite · chiusure vuote"
    else:
        chunks = [
            ("Il nostro servizio automatizza la gestione degli ordini, dal "
             "carrello alla spedizione. Chi l'ha provato ", False),
            ("in beta ha tagliato di un terzo", True),
            (" il tempo speso a inserire dati a mano.", False),
        ]
        caption = "fatti concreti · una voce · ritmo"

    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # window chrome
    for i, c in enumerate((DOT_R, DOT_Y, DOT_G)):
        d.ellipse([MARGIN + i*22, 40, MARGIN + i*22 + 13, 53], fill=c)
    d.text((MARGIN + 86, 36), "scrittura-italiana", font=f_title, fill=INK)
    d.text((MARGIN + 88, 70), "l'humanizer italiano con i superpoteri", font=f_sub, fill=MUTED)

    # pill
    py = 116
    pw = f_pill.getlength(pill_txt) + 36
    d.rounded_rectangle([MARGIN, py, MARGIN + pw, py + 34], radius=17, fill=accent_dim)
    d.ellipse([MARGIN + 14, py + 13, MARGIN + 22, py + 21], fill=accent)
    d.text((MARGIN + 30, py + 7), pill_txt, font=f_pill, fill=INK)

    # panel + body
    bx0, by0, bx1, by1 = MARGIN, 176, W - MARGIN, H - 96
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=18, fill=PANEL)
    pad = 34
    max_w = (bx1 - bx0) - 2*pad
    space = f_body.getlength(" ")
    lines = wrap(tokens(chunks), f_body, max_w, space)
    lh = 46
    ty = by0 + pad + 6
    for line in lines:
        tx = bx0 + pad
        for word, hl in line:
            col = accent if hl else INK
            d.text((tx, ty), word, font=f_body, fill=col)
            ww = f_body.getlength(word)
            if hl:
                d.line([tx, ty + 40, tx + ww, ty + 40], fill=accent, width=2)
            tx += ww + space
        ty += lh

    # caption
    d.text((MARGIN, H - 60), caption, font=f_cap, fill=accent)
    return img


def main():
    OUT.parent.mkdir(exist_ok=True)
    a, b = render("prima"), render("dopo")
    a.save("/tmp/prima.png"); b.save("/tmp/dopo.png")

    frames, durations = [], []
    XF = 9  # frame di crossfade
    frames.append(a); durations.append(2100)
    for i in range(1, XF):
        frames.append(Image.blend(a, b, i / XF)); durations.append(45)
    frames.append(b); durations.append(2500)
    for i in range(1, XF):
        frames.append(Image.blend(b, a, i / XF)); durations.append(45)

    # palette condivisa (dal frame di crossfade più ricco di colori) per evitare flicker
    pal = Image.blend(a, b, 0.5).convert("P", palette=Image.ADAPTIVE, colors=128)
    pframes = [f.quantize(palette=pal, dither=Image.NONE) for f in frames]
    pframes[0].save(
        OUT, save_all=True, append_images=pframes[1:], duration=durations,
        loop=0, optimize=True, disposal=2,
    )
    kb = OUT.stat().st_size / 1024
    print(f"Generato {OUT.relative_to(BASE)}: {len(pframes)} frame, {W}x{H}, {kb:.0f} KB")
    print("Anteprime: /tmp/prima.png  /tmp/dopo.png")


if __name__ == "__main__":
    main()
