/* ============================================================
   REFACE — SITE SETTINGS
   The one file to edit for business details, reviews, before & after
   photos and where enquiries go. Change the text between the quotes and save.
   ============================================================ */
window.REFACE = {
  business: {
    name: "Reface",
    phoneDisplay: "(0191) 456 3718",
    phoneLink: "+441914563718",

    // From their current website (refacegroup.co.uk). If this is ever emptied, email links are hidden.
    email: "info@refacegroup.co.uk",

    // WhatsApp for the Photoquote service: Reface's verified WhatsApp Business account (from its profile).
    // International format, digits only, no + or spaces.
    whatsapp: "447457403407",
    whatsappDisplay: "07457 403407",

    // Opening hours: from the Google Business listing.
    hours: [
      { days: "Monday – Thursday", time: "10am – 4pm" },
      { days: "Friday", time: "9am – 4pm" },
      { days: "Saturday", time: "10am – 2pm" },
      { days: "Sunday", time: "Closed" }
    ],
    // Phone lines: from their current website ("Lines Open Mon-Fri 9am-5pm, Sat 10am-3pm").
    phoneLines: "Mon–Fri 9am–5pm, Sat 10am–3pm",
    address: "85 Westoe Rd, South Shields NE33 4LU",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Reface+85+Westoe+Rd+South+Shields+NE33+4LU",
    area: "South Shields and nearby areas",
    googleReviewsUrl: "https://share.google/85vLoGir77iD04as1"
  },

  /* The message that opens in WhatsApp when someone taps "Free Photoquote". */
  photoquoteMessage: "Hi Reface, I'd like a free Photoquote. Here are some photos of my room:",

  /* Where enquiries from the contact form go.
     Leave endpoint empty and the form opens WhatsApp (and email, once it's filled in) instead.
     Formspree: create a free form at formspree.io and paste its URL, e.g. "https://formspree.io/f/abcdwxyz" */
  form: {
    endpoint: "",
    accessKey: ""
  },

  /* TESTIMONIALS — paste real reviews here, copied word for word from Google.
     Never write or edit reviews yourself. While the list is empty, the site shows a
     "Read our reviews on Google" card instead.
     Example:
     { name: "Sarah M.", rating: 5, date: "October 2026", text: "Exact review text…", room: "Kitchen" } */
  reviews: [
    // Real Google reviews, copied word for word from Zain's screenshots (November 2026). All 5 stars.
    // Surnames are shortened to an initial. The first three show on the home page (one kitchen, one bedroom, one bathroom).
    { name: "Kevin J.", rating: 5, date: "Google review, 2026", room: "Kitchen makeover",
      text: "We’ve just had our kitchen updated by Reface in South Shields and we couldn’t be happier with the result. They fitted new Balmoral blue doors with brass handles which look absolutely awesome, along with a stunning white quartz worktop and an InSinkErator waste disposal unit — it genuinely feels like a brand-new kitchen.\n\nThe lads who fitted everything were spot on. Friendly, professional, tidy, and clearly proud of their work. Nothing felt rushed and the finish is bang on.\n\nOne of the main reasons we went for a kitchen makeover rather than a full replacement was to avoid unnecessary waste. There was nothing wrong with the original units, and it made no sense throwing a perfectly good kitchen away when it could be brought back to life with new doors and handles — and Reface absolutely nailed that.\n\nOn top of that, the cost came in at around a third of what a completely new kitchen would’ve been, which just makes it even better value. Communication and support from start to finish was excellent too — clear, honest, and hassle-free.\n\nBrilliant service, fantastic result, and a really smart way to upgrade your kitchen. Would 100% recommend." },
    { name: "Robert", rating: 5, date: "Google review, 2026", room: "Bedroom",
      text: "Reface replaced all of the doors and wardrobe surfaces in our bedroom. They arranged replastering of wall surfaces and the ceiling. The standard of work was exceptional and the team of experienced professional tradespeople worked closely together to minimise disruption and ensure our expectations were always met. We were kept informed and consulted at every stage. Everything went to plan. Everyone turned up and left on time. We are very pleased with the result. Andy, the fitter, was a credit to his trade. The plasterers were faultless. I have no reservations in recommending this company." },
    { name: "Jacqueline S.", rating: 5, date: "Google review, 2026", room: "Kitchen & bathroom",
      text: "I can’t recommend Reface enough after the work on the design and installation of our kitchen and bathroom. Kev and Neil kept us informed of the whole process from start to finish. The lads who did the installation on both the kitchen and bathroom were excellent. Everything was tidied at the end of each day and all rubbish and materials taken away. Their attention to detail was brilliant. I absolutely love my new kitchen and bathroom." },
    { name: "Glynis B.", rating: 5, date: "Google review, 2026", room: "Kitchen",
      text: "I can’t praise this company enough I had my kitchen renovated two weeks ago and I am delighted with the results. The whole process from start to finish was very easy the whole Reface team we’re professionals they offered advice and were friendly. Thank you for doing such a great job ." },
    { name: "L.", rating: 5, date: "Google review, 2026", room: "Kitchen",
      text: "I can't thank Kevs team enough for transforming my kitchen, from my regular messages and calls nothing has been a problem for them. The lads carried out the work quickly and to such a high standard, at the end of each day all mess was cleared up and I was told what was the plans for the following day. Don't spend money on a new kitchen get a Reface makeover you won't regret it" },
    { name: "Christine F.", rating: 5, date: "Google review, 2026", room: "Kitchen",
      text: "Very helpful team with excellent workmanship from the fitters, plasterers etc. with all waste removed promptly! Altered part of the kitchen layout to accommodate integrated fridge freezer and managed to match up units beautifully! No hard sell and cannot thank the team at Reface enough!" },
    { name: "Jayn G.", rating: 5, date: "Google review, 2026", room: "Kitchen",
      text: "Our experience of working with Reface has been absolutely outstanding. From the outset, their communication was clear, regular and very helpful. As we were on a fairly tight timeline, they did their very best to facilitate this, even fitting the kitchen a week early. The units are smart, good quality and have given the effect of a ‘new’ kitchen at a fraction of the cost. The fitters did an excellent job, with everything left clean and tidy. Based on our experience, I would definitely recommend using Reface - thanks to all the team for an excellent service." },
    { name: "Karen B.", rating: 5, date: "Google review, 2025", room: "Kitchen",
      text: "My husband and I decided we wanted a new kitchen, but didn't want to pay the prices for a brand new back to brick kitchen, so we visited reface in South Shields. We spoke with both Kev and Neil. They helped us choose benches, flooring, cupboards, colours etc. they were very helpful and patient with us. Our kitchen was finished today and we're absolutely over the moon with every single thing. The guys that came to do removal of cupboards, plasterer, electrician and the actual fitters were amazing, every one of them. Very polite and friendly. I would recommend Reface to anyone - you won't regret it" },
    { name: "Judith H.", rating: 5, date: "Google review, 2025", room: "Kitchen",
      text: "Love love love our new kitchen, such a great transformation it looks brighter with a modern look.\nThe service we received from Kev and Neil was excellent from start to finish, very professional but relaxed and nothing was a problem, kept us up to date with regular office WhatsApp messages.\nThe fitters did a fantastic job and only took two days to fit the new doors and worktops, great workmanship and very tidy.\nWe will definitely recommend Re-face to others." }
  ],
  googleRating: null,      // e.g. 4.9  (TODO: overall rating from the Google listing)
  googleReviewCount: null, // e.g. 87   (TODO: number of reviews from the Google listing)

  /* OUR WORK (gallery page) — real Reface jobs only. Two kinds:
     1. Before & after: put both photos in assets/img/work/ (same size and angle works best), then add:
        { title: "Kitchen makeover", place: "South Shields", before: "assets/img/work/job2-before.jpg", after: "assets/img/work/job2-after.jpg", note: "New doors in Reed Green" }
     2. Finished photos only: a list of photos (each saved as name-1000.webp and name-500.webp), like the jobs below.
        Add wide: true when the photos are landscape.
        "review" is the name of a review in the list above to show with the photos. */
  work: [
    { title: "Dark grey shaker kitchen", note: "Cupboards, worktops and flooring chosen with Kev and Neil", wide: true,
      credit: "Photos from Karen B.’s Google review", review: "Karen B.",
      photos: [
        { src: "assets/img/work/job5-1", alt: "Dark grey shaker kitchen with marble-effect worktops, an L-shaped run and a built-in oven" },
        { src: "assets/img/work/job5-2", alt: "Dark grey shaker units and marble-effect worktop under the window, with a grey sink" },
        { src: "assets/img/work/job5-3", alt: "Corner of the kitchen with dark grey wall units, open shelving and marble-effect worktops" },
        { src: "assets/img/work/job5-4", alt: "The whole kitchen, with a breakfast bar and grey wood-effect flooring" },
        { src: "assets/img/work/job5-5", alt: "Another view of the kitchen and breakfast bar" }
      ] },
    { title: "Kitchen & bathroom", note: "Designed and installed by Reface",
      // Job photos come from customers' Google reviews. TODO: Reface to confirm the customers are happy for us to use them.
      credit: "Photos from Jacqueline S.’s Google review",
      review: "Jacqueline S.",
      photos: [
        { src: "assets/img/work/job1-1", alt: "Galley kitchen with white shaker doors, black bar handles and a dark worktop" },
        { src: "assets/img/work/job1-2", alt: "Looking down the new kitchen towards the new bathroom" },
        { src: "assets/img/work/job1-3", alt: "Gas hob and built-in oven between white shaker units and metro tiles" },
        { src: "assets/img/work/job1-4", alt: "Wall units with a built-in microwave and black bar handles" },
        { src: "assets/img/work/job1-5", alt: "Bathroom with a navy wall-hung vanity unit and grey wall panels" },
        { src: "assets/img/work/job1-6", alt: "Bath with a navy bath panel beside the navy vanity unit" },
        { src: "assets/img/work/job1-7", alt: "Bath with a glass shower screen, rainfall shower and chrome towel rail" }
      ] },
    { title: "Fitted bedroom", note: "New doors and wardrobe surfaces",
      credit: "Photos from Robert’s Google review", review: "Robert",
      photos: [
        { src: "assets/img/work/job2-1", alt: "White fitted wardrobes and drawers around a dressing area with dark geometric wallpaper" },
        { src: "assets/img/work/job2-2", alt: "White fitted wardrobes and overhead cupboards across a bedroom wall" }
      ] },
    { title: "Cream kitchen", note: "Part of the layout changed to fit an integrated fridge freezer",
      credit: "Photos from Christine F.’s Google review", review: "Christine F.",
      photos: [
        { src: "assets/img/work/job3-1", alt: "Cream kitchen doors with black metro tiles, a gas hob and built-in oven" },
        { src: "assets/img/work/job3-2", alt: "Cream kitchen units with chrome handles above a grey sink and black metro tiles" }
      ] },
    { title: "White kitchen", note: "New doors and worktops, fitted in two days",
      credit: "Photo from Judith H.’s Google review", review: "Judith H.",
      photos: [
        { src: "assets/img/work/job4-1", alt: "Bright kitchen with white doors, glass-fronted wall cabinets and stone-effect worktops" }
      ] }
  ]
};
