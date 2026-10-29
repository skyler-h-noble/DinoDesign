// src/components/Rating/Rating.js
import React, { useState } from 'react';
import StarIcon from '@omni-design/icons/Star';
import StarBorderIcon from '@omni-design/icons/StarBorder';
import StarHalfIcon from '@omni-design/icons/StarHalf';
import { Caption } from '../Typography/Typography';
import { FormLabel } from '../FormLabel/FormLabel';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * Rating Component
 *
 * Figma's Rating (6780:12693) — five Star instances (6780:12460), no gap.
 *
 * GLYPHS: Material's star (selected, solid), star_border (unselected,
 *   outline) and star_half — the same names Figma's Icon types. Not the
 *   *_purple500 pair: at 20px those differ only by a tiny inner star, so a
 *   4-of-5 rating read as five identical stars.
 *
 * COLOR: a filled star is an ICON, so it takes --Icons-{C}: `color` is
 *   Figma's Icons mode (default -> --Icons-Default, which is the surface's
 *   Text; primary -> --Icons-Primary, ...). An unselected star is --Quiet and
 *   turns --Text on hover. No strokes, no shadows.
 *
 * SIZES: the in-button icon (16 / 20 / 32) in a box 4px larger, never under
 *   Sizing-3 (24) — medium is Figma's 20 in 24. Focus is a 3px ring 1px
 *   inside the box.
 *
 * MODES:
 *   controlled    value + onChange
 *   uncontrolled  defaultValue, internal state
 *   readOnly      display only, no interaction
 *   no rating     value={null}, shows all empty with "(No rating)" label
 *
 * FIVE STARS, always — as Figma's Rating. `max` was retired: any other
 *   value renders five and warns once in development.
 * FEATURES: precision (1 or 0.5), hover preview
 *
 * LABEL: `label` + labelPosition 'top' (default) | 'bottom' gives Figma's
 *   RatingField (9574:3354) — a FormLabel above or below the stars,
 *   Sizing-Half apart. The group is named by it.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const COLOR_MAP = {
  default: 'Default',
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

// minHit defines a button-style hit target — the star icon itself stays at
// iconSize, but the clickable button expands to fill minHit so small icons
// don't punch a hole in the touch surface. focusInset is negative for
// internal rings (small/medium) and positive for external (large).
const SIZE_MAP = {
  small:  { iconSize: 16, minHit: 24 },
  medium: { iconSize: 20, minHit: 24 },
  large:  { iconSize: 32, minHit: 36 },
};

/* Static sheet — the MUI Box sx blocks of the stars, the group and the
   field, as plain rules. A filled star takes its palette's icon colour by
   one class per colour; an engaged unselected star turns --Text, one class +
   one pseudo-class as emotion's rule weighed. */
const SxBox = lazySxBox('Rating');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
registerStaticStyles('omni-rating', wk([
  '.omni-rt-star{position:relative;display:inline-flex;align-items:center;justify-content:center;border:none;background-color:transparent;padding:0;'
    + 'cursor:default;outline:none;color:var(--Quiet);transition:color 0.1s ease}',
  ...Object.entries(SIZE_MAP).map(([size, s]) => `.omni-rt-star-${size}{min-width:${s.minHit}px;min-height:${s.minHit}px}`),
  '.omni-rt-star-int{cursor:pointer}',
  '.omni-rt-star-off{cursor:not-allowed}',
  ...Object.values(COLOR_MAP).map((C) => `.omni-rt-on-${C}{color:var(--Icons-${C})}`),
  // Engaged, an unselected star's glyph turns Text — Hover and Pressed.
  '.omni-rt-star-live:hover,.omni-rt-star-live:active{color:var(--Text)}',
  // Figma's Focus-Visible: a 3px ring, 1px in from the box's edge.
  '.omni-rt-star-int:focus-visible{outline:3px solid var(--Focus-Visible);outline-offset:-4px}',
  '.omni-rt-star:disabled{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  '.omni-rt-half{position:absolute;top:0;width:50%;height:100%;z-index:1}',
  '.omni-rt-half-l{left:0}',
  '.omni-rt-half-r{right:0}',
  '.omni-rt{display:inline-flex;align-items:center;gap:0;opacity:1;font-family:inherit}',
  '.omni-rt-off{opacity:var(--Disabled, 0.38)}',
  '.omni-rt-field{display:inline-flex;flex-direction:column;align-items:flex-start;gap:var(--Sizing-Half, 4px)}',
].join('\n')));

/* ZONE PROPS — `theme` and `surface`.
 *
 * They become data-theme / data-surface on the root, which redefines
 * --Background, --Text, --Border, --Quiet, --Hover and --Pressed for
 * everything inside, so the component takes its colors from the zone it sits
 * in rather than from a prop.
 *
 * Deliberately NOT derived from `color`. The two are different knobs: `color`
 * chooses which PALETTE a filled part draws from, while `theme` moves the whole
 * surface — including the parts that carry a contrast requirement and therefore
 * have to stay on zone tokens. Folding one into the other would make a palette
 * choice silently restyle the contrast-bearing parts too.
 *
 * Both undefined when not passed, so the component INHERITS its ancestor's
 * zone. An empty string would match [data-theme] selectors and pin it to
 * nothing, which is worse than absent. */
let warnedMax = false;

export function Rating({
  theme,
  surface,
  value: controlledValue,
  defaultValue,
  onChange,
  max: maxProp,
  precision = 1,
  color = 'default',
  size = 'medium',
  readOnly = false,
  disabled = false,
  emptyLabel = 'No rating',
  label,
  labelPosition = 'top',  // 'top' | 'bottom'
  className = '',
  sx = {},
  ...props
}) {
  useStaticStyles('omni-rating');
  const max = 5;
  if (maxProp !== undefined && maxProp !== 5 && process.env.NODE_ENV !== 'production' && !warnedMax) {
    warnedMax = true;
    // eslint-disable-next-line no-console
    console.warn('[Rating] max={' + maxProp + '} was removed — a rating is always five stars, as Figma draws it.');
  }
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const [hoverValue, setHoverValue] = useState(null);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;
  const isHalf = precision === 0.5;
  const isInteractive = !readOnly && !disabled;

  const C = COLOR_MAP[color] || COLOR_MAP.default;
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const sizeKey = SIZE_MAP[size] ? size : 'medium';

  const handleClick = (newValue) => {
    if (!isInteractive) return;
    // Click same value = clear
    const next = newValue === currentValue ? null : newValue;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleHalf = (starIndex, isLeftHalf) => {
    if (!isInteractive || !isHalf) return;
    const val = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    setHoverValue(val);
  };

  // An unselected star is Quiet (Figma's Star), a filled one the icon color.
  const starClass = (isFilled, isHalfFilled) => (isFilled || isHalfFilled ? ' omni-rt-on-' + C
    : (isInteractive ? ' omni-rt-star-live' : ''));

  const renderStar = (index) => {
    const starValue = index + 1;
    const halfValue = index + 0.5;

    const isFilled = displayValue !== null && starValue <= displayValue;
    const isHalfFilled = displayValue !== null && !isFilled && isHalf && halfValue <= displayValue;

    const IconComponent = isHalfFilled ? StarHalfIcon : isFilled ? StarIcon : StarBorderIcon;

    /* Half precision: the SAME focusable radio as a whole star, with two
       invisible halves over it for the pointer. It used to be a plain box —
       no tab stop, no arrow keys, no focus ring — so a half-star rating could
       not be used from the keyboard at all. */
    const halves = isHalf && isInteractive;
    const Tag = isInteractive ? 'button' : 'span';

    return (
      <Tag
        key={index}
        className={'MuiBox-root rating-star omni-rt-star omni-rt-star-' + sizeKey
          + (disabled ? ' omni-rt-star-off' : (isInteractive ? ' omni-rt-star-int' : ''))
          + starClass(isFilled, isHalfFilled)}
        type={isInteractive ? 'button' : undefined}
        role={isInteractive ? 'radio' : undefined}
        aria-checked={isFilled || isHalfFilled}
        aria-label={(starValue) + ' star' + (starValue !== 1 ? 's' : '')}
        tabIndex={isInteractive ? 0 : -1}
        onClick={halves ? undefined : () => handleClick(starValue)}
        onMouseEnter={() => isInteractive && !halves && setHoverValue(starValue)}
        onMouseLeave={() => isInteractive && setHoverValue(null)}
        onKeyDown={(e) => {
          if (!isInteractive) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            handleClick(Math.min((currentValue || 0) + precision, max));
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max((currentValue || 0) - precision, 0);
            handleClick(next || null);
          }
        }}
      >
        {halves && (
          <>
            <div aria-hidden="true" className="MuiBox-root omni-rt-half omni-rt-half-l"
              onMouseEnter={() => handleHalf(index, true)}
              onClick={() => handleClick(halfValue)} />
            <div aria-hidden="true" className="MuiBox-root omni-rt-half omni-rt-half-r"
              onMouseEnter={() => handleHalf(index, false)}
              onClick={() => handleClick(starValue)} />
          </>
        )}
        <IconComponent sx={{ fontSize: s.iconSize }} />
      </Tag>
    );
  };

  const groupProps = {
    role: isInteractive ? 'radiogroup' : 'img',
    'aria-label': (label || 'Rating') + (currentValue !== null ? ': ' + currentValue + ' of ' + max + ' stars' : ': ' + emptyLabel),
    'data-theme': theme || undefined,
    'data-surface': surface || undefined,
    className: 'MuiBox-root rating rating-' + color + ' rating-' + size +
      (readOnly ? ' rating-readonly' : '') +
      (disabled ? ' rating-disabled' : '') +
      (currentValue === null ? ' rating-empty' : '') +
      (className ? ' ' + className : '') +
      ' omni-rt' + (disabled ? ' omni-rt-off' : ''),
    ...props,
  };
  const GroupTag = hasSx(sx) ? SxBox : 'div';
  const group = (
    <GroupTag {...(hasSx(sx) ? { sx } : {})} {...groupProps}>
      {Array.from({ length: max }, (_, i) => renderStar(i))}
      {currentValue === null && !hoverValue && emptyLabel && (
        /* Figma's Value = Empty: Dynamic Caption in Quiet, Sizing-Half after the stars. */
        /* --Quiet, the Surface token Figma binds — not Typography's
           color="quiet", which resolves to --Text-Quiet (a different, darker
           tone in a themed zone). */
        <Caption className="rating-empty-label" style={{ color: 'var(--Quiet)', marginLeft: 'var(--Sizing-Half, 4px)' }}>
          {emptyLabel}
        </Caption>
      )}
    </GroupTag>
  );

  if (!label) return group;
  const labelEl = (
    <FormLabel disabled={disabled} aria-hidden="true"
      sx={disabled ? { opacity: 'var(--Disabled, 0.38)' } : undefined}>
      {label}
    </FormLabel>
  );
  return (
    <div className={'MuiBox-root rating-field rating-label-' + labelPosition + ' omni-rt-field'}>
      {labelPosition !== 'bottom' && labelEl}
      {group}
      {labelPosition === 'bottom' && labelEl}
    </div>
  );
}

export default Rating;
