// src/components/BottomNavigation/BottomNavigation.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MobileNavLabel } from '../Typography';
import { SpeedDial } from '../SpeedDial/SpeedDial';
import { Fab } from '../Fab/Fab';

/**
 * BottomNavigation — the design's Nav-Bar.
 *
 * Read off Omni-Designs / Nav-Bar (7442:31297) and Nav Item (5670:49999)
 * rather than from what a bottom bar usually looks like. The component set
 * has three axes and this has all three:
 *
 *   Style        Fixed | Floating | Floating +Raised FAB | Right FAB
 *                square and edge to edge, or a pill; the two FAB styles are
 *                reached here through `fabAction` + `fabPosition` rather than
 *                as values of `variant`, because the FAB is a thing you pass
 *                rather than a shape the bar takes.
 *   Orientation  Horizontal | Vertical the BAR's direction
 *   Labels       Default | No Labels
 *
 * ── Two different words called "fixed", and one called "orientation" ──────
 * Worth stating because both were already here meaning something else:
 *
 *   `fixed`        POSITIONING — pinned to the bottom of the viewport. What
 *                  this prop has always meant, and it is orthogonal: a
 *                  floating bar is usually pinned too.
 *   `variant`      the design's Style — whether the bar is a square band or a
 *                  rounded pill.
 *
 *   `orientation`  the BAR's direction, which is what the design means: the
 *                  horizontal bar is 80 tall (Other/ToolBar) and the vertical
 *                  one is Rail-Width across, a rail of actions rather than a
 *                  bar.
 *   `labelOrientation` REMOVED. It meant the label's position relative to the
 *                  icon, and the design has only one answer — under it, 4px
 *                  away, in every variant. One word for two axes is how the
 *                  vertical BAR ended up unreachable: asking for
 *                  orientation="vertical" moved the label, not the bar.
 *
 * ── What the selected state paints ───────────────────────────────────────
 * A filled circle behind the icon in --Text, with the icon reversed out of
 * it. Not --Buttons-Primary-Button with a border, which is what this drew:
 * that made the selected item look like a primary BUTTON sitting in the bar,
 * and it tied the bar's accent to the Primary palette rather than to whatever
 * theme the bar is set to.
 *
 * ── The FAB: Floating +Raised FAB and Right FAB ─────────────────────────
 * `fabAction` adds the library's Fab (medium, 48) in one of the design's two
 * FAB styles, chosen by `fabPosition`:
 *
 *   'center'  Floating +Raised FAB — centred on the bar's top edge, inside a
 *             4px halo of the PAGE's Background that cuts it out of the bar,
 *             over a 24px gap in the items
 *   'end'     Right FAB — beside the bar, Sizing-1-and-Half after it
 *
 * Both are pills, so a FAB makes the bar floating. The FAB sits OUTSIDE the
 * tablist: it performs an action rather than switching a panel, so it carries
 * no aria-selected and never becomes the value. (It used to be an outlined
 * ring inside the row, which needed aria-owns to keep the tablist pure; the
 * design dropped that style.)
 *
 * With `actions` it is the library's SPEED DIAL (medium, opening up), as
 * Figma's Nav-Bar now draws it: the + turns to an ×, the actions fan out
 * above, and their labels show while the dial is open — on a phone too.
 */

/* The bar's palette. Nine themes — the -Light / -Medium / -Dark shades are
   gone, and so are White and Black, which were never Theme modes at all. Each
   of those bound nothing and left the bar on its parent's palette, which
   reads as barColor being ignored rather than as a dead name. */
const THEME_MAP = {
  'default':   'Nav-Bar',
  'primary':   'Primary',
  'secondary': 'Secondary',
  'tertiary':  'Tertiary',
  'neutral':   'Neutral',
  'info':      'Info',
  'success':   'Success',
  'warning':   'Warning',
  'error':     'Error',
};

