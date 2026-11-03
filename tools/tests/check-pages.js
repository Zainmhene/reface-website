const { chromium } = require('playwright');
const SP = process.argv[2] || require('os').tmpdir(), B = 'http://localhost:8766/';
const PAGES = ['index.html', 'gallery.html', 'reviews.html', 'contact.html'];
(async () => {
  const b = await chromium.launch(); const out = []; let fails = 0;
  const ok = (c, m) => { out.push((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const sizes = [['small phone', { width: 360, height: 740 }, true], ['phone', { width: 390, height: 844 }, true], ['tablet', { width: 820, height: 1180 }, true], ['desktop', { width: 1440, height: 900 }, false]];
  const internal = new Set();
  for (const [name, vp, mobile] of sizes) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1 });
    for (const pg of PAGES) {
      const p = await ctx.newPage();
      const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      const bad = []; p.on('response', r => r.status() >= 400 && bad.push(r.status() + ' ' + r.url()));
      await p.goto(B + pg, { waitUntil: 'networkidle' });
      // load every picture on the page, including the lazy ones lower down
      await p.evaluate(() => Promise.all([...document.images].map(i => { i.loading = 'eager'; return i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); }); })));
      const broken = await p.evaluate(() => [...document.images].filter(i => i.getAttribute('src') && (!i.complete || !i.naturalWidth)).map(i => i.getAttribute('src')));
      const sw = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const links = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
      links.filter(h => /^[a-z]+\.html/.test(h) || h.startsWith('assets/')).forEach(h => internal.add(h.split('#')[0]));
      const hrefs = await p.$$eval('a[href]', as => as.map(a => a.href));
      const wa = hrefs.filter(h => h.includes('wa.me')), tel = hrefs.filter(h => h.startsWith('tel:')), mail = hrefs.filter(h => h.startsWith('mailto:'));
      ok(!errs.length, `${name} ${pg}: no errors ${errs.join(' | ')}`);
      ok(!bad.length, `${name} ${pg}: no missing files ${bad.join(' | ')}`);
      ok(!broken.length, `${name} ${pg}: all ${await p.evaluate(() => document.images.length)} pictures load ${broken.join(' ')}`);
      ok(sw <= 0, `${name} ${pg}: no sideways scroll (${sw})`);
      ok(wa.length && wa.every(h => h.startsWith('https://wa.me/447457403407')), `${name} ${pg}: ${wa.length} WhatsApp links → 07457 403407`);
      ok(tel.every(h => h === 'tel:+441914563718'), `${name} ${pg}: call links → (0191) 456 3718`);
      ok(mail.every(h => h.startsWith('mailto:info@refacegroup.co.uk')), `${name} ${pg}: email links → info@refacegroup.co.uk`);
      ok(await p.$('meta[name=robots][content*=noindex]') !== null, `${name} ${pg}: hidden from Google while it's a preview`);
      if (name === 'phone') await p.screenshot({ path: `${SP}/final-${pg.replace('.html', '')}.png`, fullPage: true });
      await p.close();
    }
    await ctx.close();
  }
  // every internal link and file exists
  const ctx = await b.newContext(); const p = await ctx.newPage();
  let missing = [];
  for (const h of internal) { const r = await p.request.get(B + h); if (r.status() !== 200) missing.push(h); }
  ok(!missing.length, `all ${internal.size} internal links and files exist ${missing.join(' ')}`);
  // sharp photo arrives after a tap (phone, 4G)
  const pc = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const pp = await pc.newPage(); const cdp = await pc.newCDPSession(pp);
  await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 120, downloadThroughput: 4e6 / 8, uploadThroughput: 1e6 / 8 });
  await pp.goto(B + 'index.html', { waitUntil: 'load' }); await pp.waitForTimeout(3300);
  await pp.evaluate(() => document.querySelector('#offer').scrollIntoView()); await pp.waitForTimeout(2000);
  await pp.evaluate(() => document.querySelector('.cs-stage').scrollIntoView({ block: 'center' })); await pp.waitForTimeout(300);
  await pp.evaluate(() => document.querySelector('.cs-styles button:nth-child(2)').click()); await pp.waitForTimeout(800);
  const t0 = Date.now(); await pp.evaluate(() => document.querySelector('.cs-dot:nth-child(7)').click());
  await pp.waitForFunction(() => /kitchen-reed-green-(1600|sq-1080)\.webp/.test(document.querySelector('.cs-a').getAttribute('src')), null, { timeout: 20000, polling: 50 }).catch(() => {});
  const sharpAt = (Date.now() - t0) / 1000;
  ok(sharpAt < 3, `Handleless colour on a 4G phone: sharp photo showing ${sharpAt.toFixed(1)}s after the tap`);
  await pp.locator('.cs-stage').screenshot({ path: `${SP}/final-handleless.png` });
  console.log(out.filter(l => l.startsWith('FAIL')).join('\n') || 'no failures');
  console.log(`${out.length - fails} of ${out.length} checks passed`);
  console.log(out.filter(l => /internal links|sharp photo|small phone index|desktop contact/.test(l)).join('\n'));
  await b.close();
})();
