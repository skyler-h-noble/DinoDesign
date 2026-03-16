// src/components/Input/Input.js
import React from 'react';
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
import { Body, BodySmall } from '../Typography';

/**
 * Input Component
 * Full-featured text input with complete design system integration
 *
 * --- SURFACE -----------------------------------------------------------------
 *   data-surface="Container-Lowest" on wrapper and input root
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
 *   standard:  label above the input
 *   floating:  label inside, shrinks on focus/filled (stays inside the field)
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

function outlineStyles(color) {
  const C = cap(color);
  return {
    bg: 'var(--Background)',
    border: 'var(--Buttons-' + C + '-Border)',
    text: 'var(--Text)',
    focusBg: 'var(--Background)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color + '-outline'] = outlineStyles(color);
  });
  map['outline'] = outlineStyles('primary');
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { height: '32px',                   fontSize: '13px', labelSize: '13px', padding: '4px 8px',        iconSize: 16 },
  medium: { height: 'var(--Button-Height)',    fontSize: '15px', labelSize: '15px', padding: '6px 12px',       iconSize: 18 },
  large:  { height: '56px',                   fontSize: '17px', labelSize: '17px', padding: '8px 16px',       iconSize: 20 },
};

const FLOATING_SIZE_MAP = {
  small:  { height: '48px', fontSize: '13px', labelSize: '11px', padding: '20px 12px 4px', leftPad: 12, iconSize: 16 },
  medium: { height: '56px', fontSize: '15px', labelSize: '12px', padding: '22px 14px 6px', leftPad: 14, iconSize: 18 },
  large:  { height: '64px', fontSize: '17px', labelSize: '14px', padding: '24px 16px 6px', leftPad: 16, iconSize: 20 },
};

// --- Validation icons --------------------------------------------------------

const VALIDATION_ICONS = {
  info:    InfoOutlinedIcon,
  success: CheckCircleOutlineIcon,
  warning: WarningAmberIcon,
  error:   ErrorOutlineIcon,
};

const VALIDATION_COLORS = {
  info:    { border: 'var(--Buttons-Info-Border)',    icon: 'var(--Icons-Info)',    text: 'var(--Hotlink)' },
  success: { border: 'var(--Buttons-Success-Border)', icon: 'var(--Icons-Success)', text: 'var(--Text-Success)' },
  warning: { border: 'var(--Buttons-Warning-Border)', icon: 'var(--Icons-Warning)', text: 'var(--Text-Warning)' },
  error:   { border: 'var(--Buttons-Error-Border)',   icon: 'var(--Icons-Error)',   text: 'var(--Text-Error)' },
};

// --- Component ---------------------------------------------------------------

export function Input({
  variant = 'primary-outline',
  size = 'medium',
  label,
  labelPosition = 'standard',
  placeholder,
  helperText,
  validation,
  validationMessage,
  disabled = false,
  value,
  defaultValue,
  onChange,
  name,
  type = 'text',
  multiline = false,
  rows,
  maxRows,
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
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['primary-outline'];
  const isFloating = labelPosition === 'floating';
  const sizeConfig = isFloating
    ? (FLOATING_SIZE_MAP[size] || FLOATING_SIZE_MAP.medium)
    : (SIZE_MAP[size] || SIZE_MAP.medium);

  // Validation state overrides border color
  const validationConfig = validation ? VALIDATION_COLORS[validation] : null;
  const ValidationIcon = validation ? VALIDATION_ICONS[validation] : null;
  const effectiveBorder = validationConfig ? validationConfig.border : styles.border;

  // Pass aria attributes to the actual <input> element
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
    ...(ariaRequired    && { 'aria-required': ariaRequired }),
    ...(ariaInvalid     && { 'aria-invalid': ariaInvalid }),
  };

  // Standard label (above input)
  const renderStandardLabel = () => {
    if (!label || isFloating) return null;
    const LabelComp = size === 'small' ? BodySmall : Body;
    return (
      <LabelComp
        component="label"
        sx={{
          display: 'block',
          marginBottom: '6px',
          color: disabled ? 'var(--Quiet)' : 'var(--Text)',
          fontSize: sizeConfig.labelSize,
          fontWeight: 500,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {label}
      </LabelComp>
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
      data-surface="Container-Lowest"
      sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}
    >
      {renderStandardLabel()}
      <MuiTextField
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        name={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        fullWidth={fullWidth}
        label={isFloating ? label : undefined}
        variant="outlined"
        size={size === 'small' ? 'small' : 'medium'}
        inputProps={mergedInputProps}
        InputProps={{
          'data-surface': 'Container-Lowest',
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
          endAdornment: renderEndAdornment(),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: styles.bg,
            color: styles.text,
            fontSize: sizeConfig.fontSize,
            minHeight: multiline ? 'auto' : sizeConfig.height,
            padding: 0,
            borderRadius: 'var(--Style-Border-Radius)',
            transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',

            '& fieldset': {
              border: '2px solid ' + effectiveBorder,
              transition: 'border-color 0.15s ease-in-out',
            },

            '&:hover fieldset': {
              borderColor: validationConfig ? validationConfig.border : styles.border,
            },

            '&.Mui-focused': {
              backgroundColor: styles.focusBg,
              '& fieldset': {
                border: '2px solid ' + effectiveBorder,
                boxShadow: '0 0 0 1px ' + effectiveBorder,
              },
            },

            '&.Mui-disabled': {
              opacity: 0.6,
              cursor: 'not-allowed',
              '& fieldset': { borderColor: effectiveBorder },
            },

            '& input': {
              padding: sizeConfig.padding,
              color: 'inherit',
              '&::placeholder': { color: 'var(--Quiet)', opacity: 1 },
            },

            '& textarea': {
              padding: sizeConfig.padding,
              color: 'inherit',
              '&::placeholder': { color: 'var(--Quiet)', opacity: 1 },
            },

            '& .MuiInputAdornment-root': { color: styles.text },
          },

          '& .MuiInputLabel-root': {
            color: 'var(--Quiet)',
            fontSize: sizeConfig.fontSize,
            transformOrigin: 'top left',
            transform: 'translate(' + (sizeConfig.leftPad || 14) + 'px, 16px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(' + (sizeConfig.leftPad || 14) + 'px, 6px) scale(0.75)',
              color: 'var(--Quiet)',
            },
            '&.Mui-focused': { color: 'var(--Hotlink)' },
            '&.Mui-disabled': { color: 'var(--Quiet)', opacity: 0.6 },
          },

          '& .MuiOutlinedInput-notchedOutline legend': { display: 'none' },
          '& .MuiOutlinedInput-notchedOutline': { top: 0 },

          '& .MuiOutlinedInput-root.Mui-focused': { outline: 'none' },
          '& .MuiOutlinedInput-root:focus-within': {
            '& fieldset': {
              outline: '2px solid var(--Focus-Visible)',
              outlineOffset: '2px',
            },
          },
        }}
        {...props}
      />

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

export const OutlineInput = (p) => <Input variant="primary-outline" {...p} />;
export const PrimaryInput = (p) => <Input variant="primary-outline" {...p} />;

export default Input;