# Reface website

A simple, mobile-first website for **Reface**: kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields.
Plain HTML, CSS and JavaScript, so it can be hosted for free (GitHub Pages).

## Pages

| Page | What it shows |
| --- | --- |
| `index.html` | Home: still photo hero, what we offer, **Colour Studio** (tap a colour and the room changes), how a free Photoquote works, Google reviews, contact links. |
| `gallery.html` | A before & after slider and real job photos, each with the customer's Google review. |
| `reviews.html` | The Google rating and 11 real Google reviews, word for word. |
| `contact.html` | Phone, WhatsApp, email, address, opening hours and an enquiry form. |

**Photoquote** means a customer sends photos of their room on WhatsApp and Reface replies with a price.
Every "Free Photoquote" button opens WhatsApp with a ready-written message.

## Change details, reviews or photos

Everything is in **`js/config.js`**. Change the text between the quotes and save.
The email and phone-line hours come from refacegroup.co.uk; the opening hours and address from the Google listing.

- **Testimonials:** copy real Google reviews word for word into `reviews`, and fill in `googleRating` and `googleReviewCount`.
- **Before & after:** put each pair of photos in `assets/img/work/` and add a line to `work` (there's an example in the file).

## Project guide and going live

- **[project/README.md](project/README.md)**: everything about the project (client details, decisions, how to change things).
- **[project/GO-LIVE.md](project/GO-LIVE.md)**: what's needed from Reface, and the launch steps.
- **`tools/tests/`**: the checks to run before every update. **`tools/images/`**: how the Colour Studio photos are made.

## Share a link (GitHub Pages)

Settings → Pages → Source "Deploy from a branch" → Branch `main`, folder `/ (root)` → Save.
The link is https://zaindstyles.github.io/reface-website/ and updates a minute or two after each change to `main`.

## See it on your computer

Run `python3 -m http.server 8000` in this folder and open http://localhost:8000.

## Editing pages

The HTML pages are generated from templates in `tools/pages/`. Change a template, then run `python3 tools/pages/build.py`.
Styles are in `css/site.css`.
