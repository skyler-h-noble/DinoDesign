// src/components/Badge/Badge.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * Badge Component
 * Small label attached to a child element showing status or count
 *
 * VARIANTS:
 *   SOLID   variant="{color}"           filled badge, all 8 colors
 *   (No outline: removed — a count is a solid mark. `{color}-outline` renders
 *   the solid badge of that color and warns once in development.)
 *
 * The LIGHT shape was removed — see normalizeBadgeVariant.
 *
 * COLOUR comes from the ICONS palette, matching the design, which binds
 * Icons/<palette> and Icons/On-<palette>. Not the Buttons palette: a badge is
 * a non-text element under WCAG 1.4.11 and needs 3:1 against its surround.
 * --Buttons-<C>-Button is a FILL and carries no such guarantee (it is
 * --Buttons-<C>-Border that does), whereas --Icons-<C> is picked to contrast
 * with the surface and --Icons-On-<C> is held at 4.5:1 on it.
 *
 * SIZE: one. 16px counter, 4px side padding, 8px dot.
 *
 * There is no size prop any more — see the SIZE note below. The two badges
 * the design draws are TYPES, not sizes:
 *
 *   type="standard"  16px pill carrying badgeContent   (default)
 *   type="status"     8px dot, no content
 *
 * `type` is the design's own axis name, so the Figma property and this prop
 * read the same. `dot` is the older spelling of the same thing and still
 * works — passing either gives the status dot.
 *
 * FEATURES:
 *   badgeContent: number | string | ReactNode
 *   max: cap number display (default 99)
 *   showZero: show badge when content is 0
 *   invisible: hide badge
 *   dot: show dot instead of content
 *   anchorOrigin: { vertical, horizontal } positioning
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

function solidStyles(color) {
  const C = cap(color);
  return {
    bg:     'var(--Icons-' + C + ')',
    text:   'var(--Icons-On-' + C + ')',
    // Figma strokes the badge 1px in its own fill (Icons/<palette>); inside
    // the 16px, so it reads solid and keeps its size.
    border: '1px solid var(--Icons-' + C + ')',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color]              = solidStyles(color);
  });
  return map;
}

/* The `-light` shape is removed, as on Button and Chip. It was solidStyles
   plus a border — the same fill as the solid badge — so it never rendered the
   tint its name promised.
   Not a hard delete: the lookup below falls back to variantMap['primary'], so
   deleting the entries would have repainted every error-light badge as PRIMARY
   with no error. Strip the suffix to the solid badge of the SAME color. */
const LIGHT_SUFFIX = /-light$/;
const warnedVariants = new Set();

/* The outline shape is removed too — the Badge Counter set has one shape, a
   solid count — and normalised the same way, to the solid of the SAME color. */
const OUTLINE_SUFFIX = /-outline$/;

export function normalizeBadgeVariant(variant) {
  const v = String(variant || 'primary');
  if (OUTLINE_SUFFIX.test(v)) {
    const base = v.replace(OUTLINE_SUFFIX, '');
    if (process.env.NODE_ENV !== 'production' && !warnedVariants.has(v)) {
      warnedVariants.add(v);
      console.warn(
        '[Badge] variant="' + v + '" — the outline shape was removed. ' +
        'Rendering variant="' + base + '" (solid).',
      );
    }
    return base;
  }
  if (!LIGHT_SUFFIX.test(v)) return v;
  const base = v.replace(LIGHT_SUFFIX, '');
  if (process.env.NODE_ENV !== 'production' && !warnedVariants.has(v)) {
    warnedVariants.add(v);
    console.warn(
      '[Badge] variant="' + v + '" — the -light shape was removed. Rendering ' +
      'variant="' + base + '" (solid).',
    );
  }
  return base;
}

// --- Sizing ------------------------------------------------------------------

