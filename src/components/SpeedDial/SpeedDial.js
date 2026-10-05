// src/components/SpeedDial/SpeedDial.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '../Fab/Fab';

/**
 * SpeedDial Component
 *
 * ONE VARIANT: solid. The design's FAB set has no shape axis at all — its
 * only axes are State plus the Extended and Animate booleans — so an outline
 * FAB is something the library offered and the system does not have. `outline`
 * now normalises to solid with a development warning, the same way Fab already
 * handles the variant it lost.
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * DIRECTION: up | down | left | right
 * TOOLTIPS: Optional labels shown beside actions
 *
 * Accessibility: role="menu", FAB has aria-expanded/aria-haspopup, actions are role="menuitem"
 */

/* ONE SIZE THROUGHOUT: the dial and its actions are both FAB-Width.
 *
 * This table used to start the dial at 48 for `small` and hold the actions at
 * a flat 32, on the reasoning that a dial the same size as its own fan reads
 * as four buttons in a line rather than as their parent. The file disagrees,
 * and the file is the system: the SpeedDial set binds the dial's FAB and every
 * child FAB in the slot to the SAME FAB/FAB-Width, with SpeedDial-Gap between
 * them. Read on the page in its large mode, that is 56 for the dial, 56 for
 * each action and 16 of gap.
 *
 * So the ramp is simply FAB-Width's own — 32 / 48 / 56 — and `size` passes
 * straight through to Fab rather than being remapped a step up. The old table
 * rendered a medium Fab for `small` and a large one for `medium`, so every
 * dial was one step bigger than it was asked for.
 *
 * WCAG 2.5.8 still clears at the bottom of the ramp: 32 is comfortably past
 * the 24px minimum, which is what made the flat-32 floor unnecessary.
 *
 * The GAP is `SpeedDial-Gap`, 8 / 12 / 16: three consecutive steps of the
 * sizing scale (--Sizing-1, -1-and-Half, -2) rather than a ramp invented for
 * this component. Medium is 12, which is what the single constant held before
 * the axis existed, so nothing moves for anything already using the default.
 *
 * On open the dial rotates 45° so the AddIcon (+) becomes an × without
 * swapping icon elements (clean visual, no remount).
 */
const SIZE_MAP = {
  small:  { fab: 32, fabSize: 'small',  action: 32, actionSize: 'small',  gap: 8  },
  medium: { fab: 48, fabSize: 'medium', action: 48, actionSize: 'medium', gap: 12 },
  large:  { fab: 56, fabSize: 'large',  action: 56, actionSize: 'large',  gap: 16 },
};

