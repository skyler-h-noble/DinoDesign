// src/components/Input/Input.js
import React, { useId, useState } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox, lazyFallback } from '../_lazyFallback';
import { StaticTextField, FieldAdornment, HelperText } from '../_textFieldBase';
import { Glyph, SVG_ICON_DECLS } from '../_glyph';

/**
 * Input Component
 * Full-featured text input with complete design system integration
 *
 * --- SURFACE -----------------------------------------------------------------
 *   data-surface="Surface-Bright" on wrapper and input root (light variant: Surface-Dim)
 *
 * --- ONE EDGE ---------------------------------------------------------------
 *
 * The field's own --Border (the 3:1 role for a clickable outline), as Figma's
 * Input — 1px at rest and hover, 2px pressed and focused. There is no colour
 * axis: a coloured edge is how a field shows VALIDATION (error / warning /
 * success / info), so a palette edge on a valid field read as a state it was
 * not in. variant="{color}-outline" / "outline" were RETIRED: they render the
 * one edge and warn once in development.
 *
 * --- PLACEHOLDER / HELPER TEXT -----------------------------------------------
 *   Placeholder: var(--Quiet)
 *   Helper text: var(--Quiet) — validation overrides with validation color
 *
 * --- SIZES -------------------------------------------------------------------
 *   small:  32px height, 13px font
 *   medium: var(--Button-Height), 15px font (default)
 *   large:  56px height, 17px font
 *
 * --- LABEL -------------------------------------------------------------------
 *   standard:  label above the input, Sizing-Half (4) between them
 *   left:      label beside the input, Sizing-1 (8) between, centred on it
 *   floating:  label inside, shrinks on focus/filled (stays inside the field)
 *   Figma's Input Field set: label-top / label-left / floating / none (no
 *   label prop — pass aria-label). The label is the lib's FormLabel.
 *
 * --- VALIDATION --------------------------------------------------------------
 *   info | success | warning | error — icon + colored border + helper message
 *
 * --- ACCESSIBILITY -----------------------------------------------------------
 *   aria-label and aria-labelledby are passed via inputProps to the <input>
 *   element directly per WCAG 1.3.1. Always provide label or aria-label.
 */


// --- Variant Style Builders --------------------------------------------------

/* There was a `light` variant — eight colors plus a bare alias, and five
   convenience exports. It is gone.

   Its only difference from `outline` was the background:
   var(--Buttons-{C}-Light-Button, var(--Hover)). No design system publishes
   that token, so the fallback ALWAYS fired and every *-light field rendered
   byte-identical to its *-outline twin. Not broken — worse than broken. A
   user picking between two variants saw the same field twice with no error
   and no way to tell which one had taken effect.

   A lighter input is a lighter SURFACE: put the field on
   data-surface="Surface-Brightest" and keep variant="{color}-outline".

   Hover and pressed move the BORDER, not the background.

   The field's resting background is already --Hover: an input wants a visible
   affordance against the surface, and that scrim is what gives it one. So the
   usual ghost-button idiom (rest transparent -> --Hover -> --Pressed) has
   nowhere to go here; painting --Hover over --Hover is a no-op, which is
   exactly why this component had no hover state at all. The border is the one
   channel still free, and it is where a text field conventionally shows it. */
/* The DEFAULT field is Figma's Input: the surface's own --Border edge (the 3:1
   role for a clickable outline), unchanged by hover and press. */
function defaultStyles() {
  return {
    bg: 'var(--Hover)',
    border: 'var(--Border)',
    hoverBorder: 'var(--Border)',
    pressedBorder: 'var(--Border)',
    text: 'var(--Text)',
    focusBg: 'var(--Hover)',
  };
}


// --- Sizing ------------------------------------------------------------------

// The horizontal text inset is driven by --Input-Padding (the design system's
// input padding token) so the studio's Input Padding control takes effect.
// Vertical stays per-size; each size keeps its original horizontal value as the
// fallback when --Input-Padding isn't defined.
const SIZE_MAP = {
  /* fontSize is the Body ramp — Figma's input text is Dynamic Body, which is
     Body-Small / -Medium / -Large across the Component-Size modes. It was
     13 / 15 / 17 literals, in MUI's Roboto. iconSize is the in-button glyph
     (Button-Icon, 16 / 20 / 32). */
  small:  { height: 'var(--Small-Button-Height)', fontSize: 'var(--Body-Small-Font-Size, 14px)',  lineHeight: 'var(--Body-Small-Line-Height, 20px)',  labelSize: '13px', padding: '4px var(--Input-Padding, 8px)',  iconSize: 'var(--Sm-Button-Icon, 16px)' },
  medium: { height: 'var(--Button-Height)',        fontSize: 'var(--Body-Medium-Font-Size, 16px)', lineHeight: 'var(--Body-Medium-Line-Height, 24px)', labelSize: '15px', padding: '4px var(--Input-Padding, 12px)', iconSize: 'var(--Button-Icon, 20px)' },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: 'var(--Body-Large-Font-Size, 18px)',  lineHeight: 'var(--Body-Large-Line-Height, 28px)',  labelSize: '17px', padding: '4px var(--Input-Padding, 16px)', iconSize: 'var(--Lg-Button-Icon, 32px)' },
};

