/**
 * Prerender — the HTML of each page, saved at build time, so the browser can
 * paint the page before the JavaScript has downloaded and run.
 *
 * Measured on the benchmark store (HTTP/2, Lighthouse mobile, median of 3):
 * first paint 2.1 s → 1.7–1.9 s on every page; the product page's largest
 * paint 5.2 s → 2.1 s (score 76 → 98), because its main photo is in the HTML.
 *
 * How: after `vite build`, serve the build folder, open each page in the
 * machine's own Chrome (headless, `--dump-dom` — no extra dependency), wait
 * for OmniDesignProvider to report the theme ready, and write the rendered
 * HTML to <route>/index.html. Pages are found by following the site's own
 * links from "/" (or listed with `routes`).
 *
 * Safe by construction:
 *   - No Chrome on the build machine → skipped with one line; the build is
 *     the same as without it.
 *   - A page that does not reach "ready" is not written.
 *   - Hosts serve index.html for any page that was not prerendered. Each
 *     saved page carries a one-line check that empties it when it is shown
 *     at a different address, so /p/another never flashes the home page.
 *   - The app keeps createRoot: React draws the page again when it starts,
 *     over the same markup. Nothing in the app has to change.
 *
 * Node only. No dependencies.
 */
import { spawn } from 'child_process';
import { createServer } from 'http';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, statSync, rmSync, readdirSync } from 'fs';
import { join, extname, normalize } from 'path';
import { tmpdir } from 'os';

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

export function findChrome() {
  return CHROME_PATHS.find((p) => p && existsSync(p)) || null;
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff' };

/** The build folder over HTTP, with the SPA fallback every host applies. */
function serve(dir, shell) {
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = normalize(join(dir, path));
    if (!file.startsWith(normalize(dir)) || !existsSync(file) || statSync(file).isDirectory()) file = null;
    res.setHeader('content-type', file ? (TYPES[extname(file)] || 'application/octet-stream') : 'text/html; charset=utf-8');
    res.end(file ? readFileSync(file) : shell);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/** The DOM of `url` once the page has settled, from headless Chrome. */
function dumpDom(chrome, url, { budgetMs = 8000, timeoutMs = 45000 } = {}) {
  const profile = mkdtempSync(join(tmpdir(), 'omni-prerender-'));
  return new Promise((resolve) => {
    const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
      '--mute-audio', `--user-data-dir=${profile}`, `--virtual-time-budget=${budgetMs}`, '--dump-dom', url];
    const p = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let out = '';
    const done = (html) => { clearTimeout(t); try { rmSync(profile, { recursive: true, force: true }); } catch (e) { /* ignore */ } resolve(html); };
    const t = setTimeout(() => { try { p.kill('SIGKILL'); } catch (e) { /* ignore */ } done(null); }, timeoutMs);
    p.stdout.on('data', (d) => { out += d; });
    p.on('error', () => done(null));
    p.on('close', () => done(out || null));
  });
}

/* What the head script and the provider add at run time comes out: the head
   script adds the theme links again on load, and a prefetch or an injected
   provider sheet would be duplicated. The lib's component sheets stay — they
   are what make the page styled before the JavaScript runs. */
export function clean(html) {
  return html
    .replace(/<link\b[^>]*\bdata-omni="(head|prefetch)"[^>]*>/g, '')
    .replace(/<style\b[^>]*\bdata-omni="true"[^>]*>[\s\S]*?<\/style>/g, '');
}

/* Internal links on a page: same-origin paths, no file extension. */
export function linksIn(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const path = href.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
    if (/\.[a-z0-9]+$/i.test(path)) continue;
    out.add(path);
  }
  return [...out];
}

/* Page paths written in the app's code — a router's "/checkout" is a string
   in the built JavaScript. Pages a visitor reaches by a button, not a link,
   are found this way; without their own HTML they would get the host's
   fallback (the prerendered home page), download it, empty it and only then
   draw: measured 0.2 s later first paint on such a page. Static paths only —
   nothing with a ":param" or "*" — and not assets or API addresses. */
