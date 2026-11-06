// omni-check CLI — the pure parts: routes, crawl queue, report, args, server
// path resolution, browser discovery. The browser run itself is in
// omniCheck.integration.test.js.
import path from 'path';

const { normalizeRoute, parseRoutesArg, createCrawler } = require('../bin/omni-check/routes');
const { collectIssues, formatReport, formatJSON, finalLine, HINTS } = require('../bin/omni-check/report');
const { parseArgs, resolveTarget } = require('../bin/omni-check/cli');
const { resolveFile } = require('../bin/omni-check/serve');
const { findChrome, candidatePaths, NO_THROTTLE } = require('../bin/omni-check/browser');
const { runCheck, withTimeout } = require('../bin/omni-check/run');

const ORIGIN = 'http://127.0.0.1:4000';
const FIXTURES = path.join(__dirname, '__fixtures__/omni-check');

describe('routes', () => {
  test('same-origin pages only; hash dropped; files and other schemes skipped', () => {
    expect(normalizeRoute('/cart#top', ORIGIN)).toBe('/cart');
    expect(normalizeRoute('http://127.0.0.1:4000/p?id=2', ORIGIN)).toBe('/p?id=2');
    expect(normalizeRoute('about', ORIGIN + '/shop/')).toBe('/shop/about');
    expect(normalizeRoute('https://example.com/', ORIGIN)).toBeNull();
    expect(normalizeRoute('mailto:a@b.c', ORIGIN)).toBeNull();
    expect(normalizeRoute('/brochure.pdf', ORIGIN)).toBeNull();
    expect(normalizeRoute('/logo.PNG', ORIGIN)).toBeNull();
    expect(normalizeRoute('', ORIGIN)).toBeNull();
  });

  test('--routes value', () => {
    expect(parseRoutesArg('/, /cart,checkout,/cart')).toEqual(['/', '/cart', '/checkout']);
    expect(parseRoutesArg('')).toEqual([]);
  });

  test('crawler is breadth-first, deduplicated and capped', () => {
    const c = createCrawler({ start: '/', cap: 3 });
    expect(c.next()).toBe('/');
    expect(c.add(['/a', '/a#x', '/b', '/c', 'https://x.org/d'], ORIGIN)).toBe(2);
    expect(c.next()).toBe('/a');
    c.add(['/', '/z'], ORIGIN);
    expect(c.next()).toBe('/b');
    expect(c.next()).toBeNull();
    expect(c.routes).toEqual(['/', '/a', '/b']);
  });

  test('a fixed --routes list is not extended by crawling', () => {
    const c = createCrawler({ routes: ['/cart', '/checkout'] });
    expect(c.add(['/other'], ORIGIN)).toBe(0);
    expect([c.next(), c.next(), c.next()]).toEqual(['/cart', '/checkout', null]);
  });
});

