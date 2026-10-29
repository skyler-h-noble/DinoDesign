// src/components/TreeView/TreeView.js
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import ChevronRightIcon from '@omni-design/icons/ChevronRight';
import { Icon } from '../Icon/Icon';
import { Body, Caption } from '../Typography';
import { MiniSwatch } from '../MiniSwatch/MiniSwatch';
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
 *   { id, label, icon?, swatch?, badge?, toggle?, divider?, sx?, className?, disabled?, children? }
 *   toggle: false drops the chevron space (Figma's Toggle); divider: false the
 *   line under the row (Figma's Divider). badge is the trailing slot (Badge).
 *
 * ── The row is Figma's Menu Item (8007:25355) ─────────────────────────────
 *   height   Button-Height; padding Menu-Level-{n}-Left-Margin | Sizing-1
 *   gap      Sizing-Half; corner Menu-Item-Radius
 *   twisty / icon   24px; swatch MiniSwatch at Menu-Swatch
 *   label    Body in --Text (Sizing-Half either side)
 *   divider  a 1px --Border-Variant line under the row
 *   selected a 4px --Buttons-Default-Border bar on the leading edge
 *   focus    a 3px ring 1px inside, Menu-Focus-Radius
 *   Indent is the ROW's padding per level (8, 36, 64…), not a nested margin.
 *
 * VARIANT (applies to the whole tree container):
 *   default   no data-theme            data-surface="Surface-Dim"
 *   solid     data-theme="{Theme}"     data-surface="Surface-Dim"
 *   light     data-theme="{Theme}"     data-surface="Surface-Brightest"
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);


const DENSITY_MAP = {
  compact: { minHeight: '24px', fontSize: '13px', iconSize: 16, gap: '6px' },
  default: { minHeight: 'var(--Button-Height, 32px)', iconSize: 24, gap: 'var(--Sizing-Half, 4px)' },
};
/* Figma's .Menu-Levels/Left-Margin: 8, 36, 64 … — a level's indent is the row's
   own leading padding, so a child's twisty sits under its parent's icon. */
const leftMargin = (level) => 'var(--Menu-Level-' + Math.min(level - 1, 6) + '-Left-Margin, ' + (8 + 28 * (level - 1)) + 'px)';

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

const SxBox = lazySxBox('OmniTreeView');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/** A part's root: static classes, plus an MUI box only when given sx. Refs
 *  forward, since a row registers its element for roving focus. */
const Part = React.forwardRef(function Part({ sx, component: Tag = 'div', ...props }, ref) {
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} ref={ref} {...props} />;
  return <Tag ref={ref} {...props} />;
});

/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

/* ─── Static sheet ───
   Every declaration the parts used to hand emotion per render, as classes
   over the same tokens. A row's indent is its level's
   Menu-Level-n-Left-Margin, so it arrives as a custom property (--_tv-ind)
   declared on the row. */
