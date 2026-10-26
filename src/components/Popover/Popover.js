// src/components/Popover/Popover.js
import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@mui/material';
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five styles:
     1  Card / Accordion, Handle, Alert, Bottom-Sheet
     2  Card-Hover / App bars, Toolbars, Menus, Tooltip, Bottom-Sheet-Hover
     3  FAB, Snackbar
     4  FAB-Hover
     5  Dialog & Modal */
import { SHADOW_LEVEL_2 } from '../_shadows';

/**
 * Popover Component
 *
 * A floating panel anchored to an element, rendered through a portal so a
 * scroll area or a clipped card cannot cut it off (the lib's Menu is
 * position:absolute and can be).
 *
 * Props:
 *   open        boolean        — controlled visibility
 *   onClose     fn()           — outside click, Escape, or Tab out of the panel
 *   anchorRef   React.ref      — element to position against (or `anchorEl`)
 *   anchorEl    Element        — the element itself, when there is no ref
 *   placement   string         — 'bottom-end' (default) | 'bottom-start' | 'bottom'
 *                                 | 'top-end' | 'top-start' | 'top'. A bottom
 *                                 placement that would run off the viewport
 *                                 flips to the top, and the reverse.
 *   arrow       boolean        — a 7px arrow pointing at the anchor
 *   theme       string         — data-theme value (default: 'Default')
 *   surface     string         — data-surface value (default: 'Surface-Bright')
 *   width       number|string  — popover width (default: 320; 'auto' hugs)
 *   maxHeight   number|string  — max height before scroll (default: 400)
 *   aria-label / aria-labelledby — the panel's name (it is role="dialog")
 *   role        'dialog' (default) | 'tooltip' — a hover card is a tooltip
 *   autoFocus   true (default): focus moves in on open and back on close.
 *               false for a hover card, which must not steal focus.
 *   id          for aria-describedby on the trigger
 *   children    ReactNode
 *   sx          object
 *
 * FRAME: the menu panel's — --Border edge, Dropdown-Frame-Radius corners (it
 * read --Style-Border-Radius, which on a pill brand rounded a 400px panel into
 * a lozenge), the Level 2 shadow.
 *
 * FOCUS: on open, focus moves to the first focusable thing in the panel (or
 * the panel); on close it returns to the anchor, so a keyboard user lands back
 * where they were.
 */
const RADIUS = 'var(--Dropdown-Frame-Radius, var(--Input-Radius, var(--Style-Border-Radius, 4px)))';
const GAP = 6;
const ARROW = 7;
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function Popover({
  open = false,
  onClose,
  anchorRef,
  anchorEl,
  placement = 'bottom-end',
  arrow = false,
  theme = 'Default',
  surface = 'Surface-Bright',
  width = 320,
  maxHeight = 400,
  children,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  role = 'dialog',
  autoFocus = true,
  id,
  onMouseEnter,
  onMouseLeave,
}) {
  const popoverRef = useRef(null);
  const wasOpen = useRef(false);
  const [pos, setPos] = useState(null);
  const getAnchor = useCallback(() => anchorEl || anchorRef?.current || null, [anchorEl, anchorRef]);

  /* Position: below (or above) the anchor, aligned start / end / centre, kept
     inside the viewport. Measured after render so the panel's own size is
     known; re-measured on scroll and resize so it stays attached. */
  const place = useCallback(() => {
    const a = getAnchor();
    const p = popoverRef.current;
    if (!a || !p) return;
    const r = a.getBoundingClientRect();
    const pw = p.offsetWidth, ph = p.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    const off = GAP + (arrow ? ARROW : 0);
    let side = placement.startsWith('top') ? 'top' : 'bottom';
    if (side === 'bottom' && r.bottom + off + ph > vh && r.top - off - ph > 0) side = 'top';
    else if (side === 'top' && r.top - off - ph < 0 && r.bottom + off + ph < vh) side = 'bottom';
    const align = placement.endsWith('-start') ? 'start' : placement.endsWith('-end') ? 'end' : 'center';
    let left = align === 'start' ? r.left : align === 'end' ? r.right - pw : r.left + r.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, vw - pw - 8));
    const top = side === 'bottom' ? r.bottom + off : r.top - off - ph;
    // The arrow points at the anchor's centre, wherever the panel had to sit.
    const arrowX = Math.max(12, Math.min(r.left + r.width / 2 - left, pw - 12));
    setPos({ top, left, side, arrowX });
  }, [getAnchor, placement, arrow]);

  useLayoutEffect(() => {
    if (!open) { setPos(null); return undefined; }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  // Focus in on open, back to the anchor on close.
  useEffect(() => {
    if (!autoFocus) return undefined;
    if (open) {
      wasOpen.current = true;
      const t = setTimeout(() => {
        const p = popoverRef.current;
        if (!p) return;
        (p.querySelector(FOCUSABLE) || p).focus({ preventScroll: true });
      }, 0);
      return () => clearTimeout(t);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      const a = getAnchor();
      if (a && typeof a.focus === 'function') a.focus({ preventScroll: true });
    }
    return undefined;
  }, [open, getAnchor, autoFocus]);

  // Close on outside click
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (popoverRef.current?.contains(e.target)) return;
      if (getAnchor()?.contains(e.target)) return;
      onClose?.();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open, onClose, getAnchor]);

  // Close on Escape
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Tabbing past either end of the panel closes it.
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const items = [...(popoverRef.current?.querySelectorAll(FOCUSABLE) || [])];
    const first = items[0], last = items[items.length - 1];
    if (!items.length || (!e.shiftKey && document.activeElement === last) || (e.shiftKey && document.activeElement === first)) onClose?.();
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <Box
      ref={popoverRef}
      role={role}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      tabIndex={role === 'tooltip' ? undefined : -1}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      data-theme={theme || undefined}
      data-surface={surface}
      data-side={pos?.side}
      className={'popover' + (className ? ' ' + className : '')}
      sx={{
        position: 'fixed',
        top: pos ? pos.top : -9999,
        left: pos ? pos.left : -9999,
        visibility: pos ? 'visible' : 'hidden',
        zIndex: 2000000000,
        width,
        boxSizing: 'border-box',
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        border: '1px solid var(--Border)',
        borderRadius: RADIUS,
        boxShadow: SHADOW_LEVEL_2,  // the Menus / Tooltip step
        outline: 'none',
        '& > .popover-arrow': {
          position: 'absolute', width: ARROW * 2, height: ARROW * 2,
          left: (pos?.arrowX ?? 0) - ARROW,
          backgroundColor: 'var(--Background)',
          border: '1px solid var(--Border)',
          transform: 'rotate(45deg)',
          pointerEvents: 'none',
        },
        '&[data-side="bottom"] > .popover-arrow': { top: -ARROW - 1, borderRight: 'none', borderBottom: 'none' },
        '&[data-side="top"] > .popover-arrow': { bottom: -ARROW - 1, borderLeft: 'none', borderTop: 'none' },
        ...sx,
      }}
    >
      {arrow && <span className="popover-arrow" aria-hidden="true" />}
      {/* The scroll lives on an inner box, so the arrow can sit outside the
          frame without being clipped by the overflow. */}
      <Box className="popover-body" sx={{ maxHeight, overflowY: 'auto', borderRadius: 'inherit' }}>
        {children}
      </Box>
    </Box>,
    document.body
  );
}

export default Popover;
