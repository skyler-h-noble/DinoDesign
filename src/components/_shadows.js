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

// ─── Layered shadow geometry ────────────────────────────────────────────────
//
// A FALLBACK ONLY. The brand's own --Effect-Level-N wins wherever a design
// system is loaded (see _token below); this table is what a consumer sees with
// no design system at all.
//
// It used to say it "MUST stay identical" to the studio generator. That is no
// longer possible and was already false: the studio's shadows are now
// parameterised by the user's Shadow controls (intensity, crispy, resolution,
// light position), so there is no single geometry to match. These values are
// that generator at its DEFAULT settings, regenerated from it — a sensible
// stand-in rather than a promise of equality.
//
// Tuples are [offsetX, offsetY, blur, spread, alpha]. Alpha ramps DOWN across
// the layers, which is Comeau's shadow-palette model: one colour, the contact
// layer strongest, each layer out fainter and wider.
const _LEVEL_LAYERS = {
  1: [[0.3, 0.5, 0.7, 0, 0.41], [1.3, 2.5, 3.4, -1.2, 0.205]],
  2: [[0.3, 0.5, 0.7, 0, 0.41], [0.6, 1.2, 1.6, -1.2, 0.273], [3, 6, 8.1, -2.5, 0.137]],
  3: [[0.3, 0.5, 0.7, 0, 0.41], [0.3, 0.7, 0.9, -0.6, 0.328], [1, 2, 2.7, -1.2, 0.246], [2.8, 5.6, 7.5, -1.9, 0.164], [6.3, 12.5, 16.9, -2.5, 0.082]],
  4: [[0.3, 0.5, 0.7, 0, 0.41], [0.4, 0.7, 1, -0.5, 0.342], [1.2, 2.4, 3.2, -1, 0.273], [3.4, 6.9, 9.3, -1.5, 0.205], [7.8, 15.6, 21.1, -2, 0.137], [15, 30, 40.5, -2.5, 0.068]],
  5: [[0.3, 0.5, 0.7, 0, 0.41], [0.4, 0.7, 1, -0.4, 0.359], [1.1, 2.2, 3, -0.7, 0.308], [3.1, 6.3, 8.5, -1.1, 0.256], [7.1, 14.2, 19.2, -1.4, 0.205], [13.6, 27.3, 36.8, -1.8, 0.154], [23.4, 46.8, 63.2, -2.1, 0.103], [37, 74, 99.9, -2.5, 0.051]],
};

/* One colour, per-layer alpha — NOT one token per level.
   This previously built `var(--Dropshadow-Color-${level}, …)`. Those five
   per-level colour tokens no longer exist: the design system collapsed them to
   a single --Dropshadow-Color plus per-layer opacity, so every reference
   resolved to the neutral 20,20,20 fallback and every shadow in the library
   came out grey. */
function _buildShadow(level) {
  return _LEVEL_LAYERS[level]
    .map(function (t) {
      return t[0] + 'px ' + t[1] + 'px ' + t[2] + 'px ' + t[3] + 'px rgba(' + DS + ', ' + t[4] + ')';
    })
    .join(', ');
}

/* Read the BRAND's recipe, fall back to the geometry above.
 *
 * The design system publishes --Effect-Level-0 through --Effect-Level-5. The
 * token comes FIRST so the brand wins; the literal is what a consumer with no
 * design system loaded sees, which is the one case a var() fallback fires.
 *
 * A var() fallback may contain commas, so a multi-layer recipe nests safely.
 */
const _token = (level, literal) =>
  level === 0 ? 'none' : 'var(--Effect-Level-' + level + ', ' + literal + ')';

/* The SHADOW_LEVEL_N exports are token-first too.
 *
 * They used to be the bare literal, and only the SHADOWS map below wrapped
 * them in the token — but twelve components import SHADOW_LEVEL_N directly
 * (Card, AppBar, Drawer, Alert, Accordion, Input, Snackbar, Toolbar, Fab,
 * Slider, Autocomplete, and this file). Every one of them therefore rendered
 * the library's own geometry and ignored the brand's --Effect-Level-N, which
 * is exactly the bug the SHADOWS map was added to fix — the fix just never
 * reached the components that needed it.
 *
 * Wrapping here fixes all twelve at once and keeps SHADOWS identical, so no
 * consumer has to change. */
