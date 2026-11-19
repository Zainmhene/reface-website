# Site checks

Automated checks that open the site in a real browser (Chrome) and click through it like a visitor.
Run them before every update you send to Reface.

## One-time setup

You need Node.js. In this folder, run `npm install playwright` and then `npx playwright install chromium`.

## Run

1. In the repo root, start a local copy of the site: `python3 -m http.server 8766`
2. In another terminal, in `tools/tests/`, run any of these:

| Command | What it checks |
| --- | --- |
| `node check-phone.js` | **Run this one first.** 160 checks on 4 phone sizes, going through every page like a client would: hero, menu, bottom bar, room designer, reviews, gallery, photo viewer, contact form |
| `node check-pages.js` | 130 checks: all 4 pages on small phone, phone, tablet and computer. Errors, missing files, pictures, sideways scrolling, WhatsApp, call and email links |
| `node check-basics.js` | Links between pages, WhatsApp message, menu, Back button, contact form |
| `node check-reviews-gallery.js` | Reviews, "Read more", gallery jobs, before & after sliders, photo viewer |

Each prints `PASS` or `FAIL` for every check. Screenshots go to your temp folder, or to a folder you name after the command.

The checks know the current content (for example 11 reviews and 22 gallery photos). If you add reviews or photos,
update those numbers in the check too.
