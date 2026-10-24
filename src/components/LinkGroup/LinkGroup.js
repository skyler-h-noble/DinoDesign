// src/components/LinkGroup/LinkGroup.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * LinkGroup — Figma's `Hotlink Group` (3156:5504): links in a row with a bar
 * between each, as in a footer or a "Privacy | Terms | Help" line.
 *
 *   <LinkGroup aria-label="Legal">
 *     <Link href="/privacy">Privacy</Link>
 *     <Link href="/terms">Terms</Link>
 *   </LinkGroup>
 *
 * GAP is Sizing-2 (16) on both sides of every separator — the file's outer
 * row. (Inside its Link Slot the file uses Sizing-1, 8, which makes the
 * spacing uneven partway along; one gap is the intent.)
 *
 * The SEPARATOR is decoration: Border-Variant, the system's no-contrast
 * decorative tone, and aria-hidden, so a screen reader hears a list of links
 * rather than "Privacy, vertical bar, Terms".
 *
 * A list, so the count is announced ("list, 4 items"). Give it an aria-label
 * and it is wrapped in a <nav> landmark — right for a footer's links, wrong
 * for links inside a paragraph, so it is opt-in.
 */
export function LinkGroup({ children, separator = '|', className = '', sx = {}, 'aria-label': ariaLabel, ...props }) {
  const items = React.Children.toArray(children).filter(Boolean);
  const list = (
    <Box
      component="ul"
      className={'link-group ' + (ariaLabel ? '' : className)}
      sx={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        gap: 'var(--Sizing-2, 16px)',
        listStyle: 'none', m: 0, p: 0,
        ...(ariaLabel ? {} : sx),
      }}
      {...(ariaLabel ? {} : props)}
    >
      {items.flatMap((child, i) => [
        i > 0 && (
          <Box key={'sep-' + i} component="li" aria-hidden="true" role="presentation" className="link-group-separator"
            /* The bar is a Body-sized glyph — Figma's separator is the Body
               style (16 / 24), so it centres on the links' own line box. */
            sx={{
              display: 'inline-flex', alignItems: 'center', color: 'var(--Border-Variant)', userSelect: 'none',
              fontFamily: 'var(--Body-Font-Family, inherit)', fontSize: 'var(--Body-Medium-Font-Size, 16px)',
              lineHeight: 'var(--Body-Medium-Line-Height, 24px)',
            }}>
            {separator}
          </Box>
        ),
        <Box key={'link-' + i} component="li" className="link-group-item" sx={{ display: 'inline-flex' }}>{child}</Box>,
      ].filter(Boolean))}
    </Box>
  );
  return ariaLabel
    ? <Box component="nav" aria-label={ariaLabel} className={'link-group-nav ' + className} sx={sx} {...props}>{list}</Box>
    : list;
}

export default LinkGroup;