export const FLOATING_SIZE_MAP = {
  /* padTop/padBottom repeat the first and third values of `padding`. They are
     the band the typed text occupies, and the adornments take the same pair so
     they share it — see the adornment block below. Kept as numbers rather than
     parsed back out of the string, which contains a var() and does not parse. */
  /* Figma's floating Input (medium): 56 tall, the icon 20 at the input
     padding (12), the text and label 12 past it, the text in Body. fontSize is
     the Body ramp; fontPx is its number, for the label arithmetic below (a
     var() does not parse). iconSize is the in-button ramp, 16 / 20 / 32. */
  small:  { height: '48px', fontSize: 'var(--Body-Small-Font-Size, 14px)',  fontPx: 14, labelSize: '11px', padding: '20px var(--Input-Padding, 12px) 4px', padTop: 20, padBottom: 4, leftPad: 12, iconSize: 16 },
  medium: { height: '56px', fontSize: 'var(--Body-Medium-Font-Size, 16px)', fontPx: 16, labelSize: '12px', padding: '22px var(--Input-Padding, 12px) 6px', padTop: 22, padBottom: 6, leftPad: 12, iconSize: 20 },
  large:  { height: '64px', fontSize: 'var(--Body-Large-Font-Size, 18px)',  fontPx: 18, labelSize: '14px', padding: '24px var(--Input-Padding, 16px) 6px', padTop: 24, padBottom: 6, leftPad: 16, iconSize: 32 },
};

/**
 * Floating-label geometry.
 *
 * Exported and pure so the arithmetic can be tested directly. The rendered
 * transform cannot be: jsdom reports MUI's own base rule rather than the
 * emotion override, so a DOM assertion here would pass whatever these values
 * were — which is exactly how the constants survived.
 *
 * X — the resting label must start where the input TEXT starts, or it jumps
 * sideways as it shrinks. With a start adornment the text begins after it, so
 * the label clears what the adornment actually occupies: marginLeft + icon +
 * gap. This was a flat +32, which is 8px too far at large and 12px at small —
 * the error grew as the icon got SMALLER.
 *
 * Y — the resting label is centred in the field. This was a flat 16px, which
 * centred `small` and left `large` 4px high — the error grew as the field got
 * TALLER. Two constants, two errors, running in opposite directions.
 */
/* The resting label wears the Body style (tokenFont), whose line is 1.5 — a
   16px label is a 24px box, as Figma draws it. MUI's own 1.4375 is overridden,
   so centring on it put the label 1px low. */
export const LABEL_LINE_HEIGHT = 1.5;

/**
 * Which design-system text style each state of a floating label uses.
 *
 * A floating label is two styles, not one size scaled: at rest it sits exactly
 * where the input TEXT will be, so it is Body; shrunk it becomes a label above
 * the text, which is what Label is for.
 *
 * It previously used neither — hardcoded pixels (13/15/17) with scale(0.75) on
 * top, so a large field's shrunk label rendered at 12.75px, a number in no
 * token and matching no style in the system. And because scale() shrinks the
 * RENDERED PIXELS, the weight and letter-spacing shrank with it: the result was
 * a squashed Body rather than a Label, which is precisely what having separate
 * Label steps is meant to avoid.
 *
 * So the transition animates FONT-SIZE, not scale.
 */
export const FLOATING_LABEL_STYLE = {
  small:  { resting: 'Body-Small',  shrunk: 'Small' },
  medium: { resting: 'Body-Medium', shrunk: 'Medium' },
  large:  { resting: 'Body-Large',  shrunk: 'Large' },
};

/* The raised label is Figma's own style, Dynamic-Floating-Label: 11 / 12 / 14
   at weight 500, 0.5px tracking, a 1.2 line (14.4 / 16.8 / 19.2), in the Label
   face. It was Label-ExtraSmall / -Small / -Medium, which are 12.5 at 600 —
   close, and visibly heavier. The Typography collection names it
   Labels/Floating-Label-*; the fallbacks hold until the generator emits it.

   Figma sets the line in a 20px box with the text centred (Label Area, 2px
   padding), so the label carries the difference as padding: its top is the
   box's, and the glyphs land where Figma's do. */
const FLOATING_LABEL_FONT = {
  Small:  { size: 11, line: 14.4 },
  Medium: { size: 12, line: 16.8 },
  Large:  { size: 14, line: 19.2 },
};
const FLOATING_LABEL_BOX = 20;
const floatingLabelFont = (step) => {
  const f = FLOATING_LABEL_FONT[step] || FLOATING_LABEL_FONT.Medium;
  return {
    fontFamily:    'var(--Body-Font-Family)',   // labels use the Body face, as Typography's label styles do
    fontSize:      'var(--Floating-Label-' + step + '-Font-Size, ' + f.size + 'px)',
    fontWeight:    'var(--Floating-Label-Font-Weight, 500)',
    letterSpacing: 'var(--Floating-Label-Letter-Spacing, 0.5px)',
    lineHeight:    'var(--Floating-Label-' + step + '-Line-Height, ' + f.line + 'px)',
    paddingTop:    Math.max(0, (FLOATING_LABEL_BOX - f.line) / 2) + 'px',
  };
};

