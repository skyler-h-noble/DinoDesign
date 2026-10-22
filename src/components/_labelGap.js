// src/components/_labelGap.js
//
// The gap between a selection control and its label — Figma's Other/Label-Gap,
// ONE variable bound by Checkbox Field, RadioField and SwitchField, so a form
// mixing the three puts every label the same distance from its control.
//
// The design system emits --Label-Gap / --Sm-Label-Gap / --Lg-Label-Gap; the
// fallbacks are the same 4 / 8 / 12 the generator writes, so a system published
// before the token existed renders unchanged.
const LABEL_GAP = {
  small:  'var(--Sm-Label-Gap, 4px)',
  medium: 'var(--Label-Gap, 8px)',
  large:  'var(--Lg-Label-Gap, 12px)',
};

export function labelGap(size) {
  return LABEL_GAP[size] || LABEL_GAP.medium;
}
