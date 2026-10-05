/* THE NAV CAPTION HAS ITS OWN TYPE STYLE.
 *
 * Figma binds Labels/Mobile-Nav-Label-* on the Nav Item's caption, with the
 * Body family at Body-Semibold-Font-Weight. Both nav components rendered it
 * as LabelExtraSmall, which resolves to the SAME six values today — Body
 * family, 11px, 600, 16.5px, 0.0455em, none — so the wrong token looked
 * exactly right.
 *
 * They do not stay equal. Mobile-Nav-Label is device-scoped in the file: 11
 * on Desktop, 10 on iOS, 12 on Android, and 400 rather than 600 on the System
 * face for mobile. Whichever one a brand moves, the other stays put, and
 * nothing shows until someone holds a phone next to a desktop.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { BottomNavigation } from './BottomNavigation';
import { Rail } from '../Rail';
import HomeIcon from '@mui/icons-material/Home';

const ITEMS = [
  { label: 'Home', icon: <HomeIcon /> },
  { label: 'Search', icon: <HomeIcon /> },
];

/* className on an SVG is an SVGAnimatedString, not a string, and these trees
   are full of icons — so read the attribute rather than the property. */
const cssFor = (el) => {
  const raw = el.getAttribute ? (el.getAttribute('class') || '') : '';
  const cls = raw.split(/\s+/).find((c) => c.startsWith('css-'));
  if (!cls) return '';
  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules || []))
    .filter((r) => (r.selectorText || '').includes('.' + cls))
    .map((r) => r.cssText)
    .join('\n');
};

describe('the nav caption reads Mobile-Nav-Label', () => {
  test('BottomNavigation', () => {
    const { container } = render(<BottomNavigation items={ITEMS} />);
    const label = container.querySelector('.bottom-nav-label');
    expect(label).toBeInTheDocument();
    const css = cssFor(label);
    expect(css).toContain('var(--Mobile-Nav-Label-Font-Size)');
    expect(css).toContain('var(--Mobile-Nav-Label-Font-Weight)');
    expect(css).not.toContain('--Label-ExtraSmall-');
  });

  test('Rail', () => {
    const { container } = render(<Rail items={ITEMS} />);
    const all = Array.from(container.querySelectorAll('*')).map(cssFor).join('\n');
    expect(all).toContain('var(--Mobile-Nav-Label-Font-Size)');
    expect(all).not.toContain('--Label-ExtraSmall-Font-Size');
  });
});

/* The floating bar's geometry, read off the file rather than restated:
 * Step Holder style padding is Sizing-2 and the pill's radius is its own
 * height. `Other/Nav-Bar Height` (83) no longer exists — it is `Other/ToolBar`
 * (80) now, with `Other/ToolBarShort` (64) beside it — so a literal 83 could
 * not follow the rename. */
describe('the floating bar reads its geometry from tokens', () => {
  test('padding is Sizing-2, not Button-Height', () => {
    const src = require('fs').readFileSync(__dirname + '/BottomNavigation.js', 'utf8');
    const pad = src.slice(src.indexOf('const FLOATING_PAD'), src.indexOf('const NO_PAD'));
    expect(pad).toContain('var(--Sizing-2, 16px)');
    expect(pad).not.toContain('var(--Button-Height, 32px)');
    expect(pad).not.toContain("py: '12px'");
  });

  test('the pill radius is the ToolBar token, not a literal 83', () => {
    const src = require('fs').readFileSync(__dirname + '/BottomNavigation.js', 'utf8');
    expect(src).toContain('var(--ToolBar,');
    expect(src).not.toContain("FLOATING_RADIUS = '83px'");
  });
});
