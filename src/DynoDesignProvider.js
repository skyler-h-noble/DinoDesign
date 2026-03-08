/**
 * DynoDesignProvider
 *
 * Wires the full DynoDesign token cascade into any React app.
 *
 * ── Two ways to provide CSS ───────────────────────────────────────────────────
 *
 * 1. SIMPLE — single themeURL (recommended):
 *
 *   <DynoDesignProvider
 *     themeURL="https://themes.dynodesign.com/acme-corp"
 *     defaultTheme="Default"
 *     defaultStyle="Modern"
 *   >
 *
 *   The Provider fetches {themeURL}/theme.json to discover the CSS files,
 *   then loads them in the correct order automatically.
 *
 * 2. MANUAL — individual CSS props (local dev / custom setups):
 *
 *   <DynoDesignProvider
 *     foundationCSS="/styles/foundation.css"
 *     coreCSS="/styles/core.css"
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
 *   3. Light-Mode.css  OR Dark-Mode.css  (one at a time, swaps on toggle)
 *   4. base.css        — data-style / data-surface rules
 *   5. styles.css      — final overrides
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

const DynoDesignContext = createContext(null);

// ─── Valid values ─────────────────────────────────────────────────────────────

export const DYNO_THEMES = [
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

export const DYNO_STYLES = ['Professional', 'Modern', 'Bold', 'Playful'];

export const DYNO_SURFACES = [
  'Surface', 'Surface-Dim', 'Surface-Bright',
  'Container', 'Container-Low', 'Container-Lowest',
  'Container-High', 'Container-Highest',
];

export const SURFACE_STYLE_THEME_MAP = {
  'light-tonal':       { theme: 'Primary-Light', rootSurface: 'Surface-Dim' },
  'grey-professional': { theme: 'Neutral',        rootSurface: 'Surface'     },
  'dark-professional': { theme: 'Neutral-Dark',   rootSurface: 'Surface'     },
};

// ─── Style tag IDs ────────────────────────────────────────────────────────────
//
//   #dyno-foundation  (1st)
//   #dyno-core        (2nd)
//   #dyno-mode        (3rd) ← swaps between light/dark
//   #dyno-base        (4th)
//   #dyno-styles      (5th) ← always last

const TAG = {
  foundation: 'dyno-foundation',
  core:       'dyno-core',
  mode:       'dyno-mode',
  base:       'dyno-base',
  styles:     'dyno-styles',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function injectStyleTag(id, css) {
  if (!css) return;
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = css;
    return;
  }
  const tag = document.createElement('style');
  tag.id = id;
  tag.setAttribute('data-dyno', 'true');
  tag.textContent = css;
  document.head.appendChild(tag);
}

function removeStyleTag(id) {
  document.getElementById(id)?.remove();
}

async function fetchCSS(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DynoDesignProvider: failed to fetch ${url} (${res.status})`);
  return res.text();
}

async function resolveCSS(source) {
  if (!source) return null;
  if (source.startsWith('http') || source.startsWith('/') || source.endsWith('.css')) {
    return fetchCSS(source);
  }
  return source; // raw CSS string
}

/**
 * Fetch and parse theme.json from a themeURL.
 * Returns an object with resolved absolute URLs for each CSS file.
 *
 * @param {string} themeURL  — base URL, e.g. "https://themes.dynodesign.com/acme-corp"
 * @returns {Promise<object>} — { foundationURL, coreURL, lightModeURL, darkModeURL,
 *                                baseURL, stylesURL, defaultTheme, defaultStyle,
 *                                defaultSurface, darkTheme }
 */
