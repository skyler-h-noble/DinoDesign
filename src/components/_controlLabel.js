// src/components/_controlLabel.js
//
// The label row of a selection control — what MUI's FormControlLabel drew for
// Checkbox and Switch, as static markup and one static sheet.
//
// Same markup MUI produced: a <label> holding the control, then the label
// text inside a span that carried MUI Typography's body1 (FormControlLabel
// wraps any label that is not its own Typography in one). That span's font is
// kept: it sets the line box the lib's own label component sits on, so
// dropping it would move the text. Same classes, so a consumer rule on
// .MuiFormControlLabel-root / -label still lands.
//
// Weights match what emotion's rules had: one class for the root and its
// placement, one class plus .Mui-disabled for the disabled cursor, and three
// classes for the disabled label colour.
import React from 'react';
import { registerStaticStyles, useStaticStyles } from './_staticStyles';
import { labelGap } from './_labelGap';

const GAP_CLASS = { small: 'omni-fcl-sm', medium: 'omni-fcl-md', large: 'omni-fcl-lg' };
const PLACEMENT = { end: 'End', start: 'Start', top: 'Top', bottom: 'Bottom' };

registerStaticStyles('omni-control-label', [
  '.omni-fcl{display:inline-flex;-webkit-box-align:center;cursor:pointer;vertical-align:middle;-webkit-tap-highlight-color:transparent;'
    + 'margin-left:0;margin-right:0;align-items:center}',
  '.omni-fcl-start{flex-direction:row-reverse}',
  '.omni-fcl-top{flex-direction:column-reverse}',
  '.omni-fcl-bottom{flex-direction:column}',
  ...Object.entries(GAP_CLASS).map(([size, cls]) => `.${cls}{gap:${labelGap(size)}}`),
  '.omni-fcl.Mui-disabled{cursor:default}',
  /* MUI Typography body1, which FormControlLabel wrapped the label in. */
  '.omni-fcl-label{margin:0;font-family:"Roboto","Helvetica","Arial",sans-serif;font-weight:400;font-size:1rem;'
    + 'line-height:1.5;letter-spacing:0.00938em}',
  '.omni-fcl .omni-fcl-label.Mui-disabled{color:rgba(0, 0, 0, 0.38)}',
  /* Checkbox's quieter disabled label. Same weight as the rule above and
     after it in the same sheet, so it wins as its sx rule did. */
  '.omni-fcl-quiet.Mui-disabled .MuiTypography-root{color:var(--Text-Quiet);opacity:0.6}',
].join('\n'));

export function ControlLabel({ control, label, disabled = false, labelPlacement = 'end', size = 'medium', quietDisabled = false, className = '' }) {
  useStaticStyles('omni-control-label');
  const placement = PLACEMENT[labelPlacement] ? labelPlacement : 'end';
  return (
    <label
      className={'MuiFormControlLabel-root' + (disabled ? ' Mui-disabled' : '')
        + ' MuiFormControlLabel-labelPlacement' + PLACEMENT[placement]
        + ' omni-fcl omni-fcl-' + placement + ' ' + (GAP_CLASS[size] || GAP_CLASS.medium)
        + (quietDisabled ? ' omni-fcl-quiet' : '') + (className ? ' ' + className : '')}
    >
      {control}
      <span className={'MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label omni-fcl-label' + (disabled ? ' Mui-disabled' : '')}>
        {label}
      </span>
    </label>
  );
}
