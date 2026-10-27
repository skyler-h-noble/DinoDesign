// src/components/Divider/Divider.js
import React from 'react';
import { Box } from '@mui/material';

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
function getIndicatorStyles(color, indicatorStyle, colored) {
  if (indicatorStyle === 'light' && process.env.NODE_ENV !== 'production' && !warnedLight) {
    warnedLight = true;
    // eslint-disable-next-line no-console
    console.warn('[Divider] indicatorStyle="light" was removed: the pill has one style (Figma Divider-Pill).');
  }
  return { bg: 'var(--Background)', text: 'var(--Text)', border: '1px solid ' + getLineColor(color, colored) };
}

/* Figma's Divider-Pill: Mobile Nav Label Semibold, Sizing-1 sides, Sizing-2 corners. */
const pillSx = (ind) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, px: 'var(--Sizing-1, 8px)', py: 0,
  borderRadius: 'var(--Sizing-2, 16px)',
  fontFamily: 'var(--Body-Font-Family, inherit)',
  fontSize: 'var(--Mobile-Nav-Label-Font-Size, 11px)',
  lineHeight: 'var(--Mobile-Nav-Label-Line-Height, 16.5px)',
  letterSpacing: 'var(--Mobile-Nav-Label-Letter-Spacing, 0)',
  fontWeight: 'var(--Body-Semibold-Font-Weight, 600)',
  whiteSpace: 'nowrap',
  backgroundColor: ind.bg, color: ind.text, border: ind.border,
  boxSizing: 'border-box',
});

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
  sx = {},
  ...props
}) {
  if (color === 'border' && process.env.NODE_ENV !== 'production' && !warnedBorder) {
    warnedBorder = true;
    // eslint-disable-next-line no-console
    console.warn('[Divider] color="border" was removed: a divider is decorative, so it draws Border-Variant '
      + '(Figma Color = Default). For a colored rule use colored + color="<palette>".');
  }
  const lineColor = getLineColor(color, colored);
  const thickness = SIZE_MAP[size] || SIZE_MAP.small;
  const hasIndicator = !!(children || indicatorText);
  const displayText = children || indicatorText;
  const isVertical = orientation === 'vertical';

  // --- Vertical without indicator ---
  if (isVertical && !hasIndicator) {
    return (
      <Box
        role="separator"
        aria-orientation="vertical"
        className={'divider-vertical divider-' + color + (isColored(color, colored) ? ' divider-colored' : '') + ' ' + className}
        sx={{
          display: 'inline-block',
          width: thickness,
          alignSelf: 'stretch',
          minHeight: 24,
          backgroundColor: lineColor,
          flexShrink: 0,
          ...sx,
        }}
        {...props}
      />
    );
  }

  // --- Vertical with indicator ---
  if (isVertical && hasIndicator) {
    const indStyles = getIndicatorStyles(color, indicatorStyle, colored);
    const [topFlex, bottomFlex] = flexes(textAlign);

    return (
      <Box
        role="separator"
        aria-orientation="vertical"
        className={'divider-vertical divider-' + color + (isColored(color, colored) ? ' divider-colored' : '') + ' divider-indicator ' + className}
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignSelf: 'stretch',
          minHeight: 24,
          flexShrink: 0,
          ...sx,
        }}
        {...props}
      >
        <Box sx={{ flex: topFlex, width: thickness, backgroundColor: lineColor }} />
        <Box className="divider-pill" sx={pillSx(indStyles)}>
          {displayText}
        </Box>
        <Box sx={{ flex: bottomFlex, width: thickness, backgroundColor: lineColor }} />
      </Box>
    );
  }

  // --- Horizontal without indicator ---
  if (!hasIndicator) {
    return (
      <Box
        role="separator"
        aria-orientation="horizontal"
        className={'divider-horizontal divider-' + color + (isColored(color, colored) ? ' divider-colored' : '') + ' ' + className}
        sx={{
          width: '100%',
          height: thickness,
          backgroundColor: lineColor,
          flexShrink: 0,
          ...sx,
        }}
        {...props}
      />
    );
  }

  // --- Horizontal with indicator ---
  const indStyles = getIndicatorStyles(color, indicatorStyle, colored);
  const [leftFlex, rightFlex] = flexes(textAlign);

  return (
    <Box
      role="separator"
      aria-orientation="horizontal"
      className={'divider-horizontal divider-' + color + (isColored(color, colored) ? ' divider-colored' : '') + ' divider-indicator ' + className}
      sx={{ display: 'flex', alignItems: 'center', width: '100%', ...sx }}
      {...props}
    >
      <Box sx={{ flex: leftFlex, height: thickness, backgroundColor: lineColor }} />
      <Box className="divider-pill" sx={pillSx(indStyles)}>
        {displayText}
      </Box>
      <Box sx={{ flex: rightFlex, height: thickness, backgroundColor: lineColor }} />
    </Box>
  );
}

// Convenience Exports
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