/** Item width, and the icon holder inside it. Both from the design. */
const ITEM_WIDTH = 40;
// Figma binds the holder's min size to Button-Height.
const HOLDER_MIN = 'var(--Button-Height, 32px)';
const HOLDER_PAD = 'var(--Sizing-1, 8px)';
/* 40, not 16. The holder is a CIRCLE — a radius at half its height would be a
   rounded square at any larger size, and the design states a radius past the
   height so it stays circular however the icon grows. */
const HOLDER_RADIUS = '40px';
const ICON_SIZE = 'var(--Icon-Size, 24px)';
/** Icon to label. 4, and not the 2 the rail uses — a bar has room. */
const ITEM_GAP = 'var(--Sizing-Half, 4px)';

/** Bar padding, per the current Nav-Bar set (7442:31297):
 *
 *    fixed      Sizing-1-and-Half down, Sizing-4 across (12 / 32)
 *    floating   Sizing-1-and-Half down, Sizing-3 across (12 / 24) — the
 *               pill, the Raised FAB and the Right FAB bars alike
 *    vertical   Sizing-1-and-Half all round (12)
 *
 *  This read Sizing-2 across and nothing down on a floating bar, and no
 *  padding at all on a fixed one, from an earlier version of the file. */
const FLOATING_PAD = {
  horizontal: { px: 'var(--Sizing-3, 24px)', py: 'var(--Sizing-1-and-Half, 12px)' },
  vertical: { px: 'var(--Sizing-1-and-Half, 12px)', py: 'var(--Sizing-1-and-Half, 12px)' },
};
const NO_PAD = { px: 'var(--Sizing-4, 32px)', py: 'var(--Sizing-1-and-Half, 12px)' };

/** A floating bar is a pill, so its radius is its own height — that is what
 *  makes the ends semicircular at any length.
 *
 *  THE NUMBER MOVED AND THE VARIABLE WAS RENAMED. This was a literal 83px,
 *  taken from `Other/Nav-Bar Height` when that was 83. That variable no
 *  longer exists in the file: it is `Other/ToolBar` now, and it is 80 — with
 *  a new `Other/ToolBarShort` at 64 beside it. Reading the token rather than
 *  restating the number is the point; a literal cannot follow a rename. */
/* Not var(--Nav-Bar-Height) as a fallback: that is the variable's name from
   before Figma renamed it ToolBar, and a design system published before the
   rename still carries its old 83 — which won over the 80 the bar now is. */
const TOOLBAR_HEIGHT = 'var(--ToolBar, 80px)';
/** Other/ToolBarShort: the shorter pill of the two FAB styles. */
const TOOLBAR_SHORT = 'var(--ToolBarShort, 64px)';
const FLOATING_RADIUS = TOOLBAR_HEIGHT;

