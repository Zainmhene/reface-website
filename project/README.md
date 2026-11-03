# Reface website: project guide

Everything about the Reface website in one place. **Going live?** See [GO-LIVE.md](GO-LIVE.md).

## The client

| | |
| --- | --- |
| Business | Reface Group (trading as **Reface**): kitchen makeovers, fitted bedrooms, fitted bathrooms |
| Address | 85 Westoe Rd, South Shields NE33 4LU (serves South Shields and nearby areas) |
| Phone (calls) | (0191) 456 3718, lines open Mon–Fri 9–5, Sat 10–3 |
| WhatsApp (Photoquotes) | 07457 403407 (verified WhatsApp Business) |
| Email | info@refacegroup.co.uk |
| Opening hours (Google) | Mon–Thu 10–4, Fri 9–4, Sat 10–2, Sun closed |
| Google | 5.0 from 173 reviews (2 Nov 2026) |
| Website | refacegroup.co.uk (currently their old site; the new one replaces it at launch) |
| People named in reviews | Kev, Neil, Nick (office); Andy (fitter) |

**The brief (from the client):** "Basic website to begin with, bit information about what we offer with a link to
Photoquote service and Google reviews, pages for before and after gallery, testimonials and contact page, that'll do for now
we can grow it from there." Budget-friendly.

**Photoquote** = the customer sends photos of their room on WhatsApp and Reface replies with a price. Every
"Free Photoquote" button on the site opens WhatsApp with a message ready to send.

## Links

- **Preview:** https://zaindstyles.github.io/reface-website/
- **Code:** https://github.com/ZainDStyles/reface-website (every change is a pull request; merging updates the site in about a minute)
- **Project files** (brochures, sharpened photos, screenshots): `Reface project files.zip`, kept outside the repo
  because it's big and the repo is public. Its README explains each folder.

## What's on the site

| Page | What's on it |
| --- | --- |
| Home (`index.html`) | Still photo hero (computers: the finished navy kitchen, labelled "Visualisation"; phones: a brochure shaker kitchen), what we offer, **Colour Studio**, how a Photoquote works, 3 Google reviews, contact buttons |
| Before & After (`gallery.html`) | A real before & after slider (Lynne's quartz worktops), then 6 real jobs with photos and each customer's review |
| Reviews (`reviews.html`) | The Google rating and 11 real Google reviews, word for word |
| Contact (`contact.html`) | Phone, WhatsApp, email, address, hours and an enquiry form (sends by WhatsApp or email) |

**Colour Studio:** Kitchen (Shaker or Handleless), Bedroom and Bathroom. Tap a colour dot or swipe and the room changes colour.
It uses the real colour names from the brochures (52 door colours in the range; 47 shown).
"Free Photoquote in this colour" sends the chosen colour on WhatsApp.

## Decisions (and why)

| When | Decision |
| --- | --- |
| 2 Nov | Basic 4-page site, as the client asked. The bigger features built first (door designer, price guide, AI visualiser) are in git history. |
| 2 Nov | Reviews copied word for word from Google, with surnames shortened. Never written or edited by us. |
| 2 Nov | Gallery photos must be real Reface jobs. They came from customers' Google reviews, **so permission is needed before launch**. |
| 2 Nov | Two sets of hours, both labelled: phone lines (from their old website) and opening hours (from Google). |
| 2 Nov | Logo matches theirs: navy "reface" with the yellow full stop. |
| 2–3 Nov | Kept the Colour Studio (Zain wanted it premium, not too basic). Made it fast and sharp on phones. |
| 3 Nov | Hero is one still photo on every screen, no video (client wants basic). AI images are always labelled "Visualisation". |
| 3 Nov | Hidden from Google (`PREVIEW = True`) until launch. |

## How to change things

Most changes are in **`js/config.js`**: change the text between the quotes, save, and open a pull request.

- **Phone, WhatsApp, email, hours, address:** the `business` section.
- **Add a Google review:** copy it word for word into `reviews` (the first three show on the home page).
- **Update the review count:** `googleRating` and `googleReviewCount`.
- **Add a job to the gallery:** put the photos in `assets/img/work/` (`name-1000.webp` and `name-500.webp`) and add it to `work`.
  There are examples in the file for photo sets and for before & after pairs.
- **Remove a job** (for example if a customer says no): delete its block in `work`.
- **Page wording:** the templates in `tools/pages/pages/` (one per page). Shared header and footer: `tools/pages/parts.py`.
  Then run `python3 tools/pages/build.py`. Don't edit the `.html` files directly; they're rebuilt from the templates.
- **Colours and styles:** `css/site.css` (colour settings at the top).
- **Colour Studio photos:** made by `tools/images/make_studio.py` from the project files (see `tools/images/README.md`).

## Checking it works

`tools/tests/` has the checks used before every update: 160 on 4 phone sizes, 130 across all pages on 4 screen sizes,
and more for the Colour Studio, gallery and reviews. See `tools/tests/README.md` for how to run them.

## Paid tools used

- **Higgsfield** (Zain's account): the AI hero image and bathroom image, and sharpening the brochure photos.
  8 credits were used for the final photo sharpening (about 11 left on 3 Nov 2026).
- Everything else is free: GitHub Pages hosting, Google Fonts.
