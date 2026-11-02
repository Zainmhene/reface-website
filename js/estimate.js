/* REFACE — Price guide (estimator)
   How it works, in plain English:
   1. `state` remembers every answer the visitor gives.
   2. The steps for the chosen room are drawn into #est-steps.
   3. Every time an answer changes we work out the price again (calcKitchen / calcBedroom / calcBathroom)
      using the numbers in js/config.js, and redraw the summary card.
   All prices come from REFACE.pricing in js/config.js — change them there, not here. */
(function () {
  "use strict";
  const CFG = window.REFACE || {};
  const P = CFG.pricing || {};
  const CAT = window.REFACE_CATALOGUE || {};
  const esc = window.Reface ? window.Reface.esc : (s) => String(s ?? "");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Fixed labels ---------- */
  const ROOMS = {
    kitchen: { label: "Kitchen makeover", sub: "New doors, worktops, handles and splashbacks", img: "assets/img/kitchens/turnberry-cashmere-800.webp" },
    bedroom: { label: "Fitted bedroom", sub: "Made-to-measure wardrobes and furniture", img: "assets/img/bedrooms/glacier-super-matt-fir-green-800.webp" },
    bathroom: { label: "Fitted bathroom", sub: "Vanity units and bathroom storage", img: "assets/img/studio/bathroom-parisian-blue-900.webp" }
  };
  const RANGES = {
    vinyl: { label: "Vinyl", sub: "20 door styles, from shaker to in-frame, in any of 29 colours", img: { kitchen: "kitchens/portree-reed-green", bedroom: "bedrooms/hampton-graphite", bathroom: "kitchens/portree-reed-green" } },
    supermatt: { label: "Glacier Super Matt", sub: "Smooth, velvety slab doors with laser-sealed edges", img: { kitchen: "kitchens/glacier-super-matt-black", bedroom: "bedrooms/glacier-super-matt-fir-green", bathroom: "kitchens/glacier-super-matt-white" } },
    gloss: { label: "Glacier High Gloss", sub: "Mirror-like acrylic slab doors with laser-sealed edges", img: { kitchen: "kitchens/glacier-high-gloss-parisian-blue", bedroom: "bedrooms/glacier-high-gloss-cashmere", bathroom: "kitchens/glacier-high-gloss-white" } }
  };
  const HANDLES = {
    keep: { label: "Keep my handles", sub: "Re-use the handles you have" },
    standard: { label: "New standard handles", sub: "Bar, D, knob or shell handles in chrome, nickel, black or brass" },
    designer: { label: "Designer handles", sub: "Statement pieces like Manor, Linea, Plato or Edge" }
  };
  const WORKTOPS = {
    none: { label: "Keep my worktops", sub: "Just change the doors and drawers" },
    laminate: { label: "Laminate", sub: "Hard-wearing, in stone, wood and plain effects" },
    quartz: { label: "Quartz", sub: "Premium engineered stone, made to measure" },
    granite: { label: "Granite", sub: "Natural stone, every slab unique" }
  };
  const SPLASH = {
    none: { label: "No glass splashback" },
    hob: { label: "Behind the hob", sub: "One panel of toughened glass" },
    full: { label: "Full run", sub: "Along the whole worktop" }
  };
  const VANITY = { none: "No vanity unit", "600": "600mm vanity unit", "800": "800mm vanity unit", "1000": "1000mm+ vanity unit" };

  /* ---------- The visitor's answers (with sensible defaults) ---------- */
  const state = {
    room: "kitchen",
    kitchen: { size: "medium", fronts: 20, range: "vinyl", colour: "", handles: "standard", worktop: "none", softClose: false, splashback: "none", sink: false, lighting: false },
    bedroom: { width: 2.5, range: "vinyl", colour: "", extras: {}, mirrors: 0 },
    bathroom: { vanity: "800", range: "vinyl", colour: "", extras: {}, refit: false }
  };

  /* ---------- Read the link the visitor arrived from, e.g. estimate.html?room=bedroom&finish=gloss&colour=Indigo ---------- */
  const params = new URLSearchParams(location.search);
  const startRoom = params.get("room");
  if (ROOMS[startRoom]) state.room = startRoom;
  const startFinish = params.get("finish");
  if (RANGES[startFinish]) state[state.room].range = startFinish;
  const startColour = params.get("colour");
  if (startColour) {
    const match = findColour(state[state.room].range, startColour);
    if (match) state[state.room].colour = match.name;
  }

  // Finds a colour in the brochure list. "Parisian Blue" matches "High Gloss Parisian Blue".
  function findColour(range, name) {
    const list = CAT[range] || [];
    const n = String(name).toLowerCase();
    return list.find((c) => c.name.toLowerCase() === n) || list.find((c) => c.name.toLowerCase().endsWith(" " + n));
  }

  /* ---------- Money helpers ---------- */
  const money = (n) => "£" + Math.round(n).toLocaleString("en-GB");
  const roundTo = (n) => Math.round(n / (P.roundTo || 50)) * (P.roundTo || 50);
  function range(total) {
    const low = Math.max(P.roundTo || 50, roundTo(total * (P.rangeLow || 0.9)));
    const high = Math.max(low, roundTo(total * (P.rangeHigh || 1.15)));
    return { low, high, text: `${money(low)} – ${money(high)}` };
  }

  /* ---------- Price calculations (one per room) ----------
     Each returns { lines: [{ label, amount, note }], choices: "short summary" } */
  function nearestKitchenSize(fronts) {
    const sizes = P.kitchen.sizes;
    return Object.values(sizes).reduce((best, s) => (Math.abs(s.fronts - fronts) < Math.abs(best.fronts - fronts) ? s : best));
  }
  function kitchenFronts() {
    const s = state.kitchen, preset = P.kitchen.sizes[s.size];
    return preset ? preset.fronts : s.fronts;
  }

  function calcKitchen() {
    const K = P.kitchen, s = state.kitchen;
    const preset = K.sizes[s.size] || nearestKitchenSize(s.fronts); // "exact" uses the closest size for panels and worktop length
    const fronts = kitchenFronts();
    const metres = preset.metres;
    const lines = [];
    lines.push({ label: `${fronts} doors & drawer fronts, ${RANGES[s.range].label}`, amount: fronts * K.perFront[s.range] });
    lines.push({ label: "End panels, plinths & cornice", amount: preset.finishing });
    if (s.handles !== "keep") lines.push({ label: `${fronts} ${s.handles === "designer" ? "designer" : "new"} handles`, amount: fronts * K.handlesPerFront[s.handles] });
    if (s.softClose) lines.push({ label: "Soft-close hinges & runners", amount: fronts * K.softClosePerFront });
    if (s.worktop !== "none") lines.push({ label: `${WORKTOPS[s.worktop].label} worktops (about ${metres}m)`, amount: metres * K.worktopPerMetre[s.worktop] });
    if (s.splashback === "hob") lines.push({ label: "Glass splashback behind the hob", amount: K.splashback.hob });
    if (s.splashback === "full") lines.push({ label: `Glass splashback, full run (about ${metres}m)`, amount: K.splashback.full * metres });
    if (s.sink) lines.push({ label: "New sink & tap", amount: K.sinkTap });
    if (s.lighting) lines.push({ label: "Under-cabinet LED lighting", amount: K.lighting });
    const size = K.sizes[s.size] ? K.sizes[s.size].label + " kitchen" : `${fronts} doors & drawers`;
    return { lines, choices: [size, RANGES[s.range].label, shortColour(s.colour)].filter(Boolean).join(" · ") };
  }

  function calcBedroom() {
    const B = P.bedroom, s = state.bedroom;
    const lines = [{ label: `Fitted wardrobes, ${s.width}m wide, ${RANGES[s.range].label}`, amount: s.width * B.perMetre[s.range] }];
    Object.keys(B.extras).forEach((key) => {
      if (key === "mirror") return; // mirror doors have their own counter below
      if (s.extras[key]) lines.push({ label: B.extras[key].label, amount: B.extras[key].price });
    });
    if (s.mirrors > 0) lines.push({ label: `${s.mirrors} mirror door${s.mirrors > 1 ? "s" : ""}`, amount: s.mirrors * B.extras.mirror.price });
    return { lines, choices: [`${s.width}m of wardrobes`, RANGES[s.range].label, shortColour(s.colour)].filter(Boolean).join(" · ") };
  }

  function calcBathroom() {
    const T = P.bathroom, s = state.bathroom;
    const lines = [];
    if (s.vanity !== "none") lines.push({ label: VANITY[s.vanity], amount: T.vanity[s.vanity] });
    Object.keys(T.extras).forEach((key) => { if (s.extras[key]) lines.push({ label: T.extras[key].label, amount: T.extras[key].price }); });
    if (s.refit) lines.push({ label: "Full bathroom refit", amount: 0, note: "After survey" });
    return { lines, choices: [RANGES[s.range].label, shortColour(s.colour)].filter(Boolean).join(" · ") };
  }

  const calc = () => ({ kitchen: calcKitchen, bedroom: calcBedroom, bathroom: calcBathroom }[state.room]());

  /* ---------- Small HTML builders ---------- */
  function radio(field, value, title, sub, checked, opts = {}) {
    const img = opts.img ? `<img class="opt-img" src="${esc(opts.img)}" alt="" loading="lazy">` : "";
    const price = opts.price ? `<span class="opt-price">${esc(opts.price)}</span>` : "";
    return `<label class="opt"><input type="radio" name="f-${field}" data-field="${field}" value="${esc(value)}"${checked ? " checked" : ""}>
      <span class="opt-body">${img}<span><span class="opt-title">${esc(title)}</span>${sub ? `<span class="opt-sub">${esc(sub)}</span>` : ""}</span>${price}</span></label>`;
  }
  function check(attr, title, sub, checked, price) {
    return `<label class="opt opt-check"><input type="checkbox" ${attr}${checked ? " checked" : ""}>
      <span class="opt-body"><span><span class="opt-title">${esc(title)}</span>${sub ? `<span class="opt-sub">${esc(sub)}</span>` : ""}</span>${price ? `<span class="opt-price">${esc(price)}</span>` : ""}</span></label>`;
  }
  function stepper(key, value, unit, label) {
    return `<div class="est-stepper-row"><span class="est-stepper-label">${esc(label)}</span>
      <div class="stepper" role="group" aria-label="${esc(label)}">
        <button type="button" data-stepper="${key}" data-delta="-1" aria-label="Less">−</button>
        <output data-out="${key}" aria-live="polite">${esc(value)}${unit}</output>
        <button type="button" data-stepper="${key}" data-delta="1" aria-label="More">+</button>
      </div></div>`;
  }
  function colourChips() {
    const r = state[state.room];
    const list = CAT[r.range] || [];
    const gloss = r.range === "gloss" ? " gloss" : "";
    const chips = list.map((c) => {
      const bg = c.tile ? `background-image:url('${esc(c.tile)}');` : "";
      return `<button type="button" class="${gloss.trim()}" data-colour="${esc(c.name)}" aria-pressed="${c.name === r.colour}"><i style="--chip:${esc(c.hex)};${bg}"></i>${esc(c.name.replace(/^(High Gloss|Super Matt) /, ""))}</button>`;
    }).join("");
    return `<div class="est-colour-head"><span class="est-sub-h">Colour <span class="hint">(optional)</span></span>
      <button type="button" class="est-unsure" data-colour="" aria-pressed="${!r.colour}">Not sure yet</button></div>
      <div class="chip-grid est-chips">${chips}</div>`;
  }
  const per = (n, unit) => `${money(n)} ${unit}`;
  const shortColour = (name) => String(name || "").replace(/^(High Gloss|Super Matt) /, "");

  /* ---------- Step definitions ---------- */
  function stepRoom() {
    return {
      id: "room", title: "Which room are we <em>transforming?</em>", intro: "Pick one to start. You can always come back and price another.",
      html: `<div class="opt-grid">${Object.entries(ROOMS).map(([k, r]) => radio("room", k, r.label, r.sub, state.room === k, { img: r.img })).join("")}</div>`
    };
  }

  function stepsKitchen() {
    const K = P.kitchen, s = state.kitchen;
    const sizeOpts = Object.entries(K.sizes).map(([k, z]) => radio("size", k, z.label, z.note, s.size === k)).join("")
      + radio("size", "exact", "I know my exact number", "Count every door and drawer front", s.size === "exact");
    return [
      { id: "size", title: "How big is your <em>kitchen?</em>", intro: "Count doors and drawer fronts together. A rough idea is fine.",
        html: `<div class="opt-grid cols-2">${sizeOpts}</div>
          <div data-show-exact${s.size === "exact" ? "" : " hidden"}>${stepper("fronts", s.fronts, "", "Doors + drawer fronts")}</div>` },
      { id: "doors", title: "Choose your <em>doors.</em>", intro: "Every door is made to measure. Pick a range, then a colour if you have one in mind.",
        html: `<div class="opt-grid">${Object.entries(RANGES).map(([k, r]) => radio("range", k, r.label, r.sub, s.range === k, { img: `assets/img/${r.img.kitchen}-800.webp`, price: per(K.perFront[k], "/ door") })).join("")}</div>
          <div data-colours>${colourChips()}</div>` },
      { id: "finish", title: "Handles &amp; <em>worktops.</em>", intro: "New handles and worktops finish the look. Keep your own to save money.",
        html: `<h3 class="est-sub-h">Handles</h3>
          <div class="opt-grid">${Object.entries(HANDLES).map(([k, h]) => radio("handles", k, h.label, h.sub, s.handles === k, { price: K.handlesPerFront[k] ? `+${money(K.handlesPerFront[k])} each` : "" })).join("")}</div>
          <h3 class="est-sub-h">Worktops</h3>
          <div class="opt-grid cols-2">${Object.entries(WORKTOPS).map(([k, w]) => radio("worktop", k, w.label, w.sub, s.worktop === k, { price: K.worktopPerMetre[k] ? per(K.worktopPerMetre[k], "/ m") : "" })).join("")}</div>` },
      { id: "extras", title: "Any <em>extras?</em>", intro: "Optional finishing touches. Tick anything you'd like priced.",
        html: `<div class="opt-grid">
            ${check('data-field="softClose"', "Soft-close hinges & runners", "Doors and drawers close quietly", s.softClose, `+${money(K.softClosePerFront)} each`)}
            ${check('data-field="sink"', "New sink & tap", "Supplied and fitted", s.sink, `+${money(K.sinkTap)}`)}
            ${check('data-field="lighting"', "Under-cabinet LED lighting", "Soft light over your worktops", s.lighting, `+${money(K.lighting)}`)}
          </div>
          <h3 class="est-sub-h">Glass splashback <span class="hint">20 colours, or match any RAL colour</span></h3>
          <div class="opt-grid cols-3">${Object.entries(SPLASH).map(([k, o]) => radio("splashback", k, o.label, o.sub || "", s.splashback === k, { price: k === "hob" ? `+${money(K.splashback.hob)}` : k === "full" ? per(K.splashback.full, "/ m") : "" })).join("")}</div>` }
    ];
  }

  function stepsBedroom() {
    const B = P.bedroom, s = state.bedroom;
    return [
      { id: "width", title: "How wide are your <em>wardrobes?</em>", intro: "Measure the wall you'd like to fill, wall to wall. A rough guess is fine.",
        html: `${stepper("width", s.width, "m", "Wardrobe width")}<p class="small muted">Most double bedrooms have 2–3m of wardrobes. Sloped ceilings and alcoves are no problem.</p>` },
      { id: "doors", title: "Choose your <em>doors.</em>", intro: "Pick a range, then a colour if you have one in mind.",
        html: `<div class="opt-grid">${Object.entries(RANGES).map(([k, r]) => radio("range", k, r.label, r.sub, s.range === k, { img: `assets/img/${r.img.bedroom}-800.webp`, price: per(B.perMetre[k], "/ m") })).join("")}</div>
          <div data-colours>${colourChips()}</div>` },
      { id: "extras", title: "Complete the <em>room.</em>", intro: "Add matching furniture. Tick anything you'd like priced.",
        html: `<div class="opt-grid">${Object.entries(B.extras).filter(([k]) => k !== "mirror").map(([k, x]) => check(`data-extra="${k}"`, x.label, "", !!s.extras[k], `+${money(x.price)}`)).join("")}</div>
          ${stepper("mirrors", s.mirrors, "", `Mirror doors (+${money(B.extras.mirror.price)} each)`)}` }
    ];
  }

  function stepsBathroom() {
    const T = P.bathroom, s = state.bathroom;
    return [
      { id: "vanity", title: "Choose a <em>vanity unit.</em>", intro: "The cabinet under your basin. Measure the space you have.",
        html: `<div class="opt-grid cols-2">${Object.keys(T.vanity).map((k) => radio("vanity", k, VANITY[k], k === "none" ? "I don't need one" : "", s.vanity === k, { price: T.vanity[k] ? money(T.vanity[k]) : "" })).join("")}</div>` },
      { id: "doors", title: "Choose your <em>look.</em>", intro: "Bathroom furniture comes in the same door styles and colours. Your choice doesn't change the guide price.",
        html: `<div class="opt-grid">${Object.entries(RANGES).map(([k, r]) => radio("range", k, r.label, r.sub, s.range === k, { img: `assets/img/${r.img.bathroom}-800.webp` })).join("")}</div>
          <div data-colours>${colourChips()}</div>` },
      { id: "extras", title: "Any <em>extras?</em>", intro: "Tick anything you'd like priced.",
        html: `<div class="opt-grid">${Object.entries(T.extras).map(([k, x]) => check(`data-extra="${k}"`, x.label, "", !!s.extras[k], `+${money(x.price)}`)).join("")}
          ${check('data-field="refit"', "Full bathroom refit", "New suite, tiling and plumbing. Priced after a free survey", s.refit, "Survey")}</div>` }
    ];
  }

  /* ---------- Drawing the steps ---------- */
  const stepsBox = $("#est-steps");
  const contactStep = $("#step-contact");
  const progress = $(".est-progress");
  const countText = $(".est-count");
  const backBtn = $('[data-nav="back"]');
  const nextBtn = $('[data-nav="next"]');
  let current = 0;

  function allSteps() { return $$(".est-step", $("#est-panel")); }

  function renderSteps() {
    const roomSteps = { kitchen: stepsKitchen, bedroom: stepsBedroom, bathroom: stepsBathroom }[state.room]();
    stepsBox.innerHTML = [stepRoom(), ...roomSteps].map((st) => `
      <div class="est-step" data-step="${st.id}">
        <h2 tabindex="-1">${st.title}</h2>
        <p>${esc(st.intro)}</p>
        ${st.html}
      </div>`).join("");
    showStep(current, false);
  }

  function showStep(i, focus = true) {
    const steps = allSteps();
    current = clamp(i, 0, steps.length - 1);
    steps.forEach((el, k) => el.classList.toggle("active", k === current));
    progress.innerHTML = steps.map((_, k) => `<i class="${k <= current ? "on" : ""}"></i>`).join("");
    countText.textContent = `Step ${current + 1} of ${steps.length}`;
    backBtn.hidden = current === 0;
    const last = current === steps.length - 1;
    nextBtn.hidden = last;
    nextBtn.innerHTML = current === steps.length - 2
      ? 'Get my quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
      : 'Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    if (focus) {
      const panel = $("#est-panel");
      const top = panel.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
      steps[current].querySelector("h2")?.focus({ preventScroll: true });
    }
  }

  /* ---------- Summary card ---------- */
  function estimateText(result, r) {
    const s = state[state.room];
    const out = [`PRICE GUIDE: ${ROOMS[state.room].label}`];
    if (result.choices) out.push(result.choices);
    if (state.room === "kitchen") out.push(`Handles: ${HANDLES[s.handles].label} · Worktops: ${WORKTOPS[s.worktop].label}`);
    result.lines.forEach((l) => out.push(`- ${l.label}: ${l.note || money(l.amount)}`));
    out.push(r ? `Guide price: ${r.text}` : "Guide price: to be confirmed after a survey");
    if (!CFG.pricesConfirmed) out.push("(Example prices from the website price guide)");
    return out.join("\n");
  }

  function update() {
    const result = calc();
    const total = result.lines.reduce((sum, l) => sum + l.amount, 0);
    const r = total > 0 ? range(total) : null;
    const hasSurvey = result.lines.some((l) => l.note);
    const totalText = r ? r.text : hasSurvey ? "After survey" : "Pick an option";

    $("[data-sum-room]").textContent = ROOMS[state.room].label;
    $("[data-sum-choices]").textContent = result.choices;
    $("[data-sum-total]").textContent = totalText;
    $("[data-mobile-total]").textContent = totalText;
    $("[data-sum-lines]").innerHTML = result.lines.length
      ? result.lines.map((l) => `<li><span>${esc(l.label)}</span><b>${esc(l.note || money(l.amount))}</b></li>`).join("")
      : `<li><span>Nothing chosen yet</span><b>—</b></li>`;

    // Pass the estimate to the enquiry form and the WhatsApp button
    const text = estimateText(result, r);
    const form = $("form[data-enquiry]");
    if (form) form._extra = () => ({ estimate: text, interest: ROOMS[state.room].label });
    const wa = $("#est-wa");
    if (wa && window.Reface) wa.href = window.Reface.waLink(`Hi Reface, I used the price guide on your website.\n\n${text}\n\nHere are some photos of my room:`);
  }

  /* ---------- Reacting to the visitor ---------- */
  stepsBox.addEventListener("change", (e) => {
    const el = e.target;
    const s = state[state.room];
    const field = el.dataset.field;
    if (field === "room") {
      state.room = el.value;
      renderSteps();
      update();
      return;
    }
    if (el.dataset.extra) s.extras[el.dataset.extra] = el.checked;
    else if (el.type === "checkbox") s[field] = el.checked;
    else if (field) s[field] = el.value;

    if (field === "size") { const box = $("[data-show-exact]"); if (box) box.hidden = el.value !== "exact"; }
    if (field === "range") {
      // Keep the colour only if it exists in the new range
      if (s.colour && !(CAT[s.range] || []).some((c) => c.name === s.colour)) {
        const same = findColour(s.range, s.colour.replace(/^(High Gloss|Super Matt|Ultra Matt) /, ""));
        s.colour = same ? same.name : "";
      }
      const box = $("[data-colours]", el.closest(".est-step"));
      if (box) box.innerHTML = colourChips();
    }
    update();
  });

  stepsBox.addEventListener("click", (e) => {
    const s = state[state.room];
    const chip = e.target.closest("[data-colour]");
    if (chip) {
      s.colour = chip.dataset.colour;
      $$("[data-colour]", stepsBox).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.colour === s.colour)));
      update();
      return;
    }
    const btn = e.target.closest("[data-stepper]");
    if (btn) {
      const key = btn.dataset.stepper, d = +btn.dataset.delta;
      // Limits for each counter: [smallest, largest, step size, unit]
      const rules = { fronts: [4, 80, 1, ""], width: [1, 6, 0.5, "m"], mirrors: [0, 6, 1, ""] };
      const [min, max, stepSize, unit] = rules[key];
      s[key] = clamp(Math.round((s[key] + d * stepSize) * 2) / 2, min, max);
      const out = $(`[data-out="${key}"]`, stepsBox);
      if (out) out.textContent = s[key] + unit;
      update();
    }
  });

  backBtn.addEventListener("click", () => showStep(current - 1));
  nextBtn.addEventListener("click", () => showStep(current + 1));

  // Make sure the "Send photos on WhatsApp" link keeps our text after site.js sets up links
  document.addEventListener("DOMContentLoaded", () => {
    const note = $(".est-placeholder");
    if (note && !CFG.pricesConfirmed) {
      note.innerHTML = `<div class="notice"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>Example prices. Reface will confirm the final price list.</span></div>`;
    }
    update();
  });

  // On phones, hide the small price bar while the full breakdown card is on screen
  const bar = $(".mobile-total"), card = $("#est-summary");
  if (bar && card && "IntersectionObserver" in window) {
    new IntersectionObserver((en) => bar.classList.toggle("tucked", en[0].isIntersecting), { threshold: 0.15 }).observe(card);
  }

  // Start: if the visitor came from a link that already chose a room, skip the room question.
  current = startRoom && ROOMS[startRoom] ? 1 : 0;
  renderSteps();
  update();
})();