export function BottomNavigation({
  items = [],
  value: controlledValue,
  defaultValue = 0,
  onChange,
  showLabels = true,
  /** The design's Style: a square band, or a floating pill. A FAB makes the
   *  bar a pill whatever this says — both FAB styles in the design are. */
  variant = 'fixed',
  /** The BAR's direction. */
  orientation = 'horizontal',
  /** The bar's palette. 'default' is the Nav-Bar theme: the color the user
   *  picked for their nav bar in the studio, the same pick the Figma import
   *  sets on every Nav-Bar instance. */
  barColor = 'default',
  /** The level, when the bar should sit on a different one. Unset, the
   *  palette's own (the user's pick) is used as it is. */
  surface,
  /** A FAB with the bar: { icon, label, onClick, actions?, disablePortal? }.
   *  disablePortal keeps a speed dial's labels in place, for scaled previews. */
  fabAction,
  /** The design's two FAB styles:
   *    'center'  Floating +Raised FAB — the FAB sits on the bar's top edge,
   *              centred, over a gap in the items
   *    'end'     Right FAB — the FAB stands beside the bar, to its right */
  fabPosition = 'end',
  /** Pinned to the viewport. Positioning, not appearance — see the note above. */
  fixed = true,
  'aria-label': ariaLabel = 'Bottom navigation',
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const activeIndex = isControlled ? controlledValue : internalValue;

  const handleSelect = useCallback((index) => {
    if (!isControlled) setInternalValue(index);
    onChange?.(index);
  }, [isControlled, onChange]);

  const isVertical = orientation === 'vertical';
  const hasFab = !!fabAction && !isVertical;
  const raised = hasFab && fabPosition === 'center';
  const isFloating = variant === 'floating' || hasFab;
  const dataTheme = THEME_MAP[barColor] || THEME_MAP.default;
  const pad = !isFloating
    ? NO_PAD
    : (isVertical ? FLOATING_PAD.vertical : FLOATING_PAD.horizontal);

  const pinned = fixed && {
    position: 'fixed',
    zIndex: 1100,
    ...(isVertical
      ? { top: '50%', left: 0, transform: 'translateY(-50%)' }
      : { bottom: 0, left: 0, right: 0 }),
  };

  const itemEls = items.map((item, index) => (
    <BottomNavItem
      key={item.key || index}
      icon={item.icon}
      label={item.label}
      selected={index === activeIndex}
      showLabel={showLabels}
      onClick={() => handleSelect(index)}
      ariaLabel={item.label || item.ariaLabel}
      disabled={item.disabled}
    />
  ));
  /* Raised: the items part round a gap the FAB stands over — Figma's
     24px "FAB Frame". After the first half: two and two for four items,
     three and two for five. */
  /* Each side of the gap is its OWN equal half, and the items spread evenly
     within it. Spread across the whole bar, two items went to its far ends
     while the FAB sat in the middle — Home hard left, the + a long way from
     either. Halves keep the FAB on the centre line whatever the count, and
     put each item in the middle of the space it has. */
  let rowEls = itemEls;
  if (raised) {
    const cut = Math.ceil(itemEls.length / 2);
    const half = (key, els) => (
      <Box key={key} role="none" className={'bottom-nav-half bottom-nav-half-' + key}
        sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
        {els}
      </Box>
    );
    rowEls = [
      half('start', itemEls.slice(0, cut)),
      <Box key="fab-gap" role="presentation" className="bottom-nav-fab-gap" sx={{ width: FAB_GAP, flexShrink: 0 }} />,
      half('end', itemEls.slice(cut)),
    ];
  }

  const bar = (
    <Box
      component="nav"
      data-theme={dataTheme}
      data-surface={surface}
      aria-label={ariaLabel}
      className={
        'bottom-nav'
        /* Three axes, three class prefixes, and none of them reuses a name
           that used to mean something else.

           bottom-nav-fixed stays POSITIONING, which is what it has always
           meant here. The design's Style axis gets bottom-nav-style-* rather
           than taking the bare word, and the bar's direction gets
           bottom-nav-bar-* rather than bottom-nav-horizontal — that one used
           to describe the LABEL's position, so quietly repurposing it would
           leave every existing stylesheet targeting the wrong thing and
           looking like it still worked. */
        + ' bottom-nav-' + barColor
        + ' bottom-nav-style-' + (isFloating ? 'floating' : 'fixed')
        + ' bottom-nav-bar-' + orientation
        + (showLabels ? ' bottom-nav-labels' : ' bottom-nav-no-labels')
        + (fixed ? ' bottom-nav-fixed' : '')
        + (hasFab ? '' : (className ? ' ' + className : ''))
      }
      sx={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--Background)',
        /* No top border. The design draws none — the bar's own surface is
           what separates it, and a hairline on a floating pill would trace
           one edge of a shape that has no edges. */
        borderRadius: isFloating ? (hasFab ? TOOLBAR_SHORT : FLOATING_RADIUS) : 0,
        /* A horizontal bar is a SET height with its items centred — ToolBar
           (80), or ToolBarShort (64) for the FAB styles — not its padding
           plus whatever the items measure. The vertical bar hugs. */
        ...(!isVertical && { height: hasFab ? TOOLBAR_SHORT : TOOLBAR_HEIGHT }),
        fontFamily: 'inherit',
        width: isVertical ? 'fit-content' : '100%',
        boxSizing: 'border-box',
        px: pad.px,
        py: pad.py,
        ...(hasFab ? { flex: 1, minWidth: 0 } : pinned),
        ...(hasFab ? {} : sx),
      }}
      {...(hasFab ? {} : props)}
    >
      <Box
        role="tablist"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        sx={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'center',
          /* Spread across the bar when it is horizontal; a fixed gap when it
             is vertical, where there is no width to spread into. Both are the
             design's — space-around was neither, and it left uneven margins
             at the two ends. */
          justifyContent: isVertical ? 'flex-start' : 'space-between',
          gap: isVertical ? '10px' : 0,
          width: isVertical ? 'auto' : '100%',
          maxWidth: isVertical ? undefined : 600,
        }}
      >
        {rowEls}
      </Box>
    </Box>
  );

  if (!hasFab) return bar;

  /* With a FAB the bar sits in a wrapper that carries NO theme, so the FAB's
     halo paints the PAGE's --Background (Figma's 4px ring in Background
     around the FAB) rather than the bar's. The wrapper takes the pinning. */
  return (
    <Box
      className={'bottom-nav-wrap bottom-nav-wrap-' + (raised ? 'raised' : 'right') + (className ? ' ' + className : '')}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: raised ? 0 : FAB_BESIDE_GAP,
        width: '100%',
        boxSizing: 'border-box',
        ...(raised && { pt: RAISE }),
        ...pinned,
        ...sx,
      }}
      {...props}
    >
      {bar}
      <BottomNavFab {...fabAction} raised={raised} />
    </Box>
  );
}

