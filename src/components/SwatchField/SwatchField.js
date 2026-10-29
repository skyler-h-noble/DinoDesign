// src/components/SwatchField/SwatchField.js
import React, { useId } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';
import { Swatch } from '../Swatch/Swatch';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('SwatchField');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Stacked: Sizing-Half apart, the label centred on the swatch. Sideways:
   Sizing-1 apart, the swatch filling the rest. The label and the swatch take
   their place through two-class rules, over their own one-class sheets. */
registerBoxStyles('omni-swatch-field', [
  '.omni-swf{display:flex;flex-direction:column;align-items:flex-start;gap:var(--Sizing-Half, 4px)}',
  '.omni-swf-side{flex-direction:row;gap:var(--Sizing-1, 8px)}',
  '.omni-swf>.omni-swf-label{flex-shrink:0}',
  '.omni-swf-stack>.omni-swf-label{align-self:stretch;justify-content:center}',
  '.omni-swatch.omni-swf-swatch{flex:1;min-width:0}',
].join('\n'));

/**
 * SwatchField — Figma's SwatchField (9575:2390): a Swatch with its field
 * label. An `X Field` includes its label (TextAreaField, RadioField), and
 * Swatch's own `label` is the COLOR's name inside the swatch — a different
 * thing — so the field label lives here.
 *
 *   labelPosition  'top' (default) | 'bottom' — stacked, Sizing-Half apart,
 *                                               the label centred on the swatch
 *                  'left' | 'right'           — side by side, Sizing-1 apart,
 *                                               the swatch filling the rest
 *   No `label` is Figma's `none`: the swatch alone.
 *
 * `swatchLabel` is the Swatch's own label (the color's name inside it);
 * every other prop goes to the Swatch too. The field label names the swatch
 * (aria-labelledby).
 */
export function SwatchField({
  label,
  labelPosition = 'top',
  swatchLabel,
  disabled = false,
  className = '',
  sx,
  ...swatchProps
}) {
  useStaticStyles('omni-swatch-field');
  const labelId = useId();
  const sideways = labelPosition === 'left' || labelPosition === 'right';
  const labelFirst = labelPosition === 'top' || labelPosition === 'left';

  const swatch = (
    <Swatch
      label={swatchLabel}
      disabled={disabled}
      {...(label && { 'aria-labelledby': labelId })}
      {...swatchProps}
      {...(sideways && { className: 'omni-swf-swatch' })}
    />
  );
  if (!label) return swatch;

  const labelEl = (
    <FormLabel id={labelId} disabled={disabled} className="omni-swf-label">{label}</FormLabel>
  );

  const root = {
    className: 'swatch-field swatch-field-' + labelPosition + (className ? ' ' + className : '')
      + ' MuiBox-root omni-swf ' + (sideways ? 'omni-swf-side' : 'omni-swf-stack'),
  };
  const content = (
    <>
      {labelFirst && labelEl}
      {swatch}
      {!labelFirst && labelEl}
    </>
  );
  if (hasSx(sx)) return <SxBox sx={sx} {...root}>{content}</SxBox>;
  return <div {...root}>{content}</div>;
}

export default SwatchField;
