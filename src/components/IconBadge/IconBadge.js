// src/components/IconBadge/IconBadge.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * IconBadge Component
 *
 * A themed circle/rounded-square with an icon inside.
 *
 * COLORS:
 *   default, primary, secondary, tertiary, neutral,
 *   info, success, warning, error, white, black
 *
 * VARIANTS:
 *   solid  — data-theme="{Theme}" data-surface="Surface"
 *            bg: var(--Background), icon: var(--Text)
 *   light  — data-theme="{Theme}-Light" data-surface="Surface"
 *            bg: var(--Background), icon: var(--Text)
 *   dark   — data-theme="{Theme}" data-surface="Surface-Dimmest"
 *            bg: var(--Background), icon: var(--Text)
 *
 * SIZES: small (32px), medium (40px), large (48px)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const THEME_MAP = {
  default: 'Default',
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  white: 'White',
  black: 'Black',
};

const SIZE_MAP = {
  small:  { size: 32, iconSize: '16px', borderRadius: '8px' },
  medium: { size: 40, iconSize: '20px', borderRadius: '10px' },
  large:  { size: 48, iconSize: '24px', borderRadius: '12px' },
};

export function IconBadge({
  children,
  color = 'primary',
  variant = 'solid',
  size = 'medium',
  className = '',
  sx = {},
  ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const theme = THEME_MAP[color] || THEME_MAP.primary;

  // Determine data-theme and data-surface based on variant
  let dataTheme, dataSurface;
  switch (variant) {
    case 'light':
      dataTheme = theme + '-Light';
      dataSurface = 'Surface';
      break;
    case 'dark':
      dataTheme = theme;
      dataSurface = 'Surface-Dimmest';
      break;
    case 'solid':
    default:
      dataTheme = theme;
      dataSurface = 'Surface';
      break;
  }

  return (
    <Box
      data-theme={dataTheme}
      data-surface={dataSurface}
      className={'icon-badge icon-badge-' + variant + ' icon-badge-' + size + ' icon-badge-' + color + ' ' + className}
      sx={{
        width: s.size,
        height: s.size,
        borderRadius: s.borderRadius,
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        '& svg': {
          width: s.iconSize,
          height: s.iconSize,
          fontSize: s.iconSize,
          color: 'inherit',
          stroke: 'currentColor',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default IconBadge;