const tokenFont = (t) => ({
  fontSize:      'var(--' + t + '-Font-Size)',
  fontWeight:    'var(--' + t + '-Font-Weight)',
  letterSpacing: 'var(--' + t + '-Letter-Spacing)',
});

/** Space between a start adornment and the text after it.
 *
 *  Load-bearing in two places that must agree: the adornment's marginRight and
 *  the label's x offset. Split across two numbers (a 4px margin plus a 4px
 *  input padding) they drifted apart — the label sat 4px off the text it is
 *  supposed to be the label FOR. One constant, used by both. */
/* Sizing-1-and-Half — Figma's gap between a start icon and the text, the same
   12 the standard field uses. */
export const ADORNMENT_GAP = 12;

export function floatingLabelGeometry(sizeConfig, hasStartAdornment) {
  const fieldH  = parseInt(sizeConfig.height, 10) || 56;
  const fontPx  = sizeConfig.fontPx || parseInt(sizeConfig.fontSize, 10) || 16;

  /* THE TEXT INSET IS A TOKEN, SO THE LABEL'S MUST BE THE SAME TOKEN.
   *
   * This was `leftPad`, a plain number, while the input's own padding is
   * var(--Input-Padding, <leftPad>px). The number is only the FALLBACK — a
   * design system that defines --Input-Padding overrides it, and the generated
   * CSS defines it as 4px (or 2px below an 8px radius). So the text sat at 4px
   * while the label sat at 14px, and the label missed the text it labels by
   * ten pixels on every plain field.
   *
   * Nothing reported it because both values are individually reasonable. The
   * only fix is for the two to read ONE source, which means the label carries
   * the var too rather than a number hoping to match it. */
  const pad = 'var(--Input-Padding, ' + (sizeConfig.leftPad || 14) + 'px)';

  /* What a start adornment occupies: its own width — pinned to iconSize below,
     because a "$" is not 18px — plus the single gap. Added to the SAME pad, so
     the two cases cannot drift apart from each other either. */
  const clearance = (sizeConfig.iconSize || 18) + ADORNMENT_GAP;

  return {
    /** A CSS length, not a number: it has to carry the variable through. */
    labelX: hasStartAdornment ? 'calc(' + pad + ' + ' + clearance + 'px)' : pad,
    /** The adornment's own inset, so the row starts where the text would. */
    padX: pad,
    /** Numeric clearance, for asserting the arithmetic without a layout. */
    clearance: hasStartAdornment ? clearance : 0,
    restingY: Math.round((fieldH - fontPx * LABEL_LINE_HEIGHT) / 2),
    // Sits in the field's top padding, bottom-aligned to where the text starts.
    // Figma's Label Area: 2px from the top of the field.
    shrunkY: 2,
  };
}

// --- Validation icons --------------------------------------------------------

const VALIDATION_COLORS = {
  info:    { border: 'var(--Buttons-Info-Border)',    hoverBorder: 'var(--Buttons-Info-Hover)',    pressedBorder: 'var(--Buttons-Info-Pressed)',    icon: 'var(--Icons-Info)',    text: 'var(--Hotlink)' },
  success: { border: 'var(--Buttons-Success-Border)', hoverBorder: 'var(--Buttons-Success-Hover)', pressedBorder: 'var(--Buttons-Success-Pressed)', icon: 'var(--Icons-Success)', text: 'var(--Text-Success)' },
  warning: { border: 'var(--Buttons-Warning-Border)', hoverBorder: 'var(--Buttons-Warning-Hover)', pressedBorder: 'var(--Buttons-Warning-Pressed)', icon: 'var(--Icons-Warning)', text: 'var(--Text-Warning)' },
  error:   { border: 'var(--Buttons-Error-Border)',   hoverBorder: 'var(--Buttons-Error-Hover)',   pressedBorder: 'var(--Buttons-Error-Pressed)',   icon: 'var(--Icons-Error)',   text: 'var(--Text-Error)' },
};

// --- Static sheet --------------------------------------------------------------
//
// Input was MUI's TextField inside three MUI Boxes, all styled by sx. It now
// renders the same markup from _textFieldBase.js and this sheet, so a field
// looks and behaves as it did while MUI and emotion stay out of the bundle.
//
// The sx on the TextField became the rules under .omni-inp-tf, with the SAME
// selectors and weights — one class on the field root, then MUI's part
// classes — so a caller's sx (emotion, appended after this sheet) wins
// wherever it did. What varied per instance is split into one class per
// feature (size, floating, start icon, multiline, …), each emitting exactly
// the declarations the merged sx object ended up with for that feature. Where
// a later sx key REPLACED an earlier one (a floating field with a start icon
// lost its whole `& input` block; multiline replaced the adornment blocks),
// the replacement is reproduced, not "fixed".
//
// The label's two offsets are per-instance arithmetic, so they arrive as
// custom properties on the field root (--_inp-lx, --_inp-ry).
const SxBox = lazySxBox('Input');
const InputMui = lazyFallback('Input', () => import('./Input.mui'));
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
/* Props only MUI's TextField understands. Given any, Input hands the whole
   call to its MUI version, so nothing that worked before breaks. */
