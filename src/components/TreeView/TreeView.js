// src/components/TreeView/TreeView.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * TreeView Component — wraps MUI X SimpleTreeView
 *
 * VARIANTS:
 *   default   no data-theme, data-surface="Surface-Dim"
 *   solid     data-theme="{Color}",       data-surface="Surface-Dim"
 *   light     data-theme="{Color}-Light", data-surface="Surface-Dim"
 *
 * COLORS: primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * DENSITY:
 *   compact   24px item height (minimum)
 *   default   32px item height
 *
 * SELECTION:
 *   single    one item at a time (default)
 *   multi     multiSelect enabled
 *
 * OTHER OPTIONS (all passed through):
 *   checkboxSelection    show checkboxes on items
 *   disableSelection     prevent any selection
 *   disabledItemsFocusable  allow focus on disabled items
 *   defaultExpandedItems    array of item ids to expand by default
 *   expandedItems / onExpandedItemsChange  controlled expansion
 *   selectedItems / onSelectedItemsChange  controlled selection
 *   onItemExpansionToggle   callback(event, itemId, isExpanded)
 *   onItemSelectionToggle   callback(event, itemId, isSelected)
 *
 * DATA SHAPE:
 *   items = [{ id, label, disabled?, children?: [...] }]
 */

const SOLID_THEME_MAP = {
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info-Medium',
  success:   'Success-Medium',
  warning:   'Warning-Medium',
  error:     'Error-Medium',
};

const LIGHT_THEME_MAP = {
  primary:   'Primary-Light',
  secondary: 'Secondary-Light',
  tertiary:  'Tertiary-Light',
  neutral:   'Neutral-Light',
  info:      'Info-Light',
  success:   'Success-Light',
  warning:   'Warning-Light',
  error:     'Error-Light',
};

const DENSITY_MAP = {
  compact: { itemHeight: '24px', fontSize: '13px', py: '2px', px: '8px', iconSize: 16 },
  default: { itemHeight: '32px', fontSize: '14px', py: '4px', px: '8px', iconSize: 18 },
};

/** Recursively renders TreeItem nodes */
function renderItems(items = [], density = 'default') {
  const d = DENSITY_MAP[density] || DENSITY_MAP.default;
  return items.map((item) => (
    <TreeItem
      key={item.id}
      itemId={item.id}
      label={item.label}
      disabled={item.disabled}
      sx={{
        '& .MuiTreeItem-content': {
          minHeight: d.itemHeight,
          fontSize: d.fontSize,
          color: 'var(--Text)',
          padding: d.py + ' ' + d.px,
          borderRadius: 'var(--Style-Border-Radius)',
          '&:hover': { backgroundColor: 'var(--Hover)' },
          '&.Mui-focused': {
            backgroundColor: 'var(--Hover)',
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '-2px',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--Buttons-Default-Light-Button)',
            color: 'var(--Buttons-Default-Light-Text)',
            '&:hover': { backgroundColor: 'var(--Buttons-Default-Light-Button)' },
          },
          '&.Mui-selected.Mui-focused': {
            backgroundColor: 'var(--Buttons-Default-Light-Button)',
          },
          '&.Mui-disabled': { opacity: 0.5 },
        },
        '& .MuiTreeItem-label': {
          fontSize: d.fontSize,
          fontFamily: 'inherit',
          lineHeight: d.itemHeight,
        },
        '& .MuiTreeItem-iconContainer': {
          width: d.iconSize + 'px',
          color: 'var(--Text-Quiet)',
        },
        '& > .MuiTreeItem-group': {
          marginLeft: '12px',
          borderLeft: '1px solid var(--Border)',
          paddingLeft: '8px',
        },
      }}
    >
      {item.children && item.children.length > 0 && renderItems(item.children, density)}
    </TreeItem>
  ));
}

export function DynoTreeView({
  // Styling
  variant = 'default',
  color = 'primary',
  density = 'default',

  // Data
  items = DEFAULT_ITEMS,

  // MUI X props — selection
  selectionMode = 'single',        // 'single' | 'multi'
  checkboxSelection = false,
  disableSelection = false,
  disabledItemsFocusable = false,

  // MUI X props — expansion (uncontrolled)
  defaultExpandedItems,

  // MUI X props — expansion (controlled)
  expandedItems,
  onExpandedItemsChange,

  // MUI X props — selection (controlled)
  selectedItems,
  onSelectedItemsChange,

  // MUI X callbacks
  onItemExpansionToggle,
  onItemSelectionToggle,

  // Misc
  className = '',
  sx = {},
  ...props
}) {
  const isSolid   = variant === 'solid';
  const isLight   = variant === 'light';
  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : undefined;

  const d = DENSITY_MAP[density] || DENSITY_MAP.default;

  // Build controlled / uncontrolled expansion props
  const expansionProps = {};
  if (expandedItems !== undefined)         expansionProps.expandedItems = expandedItems;
  if (onExpandedItemsChange !== undefined) expansionProps.onExpandedItemsChange = onExpandedItemsChange;
  if (defaultExpandedItems !== undefined)  expansionProps.defaultExpandedItems = defaultExpandedItems;

  // Build controlled / uncontrolled selection props
  const selectionProps = {};
  if (selectedItems !== undefined)         selectionProps.selectedItems = selectedItems;
  if (onSelectedItemsChange !== undefined) selectionProps.onSelectedItemsChange = onSelectedItemsChange;

  return (
    <Box
      data-theme={dataTheme || undefined}
      data-surface="Surface-Dim"
      className={
        'dyno-treeview dyno-treeview-' + variant +
        ' dyno-treeview-' + color +
        ' dyno-treeview-' + density +
        (className ? ' ' + className : '')
      }
      sx={{
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        overflow: 'hidden',
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
        }}
        sx={{
          p: '8px',
          '& .MuiTreeItem-root': { fontFamily: 'inherit' },
        }}
        {...expansionProps}
        {...selectionProps}
        {...props}
      >
        {renderItems(items, density)}
      </SimpleTreeView>
    </Box>
  );
}

// ─── Default sample data ────────────────────────────────────────────────────

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
  {
    id: '3',
    label: 'Changelog',
  },
];

// ─── Convenience exports ────────────────────────────────────────────────────

export const DefaultTreeView  = (p) => <DynoTreeView variant="default" {...p} />;
export const SolidTreeView    = (p) => <DynoTreeView variant="solid"   {...p} />;
export const LightTreeView    = (p) => <DynoTreeView variant="light"   {...p} />;

export default DynoTreeView;
