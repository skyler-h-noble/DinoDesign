/**
 * openOnHover, and the three things WCAG 1.4.13 asks of content that appears
 * on hover. A naive onMouseEnter/onMouseLeave pair gives one of them.
 *
 * The default is OFF, and the default is the argument: a FAB's main habitat is
 * touch, where hover does not exist, and it floats over content, so a pointer
 * crossing the screen passes through it.
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SpeedDial } from './SpeedDial';

const ACTIONS = [
  { icon: <span>A</span>, name: 'First', onClick: () => {} },
  { icon: <span>B</span>, name: 'Second', onClick: () => {} },
];

/* jsdom has no pointer, so matchMedia has to be stated. Both directions are
   tested, because "hover does nothing on touch" is half the feature. */
function setPointer({ fine }) {
  window.matchMedia = (q) => ({
    matches: fine && /hover: hover/.test(q),
    media: q, addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
  });
}

const dial = () => screen.getByRole('button', { name: 'Create' });

/* Open is `aria-expanded` on the dial, not the presence of the menu. The fan
   is always in the DOM and hidden with CSS, so querying for role="menu" finds
   it whether or not it is showing — and aria-expanded is what a screen reader
   reads, which makes it the honest thing to assert. */
const isOpen = () => dial().getAttribute('aria-expanded') === 'true';

beforeEach(() => { jest.useFakeTimers(); setPointer({ fine: true }); });
afterEach(() => { jest.useRealTimers(); });

describe('openOnHover', () => {
  test('is off by default — hover does nothing', () => {
    const { container } = render(<SpeedDial ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.mouseEnter(container.firstChild);
    expect(isOpen()).toBe(false);
  });

  test('opens on hover when asked', () => {
    const { container } = render(
      <SpeedDial openOnHover ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.mouseEnter(container.firstChild);
    expect(isOpen()).toBe(true);
  });

  /* The one a naive handler pair gets wrong. There is a 12px gap between the
     dial and the first action, so reaching inward leaves the dial — and the
     fan must still be there when the pointer arrives. */
  test('HOVERABLE: coming back before the delay keeps it open', () => {
    const { container } = render(
      <SpeedDial openOnHover ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.mouseEnter(container.firstChild);
    fireEvent.mouseLeave(container.firstChild);
    act(() => { jest.advanceTimersByTime(60); });
    fireEvent.mouseEnter(container.firstChild);
    act(() => { jest.advanceTimersByTime(500); });
    expect(isOpen()).toBe(true);
  });

  test('closes once the pointer has really gone', () => {
    const { container } = render(
      <SpeedDial openOnHover ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.mouseEnter(container.firstChild);
    fireEvent.mouseLeave(container.firstChild);
    act(() => { jest.advanceTimersByTime(300); });
    expect(isOpen()).toBe(false);
  });

  /* PERSISTENT: it does not time out while the pointer is on it. The delay
     governs closing after leaving, and nothing else. */
  test('PERSISTENT: it does not close on its own', () => {
    const { container } = render(
      <SpeedDial openOnHover ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.mouseEnter(container.firstChild);
    act(() => { jest.advanceTimersByTime(10000); });
    expect(isOpen()).toBe(true);
  });

  test('DISMISSIBLE: Escape closes it', () => {
    const { container } = render(
      <SpeedDial openOnHover ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.mouseEnter(container.firstChild);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(isOpen()).toBe(false);
  });

  /* Half the feature: a coarse pointer gets nothing, so a tablet with a stylus
     does not open a fan the user cannot dismiss by moving away. */
  test('does nothing without a fine pointer, even when asked', () => {
    setPointer({ fine: false });
    const { container } = render(
      <SpeedDial openOnHover ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.mouseEnter(container.firstChild);
    expect(isOpen()).toBe(false);
  });

  test('click still opens it when hover is on', () => {
    render(<SpeedDial openOnHover ariaLabel="Create" actions={ACTIONS} />);
    fireEvent.click(dial());
    expect(isOpen()).toBe(true);
  });
});

/* The + rotates about its own centre.
 *
 * An inline-flex box reserves a line box — the strut line-height sets aside for
 * ascenders and descenders, whether or not there is text in it — so the wrapper
 * came out taller than the icon, its 50% sat below the glyph's middle, and
 * rotate() swung the + around that lower point. It read as a wobble.
 *
 * jsdom does no layout, so the strut cannot be measured here. What CAN be
 * checked is that the two declarations which prevent it are still on the
 * element, which is how this would regress: by someone tidying away a
 * `lineHeight: 0` that looks like it does nothing.
 */
describe('the FAB icon rotates about its centre', () => {
  const styleOf = (el) => {
    const classes = Array.from(el.classList);
    let css = '';
    for (const sheet of Array.from(document.styleSheets)) {
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      for (const r of Array.from(rules || [])) {
        if (r.selectorText && classes.some((c) => r.selectorText.includes('.' + c))) {
          css += r.cssText;
        }
      }
    }
    return css;
  };

  test('the rotating wrapper collapses its line box and states its origin', () => {
    render(<SpeedDial ariaLabel="Create" actions={ACTIONS} />);
    const svg = dial().querySelector('svg');
    expect(svg).toBeTruthy();
    const wrapper = svg.parentElement;

    const css = styleOf(wrapper);
    expect(css).toMatch(/rotate\(/);
    expect(css).toMatch(/line-height:\s*0/);
    expect(css).toMatch(/transform-origin:\s*50% 50%/);
  });
});
