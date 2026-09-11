// src/components/Rail/Rail.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { LabelExtraSmall } from '../Typography';

/**
 * Rail (Navigation Rail) Component
 *
 * data-theme="Default", data-surface="Surface-Dim"
 *
 * SELECTED: bg var(--Buttons-Default-Button), text var(--Buttons-Default-Text)
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
 * EXPANDED IS NOT IN THE DESIGN. The Figma page covers the collapsed rail
 * only, so the expanded arrangement below is unchanged and is this file's
 * own — marked so nobody reads it as having been checked against Figma. */
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
const PARTIAL_WIDTH = 240;
const FULL_WIDTH = 320;

/** Gap between items, and between an item and a divider. */
const ITEM_GAP = 'var(--Sizing-1-and-Half, 12px)';
/** The rail's own inset, left and right. */
const RAIL_PAD_X = 'var(--Sizing-1, 8px)';
/** Between the rail's stacked slots. */
const SLOT_GAP = 'var(--Sizing-1, 8px)';
/** The icon, and therefore the avatar that can take its place. */
const ICON_SIZE = 'var(--Icon-Size, 24px)';
/** Item width, and the icon's breathing room inside a contained item. */
const ITEM_WIDTH = 44;
const ITEM_PAD_Y = 'var(--Sizing-Half, 4px)';
/** A contained item's corner. The design draws 8 rather than binding a
 *  variable, so this is the one literal here and it is the design's. */
const ITEM_RADIUS = '8px';
/** Label Outside paints a circle the height of a medium button. */
const CIRCLE = 'var(--Button-Height, 32px)';
/** The expand/collapse toggle's row. This file's own — the design has no
 *  expandable rail, so there is nothing to match it to. */
const TOGGLE_HEIGHT = 56;

