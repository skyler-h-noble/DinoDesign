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
 *   Faster: the same themeURL in `@omni-design/components/vite`'s
 *   omniTheme() (or `npx omni-theme-links`) writes the sheets into the HTML.
 *   The provider then finds them (#omni-theme JSON + <link id="omni-…">),
 *   fetches nothing and is ready as soon as they have loaded — see
 *   detectHeadTheme and src/themeHead.js.
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
import {
  OMNI_TAG_IDS, manifestURLFor, resolveThemeManifest, readHeadTheme, readHeadMode, sameURL,
} from './themeHead';

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
export { OMNI_DEFAULT_THEME_URL } from './themeHead';

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

/* How long the page stays hidden waiting for the theme CSS before it is shown
   anyway (a stalled request neither loads nor fails). */
export const THEME_LOAD_TIMEOUT_MS = 10000;

const TAG = OMNI_TAG_IDS;

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
    if (existing.tagName === 'LINK' && !sameURL(existing.getAttribute('href'), href)) {
      // Swap href in place — browser refetches. Use the existing onload so
      // callers can still await readiness on a mode swap.
      return new Promise((resolve, reject) => {
        existing.onload = () => resolve(existing);
        existing.onerror = () => reject(new Error(`OmniDesignProvider: failed to load ${href}`));
        existing.setAttribute('href', href);
      });
    }
    /* Already in the page — a <link> in the HTML or one the head script
       added. Never refetch it: wait for it to finish, if it has not. */
    return existing.tagName === 'LINK' ? whenSheetSettled(existing) : Promise.resolve(existing);
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
 * Has this <link rel="stylesheet"> finished? `sheet` is set once it has
 * loaded. A link that was in the page before the window's load event has
 * settled once that event has fired (load waits for every stylesheet in the
 * head) — which is also how jsdom, which never fetches a sheet, reads it. A
 * link this provider inserted itself is judged by its own load event only.
 */
function sheetLoaded(el) {
  if (!el || el.tagName !== 'LINK') return false;
  if (el.sheet) return true;
  return document.readyState === 'complete' && el.getAttribute('data-omni') !== 'true';
}

/** Resolves when a <link> already in the page has loaded; rejects if it fails. */
function whenSheetSettled(el) {
  if (sheetLoaded(el)) return Promise.resolve(el);
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      el.removeEventListener('load', onLoad);
      el.removeEventListener('error', onError);
      window.removeEventListener('load', onWindowLoad);
    };
    const onLoad = () => { cleanup(); resolve(el); };
    const onError = () => { cleanup(); reject(new Error(`OmniDesignProvider: failed to load ${el.getAttribute('href')}`)); };
    // A sheet that settled before this listener was attached is still caught:
    // the window's load event waits for it.
    const onWindowLoad = () => { cleanup(); resolve(el); };
    el.addEventListener('load', onLoad);
    el.addEventListener('error', onError);
    if (el.getAttribute('data-omni') !== 'true') window.addEventListener('load', onWindowLoad);
  });
}

/** True when a slot needs nothing: no source, or its <link> is in the page
 *  with that address and has already loaded. */
function settledNow(id, source) {
  if (!source) return true;
  if (typeof document === 'undefined' || !isURL(source)) return false;
  const el = document.getElementById(id);
  return !!el && el.tagName === 'LINK' && sameURL(el.getAttribute('href'), source) && sheetLoaded(el);
}

/**
 * The theme the page's <head> already carries, or null.
 *
 * 1. #omni-theme JSON (written by `@omni-design/components/vite` or
 *    `npx omni-theme-links`): every sheet's URL is known, the head script has
 *    already added the links, and theme.json is never fetched. Used when its
 *    themeURL is this provider's themeURL — or, with no themeURL and no CSS
 *    props, by the top-level provider.
 * 2. <link id="omni-…"> written by hand, no JSON: used with a themeURL. The
 *    links' own addresses are used as they are; theme.json is still fetched,
 *    in the background, for the other mode's sheet and the name.
 */
