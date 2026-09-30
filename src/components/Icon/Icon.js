// src/components/Icon/Icon.js
import React from 'react';
import { Box } from '@mui/material';
import { useGhost, ghostBlockSx } from '../_ghost';

/**
 * Icon Component
 *
 * Wraps any MUI icon with design-system color tokens and sizing.
 *
 * COLORS:
 *   default    var(--Icons-Default)         Two-tone: var(--Icons-Variant-Default)
 *   primary    var(--Icons-Primary)         Two-tone: var(--Icons-Variant-Primary)
 * *   secondary  var(--Icons-Secondary)       Two-tone: var(--Icons-Variant-Secondary)
 *   tertiary   var(--Icons-Tertiary)        Two-tone: var(--Icons-Variant-Tertiary)
 *   neutral    var(--Icons-Neutral)         Two-tone: var(--Icons-Variant-Neutral)
 *   info       var(--Icons-Info)            Two-tone: var(--Icons-Variant-Info)
 *   success    var(--Icons-Success)         Two-tone: var(--Icons-Variant-Success)
 *   warning    var(--Icons-Warning)         Two-tone: var(--Icons-Variant-Warning)
 *   error      var(--Icons-Error)           Two-tone: var(--Icons-Variant-Error)
 *
 * SIZES (Figma-aligned):
 *   xs      12px
 *   small   16px
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
  default:   'Default',
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info',
  success:   'Success',
  warning:   'Warning',
  error:     'Error',
};

// The icon scale. Exported so anything that has to restate it — the Button's
// slot rules, which otherwise inherit MUI's own per-button-size icon sizing —
// reads these numbers instead of keeping a second copy.
/* ALIGNED TO FIGMA 2026-09-28 — and this MOVED ALL THREE EXISTING NAMES.
 *
 * The lib carried three steps of a ladder Figma has seven of, and the names
 * were offset by two rungs:
 *
 *   Figma  xxs 16 · xs 20 · small 24 · medium 32 · large 40 · xl 56 · xxl 72
 *   was           small 16 ·          medium 24 ·  large 32
 *
 * So the lib's `small` was Figma's `xxs`, and its `large` was Figma's
 * `medium`. Same offset Avatar had, found the same way, and neither side could
 * report it because both used one vocabulary for different rungs.
 *
 *   size="small"   16 -> 24
 *   size="medium"  24 -> 32
 *   size="large"   32 -> 40
 *
 * BREAKING and unshimmable, for the same reason as Avatar: all three names
 * exist in both ladders with different values, so no runtime check can tell
 * which one a call site meant.
 *
 * The four sizes the lib never had are added rather than left out. A ladder
 * with holes is what produced the offset in the first place — three names
 * stretched across seven rungs, each drifting to whichever rung it was nearest.
 *
 * (An earlier note here recorded removing `xs: 12px` because "Figma has no
 * 12px icon". That was true of the old reading and is now moot: Figma's xs is
 * 20, and this ladder is Figma's.) */
export const ICON_SIZE_MAP = {
  xxs: '16px',
  xs: '20px',
  small: '24px',
  medium: '32px',
  large: '40px',
  xl: '56px',
  xxl: '72px',
};

const SIZE_MAP = ICON_SIZE_MAP;

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
  const ghost = useGhost();
  const C = COLOR_LABEL_MAP[color] || 'Default';

  // Resolve font size
  const resolvedSize = size === 'custom' && customFontSize
    ? (typeof customFontSize === 'number' ? customFontSize + 'px' : customFontSize)
    : SIZE_MAP[size] || SIZE_MAP.medium;

  // Color token — 'default' inherits from parent (e.g. Button text color)
  const colorToken = color === 'default' ? 'inherit' : 'var(--Icons-' + C + ')';
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
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        cursor: disabled ? 'not-allowed' : 'inherit',
        lineHeight: 1,
        flexShrink: 0,
        // Two-tone: set CSS variable for the secondary fill
        ...(twoTone && { '--twotone-variant': variantToken }),
        /* A ghosting icon is a square of its own size — the glyph is hidden by
           the block's transparent colour, and width/height come from fontSize
           above, so it occupies exactly the space the real icon will. */
        ...(ghost ? {
          ...ghostBlockSx({ animate: ghost.animate }),
          width: resolvedSize,
          height: resolvedSize,
          '& .MuiSvgIcon-root': { visibility: 'hidden' },
        } : {}),
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