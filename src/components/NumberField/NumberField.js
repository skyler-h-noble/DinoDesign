// src/components/NumberField/NumberField.js
import React, { useState, useId, useCallback } from 'react';
import KeyboardArrowUpIcon from '@omni-design/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@omni-design/icons/KeyboardArrowDown';
import { Input as TextInput } from '../Input/Input';
import { FieldButton } from './FieldButton';
import { FormLabel } from '../FormLabel/FormLabel';
import { FormHelper } from '../FormHelper/FormHelper';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * NumberField — Figma's Number (9518:52318) inside NumberField (9518:52593).
 *
 * It is ASSEMBLED from parts that are each checked against Figma on their own,
 * rather than drawing its own field and buttons (it used to: 13–16px text, its
 * own border, square steppers):
 *
 *   field      TextInput — the Input set, so the edge, fill, states, Body text
 *              and the floating label are the Input's
 *   steppers   FieldButton — Figma's Field Button (ghost in the stacked
 *              column, outline in the spinner row)
 *   label      FormLabel — top / left, as InputField and SelectField
 *
 * VARIANTS (Figma's Type):
 *   outlined   the field with a column on its trailing edge: Increase above,
 *              a 1px Border-Variant divider, Decrease below. The column's
 *              left edge is the field's border, shared (Figma overlaps them
 *              by 1px). Height is --Numberfield: two FieldButton heights, the
 *              divider and the 1px edges — 67 at medium.
 *   spinner    Decrease · field · Increase in a row, Sizing-1 apart, the
 *              steppers outline FieldButtons.
 *   labelPosition="floating" gives Figma's Floating-outline / Floating-Spinner.
 *
 * KEYBOARD (WAI-ARIA spinbutton): the input is role="spinbutton" with
 * aria-valuenow/min/max; ArrowUp / ArrowDown step, PageUp / PageDown step by
 * ten, Home / End jump to min / max. The steppers are pointer conveniences and
 * stay out of the tab order — the arrows already do their job from the field.
 */

const PREFIX = { small: 'Sm-', medium: '', large: 'Lg-' };
const NUMBERFIELD_FALLBACK = { small: 50, medium: 67, large: 116 };
const RADIUS = (p) => 'var(--' + p + 'Input-Radius, var(--Input-Radius, 4px))';

/* Static sheet — the MUI Box sx blocks this was assembled with, as plain
   rules. The field's own sx (height, trailing corners, no ring of its own)
   became .omni-nf-field rules: they reach INTO the Input, whose sheet may be
   inserted after this one, so they carry one class more than emotion's did
   (which came after every static sheet and won ties). */
