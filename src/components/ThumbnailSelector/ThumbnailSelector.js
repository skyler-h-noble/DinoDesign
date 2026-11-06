// src/components/ThumbnailSelector/ThumbnailSelector.js
import React, { useRef, useState } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';

/**
 * ThumbnailSelector — pick one image from a row (or column) of thumbnails,
 * e.g. a product gallery's views.
 *
 * Why a component: hand-built thumbnails were raw <button>s with
 * `border: 2px solid currentColor`. On a dark page currentColor resolved to
 * the browser's default black, and the selected border measured 1.22–1.27:1
 * against the surface — invisible. Every edge here is a surface token.
 *
 * SEMANTICS — the APG radio group:
 *   root   role="radiogroup", named by aria-label / aria-labelledby
 *   item   <button role="radio" aria-checked> named by item.label || item.alt
 *          (the <img> inside is alt="" — the radio carries the name, the
 *          picture none, as an icon button's icon; naming both announces
 *          the image twice)
 *   keys   one tab stop (the selected item); ←/↑ and →/↓ move AND select,
 *          wrapping; Home / End jump to the first / last; disabled items are
 *          skipped and cannot be chosen.
 *
 * VISUALS — every color is a surface token, so it is checked on whatever
 * data-theme / data-surface it sits on, light and dark:
 *   rest       1px --Border edge, drawn INSIDE over the image (3:1 vs surface)
 *   hover      the edge goes to 2px, and a --Hover veil at 30% over the image
 *   pressed    2px edge, --Pressed veil at 45%
 *   selected   2px --Border ring with a 2px --Background gap inside it, so
 *              the image is visibly framed: thicker AND inset, never color
 *              alone. --Border is the ring because it is the one surface
 *              token promised 3:1 against --Background everywhere — the
 *              button borders are not (they sit against their own fill, and
 *              fall to ~1.1:1 on some dark surfaces). Same choice as List's
 *              selected row.
 *   focus      the house ring: 2px --Focus-Visible, 1px OUTSIDE the edge —
 *              a different place from the selected ring, not only a
 *              different color
 *   disabled   --Disabled opacity, not focusable
 *
 * Every ring is an inset box-shadow on an overlay, so selecting an item moves
 * nothing.
 *
 * SIZE — small / medium / large = Sizing-7 / 9 / 12 (56 / 72 / 96px), with
 * Sizing-1 (8px) between them.
 * RADIUS — the Card family: Sm-Card-Radius / Card-Radius / Lg-Card-Radius,
 * because a thumbnail is a small image card and should round like the brand's
 * cards. Capped at 25% of the side so a very round brand still shows a
 * picture, not a circle.
 */
const SIZES = {
  small: { side: 'var(--Sizing-7, 56px)', radius: 'min(var(--Sm-Card-Radius, 14px), 25%)' },
  medium: { side: 'var(--Sizing-9, 72px)', radius: 'min(var(--Card-Radius, 18px), 25%)' },
  large: { side: 'var(--Sizing-12, 96px)', radius: 'min(var(--Lg-Card-Radius, 23px), 25%)' },
};

const sizeRules = Object.entries(SIZES).map(([k, v]) => `.omni-thumb-${k}{--_th-side:${v.side};--_th-r:${v.radius}}`);

registerStaticStyles('omni-thumbnail-selector', [
  '.omni-thumbs{display:flex;flex-direction:row;flex-wrap:wrap;gap:var(--Sizing-1, 8px);margin:0;padding:0}',
  '.omni-thumbs-v{flex-direction:column;flex-wrap:nowrap}',
  '.omni-thumb{position:relative;display:block;flex-shrink:0;box-sizing:border-box;width:var(--_th-side);height:var(--_th-side);'
    + 'margin:0;padding:0;border:none;background:none;color:inherit;font:inherit;appearance:none;-webkit-appearance:none;'
    + 'border-radius:var(--_th-r);overflow:hidden;cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent}',
  ...sizeRules,
  '.omni-thumb-img{display:block;width:100%;height:100%;object-fit:cover;border-radius:inherit;pointer-events:none;user-select:none;-webkit-user-drag:none}',
  /* The veil (hover / pressed) under the edge. */
  '.omni-thumb::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;'
    + 'background-color:var(--Hover);opacity:0;transition:opacity 0.15s ease}',
  /* The edge — and, selected, the ring and its gap. */
  '.omni-thumb::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;'
    + 'box-shadow:inset 0 0 0 1px var(--Border);transition:box-shadow 0.15s ease}',
  '.omni-thumb-sel::after{box-shadow:inset 0 0 0 2px var(--Border),inset 0 0 0 4px var(--Background)}',
  '.omni-thumb-on:hover::before{opacity:0.3}',
  '.omni-thumb-on:active::before{background-color:var(--Pressed);opacity:0.45}',
  '.omni-thumb-on:where(:not(.omni-thumb-sel)):hover::after,.omni-thumb-on:where(:not(.omni-thumb-sel)):active::after'
    + '{box-shadow:inset 0 0 0 2px var(--Border)}',
  /* No radius on the ring: the outline follows the box's own corners. */
  '.omni-thumb:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-thumb-off,.omni-thumb:disabled{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
].join('\n'));

