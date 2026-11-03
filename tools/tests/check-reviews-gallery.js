const { chromium } = require('playwright');
const SP = process.argv[2] || require('os').tmpdir();
(async () => {
  const b = await chromium.launch();
  const out = []; const ok = (c, m) => out.push((c ? 'PASS ' : 'FAIL ') + m);
  for (const [name, vp, mobile] of [['phone', { width: 390, height: 844 }, true], ['desktop', { width: 1440, height: 900 }, false]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    const bad = []; p.on('response', r => r.status() >= 400 && bad.push(r.status() + ' ' + r.url()));
    const reveal = () => p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('in')));
    const imgs = () => p.evaluate(() => Promise.all([...document.images].map(i => { i.loading = 'eager'; return i.complete ? 0 : new Promise(r => i.onload = i.onerror = r); })));
    // Home
    await p.goto('http://localhost:8766/index.html', { waitUntil: 'networkidle' }); await reveal();
    const names = await p.$$eval('#reviews .review footer b', bs => bs.map(b => b.textContent));
    ok(names.join(',') === 'Kevin J.,Robert,Jacqueline S.', `${name}: home shows Kevin, Robert, Jacqueline (${names})`);
    ok(await p.locator('#reviews .review-more').count() === 0, `${name}: no Google filler card on home (3 reviews)`);
    const btn = p.locator('#reviews .review-more-btn').first();
    ok(await btn.isVisible(), `${name}: long review has Read more`);
    await p.locator('#reviews').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
    await p.locator('#reviews').screenshot({ path: `${SP}/r-home-${name}.png` });
    const h0 = await p.$eval('#reviews .review blockquote', q => q.clientHeight);
    await btn.click(); await p.waitForTimeout(200);
    const h1 = await p.$eval('#reviews .review blockquote', q => q.clientHeight);
    ok(h1 > h0 && (await btn.textContent()) === 'Show less', `${name}: Read more expands (${h0} -> ${h1})`);
    // Reviews page
    await p.goto('http://localhost:8766/reviews.html', { waitUntil: 'networkidle' }); await reveal();
    ok((await p.locator('.review:not(.review-more)').count()) === 11 && (await p.locator('.review-more').count()) === 1, `${name}: reviews page shows 11 reviews + Google card`);
    const kev = await p.$eval('.review blockquote', q => q.querySelectorAll('p').length);
    ok(kev === 5, `${name}: Kevin's review keeps its 5 paragraphs`);
    const txt = await p.textContent('[data-reviews]');
    ok(txt.includes('Andy, the fitter, was a credit to his trade') && txt.includes('Thank you for doing such a great job .') && txt.includes('Re-face to others'), `${name}: text word for word`);
    await p.screenshot({ path: `${SP}/r-page-${name}.png`, fullPage: true });
    // Gallery
    await p.goto('http://localhost:8766/gallery.html', { waitUntil: 'networkidle' }); await reveal(); await imgs(); await p.waitForTimeout(400);
    ok((await p.locator('.job').count()) === 7 && (await p.locator('.job-photo').count()) === 22 && (await p.locator('.ba-job .ba').count()) === 2, `${name}: gallery has 7 jobs, 22 photos, 2 before/after sliders`);
    const revs = await p.$$eval('.job-review figcaption b', bs => bs.map(b => b.textContent));
    ok(revs.join(',') === 'Lynne J.,Karen B.,Jacqueline S.,Ethan P.,Robert,Christine F.,Judith H.', `${name}: each job shows its review (${revs})`);
    await p.screenshot({ path: `${SP}/r-gallery-${name}.png`, fullPage: true });
    const first = p.locator('.ba-job .ba').first();
    await p.goto('http://localhost:8766/gallery.html', { waitUntil: 'networkidle' }); await reveal(); await p.waitForTimeout(3300); // the site undoes non-visitor scrolls for 3s
    await first.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
    const mid = await first.evaluate(b => b.style.getPropertyValue('--x'));
    ok(mid !== '50%', `${name}: slider sweeps by itself once (at ${mid})`);
    await p.waitForTimeout(2000);
    const box = await first.boundingBox();
    await p.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.5); await p.waitForTimeout(200);
    const x = parseFloat(await first.evaluate(b => b.style.getPropertyValue('--x')));
    ok(x > 12 && x < 28, `${name}: tapping the slider moves the line (${x.toFixed(1)}%)`);
    await first.screenshot({ path: `${SP}/ba-${name}.png` });
    await p.locator('.job.n2 .job-photo').nth(1).click(); await p.waitForTimeout(400);
    ok((await p.textContent('.lb-n')) === '2 / 2', `${name}: viewer works on the bedroom job`);
    await p.keyboard.press('Escape');
    for (const u of ['index.html', 'reviews.html', 'gallery.html']) {
      await p.goto('http://localhost:8766/' + u, { waitUntil: 'networkidle' });
      const sw = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      ok(sw <= 0, `${name}: ${u} no sideways scroll`);
    }
    ok(errs.length === 0, `${name}: no errors ${errs.join(' | ')}`);
    ok(bad.length === 0, `${name}: no broken files ${bad.join(' | ')}`);
    await ctx.close();
  }
  console.log(out.join('\n')); await b.close();
})();
