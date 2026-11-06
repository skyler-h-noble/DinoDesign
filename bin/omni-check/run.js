'use strict';
/* One omni-check run: every route, in light then dark mode, at each width,
 * through axe-core in a headless local browser. */
const { launchChrome, CDP, TimeoutError } = require('./browser');
const { createCrawler } = require('./routes');

/* Waits until the page has settled, in two phases:
   1. loaded and the OmniDesign theme applied — the provider hides the whole
      tree (visibility: hidden) while [data-omni-css="loading"], and axe run
      on a hidden tree reports a missing <main> and nothing else. Up to 20s,
      since a cold first visit fetches the theme over the network.
   2. no DOM changes for 400ms (lazy routes, data) and fonts ready — capped
      at 6s so an animated page cannot stall the run.
   Resolves 'ready', or 'loading' when the theme never applied. The caps
   start now, not at the load event, so a page whose load event never comes
   is still bounded. */
const SETTLE = `new Promise((resolve) => {
  const start = Date.now(); let last = Date.now(); let phase2 = 0;
  const mo = new MutationObserver(() => { last = Date.now(); });
  mo.observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['data-omni-css'] });
  const loading = () => { const root = document.querySelector('[data-omni-css]'); return !!root && root.getAttribute('data-omni-css') === 'loading'; };
  const finish = (state) => { mo.disconnect(); const f = document.fonts && document.fonts.ready;
    Promise.race([f && f.then ? f : Promise.resolve(), new Promise((r) => setTimeout(r, 2000))]).then(() => resolve(state), () => resolve(state)); };
  const tick = () => {
    const now = Date.now();
    if (phase2 && loading()) phase2 = 0; // the provider mounted after phase 1 passed
    if (!phase2) {
      if (document.readyState === 'complete' && !loading()) { phase2 = now; }
      else if (now - start > 20000) return finish(loading() ? 'loading' : 'ready');
    }
    if (phase2 && ((now - last > 400) || now - phase2 > 6000)) return finish(loading() ? 'loading' : 'ready');
    setTimeout(tick, 100);
  };
  tick();
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

/** `promise`, or a TimeoutError naming `what` after `ms`. */
function withTimeout(promise, ms, what) {
  let timer;
  const t = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(what + ' did not finish within ' + Math.round(ms / 1000) + 's')), ms);
  });
  return Promise.race([promise, t]).finally(() => clearTimeout(timer));
}

async function evaluate(cdp, sessionId, expression, { awaitPromise = false, timeout = 30000, what = 'script' } = {}) {
  const r = await cdp.send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true }, sessionId, { timeout });
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error(what + ': ' + ((d.exception && d.exception.description) || d.text || 'evaluation failed'));
  }
  return r.result.value;
}

/* A page for one color mode, in its OWN browser context: separate
   localStorage, cookies and cache, as two different visitors would have.
   The two modes used to share one profile, so the light page and the dark
   page read and wrote the same 'omni-dark-mode' key — in a real run both
   ended up light. Dark mode is requested both ways the provider reads it,
   so either setup works without omni-check knowing which the app uses: the
   saved choice persistDarkMode restores (localStorage 'omni-dark-mode', or
   --dark-key) and the device setting defaultDarkMode="system" follows
   (prefers-color-scheme). Focus is emulated so the page behaves as the
   focused, visible one even when another window was created after it. */
async function openModePage(cdp, mode, storageKeys, timeout) {
  const o = { timeout };
  const { browserContextId } = await cdp.send('Target.createBrowserContext', { disposeOnDetach: true }, undefined, o);
  try {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', browserContextId }, undefined, o);
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true }, undefined, o);
    await cdp.send('Page.enable', {}, sessionId, o);
    await cdp.send('Runtime.enable', {}, sessionId, o);
    const store = storageKeys.map((k) => 'localStorage.setItem(' + JSON.stringify(k) + ',' + JSON.stringify(mode) + ');').join('');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'try{' + store + '}catch(e){}' }, sessionId, o);
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: mode }] }, sessionId, o);
    await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true }, sessionId, o).catch(() => {});
    return { mode, browserContextId, targetId, sessionId };
  } catch (e) {
    await cdp.send('Target.disposeBrowserContext', { browserContextId }, undefined, { timeout: 5000 }).catch(() => {});
    throw e;
  }
}

async function closeModePage(cdp, page) {
  if (!page) return;
  await cdp.send('Target.disposeBrowserContext', { browserContextId: page.browserContextId }, undefined, { timeout: 5000 }).catch(() => {});
}

/* One page in one mode at one width. Every step has its own limit, and the
   caller bounds the whole thing, so a page that never loads, never settles
   or blocks its main thread is reported instead of hanging the run. */
async function auditPage(cdp, sessionId, url, { width, axeSource, stepTimeout, wantLinks, step }) {
  const o = { timeout: stepTimeout };
  step('bringing the page to the front');
  await cdp.send('Page.bringToFront', {}, sessionId, o).catch(() => {});
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 }, sessionId, o);
  step('loading the page');
  const loaded = cdp.waitFor('Page.loadEventFired', sessionId, stepTimeout).catch(() => null);
  const nav = await cdp.send('Page.navigate', { url }, sessionId, o);
  if (nav.errorText) throw new Error('could not load ' + url + ' (' + nav.errorText + ')');
  await loaded;
  step('waiting for the page to settle');
  const settled = await evaluate(cdp, sessionId, SETTLE, { awaitPromise: true, timeout: 32000, what: 'waiting for the page to settle' });
  if (settled === 'loading') throw new Error('the OmniDesign theme was still loading after 20s (the page stays hidden until it applies) — is themeURL reachable?');
  step('injecting axe');
  await evaluate(cdp, sessionId, axeSource, { timeout: stepTimeout, what: 'injecting axe' });
  if (await evaluate(cdp, sessionId, 'typeof axe', { what: 'injecting axe' }) !== 'object') throw new Error('axe-core did not load into the page');
  step('running axe');
  const violations = await evaluate(cdp, sessionId, RUN_AXE, { awaitPromise: true, timeout: stepTimeout, what: 'axe.run' });
  step('reading links');
  const links = wantLinks ? await evaluate(cdp, sessionId, LINKS, { what: 'reading links' }) : [];
  const fingerprint = await evaluate(cdp, sessionId, FINGERPRINT, { what: 'reading colors' });
  return { violations, links, fingerprint };
}

/**
 * opts: { chromePath, baseUrl, startRoute, routes, cap, widths, modes,
 *         darkKeys, axeSource, pageTimeout, maxTime, log, deps }
 *   pageTimeout  ms for one page in one mode at one width (default 60s)
 *   maxTime      ms for the whole run (default 10 min); what is left is listed
 *   deps         { launch, connect } — injectable for tests
 * → { results: [{ route, mode, width, violations }], pages: [route],
 *     failed: [{ route, mode, width, error }], skipped: [route],
 *     notes: [], modes, incomplete, elapsed }
 */
async function runCheck(opts) {
  const {
    chromePath, baseUrl, startRoute = '/', routes = null, cap = 30,
    widths = [1280, 390], modes = ['light', 'dark'], darkKeys = ['omni-dark-mode'],
    axeSource, pageTimeout = 60000, maxTime = 600000, log = () => {},
    deps = {},
  } = opts;
  const launch = deps.launch || launchChrome;
  const connect = deps.connect || ((ws) => CDP.connect(ws));
  const now = deps.now || Date.now;
  const started = now();
  const deadline = started + maxTime;
  const stepTimeout = Math.min(30000, pageTimeout);
  const origin = new URL(baseUrl).origin;
  const browser = await launch(chromePath);
  let cdp;
  const pagesByMode = {};
  try {
    cdp = await connect(browser.wsEndpoint);
    cdp.timeout = stepTimeout;
    const crawler = createCrawler({ start: startRoute, routes, cap });
    const results = [];
    const pages = [];
    const failed = [];
    const notes = [];
    let activeModes = modes.slice();
    let first = true;
    let incomplete = false;
    let route;
    const getPage = async (mode) => {
      if (!pagesByMode[mode]) pagesByMode[mode] = await openModePage(cdp, mode, darkKeys, stepTimeout);
      return pagesByMode[mode];
    };
    for (route = crawler.next(); route; route = crawler.next()) {
      if (now() >= deadline) { incomplete = true; break; }
      const url = new URL(route, baseUrl).href;
      const routeStart = now();
      log('checking ' + route);
      let ok = true;
      for (const width of widths) {
        const prints = {};
        for (const mode of activeModes) {
          const left = deadline - now();
          if (left <= 0) { incomplete = true; ok = false; break; }
          const limit = Math.min(pageTimeout, left);
          let where = 'opening a page';
          let page;
          try {
            const mp = await withTimeout(getPage(mode), limit, 'opening a ' + mode + ' page');
            page = await withTimeout(auditPage(cdp, mp.sessionId, url, {
              width, axeSource, stepTimeout: Math.min(stepTimeout, limit),
              wantLinks: mode === activeModes[0] && width === widths[0],
              step: (s) => { where = s; },
            }), limit, route + ' (' + mode + ', ' + width + 'px) at "' + where + '"');
          } catch (e) {
            const timedOut = e instanceof TimeoutError || e.name === 'TimeoutError';
            const msg = timedOut
              ? 'timed out after ' + Math.round((now() - routeStart) / 1000) + 's while ' + where + ' (' + mode + ', ' + width + 'px)'
              : e.message;
            // A stuck page is thrown away with its whole context; the next
            // route gets a fresh one.
            const stuck = pagesByMode[mode];
            delete pagesByMode[mode];
            await closeModePage(cdp, stuck);
            if (first && !timedOut) throw new Error('omni-check: could not check the start page ' + route + ': ' + msg);
            failed.push({ route, mode, width, error: msg });
            if (now() >= deadline) incomplete = true;
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
          await closeModePage(cdp, pagesByMode.dark);
          delete pagesByMode.dark;
        }
        first = false;
      }
      log(route + (ok ? ' done' : ' NOT checked') + ' in ' + ((now() - routeStart) / 1000).toFixed(1) + 's');
      if (ok) pages.push(route);
      if (incomplete) break;
    }
    const skipped = [];
    if (incomplete) {
      if (route && !pages.includes(route) && !failed.some((f) => f.route === route)) skipped.push(route);
      for (let r = crawler.next(); r; r = crawler.next()) skipped.push(r);
      notes.push('stopped at the --max-time limit (' + Math.round(maxTime / 1000) + 's)'
        + (skipped.length ? '; not checked: ' + skipped.join(' ') : '') + '.');
    }
    return { results, pages, failed, skipped, notes, modes: activeModes, incomplete, elapsed: now() - started };
  } finally {
    if (cdp) {
      for (const m of Object.keys(pagesByMode)) await closeModePage(cdp, pagesByMode[m]);
      cdp.close();
    }
    await browser.close();
  }
}

module.exports = { runCheck, withTimeout, openModePage, SETTLE };
