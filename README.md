# Reface website

A simple, mobile-first website for **Reface**: kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields.
Plain HTML, CSS and JavaScript, so it can be hosted for free (GitHub Pages).

## Pages

| Page | What it shows |
| --- | --- |
| `index.html` | Home: animated still photo hero, what we offer, **Colour Studio** (tap a colour and the room changes), how a free Photoquote works, Google reviews, contact links. |
| `gallery.html` | Before & after photos with a drag slider on each. |
| `reviews.html` | Testimonials (real Google reviews) and a link to all reviews on Google. |
| `contact.html` | Phone, WhatsApp, address, opening hours and an enquiry form. |

**Photoquote** means a customer sends photos of their room on WhatsApp and Reface replies with a price.
Every "Free Photoquote" button opens WhatsApp with a ready-written message.

## Change details, reviews or photos

Everything is in **`js/config.js`**. Change the text between the quotes and save.
The email and phone-line hours come from refacegroup.co.uk; the opening hours and address from the Google listing.

- **Testimonials:** copy real Google reviews word for word into `reviews`, and fill in `googleRating` and `googleReviewCount`.
- **Before & after:** put each pair of photos in `assets/img/work/` and add a line to `work` (there's an example in the file).

## Before it goes live (checklist)

1. **Reface approves the site.**
2. **Google rating:** the overall star rating and number of reviews, for `googleRating` and `googleReviewCount` (10 reviews are in).
3. **Permission for the job photos:** the gallery photos came from customers' Google reviews (Karen B., Jacqueline S.,
   Ethan P., Robert, Christine F., Judith H.). Reface should check they're happy for them to be used, or send their own photos of those jobs.
4. **Before & after photos** of real Reface jobs.
5. **Enquiries by email:** create a free form at formspree.io and paste its URL into `form.endpoint`. Without it, the form opens WhatsApp.
6. **Let Google find it:** set `PREVIEW = False` in `tools/pages/parts.py` and run `python3 tools/pages/build.py`.

## Share a link (GitHub Pages)

Settings → Pages → Source "Deploy from a branch" → Branch `main`, folder `/ (root)` → Save.
The link is https://zaindstyles.github.io/reface-website/ and updates a minute or two after each change to `main`.

## See it on your computer

Run `python3 -m http.server 8000` in this folder and open http://localhost:8000.

## Editing pages

The HTML pages are generated from templates in `tools/pages/`. Change a template, then run `python3 tools/pages/build.py`.
Styles are in `css/site.css`.
