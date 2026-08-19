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

// ─── Layered shadow geometry (Shadow Palette model, as built in Figma) ───────
// MUST stay identical to the studio generator at
// dinodesign-studio/src/utils/dropshadow.ts (LEVEL_LAYERS) and the Figma effect
// styles. Level N stacks N layers with growing offset (angled: offsetX =
// offsetY/2, blur = offsetY, NO spread). Layer i uses --Dropshadow-Color-(i+1)
// — tight contact = Color-1 (strongest), larger layers = higher/fainter tokens.
// Each color falls back to the aggregate --Dropshadow-Color at that token's
// alpha so the box-shadow stays valid outside a themed scope. Tuples are
// [offsetX, offsetY, blur].
const _LEVEL_LAYERS = {
  1: [[0.5, 1, 1]],
  2: [[1, 2, 2], [2, 4, 4]],
  3: [[1, 2, 2], [2, 4, 4], [3, 6, 6]],
  4: [[1, 2, 2], [2, 4, 4], [4, 8, 8], [8, 16, 16]],
  5: [[1, 2, 2], [2, 4, 4], [4, 8, 8], [8, 16, 16], [16, 32, 32]],
};
const _ALPHAS = [0.20, 0.17, 0.15, 0.13, 0.11];

function _buildShadow(level) {
  return _LEVEL_LAYERS[level]
    .map(([x, y, blur], i) => {
      const n = i + 1;
      const color = `var(--Dropshadow-Color-${n}, rgba(${DS}, ${_ALPHAS[i]}))`;
      return `${x}px ${y}px ${blur}px ${color}`;
    })
    .join(', ');
}

export const SHADOW_LEVEL_0 = 'none';
export const SHADOW_LEVEL_1 = _buildShadow(1);
export const SHADOW_LEVEL_2 = _buildShadow(2);
export const SHADOW_LEVEL_3 = _buildShadow(3);
export const SHADOW_LEVEL_4 = _buildShadow(4);
export const SHADOW_LEVEL_5 = _buildShadow(5);

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

// Colour names whose TOKEN segment is not just the capitalised prop.
// `black-white` would capitalise to `Black-white` and point at a token that
// does not exist; the design system emits --Buttons-BlackWhite-*.
export const TOKEN_SEGMENT = { 'black-white': 'BlackWhite' };
export const tokenSegment = (color) => TOKEN_SEGMENT[color] || cap(color);

export function bevelShadow(color) {
  const C = tokenSegment(color);
  // The 4th value (spread) is a NEGATIVE --_bevel. Without it the inset shadow
  // blooms out to offset+blur (~2×--_bevel) and reads far too large; the
  // negative spread pulls it back so the highlight/lowlight stay a tight edge.
  //
  // Highlight/Lowlight are full COLORS (hex). Opacity is applied via color-mix
  // with --Button-Bevel-Opacity — NOT rgba(), which would reject a hex token
  // and silently fall back to black (the cause of the over-dark hosted bevel).
  // Lowlight falls back to black, highlight to white.
  const mix = (token, fallback) =>
    `color-mix(in srgb, var(${token}, ${fallback}) calc(var(--Button-Bevel-Opacity, 0.5) * 100%), transparent)`;
  return [
    `inset calc(-1 * var(--_bevel)) calc(-1 * var(--_bevel)) var(--_bevel) calc(-1 * var(--_bevel)) ${mix(`--Buttons-${C}-Lowlight`, 'black')}`,
    `inset var(--_bevel) var(--_bevel) var(--_bevel) calc(-1 * var(--_bevel)) ${mix(`--Buttons-${C}-Highlight`, 'white')}`,
  ].join(', ');
}
