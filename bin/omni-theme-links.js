#!/usr/bin/env node
'use strict';
/* omni-theme-links — print the <head> block that loads a design system's
 * theme without waiting for JavaScript. Paste it into index.html right after
 * <meta charset> / <meta viewport>, before any other <link>, <script> or
 * <style>. Keep themeURL on <OmniDesignProvider>; it finds the block and
 * neither fetches theme.json nor refetches a sheet.
 *
 * Vite apps: prefer the plugin (`@omni-design/components/vite`), which does
 * this on every build. */
const fs = require('fs');
const path = require('path');

const HELP = `Usage: npx omni-theme-links <themeURL> [options]

Prints the <head> block for a design system's theme.json.

Options:
  --dark system|light|dark   first mode when the visitor has no saved choice
                             (default: system — match the provider's
                             defaultDarkMode="system")
  --storage-key <key>        the provider's persistDarkMode key
                             (default: omni-dark-mode)
  --copy <dir>               also download the sheets into <dir> (for example
                             public/omni) and link them from there; the Google
                             Fonts @imports leave foundation.css and the fonts
                             load in one request
  --base <path>              the URL <dir> is served at (default: /omni/)
  -h, --help                 this text
`;

async function main(argv) {
  const opts = { dark: 'system', storageKey: undefined, copy: null, base: '/omni/' };
  let themeURL = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') { process.stdout.write(HELP); return 0; }
    else if (a === '--dark') opts.dark = argv[++i];
    else if (a === '--storage-key') opts.storageKey = argv[++i];
    else if (a === '--copy') opts.copy = argv[++i];
    else if (a === '--base') opts.base = argv[++i];
    else if (!a.startsWith('-') && !themeURL) themeURL = a;
    else { process.stderr.write(`omni-theme-links: unknown option ${a}\n\n${HELP}`); return 2; }
  }
  if (!themeURL) { process.stderr.write(HELP); return 2; }
  if (!['system', 'light', 'dark'].includes(opts.dark)) { process.stderr.write('omni-theme-links: --dark must be system, light or dark\n'); return 2; }
  const { themeLinks } = require('../dist/vite.cjs');
  const html = await themeLinks(themeURL, {
    dark: opts.dark,
    storageKey: opts.storageKey,
    copyTo: opts.copy,
    basePath: opts.base,
    writeFile: async (name, source) => {
      fs.mkdirSync(opts.copy, { recursive: true });
      fs.writeFileSync(path.join(opts.copy, name), source);
      process.stderr.write(`wrote ${path.join(opts.copy, name)}\n`);
    },
  });
  process.stdout.write(html + '\n');
  return 0;
}

main(process.argv.slice(2)).then(
  (code) => { process.exitCode = code; },
  (err) => { process.stderr.write(String(err && err.message ? err.message : err) + '\n'); process.exitCode = 1; },
);