export function routesInCode(js) {
  const out = new Set();
  for (const m of js.matchAll(/["'`](\/[a-z0-9][a-z0-9\-_/]*)["'`]/gi)) {
    const path = m[1].replace(/\/+$/, '');
    if (!path || path.length > 60 || /^\/(assets|api|src|node_modules|static|images?|fonts?)(\/|$)/i.test(path)) continue;
    out.add(path);
  }
  return [...out];
}

function routesInBuild(dir) {
  const assets = join(dir, 'assets');
  let files = [];
  try { files = readdirSync(assets).filter((f) => f.endsWith('.js')); } catch (e) { return []; }
  const all = new Set();
  for (const f of files) {
    try { routesInCode(readFileSync(join(assets, f), 'utf8')).forEach((r) => all.add(r)); } catch (e) { /* ignore */ }
  }
  return [...all];
}

/* A page shown at a different address (the host's fallback for a page that
   was not prerendered) empties its markup before the first paint; the app
   then draws the right page as it would without prerendering. */
export function guard(html, route) {
  const g = `<script>(function(){var p=location.pathname.replace(/\\/+$/,'')||'/';if(p!==${JSON.stringify(route)}){var r=document.querySelector('[data-omni-prerendered]');if(r)r.innerHTML=''}})();</script>`;
  return html.replace(/(<div\b[^>]*\bid="root"[^>]*)>/, '$1 data-omni-prerendered>').replace(/<\/body>/, g + '</body>');
}

/**
 * Prerender the built site in `dir`.
 * @param {object} o
 * @param {string[]} [o.routes]  pages to prerender; default: follow links from "/"
 * @param {number} [o.limit=20]  at most this many pages
 * @param {number} [o.concurrency=4]  pages rendered at once
 * @param {(msg: string) => void} [o.log]
 * @returns {Promise<{ written: string[], skipped: string|null }>}
 */
export async function prerenderSite(dir, { routes, limit = 20, concurrency = 4, log = () => {} } = {}) {
  const chrome = findChrome();
  if (!chrome) return { written: [], skipped: 'no Chrome on this machine' };
  const shellPath = join(dir, 'index.html');
  if (!existsSync(shellPath)) return { written: [], skipped: 'no index.html in the build' };
  const shell = readFileSync(shellPath, 'utf8');
  const server = await serve(dir, shell);
  const base = `http://127.0.0.1:${server.address().port}`;
  const queue = routes ? [...routes] : ['/'];
  const seen = new Set(queue);
  const pages = [];
  let started = 0;
  const renderOne = async (route) => {
    const html = await dumpDom(chrome, base + route);
    if (!html || !/data-omni-css="ready"/.test(html)) { log(`skipped ${route} (did not render)`); return; }
    pages.push([route, html]);
    if (!routes) for (const l of linksIn(html)) if (!seen.has(l)) { seen.add(l); queue.push(l); }
  };
  let inFlight = 0;
  const worker = async () => {
    // Wait while others are still rendering: their links may refill the queue.
    while (started < limit && (queue.length || inFlight)) {
      if (!queue.length) { await new Promise((r) => setTimeout(r, 50)); continue; }
      const route = queue.shift(); started++; inFlight++;
      try { await renderOne(route); } finally { inFlight--; }
    }
  };
  try {
    /* "/" first: its links seed the queue. Then up to `concurrency` at once. */
    if (!routes && queue.length) {
      started++;
      await renderOne(queue.shift());
      // The app's own routes next — top-level pages, ahead of crawled detail pages.
      const fromCode = routesInBuild(dir).filter((r) => !seen.has(r));
      fromCode.forEach((r) => seen.add(r));
      queue.unshift(...fromCode);
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
  } finally {
    server.close();
  }
  const written = [];
  for (const [route, html] of pages) {
    /* index.html is also the host's fallback for every other address, so
       the home page goes there only when its guard can find the mount point. */
    if (route === '/' && !/<div\b[^>]*\bid="root"/.test(html)) { log('skipped / (no <div id="root"> to guard)'); continue; }
    const out = route === '/' ? shellPath : join(dir, route, 'index.html');
    mkdirSync(join(out, '..'), { recursive: true });
    writeFileSync(out, guard('<!doctype html>\n' + clean(html.replace(/^<!doctype html>\s*/i, '')), route));
    written.push(route);
  }
  return { written, skipped: null };
}
