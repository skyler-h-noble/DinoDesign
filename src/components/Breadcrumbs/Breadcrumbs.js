// src/components/Breadcrumbs/Breadcrumbs.js
import React, { Children, isValidElement } from 'react';
import { Box } from '@mui/material';
import { Popover } from '../Popover/Popover';
import { Button } from '../Button/Button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { BodySmall, Caption } from '../Typography';

/**
 * Breadcrumbs Component
 *
 * A navigational trail showing page hierarchy within the application.
 *
 * SIZES: small | medium | large  — scales font-size and vertical padding.
 * The GAP does not scale; see the note on GAP below.
 * SEPARATOR: any React node (default "/")
 * CONDENSE: collapses middle crumbs into "…" (keeps first + last N)
 * BACK ONLY MOBILE: at ≤600px, shows only "← Parent" link
 *
 * Children should be Link or Typography elements.
 * The last child is treated as the current page (not a link, aria-current="page").
 */

/* ONE value, deliberately not a row in the table below.
 *
 * The gap sits on the container, so it applies on BOTH sides of every
 * separator — each "/" lives in a 2x channel. What that channel should track
 * is the TEXT, and the text is 14 / 16 / 18, so a half-text channel targets
 * 7 / 8 / 9 — all three of which snap to the same rung.
 *
 * It was 6 / 8 / 10 as literal pixels. Neither 6 nor 10 is on the Sizing scale
 * (Quarter 2, Half 4, 1 = 8, 1-and-Half 12), so they could only ever be
 * hardcoded. Copying Checkbox's 4 / 8 / 12 would have been worse, not better:
 * that ramp separates a control from its label and is keyed to the BOX size,
 * and at large it would put 12px each side of a separator — a 24px channel
 * that reads as separate words rather than a trail. */
const GAP = 'var(--Sizing-1)';

const SIZE_MAP = {
  small:  { fontSize: 'var(--Body-Small-Font-Size)', py: '4px', line: 'var(--Body-Small-Line-Height, 20px)' },
  medium: { fontSize: 'var(--Body-Font-Size)',       py: '6px', line: 'var(--Body-Medium-Line-Height, 24px)' },
  large:  { fontSize: 'var(--Body-Large-Font-Size)', py: '8px', line: 'var(--Body-Large-Line-Height, 28px)' },
};

/* Figma's .Breadcrumbs-separator Shape axis. A string or node not named here
   is drawn as given, so existing separator="/" (or a custom icon) keeps
   working. */
const SEPARATOR_SHAPES = { slanted: '/', bar: '|' };

