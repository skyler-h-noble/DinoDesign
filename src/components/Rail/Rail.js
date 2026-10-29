// src/components/Rail/Rail.js
import React, { useState, useCallback } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import MenuIcon from '@omni-design/icons/Menu';
import CloseIcon from '@omni-design/icons/Close';
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
/* Per size, so a small or large rail lines up with a small or large app bar.
   The toggle row and the brand row are App-Bar-Height (64 at medium) — the
   rail's top lines up with the app bar beside it. */
const TOP_ROW = {
  small: 'var(--Sm-App-Bar-Height, 56px)',
  medium: 'var(--App-Bar-Height, 64px)',
  large: 'var(--Lg-App-Bar-Height, 88px)',
};

const SxBox = lazySxBox('Rail');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* ─── Static sheet ───
   Every declaration the parts used to hand emotion per render, as classes
   over the same tokens. The rail's width and a selected item's palette differ
   per instance, so they arrive as custom properties (--_rl-w on the rail,
   --_rl-fill / -on / -edge on the item, declared there so the Buttons tokens
   resolve against the item's own theme and surface). State rules weigh what
   emotion's did — one class plus the pseudo-class. */
const sizeKeys = Object.keys(RAIL_WIDTH);
/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

registerStaticStyles('omni-rail', webkitBox([
  `.omni-rail{display:flex;flex-direction:column;width:var(--_rl-w);min-height:100%;gap:${SLOT_GAP};background-color:var(--Background);`
    + 'font-family:inherit;transition:width 0.25s ease;overflow:hidden;flex-shrink:0}',
  '.omni-rail-x{gap:0}',
  '.omni-rail-toggle{display:flex;justify-content:center;padding-left:0;padding-right:0;flex-shrink:0;align-items:center}',
  '.omni-rail-toggle-open{justify-content:flex-end}',
  ...sizeKeys.map((k) => `.omni-rail-top-${k}{height:${TOP_ROW[k]}}`),
  `.omni-rail-brand{margin-left:${RAIL_PAD_X};margin-right:${RAIL_PAD_X};flex-shrink:0;box-sizing:border-box;align-self:stretch}`,
  '.omni-rail-brand-row{display:flex;align-items:center;justify-content:center}',
  ...sizeKeys.map((k) => `.omni-rail-brand-row-${k}{height:calc(${TOP_ROW[k]} - 1px)}`),
  '.omni-rail-rule{height:1px;background-color:var(--Border-Variant)}',
  '.omni-rail-div{height:1px;width:100%;background-color:var(--Border-Variant)}',
  `.omni-rail-fab{padding:8px ${RAIL_PAD_X};flex-shrink:0;display:flex;justify-content:center}`,
  '.omni-rail-fab-open{justify-content:flex-start}',
  `.omni-rail-list{flex:1;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;align-items:center;gap:${ITEM_GAP};`
    + `padding-left:${RAIL_PAD_X};padding-right:${RAIL_PAD_X};width:100%;box-sizing:border-box}`,
  '.omni-rail-st{width:100%;min-height:24px;display:flex;align-items:center}',
  '.omni-rail-st-closed{width:100%;height:24px;box-sizing:border-box;padding-left:var(--Sizing-2, 16px);padding-right:var(--Sizing-2, 16px);display:flex;align-items:center}',
  '.omni-icon.omni-rail-ic{color:inherit}',
  `.omni-rail-av{display:flex;width:${ICON_SIZE};height:${ICON_SIZE}}`,
  /* The expanded item — Figma's Expandable Nav Rail Item. The stroke is an
     inset ring (Figma's is INSIDE and takes no layout space); unselected it
     strokes the surface's own Background, invisible at rest. */
  `.omni-rail-xi{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:2px;width:100%;min-height:${CIRCLE};`
    + `padding:0;margin:0;box-sizing:border-box;border:none;box-shadow:inset 0 0 0 1px var(--Background);border-radius:${ITEM_RADIUS};`
    + 'background-color:transparent;color:var(--Quiet);cursor:pointer;opacity:1;font-family:inherit;text-align:left;outline:none;'
    + 'transition:background-color 0.15s ease, color 0.15s ease}',
  '.omni-rail-xi-compact{justify-content:center}',
  '.omni-rail-xi-sel{box-shadow:inset 0 0 0 1px var(--_rl-edge);background-color:var(--_rl-fill);color:var(--_rl-on)}',
  '.omni-rail-xi-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  '.omni-rail-xi-hov:hover{background-color:var(--Hover);color:var(--Text)}',
  '.omni-rail-xi-hov:active{background-color:var(--Pressed);color:var(--Text)}',
  '.omni-rail-xi-fv:focus-visible,.omni-rail-xi-fv.Mui-focusVisible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-rail-xi-fvc:focus-visible,.omni-rail-xi-fvc.Mui-focusVisible{color:var(--Text)}',
  `.omni-rail-xic{position:relative;display:flex;align-items:center;justify-content:center;width:${CIRCLE};height:${CIRCLE};flex-shrink:0;border-radius:${ITEM_RADIUS}}`,
  `.omni-rail-xlbl{display:flex;align-items:center;flex:1;min-width:0;padding-top:${ITEM_PAD_Y};padding-bottom:${ITEM_PAD_Y}}`,
  /* The collapsed item. 2px between the icon and its own label — smaller
     than anything on the sizing scale, so it reads as one item next to a
     12px gap between items. The ITEM owns the foreground, so the label and
     the icon inside it both follow the fill. */
  `.omni-rail-it{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:100%;box-sizing:border-box;`
    + `min-width:${ICON_SIZE};min-height:${ICON_SIZE};padding:0;border:none;border-radius:${ITEM_RADIUS};background-color:transparent;`
    + 'box-shadow:none;color:var(--Quiet);cursor:pointer;opacity:1;font-family:inherit;text-align:center;'
    + 'transition:background-color 0.15s ease, color 0.15s ease;outline:none}',
  '.omni-rail-it-sel-c{background-color:var(--_rl-fill);box-shadow:inset 0 0 0 1px var(--_rl-edge);color:var(--_rl-on)}',
  '.omni-rail-it-sel-o{color:var(--Text)}',
  '.omni-rail-it-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  // Contained: the state is on the ITEM.
  '.omni-rail-it-c-hov:hover{background-color:var(--Hover);color:var(--Text)}',
  '.omni-rail-it-c-hov:active{background-color:var(--Pressed);color:var(--Text)}',
  '.omni-rail-it-c-fv:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-rail-it-c-fvc:focus-visible{color:var(--Text)}',
  // Outside: the item is what is hovered, pressed and focused; the circle shows it.
  '.omni-rail-it-o-hov:hover,.omni-rail-it-o-hov:active,.omni-rail-it-o-hov:focus-visible{color:var(--Text)}',
  '.omni-rail-it-o-hov:hover>:first-child{background-color:var(--Hover)}',
  '.omni-rail-it-o-hov:active>:first-child{background-color:var(--Pressed)}',
  '.omni-rail-it-o-fv:focus-visible>:first-child{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  // Rail Button — the circle in Label Outside, a plain row otherwise.
  '.omni-rail-btn{position:relative;display:flex;align-items:center;justify-content:center}',
  `.omni-rail-btn-c{width:100%;height:auto;padding-top:${ITEM_PAD_Y};padding-bottom:${ITEM_PAD_Y};border-radius:${ITEM_RADIUS};background-color:transparent;transition:background-color 0.2s ease}`,
  `.omni-rail-btn-o{width:${CIRCLE};height:${CIRCLE};padding-top:0;padding-bottom:0;border-radius:${CIRCLE};background-color:var(--Background);transition:background-color 0.2s ease}`,
  '.omni-rail-btn-o-sel{background-color:var(--_rl-fill);color:var(--_rl-on);box-shadow:inset 0 0 0 1px var(--_rl-edge)}',
  '.omni-rail-lbl{display:flex;align-items:flex-start;justify-content:center;width:100%}',
].join('\n')));

/** A selected item's palette, as the custom properties the sheet reads. */
const paletteVars = (C) => ({
  '--_rl-fill': 'var(--Buttons-' + C + '-Button)',
  '--_rl-on': 'var(--Buttons-' + C + '-Text)',
  '--_rl-edge': 'var(--Buttons-' + C + '-Border)',
});

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
  useStaticStyles('omni-rail');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const sizeKey = RAIL_WIDTH[size] ? size : 'medium';

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
            <div key={'divider-' + si} aria-hidden="true" className="MuiBox-root omni-rail-div" />
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

  const Root = hasSx(sx) ? SxBox : 'nav';
  return (
    <Root
      {...(Root === 'nav' ? {} : { component: 'nav', sx })}
      role="navigation" aria-label="Navigation rail"
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
        /* Sizing-1 under the Default rail's brand; none under the expandable
           rail's toggle row — Figma butts the slot against it. No edge:
           Figma's rail draws none — its Surface-Dim level is what separates
           it (a 1px border also made it 81px against an 80 design). */
        + ' MuiBox-root omni-rail' + (expandable ? ' omni-rail-x' : '')
      }
      {...props}
      style={{ '--_rl-w': width, ...props.style }}
    >
      {/* Toggle button */}
      {expandable && (
        /* Figma's Expand-Collapse: an App-Bar-Height row; the button centred
           when closed, flush to the trailing edge when open. */
        <div className={'rail-toggle MuiBox-root omni-rail-toggle omni-rail-top-' + sizeKey + (isExpanded ? ' omni-rail-toggle-open' : '')}>
          <Button iconOnly variant="ghost" size="medium"
            onClick={toggleExpand} aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}>
            <Icon size="small" className="omni-rail-ic">
              {isExpanded ? <CloseIcon /> : <MenuIcon />}
            </Icon>
          </Button>
        </div>
      )}

      {brand && !expandable && (
        /* Figma's Top: App-Bar-Height in all, the divider included, inset by
           the slot's Sizing-1 so it spans the items, not the rail. */
        <div className="rail-brand MuiBox-root omni-rail-brand">
          <div className={'MuiBox-root omni-rail-brand-row omni-rail-brand-row-' + sizeKey}>{brand}</div>
          <div aria-hidden="true" className="MuiBox-root omni-rail-rule" />
        </div>
      )}

      {/* FAB action — the library's Fab, as Figma's FAB (6778:17180): the
          large 56px circle on a closed rail, Extended (icon + label pill) on
          an open one. It was a Button on primary-light, a shade that no
          longer exists, sized and rounded by hand. */}
      {fabAction && (
        <div className={'rail-fab MuiBox-root omni-rail-fab' + (isExpanded ? ' omni-rail-fab-open' : '')}>
          <Fab size="large" extended={isExpanded}
            icon={fabAction.icon} label={isExpanded ? fabAction.label : undefined}
            ariaLabel={fabAction.label || 'Action'} onClick={fabAction.onClick} />
        </div>
      )}

      {/* Nav items — the design's "Rail Slot".

          The padding is HORIZONTAL. It used to be py:0.5, which put 4px above
          and below the whole list and nothing at the sides, so the items ran
          to the rail's edges and the dividers with them. In the design the
          slot insets its contents by Sizing-1 left and right and adds nothing
          top or bottom — the 12px item gap is all the vertical rhythm there
          is. The padding comes OUT of the 100% (border-box), not on top of
          it, or every "centred" item lands 8px right of the rail's centre. */}
      <div role="tablist" aria-orientation="vertical" className="MuiBox-root omni-rail-list">
        {renderItems()}
      </div>
    </Root>
  );
}