describe('report', () => {
  const v = (id, targets, impact = 'serious') => ({
    id, impact, help: id + ' help', helpUrl: 'https://dequeuniversity.com/rules/axe/4.11/' + id,
    nodes: targets.map((t) => ({ target: [t], html: '<a class="x">' + t + '</a>' })),
  });
  const results = [
    { route: '/', mode: 'light', width: 1280, violations: [v('label-content-name-mismatch', ['a.card']), v('heading-order', ['h3'], 'moderate')] },
    { route: '/', mode: 'light', width: 390, violations: [v('label-content-name-mismatch', ['a.card'])] },
    { route: '/', mode: 'dark', width: 1280, violations: [v('label-content-name-mismatch', ['a.card'])] },
    { route: '/', mode: 'dark', width: 390, violations: [v('label-content-name-mismatch', ['a.card'])] },
    { route: '/cart', mode: 'dark', width: 390, violations: [v('label-content-name-mismatch', ['a.card'])] },
  ];

  test('one issue per element per route, however many modes / widths failed', () => {
    const issues = collectIssues(results);
    expect(issues.map((r) => [r.id, r.count])).toEqual([['label-content-name-mismatch', 2], ['heading-order', 1]]);
    expect(issues[0].occurrences[0].contexts).toEqual(['light 1280', 'light 390', 'dark 1280', 'dark 390']);
    expect(issues[0].fix).toBe(HINTS['label-content-name-mismatch']);
  });

  test('text report: rule, count, example selector + html, fix, final line', () => {
    const out = formatReport(collectIssues(results), { pages: ['/', '/cart'] });
    expect(out).toMatch(/^omni-check — 2 pages × light\/dark × 1280px\/390px/);
    expect(out).toMatch(/label-content-name-mismatch \(serious\) · 2/);
    expect(out).toMatch(/\/ {2}a\.card {2}\[light, dark · 1280px, 390px\]/);
    expect(out).toMatch(/\/cart {2}a\.card {2}\[dark 390px\]/);
    expect(out).toMatch(/<a class="x">a\.card<\/a>/);
    expect(out).toMatch(/fix: Remove aria-label/);
    expect(out).toMatch(/fix: Use <AutoHeading>/);
    expect(out.trim().split('\n').pop()).toBe('omni-check: 3 issues');
  });

  test('final line', () => {
    expect(finalLine([])).toBe('omni-check: 0 issues');
    expect(finalLine([{ count: 1 }])).toBe('omni-check: 1 issue');
    expect(formatReport([], { pages: ['/'] }).trim().split('\n').pop()).toBe('omni-check: 0 issues');
  });

  test('long html is cut to one line; extra examples summarized', () => {
    const many = [{ route: '/', mode: 'light', width: 1280, violations: [v('region', ['a', 'b', 'c', 'd', 'e'], 'moderate')] }];
    const out = formatReport(collectIssues(many), { pages: ['/'], examples: 2 });
    expect(out).toMatch(/… \+3 more/);
  });

  test('json report', () => {
    const j = JSON.parse(formatJSON(collectIssues(results), { pages: ['/'], notes: ['n'] }));
    expect(j.issues).toBe(3);
    expect(j.rules[0].occurrences[0]).toEqual(expect.objectContaining({ route: '/', target: 'a.card' }));
    expect(j.notes).toEqual(['n']);
  });
});

describe('arguments and target', () => {
  test('parses options', () => {
    expect(parseArgs(['dist', '--routes', '/,/cart', '--port=4100', '--json', '--dark-key', 'mode'])).toEqual(expect.objectContaining({
      target: 'dist', routes: ['/', '/cart'], port: 4100, json: true, darkKeys: ['omni-dark-mode', 'mode'],
    }));
    expect(() => parseArgs(['--nope'])).toThrow(/unknown option/);
    expect(() => parseArgs(['a', 'b'])).toThrow(/one url-or-dir/);
    expect(() => parseArgs(['--routes'])).toThrow(/needs a value/);
    expect(parseArgs([])).toEqual(expect.objectContaining({ pageTimeout: 60, maxTime: 600 }));
    expect(parseArgs(['--page-timeout', '5', '--max-time=90'])).toEqual(expect.objectContaining({ pageTimeout: 5, maxTime: 90 }));
    expect(() => parseArgs(['--max-time', 'soon'])).toThrow(/needs a number of seconds/);
  });

  test('a URL, a folder, or dist/ / build/ found in cwd', () => {
    expect(resolveTarget('http://localhost:5173/shop')).toEqual({ kind: 'url', url: 'http://localhost:5173/shop' });
    expect(resolveTarget('clean', FIXTURES)).toEqual({ kind: 'dir', dir: path.join(FIXTURES, 'clean') });
    expect(() => resolveTarget('missing', FIXTURES)).toThrow(/no index.html/);
    expect(() => resolveTarget(null, FIXTURES)).toThrow(/Run `npm run build` first/);
  });
});

describe('static server paths', () => {
  const root = path.join(FIXTURES, 'clean');
  test('files, folder index, SPA fallback, 404 for missing files, no escaping root', () => {
    expect(resolveFile(root, '/')).toBe(path.join(root, 'index.html'));
    expect(resolveFile(root, '/about')).toBe(path.join(root, 'about/index.html'));
    expect(resolveFile(root, '/cart/42?x=1')).toBe(path.join(root, 'index.html'));
    expect(resolveFile(root, '/missing.js')).toBeNull();
    // ../ is resolved inside root: /failing/index.html does not exist there.
    expect(resolveFile(root, '/../failing/index.html')).toBeNull();
    expect(resolveFile(root, '/%2e%2e/failing/index.html')).toBeNull();
  });
});

