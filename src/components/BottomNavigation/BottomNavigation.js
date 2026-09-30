// src/components/BottomNavigation/BottomNavigation.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LabelExtraSmall, LabelSmall } from '../Typography';

/**
 * BottomNavigation — the design's Nav-Bar.
 *
 * Read off Omni-Designs / Nav-Bar (7442:31297) and Nav Item (5670:49999)
 * rather than from what a bottom bar usually looks like. The component set
 * has three axes and this has all three:
 *
 *   Style        Fixed | Floating      square and edge to edge, or a pill
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
 *                  horizontal variant is 398x83 and the vertical one is
 *                  64x377, a rail of actions rather than a bar.
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
 * ── The FAB is IN the bar ────────────────────────────────────────────────
 * `fabAction` renders an action among the items, the way Rail's does: a
 * ring the size of an item's icon holder, outlined rather than filled, with
 * the icon in the outline's colour. It takes an item's place in the row —
 * at the end, or in the middle with the items split either side — so it
 * lands where a thumb already goes rather than floating over the content
 * beside the bar. Outlined, because a solid FAB in the bar reads as a
 * selected item: the selected state is a FILLED circle, and two filled
 * circles in one bar say two things are current.
 *
 * It is a button, not a tab. It performs an action rather than switching a
 * panel, so it carries no aria-selected and never becomes the value.
 *
 * With `actions` it is a SPEED DIAL: the ring opens a panel of actions above
 * the bar, each an icon and a label, stacked in the ring's own column so the
 * first action sits directly over the ring and the rest climb from there.
 * Labels flow into the open space — leftward from a ring at the end, rightward
 * from a centred one. The panel is the library's menu shell (the same frame
 * radius, border and surface) rather than the standalone SpeedDial's fan of
 * mini-FABs with tooltip labels: a label that only appears on hover is no
 * label on a phone, which is where a bottom bar is.
 *
 * And a tablist may hold nothing BUT tabs — so with a ring in the row, the row
 * stops being the tablist. An empty tablist beside it OWNS the tabs by id
 * (aria-owns), which gives assistive tech the same list of tabs it had, with
 * the button outside it, while the DOM keeps every control in one flex row
 * where the ring can take an item's place. Without a ring the row is the
 * tablist as it always was.
 */

/* Ids for aria-owns. A counter rather than useId, which needs React 18 and
   this package still peers on 17. */
let nextBarId = 0;

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
const HOLDER_MIN = 32;
const HOLDER_PAD = 'var(--Sizing-1, 8px)';
/* 40, not 16. The holder is a CIRCLE — a radius at half its height would be a
   rounded square at any larger size, and the design states a radius past the
   height so it stays circular however the icon grows. */
const HOLDER_RADIUS = '40px';
const ICON_SIZE = 'var(--Icon-Size, 24px)';
/** Icon to label. 4, and not the 2 the rail uses — a bar has room. */
const ITEM_GAP = 'var(--Sizing-Half, 4px)';

/** Bar padding — FLOATING only.
 *
 *  A floating bar is a pill sitting on the page, and the padding is what
 *  holds its contents off its own rounded ends. A FIXED bar is the edge of
 *  the screen: it has nothing to be held off, and the inset only pushed the
 *  first and last items away from the corners a thumb actually reaches.
 *
 *  So it is not "padding per orientation" — it is padding per STYLE, and the
 *  orientation only decides which way round it goes. */
const FLOATING_PAD = {
  horizontal: { px: 'var(--Button-Height, 32px)', py: '12px' },
  vertical: { px: 'var(--Sizing-1-and-Half, 12px)', py: 'var(--Sizing-2, 16px)' },
};
const NO_PAD = { px: 0, py: 0 };

/** A floating bar is a pill. The design's 83 is the horizontal bar's own
 *  height, which is what makes the ends semicircular at any length. */
const FLOATING_RADIUS = '83px';

