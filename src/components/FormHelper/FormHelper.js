// src/components/FormHelper/FormHelper.js
//
// The design's Form-Helper (8580:22922): a field's helper text, and under it
// its validation message.
//
// ── Helper above, message below, and the order is load-bearing ───────────────
// Helper is what is always true about the field; the message is what is true
// right now. Standing guidance before the exception, and the message can come
// and go without the helper moving.
//
// That order also has to reach a screen reader, which is why this exposes ids:
// `aria-describedby` announces in the order the attribute LISTS, not the order
// things appear on screen. So the control wants `helperId messageId`, in that
// order, and `useFormHelperIds` below returns them already in it.
//
// ── Two switches, not one axis ───────────────────────────────────────────────
// Figma models this as `Show Helper` (boolean) plus `Validation` (axis). They
// are independent: a field can have helper text and no error, an error and no
// helper, both, or neither. Folding them together would be four variants for
// two switches, and the combination most forms actually use — helper now,
// error later — would be a different variant rather than a state change.
import React, { useId } from 'react';
import { Legal } from '../Typography';
import { InputMessage } from '../InputMessage';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('FormHelper');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Figma binds itemSpacing -> Sizing-Half. */
registerBoxStyles('omni-form-helper', [
  '.omni-fh{display:flex;flex-direction:column;align-items:flex-start;gap:var(--Sizing-Half)}',
].join('\n'));

export const FORM_HELPER_VALIDATIONS = ['none', 'warning', 'info', 'success', 'error'];

/**
 * The ids a field should hand to its control, already in announcement order.
 *
 * Returns `{ helperId, messageId, describedBy }`. `describedBy` is undefined
 * when there is nothing to describe, so it can be spread without producing an
 * empty attribute.
 */
export function useFormHelperIds({ showHelper = true, validation = 'none' } = {}) {
  const base = useId();
  const helperId = showHelper ? base + '-helper' : undefined;
  const messageId = validation && validation !== 'none' ? base + '-message' : undefined;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;
  return { helperId, messageId, describedBy };
}

export function FormHelper({
  helperText,
  /* Figma's Show Helper boolean, default true. Independent of validation. */
  showHelper = true,
  validation = 'none',
  validationMessage,
  withIcon = true,
  helperId,
  messageId,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-form-helper');
  const hasHelper = showHelper && !!helperText;
  const hasMessage = validation !== 'none' && !!validationMessage;
  if (!hasHelper && !hasMessage) return null;

  const root = { className: 'form-helper ' + className + ' MuiBox-root omni-fh', ...props };
  const content = (
    <>
      {hasHelper && (
        /* Legal defaults to `quiet`, which is the token Figma binds here —
           so this does not restate a colour the type style already owns. */
        <Legal id={helperId} className="form-helper-text">{helperText}</Legal>
      )}
      {hasMessage && (
        <InputMessage id={messageId} type={validation} withIcon={withIcon}>
          {validationMessage}
        </InputMessage>
      )}
    </>
  );
  if (hasSx(sx)) return <SxBox sx={sx} {...root}>{content}</SxBox>;
  return <div {...root}>{content}</div>;
}

export default FormHelper;
