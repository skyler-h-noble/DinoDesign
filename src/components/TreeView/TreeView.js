// src/components/TreeView/TreeView.js
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon } from '../Icon/Icon';
import { BodySmall, Caption } from '../Typography';
import { Checkbox } from '../Checkbox/Checkbox';

/**
 * OmniTreeView — the design system's own tree.
 *
 * ── Why it is not a wrapper any more ──────────────────────────────────────
 * It wrapped MUI X's SimpleTreeView, and rollup inlined that whole package
 * into the bundle — 90KB of dist/index.js, 14% of it, for one component that
 * most consumers never import. Measured, not guessed: marking it external
 * took dist/index.js from 645,978 to 555,958 bytes.
 *
 * The wrapper also could not be fixed by making it external instead. Rollup
 * emits every external as a top-level require, so `require('@mui/x-tree-view')`
 * would run on import for EVERY consumer and throw for anyone who had not
 * installed it — including everyone who never touches the tree.
 *
 * And a wrapper is most of a tree's cost anyway. A tree is behaviour —
 * expand, collapse, roving focus, arrow-key traversal, selection — and the
 * wrapper was re-styling someone else's version of that through twelve
 * `.MuiTreeItem-*` selectors, which is both larger and more fragile than
 * writing the behaviour. Those selectors broke on every MUI X minor.
 *
 * ── The pattern this implements ───────────────────────────────────────────
 * WAI-ARIA's tree: one tabbable item at a time (roving tabindex), arrows to
 * move, Right to open, Left to close or go to the parent, Home/End to the
 * ends, Enter/Space to select. `aria-level`, `aria-setsize` and
 * `aria-posinset` are stated on every item because a screen reader cannot
 * infer them once `role="group"` is in play.
 *
 * ── Item shape (unchanged) ────────────────────────────────────────────────
 *   { id, label, icon?, badge?, sx?, disabled?, children? }
 *
 * VARIANT (applies to the whole tree container):
 *   default   no data-theme            data-surface="Surface-Dim"
 *   solid     data-theme="{Theme}"     data-surface="Surface-Dim"
 *   light     data-theme="{Theme}"     data-surface="Surface-Brightest"
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The palettes generated with Light / Medium / Dark shades rather than one. */
const STATE_COLORS = ['info', 'success', 'warning', 'error'];

const DENSITY_MAP = {
  compact: { minHeight: '24px', fontSize: '13px', iconSize: 16, gap: '6px' },
  default: { minHeight: '32px', fontSize: '14px', iconSize: 18, gap: '8px' },
};

/* Animation runs on MOUNT, not on height.
 *
 * A height transition needs the collapsed content in the DOM, and collapsed
 * children must NOT be there: they are reachable by Tab, findable by search,
 * and announced in the item count, none of which a sighted user would expect
 * of a closed branch. So the group unmounts and animates in when it returns. */
const ANIMATION_MAP = {
  none: undefined,
  slide: 'omni-tree-slide 0.25s ease',
  spring: 'omni-tree-slide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const KEYFRAMES = {
  '@keyframes omni-tree-slide': {
    from: { opacity: 0, transform: 'translateY(-4px)' },
    to: { opacity: 1, transform: 'none' },
  },
};

/* ── Walking the tree ──────────────────────────────────────────────────────
 *
 * Every keyboard move is "the next VISIBLE item", which is not the next item
 * in the data — a collapsed branch's children are skipped entirely. Flatten
 * once per render against the current expansion and the arrow keys become
 * index arithmetic instead of a recursive search that has to re-answer "is
 * this one's parent open" at every step. */
function flattenVisible(items, expanded, level = 1, out = []) {
  items.forEach((item, i) => {
    out.push({ item, level, index: i, siblings: items.length });
    if (item.children?.length && expanded.includes(item.id)) {
      flattenVisible(item.children, expanded, level + 1, out);
    }
  });
  return out;
}

/** The id of the item holding this one, or null at the root. */
function parentOf(items, id, parentId = null) {
  for (const item of items) {
    if (item.id === id) return parentId;
    if (item.children?.length) {
      const found = parentOf(item.children, id, item.id);
      if (found !== undefined && found !== null) return found;
      if (found === null && item.children.some((c) => c.id === id)) return item.id;
    }
  }
  return null;
}

