// src/components/ToggleButtonGroup/index.js
//
// The selection control — see ToggleButtonGroup.js for why the retirement was
// wrong. It renders ButtonGroup, which owns the geometry, and supplies the one
// behaviour that is the definition: at least one segment always on.
//
// The showcase is back with it. The note here used to say "a showcase for
// something nobody should use is an advertisement for it", which was right
// about a duplicate and wrong about this — Figma has had two pages all along.
export {
  ToggleButtonGroup,
  ToggleButton,
  DefaultToggleButtonGroup,
  PrimaryToggleButtonGroup,
  SecondaryToggleButtonGroup,
  TertiaryToggleButtonGroup,
  NeutralToggleButtonGroup,
  BlackWhiteToggleButtonGroup,
  InfoToggleButtonGroup,
  SuccessToggleButtonGroup,
  WarningToggleButtonGroup,
  ErrorToggleButtonGroup,
} from './ToggleButtonGroup';
export { default } from './ToggleButtonGroup';
export { ToggleButtonGroupShowcase } from './ToggleButtonGroupShowcase';
