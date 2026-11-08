/* THE THEME IN THE PAGE'S <head>.
 *
 * With themeURL alone the first styled paint waits for the JS, then
 * theme.json, then the sheets. The build helpers (@omni-design/components/vite,
 * `npx omni-theme-links`) put the sheets in the HTML with an #omni-theme JSON
 * and a head script that picks light/dark before first paint. The provider
 * must find them, never refetch them, be ready as soon as they have loaded,
 * and start in the mode the head script chose. themeURL without any head
 * links must behave exactly as before.
 */
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { OmniDesignProvider, useOmniDesign } from './OmniDesignProvider';
import { OMNI_HEAD_SCRIPT, headThemeConfig, resolveThemeManifest } from './themeHead';

const THEME_URL = 'https://cdn.test/theme.json';
const MANIFEST = {
  name: 'Harbor', defaultTheme: 'Default', defaultSurface: 'Surface', defaultStyle: 'Professional',
  foundation: 'https://cdn.test/foundation.css', core: 'https://cdn.test/core.css',
  typography: 'https://cdn.test/typography-tokens.css',
  lightMode: 'https://cdn.test/Light-Mode.css', darkMode: 'https://cdn.test/Dark-Mode.css',
  base: 'https://cdn.test/base.css', styles: 'https://cdn.test/styles.css',
};

let readyState = 'complete';
const realReadyState = Object.getOwnPropertyDescriptor(Document.prototype, 'readyState');
beforeAll(() => {
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => readyState });
});
afterAll(() => {
  delete document.readyState;
  if (realReadyState) Object.defineProperty(Document.prototype, 'readyState', realReadyState);
});

beforeEach(() => {
  readyState = 'complete';
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(MANIFEST), text: () => Promise.resolve('') }));
  window.localStorage.clear();
});
afterEach(() => {
  delete global.fetch;
  document.head.querySelectorAll('link, script#omni-theme').forEach((l) => l.remove());
  document.documentElement.removeAttribute('data-omni-mode');
  window.localStorage.clear();
});

const status = (c) => c.querySelector('[data-omni-css]').getAttribute('data-omni-css');
const omniLinks = () => Array.from(document.head.querySelectorAll('link[rel="stylesheet"][id^="omni-"]'));

/* What the plugin / CLI put in the head, then run the head script as the
   browser would. */
function writeHead({ dark = 'system', themeURL = THEME_URL } = {}) {
  const config = headThemeConfig(resolveThemeManifest(MANIFEST, THEME_URL), { themeURL, dark });
  const json = document.createElement('script');
  json.type = 'application/json';
  json.id = 'omni-theme';
  json.textContent = JSON.stringify(config);
  document.head.appendChild(json);
  // eslint-disable-next-line no-new-func
  new Function(OMNI_HEAD_SCRIPT)();
}

function Mode() { const { isDark, toggleDarkMode, name } = useOmniDesign(); return <button type="button" onClick={toggleDarkMode} data-dark={String(isDark)} data-name={name || ''}>t</button>; }

test('the head script adds the six sheets in cascade order, light by default', () => {
  writeHead();
  expect(omniLinks().map((l) => l.id)).toEqual(['omni-foundation', 'omni-core', 'omni-typography', 'omni-mode', 'omni-base', 'omni-styles']);
  expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.lightMode);
  expect(document.getElementById('omni-mode').getAttribute('blocking')).toBe('render');
  expect(document.documentElement.getAttribute('data-omni-mode')).toBe('light');
});

test('provider with the head JSON: no theme.json fetch, no refetch, ready on the first render', async () => {
  writeHead();
  const before = omniLinks();
  const { container, getByText } = render(
    <OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider>,
  );
  // jsdom's document has finished loading, as a browser's has once the head
  // sheets are in: ready on the very first render, never hidden.
  expect(status(container)).toBe('ready');
  await act(async () => { await Promise.resolve(); });
  expect(global.fetch).not.toHaveBeenCalled();
  expect(omniLinks()).toEqual(before); // the same elements — nothing re-added
  expect(omniLinks().map((l) => l.getAttribute('href'))).toEqual(before.map((l) => l.getAttribute('href')));
  expect(status(container)).toBe('ready');
  expect(getByText('t').getAttribute('data-name')).toBe('Harbor');
});

test('cssStatus waits for head sheets still loading, then is ready on their load events', async () => {
  readyState = 'interactive'; // the module script can run before the sheets finish
  writeHead();
  const { container } = render(<OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider>);
  await act(async () => { await Promise.resolve(); });
  expect(status(container)).toBe('loading');
  expect(global.fetch).not.toHaveBeenCalled();
  await act(async () => {
    omniLinks().filter((l) => l.id !== 'omni-mode').forEach((l) => l.dispatchEvent(new Event('load')));
    await Promise.resolve();
  });
  expect(status(container)).toBe('loading'); // the colors are in the mode sheet
  await act(async () => { document.getElementById('omni-mode').dispatchEvent(new Event('load')); await Promise.resolve(); });
  await waitFor(() => expect(status(container)).toBe('ready'));
  expect(omniLinks()).toHaveLength(6);
});

