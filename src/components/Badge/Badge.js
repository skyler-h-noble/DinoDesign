// src/components/Badge/Badge.js
import React from 'react';
import { Badge as MuiBadge, Box } from '@mui/material';

/**
 * Badge Component
 * Small label attached to a child element showing status or count
 *
 * VARIANTS:
 *   SOLID   variant="{color}"           filled badge, all 8 colors
 *   OUTLINE variant="{color}-outline"   bordered badge, all 8 colors
 *   LIGHT   variant="{color}-light"     tinted badge, all 8 colors
 *
 * SIZES: small (16px) | medium (20px) | large (24px)
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
    bg:     'var(--Buttons-' + C + '-Button)',
    text:   'var(--Buttons-' + C + '-Text)',
    border: 'none',
  };
}

function outlineStyles(color) {
  const C = cap(color);
  return {
    bg:     'var(--Background)',
    text:   'var(--Text)',
    border: '1px solid var(--Buttons-' + C + '-Border)',
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    bg:     'var(--Buttons-' + C + '-Button)',
    text:   'var(--Buttons-' + C + '-Text)',
    border: '1px solid var(--Buttons-' + C + '-Border)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color]              = solidStyles(color);
    map[color + '-outline'] = outlineStyles(color);
    map[color + '-light']   = lightStyles(color);
  });
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { minW: 16, height: 16, fontSize: '10px', padding: '0 4px', dotSize: 8 },
  medium: { minW: 20, height: 20, fontSize: '12px', padding: '0 6px', dotSize: 10 },
  large:  { minW: 24, height: 24, fontSize: '14px', padding: '0 8px', dotSize: 12 },
};

// --- Component ---------------------------------------------------------------

export function Badge({
  variant = 'primary',
  size = 'medium',
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
  const styles = variantMap[variant] || variantMap['primary'];
  const sc = SIZE_MAP[size] || SIZE_MAP.medium;

  // Determine display content
  let displayContent = badgeContent;
  if (dot) {
    displayContent = '';
  } else if (typeof badgeContent === 'number' && badgeContent > max) {
    displayContent = max + '+';
  }

  // Visibility
  const isInvisible = invisible || (!dot && !showZero && (badgeContent === 0 || badgeContent === undefined || badgeContent === null));

  const badgeSx = {
    '& .MuiBadge-badge': {
      // Sizing
      minWidth: dot ? sc.dotSize : sc.minW,
      height: dot ? sc.dotSize : sc.height,
      padding: dot ? 0 : sc.padding,
      fontSize: sc.fontSize,
      fontWeight: 600,
      fontFamily: 'inherit',
      lineHeight: 1,
      borderRadius: dot ? '50%' : sc.height / 2 + 'px',

      // Colors
      backgroundColor: styles.bg,
      color: styles.text,
      border: styles.border,
      boxSizing: 'border-box',

      // No MUI defaults
      boxShadow: 'none',

      // Transition
      transition: 'transform 0.2s ease, opacity 0.2s ease',
    },

    ...sx,
  };

  return (
    <MuiBadge
      badgeContent={dot ? '' : displayContent}
      max={max}
      showZero={showZero}
      invisible={isInvisible}
      overlap={overlap}
      anchorOrigin={anchorOrigin}
      variant={dot ? 'dot' : 'standard'}
      className={'badge-' + variant + ' ' + className}
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
export const PrimaryOutlineBadge    = (p) => <Badge variant="primary-outline"    {...p} />;
export const SecondaryOutlineBadge  = (p) => <Badge variant="secondary-outline"  {...p} />;
export const TertiaryOutlineBadge   = (p) => <Badge variant="tertiary-outline"   {...p} />;
export const NeutralOutlineBadge    = (p) => <Badge variant="neutral-outline"    {...p} />;
export const InfoOutlineBadge       = (p) => <Badge variant="info-outline"       {...p} />;
export const SuccessOutlineBadge    = (p) => <Badge variant="success-outline"    {...p} />;
export const WarningOutlineBadge    = (p) => <Badge variant="warning-outline"    {...p} />;
export const ErrorOutlineBadge      = (p) => <Badge variant="error-outline"      {...p} />;

// Light
export const PrimaryLightBadge    = (p) => <Badge variant="primary-light"    {...p} />;
export const SecondaryLightBadge  = (p) => <Badge variant="secondary-light"  {...p} />;
export const TertiaryLightBadge   = (p) => <Badge variant="tertiary-light"   {...p} />;
export const NeutralLightBadge    = (p) => <Badge variant="neutral-light"    {...p} />;
export const InfoLightBadge       = (p) => <Badge variant="info-light"       {...p} />;
export const SuccessLightBadge    = (p) => <Badge variant="success-light"    {...p} />;
export const WarningLightBadge    = (p) => <Badge variant="warning-light"    {...p} />;
export const ErrorLightBadge      = (p) => <Badge variant="error-light"      {...p} />;

export default Badge;
