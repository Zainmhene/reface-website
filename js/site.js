/* REFACE — site behaviour (no libraries needed) */
(function () {
  "use strict";
  const CFG = window.REFACE || {};
  const BIZ = CFG.business || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Links built from config.js ---------- */
  const waLink = (text) => `https://wa.me/${BIZ.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const mailLink = (subject, body) => `mailto:${BIZ.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  function bindBusiness() {
    $$("[data-tel]").forEach((a) => {
      a.href = "tel:" + BIZ.phoneLink;
      if (a.dataset.tel === "text") a.textContent = BIZ.phoneDisplay;
    });
    $$("[data-wa]").forEach((a) => {
      a.href = waLink(a.dataset.wa || CFG.photoquoteMessage);
      a.target = "_blank"; a.rel = "noopener";
    });
    // Email links only show once an email address is filled in config.js
    $$("[data-mail]").forEach((a) => {
      if (!BIZ.email) { (a.closest("[data-mail-row]") || a).hidden = true; return; }
      a.href = "mailto:" + BIZ.email;
      if (a.dataset.mail === "text") a.textContent = BIZ.email;
    });
    $$("[data-hours]").forEach((ul) => {
      ul.innerHTML = (BIZ.hours || []).map((h) => `<li><span>${esc(h.days)}</span><b>${esc(h.time)}</b></li>`).join("");
    });
    $$("[data-address]").forEach((el) => (el.textContent = BIZ.address));
    $$("[data-lines]").forEach((el) => (el.textContent = BIZ.phoneLines));
    $$("[data-area]").forEach((el) => (el.textContent = BIZ.area));
    $$("[data-maps]").forEach((a) => { a.href = BIZ.mapsUrl; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-google]").forEach((a) => { a.href = BIZ.googleReviewsUrl; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Back button (every page except home) ----------
     Goes back to the page you came from on this site; if the page was
     opened directly, it goes to the home page instead. */
  function initBack() {
    $$("[data-back]").forEach((a) => a.addEventListener("click", (e) => {
      let fromHere = false;
      try { fromHere = !!document.referrer && new URL(document.referrer).origin === location.origin && document.referrer !== location.href; } catch (_) { /* ignore */ }
      if (fromHere && history.length > 1) { e.preventDefault(); history.back(); }
    }));
  }

  /* ---------- Header, menu, bottom bar ---------- */
  function initChrome() {
    const header = $(".site-header");
    const bar = $(".action-bar");
    const onScroll = () => {
      header && header.classList.toggle("scrolled", window.scrollY > 8);
      bar && bar.classList.toggle("show", window.scrollY > 420);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const menu = $(".mobile-menu");
    const openBtn = $(".menu-toggle");
    if (!menu || !openBtn) return;
    const close = () => { menu.classList.remove("open"); document.body.classList.remove("menu-open"); openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); };
    openBtn.addEventListener("click", () => {
      menu.classList.add("open"); document.body.classList.add("menu-open"); openBtn.setAttribute("aria-expanded", "true");
      setTimeout(() => $(".menu-close", menu)?.focus(), 50);
    });
    $(".menu-close", menu)?.addEventListener("click", close);
    $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.classList.remove("open"); document.body.classList.remove("menu-open"); }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) close(); });
  }

  /* ---------- Fade sections in as you scroll ---------- */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const d = en.target.dataset.delay;
        if (d) en.target.style.transitionDelay = d + "ms";
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Before & after gallery (photos listed in config.js) ---------- */
  function initWork() {
    const box = $("[data-work]");
    if (!box) return;
    const list = CFG.work || [];
    if (!list.length) {
      box.innerHTML = `
        <div class="empty-card" data-reveal>
          <p class="eyebrow">Coming soon</p>
          <h2>Our before &amp; after photos are on their way.</h2>
          <p>We're putting together photos of recent kitchens, bedrooms and bathrooms we've transformed. In the meantime, you can see our work and read what customers say on Google.</p>
          <div class="btn-row">
            <a class="btn" data-google href="${esc(BIZ.googleReviewsUrl)}">See our work on Google</a>
            <a class="btn btn-ghost" data-wa href="#">Get a free Photoquote</a>
          </div>
        </div>`;
      return;
    }
    box.innerHTML = `<div class="work-grid">${list.map((w, k) => `
      <figure class="work-card" data-reveal data-delay="${(k % 2) * 80}">
        <div class="ba">
          <img src="${esc(w.before)}" alt="${esc(w.title)} before" loading="lazy">
          <img class="ba-after" src="${esc(w.after)}" alt="${esc(w.title)} after" loading="lazy">
          <div class="ba-handle"></div>
          <span class="ba-label l">Before</span><span class="ba-label r">After</span>
          <input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after: ${esc(w.title)}">
        </div>
        <figcaption><b>${esc(w.title)}</b><span>${esc([w.place, w.note].filter(Boolean).join(" · "))}</span></figcaption>
      </figure>`).join("")}</div>`;
  }

  function initBeforeAfter() {
    $$(".ba").forEach((ba) => {
      const input = $("input[type=range]", ba);
      if (!input) return;
      const set = () => ba.style.setProperty("--x", input.value + "%");
      input.addEventListener("input", set); set();
    });
  }

  /* ---------- Testimonials (real Google reviews from config.js) ---------- */
  function initReviews() {
    $$("[data-reviews]").forEach((box) => {
      const limit = +box.dataset.reviews || 99;
      const list = (CFG.reviews || []).slice(0, limit);
      if (!list.length) {
        box.innerHTML = `
          <div class="reviews-cta" data-reveal>
            <div class="big-stars" aria-hidden="true">★★★★★</div>
            <div>
              <h3>Read what our customers say on Google</h3>
              <p>Real reviews from homeowners who've had their kitchens, bedrooms and bathrooms made over by Reface.</p>
            </div>
            <a class="btn" data-google href="${esc(BIZ.googleReviewsUrl)}">Read our Google reviews</a>
          </div>`;
        return;
      }
      const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
      const summary = CFG.googleRating ? `<p class="center muted" style="margin-bottom:28px"><b style="color:var(--ink);font-size:1.2rem">${esc(CFG.googleRating)} ★</b> on Google${CFG.googleReviewCount ? ` from ${esc(CFG.googleReviewCount)} reviews` : ""} · <a class="text-link" data-google href="${esc(BIZ.googleReviewsUrl)}">Read them all</a></p>` : "";
      box.innerHTML = summary + `<div class="reviews-grid">${list.map((r, k) => `
        <article class="review" data-reveal data-delay="${(k % 3) * 80}">
          <div class="stars" aria-label="${esc(r.rating)} out of 5 stars">${stars(r.rating || 5)}</div>
          <blockquote>“${esc(r.text)}”</blockquote>
          <footer><b>${esc(r.name)}</b><span>${esc([r.room, r.date].filter(Boolean).join(" · "))}</span></footer>
        </article>`).join("")}</div>`;
    });
  }

  /* ---------- Contact form ---------- */
  function enquiryText(d) {
    return [
      "New enquiry from the Reface website",
      "",
      `Name: ${d.name || "-"}`,
      `Phone: ${d.phone || "-"}`,
      `Email: ${d.email || "-"}`,
      d.postcode ? `Postcode: ${d.postcode}` : "",
      d.interest ? `Interested in: ${d.interest}` : "",
      d.message ? `\nMessage: ${d.message}` : ""
    ].filter((l) => l !== "").join("\n");
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
    return { sent: false, whatsapp: waLink(text), mailto: BIZ.email ? mailLink(`Website enquiry: ${data.name || ""}`, text) : "" };
  }

  function initForms() {
    $$("form[data-enquiry]").forEach((f) => {
      const status = $(".form-status", f);
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(f);
        const data = Object.fromEntries(fd.entries());
        data.interest = fd.getAll("interest").join(", ");
        if (data.website) return; // spam trap: real people never fill this hidden box
        const noName = !String(data.name || "").trim();
        const noContact = !String(data.phone || "").trim() && !String(data.email || "").trim();
        f.elements.name?.closest(".field")?.classList.toggle("invalid", noName);
        f.elements.phone?.closest(".field")?.classList.toggle("invalid", noContact);
        if (noName || noContact) {
          status.className = "form-status err show";
          status.textContent = "Please add your name and a phone number or email so we can get back to you.";
          return;
        }
        const btn = $("button[type=submit]", f);
        btn.disabled = true; const label = btn.innerHTML; btn.textContent = "Sending…";
        try {
          const r = await sendEnquiry(data);
          status.className = "form-status ok show";
          if (r.sent) {
            status.textContent = `Thank you ${data.name.split(" ")[0]}, your enquiry is on its way. We'll be in touch during opening hours.`;
            f.reset();
          } else {
            status.innerHTML = `Nearly done. Tap below to send your enquiry:
              <div class="send-options">
                <a class="btn btn-whatsapp btn-block" href="${r.whatsapp}" target="_blank" rel="noopener">Send on WhatsApp</a>
                ${r.mailto ? `<a class="btn btn-ghost btn-block" href="${r.mailto}">Send by email</a>` : `<a class="btn btn-ghost btn-block" href="tel:${BIZ.phoneLink}">Or call ${esc(BIZ.phoneDisplay)}</a>`}
              </div>`;
          }
        } catch (err) {
          status.className = "form-status err show";
          status.innerHTML = `Sorry, that didn't send. Please call us on <a href="tel:${BIZ.phoneLink}">${esc(BIZ.phoneDisplay)}</a>.`;
        } finally { btn.disabled = false; btn.innerHTML = label; }
      });
    });
  }

  /* ---------- Every page opens at the top ----------
     Jump to the top when a page opens (unless the address has a #section).
     Some viewers put back an old scroll position after loading, so for the first
     3 seconds, any scroll the visitor didn't make is undone. */
  let touched = false, openedAt = Date.now();
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, () => (touched = true), { passive: true }));
  function toTop() {
    if ((location.hash && location.hash.length > 1) || touched) return;
    const html = document.documentElement, prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }
  toTop();
  window.addEventListener("pageshow", (e) => { if (e.persisted) { touched = false; openedAt = Date.now(); } toTop(); });
  window.addEventListener("load", toTop);
  window.addEventListener("scroll", () => { if (!touched && window.scrollY > 0 && Date.now() - openedAt < 3000) toTop(); }, { passive: true });

  document.addEventListener("DOMContentLoaded", () => {
    initReviews();
    initWork();
    bindBusiness(); // after reviews/work so their buttons get the real links too
    initChrome();
    initBack();
    initBeforeAfter();
    initForms();
    initReveal();
  });
})();
