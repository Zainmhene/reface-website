/* REFACE — shared site behaviour (no libraries needed) */
(function () {
  "use strict";
  const CFG = window.REFACE || {};
  const BIZ = CFG.business || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Links built from config ---------- */
  const waLink = (text) => `https://wa.me/${BIZ.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const mailLink = (subject, body) => `mailto:${BIZ.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  function bindBusiness() {
    $$("[data-tel]").forEach((a) => {
      a.href = "tel:" + BIZ.phoneLink;
      if (a.dataset.tel === "text") a.textContent = BIZ.phoneDisplay;
    });
    $$("[data-wa]").forEach((a) => {
      a.href = waLink(a.dataset.wa || "Hi Reface, I'd like a free Photoquote. Here are photos of my room:");
      a.target = "_blank"; a.rel = "noopener";
    });
    $$("[data-mail]").forEach((a) => {
      a.href = "mailto:" + BIZ.email;
      if (a.dataset.mail === "text") a.textContent = BIZ.email;
    });
    $$("[data-hours]").forEach((ul) => {
      ul.innerHTML = (BIZ.hours || []).map((h) => `<li><span>${esc(h.days)}</span><b>${esc(h.time)}</b></li>`).join("");
    });
    $$("[data-area]").forEach((el) => (el.textContent = BIZ.area));
    $$("[data-maps]").forEach((a) => { if (BIZ.mapsUrl) { a.href = BIZ.mapsUrl; a.target = "_blank"; a.rel = "noopener"; } });
    $$("[data-google]").forEach((a) => { a.href = BIZ.googleReviewsUrl; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Back button (every page except home) ----------
     Goes back to the page you came from on this site; if you opened the page
     directly, it goes to the home page instead. */
  function initBack() {
    $$("[data-back]").forEach((a) => a.addEventListener("click", (e) => {
      let fromHere = false;
      try { fromHere = !!document.referrer && new URL(document.referrer).origin === location.origin && document.referrer !== location.href; } catch (_) { /* ignore */ }
      if (fromHere && history.length > 1) { e.preventDefault(); history.back(); }
    }));
  }

  /* ---------- Header, menu, action bar ---------- */
  function initChrome() {
    const header = $(".site-header");
    const bar = $(".action-bar");
    const hero = $("[data-hero]");
    const onScroll = () => {
      const y = window.scrollY;
      header && header.classList.toggle("scrolled", y > 8);
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 420;
      bar && bar.classList.toggle("show", y > Math.max(420, heroEnd));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const menu = $(".mobile-menu");
    const openBtn = $(".menu-toggle");
    if (menu && openBtn) {
      const close = () => { menu.classList.remove("open"); document.body.classList.remove("menu-open"); openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); };
      openBtn.addEventListener("click", () => {
        menu.classList.add("open"); document.body.classList.add("menu-open"); openBtn.setAttribute("aria-expanded", "true");
        setTimeout(() => $(".menu-close", menu)?.focus(), 50);
      });
      $(".menu-close", menu)?.addEventListener("click", close);
      $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.classList.remove("open"); document.body.classList.remove("menu-open"); }));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) close(); });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const d = en.target.dataset.delay;
          if (d) en.target.style.transitionDelay = d + "ms";
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Hero: "bare board to brand new" scroll story ----------
     Two photos of the same kitchen: a bare-board "before" and the finished room.
     As you scroll, the finished room builds over the bare one in waves of blocks,
     and the caption on the left changes at each stage (like the reel). */
  function initHero() {
    const hero = $("[data-hero]");
    if (!hero) return;
    const track = $(".hero-track", hero);
    const canvas = $(".hero-canvas", hero);
    const ctx = canvas.getContext && canvas.getContext("2d");
    const caps = $$(".hero-cap", hero);
    const rail = $$(".hero-rail li", hero);
    const hint = $(".scroll-hint", hero);
    const bar = $(".hero-progress", hero);
    const header = $(".site-header");
    if (!ctx) { hero.classList.add("no-canvas"); return; }

    const size = (window.innerWidth * (window.devicePixelRatio || 1)) > 1300 ? 1600 : 900;
    const before = new Image(), after = new Image();
    before.decoding = after.decoding = "async";
    const loadBlocks = () => {
      const tall = window.innerWidth / Math.max(1, window.innerHeight) < 0.9;
      before.src = tall ? "assets/img/hero/bare-shell-tall-900.webp" : `assets/img/hero/bare-shell-${size}.webp`;
      after.src = tall ? "assets/img/hero/navy-kitchen-tall-900.webp" : `assets/img/hero/navy-kitchen-${size}.webp`;
    };

    // VIDEO MODE: if the hero has data-frames-wide / data-frames-tall, it plays those video frames
    // as you scroll (tall set on phones). Otherwise it uses the block-wave build below.
    const portrait = window.innerWidth / Math.max(1, window.innerHeight) < 0.9;
    const set = portrait ? "Tall" : "Wide";
    const pattern = hero.dataset["frames" + set];
    const count = +hero.dataset["count" + set] || 0;
    const frames = pattern && count ? new Array(count) : null;
    const finalImg = new Image();
    function loadFrames() {
      const order = [], seen = new Set();
      const push = (i) => { if (i >= 0 && i < count && !seen.has(i)) { seen.add(i); order.push(i); } };
      push(0); push(count - 1);
      for (let step = 16; step >= 1; step = Math.floor(step / 2)) { for (let i = 0; i < count; i += step) push(i); if (step === 1) break; }
      let active = 0, k = 0;
      const next = () => {
        while (active < 6 && k < order.length) {
          const i = order[k++]; active++;
          const im = new Image(); im.decoding = "async";
          im.onload = () => { frames[i] = im; active--; if (i === 0) resize(); onScroll(); next(); };
          im.onerror = () => { active--; if (i === 0) loadBlocks(); next(); };
          im.src = pattern.replace("{n}", String(i).padStart(3, "0"));
        }
      };
      next();
      if (hero.dataset["final" + set]) finalImg.src = hero.dataset["final" + set];
    }

    // Block grid: each block gets a reveal time. A sweep from bottom-left to top-right, with jitter.
    const COLS = 24, ROWS = 15;
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const th = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) th.push(0.62 * (x / (COLS - 1)) + 0.26 * (1 - y / (ROWS - 1)) + (rand() - 0.5) * 0.22);

    let p = reduceMotion ? 1 : 0, current = -1, ticking = false;
    const ready = () => before.complete && before.naturalWidth && after.complete && after.naturalWidth;

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      draw();
    }
    function coverDraw(img, alpha) {
      const cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
      const sc = Math.max(cw / iw, ch / ih);
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - iw * sc) / 2, (ch - ih * sc) / 2, iw * sc, ih * sc);
      ctx.globalAlpha = 1;
    }
    function drawFrames() {
      const f = clamp((p - 0.02) / 0.84, 0, 1) * (count - 1);
      const i = Math.round(f);
      let img = frames[i];
      for (let d = 1; !img && d < count; d++) img = frames[i - d] || frames[i + d];
      if (!img) return false;
      coverDraw(img, 1);
      // At the end, fade into the sharp final photo
      const fa = clamp((p - 0.84) / 0.1, 0, 1);
      if (fa > 0 && finalImg.complete && finalImg.naturalWidth) coverDraw(finalImg, fa);
      return true;
    }
    function draw() {
      if (frames && drawFrames()) return;
      if (!ready()) return;
      const cw = canvas.width, ch = canvas.height, iw = after.naturalWidth, ih = after.naturalHeight;
      const sc = Math.max(cw / iw, ch / ih);
      const fx = cw / ch < 1 ? 0.72 : 0.5; // on phones keep the tall units in view
      const dx = (cw - iw * sc) * fx, dy = (ch - ih * sc) * 0.5;
      const t = clamp((p - 0.04) / 0.78, 0, 1) * 1.3 - 0.14; // block-wave time
      ctx.globalAlpha = 1;
      if (t >= 1.14) { ctx.drawImage(after, dx, dy, iw * sc, ih * sc); return; }
      ctx.drawImage(before, dx, dy, iw * sc, ih * sc);
      const bw = iw / COLS, bh = ih / ROWS;
      for (let i = 0; i < th.length; i++) {
        const a = clamp((t - th[i]) / 0.07, 0, 1);
        if (a <= 0) continue;
        const sx = (i % COLS) * bw, sy = Math.floor(i / COLS) * bh;
        ctx.globalAlpha = a;
        ctx.drawImage(after, sx, sy, bw, bh, dx + sx * sc, dy + sy * sc, bw * sc + 1, bh * sc + 1);
      }
      ctx.globalAlpha = 1;
    }
    function setStage() {
      let k = 0;
      caps.forEach((c, i) => { if (p >= parseFloat(c.dataset.at)) k = i; });
      if (reduceMotion) k = 0;
      if (k !== current) {
        current = k;
        caps.forEach((c, i) => { c.classList.toggle("is-on", i === k); c.setAttribute("aria-hidden", String(i !== k)); });
        rail.forEach((li, i) => { li.classList.toggle("on", i <= k); li.classList.toggle("now", i === k); });
      }
      // Like the reel: dark text on the light, bare room; light text once the navy kitchen builds
      hero.classList.toggle("tone-light", p < 0.27);
      if (header) {
        const over = track.getBoundingClientRect().bottom > header.offsetHeight + 4;
        header.classList.toggle("on-hero", over);
        header.classList.toggle("on-dark", over && p >= 0.27);
        header.classList.toggle("cta-brass", over && p >= 0.55);
      }
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (hint) hint.style.opacity = p > 0.03 ? 0 : 1;
    }
    function update() {
      ticking = false;
      if (!reduceMotion) {
        const r = track.getBoundingClientRect();
        const total = Math.max(1, r.height - (window.innerHeight - (header ? header.offsetHeight : 0)));
        p = clamp(-r.top / total, 0, 1);
      }
      setStage();
      draw();
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    before.onload = after.onload = () => { if (ready()) { resize(); update(); } };
    before.onerror = after.onerror = () => hero.classList.add("no-canvas");
    if (frames) loadFrames(); else loadBlocks();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { resize(); onScroll(); });
    rail.forEach((li, i) => {
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        const r = track.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        window.scrollTo({ top: window.scrollY + r.top + total * parseFloat(caps[i].dataset.at) + 2, behavior: "smooth" });
      });
    });
    resize(); update();
  }

  /* ---------- Colour Studio: room tabs + colour dots on the photo ----------
     Each room has one or more styles. A style is a real brochure photo we recoloured
     (files in assets/img/studio/) or, for bathrooms, the drawn illustration.
     Tap a dot (or swipe the photo) and the new colour wipes across the room. */
  const CAT = window.REFACE_CATALOGUE || { vinyl: [], gloss: [], supermatt: [] };
  const pick = (list, ids) => ids.map((id) => list.find((c) => c.id === id)).filter(Boolean);
  const OAKS = ["parisian-blue-oak", "indigo-oak", "graphite-oak", "reed-green-oak", "stone-grey-oak", "dust-grey-oak", "cashmere-oak", "light-casella-oak", "light-grey-oak", "mussel-oak", "ivory-oak", "white-oak"];
  const GLOSS = ["parisian-blue", "indigo", "graphite", "metallic-anthracite", "dust-grey", "metallic-blue", "reed-green", "cashmere", "metallic-champagne", "light-grey", "white"];
  const STUDIO = {
    kitchen: [
      { id: "shaker", label: "Shaker", base: "assets/img/studio/hero-", pos: "70% 50%", range: "Vinyl · Alnwick door", finish: "vinyl",
        note: "In-frame shaker doors with a real oak grain, made to measure for your units.", colours: pick(CAT.vinyl, OAKS) },
      { id: "handleless", label: "Handleless", base: "assets/img/studio/kitchen-", pos: "64% 50%", range: "Glacier High Gloss", finish: "gloss",
        note: "Mirror-like gloss doors with laser edging, so there are no visible joins.", colours: pick(CAT.gloss, GLOSS) }
    ],
    bedroom: [
      { id: "wardrobes", label: "Fitted wardrobes", base: "assets/img/studio/bedroom-", pos: "30% 50%", range: "Vinyl · Matfen door", finish: "vinyl",
        note: "Floor-to-ceiling wardrobes and drawers, made to measure for your room.", colours: pick(CAT.vinyl, OAKS) }
    ],
    bathroom: [
      { id: "vanity", label: "Vanity & storage", base: "assets/img/studio/bathroom-", pos: "58% 50%", range: "Glacier Super Matt", finish: "supermatt",
        note: "Wall-hung vanity units and tall storage, made to measure in the same colours as our kitchens. Bathroom shown is a visualisation.",
        colours: pick(CAT.supermatt, ["parisian-blue", "indigo", "graphite", "black", "fir-green", "reed-green", "dust-grey", "stone-grey", "light-grey", "cashmere", "pale-cream", "white"]) }
    ]
  };

  function initStudio() {
    const root = $("[data-studio]");
    if (!root) return;
    const stage = $(".cs-stage", root), a = $(".cs-a", stage), b = $(".cs-b", stage), line = $(".cs-line", stage);
    const dots = $(".cs-dots", root), stylesEl = $(".cs-styles", root), hint = $(".cs-hint", root);
    const bath = $("[data-cs-bath]", root);
    const tabs = $$(".cs-tabs button", root);
    let room = root.dataset.start || "kitchen", styleIdx = { kitchen: 0, bedroom: 0, bathroom: 0 }, idx = 0, busy = false, touched = false;
    const style = () => STUDIO[room][styleIdx[room]];
    const url = (s, c, w) => `${s.base}${c.id}-${w}.webp`;
    const setImg = (img, s, c) => {
      img.srcset = `${url(s, c, 900)} 900w, ${url(s, c, 1600)} 1600w`;
      img.sizes = "(min-width: 1240px) 1240px, 100vw";
      img.src = url(s, c, 1600);
      img.alt = `${{ kitchen: "Kitchen", bedroom: "Fitted bedroom", bathroom: "Fitted bathroom" }[room]} in ${c.name}`;
    };
    const preload = (s) => { if (s.svg) return; s.colours.forEach((c) => { const im = new Image(); im.srcset = `${url(s, c, 900)} 900w, ${url(s, c, 1600)} 1600w`; im.sizes = "(min-width: 1240px) 1240px, 100vw"; im.src = url(s, c, 1600); }); };
    const shortName = (c) => c.name.replace(/^(High Gloss|Super Matt|Ultra Matt) /, "");

    function renderChrome() {
      const s = style(), c = s.colours[idx];
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.room === room)));
      stylesEl.innerHTML = STUDIO[room].length > 1 ? STUDIO[room].map((st, k) => `<button type="button" aria-pressed="${k === styleIdx[room]}" data-k="${k}">${esc(st.label)}</button>`).join("") : "";
      dots.innerHTML = s.colours.map((col, k) => {
        const bg = col.tile ? `background-image:url('${col.tile}');` : "";
        return `<button type="button" class="cs-dot${s.finish === "gloss" ? " gloss" : ""}" role="radio" aria-checked="${k === idx}" aria-label="${esc(col.name)}" title="${esc(col.name)}" data-k="${k}" style="--c:${col.hex};${bg}"></button>`;
      }).join("");
      updateLabel();
    }
    function updateLabel() {
      const s = style(), c = s.colours[idx];
      $(".cs-range", root).textContent = s.range;
      $(".cs-name", root).textContent = shortName(c);
      $(".cs-note", root).textContent = s.note;
      $(".cs-cta", root).href = `estimate.html?room=${room}&finish=${s.finish}&colour=${encodeURIComponent(c.name)}`;
      $$(".cs-dot", dots).forEach((d, k) => d.setAttribute("aria-checked", String(k === idx)));
      const on = dots.children[idx];
      if (on) dots.scrollTo({ left: on.offsetLeft - dots.clientWidth / 2 + on.clientWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
    }
    function showScene() {
      const s = style();
      stage.classList.toggle("is-svg", !!s.svg);
      stage.style.setProperty("--pos", s.pos || "50% 50%");
      if (s.svg) { bath.style.setProperty("--door", s.colours[idx].hex); return; }
      stage.classList.add("switching");
      setImg(a, s, s.colours[idx]);
      b.style.clipPath = "inset(0 0 0 100%)";
      const done = () => stage.classList.remove("switching");
      a.complete && a.naturalWidth ? done() : a.addEventListener("load", done, { once: true });
      preload(s);
    }
    const paint = (t, dir) => {
      if (dir > 0) { b.style.clipPath = `inset(0 0 0 ${((1 - t) * 100).toFixed(2)}%)`; line.style.left = `${(1 - t) * 100}%`; }
      else { b.style.clipPath = `inset(0 ${((1 - t) * 100).toFixed(2)}% 0 0)`; line.style.left = `${t * 100}%`; }
      line.style.opacity = t > 0.001 && t < 0.999 ? 1 : 0;
    };
    function goTo(k) {
      const s = style(), n = s.colours.length;
      k = (k + n) % n;
      if (busy || k === idx) return;
      if (!touched) { touched = true; hint.classList.add("gone"); }
      const dir = k > idx ? 1 : -1;
      idx = k; updateLabel();
      if (s.svg) { bath.style.setProperty("--door", s.colours[k].hex); return; }
      busy = true;
      setImg(b, s, s.colours[k]); paint(0, dir);
      const run = () => {
        if (reduceMotion) { finish(); return; }
        const t0 = performance.now();
        const tick = (now) => { const p = clamp((now - t0) / 650, 0, 1); paint(1 - Math.pow(1 - p, 3), dir); p < 1 ? requestAnimationFrame(tick) : finish(); };
        requestAnimationFrame(tick);
      };
      const finish = async () => {
        setImg(a, s, s.colours[k]);
        try { await a.decode(); } catch (e) { /* ignore */ }
        b.style.clipPath = "inset(0 0 0 100%)"; line.style.opacity = 0; busy = false;
      };
      b.complete && b.naturalWidth ? run() : b.addEventListener("load", run, { once: true });
    }

    tabs.forEach((t) => t.addEventListener("click", () => {
      if (t.dataset.room === room || busy) return;
      room = t.dataset.room; idx = 0; renderChrome(); showScene();
    }));
    stylesEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button"); if (!btn || busy) return;
      const k = +btn.dataset.k; if (k === styleIdx[room]) return;
      styleIdx[room] = k; idx = 0; renderChrome(); showScene();
    });
    dots.addEventListener("click", (e) => { const d = e.target.closest(".cs-dot"); if (d) goTo(+d.dataset.k); });
    stage.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") goTo(idx + 1); if (e.key === "ArrowLeft") goTo(idx - 1); });
    // Swipe across the photo
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
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      STUDIO.kitchen.forEach(preload); setTimeout(() => STUDIO.bedroom.forEach(preload), 2000);
    }, { threshold: 0.3 });
    io.observe(stage);
  }

  /* ---------- Before / after slider ---------- */
  function initBeforeAfter() {
    $$(".ba").forEach((ba) => {
      const input = $("input[type=range]", ba);
      if (!input) return;
      const set = () => ba.style.setProperty("--x", input.value + "%");
      input.addEventListener("input", set); set();
    });
  }

  /* ---------- Horizontal rails ---------- */
  function initRails() {
    $$("[data-rail-controls]").forEach((ctl) => {
      const rail = document.getElementById(ctl.dataset.railControls);
      if (!rail) return;
      const by = () => (rail.firstElementChild?.getBoundingClientRect().width || 300) + 14;
      $("[data-dir=prev]", ctl).addEventListener("click", () => rail.scrollBy({ left: -by(), behavior: "smooth" }));
      $("[data-dir=next]", ctl).addEventListener("click", () => rail.scrollBy({ left: by(), behavior: "smooth" }));
    });
  }

  /* ---------- Gallery filter + lightbox ---------- */
  function initGallery() {
    $$("[data-gallery]").forEach((g) => {
      const filters = $$(`[data-filter-for="${g.id}"] button`);
      filters.forEach((b) => b.addEventListener("click", () => {
        filters.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const f = b.dataset.filter;
        $$("figure", g).forEach((fig) => fig.classList.toggle("hide", f !== "all" && !(fig.dataset.tags || "").includes(f)));
      }));
    });
    const lb = $(".lightbox");
    if (!lb) return;
    const img = $("img", lb), cap = $(".lb-cap", lb);
    $$("[data-gallery] figure, [data-lightbox]").forEach((fig) => {
      fig.setAttribute("tabindex", "0");
      const open = () => {
        const src = fig.querySelector("img");
        img.src = src.dataset.full || src.currentSrc || src.src; img.alt = src.alt;
        cap.textContent = fig.querySelector("figcaption")?.innerText.replace(/\n+/g, " · ") || "";
        lb.classList.add("open"); document.body.classList.add("menu-open");
        $(".icon-btn", lb).focus();
      };
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
    });
    const close = () => { lb.classList.remove("open"); document.body.classList.remove("menu-open"); };
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".icon-btn")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- Reviews ---------- */
  function initReviews() {
    const box = $("[data-reviews]");
    if (!box) return;
    const list = CFG.reviews || [];
    if (!list.length) {
      box.innerHTML = `
        <div class="reviews-cta" data-reveal>
          <div class="big-stars" aria-hidden="true">★★★★★</div>
          <div>
            <h3>Read what our customers say on Google</h3>
            <p>Real reviews from homeowners who've had their kitchens, bedrooms and bathrooms made over by Reface.</p>
          </div>
          <a class="btn" data-google href="${esc(BIZ.googleReviewsUrl)}" target="_blank" rel="noopener">Read our Google reviews</a>
        </div>`;
      return;
    }
    const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
    const summary = CFG.googleRating ? `<p class="center muted" style="margin-bottom:28px"><b style="color:var(--ink);font-size:1.2rem">${esc(CFG.googleRating)} ★</b> on Google${CFG.googleReviewCount ? ` from ${esc(CFG.googleReviewCount)} reviews` : ""} · <a class="text-link" href="${esc(BIZ.googleReviewsUrl)}" target="_blank" rel="noopener">Read them all</a></p>` : "";
    box.innerHTML = summary + `<div class="reviews-grid">${list.slice(0, 6).map((r, k) => `
      <article class="review" data-reveal data-delay="${k * 80}">
        <div class="stars" aria-label="${esc(r.rating)} out of 5 stars">${stars(r.rating || 5)}</div>
        <blockquote>“${esc(r.text)}”</blockquote>
        <footer><b>${esc(r.name)}</b><span>${esc([r.room, r.date].filter(Boolean).join(" · "))}</span></footer>
      </article>`).join("")}</div>`;
  }

  /* ---------- Enquiries ---------- */
  function enquiryText(d) {
    const lines = [
      `New enquiry from the Reface website (${d.source || "website"})`,
      "",
      `Name: ${d.name || "-"}`,
      `Phone: ${d.phone || "-"}`,
      `Email: ${d.email || "-"}`,
      d.postcode ? `Postcode: ${d.postcode}` : "",
      d.interest ? `Interested in: ${d.interest}` : "",
      d.contactPref ? `Best way to contact: ${d.contactPref}` : "",
      d.message ? `\nMessage: ${d.message}` : "",
      d.estimate ? `\n${d.estimate}` : ""
    ];
    return lines.filter((l) => l !== "").join("\n");
  }

  async function sendEnquiry(data) {
    const form = CFG.form || {};
    const text = enquiryText(data);
    if (form.endpoint) {
      const body = Object.assign({}, data, { subject: `Website enquiry: ${data.name || ""}`, summary: text });
      if (form.accessKey) body.access_key = form.accessKey;
      const res = await fetch(form.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Send failed");
      return { sent: true };
    }
    return { sent: false, whatsapp: waLink(text), mailto: mailLink(`Website enquiry: ${data.name || ""}`, text) };
  }

  function initForms() {
    $$("form[data-enquiry]").forEach((f) => {
      const status = $(".form-status", f);
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(f);
        const data = Object.fromEntries(fd.entries());
        data.interest = fd.getAll("interest").join(", ");
        data.source = f.dataset.enquiry;
        if (typeof f._extra === "function") Object.assign(data, f._extra());
        let ok = true;
        ["name"].forEach((k) => { const el = f.elements[k]; const bad = !String(data[k] || "").trim(); el?.closest(".field")?.classList.toggle("invalid", bad); if (bad) ok = false; });
        const hasContact = String(data.phone || "").trim() || String(data.email || "").trim();
        f.elements.phone?.closest(".field")?.classList.toggle("invalid", !hasContact);
        if (!hasContact) ok = false;
        if (!ok) { status.className = "form-status err show"; status.textContent = "Please add your name and a phone number or email so we can get back to you."; return; }
        if (data.website) return; // spam trap
        const btn = $("button[type=submit]", f);
        btn.disabled = true; const label = btn.innerHTML; btn.textContent = "Sending…";
        try {
          const r = await sendEnquiry(data);
          if (r.sent) {
            status.className = "form-status ok show";
            status.textContent = `Thank you ${data.name.split(" ")[0]} — your enquiry is on its way. We'll be in touch during opening hours.`;
            f.reset();
          } else {
            status.className = "form-status ok show";
            status.innerHTML = `Nearly done. Choose how to send your enquiry:
              <div class="send-options">
                <a class="btn btn-whatsapp btn-block" href="${r.whatsapp}" target="_blank" rel="noopener">Send on WhatsApp</a>
                <a class="btn btn-ghost btn-block" href="${r.mailto}">Send by email</a>
              </div>`;
          }
        } catch (err) {
          status.className = "form-status err show";
          status.innerHTML = `Sorry, that didn't send. Please call us on <a href="tel:${BIZ.phoneLink}">${esc(BIZ.phoneDisplay)}</a>.`;
        } finally { btn.disabled = false; btn.innerHTML = label; }
      });
    });
  }

  // Expose helpers for the estimator and visualiser pages
  window.Reface = { sendEnquiry, enquiryText, waLink, mailLink, esc, STUDIO };

  /* ---------- Start every page at the top ----------
     Jump (not slide) to the top when a page opens, unless the address has a #section.
     Runs again on "pageshow" so going back to a page also starts at the top. */
  let touched = false;
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, () => (touched = true), { passive: true }));
  function toTop() {
    if (location.hash && location.hash.length > 1) return;
    if (touched) return; // never fight someone who is already scrolling
    const html = document.documentElement, prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }
  toTop();
  window.addEventListener("pageshow", (e) => { if (e.persisted) { touched = false; openedAt = Date.now(); } toTop(); });
  window.addEventListener("load", toTop);
  // Some viewers put the old scroll position back after the page has loaded.
  // For the first 3 seconds, if the page moves before the visitor touches it, put it back at the top.
  let openedAt = Date.now();
  window.addEventListener("scroll", () => {
    if (!touched && window.scrollY > 0 && Date.now() - openedAt < 3000) toTop();
  }, { passive: true });

  document.addEventListener("DOMContentLoaded", () => {
    bindBusiness();
    initReviews();
    bindBusiness();
    initChrome();
    initBack();
    initHero();
    initStudio();
    initBeforeAfter();
    initRails();
    initGallery();
    initForms();
    initReveal();
  });
})();
