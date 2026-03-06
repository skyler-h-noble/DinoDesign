// src/components/Snackbar/Snackbar.js
import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * Snackbar (Toast) Component
 *
 * Brief, non-intrusive notification displayed at top or bottom of viewport.
 *
 * VARIANTS:
 *   standard  No data-theme. No color picker.
 *   solid     data-theme={Color}.
 *   light     data-theme={Color}-Light.
 *
 * ALL SNACKBARS:
 *   data-surface="Container-High"
 *   border: 1px solid var(--Border)
 *   bg: var(--Background)
 *   text: var(--Text)
 *
 * SIZES: small | medium | large
 * ANCHOR: top | bottom (centered horizontally)
 * AUTO-HIDE: optional duration in ms
 * CLOSE: Escape key, close button, auto-hide timeout
 */

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const SIZE_MAP = {
  small:  { px: '12px', py: '8px',  fontSize: '13px', gap: '8px',  minWidth: '240px', closeSize: '24px', closeFontSize: '14px' },
  medium: { px: '16px', py: '10px', fontSize: '14px', gap: '12px', minWidth: '300px', closeSize: '28px', closeFontSize: '16px' },
  large:  { px: '20px', py: '14px', fontSize: '16px', gap: '16px', minWidth: '360px', closeSize: '32px', closeFontSize: '18px' },
};

/* ─── Snackbar ─── */
export function Snackbar({
  children,
  open = false,
  onClose,
  variant = 'standard',
  color = 'primary',
  size = 'medium',
  anchor = 'bottom',
  autoHideDuration,
  startDecorator,
  endDecorator,
  action,
  className = '',
  sx = {},
  ...props
}) {
  const timerRef = useRef(null);

  const isStandard = variant === 'standard';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';

  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null;

  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  // Auto-hide timer
  useEffect(() => {
    if (open && autoHideDuration && autoHideDuration > 0) {
      timerRef.current = setTimeout(() => {
        onClose?.({}, 'timeout');
      }, autoHideDuration);
      return () => clearTimeout(timerRef.current);
    }
  }, [open, autoHideDuration, onClose]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.(e, 'escapeKeyDown');
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Pause timer on hover, resume on leave
  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (open && autoHideDuration && autoHideDuration > 0) {
      timerRef.current = setTimeout(() => {
        onClose?.({}, 'timeout');
      }, autoHideDuration);
    }
  }, [open, autoHideDuration, onClose]);

  const slideKeyframes = anchor === 'top'
    ? { from: { transform: 'translateX(-50%) translateY(-120%)' }, to: { transform: 'translateX(-50%) translateY(0)' } }
    : { from: { transform: 'translateX(-50%) translateY(120%)' }, to: { transform: 'translateX(-50%) translateY(0)' } };

  if (!open) return null;

  return (
    <Box
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      data-theme={dataTheme || undefined}
      data-surface="Container-High"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={
        'snackbar snackbar-' + variant + ' snackbar-' + size + ' snackbar-' + anchor
        + (isSolid || isLight ? ' snackbar-' + color : '')
        + ' ' + className
      }
      sx={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        ...(anchor === 'top' ? { top: '16px' } : { bottom: '16px' }),
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        gap: s.gap,
        minWidth: s.minWidth,
        maxWidth: 'min(560px, calc(100vw - 32px))',
        padding: s.py + ' ' + s.px,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        fontWeight: 500,
        lineHeight: 1.4,
        color: 'var(--Text)',
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
        animation: 'snackbar-slide-in 0.3s ease forwards',
        '@keyframes snackbar-slide-in': slideKeyframes,
        ...sx,
      }}
      {...props}
    >
      {startDecorator && (
        <Box
          className="snackbar-start-decorator"
          sx={{ display: 'inline-flex', flexShrink: 0, fontSize: '1.2em', lineHeight: 1 }}
        >
          {startDecorator}
        </Box>
      )}

      <Box className="snackbar-message" sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Box>

      {action && (
        <Box className="snackbar-action" sx={{ display: 'inline-flex', flexShrink: 0 }}>
          {action}
        </Box>
      )}

      {endDecorator && (
        <Box
          className="snackbar-end-decorator"
          sx={{ display: 'inline-flex', flexShrink: 0, fontSize: '1.2em', lineHeight: 1 }}
        >
          {endDecorator}
        </Box>
      )}

      {onClose && (
        <Box
          component="button"
          aria-label="Close notification"
          onClick={(e) => onClose(e, 'closeClick')}
          className="snackbar-close"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: s.closeSize,
            height: s.closeSize,
            minWidth: s.closeSize,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--Text-Quiet)',
            cursor: 'pointer',
            fontSize: s.closeFontSize,
            lineHeight: 1,
            fontFamily: 'inherit',
            flexShrink: 0,
            marginLeft: '4px',
            transition: 'background-color 0.15s ease, color 0.15s ease',
            '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
            '&:active': { backgroundColor: 'var(--Active)' },
            '&:focus-visible': {
              outline: '3px solid var(--Focus-Visible)',
              outlineOffset: '-3px',
            },
          }}
        >
          ✕
        </Box>
      )}
    </Box>
  );
}

export default Snackbar;
