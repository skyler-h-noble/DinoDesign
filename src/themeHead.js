/**
 * The theme in the page's <head> — shared by OmniDesignProvider (browser) and
 * the build helpers (`@omni-design/components/vite`, `npx omni-theme-links`).
 *
 * Why this exists: with `themeURL` alone the page waits on four network stages
 * in a row before it can paint styled — HTML, the JS bundle, theme.json, then
 * the six theme sheets (and the Google Fonts CSS that foundation.css
 * @imports). Putting the sheets in the HTML takes theme.json and the JS off
 * that path: the browser fetches the CSS in parallel with the JS.
 *
 * What goes in the head (in this order, before any other stylesheet or script):
 *
 *   1. <script type="application/json" id="omni-theme">  — the resolved
 *      manifest: every sheet's URL, the system's name and defaults, and how
 *      the first mode is picked. The provider reads it instead of fetching
 *      theme.json.
 *   2. <script> OMNI_HEAD_SCRIPT </script> — a constant inline script. It
 *      picks light or dark BEFORE first paint (saved choice, else the device
 *      setting when `dark: 'system'`), marks <html data-omni-mode>, and adds
 *      the six sheets as <link id="omni-…" blocking="render"> in cascade
 *      order. One script adds all six because the mode sheet sits in the
 *      MIDDLE of the cascade (foundation → core → typography → MODE → base →
 *      styles): an inline script placed between parser <link>s would wait for
 *      the sheets above it to download before it could run.
 *   3. One Google Fonts stylesheet (all families in one css2 URL), when the
 *      sheets are self-hosted with the font @imports taken out of
 *      foundation.css.
 *
 * Nothing here imports React or touches the DOM at module load.
 */

/* The package's own theme — the OmniDesign look — served from npm through
   jsdelivr and pinned to the installed version, so the CSS always matches the
   components. The version is written in at build time; source builds (the
   gallery, tests) fall back to @latest. Exported from the package root and
   from @omni-design/components/vite. */
/* global __OMNI_VERSION__ */
const OMNI_VERSION = typeof __OMNI_VERSION__ !== 'undefined' ? __OMNI_VERSION__ : 'latest';
export const OMNI_DEFAULT_THEME_URL =
  'https://cdn.jsdelivr.net/npm/@omni-design/components@' + OMNI_VERSION + '/public/styles/theme.json';

export const OMNI_TAG_IDS = {
  foundation: 'omni-foundation',
  core:       'omni-core',
  typography: 'omni-typography',
  mode:       'omni-mode',
  base:       'omni-base',
  styles:     'omni-styles',
};

/** id of the <script type="application/json"> that carries the head theme. */
export const OMNI_THEME_SCRIPT_ID = 'omni-theme';

/** localStorage key the provider's `persistDarkMode` uses by default. */
export const OMNI_DARK_MODE_KEY = 'omni-dark-mode';

/** The sheet slots a manifest names, in cascade order. */
export const OMNI_SHEET_KEYS = ['foundation', 'core', 'typography', 'lightMode', 'darkMode', 'base', 'styles'];

/** theme.json URL for a themeURL: a .json URL is used as is; anything else
 *  is a folder holding theme.json. */
export function manifestURLFor(themeURL) {
  return /\.json(\?|$)/.test(themeURL) ? themeURL : `${themeURL.replace(/\/$/, '')}/theme.json`;
}

/**
 * Turn a parsed theme.json into absolute sheet URLs plus its config. A full
 * URL passes through; a bare file name is joined to the manifest's folder.
 * Shared by the provider's fetch and the build helpers, so both resolve a
 * manifest the same way.
 */
