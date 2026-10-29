// src/components/Divider/Divider.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('Divider');

/**
 * Divider Component
 * Visual separator with optional text indicator
 *
 * COLOR — Figma's Color axis, Default | Colored:
 *   Default   var(--Border-Variant). Decorative: no contrast requirement.
 *   Colored   var(--Buttons-{C}-Border), the palette picked by the Buttons
 *             mode (Button-Theme) — in code, `color`. There is no palette
 *             axis in Figma; the mode is the palette.
 *
 *   <Divider />                          Default
 *   <Divider colored />                  Colored, Buttons default palette
 *   <Divider colored color="primary" />  Colored, primary
 *   <Divider color="primary" />          the same — a palette name implies
 *                                        colored, as it always has
 *
 * `color="border"` (the 3:1 clickable-edge token) has no Figma side and was
 * the wrong token for a decorative rule: it renders Default and warns once.
 * Colored used to read --Icons-{C}; Figma binds Buttons › Border.
 *
 * ORIENTATION: horizontal | vertical
 *
 * SIZES (Component-Size `Divider`):
 *   small   0.5px   hairline — a true half-pixel on 2x, rounded by the
 *                   browser on 1x, which is the usual hairline trade
 *   medium  1px
 *   large   2px
 *
 * This was 1 / 2 / 4, one step heavy at every size — and that ramp is the one
 * the design assigns to the STEP BAR (the stepper's connector), not to a
 * divider. The two had effectively been swapped.
 *
 * PILL (Figma's Pill boolean + the Divider-Pill set) — optional text on the
 * line. One style: --Background fill, an edge in the LINE's color
 * (Border-Variant, or Buttons › Border when colored), --Text in Mobile Nav
 * Label Semibold, Sizing-1 either side, Sizing-2 corners. The line runs right
 * up to the pill on both sides, as Figma's line runs behind it.
 *
 *   textAlign (Figma Alignment): start | center | end — also left / right
 *   (horizontal) and top / bottom (vertical). Start and end put the pill
 *   flush at that end of the rule.
 *
 *   indicatorStyle="light" (a Tag-tinted pill) has no Figma side: it renders
 *   the one style and warns once.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const NOT_A_PALETTE = ['default', 'border', 'border-variant'];
let warnedBorder = false;

/* Colored when asked, or when given a palette name (the old API). */
function isColored(color, colored) {
  if (colored !== undefined) return !!colored;
  return !!color && !NOT_A_PALETTE.includes(color);
}

function getLineColor(color, colored) {
  if (!isColored(color, colored)) return 'var(--Border-Variant)';
  const C = !color || NOT_A_PALETTE.includes(color) ? 'Default' : cap(color);
  return 'var(--Buttons-' + C + '-Border)';
}

let warnedLight = false;
function warnIfLight(indicatorStyle) {
  if (indicatorStyle === 'light' && process.env.NODE_ENV !== 'production' && !warnedLight) {
    warnedLight = true;
    console.warn('[Divider] indicatorStyle="light" was removed: the pill has one style (Figma Divider-Pill).');
  }
}

/* The static sheet. The per-instance values — the line color and thickness —
   arrive as custom properties on the root (--_dv-c, --_dv-t), so one set of
   rules serves every color, size and orientation, and the line segments and
   the pill border inherit them. */
registerStaticStyles('omni-divider', [
  '.omni-divider-h{width:100%;height:var(--_dv-t);background-color:var(--_dv-c);flex-shrink:0}',
  '.omni-divider-v{display:inline-block;width:var(--_dv-t);align-self:stretch;min-height:24px;background-color:var(--_dv-c);flex-shrink:0}',
  '.omni-divider-hi{display:flex;align-items:center;width:100%}',
  '.omni-divider-vi{display:inline-flex;flex-direction:column;align-items:center;align-self:stretch;min-height:24px;flex-shrink:0}',
  '.omni-divider-hi>.omni-divider-seg{height:var(--_dv-t);background-color:var(--_dv-c)}',
  '.omni-divider-vi>.omni-divider-seg{width:var(--_dv-t);background-color:var(--_dv-c)}',
  /* Figma's Divider-Pill: Mobile Nav Label Semibold, Sizing-1 sides, Sizing-2 corners. */
  '.omni-divider-pill{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;'
    + 'padding:0 var(--Sizing-1, 8px);border-radius:var(--Sizing-2, 16px);'
    + 'font-family:var(--Body-Font-Family, inherit);font-size:var(--Mobile-Nav-Label-Font-Size, 11px);'
    + 'line-height:var(--Mobile-Nav-Label-Line-Height, 16.5px);letter-spacing:var(--Mobile-Nav-Label-Letter-Spacing, 0);'
    + 'font-weight:var(--Body-Semibold-Font-Weight, 600);white-space:nowrap;'
    + 'background-color:var(--Background);color:var(--Text);border:1px solid var(--_dv-c);box-sizing:border-box}',
].join('\n'));

