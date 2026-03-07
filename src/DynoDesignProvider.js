/**
 * DynoDesignProvider
 *
 * Wires the full DynoDesign token cascade into any React app.
 * Handles CSS injection in the correct order, single-mode swapping,
 * data-theme / data-style / data-surface root attributes, and
 * exposes a context hook for all child components.
 *
 * CSS load order (matches DynoDesign cascade spec):
 *   1. foundation.css  — design primitives, spacing scale, reset
 *   2. core.css        — component base styles
 *   3. light-mode.css  — OR dark-mode.css (only one active at a time)
 *   4. base.css        — data-style, data-surface, typography vars
 *                        (loads last so it can reference mode tokens)
 *
 * Usage:
 *
 *   import { DynoDesignProvider } from './DynoDesignProvider';
 *   import foundationCSS from './css/foundation.css?raw';
 *   import coreCSS       from './css/core.css?raw';
 *   import lightModeCSS  from './css/light-mode.css?raw';
 *   import darkModeCSS   from './css/dark-mode.css?raw';
 *   import baseCSS       from './css/base.css?raw';
 *
 *   <DynoDesignProvider
 *     foundationCSS={foundationCSS}
 *     coreCSS={coreCSS}
 *     lightModeCSS={lightModeCSS}
 *     darkModeCSS={darkModeCSS}
 *     baseCSS={baseCSS}
 *     defaultTheme="Default"
 *     defaultStyle="Modern"
 *     defaultSurface="Surface"
 *   >
 *     <App />
 *   </DynoDesignProvider>
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

// ─── Valid values (mirrors DynoDesign spec) ───────────────────────────────────

export const DYNO_THEMES = [
  // Light
  'Default',
  'Primary-Light', 'Primary',
  'Secondary-Light', 'Secondary',
  'Tertiary-Light', 'Tertiary',
  'Neutral-Light', 'Neutral',
  'Error-Light', 'Success-Light', 'Warning-Light', 'Info-Light',
  // Dark
  'Primary-Dark', 'Secondary-Dark', 'Tertiary-Dark', 'Neutral-Dark',
  'Error-Dark', 'Success-Dark', 'Warning-Dark', 'Info-Dark',
  // Navigation zones
  'App-Bar', 'Nav-Bar', 'Status',
];

export const DYNO_STYLES = ['Professional', 'Modern', 'Bold', 'Playful'];

export const DYNO_SURFACES = [
  'Surface', 'Surface-Dim', 'Surface-Bright',
  'Container', 'Container-Low', 'Container-Lowest',
  'Container-High', 'Container-Highest',
];

// Surface style → default theme mapping (Section 6B of DynoDesign spec)
export const SURFACE_STYLE_THEME_MAP = {
  'light-tonal':       { theme: 'Primary-Light', rootSurface: 'Surface-Dim' },
  'grey-professional': { theme: 'Neutral',        rootSurface: 'Surface'     },
  'dark-professional': { theme: 'Neutral-Dark',   rootSurface: 'Surface'     },
};

// ─── Style tag IDs ────────────────────────────────────────────────────────────
//
// DOM order after full injection:
//   <style id="dyno-foundation">  ← 1st
//   <style id="dyno-core">        ← 2nd
//   <style id="dyno-mode">        ← 3rd — content swaps between light/dark
//   <style id="dyno-base">        ← 4th
//   <style id="dyno-styles">      ← 5th — always last, highest specificity wins

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
  if (!res.ok) {
    throw new Error(`DynoDesignProvider: failed to fetch CSS from ${url} (${res.status})`);
  }
  return res.text();
}

async function resolveCSS(source) {
  if (!source) return null;
  if (source.startsWith('http') || source.startsWith('/') || source.endsWith('.css')) {
    return fetchCSS(source);
  }
  return source; // raw CSS string
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * @param {object}   props
 *
 * CSS sources (raw strings or URLs):
 * @param {string}   props.foundationCSS     foundation.css  (1st)
 * @param {string}   props.coreCSS           core.css        (2nd)
 * @param {string}   props.lightModeCSS      light-mode.css  (3rd, swaps with dark)
 * @param {string}   props.darkModeCSS       dark-mode.css   (3rd, swaps with light)
 * @param {string}   props.baseCSS           base.css        (4th)
 * @param {string}   props.stylesCSS         styles.css      (5th — always last)
 *
 * Theme config:
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
  foundationCSS,
  coreCSS,
  lightModeCSS,
  darkModeCSS,
  baseCSS,
  stylesCSS,

  defaultTheme   = 'Default',
  defaultStyle   = 'Modern',
  defaultSurface = 'Surface',
  surfaceStyle,

  defaultDarkMode = false,
  darkTheme       = 'Neutral-Dark',

  darkMode: controlledDarkMode,
  onDarkModeChange,

  className,
  style: styleProp,
  fullHeight = true,

  children,
}) {

  // ── Dark mode ──────────────────────────────────────────────────────────────
  const [internalDark, setInternalDark] = useState(defaultDarkMode);
  const isControlled = controlledDarkMode !== undefined;
  const isDark = isControlled ? controlledDarkMode : internalDark;

  // ── Theme / style / surface ────────────────────────────────────────────────
  const resolvedDefaultTheme = surfaceStyle
    ? (SURFACE_STYLE_THEME_MAP[surfaceStyle]?.theme      ?? defaultTheme)
    : defaultTheme;
  const resolvedDefaultSurface = surfaceStyle
    ? (SURFACE_STYLE_THEME_MAP[surfaceStyle]?.rootSurface ?? defaultSurface)
    : defaultSurface;

  const [theme,        setThemeState]   = useState(resolvedDefaultTheme);
  const [styleVariant, setStyleVariant] = useState(defaultStyle);
  const [rootSurface,  setRootSurface]  = useState(resolvedDefaultSurface);

  // ── CSS status ─────────────────────────────────────────────────────────────
  const [cssStatus, setCssStatus] = useState('loading');
  const [cssError,  setCssError]  = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── EFFECT 1: Static files — foundation, core, base ───────────────────────
  // These are mode-agnostic. Injected once; only re-runs if sources change.
  // Injection order:
  //   foundation (appended 1st)
  //   core       (appended 2nd)
  //   base       (appended last — after mode tag which Effect 2 inserts between core and base)
  //
  // Because Effect 2 runs after Effect 1 on the same render cycle, the mode
  // tag ends up inserted BEFORE base via insertBefore(tag, baseTag).
  useEffect(() => {
    setCssStatus('loading');
    setCssError(null);

    Promise.all([
      resolveCSS(foundationCSS),
      resolveCSS(coreCSS),
      resolveCSS(baseCSS),
      resolveCSS(stylesCSS),
    ])
      .then(([foundation, core, base, styles]) => {
        if (!mountedRef.current) return;

        // 1. foundation
        injectStyleTag(TAG.foundation, foundation);
        // 2. core
        injectStyleTag(TAG.core, core);
        // 4. base — sits after mode tag (mode inserted before base by Effect 2)
        injectStyleTag(TAG.base, base);
        // 5. styles — always last, appended after base
        injectStyleTag(TAG.styles, styles);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundationCSS, coreCSS, baseCSS, stylesCSS]);

  // ── EFFECT 2: Active mode — light-mode.css OR dark-mode.css ───────────────
  // Only ONE mode tag exists in the DOM at any time.
  // On toggle: swap the content of the existing tag in place.
  // First mount: insert the tag between core and base.
  useEffect(() => {
    const activeSource = isDark ? darkModeCSS : lightModeCSS;

    resolveCSS(activeSource)
      .then(css => {
        if (!mountedRef.current || !css) return;

        const existingMode = document.getElementById(TAG.mode);

        if (existingMode) {
          // Swap content in place — DOM order is preserved, no flicker
          existingMode.textContent = css;
        } else {
          // First inject: insert mode tag between core and base
          const tag = document.createElement('style');
          tag.id = TAG.mode;
          tag.setAttribute('data-dyno', 'true');
          tag.textContent = css;

          const baseTag = document.getElementById(TAG.base);
          if (baseTag) {
            // insertBefore ensures order is: core → mode → base
            document.head.insertBefore(tag, baseTag);
          } else {
            document.head.appendChild(tag);
          }
        }
      })
      .catch(err => {
        console.error('DynoDesignProvider mode CSS error:', err);
      });

  }, [isDark, lightModeCSS, darkModeCSS]);

  // Remove mode tag on unmount
  useEffect(() => {
    return () => { removeStyleTag(TAG.mode); };
  }, []);

  // ── Public API ─────────────────────────────────────────────────────────────
  const activeTheme = isDark ? darkTheme : theme;

  const toggleDarkMode = useCallback(() => {
    if (isControlled) {
      onDarkModeChange?.(!isDark);
    } else {
      setInternalDark(d => !d);
    }
  }, [isControlled, isDark, onDarkModeChange]);

  const setTheme = useCallback((next) => {
    if (!DYNO_THEMES.includes(next)) {
      console.warn(`DynoDesignProvider: unknown theme "${next}". Valid:`, DYNO_THEMES);
    }
    setThemeState(next);
  }, []);

  const setStyle = useCallback((next) => {
    if (!DYNO_STYLES.includes(next)) {
      console.warn(`DynoDesignProvider: unknown style "${next}". Valid:`, DYNO_STYLES);
    }
    setStyleVariant(next);
  }, []);

  const setSurface = useCallback((next) => {
    if (!DYNO_SURFACES.includes(next)) {
      console.warn(`DynoDesignProvider: unknown surface "${next}". Valid:`, DYNO_SURFACES);
    }
    setRootSurface(next);
  }, []);

  // ── Context ────────────────────────────────────────────────────────────────
  const contextValue = useMemo(() => ({
    theme:          activeTheme,
    style:          styleVariant,
    surface:        rootSurface,
    isDark,
    cssStatus,
    cssError,
    setTheme,
    setStyle,
    setSurface,
    toggleDarkMode,
    themes:         DYNO_THEMES,
    styles:         DYNO_STYLES,
    surfaces:       DYNO_SURFACES,
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
        style={{
          ...(fullHeight ? { minHeight: '100vh' } : {}),
          ...styleProp,
        }}
      >
        {children}
      </div>
    </DynoDesignContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useDynoDesign()
 *
 * Access the full DynoDesign context from any child component.
 * Must be called inside a <DynoDesignProvider>.
 *
 * const {
 *   theme,           // active data-theme string
 *   style,           // active data-style string
 *   surface,         // root data-surface string
 *   isDark,          // boolean
 *   cssStatus,       // 'loading' | 'ready' | 'error'
 *   cssError,        // string | null
 *   setTheme,        // (string) => void
 *   setStyle,        // (string) => void
 *   setSurface,      // (string) => void
 *   toggleDarkMode,  // () => void
 *   themes,          // string[] — all valid theme names
 *   styles,          // string[] — all valid style names
 *   surfaces,        // string[] — all valid surface names
 * } = useDynoDesign();
 */
export function useDynoDesign() {
  const ctx = useContext(DynoDesignContext);
  if (!ctx) {
    throw new Error('useDynoDesign must be used inside a <DynoDesignProvider>');
  }
  return ctx;
}

// ─── ThemedZone ───────────────────────────────────────────────────────────────

/**
 * Applies a specific data-theme + optional data-surface to a subtree
 * without changing the root theme.
 *
 * <ThemedZone theme="App-Bar" surface="Surface-Bright" as="header">
 *   <AppBar />
 * </ThemedZone>
 *
 * <ThemedZone theme="Success-Light" surface="Surface">
 *   <Alert />
 * </ThemedZone>
 */
export function ThemedZone({ theme, surface, as: Tag = 'div', children, className, style, ...rest }) {
  return (
    <Tag data-theme={theme} data-surface={surface} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

// ─── Surfaced ─────────────────────────────────────────────────────────────────

/**
 * Applies only data-surface — resolves --Background to the correct
 * depth token without changing the active theme.
 *
 * <Surfaced surface="Container">
 *   <Card />
 * </Surfaced>
 */
export function Surfaced({ surface, as: Tag = 'div', children, className, style, ...rest }) {
  return (
    <Tag data-surface={surface} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

export default DynoDesignProvider;