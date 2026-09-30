// src/components/Snackbar/Snackbar.js
import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Body, BodySmall } from '../Typography';
import { SHADOW_LEVEL_3 } from '../_shadows';

/**
 * Snackbar (Toast) Component
 *
 * VARIANTS:
 *   light     data-theme="{Theme}" data-surface="Surface-Brightest"
 *
 *   `solid` was RETIRED 2026-09-28. It still renders — it resolves to light and
 *   warns once in development, the same shim the -light button variants got —
 *   but do not write new ones and the converter must never emit one.
 *
 *   Why: a toast carries semantic colour, so on a solid fill that colour is
 *   also the background its label must survive on. The label then has to flip
 *   per theme AND per mode, which is 18 combinations to verify instead of 9.
 *   On Surface-Brightest the colour lives in the border and icon while the
 *   text sits on a reliable background — the same reasoning that keeps a
 *   Carousel dot's 3:1 in its border rather than its fill. Alert is already
 *   single-surface, and a toast is a floating alert, so the two now agree.
 *
 *   `surface` still reaches all five levels directly if a design needs one.
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

/** Warn once per session, not once per render. */
let warnedSolid = false;

export function Snackbar({
  children,
  open = false,
  onClose,
  variant = 'light',
  surface,
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

  // A light variant is the base theme at its BRIGHTEST surface, not a theme of
  // its own. Generated design systems stopped emitting *-Light themes — their
  // sheets carry Default, Primary, Secondary, Tertiary, Neutral and the states —
  // so `C + '-Light'` matched no rule and --Background resolved to nothing.
  const dataTheme = color === 'default' ? 'Default' : C;
  /* Explicit surface override.
   *
   * `variant` only ever reached three of the system's five surface levels —
   * light -> Surface-Brightest, dark -> Surface-Dimmest, anything else ->
   * Surface — so Surface-Dim and Surface-Bright were unreachable, and the
   * names did not match the data-surface vocabulary the rest of the system
   * speaks. This takes any of the five directly and wins over the variant
   * mapping, which stays as the default so existing usage is untouched.
   * Same shape as Card's surface prop. */
  /* `solid` is retired. It resolves to light rather than throwing, because a
     published stylesheet and an un-upgraded consumer both have to keep
     working — the same contract --Button-Standard-* keeps in CSS. The warning
     is what stops it surviving silently. */
  if (process.env.NODE_ENV !== 'production' && variant === 'solid' && !warnedSolid) {
    warnedSolid = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[Snackbar] variant="solid" is retired and now renders as "light". ' +
      'A solid fill makes the label carry the semantic colour as its own ' +
      'background, doubling the contrast combinations to verify. ' +
      'Use the default, or pass `surface` to reach a specific level.',
    );
  }
  const dataSurface = surface || 'Surface-Brightest';

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
        /* Offset from the edge the snackbar is anchored to.
         *
         * --SnackBar-Top / --SnackBar-Bottom are per-device: they are the
         * platform's system chrome (status bar + app bar at the top, home
         * indicator or gesture bar at the bottom) plus the clearance that
         * gives the shadow somewhere to fall. A phone reserves 98px at the
         * top where a desktop reserves 24, so a fixed number lands a snackbar
         * on top of the app bar's title on every touch platform.
         *
         * The two ends are deliberately asymmetric on every device but
         * Desktop: the top clears the app bar as well as the status bar,
         * while the bottom clears only the OS indicator — a bottom nav is a
         * template's choice, not the device's, so a template that places one
         * adds its height rather than this reserving space for a bar that may
         * not be there.
         *
         * The fallback is the DESKTOP value, not a smaller "safe" one. These
         * variables are defined by a generated foundation.css and by nothing
         * in this library, so the fallback is what an unthemed consumer
         * actually gets — and it should be the design system's answer for a
         * device with no chrome, not a number that contradicts it. */
        ...(anchor === 'top'
          ? { top: 'var(--SnackBar-Top, 24px)' }
          : { bottom: 'var(--SnackBar-Bottom, 24px)' }),
        zIndex: 1400,
        minWidth: s.minWidth,
        maxWidth: 'min(560px, calc(100vw - 32px))',
        border: '1px solid ' + borderToken,
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: SHADOW_LEVEL_3,
        overflow: 'hidden',
        animation: 'snackbar-slide-in 0.3s ease forwards',
        '@keyframes snackbar-slide-in': slideKeyframes,
        ...sx,
      }}
      {...props}
    >
      <Box
        data-theme={dataTheme}
        data-surface={dataSurface}
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