function detectHeadTheme(themeURL, hasCSSProps, topLevel) {
  if (typeof document === 'undefined') return null;
  const scriptMode = readHeadMode();
  const config = readHeadTheme();
  if (config) {
    const matches = themeURL ? !!config.themeURL && sameURL(config.themeURL, themeURL) : (topLevel && !hasCSSProps);
    if (!matches) return null;
    return { config, sources: { ...config.sheets }, scriptMode, fetchManifest: false };
  }
  if (!themeURL) return null;
  const href = (id) => {
    const el = document.getElementById(id);
    return el && el.tagName === 'LINK' && el.getAttribute('href') ? el.getAttribute('href') : null;
  };
  const modeHref = href(TAG.mode);
  if (!modeHref) return null;
  const mode = scriptMode || (/dark-mode/i.test(modeHref) ? 'dark' : 'light');
  return {
    config: null,
    sources: {
      foundation: href(TAG.foundation), core: href(TAG.core), typography: href(TAG.typography),
      lightMode: mode === 'light' ? modeHref : null, darkMode: mode === 'dark' ? modeHref : null,
      base: href(TAG.base), styles: href(TAG.styles),
    },
    scriptMode,
    fetchManifest: true,
  };
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

/* Only what this provider inserted (data-omni="true"). A sheet the page's
   HTML carries — the head links — is not the provider's to take out: under
   React StrictMode the effects run twice, and removing it would refetch the
   whole theme. */
function removeStyleTag(id) {
  const el = document.getElementById(id);
  if (el && el.getAttribute('data-omni') === 'true') el.remove();
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
  // A .json URL (e.g. a Firebase Storage URL) is the manifest itself;
  // anything else is a folder holding theme.json (legacy path-based hosting).
  const manifestURL = manifestURLFor(themeURL);

  const res = await fetch(manifestURL);
  if (!res.ok) {
    throw new Error(`OmniDesignProvider: could not load theme manifest from ${manifestURL} (${res.status})`);
  }

  // Full URLs pass through; bare file names join the manifest's folder.
  const m = resolveThemeManifest(await res.json(), themeURL);

  return {
    foundationURL:  m.sheets.foundation,
    coreURL:        m.sheets.core,
    typographyURL:  m.sheets.typography,
    lightModeURL:   m.sheets.lightMode,
    darkModeURL:    m.sheets.darkMode,
    baseURL:        m.sheets.base,
    stylesURL:      m.sheets.styles,
    // Theme config from manifest (props override these)
    defaultTheme:   m.defaultTheme,
    defaultStyle:   m.defaultStyle,
    defaultSurface: m.defaultSurface,
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
    name:           m.name,
    // Google Fonts stylesheets the system uses (studio 2026-11+). Requested as
    // <link>s as soon as the manifest is read, in parallel with the sheets,
    // instead of waiting for an @import inside foundation.css to be parsed.
    // Kept as separate URLs on purpose: foundation.css @imports these exact
    // addresses, so the browser reuses one request for both. One combined
    // URL would be a second, different request for every family. (The build
    // helpers combine them, because they take the @imports out.)
    fonts:          m.fonts,
  };
}

/* One <link rel="stylesheet"> per font URL, plus the two preconnects, each
   added once per document. A system published before `fonts` existed has none
   and loads its fonts through foundation.css's @import as before. */
function linkFonts(urls) {
  if (typeof document === 'undefined' || !urls || !urls.length) return;
  const add = (attrs) => {
    const sel = 'link[rel="' + attrs.rel + '"][href="' + attrs.href + '"]';
    if (document.head.querySelector(sel)) return;
    const el = document.createElement('link');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.setAttribute('data-omni', 'font');
    document.head.appendChild(el);
  };
  add({ rel: 'preconnect', href: 'https://fonts.googleapis.com' });
  add({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' });
  urls.forEach((href) => add({ rel: 'stylesheet', href }));
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

  // ── The theme already in the page's <head> ─────────────────────────────────
  /* Read once, on mount. With it the sheets are already loading (or loaded)
     when React starts, and — with the #omni-theme JSON — theme.json is never
     fetched, which takes a whole network stage off the first styled paint.
     See detectHeadTheme and src/themeHead.js. */
  const parentContext = useContext(OmniDesignContext);
  const [head] = useState(() => detectHeadTheme(
    themeURL,
    !!(foundationCSS || coreCSS || typographyCSS || lightModeCSS || darkModeCSS || baseCSS || stylesCSS),
    parentContext === null,
  ));

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
    /* The head script already chose a mode and requested its sheet. Starting
       anywhere else would swap that sheet (a second download) and paint the
       wrong mode first. It applies the same rule — saved choice, else the
       device when set to 'system' — so with matching settings they agree
       anyway; this makes them agree when the settings drift apart too. */
    if (head && head.scriptMode) return head.scriptMode === 'dark';
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
  const headSources = head ? head.sources : {};
  const [resolvedSources, setResolvedSources] = useState({
    foundation: foundationCSS ?? headSources.foundation ?? null,
    core:       coreCSS       ?? headSources.core       ?? null,
    typography: typographyCSS ?? headSources.typography ?? null,
    lightMode:  lightModeCSS  ?? headSources.lightMode  ?? null,
    darkMode:   darkModeCSS   ?? headSources.darkMode   ?? null,
    base:       baseCSS       ?? headSources.base       ?? null,
    styles:     stylesCSS     ?? headSources.styles     ?? null,
  });

  // Theme config — may be overridden by manifest values.
  /* From the head JSON only the name is taken up front. defaultTheme /
     defaultStyle / defaultSurface seed useState below, and with themeURL they
     arrive after the first render, so the root never took them; reading them
     here would make the same app look different with and without the head
     links. Same result either way — a separate fix, if it is wanted. */
  const [manifestThemeConfig, setManifestThemeConfig] = useState(
    () => (head && head.config ? { name: head.config.name ?? null } : {}),
  );

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── EFFECT: Fetch manifest if themeURL provided ────────────────────────────
  useEffect(() => {
    if (!themeURL) { setManifestPending(false); return; }
    // The head JSON is the manifest: nothing to fetch.
    if (head && !head.fetchManifest && themeURL === themeURLAtMount.current) { setManifestPending(false); return; }
    /* Hand-written head links: the page can show as soon as they load, so
       the manifest is fetched in the background — for the other mode's
       sheet and the name — and does not hide the page while it is in flight
       (unless the head's mode is not the one this provider starts in). */
    const background = !!head && head.fetchManifest && !manifestPending
      && themeURL === themeURLAtMount.current;

    if (!background) {
      setCssStatus('loading');
      setManifestPending(true);
    }

    fetchThemeManifest(themeURL)
      .then(manifest => {
        if (!mountedRef.current) return;

        linkFonts(manifest.fonts);

        /* Individual CSS props always take precedence over the manifest; a
           sheet the page's HTML already links comes next (its address is
           the page author's choice — self-hosted copies, say — and swapping
           it would download the theme twice); the manifest fills the rest. */
        const headFirst = background ? headSources : {};
        setResolvedSources({
          foundation: foundationCSS ?? headFirst.foundation ?? manifest.foundationURL,
          core:       coreCSS       ?? headFirst.core       ?? manifest.coreURL,
          typography: typographyCSS ?? headFirst.typography ?? manifest.typographyURL,
          lightMode:  lightModeCSS  ?? headFirst.lightMode  ?? manifest.lightModeURL,
          darkMode:   darkModeCSS   ?? headFirst.darkMode   ?? manifest.darkModeURL,
          base:       baseCSS       ?? headFirst.base       ?? manifest.baseURL,
          styles:     stylesCSS     ?? headFirst.styles     ?? manifest.stylesURL,
        });

        // Store manifest theme config — props will override in render
        setManifestThemeConfig({
          defaultTheme:   manifest.defaultTheme,
          defaultStyle:   manifest.defaultStyle,
          defaultSurface: manifest.defaultSurface,
          darkTheme:      manifest.darkTheme,
          name:           manifest.name,
        });
        // Same batch as the sources: the sheet effects see the manifest's
        // URLs in the very render that stops waiting for it.
        setManifestPending(false);
      })
      .catch(err => {
        if (!mountedRef.current) return;
        console.error('OmniDesignProvider: manifest error:', err);
        // The head's sheets are already showing a styled page: keep it.
        if (background) return;
        setCssError(err.message);
        setCssStatus('error');
        setManifestPending(false);
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
    themeURL || head || foundationCSS || coreCSS || typographyCSS || baseCSS || stylesCSS
      || (isDark ? darkModeCSS : lightModeCSS)
  );
  /* sheetStatus is what the sheet effects report; cssStatus — what the page
     shows and the context exposes — is 'ready' only when ALL of these hold:
       1. the theme.json manifest has arrived (with themeURL). Before it, the
          static slots are empty, and the static effect's "nothing to load"
          branch reported ready — so the hide rule never applied and a
          throttled page painted unstyled (black on white, system fonts, blue
          links) for 1–2 s, then restyled (CLS 0.396 unthrottled).
       2. the static sheets have loaded (sheetStatus).
       3. the active mode sheet (Light- / Dark-Mode.css, where the colors are)
          has loaded the first time. Later mode toggles never hide the page.
     A sheet that neither loads nor fails (a stalled network) must not leave
     the page hidden for good: after THEME_LOAD_TIMEOUT_MS the page shows
     anyway, with a console warning. A failed load is 'error', which shows. */
  /* With the theme in the head, the page is ready on the FIRST render when
     its sheets have already loaded (the usual case: they download in
     parallel with the JavaScript) — no hidden frame, no effect round trip. */
  const initialActiveMode = isDark ? resolvedSources.darkMode : resolvedSources.lightMode;
  const headStaticSettled = !!head && ['foundation', 'core', 'typography', 'base', 'styles']
    .every((k) => settledNow(TAG[k], resolvedSources[k]));
  const headModeKnown = !!head && !!initialActiveMode;
  const [sheetStatus, setCssStatus] = useState(
    !hasAnyCSSSource || (headModeKnown && headStaticSettled) ? 'ready' : 'loading',
  );
  const [cssError,  setCssError]  = useState(null);
  // With head links the manifest only gates when the head lacks this mode's sheet.
  const [manifestPending, setManifestPending] = useState(!!themeURL && !headModeKnown);
  const themeURLAtMount = useRef(themeURL);
  const [modeSettled, setModeSettled] = useState(() => (headModeKnown
    ? settledNow(TAG.mode, initialActiveMode)
    : !themeURL && !(isDark ? darkModeCSS : lightModeCSS)));
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const cssStatus = sheetStatus === 'error' ? 'error'
    : ((sheetStatus === 'ready' && !manifestPending && modeSettled) || loadTimedOut) ? 'ready'
      : 'loading';

  useEffect(() => {
    if (cssStatus !== 'loading' || loadTimedOut) return undefined;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      // eslint-disable-next-line no-console
      console.warn('[OmniDesignProvider] The theme CSS has not finished loading after '
        + (THEME_LOAD_TIMEOUT_MS / 1000) + 's — showing the page anyway.');
      setLoadTimedOut(true);
    }, THEME_LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [cssStatus, loadTimedOut]);

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

    /* Every sheet already in the page and loaded (the head links): nothing
       to wait for, so never pass through 'loading' — that would hide a page
       that is already styled for a frame. */
    const slots = [[TAG.foundation, foundation], [TAG.core, core], [TAG.typography, typography], [TAG.base, base], [TAG.styles, styles]];
    if (slots.every(([id, src]) => settledNow(id, src))) {
      setCssStatus('ready');
      return () => slots.forEach(([id]) => removeStyleTag(id));
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

    // Settled on load OR failure: a failed mode sheet is logged, and the
    // page still shows rather than staying hidden.
    loadCSSSource(TAG.mode, activeSource, TAG.base)
      .catch(err => console.error('OmniDesignProvider mode CSS error:', err))
      .then(() => { if (mountedRef.current) setModeSettled(true); });

  }, [isDark, resolvedSources.lightMode, resolvedSources.darkMode]);

  /* No mode sheet to wait for (the app bundles that mode itself) — settled as
     soon as the manifest, if any, has said so. */
  const activeModeSource = isDark ? resolvedSources.darkMode : resolvedSources.lightMode;
  useEffect(() => {
    if (!manifestPending && !activeModeSource) setModeSettled(true);
  }, [manifestPending, activeModeSource]);

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

  /* Keep <html data-omni-mode> in step with a toggle, so a reload's head
     script and anything styling off it see the current mode. Only when the
     head script set it — this provider owns the page's theme then. */
  useEffect(() => {
    if (!head || !head.scriptMode || typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-omni-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

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