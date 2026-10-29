// src/components/Popover/Popover.js
import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */
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
 *   disablePortal  render in place instead of on document.body, with no
 *               anchor positioning — the panel sits where it is put and the
 *               arrow takes its placement's start / centre / end. For docs,
 *               samples and the parity page; a real popover keeps the portal.
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
/* The arrow is Figma's 10px square turned 45° (14.1px across, so it stands
   ARROW = 7 clear of the panel), its 1px stroke inside, its centre on the
   panel's inner edge. Start / end sit 12px plus half its diagonal in. */
const ARROW_BOX = 10;
const ARROW_INSET = 12 + ARROW_BOX * Math.SQRT1_2;
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const SxBox = lazySxBox('Popover');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
/* MUI's sizing rule, as the sx it replaces read a number: a fraction up to 1
   is a percentage, anything else pixels. */
const sizeValue = (v) => (typeof v === 'number' ? (v > 0 && v <= 1 ? v * 100 + '%' : v + 'px') : v);

/* ─── Static sheet ───
   Per-instance values (the measured position, the width, the arrow's x, the
   body's max height) arrive as custom properties, so a caller's sx still
   overrides any of them as it did. */
registerStaticStyles('omni-popover', [
  '.omni-pop{position:fixed;top:var(--_pop-top);left:var(--_pop-left);visibility:var(--_pop-vis);z-index:2000000000;'
    + 'width:var(--_pop-w);box-sizing:border-box;background-color:var(--Background);color:var(--Text);border:1px solid var(--Border);'
    + `border-radius:${RADIUS};box-shadow:${SHADOW_LEVEL_2};outline:none}`,
  '.omni-pop-inplace{position:relative;top:auto;left:auto;z-index:auto}',
  /* arrowX is measured from the panel's outer edge; the arrow sits in its
     padding box, 1px in. */
  `.omni-pop > .popover-arrow{position:absolute;width:${ARROW_BOX}px;height:${ARROW_BOX}px;box-sizing:border-box;left:var(--_pop-ax);`
    + 'background-color:var(--Background);border:1px solid var(--Border);transform:rotate(45deg);pointer-events:none}',
  `.omni-pop[data-side="bottom"] > .popover-arrow{top:${-ARROW_BOX / 2}px;border-right:none;border-bottom:none}`,
  `.omni-pop[data-side="top"] > .popover-arrow{bottom:${-ARROW_BOX / 2}px;border-left:none;border-top:none}`,
  /* The scroll lives on an inner box, so the arrow can sit outside the frame
     without being clipped by the overflow. */
  '.omni-pop-body{max-height:var(--_pop-mh);overflow-y:auto;border-radius:inherit}',
].join('\n'));

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
  sx,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  role = 'dialog',
  autoFocus = true,
  id,
  onMouseEnter,
  onMouseLeave,
  disablePortal = false,
}) {
  useStaticStyles('omni-popover');
  const popoverRef = useRef(null);
  /* With sx the panel is an MUI box that loads on demand and REPLACES the
     plain one — remounting what was focused inside it. Once focus has moved
     in, a new panel takes it again, so it ends where it always did. */
  const focusedIn = useRef(false);
  const placeRef = useRef(null);
  const lastNode = useRef(null);
  const setPopoverRef = useCallback((node) => {
    popoverRef.current = node;
    if (!node) return;
    const replaced = lastNode.current !== null && lastNode.current !== node && !lastNode.current.isConnected;
    lastNode.current = node;
    // A replacement may be a different size (its sx arrived): measure again.
    if (replaced && placeRef.current) placeRef.current();
    if (focusedIn.current && !node.contains(document.activeElement)) (node.querySelector(FOCUSABLE) || node).focus({ preventScroll: true });
  }, []);
  const wasOpen = useRef(false);
  const [pos, setPos] = useState(null);
  const getAnchor = useCallback(() => anchorEl || anchorRef?.current || null, [anchorEl, anchorRef]);

  /* Position: below (or above) the anchor, aligned start / end / centre, kept
     inside the viewport. Measured after render so the panel's own size is
     known; re-measured on scroll and resize so it stays attached. */
  const place = useCallback(() => {
    const p = popoverRef.current;
    if (disablePortal) {
      if (!p) return;
      const pw = p.offsetWidth;
      const side = placement.startsWith('top') ? 'top' : 'bottom';
      const arrowX = placement.endsWith('-start') ? ARROW_INSET : placement.endsWith('-end') ? pw - ARROW_INSET : pw / 2;
      setPos({ top: 0, left: 0, side, arrowX });
      return;
    }
    const a = getAnchor();
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
    const arrowX = Math.max(ARROW_INSET, Math.min(r.left + r.width / 2 - left, pw - ARROW_INSET));
    setPos({ top, left, side, arrowX });
  }, [getAnchor, placement, arrow, disablePortal]);

  placeRef.current = place;
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
        focusedIn.current = true;
      }, 0);
      return () => clearTimeout(t);
    }
    focusedIn.current = false;
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

  const panelProps = {
    ref: setPopoverRef,
    role,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    tabIndex: role === 'tooltip' ? undefined : -1,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    'data-theme': theme || undefined,
    'data-surface': surface,
    'data-side': pos?.side,
    className: 'popover omni-pop' + (disablePortal ? ' omni-pop-inplace' : '') + (className ? ' ' + className : ''),
    style: {
      ...(disablePortal ? {} : { '--_pop-top': (pos ? pos.top : -9999) + 'px', '--_pop-left': (pos ? pos.left : -9999) + 'px' }),
      '--_pop-vis': pos ? 'visible' : 'hidden',
      '--_pop-w': sizeValue(width),
      '--_pop-ax': ((pos?.arrowX ?? 0) - 1 - ARROW_BOX / 2) + 'px',
    },
  };
  const content = (
    <>
      {arrow && <span className="popover-arrow" aria-hidden="true" />}
      <div className="popover-body omni-pop-body" style={{ '--_pop-mh': sizeValue(maxHeight) }}>
        {children}
      </div>
    </>
  );
  const panel = hasSx(sx)
    ? <SxBox sx={sx} {...panelProps}>{content}</SxBox>
    : <div {...panelProps}>{content}</div>;
  return disablePortal ? panel : ReactDOM.createPortal(panel, document.body);
}

export default Popover;
