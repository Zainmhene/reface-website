"""Remake every Colour Studio photo from the sharpened sources.
Each colour gets: wide 1600 + 900 (computers/tablets) and square sq-1080 + sq-600 (phones),
the square ones cut around the same spot the phone layout shows (object-position).

Run from the repo root (needs Python 3 with Pillow and numpy):
    python3 tools/images/make_studio.py "<sources folder>" assets/img/studio [hero kitchen bedroom bathroom]
The sources folder is "2 Colour Studio sources (sharpened)" from the Reface project files: four photos whose
names start with Shaker, Handleless, Bedroom and Bathroom. Name sets at the end to make only those rooms."""
import sys, os
import numpy as np
from PIL import Image, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
only = sys.argv[3:]  # optional: names of sets to make
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import recolour as _rc
ns = vars(_rc)

def source(word):
    for f in sorted(os.listdir(SRC)):
        if f.lower().startswith(word.lower()) and f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            return os.path.join(SRC, f)
    raise SystemExit(f"No source photo starting with '{word}' in {SRC}")
make_mask = ns["make_mask"]
s2l, l2s, hex2rgb = ns["s2l"], ns["l2s"], ns["hex2rgb"]
LUMA = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)

def blur(a, r):
    """Fast near-Gaussian blur of a 2D float array (three box blurs)."""
    for _ in range(3):
        for ax in (0, 1):
            c = np.cumsum(np.pad(a, [(r + 1, r)] * 1 + [(0, 0)] if ax == 0 else [(0, 0), (r + 1, r)], mode="edge"), axis=ax)
            a = ((c[2 * r + 1:] - c[:-2 * r - 1]) if ax == 0 else (c[:, 2 * r + 1:] - c[:, :-2 * r - 1])) / (2 * r + 1)
    return a

def recolour(rgb, mask, target_hex, ref_y=None):
    """Swap the door colour, keeping the photo's light and shade.
    The original doors are dark blue, so their shading and grain are strong. Copied 1:1 onto a light
    colour that looks dirty and blotchy, so the lighter the new colour, the more the shading (broad
    light and shadow) and especially the texture (grain, noise) are softened."""
    lin = s2l(rgb)
    Y = np.maximum(lin @ LUMA, 1e-4)
    if ref_y is None:
        ref_y = float(np.median(Y[mask > 0.6]))
    T = s2l(hex2rgb(target_hex)); Yt = float(T @ LUMA)
    L = np.log(Y / ref_y)
    low = blur(L, 6)               # broad light and shadow
    high = np.clip(L - low, -1, 1) # grain and fine detail
    t = float(np.clip((Yt - 0.10) / 0.70, 0, 1))
    a, b = 1 - 0.5 * t, 1 - 0.72 * t
    rel = np.exp(np.clip(a * low, -3, 1.2) + b * high)
    new = T * rel[..., None]
    k = 0.82
    new = np.where(new > k, k + (1 - k) * (1 - np.exp(-(new - k) / (1 - k))), new)
    out = l2s(new)
    m = mask[..., None]
    return np.clip(rgb * (1 - m) + out * m, 0, 1), ref_y

OAKS = ["parisian-blue-oak", "indigo-oak", "graphite-oak", "reed-green-oak", "stone-grey-oak", "dust-grey-oak", "cashmere-oak",
        "light-casella-oak", "light-grey-oak", "mussel-oak", "ivory-oak", "white-oak"]
OAK_HEX = ["#355169", "#19384c", "#3b3d3b", "#869787", "#a79d91", "#959391", "#d2cac1", "#d1ba90", "#cfd0cc", "#e4dfd5", "#faf6ef", "#f2f3f3"]
GLOSS = ["parisian-blue", "indigo", "graphite", "metallic-anthracite", "dust-grey", "metallic-blue", "reed-green", "cashmere",
         "metallic-champagne", "light-grey", "white"]
GLOSS_HEX = ["#39546e", "#1d2e42", "#454948", "#706f75", "#9ea1a2", "#9ca9af", "#8ba195", "#dfd6cf", "#c1b3aa", "#d6d7d2", "#f4f5f6"]
MATT = ["parisian-blue", "indigo", "graphite", "black", "fir-green", "reed-green", "dust-grey", "stone-grey", "light-grey",
        "cashmere", "pale-cream", "white"]
