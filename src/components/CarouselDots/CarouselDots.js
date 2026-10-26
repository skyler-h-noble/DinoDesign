// src/components/CarouselDots/CarouselDots.js
import React, { useRef } from 'react';
import { Box } from '@mui/material';

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
 * CarouselDots is what a carousel uses: `count` dots, `value` the current
 * slide, `onChange(index)`. Each dot is a button named "Slide 3 of 5", the
 * current one aria-current; the row is a roving tab stop — Tab lands on the
 * current dot and ←/→ (Home / End) move along it.
 */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const CarouselDot = React.forwardRef(function CarouselDot({
  selected = false,
  color = 'default',
  disabled = false,
  className = '',
  sx = {},
  ...props
}, ref) {
  const C = cap(color);
  const fill = (state) => (selected ? 'var(--Buttons-' + C + '-' + state + ')' : state === 'Button' ? 'transparent' : 'var(--' + state + ')');
  return (
    <Box
      ref={ref}
      component="button"
      type="button"
      disabled={disabled}
      className={'carousel-dot' + (selected ? ' carousel-dot-selected' : '') + (className ? ' ' + className : '')}
      sx={{
        width: 'var(--Sizing-3, 24px)', height: 'var(--Sizing-3, 24px)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, m: 0, p: 0, border: 'none', background: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        outline: 'none',
        '& .carousel-dot-mark': {
          width: 16, height: 16, borderRadius: '50%', boxSizing: 'border-box',
          backgroundColor: fill('Button'),
          // The ring is INSIDE (Figma's inside stroke), so it takes no space.
          boxShadow: 'inset 0 0 0 1px ' + (selected ? 'var(--Buttons-' + C + '-Border)' : 'var(--Border)'),
          transition: 'background-color 0.15s ease',
        },
        ...(!disabled && {
          '&:hover .carousel-dot-mark': { backgroundColor: fill('Hover') },
          '&:active .carousel-dot-mark': { backgroundColor: fill('Pressed') },
          '&:focus-visible .carousel-dot-mark': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
        }),
        ...sx,
      }}
      {...props}
    >
      <Box component="span" className="carousel-dot-mark" aria-hidden="true" />
    </Box>
  );
});

export function CarouselDots({
  count = 0,
  value = 0,
  onChange,
  color = 'default',
  disabled = false,
  'aria-label': ariaLabel = 'Slides',
  className = '',
  sx = {},
  ...props
}) {
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
  return (
    <Box role="group" aria-label={ariaLabel} className={'carousel-dots' + (className ? ' ' + className : '')}
      onKeyDown={onKeyDown}
      sx={{ display: 'inline-flex', alignItems: 'center', ...sx }} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <CarouselDot key={i} ref={(el) => { refs.current[i] = el; }} color={color} disabled={disabled}
          selected={i === value} aria-current={i === value ? 'true' : undefined}
          aria-label={'Slide ' + (i + 1) + ' of ' + count}
          tabIndex={i === value ? 0 : -1}
          onClick={() => onChange?.(i)} />
      ))}
    </Box>
  );
}

export default CarouselDots;
