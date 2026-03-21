// src/components/TreeView/TreeView.js
import React from 'react';
import { Box } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * DynoTreeView — wraps MUI X SimpleTreeView
 *
 * TREE CONTAINER:
 *   Always var(--Background), no data-theme on the wrapper.
 *
 * ITEM STATES:
 *   Resting:  bg var(--Background),                 text var(--Text-Quiet), no border
 *   Hover:    bg var(--Background),                 text var(--Text),       border var(--Border)
 *   Active — solid:    bg var(--Buttons-{Color}-Button),  text var(--Text),  border var(--Buttons-{Color}-Border)
 *   Active — outlined: bg var(--Background),              text var(--Text),  border var(--Buttons-{Color}-Border)
 *
 * SELECTION STYLE (selectionStyle prop):
 *   solid    filled active item using the color's button token
 *   outlined outlined active item — transparent bg, colored border
 *
 * COLORS: primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * DENSITY:
 *   compact  24px min height (minimum allowed)
 *   default  32px min height
 *
 * ANIMATION: none | slide | spring
 *
 * ITEM DATA SHAPE:
 *   {
 *     id:        string        (required)
 *     label:     string        (required)
 *     icon?:     ReactElement  optional — rendered before label
 *     badge?:    ReactElement  optional — rendered after label (dot, count, etc.)
 *     sx?:       object        optional — per-node MUI sx overrides
 *     disabled?: boolean
 *     children?: Item[]
 *   }
 */

// Capitalize color name for token lookup: primary → Primary
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const DENSITY_MAP = {
  compact: { minHeight: '24px', fontSize: '13px', py: '2px', px: '10px', iconSize: 16, gap: '6px' },
  default: { minHeight: '32px', fontSize: '14px', py: '4px', px: '12px', iconSize: 18, gap: '8px' },
};

