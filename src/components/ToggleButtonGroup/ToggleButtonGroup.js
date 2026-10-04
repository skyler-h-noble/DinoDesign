// src/components/ToggleButtonGroup/ToggleButtonGroup.js
//
// A group of segments with a VALUE. At least one is always selected.
//
// ─── UN-RETIRED, and why the retirement was wrong ───────────────────────────
//
// This file was a shim onto ButtonGroup, on the reasoning that the two were
// "one concept implemented twice": same row of segments, same palette fill on
// the selected one, same removed `{color}-light`. Every one of those
// observations was true, and they were all about RENDERING.
//
// The concepts differ:
//
//   ButtonGroup        a row of buttons that happen to be joined. Save,
//                      Cancel, Delete. Nothing is selected, because none of
//                      them is a state — they are three things you can do.
//
//   ToggleButtonGroup  a control with a value, and at least one segment on.
//                      Left / centre / right alignment: the text is aligned
//                      somehow whatever you click, so "none selected" is not a
//                      state the thing being controlled can be in.
//
// One is layout and the other is state. That is also why a Figma Button Group
// could not be converted deterministically — not because nothing distinguished
// the two components, but because the distinction had been removed from the
// code while the design kept it.
//
// ─── What this file is now ──────────────────────────────────────────────────
//
// The selection component. It renders ButtonGroup, which owns the geometry
// (joined edges, end-cap radii, fit, the Buttons-table colours), and supplies
// the behaviour ButtonGroup no longer claims: a value, and a floor of one.
//
// `allowEmpty` defaults to FALSE here and true there. That one line is the
// whole difference in behaviour, and it is the definition of "toggle".
//
// ─── The MUI-shaped props are still translated ──────────────────────────────
//
// `exclusive` and an (event, value) onChange came from MUI's component and
// shipped publicly, so they keep working and keep warning. Two things to know:
//
//   exclusive   is `multiple` inverted. MUI's default is non-exclusive; this
//               component's default is single-select, so `exclusive` defaults
//               to true here.
//
//   onChange    MUI's order is (event, value); this system's is (value,
//               event). Not swapping them hands a caller an event where it
//               expects a value — no error, no warning, just a selection that
//               never updates.
//
// `variant` is the sharp one: it named the COLOUR on MUI's component and names
// the SHAPE on this one. A caller passing `variant="primary"` means the
// colour; a caller passing `variant="outlined"` means the shape. Both are
// accepted and told apart by value, because there is no version of this that
// does not silently repaint somebody's group.
import React from 'react';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { Button } from '../Button/Button';

/* The three SHAPE values. Anything else in `variant` is a colour from the
   MUI-shaped API, which is how the two meanings are told apart without asking
   the caller to migrate first. */
const SHAPES = ['outlined', 'light', 'ghost'];

let warnedLegacy = false;
function warnLegacy(what) {
  if (warnedLegacy || process.env.NODE_ENV === 'production') return;
  warnedLegacy = true;
  console.warn(
    `[OmniDesign] ToggleButtonGroup: ${what} This is MUI's shape and still `
    + 'works; it will be removed in the next major. The native form is '
    + '`multiple` (not `exclusive`), onChange(value, event), `color` for the '
    + 'palette and `variant` for the shape.',
  );
}

export function ToggleButtonGroup({
  variant,
  color,
  exclusive,
  multiple,
  onChange,
  /* FALSE is what makes this a toggle group: the last selected segment
     cannot be turned off. Exposed rather than hardcoded because a caller may
     genuinely want a clearable multi-select with toggle styling, and the
     alternative is reaching for ButtonGroup and losing the floor entirely. */
  allowEmpty = false,
  /* JOINED by default, which is this component's Style=Default in Figma: the
     segments overlap so the shared edge collapses to one border, because a
     toggle group is ONE control. ButtonGroup defaults the other way, and that
     difference is most of what tells the two apart at a glance. */
  separated = false,
  ...props
}) {
  /* `variant` means the shape natively and meant the colour on MUI's
     component. Told apart by VALUE: the three shapes are a closed set, so
     anything else is a palette name from the old API. */
  const isShape = variant === undefined || SHAPES.includes(variant);
  if (!isShape) warnLegacy(`variant="${variant}" names a COLOUR.`);
  if (exclusive !== undefined) warnLegacy('`exclusive` is `multiple` inverted.');

  /* `exclusive` only speaks when `multiple` has not. Both given means the
     caller is mid-migration, and the native prop is the one they meant. */
  const effectiveMultiple = multiple !== undefined
    ? multiple
    : exclusive !== undefined ? !exclusive : false;

  /* The legacy onChange is (event, value). Detected by the same signal as the
     props above rather than by sniffing arity, which lies for a handler
     written as `(e) => …`. */
  const legacy = !isShape || exclusive !== undefined;

  return (
    <ButtonGroup
      __selectionOwner
      variant={isShape ? (variant || 'outlined') : 'outlined'}
      color={color !== undefined ? color : (isShape ? undefined : variant)}
      multiple={effectiveMultiple}
      allowEmpty={allowEmpty}
      separated={separated}
      onChange={onChange
        ? (legacy ? (next, e) => onChange(e, next) : onChange)
        : undefined}
      {...props}
    />
  );
}

/** A segment. Button already is one — this name ships publicly, so it stays. */
export function ToggleButton(props) {
  return <Button {...props} />;
}

/* The ten colour presets. They pass `color`, not `variant` — passing the
   palette through the ambiguous prop would make every one of them trip the
   legacy warning, telling users off for using an export this file provides. */
const preset = (color) => {
  const C = (p) => <ToggleButtonGroup color={color} {...p} />;
  C.displayName = `${color}ToggleButtonGroup`;
  return C;
};
export const DefaultToggleButtonGroup    = preset('default');
export const PrimaryToggleButtonGroup    = preset('primary');
export const SecondaryToggleButtonGroup  = preset('secondary');
export const TertiaryToggleButtonGroup   = preset('tertiary');
export const NeutralToggleButtonGroup    = preset('neutral');
export const BlackWhiteToggleButtonGroup = preset('black-white');
export const InfoToggleButtonGroup       = preset('info');
export const SuccessToggleButtonGroup    = preset('success');
export const WarningToggleButtonGroup    = preset('warning');
export const ErrorToggleButtonGroup      = preset('error');

export default ToggleButtonGroup;
