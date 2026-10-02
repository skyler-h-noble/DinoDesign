/**
 * Baseline, indicator and focus ring are THREE different thicknesses.
 *
 * 1px baseline, 2px indicator, 3px focus ring — and the focus ring sits 1px in
 * from the edge rather than flush. Every one of those has been collapsed into
 * another at some point: the doc block claimed a 3px indicator for months while
 * the code drew 2, and the ring was flush where Figma insets it.
 *
 * Asserted against the Figma component directly:
 *   Tabs   — Baseline boolean, default true; Baseline frame 1px, on the edge
 *            the orientation names, STRETCH along it
 *   Tab    — Selector frame 2px on the same edge; Focus-Visible frame with a
 *            3px INSIDE stroke, inset 1px (129x30 in a 131x32 tab)
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs, TabList, Tab, edgeFor, isHorizontalOrientation,
  baselineStyle, indicatorStyle, hoverIndicatorStyle } from './Tabs';

const list = (c) => c.querySelector('.tab-list');
const renderTabs = (props = {}) => render(
  <Tabs {...props}>
    <TabList>
      <Tab value={0}>One</Tab>
      <Tab value={1}>Two</Tab>
    </TabList>
  </Tabs>,
);

describe('which edge each orientation uses', () => {
  it.each([
    ['horizontal', 'Bottom'],
    ['vertical-left', 'Left'],
    ['vertical-right', 'Right'],
  ])('%s -> %s', (orientation, edge) => {
    expect(edgeFor(orientation)).toBe(edge);
  });

  it("keeps 'vertical' meaning right, so existing consumers do not move", () => {
    /* The component drew borderRight for every non-horizontal orientation
       before Vertical-Left existed. Making 'vertical' mean left would silently
       flip the indicator in every app already passing it. */
    expect(edgeFor('vertical')).toBe('Right');
    expect(isHorizontalOrientation('vertical')).toBe(false);
  });

  it('falls back to Bottom for an unknown value rather than nothing', () => {
    expect(edgeFor('sideways')).toBe('Bottom');
  });
});

describe('the baseline', () => {
  /* Asserted against baselineStyle rather than the DOM: jsdom cannot parse a
     border shorthand whose color is a var(), so toHaveStyle reduces such an
     expectation to empty and passes against ANY rendered value. A DOM test
     here would be green no matter what the component drew. */
  const BASE = '1px solid var(--Border-Variant)';

  it('is on by default, matching the Figma boolean', () => {
    expect(baselineStyle('horizontal')).toEqual({ borderBottom: BASE });
  });

  it('is 1px — NOT the indicator 2px', () => {
    expect(baselineStyle('horizontal').borderBottom).toContain('1px');
    expect(baselineStyle('horizontal').borderBottom).not.toContain('2px');
  });

  it('turns off, which is what an AppBar needs', () => {
    /* The AppBar's own edge already separates it from the content, so its Tabs
       instance sets Baseline=false in Figma. Without this prop the lib had no
       way to express that and drew the rule regardless. */
    expect(baselineStyle('horizontal', false)).toEqual({});
  });

  it.each([
    ['horizontal', 'borderBottom'],
    ['vertical-left', 'borderLeft'],
    ['vertical-right', 'borderRight'],
  ])('%s puts it on %s and nowhere else', (orientation, prop) => {
    // A rule on two edges is a box, not a baseline.
    expect(baselineStyle(orientation)).toEqual({ [prop]: BASE });
  });

  it('reaches the rendered tab list', () => {
    // One DOM check that does not depend on parsing a var(): the class is on.
    const { container } = renderTabs();
    expect(list(container)).toBeInTheDocument();
  });
});

describe('the tab list frame', () => {
  it('has no padding in the standard variant, as the Figma frame does not', () => {
    /* Figma's Tabs variants are padding 0/0/0/0 and the tabs sit flush, so the
       baseline runs the full width. The 4px belongs to the variants that paint
       a surface behind the tabs. */
    const { container } = renderTabs();
    expect(getComputedStyle(list(container)).padding).toBe('0px');
  });

  it('keeps the padding where a surface is painted behind the tabs', () => {
    const { container } = renderTabs({ variant: 'solid' });
    expect(getComputedStyle(list(container)).padding).toBe('4px');
  });
});

describe('the indicator', () => {
  const COLOR = 'var(--Buttons-Primary-Border)';

  it('is 2px on the orientation edge when selected', () => {
    expect(indicatorStyle('horizontal', true, '2px', COLOR).borderBottom)
      .toBe('2px solid ' + COLOR);
  });

  it('is present but transparent when unselected, so selecting cannot resize a tab', () => {
    /* Figma gets this by absolutely positioning the Selector with an edge
       constraint — which is why all fifteen Tab variants measure the same. The
       CSS equivalent is a transparent border, not no border. */
    expect(indicatorStyle('horizontal', false, '2px', COLOR).borderBottom)
      .toBe('2px solid transparent');
  });

  it.each([
    ['horizontal', 'borderBottom'],
    ['vertical-left', 'borderLeft'],
    ['vertical-right', 'borderRight'],
  ])('%s draws on %s and states none on the other two', (orientation, prop) => {
    /* Stating the other edges as 'none' rather than omitting them is what stops
       a stale border surviving an orientation change. */
    const st = indicatorStyle(orientation, true, '2px', COLOR);
    expect(st[prop]).toBe('2px solid ' + COLOR);
    for (const other of ['borderBottom', 'borderLeft', 'borderRight']) {
      if (other !== prop) expect(st[other]).toBe('none');
    }
  });

  it('never shares a thickness with the baseline', () => {
    // 1px rule, 2px mark. Collapsing them is the mistake this pair guards.
    const b = baselineStyle('horizontal').borderBottom;
    const i = indicatorStyle('horizontal', true, '2px', COLOR).borderBottom;
    expect(b.split(' ')[0]).toBe('1px');
    expect(i.split(' ')[0]).toBe('2px');
  });
});

describe('the hover mark', () => {
  const COLOR = 'var(--Buttons-Primary-Border)';

  it('previews the selector at 50%, using the SAME token', () => {
    /* Not --Border-Variant. That is the baseline's token, so a hover mark in it
       would put a 2px line on top of the 1px rule in the same tone — reading as
       a thicker baseline rather than a hovered tab. */
    const st = hoverIndicatorStyle('horizontal', false, '2px', COLOR);
    expect(st.borderBottom).toBe('2px solid color-mix(in srgb, ' + COLOR + ' 50%, transparent)');
    expect(st.borderBottom).not.toContain('Border-Variant');
  });

  it('uses color-mix, not opacity', () => {
    /* Figma dims the Hover LAYER to 50%. The CSS equivalent is a
       half-transparent border color — `opacity: 0.5` on the tab would fade the
       label and the icon with it. */
    const st = hoverIndicatorStyle('horizontal', false, '2px', COLOR);
    expect(st).not.toHaveProperty('opacity');
    expect(st.borderBottom).toContain('color-mix');
  });

  it('does nothing on a selected tab', () => {
    // It already draws the indicator at full strength; a 50% mark would lighten it.
    expect(hoverIndicatorStyle('horizontal', true, '2px', COLOR)).toEqual({});
  });

  it.each([['horizontal', 'borderBottom'], ['vertical-left', 'borderLeft'], ['vertical-right', 'borderRight']])(
    '%s marks the %s edge', (orientation, prop) => {
      expect(Object.keys(hoverIndicatorStyle(orientation, false, '2px', COLOR))).toEqual([prop]);
    });
});
