import React from 'react';
import { render } from '@testing-library/react';
import { Tabs, TabList, Tab } from './Tabs';

/* A tab is built from BUTTON metrics — that is what keeps it the same size and
   type as the buttons beside it in a nav bar. They were hardcoded, so a design
   system that changed its button padding moved every button and left the tabs
   where they were, and nothing reported the drift. */

const css = () => Array.from(document.styleSheets)
  .flatMap(ss => { try { return Array.from(ss.cssRules); } catch { return []; } })
  .map(r => r.cssText).join('');

const renderTabs = (size) => render(
  <Tabs value="a" size={size}>
    <TabList><Tab value="a">One</Tab><Tab value="b">Two</Tab></TabList>
  </Tabs>,
);

describe('tab metrics come from the button tokens', () => {
  test.each([
    ['medium', '--Button-Padding', '--Button-Height', '--Button-Text'],
    ['small', '--Sm-Button-Padding', '--Sm-Button-Height', '--Sm-Button-Text'],
    ['large', '--Lg-Button-Padding', '--Lg-Button-Height', '--Lg-Button-Text'],
  ])('%s reads its padding, height and type size', (size, pad, height, text) => {
    renderTabs(size);
    const c = css();
    // jest's expect takes no message argument — that is vitest. Naming the
    // token in the assertion instead keeps the failure readable.
    const missing = [pad, height, text].filter((t) => !c.includes(t));
    expect({ size, missing }).toEqual({ size, missing: [] });
  });

  test('the fallbacks are the DESIGN values, not the old lib ones', () => {
    /* Changed deliberately. The fallbacks used to be what the lib happened to
       ship — 14px padding, 40px height — which meant a consumer with no design
       system CSS saw a tab that matched nothing. They are the design's own
       numbers now, so the untokenised case is the design rather than an
       accident of what was typed first. */
    renderTabs('medium');
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('var(--Button-Padding,8px)');
    expect(c).toContain('var(--Button-Height,32px)');
  });

  test('the content gap is separate from the text padding', () => {
    /* Two measurements doing different jobs: 2px separates the icon from the
       label's box, Button-Text-Padding pads the label inside it. Collapsing
       them into one either crowds the icon or over-pads the text. */
    renderTabs('medium');
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('gap:2px');
    expect(c).toContain('padding:4pxvar(--Button-Text-Padding,4px)');
  });

  test('height comes from minHeight, not a vertical padding as well', () => {
    // Specifying the same measurement twice means the two disagree the moment
    // either changes.
    renderTabs('medium');
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('padding:0var(--Button-Padding,8px)');
  });

  test('no bare pixel padding survives', () => {
    // The failure this prevents: one size tokenised and another missed, which
    // looks correct until a design system changes its button padding.
    renderTabs('small');
    const c = css().replace(/\s+/g, '');
    expect(c).not.toContain('padding:6px10px');
  });
});

describe('the selector is 2px', () => {
  test('matching the design rather than the extra pixel it had', () => {
    renderTabs('medium');
    expect(css().replace(/\s+/g, '')).toContain('2pxsolid');
  });
});
