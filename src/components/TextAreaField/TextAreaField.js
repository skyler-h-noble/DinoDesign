// src/components/TextAreaField/TextAreaField.js
//
// The design's TextAreaField (9476:48337): a Form-Label above a TextArea.
//
// ── Why this is a component and TextArea is not ──────────────────────────────
// In the design, `TextArea` is a bare CONTROL and `TextAreaField` pairs it with
// its label. The name carries that: an `X Field` includes its label, so you can
// tell from the library listing whether one comes with it. `Input` and
// `Input Field` split the same way.
//
// ── Label top, left, floating or none ───────────────────────────────────
// labelPosition = 'top' (default) | 'left' | 'floating' | 'none' — Figma's
// Label axis. LEFT keeps the label at the TOP-left, Sizing-1 from the field,
// so it sits beside the first line however tall the area grows. NONE draws no
// label; the `label` text still names the control (aria-label), because a
// field with no name is not optional.
//
// FLOATING is the TextArea's own Style=Floating: the label rests on the first
// line, where a placeholder would be, and rises to the top edge on focus or
// once there is a value. Input draws it (MUI owns the association), so there
// is no FormLabel and no placeholder — the label IS the placeholder at rest.

// ── It does NOT pass `label` to the TextArea ─────────────────────────────────
// Input renders its own label when given one. Passing it through would draw a
// second label, and the one it draws reads Body/BodySmall at a literal 13px
// rather than the Label type style. The FormLabel here is the only label, and
// `htmlFor` ties it to the control by id. Floating is the one exception: that
// label lives inside the field, so Input draws it.
import React, { useId } from 'react';
import { FormLabel } from '../FormLabel';
import { TextArea } from '../TextField/TextField';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('TextAreaField');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Figma: a vertical stack at Sizing-Half; label-left is a row at Sizing-1
   with the label held at the top. The label and the area take their share of
   the row through two-class rules — each sits on a component whose own
   rules are one class. */
registerBoxStyles('omni-textarea-field', [
  '.omni-taf{display:flex;flex-direction:column;align-items:stretch;gap:var(--Sizing-Half)}',
  '.omni-taf-left{flex-direction:row;align-items:flex-start;gap:var(--Sizing-1)}',
  '.omni-taf-left>.omni-taf-label{flex-shrink:0}',
  '.omni-taf-left>.omni-taf-area{flex:1;min-width:0}',
].join('\n'));

export function TextAreaField({
  label,
  labelPosition = 'top',
  /* Figma's Form-Label Type axis. */
  type = 'default',
  /* { label, text?, href?, onClick? } — forwarded to FormLabel. */
  moreInfo,
  id: idProp,
  disabled = false,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-textarea-field');
  const generatedId = useId();
  const id = idProp || generatedId;

  const isLeft = labelPosition === 'left';
  const isFloating = labelPosition === 'floating';
  const showLabel = labelPosition !== 'none' && !isFloating;
  const root = {
    className: 'textarea-field textarea-field-label-' + labelPosition + (className ? ' ' + className : '')
      + ' MuiBox-root omni-taf' + (isLeft ? ' omni-taf-left' : ''),
  };
  const content = (
    <>
      {showLabel && (
        <FormLabel htmlFor={id} type={type} moreInfo={moreInfo} disabled={disabled} className={isLeft ? 'omni-taf-label' : ''}>
          {label}
        </FormLabel>
      )}
      <TextArea
        id={id}
        disabled={disabled}
        /* The REQUIREMENT is announced here, not by the marker beside the
           label — that one is aria-hidden precisely so this is the single
           place a screen reader learns it. */
        aria-required={type === 'required' ? true : undefined}
        {...(labelPosition === 'none' && typeof label === 'string' ? { 'aria-label': label } : {})}
        {...props}
        {...(isFloating ? { labelPosition: 'floating', label, placeholder: undefined } : {})}
        {...(isLeft ? { className: 'omni-taf-area' } : {})}
      />
    </>
  );
  if (hasSx(sx)) return <SxBox sx={sx} {...root}>{content}</SxBox>;
  return <div {...root}>{content}</div>;
}

export default TextAreaField;
