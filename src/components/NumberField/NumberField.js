// src/components/NumberField/NumberField.js
import React, { useState, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

/**
 * NumberField Component
 *
 * VARIANTS:
 *   outlined  Input with up/down stepper buttons inside right edge.
 *             Single size only — steppers need ≥24×24 touch target.
 *   spinner   Standalone −/+ buttons flanking a centered number.
 *             Sizes: standard (40px) and small (32px).
 *
 * LABEL: top | floating | none
 *   Floating follows same pattern as Select — sits inside, shrinks on focus/filled.
 *
 * VALIDATION: success | warning | error | info
 *   Changes border color + helper text color.
 *
 * TOKENS:
 *   Surface:       data-surface="Container-Lowest"
 *   Border idle:   inherit
 *   Border active: var(--Buttons-Default-Border)
 *   Text:          var(--Text)
 *   Stepper bg:    var(--Buttons-Default-Light-Button)
 *   Stepper border:var(--Buttons-Default-Border)
 *   Stepper text:  var(--Buttons-Default-Light-Text)
 *   Stepper hover: var(--Buttons-Default-Hover)
 *   Stepper active:var(--Buttons-Default-Active)
 */

const VALIDATION_COLORS = {
  success: { border: 'var(--Buttons-Success-Border)', text: 'var(--Text-Success)' },
  warning: { border: 'var(--Buttons-Warning-Border)', text: 'var(--Text-Warning)' },
  error:   { border: 'var(--Buttons-Error-Border)',   text: 'var(--Text-Error)' },
  info:    { border: 'var(--Buttons-Info-Border)',     text: 'var(--Text-Info)' },
};

const STEPPER_SX = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: 'var(--Buttons-Default-Light-Button)',
  border: '1px solid var(--Buttons-Default-Border)',
  color: 'var(--Buttons-Default-Light-Text)',
  cursor: 'pointer', outline: 'none', flexShrink: 0,
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: 'var(--Buttons-Default-Hover)' },
  '&:active': { backgroundColor: 'var(--Buttons-Default-Active)' },
  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
  '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
};

