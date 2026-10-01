// src/components/MiniSwatch/MiniSwatch.js
//
// The colour chip that sits inside a menu row — a Select in colour mode, a menu
// item with the `Swatch` boolean on.
//
// Deliberately NOT the standalone Swatch, and the differences are the whole
// point. Swatch is a circle the size of a button that carries its own seven
// states; this is a 20px rounded square with none, because the ROW owns the
// state. A selected colour option is a selected menu item, not a selected
// swatch, and marking it twice would say the same thing in two places.
//
//   Swatch       Button-Height (24/32/56)   circle      1px Border   7 states
//   MiniSwatch   Menu-Swatch (20)           radius 4    no border    none
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
        width: 'var(--Menu-Swatch, 20px)',
        height: 'var(--Menu-Swatch, 20px)',
        flexShrink: 0,
        // Sizing-Half, which is what Figma binds — not Input-Swatch-Radius.
        borderRadius: 'var(--Sizing-Half, 4px)',
        backgroundColor: color,
        // No border by design. Selection is shown by the ROW, so the chip has
        // no edge to recolour — and nothing to mistake for one.
        ...sx,
      }}
      {...props}
    />
  );
}

export default MiniSwatch;