export function BottomNavigation({
  items = [],
  value: controlledValue,
  defaultValue = 0,
  onChange,
  showLabels = true,
  /** The design's Style: a square band, or a floating pill. */
  variant = 'fixed',
  /** The BAR's direction. */
  orientation = 'horizontal',
  barColor = 'default',
  /** An action in the bar: { icon, label, onClick }. Rendered as an outlined
   *  ring among the items — see the note above. */
  fabAction,
  /** Where the ring sits: after the last item, or in the middle with the
   *  items split either side of it. */
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
  const isFloating = variant === 'floating';
  const dataTheme = THEME_MAP[barColor] || THEME_MAP.default;
  const pad = !isFloating
    ? NO_PAD
    : (isVertical ? FLOATING_PAD.vertical : FLOATING_PAD.horizontal);

  const idBase = useRef(null);
  if (idBase.current === null) idBase.current = 'bottom-nav-' + (nextBarId++);
  const tabId = (index) => idBase.current + '-tab-' + index;
  /* The tablist is the row itself unless a FAB shares the row — see the
     note above. */
  const ownsTabs = !!fabAction;

  return (
    <Box
      component="nav"
      data-theme={dataTheme}
      data-surface="Surface-Dim"
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
        + (className ? ' ' + className : '')
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
        borderRadius: isFloating ? FLOATING_RADIUS : 0,
        fontFamily: 'inherit',
        width: isVertical ? 'fit-content' : '100%',
        px: pad.px,
        py: pad.py,
        ...(fixed && {
          position: 'fixed',
          zIndex: 1100,
          ...(isVertical
            ? { top: '50%', left: 0, transform: 'translateY(-50%)' }
            : { bottom: 0, left: 0, right: 0 }),
        }),
        ...sx,
      }}
      {...props}
    >
      {ownsTabs && (
        <Box
          role="tablist"
          aria-orientation={isVertical ? 'vertical' : 'horizontal'}
          aria-owns={items.map((_, i) => tabId(i)).join(' ')}
          sx={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        />
      )}
      <Box
        role={ownsTabs ? undefined : 'tablist'}
        aria-orientation={ownsTabs ? undefined : (isVertical ? 'vertical' : 'horizontal')}
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
        {items.map((item, index) => (
          <BottomNavItem
            key={item.key || index}
            id={ownsTabs ? tabId(index) : undefined}
            icon={item.icon}
            label={item.label}
            selected={index === activeIndex}
            showLabel={showLabels}
            onClick={() => handleSelect(index)}
            ariaLabel={item.label || item.ariaLabel}
            disabled={item.disabled}
          />
        )).flatMap((el, index, all) => {
          /* Centred goes after the first half — for four items that is two
             and two; for five, three and two, because a middle that rounds
             down leaves the ring nearer the start of a bar whose selected
             item is usually first. `end` is simply last. */
          if (!fabAction) return [el];
          const at = fabPosition === 'center' ? Math.ceil(all.length / 2) : all.length;
          return index === at - 1
            ? [el, <BottomNavFab key="fab" {...fabAction} showLabel={showLabels} position={fabPosition} />]
            : [el];
        })}
        {fabAction && items.length === 0 && (
          <BottomNavFab key="fab" {...fabAction} showLabel={showLabels} position={fabPosition} />
        )}
      </Box>
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
        '&:focus-visible': {
          outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px',
          borderRadius: '8px',
        },
        '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
      }}
    >
      {/* Icon-Holder — the circle that carries the selected state. */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minWidth: HOLDER_MIN, minHeight: HOLDER_MIN,
        padding: HOLDER_PAD,
        borderRadius: HOLDER_RADIUS,
        /* --Text, and the icon reverses out of it. The pair has to move
           together: a fill and a foreground picked separately is how a
           selected item ends up dark-on-dark the first time someone changes
           the bar's theme. */
        backgroundColor: selected ? 'var(--Text)' : 'transparent',
        color: selected ? 'var(--Background)' : 'var(--Quiet)',
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
        '.bottom-nav-item:hover &': selected
          ? { backgroundColor: 'var(--Text)' }
          : { color: 'var(--Text)', backgroundColor: 'var(--Hover)' },
        '.bottom-nav-item:active &': selected
          ? { backgroundColor: 'var(--Text)' }
          : { color: 'var(--Text)', backgroundColor: 'var(--Pressed)' },
        '.bottom-nav-item:disabled:hover &': { backgroundColor: 'transparent' },
      }}>
        {icon}
      </Box>

      {showLabel && label && (
        /* LabelExtraSmall — the design's Labels/Extra-Small. This was a Box
           with an inline 11px, which matched the size and none of the weight,
           letter-spacing or line height, and would not follow a brand that
           moved its label scale. */
        <LabelExtraSmall
          className="bottom-nav-label"
          style={{
            color: selected ? 'var(--Text)' : 'var(--Quiet)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {label}
        </LabelExtraSmall>
      )}
    </Box>
  );
}

/** The small ring inside a speed-dial row: the FAB's own outline at the
 *  item's holder size, so a row reads as "one of the ring's". */
const DIAL_RING = 32;

/** The action ring. The same column as an item — same width, same holder
 *  size, the same gap to a label below — so it sits on the items' baseline
 *  and takes exactly one item's place. What differs is the holder: an
 *  OUTLINE in the default button's border colour, with the glyph in that
 *  colour too, on no fill.
 *
 *  Given `actions`, it opens a speed dial instead of acting — see the note
 *  at the top. */
