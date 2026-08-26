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
import { BodyLarge, Body, BodySmall } from '../Typography';
import { tokenSegment } from '../_shadows';

/**
 * Radio Component
 *
 * Single style (no outline/light split). Color drives the ring + dot.
 *
 * GEOMETRY (Figma-aligned):
 *   small  — parent 24×24, outer ring 16×16, inner dot 8×8,    BodySmall label, 4px gap
 *   medium — parent 24×24, outer ring 20×20, inner dot 9.5×9.5, Body label,      8px gap
 *   large  — parent 24×24, outer ring 24×24, inner dot 9.5×9.5, BodyLarge label, 12px gap
 *
 * COLORS: default | primary | secondary | tertiary | neutral |
 *         info | success | warning | error
 *
 * ACCESSIBILITY:
 *   - aria-label / aria-labelledby forwarded to <input> per WCAG 1.3.1
 *   - Without a visible label prop, always provide aria-label
 *   - Use RadioGroup with a label for grouped radio buttons
 */

// black-white matches Button and Checkbox. It capitalises to `Black-white`,
// which is not a token — the system emits --Buttons-BlackWhite-*, so the name
// goes through the shared tokenSegment mapping rather than cap().
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error', 'black-white'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const seg = tokenSegment;

// --- Sizing ------------------------------------------------------------------
// touchTarget is the 24×24 parent container; box is the outer ring; dot is the
// inner filled circle when checked. Padding between target and ring is derived.

const SIZE_MAP = {
  small:  { touchTarget: 24, box: 16, dot: 8,   gap: 4,  LabelComp: BodySmall },
  medium: { touchTarget: 24, box: 20, dot: 9.5, gap: 8,  LabelComp: Body },
  large:  { touchTarget: 24, box: 24, dot: 9.5, gap: 12, LabelComp: BodyLarge },
};

// --- Custom Radio Icons ------------------------------------------------------

function RadioCircleIcon({ size, color, checked }) {
  const C = seg(color);
  // Matches Checkbox: the DEFAULT colour draws its ring in --Quiet so an
  // unselected radio reads as a quiet affordance rather than a button. The dot
  // keeps the button token, so selecting one is what brings in the brand
  // colour. --Quiet is tuned to 4.5:1 on its surface, past the 3:1 a control
  // outline requires.
  const ringColor = C === 'Default' ? 'var(--Quiet)' : 'var(--Buttons-' + C + '-Border)';
  const dotColor = 'var(--Buttons-' + C + '-Border)';
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;

  return (
    <Box
      className="radio-circle-icon"
      sx={{
        width: sizeConfig.box,
        height: sizeConfig.box,
        boxSizing: 'border-box',
        borderRadius: '50%',
        border: '2px solid ' + ringColor,
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--Background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.15s ease-in-out',
      }}
    >
      {checked && (
        <Box
          sx={{
            width: sizeConfig.dot,
            height: sizeConfig.dot,
            borderRadius: '50%',
            backgroundColor: dotColor,
            transition: 'transform 0.15s ease-in-out',
          }}
        />
      )}
    </Box>
  );
}

// --- Radio Component ---------------------------------------------------------

export function Radio({
  color = 'primary',
  size = 'medium',
  label,
  // 'end'    — label to the right of the radio (default)
  // 'bottom' — label below the radio (matches the "vertical" Figma layout)
  // 'top' / 'start' also accepted (forwarded to MUI FormControlLabel)
  labelPlacement = 'end',
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
  const effectiveColor = COLORS.includes(color) ? color : 'primary';
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = sizeConfig.LabelComp;
  // Inset between the 24×24 parent and the outer ring. Comes out to:
  //   small  → 4px (24-16)/2
  //   medium → 2px (24-20)/2
  //   large  → 0px (24-24)/2
  const inset = (sizeConfig.touchTarget - sizeConfig.box) / 2;

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
      icon={<RadioCircleIcon size={size} color={effectiveColor} checked={false} />}
      checkedIcon={<RadioCircleIcon size={size} color={effectiveColor} checked={true} />}
      className={'radio-' + effectiveColor + ' ' + className}
      inputProps={mergedInputProps}
      disableRipple
      sx={{
        padding: inset + 'px',
        width: sizeConfig.touchTarget,
        height: sizeConfig.touchTarget,
        minWidth: sizeConfig.touchTarget,
        minHeight: sizeConfig.touchTarget,
        boxSizing: 'border-box',
        borderRadius: '50%',
        color: 'inherit',
        transition: 'background-color 0.15s ease-in-out',
        '&.Mui-checked': { color: 'inherit' },
        '&:hover': { backgroundColor: 'transparent' },
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
              lineHeight: 1.4,
              userSelect: 'none',
            }}
          >
            {label}
          </LabelComp>
        }
        labelPlacement={labelPlacement}
        disabled={disabled}
        sx={{
          marginLeft: 0,
          marginRight: 0,
          gap: sizeConfig.gap + 'px',
          // alignItems: 'center' works for both end/start (cross-axis is
          // vertical) and top/bottom (cross-axis is horizontal) — the radio
          // sits centered relative to the label either way.
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
  color = 'primary',
  size = 'medium',
  label,
  options = [],
  value,
  onChange,
  orientation = 'vertical',
  // Threaded to each child Radio. See Radio() for accepted values.
  labelPlacement = 'end',
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
      className={'radio-group-' + color + ' ' + className}
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
        sx={{
          // Explicit flex-direction so the layout flips even when sx ends up
          // winning over MUI's `row` prop in the cascade. Wrap keeps long
          // horizontal groups from overflowing.
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
          alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
          gap: spacing,
        }}
        {...props}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            color={color}
            size={size}
            label={option.label}
            labelPlacement={labelPlacement}
            value={option.value}
            disabled={option.disabled || disabled}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}

// --- Legacy / Convenience Aliases --------------------------------------------

// `RadioInput` is the historic export name — kept so older consumers don't
// break when the variant prop was removed.
export const RadioInput = Radio;

export default Radio;
