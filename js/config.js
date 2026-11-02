/* ============================================================
   REFACE — SITE SETTINGS
   This is the one file to edit for business details, prices,
   reviews and where enquiries go. No coding knowledge needed:
   change the text between the quotes and save.
   ============================================================ */
window.REFACE = {
  business: {
    name: "Reface",
    legalName: "Reface Group",
    website: "https://www.refacegroup.co.uk",
    phoneDisplay: "(0191) 456 3718",
    phoneLink: "+441914563718",
    email: "info@refacegroup.co.uk",
    // TODO (confirm with Reface): the WhatsApp number for the Photoquote service.
    // Their Google listing has a WhatsApp button, so ask which number it uses.
    // International format, digits only, no + or spaces. e.g. 447700900123
    whatsapp: "441914563718",
    hours: [
      { days: "Monday – Thursday", time: "10am – 4pm" },
      { days: "Friday", time: "9am – 4pm" },
      { days: "Saturday", time: "10am – 2pm" },
      { days: "Sunday", time: "Closed" }
    ],
    // Hours above are from the Google Business listing. Their old website said
    // "Lines open Mon–Fri 9am–5pm, Sat 10am–3pm" — TODO: confirm which is right.
    address: "85 Westoe Rd, South Shields NE33 4LU",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Reface+85+Westoe+Rd+South+Shields+NE33+4LU",
    area: "South Shields and nearby areas",
    googleReviewsUrl: "https://share.google/85vLoGir77iD04as1"
  },

  /* Where enquiries are sent.
     Leave endpoint empty and enquiries open in WhatsApp or email instead.
     Formspree: create a free form at formspree.io and paste its URL here,
       e.g. "https://formspree.io/f/abcdwxyz"
     Web3Forms: endpoint "https://api.web3forms.com/submit" plus your accessKey. */
  form: {
    endpoint: "",
    accessKey: ""
  },

  /* AI visualiser. Turns on when the site is hosted on Vercel with a
     GEMINI_API_KEY environment variable (see README). */
  visualiser: {
    endpoint: "/api/visualise"
  },

  /* GOOGLE REVIEWS — paste real reviews here, copied word for word from Google.
     Never write or edit reviews yourself. Leave the list empty to show a
     "Read our reviews on Google" card instead.
     Example:
     { name: "Sarah M.", rating: 5, date: "October 2026", text: "Exact review text…", room: "Kitchen" } */
  reviews: [],
  googleRating: null,      // e.g. 4.9
  googleReviewCount: null, // e.g. 87

  /* ============================================================
     PRICE GUIDE
     ⚠ PLACEHOLDER PRICES — these are typical UK makeover prices,
     NOT Reface's real prices. Replace every number with Reface's
     price list and then set pricesConfirmed to true.
     All prices are supply + fit, in pounds, including VAT.
     ============================================================ */
  pricesConfirmed: false,
  pricing: {
    rangeLow: 0.9,   // estimate shown as total × 0.9 …
    rangeHigh: 1.15, // … to total × 1.15
    roundTo: 50,

    kitchen: {
      sizes: {
        // fronts = doors + drawer fronts, metres = worktop length
        small:  { label: "Small",       note: "Galley or compact, about 12 doors & drawers", fronts: 12, metres: 3, finishing: 180 },
        medium: { label: "Medium",      note: "L-shaped, about 20 doors & drawers",          fronts: 20, metres: 5, finishing: 260 },
        large:  { label: "Large",       note: "U-shaped or with an island, about 28",        fronts: 28, metres: 7, finishing: 340 },
        xl:     { label: "Extra large", note: "Big kitchen-diner, 36 or more",               fronts: 36, metres: 9, finishing: 420 }
      },
      perFront: { vinyl: 55, supermatt: 70, gloss: 70 },  // per door or drawer front
      handlesPerFront: { keep: 0, standard: 6, designer: 14 },
      softClosePerFront: 6,
      worktopPerMetre: { none: 0, laminate: 95, quartz: 380, granite: 360 },
      splashback: { none: 0, hob: 300, full: 180 /* per metre of worktop */ },
      sinkTap: 350,
      lighting: 280 // under-cabinet LED
    },

    bedroom: {
      perMetre: { vinyl: 520, supermatt: 600, gloss: 600 }, // fitted wardrobes, per metre of width
      extras: {
        overhead: { label: "Over-bed units", price: 450 },
        dressing: { label: "Dressing table", price: 550 },
        drawers: { label: "Chest of drawers", price: 450 },
        bedsides: { label: "Pair of bedside cabinets", price: 400 },
        mirror: { label: "Mirror door", price: 150 },
        lighting: { label: "Wardrobe LED lighting", price: 250 }
      }
    },

    bathroom: {
      vanity: { none: 0, "600": 550, "800": 700, "1000": 850 },
      extras: {
        tall: { label: "Tall storage unit", price: 450 },
        wc: { label: "Back-to-wall toilet unit", price: 550 },
        mirror: { label: "Mirror cabinet", price: 300 },
        worktop: { label: "Matching worktop", price: 250 }
      }
    }
  }
};
