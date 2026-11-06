// SkipLink: hidden at rest, shown on focus (the rules are on the <a> that takes
// focus — a hand-built one styled a wrapper and never appeared), and
// activating it moves focus to the main region.
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { SkipLink } from './SkipLink';
import { SkipLink as Exported } from '../index';
import { stateRules } from '../_testCss';

const sheet = () => Array.from(document.styleSheets).flatMap((s) => Array.from(s.cssRules || [])).map((r) => r.cssText).join('\n');

function Page(props) {
  return (
    <>
      <SkipLink {...props} />
      <nav aria-label="Main"><a href="/a">A</a></nav>
      <main id="main"><h1>Shop</h1></main>
    </>
  );
}

test('is exported from the package index', () => {
  expect(Exported).toBe(SkipLink);
});

test('a real link to #main reading "Skip to main content" by default', () => {
  render(<SkipLink />);
  const a = screen.getByRole('link', { name: 'Skip to main content' });
  expect(a.tagName).toBe('A');
  expect(a).toHaveAttribute('href', '#main');
});

test('href and children are props', () => {
  render(<SkipLink href="#content">Skip to results</SkipLink>);
  expect(screen.getByRole('link', { name: 'Skip to results' })).toHaveAttribute('href', '#content');
});

test('hidden at rest: clipped to 1px, still in the tab order', () => {
  render(<SkipLink />);
  const a = screen.getByRole('link');
  const base = stateRules(a).base;
  expect(base).toMatch(/position: absolute;/);
  expect(base).toMatch(/width: 1px;/);
  expect(base).toMatch(/clip-path: inset\(50%\);/);
  expect(a).not.toHaveAttribute('tabindex');
});

test('visible on focus: fixed top-left above everything, its own surface, the focus ring inside its edge', () => {
  render(<SkipLink />);
  const a = screen.getByRole('link');
  expect(a).toHaveAttribute('data-surface', 'Surface-Brightest');
  const css = sheet();
  const rule = css.split('\n').find((r) => r.startsWith('a.omni-skip.omni-skip:focus'));
  expect(rule).toBeTruthy();
  for (const d of ['position: fixed', 'z-index: 2147483647', 'clip-path: none', 'width: auto',
    'background-color: var(--Background)', 'color: var(--Hotlink)', 'outline: 2px solid var(--Focus-Visible)', 'outline-offset: -5px']) {
    expect(rule).toContain(d);
  }
  // The focus rule matches the link itself — the element that takes focus.
  a.focus();
  expect(a).toHaveFocus();
  expect(a.matches('a.omni-skip.omni-skip:focus')).toBe(true);
});

test('activating it moves focus to the target (made focusable) without changing the URL', () => {
  render(<Page />);
  const main = document.getElementById('main');
  const before = window.location.href;
  fireEvent.click(screen.getByRole('link', { name: 'Skip to main content' }));
  expect(main).toHaveFocus();
  expect(main).toHaveAttribute('tabindex', '-1');
  expect(window.location.href).toBe(before);
});

test('a target that is already focusable keeps its tabindex', () => {
  render(<><SkipLink href="#t" /><div id="t" tabIndex={0}>x</div></>);
  fireEvent.click(screen.getByRole('link'));
  expect(document.getElementById('t')).toHaveFocus();
  expect(document.getElementById('t')).toHaveAttribute('tabindex', '0');
});

test('no target on the page: the browser handles the link as usual', () => {
  render(<SkipLink href="#missing" />);
  const ev = fireEvent.click(screen.getByRole('link'));
  expect(ev).toBe(true); // not prevented
});

test('a caller onClick runs first and can take over', () => {
  const onClick = jest.fn((e) => e.preventDefault());
  render(<Page onClick={onClick} />);
  fireEvent.click(screen.getByRole('link', { name: 'Skip to main content' }));
  expect(onClick).toHaveBeenCalled();
  expect(document.getElementById('main')).not.toHaveFocus();
});

test('no accessibility violations', async () => {
  const { container } = render(<Page />);
  expect(await axe(container)).toHaveNoViolations();
});
