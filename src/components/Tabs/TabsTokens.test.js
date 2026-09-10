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

  test('the fallbacks are the values that used to ship', () => {
    /* A consumer with no design system CSS loaded must see exactly what it saw
       before — the tokens are an addition, not a change of default. */
    renderTabs('medium');
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('var(--Button-Padding,14px)');
    expect(c).toContain('var(--Button-Height,40px)');
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