// Every value here is a token, not a measurement, and there is one row.
//
// This was a three-row ladder (16 / 20 / 24) extrapolated from the single
// badge the design draws. Its middle row could not be written in the Sizing
// scale at all — 6px padding and a 10px dot fall between --Sizing-Half (4)
// and --Sizing-1 (8), which steps in 4s — and that row was the DEFAULT. A
// value the token system cannot name is a good sign it was invented.
//
// Nor is there a digits row: the counter's type is the design's own Badge
// style (11/12), one value rather than a ladder. A count is an absolute
// affordance — it has to read the same hanging off a 20px icon or a 56px FAB
// — so it does not scale with its anchor, which is why no major system ships
// a "large" badge either.
const BADGE = {
  size: 'var(--Sizing-2)',      // 16
  padX: 'var(--Sizing-Half)',   //  4
  dot:  'var(--Sizing-1)',      //  8
};

/* `size` is accepted and ignored. Removing the prop outright would have let it
   fall into ...props and reach MuiBadge, which forwards unknown props to the
   DOM — a React warning at best, a stray attribute at worst. Warn once
   instead, the same treatment the removed -light shape gets. */
const warnedSizes = new Set();

function warnRemovedSize(size) {
  if (size === undefined) return;
  if (process.env.NODE_ENV === 'production' || warnedSizes.has(size)) return;
  warnedSizes.add(size);
  console.warn(
    '[Badge] size="' + size + '" — Badge has one size and the prop was ' +
    'removed. Rendering the 16px counter. For the 8px status dot use \n' +
    'type="status".',
  );
}

// --- Component ---------------------------------------------------------------

/* The static sheet. Badge used to be MUI's Badge with an sx; it is its own
   markup now, carrying MUI's positioning (the four anchor corners, the 14%
   inset for a circular child, the scale-to-zero hide) and the design's counter
   on top, over the same tokens. */
const SxBox = lazySxBox('Badge');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const ANCHORS = [];
for (const v of ['top', 'bottom']) for (const h of ['left', 'right']) for (const o of ['rectangular', 'circular']) ANCHORS.push([v, h, o]);

registerStaticStyles('omni-badge', [
  '.omni-badge{position:relative;display:inline-flex;vertical-align:middle;flex-shrink:0}',
  '.omni-badge-b{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;align-content:center;align-items:center;'
    + 'position:absolute;box-sizing:border-box;z-index:1;'
    + `min-width:${BADGE.size};height:${BADGE.size};padding:0 ${BADGE.padX};border-radius:${BADGE.size};`
    + 'font-family:var(--Badge-Font-Family, var(--Button-Small-Font-Family));font-weight:var(--Badge-Font-Weight, var(--Button-Small-Font-Weight));'
    + 'line-height:var(--Badge-Line-Height, 12px);letter-spacing:var(--Badge-Letter-Spacing, var(--Button-Small-Letter-Spacing));'
    + 'font-size:var(--Badge-Font-Size, 11px);'
    /* No ring: the Figma set (3156:5150) has just the 1px stroke in the
       badge's own color. */
    + 'background-color:var(--_bd-c);color:var(--_bd-on);border:1px solid var(--_bd-c);'
    + 'transition:transform 0.2s ease, opacity 0.2s ease;'
    + 'transform:scale(1) translate(var(--Badge-translateX), var(--Badge-translateY))}',
  ...COLORS.map((c) => `.omni-badge-c-${c}{--_bd-c:var(--Icons-${cap(c)});--_bd-on:var(--Icons-On-${cap(c)})}`),
  `.omni-badge-dot{min-width:${BADGE.dot};height:${BADGE.dot};padding:0;border-radius:${BADGE.dot}}`,
  ...ANCHORS.map(([v, h, o]) => {
    const off = o === 'circular' ? '14%' : '0';
    return `.omni-badge-a-${v}-${h}-${o}{--Badge-translateX:${h === 'right' ? '50%' : '-50%'};--Badge-translateY:${v === 'top' ? '-50%' : '50%'};`
      + `top:${v === 'top' ? off : 'initial'};bottom:${v === 'bottom' ? off : 'initial'};right:${h === 'right' ? off : 'initial'};left:${h === 'left' ? off : 'initial'};`
      + `transform-origin:${h === 'right' ? '100%' : '0%'} ${v === 'top' ? '0%' : '100%'}}`;
  }),
  '.omni-badge-b.omni-badge-hide{transform:scale(0) translate(var(--Badge-translateX), var(--Badge-translateY))}',
].join('\n'));

