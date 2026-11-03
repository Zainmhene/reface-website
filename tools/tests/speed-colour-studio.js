const { chromium } = require('playwright');
// usage: node speed-colour-studio.js [port 8766] [label] [Mbps 4] [ms before tapping 300]
const PORT = process.argv[2] || 8766, LABEL = process.argv[3] || 'site', MBPS = +(process.argv[4] || 4), WAIT = +(process.argv[5] || 300);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 120, downloadThroughput: MBPS * 1e6 / 8, uploadThroughput: 1.5e6 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'load' });
  await p.waitForTimeout(3300);
  await p.evaluate(() => document.querySelector('#offer').scrollIntoView());
  await p.waitForTimeout(2500); // reading what we offer
  await p.evaluate(() => document.querySelector('.cs-stage').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(WAIT);
  const res = [];
  const measure = async (sel, want, label) => {
    await p.evaluate((w) => {
      window.__m = { t0: performance.now(), start: null, end: null };
      const tick = () => {
        const a = document.querySelector('.cs-a'), line = document.querySelector('.cs-line'), wipe = document.querySelector('.cs-wipe');
        const sliding = (wipe && wipe.classList.contains('on')) || (line && getComputedStyle(line).opacity !== '0');
        const now = performance.now();
        if (window.__m.start === null && (sliding || (a.currentSrc.includes(w) && a.complete))) window.__m.start = now;
        if (a.currentSrc.includes(w) && a.complete && !sliding && !document.querySelector('.cs-stage').classList.contains('switching')) { window.__m.end = now; return; }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, want);
    await p.evaluate((sel) => { window.__m.t0 = performance.now(); document.querySelector(sel).click(); }, sel.replace(' >> nth=6', ':nth-child(7)').replace(' >> nth=9', ':nth-child(10)').replace(' >> nth=4', ':nth-child(5)').replace(' >> nth=5', ':nth-child(6)'));
    await p.waitForFunction(() => window.__m.end !== null, null, { timeout: 60000, polling: 50 });
    const m = await p.evaluate(() => window.__m);
    res.push(`${label.padEnd(22)} starts ${((m.start - m.t0) / 1000).toFixed(2)}s  done ${((m.end - m.t0) / 1000).toFixed(2)}s`);
  };
  await measure('.cs-dot >> nth=6', 'cashmere-oak', 'Tap a colour');
  await measure('.cs-dot >> nth=9', 'mussel-oak', 'Tap another colour');
  await measure('.cs-styles button:nth-child(2)', 'kitchen-parisian-blue', 'Switch to Handleless');
  await measure('.cs-dot >> nth=5', 'kitchen-metallic-blue', 'Tap a Handleless colour');
  await measure('.cs-tabs button[data-room=bedroom]', 'bedroom-parisian', 'Switch to Bedroom');
  await measure('.cs-dot >> nth=4', 'bedroom-stone-grey', 'Tap a bedroom colour');
  await measure('.cs-tabs button[data-room=bathroom]', 'bathroom-parisian', 'Switch to Bathroom');
  await measure('.cs-dot >> nth=5', 'bathroom-reed-green', 'Tap a bathroom colour');
  console.log(`== ${LABEL} (${MBPS} Mbps, tapping ${WAIT}ms after reaching the section)\n` + res.join('\n'));
  await b.close();
})();