let warnedName = false;
let warnedGroup = false;

const nameOf = (item, i, n) => item.label || item.alt || 'Image ' + (i + 1) + ' of ' + n;

export const ThumbnailSelector = React.forwardRef(function ThumbnailSelector({
  items = [],
  value,
  defaultValue = 0,
  onChange,
  size = 'medium',
  orientation = 'horizontal',
  disabled = false,
  className = '',
  onKeyDown,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...rest
}, ref) {
  useStaticStyles('omni-thumbnail-selector');
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const selected = controlled ? value : inner;
  const refs = useRef([]);
  const n = items.length;
  const sz = SIZES[size] ? size : 'medium';

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedName && items.some((it) => !(it && (it.label || it.alt)))) {
      warnedName = true;
      // eslint-disable-next-line no-console
      console.warn('[ThumbnailSelector] Every item needs `alt` (or `label`) — it is the thumbnail\'s accessible name. '
        + 'Without one it is announced as "Image N of M", which does not say what the picture shows.');
    }
    if (!warnedGroup && !ariaLabel && !ariaLabelledby) {
      warnedGroup = true;
      // eslint-disable-next-line no-console
      console.warn('[ThumbnailSelector] Name the group: aria-label="Product images" (or aria-labelledby).');
    }
  }

  const isOff = (i) => disabled || Boolean(items[i] && items[i].disabled);

  const choose = (i) => {
    if (i === selected || isOff(i)) return;
    if (!controlled) setInner(i);
    if (onChange) onChange(i, items[i]);
  };

  /* The next enabled index from `from`, stepping `dir`, wrapping. */
  const step = (from, dir) => {
    for (let k = 1; k <= n; k++) {
      const i = (((from + dir * k) % n) + n) % n;
      if (!isOff(i)) return i;
    }
    return -1;
  };

  const handleKeyDown = (e) => {
    if (onKeyDown) onKeyDown(e);
    if (e.defaultPrevented || !n) return;
    const current = refs.current.indexOf(e.target);
    const from = current >= 0 ? current : selected;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = step(from, 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = step(from, -1);
    else if (e.key === 'Home') next = step(-1, 1);
    else if (e.key === 'End') next = step(n, -1);
    else return;
    e.preventDefault();
    if (next < 0) return;
    choose(next);
    if (refs.current[next]) refs.current[next].focus();
  };

  /* The one tab stop: the selected item, or the first enabled one. */
  const tabStop = !isOff(selected) && selected >= 0 && selected < n ? selected : step(-1, 1);

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      aria-disabled={disabled || undefined}
      className={'omni-thumbs' + (orientation === 'vertical' ? ' omni-thumbs-v' : '') + (className ? ' ' + className : '')}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {items.map((item, i) => {
        const on = i === selected;
        const off = isOff(i);
        return (
          <button
            key={item.id != null ? item.id : i}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={nameOf(item, i, n)}
            disabled={off}
            tabIndex={i === tabStop ? 0 : -1}
            className={'omni-thumb omni-thumb-' + sz + (on ? ' omni-thumb-sel' : '') + (off ? ' omni-thumb-off' : ' omni-thumb-on')}
            onClick={() => choose(i)}
          >
            <img className="omni-thumb-img" src={item.src} alt="" draggable={false} loading="lazy" decoding="async" />
          </button>
        );
      })}
    </div>
  );
});

export default ThumbnailSelector;
