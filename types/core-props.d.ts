// types/core-props.d.ts — hand-written prop types for the core components.
//
// The rest of dist/types is inferred from the JS and types most props `any`.
// That compiles, but it catches nothing: `varient="primary"` or
// `theme="Primary-Light"` sails through and fails silently at runtime. These
// are the components a page is built from, so they get exact types — an
// editor autocompletes the allowed values and TypeScript rejects the rest.
//
// scripts/fix-dts.mjs swaps these in for the inferred signatures and FAILS
// the build if a component destructures a prop this file does not declare,
// so the two cannot drift: add a prop to a component, add it here.
import type * as React from 'react';

// ─── Shared vocabularies ─────────────────────────────────────────────────────

/** A region's palette. Lighter / darker is a surface level, not a theme. */
export type Theme =
  | 'Default' | 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral'
  | 'Info' | 'Success' | 'Warning' | 'Error'
  | 'App-Bar' | 'Nav-Bar' | 'Status';

/** Page levels, darkest → brightest, then the container levels. */
export type Surface =
  | 'Surface-Dimmest' | 'Surface-Dim' | 'Surface' | 'Surface-Bright' | 'Surface-Brightest'
  | 'Container-Lowest' | 'Container-Low' | 'Container' | 'Container-High' | 'Container-Highest';

/** A component's color, lower case. */
export type Color =
  | 'default' | 'primary' | 'secondary' | 'tertiary' | 'neutral'
  | 'info' | 'success' | 'warning' | 'error';

export type Size = 'small' | 'medium' | 'large';

/** Solid, outline or ghost in any color; plain ghost / text; black-white. */
export type ButtonVariant =
  | Color | `${Color}-outline` | `${Color}-ghost`
  | 'black-white' | 'black-white-outline' | 'black-white-ghost'
  | 'ghost' | 'text' | 'outline' | 'danger';

export type TextColor =
  | 'standard' | 'default' | 'inherit' | 'quiet' | 'eyebrow'
  | 'primary' | 'secondary' | 'tertiary' | 'neutral'
  | 'info' | 'success' | 'warning' | 'error';

export type HeadingColor = Exclude<TextColor, 'quiet' | 'eyebrow'>;

export type IconShape =
  | 'rounded' | 'squircle' | 'circle' | 'square' | 'gem' | 'pentagon' | 'heptagon' | 'diamond'
  | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'sunny' | 'flower' | 'puffy'
  | 'arch' | 'cut-corners' | 'octagon';

export type AvatarShape =
  | 'circle' | 'squircle' | 'rounded' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9'
  | 'cookie-12' | 'flower' | 'gem' | 'puffy' | 'bun';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type GridSize = number | 'auto' | 'grow';
type Sx = Record<string, unknown>;

/** Native attributes a component forwards — id, aria-*, onClick, role… —
 *  minus names the component defines itself. */
type Native<E = HTMLElement, Own extends PropertyKey = never> =
  Omit<React.HTMLAttributes<E>, 'color' | 'title' | 'translate' | Own>;

// ─── Layout ──────────────────────────────────────────────────────────────────

export interface SectionProps extends Native {
  /** Omit to inherit the parent's palette. */
  theme?: Theme;
  surface?: Surface;
  /** Render as another element: 'header', 'footer', 'article', … */
  as?: React.ElementType;
  /** CSS padding, e.g. "80px 24px". */
  padding?: string | number;
  edgeTop?: string;
  edgeBottom?: string;
  edgeHeight?: number;
  edgeSize?: Size;
  edgeAnimate?: boolean;
  edgeSeed?: number;
  children?: React.ReactNode;
}

