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

    // TODO (confirm with Reface): the WhatsApp number for the Photoquote service.
    // Their Google listing has a WhatsApp button; ask which number it uses.
    // International format, digits only, no + or spaces. e.g. 447700900123
    whatsapp: "441914563718",

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
    // Google review, copied word for word (posted about August 2026). Surname shortened on the site.
    { name: "Jacqueline S.", rating: 5, date: "Google review, 2026", room: "Kitchen & bathroom",
      text: "I can’t recommend Reface enough after the work on the design and installation of our kitchen and bathroom. Kev and Neil kept us informed of the whole process from start to finish. The lads who did the installation on both the kitchen and bathroom were excellent. Everything was tidied at the end of each day and all rubbish and materials taken away. Their attention to detail was brilliant. I absolutely love my new kitchen and bathroom." }
  ],
  googleRating: null,      // e.g. 4.9  (TODO: overall rating from the Google listing)
  googleReviewCount: null, // e.g. 87   (TODO: number of reviews from the Google listing)

  /* OUR WORK (gallery page) — real Reface jobs only. Two kinds:
     1. Before & after: put both photos in assets/img/work/ (same size and angle works best), then add:
        { title: "Kitchen makeover", place: "South Shields", before: "assets/img/work/job2-before.jpg", after: "assets/img/work/job2-after.jpg", note: "New doors in Reed Green" }
     2. Finished photos only: a list of photos (each saved as name-1000.webp and name-500.webp), like job 1 below.
        "review" is the number of a review in the list above (0 = the first) to show with the photos. */
  work: [
    { title: "Kitchen & bathroom", note: "Designed and installed by Reface",
      // From the customer's Google review. TODO: Reface to confirm she's happy for us to use them.
      credit: "Photos from Jacqueline S.’s Google review",
      review: 0,
      photos: [
        { src: "assets/img/work/job1-1", alt: "Galley kitchen with white shaker doors, black bar handles and a dark worktop" },
        { src: "assets/img/work/job1-2", alt: "Looking down the new kitchen towards the new bathroom" },
        { src: "assets/img/work/job1-3", alt: "Gas hob and built-in oven between white shaker units and metro tiles" },
        { src: "assets/img/work/job1-4", alt: "Wall units with a built-in microwave and black bar handles" },
        { src: "assets/img/work/job1-5", alt: "Bathroom with a navy wall-hung vanity unit and grey wall panels" },
        { src: "assets/img/work/job1-6", alt: "Bath with a navy bath panel beside the navy vanity unit" },
        { src: "assets/img/work/job1-7", alt: "Bath with a glass shower screen, rainfall shower and chrome towel rail" }
      ] }
  ]
};
