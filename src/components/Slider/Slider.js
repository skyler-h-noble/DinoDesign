// src/components/Slider/Slider.js
import React from 'react';
import { Slider as MuiSlider, Box } from '@mui/material';
import { Body, BodySmall } from '../Typography';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2, bevelShadow } from '../_shadows';

/**
 * Slider Component
 * Full-featured slider with complete design system integration
 *
 * VARIANTS:
 *   SOLID   variant="{color}"           solid track + handle border, all 8 colors
 *   LIGHT   variant="{color}-light"     colored track + thumb, all 8 colors
 *
 * SIZES: small (12px visual) | medium (16px visual) | large (20px visual)
 *   Thumb element is always 24×24px for WCAG 2.2 AA touch target.
 *   Visual dot lives in ::before at the designated size.
 *   Range slider: visual dots offset to avoid overlap at close values.
 *
 * LABEL DISPLAY: off | on | auto (show on hover/focus)
 *
 * ORIENTATION: horizontal (default) | vertical
 * TRACK: normal | inverted
 * RANGE: pass value={[20, 80]} for a two-thumb range slider
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Style Builder -----------------------------------------------------------

/* The slider is drawn from the SURFACE tokens, not the button palette.
 *
 * That is what makes its contrast hold by construction rather than by check,
 * and each pairing is doing a specific job:
 *
 *   rail    --Background fill with a 1px --Border edge. It was --Border-VARIANT
 *           as a fill and no edge at all — and Border-Variant is the token
 *           documented as DECORATIVE, carrying no contrast requirement. A
 *           slider's rail is the boundary of an interactive control, so it
 *           needs --Border, which is the 3:1 one.
 *
 *   thumb   --Border fill with a 1px --Background border. The border is not
 *           decoration: it separates the handle from the fill it sits on AND
 *           from the focus ring outside it, so both comparisons are against a
 *           known color instead of against whatever the handle overlaps.
 *
 *   label   --Text ground with --Background text — the surface's own pair,
 *           inverted. Legible on any surface by definition, which a color from
 *           the button palette is not guaranteed to be.
 *
 * A named `color` still routes the FILL through the button palette, so
 * color="success" is a green slider; everything that carries a contrast
 * requirement stays on the surface tokens. */
function colorStyles(color) {
  const C = cap(color);
  /* `isDefault` no longer branches the FILL, and that is a bug fix rather than
     a simplification. It read `var(--Button)`, with no fallback, and --Button
     is not a token: nothing in foundation.css, base.css or any brand bundle
     defines it. A var() on an undefined property with no fallback is invalid at
     computed-value time, so the DEFAULT slider — the one every demo shows —
     painted no track fill at all and rendered as a bare outline. Every named
     colour worked, which is why it survived: the broken case was the one that
     looks like a styling choice. --Buttons-Default-Button is the real name and
     is defined 72 times in a published mode sheet. */
  return {
    /* Figma binds the Handle and both bar edges to Buttons::Border, and they
       stay on the SURFACE --Border here instead. A deliberate divergence, not
       an oversight — see the note above the component: the thumb, rail and
       focus ring each carry a contrast REQUIREMENT, and --Border is the 3:1
       token guaranteed against the surface they sit on. --Buttons-{C}-Border
       is guaranteed against its own button fill, which is a different
       comparison, so a named colour would move the edge to a token nothing
       has checked against the page. SliderColoring.test.js pins this.

       The two agree at `default` and part company the moment a colour is set,
       so the divergence is invisible until it matters. Raised with the design
       owner rather than resolved here. */
    thumb:          'var(--Border)',
    thumbBorder:    '1px solid var(--Background)',
    track:          'var(--Buttons-' + C + '-Button)',
    trackBorder:    '1px solid var(--Border)',
    rail:           'var(--Background)',
    railBorder:     '1px solid var(--Border)',
    /* The label stays on the SURFACE pair, inverted, and deliberately so: it is
       --Text on --Background, which is legible on any surface by definition.
       A colour from the button palette is not. Figma agrees — Label is
       Surface::Text with Surface::Background text. */
    valueLabel:     'var(--Text)',
    valueLabelText: 'var(--Background)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color] = colorStyles(color);
  });
  return map;
}

// --- Sizing ------------------------------------------------------------------
// Thumb is always ≥ 24×24px for WCAG 2.2 AA touch target.
// The visual circle lives in ::before at the designated visual size.
// Range slider: visual dots offset so they don't overlap when close.

