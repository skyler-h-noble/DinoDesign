// src/components/ToggleButton/ToggleButton.js
import React, { useState } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/* One state table for every toggle.

   These selectors were copy-pasted into seven sx blocks — the single button,
   the generic group, and the five preset groups. That is why hover was the
   ONLY state any of them had: adding pressed or focus-visible meant making the
   same edit seven times and keeping it in step forever, so nobody did.

   Three things were also wrong in all seven copies at once, which is the other
   half of the argument for having one:
     - hover painted --Container-High, a CONTAINER level, where the rest of the
       lib uses the surface scrim --Hover / --Pressed for a control with no
       fill of its own;
     - selected hover repainted --Buttons-Primary-Button, the resting color,
       so a selected segment gave no feedback at all;
     - selected text was the literal '#fff', which is wrong on any brand whose
       primary is light enough to need dark text.

   The group presets that shared it (and the showcase) moved to
   ToggleButtonPresets.js; they were never part of the package. */

// --- Static sheet ------------------------------------------------------------
//
// ToggleButton was MUI's ToggleButton (ButtonBase) with an sx. It is its own
// <button> now; this sheet carries both layers — what ButtonBase and
// ToggleButton gave the root, then the design's state table — at the weights
// emotion's rules had (one class, plus one state for a state rule), in the
// same order, so a caller's sx still wins over them. Same classes as MUI's
// (MuiToggleButton-root, Mui-selected …) so a consumer's rule still lands.
// MUI's press ripple is not drawn (it is not in the Figma set).
//
// A caller's sx key that the component's own sx also had REPLACED that whole
// nested object when both were one sx; .omni-tg-no-<key> drops ours so the
// caller's alone applies, as it did.
const SxBox = lazySxBox('ToggleButton');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SX_KEYS = { '&:hover': 'hover', '&:active': 'active', '&.Mui-focusVisible': 'focus', '&.Mui-disabled': 'disabled', '&.Mui-selected': 'selected' };
const solo = (key) => `.omni-tg-solo:where(:not(.omni-tg-no-${key}))`;
const MUI_FONT = '"Roboto","Helvetica","Arial",sans-serif';
const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

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
registerStaticStyles('omni-toggle-button', wk([
  /* ButtonBase. */
  '.omni-tg{display:inline-flex;align-items:center;justify-content:center;position:relative;box-sizing:border-box;'
    + '-webkit-tap-highlight-color:transparent;background-color:transparent;outline:0;border:0;margin:0;border-radius:0;padding:0;cursor:pointer;'
    + 'user-select:none;vertical-align:middle;-moz-appearance:none;-webkit-appearance:none;text-decoration:none;color:inherit}',
  '.omni-tg::-moz-focus-inner{border-style:none}',
  '.omni-tg.Mui-disabled{pointer-events:none;cursor:default}',
  '@media print{.omni-tg{print-color-adjust:exact}}',
  /* ToggleButton (MUI's button type, its divider edge and action colours). */
  `.omni-tg{font-family:${MUI_FONT};font-weight:500;font-size:0.875rem;line-height:1.75;letter-spacing:0.02857em;text-transform:uppercase;`
    + 'border-radius:4px;padding:11px;border:1px solid rgba(0, 0, 0, 0.12);color:rgba(0, 0, 0, 0.54)}',
  '.omni-tg.Mui-disabled{color:rgba(0, 0, 0, 0.26);border:1px solid rgba(0, 0, 0, 0.12)}',
  '.omni-tg:hover{text-decoration:none;background-color:rgba(0, 0, 0, 0.04)}',
  '@media (hover: none){.omni-tg:hover{background-color:transparent}}',
  '.omni-tg-full{width:100%}',
  '.omni-tg-small{padding:7px;font-size:0.8125rem}',
  '.omni-tg-large{padding:15px;font-size:0.9375rem}',
  /* The design's state table. */
  '.omni-tg-solo{border:1px solid var(--Border);color:var(--Text);background-color:transparent;text-transform:none;font-weight:500}',
  `${solo('hover')}:hover{background-color:var(--Hover)}`,
  after(`${solo('active')}:active{background-color:var(--Pressed)}`, '.omni-tg-solo', 'omni-tg-no-', ['hover']),
  /* Segments sit edge to edge, so an un-raised ring is overdrawn by the
     neighbour's border on one side and looks like a three-sided box. */
  after(`${solo('focus')}.Mui-focusVisible{outline:2px solid var(--Focus-Visible);outline-offset:2px;z-index:1}`, '.omni-tg-solo', 'omni-tg-no-', ['hover', 'active']),
  after(`${solo('disabled')}.Mui-disabled{color:var(--Quiet);opacity:var(--Disabled, 0.38)}`, '.omni-tg-solo', 'omni-tg-no-', ['hover', 'active', 'focus']),
  after(`${solo('selected')}.Mui-selected{background-color:var(--Buttons-Primary-Button);color:var(--Buttons-Primary-Text)}`, '.omni-tg-solo', 'omni-tg-no-', ['hover', 'active', 'focus', 'disabled']),
  after(`${solo('selected')}.Mui-selected:hover{background-color:var(--Buttons-Primary-Hover)}`, '.omni-tg-solo', 'omni-tg-no-', ['hover', 'active', 'focus', 'disabled']),
  after(`${solo('selected')}.Mui-selected:active{background-color:var(--Buttons-Primary-Pressed)}`, '.omni-tg-solo', 'omni-tg-no-', ['hover', 'active', 'focus', 'disabled']),
].join('\n')));