function BottomNavItem({ id, icon, label, selected, showLabel, onClick, ariaLabel, disabled }) {
  return (
    <Box
      component="button" type="button" role="tab" id={id}
      aria-selected={selected} aria-label={ariaLabel} onClick={onClick}
      disabled={disabled} aria-disabled={disabled || undefined}
      className={'bottom-nav-item' + (selected ? ' bottom-nav-item-selected' : '')}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: ITEM_GAP,
        width: ITEM_WIDTH,
        flexShrink: 0,
        border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
        padding: 0, fontFamily: 'inherit', outline: 'none',
        // The ring is drawn on the icon circle (below), not round the item.
        '&:focus-visible': { outline: 'none' },
        '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
        /* Figma's Nav Item Hover: the label goes Quiet → Text; nothing else
           moves. Pressed follows it (the set draws no pressed of its own). */
        '&:hover:not(:disabled) .bottom-nav-label, &:active:not(:disabled) .bottom-nav-label': { color: 'var(--Text) !important' },
      }}
    >
      {/* Icon-Holder — the circle that carries the selected state. */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        /* border-box: Figma's holder is the icon plus its padding (24 + 8 + 8
           = 40), with Button-Height only as a floor. As content-box the padding
           went on top of the 32 minimum and the circle came out 48. */
        boxSizing: 'border-box',
        minWidth: HOLDER_MIN, minHeight: HOLDER_MIN,
        padding: HOLDER_PAD,
        borderRadius: HOLDER_RADIUS,
        /* --Text, and the icon reverses out of it. The pair has to move
           together: a fill and a foreground picked separately is how a
           selected item ends up dark-on-dark the first time someone changes
           the bar's theme. */
        backgroundColor: selected ? 'var(--Text)' : 'transparent',
        /* Figma: the icon is Icons/Icon at rest (full strength — only the
           LABEL is quiet) and Icons/On-Icon on the selected fill. */
        color: selected ? 'var(--Icons-On-Default, var(--Background))' : 'var(--Icons-Default, var(--Text))',
        fontSize: ICON_SIZE,
        transition: 'background-color 0.2s ease, color 0.15s ease',
        '& .MuiSvgIcon-root': { fontSize: 'inherit', color: 'inherit' },
        /* The item had a focus ring and nothing else — no hover, no pressed.
           It read as covered because the FAB menu further down this file has
           both, which is the trap in auditing a directory rather than a
           control.

           These sit on the HOLDER, not the button: the button is a transparent
           column containing the icon circle and the label, so a scrim on it
           would paint a rectangle behind the text as well. Selected keeps its
           --Text fill and moves the scrim on top of it. */
        /* Hover / pressed change the LABEL (see the button above) — Figma
           puts no fill on the circle. Focus is a 2px ring 1px outside the
           circle (Figma's 46px Focus-Visible frame round the 40px holder),
           not a box round the whole item. */
        '.bottom-nav-item:focus-visible &': {
          outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px',
        },
      }}>
        {icon}
      </Box>

      {showLabel && label && (
        /* MobileNavLabel — the design's Labels/Mobile-Nav-Label, which is
           its own style and not Labels/Extra-Small. The two resolve to the
           same six values today, so reading the wrong one looked right; they
           are device-scoped differently in the file and do not stay equal. */
        <MobileNavLabel
          className="bottom-nav-label"
          style={{
            color: selected ? 'var(--Text)' : 'var(--Quiet)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {label}
        </MobileNavLabel>
      )}
    </Box>
  );
}

