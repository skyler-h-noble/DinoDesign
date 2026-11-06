/* A SYSTEM'S DEFAULTS REACH THE ROOT.
 *
 * theme.json carries defaultTheme / defaultSurface / defaultStyle — the
 * studio writes the designer's component style there (Cocktail Hour:
 * "Professional"). They used to seed useState only, and with themeURL the
 * manifest arrived after the first render, so the root stayed on the built-in
 * 'Default' / 'Modern' / 'Surface' for every published system.
 *
 * Now: from the head JSON they are on the root in the first render; with
 * themeURL alone they are on it in the render that stops waiting for the
 * manifest, before the page is shown. Props the app passes still win, and a
 * theme.json without the fields (or with a name no system defines) falls back
 * as before.
 */
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { OmniDesignProvider, useOmniDesign } from './OmniDesignProvider';
import { OMNI_HEAD_SCRIPT, headThemeConfig, resolveThemeManifest } from './themeHead';

const THEME_URL = 'https://cdn.test/theme.json';
const SHEETS = {
  foundation: 'https://cdn.test/foundation.css', core: 'https://cdn.test/core.css',
  lightMode: 'https://cdn.test/Light-Mode.css', darkMode: 'https://cdn.test/Dark-Mode.css',
  base: 'https://cdn.test/base.css', styles: 'https://cdn.test/styles.css',
};
const MANIFEST = {
  name: 'Cocktail Hour', ...SHEETS,
  defaultTheme: 'Primary', defaultStyle: 'Professional', defaultSurface: 'Surface-Bright',
};

let manifest = MANIFEST;
beforeEach(() => {
  manifest = MANIFEST;
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(manifest), text: () => Promise.resolve('') }));
});
afterEach(() => {
  delete global.fetch;
  document.head.querySelectorAll('link, script#omni-theme').forEach((l) => l.remove());
  document.documentElement.removeAttribute('data-omni-mode');
  jest.restoreAllMocks();
});

const root = (c) => c.querySelector('[data-omni-css]');
const attrs = (c) => ({
  theme: root(c).getAttribute('data-theme'),
  style: root(c).getAttribute('data-style'),
  surface: root(c).getAttribute('data-surface'),
});

function writeHead(m = MANIFEST) {
  const json = document.createElement('script');
  json.type = 'application/json';
  json.id = 'omni-theme';
  json.textContent = JSON.stringify(headThemeConfig(resolveThemeManifest(m, THEME_URL), { themeURL: THEME_URL, dark: 'light' }));
  document.head.appendChild(json);
  // eslint-disable-next-line no-new-func
  new Function(OMNI_HEAD_SCRIPT)();
}

function Ctx() {
  const { theme, style, surface, setStyle, name } = useOmniDesign();
  return <button type="button" onClick={() => setStyle('Playful')} data-ctx={[theme, style, surface].join('|')} data-name={name || ''}>s</button>;
}

/* Every root a render commits, in order — to prove the wrong style never
   reached the DOM, not only that the right one ends up there. */
function recordRoots(container) {
  const seen = [];
  const mo = new MutationObserver(() => { const r = root(container); if (r) seen.push({ ...attrs(container), css: r.getAttribute('data-omni-css') }); });
  mo.observe(container, { subtree: true, childList: true, attributes: true });
  return { seen, stop: () => mo.disconnect() };
}