export function resolveThemeManifest(manifest, themeURL) {
  const base = String(themeURL).replace(/\/$/, '').replace(/\/theme\.json(\?.*)?$/, '');
  const resolve = (value) => {
    if (!value || typeof value !== 'string') return null;
    if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
    return `${base}/${value}`;
  };
  const m = manifest || {};
  return {
    sheets: {
      foundation: resolve(m.foundation),
      core:       resolve(m.core),
      typography: resolve(m.typography),
      lightMode:  resolve(m.lightMode),
      darkMode:   resolve(m.darkMode),
      base:       resolve(m.base),
      styles:     resolve(m.styles),
    },
    name:           m.name           ?? null,
    defaultTheme:   m.defaultTheme   ?? null,
    defaultStyle:   m.defaultStyle   ?? null,
    defaultSurface: m.defaultSurface ?? null,
    // Google Fonts only: anything else in the list is ignored.
    fonts: Array.isArray(m.fonts)
      ? m.fonts.filter((u) => typeof u === 'string' && /^https:\/\/fonts\.googleapis\.com\//.test(u))
      : [],
  };
}

/* ── Google Fonts ─────────────────────────────────────────────────────────── */

/* "Inter:wght@500;600" → { name: 'Inter', axes: 'wght', tuples: ['500','600'] } */
function parseFamily(spec) {
  const at = spec.indexOf(':');
  if (at < 0) return { name: spec, axes: null, tuples: null };
  const [axes, values] = spec.slice(at + 1).split('@');
  return { name: spec.slice(0, at), axes, tuples: values ? values.split(';') : null };
}

/**
 * Every css2 family in ONE request. A system names its families as separate
 * URLs (one per role); each is its own request to fonts.googleapis.com, and
 * Google builds each response on demand. Families are kept verbatim — axis
 * ranges included — so the faces served are the same. The same family named
 * twice with the same axes is merged (its value lists unioned); with
 * different axes it cannot share a URL, so it goes in a second one. URLs that
 * are not css2 pass through untouched.
 */
export function combineGoogleFonts(urls) {
  const groups = [[]];
  const other = [];
  const seen = new Set();
  let display = null;
  (urls || []).forEach((url) => {
    if (typeof url !== 'string') return;
    const q = url.indexOf('?');
    if (!/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(url) || q < 0) { if (!seen.has(url)) { seen.add(url); other.push(url); } return; }
    url.slice(q + 1).split('&').forEach((part) => {
      if (part.startsWith('display=')) { display = display || part.slice(8); return; }
      if (!part.startsWith('family=')) return;
      const fam = parseFamily(part.slice(7));
      for (const group of groups) {
        const same = group.find((f) => f.name === fam.name);
        if (!same) { group.push(fam); return; }
        if (same.axes === fam.axes && same.tuples && fam.tuples) {
          fam.tuples.forEach((t) => { if (!same.tuples.includes(t)) same.tuples.push(t); });
          same.tuples.sort((a, b) => parseFloat(a) - parseFloat(b) || (a < b ? -1 : 1));
          return;
        }
        if (same.axes === fam.axes && !same.tuples && !fam.tuples) return;
      }
      groups.push([fam]);
    });
  });
  const css2 = groups.filter((g) => g.length).map((g) => 'https://fonts.googleapis.com/css2?'
    + g.map((f) => 'family=' + f.name + (f.axes ? ':' + f.axes + (f.tuples ? '@' + f.tuples.join(';') : '') : '')).join('&')
    + '&display=' + (display || 'swap'));
  return css2.concat(other);
}

/**
 * foundation.css @imports its Google Fonts. That @import makes the sheet's
 * load wait on Google's CSS, and fetches each family separately. Once the
 * fonts are linked from the head (one combined request) the @imports are
 * redundant. Only Google Fonts @imports are removed; nothing else changes.
 */
export function stripFontImports(css) {
  /* The URL itself contains ';' (wght@400;600), so match up to the closing
     paren or quote, not the first semicolon. */
  return String(css)
    .replace(/@import\s+url\(\s*(['"]?)https:\/\/fonts\.googleapis\.com\/[^)'"]*\1\s*\)[^;\n]*;[ \t]*\r?\n?/g, '')
    .replace(/@import\s+(['"])https:\/\/fonts\.googleapis\.com\/[^'"]*\1[^;\n]*;[ \t]*\r?\n?/g, '');
}

/* ── The inline script ────────────────────────────────────────────────────── */

/**
 * Constant — the same bytes for every design system, so a Content-Security-
 * Policy hash for it never changes. Reads #omni-theme, picks the mode the way
 * the provider does (saved 'dark'/'light' under storageKey wins; otherwise the
 * device setting when dark === 'system', else dark === 'dark'), records it on
 * <html data-omni-mode>, and adds the six sheets in cascade order.
 *
 * blocking="render" keeps a script-added sheet render-blocking where it is
 * supported (Chromium). Elsewhere the provider keeps the app hidden until the
 * sheets have loaded, as it does with themeURL.
 */
export const OMNI_HEAD_SCRIPT = "(function(){var d=document,r=d.documentElement,c,s=null,k=false;"
  + "try{c=JSON.parse(d.getElementById('" + OMNI_THEME_SCRIPT_ID + "').textContent)}catch(e){return}"
  + "try{s=localStorage.getItem(c.storageKey||'" + OMNI_DARK_MODE_KEY + "')}catch(e){}"
  + "if(s==='dark')k=true;else if(s!=='light'){if(c.dark==='system'){try{k=matchMedia('(prefers-color-scheme: dark)').matches}catch(e){}}else k=c.dark==='dark'}"
  + "r.setAttribute('data-omni-mode',k?'dark':'light');"
  + "var h=c.sheets||{},p=[['foundation','foundation'],['core','core'],['typography','typography'],['mode',k?'darkMode':'lightMode'],['base','base'],['styles','styles']];"
  + "for(var i=0;i<p.length;i++){var u=h[p[i][1]],id='omni-'+p[i][0];if(!u||d.getElementById(id))continue;"
  + "var l=d.createElement('link');l.id=id;l.rel='stylesheet';l.setAttribute('blocking','render');l.setAttribute('data-omni','head');l.href=u;d.head.appendChild(l)}})();";

/** The JSON the head carries (and the provider reads). */
export function headThemeConfig(resolved, { themeURL, dark = 'system', storageKey = OMNI_DARK_MODE_KEY, sheets } = {}) {
  return {
    v: 1,
    themeURL: themeURL || null,
    name: resolved.name ?? null,
    defaultTheme: resolved.defaultTheme ?? null,
    defaultStyle: resolved.defaultStyle ?? null,
    defaultSurface: resolved.defaultSurface ?? null,
    dark,
    storageKey,
    sheets: sheets || resolved.sheets,
  };
}

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
/* JSON inside <script>: "</script>" or "<!--" must not appear. */
const escJSON = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

/**
 * The head block as HTML — what the Vite plugin injects and the CLI prints.
 *   config      headThemeConfig(...)
 *   fonts       stylesheet URLs to link (render-blocking, like the @import
 *               they replace)
 *   preconnect  origins to open early (the theme host, Google Fonts)
 */
export function themeHeadHTML(config, { fonts = [], preconnect = [] } = {}) {
  const lines = [];
  preconnect.forEach((o) => lines.push(`<link rel="preconnect" href="${escAttr(o)}"${/gstatic/.test(o) || o.crossorigin ? ' crossorigin' : ''}>`));
  lines.push(`<script type="application/json" id="${OMNI_THEME_SCRIPT_ID}">${escJSON(config)}</script>`);
  lines.push(`<script>${OMNI_HEAD_SCRIPT}</script>`);
  fonts.forEach((f) => lines.push(`<link rel="stylesheet" href="${escAttr(f)}" data-omni="font">`));
  return lines.join('\n');
}

/* ── Browser side: what the provider reads ───────────────────────────────── */

/** The #omni-theme config in this document, or null. */
export function readHeadTheme(doc = typeof document !== 'undefined' ? document : null) {
  if (!doc) return null;
  const el = doc.getElementById(OMNI_THEME_SCRIPT_ID);
  if (!el) return null;
  try {
    const c = JSON.parse(el.textContent || '');
    return c && typeof c === 'object' && c.sheets ? c : null;
  } catch (e) { return null; }
}

/** 'dark' | 'light' as the head script chose it, or null when it did not run. */
export function readHeadMode(doc = typeof document !== 'undefined' ? document : null) {
  const v = doc && doc.documentElement ? doc.documentElement.getAttribute('data-omni-mode') : null;
  return v === 'dark' || v === 'light' ? v : null;
}

/** Same address once resolved against the page ("/a.css" vs "https://x/a.css"). */
export function sameURL(a, b) {
  if (!a || !b) return false;
  try {
    const base = typeof document !== 'undefined' ? document.baseURI : 'http://localhost/';
    return new URL(a, base).href === new URL(b, base).href;
  } catch (e) { return a === b; }
}
