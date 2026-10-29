// src/components/Stack/Stack.mui.js
// The MUI version of Stack, loaded on demand (see _lazyFallback.js):
// only a caller passing an MUI-only prop such as sx ever downloads it.
import React, { useMemo } from 'react';
import { Stack as MuiStack, Box } from '@mui/material';

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

const SMALL_DISPLAY_NAMES = [
  'Link', 'Chip', 'Badge', 'Caption', 'Label', 'Tag',
  'BodySmall', 'LegalSemibold', 'Legal', 'LabelSmall', 'LabelExtraSmall',
  'EyebrowSmall', 'ButtonSmall',
];

function OmniStackMui({
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
        'omni-stack' +
        (needsMinGap ? ' omni-stack-min-gap-enforced' : '') +
        (className ? ' ' + className : '')
      }
      sx={{
        /* Paint ONLY when this Stack was given a surface.
         *
         * It painted var(--Background) unconditionally, on the reasoning that
         * with no surface set it resolves to the inherited value and is
         * therefore a no-op. It is a no-op only while the parent is painting
         * that same flat color. The moment the parent paints anything else —
         * a hero image, a gradient, a Card at a Container level — an
         * unsurfaced Stack punches an opaque rectangle through it, which is
         * how a row of buttons ends up with a visible slab behind it.
         *
         * A layout primitive should not paint. Declaring a surface is how you
         * ask it to, and that is the rule everywhere else in this system:
         * data-theme + data-surface, or nothing. */
        ...(props['data-surface'] || props['data-theme']
          ? { background: 'var(--Background)' }
          : {}),
        // A fixed width is the OUTER width (matches a Figma frame: padding sits
        // inside it). Without border-box, width + padding overflow the frame.
        boxSizing: 'border-box',
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

export default OmniStackMui;
