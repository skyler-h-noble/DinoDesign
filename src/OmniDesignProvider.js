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
 *     "defaultSurface": "Surface",
 *     "darkTheme": "Neutral-Dark"
 *   }
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

// ─── Context ──────────────────────────────────────────────────────────────────

const OmniDesignContext = createContext(null);

// ─── Valid values ─────────────────────────────────────────────────────────────

export const OMNI_THEMES = [
  'Default',
  'Primary-Light', 'Primary',
  'Secondary-Light', 'Secondary',
  'Tertiary-Light', 'Tertiary',
  'Neutral-Light', 'Neutral',
  'Error-Light', 'Success-Light', 'Warning-Light', 'Info-Light',
  'Primary-Dark', 'Secondary-Dark', 'Tertiary-Dark', 'Neutral-Dark',
  'Error-Dark', 'Success-Dark', 'Warning-Dark', 'Info-Dark',
  'App-Bar', 'Nav-Bar', 'Status',
];

export const OMNI_STYLES = ['Professional', 'Modern', 'Bold', 'Playful'];

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
  'dark-professional': { theme: 'Neutral-Dark',   rootSurface: 'Surface'     },
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
    if (existing.tagName === 'LINK' && existing.getAttribute('href') !== href) {
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
    darkTheme:      manifest.darkTheme      ?? null,
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
 * @param {boolean}  props.defaultDarkMode   Initial dark mode (default: false)
 * @param {string}   props.darkTheme         data-theme in dark mode (default: 'Neutral-Dark')
 *
 * Dark mode — controlled:
 * @param {boolean}  props.darkMode
 * @param {function} props.onDarkModeChange
 *
 * DOM:
 * @param {string}   props.className
 * @param {object}   props.style
 * @param {boolean}  props.fullHeight        Adds minHeight: 100vh (default: true)
 * @param {React.ReactNode} props.children
 */
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
  darkTheme:      darkThemeProp = 'Neutral-Dark',

  // Controlled dark mode
  darkMode: controlledDarkMode,
  onDarkModeChange,

  // DOM
  className,
  style: styleProp,
  fullHeight = true,

  children,
}) {

  // ── Dark mode ──────────────────────────────────────────────────────────────
  const [internalDark, setInternalDark] = useState(defaultDarkMode);
  const isControlled = controlledDarkMode !== undefined;
  const isDark = isControlled ? controlledDarkMode : internalDark;

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
  const resolvedDarkTheme    = darkThemeProp !== 'Neutral-Dark'
    ? darkThemeProp
    : (manifestThemeConfig.darkTheme ?? darkThemeProp);

  const [theme,        setThemeState]   = useState(resolvedDefaultTheme);
  const [styleVariant, setStyleVariant] = useState(resolvedDefaultStyle);
  const [rootSurface,  setRootSurface]  = useState(resolvedDefaultSurface);

  // ── CSS status ─────────────────────────────────────────────────────────────
  // 'loading' while sheets are in flight, 'ready' after they apply, 'error' on
  // a load failure. Initial value is 'ready' when the consumer passes neither
  // a themeURL nor any individual CSS prop — that case means they're using
  // the Provider only for theme-context (no brand sheets to load), so the
  // hide-during-load rule shouldn't keep the page invisible forever.
  const hasAnyCSSSource = !!(
    themeURL || foundationCSS || coreCSS || typographyCSS
      || lightModeCSS || darkModeCSS || baseCSS || stylesCSS
  );
  const [cssStatus, setCssStatus] = useState(hasAnyCSSSource ? 'loading' : 'ready');
  const [cssError,  setCssError]  = useState(null);

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
    if (!activeSource) return;

    loadCSSSource(TAG.mode, activeSource, TAG.base)
      .catch(err => console.error('OmniDesignProvider mode CSS error:', err));

  }, [isDark, resolvedSources.lightMode, resolvedSources.darkMode]);

  // Cleanup mode tag on unmount
  useEffect(() => { return () => removeStyleTag(TAG.mode); }, []);

  // ── Public API ─────────────────────────────────────────────────────────────
  const activeTheme = isDark ? resolvedDarkTheme : theme;

  const toggleDarkMode = useCallback(() => {
    if (isControlled) onDarkModeChange?.(!isDark);
    else setInternalDark(d => !d);
  }, [isControlled, isDark, onDarkModeChange]);

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
    setTheme, setStyle, setSurface, toggleDarkMode,
    themes: OMNI_THEMES, styles: OMNI_STYLES, surfaces: OMNI_SURFACES,
    name: manifestThemeConfig.name ?? null,
  }), [
    activeTheme, styleVariant, rootSurface, isDark,
    cssStatus, cssError,
    setTheme, setStyle, setSurface, toggleDarkMode,
    manifestThemeConfig.name,
  ]);

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