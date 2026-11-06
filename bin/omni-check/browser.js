'use strict';
/* Finding and driving a local Chrome / Chromium / Edge over the DevTools
 * protocol. No browser is downloaded: omni-check uses one already on the
 * machine (CHROME_PATH, the usual install paths, or the one a project's
 * playwright / puppeteer already installed). The protocol is spoken over
 * Node's built-in WebSocket (Node 22+), so the package adds no driver
 * dependency. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { createRequire } = require('module');

function candidatePaths(platform = process.platform, env = process.env) {
  if (platform === 'darwin') {
    const apps = [
      'Google Chrome.app/Contents/MacOS/Google Chrome',
      'Chromium.app/Contents/MacOS/Chromium',
      'Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      'Brave Browser.app/Contents/MacOS/Brave Browser',
      'Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    ];
    const roots = ['/Applications', path.join(env.HOME || os.homedir(), 'Applications')];
    return roots.flatMap((r) => apps.map((a) => path.join(r, a)));
  }
  if (platform === 'win32') {
    const bases = [env.LOCALAPPDATA, env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.ProgramW6432].filter(Boolean);
    const rel = [
      'Google\\Chrome\\Application\\chrome.exe',
      'Microsoft\\Edge\\Application\\msedge.exe',
      'Chromium\\Application\\chrome.exe',
      'BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    ];
    return bases.flatMap((b) => rel.map((r) => path.win32.join(b, r)));
  }
  const names = ['google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge', 'microsoft-edge-stable', 'brave-browser'];
  const dirs = String(env.PATH || '').split(path.delimiter).filter(Boolean)
    .concat(['/usr/bin', '/usr/local/bin', '/snap/bin', '/opt/google/chrome']);
  return [...new Set(dirs)].flatMap((d) => names.map((n) => path.join(d, n)));
}

/* A browser a project's own test tooling already installed. Resolved from the
   project (cwd), never installed by us. */
function toolingBrowser(cwd = process.cwd(), exists = fs.existsSync) {
  let req;
  try { req = createRequire(path.join(cwd, 'package.json')); } catch { return null; }
  const tries = [
    () => req('playwright-core').chromium.executablePath(),
    () => req('playwright').chromium.executablePath(),
    () => req('puppeteer').executablePath(),
  ];
  for (const t of tries) {
    try { const p = t(); if (p && exists(p)) return p; } catch { /* not installed */ }
  }
  return null;
}

/** Path of a usable browser, or null. */
function findChrome({ env = process.env, platform = process.platform, exists = fs.existsSync, cwd = process.cwd(), tooling = true } = {}) {
  if (env.CHROME_PATH) return exists(env.CHROME_PATH) ? env.CHROME_PATH : null;
  for (const p of candidatePaths(platform, env)) if (exists(p)) return p;
  return tooling ? toolingBrowser(cwd, exists) : null;
}

const NO_BROWSER = 'omni-check: no Chrome, Chromium or Edge found. Install one, or point CHROME_PATH at it '
  + '(e.g. CHROME_PATH=/usr/bin/chromium npx omni-check). omni-check never downloads a browser.';

/* Flags that keep a page that is not the focused one running at full speed.
   Without them Chrome throttles timers and requestAnimationFrame in a
   background tab — the second color mode's tab sat unrendered for half an
   hour in a real run, and axe was never injected. */
const NO_THROTTLE = [
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows', '--disable-ipc-flooding-protection',
];

/* Every browser this process launched and has not yet closed. Cleaned up on
   exit, Ctrl-C (SIGINT), SIGTERM and SIGHUP, so an interrupted run never
   leaves a Chrome or its temp profile behind. Only these PIDs are ever
   signalled: omni-check never looks a process up by name. */
const live = new Set();
let handlersInstalled = false;

function killBrowser(b) {
  if (b.killed) return;
  b.killed = true;
  live.delete(b);
  try {
    // Detached on POSIX: the browser leads its own process group, so -pid is
    // exactly the Chrome we started plus its renderer / GPU helpers.
    if (b.group) process.kill(-b.pid, 'SIGKILL');
    else b.proc.kill('SIGKILL');
  } catch { /* already gone */ }
}

function removeProfile(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch { /* best effort */ }
}

function installHandlers() {
  if (handlersInstalled) return;
  handlersInstalled = true;
  process.on('exit', () => { for (const b of [...live]) { killBrowser(b); removeProfile(b.userDataDir); } });
  for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) {
    process.on(sig, () => {
      for (const b of [...live]) { killBrowser(b); removeProfile(b.userDataDir); }
      process.stderr.write('\nomni-check: stopped (' + sig + '); closed the browser it started.\n');
      process.exit(code);
    });
  }
}

