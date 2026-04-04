// src/components/Typography/Typography.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Typography Component
 *
 * All font values are driven by CSS custom properties so that a single
 * [data-platform="Desktop|IOS-Mobile|IOS-Tablet|Android"] attribute on
 * the root element swaps every style automatically via typography-tokens.css.
 *
 * STYLE MAP KEYS (textStyle prop):
 *
 *   Display
 *     display-large | display-small
 *
 *   Headers
 *     h1 | h2 | h3 | h4 | h5 | h6
 *
 *   Subtitles
 *     subtitle-large | subtitle | subtitle-small
 *
 *   Body
 *     body-small | body-small-semibold | body-small-bold
 *     body       | body-semibold       | body-bold         (medium)
 *     body-large | body-large-semibold | body-large-bold
 *
 *   Captions
 *     caption | caption-bold
 *
 *   Labels
 *     label-extra-small | label-small | label | label-large
 *
 *   Legal
 *     legal | legal-semibold
 *
 *   Overline
 *     overline-small | overline | overline-large
 *
 *   Number
 *     number-small | number-medium | number-large
 *
 *   Buttons
 *     button-extra-small | button-small | button
 *
 * HEADER COLORS (h1–h6, display, subtitle):
 *   default | primary | secondary | tertiary | neutral |
 *   info | success | warning | error
 *
 * TEXT COLORS (all other styles):
 *   default | quiet | primary | secondary | tertiary | neutral |
 *   info | success | warning | error
 *
 * WIDTH:
 *   hug   inline, fit-content
 *   fill  block, width 100% (default for block-level styles)
 */

// ─── Token helpers ────────────────────────────────────────────────────────────

const ff  = (token) => `var(--${token}-Font-Family)`;
const fs  = (token) => `var(--${token}-Font-Size)`;
const fw  = (token) => `var(--${token}-Font-Weight)`;
const lh  = (token) => `calc(var(--${token}-Line-Height) * var(--Cognitive-Multiplier, 1))`;
const lhr = (token) => `var(--${token}-Line-Height)`;   // no multiplier (UI chrome)
const ls  = (token) => `var(--${token}-Letter-Spacing)`;

// ─── Style Map ────────────────────────────────────────────────────────────────