const MUI_ONLY = ['select', 'SelectProps', 'slots', 'slotProps', 'InputProps', 'InputLabelProps', 'FormHelperTextProps', 'inputComponent', 'children'];
const SZ = { small: 'sm', medium: 'md', large: 'lg' };
const SIZES = ['small', 'medium', 'large'];
const RESIZE = ['none', 'vertical', 'both', 'horizontal', 'block', 'inline'];
const V_ICON = { info: 'InfoOutlined', success: 'CheckCircleOutline', warning: 'WarningAmber', error: 'ErrorOutline' };
const TF = '.omni-inp-tf';
const OR = ' .MuiOutlinedInput-root';
const PH = (sel, decls) => [`${sel}::-webkit-input-placeholder{${decls}}`, `${sel}::placeholder{${decls}}`];
const pad = (sel, padding) => {
  // `padding: a b [c]` as longhands — jsdom drops a shorthand holding var().
  const p = padding.match(/(?:var\([^()]*\)|calc\([^()]*\)|[^\s])+/g);
  const [t, r = t, b = t] = p;
  return `${sel}{padding-top:${t};padding-right:${r};padding-bottom:${b};padding-left:${r}}`;
};
const fontDecls = (f) => Object.entries(f).map(([k, v]) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()) + ':' + v).join(';');

