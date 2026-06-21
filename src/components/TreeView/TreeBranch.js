// src/components/TreeView/TreeBranch.js
import React from 'react';
import { Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon } from '../Icon/Icon';
import { BodySmallSemibold } from '../Typography';

/**
 * TreeBranch — single row in a Tree View hierarchy.
 *
 * STATES: default, hover, active, focus-visible, disabled
 *   focus-visible — 3px inset outline, 2px offset inside the branch frame
 *
 * SIZE: small (medium TBD)
 *   Row min-height 24px, 8px padding all around, 4px gap. Slot gap 4px.
 *   Label uses BodySmallSemibold; toggle chevron + slot icon use Icon
 *   size="small" (16px).
 *
 * TOGGLE MODES:
 *   on    — chevron rotated -90°, children visible below the row
 *   off   — chevron right, children hidden
 *   none  — toggle frame omitted entirely (leaf row)
 *
 * LEVELS (Figma-aligned left padding tables):
 *   Toggle on/off — levels 1..5. Per-level branch padLeft + toggle padLeft:
 *      1 → 0   / 0
 *      2 → 24  / 4
 *      3 → 48  / 0
 *      4 → 72  / 0
 *      5 → 88  / 4
 *      Level 6 is force-coerced to 'none' (no on/off at the deepest tier).
 *
 *   Toggle none — levels 0..6. Per-level branch padLeft (+ slot padLeft):
 *      0 → 8
 *      1 → 48
 *      2 → 56   slot 4
 *      3 → 64   slot 4
 *      4 → 88   slot 4
 *      5 → 112
 *      6 → 128
 */

const TOGGLE_LEVELS_SMALL = {
  1: { padLeft: 0,  togglePadLeft: 0 },
  2: { padLeft: 24, togglePadLeft: 4 },
  3: { padLeft: 48, togglePadLeft: 0 },
  4: { padLeft: 72, togglePadLeft: 0 },
  5: { padLeft: 88, togglePadLeft: 4 },
};

const NONE_LEVELS_SMALL = {
  0: { padLeft: 8 },
  1: { padLeft: 48 },
  2: { padLeft: 56, slotPadLeft: 4 },
  3: { padLeft: 64, slotPadLeft: 4 },
  4: { padLeft: 88, slotPadLeft: 4 },
  5: { padLeft: 112 },
  6: { padLeft: 128 },
};

export function TreeBranch({
  label,
  icon,
  level = 0,
  toggle = 'none',
  onToggle,
  disabled = false,
  size = 'small',
  className = '',
  sx = {},
  children,
  ...props
}) {
  // Level 6 doesn't support on/off — coerce to none.
  const effToggle = level === 6 && toggle !== 'none' ? 'none' : toggle;
  const isOn = effToggle === 'on';
  const showToggleFrame = effToggle !== 'none';

  // Per-level padding lookup. Falls back to the closest reasonable entry
  // for out-of-range levels so the component still paints something.
  const paddings = showToggleFrame
    ? (TOGGLE_LEVELS_SMALL[level] || { padLeft: 0, togglePadLeft: 0 })
    : (NONE_LEVELS_SMALL[level] || NONE_LEVELS_SMALL[0]);

  // 8px on all sides per the spec; left is overridden by the level table.
  const branchPadding = {
    paddingTop: '8px',
    paddingRight: '8px',
    paddingBottom: '8px',
    paddingLeft: (paddings.padLeft ?? 8) + 'px',
  };

  const handleToggle = (e) => {
    if (disabled) return;
    if (showToggleFrame) {
      e.stopPropagation();
      onToggle?.(isOn ? 'off' : 'on');
    }
  };

  return (
    <Box
      className={'tree-branch tree-branch-' + size + ' tree-branch-level-' + level + ' tree-branch-toggle-' + effToggle +
        (disabled ? ' tree-branch-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{ width: '100%', ...sx }}
      {...props}
    >
      {/* Branch row — the actual clickable line. */}
      <Box
        component="button"
        type="button"
        role="treeitem"
        aria-expanded={showToggleFrame ? isOn : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        disabled={disabled}
        sx={{
          // hstack — Toggle frame (optional) → Slot. 4px gap, 8px padding,
          // min-height 24px for the small variant.
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
          width: '100%',
          minHeight: '24px',
          ...branchPadding,
          border: 'none',
          backgroundColor: 'transparent',
          fontFamily: 'inherit',
          color: 'inherit',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: 'none',
          transition: 'background-color 0.15s ease, color 0.15s ease',
          '&:hover': !disabled ? { backgroundColor: 'var(--Hover)' } : {},
          '&:active': !disabled ? { backgroundColor: 'var(--Active)' } : {},
          '&:focus-visible': {
            // 3px outline, sitting 2px inside the branch edge.
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: '-2px',
          },
        }}
      >
        {/* Toggle frame — hidden when toggle=none. The chevron rotates
            -90° when toggle=on per the Figma spec. */}
        {showToggleFrame && (
          <Box
            className="tree-branch-toggle"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              paddingLeft: (paddings.togglePadLeft ?? 0) + 'px',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                transform: isOn ? 'rotate(-90deg)' : 'rotate(0deg)',
              }}
            >
              <Icon size="small">
                <ChevronRightIcon />
              </Icon>
            </Box>
          </Box>
        )}

        {/* Slot — flex-row, 4px gap, optional left padding from the level
            table. Accepts any content; the default is an Icon (optional)
            plus a BodySmallSemibold label. */}
        <Box
          className="tree-branch-slot"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            minWidth: 0,
            ...(paddings.slotPadLeft !== undefined && { paddingLeft: paddings.slotPadLeft + 'px' }),
          }}
        >
          {icon && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
              <Icon size="small">{icon}</Icon>
            </Box>
          )}
          {label !== undefined && label !== null && (
            <BodySmallSemibold
              style={{
                color: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                flex: 1,
                minWidth: 0,
              }}
            >
              {label}
            </BodySmallSemibold>
          )}
        </Box>
      </Box>

      {/* Children — only rendered when toggle is on. role="group" carries
          the WAI-ARIA tree semantics for nested branches. */}
      {isOn && children && (
        <Box role="group" sx={{ display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export default TreeBranch;
