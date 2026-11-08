/**
 * @omni-design/components/vite — put the design system's theme in index.html
 * at build time, so the first styled paint does not wait for the JavaScript
 * and then for theme.json.
 *
 *   // vite.config.js
 *   import { omniTheme } from '@omni-design/components/vite';
 *   export default defineConfig({
 *     plugins: [react(), omniTheme({ themeURL: THEME_URL })],
 *   });
 *
 * Keep `themeURL={THEME_URL}` on <OmniDesignProvider>: the provider finds the
 * head's theme (same themeURL) and neither fetches theme.json nor refetches a
 * sheet. Remove the plugin and the app still works, the slower way.
 *
 * Default (copy: false) — LIVE: the head links the PUBLISHED sheets, so the CSS
 * downloads in parallel with the JS (no theme.json round trip first) and a
 * system re-published from the studio reaches the site on the next visit,
 * with no rebuild. This is the default because that promise is the product's.
 *
 * `copy: true` — SNAPSHOT, opt-in: `vite build` downloads theme.json and the seven
 * sheets ONCE, writes them into the build as hashed assets
 * (assets/omni-<file>-<hash>.css), takes the Google Fonts @imports out of
 * foundation.css when theme.json lists its fonts, and links every font family
 * in one request. The theme is then served by the app's own host, with its
 * compression and caching. It is a snapshot: re-run the build to pick up a
 * republished system. Choose it when speed matters more than live updates.
 * `vite` dev always links the published files.
 *
 * Node only. No dependencies; Vite is not imported.
 */
import { createHash } from 'crypto';
import {
  OMNI_DARK_MODE_KEY, OMNI_THEME_SCRIPT_ID, manifestURLFor, resolveThemeManifest,
  combineGoogleFonts, stripFontImports, headThemeConfig, themeHeadHTML,
} from '../themeHead';

export { OMNI_HEAD_SCRIPT, OMNI_DEFAULT_THEME_URL, combineGoogleFonts, stripFontImports } from '../themeHead';

const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
const FILE_NAMES = {
  foundation: 'foundation', core: 'core', typography: 'typography-tokens',
  lightMode: 'Light-Mode', darkMode: 'Dark-Mode', base: 'base', styles: 'styles',
};

function getFetch(f) {
  const impl = f || (typeof fetch === 'function' ? fetch : null);
  if (!impl) throw new Error('omni-theme: no fetch() — use Node 18 or newer');
  return impl;
}

async function fetchText(url, fetchImpl) {
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error(`omni-theme: ${url} answered ${res.status}`);
  return res.text();
}

/** theme.json, resolved to absolute sheet URLs. */
export async function loadThemeManifest(themeURL, { fetch: fetchImpl } = {}) {
  const text = await fetchText(manifestURLFor(themeURL), getFetch(fetchImpl));
  return resolveThemeManifest(JSON.parse(text), themeURL);
}

/* A copied sheet no longer sits next to anything it points at with a relative
   url(): make those absolute against where the sheet was published. */
function absolutizeUrls(css, sheetURL) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
    if (/^(data:|https?:|\/\/|\/|#)/i.test(u)) return m;
    try { return `url(${q}${new URL(u, sheetURL).href}${q})`; } catch (e) { return m; }
  });
}

/**
 * Download the theme's sheets. Returns [{ key, name, source }] — `name` is
 * the file's plain name (Light-Mode.css). With the system's fonts listed in
 * theme.json, foundation.css loses its Google Fonts @imports (the head links
 * them instead, in one request); a system published before that field keeps
 * them, and its fonts load exactly as before.
 */
export async function downloadThemeSheets(resolved, { fetch: fetchImpl } = {}) {
  const f = getFetch(fetchImpl);
  const keys = Object.keys(FILE_NAMES).filter((k) => resolved.sheets[k]);
  return Promise.all(keys.map(async (key) => {
    const url = resolved.sheets[key];
    let source = absolutizeUrls(await fetchText(url, f), url);
    if (key === 'foundation' && resolved.fonts.length) source = stripFontImports(source);
    return { key, name: `${FILE_NAMES[key]}.css`, source };
  }));
}

const shortHash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 8);

/**
 * The head block (HTML) for a theme.
 *   sheets   key → URL to link (defaults to the published URLs)
 *   copied   true when `sheets` are copies with the font @imports removed:
 *            fonts are then linked, combined into one request. When false
 *            foundation.css still @imports them, so they are linked under
 *            the SAME addresses (the browser makes one request for both),
 *            which starts them early without adding requests.
 */
