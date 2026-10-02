#!/usr/bin/env python3
"""Derive sanitized UI crops from the supplied real app captures.

Input  : reels/assets/ui/home_capture.webp (2000x1245, real home screen capture)
Output : reels/assets/derived/*.png

Every personal / numeric / schedule element that the brief forbids
(coin counts, attendance count, dates, class times, instructor photos and
names, participation condition, "1회 완료" round label, characters, account
avatar) is blurred or removed. Only the elements the cuts actually need stay
sharp: the bottom module tab bar (minus the account avatar), the 시간표 button
and the 오늘의 대치 라이브 card (with its coin badges and time-condition label
masked).
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets/ui/home_capture.webp"
OUT = ROOT / "assets/derived"
OUT.mkdir(parents=True, exist_ok=True)

home = Image.open(SRC).convert("RGB")
W, H = home.size
assert (W, H) == (2000, 1245), (W, H)

# ---------------------------------------------------------------- live card
# Card outer box measured from the capture: x 1253..1831, y 639..1066, r~34, border ~8px
CX0, CY0, CX1, CY1, CR, CB = 1253, 639, 1832, 1067, 34, 8
BORDER = (121, 173, 7)
CARD_BG = (195, 239, 112)

card = home.crop((CX0, CY0, CX1, CY1)).convert("RGBA")
cw, ch = card.size
d = ImageDraw.Draw(card)
# A clean card frame (border + flat background) used to rebuild masked areas
patch = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
pd = ImageDraw.Draw(patch)
pd.rounded_rectangle((0, 0, cw - 1, ch - 1), radius=CR, fill=BORDER + (255,))
pd.rounded_rectangle((CB, CB, cw - 1 - CB, ch - 1 - CB), radius=CR - CB, fill=CARD_BG + (255,))


def rebuild(region):
    """Replace a region with the clean frame and feather its inner seams."""
    card.paste(patch.crop(region), region[:2])
    x0, y0, x1, y1 = region
    if x0 > 0:
        s = card.crop((x0 - 6, y0, x0 + 6, y1)).filter(ImageFilter.GaussianBlur(2))
        card.paste(s, (x0 - 6, y0))
    if x1 < cw:
        s = card.crop((x1 - 6, y0, x1 + 6, y1)).filter(ImageFilter.GaussianBlur(2))
        card.paste(s, (x1 - 6, y0))
    s = card.crop((max(x0, CB), y1 - 6, min(x1, cw - CB), y1 + 6)).filter(ImageFilter.GaussianBlur(2))
    card.paste(s, (max(x0, CB), y1 - 6))


# 1) "20분 이상 참여" (participation-time condition tab) -> removed
rebuild((0, 0, 1428 - CX0, 714 - CY0))
rebuild((1428 - CX0, 0, 1468 - CX0, 702 - CY0))
# 2) coin badges (coin amount "100") -> removed, corner rebuilt
rebuild((1655 - CX0, 0, cw, 726 - CY0))
# 3) unify the 1px anti-aliased top edge of the original border
card.paste(patch.crop((CR, 0, cw - CR, 3)), (CR, 0))
# 4) transparent outside the rounded card outline
mask = Image.new("L", (cw * 4, ch * 4), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw * 4 - 1, ch * 4 - 1), radius=CR * 4, fill=255)
mask = mask.resize((cw, ch), Image.LANCZOS)
card.putalpha(mask)
card.save(OUT / "live_card_masked.png")

# --------------------------------------------------------- sanitized home
blur = home.filter(ImageFilter.GaussianBlur(18))
veil = Image.new("RGB", (W, H), (255, 255, 255))
frosted = Image.blend(blur, veil, 0.38)

san = frosted.copy()
# bottom module tab bar stays sharp (module names/icons only)
TAB_Y = 1119
san.paste(home.crop((0, TAB_Y, W, H)), (0, TAB_Y))
# ... except the 마이페이지 avatar icon (may be an account avatar / character)
av = (1780, 1130, 1900, 1206)
san.paste(frosted.crop(av).filter(ImageFilter.GaussianBlur(6)), av[:2])
# 시간표 button stays sharp (no date: the date text left of it stays blurred)
tt = (1776, 136, 1928, 204)
san.paste(home.crop(tt), tt[:2])
# masked live card stays sharp
san.paste(card, (CX0, CY0), card)
san.save(OUT / "home_sanitized.png")

# ------------------------------------------------------------- small crops
home.crop((268, 1124, 452, 1245)).save(OUT / "tab_gv_writing.png")   # icon + "GV 라이팅" label
home.crop((318, 1132, 406, 1208)).save(OUT / "icon_gv_writing.png")  # icon only
home.crop(tt).save(OUT / "btn_timetable.png")                         # "시간표" button
print("ok", [p.name for p in sorted(OUT.iterdir())])
