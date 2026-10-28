// src/components/Shape/Shape.js
import React from 'react';
import { Box } from '@mui/material';
import { shapeStyle, SHAPE_NAMES } from './shapes';

/**
 * Shape — a box cut to one of the system's shapes.
 *
 * WHAT IT IS FOR
 *   image frames   <Shape shape="arch"><img src="…" alt="…" /></Shape>
 *   accents        <Shape shape="cookie-9" color="tertiary" decorative />
 *   a sticker      <Shape shape="burst" color="warning" width={64}>NEW</Shape>
 *
 * WHAT IT IS NOT FOR
 *   Buttons, inputs, chips, avatars and cards keep the shape their radius
 *   tokens give them. A hexagon button breaks the system's one rule for what
 *   is clickable, and clipping a card cuts off its focus ring and its shadow.
 *   Put a shaped image INSIDE a card instead.
 *
 * NOTHING FOCUSABLE INSIDE. A mask clips everything drawn outside the shape,
 * focus rings included. Wrap the Shape in the link or button and let the
 * wrapper carry the ring.
 *
 * SIZE. `width` (and `height`, or the square default) in px or any CSS
 * length. Round shapes are drawn for a square box; on a wide one they stretch.
 *
 * COLOR. With `color`, the shape is a themed surface — data-theme +
 * data-surface, painted --Background, its text --Text — so a sticker's label
 * has a known contrast. Without one it paints nothing: an image frame is the
 * image.
 *
 * The geometry comes from ./shapes, the same list the Figma plugin builds the
 * Shapes component from — the two cannot draw different shapes.
 */

const THEME = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
  neutral: 'Neutral', info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SURFACE = { solid: 'Surface', light: 'Surface-Brightest', dark: 'Surface-Dimmest' };

const warnedShape = new Set();

export function Shape({
  shape = 'circle',
  children,
  width = 96,
  height,
  color,
  variant = 'solid',
  decorative = false,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  if (!SHAPE_NAMES.includes(shape) && process.env.NODE_ENV !== 'production' && !warnedShape.has(shape)) {
    warnedShape.add(shape);
    // eslint-disable-next-line no-console
    console.warn('[Shape] "' + shape + '" is not a shape. Use one of: ' + SHAPE_NAMES.join(', ') + '.');
  }
  const themed = Boolean(color);
  const theme = themed ? (THEME[color] || THEME.primary) : undefined;
  const css = (n) => (typeof n === 'number' ? n + 'px' : n);

  return (
    <Box
      component={component}
      data-theme={theme}
      data-surface={themed ? (SURFACE[variant] || SURFACE.solid) : undefined}
      aria-hidden={decorative || undefined}
      className={'shape shape-' + shape + (className ? ' ' + className : '')}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: css(width),
        ...(height !== undefined ? { height: css(height) } : { aspectRatio: '1 / 1' }),
        overflow: 'hidden',
        ...(themed && { backgroundColor: 'var(--Background)', color: 'var(--Text)' }),
        /* An image, video or picture fills the shape edge to edge. */
        '& > img, & > video, & > picture, & > picture > img': {
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        },
        ...shapeStyle(shape),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Shape;
