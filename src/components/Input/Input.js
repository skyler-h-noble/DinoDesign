// src/components/Input/Input.js
import React, { useId, useState } from 'react';
import {
  TextField as MuiTextField,
  FormHelperText,
  InputAdornment,
  Box,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FormLabel } from '../FormLabel/FormLabel';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2 } from '../_shadows';

/**
 * Input Component
 * Full-featured text input with complete design system integration
 *
 * --- SURFACE -----------------------------------------------------------------
 *   data-surface="Surface-Bright" on wrapper and input root (light variant: Surface-Dim)
 *
 * --- VARIANTS ----------------------------------------------------------------
 *
 * OUTLINE — variant="{color}-outline"  (default)
 *   BG:         var(--Background)
 *   Border:     2px solid var(--Buttons-{Color}-Border)
 *   Text:       var(--Text)
 *   Focus:      border intensifies
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

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
function outlineStyles(color) {
  const C = cap(color);
  return {
    bg: 'var(--Hover)',
    border: 'var(--Buttons-' + C + '-Border)',
    hoverBorder: 'var(--Buttons-' + C + '-Hover)',
    pressedBorder: 'var(--Buttons-' + C + '-Pressed)',
    text: 'var(--Text)',
    focusBg: 'var(--Hover)',
  };
}

/* The DEFAULT field is Figma's Input: the surface's own --Border edge (the 3:1
   role for a clickable outline), unchanged by hover and press. The palette
   variants ({color}-outline) stay for a field that wants a coloured edge. */
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

