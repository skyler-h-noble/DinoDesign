// src/components/Typography/Typography.js
import React from 'react';
import { Box } from '@mui/material';
import { useGhost, ghostBlockSx } from '../_ghost';

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
 *     display-large | display-medium | display-small
 *
 *   Headers
 *     h1 | h2 | h3 | h4 | h5 | h6
 *
 *   Subtitles
 *     subtitle-small | subtitle | subtitle-large   (subtitle is the medium step)
 *
 *   Body
 *     body-small | body-small-semibold
 *     body       | body-semibold        (medium)
 *     body-large | body-large-semibold
 *     (the -bold keys still resolve, to their semibold style — the scale
 *      publishes no bold body weight)
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
 *   Eyebrow  (formerly Overline — those keys still work as aliases)
 *     eyebrow-small | eyebrow | eyebrow-large
 *
 *   Number
 *     number-small | number-medium | number-large
 *
 *   Buttons
 *     button-extra-small | button-small | button
 *
 * THE FOUR FACES
 *   Display   the expressive face — display-large/medium/small
 *   Header    the Flex face — h1–h6, and the only face carrying variable axes
 *   Eyebrow   the eyebrow/overline face
 *   Body      everything else
 *
 * HEADER COLORS (h1–h6, display, subtitle):
 *   default | primary | secondary | tertiary | neutral |
 *   info | success | warning | error
 *
 * TEXT COLORS (all other styles):
 *   default | quiet | eyebrow | primary | secondary | tertiary | neutral |
 *   info | success | warning | error
 *
 * WIDTH:
 *   hug   inline, fit-content
 *   fill  block, width 100% (default for block-level styles)
 */

// ─── Token helpers ────────────────────────────────────────────────────────────

const ff  = (token) => `var(--${token}-Font-Family)`;

// The four faces. A design system publishes --Font-Family-{Display,Header,
// Eyebrow,Body}; Display's fallback is what systems generated before the four
// faces existed resolved to, so their rendering does not shift.
//
//   Display  used to follow Header — fall back to Header.
//   Eyebrow  has no fallback. It used to follow a Decorative face, which is
//            retired: the role is gone from the system, so falling back to it
//            would name a variable nothing defines. A var() fallback only
//            fires when the variable is UNDEFINED, and every generator emits
//            --Font-Family-Eyebrow, so the Decorative arm was unreachable on
//            any current system anyway.
const FACE_DISPLAY = 'var(--Font-Family-Display, var(--Font-Family-Header, var(--Header-Font-Family)))';
const FACE_EYEBROW = 'var(--Font-Family-Eyebrow)';

// Per-style family with the face as the fallback — the generator publishes
// --Display-Large-Font-Family and friends, older systems do not.
const ffs = (token, face) => `var(--${token}-Font-Family, ${face})`;

// Variable-font axes. Only the Header face carries them, and wght is
// deliberately absent — font-weight already carries it, and declaring it in
// both places lets the two disagree.
const HEADER_AXES = 'var(--Font-Variation-Header, normal)';

// Eyebrow's size tokens were called --Overline-* until the rename. Read the
// current name first and fall back to the old one, so a design system
// generated before the rename still resolves — its CSS is frozen and can never
// be regenerated.
const eb  = (step, prop) => `var(--Eyebrow-${step}-${prop}, var(--Overline-${step}-${prop}))`;
const ebs = (step) => eb(step, 'Font-Size');
const ebw = (step) => eb(step, 'Font-Weight');
const ebl = (step) => eb(step, 'Line-Height');
const ebt = (step) => eb(step, 'Letter-Spacing');
const fs  = (token) => `var(--${token}-Font-Size)`;
const fw  = (token) => `var(--${token}-Font-Weight)`;
const lh  = (token) => `calc(var(--${token}-Line-Height) * var(--Cognitive-Multiplier, 1))`;
const lhr = (token) => `var(--${token}-Line-Height)`;   // no multiplier (UI chrome)
const ls  = (token) => `var(--${token}-Letter-Spacing)`;

// ─── Style Map ────────────────────────────────────────────────────────────────

