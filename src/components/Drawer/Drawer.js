// src/components/Drawer/Drawer.js
import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { useDynoDesign } from '../../DynoDesignProvider';

/**
 * Drawer Component
 *
 * A navigation panel that slides in from an edge of the viewport.
 * No color prop — content (TreeView, nav items, etc.) handles its own theming.
 *
 * SIZES: small (240px) | medium (320px) | large (420px)
 * ANCHOR: left | right | top | bottom
 *
 * The drawer inherits the provider's theme context and uses Surface-Dim
 * for the background, matching the sidebar pattern.
 *
 * Closes on Escape, backdrop click, or close button.
 * Focus is trapped within the drawer while open.
 */

const SIZE_DIMENSION = {
  small:  { width: '240px', height: '200px' },
  medium: { width: '320px', height: '280px' },
  large:  { width: '420px', height: '380px' },
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

export function Drawer({
  children,
  open = false,
  onClose,
  size = 'medium',
  anchor = 'left',
  hideBackdrop = false,
  className = '',
  sx = {},
  ...props
}) {
  const drawerRef = useRef(null);
  const previousFocus = useRef(null);
  const isHorizontal = anchor === 'left' || anchor === 'right';

  // Get provider theme for the portal
  let dynoCtx;
  try { dynoCtx = useDynoDesign(); } catch { dynoCtx = null; }
  const providerTheme = dynoCtx?.theme || 'Default';
  const providerStyle = dynoCtx?.style || 'Modern';

  const dim = SIZE_DIMENSION[size] || SIZE_DIMENSION.medium;

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Focus management
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement;
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
          onClick={() => onClose?.()}
          aria-hidden="true"
          sx={{
            position: 'fixed', inset: 0, zIndex: 10000000,
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
        data-theme={providerTheme}
        data-style={providerStyle}
        data-surface="Surface-Dim"
        onKeyDown={handleKeyDown}
        className={'drawer drawer-' + size + ' drawer-' + anchor + ' ' + className}
        sx={{
          position: 'fixed',
          zIndex: 10000001,
          ...POSITION_MAP[anchor],
          ...(isHorizontal
            ? { width: dim.width, height: '100%' }
            : { height: dim.height, width: '100%' }),
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          ...BORDER_EDGE[anchor],
          boxShadow: 'var(--Effect-Level-3)',
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
export function DrawerClose({ onClick, className = '', sx = {}, ...props }) {
  return (
    <Box sx={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1, ...sx }} className={className} {...props}>
      <Button iconOnly variant="ghost" size="small" onClick={onClick} aria-label="Close drawer">
        <Icon size="small"><CloseIcon /></Icon>
      </Button>
    </Box>
  );
}

/* ─── DrawerHeader ─── */
export function DrawerHeader({ children, className = '', sx = {}, ...props }) {
  return (
    <Box
      className={'drawer-header ' + className}
      sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px', borderBottom: '1px solid var(--Border)', flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── DrawerContent ─── */
export function DrawerContent({ children, className = '', sx = {}, ...props }) {
  return (
    <Box
      className={'drawer-content ' + className}
      sx={{ flex: 1, overflowY: 'auto', padding: '16px', ...sx }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Drawer;
