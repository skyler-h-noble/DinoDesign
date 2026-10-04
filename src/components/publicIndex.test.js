/**
 * Every component directory is reachable from the public index.
 *
 * Tag and Loader were not. Both had a component, tests, stories and a showcase
 * in `src/components/`, and neither appeared in `index.js` — so nothing
 * consuming the package could import them, and the index's own
 * "CHIPS & TAGS" heading sat above a Chip export alone.
 *
 * Nothing caught it, from either side. The library's own tests import by
 * relative path, so they pass whether or not the index re-exports a component.
 * The studio has a `declare module` shim for the package, and a declared module
 * REPLACES the real types — so `import { Input } from '@omni-design/components'`
 * typechecked, built, and surfaced only at runtime as "does not provide an
 * export named 'Input'", which takes a whole page down rather than one import.
 *
 * The listing is read from disk, so a new component is covered the moment it
 * exists rather than when someone remembers to add a case.
 */
const fs = require('fs');
const path = require('path');
const index = require('./index');

const DIR = __dirname;

/** Published under a different name on purpose. The value is an export that
 *  must resolve, so "it is exported, just renamed" has to stay TRUE rather than
 *  becoming a parking space for something that quietly vanished. */
const ALIASED = {
  // `export { Input as TextInput }` — the index calls TextInput the preferred name.
  Input: 'TextInput',
  // A directory of three charts; `Charts` was never a component itself.
  Charts: 'BarChart',
  // Published as OmniTreeView (DynoTreeView is the back-compat alias).
  TreeView: 'OmniTreeView',
};

/** Build- and demo-time helpers. Not components, and not part of the package's
 *  surface — exporting them would commit the library to supporting them. */
/* Not components: the docs site's own UI, which lives under src/components
   only because that is where its pieces were written. Nothing outside this
   repo renders a Showcase. `Foundations` is the same thing — the Foundations
   page and its demos, not a thing a consumer imports. */
const INTERNAL = ['Showcase', 'shared', 'Foundations'];

/** Real gaps: a component with tests and stories that the index does not reach.
 *
 *  Listed rather than fixed, because adding one is a decision about the public
 *  API, not a typo. Asserted as MISSING so that exporting one trips this test
 *  and whoever does it removes the line deliberately — the same shape as the
 *  studio's MISSING_FROM_FILE. */
const KNOWN_GAPS = ['Progress', 'Sheet', 'TransferList'];

const dirs = fs.readdirSync(DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((n) => fs.existsSync(path.join(DIR, n, 'index.js')));

describe('the public index', () => {
  it('finds component directories to check', () => {
    expect(dirs.length).toBeGreaterThan(20);
  });

  test.each(dirs.filter((d) => !ALIASED[d] && !INTERNAL.includes(d) && !KNOWN_GAPS.includes(d)))(
    '%s is reachable from the package index', (name) => {
      expect(index[name]).toBeDefined();
    });

  test.each(Object.entries(ALIASED))('%s is reachable as %s', (_dir, alias) => {
    expect(index[alias]).toBeDefined();
  });

  test.each(INTERNAL)('%s stays internal', (name) => {
    expect(index[name]).toBeUndefined();
  });

  test.each(KNOWN_GAPS)('%s is a known gap — export it and delete the line', (name) => {
    expect(index[name]).toBeUndefined();
  });

  it('Tag and Loader are exported, with their variants', () => {
    // The two this test was written for. Spot-checking the variants as well,
    // because a barrel can export the base and miss the rest.
    for (const n of ['Tag', 'PrimaryTag', 'ErrorTag', 'TAG_COLORS']) {
      expect(index[n]).toBeDefined();
    }
    for (const n of ['Loader', 'SkeletonLoader', 'DotsLoader', 'OverlayLoader']) {
      expect(index[n]).toBeDefined();
    }
  });
});
