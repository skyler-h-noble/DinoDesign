/* @omni-design/components/vite and `npx omni-theme-links`: what they write. */
import {
  omniTheme, themeLinks, buildThemeHead, injectIntoHead, loadThemeManifest, combineGoogleFonts, stripFontImports, OMNI_HEAD_SCRIPT,
} from './index';

const BASE = 'https://storage.test/ds/';
const MANIFEST = {
  name: 'Cocktail Hour', defaultTheme: 'Default', defaultStyle: 'Professional', defaultSurface: 'Surface',
  foundation: BASE + 'foundation.css', core: BASE + 'core.css', typography: BASE + 'typography-tokens.css',
  lightMode: BASE + 'Light-Mode.css', darkMode: BASE + 'Dark-Mode.css', base: BASE + 'base.css', styles: BASE + 'styles.css',
  fonts: [
    'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:GRAD,ROND,opsz,slnt,wdth,wght@0..50,0,96,0,72..100,600&display=swap',
    'https://fonts.googleapis.com/css2?family=Alfa+Slab+One:wght@400&display=swap',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap',
  ],
};
const FOUNDATION = MANIFEST.fonts.map((u) => `@import url('${u}');`).join('\n') + '\n:root {\n  --Button-Radius: 4px;\n}\n';
const COMBINED = 'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:GRAD,ROND,opsz,slnt,wdth,wght@0..50,0,96,0,72..100,600'
  + '&family=Alfa+Slab+One:wght@400&family=Poppins:wght@400;600;700&family=Inter:wght@500;600&display=swap';

const fakeFetch = (manifest = MANIFEST) => jest.fn((url) => {
  const body = url.endsWith('theme.json') ? JSON.stringify(manifest)
    : url.endsWith('foundation.css') ? FOUNDATION : `/* ${url} */ :root { --x: 1; }`;
  return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(body) });
});
const INDEX = '<!doctype html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n    <title>Shop</title>\n'
  + '    <script type="module" crossorigin src="/assets/index-abc.js"></script>\n    <link rel="stylesheet" href="/assets/index-abc.css">\n  </head>\n  <body><div id="root"></div></body>\n</html>';
const jsonOf = (html) => JSON.parse(html.match(/<script type="application\/json" id="omni-theme">(.*?)<\/script>/)[1]);

test('combineGoogleFonts: four css2 URLs become one, families verbatim', () => {
  expect(combineGoogleFonts(MANIFEST.fonts)).toEqual([COMBINED]);
});

test('combineGoogleFonts: the same family twice merges its weights; non-css2 passes through', () => {
  expect(combineGoogleFonts([
    'https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
    'https://fonts.googleapis.com/css?family=Roboto',
  ])).toEqual(['https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap', 'https://fonts.googleapis.com/css?family=Roboto']);
});

test('stripFontImports removes only Google Fonts @imports (URLs contain ";")', () => {
  const out = stripFontImports(FOUNDATION + '@import url("other.css");\n');
  expect(out).not.toMatch(/fonts\.googleapis/);
  expect(out).toContain('--Button-Radius: 4px;');
  expect(out).toContain('@import url("other.css");');
});

test('the CLI block links the published files, in order, with preconnects and the head script', async () => {
  const html = await themeLinks(BASE + 'theme.json', { fetch: fakeFetch() });
  const cfg = jsonOf(html);
  expect(cfg).toMatchObject({ v: 1, themeURL: BASE + 'theme.json', name: 'Cocktail Hour', dark: 'system', storageKey: 'omni-dark-mode' });
  expect(cfg.sheets).toEqual({
    foundation: MANIFEST.foundation, core: MANIFEST.core, typography: MANIFEST.typography,
    lightMode: MANIFEST.lightMode, darkMode: MANIFEST.darkMode, base: MANIFEST.base, styles: MANIFEST.styles,
  });
  expect(html).toContain(`<script>${OMNI_HEAD_SCRIPT}</script>`);
  expect(html).toContain('<link rel="preconnect" href="https://storage.test">');
  expect(html).toContain('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  // foundation.css still @imports these, so the SAME addresses are linked (one request each, shared).
  MANIFEST.fonts.forEach((u) => expect(html).toContain(`href="${u.replace(/&/g, '&amp;')}"`));
  // json before script before fonts
  expect(html.indexOf('id="omni-theme"')).toBeLessThan(html.indexOf('<script>'));
});

test('the CLI with --copy writes the sheets, strips the font @imports, and links one font request', async () => {
  const written = {};
  const html = await themeLinks(BASE + 'theme.json', { fetch: fakeFetch(), copyTo: 'public/omni', writeFile: (n, s) => { written[n] = s; } });
  expect(Object.keys(written).sort()).toEqual(['Dark-Mode.css', 'Light-Mode.css', 'base.css', 'core.css', 'foundation.css', 'styles.css', 'typography-tokens.css']);
  expect(written['foundation.css']).not.toMatch(/@import/);
  expect(jsonOf(html).sheets.lightMode).toBe('/omni/Light-Mode.css');
  expect(html).toContain(`href="${COMBINED.replace(/&/g, '&amp;')}"`);
  expect(html.match(/fonts\.googleapis\.com\/css2/g)).toHaveLength(1);
});

test('a system without `fonts` keeps foundation.css as published and adds no font links', async () => {
  const { fonts, ...old } = MANIFEST;
  const written = {};
  const html = await themeLinks(BASE + 'theme.json', { fetch: fakeFetch(old), copyTo: 'x', writeFile: (n, s) => { written[n] = s; } });
  expect(written['foundation.css']).toBe(FOUNDATION);
  expect(html).not.toMatch(/fonts\.googleapis/);
});

test('relative manifest entries resolve against the manifest folder (the package default theme)', async () => {
  const r = await loadThemeManifest('https://cdn.test/pkg/public/styles/theme.json', {
    fetch: jest.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(JSON.stringify({ foundation: 'foundation.css', lightMode: 'Light-Mode.css' })) })),
  });
  expect(r.sheets.foundation).toBe('https://cdn.test/pkg/public/styles/foundation.css');
  expect(r.sheets.core).toBeNull();
});

