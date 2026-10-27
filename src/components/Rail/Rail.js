// src/components/Rail/Rail.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button/Button';
import { Fab } from '../Fab/Fab';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import { MobileNavLabel, Eyebrow } from '../Typography';

/* Figma's Buttons collection names its modes in lower-kebab; the CSS tokens
   are PascalCase, and `black-white` closes up rather than keeping the seam. */
const BUTTON_PALETTE = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary',
  tertiary: 'Tertiary', neutral: 'Neutral', info: 'Info',
  success: 'Success', warning: 'Warning', error: 'Error',
  'black-white': 'BlackWhite',
};
const cap = (v) => BUTTON_PALETTE[v] || 'Default';

/**
 * Rail (Navigation Rail) Component
 *
 * data-theme="Default", data-surface="Surface-Dim"
 *
 * SELECTED: bg var(--Text), icon/label on it var(--Background); label beside it var(--Text)
 * UNSELECTED: text var(--Quiet), hover var(--Text)
 *
 * MODES:
 *   fixed       — always collapsed (icon + label below)
 *   expandable  — toggles between collapsed and expanded
 *
 * Items take the same vertical space in both collapsed and expanded states.
 */

/* ── The collapsed rail's metrics come from the design, not from here ──────
 *
 * Every number below is read off Omni-Designs / Rail (8224:5192, 8224:5230)
 * and, where the design binds a variable, this reads the same variable with
 * the design's own value as the fallback. That is the rule the Tabs metrics
 * already follow: a fallback that is the DESIGN's number means an unbound
 * token renders the intended size rather than an invented one.
 *
 * What changed, and why each was wrong before:
 *
 *   width       72 → Rail-Width (80). The design binds Other/Rail-Width, so
 *               the rail follows the size mode like every other component
 *               metric instead of carrying a constant.
 *   item gap    0 → Sizing-1-and-Half (12). There was no gap at all, which
 *               made the rail one unbroken column of targets.
 *   list pad    py 4 → px Sizing-1 (8). The padding is HORIZONTAL in the
 *               design — it insets the items and the dividers from the
 *               rail's edges — and there is none top or bottom.
 *   item        100% x 56 fixed → 44 wide, hug height. A full-width item is
 *               what forced the selected state to be a pill behind the icon;
 *               at 44 the state can wrap the whole item, which is what the
 *               design does.
 *
 * EXPANDED: the ITEM now follows Figma's Expandable Nav Rail Item (see
 * ExpandedRailItem). The expanded rail's widths and toggle row are still this
 * file's own — the design draws the item, not the expanded rail around it. */
/* Three sizes, one per Component-Size mode.
 *
 * Rail-Width is mode-scoped in Figma — 80 / 72 / 96 across medium / small /
 * large — so a rail that held one number could only ever be the medium one.
 * In CSS a mode is the Sm-/Lg- prefix, which is the same shape Tabs and
 * Button already use, so this is that idiom rather than a new one.
 *
 * The fallbacks are the DESIGN's numbers. An unbound token then renders the
 * intended width instead of an invented one — the same rule the Tabs metrics
 * follow, and the reason a missing variable looks like a design rather than
 * a bug. */
const RAIL_WIDTH = {
  small: 'var(--Sm-Rail-Width, 72px)',
  medium: 'var(--Rail-Width, 80px)',
  large: 'var(--Lg-Rail-Width, 96px)',
};
/* ONE open width, 240 — inside Material's 220–360 expanded rail, and what
   Figma's Open-Expandable rail draws. A product with long labels sets its own
   (expandedWidth={280}); there are no presets. 'partial' / 'full' were two
   presets the standards don't have; both still render (240 / 320) and warn. */
const EXPANDED_WIDTH = 240;
const LEGACY_WIDTH = { partial: 240, full: 320 };
let warnedLegacyWidth = false;
const cssWidth = (w) => (typeof w === 'number' ? w + 'px' : w);

