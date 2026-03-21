// src/components/Radio/Radio.js
import React from 'react';
import {
  Radio as MuiRadio,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from '@mui/material';
import { Body, BodySmall } from '../Typography';

/**
 * Radio Component
 * Full-featured radio button with complete design system integration
 *
 * VARIANTS:
 *   OUTLINE variant="{color}-outline"   transparent BG, border + dot when selected
 *   LIGHT   variant="{color}-light"     tinted BG when selected
 *
 * SIZES: small (16px) | medium (20px) | large (24px)
 * STATES: checked | unchecked | disabled
 * LABEL: optional text to the right of the radio
 *
 * ACCESSIBILITY:
 *   - aria-label and aria-labelledby passed via inputProps to the <input>
 *     element directly per WCAG 1.3.1
 *   - Without a visible label prop, always provide aria-label
 *   - Use RadioGroup with a label for grouped radio buttons
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

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
    dot: 'var(--Buttons-' + C + '-Border)',
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
    dot: 'var(--Buttons-' + C + '-Border)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color + '-outline'] = outlineStyles(color);
    map[color + '-light']   = lightStyles(color);
  });
  map['outline'] = outlineStyles('primary');
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { box: 16, dot: 8,    labelSize: '13px', gap: 6,  touchTarget: 28 },
  medium: { box: 20, dot: 9.5,  labelSize: '15px', gap: 8,  touchTarget: 32 },
  large:  { box: 24, dot: 12,   labelSize: '17px', gap: 10, touchTarget: 40 },
};

// --- Custom Radio Icons ------------------------------------------------------

function RadioCircleIcon({ size, variant, checked }) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['primary-outline'];
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const boxStyles = checked ? styles.checked : styles.unchecked;

  return (
    <Box
      className="radio-circle-icon"
      sx={{
        width: sizeConfig.box,
        height: sizeConfig.box,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
        flexShrink: 0,
        boxShadow: checked ? 'var(--Shadow-1), var(--Shadow-2)' : 'none',
        ...boxStyles,
      }}
    >
      {checked && (
        <Box
          sx={{
            width: sizeConfig.dot,
            height: sizeConfig.dot,
            borderRadius: '50%',
            backgroundColor: styles.dot,
            transition: 'transform 0.15s ease-in-out',
          }}
        />
      )}
    </Box>
  );
}

function UncheckedRadioIcon({ size, variant }) {
  return <RadioCircleIcon size={size} variant={variant} checked={false} />;
}

function CheckedRadioIcon({ size, variant }) {
  return <RadioCircleIcon size={size} variant={variant} checked={true} />;
}

// --- Radio Component ---------------------------------------------------------

export function Radio({
  variant = 'primary-outline',
  size = 'medium',
  label,
  checked,
  disabled = false,
  onChange,
  name,
  value,
  className = '',
  sx = {},
  // Extract aria props explicitly so they go to <input> not the outer <span>
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  inputProps: inputPropsProp = {},
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['primary-outline'];
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = size === 'small' ? BodySmall : Body;

  // Pass aria attributes directly to the <input> element
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
  };

  const radioElement = (
    <MuiRadio
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      name={name}
      value={value}
      icon={<UncheckedRadioIcon size={size} variant={variant} />}
      checkedIcon={<CheckedRadioIcon size={size} variant={variant} />}
      className={'radio-' + variant + ' ' + className}
      inputProps={mergedInputProps}
      disableRipple
      sx={{
        padding: (sizeConfig.touchTarget - sizeConfig.box) / 2 + 'px',
        borderRadius: '50%',
        color: 'inherit',
        transition: 'background-color 0.15s ease-in-out',
        '&.Mui-checked': { color: 'inherit' },
        '&:hover .radio-circle-icon': { ...styles.hover },
        '&.Mui-focusVisible .radio-circle-icon': {
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
        control={radioElement}
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

  return radioElement;
}

// --- RadioGroup Component ----------------------------------------------------

export function RadioGroup({
  variant = 'primary-outline',
  size = 'medium',
  label,
  options = [],
  value,
  onChange,
  orientation = 'vertical',
  disabled = false,
  spacing = 1,
  name,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) {
  return (
    <FormControl
      component="fieldset"
      disabled={disabled}
      className={'radio-group-' + variant + ' ' + className}
      sx={sx}
    >
      {label && (
        <FormLabel
          component="legend"
          sx={{
            color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
            fontSize: size === 'small' ? '13px' : '15px',
            fontWeight: 500,
            mb: 1,
            '&.Mui-focused': { color: 'var(--Text)' },
            '&.Mui-disabled': { color: 'var(--Text-Quiet)', opacity: 0.6 },
          }}
        >
          {label}
        </FormLabel>
      )}
      <MuiRadioGroup
        value={value}
        onChange={onChange}
        name={name}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        row={orientation === 'horizontal'}
        sx={{ gap: spacing }}
        {...props}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            variant={variant}
            size={size}
            label={option.label}
            value={option.value}
            disabled={option.disabled || disabled}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}

// --- Convenience Exports -----------------------------------------------------

// Outline
export const PrimaryOutlineRadio   = (p) => <Radio variant="primary-outline"   {...p} />;
export const SecondaryOutlineRadio = (p) => <Radio variant="secondary-outline" {...p} />;
export const TertiaryOutlineRadio  = (p) => <Radio variant="tertiary-outline"  {...p} />;
export const NeutralOutlineRadio   = (p) => <Radio variant="neutral-outline"   {...p} />;
export const InfoOutlineRadio      = (p) => <Radio variant="info-outline"      {...p} />;
export const SuccessOutlineRadio   = (p) => <Radio variant="success-outline"   {...p} />;
export const WarningOutlineRadio   = (p) => <Radio variant="warning-outline"   {...p} />;
export const ErrorOutlineRadio     = (p) => <Radio variant="error-outline"     {...p} />;

// Light
export const PrimaryLightRadio     = (p) => <Radio variant="primary-light"     {...p} />;
export const SecondaryLightRadio   = (p) => <Radio variant="secondary-light"   {...p} />;
export const TertiaryLightRadio    = (p) => <Radio variant="tertiary-light"    {...p} />;
export const NeutralLightRadio     = (p) => <Radio variant="neutral-light"     {...p} />;
export const InfoLightRadio        = (p) => <Radio variant="info-light"        {...p} />;
export const SuccessLightRadio     = (p) => <Radio variant="success-light"     {...p} />;
export const WarningLightRadio     = (p) => <Radio variant="warning-light"     {...p} />;
export const ErrorLightRadio       = (p) => <Radio variant="error-light"       {...p} />;

// Aliases
export const OutlineRadio = (p) => <Radio variant="primary-outline" {...p} />;

// Legacy exports for backwards compatibility
export const RadioInput = Radio;

export default Radio;