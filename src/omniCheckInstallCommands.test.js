// `npx omni-check --install-commands` — copies the package's Claude Code slash
// commands into the project, because Claude Code never reads node_modules.
import fs from 'fs';
import os from 'os';
import path from 'path';

const { installCommands, main, parseArgs } = require('../bin/omni-check/cli');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'omni-cmds-'));
const sink = () => { let s = ''; return { write: (t) => { s += t; }, get text() { return s; } }; };

test('ships /OmniCheck with the other commands', () => {
  const shipped = fs.readdirSync(path.join(__dirname, '..', '.claude', 'commands'));
  expect(shipped).toEqual(expect.arrayContaining(['OmniCheck.md', 'ScanComponents.md', 'ShareComponent.md']));
});

test('copies every command into .claude/commands', () => {
  const cwd = tmp();
  const r = installCommands({ cwd });
  expect(r.installed).toEqual(expect.arrayContaining(['OmniCheck.md']));
  expect(fs.readFileSync(path.join(cwd, '.claude/commands/OmniCheck.md'), 'utf8')).toMatch(/omni-check/);
});

test('keeps a file the user already has, unless --force', () => {
  const cwd = tmp();
  fs.mkdirSync(path.join(cwd, '.claude/commands'), { recursive: true });
  fs.writeFileSync(path.join(cwd, '.claude/commands/OmniCheck.md'), 'mine');
  expect(installCommands({ cwd }).kept).toEqual(['OmniCheck.md']);
  expect(fs.readFileSync(path.join(cwd, '.claude/commands/OmniCheck.md'), 'utf8')).toBe('mine');
  installCommands({ cwd, force: true });
  expect(fs.readFileSync(path.join(cwd, '.claude/commands/OmniCheck.md'), 'utf8')).not.toBe('mine');
});

test('the CLI flag installs and exits 0 without needing a build or a browser', async () => {
  const cwd = tmp(); const out = sink(); const err = sink();
  expect(parseArgs(['--install-commands', '--force'])).toMatchObject({ installCommands: true, force: true });
  const code = await main(['--install-commands'], { stdout: out, stderr: err, cwd });
  expect(code).toBe(0);
  expect(out.text).toMatch(/installed .*\/OmniCheck/);
  expect(err.text).toBe('');
});
