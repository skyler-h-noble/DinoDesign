// src/components/Typography/Typography.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Typography Component
 *
 * STYLES (textStyle prop):
 *   h1..h6         Header font family, H{n}-* design token vars
 *   body           Body font family, Body-* vars
 *   body-small     Body-Small-* vars
 *   body-large     Body-Large-* vars
 *   body-semibold  Body-* vars + Body-Semibold-Font-Weight
 *   body-bold      Body-* vars + Body-Bold-Font-Weight
 *   button         Font-Family-Body, Button-* vars
 *   label          Font-Family-Body, Label-* vars
 *   caption        Small helper text (Body-Small vars, quiet default)
 *   overline       Small uppercase text (Label vars, uppercase)
 *
 * COLORS:
 *   header    var(--Header)     — auto for text >19px bold or >24px (headings)
 *   standard  var(--Text)       — default for body text
 *   quiet     var(--Text-Quiet) — subdued/secondary text
 *
 * WIDTH:
 *   hug   inline, fit-content (default for inline styles)
 *   fill  block, width 100% (default for block styles)
 */

const STYLE_MAP = {
  h1: {
    component: 'h1',
    fontFamily: 'var(--Font-Family-Header)',
    lineHeight: 'calc(var(--H1-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--H1-Font-Size)',
    fontWeight: 'var(--H1-Font-Weight)',
    letterSpacing: 'var(--H1-Letter-Spacing)',
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h2: {
    component: 'h2',
    fontFamily: 'var(--Font-Family-Header)',
    lineHeight: 'calc(var(--H2-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--H2-Font-Size)',
    fontWeight: 'var(--H2-Font-Weight)',
    letterSpacing: 'var(--H2-Letter-Spacing)',
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h3: {
    component: 'h3',
    fontFamily: 'var(--Font-Family-Header)',
    lineHeight: 'calc(var(--H3-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--H3-Font-Size)',
    fontWeight: 'var(--H3-Font-Weight)',
    letterSpacing: 'var(--H3-Letter-Spacing)',
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h4: {
    component: 'h4',
    fontFamily: 'var(--Font-Family-Header)',
    lineHeight: 'calc(var(--H4-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--H4-Font-Size)',
    fontWeight: 'var(--H4-Font-Weight)',
    letterSpacing: 'var(--H4-Letter-Spacing)',
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h5: {
    component: 'h5',
    fontFamily: 'var(--Font-Family-Header)',
    lineHeight: 'calc(var(--H5-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--H5-Font-Size)',
    fontWeight: 'var(--H5-Font-Weight)',
    letterSpacing: 'var(--H5-Letter-Spacing)',
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  h6: {
    component: 'h6',
    fontFamily: 'var(--Font-Family-Header)',
    lineHeight: 'calc(var(--H6-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--H6-Font-Size)',
    fontWeight: 'var(--H6-Font-Weight)',
    letterSpacing: 'var(--H6-Letter-Spacing)',
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  body: {
    component: 'p',
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-small': {
    component: 'p',
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Small-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Small-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Small-Letter-Spacing)',
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-large': {
    component: 'p',
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Large-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Large-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Large-Letter-Spacing)',
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-semibold': {
    component: 'p',
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Semibold-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  'body-bold': {
    component: 'p',
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Bold-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  button: {
    component: 'span',
    fontFamily: 'var(--Font-Family-Body)',
    lineHeight: 'var(--Button-Line-Height)',
    fontSize: 'var(--Button-Font-Size)',
    fontWeight: 'var(--Button-Font-Weight)',
    letterSpacing: 'var(--Button-Letter-Spacing)',
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  label: {
    component: 'label',
    fontFamily: 'var(--Font-Family-Body)',
    lineHeight: 'var(--Label-Line-Height)',
    fontSize: 'var(--Label-Font-Size)',
    fontWeight: 'var(--Label-Font-Weight)',
    letterSpacing: 'var(--Label-Letter-Spacing)',
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  caption: {
    component: 'span',
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Small-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Small-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Small-Letter-Spacing)',
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },
  overline: {
    component: 'span',
    fontFamily: 'var(--Font-Family-Body)',
    lineHeight: 'var(--Label-Line-Height)',
    fontSize: 'var(--Label-Font-Size)',
    fontWeight: 'var(--Label-Font-Weight)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    defaultColor: 'quiet',
    defaultWidth: 'hug',
  },
};

const COLOR_MAP = {
  header: 'var(--Header)',
  standard: 'var(--Text)',
  quiet: 'var(--Text-Quiet)',
};

// Exported for showcase use
export const TYPOGRAPHY_STYLES = Object.keys(STYLE_MAP);

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

  const resolvedColor = color || config.defaultColor;
  const colorValue = COLOR_MAP[resolvedColor] || COLOR_MAP.standard;

  const resolvedWidth = width || config.defaultWidth;
  const isFill = resolvedWidth === 'fill';

  const resolvedComponent = component || config.component;

  return (
    <Box
      component={resolvedComponent}
      className={'typography typography-' + textStyle + ' typography-color-' + resolvedColor
        + ' typography-width-' + resolvedWidth + ' ' + className}
      sx={{
        fontFamily: config.fontFamily,
        lineHeight: config.lineHeight,
        fontSize: config.fontSize,
        fontWeight: config.fontWeight,
        letterSpacing: config.letterSpacing,
        textTransform: config.textTransform || 'none',
        color: colorValue,
        display: isFill ? 'block' : 'inline',
        width: isFill ? '100%' : 'auto',
        margin: 0,
        marginBottom: gutterBottom ? '0.5em' : 0,
        padding: 0,
        ...(noWrap && {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── Convenience Shortcuts ─── */

// Headings
export const H1 = ({ children, ...p }) => <Typography textStyle="h1" {...p}>{children}</Typography>;
export const H2 = ({ children, ...p }) => <Typography textStyle="h2" {...p}>{children}</Typography>;
export const H3 = ({ children, ...p }) => <Typography textStyle="h3" {...p}>{children}</Typography>;
export const H4 = ({ children, ...p }) => <Typography textStyle="h4" {...p}>{children}</Typography>;
export const H5 = ({ children, ...p }) => <Typography textStyle="h5" {...p}>{children}</Typography>;
export const H6 = ({ children, ...p }) => <Typography textStyle="h6" {...p}>{children}</Typography>;
export const Heading = H4;

// Display
export const DisplayLarge = ({ children, ...p }) => <Typography textStyle="h1" {...p}>{children}</Typography>;
export const DisplaySmall = ({ children, ...p }) => <Typography textStyle="h2" {...p}>{children}</Typography>;

// Subtitle
export const Subtitle      = ({ children, ...p }) => <Typography textStyle="h6" {...p}>{children}</Typography>;
export const SubtitleLarge  = ({ children, ...p }) => <Typography textStyle="h5" {...p}>{children}</Typography>;
export const Subtitle1      = ({ children, ...p }) => <Typography textStyle="h5" {...p}>{children}</Typography>;
export const Subtitle2      = ({ children, ...p }) => <Typography textStyle="h6" {...p}>{children}</Typography>;

// Body
export const Body             = ({ children, ...p }) => <Typography textStyle="body"          {...p}>{children}</Typography>;
export const BodySmall        = ({ children, ...p }) => <Typography textStyle="body-small"    {...p}>{children}</Typography>;
export const BodyLarge        = ({ children, ...p }) => <Typography textStyle="body-large"    {...p}>{children}</Typography>;
export const BodySemibold     = ({ children, ...p }) => <Typography textStyle="body-semibold" {...p}>{children}</Typography>;
export const BodyBold         = ({ children, ...p }) => <Typography textStyle="body-bold"     {...p}>{children}</Typography>;
export const BodySmallSemibold = ({ children, ...p }) => <Typography textStyle="body-small" sx={{ fontWeight: 'var(--Body-Semibold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;
export const BodySmallBold    = ({ children, ...p }) => <Typography textStyle="body-small" sx={{ fontWeight: 'var(--Body-Bold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;
export const BodyLargeSemibold = ({ children, ...p }) => <Typography textStyle="body-large" sx={{ fontWeight: 'var(--Body-Semibold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;
export const BodyLargeBold    = ({ children, ...p }) => <Typography textStyle="body-large" sx={{ fontWeight: 'var(--Body-Bold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;
export const Body1            = Body;
export const Body2            = BodySmall;

// Label
export const Label            = ({ children, ...p }) => <Typography textStyle="label"    {...p}>{children}</Typography>;
export const LabelSmall       = ({ children, ...p }) => <Typography textStyle="label" sx={{ fontSize: 'calc(var(--Label-Font-Size) * 0.85)', ...p.sx }} {...p}>{children}</Typography>;
export const LabelLarge       = ({ children, ...p }) => <Typography textStyle="label" sx={{ fontSize: 'calc(var(--Label-Font-Size) * 1.15)', ...p.sx }} {...p}>{children}</Typography>;
export const LabelExtraSmall  = ({ children, ...p }) => <Typography textStyle="label" sx={{ fontSize: 'calc(var(--Label-Font-Size) * 0.75)', ...p.sx }} {...p}>{children}</Typography>;

// Caption
export const Caption          = ({ children, ...p }) => <Typography textStyle="caption"  {...p}>{children}</Typography>;
export const CaptionBold      = ({ children, ...p }) => <Typography textStyle="caption" sx={{ fontWeight: 'var(--Body-Bold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;

// Legal
export const Legal            = ({ children, ...p }) => <Typography textStyle="caption" sx={{ fontSize: '11px', ...p.sx }} {...p}>{children}</Typography>;
export const LegalSemibold    = ({ children, ...p }) => <Typography textStyle="caption" sx={{ fontSize: '11px', fontWeight: 'var(--Body-Semibold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;

// Button typography (not to be confused with the Button component)
export const Button           = ({ children, ...p }) => <Typography textStyle="button"   {...p}>{children}</Typography>;
export const ButtonSmall      = ({ children, ...p }) => <Typography textStyle="button" sx={{ fontSize: 'calc(var(--Button-Font-Size) * 0.85)', ...p.sx }} {...p}>{children}</Typography>;

// Overline
export const Overline         = ({ children, ...p }) => <Typography textStyle="overline" {...p}>{children}</Typography>;
export const OverlineSmall    = ({ children, ...p }) => <Typography textStyle="overline" {...p}>{children}</Typography>;
export const OverlineMedium   = ({ children, ...p }) => <Typography textStyle="overline" {...p}>{children}</Typography>;
export const OverlineLarge    = ({ children, ...p }) => <Typography textStyle="overline" sx={{ fontSize: 'calc(var(--Label-Font-Size) * 1.15)', ...p.sx }} {...p}>{children}</Typography>;

// Number
export const NumberLarge      = ({ children, ...p }) => <Typography textStyle="body-large" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--Body-Semibold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;
export const NumberMedium     = ({ children, ...p }) => <Typography textStyle="body" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--Body-Semibold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;
export const NumberSmall      = ({ children, ...p }) => <Typography textStyle="body-small" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--Body-Semibold-Font-Weight)', ...p.sx }} {...p}>{children}</Typography>;

export default Typography;
