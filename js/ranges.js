/* REFACE — range pages (kitchens, bedrooms, bathrooms)
   Builds the colour chips, the door designer and the bathroom colour preview
   from the catalogue in js/catalogue.js. */
(function () {
  "use strict";
  const CAT = window.REFACE_CATALOGUE;
  if (!CAT) return;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const RANGE_LABEL = { vinyl: "Vinyl", supermatt: "Glacier Super Matt", gloss: "Glacier High Gloss" };
  // Short colour name without the range prefix, e.g. "High Gloss White" -> "White"
  const shortName = (c) => c.name.replace(/^(High Gloss|Super Matt) /, "");
  const doorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // One chip (a little door-shaped colour sample). Vinyl chips use the real texture photo.
  function chip(c, range, pressed) {
    const bg = range === "vinyl" && c.tile ? `background-image:url('${c.tile}')` : "";
    return `<button type="button" class="${range === "gloss" ? "gloss" : ""}" data-range="${range}" data-id="${c.id}" aria-pressed="${pressed ? "true" : "false"}" title="${esc(c.name)}">
      <i style="--chip:${c.hex};${bg}"></i>${esc(range === "vinyl" ? c.name.replace("Ultra Matt ", "") : shortName(c))}</button>`;
  }

  /* ---------- Door designer ---------- */
  const designerEl = $("[data-designer]");
  const state = { range: "vinyl", style: "Alnwick", colour: "parisian-blue-oak", handle: "Brushed brass", handleColour: "#c9a46a" };

  function renderDesigner() {
    if (!designerEl) return;
    const room = designerEl.dataset.room;
    const list = CAT[state.range];
    let col = list.find((c) => c.id === state.colour);
    if (!col) { col = list[0]; state.colour = col.id; }
    const isGlacier = state.range !== "vinyl";
    const styleName = isGlacier ? "Glacier slab" : state.style;

    // Preview
    const frame = $(".door-frame", designerEl);
    frame.style.setProperty("--door", col.hex);
    frame.classList.toggle("gloss", state.range === "gloss");
    $("img", frame).src = `assets/img/doors/tint-${isGlacier ? "premier" : doorId(state.style)}.webp`;
    const handle = $(".door-handle", frame);
    handle.style.display = state.handleColour ? "" : "none";
    handle.style.setProperty("--handle", state.handleColour || "transparent");
    $(".dd-name", designerEl).textContent = styleName;
    $(".dd-sub", designerEl).textContent = `${col.name} · ${state.handle}`;
    $(".dd-cta", designerEl).href = `estimate.html?room=${room}&finish=${state.range}&colour=${encodeURIComponent(col.name)}`;

    // Controls
    $$(".dd-range button", designerEl).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === state.range)));
    $(".dd-style-group", designerEl).style.display = isGlacier ? "none" : "";
    $$(".dd-styles button", designerEl).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === state.style)));
    $(".dd-colours", designerEl).innerHTML = list.map((c) => chip(c, state.range, c.id === state.colour)).join("");
    $$(".dd-handles button", designerEl).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === state.handle)));
  }

  function initDesigner() {
    if (!designerEl) return;
    $(".dd-styles", designerEl).innerHTML = CAT.doors.map((d) =>
      `<button type="button" data-v="${esc(d)}" aria-pressed="false"><img src="assets/img/doors/${doorId(d)}.webp" alt="" loading="lazy" width="113" height="203">${esc(d)}</button>`).join("");
    designerEl.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.closest(".dd-range")) state.range = b.dataset.v;
      else if (b.closest(".dd-styles")) state.style = b.dataset.v;
      else if (b.closest(".dd-colours")) state.colour = b.dataset.id;
      else if (b.closest(".dd-handles")) { state.handle = b.dataset.v; state.handleColour = b.dataset.c; }
      else return;
      renderDesigner();
    });
    renderDesigner();
  }

  /* ---------- Bathroom colour preview ---------- */
  const bath = $("[data-bath]");
  const bathState = { range: "supermatt", colour: "parisian-blue" };
  function renderBath() {
    if (!bath) return;
    const list = CAT[bathState.range];
    let col = list.find((c) => c.id === bathState.colour) || list[0];
    bathState.colour = col.id;
    bath.style.setProperty("--door", col.hex);
    $(".bath-name").textContent = col.name;
    $(".bath-cta").href = `estimate.html?room=bathroom&finish=${bathState.range}&colour=${encodeURIComponent(col.name)}`;
    $$("[data-bath-range] button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === bathState.range)));
    $("[data-bath-colours]").innerHTML = list.map((c) => chip(c, bathState.range, c.id === col.id)).join("");
  }
  function initBath() {
    if (!bath) return;
    $("[data-bath-range]").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { bathState.range = b.dataset.v; renderBath(); } });
    $("[data-bath-colours]").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { bathState.colour = b.dataset.id; renderBath(); } });
    renderBath();
  }

  /* ---------- Range chips: tap one to try it on the door (or the bathroom) ---------- */
  function initChips() {
    $$("[data-chips]").forEach((grid) => {
      const range = grid.dataset.chips;
      grid.innerHTML = CAT[range].map((c) => chip(c, range, false)).join("");
      grid.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (designerEl) {
          state.range = range; state.colour = b.dataset.id; renderDesigner();
          designerEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (bath) {
          bathState.range = range; bathState.colour = b.dataset.id; renderBath();
          $("#design").scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ---------- Splashback colours ---------- */
  function initSplash() {
    $$("[data-splash]").forEach((el) => {
      el.innerHTML = CAT.splashbacks.map((s) => {
        const bg = s.name === "Toughened Mirror" ? "linear-gradient(135deg,#f4f4f4,#b9bcbf 60%,#e9eaeb)" : s.hex;
        return `<span><i style="--chip:${s.hex};background:${bg}"></i>${esc(s.name)}</span>`;
      }).join("") + `<span><i style="background:conic-gradient(#d33,#fc3,#3c6,#39f,#a3f,#d33)"></i>Any RAL colour</span>`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => { initChips(); initDesigner(); initBath(); initSplash(); });
})();
