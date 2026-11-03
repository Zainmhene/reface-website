# Reface website: go-live checklist

**Where we are (3 Nov 2026):** the site is built, tested and online as a preview:
**https://zaindstyles.github.io/reface-website/**
It's hidden from Google until launch. Hosting is free (GitHub Pages); Reface already pays for the domain.

Three things are needed from Reface. Then the launch takes about 30 minutes.

---

## 1. Reface tests the site and says OK

Send the preview link and ask them to try it **on their phone** (most customers will use a phone). Ask them to check:

- [ ] Phone (0191) 456 3718, WhatsApp 07457 403407, email info@refacegroup.co.uk, address 85 Westoe Rd
- [ ] Opening hours (Mon–Thu 10–4, Fri 9–4, Sat 10–2) and phone-line hours (Mon–Fri 9–5, Sat 10–3)
- [ ] Tap **Free Photoquote**: does WhatsApp open with a message ready to send?
- [ ] The **Colour Studio**: try some colours, Kitchen / Bedroom / Bathroom
- [ ] The services list and wording on the home page
- [ ] The reviews (copied word for word from Google) and the gallery
- [ ] Send a test message from the contact form
- [ ] Anything they want changed or taken off

## 2. Permission for the customer photos ⚠️ (the only real blocker)

The gallery photos came from customers' Google reviews. Putting them on Reface's own website needs each customer's OK,
or Reface can send their own photos of the same jobs instead.

| Customer | What's used on the site |
| --- | --- |
| Lynne J. | Before & after photos of her quartz worktops (top of the gallery) |
| Karen B. | 5 photos of her dark grey shaker kitchen |
| Jacqueline S. | 7 photos of her kitchen and bathroom (one is also on the home page "Fitted bathrooms" card) |
| Ethan P. | 5 photos of his kitchen with the breakfast bar |
| Robert | 2 photos of his fitted bedroom |
| Christine F. | 2 photos of her cream kitchen |
| Judith H. | 1 photo of her white kitchen |

A message Reface can send:

> Hi [name], it's [name] from Reface. Thank you again for your lovely review! We're launching our new website and would love
> to show the photos you shared of your [kitchen]. We'd only use your first name and initial. Would that be OK with you?

If anyone says no, tell Zain and their photos come off (one line in `js/config.js`).

## 3. Access to the domain refacegroup.co.uk

To put the new site on their real address, someone has to change two settings where the domain is registered.

- [ ] **Who registered refacegroup.co.uk** (for example GoDaddy, 123-reg, Fasthosts, IONOS), and the login,
      **or** the person who looks after it (often whoever built their current website).
- [ ] **Who hosts their current website**, and whether they pay for it. Once the new site is live, that can usually be cancelled.
- [ ] Is there anything on the current website they want to keep?

**Important:** their email (info@refacegroup.co.uk) must keep working. At launch only the *website* settings change.
The *email* settings (called MX records) are not touched.

---

## Launch day (Zain + Claude, about 30 minutes)

1. **Code** (one pull request):
   - in `tools/pages/parts.py` set `PREVIEW = False` and `SITE_URL = "https://www.refacegroup.co.uk/"`
   - add a file called `CNAME` containing `www.refacegroup.co.uk`
   - run `python3 tools/pages/build.py`, then merge
2. **GitHub:** Settings → Pages → Custom domain → `www.refacegroup.co.uk` → Save.
3. **Domain settings (DNS)** at the registrar:
   - `www` → **CNAME** → `zaindstyles.github.io`
   - `@` (the bare refacegroup.co.uk) → four **A** records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - remove any *old* A or CNAME records for `@` and `www` that point to the old website
   - leave **MX** and **TXT** records (email) exactly as they are
4. **Wait** for the change to spread (minutes, up to a few hours). Then GitHub → Settings → Pages → tick **Enforce HTTPS** (the padlock).
5. **Test:** refacegroup.co.uk and www.refacegroup.co.uk both open the new site with a padlock; run the phone check;
   send a test WhatsApp Photoquote and a test email.
6. **Google:**
   - add the site to Google Search Console and submit `https://www.refacegroup.co.uk/sitemap.xml`
   - check the website link on the Google Business Profile is `https://www.refacegroup.co.uk`
7. **Recommended:** verify the domain in GitHub (Settings → Pages → Verified domains), so no one else can use it on GitHub.

---

## Nice to have (not needed to launch)

- **Enquiries straight to email:** the contact form currently opens WhatsApp or email on the customer's phone, which works.
  To get enquiries delivered to info@ instead, make a free form at formspree.io (free plan: 50 a month)
  and paste its link into `form.endpoint` in `js/config.js`.
- **Monday hours:** Google says 10–4 but the WhatsApp Business profile says 9–4. The site follows Google; Reface should fix one of them.
- **Real bathroom photo** for the Colour Studio (the current one is AI-made and labelled "Visualisation").
- **More before & after photos:** the same spot photographed before and after a job makes the best slider.
- **Their logo file** (SVG or PNG), if they want the exact logo instead of the matching text logo.
- **Review count:** update `googleReviewCount` in `js/config.js` every month or so (173 on 2 Nov 2026).
- **Ownership:** the site lives on Zain's GitHub. Agree with Reface whether it stays there (Zain looks after it)
  or moves to a Reface GitHub account later.

## Costs

| Item | Cost |
| --- | --- |
| Hosting (GitHub Pages) | £0 |
| Domain refacegroup.co.uk | Already paid by Reface |
| Contact form to email (Formspree, optional) | £0 on the free plan |
| Old website hosting | Can usually be cancelled after launch |