export function Breadcrumbs({
  children,
  separator = 'slanted',  // 'slanted' | 'bar' | 'ellipsis' | any node
  size = 'medium',
  condense = false,
  maxItems = 4,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  backOnlyMobile = false,
  onExpand,
  className = '',
  sx = {},
  ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const items = Children.toArray(children).filter(isValidElement);
  const total = items.length;

  // ── Condensed items ──
  /* The middle crumbs fold into a "…" button that opens a Popover listing
     them — the hidden pages in order, one link per row — the same pattern as
     AvatarGroup's "+N". It used to expand the trail inline, which reflowed
     the whole line and could wrap it onto two. */
  const shouldCondense = condense && total > maxItems;
  let visibleItems = items;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const ellipsisRef = React.useRef(null);
  const hiddenItems = shouldCondense ? items.slice(itemsBeforeCollapse, total - itemsAfterCollapse) : [];

  if (shouldCondense) {
    const before = items.slice(0, itemsBeforeCollapse);
    const after = items.slice(total - itemsAfterCollapse);
    const ellipsis = (
      <React.Fragment key="__breadcrumb-ellipsis">
        {/* The lib's ghost icon Button, so the "…" has Button's own
            hover, pressed and focus states (Figma: a ghost iconOnly Button
            with more_horiz). */}
        <Button
          ref={ellipsisRef}
          variant="ghost"
          contentType="iconOnly"
          size="small"
          onClick={() => { setMenuOpen((o) => !o); onExpand?.(); }}
          aria-label={'Show ' + hiddenItems.length + ' hidden pages'}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className="breadcrumb-ellipsis"
        >
          <MoreHorizIcon />
        </Button>
        <Popover open={menuOpen} onClose={() => setMenuOpen(false)} anchorEl={ellipsisRef.current}
          placement="bottom-start" arrow width="auto" theme={null} aria-label="Hidden pages">
          <Box component="ul" className="breadcrumb-menu"
            sx={{ listStyle: 'none', m: 0, p: 'var(--Sizing-1, 8px)', display: 'flex', flexDirection: 'column' }}>
            {hiddenItems.map((item, i) => (
              <Box key={'hidden-' + i} component="li" className="breadcrumb-menu-item"
                onClick={() => setMenuOpen(false)}
                sx={{ padding: 'var(--Sizing-Half, 4px) var(--Sizing-1, 8px)', lineHeight: s.line, fontSize: 'inherit' }}>
                {item}
              </Box>
            ))}
          </Box>
        </Popover>
      </React.Fragment>
    );
    visibleItems = [...before, ellipsis, ...after];
  }

  // ── Separator renderer ──
  const renderSeparator = (key) => (
    <Box
      key={'sep-' + key}
      component="li"
      role="presentation"
      aria-hidden="true"
      className="breadcrumb-separator"
      sx={{
        display: 'inline-flex', alignItems: 'center',
        /* Border-Variant, as Figma binds it: the separator is decoration
           (aria-hidden), so it carries no contrast requirement — the crumbs
           do. A full Body line tall, as the text-shaped separators are. */
        color: 'var(--Border-Variant)', userSelect: 'none',
        fontSize: 'inherit', lineHeight: s.line, flexShrink: 0,
      }}
    >
      {separator === 'ellipsis'
        ? <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'currentColor' }} />
        : (SEPARATOR_SHAPES[separator] ?? separator)}
    </Box>
  );

  // ── Build interleaved list ──
  const interleaved = [];
  visibleItems.forEach((item, i) => {
    const isLast = shouldCondense
      ? i === visibleItems.length - 1
      : i === total - 1;

    interleaved.push(
      <Box
        key={'crumb-' + i}
        component="li"
        className={'breadcrumb-item' + (isLast ? ' breadcrumb-current' : '')}
        sx={{
          display: 'inline-flex', alignItems: 'center',
          /* Semibold, from the token rather than a literal 600. The design
             sets the current crumb in SemiBold and the links in Regular, so
             the page you are on is marked by WEIGHT — a signal that survives
             greyscale and does not depend on color alone. A hardcoded 600
             would not move with a brand that re-picks its semibold. */
          ...(isLast && {
            color: 'var(--Text)',
            fontWeight: 'var(--Body-Medium-Semibold-Font-Weight, 600)',
          }),
          /* The link role, spelled exactly as Link.js spells it — `--Link` is
             never defined by anything, so the fallback to `--Hotlink` (which
             the generator does emit) is the value that actually lands. This is
             the one case where a var() fallback is correct rather than dead.

             Was `--Quiet`, the muted-TEXT role. Contrast was fine (Quiet is
             tuned to 4.5:1), but a link painted as muted text does not
             announce itself as a link, and every crumb except the last IS
             one. Only the wrapper is set: a <Link> child still paints itself,
             so this changes the plain-text case to match the design. */
          ...(!isLast && { color: 'var(--Link, var(--Hotlink))' }),
          // Truncate long crumbs
          maxWidth: '200px',
          '& > *': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        }}
        {...(isLast ? { 'aria-current': 'page' } : {})}
      >
        {item}
      </Box>
    );
    if (i < visibleItems.length - 1) {
      interleaved.push(renderSeparator(i));
    }
  });

  // ── Back-only mobile: parent link ──
  const parentItem = total >= 2 ? items[total - 2] : null;

  return (
    <Box
      component="nav"
      aria-label="Breadcrumb"
      className={'breadcrumbs breadcrumbs-' + size + ' ' + className}
      sx={{
        fontSize: s.fontSize,
        fontFamily: 'var(--Body-Font-Family)',
        lineHeight: 1.5,
        ...sx,
      }}
      {...props}
    >
      {/* Full breadcrumb trail */}
      <Box
        component="ol"
        className="breadcrumbs-list"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: GAP,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          ...(backOnlyMobile && {
            '@media (max-width: 600px)': { display: 'none' },
          }),
        }}
      >
        {interleaved}
      </Box>

      {/* Back-only mobile view */}
      {backOnlyMobile && parentItem && (
        <Box
          className="breadcrumbs-back-mobile"
          sx={{
            display: 'none',
            '@media (max-width: 600px)': {
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--Sizing-Half)',
              fontSize: s.fontSize,
              color: 'var(--Link)',
            },
          }}
        >
          <Box
            component="span"
            aria-hidden="true"
            sx={{ fontSize: '1.1em', lineHeight: 1 }}
          >
            ←
          </Box>
          {React.cloneElement(parentItem, {
            style: {
              ...(parentItem.props?.style || {}),
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          })}
        </Box>
      )}
    </Box>
  );
}

/* ─── BreadcrumbItem: optional typed wrapper ─── */
export function BreadcrumbItem({ children, href, className = '', sx = {}, ...props }) {
  const isLink = !!href;
  return (
    <Box
      component={isLink ? 'a' : 'span'}
      href={href || undefined}
      className={'breadcrumb-link ' + className}
      sx={{
        color: 'inherit',
        textDecoration: isLink ? 'underline' : 'none',
        textUnderlineOffset: '3px',
        textDecorationThickness: '1px',
        cursor: isLink ? 'pointer' : 'default',
        transition: 'color 0.15s ease',
        ...(isLink && {
          /* Links do not change COLOUR on hover — the design system emits no
             hover tone for them and the underline carries the state instead.
             This read `color: var(--Link-Hover)`, a variable nothing defines,
             and with no fallback the whole declaration is invalid at computed-
             value time: the color fell back to `inherit`, so hovering a
             breadcrumb link made it stop looking like a link. */
          /* The Link rule: hover and pressed REMOVE the underline (focus
             keeps it) — Figma's Link set. This thickened it to 2px / 3px. */
          '&:hover, &:active': { textDecoration: 'none' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px', borderRadius: '2px' },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Breadcrumbs;
