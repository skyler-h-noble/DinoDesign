// src/components/SwatchField/SwatchField.js
import React, { useId } from 'react';
import { Box } from '@mui/material';
import { FormLabel } from '../FormLabel/FormLabel';
import { Swatch } from '../Swatch/Swatch';

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
  sx = {},
  ...swatchProps
}) {
  const labelId = useId();
  const sideways = labelPosition === 'left' || labelPosition === 'right';
  const labelFirst = labelPosition === 'top' || labelPosition === 'left';

  const swatch = (
    <Swatch
      label={swatchLabel}
      disabled={disabled}
      {...(label && { 'aria-labelledby': labelId })}
      {...swatchProps}
      sx={{ ...(sideways && { flex: 1, minWidth: 0 }), ...(swatchProps.sx || {}) }}
    />
  );
  if (!label) return swatch;

  const labelEl = (
    <FormLabel id={labelId} disabled={disabled} sx={{ flexShrink: 0, ...(!sideways && { alignSelf: 'stretch', justifyContent: 'center' }) }}>{label}</FormLabel>
  );

  return (
    <Box
      className={'swatch-field swatch-field-' + labelPosition + (className ? ' ' + className : '')}
      sx={{
        display: 'flex',
        flexDirection: sideways ? 'row' : 'column',
        alignItems: 'flex-start',
        gap: sideways ? 'var(--Sizing-1, 8px)' : 'var(--Sizing-Half, 4px)',
        ...sx,
      }}
    >
      {labelFirst && labelEl}
      {swatch}
      {!labelFirst && labelEl}
    </Box>
  );
}

export default SwatchField;
