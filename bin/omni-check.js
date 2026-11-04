#!/usr/bin/env node
'use strict';
/* omni-check — axe-core over every page of a built app, light and dark, desktop
 * and phone. `npx omni-check --help`. Separate from the component bundle:
 * nothing under src/ imports it, and axe-core is loaded only here. */
require('./omni-check/cli').main(process.argv.slice(2)).then(
  (code) => { process.exitCode = code; },
  (err) => { process.stderr.write(String(err && err.stack ? err.stack : err) + '\n'); process.exitCode = 2; },
);
