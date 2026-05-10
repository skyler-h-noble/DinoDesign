// src/components/Popover/Popover.js
import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@mui/material';

/**
 * Popover Component
 *
 * A positioned overlay that renders via portal to escape parent overflow.
 * Accepts any children — use for notifications, rich tooltips, pickers, etc.
 *
 * Props:
 *   open        boolean        — controlled visibility
 *   onClose     fn()           — called on outside click or Escape
 *   anchorRef   React.ref      — element to position against
 *   placement   string         — 'bottom-start' | 'bottom-end' (default: 'bottom-end')
 *   theme       string         — data-theme value (default: 'Default')
 *   surface     string         — data-surface value (default: 'Surface-Bright')
 *   width       number|string  — popover width (default: 320)
 *   maxHeight   number|string  — max height before scroll (default: 400)
 *   children    ReactNode
 *   sx          object
 */

export function Popover({
  open = false,
  onClose,
  anchorRef,
  placement = 'bottom-end',
  theme = 'Default',
  surface = 'Surface-Bright',
  width = 320,
  maxHeight = 400,
  children,
  sx = {},
}) {
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, right: 'auto' });

  // Position relative to anchor
  useEffect(() => {
    if (!open || !anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    if (placement === 'bottom-end') {
      setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right, left: 'auto' });
    } else {
      setPos({ top: rect.bottom + 6, left: rect.left, right: 'auto' });
    }
  }, [open, anchorRef, placement]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popoverRef.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose?.();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open, onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <Box
      ref={popoverRef}
      data-theme={theme}
      data-surface={surface}
      sx={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        right: pos.right,
        zIndex: 2000000000,
        width,
        maxHeight,
        overflowY: 'auto',
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: 'var(--Effect-Level-4)',
        ...sx,
      }}
    >
      {children}
    </Box>,
    document.body
  );
}

export default Popover;