describe('head block (Vite plugin / omni-theme-links)', () => {
  test('the defaults are on the root in the FIRST render, with no fetch', () => {
    writeHead();
    const { container, getByText } = render(<OmniDesignProvider themeURL={THEME_URL}><Ctx /></OmniDesignProvider>);
    expect(attrs(container)).toEqual({ theme: 'Primary', style: 'Professional', surface: 'Surface-Bright' });
    expect(getByText('s').getAttribute('data-ctx')).toBe('Primary|Professional|Surface-Bright');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('explicit props win over the head JSON', () => {
    writeHead();
    const { container } = render(
      <OmniDesignProvider themeURL={THEME_URL} defaultTheme="Default" defaultStyle="Bold" defaultSurface="Surface"><Ctx /></OmniDesignProvider>,
    );
    expect(attrs(container)).toEqual({ theme: 'Default', style: 'Bold', surface: 'Surface' });
  });
});

describe('themeURL only', () => {
  test('the defaults apply when the manifest arrives, and the page is never shown before', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const rec = recordRoots(container);
    const { getByText } = render(<OmniDesignProvider themeURL={THEME_URL}><Ctx /></OmniDesignProvider>, { container });
    await waitFor(() => expect(getByText('s').getAttribute('data-name')).toBe('Cocktail Hour'));
    expect(attrs(container)).toEqual({ theme: 'Primary', style: 'Professional', surface: 'Surface-Bright' });
    expect(getByText('s').getAttribute('data-ctx')).toBe('Primary|Professional|Surface-Bright');
    // The sheets load (jsdom fetches nothing: fire their load events).
    expect(root(container).getAttribute('data-omni-css')).toBe('loading');
    await act(async () => {
      document.head.querySelectorAll('link[id^="omni-"]').forEach((l) => l.dispatchEvent(new Event('load')));
      await Promise.resolve();
    });
    await waitFor(() => expect(root(container).getAttribute('data-omni-css')).toBe('ready'));
    rec.stop();
    // Before the manifest the root carried the fallbacks — but only while
    // hidden. Every state the page was SHOWN in has the system's defaults.
    const shown = rec.seen.filter((x) => x.css !== 'loading');
    expect(shown.length).toBeGreaterThan(0);
    shown.forEach((x) => expect(x).toMatchObject({ theme: 'Primary', style: 'Professional', surface: 'Surface-Bright' }));
    expect(rec.seen.some((x) => x.css === 'loading' && x.style === 'Modern')).toBe(true); // the old value existed, hidden
  });

  test('explicit props win over theme.json', async () => {
    const { container, getByText } = render(
      <OmniDesignProvider themeURL={THEME_URL} defaultTheme="Default" defaultStyle="Modern" defaultSurface="Surface"><Ctx /></OmniDesignProvider>,
    );
    await waitFor(() => expect(getByText('s').getAttribute('data-name')).toBe('Cocktail Hour'));
    expect(attrs(container)).toEqual({ theme: 'Default', style: 'Modern', surface: 'Surface' });
  });

  test('one explicit prop wins; the others still come from theme.json', async () => {
    const { container, getByText } = render(
      <OmniDesignProvider themeURL={THEME_URL} defaultStyle="Playful"><Ctx /></OmniDesignProvider>,
    );
    await waitFor(() => expect(getByText('s').getAttribute('data-name')).toBe('Cocktail Hour'));
    expect(attrs(container)).toEqual({ theme: 'Primary', style: 'Playful', surface: 'Surface-Bright' });
  });

  test('setStyle wins over the manifest, and survives it', async () => {
    const { container, getByText } = render(<OmniDesignProvider themeURL={THEME_URL}><Ctx /></OmniDesignProvider>);
    await act(async () => { getByText('s').click(); });
    await waitFor(() => expect(getByText('s').getAttribute('data-name')).toBe('Cocktail Hour'));
    expect(attrs(container).style).toBe('Playful');
  });

  test('surfaceStyle still wins over theme.json', async () => {
    const { container, getByText } = render(<OmniDesignProvider themeURL={THEME_URL} surfaceStyle="dark-professional"><Ctx /></OmniDesignProvider>);
    await waitFor(() => expect(getByText('s').getAttribute('data-name')).toBe('Cocktail Hour'));
    expect(attrs(container)).toMatchObject({ theme: 'Neutral', surface: 'Surface-Dimmest', style: 'Professional' });
  });
});

describe('back-compat', () => {
  test('a theme.json without the fields keeps the built-in defaults', async () => {
    manifest = { name: 'Old', ...SHEETS };
    const { container, getByText } = render(<OmniDesignProvider themeURL={THEME_URL}><Ctx /></OmniDesignProvider>);
    await waitFor(() => expect(getByText('s').getAttribute('data-name')).toBe('Old'));
    expect(attrs(container)).toEqual({ theme: 'Default', style: 'Modern', surface: 'Surface' });
  });

  test('a head JSON without the fields keeps the built-in defaults', () => {
    writeHead({ name: 'Old', ...SHEETS });
    const { container } = render(<OmniDesignProvider themeURL={THEME_URL}><Ctx /></OmniDesignProvider>);
    expect(attrs(container)).toEqual({ theme: 'Default', style: 'Modern', surface: 'Surface' });
  });

  test('a name no system defines is ignored, with a dev warning', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    manifest = { name: 'Older', ...SHEETS, defaultTheme: 'Primary-Light', defaultStyle: 'Retro', defaultSurface: 'Surface' };
    const { container, getByText } = render(<OmniDesignProvider themeURL={THEME_URL}><Ctx /></OmniDesignProvider>);
    await waitFor(() => expect(getByText('s').getAttribute('data-name')).toBe('Older'));
    expect(attrs(container)).toEqual({ theme: 'Default', style: 'Modern', surface: 'Surface' });
    expect(warn.mock.calls.map((c) => c[0]).join('\n')).toMatch(/Primary-Light[\s\S]*Retro/);
  });

  test('no themeURL: props or the built-in defaults, as before', () => {
    const { container } = render(<OmniDesignProvider defaultStyle="Bold"><Ctx /></OmniDesignProvider>);
    expect(attrs(container)).toEqual({ theme: 'Default', style: 'Bold', surface: 'Surface' });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
