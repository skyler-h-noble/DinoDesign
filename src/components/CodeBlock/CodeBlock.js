// CodeBlock
//
// A block of code on its own dark region, with an optional label and a copy
// button.
//
// The dark is NOT a hardcoded colour. The wrapper declares
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
import { Box, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Caption } from '../Typography/Typography';

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
      <IconButton
        size="small"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : label}
        sx={{
          color: copied ? 'var(--Icons-Success, var(--Text))' : 'var(--Quiet)',
          '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
          '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
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
  return (
    <Box
      // The pair that makes this region dark. Never a literal colour.
      data-theme="Neutral"
      data-surface="Surface-Dimmest"
      sx={{
        backgroundColor: 'var(--Background)',
        borderRadius: 'var(--Style-Border-Radius)',
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
          {showCopy && code ? <CopyButton code={code} /> : null}
        </Box>
      )}

      <Box sx={{ p: 2, overflow: 'auto', maxHeight }}>
        <Box
          component="pre"
          sx={{ margin: 0, fontFamily: 'inherit' }}
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
