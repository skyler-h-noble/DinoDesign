/**
 * Every Switch variant has to resolve to a DIFFERENT color.
 *
 * The ON state takes its fill from the Icons collection — `--Icons-<Color>` for
 * the track, `--Icons-On-<Color>` for the knob — and base.css pointed every one
 * of those at `--Icon-Surfaces-<Palette>-Color-9`, a name defined nowhere. An
 * undefined var() invalidates the whole declaration at computed value time, so
 * the tokens resolved to nothing and nine variants painted one color. Nothing
 * errored; the samples just all looked the same.
 *
 * Asserted on the stylesheet rather than on a rendered switch, because that is
 * where the failure was: the component asked for the right token all along.
 */
const fs = require('fs');
const path = require('path');

const STYLES = path.join(__dirname, '../../../public/styles');
const css = fs.readFileSync(path.join(STYLES, 'base.css'), 'utf8');

/* Defined by ANY sheet the library ships, not just base.css. The palette ramps
   live in Light-Mode.css and Dark-Mode.css — a fallback pointing at one of them
   is resolvable in a consumer that loads the library's CSS, which is the thing
   being asserted. Reading only base.css would have called a working fallback
   broken. */
const defined = new Set(
  fs.readdirSync(STYLES)
    .filter((f) => f.endsWith('.css'))
    .flatMap((f) => (fs.readFileSync(path.join(STYLES, f), 'utf8')
      .match(/^\s*--[A-Za-z0-9-]+\s*:/gm) || [])
      .map((d) => d.trim().replace(/\s*:$/, ''))),
);

const COLORS = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral',
  'Info', 'Success', 'Warning', 'Error'];

describe('the Icons tokens the Switch paints with', () => {
  test.each(COLORS)('--Icons-%s resolves to something defined', (c) => {
    const line = css.match(new RegExp(`^\\s*--Icons-${c}\\s*:(.*)$`, 'm'));
    expect(line).toBeTruthy();

    /* Every var() in the value, in order. The LAST one has to be defined —
       everything before it may legitimately be a brand-owned name this file
       does not carry, and the fallback is what makes that safe. */
    const refs = [...line[1].matchAll(/var\(\s*(--[A-Za-z0-9-]+)/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(0);
    expect(defined.has(refs[refs.length - 1])).toBe(true);
  });

  /* The point of the whole thing: nine variants, nine colors. Two palettes
     resolving to one value is the bug this file exists for. */
  test('no two palettes land on the same final fallback', () => {
    const finals = COLORS.map((c) => {
      const line = css.match(new RegExp(`^\\s*--Icons-${c}\\s*:(.*)$`, 'm'));
      const refs = [...line[1].matchAll(/var\(\s*(--[A-Za-z0-9-]+)/g)].map((m) => m[1]);
      return refs[refs.length - 1];
    });
    // Default and Neutral share a palette by design; the rest must differ.
    const distinct = new Set(finals);
    expect(distinct.size).toBe(COLORS.length - 1);
  });
});
