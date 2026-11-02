"""Builds the HTML pages from the templates in this folder.

Run from anywhere:  python3 tools/pages/build.py            (all pages)
                    python3 tools/pages/build.py contact    (one page)

parts.py  = shared <head>, header, menu and footer
blocks.py = the page title band and the enquiry block
pages/    = one file per page, each with a build() function
"""
import sys, os, re, hashlib, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "pages"))

def stamp(html):
    """Add a version stamp to our CSS and JS links (css/site.css?v=1a2b3c4d), made from each file's contents.
    When a file changes, its stamp changes, so phones fetch the new one at once instead of
    showing a saved old copy for up to 10 minutes (GitHub Pages' cache time)."""
    def add(m):
        path = m.group(2)
        with open(os.path.join(ROOT, path), "rb") as fh:
            v = hashlib.md5(fh.read()).hexdigest()[:8]
        return f'{m.group(1)}="{path}?v={v}"'
    return re.sub(r'(href|src)="((?:css|js)/[\w.-]+\.(?:css|js))"', add, html)

names = sys.argv[1:] or sorted(f[:-3] for f in os.listdir(os.path.join(HERE, "pages")) if f.endswith(".py"))
for n in names:
    html = stamp(importlib.import_module(n).build())
    with open(os.path.join(ROOT, n + ".html"), "w") as fh:
        fh.write(html)
    print("built", n + ".html")
