/* DARK MODE CAN FOLLOW THE DEVICE AND REMEMBER THE USER.
 *
 * The provider kept dark mode in memory only: a reload went back to light, and
 * a device set to dark was ignored. Both are opt-in — defaultDarkMode="system"
 * and persistDarkMode — so a provider nested in an app (a preview, a themed
 * sub-tree) never picks up a setting it did not ask for.
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { OmniDesignProvider, useOmniDesign } from './OmniDesignProvider';

function Probe() {
  const { isDark, toggleDarkMode } = useOmniDesign();
  return <button onClick={toggleDarkMode}>{isDark ? 'dark' : 'light'}</button>;
}

let listeners;
let systemDark;
beforeEach(() => {
  listeners = [];
  systemDark = false;
  window.matchMedia = jest.fn((q) => ({
    matches: q.includes('dark') ? systemDark : false,
    media: q,
    addEventListener: (_, fn) => listeners.push(fn),
    removeEventListener: (_, fn) => { listeners = listeners.filter((l) => l !== fn); },
  }));
  window.localStorage.clear();
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(''), json: () => Promise.resolve({}) }));
});
afterEach(() => { delete global.fetch; delete window.matchMedia; });

const flipSystem = (dark) => act(() => { systemDark = dark; listeners.forEach((fn) => fn({ matches: dark })); });
const mode = () => screen.getByRole('button').textContent;

test('by default it starts light and ignores the device', () => {
  systemDark = true;
  render(<OmniDesignProvider><Probe /></OmniDesignProvider>);
  expect(mode()).toBe('light');
});

test('"system" starts in the device mode and follows it live', () => {
  systemDark = true;
  render(<OmniDesignProvider defaultDarkMode="system"><Probe /></OmniDesignProvider>);
  expect(mode()).toBe('dark');
  flipSystem(false);
  expect(mode()).toBe('light');
});

test('after the user toggles, the device no longer overrides them', () => {
  render(<OmniDesignProvider defaultDarkMode="system"><Probe /></OmniDesignProvider>);
  fireEvent.click(screen.getByRole('button'));
  expect(mode()).toBe('dark');
  flipSystem(false);
  expect(mode()).toBe('dark');
});

test('persistDarkMode saves the choice and restores it on the next visit', () => {
  const first = render(<OmniDesignProvider persistDarkMode><Probe /></OmniDesignProvider>);
  fireEvent.click(screen.getByRole('button'));
  expect(window.localStorage.getItem('omni-dark-mode')).toBe('dark');
  first.unmount();
  render(<OmniDesignProvider persistDarkMode><Probe /></OmniDesignProvider>);
  expect(mode()).toBe('dark');
});

test('a saved choice wins over the device', () => {
  window.localStorage.setItem('omni-dark-mode', 'light');
  systemDark = true;
  render(<OmniDesignProvider defaultDarkMode="system" persistDarkMode><Probe /></OmniDesignProvider>);
  expect(mode()).toBe('light');
  flipSystem(true);
  expect(mode()).toBe('light');
});

test('a custom key is used, and nothing is saved without persistDarkMode', () => {
  const a = render(<OmniDesignProvider persistDarkMode="shop-mode"><Probe /></OmniDesignProvider>);
  fireEvent.click(screen.getByRole('button'));
  expect(window.localStorage.getItem('shop-mode')).toBe('dark');
  a.unmount();
  window.localStorage.clear();
  render(<OmniDesignProvider><Probe /></OmniDesignProvider>);
  fireEvent.click(screen.getByRole('button'));
  expect(window.localStorage.length).toBe(0);
});

test('storage that throws is treated as no saved choice', () => {
  const get = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  const set = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  render(<OmniDesignProvider persistDarkMode><Probe /></OmniDesignProvider>);
  expect(mode()).toBe('light');
  fireEvent.click(screen.getByRole('button'));
  expect(mode()).toBe('dark');
  get.mockRestore(); set.mockRestore();
});
