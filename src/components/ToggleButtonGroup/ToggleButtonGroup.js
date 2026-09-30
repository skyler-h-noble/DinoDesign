// src/components/ToggleButtonGroup/ToggleButtonGroup.js
//
// RETIRED. ToggleButtonGroup is ButtonGroup, built a second time.
//
// The two were the same component under different prop names: a row of
// segments where the selected one fills with the palette colour and the rest
// carry a --Quiet label. Single vs multiple selection was `exclusive` here and
// `multiple` there — the same model, inverted. Same nine colours (this one
// also had black-white). Same removed `{color}-light` variant, documented in
// both files as reading tokens no design system publishes.
//
// It was not two concepts that converged; it was one concept implemented
// twice. That is why a Figma Button Group could not be converted
// deterministically — one component set cannot say which of two identical
// React components to emit, because nothing distinguishes them.
//
// ButtonGroup is the survivor. It carries the SHAPE axis the design actually
// uses (outlined / light / ghost, with `variant="light"` documented in the
// studio's own CLAUDE.md), it sets role="group" explicitly rather than
// inheriting whatever MUI emits, and it is built on the design system's tokens
// instead of fighting MUI's theming.
//
// ─── What this file is now ──────────────────────────────────────────────────
//
// A shim, kept rather than deleted because the named exports ship publicly and
// a missing export is a build error in someone else's project. Same treatment
// `variant="{color}-light"` got when it was removed in 0.9.0: it still renders,
// it warns once in development, and nothing breaks silently.
//
// TWO things the shim has to translate, and the second is the dangerous one:
//
//   variant   named the COLOUR here and names the SHAPE on ButtonGroup, so it
//             moves to `color` and the shape becomes "outlined" — this group
//             always drew a container border.
//
//   onChange  MUI's order is (event, value); ButtonGroup's is (value, event).
//             Not swapping them would hand every existing caller an event
//             where it expects a value — no error, no warning, just a
//             selection that never updates.
//
// The segment is now `<Button value="…">`. Button already has `swatch` and
// `swatchColor`, so the colour-chip segment this file used to provide is not
// lost; nothing outside this directory ever used it.
import React from 'react';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { Button } from '../Button/Button';

let warned = false;
function warnOnce() {
  if (warned || process.env.NODE_ENV === 'production') return;
  warned = true;
  console.warn(
    '[OmniDesign] ToggleButtonGroup is retired — it was a second implementation ' +
    'of ButtonGroup. Use <ButtonGroup variant="outlined" color="…"> with ' +
    '<Button value="…"> segments. Note two prop changes: `exclusive` becomes ' +
    '`multiple` (inverted), and onChange is (value, event) rather than ' +
    '(event, value).',
  );
}

/** @deprecated Use ButtonGroup. */
export function ToggleButtonGroup({
  variant = 'default',
  exclusive = true,
  onChange,
  ...props
}) {
  warnOnce();
  return (
    <ButtonGroup
      variant="outlined"
      color={variant}
      multiple={!exclusive}
      onChange={onChange ? (next, e) => onChange(e, next) : undefined}
      {...props}
    />
  );
}

/** @deprecated Use Button with a `value` prop as a ButtonGroup segment. */
export function ToggleButton(props) {
  warnOnce();
  return <Button {...props} />;
}

/* The ten colour presets. Kept for the same reason as the components: they are
   public names, and a stale import should not be a build error. Each is one
   line, so the cost of keeping them is lower than the cost of breaking someone. */
const preset = (color) => {
  const C = (p) => <ToggleButtonGroup variant={color} {...p} />;
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
