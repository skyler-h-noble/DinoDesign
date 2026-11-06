/* THE PAGE STAYS HIDDEN UNTIL THE THEME HAS APPLIED.
 *
 * With themeURL, the first render has no manifest yet, so every static slot is
 * empty — and the static effect's "nothing to load" branch reported ready.
 * The hide-while-loading rule never applied: a throttled page painted
 * unstyled (black on white, system fonts, blue links) at ~0.94 s, and
 * Light-Mode.css landed at 2.0–3.8 s (CLS 0.396 unthrottled).
 *
 * Now ready needs the manifest, the static sheets AND the first mode sheet,
 * with a timeout so a stalled request never hides the page for good.
 */
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { OmniDesignProvider, useOmniDesign, THEME_LOAD_TIMEOUT_MS } from './OmniDesignProvider';

const MANIFEST = {
  name: 'Harbor', defaultTheme: 'Default', defaultSurface: 'Surface',
  foundation: 'https://cdn.test/foundation.css', core: 'https://cdn.test/core.css',
  lightMode: 'https://cdn.test/Light-Mode.css', darkMode: 'https://cdn.test/Dark-Mode.css',
  base: 'https://cdn.test/base.css', styles: 'https://cdn.test/styles.css',
};

let resolveFetch;
beforeEach(() => {
  global.fetch = jest.fn(() => new Promise((resolve) => {
    resolveFetch = () => resolve({ ok: true, json: () => Promise.resolve(MANIFEST), text: () => Promise.resolve('') });
  }));
});
afterEach(() => {
  delete global.fetch;
  document.head.querySelectorAll('link[data-omni], link[id^="omni-"]').forEach((l) => l.remove());
  jest.useRealTimers();
});

const status = (c) => c.querySelector('[data-omni-css]').getAttribute('data-omni-css');
const omniLinks = () => Array.from(document.head.querySelectorAll('link[rel="stylesheet"][id^="omni-"]'));
/* jsdom never loads a stylesheet: fire the load event the browser would. */
const loadLinks = (filter = () => true) => act(async () => {
  for (const l of omniLinks().filter(filter)) if (l.onload) l.onload();
  await Promise.resolve();
});

function Toggle() { const { toggleDarkMode } = useOmniDesign(); return <button type="button" onClick={toggleDarkMode}>t</button>; }

test('hidden while theme.json is in flight — not ready on the empty first render', async () => {
  const { container } = render(<OmniDesignProvider themeURL="https://cdn.test/theme.json"><p>hi</p></OmniDesignProvider>);
  // Let every mount effect run: nothing has been fetched yet.
  await act(async () => { await Promise.resolve(); });
  expect(status(container)).toBe('loading');
  expect(omniLinks()).toHaveLength(0);
});

test('ready only once the manifest, the static sheets and the mode sheet have all loaded', async () => {
  const { container } = render(<OmniDesignProvider themeURL="https://cdn.test/theme.json"><p>hi</p></OmniDesignProvider>);
  await act(async () => { resolveFetch(); });
  await waitFor(() => expect(omniLinks().map((l) => l.id)).toEqual(expect.arrayContaining(['omni-foundation', 'omni-mode'])));
  expect(status(container)).toBe('loading');
  await loadLinks((l) => l.id !== 'omni-mode');
  expect(status(container)).toBe('loading'); // the colors are in the mode sheet
  await loadLinks((l) => l.id === 'omni-mode');
  await waitFor(() => expect(status(container)).toBe('ready'));
});

test('a later dark-mode toggle does not hide the page again', async () => {
  const { container, getByText } = render(
    <OmniDesignProvider themeURL="https://cdn.test/theme.json"><Toggle /></OmniDesignProvider>,
  );
  await act(async () => { resolveFetch(); });
  await waitFor(() => expect(omniLinks().length).toBeGreaterThan(0));
  await loadLinks();
  await waitFor(() => expect(status(container)).toBe('ready'));
  await act(async () => { getByText('t').click(); });
  expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.darkMode);
  expect(status(container)).toBe('ready');
});

test('a failed manifest shows the page (error), never hides it', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('x')), text: () => Promise.resolve('') }));
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const { container } = render(<OmniDesignProvider themeURL="https://cdn.test/theme.json"><p>hi</p></OmniDesignProvider>);
  await waitFor(() => expect(status(container)).toBe('error'));
  spy.mockRestore();
});

test('a stalled load shows the page after the timeout, with a warning', async () => {
  jest.useFakeTimers();
  global.fetch = jest.fn(() => new Promise(() => {})); // never answers
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const { container } = render(<OmniDesignProvider themeURL="https://cdn.test/theme.json"><p>hi</p></OmniDesignProvider>);
  expect(status(container)).toBe('loading');
  act(() => { jest.advanceTimersByTime(THEME_LOAD_TIMEOUT_MS - 1); });
  expect(status(container)).toBe('loading');
  act(() => { jest.advanceTimersByTime(1); });
  expect(status(container)).toBe('ready');
  expect(warn.mock.calls.some((c) => /has not finished loading/.test(String(c[0])))).toBe(true);
  warn.mockRestore();
});

test('no theme CSS at all: ready on the first render', () => {
  const { container } = render(<OmniDesignProvider><p>hi</p></OmniDesignProvider>);
  expect(status(container)).toBe('ready');
});

test('fast setup — only darkModeCSS, page in light mode: ready on the first render', () => {
  const { container } = render(<OmniDesignProvider darkModeCSS="https://cdn.test/Dark-Mode.css"><p>hi</p></OmniDesignProvider>);
  expect(status(container)).toBe('ready');
});
