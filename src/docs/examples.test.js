// src/docs/examples.test.js
//
// Guards the import cycle that blanked the gallery.
//
// `src/components/index.js` re-exports these docs, so importing the BARREL from
// inside src/docs closes a loop:
//
//   components/index.js -> ../docs -> ./examples -> ../components  ↺
//
// At runtime the loop resolves half-initialised and the component references
// come back undefined. Nothing fails to compile — the build succeeded and every
// file parsed — but React throws "type is invalid ... but got: object" on the
// first render and the whole page goes blank.
//
// Rendering each example is what catches it, because an undefined component is
// only a problem at render time.
import React from 'react';
import { render } from '@testing-library/react';
import { EXAMPLES, hasExample } from './examples';

describe('live examples', () => {
  test('every one renders — no undefined component from a barrel cycle', () => {
    const bad = [];
    for (const [name, fn] of Object.entries(EXAMPLES)) {
      try {
        render(<div>{fn()}</div>);
      } catch (e) {
        bad.push(`${name}: ${String(e.message).split('\n')[0].slice(0, 80)}`);
      }
    }
    /* If this fails with "type is invalid", something in src/docs is importing
       ../components instead of the component's own module — see the note at the
       top of this file. (Jest's expect takes no message argument; that is
       Vitest, which the studio uses.) */
    expect(bad).toEqual([]);
  });

  test('no file in src/docs imports the component barrel', () => {
    // The cycle is easier to catch here than to debug from a blank page.
    const fs = require('fs');
    const offenders = fs.readdirSync(__dirname)
      .filter(f => f.endsWith('.js') && !f.endsWith('.test.js'))
      .filter(f => {
        const src = fs.readFileSync(`${__dirname}/${f}`, 'utf8');
        // Only real import statements — the note above quotes the path too.
        return /^\s*import\b[^;]*from '\.\.\/components';/m.test(src);
      });
    expect(offenders).toEqual([]);
  });

  test('hasExample agrees with EXAMPLES', () => {
    expect(hasExample('Button')).toBe(Boolean(EXAMPLES.Button));
    expect(hasExample('NotAComponent')).toBe(false);
  });
});
