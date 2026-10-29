// src/components/ShapeButton/ShapeButton.js
import React, { useState } from 'react';
import { shapePath, shapeStyle, MORPHABLE_SHAPES, AVATAR_SHAPES, MORPH_TARGET_SHAPES } from '../Shape/shapes';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('ShapeButton');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

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
 * SHAPES — the same twelve as an Avatar (AVATAR_SHAPES): circle, squircle,
 * rounded, the cookies, flower, gem, puffy, bun — at rest. It may MORPH into
 * any of MORPH_TARGET_SHAPES: the blending avatar shapes plus sunny,
 * very-sunny, the clovers, soft-burst, soft-boom and heart, because the
 * morphed state is brief or a deliberate "on" and can be louder. Anything
 * else draws a circle and warns. Pointed or busy shapes (bursts, hearts, arrows) do not read as a
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


/* The static sheet. Per instance: the palette (four Buttons tokens) and the
   size (box, icon, label font) as custom properties on the button; the shape
   layer's mask (an image) on the image layer. Every state rule keeps the
   weight its sx rule had. */
registerBoxStyles('omni-shape-button', [
  '.omni-shbtn{position:relative;display:inline-flex;flex-direction:column;align-items:center;gap:6px;padding:0;border:none;'
    + 'background:transparent;font:inherit;cursor:pointer;opacity:1;border-radius:50%;outline:none}',
  '.omni-shbtn-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  /* The ring hugs what is there: a circle round an icon button, a rounded
     box round a shape and its label. */
  '.omni-shbtn-below{border-radius:var(--Button-Focus-Radius, 8px)}',
  '.omni-shbtn:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:2px}',
  /* Content on the fill reads -Text. */
  '.omni-shbtn .shape-button-box{color:var(--_shb-text)}',
  '.omni-shbtn svg.shape-button-shape{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
  '.omni-shbtn svg.shape-button-shape path{fill:var(--_shb-fill);stroke:var(--_shb-edge);stroke-width:var(--Button-Border-Width, 1px);vector-effect:non-scaling-stroke}',
  '@media (prefers-reduced-motion: no-preference){.omni-shbtn svg.shape-button-shape path{transition:d 0.45s cubic-bezier(.3, 1.35, .5, 1), fill 0.15s ease}}',
  /* Hover and pressed are CSS, like every other button; JS only tracks them
     for the morph trigger. Over an image the path is only the edge. */
  '.omni-shbtn svg.shape-button-shape path.shape-button-outline{fill:none}',
  '.omni-shbtn:hover:not(:disabled) svg.shape-button-shape path.shape-button-fill{fill:var(--_shb-hover)}',
  '.omni-shbtn:active:not(:disabled) svg.shape-button-shape path.shape-button-fill{fill:var(--_shb-pressed)}',
  /* An image has no fill to change, so hover and press lay the surface's own
     scrim over it. */
  '.omni-shbtn:hover:not(:disabled) .shape-button-scrim{background-color:var(--Hover)}',
  '.omni-shbtn:active:not(:disabled) .shape-button-scrim{background-color:var(--Pressed)}',
  '.omni-shbtn .shape-button-icon{position:relative;display:inline-flex}',
  '.omni-shbtn .shape-button-icon svg{width:var(--_shb-icon);height:var(--_shb-icon);font-size:var(--_shb-icon)}',
  '.omni-shbtn .shape-button-label{position:relative;font-family:var(--Body-Font-Family, inherit);font-size:var(--_shb-font);'
    + 'font-weight:600;line-height:1.2;white-space:nowrap}',
  /* Below the shape it sits on the page, so it is the page's text. */
  '.omni-shbtn>.shape-button-label{color:var(--Text)}',
  '.omni-shbtn-box{position:relative;display:inline-grid;place-items:center;flex-shrink:0;width:var(--_shb-box);height:var(--_shb-box)}',
  '.omni-shbtn-image{position:absolute;inset:0}',
  '.omni-shbtn-image.omni-shbtn-mask{-webkit-mask:var(--_shb-mask);mask:var(--_shb-mask)}',
  '.omni-shbtn-image.omni-shbtn-rounded{border-radius:var(--Card-Radius, var(--Style-Border-Radius, 8px))}',
  '.omni-shbtn-image.omni-shbtn-squircle{border-radius:28%}',
  '@supports (corner-shape: squircle){.omni-shbtn-image.omni-shbtn-squircle{border-radius:40%;corner-shape:squircle}}',
  '.omni-shbtn-img{width:100%;height:100%;object-fit:cover;display:block}',
  '.omni-shbtn-scrim{position:absolute;inset:0}',
].join('\n'));

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
  sx,
  style,
  ...props
}, ref) {
  useStaticStyles('omni-shape-button');
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const pos = label ? 'below' : 'none';

  const ok = (n) => AVATAR_SHAPES.includes(n);
  if (!ok(shape)) warnOnce('shape:' + shape, '"' + shape + '" is not a button shape — drawn as a circle. Use one of: ' + AVATAR_SHAPES.join(', ') + '.');
  const okTarget = (n) => ok(n) || MORPH_TARGET_SHAPES.includes(n);
  if (morphTo && !okTarget(morphTo)) warnOnce('shape:' + morphTo, '"' + morphTo + '" is not a morph target — drawn as a circle. Use one of: ' + MORPH_TARGET_SHAPES.join(', ') + '.');
  shape = ok(shape) ? shape : 'circle';
  morphTo = morphTo && !okTarget(morphTo) ? 'circle' : morphTo;
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
  const outline = (d, filled) => (
    <svg className="shape-button-shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className={filled ? 'shape-button-fill' : 'shape-button-outline'} d={d} style={{ d: 'path("' + d + '")' }} />
    </svg>
  );

  /* The shape layer: an SVG path, or the image masked to the shape with its
     outline drawn over it. */
  let shapeLayer;
  if (imageSrc) {
    const mask = shapeStyle(current).mask;
    const radius = current === 'rounded' || current === 'squircle' ? ' omni-shbtn-' + current : '';
    shapeLayer = (
      <div className={'shape-button-image MuiBox-root omni-shbtn-image' + (mask ? ' omni-shbtn-mask' : '') + radius}
           aria-hidden={imageAlt ? undefined : true}
           style={mask ? { '--_shb-mask': mask } : undefined}>
        <img className="MuiBox-root omni-shbtn-img" src={imageSrc} alt={imageAlt} />
        <div className="shape-button-scrim MuiBox-root omni-shbtn-scrim" />
      </div>
    );
    shapeLayer = <>{shapeLayer}{outline(pathFor(current), false)}</>;
  } else {
    shapeLayer = outline(pathFor(current), true);
  }

  const hasIcon = React.Children.count(children) > 0;
  const shapeBox = (
    <div className="shape-button-box MuiBox-root omni-shbtn-box">
      {shapeLayer}
      {hasIcon && <span className="shape-button-icon" aria-hidden="true">{children}</span>}
    </div>
  );

  const root = {
    ref,
    type: 'button',
    disabled,
    'aria-pressed': morphOn === 'selected' && morphTo ? selected : undefined,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onPointerDown: () => setPress(true),
    onPointerUp: () => setPress(false),
    onKeyDown: (e) => { if (e.key === ' ' || e.key === 'Enter') setPress(true); },
    onKeyUp: () => setPress(false),
    onBlur: () => setPress(false),
    className: 'shape-button shape-button-' + size + ' shape-button-label-' + pos + (morphed ? ' shape-button-morphed' : '') + (className ? ' ' + className : '')
      + ' MuiBox-root omni-shbtn' + (disabled ? ' omni-shbtn-off' : '') + (pos === 'none' ? '' : ' omni-shbtn-below'),
    style: {
      '--_shb-fill': 'var(--Buttons-' + C + '-Button)',
      '--_shb-edge': 'var(--Buttons-' + C + '-Border)',
      '--_shb-hover': 'var(--Buttons-' + C + '-Hover)',
      '--_shb-pressed': 'var(--Buttons-' + C + '-Pressed)',
      '--_shb-text': 'var(--Buttons-' + C + '-Text)',
      '--_shb-box': s.box + 'px',
      '--_shb-icon': s.icon + 'px',
      '--_shb-font': s.font,
      ...style,
    },
    ...props,
  };
  const content = (
    <>
      {shapeBox}
      {pos === 'below' && <span className="shape-button-label shape-button-label-below">{label}</span>}
    </>
  );
  if (hasSx(sx)) return <SxBox component="button" sx={sx} {...root}>{content}</SxBox>;
  return <button {...root}>{content}</button>;
});

export default ShapeButton;
