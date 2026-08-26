// src/components/Checkbox/Checkbox.js
import React from 'react';
import { Checkbox as MuiCheckbox, FormControlLabel, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import { Body, BodySmall } from '../Typography';
import { tokenSegment } from '../_shadows';

/**
 * Checkbox Component
 * Full-featured checkbox with complete design system integration
 *
 * VARIANT = COLOUR. There is one look: transparent box, coloured border, glyph
 * on check. `variant` names the colour and nothing else:
 *   default (--Quiet box) | primary | secondary | tertiary | neutral |
 *   info | success | warning | error | black-white
 *
 * The `{color}-outline` and `{color}-light` shapes were REMOVED — colour now
 * arrives from the design as a Buttons mode, and shape was never an axis of the
 * Figma component. Those names still resolve to their colour and warn once in
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

// The DEFAULT colour draws its box in --Quiet, not in a button border token.
// An unchecked checkbox is a quiet affordance, not a call to action: on a brand
// whose default button is a saturated colour, --Buttons-Default-Border painted
// every empty box in that colour and a list of them read as a row of buttons.
// --Quiet is also the safer token for the job — it is tuned to 4.5:1 against
// its surface, comfortably past the 3:1 a control outline needs.
//
// Only the box moves. The check glyph keeps the button token so that ticking
// one is what introduces the brand colour.
const defaultBorder = (C) =>
  C === 'Default' ? 'var(--Quiet)' : 'var(--Buttons-' + C + '-Border)';

// A Checkbox has ONE look. `variant` selects its COLOUR and nothing else.
//
// There used to be two shapes, `{color}-outline` and `{color}-light`. They are
// gone: colour now arrives as a Buttons MODE from the design, and shape was
// never an axis of the Figma component. What survives is the outline look —
// transparent box, coloured border, glyph on check — which is what the design
// has always drawn.
function colorStyles(color) {
  const C = tokenSegment(color);
  return {
    color: C,
    borderToken: defaultBorder(C),
    icon: 'var(--Buttons-' + C + '-Border)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => { map[color] = colorStyles(color); });
  return map;
}

// Legacy shape suffixes resolve to the colour alone.
//
// They are NOT quietly accepted: an unknown variant falls through to the map's
// default entry, so hard-deleting these names would have silently repainted
// every existing call site in the default colour with no error anywhere — the
// exact failure this component has already shipped twice (`X-Light` themes no
// sheet defined, and a Ratio that named a scope instead of inheriting one).
// Strip the suffix, keep the colour, and say so once in development.
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
      'removed; a Checkbox has one look and `variant` selects colour only. ' +
      'Rendering variant="' + base + '". Update the call site.',
    );
  }
  return base;
}

// Resolve a variant to its styles. Unknown names fall back to `default`, the
// brand colour — never to `primary`, which is a different colour and would
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
  small:  { box: 16, icon: 12, labelSize: '13px', gap: 6,  touchTarget: 24 },
  medium: { box: 20, icon: 14, labelSize: '15px', gap: 8,  touchTarget: 24 },
  large:  { box: 24, icon: 18, labelSize: '17px', gap: 10, touchTarget: 24 },
};

// --- Custom Icons ------------------------------------------------------------

function CheckboxBoxIcon({ size, variant, checked, indeterminate }) {
  const styles = stylesFor(variant);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const isActive = checked || indeterminate;

  // Outer border always uses the themed border token
  const outerBorder = styles.borderToken;

  // Corner radius scales per size via its own token (the box is 16/20/24px,
  // radius = 20% of box). Falls back to that default set (Sm 3.2 / Md 4 /
  // Lg 4.8px) when the brand CSS doesn't define the tokens.
  const radiusVar =
    size === 'small' ? 'var(--Sm-Checkbox-Radius, 3.2px)' :
    size === 'large' ? 'var(--Lg-Checkbox-Radius, 4.8px)' :
    'var(--Checkbox-Radius, 4px)';

  // No inner data-theme/data-surface. The light variant used to set them, and
  // with it gone the box INHERITS the surrounding scope — which is what a
  // control sitting on a card should do anyway.

  return (
    <Box
      className="chk-box-icon"
      sx={{
        width: sizeConfig.box,
        height: sizeConfig.box,
        // border sits INSIDE the box, so the rendered size equals sizeConfig.box
        // (e.g. medium = 20×20, not 20 + 2px borders = 24).
        boxSizing: 'border-box',
        borderRadius: radiusVar,
        border: '2px solid ' + outerBorder,
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'border-color 0.15s ease-in-out',
      }}
    >
      {/* Inner themed surface */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          transition: 'background-color 0.15s ease-in-out',
        }}
      >
        {isActive && (
          indeterminate ? (
            <RemoveIcon sx={{ fontSize: sizeConfig.icon, color: styles.icon }} />
          ) : (
            <CheckIcon sx={{ fontSize: sizeConfig.icon, color: styles.icon }} />
          )
        )}
      </Box>
    </Box>
  );
}

