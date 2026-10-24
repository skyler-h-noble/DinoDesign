// src/components/NumberField/FieldButton.js
import React from 'react';
import { Box } from '@mui/material';
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * FieldButton — the stepper button a NumberField is built from.
 *
 * Figma's `Field Button` set (6850:28584): Style ghost | outline x State.
 *
 *   size     Button-Height tall; the width is --Field-Button-Width (and
 *            --Sm- / --Lg-), falling back to 40 / 48 / 64 — the icon plus even
 *            padding, so the button scales with its height instead of being a
 *            48px sliver at small and taller than wide at large
 *   corner   --Input-Radius, the field it belongs to
 *   icon     the in-button size, --Button-Icon (16 / 20 / 32), in --Icons-Icon
 *   ghost    no edge
 *   outline  1px --Buttons-<C>-Border, inside
 *   Hover    the surface's --Hover, with the Buttons-Hover lift (Level 1)
 *   Pressed  the surface's --Pressed, no lift
 *   Focus    a 3px ring INSIDE the button (1px in from a ghost's edge, 2px in
 *            from an outline's) — the button sits in a clipped field, where a
 *            ring drawn outside would be cut off
 *   Disabled 38%
 */
const PREFIX = { small: 'Sm-', medium: '', large: 'Lg-' };

export const FieldButton = React.forwardRef(function FieldButton({
  variant = 'ghost',
  color = 'default',
  size = 'medium',
  disabled = false,
  children,
  className = '',
  sx = {},
  ...props
}, ref) {
  const p = PREFIX[size] ?? '';
  const C = color.charAt(0).toUpperCase() + color.slice(1);
  const outline = variant === 'outline';
  const height = size === 'small' ? 'var(--Small-Button-Height, 24px)'
    : size === 'large' ? 'var(--Large-Button-Height, 56px)' : 'var(--Button-Height, 32px)';
  const fallbackIcon = size === 'small' ? '16px' : size === 'large' ? '32px' : '20px';
  return (
    <Box
      ref={ref}
      component="button"
      type="button"
      disabled={disabled}
      className={'field-button field-button-' + variant + ' ' + className}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        width: 'var(--' + p + 'Field-Button-Width, ' + (size === 'small' ? '40px' : size === 'large' ? '64px' : '48px') + ')',
        height,
        boxSizing: 'border-box',
        m: 0, p: 0,
        border: 'none',
        // Figma's stroke is INSIDE: an inset ring, so it takes no layout space.
        boxShadow: outline ? 'inset 0 0 0 1px var(--Buttons-' + C + '-Border)' : 'none',
        borderRadius: 'var(--' + p + 'Input-Radius, var(--Input-Radius, 4px))',
        backgroundColor: 'transparent',
        color: 'var(--Icons-Icon, var(--Text))',
        fontSize: 'var(--' + p + 'Button-Icon, ' + fallbackIcon + ')',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        outline: 'none',
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        '& .MuiSvgIcon-root': { fontSize: 'inherit', color: 'inherit' },
        ...(!disabled && {
          '&:hover': {
            backgroundColor: 'var(--Hover)',
            boxShadow: (outline ? 'inset 0 0 0 1px var(--Buttons-' + C + '-Border), ' : '') + SHADOW_LEVEL_1,
          },
          '&:active': {
            backgroundColor: 'var(--Pressed)',
            boxShadow: outline ? 'inset 0 0 0 1px var(--Buttons-' + C + '-Border)' : 'none',
          },
          // Figma's focused button fills the surface's Background under the ring.
          '&:focus-visible, &.Mui-focusVisible': {
            backgroundColor: 'var(--Background)',
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: outline ? '-5px' : '-4px',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

export default FieldButton;
