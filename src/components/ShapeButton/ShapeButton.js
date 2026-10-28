// src/components/ShapeButton/ShapeButton.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { shapePath, MORPHABLE_SHAPES, SHAPE_NAMES } from '../Shape/shapes';

/**
 * ShapeButton — an icon button whose container is one of the system's
 * shapes, and which can MORPH into another shape on hover, on press, or while
 * selected.
 *
 *   <ShapeButton shape="circle" morphTo="cookie-9" morphOn="selected"
 *                selected={on} onClick={toggle} aria-label="Favourite">
 *     <FavoriteIcon />
 *   </ShapeButton>
 *
 * ICON-ONLY, ON PURPOSE. A text label in a cookie or a burst runs out past
 * its edge; text buttons keep Button's radius-token corners.
 *
 * THE SHAPE is an inline SVG path behind the icon, not a mask on the button:
 * a mask would clip the focus ring. The <button> itself stays round, so its
 * ring is a circle just outside the shape.
 *
 * MORPHING. The path's `d` changes and CSS transitions it. Only the ROUND
 * family (MORPHABLE_SHAPES — circle, cookies, sunny, flower, clovers, bursts,
 * heart) blend smoothly: they share 120 points, and a transition between two
 * paths needs the same points in the same order. Any other pair snaps.
 * Safari does not transition `d` and snaps too; under reduced motion it snaps
 * for everyone. In Figma the same pair blends with Smart Animate between the
 * Rest and Morphed variants.
 *
 * COLOR comes from the Buttons tokens, exactly as Fab's: --Buttons-{C}-Button
 * fill, -Text icon, -Hover / -Pressed for the states.
 *
 * The Morph Button add-on in the studio builds the pair, the trigger and the
 * code for you.
 */

const SIZES = {
  small: { box: 40, icon: 20 },
  medium: { box: 56, icon: 24 },
  large: { box: 96, icon: 36 },
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const warned = new Set();
const warnOnce = (key, msg) => {
  if (process.env.NODE_ENV === 'production' || warned.has(key)) return;
  warned.add(key);
  // eslint-disable-next-line no-console
  console.warn('[ShapeButton] ' + msg);
};

/* A radius shape has no path; draw the nearest one. */
const pathFor = (name) => shapePath(name) || shapePath(name === 'squircle' || name === 'rounded' ? 'square' : 'circle');

export const ShapeButton = React.forwardRef(function ShapeButton({
  children,
  shape = 'circle',
  morphTo,
  /* hover | press | selected */
  morphOn = 'selected',
  selected = false,
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  sx = {},
  ...props
}, ref) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  if (!SHAPE_NAMES.includes(shape)) warnOnce('shape:' + shape, '"' + shape + '" is not a shape.');
  if (morphTo && !(MORPHABLE_SHAPES.includes(shape) && MORPHABLE_SHAPES.includes(morphTo))) {
    warnOnce('morph:' + shape + morphTo, shape + ' → ' + morphTo + ' will snap rather than blend. '
      + 'Both ends must be round shapes (MORPHABLE_SHAPES): ' + MORPHABLE_SHAPES.join(', ') + '.');
  }
  if (!props['aria-label'] && !props['aria-labelledby']) {
    warnOnce('name', 'needs an aria-label naming the ACTION ("Add to favourites") — it has no visible text.');
  }

  const morphed = Boolean(morphTo) && !disabled && (
    (morphOn === 'selected' && selected) || (morphOn === 'hover' && hover) || (morphOn === 'press' && press));
  const d = pathFor(morphed ? morphTo : shape);
  const s = SIZES[size] || SIZES.medium;
  const C = cap(color);

  return (
    <Box
      ref={ref}
      component="button"
      type="button"
      disabled={disabled}
      aria-pressed={morphOn === 'selected' ? selected : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setPress(true); }}
      onKeyUp={() => setPress(false)}
      onBlur={() => setPress(false)}
      className={'shape-button shape-button-' + size + (morphed ? ' shape-button-morphed' : '') + (className ? ' ' + className : '')}
      sx={{
        position: 'relative',
        display: 'inline-grid',
        placeItems: 'center',
        width: s.box,
        height: s.box,
        p: 0,
        border: 'none',
        background: 'transparent',
        color: 'var(--Buttons-' + C + '-Text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        /* Round, so the ring is a circle just outside whatever shape is drawn. */
        borderRadius: '50%',
        outline: 'none',
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        '& > svg.shape-button-shape': { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' },
        /* Hover and pressed are CSS, like every other button; JS only tracks
           them for the morph trigger. */
        '&:hover:not(:disabled) > svg.shape-button-shape path': { fill: 'var(--Buttons-' + C + '-Hover)' },
        '&:active:not(:disabled) > svg.shape-button-shape path': { fill: 'var(--Buttons-' + C + '-Pressed)' },
        '& > svg.shape-button-shape path': {
          fill: 'var(--Buttons-' + C + '-Button)',
          '@media (prefers-reduced-motion: no-preference)': {
            transition: 'd 0.45s cubic-bezier(.3, 1.35, .5, 1), fill 0.15s ease',
          },
        },
        '& > .shape-button-icon': { position: 'relative', display: 'inline-flex', '& svg': { width: s.icon, height: s.icon, fontSize: s.icon } },
        ...sx,
      }}
      {...props}
    >
      <svg className="shape-button-shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={d} style={{ d: 'path("' + d + '")' }} />
      </svg>
      <span className="shape-button-icon" aria-hidden="true">{children}</span>
    </Box>
  );
});

export default ShapeButton;
