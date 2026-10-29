// src/components/Stack/Stack.js
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import React, { useMemo } from 'react';
import { Stack as MuiStack, Box } from '@mui/material';
import { lazyFallback } from '../_lazyFallback';
const OmniStackMui = lazyFallback('Stack', () => import('./Stack.mui'));

/**
 * OmniStack — wraps MUI Stack with smart minimum gap enforcement.
 *
 * SMART GAP RULE:
 *   If any child component is detected as "small" (24px height),
 *   the gap is automatically raised to at least var(--min-stack-gap).
 *   This ensures small touch targets like Links, Chips, and icon buttons
 *   always have breathing room and don't collapse against each other.
 *
 * DETECTION — a child is considered "small" if it has any of:
 *   • size="small" prop
 *   • data-size="small" prop/attribute
 *   • height={24} or minHeight={24} prop
 *   • minHeight="24px" in sx prop
 *   • The component's displayName includes known small components
 *     (Link, Chip, Badge, Caption, Label, Tag)
 *
 * PROPS (all MUI Stack props are supported, plus):
 *   gap             number | string  — desired gap (MUI spacing or CSS value)
 *   minGapToken     string           — CSS variable for min gap (default: '--min-stack-gap')
 *   enforceMinGap   boolean          — set false to disable smart gap entirely (default: true)
 */

// ─── Small component detection ────────────────────────────────────────────────

const SMALL_DISPLAY_NAMES = [
  'Link', 'Chip', 'Badge', 'Caption', 'Label', 'Tag',
  'BodySmall', 'LegalSemibold', 'Legal', 'LabelSmall', 'LabelExtraSmall',
  'EyebrowSmall', 'ButtonSmall',
];

function isSmallChild(child) {
  if (!React.isValidElement(child)) return false;
  const props = child.props || {};
  if (props.size === 'small') return true;
  if (props['data-size'] === 'small') return true;
  if (props.height === 24 || props.minHeight === 24) return true;
  if (props.height === '24px' || props.minHeight === '24px') return true;
  if (props.sx) {
    const mh = props.sx.minHeight || props.sx.height;
    if (mh === 24 || mh === '24px') return true;
  }
  const type = child.type;
  if (type) {
    const name = type.displayName || type.name || '';
    if (SMALL_DISPLAY_NAMES.some((n) => name.includes(n))) return true;
  }
  return false;
}

function hasSmallChild(children) {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (isSmallChild(child)) found = true;
  });
  return found;
}

// ─── Gap resolution ───────────────────────────────────────────────────────────

function resolveCssVar(varName, fallbackPx = 8) {
  if (typeof window === 'undefined') return fallbackPx;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw) return fallbackPx;
  if (raw.endsWith('rem')) {
    return parseFloat(raw) * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  return parseFloat(raw) || fallbackPx;
}

function gapToPx(gap, muiSpacingUnit = 8) {
  if (gap === undefined || gap === null) return 0;
  if (typeof gap === 'number') return gap * muiSpacingUnit;
  if (typeof gap === 'string') {
    if (gap.endsWith('px')) return parseFloat(gap);
    if (gap.endsWith('rem')) {
      return parseFloat(gap) * parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
    }
    return parseFloat(gap) * muiSpacingUnit || 0;
  }
  return 0;
}

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Convenience exports ──────────────────────────────────────────────────────

/* ── Static path (no emotion) ─────────────────────────────────────────────
   The common case — plain values, no divider, no sx — renders a div with the
   fixed rules in a static sheet and the per-instance values (gap, direction,
   alignment) as inline style: the same declarations MUI's Stack emits, with
   no styling engine. Responsive object values, divider and sx keep the MUI
   version above, so nothing that works today changes. */
registerStaticStyles('omni-stack', `
.omni-stack{display:flex;box-sizing:border-box}
.omni-stack[data-surface],.omni-stack[data-theme]{background:var(--Background)}
.omni-stack-min-gap-enforced::before{display:none}
`);
const plain = (v) => v === undefined || v === null || typeof v === 'string' || typeof v === 'number';
const muiGap = (g) => (typeof g === 'number' ? g * 8 + 'px' : g);

export function OmniStack(props) {
  useStaticStyles('omni-stack');
  const {
    children, gap, spacing, direction = 'column', enforceMinGap = true, minGapToken = '--min-stack-gap',
    divider, flexWrap, useFlexGap = true, alignItems, justifyContent, sx, className = '', style, component: Tag = 'div', ...rest
  } = props;
  const desiredGap = gap !== undefined ? gap : spacing;
  const needsMinGap = enforceMinGap && hasSmallChild(children);
  const effectiveGap = useMemo(() => {
    if (!needsMinGap) return desiredGap;
    const desiredPx = gapToPx(desiredGap);
    const minPx = resolveCssVar(minGapToken, 8);
    if (desiredPx >= minPx) return desiredGap;
    return 'var(' + minGapToken + ', ' + minPx + 'px)';
  }, [needsMinGap, desiredGap, minGapToken]);

  const staticOK = !divider && useFlexGap && !(sx && Object.keys(sx).length)
    && [direction, alignItems, justifyContent, flexWrap, desiredGap].every(plain);
  if (!staticOK) return <OmniStackMui {...props} />;

  const inline = { flexDirection: direction };
  if (effectiveGap !== undefined && effectiveGap !== null) inline.gap = muiGap(effectiveGap);
  if (alignItems) inline.alignItems = alignItems;
  if (justifyContent) inline.justifyContent = justifyContent;
  if (flexWrap) inline.flexWrap = flexWrap;
  return (
    <Tag
      className={'MuiStack-root omni-stack' + (needsMinGap ? ' omni-stack-min-gap-enforced' : '') + (className ? ' ' + className : '')}
      data-min-gap-enforced={needsMinGap ? 'true' : undefined}
      style={style ? { ...inline, ...style } : inline}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const HStack = (p) => <OmniStack direction="row" alignItems="center" {...p} />;
export const VStack = (p) => <OmniStack direction="column" {...p} />;

export const CenteredStack = (p) => (
  <OmniStack direction="column" alignItems="center" justifyContent="center" {...p} />
);

export const SpaceBetweenStack = (p) => (
  <OmniStack direction="row" alignItems="center" justifyContent="space-between" {...p} />
);

export const WrapStack = (p) => (
  <OmniStack direction="row" flexWrap="wrap" {...p} />
);

export const ResponsiveStack = ({ breakpoint = 'sm', ...p }) => (
  <OmniStack direction={{ xs: 'column', [breakpoint]: 'row' }} {...p} />
);

// ─── Backward-compat aliases ──────────────────────────────────────────────────
// These match the names that were exported from the previous Stack implementation
// so existing imports in the codebase continue to work without changes.

export const Stack        = OmniStack;
export const GridStack    = WrapStack;
export const StackDivider = (p) => (
  <Box sx={{ borderBottom: '1px solid var(--Border)', width: '100%' }} {...p} />
);
export const InsetStack  = ({ sx: sxProp, ...p }) => (
  <OmniStack sx={{ px: 2, ...sxProp }} {...p} />
);
export const ScrollStack = ({ sx: sxProp, ...p }) => (
  <OmniStack sx={{ overflowY: 'auto', ...sxProp }} {...p} />
);

export default OmniStack;