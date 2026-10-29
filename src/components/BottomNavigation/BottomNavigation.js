// src/components/BottomNavigation/BottomNavigation.js
import React, { useState, useCallback } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import AddIcon from '@omni-design/icons/Add';
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

const SxBox = lazySxBox('BottomNavigation');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/** A part's root: static classes, plus an MUI box only when given sx. */
function Part({ sx, component: Tag = 'div', ...props }) {
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...props} />;
  return <Tag {...props} />;
}

/** Figma's "FAB Frame": the gap in the items under a raised FAB. */
const FAB_GAP = '24px';
/** Right FAB: bar to FAB. */
const FAB_BESIDE_GAP = 'var(--Sizing-1-and-Half, 12px)';
/** The halo round a raised FAB, in the page's Background. */
const HALO = 4;
/** A raised FAB is centred on the bar's top edge: half its halo'd size. */
const RAISE = (48 + HALO * 2) / 2 + 'px';

/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

/* The static sheet — what each part handed emotion, as classes over the same
   tokens. Pinning is a class too (bottom-nav-fixed's positioning), so a
   caller's sx still wins over it as it did. */
registerStaticStyles('omni-bottom-nav', webkitBox([
  '.omni-bn{display:flex;align-items:center;justify-content:center;background-color:var(--Background);border-radius:0;'
    + 'font-family:inherit;box-sizing:border-box}',
  '.omni-bn-h{flex-direction:row;height:' + TOOLBAR_HEIGHT + ';width:100%}',
  '.omni-bn-h.omni-bn-fab{height:' + TOOLBAR_SHORT + '}',
  '.omni-bn-v{flex-direction:column;width:fit-content}',
  '.omni-bn-float{border-radius:' + FLOATING_RADIUS + '}',
  '.omni-bn-float.omni-bn-fab{border-radius:' + TOOLBAR_SHORT + '}',
  ...Object.entries({ fixed: NO_PAD, h: FLOATING_PAD.horizontal, v: FLOATING_PAD.vertical }).map(([k, p]) =>
    `.omni-bn-pad-${k}{padding-left:${p.px};padding-right:${p.px};padding-top:${p.py};padding-bottom:${p.py}}`),
  '.omni-bn-fab{flex:1;min-width:0}',
  /* Spread across the bar when it is horizontal; a fixed gap when it is
     vertical, where there is no width to spread into. */
  '.omni-bn-list{display:flex;align-items:center}',
  '.omni-bn-list-h{flex-direction:row;justify-content:space-between;gap:0;width:100%;max-width:600px}',
  '.omni-bn-list-v{flex-direction:column;justify-content:flex-start;gap:10px;width:auto}',
  '.omni-bn-half{flex:1;min-width:0;display:flex;align-items:center;justify-content:space-evenly}',
  `.omni-bn-fab-gap{width:${FAB_GAP};flex-shrink:0}`,
  '.omni-bn-wrap{position:relative;display:flex;align-items:center;gap:' + FAB_BESIDE_GAP + ';width:100%;box-sizing:border-box}',
  `.omni-bn-wrap-raised{gap:0;padding-top:${RAISE}}`,
  /* The item: a transparent column. Its focus ring is drawn on the icon
     circle, not round the item. Figma's Nav Item Hover: the label goes Quiet
     → Text; nothing else moves. Pressed follows it. */
  `.omni-bn-item{display:flex;flex-direction:column;align-items:center;gap:${ITEM_GAP};width:${ITEM_WIDTH}px;flex-shrink:0;`
    + 'border:none;background-color:transparent;cursor:pointer;padding:0;font-family:inherit;outline:none}',
  '.omni-bn-item:focus-visible{outline:none}',
  '.omni-bn-item:disabled{opacity:var(--Disabled, 0.38);cursor:not-allowed}',
  '.omni-bn-item:hover:not(:disabled) .bottom-nav-label,.omni-bn-item:active:not(:disabled) .bottom-nav-label{color:var(--Text) !important}',
  /* Icon-Holder — the circle that carries the selected state. border-box:
     Figma's holder is the icon plus its padding (24 + 8 + 8 = 40), with
     Button-Height only as a floor. --Text when selected, and the icon
     reverses out of it (Icons/On-Icon); at rest the icon is Icons/Icon. */
  `.omni-bn-holder{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:${HOLDER_MIN};min-height:${HOLDER_MIN};`
    + `padding:${HOLDER_PAD};border-radius:${HOLDER_RADIUS};background-color:transparent;color:var(--Icons-Default, var(--Text));`
    + `font-size:${ICON_SIZE};transition:background-color 0.2s ease, color 0.15s ease}`,
  '.omni-bn-holder-on{background-color:var(--Text);color:var(--Icons-On-Default, var(--Background))}',
  '.omni-bn-holder .MuiSvgIcon-root{font-size:inherit;color:inherit}',
  '.bottom-nav-item:focus-visible .omni-bn-holder{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-bn-fabslot{display:flex;flex-shrink:0}',
  `.omni-bn-fabslot-raised{position:absolute;top:0;left:50%;transform:translateX(-50%);padding:${HALO}px;border-radius:50%;background-color:var(--Background)}`,
  /* Pinned to the viewport — last, so it wins over the wrapper's relative. */
  '.omni-bn-pin{position:fixed;z-index:1100;bottom:0;left:0;right:0}',
  '.omni-bn-pin-v{position:fixed;z-index:1100;top:50%;left:0;transform:translateY(-50%)}',
].join('\n')));

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
  useStaticStyles('omni-bottom-nav');
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
  const padClass = !isFloating
    ? ' omni-bn-pad-fixed'
    : (isVertical ? ' omni-bn-pad-v' : ' omni-bn-pad-h');

  const pinnedClass = fixed ? (isVertical ? ' omni-bn-pin-v' : ' omni-bn-pin') : '';

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
      <div key={key} role="none" className={'bottom-nav-half bottom-nav-half-' + key + ' MuiBox-root omni-bn-half'}>
        {els}
      </div>
    );
    rowEls = [
      half('start', itemEls.slice(0, cut)),
      <div key="fab-gap" role="presentation" className="bottom-nav-fab-gap MuiBox-root omni-bn-fab-gap" />,
      half('end', itemEls.slice(cut)),
    ];
  }

  /* No top border: the design draws none — the bar's own surface is what
     separates it. A horizontal bar is a SET height with its items centred —
     ToolBar (80), or ToolBarShort (64) for the FAB styles — not its padding
     plus whatever the items measure. The vertical bar hugs. */
  const bar = (
    <Part
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
        + ' MuiBox-root omni-bn ' + (isVertical ? 'omni-bn-v' : 'omni-bn-h')
        + (isFloating ? ' omni-bn-float' : '') + padClass
        + (hasFab ? ' omni-bn-fab' : pinnedClass)
      }
      sx={hasFab ? undefined : sx}
      {...(hasFab ? {} : props)}
    >
      <div
        role="tablist"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        className={'MuiBox-root omni-bn-list ' + (isVertical ? 'omni-bn-list-v' : 'omni-bn-list-h')}
      >
        {rowEls}
      </div>
    </Part>
  );

  if (!hasFab) return bar;

  /* With a FAB the bar sits in a wrapper that carries NO theme, so the FAB's
     halo paints the PAGE's --Background (Figma's 4px ring in Background
     around the FAB) rather than the bar's. The wrapper takes the pinning. */
  return (
    <Part
      className={'bottom-nav-wrap bottom-nav-wrap-' + (raised ? 'raised' : 'right') + (className ? ' ' + className : '')
        + ' MuiBox-root omni-bn-wrap' + (raised ? ' omni-bn-wrap-raised' : '') + pinnedClass}
      sx={sx}
      {...props}
    >
      {bar}
      <BottomNavFab {...fabAction} raised={raised} />
    </Part>
  );
}

