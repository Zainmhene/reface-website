# Reface website

A simple, mobile-first website for **Reface**: kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields.
Plain HTML, CSS and JavaScript, so it can be hosted for free (GitHub Pages).

## Pages

| Page | What it shows |
| --- | --- |
| `index.html` | Home: still photo hero, what we offer, how a free Photoquote works, Google reviews, contact links. |
| `gallery.html` | Before & after photos with a drag slider on each. |
| `reviews.html` | Testimonials (real Google reviews) and a link to all reviews on Google. |
| `contact.html` | Phone, WhatsApp, address, opening hours and an enquiry form. |

**Photoquote** means a customer sends photos of their room on WhatsApp and Reface replies with a price.
Every "Free Photoquote" button opens WhatsApp with a ready-written message.

## Change details, reviews or photos

Everything is in **`js/config.js`**. Change the text between the quotes and save.

- **Testimonials:** copy real Google reviews word for word into `reviews`, and fill in `googleRating` and `googleReviewCount`.
- **Before & after:** put each pair of photos in `assets/img/work/` and add a line to `work` (there's an example in the file).
- **Email:** add Reface's email to `email` once confirmed. Until then, email links stay hidden.

## Before it goes live (checklist)

1. **Reface approves the site.**
2. **WhatsApp number** for Photoquotes (config uses the landline as a placeholder).
3. **Email address** (not confirmed yet, so it's hidden).
4. **Real Google reviews** pasted into `reviews`.
5. **Before & after photos** of real Reface jobs.
6. **Opening hours:** the site uses the Google listing (Mon–Thu 10–4, Fri 9–4, Sat 10–2). Their old website said Mon–Fri 9–5, Sat 10–3.
7. **Enquiries by email:** create a free form at formspree.io and paste its URL into `form.endpoint`. Without it, the form opens WhatsApp.
8. **Let Google find it:** set `PREVIEW = False` in `tools/pages/parts.py` and run `python3 tools/pages/build.py`.

## Share a link (GitHub Pages)

Settings → Pages → Source "Deploy from a branch" → Branch `main`, folder `/ (root)` → Save.
The link is https://zaindstyles.github.io/reface-website/ and updates a minute or two after each change to `main`.

## See it on your computer

Run `python3 -m http.server 8000` in this folder and open http://localhost:8000.

## Editing pages

The HTML pages are generated from templates in `tools/pages/`. Change a template, then run `python3 tools/pages/build.py`.
Styles are in `css/site.css`.
