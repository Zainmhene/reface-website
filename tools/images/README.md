# Image tools

These scripts made the recoloured photos for the hero and the Colour Studio. You only need them to add or change colourways.

1. Put the brochure photos in `brochures/` (not committed): extract them from Kitchen.pdf and Bedroom.pdf with
   `pdfimages -j -p Kitchen.pdf brochures/kitchen/k` (and the same for Bedroom.pdf into `brochures/bedroom/b`).
2. Edit `recolour-jobs.json`: each job is one photo, a colour mask (which hue to replace) and a list of target colours (hex values from `js/catalogue.js`).
3. Run from the repo root: `python3 tools/images/recolour.py tools/images/recolour-jobs.json`. Needs Python 3 with Pillow and numpy.

How it works: the script finds the door pixels by colour, keeps the light and shadow of the original photo, and swaps in the new door colour. Mask previews are saved to `brochures/` so you can check what was changed.

`swatches.py` sampled the colour chips and cropped the door drawings from the brochure pages.
