'use strict';
/* One omni-check run: every route, in light then dark mode, at each width,
 * through axe-core in a headless local browser. */
const { launchChrome, CDP } = require('./browser');
const { createCrawler } = require('./routes');

/* Waits until the page has settled: loaded, the OmniDesign theme applied
   ([data-omni-css] past "loading"), no DOM changes for 400ms and fonts
   ready — capped at 6s so an animated page cannot stall the run. */
const SETTLE = `new Promise((resolve) => {
  const start = Date.now(); let last = Date.now();
  const mo = new MutationObserver(() => { last = Date.now(); });
  mo.observe(document, { subtree: true, childList: true, characterData: true });
  const finish = () => { mo.disconnect(); const f = document.fonts && document.fonts.ready; (f && f.then ? f : Promise.resolve()).then(() => resolve(true), () => resolve(true)); };
  const tick = () => {
    const root = document.querySelector('[data-omni-css]');
    const loading = root && root.getAttribute('data-omni-css') === 'loading';
    if ((!loading && Date.now() - last > 400) || Date.now() - start > 6000) finish();
    else setTimeout(tick, 100);
  };
  if (document.readyState === 'complete') tick(); else addEventListener('load', tick, { once: true });
})`;

/* axe's defaults (WCAG A/AA + best practices, which include heading-order)
   plus label-content-name-mismatch, which axe ships switched off as
   experimental and which is exactly the failure omni-check exists to catch. */
const RUN_AXE = `axe.run(document, {
  resultTypes: ['violations'],
  rules: { 'label-content-name-mismatch': { enabled: true } },
}).then((r) => r.violations.map((v) => ({
  id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
  nodes: v.nodes.slice(0, 25).map((n) => ({ target: n.target, html: n.html })),
})))`;

const LINKS = `Array.from(document.querySelectorAll('a[href]'), (a) => a.href)`;

const FINGERPRINT = `(() => {
  const el = document.querySelector('[data-omni-css]') || document.body || document.documentElement;
  const cs = getComputedStyle(el);
  return [cs.backgroundColor, cs.color, cs.getPropertyValue('--Background').trim()].join('|');
})()`;

async function evaluate(cdp, sessionId, expression, { awaitPromise = false } = {}) {
  const r = await cdp.send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true }, sessionId);
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error((d.exception && d.exception.description) || d.text || 'evaluation failed');
  }
  return r.result.value;
}

/* A tab for one color mode. Dark mode is requested BOTH ways the provider
   reads it, so either setup works without omni-check knowing which the app
   uses: the saved choice persistDarkMode restores (localStorage
   'omni-dark-mode', or --dark-key) and the device setting
   defaultDarkMode="system" follows (prefers-color-scheme). */
async function openModeTab(cdp, mode, storageKeys) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  const store = storageKeys.map((k) => 'localStorage.setItem(' + JSON.stringify(k) + ',' + JSON.stringify(mode) + ');').join('');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'try{' + store + '}catch(e){}' }, sessionId);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: mode }] }, sessionId);
  return { targetId, sessionId };
}

async function auditPage(cdp, sessionId, url, { width, axeSource, timeout, wantLinks }) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
  const loaded = cdp.waitFor('Page.loadEventFired', sessionId, timeout).catch(() => null);
  const nav = await cdp.send('Page.navigate', { url }, sessionId);
  if (nav.errorText) throw new Error('could not load ' + url + ' (' + nav.errorText + ')');
  await loaded;
  await evaluate(cdp, sessionId, SETTLE, { awaitPromise: true });
  await evaluate(cdp, sessionId, axeSource);
  const violations = await evaluate(cdp, sessionId, RUN_AXE, { awaitPromise: true });
  const links = wantLinks ? await evaluate(cdp, sessionId, LINKS) : [];
  const fingerprint = await evaluate(cdp, sessionId, FINGERPRINT);
  return { violations, links, fingerprint };
}

/**
 * opts: { chromePath, baseUrl, startRoute, routes, cap, widths, modes,
 *         darkKeys, axeSource, timeout, log }
 * → { results: [{ route, mode, width, violations }], pages: [route], notes: [] }
 */
async function runCheck(opts) {
  const {
    chromePath, baseUrl, startRoute = '/', routes = null, cap = 30,
    widths = [1280, 390], modes = ['light', 'dark'], darkKeys = ['omni-dark-mode'],
    axeSource, timeout = 30000, log = () => {},
  } = opts;
  const origin = new URL(baseUrl).origin;
  const browser = await launchChrome(chromePath);
  let cdp;
  try {
    cdp = await CDP.connect(browser.wsEndpoint);
    const tabs = {};
    for (const m of modes) tabs[m] = await openModeTab(cdp, m, darkKeys);
    const crawler = createCrawler({ start: startRoute, routes, cap });
    const results = [];
    const pages = [];
    const notes = [];
    let activeModes = modes.slice();
    let first = true;
    for (let route = crawler.next(); route; route = crawler.next()) {
      const url = new URL(route, baseUrl).href;
      log('checking ' + route);
      let ok = true;
      for (const width of widths) {
        const prints = {};
        for (const mode of activeModes) {
          let page;
          try {
            page = await auditPage(cdp, tabs[mode].sessionId, url, {
              width, axeSource, timeout, wantLinks: mode === activeModes[0] && width === widths[0],
            });
          } catch (e) {
            if (first) throw e;
            notes.push(route + ': ' + e.message);
            ok = false;
            break;
          }
          if (page.links.length) crawler.add(page.links, origin);
          prints[mode] = page.fingerprint;
          results.push({ route, mode, width, violations: page.violations });
        }
        if (!ok) break;
        /* Did dark mode actually change anything? Checked once, on the first
           page: an app with neither persistDarkMode nor defaultDarkMode="system"
           has no dark mode to reach from outside, and checking it twice would
           only double every count. */
        if (first && prints.light && prints.dark && prints.light === prints.dark) {
          notes.push('dark mode looked the same as light on ' + route + ' — the app does not follow the device '
            + '(defaultDarkMode="system") or a saved choice (persistDarkMode); dark runs skipped.');
          activeModes = activeModes.filter((m) => m !== 'dark');
          for (let i = results.length - 1; i >= 0; i--) if (results[i].mode === 'dark') results.splice(i, 1);
        }
        first = false;
      }
      if (ok) pages.push(route);
    }
    return { results, pages, notes, modes: activeModes };
  } finally {
    if (cdp) cdp.close();
    browser.close();
  }
}

module.exports = { runCheck };
