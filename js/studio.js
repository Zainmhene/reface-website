/* REFACE — Colour Studio (home page only)
   Pick a room, tap a colour dot on the photo (or swipe it) and the new colour wipes across.
   The photos are real brochure rooms recoloured with our real colours (assets/img/studio/).
   The bathroom photo is AI-made (no Reface bathroom photos yet), so it is labelled as a visualisation.
   Colour names and swatch colours come from the Classic & Contemporary brochures. */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const CFG = window.REFACE || {};
  const BIZ = CFG.business || {};

  // [id, name, swatch colour]. Oak colours also have a wood-grain tile.
  const col = (list, tile) => list.map(([id, name, hex]) => ({ id, name, hex, tile: tile ? `assets/img/swatches/vinyl-${id}.webp` : "" }));
  const OAKS = col([
    ["parisian-blue-oak", "Parisian Blue Oak", "#355169"], ["indigo-oak", "Indigo Oak", "#19384c"], ["graphite-oak", "Graphite Oak", "#3b3d3b"],
    ["reed-green-oak", "Reed Green Oak", "#869787"], ["stone-grey-oak", "Stone Grey Oak", "#a79d91"], ["dust-grey-oak", "Dust Grey Oak", "#959391"],
    ["cashmere-oak", "Cashmere Oak", "#d2cac1"], ["light-casella-oak", "Light Casella Oak", "#d1ba90"], ["light-grey-oak", "Light Grey Oak", "#cfd0cc"],
    ["mussel-oak", "Mussel Oak", "#e4dfd5"], ["ivory-oak", "Ivory Oak", "#faf6ef"], ["white-oak", "White Oak", "#f2f3f3"]
  ], true);
  const GLOSS = col([
    ["parisian-blue", "Parisian Blue", "#39546e"], ["indigo", "Indigo", "#1d2e42"], ["graphite", "Graphite", "#454948"],
    ["metallic-anthracite", "Metallic Anthracite", "#706f75"], ["dust-grey", "Dust Grey", "#9ea1a2"], ["metallic-blue", "Metallic Blue", "#9ca9af"],
    ["reed-green", "Reed Green", "#8ba195"], ["cashmere", "Cashmere", "#dfd6cf"], ["metallic-champagne", "Metallic Champagne", "#c1b3aa"],
    ["light-grey", "Light Grey", "#d6d7d2"], ["white", "White", "#f4f5f6"]
  ]);
  const MATT = col([
    ["parisian-blue", "Parisian Blue", "#39546e"], ["indigo", "Indigo", "#1d2f40"], ["graphite", "Graphite", "#444a47"],
    ["black", "Black", "#272b29"], ["fir-green", "Fir Green", "#234031"], ["reed-green", "Reed Green", "#90a496"],
    ["dust-grey", "Dust Grey", "#9ea1a2"], ["stone-grey", "Stone Grey", "#a9a196"], ["light-grey", "Light Grey", "#d2d3d1"],
    ["cashmere", "Cashmere", "#d5cdc4"], ["pale-cream", "Pale Cream", "#f2eee5"], ["white", "White", "#f5f6f7"]
  ]);

  const STUDIO = {
    kitchen: [
      { label: "Shaker", base: "assets/img/studio/hero-", pos: "70% 50%", range: "Vinyl · Alnwick door", finish: "",
        note: "In-frame shaker doors with a real oak grain, made to measure for your units.", colours: OAKS },
      { label: "Handleless", base: "assets/img/studio/kitchen-", pos: "64% 50%", range: "Glacier High Gloss", finish: "gloss",
        note: "Mirror-like gloss doors with laser edging, so there are no visible joins.", colours: GLOSS }
    ],
    bedroom: [
      { label: "Fitted wardrobes", base: "assets/img/studio/bedroom-", pos: "30% 50%", range: "Vinyl · Matfen door", finish: "",
        note: "Floor-to-ceiling wardrobes and drawers, made to measure for your room.", colours: OAKS }
    ],
    bathroom: [
      { label: "Vanity & storage", base: "assets/img/studio/bathroom-", pos: "58% 50%", range: "Glacier Super Matt", finish: "",
        note: "Vanity units and tall storage in the same colours as our kitchens. This bathroom is a visualisation, not one of our jobs.", colours: MATT }
    ]
  };
  const ROOM = { kitchen: "kitchen", bedroom: "fitted bedroom", bathroom: "fitted bathroom" };

  function initStudio() {
    const root = $("[data-studio]");
    if (!root) return;
    const stage = $(".cs-stage", root), a = $(".cs-a", stage), wrap = $(".cs-wipe", stage), b = $(".cs-b", stage), line = $(".cs-line", stage);
    const dots = $(".cs-dots", root), stylesEl = $(".cs-styles", root), hint = $(".cs-hint", root);
    const tabs = $$(".cs-tabs button", root);
    let room = "kitchen", idx = 0, busy = false, touched = false, next = null, started = false;
    const styleIdx = { kitchen: 0, bedroom: 0, bathroom: 0 };
    const style = () => STUDIO[room][styleIdx[room]];
    const url = (s, c, w) => `${s.base}${c.id}-${w}.webp`;
    const setAlt = (img, c) => (img.alt = `${ROOM[room][0].toUpperCase() + ROOM[room].slice(1)} in ${c.name}`);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    /* ---- Loading photos (the reason it used to lag) ----
       Each colour has a small photo (900px, ~20–50 KB) and a sharp one (1600px, ~50–120 KB).
       - A tap shows the small one straight away (it downloads in a blink), then the sharp one
         is swapped in quietly once it has arrived.
       - Other colours download one at a time in the background, nearest colours first,
         and pause whenever the visitor taps, so a tap never waits in a queue.
       - Nothing downloads until the section is close to the screen. */
    const ready = new Set();
    const load = (src) => new Promise((res) => {
      if (ready.has(src)) return res(src);
      const im = new Image();
      im.onload = () => { ready.add(src); res(src); };
      im.onerror = () => res(src);
      im.src = src;
    });
    const sharpNeeded = () => Math.max(stage.clientWidth, stage.clientHeight * 1.6) * (window.devicePixelRatio || 1) > 1000;
    const best = (s, c) => (ready.has(url(s, c, 1600)) ? url(s, c, 1600) : url(s, c, 900));
    const same = (s, c) => style() === s && s.colours[idx] === c;

    // Background downloads: one at a time. A tap cancels the one in progress (it's put back in the
    // queue) so the photo the visitor asked for gets the whole connection.
    let queue = [], pumping = false, bg = null, fg = 0;
    function bgLoad(src) {
      return new Promise((res) => {
        const im = new Image();
        bg = { im, src, res };
        im.onload = () => { ready.add(src); bg = null; res(); };
        im.onerror = () => { bg = null; res(); };
        im.src = src;
      });
    }
    function pauseBg(keep) {
      if (!bg || bg.src === keep) return;
      const { im, src, res } = bg; bg = null;
      im.onload = im.onerror = null; im.src = ""; // stops the download
      queue.unshift(src); res();
    }
    async function fgLoad(src) {
      fg++; pauseBg(src);
      await load(src);
      fg--; if (!fg) pump();
      return src;
    }
    // Once the sharp version of the photo on screen has arrived, swap it in quietly
    async function swapSharp() {
      const s = style(), c = s.colours[idx], big = url(s, c, 1600);
      if (busy || !ready.has(big) || a.getAttribute("src") === big) return;
      const im = new Image(); im.src = big;
      try { await im.decode(); } catch (e) { /* ignore */ }
      if (same(s, c) && !busy) a.src = big;
    }
    function preloadAround() {
      const s = style(), n = s.colours.length, order = [];
      for (let d = 1; d < n; d++) order.push((idx + d) % n, (idx - d + n) % n);
      const sharp = sharpNeeded();
      queue = [
        ...[...new Set(order)].map((k) => url(s, s.colours[k], 900)), // every other colour, small (so taps are quick)
        ...(sharp ? [url(s, s.colours[idx], 1600)] : []),       // then the photo on screen, sharp
        ...(sharp ? [1, -1, 2, -2].map((d) => url(s, s.colours[(idx + d + n) % n], 1600)) : []) // then its neighbours, sharp
      ];
      pump(); swapSharp();
    }
    async function pump() {
      if (pumping) return;
      pumping = true;
      while (queue.length && !fg) {
        const src = queue.shift();
        if (!ready.has(src)) { await bgLoad(src); swapSharp(); }
      }
      pumping = false;
    }
    // Taps that arrive mid-wipe are remembered and played straight after (the last one wins)
    const runNext = () => { const f = next; next = null; if (f) f(); };

    function renderChrome() {
      const s = style();
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.room === room)));
      stylesEl.innerHTML = STUDIO[room].length > 1
        ? STUDIO[room].map((st, k) => `<button type="button" aria-pressed="${k === styleIdx[room]}" data-k="${k}">${esc(st.label)}</button>`).join("")
        : "";
      dots.innerHTML = s.colours.map((c, k) =>
        `<button type="button" class="cs-dot${s.finish === "gloss" ? " gloss" : ""}" role="radio" aria-checked="${k === idx}" aria-label="${esc(c.name)}" title="${esc(c.name)}" data-k="${k}" style="--c:${c.hex};${c.tile ? `background-image:url('${c.tile}');` : ""}"></button>`
      ).join("");
      updateLabel();
    }
    function updateLabel() {
      const s = style(), c = s.colours[idx];
      $(".cs-range", root).textContent = s.range;
      $(".cs-name", root).textContent = c.name;
      $(".cs-note", root).textContent = s.note;
      // "Photoquote in this colour": opens WhatsApp with the room, style and colour filled in
      const msg = `Hi Reface, I'd like a free Photoquote. I like the ${ROOM[room]} in ${c.name} (${s.range}). Here are some photos of my room:`;
      $(".cs-cta", root).href = `https://wa.me/${BIZ.whatsapp || "447457403407"}?text=${encodeURIComponent(msg)}`;
      $$(".cs-dot", dots).forEach((d, k) => d.setAttribute("aria-checked", String(k === idx)));
      const on = dots.children[idx];
      if (on) dots.scrollTo({ left: on.offsetLeft - dots.clientWidth / 2 + on.clientWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
    }

    // New room or style: show its first colour (small photo first if the sharp one isn't here yet)
    async function showScene() {
      const s = style(), c = s.colours[idx];
      stage.style.setProperty("--pos", s.pos);
      const src = best(s, c);
      busy = true;
      if (!ready.has(src)) stage.classList.add("switching");
      await fgLoad(src);
      a.src = src; setAlt(a, c);
      try { await a.decode(); } catch (e) { /* ignore */ }
      stage.classList.remove("switching");
      busy = false;
      if (next) return runNext();
      preloadAround();
    }

    // The wipe: the new photo slides in from one side behind a thin light line.
    // It moves with transforms, which phones animate smoothly on the graphics chip.
    function wipe(dir, dur) {
      wrap.classList.toggle("from-left", dir < 0);
      wrap.classList.add("on");
      if (reduceMotion || !wrap.animate) return Promise.resolve();
      const opts = { duration: dur, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" };
      const w = wrap.animate([{ transform: `translateX(${dir > 0 ? 100 : -100}%)` }, { transform: "translateX(0)" }], opts);
      const i = b.animate([{ transform: `translateX(${dir > 0 ? -100 : 100}%)` }, { transform: "translateX(0)" }], opts);
      const l = line.animate([{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], opts);
      return w.finished.then(() => { w.cancel(); i.cancel(); l.cancel(); }, () => {});
    }

    async function goTo(k, auto) {
      const s = style(), n = s.colours.length;
      k = (k + n) % n;
      if (busy) { next = () => goTo(k); return; }
      if (k === idx) return;
      if (!auto && !touched) { touched = true; hint.classList.add("gone"); }
      const dir = k > idx ? 1 : -1, c = s.colours[k];
      idx = k; updateLabel();
      busy = true;
      const dot = dots.children[k];
      const spin = setTimeout(() => dot && dot.classList.add("loading"), 150); // only if it takes a moment
      const src = await fgLoad(best(s, c));
      clearTimeout(spin); dot && dot.classList.remove("loading");
      b.src = src; setAlt(b, c);
      try { await b.decode(); } catch (e) { /* ignore */ }
      await wipe(dir, auto ? 1000 : 500);
      a.src = src; setAlt(a, c);
      try { await a.decode(); } catch (e) { /* ignore */ }
      wrap.classList.remove("on");
      busy = false;
      if (next) return runNext();
      preloadAround();
    }

    const switchTo = (r, k) => {
      if (busy) { next = () => switchTo(r, k); return; }
      touched = true; hint.classList.add("gone");
      room = r; if (k != null) styleIdx[room] = k;
      idx = 0; renderChrome(); showScene();
    };
    tabs.forEach((t) => t.addEventListener("click", () => { if (t.dataset.room !== room) switchTo(t.dataset.room); }));
    stylesEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button"); if (!btn) return;
      const k = +btn.dataset.k; if (k !== styleIdx[room]) switchTo(room, k);
    });
    dots.addEventListener("click", (e) => { const d = e.target.closest(".cs-dot"); if (d) goTo(+d.dataset.k); });
    stage.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") goTo(idx + 1); if (e.key === "ArrowLeft") goTo(idx - 1); });
    // Swipe across the photo (a mostly-vertical drag still scrolls the page)
    let sx = 0, sy = 0, down = false;
    stage.addEventListener("pointerdown", (e) => { if (e.target.closest(".cs-dots")) return; down = true; sx = e.clientX; sy = e.clientY; });
    stage.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) { down = false; return; }
      if (Math.abs(dx) > 42) { down = false; goTo(idx + (dx < 0 ? 1 : -1)); }
    });
    ["pointerup", "pointercancel"].forEach((ev) => stage.addEventListener(ev, () => (down = false)));
    stage.addEventListener("dragstart", (e) => e.preventDefault());

    renderChrome();
    stage.style.setProperty("--pos", style().pos);
    setAlt(a, style().colours[0]);
    ready.add(a.getAttribute("src")); // the first photo is in the page already (it loads as the section nears)

    // When the visitor is about two screens away: start the quiet background loading.
    // When it's properly in view: play one slow wipe to show visitors the photo changes
    // (only once, and never after they've touched it).
    const near = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting || started) return;
      started = true; near.disconnect();
      preloadAround();
    }, { rootMargin: "1500px 0px" }); // about two screens before it
    near.observe(stage);
    const seen = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      seen.disconnect();
      if (!reduceMotion) setTimeout(() => { if (!touched && room === "kitchen" && idx === 0) goTo(3, true); }, 1400);
    }, { threshold: 0.55 });
    seen.observe(stage);
  }

  document.addEventListener("DOMContentLoaded", initStudio);
})();