describe('browser discovery', () => {
  test('CHROME_PATH wins; a missing CHROME_PATH is an error, not a fallback', () => {
    expect(findChrome({ env: { CHROME_PATH: '/x/chrome' }, exists: (p) => p === '/x/chrome', tooling: false })).toBe('/x/chrome');
    expect(findChrome({ env: { CHROME_PATH: '/x/chrome' }, exists: () => false, tooling: false })).toBeNull();
  });

  test('platform install paths', () => {
    const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    expect(findChrome({ env: { HOME: '/Users/me' }, platform: 'darwin', exists: (p) => p === mac, tooling: false })).toBe(mac);
    expect(candidatePaths('linux', { PATH: '/opt/bin' })).toContain('/opt/bin/chromium');
    expect(candidatePaths('win32', { PROGRAMFILES: 'C:\\Program Files' })).toContain('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
    expect(findChrome({ env: {}, platform: 'linux', exists: () => false, tooling: false })).toBeNull();
  });
});

/* A fake browser for the orchestration: every protocol call is recorded, and
   a page's behavior is decided by its URL. `hangOn` makes the settle step of
   that route never answer, like a page whose main thread is blocked. */
function fakeBrowser({ hangOn = null, violationsFor = () => [] } = {}) {
  const calls = [];
  const sessions = {}; // sessionId -> { context, url }
  const contexts = {}; // contextId -> { storage init script, mode, disposed }
  let n = 0;
  const cdp = {
    timeout: 0,
    closed: false,
    send(method, params = {}, sessionId) {
      calls.push({ method, params, sessionId });
      switch (method) {
        case 'Target.createBrowserContext': { const id = 'ctx' + (++n); contexts[id] = {}; return Promise.resolve({ browserContextId: id }); }
        case 'Target.createTarget': return Promise.resolve({ targetId: 't' + (++n) + ':' + params.browserContextId });
        case 'Target.attachToTarget': { const id = 's' + (++n); sessions[id] = { context: params.targetId.split(':')[1] }; return Promise.resolve({ sessionId: id }); }
        case 'Target.disposeBrowserContext': contexts[params.browserContextId].disposed = true; return Promise.resolve({});
        case 'Page.addScriptToEvaluateOnNewDocument': contexts[sessions[sessionId].context].init = params.source; return Promise.resolve({});
        case 'Emulation.setEmulatedMedia': contexts[sessions[sessionId].context].mode = params.features[0].value; return Promise.resolve({});
        case 'Page.navigate': sessions[sessionId].url = params.url; return Promise.resolve({ frameId: 'f' });
        case 'Runtime.evaluate': {
          const s = sessions[sessionId];
          const mode = contexts[s.context].mode;
          const e = params.expression;
          if (e.startsWith('new Promise')) {
            if (hangOn && s.url.endsWith(hangOn)) return new Promise(() => {});
            return Promise.resolve({ result: { value: 'ready' } });
          }
          if (e === 'typeof axe') return Promise.resolve({ result: { value: 'object' } });
          if (e.startsWith('axe.run')) return Promise.resolve({ result: { value: violationsFor(new URL(s.url).pathname, mode) } });
          if (e.startsWith('Array.from')) return Promise.resolve({ result: { value: [] } });
          if (e.startsWith('(() =>')) return Promise.resolve({ result: { value: 'colors-' + mode } });
          return Promise.resolve({ result: {} });
        }
        default: return Promise.resolve({});
      }
    },
    waitFor() { return Promise.resolve({}); },
    close() { this.closed = true; },
  };
  const browser = { wsEndpoint: 'ws://fake', closed: false, close() { this.closed = true; return Promise.resolve(); } };
  return { cdp, browser, calls, sessions, contexts, deps: { launch: () => Promise.resolve(browser), connect: () => Promise.resolve(cdp) } };
}

const RUN = { chromePath: '/x/chrome', baseUrl: 'http://127.0.0.1:4000', axeSource: '/* axe */' };

describe('run orchestration', () => {
  test('withTimeout: the value, or a TimeoutError naming the step', async () => {
    await expect(withTimeout(Promise.resolve(3), 50, 'x')).resolves.toBe(3);
    await expect(withTimeout(new Promise(() => {}), 20, 'loading /cart')).rejects.toThrow('loading /cart did not finish within 0s');
  });

  test('the browser never throttles a page that is not in front', () => {
    expect(NO_THROTTLE).toEqual(expect.arrayContaining([
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    ]));
  });

  test('light and dark each get their own browser context, with their own saved mode', async () => {
    const f = fakeBrowser();
    const run = await runCheck({ ...RUN, routes: ['/', '/cart'], deps: f.deps });
    const ids = Object.keys(f.contexts);
    expect(ids).toHaveLength(2);
    const byMode = Object.fromEntries(ids.map((id) => [f.contexts[id].mode, f.contexts[id]]));
    expect(byMode.light.init).toContain('localStorage.setItem("omni-dark-mode","light")');
    expect(byMode.dark.init).toContain('localStorage.setItem("omni-dark-mode","dark")');
    // Every audit brings its page to the front first, and focus is emulated.
    const navs = f.calls.filter((c) => c.method === 'Page.navigate').length;
    expect(f.calls.filter((c) => c.method === 'Page.bringToFront')).toHaveLength(navs);
    expect(f.calls.filter((c) => c.method === 'Emulation.setFocusEmulationEnabled')).toHaveLength(2);
    expect(run.results.map((r) => r.mode + ' ' + r.width + ' ' + r.route)).toEqual([
      'light 1280 /', 'dark 1280 /', 'light 390 /', 'dark 390 /',
      'light 1280 /cart', 'dark 1280 /cart', 'light 390 /cart', 'dark 390 /cart',
    ]);
    expect(run.pages).toEqual(['/', '/cart']);
    expect(run.incomplete).toBe(false);
    // Everything is closed at the end.
    expect(ids.every((id) => f.contexts[id].disposed)).toBe(true);
    expect(f.cdp.closed).toBe(true);
    expect(f.browser.closed).toBe(true);
  });

  test('a page that never answers is reported, its context replaced, and the run goes on', async () => {
    const f = fakeBrowser({ hangOn: '/stuck', violationsFor: (route, mode) => (route === '/after' && mode === 'dark'
      ? [{ id: 'image-alt', impact: 'critical', nodes: [{ target: ['img'], html: '<img>' }] }] : []) });
    const t0 = Date.now();
    const run = await runCheck({ ...RUN, routes: ['/', '/stuck', '/after'], pageTimeout: 150, deps: f.deps });
    expect(Date.now() - t0).toBeLessThan(3000);
    expect(run.failed).toEqual([{ route: '/stuck', mode: 'light', width: 1280, error: expect.stringMatching(/^timed out after \d+s while waiting for the page to settle \(light, 1280px\)$/) }]);
    expect(run.pages).toEqual(['/', '/after']);
    expect(run.results.filter((r) => r.route === '/after')).toHaveLength(4);
    expect(run.results.find((r) => r.route === '/after' && r.mode === 'dark').violations[0].id).toBe('image-alt');
    // The stuck light context was disposed and a fresh one opened for /after.
    expect(Object.values(f.contexts).filter((c) => c.mode === 'light')).toHaveLength(2);
  });

  test('the whole-run limit stops the run and lists the pages not reached', async () => {
    const f = fakeBrowser();
    let t = 0;
    const now = () => t;
    const orig = f.cdp.send.bind(f.cdp);
    f.cdp.send = (m, p, s, o) => { if (m === 'Page.navigate') t += 1000; return orig(m, p, s, o); };
    const run = await runCheck({ ...RUN, routes: ['/', '/a', '/b', '/c'], maxTime: 8500, deps: { ...f.deps, now } });
    expect(run.incomplete).toBe(true);
    expect(run.pages).toEqual(['/', '/a']);
    expect(run.skipped).toEqual(['/b', '/c']);
    expect(run.notes.pop()).toMatch(/stopped at the --max-time limit \(9s\); not checked: \/b \/c\./);
  });
});

describe('report: pages not checked', () => {
  test('a run with unchecked pages is never reported as plainly clean', () => {
    const meta = { pages: ['/'], failed: [{ route: '/stuck', mode: 'light', width: 1280, error: 'timed out after 60s while waiting for the page to settle (light, 1280px)' }], skipped: ['/z'], elapsed: 61234 };
    const text = formatReport([], meta);
    expect(text).toMatch(/in 61\.2s/);
    expect(text).toMatch(/not checked: \/stuck — timed out after 60s/);
    expect(text.split('\n').pop()).toBe('omni-check: 0 issues — 2 pages NOT checked (see above)');
    const json = JSON.parse(formatJSON([], meta));
    expect(json).toEqual(expect.objectContaining({ complete: false, seconds: 61.2, skipped: ['/z'] }));
    expect(finalLine([], { pages: ['/'] })).toBe('omni-check: 0 issues');
  });
});
