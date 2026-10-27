// src/components/CircularProgress/CircularProgress.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * CircularProgress Component
 *
 * A circular progress indicator — indeterminate (spinning) or with a value (0–100).
 *
 * Figma's Progress Dial (8379:11570): a ring whose inner radius is 75% of
 * the outer, so its thickness is an eighth of the diameter.
 *   Track      the ring in --Background, with a 1px --Border on BOTH edges,
 *              outside the ring (Figma's outside stroke) — so the dial reads
 *              as an outlined channel on any surface
 *   Indicator  --Buttons-{Color}-Border, inset 1px from every edge of the
 *              channel (Figma's 1px inside --Background stroke), round ends
 *              (Figma rounds the arc's corners), running clockwise from
 *              twelve o'clock
 *
 * SIZES: small (24px), medium (40px), large (80px — Figma's Progress Dial
 *        Radius, its only size), or a number for a custom diameter in px —
 *        thickness scales with it.
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
  small:  { diameter: 24, thickness: 3,  fontSize: '9px' },
  medium: { diameter: 40, thickness: 5,  fontSize: '12px' },
  large:  { diameter: 80, thickness: 10, fontSize: '16px' },
};

export function CircularProgress({
  value,
  /* 'match' — Buttons › Match, the palette of the theme it sits in, so a
     progress indicator takes its zone's colour (Primary in a Primary
     section). Any palette name still pins one. */
  color = 'match',
  size = 'medium',
  thickness: thicknessOverride,
  showValue = false,
  children,
  className = '',
  sx = {},
  ...props
}) {
  const C = COLOR_LABEL_MAP[color] || 'Default';
  /* `size` takes a named step OR a diameter in px.
   *
   * The three named steps are this component's own scale (24/40/56). A number
   * exists because the spinner is reused at the ICON scale (16/24/32) — Loader
   * needs 32px to match its design, and there is no named step for it here.
   * Better one component with a diameter escape hatch than a second SVG that
   * has to be kept looking identical.
   *
   * Thickness scales with the diameter rather than being fixed: Figma's ring
   * is an eighth of it, and that ratio is what a numeric size follows. */
  const s = typeof size === 'number'
    ? { diameter: size, thickness: Math.max(3, Math.round(size / 8)),
        fontSize: Math.max(8, Math.round(size / 5)) + 'px' }
    : (SIZE_MAP[size] || SIZE_MAP.medium);
  const t = thicknessOverride || s.thickness;
  const hasValue = value !== undefined && value !== null;
  const clampedValue = hasValue ? Math.min(100, Math.max(0, value)) : 0;
  const D = s.diameter;
  const mid = (D - t) / 2;                 // the channel's centre line
  const circumference = 2 * Math.PI * mid;
  // Indeterminate: a quarter of the ring, swept round by the spin.
  const fraction = hasValue ? clampedValue / 100 : 0.25;
  // The indicator stops 1px short of each end, as Figma's inside stroke does,
  // and its round caps sit INSIDE the span: each adds half the stroke width.
  const w = Math.max(1, t - 2);
  const arc = Math.max(0, fraction * circumference - 2 - w);
  /* Match falls back to Default for a design system published before
     --Buttons-Match-* existed. */
  const fillColor = color === 'match'
    ? 'var(--Buttons-Match-Border, var(--Buttons-Default-Border))'
    : 'var(--Buttons-' + C + '-Border)';

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
        viewBox={'0 0 ' + D + ' ' + D}
        width={D}
        height={D}
        aria-hidden="true"
        // The outer edge is 1px outside the box, as Figma's outside stroke.
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', transform: 'rotate(-90deg)' }}
      >
        <circle className="circular-progress-track" cx={D / 2} cy={D / 2} r={mid}
          fill="none" stroke="var(--Background)" strokeWidth={t} />
        {/* The channel's two edges — outside the ring, as Figma strokes it. */}
        <circle className="circular-progress-edge" cx={D / 2} cy={D / 2} r={D / 2 + 0.5}
          fill="none" stroke="var(--Border)" strokeWidth={1} />
        <circle className="circular-progress-edge" cx={D / 2} cy={D / 2} r={D / 2 - t - 0.5}
          fill="none" stroke="var(--Border)" strokeWidth={1} />
        {fraction > 0 && (
          <circle className="circular-progress-indicator" cx={D / 2} cy={D / 2} r={mid}
            fill="none" stroke={fillColor} strokeWidth={w} strokeLinecap="round"
            strokeDasharray={arc + ' ' + circumference} strokeDashoffset={-(1 + w / 2)}
            style={{ transition: hasValue ? 'stroke-dasharray 0.4s ease' : 'none' }} />
        )}
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