/* What MUI's ButtonBase did with focus: Mui-focusVisible while the button has
   :focus-visible (keyboard focus), so the ring shows for keyboard users and
   not on click. */
function matchesFocusVisible(el) {
  try { return el.matches(':focus-visible'); } catch (e) { return false; }
}

/**
 * ToggleButton Component
 * Single toggle button with design system styling
 *
 * Design System Integration:
 * - Border: var(--Border)
 * - Background: Transparent or var(--Buttons-Primary-Button)
 * - Text: var(--Text)
 *
 * WCAG 2.1 Accessibility:
 * - aria-pressed carries the state
 * - Keyboard accessible (a native button)
 * - Visual feedback on toggle
 * - Sufficient contrast
 *
 * @param {React.ReactNode} children - Button content (text or icon)
 * @param {boolean} selected - Button selected state
 * @param {function} onChange - Selection change handler, (event, value)
 * @param {string} value - Button value
 * @param {object} props - Additional props
 */
export const ToggleButton = React.forwardRef(function ToggleButton({
  children,
  selected = false,
  onChange,
  onClick,
  value,
  sx = {},
  /* MUI ToggleButton's own props, which it read rather than forwarded. */
  color = 'standard',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  disableFocusRipple,
  disableRipple,
  tabIndex = 0,
  className,
  onFocus,
  onBlur,
  ...props
}, ref) {
  useStaticStyles('omni-toggle-button');
  const [focusVisible, setFocusVisible] = useState(false);
  if (disabled && focusVisible) setFocusVisible(false);

  const handleClick = (event) => {
    if (onClick) {
      onClick(event, value);
      if (event.defaultPrevented) return;
    }
    if (onChange) onChange(event, value);
  };
  const handleFocus = (event) => {
    if (matchesFocusVisible(event.target)) setFocusVisible(true);
    if (onFocus) onFocus(event);
  };
  const handleBlur = (event) => {
    if (!matchesFocusVisible(event.target)) setFocusVisible(false);
    if (onBlur) onBlur(event);
  };

  const replaced = typeof sx === 'object' && sx !== null && !Array.isArray(sx)
    ? Object.keys(SX_KEYS).filter((k) => k in sx).map((k) => ' omni-tg-no-' + SX_KEYS[k]).join('')
    : '';
  const sizeClass = size === 'small' || size === 'large' ? ' omni-tg-' + size : '';
  const rootProps = {
    ref,
    type: 'button',
    disabled,
    tabIndex: disabled ? -1 : tabIndex,
    value,
    'aria-pressed': selected,
    className: 'MuiButtonBase-root MuiToggleButton-root' + (selected ? ' Mui-selected' : '') + (disabled ? ' Mui-disabled' : '')
      + (fullWidth ? ' MuiToggleButton-fullWidth' : '') + ' MuiToggleButton-size' + capFirst(size) + ' MuiToggleButton-' + color
      + (focusVisible ? ' Mui-focusVisible' : '') + (className ? ' ' + className : '')
      + ' omni-tg omni-tg-solo' + (fullWidth ? ' omni-tg-full' : '') + sizeClass + replaced,
    ...props,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
  return hasSx(sx)
    ? <SxBox component="button" sx={sx} {...rootProps}>{children}</SxBox>
    : <button {...rootProps}>{children}</button>;
});

/**
 * DisabledToggleButton Component
 * Toggle button in disabled state
 *
 * @param {object} props - Toggle button props
 */
export function DisabledToggleButton({
  children,
  selected = false,
  sx = {},
  ...props
}) {
  /* Was a literal 0.5 — one of ten different disabled opacities the lib had
     picked independently. The token is what Figma binds. */
  return (
    <ToggleButton disabled selected={selected} sx={sx} {...props}>
      {children}
    </ToggleButton>
  );
}

export default ToggleButton;
