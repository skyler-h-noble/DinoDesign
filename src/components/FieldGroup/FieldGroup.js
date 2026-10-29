// src/components/FieldGroup/FieldGroup.js
//
// The design's Grouped Form Component (8579:22366): a legend, a group helper,
// and a stack of fields.
//
// ── Why one group and not three ──────────────────────────────────────────────
// There is no RadioGroup / CheckboxGroup / SwatchGroup here, and there should
// not be. The layout is identical in every case — legend, helper, a stack —
// and only the contents differ, which is what children are for. Three
// components would be three places for the same spacing and the same legend
// treatment to drift apart.
//
// ── fieldset and legend, not a div with a heading ────────────────────────────
// A <legend> inside a <fieldset> is the only markup that makes a set of
// controls announce as ONE question. Without it a screen reader reads six
// unrelated checkboxes and the user never learns what they are choosing
// between. That is also why FormLabel takes `as="legend"` — the design says
// the same thing by giving a group its own `group form label` style rather
// than reusing the per-option label.
//
// ── Validation belongs to the GROUP, and so does its wiring ──────────────────
// "Choose one" is a fact about the set, not about any option in it, so
// `aria-invalid` and `aria-describedby` go on the <fieldset>. Putting them on
// an option would announce the same error once per option and leave the group
// itself valid. This is the half of the standalone-vs-option distinction that
// lives here; the other half is in FormField, where a lone control owns its
// own error.
import React from 'react';
import { FormLabel } from '../FormLabel';
import { FormHelper, useFormHelperIds } from '../FormHelper';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('FieldGroup');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

registerBoxStyles('omni-field-group', [
  /* A fieldset arrives with a border, margin and padding of its own, and a
     legend with layout rules that predate flexbox. Reset them here so the
     markup can be correct without the appearance being inherited. */
  '.omni-fg{border:0px solid;margin:0;padding:0;min-inline-size:0;display:flex;flex-direction:column;gap:var(--Sizing-Half)}',
  /* Figma's Form Slot: the options, at Sizing-1. */
  '.omni-fg-options{display:flex;flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:var(--Sizing-1)}',
  '.omni-fg-options-h{flex-direction:row;flex-wrap:wrap;align-items:center}',
].join('\n'));

export function FieldGroup({
  children,
  /* The legend. A group can be required too — "Delivery method *" — which is
     exactly the case where the marker matters most, since the error belongs to
     the set rather than to any one option. */
  label,
  type = 'default',
  moreInfo,

  helperText,
  showHelper = true,
  validation = 'none',
  validationMessage,

  /* How the options stack. Vertical by default: a column is scannable and a
     row of more than three options wraps unpredictably. */
  orientation = 'vertical',
  disabled = false,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-field-group');
  const { helperId, messageId, describedBy } = useFormHelperIds({ showHelper, validation });
  const invalid = validation === 'error';

  const root = {
    disabled: disabled || undefined,
    className: 'field-group field-group-' + orientation + ' ' + className + ' MuiBox-root omni-fg',
    /* The group is the thing being validated, so the group carries the
       wiring. See the header. */
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy,
    ...props,
  };
  const content = (
    <>
      {label && (
        <FormLabel as="legend" type={type} moreInfo={moreInfo} disabled={disabled}>
          {label}
        </FormLabel>
      )}

      <FormHelper
        helperText={helperText}
        showHelper={showHelper}
        validation={validation}
        validationMessage={validationMessage}
        helperId={helperId}
        messageId={messageId}
      />

      {/* Figma's Form Slot: the options, at Sizing-1. */}
      <div className={'field-group-options MuiBox-root omni-fg-options' + (orientation === 'horizontal' ? ' omni-fg-options-h' : '')}>
        {children}
      </div>
    </>
  );
  if (hasSx(sx)) return <SxBox component="fieldset" sx={sx} {...root}>{content}</SxBox>;
  return <fieldset {...root}>{content}</fieldset>;
}

export default FieldGroup;
