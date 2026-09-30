// src/components/Sheet/Sheet.js
import React from 'react';
import { Box } from '@mui/material';
import { SHADOW_LEVEL_2, SHADOW_LEVEL_3, SHADOW_LEVEL_4 } from '../_shadows';

/**
 * Sheet Component
 *
 * A generic surface container matching Card/Box two-layer structure.
 *
 * NO VARIANTS. A Sheet is a surface container and nothing else: the caller
 * sets `color` (-> data-theme) and `surface` (-> data-surface) and the cascade
 * supplies --Background / --Text for that pairing.
 *
 * It used to carry variant="solid|light|dark", which only ever chose between
 * three of the five surface levels — Surface, Surface-Brightest,
 * Surface-Dimmest — under names that said nothing about which. `surface` takes
 * ANY of the five and says so, so the variant axis was a smaller, vaguer
 * version of a prop that already existed.
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

/* `variant` is accepted and ignored. Deleting the prop outright would let it
   fall into ...props and reach the DOM as an attribute; warn once instead,
   the same treatment Badge's removed `size` gets. */
const warnedVariants = new Set();

function warnRemovedVariant(variant) {
  if (variant === undefined) return;
  if (process.env.NODE_ENV === 'production' || warnedVariants.has(variant)) return;
  warnedVariants.add(variant);
  console.warn(
    '[Sheet] variant="' + variant + '" — Sheet has no variants. Set `surface` ' +
    'directly: light was surface="Surface-Brightest", dark was ' +
    'surface="Surface-Dimmest", solid was the default surface="Surface".',
  );
}

export function Sheet({
  children,
  surface = 'Surface',
  variant,
  color = 'default',
  elevated = false,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  const C = cap(color === 'default' ? 'Default' : color);

  // A light variant is the base theme at its BRIGHTEST surface, not a theme of
  // its own. Generated design systems stopped emitting *-Light themes, so
  // `C + '-Light'` matched no rule and --Background resolved to nothing.
  const dataTheme = color === 'default' ? 'Default' : C;

  warnRemovedVariant(variant);
  const dataSurface = surface;

  const restShadow = elevated ? SHADOW_LEVEL_3 : SHADOW_LEVEL_2;
  const hoverShadow = elevated ? SHADOW_LEVEL_4 : SHADOW_LEVEL_3;

  return (
    <Box
      component={component}
      className={'sheet sheet-' + color +
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

export default Sheet;
