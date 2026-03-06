// src/components/Drawer/Drawer.js
import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * Drawer Component
 *
 * A navigation panel that slides in from an edge of the viewport.
 *
 * VARIANTS:
 *   standard  No data-theme. bg: var(--Background), border: var(--Border).
 *   solid     data-theme={Color}. bg: var(--Background), border: var(--Border).
 *   light     data-theme={Color}-Light. bg: var(--Background), border: var(--Border).
 *
 * SIZES: small | medium | large  — controls width (left/right) or height (top/bottom)
 * ANCHOR: left | right | top | bottom
 * BORDER: var(--Border) on the edge opposite the anchor
 *
 * Uses a backdrop overlay. Closes on Escape, backdrop click, or close button.
 * Focus is trapped within the drawer while open.
 */

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const SIZE_DIMENSION = {
  small:  { width: '240px', height: '200px' },
  medium: { width: '320px', height: '280px' },
  large:  { width: '420px', height: '380px' },
};
const SIZE_PADDING = {
  small:  '12px',
  medium: '16px',
  large:  '24px',
};

const BORDER_EDGE = {
  left:   { borderRight: '1px solid var(--Border)' },
  right:  { borderLeft:  '1px solid var(--Border)' },
  top:    { borderBottom: '1px solid var(--Border)' },
  bottom: { borderTop:   '1px solid var(--Border)' },
};

const POSITION_MAP = {
  left:   { top: 0, left: 0, bottom: 0 },
  right:  { top: 0, right: 0, bottom: 0 },
  top:    { top: 0, left: 0, right: 0 },
  bottom: { bottom: 0, left: 0, right: 0 },
};

const SLIDE_CLOSED = {
  left:   'translateX(-100%)',
  right:  'translateX(100%)',
  top:    'translateY(-100%)',
  bottom: 'translateY(100%)',
};

/* ─── Drawer ─── */
export function Drawer({
  children,
  open = false,
  onClose,
  variant = 'standard',
  color = 'primary',
  size = 'medium',
  anchor = 'left',
  hideBackdrop = false,
  className = '',
  sx = {},
  ...props
}) {
  const drawerRef = useRef(null);
  const previousFocus = useRef(null);

  const isStandard = variant === 'standard';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isHorizontal = anchor === 'left' || anchor === 'right';

  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null;

  const dim = SIZE_DIMENSION[size] || SIZE_DIMENSION.medium;
  const pad = SIZE_PADDING[size] || SIZE_PADDING.medium;

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Focus management
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement;
      // Focus first focusable element inside drawer
      requestAnimationFrame(() => {
        const focusable = drawerRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) focusable.focus();
        else drawerRef.current?.focus();
      });
    } else if (previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = orig; };
    }
  }, [open]);

  // Focus trap
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      {!hideBackdrop && (
        <Box
          className="drawer-backdrop"
          onClick={() => onClose?.()}
          aria-hidden="true"
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1299,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Drawer panel */}
      <Box
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        data-theme={dataTheme || undefined}
        onKeyDown={handleKeyDown}
        className={
          'drawer drawer-' + variant + ' drawer-' + size + ' drawer-' + anchor
          + (isSolid || isLight ? ' drawer-' + color : '')
          + ' ' + className
        }
        sx={{
          position: 'fixed',
          zIndex: 1300,
          ...POSITION_MAP[anchor],
          ...(isHorizontal
            ? { width: dim.width, height: '100%' }
            : { height: dim.height, width: '100%' }),
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          ...BORDER_EDGE[anchor],
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          overflow: 'hidden',
          animation: 'drawer-slide-in 0.3s ease forwards',
          '@keyframes drawer-slide-in': {
            from: { transform: SLIDE_CLOSED[anchor] },
            to: { transform: 'translate(0, 0)' },
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </>
  );
}

/* ─── DrawerClose ─── */
export function DrawerClose({
  onClick,
  className = '',
  sx = {},
  ...props
}) {
  return (
    <Box
      component="button"
      aria-label="Close drawer"
      onClick={onClick}
      className={'drawer-close ' + className}
      sx={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'var(--Text)',
        cursor: 'pointer',
        fontSize: '18px',
        lineHeight: 1,
        fontFamily: 'inherit',
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: 'var(--Hover)' },
        '&:active': { backgroundColor: 'var(--Active)' },
        '&:focus-visible': {
          outline: '3px solid var(--Focus-Visible)',
          outlineOffset: '-3px',
        },
        ...sx,
      }}
      {...props}
    >
      ✕
    </Box>
  );
}

/* ─── DrawerHeader ─── */
export function DrawerHeader({
  children,
  className = '',
  sx = {},
  ...props
}) {
  return (
    <Box
      className={'drawer-header ' + className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderBottom: '1px solid var(--Border)',
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── DrawerContent ─── */
export function DrawerContent({
  children,
  className = '',
  sx = {},
  ...props
}) {
  return (
    <Box
      className={'drawer-content ' + className}
      sx={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Drawer;