test('injectIntoHead puts the block before the first stylesheet/script, after meta and title', () => {
  const out = injectIntoHead(INDEX, '<!--OMNI-->');
  expect(out.indexOf('<!--OMNI-->')).toBeGreaterThan(out.indexOf('<title>'));
  expect(out.indexOf('<!--OMNI-->')).toBeLessThan(out.indexOf('<script type="module"'));
});

async function runPlugin(plugin, command) {
  plugin.configResolved({ command, base: '/', build: { assetsDir: 'assets' } });
  const emitted = [];
  const ctx = { emitFile: (f) => emitted.push(f), warn: jest.fn() };
  await plugin.buildStart.call(ctx);
  expect(plugin.transformIndexHtml.order).toBe('post');
  const html = await plugin.transformIndexHtml.handler(INDEX);
  return { html, emitted, ctx };
}

test('vite build with copy: true: the sheets become hashed assets, linked from the head; fonts in one request', async () => {
  const fetch = fakeFetch();
  const { html, emitted } = await runPlugin(omniTheme({ themeURL: BASE + 'theme.json', copy: true, fetch }), 'build');
  expect(emitted.map((e) => e.fileName)).toEqual(expect.arrayContaining([expect.stringMatching(/^assets\/omni-Light-Mode-[0-9a-f]{8}\.css$/)]));
  expect(emitted).toHaveLength(7);
  expect(emitted.find((e) => /omni-foundation-/.test(e.fileName)).source).not.toMatch(/@import/);
  const cfg = jsonOf(html);
  expect(cfg.sheets.lightMode).toMatch(/^\/assets\/omni-Light-Mode-[0-9a-f]{8}\.css$/);
  expect(cfg.sheets.darkMode).toMatch(/^\/assets\/omni-Dark-Mode-[0-9a-f]{8}\.css$/);
  expect(cfg.themeURL).toBe(BASE + 'theme.json');
  expect(html.match(/fonts\.googleapis\.com\/css2/g)).toHaveLength(1);
  expect(html).not.toContain('preconnect" href="https://storage.test"'); // self-hosted: no theme origin
  expect(html.indexOf('id="omni-theme"')).toBeLessThan(html.indexOf('/assets/index-abc.css'));
  expect(fetch.mock.calls.filter(([u]) => u.endsWith('theme.json'))).toHaveLength(1); // fetched once
});

test('the default build is LIVE: links the published files, emits nothing (a re-published system arrives without a rebuild)', async () => {
  const { html, emitted } = await runPlugin(omniTheme({ themeURL: BASE + 'theme.json', fetch: fakeFetch() }), 'build');
  expect(emitted).toHaveLength(0);
  expect(jsonOf(html).sheets.lightMode).toBe(MANIFEST.lightMode);
});

test('vite dev (and copy: false): links the published files, emits nothing', async () => {
  const { html, emitted } = await runPlugin(omniTheme({ themeURL: BASE + 'theme.json', fetch: fakeFetch() }), 'serve');
  expect(emitted).toHaveLength(0);
  expect(jsonOf(html).sheets.lightMode).toBe(MANIFEST.lightMode);
  const off = await runPlugin(omniTheme({ themeURL: BASE + 'theme.json', copy: false, dark: 'light', fetch: fakeFetch() }), 'build');
  expect(off.emitted).toHaveLength(0);
  expect(jsonOf(off.html)).toMatchObject({ dark: 'light' });
});

test('vite: an unreachable theme leaves index.html alone (the provider loads it at runtime)', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const fetch = jest.fn(() => Promise.resolve({ ok: false, status: 503, text: () => Promise.resolve('') }));
  const live = await runPlugin(omniTheme({ themeURL: BASE + 'theme.json', fetch }), 'build');
  expect(live.html).toBe(INDEX);
  expect(console.warn).toHaveBeenCalled();
  const { html, ctx } = await runPlugin(omniTheme({ themeURL: BASE + 'theme.json', copy: true, fetch }), 'build');
  expect(html).toBe(INDEX);
  expect(ctx.warn).toHaveBeenCalled();
  spy.mockRestore();
});

test('buildThemeHead escapes the JSON so it cannot close its <script>', () => {
  const html = buildThemeHead({ sheets: { lightMode: 'x.css' }, name: '</script><b>', fonts: [] }, { themeURL: 't' });
  expect(html).not.toContain('</script><b>');
});

test('omniTheme requires a themeURL', () => {
  expect(() => omniTheme({})).toThrow(/themeURL/);
});
