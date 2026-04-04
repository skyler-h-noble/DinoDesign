// src/components/CircularProgress/CircularProgress.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * CircularProgress Component
 *
 * A circular progress indicator — indeterminate (spinning) or with a value (0–100).
 *
 * COLORS: 8 brand colors
 *   Track (back circle): var(--Border-Variant)
 *   Fill (progress arc):  var(--Buttons-{Color}-Border)
 *
 * SIZES: small (24px), medium (40px), large (56px)
 * VALUE: 0–100 — when provided, shows static arc + optional center label.
 *        When omitted, renders indeterminate spinning animation.
 *
 * Accessibility: role="progressbar", aria-valuenow/min/max for value mode,
 *   aria-label for screen readers.
 */

const COLOR_LABEL_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
  white: 'Neutral', black: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { diameter: 24, thickness: 3, fontSize: '9px',  labelSize: '0px' },
  medium: { diameter: 40, thickness: 4, fontSize: '12px', labelSize: '12px' },
  large:  { diameter: 56, thickness: 5, fontSize: '14px', labelSize: '14px' },
};

export function CircularProgress({
  value,
  color = 'primary',
  size = 'medium',
  thickness: thicknessOverride,
  showValue = false,
  children,
  className = '',
  sx = {},
  ...props
}) {
  const C = COLOR_LABEL_MAP[color] || 'Primary';
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const t = thicknessOverride || s.thickness;
  const hasValue = value !== undefined && value !== null;
  const clampedValue = hasValue ? Math.min(100, Math.max(0, value)) : 0;
  const radius = (s.diameter - t) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = hasValue
    ? circumference - (clampedValue / 100) * circumference
    : circumference * 0.25; // 25% visible for indeterminate

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
        'circular-progress circular-progress-' + size + ' circular-progress-' + color
        + (hasValue ? ' circular-progress-value' : ' circular-progress-indeterminate')
        + ' ' + className
      }
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s.diameter + 'px',
        height: s.diameter + 'px',
        flexShrink: 0,
        ...(!hasValue && {
          animation: 'circular-progress-spin 1.2s linear infinite',
          '@keyframes circular-progress-spin': {
            '0%':   { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }),
        ...sx,
      }}
      {...props}
    >
      <svg
        viewBox={'0 0 ' + s.diameter + ' ' + s.diameter}
        width={s.diameter}
        height={s.diameter}
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        {/* Track circle */}
        <circle
          cx={s.diameter / 2}
          cy={s.diameter / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={t}
          className="circular-progress-track"
        />
        {/* Progress arc */}
        <circle
          cx={s.diameter / 2}
          cy={s.diameter / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={t}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="circular-progress-indicator"
          style={{
            transition: hasValue ? 'stroke-dashoffset 0.4s ease' : 'none',
          }}
        />
      </svg>

      {/* Center content: value label or children */}
      {(showValue || children) && hasValue && (
        <Box
          className="circular-progress-label"
          aria-hidden="true"
          sx={{
            position: 'relative',
            zIndex: 1,
            fontSize: s.fontSize,
            fontWeight: 700,
            fontFamily: 'inherit',
            lineHeight: 1,
            color: 'var(--Text)',
            userSelect: 'none',
          }}
        >
          {children || Math.round(clampedValue) + '%'}
        </Box>
      )}
    </Box>
  );
}

export default CircularProgress;
