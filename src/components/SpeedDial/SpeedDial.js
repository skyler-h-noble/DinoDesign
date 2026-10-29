// src/components/SpeedDial/SpeedDial.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { Tooltip } from '../Tooltip/Tooltip';
import AddIcon from '@omni-design/icons/Add';
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
 * TOOLTIPS: each action's name beside it, shown while the dial is open
 *   (showTooltips={false} drops them)
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
 * The FIRST action sits Sizing-1-and-Half (12) from the dial at every size —
 * Figma's Child Container puts a dial-sized spacer, then 12, then the slot —
 * and the actions after it are SpeedDial-Gap apart. At large that is 12 then
 * 16, which is what the file draws (actions at 68, 140, 212 from the dial).
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

const SxBox = lazySxBox('SpeedDial');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* ─── Static sheet ───
   Rules that reach into a Fab carry the dial's class as well (two classes),
   so they beat the Fab's own single-class rules whatever order the two
   sheets were inserted in — the action's transition and opacity REPLACED the
   Fab's, as the sx they come from did. */
registerStaticStyles('omni-speed-dial', [
  '.omni-sd{position:relative;display:inline-flex;overflow:visible;width:var(--_sd-w);height:var(--_sd-h)}',
  '.omni-sd .omni-sd-main{position:relative;z-index:2}',
  /* lineHeight 0, or the + rotates off its own centre: an inline-flex box
     reserves a line box (the strut) whether or not there is text in it, so
     the wrapper came out taller than the icon and its 50% sat below the
     glyph's middle. Zeroing it makes the box exactly the icon. The origin is
     stated rather than relied on, so a parent rule cannot move it silently. */
  '.omni-sd-icon{display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;line-height:0;transform-origin:50% 50%;'
    + 'transition:transform 0.3s ease;transform:rotate(0deg)}',
  '.omni-sd-icon-open{transform:rotate(45deg)}',
  '.omni-sd-menu{position:absolute;inset:0;pointer-events:none;overflow:visible}',
  '.omni-sd .omni-sd-act{opacity:0;transform:scale(0.3);transition:opacity 0.2s ease, transform 0.2s ease;pointer-events:none}',
  '.omni-sd .omni-sd-act-open{opacity:1;transform:scale(1);pointer-events:auto}',
  '.omni-sd .omni-sd-act-abs{position:absolute}',
  '.omni-sd-slot{position:absolute;display:flex}',
].join('\n'));

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
  /** The action labels render in place rather than on document.body — for a
   *  dial shown inside a scaled preview, where portalled labels escape the
   *  scale and draw at full size. */
  disablePortal = false,
  open: controlledOpen,
  onOpen,
  onClose,
  icon,
  ariaLabel = 'Speed Dial',
  /* Figma's Disabled state: the dial at 38% (Fab's own disabled look), and it
     cannot open. */
  disabled = false,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-speed-dial');
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
  const FIRST_GAP = 12; // Sizing-1-and-Half, at every size

  const [internalOpen, setInternalOpenState] = useState(false);
  /* What the dial is about to be, not only what it last rendered: a hover
     that opens it and a click that lands before React has re-rendered must
     see the open dial, so the click closes it (as it does when the two are
     further apart). */
  const openNow = useRef(false);
  const setInternalOpen = useCallback((v) => { openNow.current = v; setInternalOpenState(v); }, []);
  const isControlled = controlledOpen !== undefined;
  const isOpen = !disabled && (isControlled ? controlledOpen : internalOpen);
  const containerRef = useRef(null);

  // Fab handles its own tokens and states; we thread the color only.
  const fabVariant = 'solid';
  const ACTION_FAB_SIZE = sc.actionSize;

  const handleToggle = useCallback(() => {
    if (isControlled ? isOpen : !disabled && openNow.current) {
      if (!isControlled) setInternalOpen(false);
      onClose?.();
    } else {
      if (!isControlled) setInternalOpen(true);
      onOpen?.();
    }
  }, [isOpen, isControlled, disabled, onOpen, onClose, setInternalOpen]);

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
    if (disabled || !openOnHover || !pointerCanHover()) return;
    cancelHoverClose();
    if (isOpen) return;
    if (!isControlled) setInternalOpen(true);
    onOpen?.();
  }, [disabled, openOnHover, isOpen, isControlled, onOpen, cancelHoverClose]);

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
    const distance = FAB_SIZE / 2 + FIRST_GAP + ACTION_SIZE / 2 + index * (ACTION_SIZE + GAP);
    switch (direction) {
      case 'up': return { bottom: distance + 'px', left: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      case 'down': return { top: distance + 'px', left: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      case 'left': return { right: distance + 'px', top: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      case 'right': return { left: distance + 'px', top: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
      default: return { bottom: distance + 'px', left: (FAB_SIZE - ACTION_SIZE) / 2 + 'px' };
    }
  };

  const tooltipPlacement = direction === 'up' || direction === 'down' ? 'left' : 'top';

  // The main icon (defaults to AddIcon). We wrap it in a rotating box so the
  // 45° turn animates whether the user provides a custom icon or not — the
  // rotation alone turns + into × without an icon swap / remount (see the
  // sheet for why its line-height is 0).
  const mainIcon = (
    <div className={'omni-sd-icon' + (isOpen ? ' omni-sd-icon-open' : '')}>
      {icon || <AddIcon />}
    </div>
  );

  const rootProps = {
    ref: containerRef,
    /* On the CONTAINER, not the Fab: it wraps the dial and the whole fan,
       including the gaps between them, so the pointer can travel inward
       without the fan closing underneath it. */
    onMouseEnter: handleHoverOpen,
    onMouseLeave: handleHoverClose,
    className: 'speed-dial speed-dial-' + variant + ' speed-dial-' + color + ' speed-dial-' + direction + ' omni-sd ' + className,
    ...props,
    // The dial's footprint as custom properties, so a caller's sx still wins.
    style: { '--_sd-w': isVertical ? FAB_SIZE + 'px' : 'auto', '--_sd-h': isVertical ? 'auto' : FAB_SIZE + 'px', ...props.style },
  };
  const content = (
    <>
      {/* Main FAB — rotates 45° on open */}
      <Fab
        size={sc.fabSize}
        variant={fabVariant}
        color={color}
        onClick={handleToggle}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="omni-sd-main"
      >
        {mainIcon}
      </Fab>

      {/* Actions */}
      <div role="menu" className="omni-sd-menu">
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
              className={'omni-sd-act' + (isOpen ? ' omni-sd-act-open' : '') + (disablePortal ? '' : ' omni-sd-act-abs')
                + (action.className ? ' ' + action.className : '')}
              aria-label={action.name || 'Action ' + (index + 1)}
              onClick={() => handleActionClick(action, index)}
              /* In place, the offset moves to the wrapper below so the label
                 can sit beside the action with CSS. */
              style={{ ...(disablePortal ? {} : offset), transitionDelay: isOpen ? delay + 'ms' : '0ms' }}
            >
              {action.icon || <AddIcon />}
            </Fab>
          );

          if (showTooltips && action.name) {
            const label = (
              /* The lib's Tooltip — its one solid style, as Figma's SpeedDial
                 draws beside each action. */
              <Tooltip
                key={action.key || index}
                title={action.name}
                placement={tooltipPlacement}
                /* Shown for as long as the dial is open — as Figma draws them —
                   not on hover: a phone has no hover, so the labels never
                   appeared where speed dials are used most. Always a boolean,
                   so the tooltip stays controlled from its first render. */
                open={isOpen}
                inline={disablePortal}
              >
                {actionEl}
              </Tooltip>
            );
            if (!disablePortal) return label;
            return (
              <div key={action.key || index} className="omni-sd-slot" style={offset}>
                {label}
              </div>
            );
          }
          return disablePortal
            ? <div key={action.key || index} className="omni-sd-slot" style={offset}>{actionEl}</div>
            : actionEl;
        })}
      </div>
    </>
  );

  return hasSx(sx)
    ? <SxBox sx={sx} {...rootProps}>{content}</SxBox>
    : <div {...rootProps}>{content}</div>;
}

export default SpeedDial;
