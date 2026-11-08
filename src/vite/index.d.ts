// Types for @omni-design/components/vite (copied to dist/types/vite.d.ts by build:types).
// Vite's own types are referenced, not bundled: an app using this plugin has vite installed.
import type { Plugin } from 'vite';

export interface OmniThemeOptions {
  /** The design system's theme.json URL — the same one passed to <OmniDesignProvider themeURL>. */
  themeURL: string;
  /**
   * `vite build`: download the sheets once and serve them from the app's own
   * host as hashed assets, with foundation.css's Google Fonts @imports
   * replaced by one font request (when theme.json lists its fonts).
   * A snapshot: rebuild to pick up a republished system. Opt-in.
   * Default false: link the live published files (always the case in dev),
   * so a system re-published from the studio reaches the site on the next visit.
   */
  copy?: boolean;
  /**
   * First mode when the visitor has no saved choice. Match the provider:
   * 'system' for defaultDarkMode="system" (the default), 'light' for
   * defaultDarkMode={false}, 'dark' for defaultDarkMode={true}.
   */
  dark?: 'system' | 'light' | 'dark';
  /** The provider's persistDarkMode key. Default 'omni-dark-mode'. */
  storageKey?: string;
  /** Build: link only the themes the app's code uses. Needs a system published
   *  with per-theme mode files (theme.json `modeParts`); others load in full.
   *  Default true. `vite` dev always loads every theme. */
  trim?: boolean;
  /** Themes to keep even when the scan does not see them in the code, e.g.
   *  ones whose names arrive from a CMS. */
  themes?: string[];
  /** fetch() to use (Node 18+ has one). */
  fetch?: typeof fetch;
}

/** Vite plugin: puts the theme's <head> block in index.html. */
export declare function omniTheme(options: OmniThemeOptions): Plugin;
export default omniTheme;

export interface ResolvedThemeManifest {
  sheets: {
    foundation: string | null; core: string | null; typography: string | null;
    lightMode: string | null; darkMode: string | null; base: string | null; styles: string | null;
  };
  name: string | null;
  defaultTheme: string | null;
  defaultStyle: string | null;
  defaultSurface: string | null;
  fonts: string[];
}

/** theme.json, resolved to absolute sheet URLs. */
export declare function loadThemeManifest(themeURL: string, options?: { fetch?: typeof fetch }): Promise<ResolvedThemeManifest>;

/** The head block (HTML) that `npx omni-theme-links` prints. */
export declare function themeLinks(themeURL: string, options?: {
  dark?: 'system' | 'light' | 'dark';
  storageKey?: string;
  /** Write the sheets with this callback and link them under basePath. */
  copyTo?: string;
  basePath?: string;
  writeFile?: (name: string, source: string) => void | Promise<void>;
  fetch?: typeof fetch;
}): Promise<string>;

/** All Google Fonts css2 families in one URL. */
export declare function combineGoogleFonts(urls: string[]): string[];
/** Remove foundation.css's Google Fonts @imports. */
export declare function stripFontImports(css: string): string;
/** The package's own theme (pinned to the installed version) — same as the root export. */
export declare const OMNI_DEFAULT_THEME_URL: string;
/** The constant inline script the head block carries. */
export declare const OMNI_HEAD_SCRIPT: string;
