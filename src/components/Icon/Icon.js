// src/components/Icon/Icon.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Icon Component
 *
 * Wraps any MUI icon with design-system color tokens and sizing.
 *
 * COLORS:
 *   default    var(--Icons-Default)         Two-tone: var(--Icons-Variant-Default)
 *   primary    var(--Icons-Primary)         Two-tone: var(--Icons-Variant-Primary)
 *   secondary  var(--Icons-Secondary)       Two-tone: var(--Icons-Variant-Secondary)
 *   neutral    var(--Icons-Neutral)         Two-tone: var(--Icons-Variant-Neutral)
 *   info       var(--Icons-Info)            Two-tone: var(--Icons-Variant-Info)
 *   success    var(--Icons-Success)         Two-tone: var(--Icons-Variant-Success)
 *   warning    var(--Icons-Warning)         Two-tone: var(--Icons-Variant-Warning)
 *   error      var(--Icons-Error)           Two-tone: var(--Icons-Variant-Error)
 *
 * SIZES:
 *   small   20px
 *   medium  24px (default)
 *   large   36px
 *   custom  user-specified fontSize
 *
 * STYLES (determined by which MUI icon you pass):
 *   filled     HomeIcon            (default)
 *   outlined   HomeOutlined
 *   rounded    HomeRounded
 *   twotone    HomeTwoTone         (uses Icons-Variant-{Color} for secondary fill)
 *   sharp      HomeSharp
 *
 * DISABLED: 0.38 opacity
 *
 * Accessibility: aria-hidden="true" by default (decorative). Pass aria-label for meaningful icons.
 */

const COLOR_LABEL_MAP = {
  default: 'Default',
  primary: 'Primary',
  secondary: 'Secondary',
  neutral: 'Neutral',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

const SIZE_MAP = {
  small: '20px',
  medium: '24px',
  large: '36px',
};

export function Icon({
  children,
  color = 'default',
  size = 'medium',
  fontSize: customFontSize,
  disabled = false,
  twoTone = false,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
  const C = COLOR_LABEL_MAP[color] || 'Default';

  // Resolve font size
  const resolvedSize = size === 'custom' && customFontSize
    ? (typeof customFontSize === 'number' ? customFontSize + 'px' : customFontSize)
    : SIZE_MAP[size] || SIZE_MAP.medium;

  // Color token
  const colorToken = 'var(--Icons-' + C + ')';
  // Two-tone variant token (used for secondary fill in TwoTone icons)
  const variantToken = 'var(--Icons-Variant-' + C + ')';

  return (
    <Box
      component="span"
      className={
        'icon icon-' + color + ' icon-' + size +
        (disabled ? ' icon-disabled' : '') +
        (twoTone ? ' icon-twotone' : '') +
        (className ? ' ' + className : '')
      }
      aria-hidden={ariaLabel ? undefined : 'true'}
      aria-label={ariaLabel || undefined}
      role={ariaLabel ? 'img' : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: resolvedSize,
        color: colorToken,
        opacity: disabled ? 0.38 : 1,
        cursor: disabled ? 'not-allowed' : 'inherit',
        lineHeight: 1,
        flexShrink: 0,
        // Two-tone: set CSS variable for the secondary fill
        ...(twoTone && { '--twotone-variant': variantToken }),
        '& .MuiSvgIcon-root': {
          fontSize: 'inherit',
          color: 'inherit',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Icon;
