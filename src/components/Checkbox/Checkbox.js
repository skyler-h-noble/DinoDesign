// src/components/Checkbox/Checkbox.js
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Label, LabelSmall, LabelLarge } from '../Typography';
import { tokenSegment } from '../_shadows';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { ControlLabel } from '../_controlLabel';
import { Glyph, SVG_ICON_DECLS } from '../_glyph';

/**
 * Checkbox Component
 * Full-featured checkbox with complete design system integration
 *
 * VARIANT = COLOUR. There is one look: transparent box, colored border, glyph
 * on check. `variant` names the color and nothing else:
 *   default (--Quiet box) | primary | secondary | tertiary | neutral |
 *   info | success | warning | error | black-white
 *
 * The `{color}-outline` and `{color}-light` shapes were REMOVED — color now
 * arrives from the design as a Buttons mode, and shape was never an axis of the
 * Figma component. Those names still resolve to their color and warn once in
 * development; see normalizeCheckboxVariant.
 *
 * SIZES: small (16px box) | medium (20px box) | large (24px box)
 * STATES: checked | unchecked | indeterminate | disabled
 * LABEL: optional text to the right of the checkbox
 *
 * ACCESSIBILITY:
 *   - aria-label and aria-labelledby are passed via inputProps to the <input>
 *     element directly, not the outer <span> wrapper, per WCAG 1.3.1
 *   - Without a visible label prop, always provide aria-label
 *   - FormControlLabel automatically associates the label with the input
 */

// `black-white` capitalises to `Black-white`, which is not a token — the design
// system emits --Buttons-BlackWhite-*. tokenSegment is the shared mapping
// Button already uses, so both components name the token the same way.
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error', 'black-white'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

// The DEFAULT color draws its box in --Quiet, not in a button border token.
// An unchecked checkbox is a quiet affordance, not a call to action: on a brand
// whose default button is a saturated color, --Buttons-Default-Border painted
// every empty box in that color and a list of them read as a row of buttons.
// --Quiet is also the safer token for the job — it is tuned to 4.5:1 against
// its surface, comfortably past the 3:1 a control outline needs.
//
// Only the box moves. The check glyph keeps the button token so that ticking
// one is what introduces the brand color.
const defaultBorder = (C) =>
  C === 'Default' ? 'var(--Quiet)' : 'var(--Buttons-' + C + '-Border)';

// A Checkbox has ONE look. `variant` selects its COLOUR and nothing else.
//
// There used to be two shapes, `{color}-outline` and `{color}-light`. They are
// gone: color now arrives as a Buttons MODE from the design, and shape was
// never an axis of the Figma component. What survives is the outline look —
// transparent box, colored border, glyph on check — which is what the design
// has always drawn.
/* Checked and indeterminate are FILLED — Figma's checked box takes the
   button's fill and border (Buttons::Button / Buttons::Border). It used to stay
   an empty box with a colored glyph, which this file described as "what the
   design has always drawn"; the design draws a filled box. */
