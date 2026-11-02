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
  reviews: [],
  googleRating: null,      // e.g. 4.9
  googleReviewCount: null, // e.g. 87

  /* BEFORE & AFTER — real Reface jobs only. Put the two photos in assets/img/work/
     (same size and angle works best), then add a line like this:
     { title: "Kitchen makeover", place: "South Shields", before: "assets/img/work/job1-before.jpg", after: "assets/img/work/job1-after.jpg", note: "New doors in Reed Green" }
     While the list is empty, the page says photos are coming soon. */
  work: []
};
