// Goes through the site the way a client would on a phone, on four common phone sizes.
const { chromium } = require('playwright');
const SP = process.argv[2] || require('os').tmpdir(), B = 'http://localhost:8766/';
const PHONES = [
  ['iPhone SE', { width: 375, height: 667 }, 2],
  ['iPhone 15', { width: 393, height: 852 }, 3],
  ['Pixel 7', { width: 412, height: 915 }, 2.625],
  ['small Android', { width: 360, height: 780 }, 3],
];
(async () => {
  const b = await chromium.launch();
  const out = []; let fails = 0;
  const ok = (c, m) => { out.push((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  for (const [name, vp, dpr] of PHONES) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    const bad = []; p.on('response', r => r.status() >= 400 && bad.push(r.status() + ' ' + r.url()));
    const got = []; p.on('request', r => got.push(r.url()));
    const open = async (u) => { await p.goto(B + u, { waitUntil: 'networkidle' }); await p.waitForTimeout(3300); };
    const noSide = async (u) => ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} ${u}: nothing sticks out sideways`);

    // ---------- Home ----------
    await open('index.html');
    ok(got.some(u => u.includes('hero-tall-1080') || u.includes('hero-tall-720')), `${name}: sharp phone hero photo`);
    ok(!got.some(u => u.includes('/hero/navy-kitchen')), `${name}: computer hero photo not downloaded`);
    const cta = await p.locator('.hero-still .btn-whatsapp').boundingBox();
    ok(cta && cta.y + cta.height <= vp.height, `${name}: "Get a free Photoquote" visible without scrolling`);
    ok((await p.getAttribute('.hero-still .btn-whatsapp', 'href')).startsWith('https://wa.me/447457403407?text='), `${name}: hero Photoquote opens WhatsApp 07457 403407`);
    ok((await p.textContent('.hero-still [data-rating-text]')) === '5.0 from 173 Google reviews', `${name}: Google rating shows`);
    // header buttons big enough to tap
    const small = await p.$$eval('.site-header a:not([hidden]), .site-header button, .topbar a', els => els.filter(e => e.offsetParent).map(e => e.getBoundingClientRect()).filter(r => r.height < 40 || r.width < 40).length);
    ok(small === 0, `${name}: header buttons are big enough to tap`);
    ok((await p.getAttribute('.site-header .icon-btn[data-tel]', 'href')) === 'tel:+441914563718', `${name}: phone icon calls (0191) 456 3718`);
    // menu
    await p.tap('.menu-toggle'); await p.waitForTimeout(500);
    ok(await p.$eval('.mobile-menu', m => m.classList.contains('open')), `${name}: menu opens`);
    ok((await p.$$eval('.mobile-menu nav a', as => as.map(a => a.textContent).join(','))) === 'Home,Before & After,Reviews,Contact', `${name}: menu has the 4 pages`);
    await p.tap('.menu-close'); await p.waitForTimeout(500);
    ok(!(await p.$eval('.mobile-menu', m => m.classList.contains('open'))), `${name}: menu closes`);
    // bottom bar
    await p.evaluate(() => scrollTo(0, 900)); await p.waitForTimeout(600);
    ok(await p.$eval('.action-bar', a => a.classList.contains('show')), `${name}: Call / WhatsApp / Contact bar appears when scrolling`);
    const bar = await p.$$eval('.action-bar a', as => as.map(a => a.getAttribute('href')));
    ok(bar[0] === 'tel:+441914563718' && bar[1].startsWith('https://wa.me/447457403407') && bar[2] === 'contact.html', `${name}: bottom bar buttons go to the right places`);
    // Colour Studio
    await p.evaluate(() => document.querySelector('.cs-stage').scrollIntoView({ block: 'center' })); await p.waitForTimeout(2500);
    const st = await p.locator('.cs-stage').boundingBox();
    ok(Math.abs(st.width - st.height) < 3, `${name}: colour photo is square`);
    ok(/-sq-(600|1080)\.webp/.test(await p.getAttribute('.cs-a', 'src')) && await p.$eval('.cs-a', i => i.complete && i.naturalWidth > 0), `${name}: colour photo loads (phone version)`);
    await p.locator('.cs-dot').nth(10).tap(); await p.waitForTimeout(1300);
    ok((await p.textContent('.cs-name')) === 'Ivory Oak', `${name}: tapping a colour dot changes the colour`);
    ok(decodeURIComponent(await p.getAttribute('.cs-cta', 'href')).includes('Ivory Oak'), `${name}: "Photoquote in this colour" includes the colour`);
    await p.locator('.cs-styles button', { hasText: 'Handleless' }).tap(); await p.waitForTimeout(1300);
    ok((await p.textContent('.cs-range')).includes('Gloss'), `${name}: Handleless works`);
    for (const room of ['bedroom', 'bathroom']) {
      await p.locator(`.cs-tabs button[data-room=${room}]`).tap(); await p.waitForTimeout(1300);
      ok(await p.$eval('.cs-a', i => i.complete && i.naturalWidth > 0) && (await p.getAttribute('.cs-a', 'src')).includes(room), `${name}: ${room} tab works`);
    }
    const prev = await p.textContent('.cs-name');
    await p.evaluate(() => document.querySelector('.cs-stage').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    const sw = await p.locator('.cs-stage').boundingBox(); Object.assign(st, sw);
    await p.mouse.move(st.x + st.width * 0.85, st.y + st.height * 0.4); await p.mouse.down();
    await p.mouse.move(st.x + st.width * 0.15, st.y + st.height * 0.42, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(1300);
    ok((await p.textContent('.cs-name')) !== prev, `${name}: swiping the photo changes the colour`);
    // reviews on home
    ok((await p.locator('#reviews .review').count()) === 3, `${name}: 3 reviews on the home page`);
    const rm = p.locator('#reviews .review-more-btn').first();
    await rm.scrollIntoViewIfNeeded(); await rm.tap(); await p.waitForTimeout(300);
    ok((await rm.textContent()) === 'Show less', `${name}: "Read more" opens a long review`);
    await noSide('home');

    // ---------- Gallery ----------
    await open('gallery.html');
    ok((await p.locator('.ba-job .ba').count()) === 2 && (await p.locator('.job-photo').count()) === 22, `${name}: gallery shows the before & after and 22 job photos`);
    const ba = p.locator('.ba-job .ba').first(); await ba.scrollIntoViewIfNeeded(); await p.waitForTimeout(3000);
    const bb = await ba.boundingBox();
    await p.mouse.click(bb.x + bb.width * 0.2, bb.y + bb.height / 2); await p.waitForTimeout(200);
    ok(parseFloat(await ba.evaluate(e => e.style.getPropertyValue('--x'))) < 30, `${name}: before & after slider moves`);
    const ph = p.locator('.job-photo').nth(3); await ph.scrollIntoViewIfNeeded(); await ph.tap(); await p.waitForTimeout(500);
    ok(await p.$eval('dialog.lightbox', d => d.open), `${name}: tapping a photo opens it full screen`);
    await p.tap('.lb-next'); await p.waitForTimeout(300);
    ok(/^\d+ \/ \d+$/.test(await p.textContent('.lb-n')), `${name}: next photo works`);
    await p.tap('.lb-close'); await p.waitForTimeout(300);
    ok(!(await p.$eval('dialog.lightbox', d => d.open)), `${name}: photo closes with ✕`);
    await p.tap('[data-back]'); await p.waitForURL(/index/);
    ok(p.url().endsWith('index.html'), `${name}: Back button returns home`);
    await noSide('gallery');

    // ---------- Reviews ----------
    await open('reviews.html');
    ok((await p.locator('.review:not(.review-more)').count()) === 11 && (await p.textContent('[data-reviews]')).includes('5.0 ★ on Google from 173 reviews'), `${name}: reviews page shows 11 reviews and the rating`);
    await noSide('reviews');

    // ---------- Contact ----------
    await open('contact.html');
    const txt = await p.textContent('#contact');
    ok(txt.includes('07457 403407') && txt.includes('info@refacegroup.co.uk') && txt.includes('Monday – Thursday') && txt.includes('lines open'), `${name}: contact shows WhatsApp, email, hours and phone lines`);
    await p.locator('#contact button[type=submit]').scrollIntoViewIfNeeded();
    await p.tap('#contact button[type=submit]'); await p.waitForTimeout(300);
    ok((await p.textContent('.form-status')).toLowerCase().includes('name'), `${name}: form asks for name and phone if empty`);
    await p.tap('#f-name'); await p.keyboard.type('Test Client');
    await p.tap('#f-phone'); await p.keyboard.type('07700900123');
    const fs = await p.$eval('#f-name', i => parseFloat(getComputedStyle(i).fontSize));
    ok(fs >= 16, `${name}: form text ${fs}px (iPhones don't zoom in)`);
    await p.tap('#contact button[type=submit]'); await p.waitForTimeout(400);
    const send = await p.$$eval('.send-options a', as => as.map(a => a.href));
    ok(send.length === 2 && send[0].startsWith('https://wa.me/447457403407') && decodeURIComponent(send[0]).includes('Test Client') && send[1].startsWith('mailto:info@refacegroup.co.uk'), `${name}: form sends by WhatsApp or email with the details`);
    await noSide('contact');

    ok(!errs.length, `${name}: no errors ${errs.join(' | ')}`);
    ok(!bad.length, `${name}: no missing files ${bad.join(' | ')}`);
    await ctx.close();
  }
  // ---------- Computer hero ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); const got = []; p.on('request', r => got.push(r.url()));
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(B + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
    ok((await p.$eval('.hs-img', i => i.currentSrc)).includes('navy-kitchen-2560'), 'computer: hero is the finished navy kitchen photo (2560px)');
    ok(!got.some(u => u.includes('hero-tall') || u.includes('/hero/wide/')), 'computer: no phone photo or video frames downloaded');
    ok(await p.$eval('.hs-note', e => getComputedStyle(e).display !== 'none'), 'computer: photo labelled "Visualisation"');
    ok(!errs.length, `computer: no errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  console.log(out.filter(l => l.startsWith('FAIL')).join('\n') || 'no failures');
  console.log(`${out.length - fails} of ${out.length} checks passed`);
  await b.close();
})();
