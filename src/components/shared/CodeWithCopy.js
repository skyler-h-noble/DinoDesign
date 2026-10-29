// src/components/shared/CodeWithCopy.js
import React, { useState } from 'react';
import ContentCopyIcon from '@omni-design/icons/ContentCopy';
import CheckIcon from '@omni-design/icons/Check';
import { IconButton } from '../Button/Button';
import { PlainTooltip } from '../Tooltip/Tooltip';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
/* The lib's own icon button — <Button iconOnly> — not MUI's, so hover,
   pressed, focus-visible and disabled all come from Button rather than
   being re-derived at each call site. */

/* One element + one class: beats Button's resting color and margin, gives way
   to its hover / focus / disabled colors — as the emotion class it replaces. */
registerStaticStyles('omni-code-with-copy', [
  'button.omni-cwc{color:var(--Icon);float:right;margin-top:-32px}',
  'button.omni-cwc-copied{color:var(--Icons-Success)}',
].join('\n'));

const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/**
 * CodeWithCopy Component
 * Displays just a copy icon button for code snippets
 *
 * @param {string} code - Code snippet to copy
 * @param {object} sx - Optional MUI sx prop for styling
 */
export function CodeWithCopy({ code, sx }) {
  useStaticStyles('omni-code-with-copy');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /* A caller's sx is merged over the component's own, as it always was —
     through Button's sx (MUI loads on demand); without one, the classes. */
  const own = hasSx(sx)
    ? { sx: { color: copied ? 'var(--Icons-Success)' : 'var(--Icon)', float: 'right', mt: -4, ...sx } }
    : { className: 'omni-cwc' + (copied ? ' omni-cwc-copied' : '') };

  return (
    <PlainTooltip title={copied ? "Copied!" : "Copy code"}>
      <IconButton
        size="small"
        onClick={handleCopy}
        {...own}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </PlainTooltip>
  );
}

export default CodeWithCopy;