registerStaticStyles('omni-tree-view', webkitBox([
  '@keyframes omni-tree-slide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}',
  /* The panel is a list of menu rows, so it takes the menu panel's corner:
     Dropdown-Frame-Radius (min of Input, Card and 16). */
  '.omni-tv{background-color:var(--Background);border-radius:var(--Dropdown-Frame-Radius, 4px);overflow:hidden}',
  '.omni-tv-tree{margin:0;padding:8px;list-style:none;font-family:inherit}',
  '.omni-tv-item{outline:none;list-style:none}',
  /* The row is Figma's Menu Item. Its divider is a 1px Border-Variant line
     drawn inside, so it adds no height; item.divider === false drops it. */
  `.omni-tv-row{display:flex;align-items:center;gap:${DENSITY_MAP.default.gap};min-height:${DENSITY_MAP.default.minHeight};position:relative;`
    + 'box-sizing:border-box;padding:0 var(--Sizing-1, 8px) 0 var(--_tv-ind);border-radius:var(--Menu-Item-Radius, 0px);color:var(--Text);'
    + 'box-shadow:inset 0 -1px 0 var(--Border-Variant);background-color:transparent;cursor:pointer;opacity:1;transition:background-color 0.15s ease}',
  `.omni-tv-row-compact{gap:${DENSITY_MAP.compact.gap};min-height:${DENSITY_MAP.compact.minHeight};padding:0 8px;border-radius:var(--Style-Border-Radius);box-shadow:none}`,
  '.omni-tv-row-flat{box-shadow:none}',
  '.omni-tv-row-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  /* Selected: Figma's Selected Indicator, a 4px bar on the leading edge in
     the button border colour. */
  '.omni-tv-row-sel::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background-color:var(--Buttons-Default-Border);pointer-events:none}',
  '.omni-tv-row-on:hover{background-color:var(--Hover)}',
  '.omni-tv-row-on:active{background-color:var(--Pressed)}',
  // 3px ring, 1px in from the row's edge (Figma's Focus-Visible frame).
  'li:focus-visible>.omni-tv-row{outline:3px solid var(--Focus-Visible);outline-offset:-4px}',
  `.omni-tv-glyph{width:${DENSITY_MAP.default.iconSize}px;height:${DENSITY_MAP.default.iconSize}px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--Icons-Default, var(--Text))}`,
  /* The glyph size reaches into an <Icon> as well, whose own sheet sets the
     svg to inherit — one more class of weight for that case, since the
     sheets' order in <head> is not fixed. */
  `.omni-tv-glyph .MuiSvgIcon-root,.omni-tv-glyph .omni-icon .MuiSvgIcon-root{font-size:${DENSITY_MAP.default.iconSize}px}`,
  `.omni-tv-glyph-compact{width:${DENSITY_MAP.compact.iconSize}px;height:${DENSITY_MAP.compact.iconSize}px}`,
  `.omni-tv-glyph-compact .MuiSvgIcon-root,.omni-tv-glyph-compact .omni-icon .MuiSvgIcon-root{font-size:${DENSITY_MAP.compact.iconSize}px}`,
  '.omni-tv-label{flex:1;min-width:0;display:flex;padding:0 var(--Sizing-Half, 4px)}',
  '.omni-tv-badge{flex-shrink:0}',
  '.omni-tv-group{margin:0;padding:0;list-style:none}',
  ...Object.entries(ANIMATION_MAP).filter(([, v]) => v).map(([k, v]) => `.omni-tv-anim-${k}{animation:${v}}`),
  '.omni-icon.omni-tv-ic{color:inherit}',
  '.omni-icon.omni-tv-ic-open{transform:rotate(90deg)}',
].join('\n')));

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
  const isCompact = density === 'compact';
  const TextComp = isCompact ? Caption : Body;

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
    <Part
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
      className={(item.className ? item.className + ' ' : '') + 'MuiBox-root omni-tv-item'}
      sx={item.sx}
    >
      {/* Selected: Figma's Selected Indicator, a 4px bar on the leading edge
          in the button border colour. (It was a --Pressed fill with a bold
          label, which hover then imitated.) The divider is a 1px
          Border-Variant line under every row, drawn inside so it adds no
          height; item.divider === false drops it — Figma's per-row Divider
          boolean. */}
      <div
        className={'omni-tree-content MuiBox-root omni-tv-row'
          + (isCompact ? ' omni-tv-row-compact' : '')
          + (!isCompact && item.divider === false ? ' omni-tv-row-flat' : '')
          + (isSelected ? ' omni-tv-row-sel' : '')
          + (disabled ? ' omni-tv-row-off' : ' omni-tv-row-on')}
        style={isCompact ? undefined : { '--_tv-ind': leftMargin(level) }}
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
      >
        {/* The twisty — Figma's Toggle. A fixed box even on a leaf, or every
            leaf's label sits 8px left of its siblings' and the column stops
            reading as one. item.toggle === false (Toggle off) drops it, for a
            flat list with no branches. */}
        {item.toggle !== false && <div
          aria-hidden="true"
          className={'omni-tree-twisty MuiBox-root omni-tv-glyph' + (isCompact ? ' omni-tv-glyph-compact' : '')}
        >
          {hasChildren && (isExpanded ? collapseIcon : expandIcon)}
        </div>}

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
          <div aria-hidden="true" className={'omni-tree-icon MuiBox-root omni-tv-glyph' + (isCompact ? ' omni-tv-glyph-compact' : '')}>{item.icon}</div>
        )}

        {item.swatch && <MiniSwatch color={item.swatch} sx={{ width: 'var(--Menu-Swatch, 24px)', height: 'var(--Menu-Swatch, 24px)' }} />}

        {/* Figma's Menu Slot: the label with Sizing-Half either side. The padding
            is the slot's, so the text itself starts where Figma's does. */}
        <div className="omni-tree-label MuiBox-root omni-tv-label">
          <TextComp style={{
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.label}
          </TextComp>
        </div>

        {item.badge && <div className="MuiBox-root omni-tv-badge">{item.badge}</div>}
      </div>

      {hasChildren && isExpanded && (
        /* Indent only — NO guide line. Figma's TreeView (6911:36658) stacks
           plain Menu Item instances at gap 0 with no strokes anywhere in the
           set; the structure is read from the indent and the chevrons. (There
           was a `borderLeft: 1px solid var(--Border)` here, an invented rule
           in the wrong token.) The indent is each row's own padding
           (Menu-Level-n-Left-Margin), so the group adds none. */
        <ul
          role="group"
          className={'MuiBox-root omni-tv-group' + (ANIMATION_MAP[animation] ? ' omni-tv-anim-' + animation : '')}
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
        </ul>
      )}
    </Part>
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
  useStaticStyles('omni-tree-view');
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
  /* The BARE theme name, always.
   *
   * This briefly emitted `Info-Medium` for a solid state color and
   * `{Color}-Light` for the light variant, because the tests asked for them
   * and they were the only thing in the file that said anything. They were
   * asking for themes that no longer exist: the Theme collection is nine
   * modes — Default plus the eight palettes, bare — and the Light / Medium /
   * Dark shades were removed.
   *
   * A data-theme naming a mode that is not generated binds to nothing and
   * paints the parent's palette, which reads as "this component ignores its
   * color prop" rather than as a missing token. The shipped code had a
   * comment saying exactly this and I overrode it on the strength of failing
   * tests; the comment was right.
   *
   * `light` is therefore a SURFACE, not a theme. That is what the surface
   * ladder is for — same palette, brighter level — and it is why the two
   * travel separately everywhere else in this system.
   */
  const dataTheme = effectiveVariant === 'default' ? undefined : colorToken;
  const dataSurface = surface
    || (effectiveVariant === 'light' ? 'Surface-Brightest' : 'Surface-Dim');

  const collapseIcon = slots?.collapseIcon
    ? <slots.collapseIcon />
    : <Icon size="small" className="omni-tv-ic omni-tv-ic-open"><ChevronRightIcon /></Icon>;
  const expandIcon = slots?.expandIcon
    ? <slots.expandIcon />
    : <Icon size="small" className="omni-tv-ic"><ChevronRightIcon /></Icon>;

  return (
    <Part
      data-theme={dataTheme}
      data-surface={dataSurface}
      className={
        'omni-treeview'
        + ' omni-treeview-' + effectiveVariant
        + ' omni-treeview-' + color
        + ' omni-treeview-' + density
        + (className ? ' ' + className : '')
        + ' MuiBox-root omni-tv'
      }
      sx={sx}
    >
      <ul
        role="tree"
        aria-label={ariaLabel}
        aria-multiselectable={multiSelect || undefined}
        onKeyDown={onKeyDown}
        className="MuiBox-root omni-tv-tree"
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
      </ul>
    </Part>
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
