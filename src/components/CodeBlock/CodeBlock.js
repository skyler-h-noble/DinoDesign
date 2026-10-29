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
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { PlainTooltip } from '../Tooltip/Tooltip';
import ContentCopyIcon from '@omni-design/icons/ContentCopy';
import CheckIcon from '@omni-design/icons/Check';
import { Caption } from '../Typography/Typography';
import { IconButton } from '../Button/Button';
/* The lib's own icon button — <Button iconOnly> — not MUI's, so hover,
   pressed, focus-visible and disabled all come from Button rather than
   being re-derived at each call site. */

/** Upper bound on the corner. A code panel reads as a technical surface; past
 *  this it starts looking like a pill with code in it. */
const RADIUS_CAP = '12px';

const SxBox = lazySxBox('CodeBlock');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* ─── Static sheet ───
   The copy button's color is one element + one class: it must beat Button's
   own resting color (.omni-btn-v) and still give way to its hover, focus and
   disabled colors, as the emotion class it replaces did. */
registerStaticStyles('omni-codeblock', [
  /* --Card-Radius, not --Style-Border-Radius: the latter is aliased to
     --Button-Radius and goes fully pill on a Playful system, which reads
     wrong wrapped around dense monospace. Capped so the block still shrinks
     on tight styles but stops growing on round ones. */
  `.omni-cb{background-color:var(--Background);border-radius:min(var(--Card-Radius, var(--Style-Border-Radius)), ${RADIUS_CAP});overflow:hidden}`,
  '.omni-cb-head{display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between;gap:8px;padding:8px 16px;'
    + 'border-bottom:1px solid var(--Border);min-height:40px}',
  '.omni-cb-area{display:flex;align-items:flex-start;gap:8px;padding:16px}',
  '.omni-cb-pre{margin:0;font-family:inherit;flex:1;min-width:0;overflow:auto}',
  /* pre-wrap keeps indentation while allowing long lines to break; pre keeps
     the block scrolling horizontally instead. */
  '.omni-cb-code{font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;font-size:13px;line-height:1.6;'
    + 'color:var(--Text);white-space:pre;word-break:normal;display:block}',
  '.omni-cb-wrap{white-space:pre-wrap;word-break:break-word}',
  'button.omni-cb-copy{color:var(--Quiet)}',
  'button.omni-cb-copied{color:var(--Icons-Success, var(--Text))}',
].join('\n'));

/* MUI's sizing rule, as the sx maxHeight it replaces read a number: a
   fraction up to 1 is a percentage, anything else pixels. */
const sizeValue = (v) => (typeof v === 'number' ? (v > 0 && v <= 1 ? v * 100 + '%' : v + 'px') : v);

/** Copy-to-clipboard control. Confirms for two seconds, then resets. */
function CopyButton({ code, label = 'Copy code' }) {
  useStaticStyles('omni-codeblock');
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
    <PlainTooltip title={copied ? 'Copied!' : label}>
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
        className={copied ? 'omni-cb-copied' : 'omni-cb-copy'}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </PlainTooltip>
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
  /* Figma's Copy In Header / Copy In Body, independently. By default the copy
     button follows the header — in it when there is one (Figma's defaults:
     header on, Copy In Header on, Copy In Body off), in the body when not, so
     hiding the header never removes the only way to copy. Set either to
     place it explicitly; showCopy={false} still hides both. */
  copyInHeader,
  copyInBody,
  maxHeight,
  wrap = false,
  sx,
  className,
  ...rest
}) {
  useStaticStyles('omni-codeblock');
  const inHeader = copyInHeader !== undefined ? copyInHeader : showHeader;
  const inBody = copyInBody !== undefined ? copyInBody : !showHeader;
  const headerCopy = showHeader && inHeader && showCopy && !!code;
  const bodyCopy = inBody && showCopy && !!code;
  const rootProps = {
    // The pair that makes this region dark. Never a literal color.
    'data-theme': 'Neutral',
    'data-surface': 'Surface-Dimmest',
    className: 'omni-cb' + (className ? ' ' + className : ''),
    ...rest,
  };
  const content = (
    <>
      {showHeader && (language || headerCopy) && (
        <div className="omni-cb-head">
          <Caption color="quiet">{language}</Caption>
          {headerCopy ? <CopyButton code={code} /> : null}
        </div>
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
      <div className="omni-cb-area">
        <pre className="omni-cb-pre" style={maxHeight != null ? { maxHeight: sizeValue(maxHeight) } : undefined}>
          <code className={'omni-cb-code' + (wrap ? ' omni-cb-wrap' : '')}>
            {code}
          </code>
        </pre>
        {bodyCopy ? <CopyButton code={code} /> : null}
      </div>
    </>
  );
  return hasSx(sx)
    ? <SxBox sx={sx} {...rootProps}>{content}</SxBox>
    : <div {...rootProps}>{content}</div>;
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
  copyInHeader: PropTypes.bool,
  copyInBody: PropTypes.bool,
  /** Cap the code area's height and scroll past it. */
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Wrap long lines instead of scrolling horizontally. */
  wrap: PropTypes.bool,
  sx: PropTypes.object,
};

export { CopyButton };
export default CodeBlock;