const SxBox = lazySxBox('NumberField');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SIZES = Object.keys(PREFIX);

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
registerStaticStyles('omni-numberfield', wk([
  '.omni-nf{display:flex;flex-direction:column;gap:var(--Sizing-Half, 4px);width:auto}',
  /* Figma's label-left is a 2x2 grid: label | field, the helper under the
     field Sizing-Half down, the label centred on the field's row. */
  '.omni-nf-left{display:grid;flex-direction:row;grid-template-columns:auto minmax(0, 1fr);column-gap:var(--Sizing-1, 8px);row-gap:var(--Sizing-Half, 4px);align-items:center}',
  '.omni-nf-full{width:100%}',
  '.omni-nf-row{display:flex;align-items:stretch;width:100%}',
  ...SIZES.map((size) => `.omni-nf-row-${size}{height:var(--${PREFIX[size]}Numberfield, ${NUMBERFIELD_FALLBACK[size]}px);border-radius:${RADIUS(PREFIX[size])}}`),
  '.omni-nf-row-outlined:focus-within{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-nf-row-spinner{display:flex;align-items:center;gap:var(--Sizing-1, 8px);width:100%}',
  '.omni-nf-steppers{position:relative;display:flex;flex-direction:column;margin-left:-1px;padding:1px;box-sizing:border-box;flex-shrink:0;overflow:hidden}',
  ...SIZES.map((size) => `.omni-nf-steppers-${size}{border-radius:0 ${RADIUS(PREFIX[size])} ${RADIUS(PREFIX[size])} 0}`),
  '.omni-nf-steppers::after{content:"";position:absolute;inset:0;pointer-events:none;border:1px solid var(--Border);border-radius:inherit}',
  '.omni-nf-steppers-off{opacity:var(--Disabled, 0.38)}',
  /* In the stacked column the buttons are square (Figma); the column's corner clips them. */
  '.omni-nf-steppers .omni-fb{border-radius:0}',
  '.omni-nf-divider{background-color:var(--Border-Variant);flex-shrink:0}',
  ...SIZES.map((size) => `.omni-nf-divider-${size}{height:var(--${PREFIX[size]}Divider, 1px)}`),
  /* The field fills the row's height and gives up its trailing corners: the
     stepper column carries them, sharing the field's right edge. The ring is
     the whole control's (field + steppers), drawn on the row. */
  '.omni-nf .omni-nf-field{flex:1;min-width:0}',
  '.omni-nf .omni-nf-field-stacked{height:100%}',
  '.omni-nf .omni-nf-field-stacked .inp-shell{height:100%;border-top-right-radius:0;border-bottom-right-radius:0}',
  '.omni-nf .omni-nf-field-stacked .inp-shell:focus-within{outline:none}',
  '.omni-nf .omni-nf-field-stacked .inp-shell > div,.omni-nf .omni-nf-field-stacked .MuiFormControl-root,'
    + '.omni-nf .omni-nf-field-stacked .MuiOutlinedInput-root{height:100%}',
].join('\n')));

