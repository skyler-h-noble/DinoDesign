// src/components/ShapeButton/ShapeButton.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { shapePath, shapeStyle, MORPHABLE_SHAPES, AVATAR_SHAPES } from '../Shape/shapes';

/**
 * ShapeButton — a button whose background is one of the system's shapes, and
 * which can MORPH into another on hover, on press, or while selected.
 *
 *   <ShapeButton shape="circle" morphTo="cookie-9" selected={on}
 *                onClick={toggle} aria-label="Add to favourites">
 *     <FavoriteIcon />
 *   </ShapeButton>
 *
 * CONTENT — an icon (children), or an image that fills the shape (imageSrc:
 * a profile photo, a product), or both (the icon over the image).
 *
 * LABEL — `label` sits under the shape, as an app icon or a nav item has it:
 * the shape keeps its morph and the text never fights the outline. With a
 * label, that text is the button's name; without one, aria-label is required
 * (it warns). There is no label INSIDE the shape — text in a shape is what a
 * Button is for.
 *
 * THE SHAPE is drawn, never a mask on the button, so the focus ring is never
 * clipped: an inline SVG path (which can morph), and for an image a mask on
 * the IMAGE only — the button around it still carries the ring.
 *
 * SHAPES — the same eleven as an Avatar (AVATAR_SHAPES): circle, squircle,
 * rounded, the cookies, flower, gem, puffy. Anything else draws a circle and
 * warns. Pointed or busy shapes (bursts, hearts, arrows) do not read as a
 * button and do not hold an icon.
 *
 * MORPHING. The path's `d` transitions between two ROUND shapes
 * (MORPHABLE_SHAPES), which share 120 points. Other pairs, images and
 * Safari snap; reduced motion snaps for everyone. In Figma: Smart Animate
 * between the Rest and Morphed variants.
 *
 * COLOR comes from the Buttons tokens, as Fab's: -Button fill, -Text
 * content, -Hover / -Pressed. Text below the shape is --Text (it sits on the
 * page, not on the fill).
 *
 * BORDER — every button has one: --Button-Border-Width (1px) in
 * --Buttons-{C}-Border. On a path it is a non-scaling stroke, so it stays
 * 1px at every size; over an image, an outline drawn on top.
 *
 * The Morph Button add-on in the studio builds the pair and the code.
 */

