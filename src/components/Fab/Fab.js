// src/components/Fab/Fab.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import AddIcon from '@omni-design/icons/Add';
import { SHADOW_LEVEL_3, SHADOW_LEVEL_4, bevelShadow, tokenSegment } from '../_shadows';

/**
 * Fab (Floating Action Button) Component
 *
 * VARIANTS:
 *   solid   bg: var(--Buttons-{C}-Button), text: var(--Buttons-{C}-Text), border: var(--Buttons-{C}-Border)
 *
 * There was a `light` variant. It is gone, along with the -Light button shades
 * it named: no design system publishes --Buttons-{C}-Light-Button and the five
 * tokens carried no fallbacks, so every declaration was invalid at computed-
 * value time and the whole variant rendered as an unstyled box. It had never
 * painted anything on any brand.
 *
 * A lighter FAB is a lighter SURFACE, not a lighter button token — put the Fab
 * on data-surface="Surface-Brightest" and keep variant="solid".
 *
 * COLORS: primary, secondary, tertiary, neutral, info, success, warning, error
 *
 * SIZES (Figma-aligned, matched to the Icon scale):
 *   small   32px  (Icon size="small"  → 16px)
 *   medium  48px  (Icon size="medium" → 24px) — default
 *   large   56px  (Icon size="large"  → 32px)
 *
 * EXTENDED: pill shape with icon + label text
 * ANIMATION: pulse ring effect when enabled
 *
 * Accessibility: role="button", aria-label, focus-visible ring
 */

/* No local color map. The one that was here listed eight names and omitted
   both `default` and `black-white`, while falling back to `|| 'Primary'` — so
   those two rendered as primary and looked like a brand whose default and
   black-white simply matched it. tokenSegment is what Button already uses, and
   it knows `black-white` becomes `BlackWhite` rather than `Black-white`,
   which is not a token. */

const FAB_BEVEL_PREFIX = { small: 'Sm-', medium: '', large: 'Lg-' };

/* iconSize is the Icons & Avatars `in-button` size the Figma FAB places its
   Icon at — Component-Size › Button/Button-Icon, 16 / 20 / 32 — not
   FAB-Icon (16 / 24 / 32), which the file binds but the in-button mode
   overrides. The medium FAB's icon was 24 here, 20 in the design. */
const SIZE_MAP = {
  small:  { size: 32, iconSize: 'var(--Sm-Button-Icon, 16px)', fontSize: '13px', px: 12, gap: 6 },
  medium: { size: 48, iconSize: 'var(--Button-Icon, 20px)',    fontSize: '14px', px: 16, gap: 8 },
  large:  { size: 56, iconSize: 'var(--Lg-Button-Icon, 32px)', fontSize: '15px', px: 20, gap: 10 },
};

function getTokens(color) {
  /* `default` on a FAB means TERTIARY, deliberately.
     A FAB is not tied to the button palette: it floats above the content as
     the one primary action, so its resting color is a different palette from
     whatever the default Button is — otherwise it reads as just another button
     that happens to be round.
     This lived in FabShowcase as `color === 'default' ? 'tertiary' : color`,
     which meant the gallery showed the real color and anyone importing Fab
     got --Buttons-Default-*. Every other value passes through untouched. */
  const C = tokenSegment(color === 'default' ? 'tertiary' : color);
  return {
    bg: 'var(--Buttons-' + C + '-Button)',
    text: 'var(--Buttons-' + C + '-Text)',
    border: 'var(--Buttons-' + C + '-Border)',
    hover: 'var(--Buttons-' + C + '-Hover)',
    active: 'var(--Buttons-' + C + '-Pressed)',
  };
}

/* The pulse, read off Figma's FAB-Animation set (9244:7809).
 *
 * It is drawn there as three keyframes, and the shape matters: the ring GROWS
 * at a constant opacity and only THEN fades. It does not do both at once.
 *
 *   Start   stroke 0   opacity 0.5
 *   Middle  stroke 8   opacity 0.5
 *   End     stroke 8   opacity 0
 *
 * This used to spread to 12px while fading to zero by 70%, then collapse back
 * to 0 — a different motion from the one designed, at a different size, at 0.4
 * rather than 0.5.
 *
 * The color is the bigger fix. Figma binds the ring's stroke to the `Button`
 * variable, i.e. the FAB's own fill. This read --pulse-rgb, which NOTHING in
 * the component ever set, so every pulse fell through to the 0,0,0 fallback
 * and rang black regardless of the button's color. --Buttons-<C>-Button is
 * set per color already, so the ring now follows the button it surrounds.
 */
