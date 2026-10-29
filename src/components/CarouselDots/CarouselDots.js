// src/components/CarouselDots/CarouselDots.js
import React, { useRef } from 'react';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const DotSxBox = lazySxBox('CarouselDot');
const GroupSxBox = lazySxBox('CarouselDots');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/**
 * CarouselDot / CarouselDots — Figma's Carousel Dot (8379:11675).
 *
 * A dot is a 24px hit area (Sizing-3, the touch minimum) holding a 16px dot:
 *
 *   unselected   a 1px --Border ring INSIDE, no fill; Hover / Pressed fill
 *                the surface's --Hover / --Pressed
 *   selected     --Buttons-{C}-Button with a 1px --Buttons-{C}-Border ring;
 *                Hover / Pressed take --Buttons-{C}-Hover / -Pressed
 *   focus        the house 2px --Focus-Visible ring, 1px clear of the dot
 *   disabled     38%
 *
 * The 3:1 lives in the RING, not the fill — an unselected dot is only its
 * edge, so it reads on any surface.
 *
 * CarouselDots — Figma's Carousel Dot Group (8379:11694), dots Sizing-Half
 * apart — is what a carousel uses: `count` dots, `value` the current
 * slide, `onChange(index)`. Each dot is a button named "Slide 3 of 5", the
 * current one aria-current; the row is a roving tab stop — Tab lands on the
 * current dot and ←/→ (Home / End) move along it.
 */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* The static sheet. A dot's four colors (rest, hover, pressed, ring) are the
   per-instance values — the palette, or the surface's own tokens when
   unselected — as custom properties on the button. The state rules carry
   emotion's weight (one class, one pseudo-class, one descendant class) and
   exist only on an enabled dot (.omni-cdot-on), as they did. */
registerBoxStyles('omni-carousel-dots', [
  '.omni-cdot{width:var(--Sizing-3, 24px);height:var(--Sizing-3, 24px);display:inline-flex;align-items:center;justify-content:center;'
    + 'flex-shrink:0;margin:0;padding:0;border:none;background:none;cursor:pointer;opacity:1;outline:none}',
  '.omni-cdot-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  // The ring is INSIDE (Figma's inside stroke), so it takes no space.
  '.omni-cdot .carousel-dot-mark{width:16px;height:16px;border-radius:50%;box-sizing:border-box;background-color:var(--_cd-b);'
    + 'box-shadow:inset 0 0 0 1px var(--_cd-r);transition:background-color 0.15s ease}',
  '.omni-cdot-on:hover .carousel-dot-mark{background-color:var(--_cd-h)}',
  '.omni-cdot-on:active .carousel-dot-mark{background-color:var(--_cd-p)}',
  '.omni-cdot-on:focus-visible .carousel-dot-mark{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  /* Sizing-Half between the 24px dots, as Figma's Carousel Dot Group. */
  '.omni-cdots{display:inline-flex;align-items:center;gap:var(--Sizing-Half, 4px)}',
].join('\n'));

export const CarouselDot = React.forwardRef(function CarouselDot({
  selected = false,
  color = 'default',
  disabled = false,
  className = '',
  sx,
  style,
  ...props
}, ref) {
  useStaticStyles('omni-carousel-dots');
  const C = cap(color);
  const fill = (state) => (selected ? 'var(--Buttons-' + C + '-' + state + ')' : state === 'Button' ? 'transparent' : 'var(--' + state + ')');
  const root = {
    ref,
    type: 'button',
    disabled,
    className: 'carousel-dot' + (selected ? ' carousel-dot-selected' : '') + (className ? ' ' + className : '')
      + ' MuiBox-root omni-cdot ' + (disabled ? 'omni-cdot-off' : 'omni-cdot-on'),
    style: {
      '--_cd-b': fill('Button'),
      '--_cd-h': fill('Hover'),
      '--_cd-p': fill('Pressed'),
      '--_cd-r': selected ? 'var(--Buttons-' + C + '-Border)' : 'var(--Border)',
      ...style,
    },
    ...props,
  };
  const mark = <span className="MuiBox-root carousel-dot-mark" aria-hidden="true" />;
  if (hasSx(sx)) return <DotSxBox component="button" sx={sx} {...root}>{mark}</DotSxBox>;
  return <button {...root}>{mark}</button>;
});

export function CarouselDots({
  count = 0,
  value = 0,
  onChange,
  color = 'default',
  disabled = false,
  'aria-label': ariaLabel = 'Slides',
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-carousel-dots');
  const refs = useRef([]);
  const go = (i) => {
    const next = (i + count) % count;
    onChange?.(next);
    refs.current[next]?.focus();
  };
  const onKeyDown = (e) => {
    const keys = { ArrowRight: value + 1, ArrowDown: value + 1, ArrowLeft: value - 1, ArrowUp: value - 1, Home: 0, End: count - 1 };
    if (e.key in keys) { e.preventDefault(); go(keys[e.key]); }
  };
  const root = {
    role: 'group',
    'aria-label': ariaLabel,
    className: 'carousel-dots' + (className ? ' ' + className : '') + ' MuiBox-root omni-cdots',
    onKeyDown,
    ...props,
  };
  const dots = Array.from({ length: count }, (_, i) => (
    <CarouselDot key={i} ref={(el) => { refs.current[i] = el; }} color={color} disabled={disabled}
      selected={i === value} aria-current={i === value ? 'true' : undefined}
      aria-label={'Slide ' + (i + 1) + ' of ' + count}
      tabIndex={i === value ? 0 : -1}
      onClick={() => onChange?.(i)} />
  ));
  if (hasSx(sx)) return <GroupSxBox sx={sx} {...root}>{dots}</GroupSxBox>;
  return <div {...root}>{dots}</div>;
}

export default CarouselDots;
