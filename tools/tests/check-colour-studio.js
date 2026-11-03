const { chromium } = require('playwright');
const SP = process.argv[2] || require('os').tmpdir();
(async () => {
  const b = await chromium.launch();
  const out = [];
  const ok = (c, m) => out.push((c ? 'PASS ' : 'FAIL ') + m);
  for (const [name, vp, mobile] of [['phone', { width: 390, height: 844 }, true], ['desktop', { width: 1440, height: 900 }, false]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    const bad = []; p.on('response', r => r.status() >= 400 && bad.push(r.status() + ' ' + r.url()));
    await p.goto('http://localhost:8766/index.html', { waitUntil: 'networkidle' });
    await p.waitForTimeout(3200);
    await p.screenshot({ path: `${SP}/v-hero-${name}.png` });
    // Scroll to studio, wait for auto-wipe
    await p.locator('#studio').scrollIntoViewIfNeeded();
    await p.evaluate(() => document.querySelector('.cs-stage').scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(600);
    const before = await p.textContent('.cs-name');
    await p.waitForTimeout(3000);
    const after = await p.textContent('.cs-name');
    ok(before === 'Parisian Blue Oak' && after === 'Reed Green Oak', `${name}: auto-wipe teaser ${before} -> ${after}`);
    ok((await p.locator('.cs-dot').count()) === 12, `${name}: 12 colour dots on kitchen shaker`);
    await p.screenshot({ path: `${SP}/v-studio-${name}.png` });
    // Tap a dot
    await p.locator('.cs-dot').nth(6).click(); await p.waitForTimeout(1200);
    ok((await p.textContent('.cs-name')) === 'Cashmere Oak', `${name}: tapping a dot changes colour`);
    const href = await p.getAttribute('.cs-cta', 'href');
    ok(href.startsWith('https://wa.me/') && decodeURIComponent(href).includes('Cashmere Oak'), `${name}: Photoquote button carries the colour`);
    // Handleless
    await p.locator('.cs-styles button', { hasText: 'Handleless' }).click(); await p.waitForTimeout(1200);
    ok((await p.locator('.cs-dot').count()) === 11 && (await p.textContent('.cs-range')).includes('Gloss'), `${name}: Handleless style`);
    // Bedroom + bathroom tabs
    await p.locator('.cs-tabs button[data-room=bedroom]').click(); await p.waitForTimeout(1200);
    ok((await p.textContent('.cs-range')).includes('Matfen'), `${name}: bedroom tab`);
    await p.locator('.cs-tabs button[data-room=bathroom]').click(); await p.waitForTimeout(1200);
    ok((await p.textContent('.cs-note')).includes('visualisation'), `${name}: bathroom tab labelled as visualisation`);
    await p.screenshot({ path: `${SP}/v-bath-${name}.png` });
    // Swipe on phone
    if (mobile) {
      const box = await p.locator('.cs-stage').boundingBox();
      const prev = await p.textContent('.cs-name');
      await p.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.4);
      await p.mouse.down(); await p.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.42, { steps: 8 }); await p.mouse.up();
      await p.waitForTimeout(1200);
      ok((await p.textContent('.cs-name')) !== prev, `${name}: swipe changes colour`);
    }
    // Parallax
    await p.evaluate(() => window.scrollTo(0, 300)); await p.waitForTimeout(300);
    const tr = await p.evaluate(() => getComputedStyle(document.querySelector('.hero-still picture')).transform);
    ok(tr.includes('90'), `${name}: hero parallax (${tr})`);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(sw <= 0, `${name}: no sideways scroll`);
    ok(errs.length === 0, `${name}: no errors ${errs.join(' | ')}`);
    ok(bad.length === 0, `${name}: no broken files ${bad.join(' | ')}`);
    await ctx.close();
  }
  console.log(out.join('\n'));
  await b.close();
})();
