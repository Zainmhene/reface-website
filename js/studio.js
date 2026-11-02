/* REFACE — Colour Studio (home page only)
   Pick a room, tap a colour dot on the photo (or swipe it) and the new colour wipes across.
   The photos are real brochure rooms recoloured with our real colours (assets/img/studio/).
   The bathroom photo is AI-made (no Reface bathroom photos yet), so it is labelled as a visualisation.
   Colour names and swatch colours come from the Classic & Contemporary brochures. */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
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
    const stage = $(".cs-stage", root), a = $(".cs-a", stage), b = $(".cs-b", stage), line = $(".cs-line", stage);
    const dots = $(".cs-dots", root), stylesEl = $(".cs-styles", root), hint = $(".cs-hint", root);
    const tabs = $$(".cs-tabs button", root);
    let room = "kitchen", idx = 0, busy = false, touched = false;
    const styleIdx = { kitchen: 0, bedroom: 0, bathroom: 0 };
    const style = () => STUDIO[room][styleIdx[room]];
    const url = (s, c, w) => `${s.base}${c.id}-${w}.webp`;
    const srcset = (s, c) => `${url(s, c, 900)} 900w, ${url(s, c, 1600)} 1600w`;
    const SIZES = "(min-width: 1240px) 1240px, 100vw";
    const setImg = (img, s, c) => {
      img.sizes = SIZES; img.srcset = srcset(s, c); img.src = url(s, c, 1600);
      img.alt = `${ROOM[room][0].toUpperCase() + ROOM[room].slice(1)} in ${c.name}`;
    };
    const preload = (s) => s.colours.forEach((c) => { const im = new Image(); im.sizes = SIZES; im.srcset = srcset(s, c); im.src = url(s, c, 1600); });

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
    function showScene() {
      const s = style();
      stage.style.setProperty("--pos", s.pos);
      stage.classList.add("switching");
      setImg(a, s, s.colours[idx]);
      b.style.clipPath = "inset(0 0 0 100%)";
      const done = () => stage.classList.remove("switching");
      a.complete && a.naturalWidth ? done() : a.addEventListener("load", done, { once: true });
      preload(s);
    }
    // The wipe: the new photo is revealed from one side, with a thin light line on its edge
    const paint = (t, dir) => {
      if (dir > 0) { b.style.clipPath = `inset(0 0 0 ${((1 - t) * 100).toFixed(2)}%)`; line.style.left = `${(1 - t) * 100}%`; }
      else { b.style.clipPath = `inset(0 ${((1 - t) * 100).toFixed(2)}% 0 0)`; line.style.left = `${t * 100}%`; }
      line.style.opacity = t > 0.001 && t < 0.999 ? 1 : 0;
    };
    function goTo(k, auto) {
      const s = style(), n = s.colours.length;
      k = (k + n) % n;
      if (busy || k === idx) return;
      if (!auto && !touched) { touched = true; hint.classList.add("gone"); }
      const dir = k > idx ? 1 : -1;
      idx = k; updateLabel();
      busy = true;
      setImg(b, s, s.colours[k]); paint(0, dir);
      const finish = async () => {
        setImg(a, s, s.colours[k]);
        try { await a.decode(); } catch (e) { /* ignore */ }
        b.style.clipPath = "inset(0 0 0 100%)"; line.style.opacity = 0; busy = false;
      };
      const run = () => {
        if (reduceMotion) { finish(); return; }
        const t0 = performance.now(), dur = auto ? 1100 : 650;
        const tick = (now) => { const p = clamp((now - t0) / dur, 0, 1); paint(1 - Math.pow(1 - p, 3), dir); p < 1 ? requestAnimationFrame(tick) : finish(); };
        requestAnimationFrame(tick);
      };
      b.complete && b.naturalWidth ? run() : b.addEventListener("load", run, { once: true });
    }

    tabs.forEach((t) => t.addEventListener("click", () => {
      if (t.dataset.room === room || busy) return;
      touched = true; hint.classList.add("gone");
      room = t.dataset.room; idx = 0; renderChrome(); showScene();
    }));
    stylesEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button"); if (!btn || busy) return;
      const k = +btn.dataset.k; if (k === styleIdx[room]) return;
      touched = true;
      styleIdx[room] = k; idx = 0; renderChrome(); showScene();
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

    renderChrome(); showScene();

    // When the studio first comes into view: load the other colours, then play one slow wipe
    // to show visitors the photo changes. Only once, and never after they've touched it.
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      STUDIO.kitchen.forEach(preload);
      setTimeout(() => STUDIO.bedroom.forEach(preload), 2000);
      if (!reduceMotion) setTimeout(() => { if (!touched && room === "kitchen" && idx === 0) goTo(3, true); }, 1400);
    }, { threshold: 0.55 });
    io.observe(stage);
  }

  document.addEventListener("DOMContentLoaded", initStudio);
})();
