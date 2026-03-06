// src/components/Tooltip/Tooltip.js
import React from 'react';
import { Tooltip as MuiTooltip, Box } from '@mui/material';

/**
 * Tooltip Component
 *
 * STYLES:
 *   solid    data-theme: Primary | Secondary | Tertiary | Neutral |
 *            Info-Medium | Success-Medium | Warning-Medium | Error-Medium
 *            bg: var(--Surface)  text: var(--Text)  border: none
 *
 *   light    data-theme: Primary-Light | Secondary-Light | Tertiary-Light | Neutral-Light |
 *            Info-Light | Success-Light | Warning-Light | Error-Light
 *            bg: var(--Surface)  text: var(--Text)  border: none
 *
 *   outline  No data-theme. bg: var(--Background)  text: var(--Text)
 *            border: 1px solid var(--Buttons-{C}-Border)
 *
 * SIZES: small | medium | large
 * PLACEMENT: 12 positions (top, top-start, top-end, right, etc.)
 * ARROW: boolean
 * OPEN: undefined (uncontrolled) | true | false
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SOLID_THEME_MAP = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  info: 'Info-Medium',
  success: 'Success-Medium',
  warning: 'Warning-Medium',
  error: 'Error-Medium',
};

const LIGHT_THEME_MAP = {
  primary: 'Primary-Light',
  secondary: 'Secondary-Light',
  tertiary: 'Tertiary-Light',
  neutral: 'Neutral-Light',
  info: 'Info-Light',
  success: 'Success-Light',
  warning: 'Warning-Light',
  error: 'Error-Light',
};

const SIZE_MAP = {
  small:  { fontSize: '12px', py: '4px', px: '8px', maxWidth: 200, arrowSize: 6 },
  medium: { fontSize: '13px', py: '6px', px: '12px', maxWidth: 280, arrowSize: 8 },
  large:  { fontSize: '14px', py: '8px', px: '16px', maxWidth: 360, arrowSize: 10 },
};

export function Tooltip({
  children,
  title,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  placement = 'bottom',
  arrow = false,
  open,
  enterDelay = 100,
  leaveDelay = 0,
  describeChild = false,
  className = '',
  sx = {},
  ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isOutline = variant === 'outline';
  const C = cap(color);

  // Resolve data-theme
  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null;

  // Build tooltip styles
  const tooltipBg = isOutline ? 'var(--Background)' : 'var(--Surface)';
  const tooltipText = isOutline ? 'var(--Text)' : 'var(--Text)';
  const tooltipBorder = isOutline
    ? '1px solid var(--Buttons-' + C + '-Border)'
    : 'none';

  // Arrow color must match tooltip background
  const arrowColor = isOutline ? 'var(--Background)' : 'var(--Surface)';
  const arrowBorder = isOutline ? 'var(--Buttons-' + C + '-Border)' : 'transparent';

  // Controlled vs uncontrolled
  const openProp = open === undefined ? {} : { open };

  return (
    <MuiTooltip
      title={
        title ? (
          <Box
            data-theme={dataTheme || undefined}
            className={'tooltip-content tooltip-' + variant + ' tooltip-' + color + ' tooltip-' + size + ' ' + className}
            sx={{
              backgroundColor: tooltipBg,
              color: tooltipText,
              border: tooltipBorder,
              borderRadius: 'var(--Style-Border-Radius)',
              fontSize: s.fontSize,
              lineHeight: 1.5,
              fontFamily: 'inherit',
              padding: s.py + ' ' + s.px,
              maxWidth: s.maxWidth + 'px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              ...sx,
            }}
          >
            {title}
          </Box>
        ) : ''
      }
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      describeChild={describeChild}
      {...openProp}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'transparent',
            padding: 0,
            maxWidth: 'none',
            boxShadow: 'none',
          },
        },
        arrow: {
          sx: {
            color: arrowColor,
            '&::before': {
              border: isOutline ? '1px solid ' + 'var(--Buttons-' + C + '-Border)' : 'none',
              backgroundColor: arrowColor,
              boxSizing: 'border-box',
            },
            fontSize: s.arrowSize + 'px',
          },
        },
      }}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
}

// Convenience exports
export const SolidTooltip   = (p) => <Tooltip variant="solid"   {...p} />;
export const LightTooltip   = (p) => <Tooltip variant="light"   {...p} />;
export const OutlineTooltip = (p) => <Tooltip variant="outline" {...p} />;

export default Tooltip;
