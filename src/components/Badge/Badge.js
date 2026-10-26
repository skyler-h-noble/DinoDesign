// src/components/Badge/Badge.js
import React from 'react';
import { Badge as MuiBadge, Box } from '@mui/material';

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
  sx = {},
  ...props
}) {
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

  const badgeSx = {
    '& .MuiBadge-badge': {
      // Sizing
      minWidth: isStatus ? sc.dot : sc.size,
      height: isStatus ? sc.dot : sc.size,
      padding: isStatus ? 0 : '0 ' + sc.padX,
      // Type: the design's own Badge style, 11/12. This was composed from
      // --Button-Small-* plus --Sm-Button-Numbers, which resolves to 10 with a
      // 14 leading — a pixel small on a leading too loose. 11 is not a rung of
      // the Button-Numbers ladder either (10 / 12 / 16 at the three button
      // heights), so no Button token can carry it; face, weight and tracking
      // still come from the Buttons/Small role, which is what the style binds.
      fontFamily:    'var(--Badge-Font-Family, var(--Button-Small-Font-Family))',
      fontWeight:    'var(--Badge-Font-Weight, var(--Button-Small-Font-Weight))',
      lineHeight:    'var(--Badge-Line-Height, 12px)',
      letterSpacing: 'var(--Badge-Letter-Spacing, var(--Button-Small-Letter-Spacing))',
      fontSize:      'var(--Badge-Font-Size, 11px)',
      // Fully round. The design binds the radius to the SAME token as the
      // size — --Sizing-2 on a 16px counter, --Sizing-1 on an 8px dot — so any
      // value at or above half the height reads as a pill. Matching that
      // binding keeps the two in step if the scale is ever retuned.
      borderRadius: isStatus ? sc.dot : sc.size,

      // Colors
      backgroundColor: styles.bg,
      color: styles.text,
      border: styles.border,
      boxSizing: 'border-box',

      /* No ring. This drew a 1px ring in the BACKGROUND color to cut the badge
         out of what it overlaps; the Figma set (3156:5150) has none — just the
         1px stroke in the badge's own color. Matched to Figma 2026-10-20. */

      // Transition
      transition: 'transform 0.2s ease, opacity 0.2s ease',
    },

    ...sx,
  };

  return (
    <MuiBadge
      badgeContent={isStatus ? '' : displayContent}
      max={max}
      showZero={showZero}
      invisible={isInvisible}
      overlap={overlap}
      anchorOrigin={anchorOrigin}
      variant={isStatus ? 'dot' : 'standard'}
      className={'badge-' + effectiveVariant + ' ' + className}
      sx={badgeSx}
      {...props}
    >
      {children}
    </MuiBadge>
  );
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Solid
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
