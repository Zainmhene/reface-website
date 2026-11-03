# Image tools

## Colour Studio photos: `make_studio.py`

Makes every Colour Studio photo (4 rooms, 47 colours, in 4 sizes) from the four sharpened source photos.

1. Unzip `Reface project files.zip` and find the folder **2 Colour Studio sources (sharpened)**.
2. From the repo root run (needs Python 3 with Pillow and numpy):
   ```
   python3 tools/images/make_studio.py "path/to/2 Colour Studio sources (sharpened)" assets/img/studio
   ```
   Add `hero`, `kitchen`, `bedroom` or `bathroom` at the end to remake only those rooms (`hero` is the Shaker kitchen).
3. Check the `_mask-*.png` files it leaves in `assets/img/studio/`: white shows what gets recoloured. Then delete them.

How it works (in `recolour.py` and `make_studio.py`):
- it finds the door pixels by colour (the original doors are all Parisian Blue)
- it keeps the photo's light and shade and swaps in the new colour; lighter colours get softer shading and grain, so whites don't look dirty
- brass handles, knobs and taps are never tinted; on the Handleless kitchen the oven glass, sink and sockets are left alone
- each colour is saved wide (1600 and 900px, for computers and tablets) and square (1080 and 600px, cut for phones)

To add a colour, add its id, name and hex to the lists at the top of `make_studio.py` **and** in `js/studio.js`.
The hex values were sampled from the brochure swatches.
