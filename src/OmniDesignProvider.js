/**
 * OmniDesignProvider
 *
 * Wires the full OmniDesign token cascade into any React app.
 *
 * ── Two ways to provide CSS ───────────────────────────────────────────────────
 *
 * 1. SIMPLE — single themeURL (recommended):
 *
 *   <OmniDesignProvider
 *     themeURL="https://themes.omnidesign.com/acme-corp"
 *     defaultTheme="Default"
 *     defaultStyle="Modern"
 *   >
 *
 *   The Provider fetches {themeURL}/theme.json to discover the CSS files,
 *   then loads them in the correct order automatically.
 *
 * 2. MANUAL — individual CSS props (local dev / custom setups):
 *
 *   <OmniDesignProvider
 *     foundationCSS="/styles/foundation.css"
 *     coreCSS="/styles/core.css"
 *     typographyCSS="/styles/typography-tokens.css"
 *     lightModeCSS="/styles/Light-Mode.css"
 *     darkModeCSS="/styles/Dark-Mode.css"
 *     baseCSS="/styles/base.css"
 *     stylesCSS="/styles/styles.css"
 *     defaultTheme="Default"
 *     defaultStyle="Modern"
 *   >
 *
 * ── theme.json format ─────────────────────────────────────────────────────────
 *
 *   {
 *     "foundation": "foundation.css",
 *     "core": "core.css",
 *     "typography": "typography-tokens.css",   // optional
 *     "lightMode": "Light-Mode.css",
 *     "darkMode": "Dark-Mode.css",
 *     "base": "base.css",
 *     "styles": "styles.css",
 *     "defaultTheme": "Default",
 *     "defaultStyle": "Modern",
 *     "defaultSurface": "Surface"
 *   }
 *
 *   A "darkTheme" field in theme.json is ignored (see fetchThemeManifest).
 *
 *   All fields are optional — only include the files you have.
 *   Props passed directly to the Provider always override theme.json values.
 *
 * ── CSS load order ────────────────────────────────────────────────────────────
 *   1. foundation.css  — primitives
 *   2. core.css        — component base styles
 *   3. typography-tokens.css — platform type ramps (optional)
 *   4. Light-Mode.css  OR Dark-Mode.css  (one at a time, swaps on toggle)
 *   5. base.css        — data-style / data-surface rules
 *   6. styles.css      — final overrides
 *
 * ── How CSS is loaded ─────────────────────────────────────────────────────────
 *   URL sources (the common production case) load as <link rel="stylesheet">
 *   tags. The browser fetches them in parallel, caches them, and blocks paint
 *   until they apply — no flash of unbranded styling.
 *
 *   Raw CSS strings (local dev, custom setups) load as <style> tags.
 *
 *   While loading, the Provider wrapper carries data-omni-css="loading" and is
 *   visibility:hidden — once every sheet resolves it flips to "ready" and
 *   becomes visible. Error state stays visible so the consumer can render
 *   a fallback.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { chartColorVisionCSS } from './components/Charts/colorVision';
import { OmniLinkContext } from './components/_routerLink';

// ─── Context ──────────────────────────────────────────────────────────────────

const OmniDesignContext = createContext(null);

// ─── Valid values ─────────────────────────────────────────────────────────────

/* Nine themes plus the three bars. The -Light / -Medium / -Dark shades are
 * gone: a shade and a surface level were two ways of saying one thing, and the
 * surface ladder already walks that axis — `theme="Primary"
 * surface="Surface-Brightest"` is what `theme="Primary-Light"` used to be.
 *
 * This list had kept all 24, so anything driven by it — a theme picker, a
 * validation check — offered fifteen names a generated design system does not
 * define. They bind nothing and paint the parent's palette, which reads as the
 * picker being broken rather than the name being dead. */
export const OMNI_THEMES = [
  'Default',
  'Primary', 'Secondary', 'Tertiary', 'Neutral',
  'Info', 'Success', 'Warning', 'Error',
  'App-Bar', 'Nav-Bar', 'Status',
];

export const OMNI_STYLES = ['Professional', 'Modern', 'Bold', 'Playful'];

/* The package's own theme — the OmniDesign look — served from npm through
   jsdelivr and pinned to the installed version, so the CSS always matches the
   components. Without SOME design-system CSS the components render as bare
   HTML, and the files under public/styles are not loaded on their own:

     <OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL}>

   A real design system passes its own themeURL (or the individual CSS props)
   instead. The version is written in at build time; source builds (the
   gallery, tests) fall back to @latest. */