/** Gap between items, and between an item and a divider. */
const ITEM_GAP = 'var(--Sizing-1-and-Half, 12px)';
/** The rail's own inset, left and right. */
const RAIL_PAD_X = 'var(--Sizing-1, 8px)';
/** Between the rail's stacked slots. */
const SLOT_GAP = 'var(--Sizing-1, 8px)';
/** The icon, and therefore the avatar that can take its place. */
const ICON_SIZE = 'var(--Icon-Size, 24px)';
/** The glyph: Figma's rail items place the Icon component in the
 *  Icons & Avatars `in-button` mode, which is Component-Size ›
 *  Button/Button-Icon — 20 at medium. (They used an older 16px font glyph in a
 *  24px frame; the slot keeps ICON_SIZE so the row height does not move.) */
const RAIL_ICON = 'var(--Button-Icon, 20px)';
/** The icon's breathing room inside a contained item. (Items FILL the rail's
 *  slot — 64 in an 80 rail, the full width when open; they were a fixed 44.) */
const ITEM_PAD_Y = 'var(--Sizing-Half, 4px)';
/** A contained item's corner. The design draws 8 rather than binding a
 *  variable, so this is the one literal here and it is the design's. */
const ITEM_RADIUS = '8px';
/** Label Outside paints a circle the height of a medium button. */
const CIRCLE = 'var(--Button-Height, 32px)';
/** The expand/collapse toggle's row. This file's own — the design has no
 *  expandable rail, so there is nothing to match it to. */
/* The toggle row and the brand row are App-Bar-Height (64 at medium) — the
   rail's top lines up with the app bar beside it. */
const TOP_ROW = 'var(--App-Bar-Height, 64px)';

