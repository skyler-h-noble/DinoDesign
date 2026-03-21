// src/components/Stack/Stack.js
import React, { useMemo } from 'react';
import { Stack as MuiStack, Box } from '@mui/material';

/**
 * DynoStack — wraps MUI Stack with smart minimum gap enforcement.
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
  'OverlineSmall', 'ButtonSmall',
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

export function DynoStack({
  children,
  gap,
  spacing,
  direction = 'column',
  enforceMinGap = true,
  minGapToken = '--min-stack-gap',
  divider,
  flexWrap,
  useFlexGap = true,
  alignItems,
  justifyContent,
  sx = {},
  className = '',
  ...props
}) {
  const desiredGap  = gap !== undefined ? gap : spacing;
  const needsMinGap = enforceMinGap && hasSmallChild(children);

  const effectiveGap = useMemo(() => {
    if (!needsMinGap) return desiredGap;
    const desiredPx = gapToPx(desiredGap);
    const minPx     = resolveCssVar(minGapToken, 8);
    if (desiredPx >= minPx) return desiredGap;
    return 'var(' + minGapToken + ', ' + minPx + 'px)';
  }, [needsMinGap, desiredGap, minGapToken]);

  return (
    <MuiStack
      direction={direction}
      spacing={useFlexGap ? undefined : effectiveGap}
      gap={useFlexGap ? effectiveGap : undefined}
      divider={divider}
      flexWrap={flexWrap}
      useFlexGap={useFlexGap}
      alignItems={alignItems}
      justifyContent={justifyContent}
      className={
        'dyno-stack' +
        (needsMinGap ? ' dyno-stack-min-gap-enforced' : '') +
        (className ? ' ' + className : '')
      }
      sx={{
        ...(needsMinGap ? { '&::before': { display: 'none' } } : {}),
        ...sx,
      }}
      data-min-gap-enforced={needsMinGap ? 'true' : undefined}
      {...props}
    >
      {children}
    </MuiStack>
  );
}

// ─── Convenience exports ──────────────────────────────────────────────────────

export const HStack = (p) => <DynoStack direction="row" alignItems="center" {...p} />;
export const VStack = (p) => <DynoStack direction="column" {...p} />;

export const CenteredStack = (p) => (
  <DynoStack direction="column" alignItems="center" justifyContent="center" {...p} />
);

export const SpaceBetweenStack = (p) => (
  <DynoStack direction="row" alignItems="center" justifyContent="space-between" {...p} />
);

export const WrapStack = (p) => (
  <DynoStack direction="row" flexWrap="wrap" {...p} />
);

export const ResponsiveStack = ({ breakpoint = 'sm', ...p }) => (
  <DynoStack direction={{ xs: 'column', [breakpoint]: 'row' }} {...p} />
);

// ─── Backward-compat aliases ──────────────────────────────────────────────────
// These match the names that were exported from the previous Stack implementation
// so existing imports in the codebase continue to work without changes.

export const Stack        = DynoStack;
export const GridStack    = WrapStack;
export const StackDivider = (p) => (
  <Box sx={{ borderBottom: '1px solid var(--Border)', width: '100%' }} {...p} />
);
export const InsetStack  = ({ sx: sxProp, ...p }) => (
  <DynoStack sx={{ px: 2, ...sxProp }} {...p} />
);
export const ScrollStack = ({ sx: sxProp, ...p }) => (
  <DynoStack sx={{ overflowY: 'auto', ...sxProp }} {...p} />
);

export default DynoStack;