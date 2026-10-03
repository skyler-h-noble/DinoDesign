// CodeBlock
//
// A block of code on its own dark region, with an optional label and a copy
// button.
//
// The dark is NOT a hardcoded color. The wrapper declares
// data-theme="Neutral" + data-surface="Surface-Dimmest", which is the system's
// way of spelling "the black region": that pair resolves --Background to the
// darkest neutral and --Text to white, and every nested token — --Quiet for the
// label, --Border for the rule under it — comes with it, already tuned for that
// tone. So the block stays legible in light mode and dark mode without a second
// set of values, and a design system whose neutrals are warm gets a warm code
// block rather than the same #1e1e1e as everyone else.
//
// Before this existed, fifty showcase files each drew their own panel from
// #1e1e1e / #333 / #9ca3af / #e5e7eb and an 8px radius, and each defined its own
// CopyButton. That is what this replaces.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Caption } from '../Typography/Typography';
import { IconButton } from '../Button/Button';
/* The lib's own icon button — <Button iconOnly> — not MUI's, so hover,
   pressed, focus-visible and disabled all come from Button rather than
   being re-derived at each call site. */

/** Copy-to-clipboard control. Confirms for two seconds, then resets. */
function CopyButton({ code, label = 'Copy code' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <Tooltip title={copied ? 'Copied!' : label}>
      {/* aria-label rather than a visible name: the icon is the whole control. */}
      {/* ghost, explicitly. Button's default variant is `default` — the brand's
          own color as a SOLID fill — so leaving it off put a filled brand-
          colored disc in the header of every code block. It is the right
          default for a button that means something; it is wrong for chrome
          sitting on a panel that already declares its own theme. */}
      <IconButton
        variant="ghost"
        size="small"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : label}
        sx={{
          color: copied ? 'var(--Icons-Success, var(--Text))' : 'var(--Quiet)',
        }}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

CopyButton.propTypes = {
  code: PropTypes.string.isRequired,
  label: PropTypes.string,
};

/** Upper bound on the corner. A code panel reads as a technical surface; past
 *  this it starts looking like a pill with code in it. */
const RADIUS_CAP = '12px';

export function CodeBlock({
  code = '',
  language = 'JSX',
  showCopy = true,
  showHeader = true,
  maxHeight,
  wrap = false,
  sx = {},
  ...rest
}) {
  /* Exactly one copy button, and it follows the header. Rendering it in both
     places when the header is on would give a panel two controls that do the
     same thing, which reads as two different things. */
  const headerCopy = showHeader && showCopy && !!code;
  const bodyCopy = !showHeader && showCopy && !!code;
  return (
    <Box
      // The pair that makes this region dark. Never a literal color.
      data-theme="Neutral"
      data-surface="Surface-Dimmest"
      sx={{
        backgroundColor: 'var(--Background)',
        // --Card-Radius, not --Style-Border-Radius: the latter is aliased to
        // --Button-Radius and goes fully pill on a Playful system, which reads
        // wrong wrapped around dense monospace. Capped so the block still
        // shrinks on tight styles but stops growing on round ones.
        borderRadius: `min(var(--Card-Radius, var(--Style-Border-Radius)), ${RADIUS_CAP})`,
        overflow: 'hidden',
        ...sx,
      }}
      {...rest}
    >
      {showHeader && (language || showCopy) && (
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 1, px: 2, py: 1,
            borderBottom: '1px solid var(--Border)',
            minHeight: 40,
          }}
        >
          <Caption color="quiet">{language}</Caption>
          {headerCopy ? <CopyButton code={code} /> : null}
        </Box>
      )}

      {/* The copy control moves INTO the body when there is no header.
          Without this, showHeader={false} removed the only way to copy —
          the header owned the button, so hiding the chrome silently took
          the function with it. A code block that cannot be copied is the
          one thing this component exists to prevent.

          Laid out as the design has it: Code Area is a horizontal frame
          holding the code and then a `copy` frame, 435 + 32 across 467. It
          is a SIBLING of the code, not an overlay, so it never sits on top
          of a long line. The scroll moves to the code child so the button
          stays put while the code scrolls under it. */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 2 }}>
        <Box
          component="pre"
          sx={{ margin: 0, fontFamily: 'inherit', flex: 1, minWidth: 0,
                overflow: 'auto', maxHeight }}
        >
          <Box
            component="code"
            sx={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--Text)',
              // pre-wrap keeps indentation while allowing long lines to break;
              // pre keeps the block scrolling horizontally instead.
              whiteSpace: wrap ? 'pre-wrap' : 'pre',
              wordBreak: wrap ? 'break-word' : 'normal',
              display: 'block',
            }}
          >
            {code}
          </Box>
        </Box>
        {bodyCopy ? <CopyButton code={code} /> : null}
      </Box>
    </Box>
  );
}

CodeBlock.propTypes = {
  /** The code to display and copy. */
  code: PropTypes.string,
  /** Label shown in the header, e.g. "JSX", "bash", "CSS". */
  language: PropTypes.string,
  /** Show the copy button. */
  showCopy: PropTypes.bool,
  /** Show the header row at all. */
  showHeader: PropTypes.bool,
  /** Cap the code area's height and scroll past it. */
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Wrap long lines instead of scrolling horizontally. */
  wrap: PropTypes.bool,
  sx: PropTypes.object,
};

export { CopyButton };
export default CodeBlock;
