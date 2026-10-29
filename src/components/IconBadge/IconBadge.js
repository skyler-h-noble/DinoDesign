// src/components/IconBadge/IconBadge.js
import React from 'react';
import { shapeStyle, ICON_SHAPES } from '../Shape/shapes';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazyFallback } from '../_lazyFallback';
const IconBadgeEmotion = lazyFallback('IconBadge', () => import('./IconBadge.mui'));

/**
 * IconBadge Component
 *
 * A themed circle/rounded-square with an icon inside.
 *
 * COLORS:
 *   default, primary, secondary, tertiary, neutral,
 *   info, success, warning, error, white, black
 *
 * VARIANTS:
 *   solid  — data-theme="{Theme}" data-surface="Surface"
 *            bg: var(--Background), icon: var(--Text)
 *   light  — data-theme="{Theme}" data-surface="Surface-Brightest"
 *            (there is no "{Theme}-Light" theme; -light IS the brightest surface)
 *            bg: var(--Background), icon: var(--Text)
 *   dark   — data-theme="{Theme}" data-surface="Surface-Dimmest"
 *            bg: var(--Background), icon: var(--Text)
 *
 * SIZE: small | medium | large — 32 / 40 / 48, a 24px icon and an 8px
 *       radius, as Figma's Component-Size modes draw it.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const THEME_MAP = {
  default: 'Default',
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  /* No white / black. Neither is a Theme mode — they bound nothing and left
     the badge on the page's palette, which for a badge whose entire job is to
     be a color is the one outcome that cannot be right.
     
     Both are already reachable and always were: white is
     color="neutral" variant="light" and black is
     color="neutral" variant="dark" — the same palette at the two ends of the
     surface ladder, which is what black and white ARE here. */
};

/* Three sizes, from Figma's Component-Size modes on the IconBadge component
   (9189:26768): IconBadge/BadgeHeight is 32 / 40 / 48 for small / medium /
   large, IconBadge/BadgeRadius 8 at every size, and a 24px icon.
   
   This was ONE size for a while, removed because Figma then drew exactly one
   40px badge with no size axis. Figma has since bound the badge to
   Component-Size, so the sizes are back — measured, not invented. */
const ICON_BADGE_SIZES = {
  small: { size: 32, iconSize: '24px', borderRadius: '8px' },
  medium: { size: 40, iconSize: '24px', borderRadius: '8px' },
  large: { size: 48, iconSize: '24px', borderRadius: '8px' },
};

const warnedShapes = new Set();

/* ── Static stylesheet (no emotion) ───────────────────────────────────────
   The same rules as IconBadgeEmotion above, as plain CSS. The variant classes
   only set private custom properties; the base rule paints with them, so the
   colours still come from the tokens through the badge's own data-theme /
   data-surface — switching a theme or mode repaints it exactly as before.
   The (0,3,0) selector list matches the emotion rule it replaces: it has to
   beat the theme's own [data-theme][data-surface] background paint. */
const COLOR_RULES = Object.keys(THEME_MAP).map((c) =>
  `.icon-badge-solid.icon-badge-${c}{--_ib-bg:var(--Icons-${cap(c)},var(--Background));--_ib-fg:var(--Icons-On-${cap(c)},var(--Text))}`).join('');
const CSS = `
.icon-badge{display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:8px}
.icon-badge-small{width:32px;height:32px}
.icon-badge-medium{width:40px;height:40px}
.icon-badge-large{width:48px;height:48px}
.icon-badge svg{width:24px;height:24px;font-size:24px;color:inherit;stroke:currentColor}
.icon-badge,.icon-badge[data-surface],.icon-badge[data-theme][data-surface]{background-color:var(--_ib-bg,var(--Background));color:var(--_ib-fg,var(--Text))}
${COLOR_RULES}
.icon-badge-shaped{border-radius:0;position:relative;isolation:isolate}
.icon-badge.icon-badge-shaped[data-theme][data-surface]{background-color:transparent}
.icon-badge-shaped::before{content:"";position:absolute;inset:-2px;z-index:-1;background-color:var(--_ib-bg,var(--Background));-webkit-mask:var(--_ib-mask);mask:var(--_ib-mask)}
.icon-badge-shape-rounded::before{border-radius:var(--Card-Radius,var(--Style-Border-Radius,8px))}
.icon-badge-shape-squircle::before{border-radius:28%}
@supports (corner-shape: squircle){.icon-badge-shape-squircle::before{border-radius:40%;corner-shape:squircle}}
`;
registerStaticStyles('omni-icon-badge', CSS);

export function IconBadge(props) {
  useStaticStyles('omni-icon-badge');
  const { children, color = 'primary', variant = 'solid', shape, size = 'medium', className = '', sx, style, ...rest } = props;
  // sx is emotion's prop: a caller that passes one keeps the emotion version.
  if (sx && Object.keys(sx).length) return <IconBadgeEmotion {...props} />;
  if (shape && !ICON_SHAPES.includes(shape) && process.env.NODE_ENV !== 'production' && !warnedShapes.has(shape)) {
    warnedShapes.add(shape);
    console.warn('[IconBadge] shape="' + shape + '" clips the icon at this size. Icon-safe shapes: ' + ICON_SHAPES.join(', ') + '.');
  }
  const theme = THEME_MAP[color] || THEME_MAP.primary;
  const dataSurface = variant === 'light' ? 'Surface-Brightest' : variant === 'dark' ? 'Surface-Dimmest' : 'Surface';
  // A path shape is a mask; its URL is the one per-instance value, passed as a
  // custom property so the sheet stays static. Radius shapes are classes.
  const shapeCss = shape ? shapeStyle(shape) : {};
  const shapeClass = shape ? ' icon-badge-shaped icon-badge-shape-' + shape : '';
  const shapeVars = shapeCss.mask ? { '--_ib-mask': shapeCss.mask } : null;
  return (
    <div
      data-theme={theme}
      data-surface={dataSurface}
      className={'icon-badge icon-badge-' + size + ' icon-badge-' + variant + ' icon-badge-' + color + shapeClass + (className ? ' ' + className : ' ')}
      style={shapeVars ? { ...shapeVars, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
}

export default IconBadge;
