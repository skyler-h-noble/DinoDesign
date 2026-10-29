// src/components/MiniSwatch/MiniSwatch.js
//
// The color chip that sits inside a menu row — a Select in color mode, a menu
// item with the `Swatch` boolean on.
//
// Deliberately NOT the standalone Swatch, and the differences are the whole
// point. Swatch is a circle the size of a button that carries its own seven
// states; this is a 20px rounded square with none, because the ROW owns the
// state. A selected color option is a selected menu item, not a selected
// swatch, and marking it twice would say the same thing in two places.
//
//   Swatch       Button-Height (24/32/56)   circle      1px Border   7 states
//   MiniSwatch   Menu-Swatch (24)           radius 4    1px Background edge (inside)   none
//
// It has no gallery page: there is nothing to play with. It appears inside
// Select and Menu, which is where it is documented.
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('MiniSwatch');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* The chip's color is the one per-instance value: a custom property on the
   chip itself, read by the static rule. */
registerStaticStyles('omni-mini-swatch', [
  '.omni-mini-swatch{width:var(--Menu-Swatch, 24px);height:var(--Menu-Swatch, 24px);flex-shrink:0;'
    // Sizing-Half, which is what Figma binds — not Input-Swatch-Radius.
    + 'border-radius:var(--Sizing-Half, 4px);background-color:var(--_ms-c);'
    /* A 1px --Background edge, inside (Figma's MiniSwatch stroke). It is a
       gap, not a selection mark: the row's 3px inside focus ring passes
       close to the chip, and the edge keeps the ring from touching the
       colour — so the ring's contrast is always against the surface. */
    + 'box-shadow:inset 0 0 0 1px var(--Background)}',
].join('\n'));

export function MiniSwatch({
  color,
  className = '',
  sx,
  style,
  ...props
}) {
  useStaticStyles('omni-mini-swatch');
  const root = {
    className: `mini-swatch ${className}`.trim() + ' MuiBox-root omni-mini-swatch',
    // Decorative: the option's text is the accessible name, so announcing the
    // chip as well would read the same choice twice.
    'aria-hidden': 'true',
    style: color !== undefined ? { '--_ms-c': color, ...style } : style,
    ...props,
  };
  if (hasSx(sx)) return <SxBox sx={sx} {...root} />;
  return <div {...root} />;
}

export default MiniSwatch;
