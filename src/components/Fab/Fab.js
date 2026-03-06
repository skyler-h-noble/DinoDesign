// src/components/Fab/Fab.js
import React from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * Fab (Floating Action Button) Component
 *
 * VARIANTS:
 *   solid   bg: var(--Buttons-{C}-Button), text: var(--Buttons-{C}-Text), border: var(--Buttons-{C}-Border)
 *   light   bg: var(--Buttons-{C}-Light-Button), text: var(--Buttons-{C}-Light-Text), border: var(--Buttons-{C}-Light-Border)
 *
 * COLORS: primary, secondary, tertiary, neutral, info, success, warning, error
 *
 * SIZES:
 *   small   40px (icon 20px)
 *   medium  48px (icon 24px) — default
 *   large   56px (icon 28px)
 *
 * EXTENDED: pill shape with icon + label text
 * ANIMATION: pulse ring effect when enabled
 *
 * Accessibility: role="button", aria-label, focus-visible ring
 */

const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { size: 40, iconSize: 20, fontSize: '13px', px: 12, gap: 6 },
  medium: { size: 48, iconSize: 24, fontSize: '14px', px: 16, gap: 8 },
  large:  { size: 56, iconSize: 28, fontSize: '15px', px: 20, gap: 10 },
};

function getTokens(variant, color) {
  const C = COLOR_MAP[color] || 'Primary';
  if (variant === 'light') {
    return {
      bg: 'var(--Buttons-' + C + '-Light-Button)',
      text: 'var(--Buttons-' + C + '-Light-Text)',
      border: 'var(--Buttons-' + C + '-Light-Border)',
      hover: 'var(--Buttons-' + C + '-Light-Hover)',
      active: 'var(--Buttons-' + C + '-Light-Active)',
    };
  }
  return {
    bg: 'var(--Buttons-' + C + '-Button)',
    text: 'var(--Buttons-' + C + '-Text)',
    border: 'var(--Buttons-' + C + '-Border)',
    hover: 'var(--Buttons-' + C + '-Hover)',
    active: 'var(--Buttons-' + C + '-Active)',
  };
}

const pulseKeyframes = `
@keyframes fab-pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--pulse-rgb, 0,0,0), 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(var(--pulse-rgb, 0,0,0), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--pulse-rgb, 0,0,0), 0); }
}
`;

export function Fab({
  children,
  icon,
  label,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  extended = false,
  animate = false,
  disabled = false,
  onClick,
  ariaLabel,
  className = '',
  sx = {},
  ...props
}) {
  const tokens = getTokens(variant, color);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const iconEl = icon || children || <AddIcon sx={{ fontSize: s.iconSize }} />;

  const effectiveLabel = ariaLabel || label || 'Action';

  return (
    <>
      {animate && <style>{pulseKeyframes}</style>}
      <Box
        component="button"
        type="button"
        role="button"
        aria-label={effectiveLabel}
        onClick={onClick}
        disabled={disabled}
        className={'fab fab-' + variant + ' fab-' + color + ' fab-' + size +
          (extended ? ' fab-extended' : '') +
          (animate ? ' fab-animate' : '') +
          (disabled ? ' fab-disabled' : '') +
          (className ? ' ' + className : '')}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: extended ? s.gap + 'px' : 0,
          // Sizing
          ...(extended
            ? {
                height: s.size + 'px',
                borderRadius: s.size / 2 + 'px',
                px: s.px + 'px',
              }
            : {
                width: s.size + 'px',
                height: s.size + 'px',
                borderRadius: '50%',
              }),
          // Tokens
          backgroundColor: tokens.bg,
          color: tokens.text,
          border: '1px solid ' + tokens.border,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          // Typography
          fontSize: s.fontSize,
          fontFamily: 'inherit',
          fontWeight: 600,
          // Interaction
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: 'none',
          flexShrink: 0,
          transition: 'background-color 0.15s ease, box-shadow 0.2s ease, transform 0.1s ease',
          '&:hover': !disabled ? { backgroundColor: tokens.hover, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } : {},
          '&:active': !disabled ? { backgroundColor: tokens.active, transform: 'scale(0.96)' } : {},
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
          // Animation
          ...(animate && !disabled && {
            animation: 'fab-pulse 2s infinite',
          }),
          ...sx,
        }}
        {...props}
      >
        {/* Icon */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: s.iconSize + 'px',
          '& .MuiSvgIcon-root': { fontSize: 'inherit' },
        }}>
          {iconEl}
        </Box>

        {/* Extended label */}
        {extended && label && (
          <Box component="span" sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
            {label}
          </Box>
        )}
      </Box>
    </>
  );
}

export default Fab;
