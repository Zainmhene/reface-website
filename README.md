# Reface website

A premium, mobile-first website for **Reface**: kitchen makeovers, fitted bedrooms and fitted bathrooms.
Plain HTML, CSS and JavaScript, so it can be hosted anywhere (Vercel recommended).

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Home. Scroll the hero and the kitchen changes colour. Swipe the **Colour Studio** to recolour a real kitchen or bedroom. Services, how it works, reviews, FAQ, enquiry form. |
| `kitchens.html` / `bedrooms.html` | Ranges and colours, **door designer** (any of the 20 styles in any colour), gallery, handles, splashbacks. |
| `bathrooms.html` | Fitted bathroom furniture with a colour-changing illustration. |
| `estimate.html` | **Price guide.** A few questions, then a live guide price, sent with the enquiry. |
| `visualiser.html` | **AI visualiser.** The customer uploads a photo of their room and gets 3 AI designs. Until AI is switched on, it sends their photo to Reface on WhatsApp instead. |

## See it on your computer

Open `index.html` in a browser, or for everything to work (fonts, forms) run this in the folder:

```
python3 -m http.server 8000
```

then go to http://localhost:8000.

## Change business details, prices or reviews

Everything is in **`js/config.js`**: phone, WhatsApp number, email, hours, area, Google reviews link,
reviews, prices and where enquiries go. Change the text between the quotes and save.
The address, hours and area come from the Reface Google Business listing.

## Before it goes live (checklist)

1. **Reface approves the site.** It's their brand, photos and details.
2. **WhatsApp number.** `config.js` uses the landline as a placeholder. Get the real WhatsApp number.
3. **Prices.** The numbers in `config.js` are *placeholders* based on typical UK prices, not Reface's.
   Replace them with Reface's price list, then set `pricesConfirmed: true` (this removes the "example prices" notice).
4. **Reviews.** Copy real Google reviews word for word into `reviews` in `config.js`. Never write or edit reviews.
5. **Enquiries.** Without a form service, enquiries open in WhatsApp or email on the customer's phone.
   For proper email delivery, create a free form at formspree.io (or web3forms.com) and paste the endpoint into `form.endpoint`.
6. **Opening hours.** The site uses the Google listing (Mon–Thu 10–4, Fri 9–4, Sat 10–2). Their old website said Mon–Fri 9–5, Sat 10–3. Confirm which is right.
7. **Bathroom photos.** Real photos of Reface bathroom jobs would replace the illustration well.

## Put it online (Vercel)

1. vercel.com → Add New → Project → import this GitHub repo. No build settings needed.
2. Add the domain (e.g. refacegroup.co.uk) in Project → Settings → Domains.

## Switch on the AI visualiser

In Vercel → Project → Settings → Environment Variables:

- `GEMINI_API_KEY`: from Google AI Studio (aistudio.google.com). **Required.**
- `ALLOWED_ORIGIN`: e.g. `https://www.refacegroup.co.uk`, so other sites can't use your key. **Recommended.**
- `GEMINI_IMAGE_MODEL`: optional, defaults to `gemini-2.5-flash-image`.

Cost is roughly a few pence per image (3 images per customer). Check Google's current pricing and set a spending limit.

## The home page hero and Colour Studio

- **Hero:** as you scroll, an empty plasterboard room builds into a navy, gold-veined marble and brass kitchen.
  It's an AI video made in Higgsfield, with separate versions for computers (`assets/img/hero/wide`) and phones
  (`assets/img/hero/tall`), so the page shows a small "Visualisation" label.
- **Colour Studio:** pick Kitchen, Bedroom or Bathroom, then tap the round colour dots on the photo (or swipe it)
  to see the room in each colour. The colours come from the brochures and were applied with `tools/images/recolour.py`.

## Editing pages

The HTML pages are generated from templates in `tools/pages/` (shared header/footer in `parts.py`).
Change a template, then run `python3 tools/pages/build.py`. Styles are in `css/site.css`.
`tools/images/` has the scripts that made the recoloured photos.