MATT_HEX = ["#39546e", "#1d2f40", "#444a47", "#272b29", "#234031", "#90a496", "#9ea1a2", "#a9a196", "#d2d3d1", "#d5cdc4", "#f2eee5", "#f5f6f7"]

SETS = {
    "hero": dict(src="Shaker", pos=0.70, ids=OAKS, hexes=OAK_HEX,
                 mask=dict(hue_c=202, hue_w=18, s_min=0.2, v_min=0.06, blur=1.6)),
    "kitchen": dict(src="Handleless", pos=0.64, ids=GLOSS, hexes=GLOSS_HEX,
                    mask=dict(hue_c=210, hue_w=16, s_min=0.16, v_min=0.06, blur=1.6,
                              excl=[[0.568, 0.318, 0.752, 0.47], [0.17, 0.42, 0.34, 0.485], [0.055, 0.405, 0.09, 0.445], [0.865, 0.65, 0.905, 0.695]])),
    "bedroom": dict(src="Bedroom", pos=0.30, ids=OAKS, hexes=OAK_HEX,
                    mask=dict(hue_c=205, hue_w=20, s_min=0.12, v_min=0.06, blur=1.6)),
    "bathroom": dict(src="Bathroom", pos=0.58, ids=MATT, hexes=MATT_HEX,
                     mask=dict(hue_c=204, hue_w=26, s_min=0.09, v_min=0.025, grow=2, blur=1.6), bath_side=True),
}

def save_all(img, name, cid, pos):
    for w in (1600, 900):
        img.resize((w, round(img.height * w / img.width)), Image.LANCZOS).save(f"{OUT}/{name}-{cid}-{w}.webp", quality=84 if w == 1600 else 82, method=6)
    h = img.height; x = round((img.width - h) * pos)
    sq = img.crop((x, 0, x + h, h))
    for w in (1080, 600):
        sq.resize((w, w), Image.LANCZOS).save(f"{OUT}/{name}-{cid}-sq-{w}.webp", quality=82, method=6)

for name, cfg in SETS.items():
    if only and name not in only:
        continue
    src = Image.open(source(cfg["src"])).convert("RGB")
    if src.width > 2400:
        src = src.resize((2400, round(src.height * 2400 / src.width)), Image.LANCZOS)
    rgb = np.asarray(src).astype(np.float32) / 255
    mask = make_mask(rgb, **cfg["mask"])
    m8 = Image.fromarray((mask * 255).astype(np.uint8))
    m8 = m8.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))  # closing: fills specks a few px wide
    mask = np.maximum(mask, np.asarray(m8).astype(np.float32) / 255 * 0.98)
    H0, W0 = mask.shape
    for (x0, y0, x1, y1) in cfg["mask"].get("excl", []):
        mask[int(y0 * H0):int(y1 * H0), int(x0 * W0):int(x1 * W0)] = 0
    # Keep brass and gold (handles, knobs, taps) exactly as they are: never tint them
    h, sat, val = ns["hsv"](rgb)
    brass = ((h > 18) & (h < 62) & (sat > 0.2) & (val > 0.22)).astype(np.uint8) * 255
    brass = Image.fromarray(brass).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    mask = mask * (1 - np.asarray(brass).astype(np.float32) / 255)
    if cfg.get("bath_side"):
        # the tall cupboard's dark left side (measured on a 1400px-wide copy), as in tools/images/bathroom.py
        H, W = mask.shape; k = W / 1400
        side = np.zeros_like(mask)
        side[int(4 * k):int(696 * k), int(883 * k):int(919 * k)] = 1
        side = np.asarray(Image.fromarray((side * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255
        mask = np.maximum(mask, side)
    Image.fromarray((mask * 255).astype(np.uint8)).save(os.path.join(OUT, f"_mask-{name}.png"))  # check, then delete
    ref = None
    for i, (cid, hx) in enumerate(zip(cfg["ids"], cfg["hexes"])):
        if i == 0:
            img = src  # the photo's own colour
        else:
            out, ref = recolour(rgb, mask, hx, ref)
            img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
        save_all(img, name, cid, cfg["pos"])
    print(name, "done", len(cfg["ids"]), "colours")