export const STYLE_MAP = {

  // ── Display ──────────────────────────────────────────────────────────────
  // Large and Medium belong in a header or hero area. Small is the one sized
  // to sit inside a component — a card title, a stat, a pull quote.
  /* ── Alt Display ──────────────────────────────────────────────────────────
     The decorative display face, and the only text in the system that is
     PAINTED rather than colored.

     Figma's Alt-Display collection holds two variables, Color-Stop-1 and
     Color-Stop-2, across three modes:

       Default    both stops -> Header
       Colored    both stops -> Alt-Display-Color
       Gradient   stops -> Alt-Color-Gradient-Stop-1 / -2

     So it is ALWAYS a two-stop gradient; the mode decides whether the stops
     differ. Default and Colored render solid because both ends are the same
     color, which is why there is no `gradient` prop here — the mode is set on
     an ancestor and this just paints what the tokens resolve to.

     --Alt-Display-Color-Stop-1 and -2 have shipped in every brand's CSS since
     the Alt Display was added and NOTHING read them. The gradient existed as
     tokens, in Figma, and in the architecture doc, and could not appear on a
     page because no component applied it. */
  'alt-display-large': {
    component: 'h1',
    fontFamily: ffs('Alt-Display-Large', FACE_DISPLAY),
    fontSize: fs('Alt-Display-Large'),
    fontWeight: fw('Alt-Display-Large'),
    lineHeight: lh('Alt-Display-Large'),
    letterSpacing: ls('Alt-Display-Large'),
    defaultColor: 'header',
    defaultWidth: 'fill',
    altDisplay: true,
  },
  'alt-display-medium': {
    component: 'h1',
    fontFamily: ffs('Alt-Display-Medium', FACE_DISPLAY),
    fontSize: fs('Alt-Display-Medium'),
    fontWeight: fw('Alt-Display-Medium'),
    lineHeight: lh('Alt-Display-Medium'),
    letterSpacing: ls('Alt-Display-Medium'),
    defaultColor: 'header',
    defaultWidth: 'fill',
    altDisplay: true,
  },
  'alt-display-small': {
    component: 'h1',
    fontFamily: ffs('Alt-Display-Small', FACE_DISPLAY),
    fontSize: fs('Alt-Display-Small'),
    fontWeight: fw('Alt-Display-Small'),
    lineHeight: lh('Alt-Display-Small'),
    letterSpacing: ls('Alt-Display-Small'),
    defaultColor: 'header',
    defaultWidth: 'fill',
    altDisplay: true,
  },
  'display-large': {
    component: 'h1',
    fontFamily: ffs('Display-Large', FACE_DISPLAY),
    fontSize: fs('Display-Large'),
    fontWeight: fw('Display-Large'),
    lineHeight: lh('Display-Large'),
    letterSpacing: ls('Display-Large'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  'display-medium': {
    component: 'h1',
    fontFamily: ffs('Display-Medium', FACE_DISPLAY),
    fontSize: fs('Display-Medium'),
    fontWeight: fw('Display-Medium'),
    lineHeight: lh('Display-Medium'),
    letterSpacing: ls('Display-Medium'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  'display-small': {
    component: 'h2',
    fontFamily: ffs('Display-Small', FACE_DISPLAY),
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
    fontVariationSettings: HEADER_AXES,
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
    fontVariationSettings: HEADER_AXES,
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
    fontVariationSettings: HEADER_AXES,
    fontSize: fs('H3'),
    fontWeight: fw('H3'),
    lineHeight: lh('H3'),
    letterSpacing: ls('H3'),
    defaultColor: 'header',
    defaultWidth: 'fill',
  },
  // H4-H6 take --Text, not --Header. The header color is a display role: it
  // carries the page's larger type, where a distinct tone reads as hierarchy.
  // At H4 and below the type is body-sized and usually sits inline with body
  // copy, so a second tone reads as an inconsistency rather than a level.
  h4: {
    component: 'h4',
    fontFamily: ff('Header'),
    fontVariationSettings: HEADER_AXES,
    fontSize: fs('H4'),
    fontWeight: fw('H4'),
    lineHeight: lh('H4'),
    letterSpacing: ls('H4'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  h5: {
    component: 'h5',
    fontFamily: ff('Header'),
    fontVariationSettings: HEADER_AXES,
    fontSize: fs('H5'),
    fontWeight: fw('H5'),
    lineHeight: lh('H5'),
    letterSpacing: ls('H5'),
    defaultColor: 'standard',
    defaultWidth: 'fill',
  },
  h6: {
    component: 'h6',
    fontFamily: ff('Header'),
    fontVariationSettings: HEADER_AXES,
    fontSize: fs('H6'),
    fontWeight: fw('H6'),
    lineHeight: lh('H6'),
    letterSpacing: ls('H6'),
    defaultColor: 'standard',
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
  // `subtitle` is the MEDIUM step. It read Subtitle-Small until the scale
  // published all three, which made subtitle and subtitle-small identical.
  subtitle: {
    component: 'p',
    fontFamily: ff('Body'),
    fontSize: fs('Subtitle-Medium'),
    fontWeight: fw('Subtitle-Medium'),
    lineHeight: lh('Subtitle-Medium'),
    letterSpacing: ls('Subtitle-Medium'),
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

  // ── Eyebrow ───────────────────────────────────────────────────────────────
  // Eyebrow all the way down now: the face (--Font-Family-Eyebrow), the color
  // role (--Eyebrow) and the sizes (--Eyebrow-{Small,Medium,Large}-*). The
  // sizes used to be published as --Overline-*, so `eb()` reads the current
  // name and falls back to the old one — a design system generated before the
  // rename has frozen CSS and can never be regenerated.
  //
  // Note there is still no bare --Eyebrow-Font-Size: sizes are per STEP.
  //
  // The overline-* style keys are kept as aliases (see STYLE_ALIASES) so code
  // written against the old names keeps working.
  'eyebrow-small': {
    component: 'span',
    fontFamily: FACE_EYEBROW,
    fontSize: ebs('Small'),
    fontWeight: ebw('Small'),
    lineHeight: ebl('Small'),
    letterSpacing: ebt('Small'),
    textTransform: 'uppercase',
    defaultColor: 'eyebrow',
    defaultWidth: 'hug',
  },
  eyebrow: {
    component: 'span',
    fontFamily: FACE_EYEBROW,
    fontSize: ebs('Medium'),
    fontWeight: ebw('Medium'),
    lineHeight: ebl('Medium'),
    letterSpacing: ebt('Medium'),
    textTransform: 'uppercase',
    defaultColor: 'eyebrow',
    defaultWidth: 'hug',
  },
  'eyebrow-large': {
    component: 'span',
    fontFamily: FACE_EYEBROW,
    fontSize: ebs('Large'),
    fontWeight: ebw('Large'),
    lineHeight: ebl('Large'),
    letterSpacing: ebt('Large'),
    textTransform: 'uppercase',
    defaultColor: 'eyebrow',
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
  // Button-Standard is the current token family (family/size/weight/leading/
  // tracking). --Button-Font-Size and --Body-Font-Weight are the pre-ramp
  // names, kept as fallbacks: reading --Body-Font-Weight alone rendered the
  // label at 400 where the scale says 600.
  button: {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: 'var(--Button-Standard-Font-Size, var(--Button-Font-Size))',
    fontWeight: 'var(--Button-Standard-Font-Weight, var(--Body-Font-Weight))',
    lineHeight: lhr('Button-Standard'),
    letterSpacing: ls('Button-Standard'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
  'button-standard': {
    component: 'span',
    fontFamily: ff('Body'),
    fontSize: 'var(--Button-Standard-Font-Size, var(--Button-Font-Size))',
    fontWeight: 'var(--Button-Standard-Font-Weight, var(--Body-Font-Weight))',
    lineHeight: lhr('Button-Standard'),
    letterSpacing: ls('Button-Standard'),
    defaultColor: 'standard',
    defaultWidth: 'hug',
  },
};

// ─── Style Aliases ────────────────────────────────────────────────────────────
// Overline was renamed to Eyebrow. These keys resolve to the Eyebrow styles so
// existing code keeps rendering; they are deliberately NOT keys of STYLE_MAP,
// so the showcase and TYPOGRAPHY_STYLES list each style once.
export const STYLE_ALIASES = {
  'overline-small':  'eyebrow-small',
  'overline':        'eyebrow',
  'overline-medium': 'eyebrow',
  'overline-large':  'eyebrow-large',
  'eyebrow-medium':  'eyebrow',

  // Body has two weights now, Standard and Semibold. The scale publishes no
  // --Body-*-Bold-Font-Weight at all, so the bold styles were resolving to
  // nothing and rendering at the normal weight. They map to semibold — the
  // heaviest body weight that actually exists — rather than silently doing
  // nothing.
  'body-small-bold':  'body-small-semibold',
  'body-bold':        'body-semibold',
  'body-medium-bold': 'body-semibold',
  'body-large-bold':  'body-large-semibold',

  'subtitle-medium':  'subtitle',
};

// The class a style ALSO carries, for stylesheets written against the old
// name. A design system's typography-tokens.css targets .typography-overline*.
const LEGACY_CLASS = {
  'eyebrow-small': 'overline-small',
  'eyebrow':       'overline',
  'eyebrow-large': 'overline-large',
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
  quiet:     'var(--Quiet)',
  // The eyebrow's own role. The design system publishes --Eyebrow per theme
  // AND per surface — it is a deliberate rotation off the surface's palette
  // (Primary borrows Secondary, Secondary borrows Tertiary, state themes
  // borrow black/white), not a muted Text. Rendering an overline as --Quiet
  // threw that away and painted every eyebrow the same grey.
  //
  // The --Quiet fallback is for design systems generated before --Eyebrow
  // existed: their CSS has no such token, and without it every overline in
  // those systems would fall back to inherited color. It resolves to another
  // BRAND token rather than a hardcoded value, so the lib still defines
  // nothing the brand CSS owns.
  eyebrow:   'var(--Eyebrow, var(--Quiet))',
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
  'display-large', 'display-medium', 'display-small',
  'alt-display-large', 'alt-display-medium', 'alt-display-small',
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

/**
 * Every CSS variable each style reads, derived from the style's own config.
 *
 * Generated rather than listed, because a hand-kept table is a second source
 * of truth that drifts the first time someone adds a style — and the docs in
 * this repo have been wrong about bindings often enough today to make that a
 * real cost rather than a theoretical one. The config strings already contain
 * the token names; this just reads them back out.
 */
export const STYLE_TOKENS = Object.fromEntries(
  Object.entries(STYLE_MAP).map(([name, cfg]) => {
    const text = [
      cfg.fontFamily, cfg.fontSize, cfg.fontWeight,
      cfg.lineHeight, cfg.letterSpacing, cfg.fontVariationSettings,
      cfg.textTransform,
    ].filter(Boolean).join(' ');
    return [name, [...new Set(text.match(/--[A-Za-z0-9-]+/g) || [])]];
  })
);

/** 'header' or 'standard' — which color role a style takes by default. */
export const STYLE_DEFAULT_COLOR = Object.fromEntries(
  Object.entries(STYLE_MAP).map(([name, cfg]) => [name, cfg.defaultColor || 'standard'])
);

export const HEADER_COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
export const TEXT_COLORS   = ['default', 'quiet', 'eyebrow', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

// ─── Core Component ───────────────────────────────────────────────────────────

export function Typography({
  children,
  textStyle = 'body',
  color,
  /** 'default' | 'colored' | 'gradient' — Alt Display only. */
  altMode,
  width,
  component,
  noWrap = false,
  gutterBottom = false,
  className = '',
  sx = {},
  ...props
}) {
  // overline-* resolves to the eyebrow style it was renamed to.
  const style  = STYLE_ALIASES[textStyle] || textStyle;
  const config = STYLE_MAP[style] || STYLE_MAP.body;

  // Derive the size token (e.g. "Body-Medium") from the fontSize var, so
  // `text-decoration` and `text-transform` can be overridden per style via
  // CSS custom properties without baking them into STYLE_MAP entries.
  const sizeTokenMatch = typeof config.fontSize === 'string' ? config.fontSize.match(/--([\w-]+)-Font-Size/) : null;
  const sizeToken = sizeTokenMatch ? sizeTokenMatch[1] : null;
  const textDecorationValue = sizeToken
    ? 'var(--' + sizeToken + '-Text-Decoration, ' + (config.textDecoration || 'none') + ')'
    : (config.textDecoration || 'none');
  const textTransformValue = sizeToken
    ? 'var(--' + sizeToken + '-Text-Transform, ' + (config.textTransform || 'none') + ')'
    : (config.textTransform || 'none');

  /* Inside a <Ghost> region the text keeps its box and loses its ink. Reading
     the region from context rather than taking a prop is what keeps call sites
     unchanged: a card full of headings and body copy ghosts without a single
     edit, and there is no per-element prop to forget. */
  const ghost = useGhost();

  const colorValue = resolveColor(style, color, config.defaultColor);
  const resolvedWidth = width || config.defaultWidth;
  const isFill = resolvedWidth === 'fill';
  const resolvedComponent = component || config.component;
  const colorKey = color || config.defaultColor;

  /* The Alt Display mode, as an attribute the CSS already understands.
     typography-tokens.css emits [data-alt-display="default"|"colored"|
     "gradient"] and the three set Color-Stop-1/-2 differently — so swapping
     mode needs nothing but the attribute. No new token, no new rule, and the
     same three names Figma's Alt-Display collection uses.
     Unset by default, so it INHERITS: a brand picks its mode once on a wrapper
     and every Alt Display under it follows, which is how the Figma mode
     behaves too. */
  const altModeAttr = altMode ? { 'data-alt-display': altMode } : {};

  return (
    <Box
      component={resolvedComponent}
      {...altModeAttr}
      className={
        'typography typography-' + style +
        (LEGACY_CLASS[style] ? ' typography-' + LEGACY_CLASS[style] : '') +
        ' typography-color-' + colorKey +
        ' typography-width-' + resolvedWidth +
        ' ' + className
      }
      sx={{
        fontFamily:        config.fontFamily,
        fontVariationSettings: config.fontVariationSettings || 'normal',
        fontSize:          config.fontSize,
        fontWeight:        config.fontWeight,
        lineHeight:        config.lineHeight,
        letterSpacing:     config.letterSpacing,
        textDecoration:    textDecorationValue,
        textTransform:     textTransformValue,
        fontVariantNumeric: config.fontVariantNumeric || 'normal',
        color:             colorValue,
        /* Alt Display is PAINTED, not colored.
           A two-stop gradient clipped to the glyphs. Both stops resolve from
           Figma's Alt-Display collection, so Default and Colored come out
           solid (their stops are equal) and only Gradient actually ramps —
           which is why there is no `gradient` prop: the mode decides, and this
           paints whatever the tokens say.

           `color: transparent` is what reveals the clipped background, so it
           has to come AFTER the color above. The fallback chain in the CSS
           ends at --Header, so a brand with no alt color set still paints a
           visible, correctly-themed heading rather than an invisible one. */
        ...(config.altDisplay ? {
          backgroundImage:
            'linear-gradient(90deg, var(--Alt-Display-Color-Stop-1, var(--Header)),'
            + ' var(--Alt-Display-Color-Stop-2, var(--Header)))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          /* Without this a descender can be clipped by the painted box. */
          paddingBottom: '0.08em',
        } : {}),
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
        ...(ghost ? ghostBlockSx({ animate: ghost.animate }) : {}),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// ─── Cap-height trim ──────────────────────────────────────────────────────────
//
// Figma's "Vertical trim: Cap height to baseline". CSS ships the same thing as
// text-box-trim / text-box-edge: the text box is cut to the cap height on top
// and the alphabetic baseline underneath, so a label centres on its
// letterforms instead of on the font's line box — which carries ascender and
// descender space the glyphs in a button or an avatar never use.
//
// Spread it into an `sx`. It is progressive enhancement: a browser without
// text-box support renders exactly as it did before, so any optical padding a
// component applies to fake the same effect must sit OUTSIDE this block and be
// zeroed INSIDE it.
//
//   sx={{ paddingTop: '2px', ...CAP_HEIGHT_TRIM }}
//
// keeps the 2px optical nudge on browsers without the feature and drops it on
// browsers that trim for real — the block zeroes the padding itself.
export const CAP_HEIGHT_TRIM = {
  '@supports (text-box-edge: cap alphabetic)': {
    textBoxTrim: 'trim-both',
    textBoxEdge: 'cap alphabetic',
    paddingTop: 0,
    paddingBottom: 0,
  },
};

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Display
export const DisplayLarge  = (p) => <Typography textStyle="display-large"  {...p} />;
export const DisplayMedium = (p) => <Typography textStyle="display-medium" {...p} />;
export const DisplaySmall  = (p) => <Typography textStyle="display-small"  {...p} />;
export const AltDisplayLarge  = (p) => <Typography textStyle="alt-display-large"  {...p} />;
export const AltDisplayMedium = (p) => <Typography textStyle="alt-display-medium" {...p} />;
export const AltDisplaySmall  = (p) => <Typography textStyle="alt-display-small"  {...p} />;

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
export const SubtitleSmall  = (p) => <Typography textStyle="subtitle-small" {...p} />;
export const SubtitleMedium = (p) => <Typography textStyle="subtitle"       {...p} />;
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

// Eyebrow
export const EyebrowSmall  = (p) => <Typography textStyle="eyebrow-small" {...p} />;
export const Eyebrow       = (p) => <Typography textStyle="eyebrow"       {...p} />;
export const EyebrowMedium = (p) => <Typography textStyle="eyebrow"       {...p} />;
export const EyebrowLarge  = (p) => <Typography textStyle="eyebrow-large" {...p} />;

// Overline — the former name for Eyebrow. Kept so existing code compiles.
export const OverlineSmall  = EyebrowSmall;
export const Overline       = Eyebrow;
export const OverlineMedium = EyebrowMedium;
export const OverlineLarge  = EyebrowLarge;

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