test('unmount (and StrictMode re-run) leaves the head sheets in place', async () => {
  writeHead();
  const { unmount } = render(<React.StrictMode><OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider></React.StrictMode>);
  await act(async () => { await Promise.resolve(); });
  expect(omniLinks()).toHaveLength(6);
  unmount();
  expect(omniLinks()).toHaveLength(6);
});

test('dark: the head script and the provider agree on a saved choice', async () => {
  window.localStorage.setItem('omni-dark-mode', 'dark');
  writeHead();
  expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.darkMode);
  expect(document.documentElement.getAttribute('data-omni-mode')).toBe('dark');
  const { container, getByText } = render(
    <OmniDesignProvider themeURL={THEME_URL} defaultDarkMode="system" persistDarkMode><Mode /></OmniDesignProvider>,
  );
  expect(getByText('t').getAttribute('data-dark')).toBe('true');
  expect(status(container)).toBe('ready');
  await act(async () => { await Promise.resolve(); });
  expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.darkMode); // not swapped
});

test('dark: the head script follows the device under dark="system", and the provider adopts it', () => {
  const mm = window.matchMedia;
  window.matchMedia = (q) => ({ matches: /dark/.test(q), media: q, addEventListener() {}, removeEventListener() {} });
  try {
    writeHead({ dark: 'system' });
    expect(document.documentElement.getAttribute('data-omni-mode')).toBe('dark');
    // Even a provider left on the default (light) starts where the head did,
    // rather than swapping the sheet the page has already painted with.
    const { getByText } = render(<OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider>);
    expect(getByText('t').getAttribute('data-dark')).toBe('true');
    expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.darkMode);
  } finally { window.matchMedia = mm; }
});

test('a saved "light" wins over a dark device, in both the script and the provider', () => {
  const mm = window.matchMedia;
  window.matchMedia = (q) => ({ matches: /dark/.test(q), media: q, addEventListener() {}, removeEventListener() {} });
  window.localStorage.setItem('omni-dark-mode', 'light');
  try {
    writeHead({ dark: 'system' });
    expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.lightMode);
    const { getByText } = render(<OmniDesignProvider themeURL={THEME_URL} defaultDarkMode="system" persistDarkMode><Mode /></OmniDesignProvider>);
    expect(getByText('t').getAttribute('data-dark')).toBe('false');
  } finally { window.matchMedia = mm; }
});

test('a toggle swaps the head mode sheet and keeps <html data-omni-mode> and storage in step', async () => {
  writeHead();
  const { getByText, container } = render(<OmniDesignProvider themeURL={THEME_URL} persistDarkMode><Mode /></OmniDesignProvider>);
  await act(async () => { getByText('t').click(); });
  expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.darkMode);
  expect(document.documentElement.getAttribute('data-omni-mode')).toBe('dark');
  expect(window.localStorage.getItem('omni-dark-mode')).toBe('dark');
  expect(status(container)).toBe('ready');
});

test('head JSON for a different themeURL is ignored: the manifest is fetched as before', async () => {
  writeHead({ themeURL: 'https://other.test/theme.json' });
  render(<OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider>);
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(THEME_URL));
});

test('head JSON with no themeURL prop: the top-level provider uses it', async () => {
  writeHead();
  const { container } = render(<OmniDesignProvider><Mode /></OmniDesignProvider>);
  expect(status(container)).toBe('ready');
  await act(async () => { await Promise.resolve(); });
  expect(global.fetch).not.toHaveBeenCalled();
});

test('hand-written head links (no JSON): used as they are, ready without waiting for theme.json', async () => {
  ['foundation', 'core', 'typography', 'mode', 'base', 'styles'].forEach((k) => {
    const l = document.createElement('link');
    l.id = 'omni-' + k; l.rel = 'stylesheet';
    l.href = k === 'mode' ? '/omni/Light-Mode.css' : `/omni/${k}.css`;
    document.head.appendChild(l);
  });
  let resolveFetch;
  global.fetch = jest.fn(() => new Promise((r) => { resolveFetch = () => r({ ok: true, json: () => Promise.resolve(MANIFEST) }); }));
  const { container } = render(<OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider>);
  expect(status(container)).toBe('ready');
  await act(async () => { await Promise.resolve(); });
  expect(status(container)).toBe('ready'); // theme.json still in flight — not hidden
  await act(async () => { resolveFetch(); });
  await act(async () => { await Promise.resolve(); });
  // The page's own copies stay; nothing is swapped to the manifest's URLs.
  expect(document.getElementById('omni-core').getAttribute('href')).toBe('/omni/core.css');
  expect(document.getElementById('omni-mode').getAttribute('href')).toBe('/omni/Light-Mode.css');
  expect(status(container)).toBe('ready');
});