registerStaticStyles('omni-input', [
  /* The wrapper. */
  '.omni-inp{width:auto}',
  '.omni-inp-full{width:100%}',
  '.omni-inp-left{display:grid;grid-template-columns:auto minmax(0, 1fr);column-gap:var(--Sizing-1, 8px);-webkit-box-align:center;align-items:center}',
  '.omni-inp-left > :not(.form-label-row){grid-column:2}',

  /* The shell: the edge is an inside-stroke overlay; the ring 2px, 1px out. */
  '.omni-inp-shell{position:relative;border:none;overflow:hidden;transition:border-color 0.15s ease-in-out;box-shadow:none;'
    + `--_inp-edge:${defaultStyles().border};--_inp-hover:${defaultStyles().hoverBorder};--_inp-press:${defaultStyles().pressedBorder};`
    + 'border-radius:var(--Input-Radius, var(--Style-Border-Radius))}',
  '.omni-inp-shell-sm{border-radius:var(--Sm-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))}',
  '.omni-inp-shell-lg{border-radius:var(--Lg-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))}',
  ...Object.entries(VALIDATION_COLORS).map(([v, c]) => `.omni-inp-v-${v}{--_inp-edge:${c.border};--_inp-hover:${c.hoverBorder};--_inp-press:${c.pressedBorder}}`),
  '.omni-inp-shell::after{content:"";position:absolute;inset:0;pointer-events:none;border-width:1px;border-style:solid;'
    + 'border-color:var(--_inp-edge);border-radius:inherit;transition:border-color 0.15s ease-in-out}',
  '.omni-inp-v::after{border-width:2px}',
  /* A disabled field takes no state: these rules hang off .omni-inp-on. */
  '.omni-inp-on:hover::after{border-color:var(--_inp-hover)}',
  '.omni-inp-on:active::after{border-color:var(--_inp-press);border-width:2px}',
  `.omni-inp-on:hover${OR},.omni-inp-on:active${OR},.omni-inp-on:focus-within${OR}{color:var(--Text)}`,
  `.omni-inp-on:hover${OR}{background-color:var(--Pressed)}`,
  `.omni-inp-on:active${OR}{background-color:var(--Hover)}`,
  '.omni-inp-shell:focus-within{outline-width:2px;outline-style:solid;outline-color:var(--Focus-Visible);outline-offset:1px}',
  '.omni-inp-shell:focus-within::after{border-width:2px}',
  '.omni-inp-shell-off{opacity:var(--Disabled, 0.38)}',

  /* The field (the TextField's sx). */
  `${TF}${OR}{background-color:var(--Hover);color:var(--Quiet);font-family:var(--Body-Font-Family, var(--Font-Family-Body, inherit));`
    + 'padding:0;border-radius:0;transition:color 0.15s ease-in-out}',
  ...SIZES.map((s) => `.omni-inp-s${SZ[s]}${OR}{font-size:${SIZE_MAP[s].fontSize};min-height:${SIZE_MAP[s].height}}`),
  ...SIZES.map((s) => `.omni-inp-f${SZ[s]}${OR}{font-size:${FLOATING_SIZE_MAP[s].fontSize};min-height:${FLOATING_SIZE_MAP[s].height}}`),
  `.omni-inp-flt${OR}{-webkit-box-align:stretch;align-items:stretch}`,
  `.omni-inp-ml${OR}{flex-wrap:wrap;align-items:flex-start;align-content:flex-start;`
    + 'padding-top:0;padding-bottom:0;padding-left:var(--Sizing-1, 8px);padding-right:var(--Sizing-1, 8px);min-height:var(--Text-Area-Min-Height, 88px)}',
  `${TF}${OR} fieldset{border:none}`,
  `${TF}${OR}.Mui-focused{color:var(--Text)}`,
  `${TF}${OR}:not(.Mui-focused) .MuiOutlinedInput-input:not(:placeholder-shown){color:var(--Text)}`,
  `${TF}${OR}.Mui-disabled{opacity:1;color:var(--Quiet);cursor:not-allowed}`,
  `${TF}${OR}.Mui-disabled .MuiInputBase-input.Mui-disabled{color:inherit;-webkit-text-fill-color:currentColor}`,
  `${TF}${OR}.Mui-disabled .MuiInputBase-input.Mui-disabled:not(:placeholder-shown){color:var(--Text)}`,
  // `& input` — on every field but a floating one with a start icon.
  ...SIZES.map((s) => pad(`.omni-inp-in-s${SZ[s]}${OR} input`, SIZE_MAP[s].padding)),
  ...SIZES.map((s) => pad(`.omni-inp-in-f${SZ[s]}${OR} input`, FLOATING_SIZE_MAP[s].padding)),
  ...SIZES.map((s) => `.omni-inp-in-s${SZ[s]}${OR} input{line-height:${SIZE_MAP[s].lineHeight}}`),
  `.omni-inp-in${OR} input{color:inherit}`,
  ...PH(`.omni-inp-in${OR} input`, 'color:var(--Quiet);opacity:1'),
  `.omni-inp-start${OR} input{padding-left:0}`,
  `.omni-inp-fstart${OR} input{padding-left:0}`,
  // `& textarea` — multiline only (a single-line field has none).
  `.omni-inp-ml${OR} textarea{flex-basis:100%;order:0;padding-top:var(--Input-Padding, 12px);padding-bottom:var(--Input-Padding, 12px);`
    + 'padding-left:var(--Sizing-1, 8px);padding-right:var(--Sizing-1, 8px);color:inherit}',
  ...SIZES.map((s) => `.omni-inp-ml-${SZ[s]}${OR} textarea{line-height:${SIZE_MAP[s].lineHeight}}`),
  ...RESIZE.map((r) => `.omni-inp-rz-${r}${OR} textarea{resize:${r}}`),
  ...PH(`.omni-inp-ml${OR} textarea`, 'color:var(--Quiet);opacity:1'),
  `.omni-inp-mlff${OR} textarea{padding-top:var(--Sizing-2, 16px);padding-bottom:var(--Sizing-2, 16px)}`,
  // Adornments
  `.omni-inp-std${OR} .MuiInputAdornment-root{max-height:none;height:auto;align-self:stretch;-webkit-box-align:center;align-items:center}`,
  `.omni-inp-fad${OR} .MuiInputAdornment-root{max-height:none;height:auto;align-self:center;margin-top:0;margin-bottom:0}`,
  `.omni-inp-ml${OR} .MuiInputAdornment-root{max-height:none;height:var(--Button-Height, 32px);align-self:auto;margin:0}`,
  `${TF}${OR} .MuiInputAdornment-positionStart > .MuiSvgIcon-root{color:var(--Icons-Default, var(--Text))}`,
  `.omni-inp-std${OR} .MuiInputAdornment-positionStart{margin-left:var(--Input-Padding, 12px);margin-right:var(--Sizing-1-and-Half, 12px)}`,
  ...SIZES.map((s) => `.omni-inp-std-${SZ[s]}${OR} .MuiInputAdornment-positionStart .MuiSvgIcon-root{font-size:${SIZE_MAP[s].iconSize}}`),
  ...SIZES.map((s) => {
    const sc = FLOATING_SIZE_MAP[s];
    return `.omni-inp-fad-${SZ[s]}${OR} .MuiInputAdornment-positionStart{margin-left:${floatingLabelGeometry(sc, false).padX};`
      + `margin-right:${ADORNMENT_GAP}px;width:${sc.iconSize}px;min-width:${sc.iconSize}px;-webkit-box-pack:center;justify-content:center}`;
  }),
  ...SIZES.map((s) => `.omni-inp-fad-${SZ[s]}${OR} .MuiInputAdornment-positionStart .MuiSvgIcon-root{font-size:${FLOATING_SIZE_MAP[s].iconSize}px}`),
  `.omni-inp-ml${OR} .MuiInputAdornment-positionStart{order:1;margin:0}`,
  `.omni-inp-std${OR} .MuiInputAdornment-positionEnd,.omni-inp-fad${OR} .MuiInputAdornment-positionEnd{margin-left:0;margin-right:0}`,
  `.omni-inp-ml${OR} .MuiInputAdornment-positionEnd{order:2;margin:0 0 0 auto}`,
  // The floating label: Body at rest, the Floating-Label style raised.
  `${TF} .MuiInputLabel-root{color:var(--Quiet);font-family:var(--Font-Families-Body, var(--Body-Font-Family));transform-origin:top left;`
    + 'transition:transform 0.15s ease, font-size 0.15s ease, color 0.15s ease;transform:translate(var(--_inp-lx), var(--_inp-ry))}',
  ...SIZES.map((s) => `.omni-inp-l${SZ[s]} .MuiInputLabel-root{${fontDecls(tokenFont((FLOATING_LABEL_STYLE[s]).resting))}}`),
  `${TF} .MuiInputLabel-root.MuiInputLabel-shrink{transform:translate(var(--_inp-lx), 2px);color:var(--Quiet)}`,
  ...SIZES.map((s) => `.omni-inp-l${SZ[s]} .MuiInputLabel-root.MuiInputLabel-shrink{${fontDecls(floatingLabelFont(FLOATING_LABEL_STYLE[s].shrunk))}}`),
  `${TF} .MuiInputLabel-root.Mui-focused{color:var(--Text)}`,
  `${TF} .MuiInputLabel-root.Mui-disabled{color:var(--Quiet)}`,
  /* Focus raises a floating TEXTAREA's text as well as its label. */
  '.omni-inp-mlfoc:focus-within textarea{padding-top:var(--Sizing-2, 16px);padding-bottom:var(--Sizing-2, 16px)}',
  /* Figma raises the floating label on hover too; disabled, on focus only. */
  ...SIZES.map((s) => {
    const k = SZ[s];
    const decls = `transform:translate(var(--_inp-lx), 2px);${fontDecls(floatingLabelFont(FLOATING_LABEL_STYLE[s].shrunk))}`;
    return `.omni-inp-raise-${k}:hover .MuiInputLabel-root,.omni-inp-raise-${k}:active .MuiInputLabel-root,`
      + `.omni-inp-raise-${k}:focus-within .MuiInputLabel-root,.omni-inp-raiseoff-${k}:focus-within .MuiInputLabel-root{${decls}}`;
  }),
  `${TF} .MuiOutlinedInput-notchedOutline legend{display:none}`,
  `${TF} .MuiOutlinedInput-notchedOutline{top:0}`,
  `${TF} .MuiOutlinedInput-root.Mui-focused{outline:none}`,
  `${TF} .MuiOutlinedInput-root:focus-within{outline:none}`,

  /* Prefix / suffix text, set tight against the value. */
  '.omni-inp-affix{color:var(--Text);font:inherit;white-space:nowrap;flex-shrink:0}',
  '.omni-ad.omni-inp-ml0{margin-left:0}',
  '.omni-ad.omni-inp-mr0{margin-right:0}',

  /* Validation message and helper text, under the field. */
  '.omni-inp-msg{display:flex;-webkit-box-align:center;align-items:center;gap:6px;margin-top:4px;margin-left:2px}',
  `.omni-inp-vicon{${SVG_ICON_DECLS};flex-shrink:0}`,
  ...SIZES.map((s) => `.omni-inp-vicon-s${SZ[s]}{font-size:${SIZE_MAP[s].iconSize}}`),
  ...SIZES.map((s) => `.omni-inp-vicon-f${SZ[s]}{font-size:${FLOATING_SIZE_MAP[s].iconSize}px}`),
  ...Object.entries(VALIDATION_COLORS).map(([v, c]) => `.omni-inp-vicon-${v}{color:${c.icon}}`),
  /* Two classes: the helper's own base rule is one, in another sheet. */
  '.omni-ht.omni-inp-ht{margin:0;font-size:12px}',
  '.omni-ht.omni-inp-ht-sm{font-size:11px}',
  ...Object.entries(VALIDATION_COLORS).map(([v, c]) => `.omni-ht.omni-inp-ht-${v}{color:${c.text}}`),
  '.omni-ht.omni-inp-help{color:var(--Quiet);margin-top:4px;margin-left:2px}',
].join('\n'));

