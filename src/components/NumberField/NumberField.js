// src/components/NumberField/NumberField.js
import React, { useState, useId, useCallback } from 'react';
import { Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Input as TextInput } from '../Input/Input';
import { FieldButton } from './FieldButton';
import { FormLabel } from '../FormLabel/FormLabel';
import { FormHelper } from '../FormHelper/FormHelper';

/**
 * NumberField — Figma's Number (9518:52318) inside NumberField (9518:52593).
 *
 * It is ASSEMBLED from parts that are each checked against Figma on their own,
 * rather than drawing its own field and buttons (it used to: 13–16px text, its
 * own border, square steppers):
 *
 *   field      TextInput — the Input set, so the edge, fill, states, Body text
 *              and the floating label are the Input's
 *   steppers   FieldButton — Figma's Field Button (ghost in the stacked
 *              column, outline in the spinner row)
 *   label      FormLabel — top / left, as InputField and SelectField
 *
 * VARIANTS (Figma's Type):
 *   outlined   the field with a column on its trailing edge: Increase above,
 *              a 1px Border-Variant divider, Decrease below. The column's
 *              left edge is the field's border, shared (Figma overlaps them
 *              by 1px). Height is --Numberfield: two FieldButton heights, the
 *              divider and the 1px edges — 67 at medium.
 *   spinner    Decrease · field · Increase in a row, Sizing-1 apart, the
 *              steppers outline FieldButtons.
 *   labelPosition="floating" gives Figma's Floating-outline / Floating-Spinner.
 *
 * KEYBOARD (WAI-ARIA spinbutton): the input is role="spinbutton" with
 * aria-valuenow/min/max; ArrowUp / ArrowDown step, PageUp / PageDown step by
 * ten, Home / End jump to min / max. The steppers are pointer conveniences and
 * stay out of the tab order — the arrows already do their job from the field.
 */

const PREFIX = { small: 'Sm-', medium: '', large: 'Lg-' };
const NUMBERFIELD_FALLBACK = { small: 50, medium: 67, large: 116 };

