// src/components/Slider/Slider.js
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';
import { SHADOW_LEVEL_1 } from '../_shadows';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * Slider Component
 * Full-featured slider with complete design system integration
 *
 * VARIANTS:
 *   variant="{color}"   solid track + handle border, all 9 colors
 *
 * There is no `-light` shape. This header documented one for as long as the
 * component existed, and nothing ever implemented it: `colorStyles` has no
 * branch for the suffix, so `variant="primary-light"` missed the variant map
 * and took its unknown-variant fallback — painting the SOLID slider of a
 * different color than the one asked for, with no warning. Removed in the
 * same release that deleted `-light` from Button, Chip, Badge and
 * SwitchInput; a shape named in the docs and absent from the code is worse
 * than either having it or not.
 *
 * The default is `default`, not `primary`: a component with no variant asked
 * for gets the brand's own button color, the same as Button and Checkbox.
 *
 * SIZES: small (12px visual) | medium (16px visual) | large (20px visual)
 *   Thumb element is always 24×24px for WCAG 2.2 AA touch target.
 *   Visual dot lives in ::before at the designated size.
 *   Range slider: visual dots offset to avoid overlap at close values.
 *
 * LABEL DISPLAY: off | on | auto (show on hover/focus)
 *
 * ORIENTATION: horizontal (default) | vertical
 * FILL: standard | inverted
 *   Which side of the thumb the fill sits on. Figma's Slider `Type` combines
 *   this with the thumb count (single / single-inverted / double /
 *   double-inverted); here the thumb count comes from `value` being an array,
 *   so `fill` carries only the direction. `track` is MUI's name for it and is
 *   still accepted, including its `normal`. There is no "no fill": the
 *   filled side must look different from the rail, or the slider shows no
 *   value. `false` renders standard and warns.
 * RANGE: pass value={[20, 80]} for a two-thumb range slider
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
let warnedNoFill = false;

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
     color worked, which is why it survived: the broken case was the one that
     looks like a styling choice. --Buttons-Default-Button is the real name and
     is defined 72 times in a published mode sheet. */
  return {
    /* Buttons::Border, as Figma binds the Handle and both bar edges.
       The thumb, rail edge and track edge move WITH the fill, so a colored
       slider is colored throughout rather than a palette fill between surface
       edges.

       This file previously kept them on the surface --Border, and the reasoning
       is worth keeping because it is the thing to re-check if contrast ever
       looks wrong here: --Border is the 3:1 token guaranteed against the
       SURFACE, while --Buttons-{C}-Border is guaranteed against its own button
       fill. Those are different comparisons, and the two tokens agree at
       `default` and diverge the moment a color is set.

       The design owner's call, made deliberately: the design specifies the
       button border here, and its palettes are generated with the border tone
       chosen for contrast, so the guarantee comes from the generator rather
       than from which token the component reaches for. */
    thumb:          'var(--Buttons-' + C + '-Border)',
    /* The thumb's own edge stays --Background. It is what separates the handle
       from the fill it sits on AND from the focus ring outside it, so both
       comparisons land on a known color rather than on whatever the handle
       happens to be overlapping at that point on the track. */
    thumbBorder:    '1px solid var(--Background)',
    track:          'var(--Buttons-' + C + '-Button)',
    trackBorder:    '1px solid var(--Buttons-' + C + '-Border)',
    rail:           'var(--Background)',
    railBorder:     '1px solid var(--Buttons-' + C + '-Border)',
    /* The label stays on the SURFACE pair, inverted, and deliberately so: it is
       --Text on --Background, which is legible on any surface by definition.
       A color from the button palette is not. Figma agrees — Label is
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
// Figma's Slider (medium): a 24px thumb on an 8px bar. The thumb IS the
// touch target now — it was a 16px dot inside a 24px box, and on a range the
// dots were pushed to the inner edges of their boxes, so neither sat on its
// value. small / large follow the in-button icon ramp (16 / 32). `track` is
// the bar's inner height; its 1px edge on each side makes 4 / 8 / 12.
// The touch box never drops below 24 (WCAG 2.2 target size).

const TOUCH_MIN = 24;

const SIZE_MAP = {
  small:  { visual: 16, track: 2,  labelSize: 11 },
  medium: { visual: 24, track: 6,  labelSize: 12 },
  large:  { visual: 32, track: 10, labelSize: 13 },
};

// --- Static sheet ------------------------------------------------------------
//
// Slider was MUI's Slider with an sx over it. It is its own markup now — a
// native <input type="range"> per thumb (visually hidden, as MUI's was) so it
// stays a real slider to assistive tech and the keyboard — and this sheet
// carries both layers: what MUI's Slider gave each part, then the design's sx
// on top. Same classes as MUI's (MuiSlider-root / -rail / -track / -thumb /
// -valueLabel / -mark / -markLabel, Mui-active, Mui-focusVisible …) so a
// consumer's rule on them still lands.
//
// Weights match what emotion's rules had: MUI's own rules are one class (its
// orientation variants are folded in with :where(), which weighs nothing);
// the design's are the root class plus the part's class — `.omni-sl
// .MuiSlider-rail`, the shape `.css-x .MuiSlider-rail` had — so a caller's sx
// still wins over them, as it did.
//
// Per-instance values (the bar thickness, the variant's palette, the thumb
// size) are custom properties declared on the root by one class per size and
// per color. Nothing between the root and its parts sets a data-theme, so
// they resolve against the same scope the parts named them in.
//
// A caller's sx key that the component's own sx also had REPLACED that whole
// nested object when both were one sx; .omni-sl-no-<key> drops ours so the
// caller's alone applies, as it did.
const SxBox = lazySxBox('Slider');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SX_KEYS = {
  '& .MuiSlider-rail': 'rail',
  '& .MuiSlider-track': 'track',
  '& .MuiSlider-thumb': 'thumb',
  '& .MuiSlider-valueLabel': 'vl',
  '& .MuiSlider-mark': 'mark',
  '& .MuiSlider-markActive': 'mark-active',
  '& .MuiSlider-markLabel': 'mark-label',
  '&.Mui-disabled': 'disabled',
  '&.MuiSlider-vertical .MuiSlider-valueLabel': 'vl-v',
  '& .MuiSlider-thumb .MuiSlider-valueLabel': 'vl-b',
};
const ok = (key) => `.omni-sl:where(:not(.omni-sl-no-${key}))`;
const H = ':where(:not(.omni-slv))';
const V = ':where(.omni-slv)';
const MUI_FONT = '"Roboto","Helvetica","Arial",sans-serif';
const BODY2 = `font-family:${MUI_FONT};font-weight:400;font-size:0.875rem;line-height:1.43;letter-spacing:0.01071em`;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
// MUI's Level-2 elevation, which its thumb's ::before carried (theme.shadows[2]).
const MUI_SHADOW_2 = '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)';
// Figma's hover / pressed halo: the fill color at 20%.
const HALO = 'color-mix(in srgb, var(--_sl-fill) 20%, transparent)';

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
registerStaticStyles('omni-slider', wk([
  /* MUI's Slider: the root. */
  '.omni-sl{border-radius:12px;box-sizing:content-box;display:inline-block;position:relative;cursor:pointer;touch-action:none;'
    + '-webkit-tap-highlight-color:transparent;color:#1976d2}',
  '@media print{.omni-sl{color-adjust:exact}}',
  '.omni-sl.Mui-disabled{pointer-events:none;cursor:default;color:#bdbdbd}',
  '.omni-sl.MuiSlider-dragging .MuiSlider-thumb,.omni-sl.MuiSlider-dragging .MuiSlider-track{transition:none}',
  `.omni-sl${H}{height:4px;width:100%;padding:13px 0}`,
  `@media (pointer: coarse){.omni-sl${H}{padding:20px 0}}`,
  `.omni-sl${H}.MuiSlider-marked{margin-bottom:20px}`,
  `.omni-sl${V}{height:100%;width:4px;padding:0 13px}`,
  `@media (pointer: coarse){.omni-sl${V}{padding:0 20px}}`,
  `.omni-sl${V}.MuiSlider-marked{margin-right:44px}`,
  /* Rail, track. */
  '.MuiSlider-rail{display:block;position:absolute;border-radius:inherit;background-color:currentColor;opacity:0.38}',
  `.MuiSlider-rail${H}{width:100%;height:inherit;top:50%;transform:translateY(-50%)}`,
  `.MuiSlider-rail${V}{height:100%;width:inherit;left:50%;transform:translateX(-50%)}`,
  '.MuiSlider-rail:where(.omni-sl-inv){opacity:1}',
  '.MuiSlider-track{display:block;position:absolute;border-radius:inherit;border:1px solid currentColor;background-color:currentColor;'
    + `transition:left 150ms ${EASE} 0ms, width 150ms ${EASE} 0ms, bottom 150ms ${EASE} 0ms, height 150ms ${EASE} 0ms}`,
  `.MuiSlider-track${H}{height:inherit;top:50%;transform:translateY(-50%)}`,
  `.MuiSlider-track${V}{width:inherit;left:50%;transform:translateX(-50%)}`,
  '.MuiSlider-track:where(.omni-sl-inv){background-color:rgb(167, 202, 237);border-color:rgb(167, 202, 237)}',
  /* Thumb. */
  '.MuiSlider-thumb{position:absolute;width:20px;height:20px;box-sizing:border-box;border-radius:50%;outline:0;background-color:currentColor;'
    + `display:flex;align-items:center;justify-content:center;transition:box-shadow 150ms ${EASE} 0ms, left 150ms ${EASE} 0ms, bottom 150ms ${EASE} 0ms}`,
  `.MuiSlider-thumb::before{position:absolute;content:"";border-radius:inherit;width:100%;height:100%;box-shadow:${MUI_SHADOW_2}}`,
  '.MuiSlider-thumb::after{position:absolute;content:"";border-radius:50%;width:42px;height:42px;top:50%;left:50%;transform:translate(-50%, -50%)}',
  '.MuiSlider-thumb.Mui-disabled:hover{box-shadow:none}',
  `.MuiSlider-thumb${H}{top:50%;transform:translate(-50%, -50%)}`,
  `.MuiSlider-thumb${V}{left:50%;transform:translate(-50%, 50%)}`,
  '.MuiSlider-thumb:hover,.MuiSlider-thumb.Mui-focusVisible{box-shadow:0px 0px 0px 8px rgba(25, 118, 210, 0.16)}',
  '@media (hover: none){.MuiSlider-thumb:hover,.MuiSlider-thumb.Mui-focusVisible{box-shadow:none}}',
  '.MuiSlider-thumb.Mui-active{box-shadow:0px 0px 0px 14px rgba(25, 118, 210, 0.16)}',
  /* Value label. */
  `.MuiSlider-valueLabel{z-index:1;white-space:nowrap;${BODY2};font-weight:500;transition:transform 150ms ${EASE} 0ms;position:absolute;`
    + 'background-color:#757575;border-radius:2px;color:#fff;display:flex;align-items:center;justify-content:center;padding:0.25rem 0.75rem}',
  `.MuiSlider-valueLabel${H}{transform:translateY(-100%) scale(0);top:-10px;transform-origin:bottom center}`,
  `.MuiSlider-valueLabel${H}::before{position:absolute;content:"";width:8px;height:8px;transform:translate(-50%, 50%) rotate(45deg);background-color:inherit;bottom:0;left:50%}`,
  `.MuiSlider-valueLabel${H}.MuiSlider-valueLabelOpen{transform:translateY(-100%) scale(1)}`,
  `.MuiSlider-valueLabel${V}{transform:translateY(-50%) scale(0);right:30px;top:50%;transform-origin:right center}`,
  `.MuiSlider-valueLabel${V}::before{position:absolute;content:"";width:8px;height:8px;transform:translate(-50%, -50%) rotate(45deg);background-color:inherit;right:-8px;top:50%}`,
  `.MuiSlider-valueLabel${V}.MuiSlider-valueLabelOpen{transform:translateY(-50%) scale(1)}`,
  /* Marks. */
  '.MuiSlider-mark{position:absolute;width:2px;height:2px;border-radius:1px;background-color:currentColor}',
  `.MuiSlider-mark${H}{top:50%;transform:translate(-1px, -50%)}`,
  `.MuiSlider-mark${V}{left:50%;transform:translate(-50%, 1px)}`,
  '.MuiSlider-mark.MuiSlider-markActive{background-color:#fff;opacity:0.8}',
  `.MuiSlider-markLabel{${BODY2};color:rgba(0, 0, 0, 0.6);position:absolute;white-space:nowrap}`,
  `.MuiSlider-markLabel${H}{top:30px;transform:translateX(-50%)}`,
  `@media (pointer: coarse){.MuiSlider-markLabel${H}{top:40px}}`,
  `.MuiSlider-markLabel${V}{left:36px;transform:translateY(50%)}`,
  `@media (pointer: coarse){.MuiSlider-markLabel${V}{left:44px}}`,
  '.MuiSlider-markLabel.MuiSlider-markLabelActive{color:rgba(0, 0, 0, 0.87)}',

  /* ── The design's layer (the sx). ── */
  ...Object.entries(SIZE_MAP).map(([size, c]) => `.omni-sl-${size}{--_sl-t:${c.track + 2}px;--_sl-r:${(c.track + 2) * 2}px;`
    + `--_sl-thumb:${Math.max(TOUCH_MIN, c.visual)}px;--_sl-vis:${c.visual}px;--_sl-ml:${c.labelSize}px}`),
  ...COLORS.map((color) => {
    const st = colorStyles(color);
    return `.omni-sl-${cap(color)}{--_sl-fill:${st.track};--_sl-edge:${st.thumb};--_sl-rail:${st.rail};--_sl-vl:${st.valueLabel};--_sl-vlt:${st.valueLabelText}}`;
  }),
  /* Inverted swaps which side is FILLED, not which side has an edge: both
     rail and track carry the 1px edge, so the bar's outline stays continuous. */
  '.omni-sl{--_sl-rail-bg:var(--_sl-rail);--_sl-track-bg:var(--_sl-fill)}',
  '.omni-sl-inv{--_sl-rail-bg:var(--_sl-fill);--_sl-track-bg:var(--_sl-rail)}',
  '.omni-sl{color:var(--_sl-fill)}',
  `.omni-sl${H}{height:var(--_sl-t)}`,
  `.omni-sl${V}{width:var(--_sl-t)}`,
  /* border-box: the 1px edge is inside the bar's length as well as its
     thickness. */
  `${ok('rail')} .MuiSlider-rail{background-color:var(--_sl-rail-bg);border:1px solid var(--_sl-edge);box-sizing:border-box;opacity:1;border-radius:var(--_sl-r)}`,
  `${ok('rail')}${H} .MuiSlider-rail{height:var(--_sl-t)}`,
  `${ok('rail')}${V} .MuiSlider-rail{width:var(--_sl-t)}`,
  `${ok('track')} .MuiSlider-track{box-sizing:border-box;background-color:var(--_sl-track-bg);border:1px solid var(--_sl-edge);border-radius:var(--_sl-r)}`,
  `${ok('track')}${H} .MuiSlider-track{height:var(--_sl-t)}`,
  `${ok('track')}${V} .MuiSlider-track{width:var(--_sl-t)}`,
  /* Thumb — the touch target, its visual circle in ::before. No bevel:
     Figma's handle is flat, its only effect the elevation. */
  `${ok('thumb')} .MuiSlider-thumb{width:var(--_sl-thumb);height:var(--_sl-thumb);background-color:transparent;border:none;box-shadow:none;transition:none}`,
  `${ok('thumb')} .MuiSlider-thumb::after{display:none}`,
  /* MUI's own 8px primary-blue ring on hover / focus / drag goes: the halo is
     ours, on ::before in the fill color. */
  `${ok('thumb')} .MuiSlider-thumb:hover,${ok('thumb')} .MuiSlider-thumb.Mui-focusVisible,${ok('thumb')} .MuiSlider-thumb.Mui-active{box-shadow:none}`,
  `${ok('thumb')} .MuiSlider-thumb::before{content:"";position:absolute;width:var(--_sl-vis);height:var(--_sl-vis);box-sizing:border-box;border-radius:50%;`
    + `background-color:var(--_sl-edge);border:1px solid var(--Background);box-shadow:${SHADOW_LEVEL_1};transition:box-shadow 0.15s ease-in-out;`
    + 'top:50%;left:50%;transform:translate(-50%, -50%)}',
  /* Figma's Hover / Pressed: a halo of the fill color at 20% — 4px out on
     hover, 8px pressed — around the resting thumb. */
  `${ok('thumb')} .MuiSlider-thumb:hover::before{box-shadow:${SHADOW_LEVEL_1}, 0 0 0 4px ${HALO}}`,
  /* Focus: a 1px --Focus-Visible ring with a 1px --Background ring outside
     it, flush on the thumb's own --Background edge — so the ring's 3:1 is
     measured against a known color, not whatever sits behind the thumb. */
  `${ok('thumb')} .MuiSlider-thumb.Mui-focusVisible::before,${ok('thumb')} .MuiSlider-thumb:focus-visible::before`
    + `{box-shadow:${SHADOW_LEVEL_1}, 0 0 0 1px var(--Focus-Visible), 0 0 0 2px var(--Background)}`,
  `${ok('thumb')} .MuiSlider-thumb.Mui-active::before,${ok('thumb')} .MuiSlider-thumb:active::before{box-shadow:${SHADOW_LEVEL_1}, 0 0 0 8px ${HALO}}`,
  `${ok('thumb')} .MuiSlider-thumb.Mui-focusVisible{outline:none;border-radius:50%}`,
  /* Value label — the surface's own pair, inverted, in Labels-Extra-Small. */
  `${ok('vl')} .MuiSlider-valueLabel{background-color:var(--_sl-vl);color:var(--_sl-vlt);font-family:var(--Font-Families-Body, var(--Body-Font-Family));`
    + 'font-size:var(--Label-ExtraSmall-Font-Size);font-weight:var(--Label-ExtraSmall-Font-Weight);letter-spacing:var(--Label-ExtraSmall-Letter-Spacing);'
    + 'line-height:var(--Label-ExtraSmall-Line-Height);border-radius:var(--Sizing-1, 8px);padding:var(--Sizing-Half, 4px) var(--Sizing-1, 8px)}',
  `${ok('vl')} .MuiSlider-valueLabel::before{background-color:var(--_sl-vl)}`,
  /* Vertical: Figma's thumb shows its label to the RIGHT, 8px clear, the
     arrow pointing back at the thumb (MUI puts it on the left) … */
  `${ok('vl-v')}.omni-sl-vr.MuiSlider-vertical .MuiSlider-valueLabel{right:auto;left:calc(100% + 8px);transform-origin:left center}`,
  `${ok('vl-v')}.omni-sl-vr.MuiSlider-vertical .MuiSlider-valueLabel::before{right:auto;left:0;transform:translate(-50%, -50%) rotate(45deg)}`,
  /* … or Label-Left: 8px clear on the thumb's left, the arrow pointing right. */
  `${ok('vl-v')}.omni-sl-vl.MuiSlider-vertical .MuiSlider-valueLabel{left:auto;right:calc(100% + 8px);transform-origin:right center}`,
  `${ok('vl-v')}.omni-sl-vl.MuiSlider-vertical .MuiSlider-valueLabel::before{left:auto;right:0;transform:translate(50%, -50%) rotate(45deg)}`,
  /* Label-Bottom: under the thumb, the arrow pointing up at it. */
  `${ok('vl-b')}.omni-sl-vb .MuiSlider-thumb .MuiSlider-valueLabel{top:calc(100% + 10px);transform-origin:top center;transform:translateY(0) scale(0)}`,
  `${ok('vl-b')}.omni-sl-vb .MuiSlider-thumb .MuiSlider-valueLabel.MuiSlider-valueLabelOpen{transform:translateY(0) scale(1)}`,
  `${ok('vl-b')}.omni-sl-vb .MuiSlider-thumb .MuiSlider-valueLabel::before{bottom:auto;top:0;transform:translate(-50%, -50%) rotate(45deg)}`,
  /* Marks are DOTS: --Quiet on the rail, --Background where the fill has
     passed — each token chosen against what it sits on. */
  `${ok('mark')} .MuiSlider-mark{background-color:var(--Quiet);width:2px;height:2px;border-radius:50%}`,
  `${ok('mark-active')} .MuiSlider-markActive{background-color:var(--Background);opacity:1}`,
  `${ok('mark-label')} .MuiSlider-markLabel{color:var(--Text-Quiet);font-size:var(--_sl-ml)}`,
  /* Disabled: the resting slider at 38%. */
  `${ok('disabled')}.Mui-disabled{opacity:var(--Disabled, 0.38);cursor:not-allowed;pointer-events:none}`,
  /* SliderField: the Form-Label above or below, Sizing-Half apart; the slider
     keeps 48px either side of its bar for its value label. */
  '.omni-slf{width:100%;height:auto;display:flex;flex-direction:column;gap:var(--Sizing-Half, 4px)}',
  '.omni-slf-v{width:auto;height:100%}',
  '.omni-slf:where(:not(.omni-slf-v)) .MuiSlider-root{padding-top:48px;padding-bottom:48px}',
].join('\n')));

