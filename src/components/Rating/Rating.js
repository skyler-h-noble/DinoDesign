// src/components/Rating/Rating.js
import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

/**
 * Rating Component
 *
 * COLORS: default, primary, secondary, tertiary, info, success, warning, error
 *   Filled star:  var(--Buttons-{C}-Button)
 *   Empty star:   var(--Text-Quiet)
 *   Hover star:   var(--Buttons-{C}-Hover)
 *
 * SIZES: small (20px), medium (28px), large (36px)
 *
 * MODES:
 *   controlled    value + onChange
 *   uncontrolled  defaultValue, internal state
 *   readOnly      display only, no interaction
 *   no rating     value={null}, shows all empty with "(No rating)" label
 *
 * FEATURES: max stars (default 5), precision (1 or 0.5), hover preview
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const COLOR_MAP = {
  default: 'Default',
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { iconSize: 20, gap: 2 },
  medium: { iconSize: 28, gap: 4 },
  large:  { iconSize: 36, gap: 4 },
};

export function Rating({
  value: controlledValue,
  defaultValue,
  onChange,
  max = 5,
  precision = 1,
  color = 'default',
  size = 'medium',
  readOnly = false,
  disabled = false,
  emptyLabel = 'No rating',
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const [hoverValue, setHoverValue] = useState(null);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;
  const isHalf = precision === 0.5;
  const isInteractive = !readOnly && !disabled;

  const C = COLOR_MAP[color] || COLOR_MAP.default;
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const filledColor = 'var(--Buttons-' + C + '-Button)';
  const hoverColor = 'var(--Buttons-' + C + '-Hover)';
  const emptyColor = 'var(--Text-Quiet)';

  const handleClick = (newValue) => {
    if (!isInteractive) return;
    // Click same value = clear
    const next = newValue === currentValue ? null : newValue;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleHalf = (starIndex, isLeftHalf) => {
    if (!isInteractive || !isHalf) return;
    const val = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    setHoverValue(val);
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const halfValue = index + 0.5;

    const isFilled = displayValue !== null && starValue <= displayValue;
    const isHalfFilled = displayValue !== null && !isFilled && isHalf && halfValue <= displayValue;
    const isHovering = hoverValue !== null;

    const starColor = (isFilled || isHalfFilled)
      ? (isHovering ? hoverColor : filledColor)
      : emptyColor;

    const IconComponent = isHalfFilled ? StarHalfIcon : (isFilled ? StarIcon : StarBorderIcon);

    if (isHalf && isInteractive) {
      // Half-precision: split star into two click zones
      return (
        <Box
          key={index}
          sx={{ position: 'relative', display: 'inline-flex', cursor: 'pointer' }}
          onMouseLeave={() => setHoverValue(null)}
        >
          {/* Left half */}
          <Box
            sx={{
              position: 'absolute', left: 0, top: 0, width: '50%', height: '100%',
              zIndex: 1, cursor: 'pointer',
            }}
            onMouseEnter={() => handleHalf(index, true)}
            onClick={() => handleClick(halfValue)}
          />
          {/* Right half */}
          <Box
            sx={{
              position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
              zIndex: 1, cursor: 'pointer',
            }}
            onMouseEnter={() => handleHalf(index, false)}
            onClick={() => handleClick(starValue)}
          />
          <IconComponent sx={{ fontSize: s.iconSize, color: starColor, transition: 'color 0.1s ease' }} />
        </Box>
      );
    }

    return (
      <Box
        key={index}
        component={isInteractive ? 'button' : 'span'}
        type={isInteractive ? 'button' : undefined}
        role={isInteractive ? 'radio' : undefined}
        aria-checked={isFilled}
        aria-label={(starValue) + ' star' + (starValue !== 1 ? 's' : '')}
        tabIndex={isInteractive ? 0 : -1}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => isInteractive && setHoverValue(starValue)}
        onMouseLeave={() => isInteractive && setHoverValue(null)}
        onKeyDown={(e) => {
          if (!isInteractive) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min((currentValue || 0) + precision, max);
            handleClick(next);
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max((currentValue || 0) - precision, 0);
            handleClick(next || null);
          }
        }}
        sx={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', backgroundColor: 'transparent', padding: 0,
          cursor: isInteractive ? 'pointer' : 'default',
          outline: 'none',
          '&:focus-visible': isInteractive ? { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px', borderRadius: '2px' } : {},
        }}
      >
        <IconComponent sx={{ fontSize: s.iconSize, color: starColor, transition: 'color 0.1s ease' }} />
      </Box>
    );
  };

  return (
    <Box
      role={isInteractive ? 'radiogroup' : 'img'}
      aria-label={'Rating' + (currentValue !== null ? ': ' + currentValue + ' of ' + max + ' stars' : ': ' + emptyLabel)}
      className={'rating rating-' + color + ' rating-' + size +
        (readOnly ? ' rating-readonly' : '') +
        (disabled ? ' rating-disabled' : '') +
        (currentValue === null ? ' rating-empty' : '') +
        (className ? ' ' + className : '')}
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: s.gap + 'px',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        ...sx,
      }}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => renderStar(i))}
      {currentValue === null && !hoverValue && (
        <Box component="span" sx={{ fontSize: size === 'small' ? '11px' : '13px', color: 'var(--Text-Quiet)', ml: 0.5 }}>
          {emptyLabel}
        </Box>
      )}
    </Box>
  );
}

export default Rating;
