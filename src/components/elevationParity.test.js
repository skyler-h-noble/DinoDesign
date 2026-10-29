/**
 * Every component rests on the level its Figma effect style NAMES.
 *
 * The five Effect-Levels are the five styles. Lining alphas and radii up from a
 * published bundle against the Figma effect styles makes the mapping exact:
 *
 *   1  a=0.145 r=1.6   Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
 *   2  a=0.169 r=3.6   Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover)
 *   3  a=0.200 r=8.1   Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
 *   4  a=0.184 r=18.1  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
 *   5  a=0.251 r=40.4  Elevations/Level-5 (Dialog & Modal)
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
  ['AppBar/AppBar.js',       2, 'Elevations/Level-2 — App bars'],
  ['Toolbar/Toolbar.js',     2, 'Elevations/Level-2 — Toolbars'],
  ['Menu/Menu.js',           2, 'Elevations/Level-2 — Menus'],
  ['Popover/Popover.js',     2, 'Elevations/Level-2 — Popover'],
  ['Alert/Alert.js',         1, 'Elevations/Level-1 — Alert'],
  ['Accordion/Accordion.js', 1, 'Elevations/Level-1 — Accordion'],
  ['Snackbar/Snackbar.js',   3, 'Elevations/Level-3 — Snackbar'],
  ['Modal/Modal.js',         5, 'Elevations/Level-5 — Dialog & Modal'],
  ['Dialog/Dialog.js',       5, 'Elevations/Level-5 — Dialog & Modal'],
];

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

describe('elevation matches the Figma effect styles', () => {
  it.each(EXPECTED)('%s rests on Level %i (%s)', (file, level) => {
    const src = read(file);
    // The scrim variant (neutral, over a backdrop) is the same level's geometry.
    const uses = src.includes(`SHADOW_LEVEL_${level}`) || src.includes(`SHADOW_SCRIM_LEVEL_${level}`);
    expect(`${file} uses SHADOW_LEVEL_${level}: ${uses}`)
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

  it('Card rests on the Card pair; Ratio draws no shadow at all', () => {
    /* Ratio used to share Card's pair. It is a bare media slot now — no frame,
       no states — so it must not import a shadow level at all. */
    /* Rest is Level 1, and the elevated class moves it to Level 2. */
    const card = read('Card/Card.js');
    expect(/\.omni-card\{--_cd-rest:\$\{SHADOW_LEVEL_1\}/.test(card)).toBe(true);
    expect(/\.omni-card-elev\{--_cd-rest:\$\{SHADOW_LEVEL_2\}/.test(card)).toBe(true);
    expect(/SHADOW_LEVEL_/.test(read('Ratio/Ratio.js'))).toBe(false);
  });
});
