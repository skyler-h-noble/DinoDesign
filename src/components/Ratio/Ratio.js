// src/components/Ratio/Ratio.js
import React from 'react';
import { shapeStyle } from '../Shape/shapes';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('Ratio');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
/* MUI's sizing rule for a number, as sx applied it to maxWidth / maxHeight:
   a fraction (0 < n <= 1) is a percentage, anything else is px. */
const muiSize = (n) => (typeof n === 'number' ? (n > 0 && n <= 1 ? n * 100 + '%' : n + 'px') : n);
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */

/**
 * Ratio Component
 *
 * Aspect-ratio container with a two-layer themed shell that matches Box.
 * Wraps any content (image, video, embed, layout box) in a frame that
 * preserves the named proportion at any width.
 *
 * RATIOS (Figma-aligned): 1:1, 3:4, 4:3, 16:9, 9:16, 2:3, 3:2, 1:2, 2:1,
 * 9:21, 21:9, 5:7, 7:5, 4:5, 5:4, 5:3, 3:5, 16:10, 10:16, Golden-Horizontal,
 * Golden-Vertical.
 *
 * Golden = phi (1.618033988…). Horizontal is wider-than-tall, Vertical is
 * the inverse. Stored at 6 decimal places for sub-pixel accuracy.
 *
 * ONE STYLE — the bare media slot Figma draws (square, no edge, no shadow,
 *   Surface-Dim). solid / light / dark were RETIRED: Figma has no styled
 *   frame for Ratio, and a framed media block is a Card or a Box with its
 *   opt-in radius / elevation. They still render (as the one style) and warn
 *   once in development.
 * COLORS:   default | primary | secondary | tertiary | neutral |
 *           info | success | warning | error
 * PADDING:  none | xs | sm | md | lg | xl
 * NO STATES. Ratio is a slot, not a control: clickable / onClick / elevated
 *   were retired (they warn once). A clickable media block is a Card, or a
 *   Ratio inside a Button / link — the control carries the states.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
let warnedVariant = false;
let warnedClickable = false;

export const RATIO_NAMES = [
  '1:1',
  '3:4', '4:3',
  '16:9', '9:16',
  '2:3', '3:2',
  '1:2', '2:1',
  '9:21', '21:9',
  '5:7', '7:5',
  '4:5', '5:4',
  '5:3', '3:5',
  '16:10', '10:16',
  'Golden-Horizontal',
  'Golden-Vertical',
];

const PHI = '1.618034'; // golden ratio
/* Exported for Box's `ratio` (Figma's Box Fit = Ratio), so the two read one
   table of proportions. */
export const RATIO_MAP = {
  '1:1':   '1 / 1',
  '3:4':   '3 / 4',   '4:3':   '4 / 3',
  '16:9':  '16 / 9',  '9:16':  '9 / 16',
  '2:3':   '2 / 3',   '3:2':   '3 / 2',
  '1:2':   '1 / 2',   '2:1':   '2 / 1',
  '9:21':  '9 / 21',  '21:9':  '21 / 9',
  '5:7':   '5 / 7',   '7:5':   '7 / 5',
  '4:5':   '4 / 5',   '5:4':   '5 / 4',
  '5:3':   '5 / 3',   '3:5':   '3 / 5',
  '16:10': '16 / 10', '10:16': '10 / 16',
  'Golden-Horizontal': PHI + ' / 1',
  'Golden-Vertical':   '1 / ' + PHI,
};

const PADDING_MAP = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

/* The static sheet. Per instance: the aspect ratio, and maxWidth /
   maxHeight when given — custom properties on the shell, so a caller's sx can
   still override them. Fit, padding and shape are classes. (aspect-ratio as a
   custom property for the same reason Box does it: some style engines drop
   it when set inline.) */
registerStaticStyles('omni-ratio', [
  /* CSS aspect-ratio holds the proportion regardless of container width.
     fit drives which dimension fills the parent; the other derives from the
     aspect ratio. flex:0 0 auto keeps a flex parent (a list row, an HStack)
     from growing or shrinking the slot, so the aspect-ratio holds and the
     derived axis isn't distorted. For fit="height" the PARENT must have a
     definite height for height:100% to resolve. The min on the filled axis is
     a floor so the box never collapses to nothing inside a hugging parent.
     The default is a bare, SQUARE media slot: no edge, no radius, no shadow. */
  '.omni-ratio{aspect-ratio:var(--_ra-ar);flex:0 0 auto;width:100%;height:auto;min-width:24px;'
    + 'border:none;border-radius:0;box-shadow:none;overflow:hidden}',
  '.omni-ratio-fh{height:100%;width:auto;min-width:auto;min-height:24px}',
  '.omni-ratio-mw{max-width:var(--_ra-mw)}',
  '.omni-ratio-mh{max-height:var(--_ra-mh)}',
  '.omni-ratio-mask{-webkit-mask:var(--_ra-mask);mask:var(--_ra-mask)}',
  '.omni-ratio-rounded{border-radius:var(--Card-Radius, var(--Style-Border-Radius, 8px))}',
  '.omni-ratio-squircle{border-radius:28%}',
  '@supports (corner-shape: squircle){.omni-ratio-squircle{border-radius:40%;corner-shape:squircle}}',
  /* Inner content — scoped theme + surface so children resolve to the right
     tokens, and any flex/fill child can occupy the ratio'd box. The
     placeholder paints itself (ImagePlaceholder); else the surface. */
  '.omni-ratio-in{width:100%;height:100%;background-color:var(--Background);color:var(--Text);font-family:inherit;border-radius:0}',
  '.omni-ratio-in-ph{background-color:transparent}',
  '.omni-ratio-in.omni-ratio-in>*{width:100%;height:100%}',
  ...Object.entries(PADDING_MAP).map(([k, v]) => `.omni-ratio-p-${k}{padding:${v * 8}px}`),
].join('\n'));

