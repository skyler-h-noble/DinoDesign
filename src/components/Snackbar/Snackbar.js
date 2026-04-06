// src/components/Snackbar/Snackbar.js
import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Body, BodySmall } from '../Typography';

/**
 * Snackbar (Toast) Component
 *
 * VARIANTS:
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}-Light" data-surface="Surface"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STRUCTURE:
 *   Outer shell — border var(--Buttons-{C}-Border), Effect-Level-3 shadow
 *   Inner content — data-theme + data-surface, bg var(--Background), color var(--Text)
 *
 * SIZES: small | medium | large
 * ANCHOR: top | bottom
 * AUTO-HIDE: optional duration in ms
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { px: '12px', py: '8px',  fontSize: '13px', gap: '8px',  minWidth: '240px' },
  medium: { px: '16px', py: '10px', fontSize: '14px', gap: '12px', minWidth: '300px' },
  large:  { px: '20px', py: '14px', fontSize: '16px', gap: '16px', minWidth: '360px' },
};

export function Snackbar({
  children,
  open = false,
  onClose,
  variant = 'light',
  color = 'info',
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
  const C = cap(color === 'default' ? 'Default' : color);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const TextComp = size === 'small' ? BodySmall : Body;

  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : C + '-Light')
    : C;

  const borderToken = 'var(--Buttons-' + C + '-Border)';

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={'snackbar snackbar-' + variant + ' snackbar-' + size + ' snackbar-' + anchor + ' snackbar-' + color + ' ' + className}
      sx={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        ...(anchor === 'top' ? { top: '16px' } : { bottom: '16px' }),
        zIndex: 1400,
        minWidth: s.minWidth,
        maxWidth: 'min(560px, calc(100vw - 32px))',
        border: '1px solid ' + borderToken,
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: 'var(--Effect-Level-3)',
        overflow: 'hidden',
        animation: 'snackbar-slide-in 0.3s ease forwards',
        '@keyframes snackbar-slide-in': slideKeyframes,
        ...sx,
      }}
      {...props}
    >
      <Box
        data-theme={dataTheme}
        data-surface="Surface"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: s.gap,
          padding: s.py + ' ' + s.px,
          fontSize: s.fontSize,
          fontFamily: 'inherit',
          lineHeight: 1.4,
          color: 'var(--Text)',
          backgroundColor: 'var(--Background)',
          borderRadius: 'calc(var(--Style-Border-Radius) - 1px)',
        }}
      >
        {startDecorator && (
          <Box sx={{ display: 'inline-flex', flexShrink: 0, lineHeight: 1 }}>
            {startDecorator}
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {typeof children === 'string' ? (
            <TextComp>{children}</TextComp>
          ) : children}
        </Box>

        {action && (
          <Box sx={{ display: 'inline-flex', flexShrink: 0 }}>
            {action}
          </Box>
        )}

        {endDecorator && (
          <Box sx={{ display: 'inline-flex', flexShrink: 0, lineHeight: 1 }}>
            {endDecorator}
          </Box>
        )}

        {onClose && (
          <Button
            iconOnly
            variant="ghost"
            size="small"
            onClick={(e) => onClose(e, 'closeClick')}
            aria-label="Close notification"
            sx={{ flexShrink: 0, ml: '4px' }}
          >
            <Icon size="small"><CloseIcon /></Icon>
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Snackbar;
