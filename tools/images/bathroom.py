"""Recolours the bathroom photo (vanity + tall cupboard) into every Super Matt colour.
Run from the repo root:  python3 tools/images/bathroom.py brochures/bathroom.png
The source photo was made with AI in Higgsfield (no Reface bathroom photos yet)."""
import sys, os, json
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
from recolour import make_mask, recolour

src = Image.open(sys.argv[1]).convert("RGB")
rgb = np.asarray(src).astype(np.float32) / 255
H, W = rgb.shape[:2]
mask = make_mask(rgb, hue_c=204, hue_w=26, s_min=0.09, v_min=0.025, grow=2)
# The tall cupboard's left side is nearly black, so colour matching misses it:
# mark that strip as cupboard by position (measured on the 1400px-wide preview).
k = W / 1400
side = np.zeros_like(mask)
side[int(4 * k):int(696 * k), int(883 * k):int(919 * k)] = 1
side = np.asarray(Image.fromarray((side * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255
mask = np.maximum(mask, side)

cat = open("js/catalogue.js").read()
cat = json.loads(cat[cat.index("=") + 1:].strip().rstrip(";"))
ref = None
for c in cat["supermatt"]:
    if c["id"] == "parisian-blue":
        img = src
    else:
        out, ref = recolour(rgb, mask, c["hex"], ref)
        img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
    for w in (1600, 900):
        h = round(img.height * w / img.width)
        img.resize((w, h), Image.LANCZOS).save(f"assets/img/studio/bathroom-{c['id']}-{w}.webp", quality=80, method=6)
print("done")
