// src/components/Quote/Quote.js
import React from 'react';
import { Box } from '@mui/material';
import FormatQuoteIcon from '@omni-design/icons/FormatQuote';
import { H3, H4, H5, Subtitle, Caption } from '../Typography';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon/Icon';

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
  sx = {},
  ...props
}) {
  const Words = WORDS[size] || WORDS.medium;
  const centred = align === 'center';
  const hasPerson = Boolean(avatarSrc || avatarInitials);

  return (
    <Box
      component="figure"
      className={'quote quote-' + size + (className ? ' ' + className : '')}
      sx={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: centred ? 'center' : 'flex-start',
        gap: 'var(--Sizing-2, 16px)',
        textAlign: centred ? 'center' : 'start',
        maxWidth: '65ch',
        ...sx,
      }}
      {...props}
    >
      {mark && (
        <Icon color={markColor} size="large" aria-hidden="true" className="quote-mark"
              sx={{ marginBottom: 'calc(-1 * var(--Sizing-1, 8px))' }}>
          <FormatQuoteIcon />
        </Icon>
      )}
      <Box component="blockquote" className="quote-words" sx={{ margin: 0 }}>
        <Words component="p" style={{ margin: 0 }}>{children}</Words>
      </Box>
      {(cite || detail) && (
        <Box component="figcaption" className="quote-cite"
             sx={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1, 8px)',
                   flexDirection: centred ? 'column' : 'row' }}>
          {hasPerson && <Avatar src={avatarSrc} initials={avatarInitials} size={AVATAR[size] || 'medium'} alt="" />}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {cite && <Subtitle component="span">{cite}</Subtitle>}
            {detail && <Caption color="quiet" component="span">{detail}</Caption>}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Quote;
