// src/components/LinearProgress/LinearProgress.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * LinearProgress Component
 *
 * A horizontal bar progress indicator — indeterminate (sliding) or determinate (0–100).
 *
 * COLORS: 8 brand colors (single style, color picker only)
 *   Track:  var(--Border-Variant)
 *   Fill:   var(--Buttons-{Color}-Border)
 *
 * SIZES: small (4px), medium (6px), large (8px) — bar height
 * DETERMINATE: value 0–100 sets fill width. Without value, indeterminate slide animation.
 *
 * Accessibility: role="progressbar", aria-valuenow/min/max for determinate,
 *   aria-label for screen readers.
 */

const COLOR_LABEL_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { height: '4px', borderRadius: '2px' },
  medium: { height: '6px', borderRadius: '3px' },
  large:  { height: '8px', borderRadius: '4px' },
};

export function LinearProgress({
  value,
  color = 'primary',
  size = 'medium',
  className = '',
  sx = {},
  ...props
}) {
  const C = COLOR_LABEL_MAP[color] || 'Primary';
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const hasValue = value !== undefined && value !== null;
  const clampedValue = hasValue ? Math.min(100, Math.max(0, value)) : 0;

  const trackColor = 'var(--Border-Variant)';
  const fillColor = 'var(--Buttons-' + C + '-Border)';

  return (
    <Box
      role="progressbar"
      aria-valuenow={hasValue ? Math.round(clampedValue) : undefined}
      aria-valuemin={hasValue ? 0 : undefined}
      aria-valuemax={hasValue ? 100 : undefined}
      aria-label={
        hasValue
          ? Math.round(clampedValue) + '% progress'
          : 'Loading'
      }
      className={
        'linear-progress linear-progress-' + size + ' linear-progress-' + color
        + (hasValue ? ' linear-progress-determinate' : ' linear-progress-indeterminate')
        + ' ' + className
      }
      sx={{
        position: 'relative',
        width: '100%',
        height: s.height,
        borderRadius: s.borderRadius,
        backgroundColor: trackColor,
        overflow: 'hidden',
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      <Box
        className="linear-progress-bar"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          borderRadius: 'inherit',
          backgroundColor: fillColor,
          ...(hasValue
            ? {
                width: clampedValue + '%',
                transition: 'width 0.4s ease',
              }
            : {
                width: '40%',
                animation: 'linear-progress-slide 1.5s ease-in-out infinite',
                '@keyframes linear-progress-slide': {
                  '0%':   { left: '-40%', width: '40%' },
                  '50%':  { left: '30%',  width: '50%' },
                  '100%': { left: '100%', width: '40%' },
                },
              }),
        }}
      />
    </Box>
  );
}

export default LinearProgress;
