// src/components/Sheet/Sheet.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Sheet Component
 *
 * A generic surface container matching Card/Box two-layer structure.
 *
 * VARIANTS:
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}-Light" data-surface="Surface"
 *   dark      data-theme="{Theme}" data-surface="Surface-Dimmest"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STRUCTURE:
 *   Outer shell — border, border-radius, box-shadow
 *   Inner content — data-theme + data-surface, background, text
 *
 * Shadow: Effect-Level-2 rest, Effect-Level-3 hover
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function Sheet({
  children,
  variant = 'solid',
  color = 'default',
  elevated = false,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  const C = cap(color === 'default' ? 'Default' : color);

  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : C + '-Light')
    : C;

  const dataSurface = variant === 'dark' ? 'Surface-Dimmest' : 'Surface';

  const restShadow = elevated ? 'var(--Effect-Level-3)' : 'var(--Effect-Level-2)';
  const hoverShadow = elevated ? 'var(--Effect-Level-4)' : 'var(--Effect-Level-3)';

  return (
    <Box
      component={component}
      className={'sheet sheet-' + variant + ' sheet-' + color +
        (elevated ? ' sheet-elevated' : '') +
        (className ? ' ' + className : '')}
      sx={{
        border: '1px solid var(--Border-Variant)',
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: restShadow,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: hoverShadow },
        ...sx,
      }}
      {...props}
    >
      <Box
        data-theme={dataTheme}
        data-surface={dataSurface}
        sx={{
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          padding: 'var(--Card-Padding)',
          borderRadius: 'calc(var(--Style-Border-Radius) - 1px)',
          fontFamily: 'inherit',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* ─── Convenience Exports ─── */
export const SolidSheet = (p) => <Sheet variant="solid" {...p} />;
export const LightSheet = (p) => <Sheet variant="light" {...p} />;
export const DarkSheet  = (p) => <Sheet variant="dark"  {...p} />;

export default Sheet;