// --- Behaviour (what MUI's useSlider did) ------------------------------------

const INTENTIONAL_DRAG_COUNT_THRESHOLD = 2;
const asc = (a, b) => a - b;
const clamp = (v, lo, hi) => (v == null ? lo : Math.min(Math.max(lo, v), hi));
const Identity = (x) => x;
function getNewValue(currentValue, step, direction, min, max) {
  return direction === 1 ? Math.min(currentValue + step, max) : Math.max(currentValue - step, min);
}
function findClosest(values, currentValue) {
  const { index: closestIndex } = values.reduce((acc, value, index) => {
    const distance = Math.abs(currentValue - value);
    if (acc === null || distance < acc.distance || distance === acc.distance) return { distance, index };
    return acc;
  }, null) ?? {};
  return closestIndex;
}
function trackFinger(event, touchId) {
  if (touchId.current !== undefined && event.changedTouches) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId.current) return { x: touch.clientX, y: touch.clientY };
    }
    return false;
  }
  return { x: event.clientX, y: event.clientY };
}
const valueToPercent = (value, min, max) => ((value - min) * 100) / (max - min);
const percentToValue = (percent, min, max) => (max - min) * percent + min;
function getDecimalPrecision(num) {
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const mantissaDecimalPart = parts[0].split('.')[1];
    return (mantissaDecimalPart ? mantissaDecimalPart.length : 0) + parseInt(parts[1], 10);
  }
  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}
