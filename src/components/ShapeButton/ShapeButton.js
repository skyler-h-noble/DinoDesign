// src/components/ShapeButton/ShapeButton.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { shapePath, shapeStyle, MORPHABLE_SHAPES, SHAPE_NAMES } from '../Shape/shapes';

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
 * LABEL — `label` with labelPosition:
 *   none    icon-only; aria-label is required (it warns without one)
 *   below   the label under the shape, as an app icon or a nav item has it.
 *           The shape keeps its morph and the text never fights the outline.
 *   inside  the shape is the label's background. Only WIDE shapes hold text
 *           (pill, rounded, squircle, square, slanted, clamshell,
 *           cut-corners); the button hugs the label. Wide shapes cannot
 *           blend into each other — a morph between them snaps.
 * With a visible label, that label is the name; aria-label is optional.
 *
 * THE SHAPE is drawn, never a mask on the button, so the focus ring is never
 * clipped: an inline SVG path for icon buttons (which can morph), CSS radius
 * or clip-path on an inner layer for wide shapes, and a mask on the IMAGE
 * only — the button around it still carries the ring.
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
 * 1px at every size; over an image, an outline drawn on top; on a wide shape,
 * an edge layer in the border color with the fill inset inside it — so the
 * angled sides of a slanted or cut tag keep their border, which a clip-path
 * border would cut off.
 *
 * The Morph Button add-on in the studio builds the pair and the code.
 */

const SIZES = {
  small: { box: 40, icon: 20, font: 'var(--Body-Small-Font-Size, 14px)' },
  medium: { box: 56, icon: 24, font: 'var(--Body-Medium-Font-Size, 16px)' },
  large: { box: 96, icon: 36, font: 'var(--Body-Large-Font-Size, 18px)' },
};

/* Shapes that can hold a label inside, drawn so their ends stay true however
   wide the label makes the button: px, not a stretched 0-100 path. */
const WIDE = {
  pill: () => ({ borderRadius: '9999px' }),
  rounded: () => ({ borderRadius: 'var(--Button-Radius, var(--Style-Border-Radius, 8px))' }),
  squircle: (h) => ({ borderRadius: Math.round(h * 0.42) + 'px', '@supports (corner-shape: squircle)': { cornerShape: 'squircle', borderRadius: Math.round(h * 0.5) + 'px' } }),
  square: (h) => ({ borderRadius: Math.round(h * 0.28) + 'px' }),
  slanted: (h) => ({ clipPath: `polygon(${Math.round(h * 0.25)}px 0, 100% 0, calc(100% - ${Math.round(h * 0.25)}px) 100%, 0 100%)` }),
  clamshell: (h) => ({ clipPath: `polygon(${Math.round(h * 0.35)}px 0, calc(100% - ${Math.round(h * 0.35)}px) 0, 100% 50%, calc(100% - ${Math.round(h * 0.35)}px) 100%, ${Math.round(h * 0.35)}px 100%, 0 50%)` }),
  'cut-corners': (h) => ({ clipPath: `polygon(${Math.round(h * 0.25)}px 0, calc(100% - ${Math.round(h * 0.25)}px) 0, 100% ${Math.round(h * 0.25)}px, 100% calc(100% - ${Math.round(h * 0.25)}px), calc(100% - ${Math.round(h * 0.25)}px) 100%, ${Math.round(h * 0.25)}px 100%, 0 calc(100% - ${Math.round(h * 0.25)}px), 0 ${Math.round(h * 0.25)}px)` }),
};
export const WIDE_SHAPES = Object.keys(WIDE);

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
  /* none | below | inside — 'none' unless a label is given, then 'below' */
  labelPosition,
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
  const pos = label ? (labelPosition === 'inside' ? 'inside' : 'below') : 'none';
  const inside = pos === 'inside';

  if (!SHAPE_NAMES.includes(shape)) warnOnce('shape:' + shape, '"' + shape + '" is not a shape.');
  if (inside && !WIDE[shape]) {
    warnOnce('wide:' + shape, '"' + shape + '" cannot hold a label inside — drawn as a pill. Wide shapes: ' + WIDE_SHAPES.join(', ') + '.');
  }
  if (morphTo && !inside && !imageSrc && !(MORPHABLE_SHAPES.includes(shape) && MORPHABLE_SHAPES.includes(morphTo))) {
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

  /* The shape layer: an SVG path (icon buttons), a CSS shape (inside a label),
     or the image masked to the shape. */
  let shapeLayer;
  if (imageSrc && !inside) {
    shapeLayer = (
      <Box className="shape-button-image" aria-hidden={imageAlt ? undefined : true}
           sx={{ position: 'absolute', inset: 0, ...shapeStyle(current) }}>
        <Box component="img" src={imageSrc} alt={imageAlt} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <Box className="shape-button-scrim" sx={{ position: 'absolute', inset: 0 }} />
      </Box>
    );
    shapeLayer = <>{shapeLayer}{outline(pathFor(current), false)}</>;
  } else if (inside) {
    const css = (WIDE[current] || WIDE.pill)(s.box);
    shapeLayer = (
      <Box className="shape-button-edge" aria-hidden="true" sx={{ position: 'absolute', inset: 0, backgroundColor: edge, ...css }}>
        <Box className="shape-button-bg" sx={{ position: 'absolute', inset: bw, backgroundColor: fill, ...css }} />
      </Box>
    );
  } else {
    shapeLayer = outline(pathFor(current), true);
  }

  const hasIcon = React.Children.count(children) > 0;
  const shapeBox = (
    <Box className="shape-button-box" sx={{
      position: 'relative', display: 'inline-grid', placeItems: 'center', flexShrink: 0,
      ...(inside
        ? { height: s.box, px: (s.box * 0.4) + 'px', gridAutoFlow: 'column', gap: '8px' }
        : { width: s.box, height: s.box }),
    }}>
      {shapeLayer}
      {hasIcon && <span className="shape-button-icon" aria-hidden="true">{children}</span>}
      {inside && <span className="shape-button-label shape-button-label-inside">{label}</span>}
    </Box>
  );

  const ringRadius = pos === 'none' && !imageSrc ? '50%' : inside && current === 'pill' ? '9999px' : 'var(--Button-Focus-Radius, 8px)';

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
        /* The ring hugs what is there: a circle round an icon button, the
           pill round a pill, a rounded box round a shape and its label. */
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
        '&:hover:not(:disabled) svg.shape-button-shape path.shape-button-fill, &:hover:not(:disabled) .shape-button-bg': { fill: 'var(--Buttons-' + C + '-Hover)', backgroundColor: 'var(--Buttons-' + C + '-Hover)' },
        '&:active:not(:disabled) svg.shape-button-shape path.shape-button-fill, &:active:not(:disabled) .shape-button-bg': { fill: 'var(--Buttons-' + C + '-Pressed)', backgroundColor: 'var(--Buttons-' + C + '-Pressed)' },
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
