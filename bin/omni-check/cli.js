'use strict';
const fs = require('fs');
const path = require('path');
const { parseRoutesArg } = require('./routes');
const { collectIssues, formatReport, formatJSON, total } = require('./report');
const { findChrome, NO_BROWSER } = require('./browser');

const USAGE = `Usage: npx omni-check [url-or-dir] [options]

Checks every page of a built app with axe-core in a local headless Chrome:
light and dark mode, at 1280px and 390px. Exit code 1 when anything fails.

  url-or-dir         a URL (http://localhost:5173) or a build folder.
                     Default: dist/, build/ or out/ in the current folder.
  --routes /,/cart   pages to check. Default: the start page plus the
                     same-origin links found from it (up to --max-routes).
  --max-routes N     crawl cap (default 30)
  --port N           port for serving a build folder (default: any free one)
  --dark-key KEY     localStorage key, when persistDarkMode names its own
  --json             machine-readable report
  -h, --help         this text

Dark mode: omni-check stores 'dark' under localStorage 'omni-dark-mode' (what
persistDarkMode reads) AND emulates prefers-color-scheme: dark (what
defaultDarkMode="system" follows), so either setup is checked. If the first
page looks the same in both, the app has no reachable dark mode and the dark
runs are skipped (noted in the report).

Browser: CHROME_PATH, else an installed Chrome / Chromium / Edge / Brave, else
one the project's playwright or puppeteer already installed. Never downloads.`;

function parseArgs(argv) {
  const o = { target: null, routes: null, port: 0, json: false, help: false, cap: 30, darkKeys: ['omni-dark-mode'] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => {
      const eq = a.indexOf('=');
      if (eq > -1) return a.slice(eq + 1);
      if (i + 1 >= argv.length) throw new Error('omni-check: ' + a + ' needs a value');
      return argv[++i];
    };
    if (a === '-h' || a === '--help') o.help = true;
    else if (a === '--json') o.json = true;
    else if (a.startsWith('--routes')) o.routes = parseRoutesArg(val());
    else if (a.startsWith('--port')) o.port = Number(val()) || 0;
    else if (a.startsWith('--max-routes')) o.cap = Math.max(1, Number(val()) || 30);
    else if (a.startsWith('--dark-key')) { const k = val(); if (!o.darkKeys.includes(k)) o.darkKeys.push(k); }
    else if (a.startsWith('-')) throw new Error('omni-check: unknown option ' + a + '\n\n' + USAGE);
    else if (!o.target) o.target = a;
    else throw new Error('omni-check: one url-or-dir only (got "' + o.target + '" and "' + a + '")');
  }
  return o;
}

/** { kind: 'url', url } | { kind: 'dir', dir } — or throws with what to do. */
function resolveTarget(target, cwd = process.cwd()) {
  if (target && /^https?:\/\//i.test(target)) return { kind: 'url', url: target };
  if (target) {
    const dir = path.resolve(cwd, target);
    if (fs.existsSync(path.join(dir, 'index.html'))) return { kind: 'dir', dir };
    if (fs.existsSync(dir) && fs.statSync(dir).isFile() && dir.endsWith('.html')) return { kind: 'dir', dir: path.dirname(dir), start: '/' + path.basename(dir) };
    throw new Error('omni-check: no index.html in ' + dir + '. Pass a build folder or a URL.');
  }
  for (const d of ['dist', 'build', 'out']) {
    const dir = path.join(cwd, d);
    if (fs.existsSync(path.join(dir, 'index.html'))) return { kind: 'dir', dir };
  }
  throw new Error('omni-check: no build output (dist/, build/ or out/ with an index.html). Run `npm run build` first, or pass a URL.');
}

async function main(argv, { stdout = process.stdout, stderr = process.stderr, cwd = process.cwd() } = {}) {
  let opts;
  try { opts = parseArgs(argv); } catch (e) { stderr.write(e.message + '\n'); return 2; }
  if (opts.help) { stdout.write(USAGE + '\n'); return 0; }

  let target;
  try { target = resolveTarget(opts.target, cwd); } catch (e) { stderr.write(e.message + '\n'); return 2; }
  const chromePath = findChrome({ cwd });
  if (!chromePath) { stderr.write(NO_BROWSER + '\n'); return 2; }

  const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const { serveDir } = require('./serve');
  const { runCheck } = require('./run');
  let server = null;
  let baseUrl;
  let startRoute = '/';
  if (target.kind === 'dir') {
    server = await serveDir(target.dir, opts.port);
    baseUrl = server.url;
    if (target.start) startRoute = target.start;
  } else {
    const u = new URL(target.url);
    baseUrl = u.origin;
    startRoute = u.pathname + u.search;
  }
  const log = (opts.json || !stderr.isTTY) ? () => {} : (m) => stderr.write('\r\x1b[2K' + m);
  try {
    const run = await runCheck({ chromePath, baseUrl, startRoute, routes: opts.routes, cap: opts.cap, darkKeys: opts.darkKeys, axeSource, log });
    if (stderr.isTTY && !opts.json) stderr.write('\r\x1b[2K');
    const issues = collectIssues(run.results);
    const meta = { pages: run.pages, modes: run.modes, widths: [1280, 390], notes: run.notes };
    stdout.write((opts.json ? formatJSON(issues, meta) : formatReport(issues, meta)) + '\n');
    return total(issues) > 0 ? 1 : 0;
  } catch (e) {
    stderr.write((e && e.message ? e.message : String(e)) + '\n');
    return 2;
  } finally {
    if (server) await server.close();
  }
}

module.exports = { main, parseArgs, resolveTarget, USAGE };
