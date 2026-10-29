// src/components/TreeView/TreeBranch.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import ChevronRightIcon from '@omni-design/icons/ChevronRight';
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

const SxBox = lazySxBox('TreeBranch');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

/* The static sheet. The per-level left paddings arrive as custom properties
   (--_tb-pl on the row, --_tb-tpl on the toggle frame, --_tb-spl on the slot)
   read by one rule each. */
registerStaticStyles('omni-tree-branch', webkitBox([
  '.omni-tbr-root{width:100%}',
  /* hstack — Toggle frame (optional) → Slot. 4px gap, 8px padding (left from
     the level table), min-height 24px for the small variant. */
  '.omni-tbr-row{display:flex;flex-direction:row;align-items:center;gap:4px;width:100%;min-height:24px;'
    + 'padding:8px 8px 8px var(--_tb-pl);border:none;background-color:transparent;font-family:inherit;color:inherit;'
    + 'text-align:left;cursor:pointer;opacity:1;outline:none;transition:background-color 0.15s ease, color 0.15s ease}',
  '.omni-tbr-row-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  '.omni-tbr-row-on:hover{background-color:var(--Hover)}',
  '.omni-tbr-row-on:active{background-color:var(--Pressed)}',
  // 3px outline, sitting 2px inside the branch edge.
  '.omni-tbr-row:focus-visible{outline:3px solid var(--Focus-Visible);outline-offset:-2px}',
  '.omni-tbr-toggle{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;padding-left:var(--_tb-tpl)}',
  '.omni-tbr-chev{display:inline-flex;align-items:center;justify-content:center;transition:transform 0.2s ease;transform:rotate(0deg)}',
  '.omni-tbr-chev-on{transform:rotate(-90deg)}',
  '.omni-tbr-slot{display:flex;flex-direction:row;align-items:center;gap:4px;flex:1;min-width:0}',
  '.omni-tbr-slot-pl{padding-left:var(--_tb-spl)}',
  '.omni-tbr-icon{display:inline-flex;align-items:center;flex-shrink:0}',
  '.omni-tbr-group{display:flex;flex-direction:column}',
].join('\n')));

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
  useStaticStyles('omni-tree-branch');
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
  const branchPadLeft = (paddings.padLeft ?? 8) + 'px';
  const Root = hasSx(sx) ? SxBox : 'div';

  const handleToggle = (e) => {
    if (disabled) return;
    if (showToggleFrame) {
      e.stopPropagation();
      onToggle?.(isOn ? 'off' : 'on');
    }
  };

  return (
    <Root
      {...(Root === 'div' ? {} : { sx })}
      className={'tree-branch tree-branch-' + size + ' tree-branch-level-' + level + ' tree-branch-toggle-' + effToggle +
        (disabled ? ' tree-branch-disabled' : '') +
        (className ? ' ' + className : '') + ' MuiBox-root omni-tbr-root'}
      {...props}
    >
      {/* Branch row — the actual clickable line. */}
      <button
        type="button"
        role="treeitem"
        aria-expanded={showToggleFrame ? isOn : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        disabled={disabled}
        className={'MuiBox-root omni-tbr-row' + (disabled ? ' omni-tbr-row-off' : ' omni-tbr-row-on')}
        style={{ '--_tb-pl': branchPadLeft }}
      >
        {/* Toggle frame — hidden when toggle=none. The chevron rotates
            -90° when toggle=on per the Figma spec. */}
        {showToggleFrame && (
          <div className="tree-branch-toggle MuiBox-root omni-tbr-toggle" style={{ '--_tb-tpl': (paddings.togglePadLeft ?? 0) + 'px' }}>
            <div className={'MuiBox-root omni-tbr-chev' + (isOn ? ' omni-tbr-chev-on' : '')}>
              <Icon size="small">
                <ChevronRightIcon />
              </Icon>
            </div>
          </div>
        )}

        {/* Slot — flex-row, 4px gap, optional left padding from the level
            table. Accepts any content; the default is an Icon (optional)
            plus a BodySmallSemibold label. */}
        <div
          className={'tree-branch-slot MuiBox-root omni-tbr-slot' + (paddings.slotPadLeft !== undefined ? ' omni-tbr-slot-pl' : '')}
          style={paddings.slotPadLeft !== undefined ? { '--_tb-spl': paddings.slotPadLeft + 'px' } : undefined}
        >
          {icon && (
            <div className="MuiBox-root omni-tbr-icon">
              <Icon size="small">{icon}</Icon>
            </div>
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
        </div>
      </button>

      {/* Children — only rendered when toggle is on. role="group" carries
          the WAI-ARIA tree semantics for nested branches. */}
      {isOn && children && (
        <div role="group" className="MuiBox-root omni-tbr-group">
          {children}
        </div>
      )}
    </Root>
  );
}

export default TreeBranch;
