// src/components/Checkbox/Checkbox.js
import React from 'react';
import { Checkbox as MuiCheckbox, FormControlLabel, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import { Body, BodySmall } from '../Typography';

/**
 * Checkbox Component
 * Full-featured checkbox with complete design system integration
 *
 * VARIANTS:
 *   PRIMARY variant="primary"           filled BG when checked (primary color only)
 *   OUTLINE variant="{color}-outline"   transparent BG, border + icon when checked
 *   LIGHT   variant="{color}-light"     tinted BG when checked
 *   (No plain/ghost — not accessible without visible boundary)
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

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

function outlineStyles(color) {
  const C = cap(color);
  return {
    type: 'outline',
    color: C,
    borderToken: 'var(--Buttons-' + C + '-Border)',
    icon: 'var(--Text-' + C + ')',
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    type: 'light',
    color: C,
    borderToken: 'var(--Buttons-' + C + '-Border)',
    icon: 'var(--Text-' + C + ')',
    dataTheme: C + '-Light',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color + '-outline'] = outlineStyles(color);
    map[color + '-light']   = lightStyles(color);
  });
  // Shorthand aliases — default to outline
  map['primary']  = outlineStyles('primary');
  map['default']  = outlineStyles('default');
  map['outline']  = outlineStyles('primary');
  map['light']    = lightStyles('primary');
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { box: 16, icon: 12, labelSize: '13px', gap: 6,  touchTarget: 28 },
  medium: { box: 20, icon: 14, labelSize: '15px', gap: 8,  touchTarget: 32 },
  large:  { box: 24, icon: 18, labelSize: '17px', gap: 10, touchTarget: 40 },
};

// --- Custom Icons ------------------------------------------------------------

function CheckboxBoxIcon({ size, variant, checked, indeterminate }) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap.primary;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const isActive = checked || indeterminate;
  const isLight = styles.type === 'light';

  // Outer border always uses the themed border token
  const outerBorder = styles.borderToken;

  // Inner data attributes for light variant
  const innerAttrs = isLight
    ? { 'data-theme': styles.dataTheme, 'data-surface': 'Surface-Dim' }
    : {};

  return (
    <Box
      className="chk-box-icon"
      sx={{
        width: sizeConfig.box,
        height: sizeConfig.box,
        borderRadius: 'var(--Checkbox-Radius, 4px)',
        border: '2px solid ' + outerBorder,
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'border-color 0.15s ease-in-out',
      }}
    >
      {/* Inner themed surface */}
      <Box
        {...innerAttrs}
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
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap.primary;
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

// Convenience Exports - Default
export const DefaultCheckbox          = (p) => <Checkbox variant="default"            {...p} />;
export const DefaultSolidCheckbox     = (p) => <Checkbox variant="default-solid"      {...p} />;
export const DefaultOutlineCheckbox   = (p) => <Checkbox variant="default-outline"    {...p} />;
export const DefaultLightCheckbox     = (p) => <Checkbox variant="default-light"      {...p} />;

// Solid (Primary)
export const PrimaryCheckbox          = (p) => <Checkbox variant="primary"            {...p} />;
export const PrimarySolidCheckbox     = (p) => <Checkbox variant="primary-solid"      {...p} />;

// Outline
export const PrimaryOutlineCheckbox   = (p) => <Checkbox variant="primary-outline"    {...p} />;
export const SecondaryOutlineCheckbox = (p) => <Checkbox variant="secondary-outline"  {...p} />;
export const TertiaryOutlineCheckbox  = (p) => <Checkbox variant="tertiary-outline"   {...p} />;
export const NeutralOutlineCheckbox   = (p) => <Checkbox variant="neutral-outline"    {...p} />;
export const InfoOutlineCheckbox      = (p) => <Checkbox variant="info-outline"       {...p} />;
export const SuccessOutlineCheckbox   = (p) => <Checkbox variant="success-outline"    {...p} />;
export const WarningOutlineCheckbox   = (p) => <Checkbox variant="warning-outline"    {...p} />;
export const ErrorOutlineCheckbox     = (p) => <Checkbox variant="error-outline"      {...p} />;

// Solid (all colors)
export const SecondarySolidCheckbox   = (p) => <Checkbox variant="secondary-solid"    {...p} />;
export const TertiarySolidCheckbox    = (p) => <Checkbox variant="tertiary-solid"     {...p} />;
export const NeutralSolidCheckbox     = (p) => <Checkbox variant="neutral-solid"      {...p} />;
export const InfoSolidCheckbox        = (p) => <Checkbox variant="info-solid"         {...p} />;
export const SuccessSolidCheckbox     = (p) => <Checkbox variant="success-solid"      {...p} />;
export const WarningSolidCheckbox     = (p) => <Checkbox variant="warning-solid"      {...p} />;
export const ErrorSolidCheckbox       = (p) => <Checkbox variant="error-solid"        {...p} />;

// Light
export const PrimaryLightCheckbox     = (p) => <Checkbox variant="primary-light"      {...p} />;
export const SecondaryLightCheckbox   = (p) => <Checkbox variant="secondary-light"    {...p} />;
export const TertiaryLightCheckbox    = (p) => <Checkbox variant="tertiary-light"     {...p} />;
export const NeutralLightCheckbox     = (p) => <Checkbox variant="neutral-light"      {...p} />;
export const InfoLightCheckbox        = (p) => <Checkbox variant="info-light"         {...p} />;
export const SuccessLightCheckbox     = (p) => <Checkbox variant="success-light"      {...p} />;
export const WarningLightCheckbox     = (p) => <Checkbox variant="warning-light"      {...p} />;
export const ErrorLightCheckbox       = (p) => <Checkbox variant="error-light"        {...p} />;

// Aliases
export const OutlineCheckbox = (p) => <Checkbox variant="primary-outline" {...p} />;
export const SolidCheckbox   = (p) => <Checkbox variant="primary-solid"   {...p} />;

export default Checkbox;