export function NumberField({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  variant = 'outlined',   // 'outlined' | 'spinner'
  // Kept so old call sites still compile; neither changes the drawing now.
  style: _styleVariant,
  color: _color,
  size = 'medium',
  label,
  labelPosition = 'top',  // 'top' | 'left' | 'floating' | 'none'
  placeholder,
  helperText,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const current = isControlled ? controlledValue : internalValue;
  const inputId = useId();
  const p = PREFIX[size] ?? '';

  const isOutlined = variant !== 'spinner';
  const isFloating = labelPosition === 'floating';
  const showLabel = label && (labelPosition === 'top' || labelPosition === 'left');

  const clamp = useCallback((v) => {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  }, [min, max]);

  const commit = useCallback((next) => {
    let v = typeof next === 'number' ? next : parseFloat(next);
    if (Number.isNaN(v)) v = 0;
    v = clamp(v);
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  }, [clamp, isControlled, onChange]);

  const num = Number(current) || 0;
  const atMin = min !== undefined && num <= min;
  const atMax = max !== undefined && num >= max;

  const handleKeyDown = (e) => {
    if (disabled) return;
    const keys = {
      ArrowUp: () => commit(num + step),
      ArrowDown: () => commit(num - step),
      PageUp: () => commit(num + step * 10),
      PageDown: () => commit(num - step * 10),
      Home: () => min !== undefined && commit(min),
      End: () => max !== undefined && commit(max),
    };
    if (keys[e.key]) { e.preventDefault(); keys[e.key](); }
  };

  // In the stacked column the buttons are square (Figma); the column's corner clips them.
  const stackedSx = isOutlined ? { borderRadius: 0 } : {};
  const increase = (
    <FieldButton variant={isOutlined ? 'ghost' : 'outline'} size={size} aria-label="Increase" tabIndex={-1} data-own-state sx={stackedSx}
      disabled={disabled || atMax} onClick={() => commit(num + step)}>
      <KeyboardArrowUpIcon />
    </FieldButton>
  );
  const decrease = (
    <FieldButton variant={isOutlined ? 'ghost' : 'outline'} size={size} aria-label="Decrease" tabIndex={-1} data-own-state sx={stackedSx}
      disabled={disabled || atMin} onClick={() => commit(num - step)}>
      <KeyboardArrowDownIcon />
    </FieldButton>
  );

  const field = (
    <TextInput
      id={inputId}
      size={size}
      fullWidth
      disabled={disabled}
      placeholder={placeholder}
      value={current}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '' || raw === '-') { if (!isControlled) setInternalValue(raw); return; }
        commit(raw);
      }}
      labelPosition={isFloating ? 'floating' : 'standard'}
      label={isFloating ? label : undefined}
      aria-label={isFloating ? undefined : (ariaLabel || label)}
      inputProps={{
        role: 'spinbutton',
        inputMode: 'decimal',
        'aria-valuenow': num,
        ...(min !== undefined && { 'aria-valuemin': min }),
        ...(max !== undefined && { 'aria-valuemax': max }),
        onKeyDown: handleKeyDown,
      }}
      sx={isOutlined ? {
        /* The field fills the row's height and gives up its trailing corners:
           the stepper column carries them, sharing the field's right edge. */
        height: '100%', flex: 1, minWidth: 0,
        '& .inp-shell': { height: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 },
        // The ring is the whole control's (field + steppers), drawn on the row.
        '& .inp-shell:focus-within': { outline: 'none' },
        '& .inp-shell > div, & .MuiFormControl-root, & .MuiOutlinedInput-root': { height: '100%' },
      } : { flex: 1, minWidth: 0 }}
    />
  );

  const row = isOutlined ? (
    <Box className="numberfield-row" sx={{
      display: 'flex', alignItems: 'stretch',
      height: 'var(--' + p + 'Numberfield, ' + NUMBERFIELD_FALLBACK[size] + 'px)',
      width: '100%',
      /* One focus ring round field AND steppers — the house 2px ring 1px out,
         following the field's corner. The steppers are out of the tab order
         (the arrow keys do their job from the field), so they draw none. */
      borderRadius: 'var(--' + p + 'Input-Radius, var(--Input-Radius, 4px))',
      '&:focus-within': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
    }}>
      {field}
      <Box className="numberfield-steppers" sx={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        // Overlaps the field's right edge by its 1px, as Figma's gap -1 does.
        ml: '-1px', p: '1px', boxSizing: 'border-box', flexShrink: 0, overflow: 'hidden',
        borderRadius: '0 var(--' + p + 'Input-Radius, var(--Input-Radius, 4px)) var(--' + p + 'Input-Radius, var(--Input-Radius, 4px)) 0',
        '&::after': {
          content: '""', position: 'absolute', inset: 0, pointerEvents: 'none',
          border: '1px solid var(--Border)', borderRadius: 'inherit',
        },
        ...(disabled && { opacity: 'var(--Disabled, 0.38)' }),
      }}>
        {increase}
        <Box aria-hidden="true" sx={{ height: 'var(--' + p + 'Divider, 1px)', backgroundColor: 'var(--Border-Variant)', flexShrink: 0 }} />
        {decrease}
      </Box>
    </Box>
  ) : (
    <Box className="numberfield-row" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1, 8px)', width: '100%' }}>
      {decrease}
      {field}
      {increase}
    </Box>
  );

  return (
    <Box
      className={'numberfield numberfield-' + (isOutlined ? 'outlined' : 'spinner') + (disabled ? ' numberfield-disabled' : '') + (className ? ' ' + className : '')}
      sx={{
        display: labelPosition === 'left' && showLabel ? 'grid' : 'flex',
        ...(labelPosition === 'left' && showLabel
          ? { gridTemplateColumns: 'auto minmax(0, 1fr)', columnGap: 'var(--Sizing-1, 8px)', alignItems: 'center' }
          : { flexDirection: 'column', gap: 'var(--Sizing-Half, 4px)' }),
        width: fullWidth ? '100%' : 'auto',
        ...sx,
      }}
      {...props}
    >
      {showLabel && (
        <FormLabel htmlFor={inputId} disabled={disabled}
          sx={disabled ? { opacity: 'var(--Disabled, 0.38)' } : undefined}>
          {label}
        </FormLabel>
      )}
      {row}
      {helperText && <FormHelper helperText={helperText} sx={labelPosition === 'left' && showLabel ? { gridColumn: 2 } : undefined} />}
    </Box>
  );
}

export default NumberField;
