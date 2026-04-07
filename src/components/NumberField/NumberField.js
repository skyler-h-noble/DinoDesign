// src/components/NumberField/NumberField.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Icon } from '../Icon/Icon';
import { Body, BodySmall } from '../Typography';

/**
 * NumberField Component
 *
 * VARIANTS:
 *   outlined  Input with up/down stepper buttons inside right edge.
 *   spinner   Standalone −/+ buttons flanking a centered number.
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STYLE: outline | light
 *   outline: outer border + data-surface="Container"
 *   light:   outer border + data-theme="{C}-Light" data-surface="Surface-Dim"
 *
 * SIZES: small | medium | large (matches button heights)
 *
 * LABEL: top | floating | none
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', padding: '4px 8px',  iconSize: 16, btnSize: 28 },
  medium: { height: 'var(--Button-Height)',        fontSize: '14px', padding: '6px 12px', iconSize: 18, btnSize: 36 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: '16px', padding: '8px 16px', iconSize: 20, btnSize: 44 },
};

export function NumberField({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  variant = 'outlined',   // 'outlined' | 'spinner'
  style: styleVariant = 'outline', // 'outline' | 'light'
  color = 'default',
  size = 'medium',
  label,
  labelPosition = 'top',
  placeholder,
  helperText,
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

  const effectiveColor = color === 'default' ? 'primary' : color;
  const C = cap(effectiveColor);
  const isLight = styleVariant === 'light';
  const borderToken = 'var(--Buttons-' + C + '-Border)';
  const activeTextColor = color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')';

  const isOutlined = variant === 'outlined';
  const isSpinner = variant === 'spinner';
  const isFloating = labelPosition === 'floating';
  const isTop = labelPosition === 'top';

  const sc = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = size === 'small' ? BodySmall : Body;

  const setValue = useCallback((next) => {
    let v = typeof next === 'number' ? next : parseFloat(next);
    if (isNaN(v)) v = 0;
    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  }, [isControlled, onChange, min, max]);

  // Keep latest value in a ref so press-and-hold intervals don't see a stale closure.
  const currentRef = useRef(current);
  currentRef.current = current;

  const stepBy = useCallback((dir) => {
    if (disabled) return;
    const base = typeof currentRef.current === 'number' ? currentRef.current : parseFloat(currentRef.current) || 0;
    const next = base + dir * step;
    if (min !== undefined && dir < 0 && base <= min) return;
    if (max !== undefined && dir > 0 && base >= max) return;
    setValue(next);
  }, [disabled, step, min, max, setValue]);

  const increment = () => stepBy(1);
  const decrement = () => stepBy(-1);
  const atMin = min !== undefined && current <= min;
  const atMax = max !== undefined && current >= max;

  // Press-and-hold to repeat. Initial delay then accelerating interval.
  const holdTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);

  const stopHold = useCallback(() => {
    if (holdTimeoutRef.current) { clearTimeout(holdTimeoutRef.current); holdTimeoutRef.current = null; }
    if (holdIntervalRef.current) { clearInterval(holdIntervalRef.current); holdIntervalRef.current = null; }
  }, []);

  const startHold = useCallback((dir) => {
    if (disabled) return;
    stopHold();
    // First tick fires immediately on press.
    stepBy(dir);
    // After a short delay, begin repeating.
    holdTimeoutRef.current = setTimeout(() => {
      let interval = 120;
      let ticks = 0;
      const tick = () => {
        stepBy(dir);
        ticks += 1;
        // Accelerate after sustained hold.
        if (ticks === 10 && interval > 60) {
          clearInterval(holdIntervalRef.current);
          interval = 60;
          holdIntervalRef.current = setInterval(tick, interval);
        } else if (ticks === 30 && interval > 30) {
          clearInterval(holdIntervalRef.current);
          interval = 30;
          holdIntervalRef.current = setInterval(tick, interval);
        }
      };
      holdIntervalRef.current = setInterval(tick, interval);
    }, 400);
  }, [disabled, stepBy, stopHold]);

  useEffect(() => stopHold, [stopHold]);

  const holdHandlers = (dir) => ({
    onPointerDown: (e) => {
      // Only respond to primary button / touch / pen.
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch (_) {}
      startHold(dir);
    },
    onPointerUp: (e) => {
      try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch (_) {}
      stopHold();
    },
    onPointerCancel: stopHold,
    onPointerLeave: stopHold,
    // Keyboard accessibility: hold Enter/Space to repeat.
    onKeyDown: (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        startHold(dir);
      }
    },
    onKeyUp: (e) => {
      if (e.key === 'Enter' || e.key === ' ') stopHold();
    },
    onBlur: stopHold,
  });

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

  const stepperSx = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'var(--Buttons-' + C + '-Light-Button, transparent)',
    color: 'var(--Buttons-' + C + '-Light-Text, var(--Text))',
    cursor: 'pointer', outline: 'none', flexShrink: 0, border: 'none',
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: 'var(--Buttons-' + C + '-Hover)' },
    '&:active': { backgroundColor: 'var(--Buttons-' + C + '-Active)' },
    '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  };

  const innerAttrs = isLight
    ? { 'data-theme': C + '-Light', 'data-surface': 'Surface-Dim' }
    : { 'data-surface': 'Container' };

  const renderLabel = () => {
    if (!isTop || !label) return null;
    return (
      <LabelComp
        component="label"
        style={{
          display: 'block', marginBottom: '6px',
          color: disabled ? 'var(--Quiet)' : 'var(--Text)',
          fontWeight: 500,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {label}
      </LabelComp>
    );
  };

  /* ─── OUTLINED ─── */
  if (isOutlined) {
    return (
      <Box
        className={'numberfield numberfield-outlined' +
          (disabled ? ' numberfield-disabled' : '') +
          (className ? ' ' + className : '')}
        sx={{ width: fullWidth ? '100%' : 'auto', fontFamily: 'inherit', ...sx }}
        {...props}
      >
        {renderLabel()}

        {/* Outer border shell */}
        <Box sx={{
          border: '1px solid ' + borderToken,
          borderRadius: 'var(--Style-Border-Radius)',
          overflow: 'hidden',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: 'var(--Effect-Level-1)',
          '&:hover': { boxShadow: 'var(--Effect-Level-2)' },
          opacity: disabled ? 0.5 : 1,
          '&:focus-within': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '2px',
          },
        }}>

        {/* Inner themed surface */}
        <Box {...innerAttrs}>
          <Box sx={{
            position: 'relative', display: 'flex', alignItems: 'stretch',
            minHeight: sc.height,
            backgroundColor: 'var(--Background)',
          }}>
            {/* Floating label */}
            {isFloating && label && (
              <Box sx={{
                position: 'absolute',
                top: hasValue || focused ? '6px' : '50%',
                left: '14px',
                transform: hasValue || focused ? 'scale(0.75)' : 'translateY(-50%)',
                transformOrigin: 'top left',
                color: focused ? activeTextColor : 'var(--Quiet)',
                fontSize: sc.fontSize, fontWeight: 400,
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
                color: (hasValue || focused) ? activeTextColor : 'var(--Quiet)',
                fontSize: sc.fontSize,
                fontFamily: 'var(--Body-Font-Family)',
                fontWeight: 'var(--Body-Font-Weight)',
                padding: isFloating ? '22px 14px 6px' : sc.padding,
                minWidth: 0,
                '&::placeholder': { color: 'var(--Quiet)', opacity: 1 },
                '&:disabled': { cursor: 'not-allowed' },
              }}
            />

            {/* Up/Down steppers */}
            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid ' + borderToken }}>
              <Box component="button" type="button" aria-label="Increase" {...holdHandlers(1)}
                disabled={disabled || atMax}
                sx={{ ...stepperSx, flex: 1, width: 32, borderBottom: '1px solid ' + borderToken }}>
                <Icon size="small"><KeyboardArrowUpIcon /></Icon>
              </Box>
              <Box component="button" type="button" aria-label="Decrease" {...holdHandlers(-1)}
                disabled={disabled || atMin}
                sx={{ ...stepperSx, flex: 1, width: 32 }}>
                <Icon size="small"><KeyboardArrowDownIcon /></Icon>
              </Box>
            </Box>
          </Box>
        </Box>
        </Box>

        {/* Helper */}
        {helperText && (
          <BodySmall style={{ color: 'var(--Quiet)', marginTop: '4px', marginLeft: '2px' }}>
            {helperText}
          </BodySmall>
        )}
      </Box>
    );
  }

  /* ─── SPINNER ─── */
  return (
    <Box
      className={'numberfield numberfield-spinner' +
        (disabled ? ' numberfield-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{ fontFamily: 'inherit', ...sx }}
      {...props}
    >
      {renderLabel()}

      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: size === 'small' ? 0.5 : 1,
        opacity: disabled ? 0.5 : 1,
      }}>
        {/* Decrement */}
        <Box component="button" type="button" aria-label="Decrease" {...holdHandlers(-1)}
          disabled={disabled || atMin}
          sx={{
            ...stepperSx,
            width: sc.btnSize, height: sc.btnSize,
            borderRadius: 'var(--Style-Border-Radius)',
            border: '1px solid ' + borderToken,
          }}>
          <Icon size="small"><RemoveIcon /></Icon>
        </Box>

        {/* Value */}
        <Box sx={{
          border: '1px solid ' + borderToken,
          borderRadius: 'var(--Style-Border-Radius)',
          overflow: 'hidden',
          '&:focus-within': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '2px',
          },
        }}>
        <Box {...innerAttrs}>
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
              width: size === 'small' ? 40 : 56,
              minHeight: sc.height,
              textAlign: 'center',
              border: 'none', outline: 'none',
              backgroundColor: 'var(--Background)',
              color: 'var(--Text)',
              fontSize: sc.fontSize,
              fontFamily: 'var(--Body-Font-Family)',
              fontWeight: 600,
              '&:disabled': { cursor: 'not-allowed' },
            }}
          />
        </Box>
        </Box>

        {/* Increment */}
        <Box component="button" type="button" aria-label="Increase" {...holdHandlers(1)}
          disabled={disabled || atMax}
          sx={{
            ...stepperSx,
            width: sc.btnSize, height: sc.btnSize,
            borderRadius: 'var(--Style-Border-Radius)',
            border: '1px solid ' + borderToken,
          }}>
          <Icon size="small"><AddIcon /></Icon>
        </Box>
      </Box>

      {/* Helper */}
      {helperText && (
        <BodySmall style={{ color: 'var(--Quiet)', marginTop: '4px', marginLeft: '2px' }}>
          {helperText}
        </BodySmall>
      )}
    </Box>
  );
}

export default NumberField;