/** Launches a headless browser on a fresh temp profile.
 *  → { wsEndpoint, pid, userDataDir, close(): Promise } */
function launchChrome(executable, { timeout = 20000, spawnFn = spawn } = {}) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'omni-check-'));
  const args = [
    '--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + userDataDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-sync',
    '--disable-background-networking', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
    '--force-color-profile=srgb', ...NO_THROTTLE,
  ];
  // Chrome refuses to sandbox as root (CI containers).
  if ((process.getuid && process.getuid() === 0) || process.env.OMNI_CHECK_NO_SANDBOX) args.push('--no-sandbox');
  args.push('about:blank');
  const group = process.platform !== 'win32';
  const proc = spawnFn(executable, args, { stdio: ['ignore', 'ignore', 'pipe'], detached: group });
  const b = { proc, pid: proc.pid, group, userDataDir, killed: false };
  installHandlers();
  live.add(b);
  const exited = new Promise((r) => {
    if (proc.exitCode !== null && proc.exitCode !== undefined) r();
    else proc.once('exit', () => r());
  });
  const close = async () => {
    killBrowser(b);
    await Promise.race([exited, new Promise((r) => setTimeout(r, 3000))]);
    removeProfile(userDataDir);
  };
  return new Promise((resolve, reject) => {
    let buf = '';
    let ready = false;
    const fail = (msg) => { clearTimeout(timer); close().then(() => reject(new Error(msg))); };
    const timer = setTimeout(() => fail('omni-check: Chrome did not start within ' + timeout / 1000 + 's (' + executable + ')'), timeout);
    proc.stderr.on('data', (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m && !ready) {
        ready = true;
        clearTimeout(timer);
        proc.stderr.removeAllListeners('data');
        proc.stderr.resume();
        resolve({ wsEndpoint: m[1], pid: proc.pid, userDataDir, close });
      }
    });
    proc.once('error', (e) => fail('omni-check: could not start ' + executable + ': ' + e.message));
    proc.once('exit', (code) => { if (!ready) fail('omni-check: Chrome exited (' + code + ') before it was ready.\n' + buf.slice(-500)); });
  });
}

/** A step that took too long — distinguishable from a page error. */
class TimeoutError extends Error {
  constructor(message) { super(message); this.name = 'TimeoutError'; }
}

/** Minimal DevTools-protocol client over the built-in WebSocket. */
class CDP {
  static connect(url) {
    const WS = globalThis.WebSocket;
    if (!WS) throw new Error('omni-check needs Node 22 or newer (built-in WebSocket). You are on ' + process.version + '.');
    const ws = new WS(url);
    const cdp = new CDP(ws);
    return new Promise((resolve, reject) => {
      ws.addEventListener('open', () => resolve(cdp), { once: true });
      ws.addEventListener('error', () => reject(new Error('omni-check: could not connect to Chrome at ' + url)), { once: true });
    });
  }
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Set();
    this.timeout = 30000;
    this.closed = false;
    ws.addEventListener('close', () => {
      this.closed = true;
      for (const { reject, method } of this.pending.values()) reject(new Error(method + ': the browser connection closed'));
      this.pending.clear();
    });
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject, method } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(method + ': ' + msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const l of this.listeners) l(msg);
      }
    });
  }
  /** Rejects after `timeout` ms: no protocol call can stall a run forever. */
  send(method, params = {}, sessionId, { timeout = this.timeout } = {}) {
    if (this.closed) return Promise.reject(new Error(method + ': the browser connection is closed'));
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new TimeoutError(method + ' did not answer within ' + Math.round(timeout / 1000) + 's'));
      }, timeout);
      const settle = (fn) => (v) => { clearTimeout(timer); fn(v); };
      this.pending.set(id, { resolve: settle(resolve), reject: settle(reject), method });
      try {
        this.ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
      } catch (e) {
        this.pending.delete(id);
        clearTimeout(timer);
        reject(new Error(method + ': ' + e.message));
      }
    });
  }
  /** Resolves with the next event `method` on `sessionId`, or rejects after `timeout`. */
  waitFor(method, sessionId, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const done = (fn, v) => { clearTimeout(timer); this.listeners.delete(l); fn(v); };
      const l = (msg) => { if (msg.method === method && msg.sessionId === sessionId) done(resolve, msg.params); };
      const timer = setTimeout(() => done(reject, new TimeoutError('timed out waiting for ' + method)), timeout);
      this.listeners.add(l);
    });
  }
  close() { try { this.ws.close(); } catch { /* closed */ } }
}

module.exports = { candidatePaths, toolingBrowser, findChrome, launchChrome, CDP, TimeoutError, NO_BROWSER, NO_THROTTLE, liveBrowsers: live };