const SIZES = {
  small: { box: 40, icon: 20, font: 'var(--Body-Small-Font-Size, 14px)' },
  medium: { box: 56, icon: 24, font: 'var(--Body-Medium-Font-Size, 16px)' },
  large: { box: 96, icon: 36, font: 'var(--Body-Large-Font-Size, 18px)' },
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
  label,
  imageSrc,
  imageAlt = '',
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
  const pos = label ? 'below' : 'none';

  const ok = (n) => AVATAR_SHAPES.includes(n);
  if (!ok(shape)) warnOnce('shape:' + shape, '"' + shape + '" is not a button shape — drawn as a circle. Use one of: ' + AVATAR_SHAPES.join(', ') + '.');
  if (morphTo && !ok(morphTo)) warnOnce('shape:' + morphTo, '"' + morphTo + '" is not a button shape — drawn as a circle.');
  shape = ok(shape) ? shape : 'circle';
  morphTo = morphTo && !ok(morphTo) ? 'circle' : morphTo;
  if (morphTo && !imageSrc && !(MORPHABLE_SHAPES.includes(shape) && MORPHABLE_SHAPES.includes(morphTo))) {
    warnOnce('morph:' + shape + morphTo, shape + ' → ' + morphTo + ' will snap rather than blend. '
      + 'Both ends must be round shapes (MORPHABLE_SHAPES): ' + MORPHABLE_SHAPES.join(', ') + '.');
  }
  if (pos === 'none' && !props['aria-label'] && !props['aria-labelledby']) {
    warnOnce('name', 'needs a label or an aria-label naming the ACTION ("Add to favourites").');
  }

  const morphed = Boolean(morphTo) && !disabled && (
    (morphOn === 'selected' && selected) || (morphOn === 'hover' && hover) || (morphOn === 'press' && press));
  const current = morphed ? morphTo : shape;
  const s = SIZES[size] || SIZES.medium;
  const C = cap(color);
  const fill = 'var(--Buttons-' + C + '-Button)';
  const edge = 'var(--Buttons-' + C + '-Border)';
  const bw = 'var(--Button-Border-Width, 1px)';
  const outline = (d, filled) => (
    <svg className="shape-button-shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className={filled ? 'shape-button-fill' : 'shape-button-outline'} d={d} style={{ d: 'path("' + d + '")' }} />
    </svg>
  );

  /* The shape layer: an SVG path, or the image masked to the shape with its
     outline drawn over it. */
  let shapeLayer;
  if (imageSrc) {
    shapeLayer = (
      <Box className="shape-button-image" aria-hidden={imageAlt ? undefined : true}
           sx={{ position: 'absolute', inset: 0, ...shapeStyle(current) }}>
        <Box component="img" src={imageSrc} alt={imageAlt} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <Box className="shape-button-scrim" sx={{ position: 'absolute', inset: 0 }} />
      </Box>
    );
    shapeLayer = <>{shapeLayer}{outline(pathFor(current), false)}</>;
  } else {
    shapeLayer = outline(pathFor(current), true);
  }

  const hasIcon = React.Children.count(children) > 0;
  const shapeBox = (
    <Box className="shape-button-box" sx={{
      position: 'relative', display: 'inline-grid', placeItems: 'center', flexShrink: 0,
      width: s.box, height: s.box,
    }}>
      {shapeLayer}
      {hasIcon && <span className="shape-button-icon" aria-hidden="true">{children}</span>}
    </Box>
  );

  const ringRadius = pos === 'none' ? '50%' : 'var(--Button-Focus-Radius, 8px)';

  return (
    <Box
      ref={ref}
      component="button"
      type="button"
      disabled={disabled}
      aria-pressed={morphOn === 'selected' && morphTo ? selected : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setPress(true); }}
      onKeyUp={() => setPress(false)}
      onBlur={() => setPress(false)}
      className={'shape-button shape-button-' + size + ' shape-button-label-' + pos + (morphed ? ' shape-button-morphed' : '') + (className ? ' ' + className : '')}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        p: 0,
        border: 'none',
        background: 'transparent',
        font: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        /* The ring hugs what is there: a circle round an icon button, a
           rounded box round a shape and its label. */
        borderRadius: ringRadius,
        outline: 'none',
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        /* Content on the fill reads -Text. */
        '& .shape-button-box': { color: 'var(--Buttons-' + C + '-Text)' },
        '& svg.shape-button-shape': { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' },
        '& svg.shape-button-shape path': {
          fill,
          stroke: edge,
          strokeWidth: bw,
          vectorEffect: 'non-scaling-stroke',
          '@media (prefers-reduced-motion: no-preference)': {
            transition: 'd 0.45s cubic-bezier(.3, 1.35, .5, 1), fill 0.15s ease',
          },
        },
        /* Hover and pressed are CSS, like every other button; JS only tracks
           them for the morph trigger. */
        /* Over an image the path is only the edge. */
        '& svg.shape-button-shape path.shape-button-outline': { fill: 'none' },
        '&:hover:not(:disabled) svg.shape-button-shape path.shape-button-fill': { fill: 'var(--Buttons-' + C + '-Hover)' },
        '&:active:not(:disabled) svg.shape-button-shape path.shape-button-fill': { fill: 'var(--Buttons-' + C + '-Pressed)' },
        /* An image has no fill to change, so hover and press lay the surface's
           own scrim over it. */
        '&:hover:not(:disabled) .shape-button-scrim': { backgroundColor: 'var(--Hover)' },
        '&:active:not(:disabled) .shape-button-scrim': { backgroundColor: 'var(--Pressed)' },
        '& .shape-button-icon': { position: 'relative', display: 'inline-flex', '& svg': { width: s.icon, height: s.icon, fontSize: s.icon } },
        '& .shape-button-label': {
          position: 'relative',
          fontFamily: 'var(--Body-Font-Family, inherit)',
          fontSize: s.font,
          fontWeight: 600,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        },
        /* Below the shape it sits on the page, so it is the page's text. */
        '& > .shape-button-label': { color: 'var(--Text)' },
        ...sx,
      }}
      {...props}
    >
      {shapeBox}
      {pos === 'below' && <span className="shape-button-label shape-button-label-below">{label}</span>}
    </Box>
  );
});

export default ShapeButton;