// --- Component ---------------------------------------------------------------

let warnedResizeWithEnd = false;
let warnedVariant = false;

export function Input(allProps) {
  if (MUI_ONLY.some((k) => allProps[k] !== undefined)) return <InputMui {...allProps} />;
  return <InputStatic {...allProps} />;
}

function InputStatic({
  variant = 'default',
  size = 'medium',
  label,
  labelPosition = 'standard',
  /* FormLabel's Type: 'default' | 'required' | 'optional'. */
  labelType = 'default',
  placeholder,
  helperText,
  validation,
  validationMessage,
  disabled = false,
  // Caller-supplied id wins; otherwise one is generated so the label can point
  // at the field. Named idProp because `id` would shadow it inside the body.
  id: idProp,
  value,
  defaultValue,
  onChange,
  name,
  type = 'text',
  multiline = false,
  rows,
  maxRows,
  /* Textareas resize, and the browser default is `both` — a user can drag one
     wider than its column and break the layout. Vertical gives more room for
     text with no effect on the surrounding grid.
     `none` is deliberately not the default: enlarging a textarea to read back
     what you have typed is a real affordance for low-vision and motor users,
     and removing it without offering auto-grow just makes long input painful.
     Pair `none` with maxRows if you do set it. Ignored when not multiline.

     With an ACTIONS ROW (a start or end decorator) the default is no grip and
     the field GROWS instead — from `rows` up to `maxRows` (8), then scrolls:
     the composer pattern. The grip sits in the corner the end decorator owns,
     and auto-grow is the version keyboard users get too. A grip together
     with an end decorator is refused (dev warning) rather than drawn over it. */
  resize: resizeProp,
  startAdornment,
  endAdornment,
  /* Figma's Prefix and Suffix: text set tight against the value ("$" 100,
     100 "%"), Body in --Text — distinct from the Start Icon (startAdornment)
     and End Decorator (endAdornment), which sit 12px away. Single-line. */
  prefix,
  suffix,
  fullWidth = false,
  className = '',
  sx = {},
  // Extract aria props explicitly so they go to <input> not the outer wrapper
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  inputProps: inputPropsProp = {},
  onFocus,
  onBlur,
  ...props
}) {
  useStaticStyles('omni-input');
  const isFloating = labelPosition === 'floating';
  const isLeft = labelPosition === 'left';

  if (process.env.NODE_ENV !== 'production' && variant !== 'default' && !warnedVariant) {
    warnedVariant = true;
    // eslint-disable-next-line no-console
    console.warn('[Input] variant="' + variant + '" was removed — a field has one edge, the surface\'s Border. '
      + 'Colour on a field edge means validation; use validation="error | warning | success | info".');
  }
  const sizeKey = (isFloating ? FLOATING_SIZE_MAP : SIZE_MAP)[size] ? size : 'medium';
  const sizeConfig = isFloating ? FLOATING_SIZE_MAP[sizeKey] : SIZE_MAP[sizeKey];
  const k = SZ[sizeKey];

  /* The standard label must be ASSOCIATED with the field, not merely adjacent:
     it points at the field by id (htmlFor), generated when none is given. */
  const generatedId = useId();
  const inputId = idProp || generatedId;

  /* The floating label rests IN the field until there is something to make
     room for: focus or content. MUI counted a start adornment as a reason to
     float, so an empty field with an icon showed its label already raised.
     Owning the flag puts the label back where Figma's empty field draws it. */
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState(() => defaultValue != null && String(defaultValue) !== '');
  const filled = value != null ? String(value) !== '' : typed;
  const handleChange = (e) => {
    if (value == null) setTyped(e.target.value !== '');
    if (onChange) onChange(e);
  };

  const hasActions = multiline && !!(startAdornment || endAdornment);
  let resize = resizeProp ?? (hasActions ? 'none' : 'vertical');
  if (multiline && endAdornment && resize !== 'none') {
    if (process.env.NODE_ENV !== 'production' && !warnedResizeWithEnd) {
      warnedResizeWithEnd = true;
      // eslint-disable-next-line no-console
      console.warn('[Input] resize="' + resize + '" with an endAdornment: the grip would sit on the end '
        + 'decorator, so it is turned off. The field grows with its content instead (rows → maxRows).');
    }
    resize = 'none';
  }
  // Growing, not fixed: the textarea grows only between minRows and maxRows.
  const rowProps = hasActions && resize === 'none'
    ? { minRows: rows ?? 1, maxRows: maxRows ?? 8 }
    : { rows, maxRows };

  const geo = floatingLabelGeometry(sizeConfig, !!startAdornment && !multiline);
  /* A TEXT AREA's floating label sits on the first line, not centred in a
     field, and never moves for a decorator. */
  const labelX = multiline ? 'calc(var(--Sizing-1, 8px) * 2)' : geo.labelX;
  const restingY = multiline ? 'var(--Input-Padding, 12px)' : geo.restingY + 'px';

  const validationConfig = validation ? VALIDATION_COLORS[validation] : null;

  // Pass aria attributes to the actual <input> element
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
    ...(ariaRequired    && { 'aria-required': ariaRequired }),
    ...(ariaInvalid     && { 'aria-invalid': ariaInvalid }),
  };

  /* Standard / left label: the lib's FormLabel, Figma's Form-Label. */
  const renderStandardLabel = () => {
    if (!label || isFloating) return null;
    return (
      <FormLabel
        htmlFor={inputId}
        type={labelType}
        disabled={disabled}
        sx={{
          ...(isLeft ? { flexShrink: 0 } : { marginBottom: 'var(--Sizing-Half, 4px)' }),
          ...(disabled && { opacity: 'var(--Disabled, 0.38)' }),
        }}
      >
        {label}
      </FormLabel>
    );
  };

  const renderEndAdornment = () => {
    const suffixEl = !multiline && suffix != null && suffix !== ''
      ? <span className="inp-suffix MuiBox-root omni-inp-affix">{suffix}</span> : null;
    if (!endAdornment && !suffixEl) return undefined;
    return (
      <>
        {/* No gap before the suffix: it belongs to the value. */}
        {suffixEl && <FieldAdornment position="end" className="omni-inp-ml0">{suffixEl}</FieldAdornment>}
        {endAdornment && <FieldAdornment position="end">{endAdornment}</FieldAdornment>}
      </>
    );
  };
  const renderStartAdornment = () => {
    const prefixEl = !multiline && prefix != null && prefix !== ''
      ? <span className="inp-prefix MuiBox-root omni-inp-affix">{prefix}</span> : null;
    if (!startAdornment && !prefixEl) return undefined;
    return (
      <>
        {startAdornment && <FieldAdornment position="start">{startAdornment}</FieldAdornment>}
        {/* No gap after the prefix: it belongs to the value. */}
        {prefixEl && <FieldAdornment position="start" className="omni-inp-mr0">{prefixEl}</FieldAdornment>}
      </>
    );
  };

  const floatStart = isFloating && !!startAdornment;
  const sm = isFloating ? 'f' + k : 's' + k;
  const fieldClass = [
    'omni-inp-tf', 'omni-inp-' + sm, 'omni-inp-l' + k,
    // Multiline's own align-items replaced the floating one in the sx object.
    isFloating && !multiline && 'omni-inp-flt',
    !floatStart && 'omni-inp-in omni-inp-in-' + sm,
    !isFloating && startAdornment && 'omni-inp-start',
    floatStart && 'omni-inp-fstart',
    !multiline && (isFloating ? 'omni-inp-fad omni-inp-fad-' + k : 'omni-inp-std omni-inp-std-' + k),
    multiline && 'omni-inp-ml omni-inp-ml-' + k + ' omni-inp-rz-' + resize,
    isFloating && filled && multiline && 'omni-inp-mlff',
    isFloating && multiline && !disabled && 'omni-inp-mlfoc',
    isFloating && (disabled ? 'omni-inp-raiseoff-' + k : 'omni-inp-raise-' + k),
  ].filter(Boolean).join(' ');

  const wrapperProps = {
    className: 'inp-default ' + className + ' MuiBox-root omni-inp' + (fullWidth ? ' omni-inp-full' : '')
      + (isLeft && label ? ' omni-inp-left' : ''),
  };
  const body = (
    <>
      {renderStandardLabel()}

      {/* Outer border shell — the edge as an overlay; radius by size. */}
      <div className={'inp-shell MuiBox-root omni-inp-shell'
        + (sizeKey !== 'medium' ? ' omni-inp-shell-' + k : '')
        + (validationConfig ? ' omni-inp-v omni-inp-v-' + validation : '')
        + (disabled ? ' omni-inp-shell-off' : ' omni-inp-on')}
      >
        {/* Inner wrapper. No data-surface — the input inherits the parent
            surface; the field's own --Hover gives it its affordance. */}
        <div className="MuiBox-root">
          <StaticTextField
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={(e) => { setFocused(true); if (onFocus) onFocus(e); }}
            onBlur={(e) => { setFocused(false); if (onBlur) onBlur(e); }}
            labelShrink={isFloating ? (focused || filled) : undefined}
            name={name}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            id={inputId}
            multiline={multiline}
            {...(multiline ? rowProps : {})}
            fullWidth
            label={isFloating ? label : undefined}
            variant="outlined"
            size={size === 'small' ? 'small' : 'medium'}
            inputProps={mergedInputProps}
            InputProps={{
              startAdornment: renderStartAdornment(),
              endAdornment: renderEndAdornment(),
            }}
            className={fieldClass}
            {...props}
            style={{ '--_inp-lx': labelX, '--_inp-ry': restingY, ...props.style }}
          />
        </div>
      </div>

      {(validation && validationMessage) ? (
        <div className="MuiBox-root omni-inp-msg">
          {V_ICON[validation] && (
            <Glyph name={V_ICON[validation]} className={'omni-inp-vicon omni-inp-vicon-' + sm + ' omni-inp-vicon-' + validation} />
          )}
          <HelperText className={'omni-inp-ht' + (size === 'small' ? ' omni-inp-ht-sm' : '') + ' omni-inp-ht-' + validation}>
            {validationMessage}
          </HelperText>
        </div>
      ) : helperText ? (
        <HelperText className={'omni-inp-ht omni-inp-help' + (size === 'small' ? ' omni-inp-ht-sm' : '')}>
          {helperText}
        </HelperText>
      ) : null}
    </>
  );
  if (hasSx(sx)) return <SxBox sx={sx} {...wrapperProps}>{body}</SxBox>;
  return <div {...wrapperProps}>{body}</div>;
}


// --- Convenience Exports -----------------------------------------------------
/* The colour-named exports (PrimaryOutlineInput … ErrorOutlineInput,
   OutlineInput, PrimaryInput) are DELETED with the colour edges, so a stale
   import fails at build rather than rendering something other than its name.
   None was exported from the package root (only Input, as TextInput). */

export default Input;