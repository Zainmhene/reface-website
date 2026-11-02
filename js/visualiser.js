/* REFACE — AI Visualiser
   1. The customer adds a photo (we shrink it on their phone before sending).
   2. They choose a room, door style, up to 3 colours and a handle finish.
   3. We ask our server (/api/visualise) for one AI design per colour.
   4. If the AI isn't switched on yet (or anything fails), we offer to send
      the photo to Reface on WhatsApp instead. We never show fake results. */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const CAT = window.REFACE_CATALOGUE || { vinyl: [], supermatt: [], gloss: [], doors: [] };
  const CFG = window.REFACE || {};
  const R = () => window.Reface || {};
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const ICON_SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>';
  const ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

  const MAX_SIDE = 1280;     // longest side of the photo we send
  const MAX_COLOURS = 3;
  const TIMEOUT_MS = 75000;

  // Sensible starting choices for each room (customers can change them)
  const DEFAULTS = {
    kitchen: { door: "Alnwick", colours: ["ultra-matt-reed-green", "ultra-matt-graphite", "ultra-matt-cashmere"] },
    bedroom: { door: "Matfen", colours: ["ultra-matt-indigo", "ultra-matt-stone-grey", "ultra-matt-pale-cream"] },
    bathroom: { door: "Premier", colours: ["ultra-matt-parisian-blue", "ultra-matt-white-grey", "graphite-oak"] }
  };
  const ROOM_LABEL = { kitchen: "Kitchen", bedroom: "Bedroom", bathroom: "Bathroom" };

  // Every colour in one list, so we can find them by id
  const ALL = [];
  [["vinyl", "Vinyl"], ["supermatt", "Glacier Super Matt"], ["gloss", "Glacier High Gloss"]].forEach(([key, range]) => {
    (CAT[key] || []).forEach((c) => ALL.push({ key: key + ":" + c.id, id: c.id, range: key, rangeName: range, name: c.name, hex: c.hex, tile: c.tile || "" }));
  });
  const byKey = (k) => ALL.find((c) => c.key === k);
  // url() inside a CSS variable is resolved from the stylesheet's folder, so use full URLs
  const chipBg = (c) => (c.tile ? `url('${new URL(c.tile, document.baseURI).href}') ${c.hex}` : c.hex);
  const vinylKey = (id) => "vinyl:" + id;

  const state = {
    room: "kitchen",
    door: DEFAULTS.kitchen.door,
    colours: DEFAULTS.kitchen.colours.map(vinylKey).filter(byKey),
    coloursTouched: false,
    handle: "Brushed brass",
    range: "vinyl",
    photo: null,        // { base64, mimeType, dataUrl, file }
    busy: false,
    results: []         // [{ colour, dataUrl }]
  };

  let els = {};

  /* ---------- Photo ---------- */
  function showPhotoError(msg) {
    els.photoErr.hidden = !msg;
    if (msg) $("span", els.photoErr).textContent = msg;
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve({ img, url });
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode")); };
      img.src = url;
    });
  }

  async function handleFile(file) {
    if (!file) return;
    showPhotoError("");
    if (file.type && !file.type.startsWith("image/")) { showPhotoError("That file isn't a photo. Please choose a JPG or PNG image."); return; }
    try {
      const { img, url } = await loadImage(file);
      const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
      const shareFile = blob ? new File([blob], "my-room.jpg", { type: "image/jpeg" }) : file;
      state.photo = { base64: dataUrl.split(",")[1], mimeType: "image/jpeg", dataUrl, file: shareFile };
      els.preview.src = dataUrl; els.preview.hidden = false;
      els.change.hidden = false;
      els.drop.classList.add("has-photo");
      updateGo();
    } catch (e) {
      showPhotoError("Sorry, we couldn't open that photo. Try a JPG or PNG, or take a new photo with your camera.");
    }
  }

  /* ---------- Options ---------- */
  function renderDoors() {
    els.doors.innerHTML = (CAT.doors || []).map((name) =>
      `<button type="button" data-door="${esc(name)}" aria-pressed="${name === state.door}"><img src="assets/img/doors/${slug(name)}.webp" alt="" loading="lazy" width="113" height="203">${esc(name)}</button>`
    ).join("");
    els.doorName.textContent = state.door;
  }

  function renderColours() {
    const list = ALL.filter((c) => c.range === state.range);
    els.colours.innerHTML = list.map((c) => {
      const bg = chipBg(c);
      const label = c.name.replace(/^(High Gloss|Super Matt) /, "");
      return `<button type="button" class="${c.range === "gloss" ? "gloss" : ""}" data-key="${esc(c.key)}" aria-pressed="${state.colours.includes(c.key)}" style="--chip:${bg}"><i></i>${esc(label)}</button>`;
    }).join("");
    $$("#vis-range button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.range === state.range)));
  }

  function renderPicked() {
    if (!state.colours.length) {
      els.picked.innerHTML = `<span class="empty">No colours chosen yet. Tap up to three below.</span>`;
    } else {
      els.picked.innerHTML = state.colours.map((k) => {
        const c = byKey(k);
        const bg = chipBg(c);
        return `<span class="pick" style="--chip:${bg}"><i></i>${esc(c.name)}<button type="button" data-remove="${esc(k)}" aria-label="Remove ${esc(c.name)}">×</button></span>`;
      }).join("");
    }
    updateGo();
  }

  function toggleColour(key) {
    els.limit.hidden = true;
    const i = state.colours.indexOf(key);
    if (i >= 0) state.colours.splice(i, 1);
    else {
      if (state.colours.length >= MAX_COLOURS) { state.colours.shift(); els.limit.hidden = false; }
      state.colours.push(key);
    }
    state.coloursTouched = true;
    renderColours(); renderPicked();
  }

  function setRoom(room) {
    state.room = room;
    $$("#vis-room button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.room === room)));
    state.door = DEFAULTS[room].door;
    if (!state.coloursTouched) { state.colours = DEFAULTS[room].colours.map(vinylKey).filter(byKey); state.range = "vinyl"; }
    renderDoors(); renderColours(); renderPicked();
  }

  function updateGo() {
    const n = state.colours.length;
    const ready = !!state.photo && n > 0 && !state.busy;
    els.go.disabled = !ready;
    $("span", els.go).textContent = state.busy ? "Creating your designs…" : `Create my ${n || ""} design${n === 1 ? "" : "s"}`.replace("my  ", "my ");
    els.goNote.textContent = !state.photo ? "Add a photo first, then create your designs."
      : !n ? "Pick at least one colour."
      : "Takes about 10–30 seconds. Your photo isn't stored.";
  }

  /* ---------- Text we send to Reface (WhatsApp / email) ---------- */
  function summaryText() {
    const names = state.colours.map((k) => byKey(k).name).join(", ");
    return [
      "Hi Reface, I've used the AI Visualiser on your website.",
      `Room: ${ROOM_LABEL[state.room]}`,
      `Door style: ${state.door}`,
      `Colours: ${names || "not sure yet"}`,
      `Handles: ${state.handle}`,
      "",
      "Could you mock up my room and send me a free Photoquote? Here's my photo:"
    ].join("\n");
  }

  /* ---------- Generate ---------- */
  function showOutput() {
    els.output.hidden = false;
    els.output.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function shimmerCards(colours) {
    els.results.innerHTML = colours.map((c) => `
      <article class="vis-card"><div class="vc-img"><div class="shimmer">Designing ${esc(c.name)}…</div></div>
      <div class="vc-body"><span class="vc-name"><i style="--chip:${c.hex}"></i><b>${esc(c.name)}</b></span></div></article>`).join("");
  }

  async function requestDesign(colour) {
    const endpoint = (CFG.visualiser && CFG.visualiser.endpoint) || "";
    if (!endpoint || location.protocol === "file:") { const e = new Error("not_configured"); e.fallback = true; throw e; }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    let res;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          image: state.photo.base64, mimeType: state.photo.mimeType,
          room: state.room, door: state.door,
          colour: { name: colour.name, hex: colour.hex },
          handle: state.handle
        }),
        signal: ctrl.signal
      });
    } catch (err) {
      // Network failure or no server: treat as "not switched on yet"
      const e = new Error(err.name === "AbortError" ? "timeout" : "network"); e.fallback = err.name !== "AbortError"; throw e;
    } finally { clearTimeout(timer); }
    let data = {};
    try { data = await res.json(); } catch (_) { /* not JSON */ }
    if (res.status === 404 || res.status === 405 || res.status === 501 || data.error === "not_configured") {
      const e = new Error("not_configured"); e.fallback = true; throw e;
    }
    if (!res.ok || !data.image) { const e = new Error(data.error || "failed"); e.fallback = false; throw e; }
    return { colour, dataUrl: `data:${data.mimeType || "image/png"};base64,${data.image}` };
  }

  async function generate() {
    if (state.busy || !state.photo || !state.colours.length) return;
    state.busy = true; updateGo();
    const colours = state.colours.map(byKey);
    els.fallback.hidden = true; els.compare.hidden = true;
    els.outTitle.innerHTML = "Creating your <em>designs…</em>";
    shimmerCards(colours);
    showOutput();

    const settled = await Promise.allSettled(colours.map(requestDesign));
    state.busy = false; updateGo();

    const ok = settled.filter((s) => s.status === "fulfilled").map((s) => s.value);
    const anyFallback = settled.some((s) => s.status === "rejected" && s.reason && s.reason.fallback);

    if (!ok.length) {
      els.results.innerHTML = "";
      if (anyFallback) { showFallback(); return; }
      els.outTitle.innerHTML = "Sorry, that <em>didn't work.</em>";
      showFallback("error");
      return;
    }

    state.results = ok;
    els.outTitle.innerHTML = "Pick your <em>favourite.</em>";
    els.results.innerHTML = settled.map((s, k) => {
      const c = colours[k];
      if (s.status !== "fulfilled") {
        return `<article class="vis-card"><div class="vc-img"><div class="vc-fail">We couldn't create the ${esc(c.name)} design this time. Try again in a moment.</div></div>
          <div class="vc-body"><span class="vc-name"><i style="--chip:${c.hex}"></i><b>${esc(c.name)}</b></span></div></article>`;
      }
      const quote = `estimate.html?room=${state.room}&finish=${c.range}&colour=${encodeURIComponent(c.name)}`;
      return `<article class="vis-card" data-k="${k}">
        <div class="vc-img"><img src="${s.value.dataUrl}" alt="Your ${ROOM_LABEL[state.room].toLowerCase()} with ${esc(state.door)} doors in ${esc(c.name)}"><button type="button" data-compare="${k}" aria-label="Compare ${esc(c.name)} with your photo"></button></div>
        <div class="vc-body"><span class="vc-name"><i style="--chip:${c.hex}"></i><b>${esc(c.name)}</b></span><span class="muted small">${esc(state.door)}</span></div>
        <div class="vc-actions">
          <a class="btn btn-sm" href="${quote}">Get a quote for this</a>
          <a class="btn btn-sm btn-ghost" href="${s.value.dataUrl}" download="reface-${slug(c.name)}.png">Save image</a>
        </div></article>`;
    }).join("");
    const first = settled.findIndex((s) => s.status === "fulfilled");
    openCompare(first, settled);
  }

  function openCompare(k, settled) {
    const s = settled ? settled[k] : null;
    const card = $(`.vis-card[data-k="${k}"]`, els.results);
    if (!card) return;
    const img = $(".vc-img img", card);
    els.baBefore.src = state.photo.dataUrl;
    els.baAfter.src = img.src;
    els.baLabel.textContent = $(".vc-name b", card).textContent;
    $$(".vis-card", els.results).forEach((c) => c.classList.toggle("active", c === card));
    els.compare.hidden = false;
    const input = $("input[type=range]", els.ba);
    input.value = 50; els.ba.style.setProperty("--x", "50%");
    if (!s) els.compare.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- Fallback: send the photo to Reface instead ---------- */
  function showFallback(kind) {
    const waHref = R().waLink ? R().waLink(summaryText() + "\n\n(I'll attach my photo below.)") : "#";
    const mailHref = R().mailLink ? R().mailLink("AI Visualiser: please mock up my room", summaryText() + "\n\n(I'll attach my photo to this email.)") : "#";
    const title = kind === "error" ? "We couldn't create your designs right now." : "AI previews are being switched on.";
    els.outTitle.innerHTML = kind === "error" ? "Sorry, that <em>didn't work.</em>" : "We'll design it <em>for you.</em>";
    els.fallback.innerHTML = `
      <div class="vis-fallback">
        <div class="notice">${ICON_SPARK}<div>
          <b>${title}</b>
          In the meantime, our design team will mock up your room for free. Send us your photo on WhatsApp with your choices below, and we'll come back with your designs and a price.
        </div></div>
        <div class="vis-fallback-photo"><img src="${state.photo ? state.photo.dataUrl : ""}" alt="Your photo"><p>${esc(ROOM_LABEL[state.room])} · ${esc(state.door)} doors · ${esc(state.colours.map((k) => byKey(k).name).join(", "))} · ${esc(state.handle)} handles</p></div>
        <div class="btn-row">
          <button class="btn btn-whatsapp" type="button" id="vis-share">${ICON_WA} Share photo to WhatsApp</button>
          <a class="btn btn-ghost" href="${mailHref}">Email us instead</a>
        </div>
        <p class="muted small mb-0" id="vis-share-note">On iPhone, choose WhatsApp from the share menu. If WhatsApp opens without your photo, tap the paperclip to attach it.</p>
      </div>`;
    els.fallback.hidden = false;
    $("#vis-share").addEventListener("click", () => sharePhoto(waHref));
  }

  async function sharePhoto(waHref) {
    const text = summaryText();
    const file = state.photo && state.photo.file;
    if (file && navigator.canShare && navigator.share) {
      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text, title: "My room for Reface" });
          return;
        }
      } catch (e) {
        if (e && e.name === "AbortError") return; // they closed the share sheet
      }
    }
    window.open(waHref, "_blank", "noopener");
  }

  /* ---------- Wire up ---------- */
  function init() {
    els = {
      drop: $("#vis-drop"), file: $("#vis-file"), preview: $("#vis-preview"), change: $("#vis-change"), photoErr: $("#vis-photo-error"),
      doors: $("#vis-doors"), doorName: $("#vis-door-name"), colours: $("#vis-colours"), picked: $("#vis-picked"), limit: $("#vis-limit"),
      go: $("#vis-generate"), goNote: $("#vis-go-note"),
      output: $("#vis-output"), outTitle: $("#vis-out-title"), fallback: $("#vis-fallback"), results: $("#vis-results"),
      compare: $("#vis-compare"), ba: $("#vis-ba"), baBefore: $("#vis-ba-before"), baAfter: $("#vis-ba-after"), baLabel: $("#vis-ba-label")
    };
    if (!els.drop) return;

    els.file.addEventListener("change", () => handleFile(els.file.files[0]));
    ["dragenter", "dragover"].forEach((t) => els.drop.addEventListener(t, () => els.drop.classList.add("drag")));
    ["dragleave", "drop"].forEach((t) => els.drop.addEventListener(t, () => els.drop.classList.remove("drag")));

    $("#vis-room").addEventListener("click", (e) => { const b = e.target.closest("button[data-room]"); if (b) setRoom(b.dataset.room); });
    els.doors.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-door]"); if (!b) return;
      state.door = b.dataset.door;
      $$("button", els.doors).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      els.doorName.textContent = state.door;
    });
    $("#vis-range").addEventListener("click", (e) => { const b = e.target.closest("button[data-range]"); if (b) { state.range = b.dataset.range; renderColours(); } });
    els.colours.addEventListener("click", (e) => { const b = e.target.closest("button[data-key]"); if (b) toggleColour(b.dataset.key); });
    els.picked.addEventListener("click", (e) => { const b = e.target.closest("button[data-remove]"); if (b) toggleColour(b.dataset.remove); });
    $("#vis-handle").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-handle]"); if (!b) return;
      state.handle = b.dataset.handle;
      $$("#vis-handle button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    });
    els.go.addEventListener("click", generate);
    els.results.addEventListener("click", (e) => { const b = e.target.closest("button[data-compare]"); if (b) openCompare(+b.dataset.compare); });
    const range = $("input[type=range]", els.ba);
    range.addEventListener("input", () => els.ba.style.setProperty("--x", range.value + "%"));

    // Allow ?room=bedroom links from other pages
    const qRoom = new URLSearchParams(location.search).get("room");
    if (qRoom && DEFAULTS[qRoom]) setRoom(qRoom);
    else { renderDoors(); renderColours(); renderPicked(); }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
