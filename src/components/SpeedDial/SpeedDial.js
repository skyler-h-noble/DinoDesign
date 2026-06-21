// src/components/SpeedDial/SpeedDial.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '../Fab/Fab';

/**
 * SpeedDial Component
 *
 * VARIANTS:
 *   solid     FAB + actions: bg var(--Buttons-{C}-Button), border var(--Buttons-{C}-Border)
 *   outline   FAB + actions: bg transparent, border var(--Buttons-{C}-Border)
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * DIRECTION: up | down | left | right
 * TOOLTIPS: Optional labels shown beside actions
 *
 * Accessibility: role="menu", FAB has aria-expanded/aria-haspopup, actions are role="menuitem"
 */

// Main FAB is large (56), actions are small (32) — matches the Fab size scale.
// On open the main FAB rotates 45° so the AddIcon (+) becomes an × without
// swapping icon elements (clean visual, no remount).
const FAB_SIZE = 56;
const ACTION_SIZE = 32;
const GAP = 12;

export function SpeedDial({
  actions = [],
  variant = 'solid',
  color = 'default',
  direction = 'up',
  speed = 50,
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
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const containerRef = useRef(null);

  // Fab handles its own tokens/states; we just thread the variant + color.
  const fabVariant = variant;

  const handleToggle = useCallback(() => {
    if (isOpen) {
      if (!isControlled) setInternalOpen(false);
      onClose?.();
    } else {
      if (!isControlled) setInternalOpen(true);
      onOpen?.();
    }
  }, [isOpen, isControlled, onOpen, onClose]);

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
        size="large"
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
              size="small"
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
