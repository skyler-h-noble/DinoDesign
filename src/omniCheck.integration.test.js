// omni-check end to end: the real bin, in a real headless Chrome, against two
// tiny built pages — a clean one (0 issues) and one with a known
// label-content-name-mismatch (1 issue). Run as a child process, exactly as
// `npx omni-check` runs. Skipped when no local Chrome / Chromium / Edge is
// installed (most CI images), since omni-check never downloads one.
import path from 'path';
import { execFile, spawn, execFileSync } from 'child_process';

const { findChrome } = require('../bin/omni-check/browser');

const BIN = path.join(__dirname, '../bin/omni-check.js');
const FIXTURES = path.join(__dirname, '__fixtures__/omni-check');
const nodeMajor = Number(process.versions.node.split('.')[0]);
const maybe = findChrome() && nodeMajor >= 22 ? test : test.skip;

const run = (args) => new Promise((resolve) => {
  execFile(process.execPath, [BIN, ...args], { cwd: FIXTURES, timeout: 110000 }, (err, stdout, stderr) => {
    resolve({ code: err ? err.code : 0, stdout, stderr });
  });
});

jest.setTimeout(120000);

maybe('clean build: 0 issues, exit 0, crawls same-origin links only', async () => {
  const { code, stdout, stderr } = await run(['clean']);
  // Progress only: one line per page, no errors.
  expect(stderr.trim().split('\n')).toEqual([
    expect.stringMatching(/^omni-check: \/ done in [\d.]+s$/),
    expect.stringMatching(/^omni-check: \/about done in [\d.]+s$/),
  ]);
  expect(stdout).toMatch(/2 pages × light\/dark × 1280px\/390px {2}\(\/ \/about\)/);
  expect(stdout.trim().split('\n').pop()).toBe('omni-check: 0 issues');
  expect(code).toBe(0);
});

maybe('failing build: 1 issue, exit 1, --json', async () => {
  const { code, stdout } = await run(['failing', '--json']);
  const report = JSON.parse(stdout);
  expect(report.issues).toBe(1);
  expect(report.rules.map((r) => r.id)).toEqual(['label-content-name-mismatch']);
  expect(report.rules[0].occurrences[0].html).toMatch(/aria-label="Linen Throw, Sale"/);
  expect(code).toBe(1);
});

// Light and dark each get their own browser context, and neither runs as a
// throttled background tab. The fixture shows an image with no alt if one mode
// can read the other's localStorage, and paints its <main> / <h1> only from
// requestAnimationFrame — so either old failure turns into an issue here.
maybe('light and dark are isolated and both render: 0 issues', async () => {
  const { code, stdout } = await run(['modes', '--routes', '/', '--json']);
  const report = JSON.parse(stdout);
  expect(report.modes).toEqual(['light', 'dark']);
  expect(report.rules).toEqual([]);
  expect(report.complete).toBe(true);
  expect(code).toBe(0);
});

// A page that blocks its main thread forever is reported and skipped: the run
// ends, says which page and where it stuck, and exits 2.
maybe('a hung page times out, is listed as not checked, and the run finishes', async () => {
  const t0 = Date.now();
  const { code, stdout } = await run(['modes', '--routes', '/,/hang', '--page-timeout', '4']);
  expect(Date.now() - t0).toBeLessThan(40000);
  expect(stdout).toMatch(/not checked: \/hang — timed out after \d+s while waiting for the page to settle \(light, 1280px\)/);
  expect(stdout.trim().split('\n').pop()).toBe('omni-check: 0 issues — 1 page NOT checked (see above)');
  expect(code).toBe(2);
});

// Ctrl-C stops the run AND the browser it started — that exact process, found
// by its parent PID, never by name.
(process.platform === 'win32' ? test.skip : maybe)('SIGINT closes the browser omni-check launched', async () => {
  const child = spawn(process.execPath, [BIN, 'modes', '--routes', '/hang', '--page-timeout', '60'], { cwd: FIXTURES });
  let stderr = '';
  child.stderr.on('data', (d) => { stderr += d; });
  const browserPid = await new Promise((resolve, reject) => {
    const t0 = Date.now();
    const poll = () => {
      let out = '';
      try { out = execFileSync('pgrep', ['-P', String(child.pid)]).toString().trim(); } catch { /* none yet */ }
      if (out) resolve(Number(out.split('\n')[0]));
      else if (Date.now() - t0 > 15000) reject(new Error('no browser started'));
      else setTimeout(poll, 200);
    };
    poll();
  });
  await new Promise((r) => setTimeout(r, 1500));
  const exited = new Promise((r) => child.once('exit', (code) => r(code)));
  child.kill('SIGINT');
  expect(await exited).toBe(130);
  expect(stderr).toMatch(/stopped \(SIGINT\); closed the browser it started/);
  await new Promise((r) => setTimeout(r, 500));
  expect(() => process.kill(browserPid, 0)).toThrow();
});
