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
 * INDICATOR (optional text label centered on the divider):
 *   Works on both horizontal and vertical orientations.
 *
 *   The pill's border always matches the divider line color (see COLORS above).
 *   For border / border-variant / unset divider colors, the pill falls back
 *   to the Default Tag tokens so it reads as a neutral chip.
 *
 *   indicatorStyle="outline"
 *     BG:     var(--Background)
 *     Text:   var(--Text)
 *
 *   indicatorStyle="light"
 *     BG:     var(--Tag-{Color}-BG)
 *     Text:   var(--Tag-{Color}-Text)
 *
 *   textAlign (horizontal): left | center | right
 *   textAlign (vertical):   top  | center | bottom
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

function getIndicatorStyles(color, indicatorStyle, colored) {
  // A colored rule's pill takes that palette's Tag tokens; a Default rule's
  // falls back to the Default Tag color so it reads as a neutral chip.
  const C = isColored(color, colored) && color && !NOT_A_PALETTE.includes(color) ? cap(color) : 'Default';
  const borderColor = getLineColor(color, colored);
  if (indicatorStyle === 'light') {
    return {
      bg:     'var(--Tag-' + C + '-BG)',
      text:   'var(--Tag-' + C + '-Text)',
      border: '1px solid ' + borderColor,
    };
  }
  return {
    bg:     'var(--Background)',
    text:   'var(--Text)',
    border: '1px solid ' + borderColor,
  };
}

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
    const topFlex = textAlign === 'top' ? '0 0 10%' : textAlign === 'bottom' ? '1 1 auto' : '1 1 auto';
    const bottomFlex = textAlign === 'top' ? '1 1 auto' : textAlign === 'bottom' ? '0 0 10%' : '1 1 auto';

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
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, my: 1, px: 0.75, py: 0.5,
            borderRadius: '12px', fontSize: '11px', fontWeight: 500,
            fontFamily: 'inherit', lineHeight: 1.2, whiteSpace: 'nowrap',
            backgroundColor: indStyles.bg, color: indStyles.text, border: indStyles.border,
            boxSizing: 'border-box',
          }}
        >
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
  const leftFlex = textAlign === 'left' ? '0 0 10%' : textAlign === 'right' ? '1 1 auto' : '1 1 auto';
  const rightFlex = textAlign === 'left' ? '1 1 auto' : textAlign === 'right' ? '0 0 10%' : '1 1 auto';

  return (
    <Box
      role="separator"
      aria-orientation="horizontal"
      className={'divider-horizontal divider-' + color + (isColored(color, colored) ? ' divider-colored' : '') + ' divider-indicator ' + className}
      sx={{ display: 'flex', alignItems: 'center', width: '100%', ...sx }}
      {...props}
    >
      <Box sx={{ flex: leftFlex, height: thickness, backgroundColor: lineColor }} />
      <Box
        sx={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, mx: 2, px: 1.5, py: 0.5,
          borderRadius: '12px', fontSize: '12px', fontWeight: 500,
          fontFamily: 'inherit', lineHeight: 1.2, whiteSpace: 'nowrap',
          backgroundColor: indStyles.bg, color: indStyles.text, border: indStyles.border,
          boxSizing: 'border-box',
        }}
      >
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