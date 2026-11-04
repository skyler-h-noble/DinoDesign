// omni-check end to end: the real bin, in a real headless Chrome, against two
// tiny built pages — a clean one (0 issues) and one with a known
// label-content-name-mismatch (1 issue). Run as a child process, exactly as
// `npx omni-check` runs. Skipped when no local Chrome / Chromium / Edge is
// installed (most CI images), since omni-check never downloads one.
import path from 'path';
import { execFile } from 'child_process';

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
  expect(stderr).toBe('');
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
