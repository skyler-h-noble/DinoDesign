// src/components/Breadcrumbs/Breadcrumbs.js
import React, { Children, isValidElement } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { Button } from '../Button/Button';
import MoreHorizIcon from '@omni-design/icons/MoreHoriz';
import ArrowBackIcon from '@omni-design/icons/ArrowBack';
import { Icon } from '../Icon/Icon';
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

/* The hidden-pages panel, loaded the first time it is wanted: most trails
   never condense, so Popover stays out of their download. Pointing at or
   focusing the "…" starts the load, ahead of the press. */
const loadPopover = () => import('../Popover/Popover');
const Popover = React.lazy(() => loadPopover().then((m) => ({ default: m.Popover })));

const SxBox = lazySxBox('Breadcrumbs');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/** A part's root: static classes, plus an MUI box only when given sx. */
function Part({ sx, component: Tag = 'div', ...props }) {
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...props} />;
  return <Tag {...props} />;
}

/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

/* The static sheet — what each part handed emotion, as classes over the same
   tokens. Size arrives as a modifier class per part (font size on the trail,
   line height on the separators and the menu rows). */
registerStaticStyles('omni-breadcrumbs', webkitBox([
  '.omni-bc{font-family:var(--Body-Font-Family);line-height:1.5}',
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-bc-${k}{font-size:${v.fontSize}}`),
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-bc-lh-${k}{line-height:${v.line}}`),
  `.omni-bc-list{display:flex;flex-wrap:wrap;align-items:center;gap:${GAP};list-style:none;margin:0;padding:0}`,
  '@media (max-width: 600px){.omni-bc-list-bom{display:none}}',
  /* Border-Variant, as Figma binds it: the separator is decoration
     (aria-hidden), so it carries no contrast requirement — the crumbs do. A
     full Body line tall, as the text-shaped separators are. */
  '.omni-bc-sep{display:inline-flex;align-items:center;color:var(--Border-Variant);user-select:none;font-size:inherit;flex-shrink:0}',
  '.omni-bc-dot{width:4px;height:4px;border-radius:50%;background-color:currentColor}',
  /* Truncate long crumbs. The current crumb is --Text in the semibold token;
     every other one takes the link role (see the note in the component). */
  '.omni-bc-item{display:inline-flex;align-items:center;max-width:200px}',
  '.omni-bc-item-cur{color:var(--Text);font-weight:var(--Body-Medium-Semibold-Font-Weight, 600)}',
  '.omni-bc-item-link{color:var(--Link, var(--Hotlink))}',
  '.omni-bc-item>*{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.omni-bc-back{display:none}',
  '@media (max-width: 600px){.omni-bc-back{display:flex;align-items:center;gap:var(--Sizing-Half);color:var(--Link, var(--Hotlink))}'
    + Object.entries(SIZE_MAP).map(([k, v]) => `.omni-bc-back-${k}{font-size:${v.fontSize}}`).join('') + '}',
  '.omni-bc-back .omni-icon.omni-bc-ic{color:inherit}',
  '.omni-bc-menu{list-style:none;margin:0;padding:var(--Sizing-1, 8px);display:flex;flex-direction:column}',
  '.omni-bc-menu-item{padding:var(--Sizing-Half, 4px) var(--Sizing-1, 8px);font-size:inherit}',
  /* BreadcrumbItem. text-decoration is set before its thickness so the
     shorthand does not reset it; hover and pressed reset both, as the old
     `text-decoration: none` did. */
  '.omni-bc-link{color:inherit;text-decoration:none;text-underline-offset:3px;text-decoration-thickness:1px;cursor:default;transition:color 0.15s ease}',
  '.omni-bc-link-a{text-decoration-line:underline;cursor:pointer}',
  '.omni-bc-link-a:hover,.omni-bc-link-a:active{text-decoration:none}',
  '.omni-bc-link-a:focus-visible{outline:3px solid var(--Focus-Visible);outline-offset:2px;border-radius:2px}',
].join('\n')));

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
  useStaticStyles('omni-breadcrumbs');
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
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
  const [menuWanted, setMenuWanted] = React.useState(false);
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
          onPointerEnter={loadPopover} onFocus={loadPopover}
          onClick={() => { setMenuWanted(true); setMenuOpen((o) => !o); onExpand?.(); }}
          aria-label={'Show ' + hiddenItems.length + ' hidden pages'}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className="breadcrumb-ellipsis"
        >
          <MoreHorizIcon />
        </Button>
        {menuWanted && <React.Suspense fallback={null}>
        <Popover open={menuOpen} onClose={() => setMenuOpen(false)} anchorEl={ellipsisRef.current}
          placement="bottom-start" arrow width="auto" theme={null} aria-label="Hidden pages">
          <ul className="breadcrumb-menu MuiBox-root omni-bc-menu">
            {hiddenItems.map((item, i) => (
              <li key={'hidden-' + i} className={'breadcrumb-menu-item MuiBox-root omni-bc-menu-item omni-bc-lh-' + sizeKey}
                onClick={() => setMenuOpen(false)}>
                {item}
              </li>
            ))}
          </ul>
        </Popover>
        </React.Suspense>}
      </React.Fragment>
    );
    visibleItems = [...before, ellipsis, ...after];
  }

  // ── Separator renderer ──
  const renderSeparator = (key) => (
    /* Border-Variant, as Figma binds it: the separator is decoration
       (aria-hidden), so it carries no contrast requirement — the crumbs
       do. A full Body line tall, as the text-shaped separators are. */
    <li
      key={'sep-' + key}
      role="presentation"
      aria-hidden="true"
      className={'breadcrumb-separator MuiBox-root omni-bc-sep omni-bc-lh-' + sizeKey}
    >
      {separator === 'ellipsis'
        ? <span className="MuiBox-root omni-bc-dot" />
        : (SEPARATOR_SHAPES[separator] ?? separator)}
    </li>
  );

  // ── Build interleaved list ──
  const interleaved = [];
  visibleItems.forEach((item, i) => {
    const isLast = shouldCondense
      ? i === visibleItems.length - 1
      : i === total - 1;

    interleaved.push(
      /* Semibold, from the token rather than a literal 600. The design
         sets the current crumb in SemiBold and the links in Regular, so the
         page you are on is marked by WEIGHT — a signal that survives
         greyscale and does not depend on color alone. A hardcoded 600 would
         not move with a brand that re-picks its semibold.

         Every other crumb takes the link role, spelled exactly as Link.js
         spells it — `--Link` is never defined by anything, so the fallback to
         `--Hotlink` (which the generator does emit) is the value that
         actually lands. This is the one case where a var() fallback is
         correct rather than dead.

         Was `--Quiet`, the muted-TEXT role. Contrast was fine (Quiet is tuned
         to 4.5:1), but a link painted as muted text does not announce itself
         as a link, and every crumb except the last IS one. Only the wrapper
         is set: a <Link> child still paints itself, so this changes the
         plain-text case to match the design. Long crumbs truncate. */
      <li
        key={'crumb-' + i}
        className={'breadcrumb-item' + (isLast ? ' breadcrumb-current' : '')
          + ' MuiBox-root omni-bc-item ' + (isLast ? 'omni-bc-item-cur' : 'omni-bc-item-link')}
        {...(isLast ? { 'aria-current': 'page' } : {})}
      >
        {item}
      </li>
    );
    if (i < visibleItems.length - 1) {
      interleaved.push(renderSeparator(i));
    }
  });

  // ── Back-only mobile: parent link ──
  const parentItem = total >= 2 ? items[total - 2] : null;

  return (
    <Part
      component="nav"
      aria-label="Breadcrumb"
      className={'breadcrumbs breadcrumbs-' + size + ' ' + className + ' MuiBox-root omni-bc omni-bc-' + sizeKey}
      sx={sx}
      {...props}
    >
      {/* Full breadcrumb trail */}
      <ol className={'breadcrumbs-list MuiBox-root omni-bc-list' + (backOnlyMobile ? ' omni-bc-list-bom' : '')}>
        {interleaved}
      </ol>

      {/* Back-only mobile view. --Link is not emitted by the generator;
          --Hotlink is. A bare var(--Link) left the arrow the surrounding
          text's color. */}
      {backOnlyMobile && parentItem && (
        <div className={'breadcrumbs-back-mobile MuiBox-root omni-bc-back omni-bc-back-' + sizeKey}>
          {/* arrow_back, as Figma's Mobile breadcrumb: "← Parent". */}
          <Icon size="small" aria-hidden="true" className="omni-bc-ic"><ArrowBackIcon /></Icon>
          {React.cloneElement(parentItem, {
            style: {
              ...(parentItem.props?.style || {}),
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          })}
        </div>
      )}
    </Part>
  );
}

/* ─── BreadcrumbItem: optional typed wrapper ─── */
/* Links do not change COLOUR on hover — the design system emits no hover
   tone for them and the underline carries the state instead. (This once read
   `color: var(--Link-Hover)`, a variable nothing defines, which made a hovered
   breadcrumb link stop looking like a link.) The Link rule: hover and pressed
   REMOVE the underline, focus keeps it — Figma's Link set. */
export function BreadcrumbItem({ children, href, className = '', sx = {}, ...props }) {
  useStaticStyles('omni-breadcrumbs');
  const isLink = !!href;
  return (
    <Part
      component={isLink ? 'a' : 'span'}
      href={href || undefined}
      className={'breadcrumb-link ' + className + ' MuiBox-root omni-bc-link' + (isLink ? ' omni-bc-link-a' : '')}
      sx={sx}
      {...props}
    >
      {children}
    </Part>
  );
}

export default Breadcrumbs;