/* ── One row ──────────────────────────────────────────────────────────────*/
function TreeNode({
  node, density, expanded, selected, focusedId, multiSelect, checkboxSelection,
  disableSelection, disabledItemsFocusable, collapseIcon, expandIcon, animation,
  onToggle, onSelect, onFocusItem, registerRef,
}) {
  const { item, level, index, siblings } = node;
  const d = DENSITY_MAP[density] || DENSITY_MAP.default;
  const isCompact = density === 'compact';
  const TextComp = isCompact ? Caption : BodySmall;

  const hasChildren = !!item.children?.length;
  const isExpanded = hasChildren && expanded.includes(item.id);
  const isSelected = selected.includes(item.id);
  const disabled = !!item.disabled;
  /* A disabled item is skipped by the arrows unless the tree says otherwise.
     Both readings are legitimate — one keeps focus off dead rows, the other
     keeps the tree navigable by screen reader — which is why MUI X made it a
     prop and why this keeps that prop rather than picking. */
  const focusable = !disabled || disabledItemsFocusable;

  return (
    <Box
      component="li"
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={disableSelection ? undefined : isSelected}
      aria-disabled={disabled || undefined}
      /* Stated, never inferred. Inside role="group" the DOM nesting no longer
         tells a screen reader the depth or the position, so an unstated level
         is announced as level 1 for the whole tree. */
      aria-level={level}
      aria-setsize={siblings}
      aria-posinset={index + 1}
      tabIndex={focusedId === item.id && focusable ? 0 : -1}
      ref={(el) => registerRef(item.id, el)}
      onFocus={(e) => { e.stopPropagation(); onFocusItem(item.id); }}
      sx={{ outline: 'none', listStyle: 'none', ...(item.sx || {}) }}
    >
      <Box
        className="omni-tree-content"
        onClick={(e) => {
          if (disabled) return;
          e.stopPropagation();
          /* One click does both, and the order matters: a parent row is the
             thing you click to open it, and it is also the thing you click to
             select it. Splitting them onto the chevron and the label would
             make the chevron a 16px target for the commonest action here. */
          if (hasChildren) onToggle(e, item.id);
          if (!disableSelection) onSelect(e, item.id);
        }}
        sx={{
          display: 'flex', alignItems: 'center', gap: d.gap,
          minHeight: d.minHeight,
          padding: '0 8px',
          marginLeft: level > 1 ? 0 : 0,
          borderRadius: 'var(--Style-Border-Radius)',
          border: '1px solid transparent',
          color: isSelected ? 'var(--Text)' : 'var(--Quiet)',
          fontWeight: isSelected ? 600 : 400,
          backgroundColor: isSelected ? 'var(--Pressed)' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          transition: 'color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease',
          ...(disabled ? {} : {
            '&:hover': { color: 'var(--Text)', backgroundColor: 'var(--Hover)' },
            '&:active': { color: 'var(--Text)', backgroundColor: 'var(--Pressed)' },
          }),
          'li:focus-visible > &': {
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: '-3px',
          },
        }}
      >
        {/* The twisty. A fixed box even on a leaf, or every leaf's label sits
            8px left of its siblings' and the column stops reading as one. */}
        <Box
          aria-hidden="true"
          sx={{
            width: d.iconSize, height: d.iconSize, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'inherit',
          }}
        >
          {hasChildren && (isExpanded ? collapseIcon : expandIcon)}
        </Box>

        {checkboxSelection && !disableSelection && (
          <Checkbox
            checked={isSelected}
            disabled={disabled}
            size="small"
            /* The row already carries the name and the click. A checkbox that
               announced the label too would say it twice, and one that handled
               its own click would fight the row's. */
            aria-hidden="true"
            tabIndex={-1}
            onChange={() => {}}
          />
        )}

        {item.icon && (
          <Icon size="small" sx={{ color: 'inherit', flexShrink: 0 }}>{item.icon}</Icon>
        )}

        <TextComp style={{
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: 'inherit', fontWeight: 'inherit',
        }}>
          {item.label}
        </TextComp>

        {item.badge && <Box sx={{ flexShrink: 0 }}>{item.badge}</Box>}
      </Box>

      {hasChildren && isExpanded && (
        <Box
          component="ul"
          role="group"
          sx={{
            margin: 0, padding: 0, paddingLeft: '8px', marginLeft: '12px',
            borderLeft: '1px solid var(--Border)',
            listStyle: 'none',
            animation: ANIMATION_MAP[animation],
          }}
        >
          {item.children.map((child, i) => (
            <TreeNode
              key={child.id}
              node={{ item: child, level: level + 1, index: i, siblings: item.children.length }}
              density={density} expanded={expanded} selected={selected}
              focusedId={focusedId} multiSelect={multiSelect}
              checkboxSelection={checkboxSelection} disableSelection={disableSelection}
              disabledItemsFocusable={disabledItemsFocusable}
              collapseIcon={collapseIcon} expandIcon={expandIcon} animation={animation}
              onToggle={onToggle} onSelect={onSelect} onFocusItem={onFocusItem}
              registerRef={registerRef}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OmniTreeView({
  color = 'default',
  variant = 'solid',
  surface,
  density = 'default',
  animation = 'slide',

  selectionStyle,

  items = DEFAULT_ITEMS,

  selectionMode = 'single',
  checkboxSelection = false,
  disableSelection = false,
  disabledItemsFocusable = false,

  defaultExpandedItems,
  expandedItems,
  onExpandedItemsChange,

  selectedItems,
  onSelectedItemsChange,

  onItemExpansionToggle,
  onItemSelectionToggle,

  slots,

  'aria-label': ariaLabel = 'Tree view',
  className = '',
  sx = {},
  ...props
}) {
  const effectiveVariant = selectionStyle || variant;
  const multiSelect = selectionMode === 'multi';

  /* Controlled or not, on each axis independently — the caller may own the
     selection and leave expansion alone, which is the common case for a
     file tree. `undefined` means "not controlled"; an empty array does not. */
  const [internalExpanded, setInternalExpanded] = useState(defaultExpandedItems || []);
  const expandedList = expandedItems !== undefined ? expandedItems : internalExpanded;

  const [internalSelected, setInternalSelected] = useState(
    selectedItems || (multiSelect ? [] : null),
  );
  const effectiveSelected = selectedItems !== undefined ? selectedItems : internalSelected;
  const selectedList = Array.isArray(effectiveSelected)
    ? effectiveSelected
    : effectiveSelected ? [effectiveSelected] : [];

  const visible = useMemo(
    () => flattenVisible(items, expandedList),
    [items, expandedList],
  );

  /* Roving tabindex: the tree is ONE tab stop, and the arrows move within it.
     A tree where every row is tabbable makes a hundred-node file listing a
     hundred presses to get past. */
  const [focusedId, setFocusedId] = useState(null);
  const currentFocus = focusedId ?? visible[0]?.item.id ?? null;
  const refs = useRef({});
  const registerRef = useCallback((id, el) => {
    if (el) refs.current[id] = el; else delete refs.current[id];
  }, []);

  const focusItem = useCallback((id) => {
    setFocusedId(id);
    refs.current[id]?.focus();
  }, []);

  const toggle = useCallback((event, id) => {
    const isOpen = expandedList.includes(id);
    const next = isOpen ? expandedList.filter((x) => x !== id) : [...expandedList, id];
    if (expandedItems === undefined) setInternalExpanded(next);
    onExpandedItemsChange?.(event, next);
    onItemExpansionToggle?.(event, id, !isOpen);
  }, [expandedList, expandedItems, onExpandedItemsChange, onItemExpansionToggle]);

  const select = useCallback((event, id) => {
    const isOn = selectedList.includes(id);
    /* Single selection REPLACES; multi toggles. Expressed here rather than in
       the row so a row never has to know which mode the tree is in. */
    const next = multiSelect
      ? (isOn ? selectedList.filter((x) => x !== id) : [...selectedList, id])
      : [id];
    const value = multiSelect ? next : (next[0] ?? null);
    if (selectedItems === undefined) setInternalSelected(value);
    onSelectedItemsChange?.(event, value);
    onItemSelectionToggle?.(event, id, multiSelect ? !isOn : true);
  }, [selectedList, multiSelect, selectedItems, onSelectedItemsChange, onItemSelectionToggle]);

  const onKeyDown = useCallback((event) => {
    const usable = visible.filter(
      (n) => !n.item.disabled || disabledItemsFocusable,
    );
    const at = usable.findIndex((n) => n.item.id === currentFocus);
    const node = usable[at];
    if (!node) return;
    const { item } = node;
    const hasChildren = !!item.children?.length;
    const isOpen = hasChildren && expandedList.includes(item.id);

    const move = (i) => {
      const target = usable[Math.max(0, Math.min(usable.length - 1, i))];
      if (target) { event.preventDefault(); focusItem(target.item.id); }
    };

    switch (event.key) {
      case 'ArrowDown': move(at + 1); break;
      case 'ArrowUp': move(at - 1); break;
      case 'Home': move(0); break;
      case 'End': move(usable.length - 1); break;
      case 'ArrowRight':
        /* Open, then step in. Two presses to reach the first child rather
           than one, which is the pattern: the first press reveals what is
           there and the second commits to it. */
        if (hasChildren && !isOpen) { event.preventDefault(); toggle(event, item.id); }
        else if (isOpen) move(at + 1);
        break;
      case 'ArrowLeft':
        if (isOpen) { event.preventDefault(); toggle(event, item.id); }
        else {
          const parent = parentOf(items, item.id);
          if (parent) { event.preventDefault(); focusItem(parent); }
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!disableSelection) select(event, item.id);
        else if (hasChildren) toggle(event, item.id);
        break;
      default: break;
    }
  }, [visible, currentFocus, expandedList, items, disabledItemsFocusable,
      disableSelection, focusItem, toggle, select]);

  const colorToken = cap(color);
  /* Solid is the BARE theme for a brand palette and the -Medium shade for a
     state one. Not an inconsistency: the state palettes are generated with
     three shades — Light, Medium, Dark — because a warning has to read as a
     warning on a bright surface and on a dim one, while Primary has the whole
     Surface ladder to do that job. So "solid" means "the full-strength shade",
     which is the bare name where there is only one and -Medium where there
     are three.

     No data-theme at all on `default`: the Theme collection has no Default
     mode to pin, so naming one would bind the tree to a palette that does not
     exist and leave it painting Figma's fallbacks. Inheriting the page is
     both correct and what a default variant means. */
  const dataTheme = effectiveVariant === 'default'
    ? undefined
    : effectiveVariant === 'light'
      ? `${colorToken}-Light`
      : STATE_COLORS.includes(color) ? `${colorToken}-Medium` : colorToken;
  const dataSurface = surface
    || (effectiveVariant === 'light' ? 'Surface-Brightest' : 'Surface-Dim');

  const collapseIcon = slots?.collapseIcon
    ? <slots.collapseIcon />
    : <Icon size="small" sx={{ color: 'inherit', transform: 'rotate(90deg)' }}><ChevronRightIcon /></Icon>;
  const expandIcon = slots?.expandIcon
    ? <slots.expandIcon />
    : <Icon size="small" sx={{ color: 'inherit' }}><ChevronRightIcon /></Icon>;

  return (
    <Box
      data-theme={dataTheme}
      data-surface={dataSurface}
      className={
        'omni-treeview'
        + ' omni-treeview-' + effectiveVariant
        + ' omni-treeview-' + color
        + ' omni-treeview-' + density
        + (className ? ' ' + className : '')
      }
      sx={{
        backgroundColor: 'var(--Background)',
        borderRadius: 'var(--Style-Border-Radius)',
        overflow: 'hidden',
        ...KEYFRAMES,
        ...sx,
      }}
    >
      <Box
        component="ul"
        role="tree"
        aria-label={ariaLabel}
        aria-multiselectable={multiSelect || undefined}
        onKeyDown={onKeyDown}
        sx={{ margin: 0, padding: '8px', listStyle: 'none', fontFamily: 'inherit' }}
        {...props}
      >
        {items.map((item, i) => (
          <TreeNode
            key={item.id}
            node={{ item, level: 1, index: i, siblings: items.length }}
            density={density} expanded={expandedList} selected={selectedList}
            focusedId={currentFocus} multiSelect={multiSelect}
            checkboxSelection={checkboxSelection} disableSelection={disableSelection}
            disabledItemsFocusable={disabledItemsFocusable}
            collapseIcon={collapseIcon} expandIcon={expandIcon} animation={animation}
            onToggle={toggle} onSelect={select} onFocusItem={setFocusedId}
            registerRef={registerRef}
          />
        ))}
      </Box>
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

export const DefaultTreeView = (p) => <OmniTreeView variant="default" {...p} />;
export const SolidTreeView = (p) => <OmniTreeView variant="solid" {...p} />;
export const LightTreeView = (p) => <OmniTreeView variant="light" {...p} />;

export default OmniTreeView;
