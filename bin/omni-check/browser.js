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

function launchChrome(executable, { timeout = 20000 } = {}) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'omni-check-'));
  const args = [
    '--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + userDataDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-sync',
    '--disable-background-networking', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
    '--force-color-profile=srgb',
  ];
  // Chrome refuses to sandbox as root (CI containers).
  if ((process.getuid && process.getuid() === 0) || process.env.OMNI_CHECK_NO_SANDBOX) args.push('--no-sandbox');
  args.push('about:blank');
  const proc = spawn(executable, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  const cleanup = () => {
    try { proc.kill('SIGKILL'); } catch { /* gone */ }
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { /* best effort */ }
  };
  return new Promise((resolve, reject) => {
    let buf = '';
    const timer = setTimeout(() => { cleanup(); reject(new Error('omni-check: Chrome did not start within ' + timeout / 1000 + 's (' + executable + ')')); }, timeout);
    proc.stderr.on('data', (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(timer); proc.stderr.removeAllListeners('data'); proc.stderr.resume(); resolve({ wsEndpoint: m[1], close: cleanup }); }
    });
    proc.once('error', (e) => { clearTimeout(timer); cleanup(); reject(new Error('omni-check: could not start ' + executable + ': ' + e.message)); });
    proc.once('exit', (code) => { clearTimeout(timer); reject(new Error('omni-check: Chrome exited (' + code + ') before it was ready.\n' + buf.slice(-500))); });
  });
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
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    this.ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject, method }));
  }
  /** Resolves with the next event `method` on `sessionId`, or rejects after `timeout`. */
  waitFor(method, sessionId, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const done = (fn, v) => { clearTimeout(timer); this.listeners.delete(l); fn(v); };
      const l = (msg) => { if (msg.method === method && msg.sessionId === sessionId) done(resolve, msg.params); };
      const timer = setTimeout(() => done(reject, new Error('timed out waiting for ' + method)), timeout);
      this.listeners.add(l);
    });
  }
  close() { try { this.ws.close(); } catch { /* closed */ } }
}

module.exports = { candidatePaths, toolingBrowser, findChrome, launchChrome, CDP, NO_BROWSER };
