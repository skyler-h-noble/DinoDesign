// src/components/Box/Box.js
import React from 'react';
import { Box as MuiBox } from '@mui/material';

/**
 * Box Component
 *
 * A theme-aware container. Sets data-theme to scope CSS variables.
 *
 * COLORS (32 options — 8 families × 4 tones):
 *   Base:   Primary, Secondary, Tertiary, Neutral, Info, Success, Warning, Error
 *   Light:  Primary-Light, Secondary-Light, … Error-Light
 *   Medium: Primary-Medium, Secondary-Medium, … Error-Medium
 *   Dark:   Primary-Dark, Secondary-Dark, … Error-Dark
 *
 * Each sets data-theme="{Color}" which scopes:
 *   bg: var(--Background)
 *   text: var(--Text)
 *   border: var(--Border)
 *
 * PADDING: none, xs, sm, md, lg, xl
 * BORDER RADIUS: none, sm, md, lg, full
 * ELEVATION: 0–4
 * BORDER: optional 1px solid var(--Border)
 *
 * Renders as <div> by default. Supports component prop.
 */

const PADDING_MAP = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

const RADIUS_MAP = {
  none: '0px',
  sm: '4px',
  md: 'var(--Style-Border-Radius, 8px)',
  lg: '16px',
  full: '9999px',
};

const ELEVATION_MAP = {
  0: 'none',
  1: '0 1px 3px rgba(0,0,0,0.08)',
  2: '0 2px 8px rgba(0,0,0,0.12)',
  3: '0 4px 16px rgba(0,0,0,0.16)',
  4: '0 8px 32px rgba(0,0,0,0.20)',
};

export function Box({
  children,
  color,
  padding = 'md',
  borderRadius = 'md',
  elevation = 0,
  border = false,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  const dataAttrs = {};
  if (color) {
    dataAttrs['data-theme'] = color;
    dataAttrs['data-surface'] = 'Surface';
  }

  const p = PADDING_MAP[padding] !== undefined ? PADDING_MAP[padding] : PADDING_MAP.md;
  const r = RADIUS_MAP[borderRadius] || RADIUS_MAP.md;
  const shadow = ELEVATION_MAP[elevation] || ELEVATION_MAP[0];

  return (
    <MuiBox
      component={component}
      {...dataAttrs}
      className={'themed-box' +
        (color ? ' themed-box-' + color.toLowerCase() : '') +
        (border ? ' themed-box-bordered' : '') +
        (className ? ' ' + className : '')}
      sx={{
        backgroundColor: color ? 'var(--Background)' : undefined,
        color: color ? 'var(--Text)' : undefined,
        padding: p,
        borderRadius: r,
        boxShadow: shadow,
        ...(border && { border: '1px solid var(--Border)' }),
        fontFamily: 'inherit',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiBox>
  );
}

export default Box;