const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Start / end: flush, no line before (after) the pill. */
const alignOf = (a) => (a === 'left' || a === 'top' || a === 'start' ? 'start' : a === 'right' || a === 'bottom' || a === 'end' ? 'end' : 'center');
const flexes = (a) => {
  const k = alignOf(a);
  return [k === 'start' ? '0 0 0' : '1 1 auto', k === 'end' ? '0 0 0' : '1 1 auto'];
};


/* One per Component-Size mode, read from the token with the DESIGN's number
 * as the fallback — the same idiom Rail uses for Rail-Width. An unbound token
 * then renders the intended weight rather than an invented one, so a missing
 * variable looks like the design instead of a bug.
 *
 * The source is Component-Size / Other / `Divider` (0.5 / 1 / 2 across small /
 * medium / large), which componentSizePayload now writes. In CSS a mode is the
 * Sm-/Lg- prefix, matching Button, Tabs and Rail.
 *
 * NOTE: nothing emits --Divider to CSS yet — the payload reaches Figma, not
 * the stylesheet — so today the fallback is what paints. That is deliberate
 * rather than pending: it makes the value overridable by a consumer and names
 * where it comes from, and the number stops being a bare literal with no
 * stated source. */
const SIZE_MAP = {
  small:  'var(--Sm-Divider, 0.5px)',
  medium: 'var(--Divider, 1px)',
  large:  'var(--Lg-Divider, 2px)',
};

export function Divider({
  color = 'default',
  /* Figma's Color = Colored. Unset, a palette name in `color` implies it. */
  colored,
  orientation = 'horizontal',
  size = 'small',
  children,
  indicatorText,
  indicatorStyle = 'outline',
  textAlign = 'center',
  className = '',
  sx,
  style,
  ...props
}) {
  useStaticStyles('omni-divider');
  if (color === 'border' && process.env.NODE_ENV !== 'production' && !warnedBorder) {
    warnedBorder = true;
    console.warn('[Divider] color="border" was removed: a divider is decorative, so it draws Border-Variant '
      + '(Figma Color = Default). For a colored rule use colored + color="<palette>".');
  }
  const thickness = SIZE_MAP[size] || SIZE_MAP.small;
  const hasIndicator = !!(children || indicatorText);
  const displayText = children || indicatorText;
  const isVertical = orientation === 'vertical';
  if (hasIndicator) warnIfLight(indicatorStyle);

  const root = {
    role: 'separator',
    'aria-orientation': isVertical ? 'vertical' : 'horizontal',
    className:
      (isVertical ? 'divider-vertical' : 'divider-horizontal') + ' divider-' + color +
      (isColored(color, colored) ? ' divider-colored' : '') +
      (hasIndicator ? ' divider-indicator' : '') +
      ' omni-divider-' + (isVertical ? 'v' : 'h') + (hasIndicator ? 'i' : '') +
      ' ' + className,
    style: { '--_dv-c': getLineColor(color, colored), '--_dv-t': thickness, ...style },
    ...props,
  };

  let content = null;
  if (hasIndicator) {
    const [before, after] = flexes(textAlign);
    content = (
      <>
        <div className="omni-divider-seg" style={{ flex: before }} />
        <div className="divider-pill omni-divider-pill">{displayText}</div>
        <div className="omni-divider-seg" style={{ flex: after }} />
      </>
    );
  }

  if (hasSx(sx)) return <SxBox sx={sx} {...root}>{content}</SxBox>;
  return <div {...root}>{content}</div>;
}

export const DefaultDivider   = (p) => <Divider color="default"   {...p} />;
export const PrimaryDivider   = (p) => <Divider color="primary"   {...p} />;
export const SecondaryDivider = (p) => <Divider color="secondary" {...p} />;
export const TertiaryDivider  = (p) => <Divider color="tertiary"  {...p} />;
export const NeutralDivider   = (p) => <Divider color="neutral"   {...p} />;
export const InfoDivider      = (p) => <Divider color="info"      {...p} />;
export const SuccessDivider   = (p) => <Divider color="success"   {...p} />;
export const WarningDivider   = (p) => <Divider color="warning"   {...p} />;
export const ErrorDivider     = (p) => <Divider color="error"     {...p} />;

export default Divider;