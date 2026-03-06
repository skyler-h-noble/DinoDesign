// src/components/SpeedDial/SpeedDial.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

/**
 * SpeedDial Component
 *
 * A floating action button that reveals 3–6 related actions.
 *
 * VARIANTS (FAB + action buttons):
 *   solid   FAB: bg --Buttons-{C}-Button, text --Buttons-{C}-Text, border --Buttons-{C}-Border
 *           Actions: bg --Buttons-{C}-Button, text --Buttons-{C}-Text
 *   light   FAB: bg --Buttons-{C}-Light-Button, text --Buttons-{C}-Light-Text, border --Buttons-{C}-Light-Border
 *           Actions: bg --Buttons-{C}-Light-Button, text --Buttons-{C}-Light-Text
 *
 * DIRECTION: up (default), down, left, right
 * SPEED: Stagger delay per action in ms (default 50)
 * TOOLTIPS: Optional labels shown beside actions
 *
 * Accessibility: role="menu", FAB has aria-expanded/aria-haspopup, actions are role="menuitem"
 */

const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const FAB_SIZE = 56;
const ACTION_SIZE = 40;
const GAP = 12;

export function SpeedDial({
  actions = [],
  variant = 'solid',
  color = 'primary',
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

  const C = COLOR_MAP[color] || 'Primary';
  const isSolid = variant === 'solid';

  // Token references
  const fabBg = isSolid ? 'var(--Buttons-' + C + '-Button)' : 'var(--Buttons-' + C + '-Light-Button)';
  const fabText = isSolid ? 'var(--Buttons-' + C + '-Text)' : 'var(--Buttons-' + C + '-Light-Text)';
  const fabBorder = isSolid ? 'var(--Buttons-' + C + '-Border)' : 'var(--Buttons-' + C + '-Light-Border)';
  const fabHover = isSolid ? 'var(--Buttons-' + C + '-Hover)' : 'var(--Buttons-' + C + '-Light-Hover)';
  const fabActive = isSolid ? 'var(--Buttons-' + C + '-Active)' : 'var(--Buttons-' + C + '-Light-Active)';

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

  // Compute action position offsets
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

  // Tooltip placement
  const tooltipPlacement = direction === 'up' || direction === 'down'
    ? 'left'
    : direction === 'left' ? 'top' : 'top';

  // Container sizing
  const containerSx = {
    position: 'relative',
    display: 'inline-flex',
    overflow: 'visible',
    width: isVertical ? FAB_SIZE + 'px' : 'auto',
    height: isVertical ? 'auto' : FAB_SIZE + 'px',
    ...sx,
  };

  const fabSx = {
    width: FAB_SIZE + 'px',
    height: FAB_SIZE + 'px',
    borderRadius: '50%',
    border: '1px solid ' + fabBorder,
    backgroundColor: fabBg,
    color: fabText,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '24px',
    outline: 'none',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'background-color 0.15s ease, transform 0.2s ease',
    '&:hover': { backgroundColor: fabHover },
    '&:active': { backgroundColor: fabActive },
    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
  };

  const actionBtnSx = {
    width: ACTION_SIZE + 'px',
    height: ACTION_SIZE + 'px',
    borderRadius: '50%',
    border: '1px solid ' + fabBorder,
    backgroundColor: fabBg,
    color: fabText,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    outline: 'none',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
    transition: 'background-color 0.15s ease, transform 0.15s ease, opacity 0.2s ease',
    '&:hover': { backgroundColor: fabHover, transform: 'scale(1.1)' },
    '&:active': { backgroundColor: fabActive },
    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
  };

  const defaultIcon = icon || <AddIcon sx={{ fontSize: 'inherit' }} />;
  const defaultOpenIcon = openIcon || <CloseIcon sx={{ fontSize: 'inherit' }} />;

  return (
    <Box
      ref={containerRef}
      className={'speed-dial speed-dial-' + variant + ' speed-dial-' + color + ' speed-dial-' + direction + ' ' + className}
      sx={containerSx}
      {...props}
    >
      {/* FAB */}
      <Box
        component="button"
        type="button"
        role="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={handleToggle}
        className="speed-dial-fab"
        sx={fabSx}
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
      <Box
        role="menu"
        className="speed-dial-actions"
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        {actions.map((action, index) => {
          const offset = getActionOffset(index);
          const delay = index * speed;
          const actionEl = (
            <Box
              component="button"
              type="button"
              role="menuitem"
              aria-label={action.name || 'Action ' + (index + 1)}
              onClick={() => handleActionClick(action, index)}
              className="speed-dial-action"
              sx={{
                ...actionBtnSx,
                position: 'absolute',
                ...offset,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'scale(1)' : 'scale(0.3)',
                transitionDelay: isOpen ? delay + 'ms' : '0ms',
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
              key={action.key || index}
            >
              {action.icon || <AddIcon sx={{ fontSize: 'inherit' }} />}
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
                  tooltip: {
                    sx: {
                      backgroundColor: 'var(--Container)',
                      color: 'var(--Text)',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: '1px solid var(--Border)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    },
                  },
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