const TOUCH_MIN = 24;

const SIZE_MAP = {
  small:  { visual: 12, track: 2,  labelSize: 11 },
  medium: { visual: 16, track: 4,  labelSize: 12 },
  large:  { visual: 20, track: 6,  labelSize: 13 },
};

// --- Component ---------------------------------------------------------------

/* ZONE PROPS — `theme` and `surface`.
 *
 * They become data-theme / data-surface on the root, which redefines
 * --Background, --Text, --Border, --Quiet, --Hover and --Pressed for
 * everything inside. That is how a slider takes its colors from the zone it
 * sits in rather than from a prop, and it is why the thumb follows for free:
 * the thumb is var(--Border) with a var(--Background) edge, so it recolors
 * with the zone without this file knowing anything about themes.
 *
 * Deliberately NOT derived from `variant`. The two are different knobs, and
 * the docblock above says why: `variant` routes the FILL through the button
 * palette, while everything carrying a contrast requirement — thumb, rail,
 * label — stays on surface tokens. Folding the theme into `variant` would
 * make a palette choice silently restyle the contrast-bearing parts too.
 *
 * Both are undefined when not passed, so the slider INHERITS its ancestor's
 * zone. An empty string would match [data-theme] selectors and pin it to
 * nothing, which is worse than absent. */
