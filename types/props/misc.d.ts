// types/props/misc.d.ts — provider, media, charts and utility components.
// Format: see the top of scripts/lib/api-model.mjs. fix-dts fails the build if
// a component destructures a prop declared nowhere here.
import type * as React from 'react';
import type { Theme, Surface, Color, Size, Sx, Native } from '../core-props';

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * Loads a design system's CSS and puts theme / style / surface / dark mode on the root. Wrap the app once.
 * @category Provider
 * @exports OmniDesignProvider
 * @source ../OmniDesignProvider#OmniDesignProvider
 * @example
 * <OmniDesignProvider themeURL="https://example.com/acme/theme.json">
 *   <Body>App</Body>
 * </OmniDesignProvider>
 */
export interface OmniDesignProviderProps {
  /** Theme folder or theme.json URL (OMNI_DEFAULT_THEME_URL for the package's own). Without it the page renders unstyled. */
  themeURL?: string;
  /** foundation.css — URL or raw CSS. The per-file props are for local dev; prefer themeURL. */
  foundationCSS?: string;
  coreCSS?: string;
  typographyCSS?: string;
  lightModeCSS?: string;
  darkModeCSS?: string;
  baseCSS?: string;
  /** styles.css, loaded last. */
  stylesCSS?: string;
  /** Root data-theme. Wins over theme.json's defaultTheme; unset, the root takes theme.json's, else 'Default'. */
  defaultTheme?: Theme;
  /** Root data-style (shape language). Wins over theme.json's defaultStyle; unset, the root takes theme.json's, else 'Modern'. */
  defaultStyle?: 'Professional' | 'Modern' | 'Bold' | 'Playful';
  /** Root data-surface. Wins over theme.json's defaultSurface; unset, the root takes theme.json's, else 'Surface'. */
  defaultSurface?: Surface;
  /** Preset root theme + surface; wins over defaultTheme / defaultSurface. */
  surfaceStyle?: 'light-tonal' | 'grey-professional' | 'dark-professional';
  /** Initial dark mode (uncontrolled). `'system'` follows the device's light/dark setting, live, until the user toggles. */
  defaultDarkMode?: boolean | 'system';
  /** Remember the user's toggle in localStorage and restore it next visit. `true` uses the key `omni-dark-mode`; a string is the key. */
  persistDarkMode?: boolean | string;
  /** Root data-theme in dark mode; unset keeps the light theme. */
  darkTheme?: Theme | null;
  /** Controlled dark mode; pair with onDarkModeChange. */
  darkMode?: boolean;
  /** Called with the requested dark-mode value when toggled while controlled. */
  onDarkModeChange?: (dark: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  /** min-height: 100vh on the root. */
  fullHeight?: boolean;
  /** The router's link (react-router's Link, Next's Link). Internal hrefs on Button, Card, Link, Tab, BreadcrumbItem render through it, receiving `to` and `href`. */
  linkComponent?: React.ElementType;
  /** Called on a plain left click of an internal href instead of a page load. Ignored for full URLs, mailto:/tel:, #anchors, target and download. */
  navigate?: (href: string, event: React.MouseEvent) => void;
  children?: React.ReactNode;
}

/**
 * Sets data-theme / data-surface without painting — for something that paints itself (a bar you build). To paint a region use Section.
 * @category Provider
 * @exports ThemedZone
 * @source ../OmniDesignProvider#ThemedZone
 * @example
 * <ThemedZone theme="App-Bar" surface="Surface" as="header">
 *   <H6>Brand</H6>
 * </ThemedZone>
 */
export interface ThemedZoneProps extends Native {
  theme?: Theme;
  surface?: Surface;
  /** Element to render. */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * Sets only data-surface (keeps the inherited theme), without painting.
 * @category Provider
 * @exports Surfaced
 * @source ../OmniDesignProvider#Surfaced
 * @example
 * <Surfaced surface="Container-High"><Body>Text tuned for that level.</Body></Surfaced>
 */
export interface SurfacedProps extends Native {
  surface?: Surface;
  /** Element to render. */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * Content that depends on the visitor (cart, signed-in name, saved choices),
 * drawn only once the app runs. A prerendered page and React's first render
 * both show `fallback`, so the saved HTML never shows the wrong cart and
 * mountApp can take the page over. Give the fallback the content's size.
 * @category Provider
 * @exports ClientOnly
 * @source ./ClientOnly/ClientOnly#ClientOnly
 * @example
 * <ClientOnly fallback={<BodySmall>Your cart</BodySmall>}><BodySmall>Your cart (3)</BodySmall></ClientOnly>
 */
export interface ClientOnlyProps {
  /** Drawn on the prerendered page and on the first render. */
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

// ─── Media ───────────────────────────────────────────────────────────────────

/** Font Awesome's IconDefinition, structurally — an import from
 *  @fortawesome/free-brands-svg-icons fits without this package depending on it. */
export interface BrandIconDefinition {
  icon: [number, number, string[], string, string | string[]];
}

/**
 * A company mark (GitHub, LinkedIn, Figma…) from Font Awesome Brands. Not for UI icons — those are Icon. Unknown names render nothing.
 * @category Media
 * @exports BrandIcon
 * @example
 * <BrandIcon name="github" title="GitHub" />
 */
export interface BrandIconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'color' | 'name'> {
  /** Lowercase hyphenated Font Awesome name: 'github', 'x-twitter', 'linkedin'. */
  name?: string;
  /** An icon object instead of a name. */
  icon?: BrandIconDefinition;
  /** Width and height (CSS length). */
  size?: string | number;
  /** Fill. Inherits the text color by default. */
  color?: string;
  /** Accessible name; without it the mark is aria-hidden. */
  title?: string;
}

/**
 * Pull quote / testimonial: the words in Header type, attribution with optional photo.
 * @category Media
 * @exports Quote
 * @example
 * <Quote cite="Priya Shah" detail="Studio Lead, Northwind">It changed how we ship.</Quote>
 */
export interface QuoteProps extends Native {
  /** The quoted words. */
  children?: React.ReactNode;
  /** Who said it. */
  cite?: React.ReactNode;
  /** Role or company under the name. */
  detail?: React.ReactNode;
  /** Photo beside the attribution. */
  avatarSrc?: string;
  /** Initials when there is no photo. */
  avatarInitials?: string;
  /** Text scale: H5 / H4 / H3. */
  size?: Size;
  align?: 'start' | 'center';
  /** Show the decorative quotation mark. */
  mark?: boolean;
  /** Icon color of the mark. */
  markColor?: Color;
  sx?: Sx;
}

/** Every shape Shape draws (SHAPE_NAMES). */
export type ShapeName =
  | 'rounded' | 'squircle' | 'circle' | 'oval' | 'pill' | 'arch' | 'semicircle' | 'heart' | 'ghost'
  | 'bun' | 'square' | 'slanted' | 'triangle' | 'arrow' | 'fan' | 'diamond' | 'clamshell' | 'pentagon'
  | 'gem' | 'heptagon' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'sunny'
  | 'very-sunny' | 'clover-4' | 'clover-8' | 'flower' | 'puffy' | 'puffy-diamond' | 'burst' | 'soft-burst'
  | 'boom' | 'soft-boom' | 'pixel-circle' | 'pixel-triangle' | 'cut-corners' | 'cut-two' | 'octagon'
  | 'one-corner' | 'notch' | 'scallop';

/**
 * Clips content to a shape: image frames, accents, stickers. Not for buttons/cards; nothing focusable inside (the mask clips focus rings).
 * @category Media
 * @exports Shape
 * @example
 * <Shape shape="soft-burst" color="warning" width={64}>NEW</Shape>
 */
export interface ShapeProps extends Native {
  shape?: ShapeName;
  /** An img / video fills the shape; other content sits in its safe area. */
  children?: React.ReactNode;
  /** px number or CSS length. */
  width?: number | string;
  /** Defaults to width (square). */
  height?: number | string;
  /** Makes it a themed surface; without it the shape paints nothing. */
  color?: Color;
  /** With color: solid = Surface, light = Surface-Brightest, dark = Surface-Dimmest. */
  variant?: 'solid' | 'light' | 'dark';
  /** aria-hidden (pure ornament). */
  decorative?: boolean;
  /** Element to render. */
  component?: React.ElementType;
  sx?: Sx;
}

/**
 * Where an image will go: a tinted box with a photo glyph. Fills its parent — size the parent. Decorative unless given role="img" + aria-label.
 * @category Media
 * @exports ImagePlaceholder
 * @example
 * <Ratio ratio="16:9"><ImagePlaceholder /></Ratio>
 */
export interface ImagePlaceholderProps extends Native<HTMLDivElement> {
  sx?: Sx;
}

/**
 * Audio player UI: artwork, title, scrubber, play/pause, optional skip / previous / next. You own the audio; this only draws and reports.
 * @category Media
 * @exports Player
 * @example
 * <Player title="Episode 12" subtitle="The Design Pod" duration={1830}
 *   playing={checked} onPlayPause={setChecked} position={page} onSeek={setPage} />
 */
export interface PlayerProps extends Native<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Artwork URL. */
  imageSrc?: string;
  imageAlt?: string;
  /** Older name for imageSrc. */
  avatarSrc?: string;
  /** @deprecated Ignored — a track has artwork, not initials. Use imageSrc. */
  avatarInitials?: string;
  /** Seconds (controlled). */
  position?: number;
  /** Seconds (uncontrolled start). */
  defaultPosition?: number;
  /** Track length in seconds. */
  duration?: number;
  /** Called with the new position in seconds. No onSeek = not scrubbable. */
  onSeek?: (seconds: number) => void;
  /** Controlled play state. */
  playing?: boolean;
  defaultPlaying?: boolean;
  /** Called with the requested play state. */
  onPlayPause?: (playing: boolean) => void;
  /** Shows a previous-track button. */
  onPrevious?: React.MouseEventHandler<HTMLButtonElement>;
  /** Shows a next-track button. */
  onNext?: React.MouseEventHandler<HTMLButtonElement>;
  /** Shows back / forward buttons; called with -skipSeconds or +skipSeconds. */
  onSkip?: (deltaSeconds: number) => void;
  skipSeconds?: number;
  /** Color of the play button and scrubber. */
  variant?: Color;
  size?: Size;
  disabled?: boolean;
  /** Elapsed / remaining times under the scrubber. */
  showTime?: boolean;
  sx?: Sx;
}

/** Bevel tuning, used when preset / bevelPreset is 'custom'. Unset fields start from Classic. */
export interface BevelCustom {
  angle?: number;
  depth?: number;
  softness?: number;
  bevel?: boolean;
  shadow?: boolean;
  shadowDistance?: number;
  shadowBlur?: number;
  shadowOpacity?: number;
}
export type BevelPreset = 'Classic' | 'Carved' | 'Embossed' | 'Stamp' | 'Night Cut' | 'Shadow Only' | 'custom';
/** The palettes a bevel's colors are read from (--Buttons-{Theme}-*). */
export type BevelTheme = 'Default' | 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral';

/** SVG attributes the text components forward, minus the names they define. */
type SvgText = Omit<React.SVGAttributes<SVGSVGElement>, 'color' | 'fontSize' | 'fontFamily' | 'fontWeight' | 'letterSpacing' | 'direction' | 'rotate'>;

/**
 * Display text along one or more arcs (SVG), optionally bevelled. Decorative brand moments, not body copy.
 * @category Media
 * @exports CurvedText
 * @example
 * <CurvedText text="Fresh every morning" arc={120} radius={240} />
 */
export interface CurvedTextProps extends SvgText {
  text?: string;
  /** Several arcs for a wave; overrides arc / radius / direction. */
  curves?: Array<{ arc: number; radius: number; direction?: 'up' | 'down' }>;
  /** Single curve: degrees of arc. */
  arc?: number;
  /** Single curve: radius in px. */
  radius?: number;
  direction?: 'up' | 'down';
  /** Degrees to rotate the whole block. */
  rotation?: number;
  /** Crop the viewBox to the drawn text. */
  autoCrop?: boolean;
  /** Typography token set. */
  textStyle?: 'display-large' | 'display-small';
  /** px override. */
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  /** px override. */
  letterSpacing?: number | string | null;
  /** CSS color or token. */
  color?: string;
  /** Simple bevel in bevelTheme's button colors. */
  bevel?: boolean;
  bevelTheme?: BevelTheme;
  /** Named bevel; overrides `bevel`. */
  bevelPreset?: BevelPreset;
  /** Overrides when bevelPreset="custom". */
  bevelCustom?: BevelCustom;
}

/**
 * Straight display text with an inset bevel and optional drop shadow, colored from a theme's button tokens.
 * @category Media
 * @exports BevelText
 * @example
 * <BevelText text="Grand Opening" theme="Secondary" preset="Embossed" />
 */
export interface BevelTextProps extends SvgText {
  text?: string;
  theme?: BevelTheme;
  preset?: BevelPreset;
  /** Overrides when preset="custom". */
  custom?: BevelCustom;
  textStyle?: 'display-large' | 'display-small';
  fontSize?: number | string;
  fontFamily?: string;
  fontWeight?: number | string;
  letterSpacing?: number | string;
}

// ─── App structure ───────────────────────────────────────────────────────────

/**
 * The "© year Company. All rights reserved." strip under a footer. Footer already includes one.
 * @category App structure
 * @exports Copyright
 * @example
 * <Copyright companyName="Acme" />
 */
export interface CopyrightProps extends Native<HTMLDivElement> {
  /** Same presets as Footer: default = Neutral at Surface-Dimmest. */
  color?: 'default' | 'primary' | 'primary-dark' | 'white' | 'black';
  companyName?: string;
  year?: number;
  /** Trailing sentence; '' omits it. */
  rights?: string;
  /** Replaces the whole text. */
  children?: React.ReactNode;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Code, a shell command or a copyable URL on a dark Neutral region, with its own copy button. Do not override its background.
 * @category Utilities
 * @exports CodeBlock
 * @example
 * <CodeBlock code="npm install @omni-design/components" language="bash" />
 */
export interface CodeBlockProps extends Native<HTMLDivElement> {
  /** The text shown and copied. */
  code?: string;
  /** Header label: 'bash', 'JSX', 'CSS', 'URL'. */
  language?: string;
  showCopy?: boolean;
  showHeader?: boolean;
  /** Copy button in the header (defaults to showHeader). */
  copyInHeader?: boolean;
  /** Copy button in the code area (defaults to !showHeader). */
  copyInBody?: boolean;
  /** Cap the code area and scroll past it (CSS length or px). */
  maxHeight?: number | string;
  /** Wrap long lines instead of scrolling. */
  wrap?: boolean;
  sx?: Sx;
}

/**
 * The icon button that copies text and confirms — CodeBlock's, on its own.
 * @category Utilities
 * @exports CopyButton
 * @example
 * <CopyButton code="https://example.com/invite/abc" label="Copy link" />
 */
export interface CopyButtonProps {
  /** The text to copy. */
  code: string;
  /** Accessible name. */
  label?: string;
}

/**
 * Gallery page showing the design system's color palette. A docs/showcase view; takes no props.
 * @category Utilities
 * @exports Colors
 * @example
 * <Colors />
 */
export interface ColorsProps {}

/**
 * Gallery page showing the spacing and sizing scales. A docs/showcase view; takes no props.
 * @category Utilities
 * @exports Spacing
 * @example
 * <Spacing />
 */
export interface SpacingProps {}

/**
 * The gallery's settings panel (platform, style, mode). Reads the provider; takes no props.
 * @category Utilities
 * @exports SettingsPanel
 * @example
 * <SettingsPanel />
 */
export interface SettingsPanelProps {}

// ─── Charts ──────────────────────────────────────────────────────────────────

/** A data point: a bare number, or a value with its category label. */
export type ChartDatum = number | { value: number; label?: string };

interface ChartBase extends Native<HTMLElement> {
  /** Numbers, or `{ value, label }` objects. */
  data?: ChartDatum[];
  /** Hover / focus readout per point. */
  interactive?: boolean;
  /** Grow / draw in on mount (respects reduced motion). */
  animate?: boolean;
  /** Caption of the screen-reader data table. */
  label?: string;
  sx?: Sx;
}

/**
 * Single-series bars in a track, themed by the surface it sits on. Ships a hidden data table for screen readers.
 * @category Charts
 * @exports BarChart
 * @example
 * <BarChart data={[{ value: 12, label: 'Mon' }, { value: 18, label: 'Tue' }, { value: 9, label: 'Wed' }]} label="Orders per day" />
 */
export interface BarChartProps extends ChartBase {
  /** Track behind each bar. */
  showTrack?: boolean;
  /** Round bar ends. */
  rounded?: boolean;
  /** Value above each bar. */
  showValues?: boolean;
  /** Category labels under the bars. */
  showLabels?: boolean;
  /** px. */
  height?: number;
  /** Gap between bars as a fraction of a slot (0–1). */
  gapRatio?: number;
}

/**
 * One series as a line (smooth or straight) with optional area fill.
 * @category Charts
 * @exports LineChart
 * @example
 * <LineChart data={[4, 7, 5, 9, 12]} label="Weekly signups" showGrid />
 */
export interface LineChartProps extends ChartBase {
  curve?: 'smooth' | 'straight';
  /** Fill the area under the line. */
  gradient?: boolean;
  /** Anchor the value axis at zero. */
  fromZero?: boolean;
  /** Horizontal gridlines at round values. */
  showGrid?: boolean;
  /** Category labels on the x axis. */
  showLabels?: boolean;
  /** px. */
  height?: number;
  /** Line width in px. */
  strokeWidth?: number;
  /** Curve tension for smooth (0 = Catmull-Rom). */
  tension?: number;
}

/**
 * Parts of a whole; `donut` for a ring. Wedges cycle the icon palettes.
 * @category Charts
 * @exports PieChart
 * @example
 * <PieChart donut data={[{ value: 60, label: 'Direct' }, { value: 25, label: 'Search' }, { value: 15, label: 'Social' }]} label="Traffic sources" />
 */
export interface PieChartProps extends ChartBase {
  donut?: boolean;
  /** Inner radius as a fraction of the outer. */
  donutRatio?: number;
  /** Palette per wedge, cycled. */
  colors?: Array<'Primary' | 'Secondary' | 'Tertiary' | 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'>;
  /** Gap between wedges in px. */
  separatorWidth?: number;
  /** Diameter in px. */
  size?: number;
  /** Labels inside wedges. */
  showLabels?: boolean;
}