function BottomNavFab({ icon, label, onClick, showLabel, actions, position = 'end' }) {
  const isDial = Array.isArray(actions) && actions.length > 0;
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  /* Outside click and Escape close it — the same two exits the standalone
     SpeedDial and the Menu have, so a dial in the bar dismisses the way every
     other floating thing in the system does. */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleClick = (e) => {
    if (isDial) setOpen((o) => !o);
    onClick?.(e);
  };

  const ringSx = (size) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minWidth: size, minHeight: size,
    boxSizing: 'border-box',
    borderRadius: HOLDER_RADIUS,
    /* The outline button's border, which the system holds at 3:1
       against its surface — the ring is a clickable edge and that is the
       non-text floor. The glyph takes the same colour so ring and plus
       read as one control rather than a plus inside a decoration. */
    borderWidth: 'var(--Button-Border-Width, 1px)',
    borderStyle: 'solid',
    borderColor: 'var(--Buttons-Default-Border)',
    color: 'var(--Buttons-Default-Border)',
    backgroundColor: 'transparent',
    '& .MuiSvgIcon-root': { fontSize: 'inherit', color: 'inherit' },
  });

  const atEnd = position !== 'center';

  return (
    <Box ref={rootRef} sx={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
      <Box
        component="button" type="button"
        aria-label={label || 'Action'} onClick={handleClick}
        {...(isDial ? { 'aria-haspopup': 'menu', 'aria-expanded': open } : {})}
        className={'bottom-nav-fab' + (open ? ' bottom-nav-fab-open' : '')}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: ITEM_GAP,
          width: ITEM_WIDTH,
          flexShrink: 0,
          border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
          padding: 0, fontFamily: 'inherit', outline: 'none',
          '&:focus-visible': {
            outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px',
            borderRadius: '8px',
          },
        }}
      >
        <Box sx={{
          ...ringSx(HOLDER_MIN),
          padding: HOLDER_PAD,
          fontSize: ICON_SIZE,
          transition: 'background-color 0.15s ease, transform 0.2s ease',
          /* The plus turns into a cross by turning, not by swapping icons —
             the same move the standalone SpeedDial makes. */
          transform: open ? 'rotate(45deg)' : 'none',
          '.bottom-nav-fab:hover &': { backgroundColor: 'var(--Hover)' },
          '.bottom-nav-fab:active &': { backgroundColor: 'var(--Pressed)' },
        }}>
          {icon || <AddIcon />}
        </Box>

        {/* A label under the ring only when the items carry theirs, or the ring
            sits higher than its neighbours. */}
        {showLabel && label && (
          <LabelExtraSmall
            className="bottom-nav-label"
            style={{
              color: 'var(--Buttons-Default-Border)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {label}
          </LabelExtraSmall>
        )}
      </Box>

      {isDial && open && (
        /* The menu shell: the same frame radius, border and surface as the
           library's Menu, so a dial in the bar is the same shape as every
           other panel in the system. Anchored to the ring's column — its
           rings stack straight up from the FAB — with the labels flowing
           into the open space. */
        <Box
          role="menu"
          aria-label={label || 'Actions'}
          className="bottom-nav-dial"
          data-surface="Surface-Brightest"
          sx={{
            position: 'absolute',
            bottom: 'calc(100% + var(--Sizing-1, 8px))',
            ...(atEnd ? { right: 0 } : { left: 0 }),
            zIndex: 1,
            display: 'flex',
            /* Reverse, so the first action is the one nearest the ring. */
            flexDirection: 'column-reverse',
            padding: 'var(--Sizing-1, 8px)',
            gap: 'var(--Sizing-1, 8px)',
            backgroundColor: 'var(--Background)',
            color: 'var(--Text)',
            border: '1px solid var(--Border)',
            borderRadius: 'var(--Dropdown-Frame-Radius, var(--Input-Radius, var(--Style-Border-Radius, 4px)))',
            boxShadow: 'var(--Effect-Level-3, none)',
            whiteSpace: 'nowrap',
          }}
        >
          {actions.map((a, i) => (
            <Box
              key={a.key || i}
              component="button" type="button" role="menuitem"
              aria-label={a.label}
              className="bottom-nav-dial-item"
              onClick={(e) => { setOpen(false); a.onClick?.(e); }}
              sx={{
                display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1, 8px)',
                /* Ring first from a centred FAB, label first from one at the
                   end — either way the ring lands in the FAB's own column. */
                flexDirection: atEnd ? 'row-reverse' : 'row',
                border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                padding: 0, fontFamily: 'inherit', color: 'inherit', outline: 'none',
                borderRadius: HOLDER_RADIUS,
                '&:hover': { backgroundColor: 'var(--Hover)' },
                '&:active': { backgroundColor: 'var(--Pressed)' },
                '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
                '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
              }}
            >
              {/* The ring column is the FAB column's width, so the small ring
                  centres on the big one. */}
              <Box sx={{ width: ITEM_WIDTH, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <Box sx={{ ...ringSx(DIAL_RING), fontSize: 'var(--Icon-Size-Small, 16px)' }}>
                  {a.icon || <AddIcon />}
                </Box>
              </Box>
              <LabelSmall style={{ color: 'inherit' }}>{a.label}</LabelSmall>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default BottomNavigation;
