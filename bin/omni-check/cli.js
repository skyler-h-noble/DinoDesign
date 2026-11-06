'use strict';
const fs = require('fs');
const path = require('path');
const { parseRoutesArg } = require('./routes');
const { collectIssues, formatReport, formatJSON, total, uncheckedRoutes } = require('./report');
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
  --page-timeout S   seconds for one page in one mode at one width (default 60);
                     a page that takes longer is reported as not checked
  --max-time S       seconds for the whole run (default 600); pages not
                     reached by then are listed as not checked
  --json             machine-readable report
  --install-commands copy the library's Claude Code slash commands
                     (/OmniCheck, /ScanComponents, /ShareComponent) into this
                     project's .claude/commands/ and exit. Existing files are
                     kept; add --force to replace them.
  -h, --help         this text

Dark mode: omni-check stores 'dark' under localStorage 'omni-dark-mode' (what
persistDarkMode reads) AND emulates prefers-color-scheme: dark (what
defaultDarkMode="system" follows), so either setup is checked. If the first
page looks the same in both, the app has no reachable dark mode and the dark
runs are skipped (noted in the report). Light and dark run in separate browser
contexts (separate localStorage), one page at a time.

Exit codes: 0 clean, 1 issues found, 2 could not run or some pages were not
checked (timed out / failed to load; listed in the report).

omni-check starts its own headless browser on a temp profile and closes
exactly that browser when it ends, times out or is stopped with Ctrl-C. To
stop a run, press Ctrl-C (or kill the omni-check process itself) — never kill
Chrome by name.

Browser: CHROME_PATH, else an installed Chrome / Chromium / Edge / Brave, else
one the project's playwright or puppeteer already installed. Never downloads.`;

function positive(flag, v) {
  const n = Number(v);
  if (!(n > 0)) throw new Error('omni-check: ' + flag.split('=')[0] + ' needs a number of seconds (got "' + v + '")');
  return n;
}

function parseArgs(argv) {
  const o = { target: null, routes: null, port: 0, json: false, help: false, installCommands: false, force: false, cap: 30, darkKeys: ['omni-dark-mode'], pageTimeout: 60, maxTime: 600 };
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
    else if (a === '--install-commands') o.installCommands = true;
    else if (a === '--force') o.force = true;
    else if (a.startsWith('--routes')) o.routes = parseRoutesArg(val());
    else if (a.startsWith('--port')) o.port = Number(val()) || 0;
    else if (a.startsWith('--max-routes')) o.cap = Math.max(1, Number(val()) || 30);
    else if (a.startsWith('--page-timeout')) o.pageTimeout = positive(a, val());
    else if (a.startsWith('--max-time')) o.maxTime = positive(a, val());
    else if (a.startsWith('--dark-key')) { const k = val(); if (!o.darkKeys.includes(k)) o.darkKeys.push(k); }
    else if (a.startsWith('-')) throw new Error('omni-check: unknown option ' + a + '\n\n' + USAGE);
    else if (!o.target) o.target = a;
    else throw new Error('omni-check: one url-or-dir only (got "' + o.target + '" and "' + a + '")');
  }
  return o;
}

/** The slash commands that ship in the package (.claude/commands/*.md). */
const COMMANDS_DIR = path.join(__dirname, '..', '..', '.claude', 'commands');

/* Claude Code reads commands from the PROJECT's .claude/commands, never from
   node_modules — so a command shipped in the package does nothing until it is
   copied in. This is that copy. Existing files are left alone (the user may
   have edited one) unless --force. → { installed: [], kept: [], dir } */
function installCommands({ cwd = process.cwd(), force = false, from = COMMANDS_DIR } = {}) {
  if (!fs.existsSync(from)) throw new Error('omni-check: this package has no .claude/commands to install (' + from + ').');
  const dir = path.join(cwd, '.claude', 'commands');
  fs.mkdirSync(dir, { recursive: true });
  const installed = []; const kept = [];
  for (const f of fs.readdirSync(from).filter((n) => n.endsWith('.md')).sort()) {
    const dest = path.join(dir, f);
    if (fs.existsSync(dest) && !force) { kept.push(f); continue; }
    fs.copyFileSync(path.join(from, f), dest);
    installed.push(f);
  }
  return { installed, kept, dir };
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
  if (opts.installCommands) {
    try {
      const r = installCommands({ cwd, force: opts.force });
      const name = (f) => '/' + f.replace(/\.md$/, '');
      if (r.installed.length) stdout.write('omni-check: installed ' + r.installed.map(name).join(', ') + ' into ' + path.relative(cwd, r.dir) + '/\n');
      if (r.kept.length) stdout.write('omni-check: kept your existing ' + r.kept.map(name).join(', ') + ' (--force to replace)\n');
      if (!r.installed.length && !r.kept.length) stdout.write('omni-check: no commands to install\n');
      return 0;
    } catch (e) { stderr.write(e.message + '\n'); return 2; }
  }

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
  /* Progress goes to stderr: one updating line in a terminal, one line per
     page otherwise — so a run in a script or an agent's shell visibly moves
     instead of looking hung. */
  const log = opts.json ? () => {}
    : stderr.isTTY ? (m) => stderr.write('\r\x1b[2K' + m)
      : (m) => { if (!m.startsWith('checking ')) stderr.write('omni-check: ' + m + '\n'); };
  try {
    const run = await runCheck({
      chromePath, baseUrl, startRoute, routes: opts.routes, cap: opts.cap, darkKeys: opts.darkKeys, axeSource, log,
      pageTimeout: opts.pageTimeout * 1000, maxTime: opts.maxTime * 1000,
    });
    if (stderr.isTTY && !opts.json) stderr.write('\r\x1b[2K');
    const issues = collectIssues(run.results);
    const meta = { pages: run.pages, modes: run.modes, widths: [1280, 390], notes: run.notes, failed: run.failed, skipped: run.skipped, elapsed: run.elapsed };
    stdout.write((opts.json ? formatJSON(issues, meta) : formatReport(issues, meta)) + '\n');
    if (total(issues) > 0) return 1;
    return uncheckedRoutes(meta).length ? 2 : 0;
  } catch (e) {
    stderr.write((e && e.message ? e.message : String(e)) + '\n');
    return 2;
  } finally {
    if (server) await server.close();
  }
}

module.exports = { main, parseArgs, resolveTarget, installCommands, USAGE };
