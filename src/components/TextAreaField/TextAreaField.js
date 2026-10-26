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
// ── Label top, left or none ──────────────────────────────────────────────
// labelPosition = 'top' (default) | 'left' | 'none' — Figma's Label axis.
// LEFT keeps the label at the TOP-left, Sizing-1 from the field, so it sits
// beside the first line however tall the area grows. NONE draws no label; the
// `label` text still names the control (aria-label), because a field with no
// name is not optional.
//
// FLOATING is deliberately not offered yet (on the checklist): a text area's
// value starts at the top and grows down, so a floating label either shoves
// the content down on focus or lands on the first line — it needs its own
// design before it gets a prop.
//
// ── It does NOT pass `label` to the TextArea ─────────────────────────────────
// Input renders its own label when given one. Passing it through would draw a
// second label, and the one it draws reads Body/BodySmall at a literal 13px
// rather than the Label type style. The FormLabel here is the only label, and
// `htmlFor` ties it to the control by id.
import React, { useId } from 'react';
import { Box } from '@mui/material';
import { FormLabel } from '../FormLabel';
import { TextArea } from '../TextField/TextField';

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
  sx = {},
  ...props
}) {
  const generatedId = useId();
  const id = idProp || generatedId;

  const isLeft = labelPosition === 'left';
  const showLabel = labelPosition !== 'none';
  return (
    <Box
      className={'textarea-field textarea-field-label-' + labelPosition + (className ? ' ' + className : '')}
      sx={{
        display: 'flex',
        /* Figma: a vertical stack at Sizing-Half; label-left is a row at
           Sizing-1 with the label held at the top. */
        flexDirection: isLeft ? 'row' : 'column',
        alignItems: isLeft ? 'flex-start' : 'stretch',
        gap: isLeft ? 'var(--Sizing-1)' : 'var(--Sizing-Half)',
        ...sx,
      }}
    >
      {showLabel && (
        <FormLabel htmlFor={id} type={type} moreInfo={moreInfo} disabled={disabled} sx={isLeft ? { flexShrink: 0 } : undefined}>
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
        {...(!showLabel && typeof label === 'string' ? { 'aria-label': label } : {})}
        {...props}
        sx={{ ...(isLeft ? { flex: 1, minWidth: 0 } : {}), ...(props.sx || {}) }}
      />
    </Box>
  );
}

export default TextAreaField;
