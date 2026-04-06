// src/components/Box/Box.js
import React from 'react';
import { Box as MuiBox } from '@mui/material';

/**
 * Box Component
 *
 * Theme-aware container matching Card's two-layer structure.
 *
 * VARIANTS:
 *   default   No theme. data-surface="Container". bg var(--Background).
 *   solid     data-theme="{Theme}" data-surface="Surface". bg var(--Background).
 *   light     data-theme="{Theme}-Light" data-surface="Surface". bg var(--Background).
 *   dark      data-theme="{Theme}" data-surface="Surface-Dimmest". bg var(--Background).
 *
 * COLORS: primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STRUCTURE:
 *   Outer shell — border, border-radius, box-shadow
 *   Inner content — data-theme + data-surface, background, text
 *
 * PADDING: none | xs | sm | md | lg | xl
 * ELEVATION: Level 1 rest, Level 2 hover (when clickable or elevated)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const PADDING_MAP = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

export function Box({
  children,
  variant = 'solid',
  color = 'default',
  padding = 'md',
  elevated = false,
  clickable = false,
  onClick,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  const C = cap(color === 'default' ? 'Default' : color);

  // Theme for inner content
  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : C + '-Light')
    : C;

  // Surface for inner content
  const dataSurface = variant === 'dark'
    ? 'Surface-Dimmest'
    : 'Surface';

  const p = PADDING_MAP[padding] !== undefined ? PADDING_MAP[padding] : PADDING_MAP.md;
  const isClickable = clickable || !!onClick;

  const restShadow = elevated ? 'var(--Effect-Level-3)' : 'var(--Effect-Level-2)';
  const hoverShadow = elevated ? 'var(--Effect-Level-4)' : 'var(--Effect-Level-3)';

  return (
    <MuiBox
      component={component}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={'dyno-box dyno-box-' + variant +
        (isClickable ? ' dyno-box-clickable' : '') +
        (elevated ? ' dyno-box-elevated' : '') +
        (className ? ' ' + className : '')}
      sx={{
        border: '1px solid var(--Border-Variant)',
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: restShadow,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        ...(isClickable && {
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'var(--Buttons-Default-Border)',
            boxShadow: hoverShadow,
          },
          '&:active': { transform: 'scale(0.995)' },
          '&:focus-visible': {
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: '3px',
          },
        }),
        ...(!isClickable && {
          '&:hover': { boxShadow: hoverShadow },
        }),
        ...sx,
      }}
      {...props}
    >
      {/* Inner content — scoped theme and surface */}
      <MuiBox
        data-theme={dataTheme || undefined}
        data-surface={dataSurface}
        sx={{
          padding: p,
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          fontFamily: 'inherit',
          borderRadius: 'calc(var(--Style-Border-Radius) - 1px)',
        }}
      >
        {children}
      </MuiBox>
    </MuiBox>
  );
}

export default Box;
