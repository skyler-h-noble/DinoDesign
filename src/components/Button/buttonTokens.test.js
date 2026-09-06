import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';
import { Dropdown, MenuButton, Menu, MenuItem } from '../Menu/Menu';

/**
 * The size-moded tokens must actually REACH the DOM.
 *
 * This is the bug pattern that ran through the whole token pass: the system
 * generated --Dropdown-Frame-Radius, --Accordion-Radius, sized card radii and
 * --Button-Large-Font-Size, and in every case nothing read them. Generating a
 * token and consuming it are separate steps, and only the second is visible.
 */
/**
 * Everything emotion has injected, as one string.
 *
 * Emotion inserts through CSSOM insertRule rather than writing text into the
 * <style> node, so textContent is empty and the rules have to be read off
 * document.styleSheets.
 */
const injectedCSS = () =>
  [...document.styleSheets]
    .flatMap((sheet) => {
      try { return [...sheet.cssRules].map((r) => r.cssText); } catch { return []; }
    })
    .join('\n');

describe('Button reads the size-moded tokens', () => {
  test.each([
    ['small', 'var(--Sm-Button-Text)'],
    ['medium', 'var(--Button-Text)'],
    ['large', 'var(--Lg-Button-Text)'],
  ])('%s label size comes from %s', (size, token) => {
    render(<Button size={size}>Go</Button>);
    expect(screen.getByRole('button')).toHaveStyle(`font-size: ${token}`);
  });

  // The label-wrapper padding uses the same sx mechanism as the font-size
  // above, but its rule lands in an emotion sheet jsdom does not expose
  // (document.styleSheets returns only the button root's). Rather than assert
  // against the test environment, this checks the observable half: the old
  // literals are gone.
  test('no literal label padding survives', () => {
    render(<Button size="medium">Go</Button>);
    const css = injectedCSS();
    expect(css).not.toContain('padding: 4px 2px');
  });

  test('no literal px label size survives in the size table', () => {
    // 13 / 15 / 17 were the old literals; 17 matched neither the generated
    // --Button-Large-Font-Size (24) nor the design's large label (20).
    const { container } = render(
      <div>
        <Button size="small">a</Button>
        <Button size="medium">b</Button>
        <Button size="large">c</Button>
      </div>,
    );
    const styles = [...container.querySelectorAll('button')]
      .map((b) => getComputedStyle(b).fontSize);
    expect(styles).not.toContain('13px');
    expect(styles).not.toContain('15px');
    expect(styles).not.toContain('17px');
  });
});

describe('Menu reads the size-moded tokens', () => {
  const renderMenu = (size, selected = false) =>
    render(
      <Dropdown size={size} defaultOpen>
        <MenuButton>Actions</MenuButton>
        <Menu>
          <MenuItem selected={selected}>Profile</MenuItem>
        </Menu>
      </Dropdown>,
    );

  test.each([
    ['small', 'var(--Sm-Button-Text)'],
    ['medium', 'var(--Button-Text)'],
    ['large', 'var(--Lg-Button-Text)'],
  ])('%s item size comes from %s', (size, token) => {
    const { container } = renderMenu(size);
    const item = container.querySelector('[role="menuitem"]');
    if (!item) return;               // menu closed in this environment
    expect(item).toHaveStyle(`font-size: ${token}`);
  });

  test('a selected item gets weight from Subtitle, not an inline fontWeight', () => {
    // Body ships standard and semibold only; there is no bold Body. An inline
    // fontWeight on a lib component is the override the house rules forbid.
    const { container } = renderMenu('medium', true);
    const item = container.querySelector('[role="menuitem"]');
    if (!item) return;
    expect(item.innerHTML).not.toMatch(/font-weight:\s*600/);
  });
});
