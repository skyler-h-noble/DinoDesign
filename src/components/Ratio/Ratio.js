// src/components/Ratio/Ratio.js
import React from 'react';
import { Box as MuiBox } from '@mui/material';
import { SHADOW_LEVEL_2, SHADOW_LEVEL_3, SHADOW_LEVEL_4 } from '../_shadows';

/**
 * Ratio Component
 *
 * Aspect-ratio container with a two-layer themed shell that matches Box.
 * Wraps any content (image, video, embed, layout box) in a frame that
 * preserves the named proportion at any width.
 *
 * RATIOS (Figma-aligned): 1:1, 3:4, 4:3, 16:9, 9:16, 2:3, 3:2, 1:2, 2:1,
 * 9:21, 21:9, 5:7, 7:5, 4:5, 5:4, 5:3, 3:5, 16:10, 10:16, Golden-Horizontal,
 * Golden-Vertical.
 *
 * Golden = phi (1.618033988…). Horizontal is wider-than-tall, Vertical is
 * the inverse. Stored at 6 decimal places for sub-pixel accuracy.
 *
 * VARIANTS: default | solid | light | dark   (mirrors Box)
 * COLORS:   default | primary | secondary | tertiary | neutral |
 *           info | success | warning | error
 * PADDING:  none | xs | sm | md | lg | xl
 * ELEVATION: Level 2 rest, Level 3 hover (Level 3→4 when elevated)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const RATIO_NAMES = [
  '1:1',
  '3:4', '4:3',
  '16:9', '9:16',
  '2:3', '3:2',
  '1:2', '2:1',
  '9:21', '21:9',
  '5:7', '7:5',
  '4:5', '5:4',
  '5:3', '3:5',
  '16:10', '10:16',
  'Golden-Horizontal',
  'Golden-Vertical',
];

const PHI = '1.618034'; // golden ratio
const RATIO_MAP = {
  '1:1':   '1 / 1',
  '3:4':   '3 / 4',   '4:3':   '4 / 3',
  '16:9':  '16 / 9',  '9:16':  '9 / 16',
  '2:3':   '2 / 3',   '3:2':   '3 / 2',
  '1:2':   '1 / 2',   '2:1':   '2 / 1',
  '9:21':  '9 / 21',  '21:9':  '21 / 9',
  '5:7':   '5 / 7',   '7:5':   '7 / 5',
  '4:5':   '4 / 5',   '5:4':   '5 / 4',
  '5:3':   '5 / 3',   '3:5':   '3 / 5',
  '16:10': '16 / 10', '10:16': '10 / 16',
  'Golden-Horizontal': PHI + ' / 1',
  'Golden-Vertical':   '1 / ' + PHI,
};

const PADDING_MAP = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

export function Ratio({
  ratio = '1:1',
  children,
  variant = 'default',
  color = 'default',
  padding = 'none',
  elevated = false,
  clickable = false,
  onClick,
  maxWidth,
  maxHeight,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  const aspect = RATIO_MAP[ratio] || RATIO_MAP['1:1'];
  const C = cap(color === 'default' ? 'Default' : color);

  // data-theme/data-surface for the inner content — mirrors Box.
  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : C + '-Light')
    : C;
  const dataSurface = variant === 'dark' ? 'Surface-Dimmest' : 'Surface';

  const p = PADDING_MAP[padding] !== undefined ? PADDING_MAP[padding] : PADDING_MAP.none;
  const isClickable = clickable || !!onClick;
  const isDefault = variant === 'default';

  // Level 2 rest / Level 3 hover; bump to 3→4 when elevated, matching Box.
  const restShadow = elevated ? SHADOW_LEVEL_3 : SHADOW_LEVEL_2;
  const hoverShadow = elevated ? SHADOW_LEVEL_4 : SHADOW_LEVEL_3;

  return (
    <MuiBox
      component={component}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={'ratio ratio-' + ratio.toLowerCase() + ' ratio-' + variant +
        (isClickable ? ' ratio-clickable' : '') +
        (elevated ? ' ratio-elevated' : '') +
        (className ? ' ' + className : '')}
      sx={{
        // CSS aspect-ratio holds the proportion regardless of container
        // width. The shell carries border, radius, and elevation so the
        // shape is preserved while the inner layer handles theme tokens.
        aspectRatio: aspect,
        width: '100%',
        ...(maxWidth !== undefined && { maxWidth }),
        ...(maxHeight !== undefined && { maxHeight }),
        border: isDefault ? 'none' : '1px solid var(--Border-Variant)',
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: isDefault ? 'none' : restShadow,
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
        ...(!isClickable && !isDefault && {
          '&:hover': { boxShadow: hoverShadow },
        }),
        ...sx,
      }}
      {...props}
    >
      {/* Inner content — scoped theme + surface so children resolve to the
          right tokens, and any flex/fill child can occupy the ratio'd box. */}
      <MuiBox
        data-theme={dataTheme || undefined}
        data-surface={dataSurface}
        sx={{
          width: '100%',
          height: '100%',
          padding: p,
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          fontFamily: 'inherit',
          borderRadius: isDefault ? 0 : 'calc(var(--Style-Border-Radius) - 1px)',
          '& > *': { width: '100%', height: '100%' },
        }}
      >
        {children}
      </MuiBox>
    </MuiBox>
  );
}

export default Ratio;