export function NumberField({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  variant = 'outlined',
  size = 'standard',
  label,
  labelPosition = 'top',
  placeholder,
  helperText,
  validation,
  validationMessage,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const isControlled = controlledValue !== undefined;
  const current = isControlled ? controlledValue : internalValue;
  const hasValue = current !== '' && current != null;

  const isOutlined = variant === 'outlined';
  const isSpinner = variant === 'spinner';
  const isSmall = size === 'small' && isSpinner;
  const isFloating = labelPosition === 'floating';
  const isTop = labelPosition === 'top';

  const validationConfig = validation ? VALIDATION_COLORS[validation] : null;
  const borderColor = validationConfig
    ? validationConfig.border
    : (focused ? 'var(--Buttons-Default-Border)' : 'inherit');

  const setValue = useCallback((next) => {
    let v = typeof next === 'number' ? next : parseFloat(next);
    if (isNaN(v)) v = 0;
    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  }, [isControlled, onChange, min, max]);

  const increment = () => { if (!disabled) setValue(current + step); };
  const decrement = () => { if (!disabled) setValue(current - step); };
  const atMin = min !== undefined && current <= min;
  const atMax = max !== undefined && current >= max;

  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') {
      if (!isControlled) setInternalValue(raw);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) setValue(num);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); increment(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); decrement(); }
  };

  // Sizing
  const height = isOutlined ? 56 : (isSmall ? 32 : 40);
  const fontSize = isOutlined ? '16px' : (isSmall ? '13px' : '14px');
  const floatingHeight = isOutlined ? 56 : undefined; // outlined is already 56

  const helperContent = validation && validationMessage
    ? { text: validationMessage, color: validationConfig.text }
    : helperText
      ? { text: helperText, color: 'var(--Text-Quiet)' }
      : null;

  /* ─── OUTLINED ─── */
  if (isOutlined) {
    return (
      <Box
        data-surface="Container-Lowest"
        className={'numberfield numberfield-outlined' +
          (validation ? ' numberfield-' + validation : '') +
          (disabled ? ' numberfield-disabled' : '') +
          (className ? ' ' + className : '')}
        sx={{ width: fullWidth ? '100%' : 'auto', fontFamily: 'inherit', ...sx }}
        {...props}
      >
        {/* Top label */}
        {isTop && label && (
          <Box sx={{ display: 'block', marginBottom: '6px', color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)', fontSize: '14px', fontWeight: 500, opacity: disabled ? 0.6 : 1 }}>
            {label}
          </Box>
        )}

        <Box sx={{
          position: 'relative', display: 'flex', alignItems: 'stretch',
          height: height + 'px',
          border: '1px solid ' + borderColor,
          borderRadius: 'var(--Style-Border-Radius)',
          backgroundColor: 'var(--Background)',
          transition: 'border-color 0.15s ease',
          opacity: disabled ? 0.5 : 1,
          '&:focus-within': !validationConfig ? { borderColor: 'var(--Buttons-Default-Border)' } : {},
        }}>
          {/* Floating label */}
          {isFloating && label && (
            <Box sx={{
              position: 'absolute',
              top: hasValue || focused ? '6px' : '50%',
              left: '14px',
              transform: hasValue || focused ? 'scale(0.75)' : 'translateY(-50%)',
              transformOrigin: 'top left',
              color: focused ? 'var(--Hotlink)' : 'var(--Text-Quiet)',
              fontSize: '16px', fontWeight: 400,
              pointerEvents: 'none',
              transition: 'top 0.15s ease, transform 0.15s ease, color 0.15s ease',
              zIndex: 1,
            }}>
              {label}
            </Box>
          )}

          {/* Input */}
          <Box
            component="input"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-valuenow={typeof current === 'number' ? current : undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={label || 'Number'}
            value={current}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            placeholder={isFloating ? undefined : (placeholder || '')}
            sx={{
              flex: 1, border: 'none', outline: 'none',
              backgroundColor: 'transparent',
              color: 'var(--Text)', fontSize,
              fontFamily: 'inherit',
              padding: isFloating ? '22px 14px 6px' : '0 14px',
              minWidth: 0,
              '&::placeholder': { color: 'var(--Text-Quiet)', opacity: 1 },
              '&:disabled': { cursor: 'not-allowed' },
            }}
          />

          {/* Up/Down steppers stacked vertically */}
          <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid ' + borderColor }}>
            <Box component="button" type="button" aria-label="Increase" onClick={increment}
              disabled={disabled || atMax}
              sx={{
                ...STEPPER_SX,
                width: 32, flex: 1,
                borderRadius: '0 var(--Style-Border-Radius) 0 0',
                borderBottom: '1px solid var(--Buttons-Default-Border)',
                border: 'none', borderLeft: 'none',
                '& .MuiSvgIcon-root': { fontSize: 18 },
              }}>
              <KeyboardArrowUpIcon />
            </Box>
            <Box component="button" type="button" aria-label="Decrease" onClick={decrement}
              disabled={disabled || atMin}
              sx={{
                ...STEPPER_SX,
                width: 32, flex: 1,
                borderRadius: '0 0 var(--Style-Border-Radius) 0',
                border: 'none', borderLeft: 'none',
                borderTop: '1px solid var(--Buttons-Default-Border)',
                '& .MuiSvgIcon-root': { fontSize: 18 },
              }}>
              <KeyboardArrowDownIcon />
            </Box>
          </Box>
        </Box>

        {/* Helper / Validation */}
        {helperContent && (
          <Box sx={{ fontSize: '12px', color: helperContent.color, mt: '4px', ml: '2px' }}>
            {helperContent.text}
          </Box>
        )}
      </Box>
    );
  }

  /* ─── SPINNER ─── */
  const btnSize = isSmall ? 28 : 36;
  const btnRadius = isSmall ? '6px' : '8px';
  const iconSize = isSmall ? 16 : 20;

  return (
    <Box
      data-surface="Container-Lowest"
      className={'numberfield numberfield-spinner numberfield-' + size +
        (validation ? ' numberfield-' + validation : '') +
        (disabled ? ' numberfield-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{ fontFamily: 'inherit', ...sx }}
      {...props}
    >
      {/* Top label */}
      {isTop && label && (
        <Box sx={{ display: 'block', marginBottom: '6px', color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)', fontSize: isSmall ? '13px' : '14px', fontWeight: 500, opacity: disabled ? 0.6 : 1 }}>
          {label}
        </Box>
      )}

      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: isSmall ? 0.5 : 1,
        opacity: disabled ? 0.5 : 1,
      }}>
        {/* Decrement */}
        <Box component="button" type="button" aria-label="Decrease" onClick={decrement}
          disabled={disabled || atMin}
          sx={{
            ...STEPPER_SX,
            width: btnSize, height: btnSize,
            borderRadius: btnRadius,
            '& .MuiSvgIcon-root': { fontSize: iconSize },
          }}>
          <RemoveIcon />
        </Box>

        {/* Value display */}
        <Box
          component="input"
          ref={inputRef}
          type="text"
          inputMode="numeric"
          role="spinbutton"
          aria-valuenow={typeof current === 'number' ? current : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label || 'Number'}
          value={current}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          sx={{
            width: isSmall ? 40 : 56,
            height: isSmall ? 28 : 36,
            textAlign: 'center',
            border: '1px solid ' + borderColor,
            borderRadius: btnRadius,
            backgroundColor: 'var(--Background)',
            color: 'var(--Text)',
            fontSize,
            fontFamily: 'inherit',
            fontWeight: 600,
            outline: 'none',
            transition: 'border-color 0.15s ease',
            '&:focus': { borderColor: 'var(--Buttons-Default-Border)' },
            '&:disabled': { cursor: 'not-allowed' },
          }}
        />

        {/* Increment */}
        <Box component="button" type="button" aria-label="Increase" onClick={increment}
          disabled={disabled || atMax}
          sx={{
            ...STEPPER_SX,
            width: btnSize, height: btnSize,
            borderRadius: btnRadius,
            '& .MuiSvgIcon-root': { fontSize: iconSize },
          }}>
          <AddIcon />
        </Box>
      </Box>

      {/* Helper / Validation */}
      {helperContent && (
        <Box sx={{ fontSize: '12px', color: helperContent.color, mt: '4px', ml: '2px' }}>
          {helperContent.text}
        </Box>
      )}
    </Box>
  );
}

export default NumberField;
