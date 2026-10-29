// src/components/NumberField/FieldButton.js
import React from 'react';
import { SHADOW_LEVEL_1 } from '../_shadows';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * FieldButton — the stepper button a NumberField is built from.
 *
 * Figma's `Field Button` set (6850:28584): Style ghost | outline x State.
 *
 *   size     --FieldButton-Height x --FieldButton-Width (and --Sm- / --Lg-),
 *            Figma's Button/FieldButton-Height and -Width; the height is the
 *            button height, the width falls back to 40 / 48 / 64 — the icon plus even
 *            padding, so the button scales with its height instead of being a
 *            48px sliver at small and taller than wide at large
 *   corner   --Input-Radius, the field it belongs to
 *   icon     the in-button size, --Button-Icon (16 / 20 / 32), in --Icons-Default (Figma's Icons/Icon, Default mode)
 *   ghost    no edge; rests on the surface's --Hover, --Pressed when pressed
 *   outline  1px --Buttons-<C>-Border, inside, on --Buttons-<C>-Button;
 *            --Buttons-<C>-Hover / -Pressed for those states
 *   Hover    the Buttons-Hover lift (Level 1)
 *   Focus    the rest fill under a 3px ring INSIDE the button (1px in from a
 *            ghost's edge, 2px in from an outline's) — the button sits in a
 *            clipped field, where a ring drawn outside would be cut off
 *   Disabled the rest fill at 38%
 */
const PREFIX = { small: 'Sm-', medium: '', large: 'Lg-' };
const HEIGHT = { small: 'var(--Small-Button-Height, 24px)', medium: 'var(--Button-Height, 32px)', large: 'var(--Large-Button-Height, 56px)' };
const WIDTH = { small: '40px', medium: '48px', large: '64px' };
const ICON = { small: '16px', medium: '20px', large: '32px' };

/* Static sheet — the MUI Box sx this button was, as plain rules. The palette
   of an outline button arrives as custom properties declared on the button
   itself (--_fb-bd / -bt / -hv / -pr), so they resolve where the sx did.
   State rules weigh one class + one pseudo-class, as emotion's did, and stay
   off a disabled button (.omni-fb-off) as the sx left them out. A caller's sx
   key for one of those states REPLACED the component's whole object when both
   were one sx; .omni-fb-no-<key> drops ours so the caller's alone applies. */
const SxBox = lazySxBox('FieldButton');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SX_KEYS = { '&:hover': 'hover', '&:active': 'active', '&:focus-visible, &.Mui-focusVisible': 'focus', '& .MuiSvgIcon-root': 'svg' };
const live = (key, extra = '') => `.omni-fb:where(${extra}:not(.omni-fb-off):not(.omni-fb-no-${key}))`;
const RING = 'inset 0 0 0 1px var(--_fb-bd)';

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
/* A caller's sx key that replaced one of ours kept OUR key's place in the
   merged object, so our later keys still came after it and won ties. Each
   later rule is repeated one class heavier for an instance where an earlier
   key was replaced, which puts it back over the caller's (emotion's, inserted
   after this sheet). */
const after = (rule, root, prefix, earlier) => {
  const i = rule.indexOf('{');
  const sels = rule.slice(0, i).split(',');
  const extra = [];
  for (const k of earlier) for (const sel of sels) if (sel.startsWith(root)) extra.push(root + '.' + prefix + k + sel.slice(root.length));
  return [...sels, ...extra].join(',') + rule.slice(i);
};
registerStaticStyles('omni-field-button', wk([
  '.omni-fb{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;box-sizing:border-box;margin:0;padding:0;border:none;'
    + 'box-shadow:none;background-color:var(--Hover);color:var(--Icons-Default, var(--Text));cursor:pointer;opacity:1;outline:none;'
    + 'transition:background-color 0.15s ease, box-shadow 0.15s ease}',
  ...Object.keys(PREFIX).map((size) => {
    const p = PREFIX[size];
    return `.omni-fb-${size}{width:var(--${p}FieldButton-Width, ${WIDTH[size]});height:var(--${p}FieldButton-Height, ${HEIGHT[size]});`
      + `border-radius:var(--${p}Input-Radius, var(--Input-Radius, 4px));font-size:var(--${p}Button-Icon, ${ICON[size]})}`;
  }),
  `.omni-fb-outline{box-shadow:${RING};background-color:var(--_fb-bt)}`,
  '.omni-fb-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  '.omni-fb:where(:not(.omni-fb-no-svg)) .MuiSvgIcon-root{font-size:inherit;color:inherit}',
  `${live('hover')}:hover{background-color:var(--Hover);box-shadow:${SHADOW_LEVEL_1}}`,
  `${live('hover', '.omni-fb-outline')}:hover{background-color:var(--_fb-hv);box-shadow:${RING}, ${SHADOW_LEVEL_1}}`,
  after(`${live('active')}:active{background-color:var(--Pressed);box-shadow:none}`, '.omni-fb', 'omni-fb-no-', ['hover']),
  after(`${live('active', '.omni-fb-outline')}:active{background-color:var(--_fb-pr);box-shadow:${RING}}`, '.omni-fb', 'omni-fb-no-', ['hover']),
  after(`${live('focus')}:focus-visible,${live('focus')}.Mui-focusVisible{background-color:var(--Hover);outline:3px solid var(--Focus-Visible);outline-offset:-4px}`, '.omni-fb', 'omni-fb-no-', ['hover', 'active']),
  after(`${live('focus', '.omni-fb-outline')}:focus-visible,${live('focus', '.omni-fb-outline')}.Mui-focusVisible{background-color:var(--_fb-bt);outline-offset:-5px}`, '.omni-fb', 'omni-fb-no-', ['hover', 'active']),
].join('\n')));

export const FieldButton = React.forwardRef(function FieldButton({
  variant = 'ghost',
  color = 'default',
  size = 'medium',
  disabled = false,
  children,
  className = '',
  sx = {},
  style,
  ...props
}, ref) {
  useStaticStyles('omni-field-button');
  const sizeKey = PREFIX[size] !== undefined ? size : 'medium';
  const C = color.charAt(0).toUpperCase() + color.slice(1);
  const outline = variant === 'outline';
  const sxOn = hasSx(sx);
  const replaced = sxOn && typeof sx === 'object' && !Array.isArray(sx)
    ? Object.keys(SX_KEYS).filter((k) => k in sx).map((k) => ' omni-fb-no-' + SX_KEYS[k]).join('')
    : '';
  const rootProps = {
    ref,
    type: 'button',
    disabled,
    className: 'MuiBox-root field-button field-button-' + variant + ' ' + className
      + ' omni-fb omni-fb-' + sizeKey + (outline ? ' omni-fb-outline' : '') + (disabled ? ' omni-fb-off' : '') + replaced,
    style: outline ? {
      '--_fb-bd': 'var(--Buttons-' + C + '-Border)',
      '--_fb-bt': 'var(--Buttons-' + C + '-Button)',
      '--_fb-hv': 'var(--Buttons-' + C + '-Hover)',
      '--_fb-pr': 'var(--Buttons-' + C + '-Pressed)',
      ...style,
    } : style,
    ...props,
  };
  return sxOn
    ? <SxBox component="button" sx={sx} {...rootProps}>{children}</SxBox>
    : <button {...rootProps}>{children}</button>;
});

export default FieldButton;