test('back-compat: themeURL with nothing in the head fetches theme.json and injects the sheets', async () => {
  const { container } = render(<OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider>);
  expect(status(container)).toBe('loading');
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(THEME_URL));
  await waitFor(() => expect(omniLinks().map((l) => l.id)).toEqual(
    ['omni-foundation', 'omni-core', 'omni-typography', 'omni-mode', 'omni-base', 'omni-styles'],
  ));
  expect(omniLinks().every((l) => l.getAttribute('data-omni') === 'true')).toBe(true);
  await act(async () => { omniLinks().forEach((l) => l.onload && l.onload()); await Promise.resolve(); });
  await waitFor(() => expect(status(container)).toBe('ready'));
});

/* ── Per-theme mode files (theme.json modeParts) ─────────────────────────── */

const PART = (mode, t) => `https://cdn.test/modes/${mode}.${t}.css`;
const ORDER = ['Default', 'Primary', 'Secondary', 'Error'];
const PARTS = {
  order: ORDER,
  lightMode: { shared: PART('Light-Mode', 'shared'), themes: Object.fromEntries(ORDER.map((t) => [t, PART('Light-Mode', t)])) },
  darkMode: { shared: PART('Dark-Mode', 'shared'), themes: Object.fromEntries(ORDER.map((t) => [t, PART('Dark-Mode', t)])) },
};

function writeTrimmedHead(themes) {
  // eslint-disable-next-line global-require
  const { selectModeParts } = require('./themeHead');
  const resolved = resolveThemeManifest({ ...MANIFEST, modeParts: PARTS }, THEME_URL);
  const config = headThemeConfig(resolved, { themeURL: THEME_URL, modeParts: selectModeParts(resolved.modeParts, themes) });
  const json = document.createElement('script');
  json.type = 'application/json';
  json.id = 'omni-theme';
  json.textContent = JSON.stringify(config);
  document.head.appendChild(json);
  // eslint-disable-next-line no-new-func
  new Function(OMNI_HEAD_SCRIPT)();
}

test('parts: the mode slot links the selected themes in system order, then shared', () => {
  writeTrimmedHead(['Primary', 'Default']);
  expect(omniLinks().map((l) => l.id)).toEqual(['omni-foundation', 'omni-core', 'omni-typography', 'omni-mode', 'omni-mode-1', 'omni-mode-2', 'omni-base', 'omni-styles']);
  expect(['omni-mode', 'omni-mode-1', 'omni-mode-2'].map((id) => document.getElementById(id).getAttribute('href')))
    .toEqual([PART('Light-Mode', 'Default'), PART('Light-Mode', 'Primary'), PART('Light-Mode', 'shared')]);
});

test('parts: a toggle swaps every part to the dark files, in place', async () => {
  writeTrimmedHead(['Default', 'Primary']);
  const { getByText } = render(<OmniDesignProvider themeURL={THEME_URL}><Mode /></OmniDesignProvider>);
  await act(async () => { getByText('t').click(); });
  expect(['omni-mode', 'omni-mode-1', 'omni-mode-2'].map((id) => document.getElementById(id).getAttribute('href')))
    .toEqual([PART('Dark-Mode', 'Default'), PART('Dark-Mode', 'Primary'), PART('Dark-Mode', 'shared')]);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('parts: a theme the build did not see is linked when the page uses it', async () => {
  writeTrimmedHead(['Default', 'Primary']);
  render(<OmniDesignProvider themeURL={THEME_URL}><div data-theme="Error">e</div></OmniDesignProvider>);
  await waitFor(() => expect(document.getElementById('omni-mode-3')).not.toBeNull());
  expect(['omni-mode', 'omni-mode-1', 'omni-mode-2', 'omni-mode-3'].map((id) => document.getElementById(id).getAttribute('href')))
    .toEqual([PART('Light-Mode', 'Default'), PART('Light-Mode', 'Primary'), PART('Light-Mode', 'Error'), PART('Light-Mode', 'shared')]);
});

test('parts: a system without modeParts still links the one full mode sheet', () => {
  writeHead();
  expect(document.getElementById('omni-mode-1')).toBeNull();
  expect(document.getElementById('omni-mode').getAttribute('href')).toBe(MANIFEST.lightMode);
});