export function SpeedDial({
  actions = [],
  variant = 'solid',
  color = 'default',
  direction = 'up',
  size = 'medium',
  speed = 50,
  /* ON by default, matching the file's openOnHover boolean.
   *
   * This defaulted to false on the argument that a FAB's main habitat is
   * touch, where hover does not exist, so opening on hover would make the
   * primary interaction the one unavailable where the component is most used.
   * That objection is already answered in this file: pointerCanHover() gates
   * every hover path behind `(hover: hover) and (pointer: fine)`, so a touch
   * device never opens on hover whatever this says. With the risk handled in
   * code there was nothing left for the default to protect against, and the
   * design asks for true. Click keeps working either way. */
  openOnHover = true,
  showTooltips = true,
  open: controlledOpen,
  onOpen,
  onClose,
  icon,
  ariaLabel = 'Speed Dial',
  className = '',
  sx = {},
  ...props
}) {
  /* Normalised rather than typed away, so an existing variant="outline" keeps
     rendering instead of breaking at a call site that cannot be edited. */
  if (process.env.NODE_ENV !== 'production' && variant !== 'solid') {
    // eslint-disable-next-line no-console
    console.warn(
      '[SpeedDial] variant="' + variant + '" is not a SpeedDial variant; '
      + 'rendering solid. The design\'s FAB set has no shape axis \u2014 only '
      + 'State, Extended and Animate \u2014 so an outline FAB is not in the system.'
    );
  }
  const sc = SIZE_MAP[size] || SIZE_MAP.medium;
  const FAB_SIZE = sc.fab;
  const ACTION_SIZE = sc.action;
  const GAP = sc.gap;

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const containerRef = useRef(null);

  // Fab handles its own tokens and states; we thread the color only.
  const fabVariant = 'solid';
  const ACTION_FAB_SIZE = sc.actionSize;

  const handleToggle = useCallback(() => {
    if (isOpen) {
      if (!isControlled) setInternalOpen(false);
      onClose?.();
    } else {
      if (!isControlled) setInternalOpen(true);
      onOpen?.();
    }
  }, [isOpen, isControlled, onOpen, onClose]);

  /* Hover, built to WCAG 1.4.13 rather than to onMouseEnter/onMouseLeave.
   *
   * The criterion asks for three things, and a naive handler pair gives one.
   *   DISMISSIBLE — Escape closes it. That already existed.
   *   HOVERABLE   — the pointer has to be able to travel from the dial to the
   *                 actions. There is a 12px gap between them and another
   *                 between each action, so leaving the dial means leaving the
   *                 element: closing on mouseleave would shut the fan while
   *                 the user was reaching into it. The close is therefore
   *                 DELAYED, and cancelled if the pointer lands anywhere in
   *                 the container — which includes the gaps, because the
   *                 container wraps the whole fan.
   *   PERSISTENT  — it does not time out on its own. The delay below only
   *                 governs closing AFTER the pointer has left.
   *
   * Gated on the POINTER, not the device: `(hover: hover) and (pointer: fine)`
   * asks what the user is holding, where `data-device` asks what they are
   * sitting at. A Surface has both; an iPad with a trackpad is a "mobile"
   * device with a fine pointer. The platform axis is the right tool for
   * sizing and the wrong one for this.
   */
  const HOVER_CLOSE_DELAY = 120;
  const closeTimer = useRef(null);

  const pointerCanHover = () =>
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const cancelHoverClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleHoverOpen = useCallback(() => {
    if (!openOnHover || !pointerCanHover()) return;
    cancelHoverClose();
    if (isOpen) return;
    if (!isControlled) setInternalOpen(true);
    onOpen?.();
  }, [openOnHover, isOpen, isControlled, onOpen, cancelHoverClose]);

  const handleHoverClose = useCallback(() => {
    if (!openOnHover || !pointerCanHover()) return;
    cancelHoverClose();
    closeTimer.current = setTimeout(() => {
      if (!isControlled) setInternalOpen(false);
      onClose?.();
    }, HOVER_CLOSE_DELAY);
  }, [openOnHover, isControlled, onClose, cancelHoverClose]);

  /* A pending close must not fire after the component has gone, which is the
     ordinary unmount leak and also what happens when a dial is removed by the
     action the user just clicked. */
  useEffect(() => cancelHoverClose, [cancelHoverClose]);

  const handleActionClick = useCallback((action, index) => {
    action.onClick?.(index);
    if (!isControlled) setInternalOpen(false);
    onClose?.();
  }, [isControlled, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!isControlled) setInternalOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, isControlled, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (!isControlled) setInternalOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, isControlled, onClose]);

  const isVertical = direction === 'up' || direction === 'down';

  const getActionOffset = (index) => {
    const distance = FAB_SIZE / 2 + GAP + ACTION_SIZE / 2 + index * (ACTION_SIZE + GAP);
    switch (direction) {
      case 'up': return { bottom: distance + 'px', left: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      case 'down': return { top: distance + 'px', left: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      case 'left': return { right: distance + 'px', top: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      case 'right': return { left: distance + 'px', top: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      default: return { bottom: distance + 'px', left: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
    }
  };

  const tooltipPlacement = direction === 'up' || direction === 'down' ? 'left' : 'top';

  // The main icon (defaults to AddIcon). We wrap it in a rotating Box so the
  // 45° turn animates whether the user provides a custom icon or not — the
  // rotation alone turns + into × without an icon swap / remount.
  const mainIcon = (
    <Box
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        /* lineHeight: 0, or the + rotates off its own centre.
         *
         * An inline-flex box reserves a LINE BOX: the strut that line-height
         * sets aside for ascenders and descenders, whether or not there is any
         * text in it. So this wrapper came out taller than the icon it holds,
         * its 50% sat a few pixels below the glyph's middle, and `rotate()`
         * — which turns about the element's own box, not its contents —
         * swung the + around that lower point. The result reads as a wobble
         * rather than a spin, and it is worse at larger icon sizes because the
         * strut grows with the font size while the glyph does not.
         *
         * Zeroing it collapses the strut so the box is exactly the icon, and
         * the two centres become the same point. */
        lineHeight: 0,
        /* Stated rather than relied on. It is the initial value, but a parent
           setting transform-origin on a descendant selector would otherwise
           move this silently, and a rotation that is off by a few pixels is
           hard to trace back to a rule nobody remembers writing. */
        transformOrigin: '50% 50%',
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
      }}
    >
      {icon || <AddIcon />}
    </Box>
  );

  return (
    <Box
      ref={containerRef}
      /* On the CONTAINER, not the Fab: it wraps the dial and the whole fan,
         including the gaps between them, so the pointer can travel inward
         without the fan closing underneath it. */
      onMouseEnter={handleHoverOpen}
      onMouseLeave={handleHoverClose}
      className={'speed-dial speed-dial-' + variant + ' speed-dial-' + color + ' speed-dial-' + direction + ' ' + className}
      sx={{
        position: 'relative', display: 'inline-flex', overflow: 'visible',
        width: isVertical ? FAB_SIZE + 'px' : 'auto',
        height: isVertical ? 'auto' : FAB_SIZE + 'px',
        ...sx,
      }}
      {...props}
    >
      {/* Main FAB — large (56), rotates 45° on open */}
      <Fab
        size={sc.fabSize}
        variant={fabVariant}
        color={color}
        onClick={handleToggle}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        sx={{ position: 'relative', zIndex: 2 }}
      >
        {mainIcon}
      </Fab>

      {/* Actions */}
      <Box role="menu" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {actions.map((action, index) => {
          const offset = getActionOffset(index);
          const delay = index * speed;
          const actionEl = (
            <Fab
              key={action.key || index}
              /* The dial's own size, not a hardcoded small — the file binds
                 every child FAB in the slot to the same FAB-Width as the
                 dial. */
              size={ACTION_FAB_SIZE}
              variant={fabVariant}
              color={color}
              role="menuitem"
              aria-label={action.name || 'Action ' + (index + 1)}
              onClick={() => handleActionClick(action, index)}
              sx={{
                position: 'absolute', ...offset,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'scale(1)' : 'scale(0.3)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                transitionDelay: isOpen ? delay + 'ms' : '0ms',
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
            >
              {action.icon || <AddIcon />}
            </Fab>
          );

          if (showTooltips && action.name) {
            return (
              <MuiTooltip
                key={action.key || index}
                title={action.name}
                placement={tooltipPlacement}
                arrow
                open={isOpen ? undefined : false}
                slotProps={{
                  tooltip: { sx: { backgroundColor: 'var(--Container)', color: 'var(--Text)', fontSize: '12px', fontWeight: 500, border: '1px solid var(--Border)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' } },
                  arrow: { sx: { color: 'var(--Container)' } },
                }}
              >
                {actionEl}
              </MuiTooltip>
            );
          }
          return actionEl;
        })}
      </Box>
    </Box>
  );
}

export default SpeedDial;