export function Rail({
  items = [],
  sections,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  expandable = false,
  /* The open width: a number (px) or any CSS length. Default 240. */
  expandedWidth = EXPANDED_WIDTH,
  defaultExpanded = false,
  fabAction,
  /* Figma's Top on the Default rail: the brand mark centred in an
     App-Bar-Height row, with a divider under it. Any node — a logo, an
     Avatar, an icon. */
  brand,
  /* Which of the two Styles in the design. They are not decoration — they
     decide what the state paints:
       contained  a rounded block around the icon AND the label
       outside    a circle around the icon only, label always plain beneath
     Contained is the default because it is what the Nav Rail component is
     assembled from in the file. */
  labelStyle = 'contained',
  /* Which palette a SELECTED item paints from.
     In Figma this is not a property on the Rail at all — the selected item's
     fill binds a variable named plainly `Button`, which lives in the Buttons
     collection, and that collection's MODE picks the palette. Nothing on the
     Rail page sets the mode, so the shipped design resolves at `default`.
     CSS has one flat namespace and cannot hold a `Button` that means a
     different color per mode, so the mode becomes a prop and the component
     interpolates the palette into the token name. Same translation Button
     makes for its own `variant`. */
  variant = 'default',
  /* Which Component-Size mode this rail resolves at. A prop rather than
     something inferred from the viewport: the size is a decision about the
     product, not about the window — a dense tool wants the small rail at
     every width — and Figma expresses it the same way, as a mode a designer
     sets rather than a breakpoint. */
  size = 'medium',
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isControlled = controlledValue !== undefined;
  const activeIndex = isControlled ? controlledValue : internalValue;

  const handleSelect = useCallback((index) => {
    if (!isControlled) setInternalValue(index);
    onChange?.(index);
  }, [isControlled, onChange]);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const isExpanded = expandable && expanded;
  if (process.env.NODE_ENV !== 'production' && expandedWidth in LEGACY_WIDTH && !warnedLegacyWidth) {
    warnedLegacyWidth = true;
    // eslint-disable-next-line no-console
    console.warn('[OmniDesign] <Rail expandedWidth="' + expandedWidth + '"> — the presets are retired. '
      + 'The open rail is 240 by default; pass a width (expandedWidth={280}) to change it.');
  }
  /* A token when collapsed, a length when expanded. */
  const width = isExpanded
    ? cssWidth(LEGACY_WIDTH[expandedWidth] ?? expandedWidth)
    : (RAIL_WIDTH[size] || RAIL_WIDTH.medium);

  const renderItems = () => {
    if (sections && sections.length > 0) {
      const elements = [];
      let globalIndex = 0;
      sections.forEach((section, si) => {
        /* A titled section opens with Figma's Drawer Title: the eyebrow when
           the rail is open, a short inset rule when it is closed. It takes
           the place of the plain divider. */
        if (section.title) {
          elements.push(<RailSectionTitle key={'title-' + si} title={section.title} expanded={isExpanded} />);
        } else if (si > 0) {
          /* Full width of the slot, and Border-VARIANT.
             
             Both were wrong. The rule had its own horizontal margin, so it
             stopped short of the items it separates; in the design it spans
             the slot and is inset only by the rail's own padding. And it was
             painted in --Border, which is the 3:1 role for clickable
             outlines — a divider is decorative, so it takes the variant, the
             same rule the rest of the system follows.
             
             No vertical margin either: it sits IN the 12px item gap, so a
             margin would add to it and space the groups further apart than
             the design does. */
          elements.push(
            <Box key={'divider-' + si} aria-hidden="true"
              sx={{ height: '1px', width: '100%', backgroundColor: 'var(--Border-Variant)' }} />
          );
        }
        section.items.forEach((item) => {
          const idx = globalIndex;
          elements.push(
            <RailItem key={'item-' + idx} item={item} variant={variant}
              selected={activeIndex === idx} expanded={isExpanded} compact={expandable && !isExpanded} labelStyle={labelStyle}
              onClick={() => handleSelect(idx)} />
          );
          globalIndex++;
        });
      });
      return elements;
    }
    return items.map((item, i) => (
      <RailItem key={i} item={item} variant={variant}
        selected={activeIndex === i} expanded={isExpanded} compact={expandable && !isExpanded} labelStyle={labelStyle}
        onClick={() => handleSelect(i)} />
    ));
  };

  return (
    <Box
      component="nav" role="navigation" aria-label="Navigation rail"
      /* Surface-Dim, the level Figma pins on the Nav Rail — and NO theme: the
         rail takes the theme it is placed in. It used to pin data-theme
         "Default", which switched a rail inside a Primary zone out of it. */
      data-surface="Surface-Dim"
      /* Two axes, two classes, because they answer different questions and
         the tests were asking the one that was never answered:
           rail-fixed / rail-expandable   what this rail CAN do
           rail-collapsed / rail-expanded what it is doing right now
         Only the second was emitted, so styling "every expandable rail" had
         nothing to hook and the class assertions had been failing since they
         were written. */
      className={
        'rail'
        + (expandable ? ' rail-expandable' : ' rail-fixed')
        + (isExpanded ? ' rail-expanded' : ' rail-collapsed')
        + ' rail-label-' + (labelStyle === 'outside' ? 'outside' : 'contained')
        + ' rail-' + (RAIL_WIDTH[size] ? size : 'medium')
        + ' ' + className
      }
      sx={{
        display: 'flex', flexDirection: 'column',
        width, minHeight: '100%',
        /* Sizing-1 under the Default rail's brand; none under the expandable
           rail's toggle row — Figma butts the slot against it. */
        gap: expandable ? 0 : SLOT_GAP,
        backgroundColor: 'var(--Background)',
        // No edge: Figma's rail draws none — its Surface-Dim level is what
        // separates it (a 1px border also made it 81px against an 80 design).
        fontFamily: 'inherit',
        transition: 'width 0.25s ease',
        overflow: 'hidden', flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {/* Toggle button */}
      {expandable && (
        /* Figma's Expand-Collapse: an App-Bar-Height row; the button centred
           when closed, flush to the trailing edge when open. */
        <Box className="rail-toggle" sx={{ display: 'flex', justifyContent: isExpanded ? 'flex-end' : 'center', px: 0, height: TOP_ROW, flexShrink: 0, alignItems: 'center' }}>
          <Button iconOnly variant="ghost" size="medium"
            onClick={toggleExpand} aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}>
            <Icon size="small" sx={{ color: 'inherit' }}>
              {isExpanded ? <CloseIcon /> : <MenuIcon />}
            </Icon>
          </Button>
        </Box>
      )}

      {brand && !expandable && (
        /* Figma's Top: App-Bar-Height in all, the divider included, inset by
           the slot's Sizing-1 so it spans the items, not the rail. */
        <Box className="rail-brand" sx={{ mx: RAIL_PAD_X, flexShrink: 0, boxSizing: 'border-box', alignSelf: 'stretch' }}>
          <Box sx={{ height: 'calc(' + TOP_ROW + ' - 1px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{brand}</Box>
          <Box aria-hidden="true" sx={{ height: '1px', backgroundColor: 'var(--Border-Variant)' }} />
        </Box>
      )}

      {/* FAB action — the library's Fab, as Figma's FAB (6778:17180): the
          large 56px circle on a closed rail, Extended (icon + label pill) on
          an open one. It was a Button on primary-light, a shade that no
          longer exists, sized and rounded by hand. */}
      {fabAction && (
        <Box className="rail-fab" sx={{ px: RAIL_PAD_X, py: 1, flexShrink: 0, display: 'flex', justifyContent: isExpanded ? 'flex-start' : 'center' }}>
          <Fab size="large" extended={isExpanded}
            icon={fabAction.icon} label={isExpanded ? fabAction.label : undefined}
            ariaLabel={fabAction.label || 'Action'} onClick={fabAction.onClick} />
        </Box>
      )}

      {/* Nav items — the design's "Rail Slot".
          
          The padding is HORIZONTAL. It used to be py:0.5, which put 4px above
          and below the whole list and nothing at the sides, so the items ran
          to the rail's edges and the dividers with them. In the design the
          slot insets its contents by Sizing-1 left and right and adds nothing
          top or bottom — the 12px item gap is all the vertical rhythm there
          is. */}
      <Box role="tablist" aria-orientation="vertical"
        sx={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          // The same slot open or closed: Sizing-1 at the sides, Sizing-1-and-Half between.
          gap: ITEM_GAP,
          px: RAIL_PAD_X,
          width: '100%',
          /* The padding has to come OUT of the 100%, not be added to it.
             Without this the list is the rail's width plus 16px of padding,
             the overflow is clipped on the right, and "centred" lands every
             item 8px right of the rail's centre — wherever the page does not
             happen to load a CSS reset that sets border-box for it. */
          boxSizing: 'border-box',
        }}>
        {renderItems()}
      </Box>
    </Box>
  );
}

/* ─── Rail section title — Figma's Drawer Title (8239:5911) ─── */
/** Open: the section's name, Eyebrow in --Quiet, a 24px row. Closed: the same
 *  row holding a 1px Border-Variant rule inset by Sizing-2 either side. */
export function RailSectionTitle({ title, expanded }) {
  return expanded ? (
    <Box className="rail-section-title" sx={{ width: '100%', minHeight: 24, display: 'flex', alignItems: 'center' }}>
      <Eyebrow color="quiet" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</Eyebrow>
    </Box>
  ) : (
    <Box className="rail-section-title rail-section-title-closed" aria-hidden="true"
      sx={{ width: '100%', height: 24, boxSizing: 'border-box', px: 'var(--Sizing-2, 16px)', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ height: '1px', width: '100%', backgroundColor: 'var(--Border-Variant)' }} />
    </Box>
  );
}

/* ─── Rail Item ─── */
/**
 * One rail item, in whichever of the design's two Styles is in force.
 *
 * ── The state table, read off the file rather than chosen ─────────────────
 *
 *   Default        no background            label --Quiet
 *   Hover          --Hover                  label --Text
 *   Pressed        --Pressed                label --Text
 *   Selected       --Text + 1px --Border   label --Text (--Background on it)
 *   Focus-Visible  --Focus-Visible outline  label --Text
 *   Disabled       no background, 38%       label --Quiet
 *
 * NOT BUTTONS TOKENS. Both the selected fill and the selected label bind a
 * variable called `Text` on Nav Item, and both belong to the SURFACE
 * collection — so does `Quiet` on the default label. There is no Buttons
 * token on that component at all. An item is a mark on the surface, not a
 * button wearing a palette, which is also how BottomNavigation has always
 * drawn it.
 *
 * ── Where each Style paints ───────────────────────────────────────────────
 * Contained wraps the whole 44px item, icon and label together. Outside
 * paints a 32px circle around the icon alone and leaves the label plain under
 * it, always. That is the entire difference, which is why it is one flag
 * rather than two components.
 */
/* ── The expanded item: Figma's Expandable Nav Rail Item (8239:5977) ──────
 *
 * A 32px row with an 8px corner: a Button-Height icon slot (the 24px icon
 * with 4px round it), 2px, then the label with 4px above and below. The
 * collapsed item's metrics above do not carry over — this was this file's
 * own arrangement (20px side padding, a 12px gap, square corners) from before
 * the design drew an expanded rail.
 *
 *   Default    label --Quiet
 *   Hover      --Hover fill, label --Text
 *   Pressed    --Pressed fill, label --Text
 *   Selected   the Buttons palette: Button fill, Border edge, Text label —
 *              unlike the collapsed item, which reverses out of --Text
 *   Focus      2px ring, label --Text
 *   Disabled   38% */
/* compact: the CLOSED expandable rail — the same 32px row, the icon centred
   in the slot's width and no label (Figma's Closed-Expandable). */
function ExpandedRailItem({ item, selected, variant, onClick, compact = false }) {
  const { icon, avatar, label, badge, disabled } = item;
  const C = cap(variant);
  const interactive = !disabled;
  return (
    <Box
      component="button" type="button" role="tab"
      aria-selected={selected} aria-label={label} aria-disabled={disabled || undefined}
      disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={'rail-item rail-item-expanded' + (compact ? ' rail-item-compact' : '') + (selected ? ' rail-item-selected' : '')}
      sx={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: compact ? 'center' : 'flex-start',
        gap: '2px',
        width: '100%',
        minHeight: CIRCLE,
        p: 0, m: 0,
        boxSizing: 'border-box',
        /* Figma's stroke is INSIDE and takes no layout space, so it is an inset
           ring here, not a border: a 1px border made the row 34px tall and
           moved the icon and label in by a pixel. Unselected, Figma strokes the
           surface's own Background — invisible at rest, it frames the hover
           and pressed fills by a hair. */
        border: 'none',
        boxShadow: 'inset 0 0 0 1px ' + (selected ? 'var(--Buttons-' + C + '-Border)' : 'var(--Background)'),
        borderRadius: ITEM_RADIUS,
        backgroundColor: selected ? 'var(--Buttons-' + C + '-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-' + C + '-Text)' : 'var(--Quiet)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        fontFamily: 'inherit', textAlign: 'left',
        outline: 'none',
        transition: 'background-color 0.15s ease, color 0.15s ease',
        ...(interactive && !selected && {
          '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
          '&:active': { backgroundColor: 'var(--Pressed)', color: 'var(--Text)' },
        }),
        ...(interactive && {
          '&:focus-visible, &.Mui-focusVisible': {
            outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px',
            ...(selected ? {} : { color: 'var(--Text)' }),
          },
        }),
      }}
    >
      <Box className="rail-item-icon" sx={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: CIRCLE, height: CIRCLE, flexShrink: 0, borderRadius: ITEM_RADIUS,
      }}>
        {withBadge(badge, avatar
          ? <Box sx={{ display: 'flex', width: ICON_SIZE, height: ICON_SIZE }}>{avatar}</Box>
          : <Icon size="custom" fontSize={RAIL_ICON} sx={{ color: 'inherit' }}>{icon}</Icon>)}
      </Box>
      {label && !compact && (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, py: ITEM_PAD_Y }}>
          <MobileNavLabel className="rail-item-label" color="inherit"
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
            {label}
          </MobileNavLabel>
        </Box>
      )}
    </Box>
  );
}

