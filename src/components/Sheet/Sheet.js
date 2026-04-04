// src/components/Sheet/Sheet.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Sheet Component
 *
 * A generic surface container supporting design system variants.
 * Equivalent to MUI Paper but with data-theme integration.
 *
 * VARIANTS:
 *   default   No data-theme. bg: var(--Background), border: var(--Border-Variant).
 *   solid     data-theme={Color}. bg: var(--Background), border: var(--Border).
 *   light     data-theme={Color}-Light. bg: var(--Background), border: var(--Border).
 *
 * ALL SHEETS: data-surface="Container"
 *
 * PROPS:
 *   variant      default | solid | light
 *   color        primary | secondary | tertiary | neutral | info | success | warning | error
 *   elevation    0 | 1 | 2 | 3  (box-shadow depth)
 *   bordered     boolean (default true — show border)
 *   rounded      boolean (default true — use var(--Style-Border-Radius))
 *   component    HTML element override (default 'div')
 */

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const ELEVATION_MAP = {
  0: 'none',
  1: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  2: '0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
  3: '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)',
};

export function Sheet({
  children,
  variant = 'default',
  color = 'primary',
  elevation = 0,
  bordered = true,
  rounded = true,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  const isDefault = variant === 'default';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';

  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null;

  const bg = isDefault ? 'var(--Background)' : 'var(--Background)';
  const borderColor = isDefault ? 'var(--Border-Variant)' : 'var(--Border)';

  return (
    <Box
      component={component}
      data-theme={dataTheme || undefined}
      data-surface="Container"
      className={
        'sheet sheet-' + variant
        + (isSolid || isLight ? ' sheet-' + color : '')
        + (bordered ? ' sheet-bordered' : '')
        + (rounded ? ' sheet-rounded' : '')
        + ' sheet-elevation-' + elevation
        + ' ' + className
      }
      sx={{
        backgroundColor: bg,
        border: bordered ? '1px solid ' + borderColor : 'none',
        borderRadius: rounded ? 'var(--Style-Border-Radius)' : 0,
        boxShadow: ELEVATION_MAP[elevation] || 'none',
        color: 'var(--Text)',
        padding: 'var(--Card-Padding)',
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── Convenience Exports ─── */
export const DefaultSheet = (p) => <Sheet variant="default" {...p} />;
export const SolidSheet   = (p) => <Sheet variant="solid"   {...p} />;
export const LightSheet   = (p) => <Sheet variant="light"   {...p} />;

export default Sheet;
