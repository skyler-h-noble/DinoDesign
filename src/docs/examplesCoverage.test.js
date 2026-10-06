/* A COMPONENT WITHOUT AN EXAMPLE OPENS ON A BLANK PANEL.
 *
 * The Summary tab leads with EXAMPLES[component]. A missing key is not an
 * error — the slot simply renders nothing — so the page comes up with an empty
 * rectangle above the description and nothing says why. Sheet and TransferList
 * sat like that until someone looked at them.
 *
 * Radio was worse, because it HAD a key: it passed <Radio> children to
 * RadioGroup, which renders `options.map(...)` and never touches children. A
 * present-but-empty example is indistinguishable from a missing one on the
 * page, and passing ignored children is legal React, so nothing warned.
 */
import fs from 'fs';
import path from 'path';
import { EXAMPLES } from './examples';

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

/** Every component name a showcase asks DocSummary to render. */
function documentedComponents() {
  const found = new Set();
  for (const dir of fs.readdirSync(COMPONENTS_DIR)) {
    const full = path.join(COMPONENTS_DIR, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const file of fs.readdirSync(full)) {
      if (!/Showcase\.js$/.test(file)) continue;
      const src = fs.readFileSync(path.join(full, file), 'utf8');
      for (const m of src.matchAll(/<DocSummary[^>]*component="([A-Za-z0-9]+)"/g)) {
        found.add(m[1]);
      }
    }
  }
  return [...found].sort();
}

describe('every documented component leads with an example', () => {
  const documented = documentedComponents();

  test('the sweep finds the showcases at all', () => {
    expect(documented.length).toBeGreaterThan(40);
  });

  test('none of them is missing its example', () => {
    const missing = documented.filter((c) => typeof EXAMPLES[c] !== 'function');
    expect(missing).toEqual([]);
  });
});