export function Rail({
  items = [],
  sections,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  expandable = false,
  expandedWidth = 'partial',
  defaultExpanded = false,
  fabAction,
  /* Which of the two Styles in the design. They are not decoration — they
     decide what the state paints:
       contained  a rounded block around the icon AND the label
       outside    a circle around the icon only, label always plain beneath
     Contained is the default because it is what the Nav Rail component is
     assembled from in the file. */
  labelStyle = 'contained',
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
  /* A token when collapsed, a number when expanded — the expanded widths are
     this file's own and have no variable behind them. Kept as a plain string
     either way so the style below does not have to know which it got. */
  const width = isExpanded
    ? (expandedWidth === 'full' ? FULL_WIDTH : PARTIAL_WIDTH) + 'px'
    : (RAIL_WIDTH[size] || RAIL_WIDTH.medium);

  const renderItems = () => {
    if (sections && sections.length > 0) {
      const elements = [];
      let globalIndex = 0;
      sections.forEach((section, si) => {
        if (si > 0) {
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
            <RailItem key={'item-' + idx} item={item}
              selected={activeIndex === idx} expanded={isExpanded} labelStyle={labelStyle}
              onClick={() => handleSelect(idx)} />
          );
          globalIndex++;
        });
      });
      return elements;
    }
    return items.map((item, i) => (
      <RailItem key={i} item={item}
        selected={activeIndex === i} expanded={isExpanded} labelStyle={labelStyle}
        onClick={() => handleSelect(i)} />
    ));
  };

  return (
    <Box
      component="nav" role="navigation" aria-label="Navigation rail"
      data-theme="Default" data-surface="Surface-Dim"
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
        gap: isExpanded ? 0 : SLOT_GAP,
        backgroundColor: 'var(--Background)',
        borderRight: '1px solid var(--Border)',
        fontFamily: 'inherit',
        transition: 'width 0.25s ease',
        overflow: 'hidden', flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {/* Toggle button */}
      {expandable && (
        <Box sx={{ display: 'flex', justifyContent: isExpanded ? 'flex-start' : 'center', px: isExpanded ? 1.5 : 0, height: TOGGLE_HEIGHT, alignItems: 'center' }}>
          <Button iconOnly variant="ghost" size="small"
            onClick={toggleExpand} aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}>
            <Icon size="small" sx={{ color: 'inherit' }}>
              {isExpanded ? <CloseIcon /> : <MenuIcon />}
            </Icon>
          </Button>
        </Box>
      )}

      {/* FAB action */}
      {fabAction && (
        <Box sx={{ px: isExpanded ? 2 : 1, py: 1, flexShrink: 0 }}>
          <Button
            variant="primary-light"
            size="medium"
            onClick={fabAction.onClick}
            aria-label={fabAction.label || 'Action'}
            startIcon={fabAction.icon ? <Icon size="small" sx={{ color: 'inherit' }}>{fabAction.icon}</Icon> : undefined}
            sx={{
              width: isExpanded ? '100%' : 56,
              borderRadius: isExpanded ? '28px' : 'var(--Style-Border-Radius)',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isExpanded ? fabAction.label : null}
          </Button>
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
          gap: isExpanded ? 0 : ITEM_GAP,
          px: isExpanded ? 0 : RAIL_PAD_X,
          width: '100%',
        }}>
        {renderItems()}
      </Box>
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
 *   Selected       --Button + 1px --Border  label --Text
 *   Focus-Visible  --Focus-Visible outline  label --Text
 *   Disabled       no background, 38%       label --Quiet
 *
 * The selected label was --Buttons-Default-Text here and is --Text in the
 * design. They are different roles: one is the label ON a default button, the
 * other is the surface's own text. The item is not a button with a default
 * fill, so the button role was the wrong one and would flip to the wrong
 * colour on any palette where the two diverge.
 *
 * ── Where each Style paints ───────────────────────────────────────────────
 * Contained wraps the whole 44px item, icon and label together. Outside
 * paints a 32px circle around the icon alone and leaves the label plain under
 * it, always. That is the entire difference, which is why it is one flag
 * rather than two components.
 */
function RailItem({ item, selected, expanded, labelStyle, onClick }) {
  const { icon, avatar, label, badge, disabled } = item;

  /* The design's own words: an item is Selected OR it is one of the pointer
     states, never both. Selected wins, so a selected item does not lose its
     fill to a hover. */
  const stateBg = selected ? 'var(--Button)' : 'transparent';
  const labelColor = selected || expanded ? 'var(--Text)' : 'var(--Quiet)';

  /* Contained puts the state on the ITEM; outside puts it on the circle. One
     of the two is always transparent, so they are computed together rather
     than each guessing what the other did. */
  const contained = labelStyle !== 'outside';
  const onItem = contained && !expanded;

  const stateStyles = disabled ? {} : {
    '&:hover': { backgroundColor: 'var(--Hover)', '& .rail-item-label': { color: 'var(--Text)' } },
    '&:active': { backgroundColor: 'var(--Pressed)', '& .rail-item-label': { color: 'var(--Text)' } },
    '&:focus-visible': {
      outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px',
      '& .rail-item-label': { color: 'var(--Text)' },
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
        width: expanded ? '100%' : ITEM_WIDTH,
        minWidth: expanded ? undefined : ICON_SIZE,
        minHeight: ICON_SIZE,
        px: expanded ? 2.5 : 0,
        py: onItem ? ITEM_PAD_Y : 0,
        border: selected && onItem ? '1px solid var(--Border)' : '1px solid transparent',
        borderRadius: expanded ? 0 : ITEM_RADIUS,
        backgroundColor: onItem || expanded ? stateBg : 'transparent',
        boxShadow: selected && onItem ? 'var(--Shadow-1, none)' : 'none',
        color: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'calc(var(--Disabled, 38) / 100)' : 1,
        fontFamily: 'inherit',
        textAlign: expanded ? 'left' : 'center',
        transition: 'background-color 0.15s ease, color 0.15s ease',
        outline: 'none',
        ...(onItem || expanded ? stateStyles : {}),
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
          backgroundColor: contained ? 'transparent' : stateBg,
          border: !contained && selected ? '1px solid var(--Border)' : undefined,
          transition: 'background-color 0.2s ease',
          ...(contained ? {} : stateStyles),
        }),
      }}>
        {/* The slot. An avatar goes in it as readily as an icon — an account
            at the foot of a rail is the same item shape with a face in it —
            so an avatar is passed through UNWRAPPED. Wrapping it in <Icon>
            would hand it the icon's colour and sizing rules, which is right
            for a glyph and wrong for a picture. */}
        {avatar
          ? <Box sx={{ display: 'flex', width: ICON_SIZE, height: ICON_SIZE }}>{avatar}</Box>
          : <Icon size="small" sx={{ color: 'inherit' }}>{icon}</Icon>}
        {badge && <RailBadge value={badge} />}
      </Box>

      {/* Label */}
      {label && (
        <Box sx={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          width: '100%',
        }}>
          {/* LabelExtraSmall, not Caption at an overridden 11px.
              
              The design's style is Typography/Labels/Extra-Small and the lib
              publishes exactly that — --Label-ExtraSmall-*. Caption with an
              inline fontSize matched the SIZE and nothing else: not the
              weight, not the letter-spacing, not the line height, and none of
              it would follow a brand that moved its label scale.
              
              It also fixes invalid markup. Caption renders a <p>, and a <p>
              inside a <button> is not phrasing content — the browser was
              repairing it silently. */}
          <LabelExtraSmall
            className="rail-item-label"
            style={{
              color: labelColor,
              textAlign: 'center',
              whiteSpace: expanded ? 'nowrap' : 'normal',
              overflow: 'hidden', textOverflow: 'ellipsis',
              ...(expanded ? { flex: 1 } : { maxWidth: '100%' }),
            }}
          >
            {label}
          </LabelExtraSmall>
        </Box>
      )}
    </Box>
  );
}

/* ─── Badge ─── */
function RailBadge({ value }) {
  return (
    <Box sx={{
      position: 'absolute', top: -4, right: -6,
      minWidth: 16, height: 16, borderRadius: '8px',
      backgroundColor: 'var(--Tags-Error-BG)',
      color: 'var(--Tags-Error-Text)',
      fontSize: '10px', fontWeight: 700, px: 0.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
    }}>
      {value}
    </Box>
  );
}

export default Rail;