/* global __OMNI_VERSION__ */
const OMNI_VERSION = typeof __OMNI_VERSION__ !== 'undefined' ? __OMNI_VERSION__ : 'latest';
export const OMNI_DEFAULT_THEME_URL =
  'https://cdn.jsdelivr.net/npm/@omni-design/components@' + OMNI_VERSION + '/public/styles/theme.json';

export const OMNI_SURFACES = [
  // Five surface levels, darkest to lightest. Surface-Dimmest and
  // Surface-Brightest are the ends of the ramp: Brightest is the level that
  // replaced the <Palette>-Light themes, so `theme="Primary"
  // surface="Surface-Brightest"` is what `theme="Primary-Light"` used to be.
  'Surface-Dimmest', 'Surface-Dim', 'Surface', 'Surface-Bright', 'Surface-Brightest',
  'Container', 'Container-Low', 'Container-Lowest',
  'Container-High', 'Container-Highest',
];

export const SURFACE_STYLE_THEME_MAP = {
  // Primary at its brightest surface — what theme:'Primary-Light' used to mean,
  // and the only form generated design systems actually define.
  'light-tonal':       { theme: 'Primary',        rootSurface: 'Surface-Brightest' },
  'grey-professional': { theme: 'Neutral',        rootSurface: 'Surface'     },
  // The mirror of light-tonal: same palette, the other end of the ramp. What
  // theme:'Neutral-Dark' used to mean, and the only form that is defined.
  'dark-professional': { theme: 'Neutral',        rootSurface: 'Surface-Dimmest' },
};

// ─── Style tag IDs ────────────────────────────────────────────────────────────
//
//   #omni-foundation  (1st)
//   #omni-core        (2nd)
//   #omni-typography  (3rd) ← platform type ramps; must follow core
//   #omni-mode        (4th) ← swaps between light/dark
//   #omni-base        (5th)
//   #omni-styles      (6th) ← always last

const TAG = {
  foundation: 'omni-foundation',
  core:       'omni-core',
  typography: 'omni-typography',
  mode:       'omni-mode',
  base:       'omni-base',
  styles:     'omni-styles',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Detect whether a CSS source is a URL or a raw CSS string. URLs load via
 * <link rel="stylesheet"> (render-blocking, browser-cached, no FOUC); raw
 * strings load via <style> (the only option for inline CSS).
 */
function isURL(source) {
  if (!source || typeof source !== 'string') return false;
  return source.startsWith('http')
      || source.startsWith('/')
      || source.endsWith('.css');
}

/**
 * Insert a <link rel="stylesheet"> for a URL source. Returns a Promise that
 * resolves when the stylesheet has loaded (so we can flip cssStatus to
 * 'ready' only after every brand sheet is actually applied — avoiding the
 * Provider-default-then-brand flicker that the fetch+<style> path causes).
 *
 * `beforeId` controls cascade order: pass the id of the tag that should come
 * AFTER this one. The lib's order is foundation → core → mode → base → styles,
 * and CSS variable resolution depends on it.
 */
function injectLinkTag(id, href, beforeId) {
  const existing = document.getElementById(id);
  if (existing) {
    /* Compare RESOLVED addresses: a link already in the page's HTML says
       "/styles/core.css" where the manifest resolves to the full URL. Read as
       text they differ, the href was swapped, and the browser fetched the
       same sheet twice. */
    const same = (a, b) => { try { return new URL(a, document.baseURI).href === new URL(b, document.baseURI).href; } catch (e) { return a === b; } };
    if (existing.tagName === 'LINK' && !same(existing.getAttribute('href'), href)) {
      // Swap href in place — browser refetches. Use the existing onload so
      // callers can still await readiness on a mode swap.
      return new Promise((resolve, reject) => {
        existing.onload = () => resolve(existing);
        existing.onerror = () => reject(new Error(`OmniDesignProvider: failed to load ${href}`));
        existing.setAttribute('href', href);
      });
    }
    return Promise.resolve(existing);
  }
  return new Promise((resolve, reject) => {
    const tag = document.createElement('link');
    tag.id = id;
    tag.rel = 'stylesheet';
    tag.setAttribute('data-omni', 'true');
    tag.onload = () => resolve(tag);
    tag.onerror = () => reject(new Error(`OmniDesignProvider: failed to load ${href}`));
    tag.href = href;
    const before = beforeId ? document.getElementById(beforeId) : null;
    if (before) {
      document.head.insertBefore(tag, before);
    } else {
      document.head.appendChild(tag);
    }
  });
}

/**
 * Insert an inline <style> for a raw CSS string. Used only when the consumer
 * passes raw CSS (not a URL) — most production use cases are URLs and go
 * through injectLinkTag.
 */
function injectStyleTag(id, css, beforeId) {
  if (!css) return Promise.resolve(null);
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = css;
    return Promise.resolve(existing);
  }
  const tag = document.createElement('style');
  tag.id = id;
  tag.setAttribute('data-omni', 'true');
  tag.textContent = css;
  const before = beforeId ? document.getElementById(beforeId) : null;
  if (before) {
    document.head.insertBefore(tag, before);
  } else {
    document.head.appendChild(tag);
  }
  return Promise.resolve(tag);
}