export interface ContainerProps extends Native {
  maxWidth?: Breakpoint | false;
  disableGutters?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

export interface GridProps extends Native {
  container?: boolean;
  /** MUI 5 spelling; has no effect — every child of a container is an item. */
  item?: boolean;
  spacing?: number | string;
  /** Columns per breakpoint (MUI 7): `{ xs: 12, md: 4 }`. */
  size?: GridSize | Partial<Record<Breakpoint, GridSize>>;
  xs?: GridSize; sm?: GridSize; md?: GridSize; lg?: GridSize; xl?: GridSize;
  columns?: number;
  rowSpacing?: number | string;
  columnSpacing?: number | string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: React.CSSProperties['alignItems'];
  justifyContent?: React.CSSProperties['justifyContent'];
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  offset?: GridSize | Partial<Record<Breakpoint, GridSize>>;
  sx?: Sx;
  children?: React.ReactNode;
}

export interface StackProps extends Native {
  /** MUI spacing units (8px) or a CSS length. */
  spacing?: number | string;
  gap?: number | string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: React.CSSProperties['alignItems'];
  justifyContent?: React.CSSProperties['justifyContent'];
  flexWrap?: React.CSSProperties['flexWrap'];
  divider?: React.ReactNode;
  enforceMinGap?: boolean;
  minGapToken?: string;
  useFlexGap?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Surfaces ────────────────────────────────────────────────────────────────

export interface CardProps extends Native<HTMLElement, 'onClick'> {
  variant?: 'solid' | 'light' | 'dark';
  color?: Color;
  /** Override the inner surface (default: Container). */
  surface?: Surface;
  size?: Size;
  orientation?: 'vertical' | 'horizontal';
  clickable?: boolean;
  selected?: boolean;
  elevated?: boolean;
  draggable?: boolean;
  disabled?: boolean;
  /** Makes the whole card a link. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'title'> {
  variant?: ButtonVariant;
  size?: Size;
  elevated?: boolean;
  selected?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  /** text (default) | iconOnly | letterNumber | avatar. iconOnly needs an aria-label. */
  contentType?: 'text' | 'iconOnly' | 'letterNumber' | 'avatar';
  iconOnly?: boolean;
  letterNumber?: boolean;
  avatar?: boolean;
  /** @deprecated A swatch is not a button — use Swatch. */
  swatch?: boolean;
  /** @deprecated See `swatch`. */
  swatchColor?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  badge?: boolean;
  badgeContent?: React.ReactNode;
  badgeVariant?: Color;
  badgeSize?: Size;
  badgeDot?: boolean;
  badgeMax?: number;
  badgeAnchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
  /** Makes it a link. */
  href?: string;
  sx?: Sx;
  children?: React.ReactNode;
}

export interface ToggleButtonGroupProps extends Native<HTMLElement, 'onChange' | 'defaultValue'> {
  value?: unknown;
  defaultValue?: unknown;
  onChange?: (value: any) => void;
  multiple?: boolean;
  /** false (default): the last selected segment cannot be turned off. */
  allowEmpty?: boolean;
  separated?: boolean;
  variant?: 'outlined' | 'light' | 'ghost';
  color?: Color;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  /** @deprecated Use `multiple` (inverted). */
  exclusive?: boolean;
  children?: React.ReactNode;
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  href?: string;
  target?: string;
  rel?: string;
  /** Without href, the link renders as a button that runs this. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  textStyle?: string;
  color?: string;
  disabled?: boolean;
  visited?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Text ────────────────────────────────────────────────────────────────────

interface TypographyBase extends Native {
  /** Render as another element (keep the outline right: one h1 per page). */
  component?: React.ElementType;
  textStyle?: string;
  altMode?: boolean;
  width?: string | number;
  noWrap?: boolean;
  gutterBottom?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}
/** Body, BodySmall, BodyLarge, Caption, Eyebrow, Subtitle, Label… */
export interface TextProps extends TypographyBase { color?: TextColor; }
/** DisplayLarge…DisplaySmall, H1–H6 — headings use the Header colors. */
export interface HeadingProps extends TypographyBase { color?: HeadingColor; }
/** Typography itself: any text style by name. */
export interface TypographyProps extends TypographyBase { color?: TextColor; }

// ─── Data display ────────────────────────────────────────────────────────────

export interface IconProps extends Native {
  color?: Color;
  size?: 'xs' | Size | 'xl';
  fontSize?: string | number;
  disabled?: boolean;
  twoTone?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

export interface IconBadgeProps extends Native {
  color?: Color;
  variant?: 'solid' | 'light' | 'dark';
  size?: Size;
  shape?: IconShape;
  sx?: Sx;
  children?: React.ReactNode;
}

export interface ChipProps extends Native<HTMLElement, 'onClick'> {
  variant?: Color;
  label?: React.ReactNode;
  clickable?: boolean;
  disabled?: boolean;
  selected?: boolean;
  selectionMode?: 'radio' | 'checkbox';
  onDelete?: React.MouseEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  /** MUI's name for the start decorator. */
  icon?: React.ReactNode;
  /** @deprecated Chips have one size. */
  size?: string;
  sx?: Sx;
  children?: React.ReactNode;
}

export interface AvatarProps extends Native<HTMLElement, 'onClick'> {
  src?: string;
  defaultPhoto?: boolean;
  alt?: string;
  initials?: string;
  icon?: React.ReactNode;
  color?: Color;
  size?: 'xxs' | 'xs' | Size | 'xl' | 'xxl';
  customSize?: number;
  clickable?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  insideButton?: boolean;
  shape?: AvatarShape;
  sx?: Sx;
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export interface TextFieldProps {
  label?: React.ReactNode;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
  variant?: string;
  size?: Size;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  id?: string;
  autoComplete?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  sx?: Sx;
}

// ─── Page chrome ─────────────────────────────────────────────────────────────

export interface FooterLink { label: React.ReactNode; href?: string; onClick?: React.MouseEventHandler<HTMLElement>; }
export interface FooterColumn { title: React.ReactNode; links: FooterLink[]; }
export interface FooterSocialLink {
  url: string;
  label?: string;
  name?: string;
  /** A Font Awesome brand name: 'github', 'x-twitter', 'linkedin'… */
  brand?: string;
  icon?: React.ReactNode;
}
export interface FooterProps extends Native {
  color?: 'default' | 'primary' | 'primary-dark' | 'white' | 'black' | (string & {});
  brand?: React.ReactNode;
  address?: { company?: string; lines?: string[]; email?: string; phone?: string };
  /** Up to three link columns. */
  columns?: FooterColumn[];
  socialLinks?: FooterSocialLink[];
  copyright?: boolean;
  subscribe?: { title?: string; onSubscribe?: (email: string) => void };
  copyrightName?: string;
  copyrightYear?: number;
  children?: React.ReactNode;
}
