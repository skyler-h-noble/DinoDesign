/**
 * Every component rests on the level its Figma effect style NAMES.
 *
 * The five Effect-Levels are the five styles. Lining alphas and radii up from a
 * published bundle against the Figma effect styles makes the mapping exact:
 *
 *   1  a=0.145 r=1.6   Card / Accordion, Handle, Alert, Bottom-Sheet
 *   2  a=0.169 r=3.6   Card-Hover / App bars, Toolbars, Menus, Tooltip
 *   3  a=0.200 r=8.1   FAB, Snackbar
 *   4  a=0.184 r=18.1  FAB-Hover
 *   5  a=0.251 r=40.4  Dialog & Modal
 *
 * The constants are named SHADOW_LEVEL_N, so nothing in the source says that
 * level 2 is the app-bar step. Every component picked a number that looked
 * reasonable, and a shadow one level out is still a plausible shadow — so none
 * of these could be caught by looking at the result. Only the style NAME says
 * which rung is right, and this table is the only place the two meet.
 *
 * Asserted against the source rather than a render: the literals are
 * brand-generated, so a test on painted pixels would be testing the shadow
 * generator rather than which rung each component chose.
 */
import fs from 'fs';
import path from 'path';

/** component file → the level its Figma style names, and which style that is. */
const EXPECTED = [
  ['AppBar/AppBar.js',       2, 'App bars'],
  ['Toolbar/Toolbar.js',     2, 'Toolbars'],
  ['Menu/Menu.js',           2, 'Menus'],
  ['Popover/Popover.js',     2, 'the Menus / Tooltip step'],
  ['Alert/Alert.js',         1, 'Alert'],
  ['Accordion/Accordion.js', 1, 'Accordion'],
  ['Snackbar/Snackbar.js',   3, 'Snackbar'],
  ['Modal/Modal.js',         5, 'Dialog & Modal'],
  ['Dialog/Dialog.js',       5, 'Dialog & Modal'],
];

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

describe('elevation matches the Figma effect styles', () => {
  it.each(EXPECTED)('%s rests on Level %i (%s)', (file, level) => {
    const src = read(file);
    expect(`${file} uses SHADOW_LEVEL_${level}: ${src.includes(`SHADOW_LEVEL_${level}`)}`)
      .toBe(`${file} uses SHADOW_LEVEL_${level}: true`);
  });

  it('no component hardcodes a black shadow', () => {
    /* Modal and Dialog both carried `0 8px 32px rgba(0,0,0,0.x)`. A literal
       shadow takes neither the brand's dropshadow tint nor its intensity, on
       the two components where the shadow IS most of the elevation. */
    const offenders = [];
    for (const [file] of EXPECTED) {
      const src = read(file);
      if (/boxShadow:\s*['"`][^'"`]*rgba\(0\s*,\s*0\s*,\s*0/.test(src)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });

  it('Card and Ratio share the same pair', () => {
    /* Ratio is a themed surface with Box's shell, so it rests where Card does.
       It carried Card's OLD pair, which is how one wrong rung became two. */
    for (const f of ['Card/Card.js', 'Ratio/Ratio.js']) {
      const src = read(f);
      expect(`${f} rest: ${/elevated \? SHADOW_LEVEL_2 : SHADOW_LEVEL_1/.test(src)}`)
        .toBe(`${f} rest: true`);
    }
  });
});
