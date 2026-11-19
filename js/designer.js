/* REFACE — Room designer (home page): pick a kitchen or bedroom, a door, a colour and a handle.
   The room photo changes as you tap; the close-up shows the exact door with the handle fitted.
   Data (doors, handles, swatches) is in js/designer-data.js; pictures are in assets/img/designer/.
   Pictures only swap in once they're fully ready (no half-loaded or doubled handles), the last tap always wins,
   and likely next pictures load in the background once the designer is near the screen. */

(function () {
  "use strict";
  var DATA = window.DESIGNER;
  var root = document.querySelector("[data-designer]");
  if (!DATA || !root) return;
  var P = "assets/img/designer/";
  var BIZ = (window.REFACE || {}).business || {};
  var DOORS = DATA.doors, HANDLES = DATA.handles;
  var FAMS = [
    { id: "Shaker", room: "shaker", rep: "classic-shaker" }, { id: "Flat", room: "flat", rep: "classic-slab" },
    { id: "Traditional", room: "traditional", rep: "fielded-panel" }, { id: "Arched", room: "traditional", rep: "cathedral-arch" },
    { id: "Panelled", room: "fluted", rep: "fine-fluted" }, { id: "Gloss", room: "gloss", rep: "gloss-slab" }
  ];
  var STYLES = ["shaker", "flat", "traditional", "fluted", "gloss"];
  var STYLE_NAME = { shaker: "Shaker", flat: "Flat", traditional: "Traditional", fluted: "Fluted", gloss: "Gloss" };
  var IN_ROOM = { "classic-shaker": 1, "classic-slab": 1, "fielded-panel": 1, "fine-fluted": 1, "gloss-slab": 1 };
  var MAIN_DOORS = ["classic-shaker", "classic-slab", "fielded-panel", "fine-fluted", "gloss-slab", "cathedral-arch"];
  var MAIN_COLS = ["ultra-matt-white", "ultra-matt-cashmere", "ultra-matt-stone-grey", "ultra-matt-reed-green", "ultra-matt-indigo", "parisian-blue-oak"];
  var MAIN_GLOSS = ["gloss-white", "gloss-cashmere", "gloss-light-grey", "gloss-graphite", "gloss-indigo", "gloss-parisian-blue"];
  var MAIN_HANDLES = ["cup-handle-satin-brass", "round-knob-satin-brass", "t-bar-matt-black", "d-handle-brushed-nickel", "knurled-t-knob-gold"];
  function C(id, name, hex, group, sw) { return { id: id, name: name, hex: hex, group: group, sw: sw }; }
  var OAK = [["parisian-blue-oak","Parisian Blue Oak","#355169"],["indigo-oak","Indigo Oak","#19384c"],["graphite-oak","Graphite Oak","#3b3d3b"],["reed-green-oak","Reed Green Oak","#869787"],["stone-grey-oak","Stone Grey Oak","#a79d91"],["dust-grey-oak","Dust Grey Oak","#959391"],["cashmere-oak","Cashmere Oak","#d2cac1"],["light-casella-oak","Light Casella Oak","#d1ba90"],["light-grey-oak","Light Grey Oak","#cfd0cc"],["mussel-oak","Mussel Oak","#e4dfd5"],["ivory-oak","Ivory Oak","#faf6ef"],["white-oak","White Oak","#f2f3f3"]].map(function (c) { return C(c[0], c[1], c[2], "Wood grain", c[0]); });
  var MATT = [["ultra-matt-parisian-blue","Parisian Blue","#38546d"],["ultra-matt-indigo","Indigo","#12364a"],["ultra-matt-fir-green","Fir Green","#224031"],["ultra-matt-reed-green","Reed Green","#90a496"],["ultra-matt-graphite","Graphite","#3d4040"],["ultra-matt-black","Black","#272b29"],["ultra-matt-dust-grey","Dust Grey","#939390"],["ultra-matt-stone-grey","Stone Grey","#a99f93"],["ultra-matt-cashmere","Cashmere","#d6cec5"],["ultra-matt-white","White","#f5f6f7"]].map(function (c) { return C(c[0], c[1], c[2], "Smooth matt", c[0]); });
  var GLOSS = [["gloss-parisian-blue","Parisian Blue","#39546e"],["gloss-indigo","Indigo","#1d2e42"],["gloss-graphite","Graphite","#454948"],["gloss-metallic-anthracite","Metallic Anthracite","#706f75"],["gloss-dust-grey","Dust Grey","#9ea1a2"],["gloss-metallic-blue","Metallic Blue","#9ca9af"],["gloss-reed-green","Reed Green","#8ba195"],["gloss-cashmere","Cashmere","#dfd6cf"],["gloss-metallic-champagne","Metallic Champagne","#c1b3aa"],["gloss-light-grey","Light Grey","#d6d7d2"],["gloss-white","White","#f4f5f6"]].map(function (c) { return C(c[0], c[1], c[2], "High gloss", ""); });
  var ALLC = OAK.concat(MATT, GLOSS);
  var CATS = ["Cup handles", "Knobs", "Bars", "Edge pulls"];
  function catOf(h) { return h.kind === "cup" ? "Cup handles" : h.kind === "knob" ? "Knobs" : h.kind === "edge" ? "Edge pulls" : "Bars"; }
  var NOSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M4 21 20 3"/></svg>';

  var state = { room: "k", door: "classic-shaker", colour: "parisian-blue-oak", h: 1, f: 0, big: "room", stab: "door" };
  var $ = function (id) { return document.getElementById("dz-" + id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function findHandle(id) { for (var i = 0; i < HANDLES.length; i++) for (var k = 0; k < HANDLES[i].fins.length; k++) if (HANDLES[i].fins[k].id === id) return [i, k]; return [0, 0]; }
  function roomDoors() { return DOORS.filter(function (d) { return d.rooms.indexOf(state.room) >= 0; }); }
  function door() { return byId(DOORS, state.door); }
  function famOf(d) { return byId(FAMS, d.fam); }
  function fam() { return famOf(door()); }
  function coloursFor(d) { return d.fam === "Gloss" ? GLOSS : OAK.concat(MATT); }
  function colours() { return coloursFor(door()); }
  function colour() { return byId(ALLC, state.colour); }
  function handle() { return state.h < 0 ? null : HANDLES[state.h]; }
  function fin() { return state.h < 0 ? null : HANDLES[state.h].fins[state.f]; }
  function nearest(c, list) {
    var key = c.id.replace(/^(gloss-|ultra-matt-)/, "").replace(/-oak$/, "");
    return list.filter(function (x) { return x.id.replace(/^(gloss-|ultra-matt-)/, "").replace(/-oak$/, "") === key; })[0] || list[0];
  }
  function colourFor(d, c) { c = c || colour(); return d.fam === "Gloss" ? (c.group === "High gloss" ? c : nearest(c, GLOSS)) : (c.group === "High gloss" ? nearest(c, OAK.concat(MATT)) : c); }
  function forDoor(d) { return colourFor(d); }
  function paint(c) { return "--c:" + c.hex + ";" + (c.sw ? "background-image:url(" + DATA.sw[c.sw] + ")" : ""); }
  function paintBig(c) { return "--c:" + c.hex + ";" + (c.sw ? "background-image:url(" + P + "cu/sw-" + c.sw + ".webp)" : "background-image:none"); }
  function drHtml(d, c, lazy) {
    var tall = state.room === "b";
    return '<span class="dr' + (tall ? " tall" : "") + (d.fam === "Gloss" ? " gl" : "") + '" style="' + paint(c) + '"><img src="' + (tall ? d.tthumb : d.thumb) + '" alt=""' + (lazy ? ' loading="lazy"' : "") + "></span>";
  }
  var PLURAL = { "D handle": "D handles", "Two-tone bar": "two-tone bars", "T bar": "T bars", "Sloped bar": "sloped bars", "Square D handle": "square D handles", "Slim square D": "slim square D handles", "Square bar & knob": "square bars & knobs", "Knurled bar & knobs": "knurled bars & knobs", "Knurled T knob": "knurled T knobs" };
  function hdesc() {
    if (door().builtin) return "built-in handle";
    if (state.h < 0) return "no handles (handleless look)";
    var h = handle(), f = fin().name.toLowerCase();
    if (h.kind === "cup") return f + " cup handles, round knobs on doors";
    if (h.fam === "Bar") return f + "s";
    if (PLURAL[h.fam]) return f + " " + PLURAL[h.fam];
    return f + " " + h.fam.toLowerCase() + "s";
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ---------- pictures: decode before showing, last tap wins, load likely next ones ahead ----------
  var cache = {}, want = { base: null, hl: null }, slowT = null;
  function decode(src) {
    if (!cache[src]) cache[src] = new Promise(function (res) {
      var im = new Image(), done = function () { res(src); };
      im.decoding = "async";
      im.onload = function () { if (im.decode) im.decode().then(done, done); else done(); };
      im.onerror = done; im.src = src;
    });
    return cache[src];
  }
  function busy(on) { clearTimeout(slowT); if (on) slowT = setTimeout(function () { $("loading").hidden = false; }, 180); else $("loading").hidden = true; }
  function settle() { if (want.base === lastBase && want.hl === lastHl) busy(false); }
  var lastBase = null, lastHl = null, fadeT = null;
  function showBase(src) {
    if (want.base === src) return;
    want.base = src; busy(true);
    decode(src).then(function () {
      if (want.base !== src) return;
      lastBase = src; settle();
      var a = $("base-a"), b = $("base-b");
      if (a.getAttribute("src") === src) return;
      clearTimeout(fadeT);
      b.classList.remove("on"); b.src = src;
      requestAnimationFrame(function () { b.classList.add("on"); });
      fadeT = setTimeout(function () {
        if (want.base !== src) return;
        var fin2 = function () { if (want.base === src) b.classList.remove("on"); };
        a.src = src; if (a.complete) requestAnimationFrame(fin2); else a.onload = fin2;
      }, 190);
    });
  }
  function showHandles(src) {
    want.hl = src;
    var hl = $("hl");
    if (!src) { hl.hidden = true; lastHl = null; settle(); return; }
    busy(true);
    decode(src).then(function () {
      if (want.hl !== src) return;
      lastHl = src; settle();
      if (hl.getAttribute("src") !== src) hl.src = src;     // swaps in one frame: the old handles never sit on top of the new ones
      hl.hidden = false;
    });
  }
  // background loading: a short queue, 3 at a time, rebuilt after each change; touching an option starts its picture at once
  var queue = [], active = 0, planT = null, started = false;
  var lite = (navigator.connection && navigator.connection.saveData) || false;
  var phone = window.matchMedia("(max-width: 640px)").matches;
  function pump() {
    while (active < 3 && queue.length) {
      var s = queue.shift(); if (cache[s]) continue;
      active++; decode(s).then(function () { active--; pump(); });
    }
  }
  function dir() { return state.room === "k" ? P + "k/" : P + "b/"; }
  function layerSrc(id) { return state.room === "k" ? P + "k/h2/" + id + ".webp" : P + "b/h/" + id + ".webp"; }
  function baseFor(d, c) { return dir() + famOf(d).room + "-" + colourFor(d, c).id + ".webp"; }
  function plan(extra) {
    clearTimeout(planT);
    planT = setTimeout(function () {
      if (lite || !started) return;
      var d = door(), q = [];
      (d.fam === "Gloss" ? MAIN_GLOSS : MAIN_COLS).forEach(function (id) { q.push(baseFor(d, byId(ALLC, id))); });
      MAIN_HANDLES.forEach(function (id) { q.push(layerSrc(id)); });
      MAIN_DOORS.forEach(function (id) { var x = byId(DOORS, id); if (x && x.rooms.indexOf(state.room) >= 0) q.push(baseFor(x)); });
      if (!phone || extra) {
        colours().forEach(function (c) { q.push(baseFor(d, c)); });
        HANDLES.forEach(function (h) { h.fins.forEach(function (f) { q.push(layerSrc(f.id)); }); });
      }
      queue = q.filter(function (s) { return !cache[s]; }); pump();
    }, 250);
  }
  function srcFor(b) {
    if (b.dataset.c) return [baseFor(door(), byId(ALLC, b.dataset.c))];
    if (b.dataset.d) { var x = byId(DOORS, b.dataset.d); return [baseFor(x), state.room === "k" ? x.unit : x.tall]; }
    if (b.dataset.h !== undefined && b.dataset.k !== undefined && +b.dataset.h >= 0) return [layerSrc(HANDLES[+b.dataset.h].fins[+b.dataset.k].id)];
    return [];
  }
  function warm(e) { var b = e.target.closest && e.target.closest("button"); if (b) srcFor(b).forEach(decode); }
  ["pointerover", "pointerdown", "focusin"].forEach(function (ev) { document.addEventListener(ev, warm, { passive: true }); });

  function updateRoom() {
    var d = door();
    showBase(baseFor(d));
    showHandles(d.builtin || state.h < 0 ? null : layerSrc(fin().id));
    var n = $("near");
    if (IN_ROOM[d.id]) n.hidden = true;
    else { n.hidden = false; n.textContent = "The room shows the nearest style (" + STYLE_NAME[fam().room] + "). The close-up shows your exact door."; }
  }

  // ---------- close-up ----------
  var scene = $("scene"), SW = 1, SH = 1, units = [], hds = [], extras = [];
  function pos(el, x, y, w, h) { el.style.left = (x / SW * 100) + "%"; el.style.top = (y / SH * 100) + "%"; el.style.width = (w / SW * 100) + "%"; el.style.height = (h / SH * 100) + "%"; }
  function el(cls, x, y, w, h) { var e = document.createElement("div"); e.className = cls; pos(e, x, y, w, h); scene.appendChild(e); return e; }
  function buildScene() {
    scene.innerHTML = ""; units = []; hds = []; extras = [];
    if (state.room === "k") {
      SW = 1123; SH = 1160;
      el("wall", 0, 0, 1123, 1056); el("splash", 0, 0, 1123, 60); el("floor", 0, 1056, 1123, 104);
      el("carcass", 58, 98, 1007, 866); extras.push(el("plinth", 70, 964, 983, 92));
      [60, 563].forEach(function (x, i) { var u = el("u k" + (i ? " flip" : ""), x, 98, 500, 864); u.appendChild(document.createElement("img")); units.push(u); });
      el("top2", 34, 60, 1055, 38);
    } else {
      SW = 1929; SH = 2390;                            // two pairs of wardrobe doors
      el("wall", 0, 0, 1929, 2296); el("floor wood", 0, 2296, 1929, 94);
      el("carcass", 58, 70, 1813, 2150); extras.push(el("cornice", 46, 22, 1837, 48)); extras.push(el("plinth", 66, 2220, 1797, 76));
      [60, 513, 966, 1419].forEach(function (x, i) { var u = el("u" + (i % 2 ? " flip" : ""), x, 70, 450, 2146); u.appendChild(document.createElement("img")); units.push(u); });
    }
    fitScene();
  }
  function fitScene() {
    var slot = scene.parentElement, W = slot.clientWidth, H = slot.clientHeight; if (!W || !H) return;
    var ar = SW / SH, pad = slot.classList.contains("small") ? 0.94 : 0.96, w, h;
    if (W / H > ar) { h = H * pad; w = h * ar; } else { w = W * pad; h = w / ar; }
    scene.style.width = w + "px"; scene.style.height = h + "px"; scene.style.left = (W - w) / 2 + "px"; scene.style.top = (H - h) / 2 + "px";
  }
  function sprite(spec, cx, cy, top, cls) {
    var im = document.createElement("img"); im.className = "hd" + (cls ? " " + cls : ""); im.alt = ""; im.src = spec[0];
    var w = spec[1] / 2, h = spec[2] / 2;
    pos(im, cx - w / 2, top ? cy : cy - h / 2, w, h); scene.appendChild(im); hds.push(im);
  }
  function knobFor(famName, finName) {
    var h = HANDLES.filter(function (x) { return x.fam === famName; })[0];
    return h.fins.filter(function (f) { return f.name === finName; })[0] || h.fins[0];
  }
  function updateCloseup() {
    var d = door(), c = forDoor(d), k = state.room === "k";
    units.forEach(function (u) {
      u.setAttribute("style", u.getAttribute("style").replace(/--c:[^;]*;|background-image:[^;]*;?/g, "") + paintBig(c));
      u.classList.toggle("gl", d.fam === "Gloss");
      var want2 = k ? d.unit : d.tall, im = u.firstChild;
      if (im.getAttribute("src") !== want2) decode(want2).then(function () { if ((k ? door().unit : door().tall) === want2) im.src = want2; });
    });
    extras.forEach(function (e) { e.style.setProperty("--c", c.hex); });
    hds.forEach(function (x) { x.remove(); }); hds = [];
    if (d.builtin || state.h < 0) return;
    var h = handle(), f = fin(), kind = h.kind;
    var doorKnob = kind === "knob" ? f : kind === "cup" ? knobFor("Round knob", f.name) : kind === "barknob" ? knobFor(h.doorKnob, f.name) : null;
    if (k) {
      [[310, 560, -1], [813, 563, 1]].forEach(function (u) {
        var mid = u[0], inner = u[1], s = u[2];
        if (kind === "edge") { sprite(f.h, mid, 95, true, "edge"); sprite(f.h, inner + s * (20 + f.h[1] / 4), 272, true, "edge"); return; }
        sprite(kind === "knob" ? f.k : f.h, mid, 186);
        if (kind === "bar") sprite(f.v, inner + s * 36, 315 + f.v[2] / 4); else sprite(doorKnob.kv || doorKnob.k, inner + s * 42, 325);
      });
    } else {
      var y = 70 + 2146 - 1000;
      [[510, -1], [513, 1], [1416, -1], [1419, 1]].forEach(function (u) {
        var inner = u[0], s = u[1];
        if (kind === "edge") sprite(f.h, inner + s * 4, y, false, "edge rot");
        else if (kind === "bar") sprite(f.v, inner + s * 36, y);
        else sprite(doorKnob.kv || doorKnob.k, inner + s * 40, y);
      });
    }
  }
  function setBig(which) {
    state.big = which;
    var r = $("s-room"), c = $("s-cu");
    r.classList.toggle("big", which === "room"); r.classList.toggle("small", which !== "room");
    c.classList.toggle("big", which === "cu"); c.classList.toggle("small", which !== "cu");
    requestAnimationFrame(fitScene);
  }
  $("stage").addEventListener("click", function (e) {
    var slot = e.target.closest(".slot");
    if (slot && slot.classList.contains("small")) setBig(slot === $("s-cu") ? "cu" : "room");
  });
  if (window.ResizeObserver) new ResizeObserver(fitScene).observe($("stage")); else window.addEventListener("resize", fitScene);

  // ---------- rows ----------
  function mainList(ids, cur) { return !cur || ids.indexOf(cur) >= 0 ? ids : ids.slice(0, ids.length - 1).concat([cur]); }
  function renderRows() {
    var d = door(), c = forDoor(d), list, n;
    list = mainList(MAIN_DOORS.filter(function (id) { return byId(roomDoors(), id); }), d.id);
    n = roomDoors().length;
    $("row-door").innerHTML = list.map(function (id) { var x = byId(DOORS, id); return '<button type="button" class="pk" data-d="' + id + '" aria-pressed="' + (id === d.id) + '" title="' + esc(x.label) + '" aria-label="' + esc(x.label) + '">' + drHtml(x, forDoor(x)) + "</button>"; }).join("") +
      '<button type="button" class="pk more" data-all="door" aria-label="See all ' + n + ' doors">All ' + n + "</button>";
    var gl = d.fam === "Gloss";
    list = mainList(gl ? MAIN_GLOSS : MAIN_COLS, c.id); n = colours().length;
    $("row-colour").innerHTML = list.map(function (id) { var x = byId(ALLC, id); return '<button type="button" class="pk c' + (gl ? " gl" : "") + '" data-c="' + id + '" aria-pressed="' + (id === c.id) + '" title="' + esc(x.name) + '" aria-label="' + esc(x.name) + '" style="' + paint(x) + '"></button>'; }).join("") +
      '<button type="button" class="pk more" data-all="colour" aria-label="See all ' + n + ' colours">All ' + n + "</button>";
    var cur = state.h < 0 ? null : fin().id;
    list = mainList(MAIN_HANDLES, cur);
    $("row-handle").innerHTML = '<button type="button" class="pk none" data-h="-1" data-k="0" aria-pressed="' + (state.h < 0 && !d.builtin) + '" title="No handles" aria-label="No handles (handleless look)">' + NOSVG + "None</button>" +
      list.map(function (id) { var ix = findHandle(id), h = HANDLES[ix[0]], f = h.fins[ix[1]]; return '<button type="button" class="pk" data-h="' + ix[0] + '" data-k="' + ix[1] + '" aria-pressed="' + (id === cur && !d.builtin) + '" title="' + esc(h.fam + ", " + f.name) + '" aria-label="' + esc(h.fam + ", " + f.name) + '"><img class="im" src="' + f.thumb + '" alt=""></button>'; }).join("") +
      '<button type="button" class="pk more" data-all="handle" aria-label="See all 65 handles">All 65</button>';
    $("l-door").textContent = d.label + (IN_ROOM[d.id] ? "" : " (room shows " + STYLE_NAME[fam().room] + ")");
    $("l-colour").textContent = c.name + ", " + c.group.toLowerCase();
    $("l-handle").textContent = d.builtin ? "Built into the door" : state.h < 0 ? "No handles" : handle().fam + ", " + fin().name.toLowerCase();
  }
  function summary() {
    var d = door(), c = forDoor(d);
    $("sum-main").textContent = (state.room === "k" ? "Kitchen: " : "Bedroom: ") + d.label + " in " + c.name;
    $("sum-sub").textContent = c.group + ", " + hdesc();
    $("base-a").alt = (state.room === "k" ? "Kitchen" : "Bedroom") + " with " + d.label + " doors in " + c.name + " and " + hdesc();
    $("t-door").textContent = d.label; $("t-colour").textContent = c.name; $("t-handle").textContent = d.builtin ? "Built in" : state.h < 0 ? "None" : fin().name;
    var href = waHref(); $("cta").href = href; $("cta2").href = href;
  }
  function refresh() { renderRows(); summary(); updateRoom(); updateCloseup(); if (!$("sheet").hidden) renderSheet(); plan(!$("sheet").hidden); }
  function setDoor(id) {
    state.door = id;
    var list = colours(); if (!byId(list, state.colour)) state.colour = nearest(colour(), list).id;
    refresh();
  }
  function setRoom(r) {
    if (r === state.room) return;
    state.room = r;
    $("r-k").setAttribute("aria-selected", String(r === "k")); $("r-b").setAttribute("aria-selected", String(r === "b"));
    if (door().rooms.indexOf(r) < 0) state.door = fam().rep;
    want.base = null; want.hl = null;
    buildScene(); refresh();
  }
  $("r-k").addEventListener("click", function () { setRoom("k"); });
  $("r-b").addEventListener("click", function () { setRoom("b"); });
  function pick(e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.c) { state.colour = b.dataset.c; if (!$("sheet").hidden) state.stab = "colour"; refresh(); }
    else if (b.dataset.d) setDoor(b.dataset.d);
    else if (b.dataset.h !== undefined && b.dataset.k !== undefined) { state.h = +b.dataset.h; state.f = +b.dataset.k; refresh(); }
    else if (b.dataset.all) openSheet(b.dataset.all);
    else if (b.dataset.gloss) setDoor("gloss");
    else if (b.dataset.st) { state.stab = b.dataset.st; renderSheet(); $("s-all").scrollTop = 0; }
  }
  $("bar").addEventListener("click", pick);
  function waHref() {
    var d = door(), c = forDoor(d);
    var text = "Hi Reface, I'd like a free quote for a " + (state.room === "k" ? "kitchen" : "bedroom") + " in this design: " + d.label + " doors in " + c.name + " (" + c.group.toLowerCase() + ") with " + hdesc() + ".";
    return "https://wa.me/" + (BIZ.whatsapp || "447457403407") + "?text=" + encodeURIComponent(text);
  }

  // ---------- the "All" panel ----------
  var lastFocus = null;
  function openSheet(tab) {
    state.stab = tab; lastFocus = document.activeElement;
    $("sheet").hidden = false; document.documentElement.classList.add("dz-lock");
    $("spv").insertBefore($("stage"), $("info"));
    renderSheet(); requestAnimationFrame(fitScene); plan(true);
    var sel = $("s-all").querySelector('[aria-pressed="true"], [data-on="true"]'); if (sel) sel.scrollIntoView({ block: "center" });
    $("sheet").querySelector(".done").focus();
  }
  function closeSheet() {
    $("sheet").hidden = true; document.documentElement.classList.remove("dz-lock");
    $("home").appendChild($("stage")); requestAnimationFrame(fitScene);
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }
  function renderInfo() {
    var d = door(), c = forDoor(d), html;
    if (state.stab === "door") {
      html = '<div class="pv">' + drHtml(d, c) + '</div><div><h3>' + esc(d.label) + "</h3><p>" + d.fam + " door" + (IN_ROOM[d.id] ? "" : ", room shows " + STYLE_NAME[fam().room] + " style") + (d.builtin ? ", handle built in" : "") + "</p></div>";
    } else if (state.stab === "colour") {
      html = '<div class="pv"><span class="sw" style="' + paint(c) + '"></span></div><div><h3>' + esc(c.name) + "</h3><p>" + c.group + "</p></div>";
    } else if (d.builtin || state.h < 0) {
      html = '<div class="pv" style="color:var(--muted)">' + NOSVG.replace('aria-hidden="true"', 'aria-hidden="true" width="40" height="40"') + "</div><div><h3>" + (d.builtin ? "Built-in handle" : "No handles") + "</h3><p>" + (d.builtin ? "This door has a handle shaped into its edge" : "Handleless look: push-to-open or a recessed rail, we can advise") + "</p></div>";
    } else {
      var h = handle(), f = fin();
      html = '<div class="pv"><img src="' + f.thumb + '" alt=""></div><div><h3>' + esc(h.fam) + "</h3><p>" + esc(f.name) + ", " + esc(h.size) + "</p></div>";
    }
    $("info").innerHTML = html;
  }
  function renderSheet() {
    Array.prototype.forEach.call($("sheet").querySelectorAll(".stabs button"), function (b) { b.setAttribute("aria-selected", String(b.dataset.st === state.stab)); });
    renderInfo();
    var d = door(), c = forDoor(d), all = "";
    if (state.stab === "door") {
      var list = roomDoors();
      all = FAMS.map(function (f) {
        var ds = list.filter(function (x) { return x.fam === f.id; }).sort(function (a, b) { return a.label < b.label ? -1 : 1; }); if (!ds.length) return "";
        return '<div class="grp"><h4>' + f.id + " (" + ds.length + ')</h4><div class="grid">' + ds.map(function (x) {
          return '<button type="button" class="it" data-d="' + x.id + '" aria-pressed="' + (x.id === d.id) + '">' + drHtml(x, forDoor(x), true) + "<b>" + esc(x.label) + "</b></button>";
        }).join("") + "</div></div>";
      }).join("");
    } else if (state.stab === "colour") {
      var gl = d.fam === "Gloss";
      var groups = gl ? [["High gloss", GLOSS]] : [["Wood grain", OAK], ["Smooth matt", MATT]];
      all = (gl ? '<p class="snote">High gloss colours are for the Gloss Slab door.</p>'
                : '<p class="snote">Want high gloss? It comes on the Gloss Slab door. <button type="button" data-gloss="1">Switch to Gloss</button></p>');
      all += groups.map(function (g) {
        return '<div class="grp"><h4>' + g[0] + " (" + g[1].length + ')</h4><div class="grid">' + g[1].map(function (x) {
          return '<button type="button" class="it" data-c="' + x.id + '" aria-pressed="' + (x.id === c.id) + '"><span class="sw' + (gl ? " gl" : "") + '" style="' + paint(x) + '"></span><b>' + esc(x.name) + "</b></button>";
        }).join("") + "</div></div>";
      }).join("");
    } else {
      if (d.builtin) all += '<p class="snote">This door has a handle built into its edge, so it needs no handle.</p>';
      all += '<div class="grp"><h4>No handles</h4><div class="hgrid"><button type="button" class="hc nohandle" data-h="-1" data-k="0" data-on="' + (state.h < 0) + '"><span class="th">' + NOSVG.replace('aria-hidden="true"', 'aria-hidden="true" width="34" height="34"') + "</span><b>Handleless look</b><small>No handles on doors or drawers</small></button></div></div>";
      all += CATS.map(function (cat) {
        var items = HANDLES.map(function (x, i) { return [x, i]; }).filter(function (p) { return catOf(p[0]) === cat; });
        return '<div class="grp"><h4>' + cat + " (" + items.reduce(function (n, p) { return n + p[0].fins.length; }, 0) + ')</h4><div class="hgrid">' + items.map(function (p) {
          var x = p[0], i = p[1], on = i === state.h, kk = on ? state.f : 0;
          return '<div class="hc" data-on="' + on + '"><img class="th" src="' + x.fins[kk].thumb + '" alt="" loading="lazy"><b>' + esc(x.fam) + "</b><small>" + esc(x.size) + '</small><div class="fins">' + x.fins.map(function (y, j) {
            return '<button type="button" data-h="' + i + '" data-k="' + j + '" aria-pressed="' + (on && j === state.f) + '" aria-label="' + esc(x.fam + ", " + y.name) + '" title="' + esc(y.name) + '"><img src="' + y.thumb + '" alt="" loading="lazy"></button>';
          }).join("") + '</div><span class="fn">' + (on ? esc(x.fins[kk].name) : x.fins.length + " finish" + (x.fins.length > 1 ? "es" : "")) + "</span></div>";
        }).join("") + "</div></div>";
      }).join("");
    }
    var keep = $("s-all").scrollTop; $("s-all").innerHTML = all; $("s-all").scrollTop = keep;
  }
  $("sheet").addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) { closeSheet(); return; }
    if (e.target.closest(".stage")) return;
    pick(e);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("sheet").hidden) closeSheet(); });

  buildScene(); setBig("room");
  want.base = $("base-a").getAttribute("src"); lastBase = want.base; want.hl = $("hl").getAttribute("src"); lastHl = want.hl;
  refresh();
  // load the likely next pictures only once the designer is nearly on screen
  function start() { if (started) return; started = true; plan(); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (en) { return en.isIntersecting; })) { start(); io.disconnect(); } }, { rootMargin: "600px 0px" });
    io.observe(root);
  } else start();
})();