/** Figma's "FAB Frame": the gap in the items under a raised FAB. */
const FAB_GAP = '24px';
/** Right FAB: bar to FAB. */
const FAB_BESIDE_GAP = 'var(--Sizing-1-and-Half, 12px)';
/** The halo round a raised FAB, in the page's Background. */
const HALO = 4;
/** A raised FAB is centred on the bar's top edge: half its halo'd size. */
const RAISE = (48 + HALO * 2) / 2 + 'px';

/** The FAB of Figma's two FAB styles — the library's own Fab (medium, 48),
 *  so its fill, bevel, states and focus ring are the FAB's, not redrawn.
 *
 *    raised   centred on the bar's top edge inside a 4px halo of the page's
 *             Background, which cuts it out of the bar
 *    beside   (Right FAB) standing after the bar
 *
 *  Given `actions`, it is the library's SpeedDial (medium, opening up) —
 *  Figma's Nav-Bar now holds a SpeedDial where the FAB was, so the + turns
 *  into an × and the actions fan out with their labels, as everywhere else.
 *  It used to open a menu-style panel of its own. */
function BottomNavFab({ icon, label, onClick, actions, disablePortal = false, raised = false }) {
  const isDial = Array.isArray(actions) && actions.length > 0;
  return (
    <Box
      className={'bottom-nav-fab' + (raised ? ' bottom-nav-fab-raised' : '')}
      sx={{
        display: 'flex', flexShrink: 0,
        ...(raised && {
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          p: HALO + 'px', borderRadius: '50%', backgroundColor: 'var(--Background)',
        }),
      }}
    >
      {isDial ? (
        /* Tap only. The bar is phone chrome, where nothing hovers — and with
           hover on, a desktop click landed just after the hover had opened the
           dial, toggled it shut, and the dial looked broken. */
        <SpeedDial size="medium" direction="up" icon={icon} ariaLabel={label || 'Actions'} openOnHover={false} disablePortal={disablePortal}
          actions={actions.map((a, i) => ({ key: a.key || i, icon: a.icon, name: a.label, onClick: () => a.onClick?.() }))} />
      ) : (
        <Fab aria-label={label || 'Action'} onClick={onClick} icon={icon || <AddIcon />} />
      )}
    </Box>
  );
}

export default BottomNavigation;