const SxBox = lazySxBox('Fab');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* ─── Static sheet ───
   The palette arrives as custom properties on the button (--_fab-*), set from
   getTokens; everything else is a class. State rules weigh one class + one
   pseudo-class, as emotion's did, so a caller's sx state rule still wins. */
registerStaticStyles('omni-fab', [
  '@keyframes fab-pulse{0%{box-shadow:0 0 0 0 var(--fab-pulse-color)}50%{box-shadow:0 0 0 8px var(--fab-pulse-color)}100%{box-shadow:0 0 0 8px transparent}}',
  '.omni-fab{display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;gap:0;'
    + 'background-color:var(--_fab-bg);color:var(--_fab-fg);border:var(--Button-Border-Width) solid var(--_fab-bd);'
    + `box-shadow:var(--_fab-bevel), ${SHADOW_LEVEL_3};`
    + 'font-family:inherit;font-weight:600;cursor:pointer;opacity:1;outline:none;flex-shrink:0;'
    + 'transition:background-color 0.15s ease, box-shadow 0.2s ease, transform 0.1s ease}',
  /* Bevel sizing — height feeds --_bevel via --Button-Bevel % (matches Button
     + Slider). The FAB's OWN bevel — --FAB-Bevel / --Sm-FAB-Bevel /
     --Lg-FAB-Bevel, the numbers Figma's FAB-Bevel effect style reads. The
     height-derived value stays as the fallback for a design system published
     before these existed; it is the same formula, unrounded, with the same
     min() cap as Button (never more than 20% of the height). */
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-fab-${k}{height:${v.size}px;--_height:${v.size}px;font-size:${v.fontSize};`
    + `--_bevel:var(--${FAB_BEVEL_PREFIX[k]}FAB-Bevel, min(calc(var(--Button-Bevel) * var(--_height) / 100), calc(var(--_height) / 5)))}`),
  // A round FAB, or the extended pill (no width: it hugs its label).
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-fab-c-${k}{width:${v.size}px;border-radius:50%}`),
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-fab-x-${k}{border-radius:${v.size / 2}px;padding-left:${v.px}px;padding-right:${v.px}px;gap:${v.gap}px}`),
  '.omni-fab-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  `.omni-fab-h:hover{background-color:var(--_fab-h);box-shadow:var(--_fab-bevel), ${SHADOW_LEVEL_4}}`,
  /* Pressed changes the fill only. Figma's Pressed FAB keeps the resting FAB
     elevation and its full size. */
  `.omni-fab-a:active{background-color:var(--_fab-a);box-shadow:var(--_fab-bevel), ${SHADOW_LEVEL_3}}`,
  /* 2px ring 1px outside — the same ring as every other component. */
  '.omni-fab-f:focus-visible,.omni-fab-f.Mui-focusVisible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  /* 50% of the button's own color — Figma's Start and Middle both sit at
     opacity 0.5. The loop stops outright under prefers-reduced-motion (WCAG
     2.2.2): the duration tokens cannot carry a 2s breath, so it is not
     shortened, it is stopped. */
  '.omni-fab-pulse{--fab-pulse-color:color-mix(in srgb, var(--_fab-bg) 50%, transparent);'
    + 'animation:fab-pulse 2s var(--Motion-Easing-Standard, ease) infinite}',
  '@media (prefers-reduced-motion: reduce){.omni-fab-pulse.omni-fab-calm{animation:none}}',
  '.omni-fab-icon{display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;color:inherit}',
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-fab-icon-${k}{font-size:${v.iconSize}}`),
  '.omni-fab-icon .MuiSvgIcon-root{font-size:inherit;color:inherit}',
  '.omni-fab-label{white-space:nowrap;line-height:1}',
].join('\n'));

