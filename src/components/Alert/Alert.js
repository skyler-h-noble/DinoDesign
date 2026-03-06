// src/components/Alert/Alert.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Alert Component
 *
 * Displays brief, non-interrupting messages.
 *
 * VARIANTS:
 *   standard  No colors, no border, no data-theme. Plain text on page background.
 *   outline   Colored border: var(--Buttons-{Color}-Border). No data-theme. No fill.
 *   light     Outer border wrapper: var(--Border) (page-level).
 *             Inner: data-theme="{Color}-Light" data-surface="Surface".
 *   solid     Outer border wrapper: var(--Border) (page-level).
 *             Inner: data-theme="{Color}" data-surface="Surface".
 *
 * The outer border on Light/Solid sits OUTSIDE the themed context so it uses the
 * page-level --Border, not the theme-scoped one.
 *
 * COLORS: 8 brand colors (primary–error). Standard ignores color.
 * SIZES:  small (12px text, 8px/12px pad), medium (14px, 12px/16px), large (16px, 14px/20px)
 *
 * SLOTS:
 *   startDecorator — icon or avatar before message
 *   endDecorator   — icon, link, or button after message
 *   children       — message content
 *
 * Accessibility: role="alert" for live-region announcement.
 */

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
const COLOR_LABEL_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { px: '12px', py: '8px',  fontSize: '13px', iconSize: '18px', gap: '8px',  borderRadius: 'var(--Style-Border-Radius)' },
  medium: { px: '16px', py: '12px', fontSize: '14px', iconSize: '20px', gap: '10px', borderRadius: 'var(--Style-Border-Radius)' },
  large:  { px: '20px', py: '14px', fontSize: '16px', iconSize: '22px', gap: '12px', borderRadius: 'var(--Style-Border-Radius)' },
};

export function Alert({
  children,
  variant = 'standard',
  color = 'primary',
  size = 'medium',
  startDecorator,
  endDecorator,
  className = '',
  sx = {},
  ...props
}) {
  const C = COLOR_LABEL_MAP[color] || 'Primary';
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const isStandard = variant === 'standard';
  const isOutline = variant === 'outline';
  const isLight = variant === 'light';
  const isSolid = variant === 'solid';
  const isThemed = isLight || isSolid;

  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null;

  // Inner content shared by all variants
  const innerContent = (
    <>
      {startDecorator && (
        <Box
          className="alert-start-decorator"
          sx={{ display: 'inline-flex', alignItems: 'center', fontSize: s.iconSize, lineHeight: 1, flexShrink: 0 }}
        >
          {startDecorator}
        </Box>
      )}
      <Box className="alert-message" sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Box>
      {endDecorator && (
        <Box
          className="alert-end-decorator"
          sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, gap: s.gap }}
        >
          {endDecorator}
        </Box>
      )}
    </>
  );

  // Shared inner styles (layout, text, padding)
  const innerSx = {
    display: 'flex',
    alignItems: 'center',
    gap: s.gap,
    padding: s.py + ' ' + s.px,
    fontSize: s.fontSize,
    fontFamily: 'inherit',
    lineHeight: 1.5,
    width: '100%',
  };

  // ── Standard: no border, no theme, no background ──
  if (isStandard) {
    return (
      <Box
        role="alert"
        className={'alert alert-standard alert-' + size + ' ' + className}
        sx={{
          ...innerSx,
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          borderRadius: s.borderRadius,
          ...sx,
        }}
        {...props}
      >
        {innerContent}
      </Box>
    );
  }

  // ── Outline: colored border, no theme, no fill ──
  if (isOutline) {
    return (
      <Box
        role="alert"
        className={'alert alert-outline alert-' + size + ' alert-' + color + ' ' + className}
        sx={{
          ...innerSx,
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          border: '1px solid var(--Buttons-' + C + '-Border)',
          borderRadius: s.borderRadius,
          ...sx,
        }}
        {...props}
      >
        {innerContent}
      </Box>
    );
  }

  // ── Light / Solid: outer border wrapper (page --Border), inner themed area ──
  return (
    <Box
      role="alert"
      className={
        'alert alert-' + variant + ' alert-' + size + ' alert-' + color + ' ' + className
      }
      sx={{
        border: '1px solid var(--Border)',
        borderRadius: s.borderRadius,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      <Box
        data-theme={dataTheme}
        data-surface="Surface"
        className="alert-inner"
        sx={{
          ...innerSx,
          color: 'var(--Text)',
          backgroundColor: 'var(--Background)',
          borderRadius: 'inherit',
        }}
      >
        {innerContent}
      </Box>
    </Box>
  );
}

export default Alert;
