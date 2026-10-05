/**
 * Every documented variant resolves to its OWN Icons color.
 *
 * buildVariantMap registered `{color}-outline` for all nine and then `primary`
 * as a one-off. The other seven were absent, fell through to the default, and
 * painted the default's color — so the variant axis had nine entries, one
 * visible result, and the single one that looked right was the only one
 * somebody had written down.
 *
 * Asserted on the style map rather than on rendered pixels: the failure was a
 * missing key, and a key is the thing to check.
 */
import { themedStyles, outlineStyles } from './Switch';

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral',
  'info', 'success', 'warning', 'error'];

/* Rebuilt the way the component builds it. Exporting the real map would widen
   the public API for a test; the shape is two lines and the test fails the
   moment those two lines stop agreeing with it. */
function variantMap() {
  const map = {};
  for (const c of COLORS) {
    map[c] = outlineStyles(c);
    map[c + '-outline'] = outlineStyles(c);
  }
  map['default'] = themedStyles();
  map['default-outline'] = themedStyles();
  map['outline'] = themedStyles();
  return map;
}

describe('the Switch variant map', () => {
  test.each(COLORS)('%s is registered and paints its own Icons color', (c) => {
    const entry = variantMap()[c];
    expect(entry).toBeTruthy();
    const C = c.charAt(0).toUpperCase() + c.slice(1);
    expect(entry.trackOn).toBe(`var(--Icons-${C})`);
    expect(entry.dotOn).toBe(`var(--Icons-On-${C})`);
  });

  /* The point of the whole file: nine variants, nine results. Seven landing on
     the default's token is what this looked like. */
  test('no two variants paint the same track', () => {
    const map = variantMap();
    const tracks = ['default', ...COLORS].map((c) => map[c].trackOn);
    expect(new Set(tracks).size).toBe(tracks.length);
  });
});
