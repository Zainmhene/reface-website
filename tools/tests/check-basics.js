const { chromium } = require('playwright');
const fs = require('fs');
const B = 'http://127.0.0.1:8766/';
(async () => {
  const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } } : {});
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(page.url() + ' ' + e.message));
  page.on('response', r => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
  const ok = (n, c) => console.log((c ? 'PASS ' : 'FAIL ') + n);
  const pages = ['index.html', 'gallery.html', 'reviews.html', 'contact.html'];
  // every internal link points to a page that exists, and opens at the top
  const links = new Set();
  for (const p of pages) {
    await page.goto(B + p, { waitUntil: 'networkidle' });
    (await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')))).forEach(h => { if (h && !/^(tel:|mailto:|https?:|#)/.test(h)) links.add(h); });
  }
  let bad = 0;
  for (const h of links) {
    const file = h.split('#')[0].split('?')[0];
    if (!fs.existsSync(require('path').join(__dirname, '..', '..', file))) { bad++; console.log('missing page:', h); continue; }
    await page.goto(B + 'contact.html'); await page.evaluate(() => scrollTo(0, 2000));
    await page.goto(B + h, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(500);
    const y = await page.evaluate(() => scrollY);
    if (!h.includes('#') && y > 5) { bad++; console.log('opens part-way down:', h, y); }
  }
  ok(`all ${links.size} internal links work and open at the top`, bad === 0);
  // Photoquote buttons go to WhatsApp with the message
  await page.goto(B + 'index.html', { waitUntil: 'networkidle' });
  const wa = await page.$$eval('[data-wa]', as => as.map(a => a.href));
  ok(`${wa.length} Photoquote/WhatsApp buttons open WhatsApp with the message`, wa.every(h => h.startsWith('https://wa.me/447457403407?text=Hi%20Reface')));
  const g = await page.$$eval('[data-google]', as => as.map(a => a.href));
  ok(`${g.length} Google review links point to the Google listing`, g.length > 0 && g.every(h => h.includes('share.google/85vLoGir77iD04as1')));
  const mails = await page.$$eval('a[data-mail]', as => as.map(a => a.getAttribute('href')));
  ok('email links use info@refacegroup.co.uk (' + mails.length + ')', mails.length > 0 && mails.every(h => h === 'mailto:info@refacegroup.co.uk'));
  ok('top bar shows phone line hours', (await page.textContent('.topbar')).includes('Mon–Fri 9am–5pm, Sat 10am–3pm'));
  // Menu + Back
  await page.click('.menu-toggle'); await page.waitForTimeout(400);
  ok('menu: ' + (await page.$$eval('.mobile-menu nav a', as => as.map(a => a.textContent).join(', '))), (await page.$$('.mobile-menu nav a')).length === 4);
  await page.click('.mobile-menu nav a[href="gallery.html"]'); await page.waitForURL(/gallery/);
  ok('gallery shows before & after sliders and the real job photos', (await page.$$('.ba-job .ba')).length === 2 && (await page.$$('.job-photo')).length === 22);
  await page.tap('[data-back]'); await page.waitForURL(/index/); ok('Back returns home', page.url().endsWith('index.html'));
  // Contact form
  await page.goto(B + 'contact.html', { waitUntil: 'networkidle' });
  await page.click('#contact button[type=submit]'); ok('form asks for name + phone', (await page.textContent('.form-status')).includes('name'));
  await page.fill('#f-name', 'Test Person'); await page.fill('#f-phone', '07000000000'); await page.click('#contact button[type=submit]'); await page.waitForTimeout(300);
  const opts = await page.$$eval('.send-options a', as => as.map(a => a.textContent.trim()));
  ok('form sends via WhatsApp or email: ' + opts.join(' / '), opts[0] === 'Send on WhatsApp' && opts[1] === 'Send by email');
  ok('contact page shows email, phone lines and opening hours', (await page.textContent('#contact')).includes('info@refacegroup.co.uk') && (await page.textContent('#contact')).includes('lines open') && (await page.textContent('#contact')).includes('Monday – Thursday'));
  // Before & after renders when photos are added (temporary test data, not saved)
  await page.goto(B + 'gallery.html');
  await page.evaluate(() => { window.REFACE.work = [{ title: 'Test', place: 'Here', before: 'assets/img/home/kitchens-800.webp', after: 'assets/img/home/bedrooms-800.webp' }]; });
  await page.addInitScript(() => { window.__t = 1; });
  await page.route('**/js/config.js', async (route) => { const r = await route.fetch(); const body = (await r.text()).replace('work: [', 'work: [{ title: "Test job", place: "South Shields", before: "assets/img/home/kitchens-800.webp", after: "assets/img/home/bedrooms-800.webp" },'); route.fulfill({ response: r, body }); });
  await page.goto(B + 'gallery.html', { waitUntil: 'networkidle' });
  await page.$eval('.ba input[type=range]', i => { i.value = 30; i.dispatchEvent(new Event('input')); });
  ok('before & after slider works when photos are added', (await page.$eval('.ba', b => b.style.getPropertyValue('--x'))) === '30%');
  console.log('errors:', errs.length ? errs : 'none');
  await browser.close();
})();