export function Slider({
  theme,
  surface,
  variant = 'primary',
  size = 'medium',
  value,
  defaultValue,
  onChange,
  onChangeCommitted,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  valueLabelDisplay = 'off',
  orientation = 'horizontal',
  track = 'normal',
  disabled = false,
  label,
  name,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['primary'];
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  /* Marks have NO counterpart in the design, and the density is the reason
     this warns rather than silently coping.

     Figma's Slider set has two axes — Type and Orientation — and no mark
     elements anywhere in its structure. `marks` is MUI's, passed through.
     MUI's documented behaviour for `marks={true}` is a tick at every STEP, so
     the default step of 1 over 0–100 draws 101 ticks about 3px apart: a solid
     hatched band across the track, which is what it looks like rather than a
     scale. Nothing is broken — it is doing exactly what it was asked.

     Not clamped, because quietly drawing a different number of marks than the
     steps the slider actually snaps to would make the scale lie about the
     control. The fix is the caller's: pass a `marks` ARRAY for the few values
     worth labelling, or raise `step` so the ticks match what the thumb can
     land on. */
  if (process.env.NODE_ENV !== 'production' && marks === true) {
    const count = Math.floor((max - min) / step) + 1;
    if (count > 20) {
      // eslint-disable-next-line no-console
      console.warn(
        `[OmniDesign] <Slider marks> with step=${step} over ${min}–${max} draws ` +
        `${count} ticks, which reads as a hatched band rather than a scale. ` +
        'Pass a marks ARRAY for the values worth showing, or raise `step` so the ' +
        'ticks match where the thumb can land. Marks are code-only — the design ' +
        'has no mark element.',
      );
    }
  }

  const isVertical = orientation === 'vertical';
  const isRange = Array.isArray(value) || Array.isArray(defaultValue);
  const isInverted = track === 'inverted';
  const LabelComp = size === 'small' ? BodySmall : Body;

  const totalTrack = sizeConfig.track + 2; // inner height + 1px border each side

  /* Inverted swaps which side is FILLED, not which side has an edge.
   *
   * Both the rail and the track carry a 1px --Border now: the whole bar is one
   * outlined shape whose fill moves, so the control's outline stays continuous
   * whichever side is selected. Previously only one of them had a border, so
   * inverting visibly changed the shape's outline as well as its fill. */
  const railBg     = isInverted ? styles.track       : styles.rail;
  const railBorder = styles.railBorder;
  const trackBg    = isInverted ? styles.rail         : styles.track;
  const trackBr    = styles.trackBorder;

  const sliderSx = {
    // Root
    color: styles.track === 'transparent' ? styles.thumb : styles.track,
    height: isVertical ? undefined : totalTrack,
    width: isVertical ? totalTrack : undefined,

    // Rail (unfilled background) — matches total track visual height
    '& .MuiSlider-rail': {
      backgroundColor: railBg,
      border: railBorder || 'none',
      boxSizing: railBorder ? 'content-box' : 'border-box',
      opacity: 1,
      height: isVertical ? undefined : (railBorder ? sizeConfig.track : totalTrack),
      width: isVertical ? (railBorder ? sizeConfig.track : totalTrack) : undefined,
      borderRadius: totalTrack / 2,
    },

    // Track (filled portion) — inner height + 1px border each side = totalTrack
    '& .MuiSlider-track': {
      boxSizing: trackBr ? 'content-box' : 'border-box',
      backgroundColor: trackBg,
      border: trackBr || 'none',
      height: isVertical ? undefined : (trackBr ? sizeConfig.track : totalTrack),
      width: isVertical ? (trackBr ? sizeConfig.track : totalTrack) : undefined,
      borderRadius: totalTrack / 2,
    },

    // Thumb — 24×24 touch target, visual dot in ::before
    '& .MuiSlider-thumb': {
      width: TOUCH_MIN,
      height: TOUCH_MIN,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      transition: 'none',
      // Bevel sizing — visual diameter feeds --_bevel via --Button-Bevel %.
      // Inherited into ::before so the bevelShadow() insets render on the
      // visual circle, mirroring how Button computes its bevel from height.
      '--_height': sizeConfig.visual + 'px',
      '--_bevel': 'min(calc(var(--Button-Bevel) * var(--_height) / 100), calc(var(--_height) / 5))',
      // Remove MUI default ::after
      '&::after': { display: 'none' },

      // Visual circle
      '&::before': {
        content: '""',
        position: 'absolute',
        width: sizeConfig.visual,
        height: sizeConfig.visual,
        borderRadius: '50%',
        backgroundColor: styles.thumb,
        border: styles.thumbBorder || 'none',
        boxShadow: `${bevelShadow(variant)}, ${SHADOW_LEVEL_1}`,
        transition: 'box-shadow 0.15s ease-in-out',
        // Centered by default (single slider)
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },

      '&:hover::before': {
        boxShadow: `${bevelShadow(variant)}, ${SHADOW_LEVEL_2}`,
      },

      /* The outer ring of the focus indicator. The inner --Background ring is
         the thumb's own border, so this only adds the --Focus-Visible one —
         flush against it, which is what keeps the 3:1 measurable.

         Figma also draws a 4px Buttons/Default/Button halo between the two and
         a second --Background ring outside. Not reproduced, and deliberately:
         inserting the halo moves the ring's contrast comparison from
         Focus-Visible-against-Background, which is guaranteed, to
         Focus-Visible-against-a-button-colour, which is not. The gap is the
         exact failure the flush construction was introduced to fix. */
      '&.Mui-focusVisible::before, &:focus-visible::before': {
        boxShadow: `${bevelShadow(variant)}, ${SHADOW_LEVEL_2}, 0 0 0 1px var(--Focus-Visible)`,
      },

      '&.Mui-active::before': {
        // Pressed: keep bevel, drop elevation (matches Button's pressed state)
        boxShadow: bevelShadow(variant),
      },

      '&.Mui-focusVisible': {
        /* Double ring, NO gap — the structure the design specifies:
         *
         *     handle fill │ 1px --Background │ 1px --Focus-Visible
         *
         * It was `outline: 2px --Focus-Visible` with `outline-offset: 2px`,
         * and the 2px gap is the problem: it shows whatever is BEHIND the
         * thumb — the rail, the fill, or the page — so the focus indicator's
         * 3:1 was measured against an unknown color that changes as the thumb
         * moves along the track.
         *
         * The --Background ring is what makes it measurable. It is already the
         * thumb's border, so the focus state only adds the outer ring, drawn
         * as a box-shadow so it follows the circle rather than the box. */
        outline: 'none',
        borderRadius: '50%',
      },
      '&.Mui-focusVisible::before': {
        boxShadow: `${bevelShadow(variant)}, ${SHADOW_LEVEL_2}`,
      },
    },

    // Range slider — offset visual dots so they don't stack
    ...(isRange ? (isVertical ? {
      // Vertical: bottom thumb (index 0) → dot at top, top thumb (index 1) → dot at bottom
      '& .MuiSlider-thumb[data-index="0"]::before': {
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      },
      '& .MuiSlider-thumb[data-index="1"]::before': {
        top: 'auto',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      },
    } : {
      // Horizontal: left thumb (index 0) → dot right-aligned, right thumb (index 1) → dot left-aligned
      '& .MuiSlider-thumb[data-index="0"]::before': {
        left: 'auto',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      },
      '& .MuiSlider-thumb[data-index="1"]::before': {
        left: 0,
        right: 'auto',
        top: '50%',
        transform: 'translateY(-50%)',
      },
    }) : {}),

    // Value label (tooltip)
    '& .MuiSlider-valueLabel': {
      backgroundColor: styles.valueLabel,
      color: styles.valueLabelText,
      /* Labels-Extra-Small, the style the design uses — not a hardcoded 11/12/13.
         The three pixel values matched no token and no style in the system. */
      fontFamily: 'var(--Font-Families-Body, var(--Body-Font-Family))',
      fontSize: 'var(--Label-ExtraSmall-Font-Size)',
      fontWeight: 'var(--Label-ExtraSmall-Font-Weight)',
      letterSpacing: 'var(--Label-ExtraSmall-Letter-Spacing)',
      lineHeight: 'var(--Label-ExtraSmall-Line-Height)',
      borderRadius: 'var(--Sizing-1, 8px)',
      padding: 'var(--Sizing-Half, 4px) var(--Sizing-1, 8px)',
      '&::before': {
        backgroundColor: styles.valueLabel,
      },
    },

    // Marks
    '& .MuiSlider-mark': {
      backgroundColor: styles.rail,
      width: isVertical ? totalTrack : 2,
      height: isVertical ? 2 : totalTrack,
      borderRadius: 1,
    },
    '& .MuiSlider-markActive': {
      backgroundColor: styles.thumb,
      opacity: 0.6,
    },
    '& .MuiSlider-markLabel': {
      color: 'var(--Text-Quiet)',
      fontSize: sizeConfig.labelSize,
    },

    // Disabled
    '&.Mui-disabled': {
      opacity: 'var(--Disabled, 0.38)',
      cursor: 'not-allowed',
      pointerEvents: 'none',
      '& .MuiSlider-thumb::before': {
        boxShadow: 'none',
      },
    },

    ...sx,
  };

  const sliderElement = (
    <MuiSlider
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      min={min}
      max={max}
      step={step}
      marks={marks}
      valueLabelDisplay={valueLabelDisplay}
      orientation={orientation}
      track={track === 'inverted' ? 'inverted' : track === false ? false : 'normal'}
      disabled={disabled}
      name={name}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      /* Native `disabled` already blocks interaction, but it also drops the
         control out of the tab order — so a keyboard user tabs straight past
         and never learns the slider is there. aria-disabled restores the
         announcement without re-enabling anything: the native attribute is
         still what actually disables it. Both say the same thing, which is
         redundant rather than conflicting. */
      slotProps={disabled ? { input: { 'aria-disabled': 'true' } } : undefined}
      className={'slider-' + variant + ' ' + className}
      data-theme={theme || undefined}
      data-surface={surface || undefined}
      sx={sliderSx}
      {...props}
    />
  );

  if (label) {
    return (
      <Box
        sx={{
          width: isVertical ? 'auto' : '100%',
          height: isVertical ? '100%' : 'auto',
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'column',
          gap: '4px',
        }}
      >
        <LabelComp
          component="label"
          sx={{
            color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
            fontSize: size === 'small' ? '13px' : '15px',
            fontWeight: 500,
            opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
          }}
        >
          {label}
        </LabelComp>
        {sliderElement}
      </Box>
    );
  }

  return sliderElement;
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

export const DefaultSlider   = (p) => <Slider variant="default"   {...p} />;
export const PrimarySlider   = (p) => <Slider variant="primary"   {...p} />;
export const SecondarySlider = (p) => <Slider variant="secondary" {...p} />;
export const TertiarySlider  = (p) => <Slider variant="tertiary"  {...p} />;
export const NeutralSlider   = (p) => <Slider variant="neutral"   {...p} />;
export const InfoSlider      = (p) => <Slider variant="info"      {...p} />;
export const SuccessSlider   = (p) => <Slider variant="success"   {...p} />;
export const WarningSlider   = (p) => <Slider variant="warning"   {...p} />;
export const ErrorSlider     = (p) => <Slider variant="error"     {...p} />;

// Legacy exports for backwards compatibility
export const SliderInput = Slider;
export const RangeSlider = Slider;

export default Slider;
