# Reface website (read this first)

This repo is the **Reface** website: kitchen makeovers, fitted bedrooms and fitted bathrooms for Reface Group
(refacegroup.co.uk, (0191) 456 3718, info@refacegroup.co.uk, 85 Westoe Rd, South Shields NE33 4LU;
"Kitchen renovator in South Shields" on Google, serves South Shields and nearby areas). Zain is building it for the business.
This repo (ZainDStyles/reface-website) is the site's home. It was first built in Zain's old life-hq repo and moved here
with a fresh history.

Keep it separate from Zain's personal website, TSUGI and other client projects. Never copy code or data between them.

## How it's built

- The client asked for a **basic, budget-friendly site** to start: "a bit of information about what we offer with a link
  to Photoquote service and Google reviews, pages for before and after gallery, testimonials and contact page".
  So it is 4 pages: `index.html` (home), `gallery.html` (before & after), `reviews.html` (testimonials), `contact.html`.
  Zain didn't want it too basic, so the home page keeps some high-end touches: the **Colour Studio** and animation
  (see below). Don't add pages or sections back without asking. Other features (door designer, price guide, AI visualiser,
  video hero) were built earlier and are in git history if the client wants to grow it.
- Home: still photo hero (eases in, words rise in, gentle parallax), What we offer, Colour Studio, Photoquote, Reviews, CTA.
- Colour Studio (`js/studio.js`, home only): Kitchen (Shaker / Handleless), Bedroom and Bathroom tabs, round colour dots on
  the photo; tap or swipe to wipe in the new colour. The first time it scrolls into view it plays one slow wipe so people
  see it changes. Its "Free Photoquote in this colour" button opens WhatsApp with the room and colour filled in.
  Photos in `assets/img/studio/` are brochure photos recoloured with the real brochure colours (made by `tools/images/recolour.py`,
  in git history). The bathroom photo is AI-made and labelled as a visualisation; it
  could be swapped for a real one (Reface now has real bathroom jobs, see the gallery). Oak swatch tiles are in `assets/img/swatches/`.
  Handleless photos (`kitchen-*`) were remade from the brochure photo (Kitchen.pdf page 8) upscaled to 2K in Higgsfield, then
  recoloured with `recolour.py` (oven glass, sink and sockets excluded from the mask); the old ones were blurry and blocky.
  On phones the studio photo is square (1:1). No backdrop blur on the labels over the photo (it made the slide stutter on iPhones).
  Speed (it used to lag): a tap shows the small 900px photo at once and swaps in the 1600px one when it arrives; then the other
  colours download one at a time in the background (small ones, then the first photo of each other room/style, then sharp ones),
  starting about two screens before the section, and a tap cancels the background download so it gets the whole connection. Taps during a wipe are queued (last one wins). The wipe
  moves with transforms (Web Animations), not clip-path, so phones animate it smoothly.
- `build.py` adds a version stamp to every CSS/JS link (`site.css?v=…`, from the file's contents), so after an update phones
  fetch the new files at once instead of a saved copy (GitHub Pages lets browsers keep files for 10 minutes).
- Plain HTML, CSS and JavaScript. No build step needed to host it (GitHub Pages or any static host).
- The HTML pages are **generated** by `python3 tools/pages/build.py` from `tools/pages/` (shared head/header/footer in
  `parts.py`, the page title band and enquiry block in `blocks.py`, one file per page in `tools/pages/pages/`).
  Edit the templates and rebuild; don't hand-edit the HTML.
- `js/config.js` is the one file for business details, Photoquote message, enquiry endpoint, **reviews** (testimonials)
  and **work** (before & after photos). `js/site.js` renders them and runs the menu, Back button, forms and sliders.
- Photoquote = customers send photos of their room on WhatsApp and get a price back (their site: "Do you use WhatsApp?
  Then ask about our absolutely FREE Photoquote Service"). Every "Free Photoquote" button
  opens WhatsApp with `photoquoteMessage` from config.
- Images: `assets/img/home/` (still hero from the supplier brochure, two service photos), `assets/img/studio/` (Colour Studio),
  `assets/img/work/` for real job photos.
- Gallery (`gallery.html`, from `work` in config): before & after jobs first (sliders that sweep once when they come into view),
  then finished-job photo sets (tap to enlarge), each shown with its customer's review. Job 1 is a real before & after:
  Lynne J.'s brown-to-quartz worktops, two pairs lined up by scale/shift so the room matches (one photo was stitched from two
  screenshots). The other 6 jobs (dark grey kitchen, kitchen & bathroom, shaker kitchen with breakfast bar, bedroom, cream
  kitchen, white kitchen) use photos from customers' Google reviews, cropped from Zain's phone screenshots. All these photos
  are the customers': Reface must confirm they're happy for them to be used before the site goes live (or send their own).
  Jacqueline's bathroom photo is also on the home page "Fitted bathrooms" card.
- Reviews: 11 real Google reviews (all 5 stars), word for word including the reviewers' own typos; surnames shortened.
  The first three in `config.js` show on the home page (one kitchen, one bedroom, one kitchen & bathroom). Long ones get "Read more".
  Google rating 5.0 from 173 reviews (2 Nov 2026) is in `config.js`; it shows in the home hero and above the reviews. Update the count now and then.
- `PREVIEW = True` in `tools/pages/parts.py` adds a noindex tag so search engines ignore the site until launch.

## Brand

Navy (`#16306a`) for the site, warm ivory, brushed brass accents. The header logo uses Reface's exact logo colours:
royal navy `#00207d` and a yellow full stop `#f9fe00` ("reface."), with the lowercase tagline "kitchens | bedrooms | bathrooms". Fraunces for headings, Manrope for text,
Montserrat 800 for the "reface" wordmark. Mobile-first: most visitors are on phones. Premium, big readable text.

## Rules

- **Never invent reviews, prices, stats, awards or guarantees.** Reviews must be pasted word for word from Google
  into `js/config.js`. Until then the site shows a "Read our Google reviews" card.
- Before & after photos must be **real Reface jobs**. Never use brochure or AI images there. Any AI image elsewhere must be labelled.
- Email (info@refacegroup.co.uk) and phone-line hours (Mon–Fri 9–5, Sat 10–3) come from their current website;
  opening hours (Mon–Thu 10–4, Fri 9–4, Sat 10–2) from Google (re-checked 2 Nov 2026). Both are shown, labelled.
  (Their WhatsApp Business profile says Monday 9–4; the site follows Google.)
- Phone (calls): the landline (0191) 456 3718. WhatsApp (every Photoquote button): 07457 403407, Reface's verified
  WhatsApp Business account. Don't mix them up.
- Before launch, confirm with Reface: form endpoint, permission to use the customers' job photos, and that they approve the site.
- No API keys or secrets in the repo.
- Zain is learning web development: explain changes simply, be direct about bad ideas, keep replies short.
- Work on a branch and open a pull request; don't push to `main` directly. Get Zain's approval before adding
  paid services or dependencies.