function buildVariantMap() {
  const map = { default: defaultStyles() };
  COLORS.forEach((color) => {
    map[color + '-outline'] = outlineStyles(color);
  });
  map['outline'] = outlineStyles('primary');
  return map;
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

const VALIDATION_ICONS = {
  info:    InfoOutlinedIcon,
  success: CheckCircleOutlineIcon,
  warning: WarningAmberIcon,
  error:   ErrorOutlineIcon,
};

const VALIDATION_COLORS = {
  info:    { border: 'var(--Buttons-Info-Border)',    hoverBorder: 'var(--Buttons-Info-Hover)',    pressedBorder: 'var(--Buttons-Info-Pressed)',    icon: 'var(--Icons-Info)',    text: 'var(--Hotlink)' },
  success: { border: 'var(--Buttons-Success-Border)', hoverBorder: 'var(--Buttons-Success-Hover)', pressedBorder: 'var(--Buttons-Success-Pressed)', icon: 'var(--Icons-Success)', text: 'var(--Text-Success)' },
  warning: { border: 'var(--Buttons-Warning-Border)', hoverBorder: 'var(--Buttons-Warning-Hover)', pressedBorder: 'var(--Buttons-Warning-Pressed)', icon: 'var(--Icons-Warning)', text: 'var(--Text-Warning)' },
  error:   { border: 'var(--Buttons-Error-Border)',   hoverBorder: 'var(--Buttons-Error-Hover)',   pressedBorder: 'var(--Buttons-Error-Pressed)',   icon: 'var(--Icons-Error)',   text: 'var(--Text-Error)' },
};

// --- Component ---------------------------------------------------------------

let warnedResizeWithEnd = false;

export function Input({
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
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['default'];
  const isFloating = labelPosition === 'floating';
  const isLeft = labelPosition === 'left';

  /* A *-light variant now falls through to primary-outline via the || above,
     which is the right rendering but a silent one — so say so once in dev.
     There was also an `isLight` here, read by no code path: the same dead
     flag Select had, and the same reason the variant looked supported. */
  if (process.env.NODE_ENV !== 'production' && /-light$|^light$/.test(variant)) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Input] variant="' + variant + '" was removed. It differed from '
      + '"' + variant.replace(/-?light$/, '') + '-outline" only by a token no '
      + 'design system publishes, so the two rendered identically. For a '
      + 'lighter field use data-surface="Surface-Brightest" on its container.',
    );
  }
  const sizeConfig = isFloating
    ? (FLOATING_SIZE_MAP[size] || FLOATING_SIZE_MAP.medium)
    : (SIZE_MAP[size] || SIZE_MAP.medium);

  /* The standard label must be ASSOCIATED with the field, not merely adjacent.
   *
   * It rendered as a bare <label> with no htmlFor, and the input is its sibling
   * rather than its child — so there was no association, explicit or implicit.
   * With labelPosition="standard", which is the DEFAULT, a screen reader
   * announced the field as unlabelled while sighted users saw the label sitting
   * right above it. Invisible in the render, passes every visual check.
   *
   * It surfaced only when TextArea was collapsed onto Input: the old TextArea
   * wrapped MUI directly and MUI wires label-to-input itself, so its test
   * started failing the moment it stopped doing that. The floating label was
   * never affected — MUI owns that one. */
  const generatedId = useId();
  const inputId = idProp || generatedId;

  /* The floating label rests IN the field until there is something to make
     room for: focus or content. MUI decides this itself and counts a start
     adornment as a reason to float, so an empty field with an icon showed its
     label already raised — nothing typed, nothing focused. Owning the flag
     puts the label back where Figma's empty field draws it. */
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
  // Growing, not fixed: MUI grows a textarea only between minRows and maxRows.
  const rowProps = hasActions && resize === 'none'
    ? { minRows: rows ?? 1, maxRows: maxRows ?? 8 }
    : { rows, maxRows };

  const { labelX, padX, restingY, shrunkY } = floatingLabelGeometry(sizeConfig, !!startAdornment);
  const labelStyle = FLOATING_LABEL_STYLE[size] || FLOATING_LABEL_STYLE.medium;

  // Extract color name from variant (e.g. "primary-outline" → "primary")
  /* There was a `colorName`/`C` pair derived from the variant STRING here,
     used by nothing. It was also wrong: variant 'outline' has no '-outline'
     suffix to strip, so it yielded --Buttons-Outline-*, a family that does not
     exist. The state tokens below come off the variant-map entry instead, which
     is built from the palette argument and therefore cannot disagree with the
     border it sits next to. */
  const activeTextColor = 'var(--Text)';


  // Validation state overrides border color
  const validationConfig = validation ? VALIDATION_COLORS[validation] : null;
  const ValidationIcon = validation ? VALIDATION_ICONS[validation] : null;
  const stateSource = validationConfig || styles;
  const effectiveBorder = stateSource.border;

  // Pass aria attributes to the actual <input> element
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
    ...(ariaRequired    && { 'aria-required': ariaRequired }),
    ...(ariaInvalid     && { 'aria-invalid': ariaInvalid }),
  };

  /* Standard / left label: the lib's FormLabel, Figma's Form-Label — the
     Label type style in --Text, with the required / optional marker. It was a
     Body at a literal 13px / weight 500, the label style nothing else used. */
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

  // Build end adornment
  const renderEndAdornment = () => {
    if (!endAdornment) return undefined;
    return (
      <InputAdornment position="end">
        {endAdornment}
      </InputAdornment>
    );
  };

  return (
    <Box
      className={'inp-' + variant + ' ' + className}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        /* Left label: the label in its own column, centred on the field, and
           the field plus anything under it (helper, validation) in the second,
           so a message lines up with the field rather than the label. */
        ...(isLeft && label && {
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          columnGap: 'var(--Sizing-1, 8px)',
          alignItems: 'center',
          '& > :not(.form-label-row)': { gridColumn: 2 },
        }),
        ...sx,
      }}
    >
      {renderStandardLabel()}

      {/* Outer border shell — provides contrast against page background.
          Radius uses the size-aware Input-Radius token so a small input is
          rounded by its own height, not the medium button's. */}
      <Box className="inp-shell" sx={{
        /* The edge is an OVERLAY, not a border — Figma's inside stroke, drawn
           on top and taking no space. As a border it added 2px to the field
           (34 against 32) and pushed the icon, the text and a 32px end button
           in by a pixel. */
        position: 'relative',
        border: 'none',
        '&::after': {
          content: '""', position: 'absolute', inset: 0, pointerEvents: 'none',
          border: '1px solid ' + effectiveBorder, borderRadius: 'inherit',
          transition: 'border-color 0.15s ease-in-out',
        },
        borderRadius: size === 'small'
          ? 'var(--Sm-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))'
          : size === 'large'
            ? 'var(--Lg-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))'
            : 'var(--Input-Radius, var(--Style-Border-Radius))',
        overflow: 'hidden',
        transition: 'border-color 0.15s ease-in-out',
        boxShadow: 'none',
        /* A disabled field takes no state. Guarding here rather than inside
           each selector matters: :hover still MATCHES a disabled input (only
           pointer-events would stop it), so an unguarded rule would light up
           a control that cannot be used. */
        ...(!disabled && {
          '&:hover::after': { borderColor: stateSource.hoverBorder },
          '&:active::after': { borderColor: stateSource.pressedBorder },
          /* Figma's Hover, Pressed and Focus-Visible fields draw their text in
             --Text, placeholder included; only the resting field is --Quiet. */
          '&:hover .MuiOutlinedInput-root, &:active .MuiOutlinedInput-root, &:focus-within .MuiOutlinedInput-root': { color: activeTextColor },
          /* The FILL is the field's hover, by design: it rests on --Hover (a
             consistent tint against any surface), deepens to --Pressed under
             the pointer, and returns to --Hover while pressed. */
          '&:hover .MuiOutlinedInput-root': { backgroundColor: 'var(--Pressed)' },
          '&:active .MuiOutlinedInput-root': { backgroundColor: 'var(--Hover)' },
        }),
        /* 2px ring 1px outside — Figma's Focus-Visible frame sits 3px out with
           a 2px inside stroke, the same ring as every other control. */
        '&:focus-within': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '1px',
        },
        // Disabled dims the WHOLE field (Figma's variant opacity), edge included.
        ...(disabled && { opacity: 'var(--Disabled, 0.38)' }),
      }}>

        {/* Inner wrapper. No data-surface — the input inherits the parent
            surface so it doesn't bleed the brand --Background through. The
            field itself uses --Hover (a subtle tint of the parent surface)
            for its background, which gives a visible affordance without
            fighting saturated dark surfaces. */}
        <Box>
          <MuiTextField
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={(e) => { setFocused(true); if (onFocus) onFocus(e); }}
            onBlur={(e) => { setFocused(false); if (onBlur) onBlur(e); }}
            InputLabelProps={isFloating ? { shrink: focused || filled } : undefined}
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
              startAdornment: startAdornment ? (
                <InputAdornment position="start">{startAdornment}</InputAdornment>
              ) : undefined,
              endAdornment: renderEndAdornment(),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--Hover)',
                color: 'var(--Quiet)',
                fontSize: sizeConfig.fontSize,
                fontFamily: 'var(--Body-Font-Family, var(--Font-Family-Body, inherit))',
                /* The field is Button-Height OVERALL, as Figma draws it: its
                   inside stroke takes no space, so the shell's 1px border comes
                   out of the height rather than being added to it (34 → 32). */
                // Button-Height overall: the edge is an overlay, so nothing comes off it.
                minHeight: multiline ? 'auto' : sizeConfig.height,
                padding: 0,
                borderRadius: 0,
                transition: 'color 0.15s ease-in-out',
                /* Stretch, so the adornments can take the same vertical
                   padding as the input and land on its text band by
                   construction.

                   This was `flex-end` plus a marginBottom on each adornment —
                   two hacks pulling opposite ways: the row bottom-aligned
                   everything, then a fixed 8px lifted the adornments back up.
                   Neither number knew the input's real padding, so the
                   adornment missed the text by whatever the size config said
                   that day, and every size missed it differently. */
                ...(isFloating && { alignItems: 'stretch' }),

                '& fieldset': {
                  border: 'none',
                },

                '&.Mui-focused': {
                  color: activeTextColor,
                },

                // Filled state — text color changes
                '&:not(.Mui-focused) .MuiOutlinedInput-input:not(:placeholder-shown)': {
                  color: activeTextColor,
                },

                '&.Mui-disabled': {
                  // The shell carries the 38%; dimming here too would double it.
                  opacity: 1,
                  color: 'var(--Quiet)',
                  /* MUI paints disabled text its own rgba(0,0,0,.38) — through
                     -webkit-text-fill-color too — over the design's --Quiet. */
                  /* A disabled field keeps a typed VALUE in --Text (the whole
                     field is already at 38%); only the placeholder is --Quiet. */
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: 'inherit', WebkitTextFillColor: 'currentColor',
                    '&:not(:placeholder-shown)': { color: activeTextColor },
                  },
                  cursor: 'not-allowed',
                },

                '& input': {
                  padding: sizeConfig.padding,
                  /* Beside a start icon the icon's gap is the whole space — set
                     here, in the one '& input' rule, because a second key of the
                     same name REPLACES this object rather than merging into it
                     (it dropped the padding and MUI's 16.5px made the row 56). */
                  ...(!isFloating && startAdornment && { paddingLeft: 0 }),
                  lineHeight: sizeConfig.lineHeight,
                  color: 'inherit',
                  '&::placeholder': { color: 'var(--Quiet)', opacity: 1 },
                },

                '& textarea': {
                  padding: sizeConfig.padding,
                  ...(!isFloating && startAdornment && { paddingLeft: 0 }),
                  color: 'inherit',
                  resize,
                  '&::placeholder': { color: 'var(--Quiet)', opacity: 1 },
                },


                /* Prefix / suffix text stays Quiet; an ICON is Figma's Icons/Icon (the Default mode → --Icons-Default),
                   the same as every other icon on the surface. */
                '& .MuiInputAdornment-root': { color: 'var(--Quiet)' },
                '& .MuiInputAdornment-positionStart > .MuiSvgIcon-root': { color: 'var(--Icons-Default, var(--Text))' },

                /* Standard field: Figma insets the start icon by the input
                   padding and leaves Sizing-1-and-Half (12) before the text;
                   the end decorator sits the same padding in from the right at
                   full field height, so an icon button fits its own 32. */
                ...(!isFloating && {
                  '& .MuiInputAdornment-root': { maxHeight: 'none', height: 'auto', alignSelf: 'stretch', alignItems: 'center' },
                  '& .MuiInputAdornment-positionStart': {
                    marginLeft: 'var(--Input-Padding, 12px)',
                    marginRight: 'var(--Sizing-1-and-Half, 12px)',
                    '& .MuiSvgIcon-root': { fontSize: sizeConfig.iconSize },
                  },
                  '& .MuiInputAdornment-positionEnd': { marginLeft: 0, marginRight: 'var(--Input-Padding, 12px)' },
                }),

                // Start adornment positioning when floating — gives it some
                // breathing room from the left edge and pushes it up by the
                // input's bottom padding so it centers with the input text.
                ...(isFloating && {
                  /* MUI caps an adornment at max-height 2em and centres it in
                     its own box, which is why it could never line up with a
                     text row that sits inside 22px of top padding. Releasing
                     the cap and giving it the input's own padTop/padBottom
                     puts its centre exactly where the text's centre is, at
                     every size, with no number to keep in sync. */
                  /* Centred on the FIELD, as Figma draws them — the 20px icon at
                     y 18 and the 32px decorator at y 12 of a 56 field. They used
                     to take the text band's padding, which centred them on the
                     typed text (low in a floating field) and, around a 32px
                     button, made the field 60 tall. */
                  '& .MuiInputAdornment-root': {
                    maxHeight: 'none',
                    height: 'auto',
                    alignSelf: 'center',
                    marginTop: 0,
                    marginBottom: 0,
                  },
                  '& .MuiInputAdornment-positionStart': {
                    /* The same token the text and label use. A literal here
                       put the adornment at 14px while the text it precedes
                       started at var(--Input-Padding) — the same mismatch one
                       element over. */
                    marginLeft: padX,
                    marginRight: ADORNMENT_GAP + 'px',
                    /* Pinned so floatingLabelGeometry's labelX is true rather
                       than approximate — the label's x is computed from
                       iconSize, so the adornment has to actually BE iconSize
                       wide whatever glyph or icon is inside it. */
                    width: sizeConfig.iconSize + 'px',
                    minWidth: sizeConfig.iconSize + 'px',
                    justifyContent: 'center',
                    '& .MuiSvgIcon-root': { fontSize: sizeConfig.iconSize + 'px' },
                  },
                  // The input padding from the right, as the standard field.
                  '& .MuiInputAdornment-positionEnd': {
                    marginLeft: 0,
                    marginRight: padX,
                  },
                  /* The gap is the adornment's marginRight alone. Splitting it
                     with an input paddingLeft is what let the two halves drift
                     out of step with the label. */
                  ...(startAdornment && {
                    '& input': { paddingLeft: 0 },
                    '& textarea': { paddingLeft: 0 },
                  }),
                }),
                /* MULTILINE is Figma's TextArea: the text on top (Input-Padding
                   above and below, the frame's Sizing-1 either side) and an
                   ACTIONS row under it — the start decorator at the left, the
                   end decorator at the right — inside the same frame, which is
                   never shorter than Text-Area-Min-Height. MUI already renders
                   both adornments inside the root; wrapping the row and giving
                   the text the whole first line puts them on the second. */
                ...(multiline && {
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  alignContent: 'flex-start',
                  padding: '0 var(--Sizing-1, 8px)',
                  minHeight: 'var(--Text-Area-Min-Height, 88px)',
                  '& textarea': {
                    flexBasis: '100%',
                    order: 0,
                    padding: 'var(--Input-Padding, 12px) 0',
                    color: 'inherit',
                    resize,
                    '&::placeholder': { color: 'var(--Quiet)', opacity: 1 },
                  },
                  '& .MuiInputAdornment-root': {
                    maxHeight: 'none', height: 'var(--Button-Height, 32px)', alignSelf: 'auto',
                    margin: 0,
                  },
                  '& .MuiInputAdornment-positionStart': { order: 1, margin: 0 },
                  '& .MuiInputAdornment-positionEnd': { order: 2, margin: '0 0 0 auto' },
                }),
              },

              '& .MuiInputLabel-root': {
                color: 'var(--Quiet)',
                fontFamily: 'var(--Font-Families-Body, var(--Body-Font-Family))',
                ...tokenFont(labelStyle.resting),
                transformOrigin: 'top left',
                // font-size animates too, since the shrink is a real style
                // change now rather than a scale on the resting one.
                transition: 'transform 0.15s ease, font-size 0.15s ease, color 0.15s ease',
                /* Both offsets are COMPUTED from the size config. They used to
                 * be the constants 16px and 32px, which were tuned for one size
                 * and wrong at the other two.
                 *
                 * X — the resting label must sit exactly where the input text
                 * sits, or it visibly jumps sideways when it shrinks. With a
                 * start adornment the text begins after it, so the label has to
                 * clear the SAME distance the adornment actually occupies:
                 * its marginLeft, its icon, its marginRight. The old flat 32
                 * was 8px too far at large and 12px too far at small, because
                 * the icon is 20/18/16 — it got further wrong as the icon got
                 * smaller.
                 *
                 * Y — the resting label is vertically CENTRED in the field.
                 * A constant 16px centred the small field and left large 4px
                 * high, which is why the error grew with the size. */
                transform: 'translate(' + labelX + ', ' + restingY + 'px)',
                '&.MuiInputLabel-shrink': {
                  /* Shrunk, it sits in the field's top padding, bottom-aligned
                     to where the text begins. No scale() — it becomes a real
                     Label style, weight and tracking included. */
                  transform: 'translate(' + labelX + ', ' + shrunkY + 'px)',
                  ...floatingLabelFont(labelStyle.shrunk),
                  color: 'var(--Quiet)',
                },
                '&.Mui-focused': { color: activeTextColor },
                // The shell already dims the whole field to 38%; dimming here too made it 14%.
                '&.Mui-disabled': { color: 'var(--Quiet)' },
              },

              /* Focus raises the label in CSS as well as through the shrink
                 flag, so the raised label is a property of :focus-within — the
                 same selector the ring uses, and one a forced-state preview can
                 reach without real focus. */
              ...(isFloating && {
                /* Figma raises it on HOVER too: the empty field clears its
                   resting label out of the way as the pointer arrives, ready
                   for typing. Not when disabled — nothing will be typed. */
                [disabled ? '&:focus-within .MuiInputLabel-root' : '&:hover .MuiInputLabel-root, &:active .MuiInputLabel-root, &:focus-within .MuiInputLabel-root']: {
                  transform: 'translate(' + labelX + ', ' + shrunkY + 'px)',
                  ...floatingLabelFont(labelStyle.shrunk),
                },
              }),
              '& .MuiOutlinedInput-notchedOutline legend': { display: 'none' },
              '& .MuiOutlinedInput-notchedOutline': { top: 0 },

              '& .MuiOutlinedInput-root.Mui-focused': { outline: 'none' },
              '& .MuiOutlinedInput-root:focus-within': { outline: 'none' },
            }}
            {...props}
          />
        </Box>
      </Box>

      {(validation && validationMessage) ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', marginLeft: '2px' }}>
          {ValidationIcon && (
            <ValidationIcon sx={{ fontSize: sizeConfig.iconSize, color: validationConfig.icon, flexShrink: 0 }} />
          )}
          <FormHelperText sx={{ color: validationConfig.text, fontSize: size === 'small' ? '11px' : '12px', margin: 0 }}>
            {validationMessage}
          </FormHelperText>
        </Box>
      ) : helperText ? (
        <FormHelperText sx={{ color: 'var(--Quiet)', fontSize: size === 'small' ? '11px' : '12px', marginTop: '4px', marginLeft: '2px' }}>
          {helperText}
        </FormHelperText>
      ) : null}
    </Box>
  );
}

// --- Convenience Exports -----------------------------------------------------

export const PrimaryOutlineInput   = (p) => <Input variant="primary-outline"   {...p} />;
export const SecondaryOutlineInput = (p) => <Input variant="secondary-outline" {...p} />;
export const TertiaryOutlineInput  = (p) => <Input variant="tertiary-outline"  {...p} />;
export const NeutralOutlineInput   = (p) => <Input variant="neutral-outline"   {...p} />;
export const InfoOutlineInput      = (p) => <Input variant="info-outline"      {...p} />;
export const SuccessOutlineInput   = (p) => <Input variant="success-outline"   {...p} />;
export const WarningOutlineInput   = (p) => <Input variant="warning-outline"   {...p} />;
export const ErrorOutlineInput     = (p) => <Input variant="error-outline"     {...p} />;

/* The five *LightInput convenience exports are gone with the variant. None of
   them was in src/components/index.js, so none was reachable from the package
   and none can be a breaking change for a consumer. */
export const OutlineInput = (p) => <Input variant="primary-outline" {...p} />;
export const PrimaryInput = (p) => <Input variant="primary-outline" {...p} />;

export default Input;