function removeStyleTag(id) {
  document.getElementById(id)?.remove();
}

/**
 * Load a CSS source into the document at the position specified by beforeId.
 * Routes to <link> for URLs (no fetch round-trip; browser handles caching)
 * and <style> for raw CSS strings.
 */
function loadCSSSource(id, source, beforeId) {
  if (!source) return Promise.resolve(null);
  if (isURL(source)) return injectLinkTag(id, source, beforeId);
  return injectStyleTag(id, source, beforeId);
}

/**
 * Fetch and parse theme.json from a themeURL.
 * Returns an object with resolved absolute URLs for each CSS file.
 *
 * @param {string} themeURL  — base URL, e.g. "https://themes.omnidesign.com/acme-corp"
 * @returns {Promise<object>} — { foundationURL, coreURL, lightModeURL, darkModeURL,
 *                                baseURL, stylesURL, defaultTheme, defaultStyle,
 *                                defaultSurface, darkTheme }
 */
async function fetchThemeManifest(themeURL) {
  // If themeURL already points to a .json file (e.g. a Firebase Storage URL), use it directly.
  // Otherwise treat it as a folder and append /theme.json (legacy path-based hosting).
  const isManifestUrl = /\.json(\?|$)/.test(themeURL);
  const manifestURL = isManifestUrl ? themeURL : `${themeURL.replace(/\/$/, '')}/theme.json`;
  // Folder base (used only for path-based fallback when manifest values are relative filenames)
  const base = themeURL.replace(/\/$/, '').replace(/\/theme\.json(\?.*)?$/, '');

  const res = await fetch(manifestURL);
  if (!res.ok) {
    throw new Error(`OmniDesignProvider: could not load theme manifest from ${manifestURL} (${res.status})`);
  }

  const manifest = await res.json();

  // Resolve each manifest entry. If it's already a full URL, pass it through unchanged.
  // Otherwise, treat it as a relative filename and join it with the folder base.
  const resolve = (value) => {
    if (!value) return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `${base}/${value}`;
  };

  return {
    foundationURL:  resolve(manifest.foundation),
    coreURL:        resolve(manifest.core),
    typographyURL:  resolve(manifest.typography),
    lightModeURL:   resolve(manifest.lightMode),
    darkModeURL:    resolve(manifest.darkMode),
    baseURL:        resolve(manifest.base),
    stylesURL:      resolve(manifest.styles),
    // Theme config from manifest (props override these)
    defaultTheme:   manifest.defaultTheme   ?? null,
    defaultStyle:   manifest.defaultStyle   ?? null,
    defaultSurface: manifest.defaultSurface ?? null,
    /* darkTheme is NOT read from theme.json. The studio wrote
       "darkTheme": "Neutral" into every published system — a hard-coded
       value, not the designer's choice — and obeying it switched the root
       from Default to Neutral in dark mode. That bypassed the Default theme,
       which is what carries the chosen page background into dark mode (its
       own palette at tone 2), so a Primary-background system went neutral.
       A darkTheme passed as a PROP is still honored: that is a developer's
       explicit choice. Published files are frozen, so this is fixed here. */
    darkTheme:      null,
    // Human-readable design system name — surfaced on the context so consumers
    // (AppBar brand, page headers, etc.) can display it.
    name:           manifest.name           ?? null,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * @param {object}   props
 *
 * Theme URL (simplest — recommended for production):
 * @param {string}   props.themeURL          Base URL of the theme folder.
 *                                           Must contain a theme.json manifest.
 *                                           e.g. "https://themes.omnidesign.com/acme-corp"
 *
 * Individual CSS props (manual / local dev):
 * @param {string}   props.foundationCSS     foundation.css (URL or raw string)
 * @param {string}   props.coreCSS           core.css
 * @param {string}   props.typographyCSS     typography-tokens.css
 * @param {string}   props.lightModeCSS      Light-Mode.css
 * @param {string}   props.darkModeCSS       Dark-Mode.css
 * @param {string}   props.baseCSS           base.css
 * @param {string}   props.stylesCSS         styles.css (loaded last)
 *
 * Theme config (props override theme.json values):
 * @param {string}   props.defaultTheme      Starting data-theme   (default: 'Default')
 * @param {string}   props.defaultStyle      Starting data-style   (default: 'Modern')
 * @param {string}   props.defaultSurface    Root data-surface     (default: 'Surface')
 * @param {string}   props.surfaceStyle      'light-tonal' | 'grey-professional' | 'dark-professional'
 *
 * Dark mode — uncontrolled:
 * @param {boolean|'system'} props.defaultDarkMode  Initial dark mode (default: false).
 *                                           'system' follows the device's light/dark
 *                                           setting, live, until the user toggles.
 * @param {boolean|string} props.persistDarkMode  Remember the user's toggle in
 *                                           localStorage (true = key 'omni-dark-mode',
 *                                           or pass a key). Restored on the next visit.
 * @param {string}   props.darkTheme         data-theme in dark mode (default: none — the
 *                                           root keeps its theme; Default carries the
 *                                           page background into dark mode itself)
 *
 * Dark mode — controlled:
 * @param {boolean}  props.darkMode
 * @param {function} props.onDarkModeChange
 *
 * Client-side routing (see components/_routerLink.js):
 * @param {React.ElementType} props.linkComponent  The router's link (react-router's
 *                                           `Link`, Next's `Link`). Internal hrefs on
 *                                           Button, Card, Link, Tab, … render through it.
 * @param {(href: string, event: React.MouseEvent) => void} props.navigate  Called on a plain left
 *                                           click of an internal link when there is no
 *                                           linkComponent.
 *
 * DOM:
 * @param {string}   props.className
 * @param {object}   props.style
 * @param {boolean}  props.fullHeight        Adds minHeight: 100vh (default: true)
 * @param {React.ReactNode} props.children
 */
/* Storage can throw (private mode, blocked site data): treat that as "no
   saved choice" rather than failing the render. */
function readDarkPref(key) {
  try {
    const v = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    return v === 'dark' ? true : v === 'light' ? false : null;
  } catch { return null; }
}
function writeDarkPref(key, dark) {
  try { window.localStorage.setItem(key, dark ? 'dark' : 'light'); } catch { /* not saved */ }
}
function systemPrefersDark() {
  try { return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  catch { return false; }
}

export function OmniDesignProvider({
  // Theme URL
  themeURL,

  // Individual CSS (manual / local dev)
  foundationCSS,
  coreCSS,
  typographyCSS,
  lightModeCSS,
  darkModeCSS,
  baseCSS,
  stylesCSS,

  // Theme config
  defaultTheme:   defaultThemeProp   = 'Default',
  defaultStyle:   defaultStyleProp   = 'Modern',
  defaultSurface: defaultSurfaceProp = 'Surface',
  surfaceStyle,

  // Dark mode
  defaultDarkMode = false,
  /* null, not 'Neutral'.
     This defaulted to 'Neutral' and activeTheme applied it unconditionally in
     dark mode, so the whole app became data-theme="Neutral" the moment dark
     was switched on — and Neutral is the ONE palette that is light in dark
     mode. Figma: Neutral/Dark-Mode/Surface is #cccccc. That is the grey.
     It also discarded the chosen theme: pick Primary, switch to dark, get
     Neutral. The architecture doc says the opposite — "the theme carries over,
     the tone does not" — because the MODE is carried by the stylesheet
     (Light-Mode.css vs Dark-Mode.css), not by swapping palettes.
     The prop stays as an opt-in escape hatch for a brand that genuinely wants
     a different palette in dark; it simply no longer fires by default. */
  darkTheme:      darkThemeProp = null,

  persistDarkMode = false,

  // Controlled dark mode
  darkMode: controlledDarkMode,
  onDarkModeChange,


  // DOM
  className,
  style: styleProp,
  fullHeight = true,

  // Client-side routing
  linkComponent,
  navigate,

  children,
}) {

  // ── Dark mode ──────────────────────────────────────────────────────────────
  /* Uncontrolled dark mode can follow the device and remember the user's
     choice. Both are opt-in: a provider nested inside an app (a preview, a
     themed sub-tree) must not pick up the OS setting or share a stored choice
     it never offered. A saved choice wins over the device; until the user
     toggles, 'system' tracks the device live. Read synchronously so the first
     paint is already in the right mode. */
  const isControlled = controlledDarkMode !== undefined;
  const storageKey = persistDarkMode === true ? 'omni-dark-mode'
    : (typeof persistDarkMode === 'string' && persistDarkMode ? persistDarkMode : null);
  const followSystem = defaultDarkMode === 'system';
  const [internalDark, setInternalDark] = useState(() => {
    const saved = storageKey ? readDarkPref(storageKey) : null;
    if (saved !== null) return saved;
    if (followSystem) return systemPrefersDark();
    return defaultDarkMode === true;
  });
  const userChoseRef = useRef(storageKey ? readDarkPref(storageKey) !== null : false);
  const isDark = isControlled ? controlledDarkMode : internalDark;

  useEffect(() => {
    if (isControlled || !followSystem || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => { if (!userChoseRef.current) setInternalDark(e.matches); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    };
  }, [isControlled, followSystem]);

  // ── Resolved CSS sources ───────────────────────────────────────────────────
  // When themeURL is provided, manifest values fill in anything not passed as props.
  const [resolvedSources, setResolvedSources] = useState({
    foundation: foundationCSS ?? null,
    core:       coreCSS       ?? null,
    typography: typographyCSS ?? null,
    lightMode:  lightModeCSS  ?? null,
    darkMode:   darkModeCSS   ?? null,
    base:       baseCSS       ?? null,
    styles:     stylesCSS     ?? null,
  });

  // Theme config — may be overridden by manifest values
  const [manifestThemeConfig, setManifestThemeConfig] = useState({});

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── EFFECT: Fetch manifest if themeURL provided ────────────────────────────
  useEffect(() => {
    if (!themeURL) return;

    setCssStatus('loading');

    fetchThemeManifest(themeURL)
      .then(manifest => {
        if (!mountedRef.current) return;

        // Individual CSS props always take precedence over manifest
        setResolvedSources({
          foundation: foundationCSS ?? manifest.foundationURL,
          core:       coreCSS       ?? manifest.coreURL,
          typography: typographyCSS ?? manifest.typographyURL,
          lightMode:  lightModeCSS  ?? manifest.lightModeURL,
          darkMode:   darkModeCSS   ?? manifest.darkModeURL,
          base:       baseCSS       ?? manifest.baseURL,
          styles:     stylesCSS     ?? manifest.stylesURL,
        });

        // Store manifest theme config — props will override in render
        setManifestThemeConfig({
          defaultTheme:   manifest.defaultTheme,
          defaultStyle:   manifest.defaultStyle,
          defaultSurface: manifest.defaultSurface,
          darkTheme:      manifest.darkTheme,
          name:           manifest.name,
        });
      })
      .catch(err => {
        if (!mountedRef.current) return;
        console.error('OmniDesignProvider: manifest error:', err);
        setCssError(err.message);
        setCssStatus('error');
      });

  }, [themeURL]);

  // ── Theme / style / surface ────────────────────────────────────────────────
  // Priority: prop → manifest → default
  const resolvedDefaultTheme = surfaceStyle
    ? (SURFACE_STYLE_THEME_MAP[surfaceStyle]?.theme ?? defaultThemeProp)
    : (defaultThemeProp !== 'Default' ? defaultThemeProp : (manifestThemeConfig.defaultTheme ?? defaultThemeProp));

  const resolvedDefaultSurface = surfaceStyle
    ? (SURFACE_STYLE_THEME_MAP[surfaceStyle]?.rootSurface ?? defaultSurfaceProp)
    : (manifestThemeConfig.defaultSurface ?? defaultSurfaceProp);

  const resolvedDefaultStyle = manifestThemeConfig.defaultStyle ?? defaultStyleProp;
  const resolvedDarkTheme    = darkThemeProp ?? manifestThemeConfig.darkTheme ?? null;

  const [theme,        setThemeState]   = useState(resolvedDefaultTheme);
  const [styleVariant, setStyleVariant] = useState(resolvedDefaultStyle);
  const [rootSurface,  setRootSurface]  = useState(resolvedDefaultSurface);

  // ── CSS status ─────────────────────────────────────────────────────────────
  // 'loading' while sheets are in flight, 'ready' after they apply, 'error' on
  // a load failure. Initial value is 'ready' when the consumer passes neither
  // a themeURL nor any individual CSS prop — that case means they're using
  // the Provider only for theme-context (no brand sheets to load), so the
  // hide-during-load rule shouldn't keep the page invisible forever.
  /* Only the sheets the CURRENT mode needs make the page wait. The other
     mode's sheet loads on toggle (and is prefetched), so passing just
     darkModeCSS — light theme bundled in the app's own CSS — must not hide a
     page that is already styled. A prerendered page depends on this: hidden
     until JavaScript runs, it would paint no earlier than an unrendered one. */
  const hasAnyCSSSource = !!(
    themeURL || foundationCSS || coreCSS || typographyCSS || baseCSS || stylesCSS
      || (isDark ? darkModeCSS : lightModeCSS)
  );
  const [cssStatus, setCssStatus] = useState(hasAnyCSSSource ? 'loading' : 'ready');
  const [cssError,  setCssError]  = useState(null);

  /* Phone and tablet type ramps come from the theme's CSS by screen width
     (@media … :root:not([data-device])) — the browser applies them as the
     sheet parses. The provider used to set data-device from JavaScript, which
     painted desktop type first and resized every heading after. data-device
     is for an app that wants to pin a device (and for Figma's device modes),
     not something the provider sets. */


  // ── DEV WARNING: no design-system CSS anywhere on the page ────────────────
  // Passing no CSS is legitimate when the app injects its own sheets (the
  // studio does), so the check is for the TOKENS, not the props: if no body
  // font token resolves once the page has settled, nothing loaded one.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || hasAnyCSSSource) return undefined;
    const t = setTimeout(() => {
      const font = getComputedStyle(document.documentElement).getPropertyValue('--Font-Family-Body');
      if (!font.trim()) {
        // eslint-disable-next-line no-console
        console.warn('[OmniDesignProvider] No design-system CSS is loaded, so components render unstyled. '
          + 'Pass your design system\'s themeURL, or the package default: '
          + '<OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL}>.');
      }
    }, 1500);
    return () => clearTimeout(t);
  }, []);


  // ── EFFECT: Inject static CSS (foundation, core, base, styles) ────────────
  // Injects each sheet in its correct cascade slot. URLs become <link> tags
  // (browser-cached, render-blocking — no flash); raw CSS strings become
  // <style> tags. The mode sheet's slot (#omni-mode) sits between core and
  // base; we anchor base/styles after it by passing the right beforeId so
  // the order stays foundation → core → mode → base → styles regardless of
  // which sheet resolves first.
  useEffect(() => {
    const { foundation, core, typography, base, styles } = resolvedSources;
    if (!foundation && !core && !typography && !base && !styles) {
      // Nothing in the static slots. The mode sheet, if there is one, loads on
      // its own effect below and needs nothing from here.
      //
      // This MUST still flip the status: 'loading' hides the whole tree behind
      // the anti-FOUC rule, so returning early without it left an app that
      // supplies only lightModeCSS/darkModeCSS — index.html carrying the rest —
      // permanently invisible.
      setCssStatus('ready');
      return;
    }

    setCssStatus('loading');
    setCssError(null);

    // Order matters: inject earlier slots first so later slots can use them
    // as `beforeId` anchors. Each call is non-blocking; we await the union
    // before flipping to 'ready' so we don't unhide before the brand actually
    // applies.
    // typography goes in after core and before base. It carries the platform
    // ramps under [data-platform="…"], whose specificity ties with the :root
    // ramp in core.css — so whichever loads LAST wins, and the design
    // system's own ramp has to be the one that does. A design system that
    // ships no typography-tokens.css leaves this slot empty and the copy
    // bundled with the lib (linked from index.html) stands.
    Promise.all([
      loadCSSSource(TAG.foundation, foundation),
      loadCSSSource(TAG.core,       core),
      // Optional slot: a design system that doesn't publish one must not take
      // the whole app down, so a failed load here is swallowed rather than
      // failing the Promise.all.
      loadCSSSource(TAG.typography, typography).catch(err => {
        console.warn('OmniDesignProvider: typography CSS did not load —', err.message);
      }),
      loadCSSSource(TAG.base,       base),
      loadCSSSource(TAG.styles,     styles),
    ])
      .then(() => {
        if (!mountedRef.current) return;
        setCssStatus('ready');
      })
      .catch(err => {
        if (!mountedRef.current) return;
        console.error('OmniDesignProvider CSS error:', err);
        setCssError(err.message);
        setCssStatus('error');
      });

    return () => {
      removeStyleTag(TAG.foundation);
      removeStyleTag(TAG.core);
      removeStyleTag(TAG.typography);
      removeStyleTag(TAG.base);
      removeStyleTag(TAG.styles);
    };
  }, [resolvedSources.foundation, resolvedSources.core, resolvedSources.typography,
      resolvedSources.base, resolvedSources.styles]);

  // ── EFFECT: Swap active mode CSS ──────────────────────────────────────────
  // Mode sheet inserts before #omni-base so the cascade slot is always
  // foundation → core → MODE → base → styles, regardless of dark/light
  // toggling order. <link> swap just changes href in place — the browser
  // refetches (cache-control on the storage layer decides whether the
  // network hit happens).
  useEffect(() => {
    const activeSource = isDark ? resolvedSources.darkMode : resolvedSources.lightMode;
    /* No sheet for the active mode: the app bundles that mode's theme itself
       (the fast setup — light theme in the page's own CSS, dark loaded only
       on toggle). Take any swapped-in mode sheet OUT, or toggling back to
       light left the dark sheet on top of the bundled light one. */
    if (!activeSource) { removeStyleTag(TAG.mode); return; }

    loadCSSSource(TAG.mode, activeSource, TAG.base)
      .catch(err => console.error('OmniDesignProvider mode CSS error:', err));

  }, [isDark, resolvedSources.lightMode, resolvedSources.darkMode]);

  // ── EFFECT: Prefetch the OTHER mode sheet once everything else is done ───
  // The first toggle used to wait on the network: Dark-Mode.css was only
  // requested when the user asked for it, so the page sat light for about a
  // second. Prefetching puts it in the HTTP cache so the swap above is
  // instant — but it must not compete with the page itself, so it waits for
  // the window's load event, then for the page's fonts, then for the browser
  // to go idle. A toggle before that simply loads the sheet
  // through the mode effect above, as it always could. URLs only — a raw-CSS
  // source has nothing to fetch.
  useEffect(() => {
    if (cssStatus !== 'ready' || typeof document === 'undefined') return undefined;
    const other = isDark ? resolvedSources.lightMode : resolvedSources.darkMode;
    if (!other || !/^(https?:)?\/\/|^\//.test(other)) return undefined;
    let cancelled = false;
    let idleId = null;
    const prefetch = () => {
      if (cancelled || document.querySelector('link[rel="prefetch"][href="' + other + '"]')) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'style';
      link.href = other;
      link.setAttribute('data-omni', 'prefetch');
      document.head.appendChild(link);
    };
    const whenIdle = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(prefetch, { timeout: 5000 });
      else idleId = setTimeout(prefetch, 1500);
    };
    // Fonts are requested only once the theme CSS has parsed, so they can
    // still be downloading after the load event: wait for them too.
    const afterFonts = () => {
      const fonts = document.fonts && document.fonts.ready;
      if (fonts && typeof fonts.then === 'function') fonts.then(whenIdle, whenIdle);
      else whenIdle();
    };
    if (document.readyState === 'complete') afterFonts();
    else window.addEventListener('load', afterFonts, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', afterFonts);
      if (idleId !== null) {
        if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
        clearTimeout(idleId);
      }
    };
  }, [cssStatus, isDark, resolvedSources.lightMode, resolvedSources.darkMode]);

  // Cleanup mode tag on unmount
  useEffect(() => { return () => removeStyleTag(TAG.mode); }, []);

  /* Chart colors per color-vision preference (data-color-vision). Injected by
     the provider, not shipped in a design system's CSS, because they are the
     same for every brand: an app gets them on a library update without its
     system being regenerated. Order-independent — the selectors outrank the
     brand's chart blocks — so it is simply added once and left in place. */
  useEffect(() => { injectStyleTag('omni-color-vision', chartColorVisionCSS()); }, []);

  // ── Public API ─────────────────────────────────────────────────────────────
  /* The chosen theme, in both modes. A dark theme applies only when one was
     explicitly asked for — otherwise dark mode is the same theme read from the
     dark stylesheet, which is what makes Primary stay Primary when you flip
     the switch. */
  const activeTheme = (isDark && resolvedDarkTheme) ? resolvedDarkTheme : theme;

  const setDarkMode = useCallback((next) => {
    if (isControlled) { onDarkModeChange?.(next); return; }
    userChoseRef.current = true;
    setInternalDark(next);
    if (storageKey) writeDarkPref(storageKey, next);
  }, [isControlled, onDarkModeChange, storageKey]);

  const toggleDarkMode = useCallback(() => setDarkMode(!isDark), [setDarkMode, isDark]);

  const setTheme = useCallback((next) => {
    if (!OMNI_THEMES.includes(next)) console.warn(`OmniDesignProvider: unknown theme "${next}"`);
    setThemeState(next);
  }, []);

  const setStyle = useCallback((next) => {
    if (!OMNI_STYLES.includes(next)) console.warn(`OmniDesignProvider: unknown style "${next}"`);
    setStyleVariant(next);
  }, []);

  const setSurface = useCallback((next) => {
    if (!OMNI_SURFACES.includes(next)) console.warn(`OmniDesignProvider: unknown surface "${next}"`);
    setRootSurface(next);
  }, []);

  // ── Context ────────────────────────────────────────────────────────────────
  const contextValue = useMemo(() => ({
    theme: activeTheme, style: styleVariant, surface: rootSurface,
    isDark, cssStatus, cssError,
    setTheme, setStyle, setSurface, toggleDarkMode, setDarkMode,
    themes: OMNI_THEMES, styles: OMNI_STYLES, surfaces: OMNI_SURFACES,
    name: manifestThemeConfig.name ?? null,
  }), [
    activeTheme, styleVariant, rootSurface, isDark,
    cssStatus, cssError,
    setTheme, setStyle, setSurface, toggleDarkMode, setDarkMode,
    manifestThemeConfig.name,
  ]);

  /* Routing. A nested provider that sets neither prop (a themed sub-tree, a
     preview) keeps its parent's router rather than switching links back to
     full page loads inside it. Memoized so a re-render of the provider does
     not re-render every link. */
  const parentLink = useContext(OmniLinkContext);
  const linkValue = useMemo(
    () => (linkComponent || navigate ? { linkComponent: linkComponent || null, navigate: navigate || null } : parentLink),
    [linkComponent, navigate, parentLink],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  // The inline <style> below is rendered as part of the React tree so the
  // hide rule is in the DOM before paint — without it, the consumer would
  // see the lib's <OmniDesignProvider>-default tokens for a frame before
  // the brand sheets resolve and apply. `data-omni-css="loading"` flips to
  // `ready` (or `error`) once every brand sheet has finished loading, at
  // which point the wrapper becomes visible. Error state stays visible so
  // the consumer can render a fallback message.
  return (
    <OmniDesignContext.Provider value={contextValue}>
     <OmniLinkContext.Provider value={linkValue}>
      <style data-omni="hide-during-load">{`[data-omni-css="loading"]{visibility:hidden}`}</style>
      <div
        data-theme={activeTheme}
        data-style={styleVariant}
        data-surface={rootSurface}
        data-omni-css={cssStatus}
        className={className}
        style={{ ...(fullHeight ? { minHeight: '100vh' } : {}), ...styleProp }}
      >
        {children}
      </div>
     </OmniLinkContext.Provider>
    </OmniDesignContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOmniDesign() {
  const ctx = useContext(OmniDesignContext);
  if (!ctx) throw new Error('useOmniDesign must be used inside a <OmniDesignProvider>');
  return ctx;
}

// ─── ThemedZone ───────────────────────────────────────────────────────────────

export function ThemedZone({ theme, surface, as: Tag = 'div', children, className, style, ...rest }) {
  return (
    <Tag data-theme={theme} data-surface={surface} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

// ─── Surfaced ─────────────────────────────────────────────────────────────────

export function Surfaced({ surface, as: Tag = 'div', children, className, style, ...rest }) {
  return (
    <Tag data-surface={surface} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

// ── Back-compat aliases ──────────────────────────────────────────────────────
// The system was called DynoDesign before this release. A design system's API
// is frozen for consumers the moment they install it, and they upgrade on their
// own schedule, so the old names keep resolving. Write the Omni names.
export const DynoDesignProvider = OmniDesignProvider;
export const useDynoDesign     = useOmniDesign;
export const DYNO_THEMES       = OMNI_THEMES;
export const DYNO_STYLES       = OMNI_STYLES;
export const DYNO_SURFACES     = OMNI_SURFACES;

export default OmniDesignProvider;