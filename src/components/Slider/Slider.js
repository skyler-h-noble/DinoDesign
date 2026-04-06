// src/components/Slider/Slider.js
import React from 'react';
import { Slider as MuiSlider, Box } from '@mui/material';
import { Body, BodySmall } from '../Typography';

/**
 * Slider Component
 * Full-featured slider with complete design system integration
 *
 * VARIANTS:
 *   SOLID   variant="{color}"           solid track + handle border, all 8 colors
 *   LIGHT   variant="{color}-light"     colored track + thumb, all 8 colors
 *
 * SIZES: small (12px visual) | medium (16px visual) | large (20px visual)
 *   Thumb element is always 24×24px for WCAG 2.2 AA touch target.
 *   Visual dot lives in ::before at the designated size.
 *   Range slider: visual dots offset to avoid overlap at close values.
 *
 * LABEL DISPLAY: off | on | auto (show on hover/focus)
 *
 * ORIENTATION: horizontal (default) | vertical
 * TRACK: normal | inverted
 * RANGE: pass value={[20, 80]} for a two-thumb range slider
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Style Builder -----------------------------------------------------------

function colorStyles(color) {
  const C = cap(color);
  return {
    thumb:          'var(--Buttons-' + C + '-Button)',
    thumbBorder:    '1px solid var(--Buttons-' + C + '-Border)',
    track:          'var(--Buttons-' + C + '-Button)',
    trackBorder:    '1px solid var(--Buttons-' + C + '-Border)',
    rail:           'var(--Border-Variant)',
    valueLabel:     'var(--Buttons-' + C + '-Text)',
    valueLabelText: 'var(--Buttons-' + C + '-Button)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color] = colorStyles(color);
  });
  return map;
}

// --- Sizing ------------------------------------------------------------------
// Thumb is always ≥ 24×24px for WCAG 2.2 AA touch target.
// The visual circle lives in ::before at the designated visual size.
// Range slider: visual dots offset so they don't overlap when close.

const TOUCH_MIN = 24;

const SIZE_MAP = {
  small:  { visual: 12, track: 2,  labelSize: 11 },
  medium: { visual: 16, track: 4,  labelSize: 12 },
  large:  { visual: 20, track: 6,  labelSize: 13 },
};

// --- Component ---------------------------------------------------------------

export function Slider({
  variant = 'primary',
  size = 'medium',
  value,
  defaultValue,
  onChange,
  onChangeCommitted,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  valueLabelDisplay = 'off',
  orientation = 'horizontal',
  track = 'normal',
  disabled = false,
  label,
  name,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['primary'];
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const isVertical = orientation === 'vertical';
  const isRange = Array.isArray(value) || Array.isArray(defaultValue);
  const isInverted = track === 'inverted';
  const LabelComp = size === 'small' ? BodySmall : Body;

  const totalTrack = sizeConfig.track + 2; // inner height + 1px border each side

  // When inverted, the rail gets track styling and the track gets rail styling
  const railBg     = isInverted ? styles.track       : styles.rail;
  const railBorder = isInverted ? styles.trackBorder  : null;
  const trackBg    = isInverted ? styles.rail         : styles.track;
  const trackBr    = isInverted ? null                : styles.trackBorder;

  const sliderSx = {
    // Root
    color: styles.track === 'transparent' ? styles.thumb : styles.track,
    height: isVertical ? undefined : totalTrack,
    width: isVertical ? totalTrack : undefined,

    // Rail (unfilled background) — matches total track visual height
    '& .MuiSlider-rail': {
      backgroundColor: railBg,
      border: railBorder || 'none',
      boxSizing: railBorder ? 'content-box' : 'border-box',
      opacity: 1,
      height: isVertical ? undefined : (railBorder ? sizeConfig.track : totalTrack),
      width: isVertical ? (railBorder ? sizeConfig.track : totalTrack) : undefined,
      borderRadius: totalTrack / 2,
    },

    // Track (filled portion) — inner height + 1px border each side = totalTrack
    '& .MuiSlider-track': {
      boxSizing: trackBr ? 'content-box' : 'border-box',
      backgroundColor: trackBg,
      border: trackBr || 'none',
      height: isVertical ? undefined : (trackBr ? sizeConfig.track : totalTrack),
      width: isVertical ? (trackBr ? sizeConfig.track : totalTrack) : undefined,
      borderRadius: totalTrack / 2,
    },

    // Thumb — 24×24 touch target, visual dot in ::before
    '& .MuiSlider-thumb': {
      width: TOUCH_MIN,
      height: TOUCH_MIN,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      transition: 'none',
      // Remove MUI default ::after
      '&::after': { display: 'none' },

      // Visual circle
      '&::before': {
        content: '""',
        position: 'absolute',
        width: sizeConfig.visual,
        height: sizeConfig.visual,
        borderRadius: '50%',
        backgroundColor: styles.thumb,
        border: styles.thumbBorder || 'none',
        boxShadow: 'var(--Effect-Level-1)',
        transition: 'box-shadow 0.15s ease-in-out',
        // Centered by default (single slider)
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },

      '&:hover::before': {
        boxShadow: 'var(--Effect-Level-2)',
      },

      '&.Mui-active::before': {
        boxShadow: 'var(--Effect-Level-1)',
      },

      '&.Mui-focusVisible': {
        outline: '2px solid var(--Focus-Visible)',
        outlineOffset: '2px',
        borderRadius: '50%',
      },
      '&.Mui-focusVisible::before': {
        boxShadow: 'var(--Effect-Level-2)',
      },
    },

    // Range slider — offset visual dots so they don't stack
    ...(isRange ? (isVertical ? {
      // Vertical: bottom thumb (index 0) → dot at top, top thumb (index 1) → dot at bottom
      '& .MuiSlider-thumb[data-index="0"]::before': {
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      },
      '& .MuiSlider-thumb[data-index="1"]::before': {
        top: 'auto',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      },
    } : {
      // Horizontal: left thumb (index 0) → dot right-aligned, right thumb (index 1) → dot left-aligned
      '& .MuiSlider-thumb[data-index="0"]::before': {
        left: 'auto',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      },
      '& .MuiSlider-thumb[data-index="1"]::before': {
        left: 0,
        right: 'auto',
        top: '50%',
        transform: 'translateY(-50%)',
      },
    }) : {}),

    // Value label (tooltip)
    '& .MuiSlider-valueLabel': {
      backgroundColor: styles.valueLabel,
      color: styles.valueLabelText,
      fontSize: sizeConfig.labelSize,
      fontWeight: 600,
      borderRadius: '6px',
      padding: '2px 8px',
      '&::before': {
        backgroundColor: styles.valueLabel,
      },
    },

    // Marks
    '& .MuiSlider-mark': {
      backgroundColor: styles.rail,
      width: isVertical ? totalTrack : 2,
      height: isVertical ? 2 : totalTrack,
      borderRadius: 1,
    },
    '& .MuiSlider-markActive': {
      backgroundColor: styles.thumb,
      opacity: 0.6,
    },
    '& .MuiSlider-markLabel': {
      color: 'var(--Text-Quiet)',
      fontSize: sizeConfig.labelSize,
    },

    // Disabled
    '&.Mui-disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      '& .MuiSlider-thumb::before': {
        boxShadow: 'none',
      },
    },

    ...sx,
  };

  const sliderElement = (
    <MuiSlider
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      min={min}
      max={max}
      step={step}
      marks={marks}
      valueLabelDisplay={valueLabelDisplay}
      orientation={orientation}
      track={track === 'inverted' ? 'inverted' : track === false ? false : 'normal'}
      disabled={disabled}
      name={name}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={'slider-' + variant + ' ' + className}
      sx={sliderSx}
      {...props}
    />
  );

  if (label) {
    return (
      <Box
        sx={{
          width: isVertical ? 'auto' : '100%',
          height: isVertical ? '100%' : 'auto',
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'column',
          gap: '4px',
        }}
      >
        <LabelComp
          component="label"
          sx={{
            color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
            fontSize: size === 'small' ? '13px' : '15px',
            fontWeight: 500,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {label}
        </LabelComp>
        {sliderElement}
      </Box>
    );
  }

  return sliderElement;
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

export const DefaultSlider   = (p) => <Slider variant="default"   {...p} />;
export const PrimarySlider   = (p) => <Slider variant="primary"   {...p} />;
export const SecondarySlider = (p) => <Slider variant="secondary" {...p} />;
export const TertiarySlider  = (p) => <Slider variant="tertiary"  {...p} />;
export const NeutralSlider   = (p) => <Slider variant="neutral"   {...p} />;
export const InfoSlider      = (p) => <Slider variant="info"      {...p} />;
export const SuccessSlider   = (p) => <Slider variant="success"   {...p} />;
export const WarningSlider   = (p) => <Slider variant="warning"   {...p} />;
export const ErrorSlider     = (p) => <Slider variant="error"     {...p} />;

// Legacy exports for backwards compatibility
export const SliderInput = Slider;
export const RangeSlider = Slider;

export default Slider;