export function NumberField({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  variant = 'outlined',   // 'outlined' | 'spinner'
  // Kept so old call sites still compile; neither changes the drawing now.
  style: _styleVariant,
  color: _color,
  size = 'medium',
  label,
  labelPosition = 'top',  // 'top' | 'left' | 'floating' | 'none'
  placeholder,
  helperText,
  /* Figma's Form-Label Type axis and More Info, passed to the FormLabel. */
  type = 'default',
  moreInfo,
  /* Validation: 'error' | 'warning' | 'success' | 'info' — the field's 2px
     validation edge (Input's), the message under it (FormHelper), and
     aria-invalid for an error. */
  validation,
  validationMessage,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
  useStaticStyles('omni-numberfield');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const current = isControlled ? controlledValue : internalValue;
  const inputId = useId();
  const helperId = inputId + '-helper';
  const hasHelper = !!(helperText || (validation && validationMessage));
  const sizeKey = PREFIX[size] !== undefined ? size : 'medium';

  const isOutlined = variant !== 'spinner';
  const isFloating = labelPosition === 'floating';
  const showLabel = label && (labelPosition === 'top' || labelPosition === 'left');

  const clamp = useCallback((v) => {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  }, [min, max]);

  const commit = useCallback((next) => {
    let v = typeof next === 'number' ? next : parseFloat(next);
    if (Number.isNaN(v)) v = 0;
    v = clamp(v);
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  }, [clamp, isControlled, onChange]);

  const num = Number(current) || 0;
  const atMin = min !== undefined && num <= min;
  const atMax = max !== undefined && num >= max;

  const handleKeyDown = (e) => {
    if (disabled) return;
    const keys = {
      ArrowUp: () => commit(num + step),
      ArrowDown: () => commit(num - step),
      PageUp: () => commit(num + step * 10),
      PageDown: () => commit(num - step * 10),
      Home: () => min !== undefined && commit(min),
      End: () => max !== undefined && commit(max),
    };
    if (keys[e.key]) { e.preventDefault(); keys[e.key](); }
  };

  // In the stacked column the buttons are square (Figma); the column's corner
  // clips them — the sheet's .omni-nf-steppers rule.
  const increase = (
    <FieldButton variant={isOutlined ? 'ghost' : 'outline'} size={size} aria-label="Increase" tabIndex={-1} data-own-state
      disabled={disabled || atMax} onClick={() => commit(num + step)}>
      <KeyboardArrowUpIcon />
    </FieldButton>
  );
  const decrease = (
    <FieldButton variant={isOutlined ? 'ghost' : 'outline'} size={size} aria-label="Decrease" tabIndex={-1} data-own-state
      disabled={disabled || atMin} onClick={() => commit(num - step)}>
      <KeyboardArrowDownIcon />
    </FieldButton>
  );

  const field = (
    <TextInput
      id={inputId}
      size={size}
      fullWidth
      disabled={disabled}
      placeholder={placeholder}
      value={current}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '' || raw === '-') { if (!isControlled) setInternalValue(raw); return; }
        commit(raw);
      }}
      labelPosition={isFloating ? 'floating' : 'standard'}
      validation={validation}
      label={isFloating ? label : undefined}
      aria-label={isFloating ? undefined : (ariaLabel || label)}
      inputProps={{
        role: 'spinbutton',
        inputMode: 'decimal',
        'aria-valuenow': num,
        ...(min !== undefined && { 'aria-valuemin': min }),
        ...(max !== undefined && { 'aria-valuemax': max }),
        onKeyDown: handleKeyDown,
        ...(validation === 'error' && { 'aria-invalid': true }),
        ...(type === 'required' && { 'aria-required': true }),
        ...(hasHelper && { 'aria-describedby': helperId }),
      }}
      className={'omni-nf-field' + (isOutlined ? ' omni-nf-field-stacked' : '')}
    />
  );

  const row = isOutlined ? (
    /* One focus ring round field AND steppers — the house 2px ring 1px out,
       following the field's corner. The steppers are out of the tab order
       (the arrow keys do their job from the field), so they draw none. */
    <div className={'MuiBox-root numberfield-row omni-nf-row omni-nf-row-outlined omni-nf-row-' + sizeKey}>
      {field}
      {/* Overlaps the field's right edge by its 1px, as Figma's gap -1 does. */}
      <div className={'MuiBox-root numberfield-steppers omni-nf-steppers omni-nf-steppers-' + sizeKey + (disabled ? ' omni-nf-steppers-off' : '')}>
        {increase}
        <div aria-hidden="true" className={'MuiBox-root omni-nf-divider omni-nf-divider-' + sizeKey} />
        {decrease}
      </div>
    </div>
  ) : (
    <div className="MuiBox-root numberfield-row omni-nf-row-spinner">
      {decrease}
      {field}
      {increase}
    </div>
  );

  const isLeftGrid = labelPosition === 'left' && showLabel;
  const rootProps = {
    className: 'MuiBox-root numberfield numberfield-' + (isOutlined ? 'outlined' : 'spinner') + (disabled ? ' numberfield-disabled' : '') + (className ? ' ' + className : '')
      + ' omni-nf' + (isLeftGrid ? ' omni-nf-left' : '') + (fullWidth ? ' omni-nf-full' : ''),
    ...props,
  };
  const body = (
    <>
      {showLabel && (
        <FormLabel htmlFor={inputId} disabled={disabled} type={type} moreInfo={moreInfo}
          sx={disabled ? { opacity: 'var(--Disabled, 0.38)' } : undefined}>
          {label}
        </FormLabel>
      )}
      {row}
      {hasHelper && (
        <FormHelper helperText={helperText} validation={validation || 'none'} validationMessage={validationMessage}
          helperId={helperId} messageId={helperId}
          sx={isLeftGrid ? { gridColumn: 2 } : undefined} />
      )}
    </>
  );
  return hasSx(sx) ? <SxBox sx={sx} {...rootProps}>{body}</SxBox> : <div {...rootProps}>{body}</div>;
}

export default NumberField;
