// src/components/TreeView/TreeView.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon } from '../Icon/Icon';
import { BodySmall, Caption } from '../Typography';

/**
 * DynoTreeView — wraps MUI X SimpleTreeView
 *
 * VARIANT (applies to the whole tree container):
 *   default   data-theme="Default"          data-surface="Surface-Dim"
 *   solid     data-theme="{Theme}"          data-surface="Surface-Dim"
 *   light     data-theme="{Theme}-Light"    data-surface="Surface-Dim"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * ITEM STATES:
 *   Resting:  bg var(--Background), text var(--Text-Quiet), no border
 *   Hover:    bg var(--Background), text var(--Text),       border var(--Border)
 *   Active:   bg var(--Buttons-{Color}-Button), text var(--Text), border var(--Buttons-{Color}-Border)
 *
 * DENSITY:
 *   compact  24px min height
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

/** Builds MUI sx for each TreeItem */
function getItemSx(d) {
  return {
    '& > .MuiTreeItem-content': {
      minHeight:       d.minHeight,
      fontSize:        d.fontSize,
      fontFamily:      'inherit',
      color:           'var(--Quiet)',
      padding:         '0 8px',
      borderRadius:    'var(--Style-Border-Radius)',
      border:          '1px solid transparent',
      transition:      'color 0.15s ease, border-color 0.15s ease',
      backgroundColor: 'transparent',

      '&:hover': {
        color:       'var(--Text)',
        borderColor: 'var(--Border)',
      },

      '&.Mui-focused, &:focus-visible': {
        color:       'var(--Text)',
        borderColor: 'var(--Border)',
        outline:     'none !important',
      },

      '&.Mui-selected': {
        borderColor:     'var(--Border)',
        color:           'var(--Text)',
        fontWeight:      600,
        backgroundColor: 'var(--Background)',
        padding:         '0 8px',
        '&:hover': {
          borderColor:     'var(--Border)',
          backgroundColor: 'var(--Background)',
        },
      },

      '&.Mui-selected.Mui-focused, &.Mui-selected:focus-visible': {
        borderColor:     'var(--Border)',
        backgroundColor: 'var(--Background)',
        padding:         '0 8px',
        outline:         'none !important',
      },

      // Focus-visible 3px inset — keyboard only
      '&:focus-visible': {
        outline:       '3px solid var(--Focus-Visible)',
        outlineOffset: '-3px',
      },

      '&.Mui-disabled': { opacity: 0.45 },
    },

    // Let label fill the entire content area
    '& > .MuiTreeItem-content .MuiTreeItem-label': {
      fontSize:   d.fontSize,
      fontFamily: 'inherit',
      lineHeight: d.minHeight,
      padding:    0,
      width:      '100%',
    },

    // Expand/collapse icon — inherits text color
    '& > .MuiTreeItem-content .MuiTreeItem-iconContainer': {
      width:   d.iconSize + 'px',
      color:   'inherit',
      zIndex:  1,
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
function ItemLabel({ item, d, isCompact }) {
  const TextComp = isCompact ? Caption : BodySmall;
  return (
    <Box sx={{
      display:    'flex',
      alignItems: 'center',
      gap:        d.gap,
      width:      '100%',
    }}>
      {item.icon && (
        <Icon size="small" sx={{ color: 'inherit', flexShrink: 0 }}>
          {item.icon}
        </Icon>
      )}
      <TextComp style={{
        flex:         1,
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        whiteSpace:   'nowrap',
        color:        'inherit',
        fontWeight:   'inherit',
      }}>
        {item.label}
      </TextComp>
      {item.badge && (
        <Box sx={{ flexShrink: 0 }}>
          {item.badge}
        </Box>
      )}
    </Box>
  );
}

/** Recursively renders TreeItem nodes */
function renderItems(items = [], density = 'default', color = 'primary', variant = 'default', selectedIds = []) {
  const d = DENSITY_MAP[density] || DENSITY_MAP.default;
  const isCompact = density === 'compact';
  const colorToken = cap(color);

  return items.map((item) => {
    const isSelected = selectedIds.includes(item.id);

    // When selected, the .MuiTreeItem-content (first child of <li>) gets
    // data-theme and data-surface so var(--Background) resolves correctly
    const contentProps = isSelected ? {
      'data-theme':   colorToken,
      'data-surface':  variant === 'light' ? 'Surface' : 'Surface-Dimmest',
    } : {};

    return (
      <TreeItem
        key={item.id}
        itemId={item.id}
        disabled={item.disabled}
        label={<ItemLabel item={item} d={d} isCompact={isCompact} />}
        slotProps={{
          content: contentProps,
        }}
        sx={{
          ...getItemSx(d),
          ...(item.sx || {}),
        }}
      >
        {item.children && item.children.length > 0
          ? renderItems(item.children, density, color, variant, selectedIds)
          : null}
      </TreeItem>
    );
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DynoTreeView({
  // Style
  color          = 'default',
  variant        = 'solid',     // 'solid' | 'light'
  density        = 'default',   // 'compact' | 'default'
  animation      = 'slide',     // 'none' | 'slide' | 'spring'

  // Legacy alias
  selectionStyle,

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
  'aria-label': ariaLabel = 'Tree view',
  className = '',
  sx = {},
  ...props
}) {
  // Support legacy selectionStyle prop
  const effectiveVariant = selectionStyle || variant;

  const d = DENSITY_MAP[density] || DENSITY_MAP.default;

  // Compute data-theme based on variant
  const colorToken = cap(color);
  const dataTheme = effectiveVariant === 'light'
    ? colorToken + '-Light'
    : colorToken;

  // Track selection internally so ItemLabel knows which items are selected
  const [internalSelected, setInternalSelected] = useState(
    selectedItems || (selectionMode === 'multi' ? [] : null)
  );
  const effectiveSelected = selectedItems !== undefined ? selectedItems : internalSelected;
  const selectedArray = Array.isArray(effectiveSelected)
    ? effectiveSelected
    : effectiveSelected ? [effectiveSelected] : [];

  const handleSelectionChange = useCallback((event, ids) => {
    if (selectedItems === undefined) setInternalSelected(ids);
    onSelectedItemsChange?.(event, ids);
  }, [selectedItems, onSelectedItemsChange]);

  const expansionProps = {};
  if (expandedItems         !== undefined) expansionProps.expandedItems         = expandedItems;
  if (onExpandedItemsChange !== undefined) expansionProps.onExpandedItemsChange = onExpandedItemsChange;
  if (defaultExpandedItems  !== undefined) expansionProps.defaultExpandedItems  = defaultExpandedItems;

  return (
    <Box
      data-theme={dataTheme}
      data-surface="Surface-Dim"
      className={
        'dyno-treeview' +
        ' dyno-treeview-' + effectiveVariant +
        ' dyno-treeview-' + color +
        ' dyno-treeview-' + density +
        (className ? ' ' + className : '')
      }
      sx={{
        backgroundColor: 'var(--Background)',
        borderRadius:    'var(--Style-Border-Radius)',
        overflow:        'hidden',
        ...(ANIMATION_MAP[animation] || {}),
        ...sx,
      }}
    >
      <SimpleTreeView
        aria-label={ariaLabel}
        multiSelect={selectionMode === 'multi'}
        checkboxSelection={checkboxSelection}
        disableSelection={disableSelection}
        disabledItemsFocusable={disabledItemsFocusable}
        selectedItems={effectiveSelected}
        onSelectedItemsChange={handleSelectionChange}
        onItemExpansionToggle={onItemExpansionToggle}
        onItemSelectionToggle={onItemSelectionToggle}
        slots={{
          expandIcon:   () => <Icon size="small"><ChevronRightIcon /></Icon>,
          collapseIcon: () => <Icon size="small"><ExpandMoreIcon /></Icon>,
          ...slots,
        }}
        sx={{
          p: '8px',
          '& .MuiTreeItem-root': { fontFamily: 'inherit' },
          // Only show focus outline for keyboard navigation, not mouse clicks
          '& .MuiTreeItem-content.Mui-focused': {
            outline: 'none',
          },
          '& .MuiTreeItem-content:focus-visible': {
            outline: 'none',
          },
        }}
        {...expansionProps}
        {...props}
      >
        {renderItems(items, density, color, effectiveVariant, selectedArray)}
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

export const SolidTreeView = (p) => <DynoTreeView variant="solid" {...p} />;
export const LightTreeView = (p) => <DynoTreeView variant="light" {...p} />;

export default DynoTreeView;