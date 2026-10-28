// src/components/IconBadge/IconBadge.js
import React from 'react';
import { Box } from '@mui/material';
import { shapeStyle, ICON_SHAPES } from '../Shape/shapes';

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
 *   light  — data-theme="{Theme}" data-surface="Surface-Brightest"
 *            (there is no "{Theme}-Light" theme; -light IS the brightest surface)
 *            bg: var(--Background), icon: var(--Text)
 *   dark   — data-theme="{Theme}" data-surface="Surface-Dimmest"
 *            bg: var(--Background), icon: var(--Text)
 *
 * SIZE: small | medium | large — 32 / 40 / 48, a 24px icon and an 8px
 *       radius, as Figma's Component-Size modes draw it.
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
  /* No white / black. Neither is a Theme mode — they bound nothing and left
     the badge on the page's palette, which for a badge whose entire job is to
     be a color is the one outcome that cannot be right.
     
     Both are already reachable and always were: white is
     color="neutral" variant="light" and black is
     color="neutral" variant="dark" — the same palette at the two ends of the
     surface ladder, which is what black and white ARE here. */
};

/* Three sizes, from Figma's Component-Size modes on the IconBadge component
   (9189:26768): IconBadge/BadgeHeight is 32 / 40 / 48 for small / medium /
   large, IconBadge/BadgeRadius 8 at every size, and a 24px icon.
   
   This was ONE size for a while, removed because Figma then drew exactly one
   40px badge with no size axis. Figma has since bound the badge to
   Component-Size, so the sizes are back — measured, not invented. */
const ICON_BADGE_SIZES = {
  small: { size: 32, iconSize: '24px', borderRadius: '8px' },
  medium: { size: 40, iconSize: '24px', borderRadius: '8px' },
  large: { size: 48, iconSize: '24px', borderRadius: '8px' },
};

const warnedShapes = new Set();

export function IconBadge({
  children,
  color = 'primary',
  variant = 'solid',
  /* The tile's shape, from the system's shape list (see Shape). Unset is the
     drawn component's 8px corner. Stick to ICON_SHAPES: a triangle or a burst
     clips the corners of a 24px glyph in a 40px tile. */
  shape,
  /* small | medium | large — 32 / 40 / 48, Figma's Component-Size modes. */
  size = 'medium',
  className = '',
  sx = {},
  ...props
}) {
  if (shape && !ICON_SHAPES.includes(shape) && process.env.NODE_ENV !== 'production' && !warnedShapes.has(shape)) {
    warnedShapes.add(shape);
    // eslint-disable-next-line no-console
    console.warn('[IconBadge] shape="' + shape + '" clips the icon at this size. Icon-safe shapes: ' + ICON_SHAPES.join(', ') + '.');
  }
  const s = ICON_BADGE_SIZES[size] || ICON_BADGE_SIZES.medium;
  const theme = THEME_MAP[color] || THEME_MAP.primary;

  // Determine data-theme and data-surface based on variant
  let dataTheme, dataSurface;
  switch (variant) {
    case 'light':
      // Base theme + brightest surface; *-Light themes are not generated.
      dataTheme = theme;
      dataSurface = 'Surface-Brightest';
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
      /* No size class any more — there is one size, and emitting
         `icon-badge-undefined` for it would be worse than emitting nothing. */
      className={'icon-badge icon-badge-' + size + ' icon-badge-' + variant + ' icon-badge-' + color + ' ' + className}
      sx={{
        width: s.size,
        height: s.size,
        borderRadius: s.borderRadius,
        ...(shape && { borderRadius: 0, ...shapeStyle(shape) }),
        /* SOLID is Figma's IconBadge: the tile is Icons/Icon in the color's
           Icons mode and the glyph reverses out on Icons/On-Icon — the same
           pair Switch's track and knob use. It was the theme's --Background
           and --Text, which drew a light tile with a dark glyph where Figma
           draws a dark tile with a light one. Light and dark stay surface
           levels of the theme (Figma draws only the solid one). */
        /* Stated at the zone attributes' own specificity: the design system
           paints every [data-surface] element its --Background, which beat a
           plain class and kept the tile the surface color. Same fix as
           Tooltip and Alert. */
        '&, &[data-surface], &[data-theme][data-surface]': {
          backgroundColor: variant === 'solid' ? 'var(--Icons-' + cap(color) + ', var(--Background))' : 'var(--Background)',
          color: variant === 'solid' ? 'var(--Icons-On-' + cap(color) + ', var(--Text))' : 'var(--Text)',
        },
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
