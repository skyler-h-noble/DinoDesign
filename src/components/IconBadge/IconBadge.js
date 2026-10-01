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
 *   light  — data-theme="{Theme}" data-surface="Surface-Brightest"
 *            (there is no "{Theme}-Light" theme; -light IS the brightest surface)
 *            bg: var(--Background), icon: var(--Text)
 *   dark   — data-theme="{Theme}" data-surface="Surface-Dimmest"
 *            bg: var(--Background), icon: var(--Text)
 *
 * SIZE: one — 40px, with a 24px icon and an 8px radius, matching the single
 *       Figma component. There is no `size` prop.
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
     be a colour is the one outcome that cannot be right.
     
     Both are already reachable and always were: white is
     color="neutral" variant="light" and black is
     color="neutral" variant="dark" — the same palette at the two ends of the
     surface ladder, which is what black and white ARE here. */
};

/* ONE size, measured off the Figma component (9189:26768), which is a single
   40x40 component with no variants and no size axis: width and height bound to
   `Sizing-5`, a radius of 8 bound to `Sizing-1`, and a 24px icon.

   There used to be small/medium/large. None of them came from a design — the
   component did not exist in Figma at all when they were written — and the
   `medium` 40px badge was a DIFFERENT badge from the drawn one anyway: a 10px
   radius against 8, and a 20px icon against 24. Every caller in the studio used
   the default, so the two extra sizes only ever added surface to keep in parity
   with nothing. Sizing in this system comes from the `Component-Size` modes
   rather than a per-component ladder; Button carries no Size axis either. */
const ICON_BADGE_SIZE = { size: 40, iconSize: '24px', borderRadius: '8px' };

/* `size` is accepted and ignored — the same treatment Badge's removed `size`,
   Chip's, and the removed `-light` shape get. Dropping the prop outright would
   let it fall into ...props and reach the DOM. */
const warnedSizes = new Set();

function warnRemovedSize(size) {
  if (size === undefined) return;
  if (process.env.NODE_ENV === 'production' || warnedSizes.has(size)) return;
  warnedSizes.add(size);
  // eslint-disable-next-line no-console
  console.warn(
    '[IconBadge] size="' + size + '" — IconBadge has one size (40px) and the ' +
    'prop was removed. Figma draws exactly one, and component sizing comes ' +
    'from the Component-Size modes rather than a per-component ladder.',
  );
}

export function IconBadge({
  children,
  color = 'primary',
  variant = 'solid',
  size,
  className = '',
  sx = {},
  ...props
}) {
  warnRemovedSize(size);
  const s = ICON_BADGE_SIZE;
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
      className={'icon-badge icon-badge-' + variant + ' icon-badge-' + color + ' ' + className}
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
