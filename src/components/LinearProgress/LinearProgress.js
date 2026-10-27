// src/components/LinearProgress/LinearProgress.js
import React from 'react';
import { Box } from '@mui/material';
import { MobileNavLabel } from '../Typography/Typography';

/**
 * LinearProgress Component
 *
 * A horizontal bar progress indicator — indeterminate (sliding) or determinate (0–100).
 *
 * Figma's Progress Bar (8379:11531):
 *   Track      no fill, a 1px --Border stroke OUTSIDE (drawn as a spread
 *              shadow, so it takes no layout space). --Border, not
 *              --Border-Variant: the bar's extent is meaningful, so it needs
 *              the 3:1 a non-text graphic carries.
 *   Indicator  --Buttons-{Color}-Border with a 1px --Background ring INSIDE,
 *              which parts it from the track's edge
 *   Corners    full pill
 *
 * SIZES: small (4px), medium (6px), large (--Progress-Bar-Width, 8px — Figma's
 *        only size) — bar height
 * DETERMINATE: value 0–100 sets fill width. Without value, indeterminate slide animation.
 * showValue: Figma's Progress Text — the percentage under a determinate bar,
 *   Mobile Nav Label in --Text, Sizing-Half below. Decorative to a screen
 *   reader (the bar already announces aria-valuenow).
 *
 * Accessibility: role="progressbar", aria-valuenow/min/max for determinate,
 *   aria-label for screen readers.
 */

const COLOR_LABEL_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { height: '4px' },
  medium: { height: '6px' },
  large:  { height: 'var(--Progress-Bar-Width, 8px)' },
};

export function LinearProgress({
  value,
  color = 'default',
  size = 'medium',
  showValue = false,
  className = '',
  sx = {},
  ...props
}) {
  const C = COLOR_LABEL_MAP[color] || 'Default';
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const hasValue = value !== undefined && value !== null;
  const clampedValue = hasValue ? Math.min(100, Math.max(0, value)) : 0;

  const fillColor = 'var(--Buttons-' + C + '-Border)';

  const bar = (
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
        borderRadius: '999px',
        boxShadow: '0 0 0 1px var(--Border)',
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
          boxShadow: 'inset 0 0 0 1px var(--Background)',
          boxSizing: 'border-box',
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

  if (!(showValue && hasValue)) return bar;
  return (
    <Box className="linear-progress-field" sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--Sizing-Half, 4px)', width: '100%' }}>
      {bar}
      {/* Figma's plain "Mobile Nav Label" binds Body-Font-Weight; MobileNavLabel
          is the NAV label at 600, so the weight is stated (as Player's times). */}
      <MobileNavLabel component="span" aria-hidden="true" className="linear-progress-value"
        sx={{ color: 'var(--Text)', fontWeight: 'var(--Body-Font-Weight, 400)', fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(clampedValue) + '%'}
      </MobileNavLabel>
    </Box>
  );
}

export default LinearProgress;