/* Exported so one item can be placed on its own — a custom rail, or the
   parity page comparing a single Figma item. Rail renders these itself. */
export function RailItem({ item, selected, expanded, compact = false, labelStyle, variant = 'default', onClick }) {
  if (expanded || compact) return <ExpandedRailItem item={item} selected={selected} variant={variant} onClick={onClick} compact={!expanded && compact} />;
  const { icon, avatar, label, badge, disabled } = item;

  /* The design's own words: an item is Selected OR it is one of the pointer
     states, never both. Selected wins, so a selected item does not lose its
     fill to a hover. */

  /* THE BUTTONS TABLE. Figma's Nav Rail Item (8224:5192) binds its Selected
     fill, edge and label to Buttons/Button, Buttons/Border and Buttons/Text —
     the same palette the expanded item uses. This read the SURFACE pair
     (--Text reversed with --Background), carried over from the bottom bar's
     Nav Item, which is a different component that does bind Surface/Text. */
  const C = cap(variant);
  const SELECTED_FILL = 'var(--Buttons-' + C + '-Button)';
  const ON_FILL = 'var(--Buttons-' + C + '-Text)';
  const SELECTED_EDGE = 'var(--Buttons-' + C + '-Border)';
  const stateBg = selected ? SELECTED_FILL : 'transparent';

  /* Contained puts the state on the ITEM; outside puts it on the circle. One
     of the two is always transparent, so they are computed together rather
     than each guessing what the other did. */
  const contained = labelStyle !== 'outside';
  const onItem = contained && !expanded;

  /* WHERE THE LABEL SITS DECIDES ITS COLOUR, which is why this cannot be one
     value. Contained fills the whole item, so the label is ON --Text and has
     to reverse out of it. Outside fills only the circle, so the label is on
     the surface and takes --Text itself — which is what the design shows,
     the caption below the holder in the same token the holder is filled
     with. */
  const labelColor = selected
    ? (onItem ? ON_FILL : 'var(--Text)')
    : (expanded ? 'var(--Text)' : 'var(--Quiet)');

  /* "Selected wins" has to be enforced here, not just stated above.
     Hover and Pressed paint SURFACE tokens, so applying them to a selected
     item replaced its button fill with the surface's hover tint and its
     paired label with the surface's text — the exact thing the rule forbids,
     on every selected item, on every pointer-over.
     It survived because `stateBg` used to resolve to nothing: against a
     selected item that painted no fill, a hover that painted one looked like
     the feature rather than the bug. Fixing the fill is what makes this
     visible, so the two belong in one change.
     Focus-visible is NOT in the exclusion — a selected item still has to show
     where the keyboard is. Only its label recolour is dropped, since the ring
     carries the affordance and the label is already correct. */
  /* The colour goes on the ITEM, so the icon and the label move together —
     Figma colours the glyph the same as the label in every state. (Only the
     label used to brighten, leaving the icon Quiet under the pointer.) */
  const pointerStates = selected ? {} : {
    '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
    '&:active': { backgroundColor: 'var(--Pressed)', color: 'var(--Text)' },
  };
  const stateStyles = disabled ? {} : {
    ...pointerStates,
    // Figma: a 2px ring 1px outside the item (the ring every control wears).
    '&:focus-visible': {
      outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px',
      ...(selected ? {} : { color: 'var(--Text)' }),
    },
  };

  return (
    <Box
      component="button" type="button" role="tab"
      aria-selected={selected} aria-label={label} aria-disabled={disabled || undefined}
      disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={'rail-item' + (selected ? ' rail-item-selected' : '')}
      sx={{
        display: 'flex',
        flexDirection: expanded ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        /* 2px, and it is not a token in the design either — the gap between an
           icon and its own label is smaller than anything on the sizing scale
           goes, which is the point: it has to read as one item next to a 12px
           gap between items. */
        gap: expanded ? 'var(--Sizing-1-and-Half, 12px)' : '2px',
        width: '100%',
        boxSizing: 'border-box',
        minWidth: expanded ? undefined : ICON_SIZE,
        minHeight: ICON_SIZE,
        px: expanded ? 2.5 : 0,
        /* No padding of its own: Figma's item is the 28px Rail Button (the
           icon with Sizing-Half above and below), 2px, then the label — 47 in
           all. It padded the item AND the button, and drew a 1px border, so it
           came out 56.5. The edge is an inset ring (an inside stroke). */
        py: 0,
        border: 'none',
        borderRadius: expanded ? 0 : ITEM_RADIUS,
        backgroundColor: onItem || expanded ? stateBg : 'transparent',
        boxShadow: selected && onItem ? 'inset 0 0 0 1px ' + SELECTED_EDGE : 'none',
        /* The ITEM owns the foreground, so the label and the icon inside it
           both follow the fill without either restating it. */
        color: labelColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        /* The token is a RATIO now, so the divide is gone. It read
           calc(var(--Disabled, 38) / 100) because Figma stores 38 — its UI
           expresses opacity in percent — and every consumer doing that
           arithmetic is one that can forget it: opacity:38 clamps to 1 and
           renders a disabled control at full strength. */
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        fontFamily: 'inherit',
        textAlign: expanded ? 'left' : 'center',
        transition: 'background-color 0.15s ease, color 0.15s ease',
        outline: 'none',
        ...(onItem || expanded ? stateStyles : {}),
        /* Outside: the circle takes the state, but the label beneath it still
           brightens to --Text under the pointer, as Figma's Pressed draws it. */
        /* Outside: the ITEM is what is hovered, pressed and focused (it is the
           button); the circle shows it. The circle used to carry these on its
           own :hover / :focus-visible — and a circle never takes focus, so a
           keyboard user got no ring at all. Icon and label go --Text. */
        ...(!onItem && !expanded && !disabled && {
          ...(!selected && {
            '&:hover, &:active, &:focus-visible': { color: 'var(--Text)' },
            '&:hover > :first-child': { backgroundColor: 'var(--Hover)' },
            '&:active > :first-child': { backgroundColor: 'var(--Pressed)' },
          }),
          '&:focus-visible > :first-child': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
        }),
      }}
    >
      {/* Rail Button — the circle in Label Outside, a plain row otherwise. */}
      <Box sx={{
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        ...(expanded ? { flexShrink: 0 } : {
          width: contained ? '100%' : CIRCLE,
          height: contained ? 'auto' : CIRCLE,
          py: contained ? ITEM_PAD_Y : 0,
          borderRadius: contained ? ITEM_RADIUS : CIRCLE,
          // Outside: the circle rests on the surface's own Background (Figma).
          backgroundColor: contained ? 'transparent' : (selected ? stateBg : 'var(--Background)'),
          /* Selected, the glyph sits ON the button fill, so it takes the fill's
             pair (Buttons/Text) while the label below stays --Text. */
          ...(!contained && selected && { color: ON_FILL }),
          boxShadow: !contained && selected ? 'inset 0 0 0 1px ' + SELECTED_EDGE : undefined,
          transition: 'background-color 0.2s ease',
          // (Outside's states are driven from the item — see above.)
        }),
      }}>
        {/* The slot. An avatar goes in it as readily as an icon — an account
            at the foot of a rail is the same item shape with a face in it —
            so an avatar is passed through UNWRAPPED. Wrapping it in <Icon>
            would hand it the icon's color and sizing rules, which is right
            for a glyph and wrong for a picture. */}
        {withBadge(badge, avatar
          ? <Box sx={{ display: 'flex', width: ICON_SIZE, height: ICON_SIZE }}>{avatar}</Box>
          : <Icon size="custom" fontSize={RAIL_ICON} sx={{ color: 'inherit' }}>{icon}</Icon>)}
      </Box>

      {/* Label */}
      {label && (
        <Box sx={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          width: '100%',
        }}>
          {/* MobileNavLabel, not Caption at an overridden 11px.
              
              The design's style is Typography/Labels/Extra-Small and the lib
              publishes exactly that — --Label-ExtraSmall-*. Caption with an
              inline fontSize matched the SIZE and nothing else: not the
              weight, not the letter-spacing, not the line height, and none of
              it would follow a brand that moved its label scale.
              
              It also fixes invalid markup. Caption renders a <p>, and a <p>
              inside a <button> is not phrasing content — the browser was
              repairing it silently. */}
          <MobileNavLabel
            className="rail-item-label"
            /* `color="inherit"` rather than style={{ color }} — Typography
               strips a `color` from the style object and uses its own prop,
               so the inline form silently rendered --Text on every selected
               item while the rest of the style object applied normally. */
            color="inherit"
            style={{
              textAlign: 'center',
              whiteSpace: expanded ? 'nowrap' : 'normal',
              overflow: 'hidden', textOverflow: 'ellipsis',
              ...(expanded ? { flex: 1 } : { maxWidth: '100%' }),
            }}
          >
            {label}
          </MobileNavLabel>
        </Box>
      )}
    </Box>
  );
}

/* ─── Badge ─── */
/* Figma's Badge switch on a rail item: the library's Badge (Badge Counter,
   Error) on the icon's top-right corner, as Button draws its badge. It was a
   hand-drawn 10px pill on the Tags colors. */
function withBadge(badge, glyph) {
  if (badge === undefined || badge === null || badge === false) return glyph;
  return <Badge badgeContent={badge === true ? undefined : badge} dot={badge === true} variant="error">{glyph}</Badge>;
}

export default Rail;
