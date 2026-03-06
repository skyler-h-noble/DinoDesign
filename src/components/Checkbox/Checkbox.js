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
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

function solidStyles(color) {
  const C = cap(color);
  return {
    unchecked: {
      backgroundColor: 'transparent',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    checked: {
      backgroundColor: 'var(--Buttons-' + C + '-Button)',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    hover: {
      backgroundColor: 'var(--Buttons-' + C + '-Hover)',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    icon: 'var(--Buttons-' + C + '-Text)',
  };
}

function outlineStyles(color) {
  const C = cap(color);
  return {
    unchecked: {
      backgroundColor: 'transparent',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    checked: {
      backgroundColor: 'transparent',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    hover: {
      backgroundColor: 'var(--Buttons-Primary-Hover)',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    icon: 'var(--Text)',
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    unchecked: {
      backgroundColor: 'var(--' + C + '-Color-11)',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    checked: {
      backgroundColor: 'var(--' + C + '-Color-11)',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    hover: {
      backgroundColor: 'var(--Hover-' + C + '-Color-11)',
      border: '2px solid var(--Buttons-' + C + '-Border)',
    },
    icon: 'var(--Text-' + C + '-Color-11)',
  };
}

function buildVariantMap() {
  const map = {};
  // Primary style: only available for primary color
  map['primary']              = solidStyles('primary');
  // Outline and Light: available for all colors
  COLORS.forEach((color) => {
    map[color + '-outline']   = outlineStyles(color);
    map[color + '-light']     = lightStyles(color);
  });
  map['outline'] = outlineStyles('primary');
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { box: 16, icon: 12, labelSize: '13px', gap: 6, touchTarget: 28 },
  medium: { box: 20, icon: 14, labelSize: '15px', gap: 8, touchTarget: 32 },
  large:  { box: 24, icon: 18, labelSize: '17px', gap: 10, touchTarget: 40 },
};

// --- Custom Icons ------------------------------------------------------------

function CheckboxBoxIcon({ size, variant, checked, indeterminate }) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap.primary;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const boxStyles = (checked || indeterminate) ? styles.checked : styles.unchecked;

  return (
    <Box
      className="chk-box-icon"
      sx={{
        width: sizeConfig.box,
        height: sizeConfig.box,
        borderRadius: 'var(--Checkbox-Radius, 4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
        flexShrink: 0,
        boxShadow: (checked || indeterminate) ? 'var(--Shadow-1), var(--Shadow-2)' : 'none',
        ...boxStyles,
      }}
    >
      {(checked || indeterminate) && (
        indeterminate ? (
          <RemoveIcon sx={{ fontSize: sizeConfig.icon, color: styles.icon }} />
        ) : (
          <CheckIcon sx={{ fontSize: sizeConfig.icon, color: styles.icon }} />
        )
      )}
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
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap.primary;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = size === 'small' ? BodySmall : Body;

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
      disableRipple
      sx={{
        padding: (sizeConfig.touchTarget - sizeConfig.box) / 2 + 'px',
        borderRadius: 'var(--Checkbox-Radius, 4px)',
        color: 'inherit',
        transition: 'background-color 0.15s ease-in-out',
        '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: 'inherit' },
        '&:hover .chk-box-icon': { ...styles.hover },
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

// Convenience Exports - Primary
export const PrimaryCheckbox          = (p) => <Checkbox variant="primary"            {...p} />;

// Outline
export const PrimaryOutlineCheckbox   = (p) => <Checkbox variant="primary-outline"    {...p} />;
export const SecondaryOutlineCheckbox = (p) => <Checkbox variant="secondary-outline"  {...p} />;
export const TertiaryOutlineCheckbox  = (p) => <Checkbox variant="tertiary-outline"   {...p} />;
export const NeutralOutlineCheckbox   = (p) => <Checkbox variant="neutral-outline"    {...p} />;
export const InfoOutlineCheckbox      = (p) => <Checkbox variant="info-outline"       {...p} />;
export const SuccessOutlineCheckbox   = (p) => <Checkbox variant="success-outline"    {...p} />;
export const WarningOutlineCheckbox   = (p) => <Checkbox variant="warning-outline"    {...p} />;
export const ErrorOutlineCheckbox     = (p) => <Checkbox variant="error-outline"      {...p} />;

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

export default Checkbox;