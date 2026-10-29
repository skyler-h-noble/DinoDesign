// src/components/LinkGroup/LinkGroup.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

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
const SxBox = lazySxBox('LinkGroup');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

/* The static sheet: what each part handed emotion as sx, as classes over the
   same tokens. */
registerStaticStyles('omni-link-group', webkitBox([
  '.omni-lg{display:flex;flex-wrap:wrap;align-items:center;gap:var(--Sizing-2, 16px);list-style:none;margin:0;padding:0}',
  /* The bar is a Body-sized glyph — Figma's separator is the Body style
     (16 / 24), so it centres on the links' own line box. */
  '.omni-lg-sep{display:inline-flex;align-items:center;color:var(--Border-Variant);user-select:none;'
    + 'font-family:var(--Body-Font-Family, inherit);font-size:var(--Body-Medium-Font-Size, 16px);line-height:var(--Body-Medium-Line-Height, 24px)}',
  '.omni-lg-item{display:inline-flex}',
].join('\n')));

/** A part's root: static classes, plus an MUI box only when given sx. */
function Part({ sx, component: Tag = 'div', ...props }) {
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...props} />;
  return <Tag {...props} />;
}

export function LinkGroup({ children, separator = '|', className = '', sx = {}, 'aria-label': ariaLabel, ...props }) {
  useStaticStyles('omni-link-group');
  const items = React.Children.toArray(children).filter(Boolean);
  const list = (
    <Part
      component="ul"
      className={'link-group ' + (ariaLabel ? '' : className) + ' MuiBox-root omni-lg'}
      sx={ariaLabel ? undefined : sx}
      {...(ariaLabel ? {} : props)}
    >
      {items.flatMap((child, i) => [
        i > 0 && (
          <li key={'sep-' + i} aria-hidden="true" role="presentation" className="link-group-separator MuiBox-root omni-lg-sep">
            {separator}
          </li>
        ),
        <li key={'link-' + i} className="link-group-item MuiBox-root omni-lg-item">{child}</li>,
      ].filter(Boolean))}
    </Part>
  );
  return ariaLabel
    ? <Part component="nav" aria-label={ariaLabel} className={'link-group-nav ' + className + ' MuiBox-root'} sx={sx} {...props}>{list}</Part>
    : list;
}

export default LinkGroup;