export function Badge({
  /* 'error' — Figma's Badge Counter resolves in the Icons Error mode: the red
     notification badge. It defaulted to primary. */
  variant = 'error',
  size,
  type = 'standard',
  badgeContent,
  max = 99,
  showZero = false,
  invisible = false,
  dot = false,
  overlap = 'rectangular',
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  children,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-badge');
  const variantMap = buildVariantMap();
  const effectiveVariant = normalizeBadgeVariant(variant);
  const styles = variantMap[effectiveVariant] || variantMap['primary'];
  warnRemovedSize(size);
  const sc = BADGE;

  /* Either spelling selects the dot. `type` is the design's axis (Figma:
     Type = standard | status); `dot` predates it and is kept working rather
     than swapped, so no existing call site changes behaviour. OR, not a
     precedence rule — `dot` alone still means status, and there is no
     combination where one silently cancels the other. */
  const isStatus = type === 'status' || dot;

  // Determine display content
  let displayContent = badgeContent;
  if (isStatus) {
    displayContent = '';
  } else if (typeof badgeContent === 'number' && badgeContent > max) {
    displayContent = max + '+';
  }

  // Visibility
  const isInvisible = invisible || (!isStatus && !showZero && (badgeContent === 0 || badgeContent === undefined || badgeContent === null));

  const colorKey = variantMap[effectiveVariant] ? effectiveVariant : 'primary';
  void styles;
  const v = anchorOrigin && anchorOrigin.vertical === 'bottom' ? 'bottom' : 'top';
  const h = anchorOrigin && anchorOrigin.horizontal === 'left' ? 'left' : 'right';
  const o = overlap === 'circular' ? 'circular' : 'rectangular';
  const shown = isStatus ? undefined : displayContent;
  const hidden = isInvisible || (!isStatus && (shown === undefined || shown === null));
  /* While hidden, the badge keeps what it last SHOWED, so it scales away with
     its number rather than emptying first — as MUI's did. A badge hidden from
     the start has shown nothing, so it is empty. */
  const last = React.useRef(undefined);
  if (!hidden) last.current = shown;
  const Cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);

  const badge = (
    <span className={'MuiBadge-badge MuiBadge-' + (isStatus ? 'dot' : 'standard')
      + ' MuiBadge-anchorOrigin' + Cap(v) + Cap(h) + Cap(o) + ' MuiBadge-overlap' + Cap(o)
      + (hidden ? ' MuiBadge-invisible' : '')
      + ' omni-badge-b omni-badge-c-' + colorKey + ' omni-badge-a-' + v + '-' + h + '-' + o
      + (isStatus ? ' omni-badge-dot' : '') + (hidden ? ' omni-badge-hide' : '')}>
      {isStatus ? undefined : (hidden ? last.current : shown)}
    </span>
  );
  const rootProps = { className: 'MuiBadge-root badge-' + effectiveVariant + ' omni-badge ' + className, ...props };
  if (hasSx(sx)) return <SxBox component="span" sx={sx} {...rootProps}>{children}{badge}</SxBox>;
  return <span {...rootProps}>{children}{badge}</span>;
}


export const PrimaryBadge    = (p) => <Badge variant="primary"    {...p} />;
export const SecondaryBadge  = (p) => <Badge variant="secondary"  {...p} />;
export const TertiaryBadge   = (p) => <Badge variant="tertiary"   {...p} />;
export const NeutralBadge    = (p) => <Badge variant="neutral"    {...p} />;
export const InfoBadge       = (p) => <Badge variant="info"       {...p} />;
export const SuccessBadge    = (p) => <Badge variant="success"    {...p} />;
export const WarningBadge    = (p) => <Badge variant="warning"    {...p} />;
export const ErrorBadge      = (p) => <Badge variant="error"      {...p} />;

// Outline

// Light

export default Badge;