export const SHADOW_LEVEL_0 = 'none';
export const SHADOW_LEVEL_1 = _token(1, _buildShadow(1));
export const SHADOW_LEVEL_2 = _token(2, _buildShadow(2));
export const SHADOW_LEVEL_3 = _token(3, _buildShadow(3));
export const SHADOW_LEVEL_4 = _token(4, _buildShadow(4));
export const SHADOW_LEVEL_5 = _token(5, _buildShadow(5));

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

// Token prefix per button size, matching the design system's
// --Sm-Button-* / --Button-* / --Lg-Button-* naming.
const BEVEL_PREFIX = { small: 'Sm-', medium: '', large: 'Lg-' };

/**
 * The bevel's two inset shadows.
 *
 * `size` ('small' | 'medium' | 'large') opts into the design system's
 * per-size geometry tokens — eight literal lengths per size, generated from
 * the same module that writes the Figma variables, so the two artifacts carry
 * identical numbers. Each one falls back to the value the lib derives from
 * --_bevel, which is what older design systems (and any caller with no size
 * token to point at) keep using.
 *
 * Callers with a height that no size token describes — the Fab's diameter, the
 * Slider's thumb — pass no size and stay entirely on the derived path.
 */
export function bevelShadow(color, size) {
  const C = tokenSegment(color);

  // Highlight/Lowlight are RGB TRIPLETS, not colors — `239, 228, 241`, the
  // same convention --Dropshadow-Color uses. They have to be wrapped in rgb()
  // before anything can consume them.
  //
  // Dropping a bare triplet straight into color-mix() does NOT fall back and
  // does NOT throw: `color-mix(in srgb, 239, 228, 241 100%, transparent)`
  // parses as garbage, which invalidates the whole box-shadow declaration and
  // takes the bevel to `none`. That is why hosted buttons rendered flat while
  // the studio's rendered beveled.
  //
  // Opacity rides on color-mix with --Button-Bevel-Opacity. Fallbacks are
  // triplets too (black for the lowlight, white for the highlight) so an
  // unthemed consumer still gets a valid shadow.
  const mix = (token, fallback) =>
    `color-mix(in srgb, rgb(var(${token}, ${fallback})) calc(var(--Button-Bevel-Opacity, 0.5) * 100%), transparent)`;

  // Derived geometry — the fallback for every slot below.
  //
  // The 4th value (spread) is a NEGATIVE --_bevel. Without it the inset shadow
  // blooms out to offset+blur (~2×--_bevel) and reads far too large; the
  // negative spread pulls it back so the highlight/lowlight stay a tight edge.
  const B = 'var(--_bevel)';
  const NEG = 'calc(-1 * var(--_bevel))';

  // With a size, each slot reads its token and keeps the derived value as its
  // own fallback, so a partially-populated design system degrades per value.
  const prefix = BEVEL_PREFIX[size];
  const geo = prefix === undefined
    ? (_slot, derived) => derived
    : (slot, derived) => `var(--${prefix}Button-${slot}, ${derived})`;

  // Highlight sits top-left (positive offsets), lowlight bottom-right.
  return [
    `inset ${geo('Lowlight-Offset-x', NEG)} ${geo('Lowlight-Offset-y', NEG)} ` +
      `${geo('Lowlight-Blur-Radius', B)} ${geo('Lowlight-Spread', NEG)} ` +
      mix(`--Buttons-${C}-Lowlight`, '0 0 0'),
    `inset ${geo('Highlight-Offset-x', B)} ${geo('Highlight-Offset-y', B)} ` +
      `${geo('Highlight-Blur-Radius', B)} ${geo('Highlight-Spread', NEG)} ` +
      mix(`--Buttons-${C}-Highlight`, '255 255 255'),
  ].join(', ');
}