function UncheckedIcon({ size, variant }) {
  return <CheckboxBoxIcon size={size} variant={variant} checked={false} indeterminate={false} />;
}

function CheckedIcon({ size, variant }) {
  return <CheckboxBoxIcon size={size} variant={variant} checked={true} indeterminate={false} />;
}

function IndeterminateIcon({ size, variant }) {
  return <CheckboxBoxIcon size={size} variant={variant} checked={false} indeterminate={true} />;
}

// --- Component ---------------------------------------------------------------

export function Checkbox({
  variant = 'primary',
  size = 'medium',
  label,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
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
  ...props
}) {
  const styles = stylesFor(variant);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = size === 'small' ? BodySmall : Body;

  // Pass aria attributes directly to the <input> element
  // This fixes: "aria-label attribute cannot be used on a span with no valid role"
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel      && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
  };

  const checkboxElement = (
    <MuiCheckbox
      checked={checked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      disabled={disabled}
      onChange={onChange}
      name={name}
      value={value}
      icon={<UncheckedIcon size={size} variant={variant} />}
      checkedIcon={<CheckedIcon size={size} variant={variant} />}
      indeterminateIcon={<IndeterminateIcon size={size} variant={variant} />}
      className={'chk-' + variant + ' ' + className}
      inputProps={mergedInputProps}
      disableRipple
      sx={{
        padding: (sizeConfig.touchTarget - sizeConfig.box) / 2 + 'px',
        minWidth: 24,
        minHeight: 24,
        borderRadius: 'var(--Checkbox-Radius, 4px)',
        color: 'inherit',
        transition: 'background-color 0.15s ease-in-out',
        '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: 'inherit' },
        '&:hover': { backgroundColor: 'transparent' },
        '&.Mui-focusVisible .chk-box-icon': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },
        '&.Mui-disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        ...sx,
      }}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={checkboxElement}
        label={
          <LabelComp
            component="span"
            sx={{
              color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
              fontSize: sizeConfig.labelSize,
              lineHeight: 1.4,
              userSelect: 'none',
            }}
          >
            {label}
          </LabelComp>
        }
        disabled={disabled}
        sx={{
          marginLeft: 0,
          marginRight: 0,
          gap: sizeConfig.gap + 'px',
          alignItems: 'center',
          '&.Mui-disabled .MuiTypography-root': {
            color: 'var(--Text-Quiet)',
            opacity: 0.6,
          },
        }}
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
// They delegate to the colour components directly, NOT to variant="X-outline",
// so using one does not fire the deprecation warning — the warning is meant for
// hand-written variant strings, which are the ones a design hand-off can still
// produce. Remove these on the next major.
export const DefaultSolidCheckbox       = DefaultCheckbox;
export const DefaultOutlineCheckbox     = DefaultCheckbox;
export const DefaultLightCheckbox       = DefaultCheckbox;
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
