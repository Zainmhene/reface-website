# Reface website (read this first)

This repo is now the **Reface** website: kitchen makeovers, fitted bedrooms and fitted bathrooms for Reface Group
(refacegroup.co.uk, (0191) 456 3718, info@refacegroup.co.uk, 85 Westoe Rd, South Shields NE33 4LU;
"Kitchen renovator in South Shields" on Google, serves South Shields and nearby areas). Zain is building it for the business.
This repo (ZainDStyles/reface-website) is the site's home. It was first built in Zain's old life-hq repo and moved here
with a fresh history.

Keep it separate from Zain's personal website, TSUGI and other client projects. Never copy code or data between them.

## How it's built

- Plain HTML, CSS and JavaScript. No framework, no build step needed to host it. Works on Vercel or any static host.
- `index.html`, `kitchens.html`, `bedrooms.html`, `bathrooms.html`, `estimate.html`, `visualiser.html` are
  **generated** by `python3 tools/pages/build.py` from the templates in `tools/pages/` (shared header and footer
  in `parts.py`, sections in `blocks.py`, one file per page in `tools/pages/pages/`). Edit the templates and
  rebuild. Don't hand-edit the HTML, or the next build overwrites it.
- `css/site.css` holds the whole design system (tokens at the top). `css/estimate.css` and `css/visualiser.css` hold page extras.
- `js/config.js` is the one file for business details, WhatsApp number, hours, enquiry endpoint, reviews and
  **prices**. `js/catalogue.js` lists the real colours, door styles and splashbacks from the brochures.
- `js/site.js`: shared behaviour (scroll hero, Colour Studio, menu, reviews, enquiry sending).
  Home hero (Zain's choice): an AI build-up video like the reference reel. Desktop and phone were generated
  separately in Higgsfield (GPT Image 2.5 stills: bare plasterboard shell + finished navy/gold-marble/brass kitchen;
  MiniMax H3 2K start/end-frame videos), cut into 61 webp frames each in `assets/img/hero/wide` and `/tall`,
  scrubbed on scroll with six caption stages. Header sits on the image; text is dark on the bare room, light after.
  Colour Studio: Kitchen / Bedroom / Bathroom tabs (kitchen has Shaker and Handleless styles), round colour dots on
  the photo; tap or swipe to wipe in the new colour. Recoloured brochure photos in `assets/img/studio/`.
- Keep it short and simple (Zain's request). Home: Hero, Rooms, Colour Studio, Reviews, Enquiry.
  Kitchens/Bedrooms: hero, door designer, gallery, enquiry. Bathrooms: photo hero, colour try-on, enquiry.
  The enquiry block (`enquiry()` in `blocks.py`) sits at the bottom of every main page. The swipe "Design your room"
  builder was deleted (in git history). Don't add sections or pages back without asking.
- Bathroom photo: no Reface bathroom photos exist yet, so `assets/img/studio/bathroom-*.webp` is an AI-made photo
  (Higgsfield) recoloured by `tools/images/bathroom.py`; it is labelled as a visualisation. Swap in real job photos when Reface sends them.
- Navigation: menu is Kitchens, Bedrooms, Bathrooms, Price guide. Every page except home has a Back button by the logo (`data-back` in `parts.py`; goes back on this
  site, or to the home page). Pages always open at the top: scroll restoration is off, and for 3 seconds after
  opening, any scroll the visitor didn't make is undone (some viewers restore old positions). #section links still work.
  `js/ranges.js`: door designer and colour chips.
  `js/estimate.js`: price guide. `js/visualiser.js`: AI visualiser.
- `api/visualise.js`: Vercel serverless function for the AI visualiser (Google Gemini image editing).
  Off until `GEMINI_API_KEY` is set in Vercel. Without it, the page falls back to "send us your photo on WhatsApp".
- Images: `assets/img/` (webp). The recoloured Colour Studio and hero images were made by `tools/images/recolour.py`
  from the supplier brochures (Kitchen.pdf, Bedroom.pdf, not in the repo). Colours are applied digitally, so pages
  carry a "colours are a guide" note.

## Brand

Navy from the Reface logo (`#16306a`), warm ivory, brushed brass accents. Fraunces for headings, Manrope for text,
Montserrat 800 for the "reface" wordmark. Mobile-first: most visitors are on phones. Premium, big readable text.

## Rules

- **Never invent reviews, prices, stats, awards or guarantees.** Reviews must be pasted word for word from Google
  into `js/config.js`. Until then the site shows a "Read our Google reviews" card.
- Prices in `js/config.js` are **placeholders** (`pricesConfirmed: false`) until Reface supplies their price list.
  While false, the price guide shows an "example prices" notice.
- Before launch, confirm with Reface: WhatsApp number, opening hours (Google and their old site disagree; the site uses Google's),
  prices, form endpoint, and that they approve the site.
- No API keys or secrets in the repo. Keys go in Vercel environment variables.
- Zain is learning web development: explain changes simply, be direct about bad ideas, keep replies short.
- Work on a branch and open a pull request; don't push to `main` directly. Get Zain's approval before adding
  paid services or dependencies.