const STYLE_MAP = {

  // ── Display ──────────────────────────────────────────────────────────────
  'display-large': {
    component: 'h1',
    fontFamily: ff('Header'),
    fontSize: fs('Display-Large'),
    fontWeight: fw('Display-Large'),
    lineHeight: lh('Display-Large'),
    letterSpacing: ls('Display-Large'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  'display-small': {
    component: 'h2',
    fontFamily: ff('Header'),
    fontSize: fs('Display-Small'),
    fontWeight: fw('Display-Small'),
    lineHeight: lh('Display-Small'),
    letterSpacing: ls('Display-Small'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },

  // ── Headers ───────────────────────────────────────────────────────────────
  h1: {
    component: 'h1',
    fontFamily: ff('Header'),
    fontSize: fs('H1'),
    fontWeight: fw('H1'),
    lineHeight: lh('H1'),
    letterSpacing: ls('H1'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h2: {
    component: 'h2',
    fontFamily: ff('Header'),
    fontSize: fs('H2'),
    fontWeight: fw('H2'),
    lineHeight: lh('H2'),
    letterSpacing: ls('H2'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h3: {
    component: 'h3',
    fontFamily: ff('Header'),
    fontSize: fs('H3'),
    fontWeight: fw('H3'),
    lineHeight: lh('H3'),
    letterSpacing: ls('H3'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h4: {
    component: 'h4',
    fontFamily: ff('Header'),
    fontSize: fs('H4'),
    fontWeight: fw('H4'),
    lineHeight: lh('H4'),
    letterSpacing: ls('H4'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h5: {
    component: 'h5',
    fontFamily: ff('Header'),
    fontSize: fs('H5'),
    fontWeight: fw('H5'),
    lineHeight: lh('H5'),
    letterSpacing: ls('H5'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h6: {
    component: 'h6',
    fontFamily: ff('Header'),
    fontSize: fs('H6'),
    fontWeight: fw('H6'),
    lineHeight: lh('H6'),
    letterSpacing: ls('H6'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },

  // ── Subtitles ─────────────────────────────────────────────────────────────
  'subtitle-large': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Subtitle-Large'),
    fontWeight: fw('Subtitle-Large'),
    lineHeight: lh('Subtitle-Large'),
    letterSpacing: ls('Subtitle-Large'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  subtitle: {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Subtitle-Small'),
    fontWeight: fw('Subtitle-Small'),
    lineHeight: lh('Subtitle-Small'),
    letterSpacing: ls('Subtitle-Small'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  'subtitle-small': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Subtitle-Small'),
    fontWeight: fw('Subtitle-Small'),
    lineHeight: lh('Subtitle-Small'),
    letterSpacing: ls('Subtitle-Small'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },

  // ── Body Small ────────────────────────────────────────────────────────────
  'body-small': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Small'),
    fontWeight: fw('Body-Small'),
    lineHeight: lh('Body-Small'),
    letterSpacing: ls('Body-Small'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-small-semibold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Small'),
    fontWeight: fw('Body-Small-Semibold'),
    lineHeight: lh('Body-Small'),
    letterSpacing: ls('Body-Small'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-small-bold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Small'),
    fontWeight: fw('Body-Small-Bold'),
    lineHeight: lh('Body-Small'),
    letterSpacing: ls('Body-Small'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },

  // ── Body Medium ───────────────────────────────────────────────────────────
  body: {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Medium'),
    fontWeight: fw('Body-Medium'),
    lineHeight: lh('Body-Medium'),
    letterSpacing: ls('Body-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-medium': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Medium'),
    fontWeight: fw('Body-Medium'),
    lineHeight: lh('Body-Medium'),
    letterSpacing: ls('Body-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-semibold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Medium'),
    fontWeight: fw('Body-Medium-Semibold'),
    lineHeight: lh('Body-Medium'),
    letterSpacing: ls('Body-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-medium-semibold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Medium'),
    fontWeight: fw('Body-Medium-Semibold'),
    lineHeight: lh('Body-Medium'),
    letterSpacing: ls('Body-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-bold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Medium'),
    fontWeight: fw('Body-Medium-Bold'),
    lineHeight: lh('Body-Medium'),
    letterSpacing: ls('Body-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-medium-bold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Medium'),
    fontWeight: fw('Body-Medium-Bold'),
    lineHeight: lh('Body-Medium'),
    letterSpacing: ls('Body-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },

  // ── Body Large ────────────────────────────────────────────────────────────
  'body-large': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Large'),
    fontWeight: fw('Body-Large'),
    lineHeight: lh('Body-Large'),
    letterSpacing: ls('Body-Large'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-large-semibold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Large'),
    fontWeight: fw('Body-Large-Semibold'),
    lineHeight: lh('Body-Large'),
    letterSpacing: ls('Body-Large'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-large-bold': {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Body-Large'),
    fontWeight: fw('Body-Large-Bold'),
    lineHeight: lh('Body-Large'),
    letterSpacing: ls('Body-Large'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },

  // ── Captions ──────────────────────────────────────────────────────────────
  caption: {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Caption'),
    fontWeight: fw('Caption'),
    lineHeight: lh('Caption'),
    letterSpacing: ls('Caption'),
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },
  'caption-bold': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Caption'),
    fontWeight: fw('Caption-Bold'),
    lineHeight: lh('Caption'),
    letterSpacing: ls('Caption'),
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },

  // ── Labels ────────────────────────────────────────────────────────────────
  'label-extra-small': {
    component: 'label',
    fontFamily: ff('Body'),
    fontSize: fs('Label-ExtraSmall'),
    fontWeight: fw('Label-ExtraSmall'),
    lineHeight: lhr('Label-ExtraSmall'),
    letterSpacing: ls('Label-ExtraSmall'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'label-small': {
    component: 'label',
    fontFamily: ff('Body'),
    fontSize: fs('Label-Small'),
    fontWeight: fw('Label-Small'),
    lineHeight: lhr('Label-Small'),
    letterSpacing: ls('Label-Small'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  label: {
    component: 'label',
    fontFamily: ff('Body'),
    fontSize: fs('Label-Medium'),
    fontWeight: fw('Label-Medium'),
    lineHeight: lhr('Label-Medium'),
    letterSpacing: ls('Label-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'label-medium': {
    component: 'label',
    fontFamily: ff('Body'),
    fontSize: fs('Label-Medium'),
    fontWeight: fw('Label-Medium'),
    lineHeight: lhr('Label-Medium'),
    letterSpacing: ls('Label-Medium'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'label-large': {
    component: 'label',
    fontFamily: ff('Body'),
    fontSize: fs('Label-Large'),
    fontWeight: fw('Label-Large'),
    lineHeight: lhr('Label-Large'),
    letterSpacing: ls('Label-Large'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },

  // ── Legal ─────────────────────────────────────────────────────────────────
  legal: {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Legal'),
    fontWeight: fw('Legal'),
    lineHeight: lh('Legal'),
    letterSpacing: ls('Legal'),
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },
  'legal-semibold': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Legal'),
    fontWeight: fw('Legal-Semibold'),
    lineHeight: lh('Legal'),
    letterSpacing: ls('Legal'),
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },

  // ── Overline ──────────────────────────────────────────────────────────────
  'overline-small': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Overline-Small'),
    fontWeight: fw('Overline-Small'),
    lineHeight: lhr('Overline-Small'),
    letterSpacing: ls('Overline-Small'),
    textTransform: 'uppercase',
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },
  overline: {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Overline-Medium'),
    fontWeight: fw('Overline-Medium'),
    lineHeight: lhr('Overline-Medium'),
    letterSpacing: ls('Overline-Medium'),
    textTransform: 'uppercase',
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },
  'overline-medium': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Overline-Medium'),
    fontWeight: fw('Overline-Medium'),
    lineHeight: lhr('Overline-Medium'),
    letterSpacing: ls('Overline-Medium'),
    textTransform: 'uppercase',
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },
  'overline-large': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Overline-Large'),
    fontWeight: fw('Overline-Large'),
    lineHeight: lhr('Overline-Large'),
    letterSpacing: ls('Overline-Large'),
    textTransform: 'uppercase',
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },

  // ── Number ────────────────────────────────────────────────────────────────
  'number-small': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Number-Small'),
    fontWeight: fw('Number-Small'),
    lineHeight: lhr('Number-Small'),
    letterSpacing: ls('Number-Small'),
    fontVariantNumeric: 'tabular-nums',
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'number-medium': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Number-Medium'),
    fontWeight: fw('Number-Medium'),
    lineHeight: lhr('Number-Medium'),
    letterSpacing: ls('Number-Medium'),
    fontVariantNumeric: 'tabular-nums',
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'number-large': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Number-Large'),
    fontWeight: fw('Number-Large'),
    lineHeight: lhr('Number-Large'),
    letterSpacing: ls('Number-Large'),
    fontVariantNumeric: 'tabular-nums',
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  'button-extra-small': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Button-ExtraSmall'),
    fontWeight: fw('Button-ExtraSmall'),
    lineHeight: lhr('Button-ExtraSmall'),
    letterSpacing: ls('Button-ExtraSmall'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'button-small': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Button-Small'),
    fontWeight: fw('Button-Small'),
    lineHeight: lhr('Button-Small'),
    letterSpacing: ls('Button-Small'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  button: {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Button'),
    fontWeight: fw('Body'),
    lineHeight: lhr('Button-Standard'),
    letterSpacing: ls('Button-Standard'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'button-standard': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: fs('Button'),
    fontWeight: fw('Body'),
    lineHeight: lhr('Button-Standard'),
    letterSpacing: ls('Button-Standard'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
};

// ─── Color Maps ───────────────────────────────────────────────────────────────

const HEADER_COLOR_MAP = {
  header:    'var(--Header)',
  default:   'var(--Header)',
  primary:   'var(--Header-Primary)',
  secondary: 'var(--Header-Secondary)',
  tertiary:  'var(--Header-Tertiary)',
  neutral:   'var(--Header-Neutral)',
  info:      'var(--Header-Info)',
  success:   'var(--Header-Success)',
  warning:   'var(--Header-Warning)',
  error:     'var(--Header-Error)',
};

const TEXT_COLOR_MAP = {
  standard:  'var(--Text)',
  default:   'var(--Text)',
  quiet:     'var(--Text-Quiet)',
  primary:   'var(--Text-Primary)',
  secondary: 'var(--Text-Secondary)',
  tertiary:  'var(--Text-Tertiary)',
  neutral:   'var(--Text-Neutral)',
  info:      'var(--Text-Info)',
  success:   'var(--Text-Success)',
  warning:   'var(--Text-Warning)',
  error:     'var(--Text-Error)',
};

const HEADING_STYLES = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'display-large', 'display-small',
  'subtitle-large', 'subtitle', 'subtitle-small',
]);

function resolveColor(textStyle, color, defaultColor) {
  const isHeading = HEADING_STYLES.has(textStyle);
  const colorMap = isHeading ? HEADER_COLOR_MAP : TEXT_COLOR_MAP;
  const key = color || defaultColor;
  return colorMap[key] || (isHeading ? HEADER_COLOR_MAP.header : TEXT_COLOR_MAP.standard);
}

// ─── Exports for Showcase ─────────────────────────────────────────────────────

export const TYPOGRAPHY_STYLES = Object.keys(STYLE_MAP);

export const HEADER_COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
export const TEXT_COLORS   = ['default', 'quiet', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

// ─── Core Component ───────────────────────────────────────────────────────────

export function Typography({
  children,
  textStyle = 'body',
  color,
  width,
  component,
  noWrap = false,
  gutterBottom = false,
  className = '',
  sx = {},
  ...props
}) {
  const config = STYLE_MAP[textStyle] || STYLE_MAP.body;

  const colorValue = resolveColor(textStyle, color, config.defaultColor);
  const resolvedWidth = width || config.defaultWidth;
  const isFill = resolvedWidth === 'fill';
  const resolvedComponent = component || config.component;
  const colorKey = color || config.defaultColor;

  return (
    <Box
      component={resolvedComponent}
      className={
        'typography typography-' + textStyle +
        ' typography-color-' + colorKey +
        ' typography-width-' + resolvedWidth +
        ' ' + className
      }
      sx={{
        fontFamily:        config.fontFamily,
        fontSize:          config.fontSize,
        fontWeight:        config.fontWeight,
        lineHeight:        config.lineHeight,
        letterSpacing:     config.letterSpacing,
        textTransform:     config.textTransform     || 'none',
        fontVariantNumeric: config.fontVariantNumeric || 'normal',
        color:             colorValue,
        display:           isFill ? 'block' : 'inline',
        width:             isFill ? '100%' : 'auto',
        margin:            0,
        marginBottom:      gutterBottom ? '0.5em' : 0,
        padding:           0,
        ...(noWrap && {
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Display
export const DisplayLarge = (p) => <Typography textStyle="display-large" {...p} />;
export const DisplaySmall = (p) => <Typography textStyle="display-small" {...p} />;

// Headers
export const H1 = (p) => <Typography textStyle="h1" {...p} />;
export const H2 = (p) => <Typography textStyle="h2" {...p} />;
export const H3 = (p) => <Typography textStyle="h3" {...p} />;
export const H4 = (p) => <Typography textStyle="h4" {...p} />;
export const H5 = (p) => <Typography textStyle="h5" {...p} />;
export const H6 = (p) => <Typography textStyle="h6" {...p} />;
export const Heading = H4;

// Subtitles
export const SubtitleLarge = (p) => <Typography textStyle="subtitle-large" {...p} />;
export const Subtitle      = (p) => <Typography textStyle="subtitle"       {...p} />;
export const SubtitleSmall = (p) => <Typography textStyle="subtitle-small" {...p} />;
export const Subtitle1     = SubtitleLarge;
export const Subtitle2     = Subtitle;

// Body Small
export const BodySmall         = (p) => <Typography textStyle="body-small"          {...p} />;
export const BodySmallSemibold = (p) => <Typography textStyle="body-small-semibold" {...p} />;
export const BodySmallBold     = (p) => <Typography textStyle="body-small-bold"     {...p} />;

// Body Medium
export const Body              = (p) => <Typography textStyle="body"          {...p} />;
export const BodyMedium        = (p) => <Typography textStyle="body"          {...p} />;
export const BodySemibold      = (p) => <Typography textStyle="body-semibold" {...p} />;
export const BodyBold          = (p) => <Typography textStyle="body-bold"     {...p} />;
export const Body1 = Body;
export const Body2 = BodySmall;

// Body Large
export const BodyLarge         = (p) => <Typography textStyle="body-large"          {...p} />;
export const BodyLargeSemibold = (p) => <Typography textStyle="body-large-semibold" {...p} />;
export const BodyLargeBold     = (p) => <Typography textStyle="body-large-bold"     {...p} />;

// Captions
export const Caption     = (p) => <Typography textStyle="caption"      {...p} />;
export const CaptionBold = (p) => <Typography textStyle="caption-bold" {...p} />;

// Labels
export const LabelExtraSmall = (p) => <Typography textStyle="label-extra-small" {...p} />;
export const LabelSmall      = (p) => <Typography textStyle="label-small"       {...p} />;
export const Label           = (p) => <Typography textStyle="label"             {...p} />;
export const LabelMedium     = (p) => <Typography textStyle="label"             {...p} />;
export const LabelLarge      = (p) => <Typography textStyle="label-large"       {...p} />;

// Legal
export const Legal         = (p) => <Typography textStyle="legal"          {...p} />;
export const LegalSemibold = (p) => <Typography textStyle="legal-semibold" {...p} />;

// Overline
export const OverlineSmall  = (p) => <Typography textStyle="overline-small"  {...p} />;
export const Overline       = (p) => <Typography textStyle="overline"        {...p} />;
export const OverlineMedium = (p) => <Typography textStyle="overline"        {...p} />;
export const OverlineLarge  = (p) => <Typography textStyle="overline-large"  {...p} />;

// Number
export const NumberSmall  = (p) => <Typography textStyle="number-small"  {...p} />;
export const NumberMedium = (p) => <Typography textStyle="number-medium" {...p} />;
export const NumberLarge  = (p) => <Typography textStyle="number-large"  {...p} />;

// Buttons
export const ButtonExtraSmall = (p) => <Typography textStyle="button-extra-small" {...p} />;
export const ButtonSmall      = (p) => <Typography textStyle="button-small"       {...p} />;
export const ButtonTypography = (p) => <Typography textStyle="button"             {...p} />;
export const Button           = ButtonTypography; // backwards compat alias

export default Typography;