export function Ratio({
  ratio = '1:1',
  children,
  variant = 'default',
  color = 'default',
  padding = 'none',
  // fit="width" (default): fills the parent's width, height derives from the
  // ratio. fit="height": fills the parent's height, width derives from the
  // ratio — for fixed-height rows / horizontal layouts.
  fit = 'width',
  // placeholder: show the Image Placeholder (the photo glyph) while the slot is
  // empty. OFF by default — Figma's Ratio is an empty slot painted Surface-Dim,
  // and a photo icon on every empty Ratio claimed it held an image when it
  // might hold a map, a video or a chart. Pass `placeholder` for an image slot
  // with no image yet. A supplied child always wins.
  placeholder = false,
  elevated = false,
  clickable = false,
  onClick,
  maxWidth,
  maxHeight,
  component: Tag = 'div',
  /* Cut the slot to one of the system's shapes (see Shape) — an arch, a
     cookie, a blob around a photo. Round shapes want ratio="1:1"; on a wide
     slot they stretch with it. */
  shape,
  className = '',
  sx,
  style,
  ...props
}) {
  useStaticStyles('omni-ratio');
  if (variant !== 'default' && process.env.NODE_ENV !== 'production' && !warnedVariant) {
    warnedVariant = true;
    // eslint-disable-next-line no-console
    console.warn('[Ratio] variant="' + variant + '" was removed — Ratio has one style, the bare media slot. '
      + 'For a framed block use Card, or Box with radius / elevation.');
  }
  if ((clickable || onClick || elevated) && process.env.NODE_ENV !== 'production' && !warnedClickable) {
    warnedClickable = true;
    // eslint-disable-next-line no-console
    console.warn('[Ratio] clickable / onClick / elevated were removed — Ratio is a slot with no states. '
      + 'Wrap it in a Card (clickable) or a Button / Link so the control carries hover, pressed and focus.');
  }
  const aspect = RATIO_MAP[ratio] || RATIO_MAP['1:1'];
  const C = cap(color === 'default' ? 'Default' : color);

  // Show the Image Placeholder when this slot is meant for an image
  // (placeholder) but no child (no assigned/valid image) was provided.
  const showPlaceholder = placeholder && React.Children.count(children) === 0;

  // data-theme/data-surface for the inner content — mirrors Box.
  // A light variant is the base theme at its BRIGHTEST surface, not a theme of
  // its own. Generated design systems stopped emitting *-Light themes, so
  // `C + '-Light'` matched no rule and --Background resolved to nothing.
  //
  // UNSET MEANS INHERIT. Both axes previously emitted a concrete value on every
  // Ratio — data-theme="Default" + data-surface="Surface" — which is not a
  // no-op: `Default` is a real theme in every generated system, so a Ratio
  // dropped inside a Primary card SWITCHED OUT of it. The Image Placeholder
  // then filled with Default/Surface's `--Border` and drew its icon in that
  // scope's `--Background`; on a light brand both land near-white, so the
  // placeholder rendered as a blank white square with an invisible glyph while
  // the same component in Figma showed dark-on-light. Emit an attribute only
  // when the caller actually asked for one, and let the cascade do the rest.
  const dataTheme = color === 'default' ? undefined : C;
  /* Default: Surface-Dim, as Figma pins on the Ratio — a level, not a theme,
     so a Ratio inside a Primary card is Primary's Surface-Dim. */
  const dataSurface = 'Surface-Dim';

  const padKey = PADDING_MAP[padding] !== undefined ? padding : 'none';
  const shapeCss = shape ? shapeStyle(shape) : {};
  const vars = { '--_ra-ar': aspect };
  if (maxWidth !== undefined) vars['--_ra-mw'] = muiSize(maxWidth);
  if (maxHeight !== undefined) vars['--_ra-mh'] = muiSize(maxHeight);
  if (shapeCss.mask) vars['--_ra-mask'] = shapeCss.mask;

  const root = {
    className: 'ratio ratio-' + ratio.toLowerCase() + ' ratio-default' + (className ? ' ' + className : '')
      + ' MuiBox-root omni-ratio' + (fit === 'height' ? ' omni-ratio-fh' : '')
      + (maxWidth !== undefined ? ' omni-ratio-mw' : '') + (maxHeight !== undefined ? ' omni-ratio-mh' : '')
      + (shapeCss.mask ? ' omni-ratio-mask' : '')
      + (shape === 'rounded' || shape === 'squircle' ? ' omni-ratio-' + shape : ''),
    style: { ...vars, ...style },
    ...props,
  };
  const inner = (
    <div
      data-theme={dataTheme || undefined}
      data-surface={dataSurface}
      className={'MuiBox-root omni-ratio-in omni-ratio-p-' + padKey + (showPlaceholder ? ' omni-ratio-in-ph' : '')}
    >
      {/* Figma's Image Placeholder: a Border-Variant tint with the photo
          glyph in --Quiet, as large as the slot. It was a solid --Border
          block with a 36px --Background icon — the design inverted. */}
      {showPlaceholder ? <ImagePlaceholder /> : children}
    </div>
  );
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...root}>{inner}</SxBox>;
  return <Tag {...root}>{inner}</Tag>;
}

export default Ratio;