async function fetchThemeManifest(themeURL) {
  const base = themeURL.replace(/\/$/, ''); // strip trailing slash
  const manifestURL = `${base}/theme.json`;

  const res = await fetch(manifestURL);
  if (!res.ok) {
    throw new Error(`DynoDesignProvider: could not load theme manifest from ${manifestURL} (${res.status})`);
  }

  const manifest = await res.json();

  // Resolve each filename to a full URL
  const resolve = (filename) => filename ? `${base}/${filename}` : null;

  return {
    foundationURL:  resolve(manifest.foundation),
    coreURL:        resolve(manifest.core),
    lightModeURL:   resolve(manifest.lightMode),
    darkModeURL:    resolve(manifest.darkMode),
    baseURL:        resolve(manifest.base),
    stylesURL:      resolve(manifest.styles),
    // Theme config from manifest (props override these)
    defaultTheme:   manifest.defaultTheme   ?? null,
    defaultStyle:   manifest.defaultStyle   ?? null,
    defaultSurface: manifest.defaultSurface ?? null,
    darkTheme:      manifest.darkTheme      ?? null,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * @param {object}   props
 *
 * Theme URL (simplest — recommended for production):
 * @param {string}   props.themeURL          Base URL of the theme folder.
 *                                           Must contain a theme.json manifest.
 *                                           e.g. "https://themes.dynodesign.com/acme-corp"
 *
 * Individual CSS props (manual / local dev):
 * @param {string}   props.foundationCSS     foundation.css (URL or raw string)
 * @param {string}   props.coreCSS           core.css
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
export function DynoDesignProvider({
  // Theme URL
  themeURL,

  // Individual CSS (manual / local dev)
  foundationCSS,
  coreCSS,
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
        });
      })
      .catch(err => {
        if (!mountedRef.current) return;
        console.error('DynoDesignProvider: manifest error:', err);
        setCssError(err.message);
        setCssStatus('error');
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const [cssStatus, setCssStatus] = useState('loading');
  const [cssError,  setCssError]  = useState(null);

  // ── EFFECT: Inject static CSS (foundation, core, base, styles) ────────────
  useEffect(() => {
    const { foundation, core, base, styles } = resolvedSources;
    if (!foundation && !core && !base && !styles) return;

    setCssStatus('loading');
    setCssError(null);

    Promise.all([
      resolveCSS(foundation),
      resolveCSS(core),
      resolveCSS(base),
      resolveCSS(styles),
    ])
      .then(([foundationCSS, coreCSS, baseCSS, stylesCSS]) => {
        if (!mountedRef.current) return;
        injectStyleTag(TAG.foundation, foundationCSS);
        injectStyleTag(TAG.core,       coreCSS);
        injectStyleTag(TAG.base,       baseCSS);
        injectStyleTag(TAG.styles,     stylesCSS);
        setCssStatus('ready');
      })
      .catch(err => {
        if (!mountedRef.current) return;
        console.error('DynoDesignProvider CSS error:', err);
        setCssError(err.message);
        setCssStatus('error');
      });

    return () => {
      removeStyleTag(TAG.foundation);
      removeStyleTag(TAG.core);
      removeStyleTag(TAG.base);
      removeStyleTag(TAG.styles);
    };
  }, [resolvedSources.foundation, resolvedSources.core, resolvedSources.base, resolvedSources.styles]);

  // ── EFFECT: Swap active mode CSS ──────────────────────────────────────────
  useEffect(() => {
    const activeSource = isDark ? resolvedSources.darkMode : resolvedSources.lightMode;
    if (!activeSource) return;

    resolveCSS(activeSource)
      .then(css => {
        if (!mountedRef.current || !css) return;

        const existingMode = document.getElementById(TAG.mode);
        if (existingMode) {
          existingMode.textContent = css;
        } else {
          const tag = document.createElement('style');
          tag.id = TAG.mode;
          tag.setAttribute('data-dyno', 'true');
          tag.textContent = css;
          const baseTag = document.getElementById(TAG.base);
          if (baseTag) {
            document.head.insertBefore(tag, baseTag);
          } else {
            document.head.appendChild(tag);
          }
        }
      })
      .catch(err => console.error('DynoDesignProvider mode CSS error:', err));

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
    if (!DYNO_THEMES.includes(next)) console.warn(`DynoDesignProvider: unknown theme "${next}"`);
    setThemeState(next);
  }, []);

  const setStyle = useCallback((next) => {
    if (!DYNO_STYLES.includes(next)) console.warn(`DynoDesignProvider: unknown style "${next}"`);
    setStyleVariant(next);
  }, []);

  const setSurface = useCallback((next) => {
    if (!DYNO_SURFACES.includes(next)) console.warn(`DynoDesignProvider: unknown surface "${next}"`);
    setRootSurface(next);
  }, []);

  // ── Context ────────────────────────────────────────────────────────────────
  const contextValue = useMemo(() => ({
    theme: activeTheme, style: styleVariant, surface: rootSurface,
    isDark, cssStatus, cssError,
    setTheme, setStyle, setSurface, toggleDarkMode,
    themes: DYNO_THEMES, styles: DYNO_STYLES, surfaces: DYNO_SURFACES,
  }), [
    activeTheme, styleVariant, rootSurface, isDark,
    cssStatus, cssError,
    setTheme, setStyle, setSurface, toggleDarkMode,
  ]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynoDesignContext.Provider value={contextValue}>
      <div
        data-theme={activeTheme}
        data-style={styleVariant}
        data-surface={rootSurface}
        className={className}
        style={{ ...(fullHeight ? { minHeight: '100vh' } : {}), ...styleProp }}
      >
        {children}
      </div>
    </DynoDesignContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDynoDesign() {
  const ctx = useContext(DynoDesignContext);
  if (!ctx) throw new Error('useDynoDesign must be used inside a <DynoDesignProvider>');
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

export default DynoDesignProvider;