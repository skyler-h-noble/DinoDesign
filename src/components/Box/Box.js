// src/components/Box/Box.js
import React from 'react';
import { SHADOWS } from '../_shadows';
import { RATIO_MAP } from '../Ratio/Ratio';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazyFallback } from '../_lazyFallback';
const BoxMui = lazyFallback('Box', () => import('./Box.mui'));

/**
 * Box Component — bare layout primitive.
 *
 * A theme-aware container with no visual styling of its own. Use it when you
 * need a slot that participates in the design-system cascade (data-theme /
 * data-surface) without inheriting any of the chrome that Ratio or Card
 * would bring. No padding and no data-theme of its own — it inherits theme
 * from its parent unless you pass `theme`. No border-radius either, unless you
 * opt in with `radius` (see below); bare stays the default.
 *
 * Props:
 *   radius     — 'none' (default) | 'small' | 'medium' | 'large'. Reads the
 *                brand's card radii, so a Box that opts in rounds exactly like
 *                a Card of that size. Default stays 'none' — Box is the
 *                primitive you reach for when you do NOT want Card's chrome,
 *                and silently rounding every existing Box would change every
 *                layout slot already built on it.
 *                A boolean would be the wrong control here: radius is not
 *                on/off, and the system publishes three sizes.
 *   theme      — optional data-theme override for everything inside
 *   surface    — optional data-surface override (Surface | Container | Container-Low | etc.)
 *   elevation  — 0–5. When > 0, the Box renders an OUTER wrapper that carries
 *                the layered shadow but sets NO surface, so the shadow color
 *                resolves from the PARENT surface (the surface the box sits on,
 *                physically where the shadow falls) rather than the box's own.
 *                The inner element paints `surface` and fills the wrapper.
 *   ratio      — Figma's Fit = Ratio: holds the box to a proportion with CSS
 *                aspect-ratio. A Ratio name ('16:9', '4:3', 'Golden-Horizontal'
 *                …) or a number (width / height). Unset is Fit = No Ratio.
 *                The bare primitive with a proportion — <Ratio> is the same
 *                proportion with Ratio's shell.
 *   component  — root element tag (default: 'div')
 *   children, className, sx, ...props — forwarded
 *
 * The radius map. --Card-Radius and its Sm/Lg siblings are what the design
 * system publishes for container corners; Box reuses them rather than
 * inventing a parallel scale that would drift from Card's.
 *
 * For a themed shell with border + shadow + padding, use <Ratio> (sized) or
 * <Card> (with header/actions). Box is intentionally bare so that nested
 * tokens resolve correctly without competing styling.
 */

const RADIUS = {
  none: undefined,
  small: 'var(--Sm-Card-Radius, var(--Card-Radius))',
  medium: 'var(--Card-Radius)',
  large: 'var(--Lg-Card-Radius, var(--Card-Radius))',
};

/* ── Static path (no emotion) ─────────────────────────────────────────────
   The same two shapes as above as plain CSS: a box painted with its
   surface's --Background, and the elevated form — an outer shell carrying
   the level's shadow around an inner surface. The five shadows are rules
   generated from the same SHADOWS table; radius and aspect ratio are inline.
   A caller that passes sx keeps the MUI version. */
registerStaticStyles('omni-box', [
  '.omni-box{background:var(--Background);box-sizing:border-box}',
  '.omni-box-elevation{box-sizing:border-box}',
  '.omni-box-ratio{aspect-ratio:var(--omni-ratio)}',
  '.omni-box-elevation>.omni-box{width:100%;height:100%;border-radius:inherit}',
  ...[1, 2, 3, 4, 5].map((l) => `.omni-box-elevation[data-elevation="${l}"]{box-shadow:${SHADOWS[l]}}`),
].join('\n'));

export function Box(props) {
  useStaticStyles('omni-box');
  const { children, theme, surface, radius = 'none', elevation = 0, ratio, component: Tag = 'div', className = '', sx, style, ...rest } = props;
  if (sx && Object.keys(sx).length) return <BoxMui {...props} />;
  const level = Math.max(0, Math.min(5, elevation | 0));
  const radiusValue = RADIUS[radius];
  const aspect = typeof ratio === 'number' ? String(ratio) : (ratio ? RATIO_MAP[ratio] : undefined);
  const own = {};
  // As a custom property: aspect-ratio itself is dropped by some style
  // engines (jsdom) when set inline; the sheet applies it.
  if (aspect) own['--omni-ratio'] = aspect;
  const ratioClass = aspect ? ' omni-box-ratio' : '';
  if (radiusValue) own.borderRadius = radiusValue;

  if (!level) {
    return (
      <Tag data-theme={theme || undefined} data-surface={surface || undefined}
           className={'omni-box' + ratioClass + (className ? ' ' + className : '')} style={style ? { ...own, ...style } : own} {...rest}>
        {children}
      </Tag>
    );
  }
  const s = style || {};
  const { width, height, minWidth, minHeight, maxWidth, maxHeight, borderRadius, margin, marginTop, marginRight, marginBottom, marginLeft, ...innerStyle } = s;
  const outer = { ...own };
  for (const [k, v] of Object.entries({ width, height, minWidth, minHeight, maxWidth, maxHeight, borderRadius, margin, marginTop, marginRight, marginBottom, marginLeft })) {
    if (v !== undefined) outer[k] = v;
  }
  return (
    <Tag className={'omni-box-elevation' + ratioClass + (className ? ' ' + className : '')} data-elevation={level} style={outer} {...rest}>
      <div data-theme={theme || undefined} data-surface={surface || undefined} className="omni-box" style={innerStyle}>
        {children}
      </div>
    </Tag>
  );
}

export default Box;