const ANIMATION_MAP = {
  none:   {},
  slide:  { '& .MuiCollapse-root': { transition: 'all 0.25s ease' } },
  spring: { '& .MuiCollapse-root': { transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' } },
};

/** Builds MUI sx for each TreeItem based on color + selectionStyle */
function getItemSx(d, color, selectionStyle) {
  const colorToken = cap(color); // e.g. "Primary"

  // Active state tokens
  const solidActiveBg     = 'var(--Buttons-' + colorToken + '-Button)';
  const solidActiveBorder = 'var(--Buttons-' + colorToken + '-Border)';
  const outlinedActiveBg  = 'var(--Background)';

  const activeBg     = selectionStyle === 'solid' ? solidActiveBg : outlinedActiveBg;
  const activeBorder = solidActiveBorder; // same for both solid + outlined

  return {
    '& > .MuiTreeItem-content': {
      minHeight:    d.minHeight,
      fontSize:     d.fontSize,
      fontFamily:   'inherit',
      color:        'var(--Text-Quiet)',       // resting text
      padding:      d.py + ' ' + d.px,
      borderRadius: 'var(--Style-Border-Radius)',
      border:       '1px solid transparent',   // always reserve border space
      transition:   'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
      backgroundColor: 'var(--Background)',

      // ── Hover ──────────────────────────────────────────────────
      '&:hover': {
        backgroundColor: 'var(--Background)',
        color:           'var(--Text)',
        borderColor:     'var(--Border)',
      },

      // ── Focus ring ─────────────────────────────────────────────
      '&.Mui-focused': {
        backgroundColor: 'var(--Background)',
        color:           'var(--Text)',
        borderColor:     'var(--Border)',
        outline:         '2px solid var(--Focus-Visible)',
        outlineOffset:   '-2px',
      },

      // ── Active / selected ───────────────────────────────────────
      '&.Mui-selected': {
        backgroundColor: activeBg,
        color:           'var(--Text)',
        borderColor:     activeBorder,
        fontWeight:      600,
        // Keep active style on hover
        '&:hover': {
          backgroundColor: activeBg,
          color:           'var(--Text)',
          borderColor:     activeBorder,
        },
      },
      '&.Mui-selected.Mui-focused': {
        backgroundColor: activeBg,
        color:           'var(--Text)',
        borderColor:     activeBorder,
        outline:         '2px solid var(--Focus-Visible)',
        outlineOffset:   '-2px',
      },

      '&.Mui-disabled': { opacity: 0.45 },
    },

    // Label text
    '& > .MuiTreeItem-content .MuiTreeItem-label': {
      fontSize:   d.fontSize,
      fontFamily: 'inherit',
      lineHeight: d.minHeight,
    },

    // Expand/collapse icon
    '& > .MuiTreeItem-content .MuiTreeItem-iconContainer': {
      width: d.iconSize + 'px',
      color: 'var(--Text-Quiet)',
    },

    // Indentation guide
    '& > .MuiTreeItem-group': {
      marginLeft:  '12px',
      borderLeft:  '1px solid var(--Border)',
      paddingLeft: '8px',
    },
  };
}

/** Label slot: icon + text + optional badge */
function ItemLabel({ item, d }) {
  return (
    <Box sx={{
      display:    'flex',
      alignItems: 'center',
      gap:        d.gap,
      width:      '100%',
    }}>
      {item.icon && (
        <Box sx={{
          display:    'flex',
          alignItems: 'center',
          flexShrink: 0,
          color:      'inherit',
          opacity:    0.8,
          '& svg':    { fontSize: d.iconSize + 'px !important' },
        }}>
          {item.icon}
        </Box>
      )}
      <Box sx={{
        flex:         1,
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        whiteSpace:   'nowrap',
      }}>
        {item.label}
      </Box>
      {item.badge && (
        <Box sx={{ flexShrink: 0 }}>
          {item.badge}
        </Box>
      )}
    </Box>
  );
}

/** Recursively renders TreeItem nodes */
function renderItems(items = [], density = 'default', color = 'primary', selectionStyle = 'solid') {
  const d = DENSITY_MAP[density] || DENSITY_MAP.default;

  return items.map((item) => (
    <TreeItem
      key={item.id}
      itemId={item.id}
      disabled={item.disabled}
      label={<ItemLabel item={item} d={d} />}
      sx={{
        ...getItemSx(d, color, selectionStyle),
        ...(item.sx || {}),
      }}
    >
      {item.children && item.children.length > 0
        ? renderItems(item.children, density, color, selectionStyle)
        : null}
    </TreeItem>
  ));
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DynoTreeView({
  // Style
  color          = 'primary',
  selectionStyle = 'solid',     // 'solid' | 'outlined'
  density        = 'default',   // 'compact' | 'default'
  animation      = 'slide',     // 'none' | 'slide' | 'spring'

  // Data
  items = DEFAULT_ITEMS,

  // MUI X — selection
  selectionMode          = 'single',  // 'single' | 'multi'
  checkboxSelection      = false,
  disableSelection       = false,
  disabledItemsFocusable = false,

  // MUI X — expansion (uncontrolled)
  defaultExpandedItems,

  // MUI X — expansion (controlled)
  expandedItems,
  onExpandedItemsChange,

  // MUI X — selection (controlled)
  selectedItems,
  onSelectedItemsChange,

  // MUI X callbacks
  onItemExpansionToggle,
  onItemSelectionToggle,

  // Custom icon slots
  slots,

  // Misc
  className = '',
  sx = {},
  ...props
}) {
  const d = DENSITY_MAP[density] || DENSITY_MAP.default;

  const expansionProps = {};
  if (expandedItems         !== undefined) expansionProps.expandedItems         = expandedItems;
  if (onExpandedItemsChange !== undefined) expansionProps.onExpandedItemsChange = onExpandedItemsChange;
  if (defaultExpandedItems  !== undefined) expansionProps.defaultExpandedItems  = defaultExpandedItems;

  const selectionProps = {};
  if (selectedItems         !== undefined) selectionProps.selectedItems         = selectedItems;
  if (onSelectedItemsChange !== undefined) selectionProps.onSelectedItemsChange = onSelectedItemsChange;

  return (
    <Box
      data-surface="Surface-Dim"
      className={
        'dyno-treeview' +
        ' dyno-treeview-' + selectionStyle +
        ' dyno-treeview-' + color +
        ' dyno-treeview-' + density +
        (className ? ' ' + className : '')
      }
      sx={{
        backgroundColor: 'var(--Background)',
        border:          '1px solid var(--Border)',
        borderRadius:    'var(--Style-Border-Radius)',
        overflow:        'hidden',
        ...(ANIMATION_MAP[animation] || {}),
        ...sx,
      }}
    >
      <SimpleTreeView
        multiSelect={selectionMode === 'multi'}
        checkboxSelection={checkboxSelection}
        disableSelection={disableSelection}
        disabledItemsFocusable={disabledItemsFocusable}
        onItemExpansionToggle={onItemExpansionToggle}
        onItemSelectionToggle={onItemSelectionToggle}
        slots={{
          expandIcon:   () => <ChevronRightIcon sx={{ fontSize: d.iconSize + 'px' }} />,
          collapseIcon: () => <ExpandMoreIcon   sx={{ fontSize: d.iconSize + 'px' }} />,
          ...slots,
        }}
        sx={{
          p: '8px',
          '& .MuiTreeItem-root': { fontFamily: 'inherit' },
        }}
        {...expansionProps}
        {...selectionProps}
        {...props}
      >
        {renderItems(items, density, color, selectionStyle)}
      </SimpleTreeView>
    </Box>
  );
}

// ─── Default sample data ──────────────────────────────────────────────────────

export const DEFAULT_ITEMS = [
  {
    id: '1',
    label: 'Design System',
    children: [
      {
        id: '1-1',
        label: 'Foundations',
        children: [
          { id: '1-1-1', label: 'Colors' },
          { id: '1-1-2', label: 'Typography' },
          { id: '1-1-3', label: 'Spacing' },
        ],
      },
      {
        id: '1-2',
        label: 'Components',
        children: [
          { id: '1-2-1', label: 'Buttons' },
          { id: '1-2-2', label: 'Inputs' },
          { id: '1-2-3', label: 'Navigation', disabled: true },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Tokens',
    children: [
      { id: '2-1', label: 'Light Mode' },
      { id: '2-2', label: 'Dark Mode' },
    ],
  },
  { id: '3', label: 'Changelog' },
];

// ─── Convenience exports ──────────────────────────────────────────────────────

export const SolidTreeView    = (p) => <DynoTreeView selectionStyle="solid"    {...p} />;
export const OutlinedTreeView = (p) => <DynoTreeView selectionStyle="outlined" {...p} />;

export default DynoTreeView;