function colorStyles(color) {
  const C = tokenSegment(color);
  return {
    color: C,
    borderToken: defaultBorder(C),
    activeBorder: 'var(--Buttons-' + C + '-Border)',
    activeFill: 'var(--Buttons-' + C + '-Button)',
    /* The mark sits ON the fill, so it takes the fill's LABEL color —
       Buttons-{C}-Text, contrast-checked against Buttons-{C}-Button. It was
       the Border color, a near-shade of the fill, and the check disappeared
       into the box (seen on a red default button, 2026-10-22). */
    icon: 'var(--Buttons-' + C + '-Text)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => { map[color] = colorStyles(color); });
  return map;
}

// Legacy shape suffixes resolve to the color alone.
//
// They are NOT quietly accepted: an unknown variant falls through to the map's
// default entry, so hard-deleting these names would have silently repainted
// every existing call site in the default color with no error anywhere — the
// exact failure this component has already shipped twice (`X-Light` themes no
// sheet defined, and a Ratio that named a scope instead of inheriting one).
// Strip the suffix, keep the color, and say so once in development.
const SHAPE_SUFFIX = /-(outline|light|solid)$/;
const warned = new Set();

export function normalizeCheckboxVariant(variant) {
  const v = String(variant || 'default');
  if (!SHAPE_SUFFIX.test(v)) return v;
  const base = v.replace(SHAPE_SUFFIX, '');
  if (process.env.NODE_ENV !== 'production' && !warned.has(v)) {
    warned.add(v);
    console.warn(
      '[Checkbox] variant="' + v + '" — the -outline/-light/-solid shapes were ' +
      'removed; a Checkbox has one look and `variant` selects color only. ' +
      'Rendering variant="' + base + '". Update the call site.',
    );
  }
  return base;
}

// Resolve a variant to its styles. Unknown names fall back to `default`, the
// brand color — never to `primary`, which is a different color and would
// misrepresent an unmarked control as a deliberate one.
function stylesFor(variant) {
  const map = buildVariantMap();
  return map[normalizeCheckboxVariant(variant)] || map.default;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  // touchTarget = the checkbox's frame footprint = a constant 24×24 for ALL
  // sizes (the box is centered inside): small 16 (4px pad), medium 20 (2px pad),
  // large 24 (0 pad). Matches the Figma component frame.
  /* Matches Radio's table, which had all three of these right.
     GAP was 6 / 8 / 10. Neither 6 nor 10 is on the Sizing scale — the rungs
     are Quarter 2, Half 4, 1 = 8, 1-and-Half 12 — so both could only ever be
     literals, and a checkbox sat beside a radio in the same form with a
     different gap at small and large.
     LABEL was a hardcoded 13 / 15 / 17px `fontSize` that OVERRODE the
     typography component it was applied to, so the real Body sizes (14 / 16 /
     18) never reached it and a brand re-picking its body scale moved every
     label in the system except these. The component now carries the size. */
  /* LABEL is the Label type style (Figma's Form-Label, Dynamic-Label), not
     Body: the design sets a checkbox's label in the label face and weight.
     The GAP is not here: it is --Label-Gap (see _labelGap.js), the one
     variable Checkbox Field, RadioField and SwitchField all bind. */
  small:  { box: 16, icon: 12, touchTarget: 24, LabelComp: LabelSmall },
  medium: { box: 20, icon: 14, touchTarget: 24, LabelComp: Label },
  large:  { box: 24, icon: 18, touchTarget: 24, LabelComp: LabelLarge },
};


// --- Static sheet ------------------------------------------------------------
//
// Checkbox was MUI's Checkbox (SwitchBase on ButtonBase) with an sx override
// and two MUI Boxes for the box icon. It is now its own markup over the same
// tokens; this sheet carries both the base MUI gave it and the design's layer
// on top, so the rendered control is unchanged.
//
// Colour arrives as custom properties declared on the root by one class per
// color (.omni-chk-Primary …). Nothing between the root and the box sets a
// data-theme, so the tokens resolve against the same scope they did when each
// part named them directly.
//
// State rules weigh what emotion's did — one class plus a pseudo-class or
// state class — so a caller's sx still wins over them.
const SxBox = lazySxBox('Checkbox');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SIZE_KEY = { small: 'sm', medium: 'md', large: 'lg' };
const RADIUS = {
  small: 'var(--Sm-Checkbox-Radius, 3.2px)',
  medium: 'var(--Checkbox-Radius, 4px)',
  large: 'var(--Lg-Checkbox-Radius, 4.8px)',
};

registerStaticStyles('omni-checkbox', [
  /* The root: ButtonBase's reset, then the touch-target frame. */
  '.omni-chk{display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;'
    + '-webkit-tap-highlight-color:transparent;background-color:transparent;outline:0;border:0;margin:0;cursor:pointer;'
    + 'user-select:none;vertical-align:middle;-moz-appearance:none;-webkit-appearance:none;appearance:none;text-decoration:none;'
    + 'padding:2px;min-width:24px;min-height:24px;border-radius:var(--Checkbox-Radius, 4px);color:inherit;'
    + 'transition:background-color 0.15s ease-in-out}',
  ...Object.entries(SIZE_KEY).map(([size, k]) => `.omni-chk-${k}{padding:${(SIZE_MAP[size].touchTarget - SIZE_MAP[size].box) / 2}px}`),
  '.omni-chk::-moz-focus-inner{border-style:none}',
  '@media print{.omni-chk{print-color-adjust:exact}}',
  ...COLORS.map((color) => {
    const s = colorStyles(color);
    return `.omni-chk-${s.color}{--_chk-off:${s.borderToken};--_chk-on:${s.activeBorder};--_chk-fill:${s.activeFill};--_chk-glyph:${s.icon}}`;
  }),
  /* No ripple halo and no fill change: hover and press move the border. */
  '.omni-chk:hover{background-color:transparent}',
  '.omni-chk:hover .omni-chk-box,.omni-chk:active .omni-chk-box{border-color:var(--_chk-on)}',
  /* Focus: a 2px ring 1px outside the box, as Figma draws it. */
  '.omni-chk.Mui-focusVisible .omni-chk-box{outline-width:2px;outline-style:solid;outline-color:var(--Focus-Visible);outline-offset:1px}',
  /* The root dims once; the box carries no opacity of its own. The colour is
     the one MUI's disabled rule gave the root (nothing paints with it). */
  '.omni-chk.Mui-disabled{pointer-events:none;cursor:not-allowed;color:rgba(0, 0, 0, 0.26);opacity:var(--Disabled, 0.38)}',
  /* After the disabled rule, at its weight: a checked or indeterminate root
     inherits its colour even when disabled, as the sx override made it. */
  '.omni-chk.Mui-checked,.omni-chk.MuiCheckbox-indeterminate{color:inherit}',
  /* Validation wins over hover / pressed / focus border moves. */
  '.omni-chk-err .omni-chk-box,.omni-chk-err:hover .omni-chk-box,.omni-chk-err:active .omni-chk-box,'
    + '.omni-chk-err.Mui-focusVisible .omni-chk-box{border-color:var(--Icons-Error)}',
  /* The native input: invisible, covering the root, so it takes the clicks. */
  '.omni-chk-input{cursor:inherit;position:absolute;opacity:0;width:100%;height:100%;top:0;left:0;margin:0;padding:0;z-index:1}',
  /* The box — its border sits inside, so the rendered size is the box size. */
  '.omni-chk-box{width:20px;height:20px;box-sizing:border-box;border-radius:var(--Checkbox-Radius, 4px);'
    + 'border-width:2px;border-style:solid;border-color:var(--_chk-off);overflow:hidden;flex-shrink:0;'
    + 'transition:border-color 0.15s ease-in-out}',
  ...['small', 'large'].map((size) => `.omni-chk-box-${SIZE_KEY[size]}{width:${SIZE_MAP[size].box}px;height:${SIZE_MAP[size].box}px;border-radius:${RADIUS[size]}}`),
  '.omni-chk-box-on{border-color:var(--_chk-on)}',
  '.omni-chk-fill{width:100%;height:100%;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;'
    + 'background-color:var(--Background);color:var(--Text);transition:background-color 0.15s ease-in-out}',
  '.omni-chk-fill-on{background-color:var(--_chk-fill)}',
  `.omni-chk-glyph{${SVG_ICON_DECLS};font-size:${SIZE_MAP.medium.icon}px;color:var(--_chk-glyph)}`,
  ...['small', 'large'].map((size) => `.omni-chk-glyph-${SIZE_KEY[size]}{font-size:${SIZE_MAP[size].icon}px}`),
  /* The label text. Two classes for the disabled colour: the Typography
     sheet's color class is one, and either sheet may load first. */
  '.omni-chk-text{user-select:none}',
  '.omni-type.omni-chk-text-off{color:var(--Text-Quiet)}',
].join('\n'));

// --- Box icon ----------------------------------------------------------------

function CheckboxBoxIcon({ size, checked, indeterminate }) {
  useStaticStyles('omni-checkbox');
  const k = SIZE_KEY[size];
  const isActive = checked || indeterminate;
  // No inner data-theme/data-surface: the box INHERITS the surrounding scope,
  // which is what a control sitting on a card should do.
  return (
    <div className={'chk-box-icon MuiBox-root omni-chk-box' + (k !== 'md' ? ' omni-chk-box-' + k : '') + (isActive ? ' omni-chk-box-on' : '')}>
      <div className={'MuiBox-root omni-chk-fill' + (isActive ? ' omni-chk-fill-on' : '')}>
        {isActive && (
          <Glyph name={indeterminate ? 'Remove' : 'Check'} className={'omni-chk-glyph' + (k !== 'md' ? ' omni-chk-glyph-' + k : '')} />
        )}
      </div>
    </div>
  );
}

// --- Behaviour ---------------------------------------------------------------

const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const isHandler = (key, v) => /^on[A-Z]/.test(key) && typeof v === 'function';

/* What MUI's ButtonBase did with focus: the root wears Mui-focusVisible while
   the input inside it has :focus-visible (keyboard focus), so the ring shows
   for keyboard users and not on click. */
function matchesFocusVisible(el) {
  try { return el.matches(':focus-visible'); } catch (e) { return false; }
}

// --- Component ---------------------------------------------------------------

export function Checkbox({
  /* `default`, the brand's default button color — never `primary`, which is a
     different color and made every unmarked checkbox a deliberate one. */
  variant = 'default',
  size = 'medium',
  label,
  /* Where the label sits: 'end' (right, default) | 'start' | 'top' | 'bottom'
     — Figma's Checkbox Field Label axis (label-right / -left / -top / -bottom). */
  labelPlacement = 'end',
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  /* Figma's Validation boolean: a 2px error border over the box in every
     state (.CheckboxValidation, Icons = Error). Also sets aria-invalid; pair
     it with a message (FormHelper) and aria-describedby. */
  error = false,
  onChange,
  name,
  value,
  className = '',
  sx = {},
  // Extract aria props explicitly so they go to the <input> not the <span>
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  inputProps: inputPropsProp = {},
  /* What MUI's SwitchBase routed to the <input> rather than the root. */
  id,
  inputRef,
  autoFocus,
  required = false,
  readOnly,
  tabIndex,
  onFocus,
  onBlur,
  slotProps,
  /* MUI's palette prop. It only ever named a class here — `variant` picks the
     colour — and still does. */
  color = 'primary',
  ...props
}) {
  useStaticStyles('omni-checkbox');
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const styles = stylesFor(variant);
  /* From the table, not a two-way ternary. `size === 'small' ? BodySmall :
     Body` gave a LARGE checkbox the MEDIUM Body component — the third step
     had no branch at all. */
  const LabelComp = SIZE_MAP[sizeKey].LabelComp;

  // Checked state, controlled or not — the decision is made once, as MUI's.
  const { current: isControlled } = useRef(checked !== undefined);
  const [checkedState, setCheckedState] = useState(Boolean(defaultChecked));
  const isChecked = isControlled ? checked : checkedState;
  const [focusVisible, setFocusVisible] = useState(false);

  /* The native input's own mixed state, alongside aria-checked="mixed".
     `indeterminate` is a DOM property with no attribute, so React never sets
     it; without it the input says "not checked" to assistive tech while the
     attribute says "mixed", and axe reports the mismatch. */
  const ownInputRef = useRef(null);
  useLayoutEffect(() => {
    if (ownInputRef.current) ownInputRef.current.indeterminate = Boolean(indeterminate);
  });
  const setInputRef = (node) => {
    ownInputRef.current = node;
    if (typeof inputRef === 'function') inputRef(node);
    else if (inputRef) inputRef.current = node;
  };

  // Pass aria attributes directly to the <input> element
  // This fixes: "aria-label attribute cannot be used on a span with no valid role"
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel      && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
    ...(error && { 'aria-invalid': true }),
  };
  /* aria-checked="mixed" while indeterminate, as current MUI Checkbox sets
     it: a native checkbox's indeterminate is a DOM property React does not
     set, so the attribute is what tells assistive tech. */
  const external = {
    'data-indeterminate': indeterminate,
    'aria-checked': indeterminate ? 'mixed' : undefined,
    ...(slotProps?.input ?? mergedInputProps),
  };
  const inputHandlers = {};
  const inputAttrs = {};
  Object.keys(external).forEach((key) => {
    if (isHandler(key, external[key])) inputHandlers[key] = external[key];
    else inputAttrs[key] = external[key];
  });
  const { className: inputClassName, ...inputRest } = inputAttrs;

  const handleInputChange = (event) => {
    if (inputHandlers.onChange) inputHandlers.onChange(event);
    // Workaround for https://github.com/facebook/react/issues/9023
    if (event.nativeEvent.defaultPrevented || readOnly) return;
    const next = event.target.checked;
    setCheckedState(next);
    if (onChange) onChange(event, next);
  };
  const handleFocus = (event) => {
    if (matchesFocusVisible(event.target)) setFocusVisible(true);
    if (onFocus) onFocus(event);
  };
  const handleBlur = (event) => {
    if (!matchesFocusVisible(event.target)) setFocusVisible(false);
    if (onBlur) onBlur(event);
  };

  const sk = SIZE_KEY[sizeKey];
  const rootProps = {
    className: 'MuiButtonBase-root MuiCheckbox-root' + (indeterminate ? ' MuiCheckbox-indeterminate' : '')
      + ' MuiCheckbox-color' + capFirst(color) + ' MuiCheckbox-sizeMedium PrivateSwitchBase-root'
      + (isChecked ? ' Mui-checked' : '') + (disabled ? ' Mui-disabled' : '') + (focusVisible ? ' Mui-focusVisible' : '')
      + ' chk-' + variant + (error ? ' chk-error' : '') + ' ' + className
      + ' omni-chk omni-chk-' + styles.color + (sk !== 'md' ? ' omni-chk-' + sk : '') + (error ? ' omni-chk-err' : ''),
    ...props,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
  const children = (
    <>
      <input
        {...inputHandlers}
        onChange={handleInputChange}
        autoFocus={autoFocus}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        name={name}
        readOnly={readOnly}
        required={required}
        tabIndex={tabIndex}
        type="checkbox"
        {...(value === undefined ? {} : { value })}
        {...inputRest}
        className={'PrivateSwitchBase-input omni-chk-input' + (inputClassName ? ' ' + inputClassName : '')}
        ref={setInputRef}
      />
      <CheckboxBoxIcon size={sizeKey} checked={isChecked} indeterminate={indeterminate} />
    </>
  );
  const checkboxElement = hasSx(sx)
    ? <SxBox component="span" sx={sx} {...rootProps}>{children}</SxBox>
    : <span {...rootProps}>{children}</span>;

  if (label) {
    return (
      <ControlLabel
        control={checkboxElement}
        label={
          <LabelComp
            component="span"
            className={'MuiBox-root omni-chk-text' + (disabled ? ' omni-chk-text-off' : '')}
          >
            {label}
          </LabelComp>
        }
        disabled={disabled}
        labelPlacement={labelPlacement}
        size={sizeKey}
        quietDisabled
      />
    );
  }

  return checkboxElement;
}

// ─── Convenience Exports ─────────────────────────────────────────────────────
// One per COLOUR. There is no shape axis on a Checkbox.

export const DefaultCheckbox     = (p) => <Checkbox variant="default" {...p} />;
export const PrimaryCheckbox     = (p) => <Checkbox variant="primary" {...p} />;
export const SecondaryCheckbox   = (p) => <Checkbox variant="secondary" {...p} />;
export const TertiaryCheckbox    = (p) => <Checkbox variant="tertiary" {...p} />;
export const NeutralCheckbox     = (p) => <Checkbox variant="neutral" {...p} />;
export const InfoCheckbox        = (p) => <Checkbox variant="info" {...p} />;
export const SuccessCheckbox     = (p) => <Checkbox variant="success" {...p} />;
export const WarningCheckbox     = (p) => <Checkbox variant="warning" {...p} />;
export const ErrorCheckbox       = (p) => <Checkbox variant="error" {...p} />;
export const BlackWhiteCheckbox  = (p) => <Checkbox variant="black-white" {...p} />;

// ─── Deprecated shape-named exports ──────────────────────────────────────────
//
// The -solid / -outline / -light shapes are gone; every name below renders its
// COLOUR. They are kept because they are part of the published package surface
// and deleting them breaks an import at build time rather than at review time.
//
// They delegate to the color components directly, NOT to variant="X-outline",
// so using one does not fire the deprecation warning — the warning is meant for
// hand-written variant strings, which are the ones a design hand-off can still
// produce. Remove these on the next major.
export const DefaultSolidCheckbox       = DefaultCheckbox;
export const DefaultOutlineCheckbox     = DefaultCheckbox;
/* No DefaultLightCheckbox. It aliased DefaultCheckbox, so it rendered fine
   and taught a combination that does not exist — "default" is inherit, and
   there is no palette under it to take a light tone from. An alias that
   works is the worst kind of wrong name: nothing ever reports it. */
export const PrimarySolidCheckbox       = PrimaryCheckbox;
export const PrimaryOutlineCheckbox     = PrimaryCheckbox;
export const PrimaryLightCheckbox       = PrimaryCheckbox;
export const SecondarySolidCheckbox     = SecondaryCheckbox;
export const SecondaryOutlineCheckbox   = SecondaryCheckbox;
export const SecondaryLightCheckbox     = SecondaryCheckbox;
export const TertiarySolidCheckbox      = TertiaryCheckbox;
export const TertiaryOutlineCheckbox    = TertiaryCheckbox;
export const TertiaryLightCheckbox      = TertiaryCheckbox;
export const NeutralSolidCheckbox       = NeutralCheckbox;
export const NeutralOutlineCheckbox     = NeutralCheckbox;
export const NeutralLightCheckbox       = NeutralCheckbox;
export const InfoSolidCheckbox          = InfoCheckbox;
export const InfoOutlineCheckbox        = InfoCheckbox;
export const InfoLightCheckbox          = InfoCheckbox;
export const SuccessSolidCheckbox       = SuccessCheckbox;
export const SuccessOutlineCheckbox     = SuccessCheckbox;
export const SuccessLightCheckbox       = SuccessCheckbox;
export const WarningSolidCheckbox       = WarningCheckbox;
export const WarningOutlineCheckbox     = WarningCheckbox;
export const WarningLightCheckbox       = WarningCheckbox;
export const ErrorSolidCheckbox         = ErrorCheckbox;
export const ErrorOutlineCheckbox       = ErrorCheckbox;
export const ErrorLightCheckbox         = ErrorCheckbox;
export const BlackWhiteSolidCheckbox    = BlackWhiteCheckbox;
export const BlackWhiteOutlineCheckbox  = BlackWhiteCheckbox;
export const BlackWhiteLightCheckbox    = BlackWhiteCheckbox;

// Bare aliases — historically primary, now the brand default.
export const OutlineCheckbox = DefaultCheckbox;
export const SolidCheckbox   = DefaultCheckbox;
export const LightCheckbox   = DefaultCheckbox;

export default Checkbox;
