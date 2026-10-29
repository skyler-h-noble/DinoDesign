// src/components/Shape/Shape.js
import React from 'react';
import { shapeStyle, shapeSafeArea, SHAPE_NAMES } from './shapes';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('Shape');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* The static sheet. Per instance: the width (and height) and, for a path
   shape, its mask — custom properties on the element. The safe-area padding
   is a custom property too. The two radius shapes are classes, since
   squircle's corner-shape needs an @supports rule. */
registerBoxStyles('omni-shape', [
  '.omni-shape{position:relative;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;'
    + 'box-sizing:border-box;width:var(--_sh-w);aspect-ratio:1 / 1;overflow:hidden}',
  '.omni-shape-h{height:var(--_sh-h);aspect-ratio:auto}',
  '.omni-shape-themed{background-color:var(--Background);color:var(--Text)}',
  /* Content that is not an image stays inside the shape's safe area — the
     largest centred square that fits in it — so a sticker's label cannot run
     out past a burst's spikes. Percent padding is measured against the width,
     which on a square box is the side. */
  '.omni-shape-safe{padding:var(--_sh-pad);text-align:center;line-height:1.1}',
  /* An image, video or picture fills the shape edge to edge. */
  '.omni-shape>img,.omni-shape>video,.omni-shape>picture,.omni-shape>picture>img{width:100%;height:100%;object-fit:cover;display:block}',
  '.omni-shape-mask{-webkit-mask:var(--_sh-mask);mask:var(--_sh-mask)}',
  '.omni-shape-rounded{border-radius:var(--Card-Radius, var(--Style-Border-Radius, 8px))}',
  '.omni-shape-squircle{border-radius:28%}',
  '@supports (corner-shape: squircle){.omni-shape-squircle{border-radius:40%;corner-shape:squircle}}',
].join('\n'));

/**
 * Shape — a box cut to one of the system's shapes.
 *
 * WHAT IT IS FOR
 *   image frames   <Shape shape="arch"><img src="…" alt="…" /></Shape>
 *   accents        <Shape shape="cookie-9" color="tertiary" decorative />
 *   a sticker      <Shape shape="soft-burst" color="warning" width={64}>NEW</Shape>
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
 * CONTENT. An image, video or picture fills the shape. Anything else —
 * a sticker's label — is kept inside the shape's safe area (shapeSafeArea):
 * the largest centred square that fits in it. Pick a shape with room for
 * the words: a soft-burst holds "NEW" at 64px, a sharp burst barely does.
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
  component: Tag = 'div',
  className = '',
  sx,
  style,
  ...props
}) {
  useStaticStyles('omni-shape');
  if (!SHAPE_NAMES.includes(shape) && process.env.NODE_ENV !== 'production' && !warnedShape.has(shape)) {
    warnedShape.add(shape);
    // eslint-disable-next-line no-console
    console.warn('[Shape] "' + shape + '" is not a shape. Use one of: ' + SHAPE_NAMES.join(', ') + '.');
  }
  const themed = Boolean(color);
  const first = React.Children.toArray(children)[0];
  const framesMedia = React.isValidElement(first) && ['img', 'video', 'picture'].includes(first.type);
  const theme = themed ? (THEME[color] || THEME.primary) : undefined;
  const css = (n) => (typeof n === 'number' ? n + 'px' : n);
  const mask = shapeStyle(shape).mask;
  const radiusClass = shape === 'rounded' || shape === 'squircle' ? ' omni-shape-' + shape : '';

  const vars = { '--_sh-w': css(width) };
  if (height !== undefined) vars['--_sh-h'] = css(height);
  if (!framesMedia) vars['--_sh-pad'] = ((1 - shapeSafeArea(shape)) / 2 * 100).toFixed(1) + '%';
  if (mask) vars['--_sh-mask'] = mask;

  const root = {
    'data-theme': theme,
    'data-surface': themed ? (SURFACE[variant] || SURFACE.solid) : undefined,
    'aria-hidden': decorative || undefined,
    className: 'shape shape-' + shape + (className ? ' ' + className : '')
      + ' MuiBox-root omni-shape' + (height !== undefined ? ' omni-shape-h' : '')
      + (themed ? ' omni-shape-themed' : '') + (!framesMedia ? ' omni-shape-safe' : '')
      + (mask ? ' omni-shape-mask' : '') + radiusClass,
    style: { ...vars, ...style },
    ...props,
  };
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...root}>{children}</SxBox>;
  return <Tag {...root}>{children}</Tag>;
}

export default Shape;
