"""Builds the HTML pages from the templates in this folder.

Run from anywhere:  python3 tools/pages/build.py            (all pages)
                    python3 tools/pages/build.py kitchens   (one page)

parts.py  = shared <head>, header, menu and footer
blocks.py = reusable sections (ranges, door designer, gallery, handles...)
pages/    = one file per page, each with a build() function
"""
import sys, os, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "pages"))
names = sys.argv[1:] or sorted(f[:-3] for f in os.listdir(os.path.join(HERE, "pages")) if f.endswith(".py"))
for n in names:
    html = importlib.import_module(n).build()
    with open(os.path.join(ROOT, n + ".html"), "w") as fh:
        fh.write(html)
    print("built", n + ".html")
