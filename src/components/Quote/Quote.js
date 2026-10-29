// src/components/Quote/Quote.js
import React from 'react';
import FormatQuoteIcon from '@omni-design/icons/FormatQuote';
import { H3, H4, H5, Subtitle, Caption } from '../Typography';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon/Icon';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('Quote');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/**
 * Quote — a pull quote or a testimonial: the words, who said them, and what
 * they are.
 *
 *   <Quote cite="Priya Shah" detail="Studio Lead, Northwind" avatarSrc="…">
 *     Set up in an afternoon, and it has not needed us since.
 *   </Quote>
 *
 * STRUCTURE. A <figure>: the words in a <blockquote>, the attribution in a
 * <figcaption>. That pairing is what tells a screen reader whose words these
 * are; a quote set in a paragraph next to a name is two unrelated lines.
 *
 * TYPE. The words wear the HEADER face — H5 / H4 / H3 by size — because a
 * pull quote is display text, set large to be read at a glance. They render
 * as a <p> inside the blockquote, so the page's heading outline is untouched.
 * The name is Subtitle (body-sized, bold, --Text); the detail Caption, quiet.
 *
 * THE MARK. A quotation mark in the primary icon color, decorative
 * (aria-hidden — the blockquote already says "quote"). `mark={false}` drops it.
 *
 * NO FRAME. A Quote is content. Put it in a Card, a Section or a Shape-framed
 * layout as the page needs; it brings no surface of its own, so it reads on
 * whatever it sits on.
 */

const WORDS = { small: H5, medium: H4, large: H3 };
/* As tall as the name and detail beside it. */
const AVATAR = { small: 'medium', medium: 'large', large: 'xl' };

registerBoxStyles('omni-quote', [
  '.omni-quote{margin:0;display:flex;flex-direction:column;align-items:flex-start;gap:var(--Sizing-2, 16px);text-align:start;max-width:65ch}',
  '.omni-quote-center{align-items:center;text-align:center}',
  // Two classes: the Icon's own rules are one class, in its own sheet.
  '.omni-quote>.omni-quote-mark{margin-bottom:calc(-1 * var(--Sizing-1, 8px))}',
  '.omni-quote-words{margin:0}',
  '.omni-quote-cite{display:flex;align-items:center;gap:var(--Sizing-1, 8px);flex-direction:row}',
  '.omni-quote-center>.omni-quote-cite{flex-direction:column}',
  '.omni-quote-who{display:flex;flex-direction:column;min-width:0}',
].join('\n'));

export function Quote({
  children,
  cite,
  detail,
  avatarSrc,
  avatarInitials,
  size = 'medium',
  align = 'start',
  mark = true,
  markColor = 'primary',
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-quote');
  const Words = WORDS[size] || WORDS.medium;
  const centred = align === 'center';
  const hasPerson = Boolean(avatarSrc || avatarInitials);

  const root = {
    className: 'quote quote-' + size + (className ? ' ' + className : '')
      + ' MuiBox-root omni-quote' + (centred ? ' omni-quote-center' : ''),
    ...props,
  };
  const content = (
    <>
      {mark && (
        <Icon color={markColor} size="large" aria-hidden="true" className="quote-mark MuiBox-root omni-quote-mark">
          <FormatQuoteIcon />
        </Icon>
      )}
      <blockquote className="quote-words MuiBox-root omni-quote-words">
        <Words component="p" style={{ margin: 0 }}>{children}</Words>
      </blockquote>
      {(cite || detail) && (
        <figcaption className="quote-cite MuiBox-root omni-quote-cite">
          {hasPerson && <Avatar src={avatarSrc} initials={avatarInitials} size={AVATAR[size] || 'medium'} alt="" />}
          <div className="MuiBox-root omni-quote-who">
            {cite && <Subtitle component="span">{cite}</Subtitle>}
            {detail && <Caption color="quiet" component="span">{detail}</Caption>}
          </div>
        </figcaption>
      )}
    </>
  );
  if (hasSx(sx)) return <SxBox component="figure" sx={sx} {...root}>{content}</SxBox>;
  return <figure {...root}>{content}</figure>;
}

export default Quote;
