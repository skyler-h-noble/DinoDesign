/**
 * The Switch's sizes are Figma's, and this is where the two are tied together.
 *
 * SIZE_MAP held 28x16 at small and 40x24 at medium, against the Component-Size
 * collection's 35x20 and 42x24. Large matched, which is exactly why it survived:
 * one size agreeing reads as the set agreeing, and nothing compared the other
 * two to anything.
 *
 * The comparison is against docs/foundations.js rather than a copy of the
 * numbers written here. That file is the transcription of the Figma collection
 * the library already publishes to its readers, so a test written against it
 * fails when EITHER side drifts — a second hand-written copy would only have
 * been a third thing to keep in step.
 */
import { FOUNDATIONS } from '../../docs/foundations';

/** The published row: ['`Switch-Width` · `Height`', '35 · 20', ...] */
function publishedSwitchSizes() {
  const topic = FOUNDATIONS.find((t) => t.title === 'Component size');
  const row = topic.table.rows.find((r) => r[0].includes('Switch-Width'));
  expect(row).toBeTruthy();
  const parse = (cell) => cell.split('·').map((n) => Number(n.trim()));
  return { small: parse(row[1]), medium: parse(row[2]), large: parse(row[3]) };
}

/* Read from the source rather than imported: SIZE_MAP is internal, and
   exporting it so a test can see it would widen the public API to suit a test.
   The file is right here. */
function sizeMapFromSource() {
  const fs = require('fs');
  const path = require('path');
  const src = fs.readFileSync(path.join(__dirname, 'Switch.js'), 'utf8');
  const out = {};
  /* One sweep over the block rather than a regex per size built by string
     concatenation — the escaping has to survive being a string before it is a
     pattern, and getting that wrong returns null, which reads as "the value is
     missing" rather than "the test is broken". */
  const re = /(small|medium|large):\s*\{\s*trackW:\s*(\d+),\s*trackH:\s*(\d+)/g;
  let m;
  while ((m = re.exec(src)) !== null) out[m[1]] = [Number(m[2]), Number(m[3])];
  return out;
}

/* The CSS tokens, which are the third copy of this number and the one a
   consumer actually reads. Added at the same time as the Figma payload started
   writing Switch-Width / Switch-Height, so all three can be checked against
   each other instead of two of them agreeing while the third drifts. */
function cssSwitchSizes() {
  const fs = require('fs');
  const path = require('path');
  const css = fs.readFileSync(
    path.join(__dirname, '../../../public/styles/base.css'), 'utf8');
  const px = (name) => {
    const m = css.match(new RegExp('--' + name + ':\\s*([\\d.]+)px'));
    expect(m).toBeTruthy();
    return Number(m[1]);
  };
  return {
    small:  [px('Sm-Switch-Width'), px('Sm-Switch-Height')],
    medium: [px('Switch-Width'),    px('Switch-Height')],
    large:  [px('Lg-Switch-Width'), px('Lg-Switch-Height')],
  };
}

test.each(['small', 'medium', 'large'])(
  'the %s switch is the size Figma publishes', (size) => {
    const published = publishedSwitchSizes()[size];
    expect(sizeMapFromSource()[size]).toEqual(published);
    expect(cssSwitchSizes()[size]).toEqual(published);
  });
