// omni-check CLI — the pure parts: routes, crawl queue, report, args, server
// path resolution, browser discovery. The browser run itself is in
// omniCheck.integration.test.js.
import path from 'path';

const { normalizeRoute, parseRoutesArg, createCrawler } = require('../bin/omni-check/routes');
const { collectIssues, formatReport, formatJSON, finalLine, HINTS } = require('../bin/omni-check/report');
const { parseArgs, resolveTarget } = require('../bin/omni-check/cli');
const { resolveFile } = require('../bin/omni-check/serve');
const { findChrome, candidatePaths } = require('../bin/omni-check/browser');

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
