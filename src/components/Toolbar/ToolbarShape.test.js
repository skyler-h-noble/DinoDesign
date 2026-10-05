import React from 'react';
import { render } from '@testing-library/react';
import { Toolbar, TOOLBAR_COLORS, TOOLBAR_SURFACES } from './Toolbar';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import AddIcon from '@mui/icons-material/Add';

const ITEMS = [
  { icon: <FormatBoldIcon />, label: 'Bold' },
  { icon: <FormatBoldIcon />, label: 'Italic' },
];

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

/* IT HUGS, AND A PARENT CANNOT UNDO IT. `inline-flex` shrink-wraps only while
   the cross size is auto — in a flex column, which is what a stacked sample or
   a sidebar is, align-items: stretch spanned the bar across the whole width
   with its actions bunched at one end. */
describe('the bar hugs its content', () => {
  test('width is fit-content, not auto', () => {
    const { container } = render(<Toolbar items={ITEMS} />);
    expect(cssFor(container.querySelector('.toolbar'))).toContain('width: fit-content');
  });

  /* The pill needs room at its rounded ENDS, which is the long axis. Leaving
     16/8 put as the bar turned padded the SHORT axis and the vertical bar came
     out wider than its buttons needed. */
  test('the pill padding turns with the bar', () => {
    const { container: h } = render(<Toolbar items={ITEMS} />);
    expect(cssFor(h.querySelector('.toolbar'))).toContain('padding: 8px 16px');
    const { container: v } = render(<Toolbar items={ITEMS} orientation="vertical" />);
    expect(cssFor(v.querySelector('.toolbar'))).toContain('padding: 16px 8px');
  });
});

describe('theme and surface are two axes', () => {
  test('the five themes, and none of the state palettes', () => {
    expect(TOOLBAR_COLORS).toEqual(
      ['default', 'primary', 'secondary', 'tertiary', 'neutral']);
    for (const state of ['info', 'success', 'warning', 'error']) {
      expect(TOOLBAR_COLORS).not.toContain(state);
    }
  });

  /* Surfaces only. A toolbar sits ON a surface; a Container is the level a
     card or panel takes when nested INSIDE one, so offering both would be two
     answers to "how far off the page am I" when one of them cannot apply. */
  test('the surface levels, and no Containers', () => {
    expect(TOOLBAR_SURFACES).toEqual([
      'Surface', 'Surface-Dim', 'Surface-Dimmest',
      'Surface-Bright', 'Surface-Brightest']);
    for (const lvl of TOOLBAR_SURFACES) expect(lvl).not.toMatch(/^Container/);
  });

  test('surface is its own prop, not a colour name', () => {
    const { container } = render(
      <Toolbar items={ITEMS} color="primary" surface="Surface-Brightest" />);
    const bar = container.querySelector('.toolbar');
    expect(bar).toHaveAttribute('data-theme', 'Primary');
    expect(bar).toHaveAttribute('data-surface', 'Surface-Brightest');
  });

  /* The old names were a lightness wearing a colour name. They still resolve,
     so a call site that passed one keeps rendering what it rendered. */
  test.each([
    ['white', 'Neutral', 'Surface-Brightest'],
    ['black', 'Neutral', 'Surface-Dimmest'],
    ['primary-light', 'Primary', 'Surface-Brightest'],
  ])('legacy %s still resolves', (color, theme, surface) => {
    const { container } = render(<Toolbar items={ITEMS} color={color} />);
    const bar = container.querySelector('.toolbar');
    expect(bar).toHaveAttribute('data-theme', theme);
    expect(bar).toHaveAttribute('data-surface', surface);
  });
});

/* The FAB was a Button forced round at a hardcoded 56x56 — the large end of
   FAB-Width, beside a bar of small buttons — painted variant="default", so a
   themed bar came with a brand-coloured FAB. */
describe('the FAB belongs to its bar', () => {
  test('it is a Fab, and takes the bar’s colour', () => {
    const { container } = render(
      <Toolbar items={ITEMS} color="primary"
               fab={{ icon: <AddIcon />, label: 'Add' }} />);
    const fab = container.querySelector('.fab, [class*="fab"]');
    expect(fab).toBeTruthy();
    const all = Array.from(container.querySelectorAll('button')).map(cssFor).join('\n');
    expect(all).toContain('--Buttons-Primary-');
  });

  test('and does not hardcode 56px', () => {
    const src = require('fs').readFileSync(__dirname + '/Toolbar.js', 'utf8');
    expect(src).not.toContain('width: 56, height: 56');
  });
});
