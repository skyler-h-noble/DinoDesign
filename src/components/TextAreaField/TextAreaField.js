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
// ── Label-top only, and that is a real constraint ────────────────────────────
// A text area takes no other placement. FLOATING has nowhere to float: the
// label would need to move up out of the value's way, but a text area's value
// starts at the top and grows down, so the label either shoves the content
// down on focus or lands on the first line. LEFT disconnects: the label sits at
// the top-left while the field runs four or five lines past it, and by the
// third line there is nothing beside it.
//
// So there is no `labelPlacement` prop. A prop with one legal value is a
// question nobody should be asked.
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

  return (
    <Box
      className={'textarea-field ' + className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        /* Figma: the Field is a vertical stack at Sizing-Half. */
        gap: 'var(--Sizing-Half)',
        ...sx,
      }}
    >
      <FormLabel htmlFor={id} type={type} moreInfo={moreInfo} disabled={disabled}>
        {label}
      </FormLabel>
      <TextArea
        id={id}
        disabled={disabled}
        /* The REQUIREMENT is announced here, not by the marker beside the
           label — that one is aria-hidden precisely so this is the single
           place a screen reader learns it. */
        aria-required={type === 'required' ? true : undefined}
        {...props}
      />
    </Box>
  );
}

export default TextAreaField;