/* ─── Rail section title — Figma's Drawer Title (8239:5911) ─── */
/** Open: the section's name, Eyebrow in --Quiet, a 24px row. Closed: the same
 *  row holding a 1px Border-Variant rule inset by Sizing-2 either side. */
export function RailSectionTitle({ title, expanded }) {
  useStaticStyles('omni-rail');
  return expanded ? (
    <div className="rail-section-title MuiBox-root omni-rail-st">
      <Eyebrow color="quiet" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</Eyebrow>
    </div>
  ) : (
    <div className="rail-section-title rail-section-title-closed MuiBox-root omni-rail-st-closed" aria-hidden="true">
      <div className="MuiBox-root omni-rail-div" />
    </div>
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
  useStaticStyles('omni-rail');
  const { icon, avatar, label, badge, disabled } = item;
  const C = cap(variant);
  const interactive = !disabled;
  /* Figma's stroke is INSIDE and takes no layout space, so it is an inset
     ring, not a border: a 1px border made the row 34px tall and moved the
     icon and label in by a pixel. */
  return (
    <button
      type="button" role="tab"
      aria-selected={selected} aria-label={label} aria-disabled={disabled || undefined}
      disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={'rail-item rail-item-expanded' + (compact ? ' rail-item-compact' : '') + (selected ? ' rail-item-selected' : '')
        + ' MuiBox-root omni-rail-xi' + (compact ? ' omni-rail-xi-compact' : '') + (selected ? ' omni-rail-xi-sel' : '')
        + (disabled ? ' omni-rail-xi-off' : '')
        + (interactive && !selected ? ' omni-rail-xi-hov omni-rail-xi-fvc' : '')
        + (interactive ? ' omni-rail-xi-fv' : '')}
      style={selected ? paletteVars(C) : undefined}
    >
      <div className="rail-item-icon MuiBox-root omni-rail-xic">
        {withBadge(badge, avatar
          ? <div className="MuiBox-root omni-rail-av">{avatar}</div>
          : <Icon size="custom" fontSize={RAIL_ICON} className="omni-rail-ic">{icon}</Icon>)}
      </div>
      {label && !compact && (
        <div className="MuiBox-root omni-rail-xlbl">
          <MobileNavLabel className="rail-item-label" color="inherit"
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
            {label}
          </MobileNavLabel>
        </div>
      )}
    </button>
  );
}

/* Exported so one item can be placed on its own — a custom rail, or the
   parity page comparing a single Figma item. Rail renders these itself. */
export function RailItem({ item, selected, expanded, compact = false, labelStyle, variant = 'default', onClick }) {
  useStaticStyles('omni-rail');
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

  /* Contained puts the state on the ITEM; outside puts it on the circle. One
     of the two is always transparent, so they are computed together rather
     than each guessing what the other did. (The expanded rail renders
     ExpandedRailItem, so everything here is the collapsed item.) */
  const contained = labelStyle !== 'outside';

  /* WHERE THE LABEL SITS DECIDES ITS COLOUR, which is why this cannot be one
     value. Contained fills the whole item, so the label is ON the fill and
     has to reverse out of it (Buttons/Text). Outside fills only the circle,
     so the label is on the surface and takes --Text itself.

     "Selected wins": hover and pressed paint SURFACE tokens, so they are not
     applied to a selected item at all — they would replace its button fill
     with the surface's hover tint. Focus-visible still applies (a selected
     item has to show where the keyboard is); only its label recolour is
     dropped. The colour goes on the ITEM, so the icon and the label move
     together — Figma colours the glyph the same as the label in every
     state. Figma's ring is 2px, 1px outside the item.

     Outside: the ITEM is what is hovered, pressed and focused (it is the
     button); the circle shows it. A circle never takes focus, so its own
     :focus-visible gave a keyboard user no ring at all. */
  const stateClass = disabled ? ' omni-rail-it-off'
    : contained
      ? (selected ? ' omni-rail-it-c-fv' : ' omni-rail-it-c-hov omni-rail-it-c-fv omni-rail-it-c-fvc')
      : (selected ? ' omni-rail-it-o-fv' : ' omni-rail-it-o-hov omni-rail-it-o-fv');

  return (
    <button
      type="button" role="tab"
      aria-selected={selected} aria-label={label} aria-disabled={disabled || undefined}
      disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={'rail-item' + (selected ? ' rail-item-selected' : '')
        + ' MuiBox-root omni-rail-it' + (selected ? (contained ? ' omni-rail-it-sel-c' : ' omni-rail-it-sel-o') : '') + stateClass}
      style={selected ? paletteVars(C) : undefined}
    >
      {/* Rail Button — the circle in Label Outside, a plain row otherwise.
          Figma's item is the 28px Rail Button (the icon with Sizing-Half
          above and below), 2px, then the label. Outside, the circle rests on
          the surface's own Background; selected, the glyph sits ON the button
          fill, so it takes the fill's pair while the label below stays
          --Text. */}
      <div className={'MuiBox-root omni-rail-btn ' + (contained ? 'omni-rail-btn-c' : 'omni-rail-btn-o' + (selected ? ' omni-rail-btn-o-sel' : ''))}>
        {/* The slot. An avatar goes in it as readily as an icon — an account
            at the foot of a rail is the same item shape with a face in it —
            so an avatar is passed through UNWRAPPED. Wrapping it in <Icon>
            would hand it the icon's color and sizing rules, which is right
            for a glyph and wrong for a picture. */}
        {withBadge(badge, avatar
          ? <div className="MuiBox-root omni-rail-av">{avatar}</div>
          : <Icon size="custom" fontSize={RAIL_ICON} className="omni-rail-ic">{icon}</Icon>)}
      </div>

      {/* Label */}
      {label && (
        <div className="MuiBox-root omni-rail-lbl">
          {/* MobileNavLabel, not Caption at an overridden 11px: the design's
              style is Typography/Labels/Extra-Small and the lib publishes
              exactly that. Caption also rendered a <p> inside a <button>,
              which is not phrasing content.
              `color="inherit"` rather than style={{ color }} — Typography
              strips a `color` from the style object and uses its own prop. */}
          <MobileNavLabel
            className="rail-item-label"
            color="inherit"
            style={{
              textAlign: 'center',
              whiteSpace: 'normal',
              overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {label}
          </MobileNavLabel>
        </div>
      )}
    </button>
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
