// src/components/ToggleButton/index.js
//
// ONLY the standalone toggle. This directory used to also export a
// ToggleButtonGroup — a third implementation, defined in ToggleButton.js — plus
// five group presets. With ToggleButtonGroup retired onto ButtonGroup that name
// had two live meanings depending on import depth:
//
//   import { ToggleButtonGroup } from '@omni-design/components';              // the shim
//   import { ToggleButtonGroup } from '@omni-design/components/ToggleButton'; // a different one
//
// Same name, different component, no error. The barrel picked explicitly so
// top-level imports were right, which is what let it survive.
//
// ToggleButton itself stays, and is NOT a duplicate of anything: it is a single
// control that is on or off (aria-pressed), where a group is a row of segments
// of which one is selected. Different components, and the Figma library needs a
// page for this one.
export { ToggleButton, ToggleButtonShowcase, DisabledToggleButton } from './ToggleButton';
export { ToggleButton as default } from './ToggleButton';
