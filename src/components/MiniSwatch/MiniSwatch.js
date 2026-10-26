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
import { Box } from '@mui/material';

export function MiniSwatch({
  color,
  className = '',
  sx = {},
  ...props
}) {
  return (
    <Box
      className={`mini-swatch ${className}`.trim()}
      // Decorative: the option's text is the accessible name, so announcing the
      // chip as well would read the same choice twice.
      aria-hidden="true"
      sx={{
        width: 'var(--Menu-Swatch, 24px)',
        height: 'var(--Menu-Swatch, 24px)',
        flexShrink: 0,
        // Sizing-Half, which is what Figma binds — not Input-Swatch-Radius.
        borderRadius: 'var(--Sizing-Half, 4px)',
        backgroundColor: color,
        /* A 1px --Background edge, inside (Figma's MiniSwatch stroke). It is a
           gap, not a selection mark: the row's 3px inside focus ring passes
           close to the chip, and the edge keeps the ring from touching the
           colour — so the ring's contrast is always against the surface. */
        boxShadow: 'inset 0 0 0 1px var(--Background)',
        ...sx,
      }}
      {...props}
    />
  );
}

export default MiniSwatch;