function BottomNavItem({ id, icon, label, selected, showLabel, onClick, ariaLabel, disabled }) {
  return (
    <button
      type="button" role="tab" id={id}
      aria-selected={selected} aria-label={ariaLabel} onClick={onClick}
      disabled={disabled} aria-disabled={disabled || undefined}
      className={'bottom-nav-item' + (selected ? ' bottom-nav-item-selected' : '') + ' MuiBox-root omni-bn-item'}
    >
      {/* Icon-Holder — the circle that carries the selected state. The pair
          (fill and foreground) moves together: a fill and a foreground picked
          separately is how a selected item ends up dark-on-dark the first
          time someone changes the bar's theme. Hover / pressed change the
          LABEL — Figma puts no fill on the circle. Focus is a 2px ring 1px
          outside the circle (Figma's 46px Focus-Visible frame round the 40px
          holder), not a box round the whole item. */}
      <div className={'MuiBox-root omni-bn-holder' + (selected ? ' omni-bn-holder-on' : '')}>
        {icon}
      </div>

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
    </button>
  );
}

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
    <div className={'bottom-nav-fab' + (raised ? ' bottom-nav-fab-raised' : '') + ' MuiBox-root omni-bn-fabslot' + (raised ? ' omni-bn-fabslot-raised' : '')}>
      {isDial ? (
        /* Tap only. The bar is phone chrome, where nothing hovers — and with
           hover on, a desktop click landed just after the hover had opened the
           dial, toggled it shut, and the dial looked broken. */
        <SpeedDial size="medium" direction="up" icon={icon} ariaLabel={label || 'Actions'} openOnHover={false} disablePortal={disablePortal}
          actions={actions.map((a, i) => ({ key: a.key || i, icon: a.icon, name: a.label, onClick: () => a.onClick?.() }))} />
      ) : (
        <Fab aria-label={label || 'Action'} onClick={onClick} icon={icon || <AddIcon />} />
      )}
    </div>
  );
}

export default BottomNavigation;