function roundValueToStep(value, step, min) {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}
function setValueIndex({ values, newValue, index }) {
  const output = values.slice();
  output[index] = newValue;
  return output.sort(asc);
}
function focusThumb({ sliderRef, activeIndex, setActive }) {
  const doc = sliderRef.current?.ownerDocument || document;
  if (!sliderRef.current?.contains(doc.activeElement) || Number(doc?.activeElement?.getAttribute('data-index')) !== activeIndex) {
    sliderRef.current?.querySelector(`[type="range"][data-index="${activeIndex}"]`).focus();
  }
  if (setActive) setActive(activeIndex);
}
function areValuesEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a === b;
  if (typeof a === 'object' && typeof b === 'object') return a.length === b.length && a.every((v, i) => v === b[i]);
  return false;
}
function isFocusVisible(el) {
  try { return el.matches(':focus-visible'); } catch (e) { return false; }
}
const AXIS = {
  horizontal: { offset: (p) => ({ left: `${p}%` }), leap: (p) => ({ width: `${p}%` }) },
  vertical: { offset: (p) => ({ bottom: `${p}%` }), leap: (p) => ({ height: `${p}%` }) },
};
const VISUALLY_HIDDEN = {
  border: 0, clip: 'rect(0 0 0 0)', height: '1px', margin: '-1px', overflow: 'hidden',
  padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: '1px',
};
let cachedTouchActionNone;
function supportsTouchActionNone() {
  if (cachedTouchActionNone === undefined) {
    cachedTouchActionNone = typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
      ? CSS.supports('touch-action', 'none') : true;
  }
  return cachedTouchActionNone;
}
const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
/* A stable function that always calls the latest closure (MUI's useEventCallback). */
function useEventCallback(fn) {
  const ref = useRef(fn);
  useEnhancedEffect(() => { ref.current = fn; });
  return useRef((...args) => ref.current(...args)).current;
}

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
  variant = 'default',
  size = 'medium',
  value: valueProp,
  defaultValue,
  onChange,
  onChangeCommitted,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  /* Figma's thumb carries its value label. 'auto' shows it while the thumb
     is hovered, dragged or focused — the label is there when the value is
     changing, without a row of bubbles over every resting slider. */
  valueLabelDisplay = 'auto',
  /* Which side of the thumb its value label sits — Figma's thumb booleans:
     horizontal 'top' (default, Label-Top) | 'bottom' (Label-Bottom);
     vertical 'right' (default, Label-Right) | 'left' (Label-Left). */
  valueLabelPosition,
  orientation = 'horizontal',
  /* Which side of the thumb the fill sits on.
     `standard` fills from the start of the rail to the thumb; `inverted`
     fills from the thumb to the end. Figma folds this into its Slider `Type`
     alongside the thumb count — single / single-inverted / double /
     double-inverted — because a variant set needs one axis per property and
     thumb count is not a property there. In code the thumb count is already
     carried by `value` being an array, so only the fill needs a prop.
     Named `fill` with `standard`, which is what Figma calls it. `track` is
     MUI's name for the same thing and keeps working, as does `normal`. */
  fill,
  track = 'standard',
  disabled = false,
  label,
  /* 'top' | 'bottom' — Figma's SliderField Label axis. */
  labelPosition = 'top',
  name,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  /* The rest of MUI Slider's API, which it read rather than forwarded. */
  'aria-valuetext': ariaValuetext,
  getAriaLabel,
  getAriaValueText,
  valueLabelFormat = Identity,
  scale = Identity,
  disableSwap = false,
  shiftStep = 10,
  tabIndex,
  slotProps,
  ...props
}) {
  useStaticStyles('omni-slider');
  const variantMap = buildVariantMap();
  /* Falls back to the DEFAULT arm, which is also the default prop value — so
     an unknown variant and an unspecified one land in the same place. These
     disagreed while the fallback said `primary`: `variant="primary-light"`
     silently painted a primary slider, which looks deliberate and is why the
     `-light` shape in the header above survived so long unimplemented. */
  const colorKey = variantMap[variant] ? variant : 'default';
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  /* Marks have NO counterpart in the design, and the density is the reason
     this warns rather than silently coping.

     Figma's Slider set has two axes — Type and Orientation — and no mark
     elements anywhere in its structure. `marks={true}` is a tick at every
     STEP, so the default step of 1 over 0–100 draws 101 ticks about 3px
     apart: a solid hatched band across the track, which is what it looks like
     rather than a scale. Nothing is broken — it is doing exactly what it was
     asked.

     Not clamped, because quietly drawing a different number of marks than the
     steps the slider actually snaps to would make the scale lie about the
     control. The fix is the caller's: pass a `marks` ARRAY for the few values
     worth labelling, or raise `step` so the ticks match what the thumb can
     land on. */
  /* step === null is RESTRICTED VALUES mode: the thumb may only land on the
     values in the marks array, so there is no step to count and nothing to
     warn about. Dividing by it would give Infinity and warn on every render. */
  /* marks={true} with step={null} has no values to snap to — restricted
     values means "snap to these specific values", and `true` names none (MUI
     threw on it: "marks.map is not a function"). Coerced to no marks so a page
     renders, with a warning that says which prop to change. */
  const restrictedToMarks = step === null;
  const safeMarks = (restrictedToMarks && marks === true) ? false : marks;
  if (process.env.NODE_ENV !== 'production' && restrictedToMarks && marks === true) {
    // eslint-disable-next-line no-console
    console.warn(
      '[OmniDesign] <Slider step={null} marks> — restricted values needs the ' +
      'ARRAY of values to snap to. `marks={true}` names none, and MUI throws ' +
      'on it. Pass marks={[{ value, label }, …]}.',
    );
  }

  if (process.env.NODE_ENV !== 'production' && marks === true && step) {
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
  /* `fill` wins when both are given; `normal` is accepted as a synonym for
     `standard` so a MUI-shaped call still reads correctly.
     No fill is retired: with nothing filled the bar is all rail, so the
     slider no longer shows where its value is — only the thumb does, and
     Figma has no such Type. MUI's `false` renders standard and warns. */
  const fillMode = fill !== undefined ? fill : track;
  const isInverted = fillMode === 'inverted';
  if (process.env.NODE_ENV !== 'production' && fillMode === false && !warnedNoFill) {
    warnedNoFill = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[OmniDesign] <Slider fill={false}> is retired — the filled side has to look ' +
      'different from the rail. Rendering the standard fill. Use fill="standard" ' +
      'or fill="inverted".',
    );
  }
  /* The label names the slider through aria-labelledby: a range has two
     inputs, which one <label for> cannot reach. */
  const labelId = useId();
  const labelledBy = ariaLabelledby || (label && !ariaLabel ? labelId : undefined);

  // ── state (MUI's useSlider) ───────────────────────────────────────────────
  const touchId = useRef(undefined);
  /* The pointer's thumb. Not the :active pseudo-class: that is not set when
     the press lands on the rail, nor carried over when a range's thumbs swap. */
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(-1);
  const [dragging, setDragging] = useState(false);
  const moveCount = useRef(0);
  const lastChangedValue = useRef(null);
  const { current: isControlled } = useRef(valueProp !== undefined);
  const [valueState, setValueStateRaw] = useState(defaultValue ?? min);
  const valueDerived = isControlled ? valueProp : valueState;
  const setValueState = (v) => { if (!isControlled) setValueStateRaw(v); };

  const handleChange = onChange && ((event, value, thumbIndex) => {
    /* Redefine target so name and value can be read — what form libraries
       expect. Cloned, so the original event's target is left alone. */
    const nativeEvent = event.nativeEvent || event;
    const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);
    Object.defineProperty(clonedEvent, 'target', { writable: true, value: { value, name } });
    lastChangedValue.current = value;
    onChange(clonedEvent, value, thumbIndex);
  });

  const range = Array.isArray(valueDerived);
  let values = range ? valueDerived.slice().sort(asc) : [valueDerived];
  values = values.map((v) => (v == null ? min : clamp(v, min, max)));
  const markList = safeMarks === true && step !== null
    ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({ value: min + step * index }))
    : safeMarks || [];
  const marksValues = markList.map((mark) => mark.value);
  const [focusedThumbIndex, setFocusedThumbIndex] = useState(-1);
  const sliderRef = useRef(null);

  const changeValue = (event, valueInput) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    const value = values[index];
    const marksIndex = marksValues.indexOf(value);
    let newValue = valueInput;
    if (markList && step == null) {
      const maxMarksValue = marksValues[marksValues.length - 1];
      if (newValue >= maxMarksValue) newValue = maxMarksValue;
      else if (newValue <= marksValues[0]) newValue = marksValues[0];
      else newValue = newValue < value ? marksValues[marksIndex - 1] : marksValues[marksIndex + 1];
    }
    newValue = clamp(newValue, min, max);
    if (range) {
      // Bound the new value to the thumb's neighbours.
      if (disableSwap) newValue = clamp(newValue, values[index - 1] || -Infinity, values[index + 1] || Infinity);
      const previousValue = newValue;
      newValue = setValueIndex({ values, newValue, index });
      let activeIndex = index;
      // Potentially swap the index if needed.
      if (!disableSwap) activeIndex = newValue.indexOf(previousValue);
      focusThumb({ sliderRef, activeIndex });
    }
    setValueState(newValue);
    setFocusedThumbIndex(index);
    if (handleChange && !areValuesEqual(newValue, valueDerived)) handleChange(event, newValue, index);
    if (onChangeCommitted) onChangeCommitted(event, lastChangedValue.current ?? newValue);
  };

  const inputSlot = slotProps?.input || {};
  const handleInputKeyDown = (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const index = Number(event.currentTarget.getAttribute('data-index'));
      const value = values[index];
      let newValue = null;
      /* Keys that move by more than one step apply only with a step; with
         step={null} the marks are the valid values. */
      if (step != null) {
        const stepSize = event.shiftKey ? shiftStep : step;
        switch (event.key) {
          case 'ArrowUp': newValue = getNewValue(value, stepSize, 1, min, max); break;
          case 'ArrowRight': newValue = getNewValue(value, stepSize, 1, min, max); break;
          case 'ArrowDown': newValue = getNewValue(value, stepSize, -1, min, max); break;
          case 'ArrowLeft': newValue = getNewValue(value, stepSize, -1, min, max); break;
          case 'PageUp': newValue = getNewValue(value, shiftStep, 1, min, max); break;
          case 'PageDown': newValue = getNewValue(value, shiftStep, -1, min, max); break;
          case 'Home': newValue = min; break;
          case 'End': newValue = max; break;
          default: break;
        }
      } else if (markList) {
        const maxMarksValue = marksValues[marksValues.length - 1];
        const currentMarkIndex = marksValues.indexOf(value);
        if (['ArrowLeft', 'ArrowDown', 'PageDown', 'Home'].includes(event.key)) {
          newValue = currentMarkIndex === 0 ? marksValues[0] : marksValues[currentMarkIndex - 1];
        } else if (['ArrowRight', 'ArrowUp', 'PageUp', 'End'].includes(event.key)) {
          newValue = currentMarkIndex === marksValues.length - 1 ? maxMarksValue : marksValues[currentMarkIndex + 1];
        }
      }
      if (newValue != null) changeValue(event, newValue);
    }
    inputSlot.onKeyDown?.(event);
  };
  const handleInputFocus = (event) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    if (isFocusVisible(event.target)) setFocusedThumbIndex(index);
    setOpen(index);
    inputSlot.onFocus?.(event);
  };
  const handleInputBlur = (event) => {
    if (!isFocusVisible(event.target)) setFocusedThumbIndex(-1);
    setOpen(-1);
    inputSlot.onBlur?.(event);
  };
  // A value change from the native input itself (assistive tech, touch).
  const handleInputChange = (event) => {
    inputSlot.onChange?.(event);
    changeValue(event, event.target.valueAsNumber);
  };

  useEnhancedEffect(() => {
    /* Firefox and Safari keep focus on a disabled element. */
    if (disabled && sliderRef.current.contains(document.activeElement)) document.activeElement?.blur();
  }, [disabled]);
  if (disabled && active !== -1) setActive(-1);
  if (disabled && focusedThumbIndex !== -1) setFocusedThumbIndex(-1);

  const previousIndex = useRef(undefined);
  const getFingerNewValue = ({ finger, move = false }) => {
    const { width, height, bottom, left } = sliderRef.current.getBoundingClientRect();
    const percent = isVertical ? (bottom - finger.y) / height : (finger.x - left) / width;
    let newValue = percentToValue(percent, min, max);
    if (step) newValue = roundValueToStep(newValue, step, min);
    else newValue = marksValues[findClosest(marksValues, newValue)];
    newValue = clamp(newValue, min, max);
    let activeIndex = 0;
    if (range) {
      activeIndex = move ? previousIndex.current : findClosest(values, newValue);
      // Bound the new value to the thumb's neighbours.
      if (disableSwap) newValue = clamp(newValue, values[activeIndex - 1] || -Infinity, values[activeIndex + 1] || Infinity);
      const previousValue = newValue;
      newValue = setValueIndex({ values, newValue, index: activeIndex });
      // Potentially swap the index if needed.
      if (!(disableSwap && move)) {
        activeIndex = newValue.indexOf(previousValue);
        previousIndex.current = activeIndex;
      }
    }
    return { newValue, activeIndex };
  };

  const handleTouchMove = useEventCallback((nativeEvent) => {
    const finger = trackFinger(nativeEvent, touchId);
    if (!finger) return;
    moveCount.current += 1;
    // Cancel the move if some other element consumed the mouseup.
    if (nativeEvent.type === 'mousemove' && nativeEvent.buttons === 0) {
      // eslint-disable-next-line no-use-before-define
      handleTouchEnd(nativeEvent);
      return;
    }
    const { newValue, activeIndex } = getFingerNewValue({ finger, move: true });
    focusThumb({ sliderRef, activeIndex, setActive });
    setValueState(newValue);
    if (!dragging && moveCount.current > INTENTIONAL_DRAG_COUNT_THRESHOLD) setDragging(true);
    if (handleChange && !areValuesEqual(newValue, valueDerived)) handleChange(nativeEvent, newValue, activeIndex);
  });
  const handleTouchEnd = useEventCallback((nativeEvent) => {
    const finger = trackFinger(nativeEvent, touchId);
    setDragging(false);
    if (!finger) return;
    const { newValue } = getFingerNewValue({ finger, move: true });
    setActive(-1);
    if (nativeEvent.type === 'touchend') setOpen(-1);
    if (onChangeCommitted) onChangeCommitted(nativeEvent, lastChangedValue.current ?? newValue);
    touchId.current = undefined;
    // eslint-disable-next-line no-use-before-define
    stopListening();
  });
  const stopListening = useEventCallback(() => {
    const doc = sliderRef.current?.ownerDocument || document;
    doc.removeEventListener('mousemove', handleTouchMove);
    doc.removeEventListener('mouseup', handleTouchEnd);
    doc.removeEventListener('touchmove', handleTouchMove);
    doc.removeEventListener('touchend', handleTouchEnd);
  });
  const handleTouchStart = useEventCallback((nativeEvent) => {
    if (disabled) return;
    // Without touch-action: none, the scroll has to be prevented by hand.
    if (!supportsTouchActionNone()) nativeEvent.preventDefault();
    const touch = nativeEvent.changedTouches[0];
    if (touch != null) touchId.current = touch.identifier;
    const finger = trackFinger(nativeEvent, touchId);
    if (finger !== false) {
      const { newValue, activeIndex } = getFingerNewValue({ finger });
      focusThumb({ sliderRef, activeIndex, setActive });
      setValueState(newValue);
      if (handleChange && !areValuesEqual(newValue, valueDerived)) handleChange(nativeEvent, newValue, activeIndex);
    }
    moveCount.current = 0;
    const doc = sliderRef.current.ownerDocument || document;
    doc.addEventListener('touchmove', handleTouchMove, { passive: true });
    doc.addEventListener('touchend', handleTouchEnd, { passive: true });
  });
  useEffect(() => {
    const slider = sliderRef.current;
    slider.addEventListener('touchstart', handleTouchStart, { passive: supportsTouchActionNone() });
    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      stopListening();
    };
  }, [stopListening, handleTouchStart]);
  useEffect(() => { if (disabled) stopListening(); }, [disabled, stopListening]);

  const { onMouseDown: externalMouseDown, style: rootStyle, ...rootRest } = props;
  const handleMouseDown = (event) => {
    externalMouseDown?.(event);
    if (disabled || event.defaultPrevented || event.button !== 0) return;
    // Avoid text selection.
    event.preventDefault();
    const finger = trackFinger(event, touchId);
    if (finger !== false) {
      const { newValue, activeIndex } = getFingerNewValue({ finger });
      focusThumb({ sliderRef, activeIndex, setActive });
      setValueState(newValue);
      if (handleChange && !areValuesEqual(newValue, valueDerived)) handleChange(event, newValue, activeIndex);
    }
    moveCount.current = 0;
    const doc = sliderRef.current.ownerDocument || document;
    doc.addEventListener('mousemove', handleTouchMove, { passive: true });
    doc.addEventListener('mouseup', handleTouchEnd);
  };

  const axis = AXIS[isVertical ? 'vertical' : 'horizontal'];
  const trackOffset = valueToPercent(range ? values[0] : min, min, max);
  const trackLeap = valueToPercent(values[values.length - 1], min, max) - trackOffset;
  const marked = markList.length > 0 && markList.some((mark) => mark.label);
  const sv = isVertical ? ' omni-slv' : '';

  const replaced = typeof sx === 'object' && sx !== null && !Array.isArray(sx)
    ? Object.keys(SX_KEYS).filter((k) => k in sx).map((k) => ' omni-sl-no-' + SX_KEYS[k]).join('')
    : '';
  const vlPos = isVertical ? (valueLabelPosition === 'left' ? ' omni-sl-vl' : ' omni-sl-vr')
    : (valueLabelPosition === 'bottom' ? ' omni-sl-vb' : '');
  const rootProps = {
    className: 'MuiSlider-root' + (disabled ? ' Mui-disabled' : '') + (dragging ? ' MuiSlider-dragging' : '')
      + (marked ? ' MuiSlider-marked' : '') + (isVertical ? ' MuiSlider-vertical' : '') + (isInverted ? ' MuiSlider-trackInverted' : '')
      + ' MuiSlider-colorPrimary MuiSlider-sizeMedium slider-' + variant + ' ' + className
      + ' omni-sl omni-sl-' + sizeKey + ' omni-sl-' + cap(colorKey) + (isInverted ? ' omni-sl-inv' : '') + sv + vlPos + replaced,
    'data-theme': theme || undefined,
    'data-surface': surface || undefined,
    ...rootRest,
    style: rootStyle,
    ref: sliderRef,
    onMouseDown: handleMouseDown,
  };
  const partClass = (base) => base + sv + (isInverted ? ' omni-sl-inv' : '');

  const children = (
    <>
      <span className={partClass('MuiSlider-rail')} />
      <span className={partClass('MuiSlider-track')} style={{ ...axis.offset(trackOffset), ...axis.leap(trackLeap) }} />
      {markList.filter((mark) => mark.value >= min && mark.value <= max).map((mark, index) => {
        const style = axis.offset(valueToPercent(mark.value, min, max));
        const markActive = (!isInverted && (range ? mark.value >= values[0] && mark.value <= values[values.length - 1] : mark.value <= values[0]))
          || (isInverted && (range ? mark.value <= values[0] || mark.value >= values[values.length - 1] : mark.value >= values[0]));
        return (
          <React.Fragment key={index}>
            <span data-index={index} style={style} className={'MuiSlider-mark' + (markActive ? ' MuiSlider-markActive' : '') + sv} />
            {mark.label != null ? (
              <span aria-hidden data-index={index} style={style}
                className={'MuiSlider-markLabel' + (markActive ? ' MuiSlider-markLabelActive' : '') + sv}>
                {mark.label}
              </span>
            ) : null}
          </React.Fragment>
        );
      })}
      {values.map((value, index) => {
        const percent = valueToPercent(value, min, max);
        const showLabel = valueLabelDisplay !== 'off';
        const labelOpen = open === index || active === index || valueLabelDisplay === 'on';
        return (
          <span
            key={index}
            data-index={index}
            className={'MuiSlider-thumb' + (disabled ? ' Mui-disabled' : '') + ' MuiSlider-thumbSizeMedium MuiSlider-thumbColorPrimary'
              + (active === index ? ' Mui-active' : '') + (focusedThumbIndex === index ? ' Mui-focusVisible' : '') + sv}
            style={{ ...axis.offset(percent), pointerEvents: active !== -1 && active !== index ? 'none' : undefined }}
            onMouseOver={() => setOpen(index)}
            onMouseLeave={() => setOpen(-1)}
          >
            <input
              data-index={index}
              aria-label={getAriaLabel ? getAriaLabel(index) : ariaLabel}
              aria-valuenow={scale(value)}
              aria-labelledby={labelledBy}
              aria-valuetext={getAriaValueText ? getAriaValueText(scale(value), index) : ariaValuetext}
              value={values[index]}
              tabIndex={tabIndex}
              aria-orientation={orientation}
              aria-valuemax={scale(max)}
              aria-valuemin={scale(min)}
              name={name}
              type="range"
              min={min}
              max={max}
              step={step === null && safeMarks ? 'any' : step ?? undefined}
              disabled={disabled}
              /* Native `disabled` already blocks interaction, but it also
                 drops the control out of the tab order — so a keyboard user
                 tabs straight past and never learns the slider is there.
                 aria-disabled restores the announcement without re-enabling
                 anything: the native attribute still disables it. */
              {...(disabled ? { 'aria-disabled': 'true' } : {})}
              {...inputSlot}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              style={{
                ...VISUALLY_HIDDEN,
                direction: 'ltr',
                // So VoiceOver's focus indicator matches the thumb's dimensions.
                width: '100%',
                height: '100%',
                writingMode: isVertical ? 'vertical-lr' : undefined,
              }}
            />
            {showLabel && (
              <span className={(labelOpen ? 'MuiSlider-valueLabelOpen ' : '') + 'MuiSlider-valueLabel' + sv} aria-hidden>
                <span className="MuiSlider-valueLabelCircle">
                  <span className="MuiSlider-valueLabelLabel">
                    {typeof valueLabelFormat === 'function' ? valueLabelFormat(scale(value), index) : valueLabelFormat}
                  </span>
                </span>
              </span>
            )}
          </span>
        );
      })}
    </>
  );

  const sliderElement = hasSx(sx)
    ? <SxBox component="span" sx={sx} {...rootProps}>{children}</SxBox>
    : <span {...rootProps}>{children}</span>;

  /* With a label: Figma's SliderField — the Form-Label above or below the
     slider, Sizing-Half apart. The slider keeps 48px either side of its bar
     (Figma's Slider is 104 tall at medium): that is the room its value label
     needs, so the bubble never lands on the field's own label. */
  if (label) {
    const labelEl = (
      <FormLabel id={labelId} disabled={disabled}
        sx={disabled ? { opacity: 'var(--Disabled, 0.38)' } : undefined}>
        {label}
      </FormLabel>
    );
    return (
      <div className={'MuiBox-root slider-field slider-label-' + labelPosition + ' omni-slf' + (isVertical ? ' omni-slf-v' : '')}>
        {labelPosition !== 'bottom' && labelEl}
        {sliderElement}
        {labelPosition === 'bottom' && labelEl}
      </div>
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