/* forwardRef, so a Tooltip (SpeedDial's action labels) can anchor to the
   button. It returned a fragment with no ref, so MUI's Tooltip had nothing to
   measure and warned "Expected an element that can hold a ref". */
export const Fab = React.forwardRef(function Fab({
  children,
  icon,
  label,
  variant = 'solid',
  /* `default`, which for a FAB resolves to the TERTIARY palette — see
     getTokens. Figma does not pin the color: it comes from the Buttons MODE
     set on the frame, and that collection's ten modes are the list this prop
     takes. */
  color = 'default',
  size = 'medium',
  extended = false,
  animate = false,
  disabled = false,
  onClick,
  ariaLabel,
  className = '',
  sx,
  style,
  ...props
}, ref) {
  useStaticStyles('omni-fab');
  /* `variant` stays as a prop so an existing variant="solid" keeps working and
     does not fall through ...props onto the <button> as an unknown attribute.
     Anything else normalises to solid — there is only one variant now. */
  if (process.env.NODE_ENV !== 'production' && variant !== 'solid') {
    // eslint-disable-next-line no-console
    console.warn(
      '[Fab] variant="' + variant + '" is not a Fab variant; rendering solid. '
      + 'The light variant was removed with the -Light button shades — it named '
      + 'tokens no design system publishes, so it rendered as an unstyled box. '
      + 'For a lighter FAB, put it on data-surface="Surface-Brightest".',
    );
  }
  const effectiveVariant = 'solid';
  const tokens = getTokens(color);
  /* The bevel's highlight / lowlight come from the SAME palette as the fill.
     It was handed `color` raw, so a default FAB — filled Tertiary — wore the
     Default button's highlight and lowlight: a teal edge on an orange FAB. */
  const palette = color === 'default' ? 'tertiary' : color;
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const iconEl = icon || children || <AddIcon sx={{ fontSize: s.iconSize }} />;

  const effectiveLabel = ariaLabel || label || 'Action';

  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const own = (key) => hasSx(sx) && typeof sx === 'object' && !Array.isArray(sx) && sx[key] !== undefined;
  const vars = {
    '--_fab-bg': tokens.bg, '--_fab-fg': tokens.text, '--_fab-bd': tokens.border,
    '--_fab-h': tokens.hover, '--_fab-a': tokens.active, '--_fab-bevel': bevelShadow(palette),
  };
  const rootProps = {
    ref,
    type: 'button',
    role: 'button',
    'aria-label': effectiveLabel,
    onClick,
    disabled,
    className: 'fab fab-' + effectiveVariant + ' fab-' + color + ' fab-' + size +
      (extended ? ' fab-extended' : '') +
      (animate ? ' fab-animate' : '') +
      (disabled ? ' fab-disabled' : '') +
      ' omni-fab omni-fab-' + sizeKey + (extended ? ' omni-fab-x-' : ' omni-fab-c-') + sizeKey +
      (disabled ? ' omni-fab-off' : '') +
      /* A caller's sx state key REPLACED the Fab's own (one sx object), so
         with one the matching static state rule stays off. */
      (!disabled && !own('&:hover') ? ' omni-fab-h' : '') +
      (!disabled && !own('&:active') ? ' omni-fab-a' : '') +
      (!own('&:focus-visible, &.Mui-focusVisible') ? ' omni-fab-f' : '') +
      (animate && !disabled ? ' omni-fab-pulse' + (!own('@media (prefers-reduced-motion: reduce)') ? ' omni-fab-calm' : '') : '') +
      (className ? ' ' + className : ''),
    style: { ...vars, ...style },
    ...props,
  };
  const content = (
    <>
      {/* Icon */}
      <div className={'omni-fab-icon omni-fab-icon-' + sizeKey}>
        {iconEl}
      </div>

      {/* Extended label */}
      {extended && label && (
        <span className="omni-fab-label">
          {label}
        </span>
      )}
    </>
  );

  return hasSx(sx)
    ? <SxBox component="button" sx={sx} {...rootProps}>{content}</SxBox>
    : <button {...rootProps}>{content}</button>;
});

export default Fab;
