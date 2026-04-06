// src/components/SpeedDial/SpeedDial.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '../Icon/Icon';

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

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const FAB_SIZE = 56;
const ACTION_SIZE = 40;
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
  openIcon,
  ariaLabel = 'Speed Dial',
  className = '',
  sx = {},
  ...props
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const containerRef = useRef(null);

  const C = cap(color === 'default' ? 'Default' : color);
  const isSolid = variant === 'solid';

  // Token references
  const fabBg = isSolid ? 'var(--Buttons-' + C + '-Button)' : 'transparent';
  const fabText = isSolid ? 'var(--Buttons-' + C + '-Text)' : 'var(--Buttons-' + C + '-Border)';
  const fabBorder = 'var(--Buttons-' + C + '-Border)';

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

  const btnSx = {
    borderRadius: '50%',
    border: '1px solid ' + fabBorder,
    backgroundColor: fabBg,
    color: fabText,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', outline: 'none',
    boxShadow: 'var(--Effect-Level-1)',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    '&:hover': { boxShadow: 'var(--Effect-Level-2)' },
    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
  };

  const defaultIcon = icon || <Icon size="medium" sx={{ color: 'inherit' }}><AddIcon /></Icon>;
  const defaultOpenIcon = openIcon || <Icon size="medium" sx={{ color: 'inherit' }}><CloseIcon /></Icon>;

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
      {/* FAB */}
      <Box
        component="button" type="button"
        aria-label={ariaLabel} aria-expanded={isOpen} aria-haspopup="menu"
        onClick={handleToggle}
        sx={{ ...btnSx, width: FAB_SIZE, height: FAB_SIZE, position: 'relative', zIndex: 2, fontSize: '24px' }}
      >
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          {isOpen ? defaultOpenIcon : defaultIcon}
        </Box>
      </Box>

      {/* Actions */}
      <Box role="menu" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {actions.map((action, index) => {
          const offset = getActionOffset(index);
          const delay = index * speed;
          const actionEl = (
            <Box
              component="button" type="button" role="menuitem"
              aria-label={action.name || 'Action ' + (index + 1)}
              onClick={() => handleActionClick(action, index)}
              key={action.key || index}
              sx={{
                ...btnSx,
                width: ACTION_SIZE, height: ACTION_SIZE, fontSize: '20px',
                position: 'absolute', ...offset,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'scale(1)' : 'scale(0.3)',
                transitionDelay: isOpen ? delay + 'ms' : '0ms',
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
            >
              {action.icon || <Icon size="small" sx={{ color: 'inherit' }}><AddIcon /></Icon>}
            </Box>
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