export function buildThemeHead(resolved, { themeURL, dark = 'system', storageKey = OMNI_DARK_MODE_KEY, sheets, copied = false } = {}) {
  const config = headThemeConfig(resolved, { themeURL, dark, storageKey, sheets });
  const fonts = resolved.fonts.length ? (copied ? combineGoogleFonts(resolved.fonts) : resolved.fonts) : [];
  const origins = [];
  if (!copied) {
    Object.values(config.sheets).forEach((u) => {
      try { const o = new URL(u).origin; if (!origins.includes(o)) origins.push(o); } catch (e) { /* relative: same origin */ }
    });
  }
  if (fonts.length) FONT_ORIGINS.forEach((o) => { if (!origins.includes(o)) origins.push(o); });
  return themeHeadHTML(config, { fonts, preconnect: origins });
}

/**
 * Insert the block into index.html: after <meta charset>/<title>/etc., before
 * the first stylesheet, script or style in <head>. The head script must run
 * before any other stylesheet — an inline script waits for every stylesheet
 * above it — and the theme's sheets then come before the app's own CSS, so
 * the app's CSS wins a tie.
 */
export function injectIntoHead(html, block) {
  const open = html.search(/<head[^>]*>/i);
  const close = html.search(/<\/head>/i);
  if (open < 0 || close < 0) return html;
  const headStart = html.indexOf('>', open) + 1;
  const inHead = html.slice(headStart, close);
  const first = inHead.search(/<(link|script|style)\b/i);
  const at = first < 0 ? close : headStart + first;
  return html.slice(0, at) + block + '\n    ' + html.slice(at);
}

/**
 * The Vite plugin.
 * @param {object} options
 * @param {string} options.themeURL   the design system's theme.json URL (same as the provider's)
 * @param {boolean} [options.copy=false]  build: self-host a SNAPSHOT of the sheets as hashed assets (re-build to pick up a re-published system). Default: link the live published files
 * @param {'system'|'light'|'dark'} [options.dark='system']  first mode when the visitor has no saved choice
 * @param {string} [options.storageKey='omni-dark-mode']  the provider's persistDarkMode key
 */
export function omniTheme(options = {}) {
  const { themeURL, copy = false, dark = 'system', storageKey = OMNI_DARK_MODE_KEY, fetch: fetchImpl } = options;
  if (!themeURL || typeof themeURL !== 'string') throw new Error('omniTheme: pass { themeURL } — the theme.json URL your OmniDesignProvider uses');
  let isBuild = false;
  let base = '/';
  let assetsDir = 'assets';
  let resolvedP = null;
  let copiedSheets = null; // key → public path, after buildStart
  const resolved = () => (resolvedP = resolvedP || loadThemeManifest(themeURL, { fetch: fetchImpl }));

  return {
    name: 'omni-theme',
    configResolved(config) {
      isBuild = config.command === 'build';
      base = config.base || '/';
      assetsDir = (config.build && config.build.assetsDir) || 'assets';
    },
    async buildStart() {
      if (!isBuild || !copy) return;
      try {
        const r = await resolved();
        const files = await downloadThemeSheets(r, { fetch: fetchImpl });
        copiedSheets = {};
        files.forEach(({ key, name, source }) => {
          const fileName = `${assetsDir}/omni-${name.replace(/\.css$/, '')}-${shortHash(source)}.css`;
          this.emitFile({ type: 'asset', fileName, source });
          copiedSheets[key] = (base.endsWith('/') ? base : base + '/') + fileName;
        });
      } catch (err) {
        copiedSheets = null;
        this.warn(`could not copy the theme (${err.message}) — linking the published files instead`);
      }
    },
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        if (html.includes(`id="${OMNI_THEME_SCRIPT_ID}"`)) return html; // already there (pasted by hand)
        let r;
        try { r = await resolved(); } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`[omni-theme] ${err.message} — the provider will load the theme at runtime`);
          return html;
        }
        const copied = !!(isBuild && copy && copiedSheets);
        const block = buildThemeHead(r, { themeURL, dark, storageKey, copied, sheets: copied ? { ...r.sheets, ...copiedSheets } : undefined });
        return injectIntoHead(html, block);
      },
    },
  };
}

/**
 * What `npx omni-theme-links` prints: the head block for a themeURL, linking
 * the published files. With `copyTo`, writes the sheets into that folder
 * (fonts @imports removed when listed) and links them under `basePath`.
 */
export async function themeLinks(themeURL, { dark = 'system', storageKey = OMNI_DARK_MODE_KEY, copyTo, basePath = '/omni/', fetch: fetchImpl, writeFile } = {}) {
  const r = await loadThemeManifest(themeURL, { fetch: fetchImpl });
  if (!copyTo) return buildThemeHead(r, { themeURL, dark, storageKey });
  const files = await downloadThemeSheets(r, { fetch: fetchImpl });
  const sheets = {};
  const prefix = basePath.endsWith('/') ? basePath : basePath + '/';
  for (const { key, name, source } of files) {
    await writeFile(name, source);
    sheets[key] = prefix + name;
  }
  return buildThemeHead(r, { themeURL, dark, storageKey, copied: true, sheets: { ...r.sheets, ...sheets } });
}

export default omniTheme;
