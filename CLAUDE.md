# Reface website (read this first)

This repo is the **Reface** website: kitchen makeovers, fitted bedrooms and fitted bathrooms for Reface Group
(refacegroup.co.uk, (0191) 456 3718, info@refacegroup.co.uk, 85 Westoe Rd, South Shields NE33 4LU;
"Kitchen renovator in South Shields" on Google, serves South Shields and nearby areas). Zain is building it for the business.
This repo (Zainmhene/reface-website, formerly ZainDStyles) is the site's home. Preview: https://zainmhene.github.io/reface-website/. It was first built in Zain's old life-hq repo and moved here
with a fresh history.

Keep it separate from Zain's personal website, TSUGI and other client projects. Never copy code or data between them.

## How it's built

- The client asked for a **basic, budget-friendly site** to start: "a bit of information about what we offer with a link
  to Photoquote service and Google reviews, pages for before and after gallery, testimonials and contact page".
  So it is 4 pages: `index.html` (home), `gallery.html` (before & after), `reviews.html` (testimonials), `contact.html`.
  Zain didn't want it too basic, so the home page keeps some high-end touches: the **Room designer** and animation
  (see below). Don't add pages or sections back without asking. Other features (door designer, price guide, AI visualiser,
  video hero) were built earlier and are in git history if the client wants to grow it.
- Home: hero, What we offer (4 cards: Kitchen makeovers, Fitted kitchens, Fitted bedrooms, Fitted bathrooms), Room designer, Photoquote, Reviews, CTA.
- Hero: one still photo, no video (the client wants a basic site; Zain's call, 3 Nov 2026). Same words on all screens
  ("Same kitchen. Whole new look.", Photoquote + Contact buttons, Google rating); eases in, words rise in, gentle parallax.
  **Computers** (`(min-width: 900px) and (min-aspect-ratio: 9/10)`) show the finished navy/marble/brass kitchen
  `assets/img/hero/navy-kitchen-1600/2560.webp` (an AI image from Higgsfield, so it's labelled "Visualisation").
  **Phones and portrait tablets** show the brochure shaker photo `assets/img/home/hero-tall-720/1080.webp`
  with a deeper shade behind the words. The `<picture>` gives each screen only its own photo.
  The scroll-video hero is in git history (removed in the still-hero PR) if it's ever wanted back.
- Room designer (`#design` on the home page; `js/designer.js`, data in `js/designer-data.js`, styles in `css/designer.css`,
  pictures in `assets/img/designer/`). Replaced the old Colour Studio (in git history). Kitchen / Bedroom switch; the room photo
  with the close-up as a corner card (tap it to swap); three rows (Door, Colour, Handle) with 6 favourites + "All N", which opens
  one panel with the live picture, a big preview with the name, and the whole range (38 kitchen doors, 41 bedroom doors,
  22 vinyl colours + 11 gloss, 65 handles + "None"). The quote button opens WhatsApp with the whole design written in.
  - Room photos: Shaker = the real brochure photos (kitchen p18, bedroom p15) with the handles taken out; Flat, Traditional,
    Fluted and Gloss were made with AI (Higgsfield FLUX, aligned to the same room). Doors without their own room photo show
    the nearest style and say so; the close-up always shows the exact door. Every colour is a separate photo (`k/`, `b/`).
  - Handles are see-through layers (`k/h2/`, `b/h/`) at the real fitter positions measured from the brochure photos.
    The brass cups and knobs in the kitchen are the real ones from the photo, recoloured per finish; all other knobs and the
    cups are drawn (lit like the room), never cut-out photos, because cut-outs left a white rim.
  - Door names are Reface's own (e.g. Classic Shaker, Cathedral Arch). The supplier is never named on the site: not in the
    text, the data or the file names. The private list of which supplier door each name is lives in the project files, not here.
  - Speed: pictures swap only once fully decoded (no half-loaded or doubled handles), the last tap wins, and the likely next
    pictures load 3 at a time in the background once the designer is near the screen (not on data saver). Touching an option
    starts its picture early. Popular taps show in about 0.05s on 4G.
  - The scripts that make these pictures use the supplier brochures and stay in the private project files, like the old ones.

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
- Images: `assets/img/home/` (still hero from the supplier brochure, sharpened; two service photos at 800/1200 from the
  brochures), `assets/img/hero/` (computer hero photo), `assets/img/designer/` (Room designer),
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
  `SITE_URL` there is the full site address, used for the link-preview picture `assets/img/share.jpg` (WhatsApp/Facebook).
  At launch: `PREVIEW = False`, `SITE_URL = "https://www.refacegroup.co.uk/"`, add a `CNAME` file. Steps in `project/GO-LIVE.md`.
- `project/`: the project guide (`README.md`) and the go-live checklist (`GO-LIVE.md`). Keep them up to date.
- `tools/tests/`: browser checks (Playwright) to run before every update; `check-phone.js` first. The scripts that make the
  Room designer pictures are in the private project files (they use the supplier brochures), not in this public repo.

## Brand

Navy (`#16306a`) for the site, warm ivory, brushed brass accents. The header logo uses Reface's exact logo colours:
royal navy `#00207d` and a yellow full stop `#f9fe00` ("reface."), with the lowercase tagline "kitchens | bedrooms | bathrooms". Fraunces for headings, Manrope for text,
Montserrat 800 for the "reface" wordmark. Mobile-first: most visitors are on phones. Premium, big readable text.

## Rules

- **Never invent reviews, prices, stats, awards or guarantees.** Reviews must be pasted word for word from Google
  into `js/config.js`. Until then the site shows a "Read our Google reviews" card.
- Before & after photos must be **real Reface jobs**. Never use brochure or AI images there. Any AI image elsewhere must be labelled.
- Email (info@refacegroup.co.uk) from their current website. Opening hours, confirmed by Reface (19 Nov 2026):
  Mon–Fri 9am–5pm, Sat 10am–3pm, Sun closed. The phone lines are open the same hours.
- Phone (calls): the landline (0191) 456 3718. WhatsApp (every Photoquote button): 07457 403407, Reface's verified
  WhatsApp Business account. Don't mix them up.
- Contact form: four choices (Kitchen makeover, Fitted kitchen, Fitted bedroom, Fitted bathroom); "Photos of your kitchen"
  (optional, up to 5) shows only when Kitchen makeover is ticked. Photos only reach Reface once a form endpoint that accepts
  files is set; until then the form opens WhatsApp and asks them to add the photos in the chat.
- Before launch, confirm with Reface: form endpoint, permission to use the customers' job photos, and that they approve the site.
- No API keys or secrets in the repo.
- Zain is learning web development: explain changes simply, be direct about bad ideas, keep replies short.
- Work on a branch and open a pull request; don't push to `main` directly. Get Zain's approval before adding
  paid services or dependencies.
