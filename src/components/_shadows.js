// src/components/_shadows.js
//
// Box-shadow recipes that compose the rgba inline with var(--Dropshadow-Color).
// Substitution then happens at the *consuming* element, so themed
// --Dropshadow-Color values (declared on [data-theme="X"][data-surface="Y"]
// blocks in Light/Dark-Mode.css) are picked up correctly.
//
// Why this exists: defining the same shadow as a custom property at :root
// (e.g. --Effect-Level-1) doesn't work because the browser eagerly
// substitutes var(--Dropshadow-Color) at the declaring element (:root),
// baking in the fallback color before the value inherits down. Inlining
// the rgba in JS sidesteps that — every consumer's box-shadow rule has
// the literal var() in it, so resolution happens at the right scope.
//
// Use these in sx props instead of 'var(--Effect-Level-N)'.
//
// Every var(--Dropshadow-Color) carries a fallback RGB triplet so the
// whole box-shadow declaration stays valid even if a consumer renders
// outside a themed scope. Without the fallback, a single unresolved var
// invalidates the entire box-shadow per CSS spec.
const DS = 'var(--Dropshadow-Color, 20, 20, 20)';

export const SHADOW_LEVEL_0 = 'none';

export const SHADOW_LEVEL_1 =
  `0 1px 2px rgba(${DS}, 0.58)`;

// Inner sublayer matches Level-1 (0.58) so Level-2 visually composes
// from a Level-1 base with an additional larger, more diffused layer.
export const SHADOW_LEVEL_2 =
  `0 2px 4px rgba(${DS}, 0.22), 0 1px 2px rgba(${DS}, 0.58)`;

export const SHADOW_LEVEL_3 =
  `0 4px 8px rgba(${DS}, 0.17), 0 2px 4px rgba(${DS}, 0.22)`;

export const SHADOW_LEVEL_4 =
  `0 8px 16px rgba(${DS}, 0.13), 0 4px 8px rgba(${DS}, 0.17)`;

export const SHADOW_LEVEL_5 =
  `0 16px 32px rgba(${DS}, 0.1), 0 8px 16px rgba(${DS}, 0.13)`;

// Keyed map for dynamic level lookup (e.g. SHADOWS[level])
export const SHADOWS = {
  0: SHADOW_LEVEL_0,
  1: SHADOW_LEVEL_1,
  2: SHADOW_LEVEL_2,
  3: SHADOW_LEVEL_3,
  4: SHADOW_LEVEL_4,
  5: SHADOW_LEVEL_5,
};

// ─── Bevel Shadow (chained inset shadows for Button-style highlight/lowlight)
//
// Two inset shadows: a lowlight in the bottom-right and a highlight in the
// top-left, producing a soft 3D bevel on a filled surface. Uses the button
// color tokens (--Buttons-{C}-Highlight, --Buttons-{C}-Lowlight) so the
// bevel tints with the surface color, and scales by `--_bevel` — a value
// the consumer sets per-element as a function of element height.
//
// Consumers must set TWO CSS vars on the element where the bevel renders:
//   --_height   the element's height (e.g. 'var(--Button-Height)' or '20px')
//   --_bevel    calc(var(--Button-Bevel) * var(--_height) / 100)
//
// All vars carry fallbacks so the box-shadow stays valid even if the
// consumer is rendered outside a themed scope or forgets to set --_bevel.
//
// Used by Button (variant + size, applied to root) and Slider (variant +
// handle size, applied to .MuiSlider-thumb::before).
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function bevelShadow(color) {
  const C = cap(color);
  return [
    `inset calc(-1 * var(--_bevel)) calc(-1 * var(--_bevel)) var(--_bevel) rgba(var(--Buttons-${C}-Lowlight, 0, 0, 0), var(--Button-Bevel-Opacity, 0.5))`,
    `inset var(--_bevel) var(--_bevel) var(--_bevel) rgba(var(--Buttons-${C}-Highlight, 0, 0, 0), var(--Button-Bevel-Opacity, 0.5))`,
  ].join(', ');
}
