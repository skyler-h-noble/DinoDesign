// src/components/ButtonGroup/ButtonGroup.js
import React, { useState } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { tokenSegment } from '../_shadows';

/**
 * ButtonGroup Component
 *
 * ─── VARIANTS ────────────────────────────────────────────────────────────────
 *   outlined  transparent bg, colored border, selected button fills
 *   light     unselected buttons carry data-theme="{Color}" +
 *             data-surface="Surface-Brightest"; selected fills with
 *             var(--Buttons-{Color}-Button)
 *   ghost     no border on container or buttons; selected fills
 *
 * ─── COLORS ──────────────────────────────────────────────────────────────────
 *   default (first / default) | primary | secondary | tertiary | neutral
 *   info | success | warning | error
 *
 * ─── TOKEN CONTRACT ──────────────────────────────────────────────────────────
 *   Container border:          var(--Buttons-{Color}-Border)
 *   Selected bg:               var(--Buttons-{Color}-Button)
 *   Selected text:             var(--Buttons-{Color}-Text)
 *   Selected text:             var(--Buttons-{Color}-Text), at rest and on
 *                              interaction — the engaged segment stays loud
 *   Unselected text:           var(--Buttons-{Color}-Outline-Quiet)
 *   Hover (unselected) bg:     var(--Hover)            — surface scrim
 *   Hover (unselected) text:   var(--Buttons-{Color}-Outline-Text)
 *   Active (unselected) bg:    var(--Pressed)          — surface scrim
 *   Focus ring:                var(--Focus-Visible)
 *
 * ─── SELECTION ───────────────────────────────────────────────────────────────
 *   value / defaultValue / onChange — controlled or uncontrolled
 *   Each child button should carry a `value` prop.
 *   Falls back to index (0, 1, 2…) if no value prop is present.
 *   multiple — any number of segments selected at once; value is an ARRAY and
 *              onChange receives the next array. Clicking a selected segment
 *              deselects it, unless `allowEmpty={false}`.
 *
 * ─── TOGGLE vs CHOICE ────────────────────────────────────────────────────────
 *   `allowEmpty={false}` is what "toggle" means here: the group always has at
 *   least one segment on, so the last one cannot be turned off. Text alignment
 *   is the case — left, centre, right, and the text is aligned somehow
 *   whatever you click, so empty is not a state the thing being controlled can
 *   be in. A filter row is the opposite and keeps the default.
 *
 * ─── SIZES ───────────────────────────────────────────────────────────────────
 *   small | medium (default) | large
 *
 * ─── ORIENTATION ─────────────────────────────────────────────────────────────
 *   horizontal (default) | vertical
 */

/* ButtonGroup groups buttons. It does not select between them.
 *
 * That distinction was lost when ToggleButtonGroup was retired as "ButtonGroup
 * built a second time" — true of the rendering and false of the concept. A
 * ButtonGroup is a row of actions that happen to be joined: Save, Cancel,
 * Delete, none of them "on". A ToggleButtonGroup is a control with a value,
 * where at least one segment is always selected. One is layout, the other is
 * state, and a component set in Figma cannot be converted deterministically
 * while a single React component answers both.
 *
 * The selection props still work here and still will until the next major —
 * silently dropping them would leave a group that renders correctly and never
 * changes, which is the failure this project keeps designing against. */
let warnedJoined = false;
function warnJoined() {
  if (warnedJoined || process.env.NODE_ENV === 'production') return;
  warnedJoined = true;
  console.warn(
    '[OmniDesign] ButtonGroup is separated — a row of actions, spaced — and '
    + 'cannot be joined, so `separated={false}` is ignored. Joining makes the '
    + 'row read as one control with one segment chosen, which is '
    + 'ToggleButtonGroup\'s Style=Default and not a shape Figma\'s ButtonGroup '
    + 'has. It still renders and will be removed in the next major. If the '
    + 'segments are a choice rather than three actions, use '
    + '<ToggleButtonGroup>.',
  );
}

let warnedSelection = false;
function warnSelectionMoved() {
  if (warnedSelection || process.env.NODE_ENV === 'production') return;
  warnedSelection = true;
  console.warn(
    '[OmniDesign] ButtonGroup is a group of buttons — selection moved to '
    + 'ToggleButtonGroup, where at least one segment is always on. '
    + '`value` / `onChange` / `multiple` still work here and will be removed '
    + 'in the next major. Swap <ButtonGroup> for <ToggleButtonGroup>; every '
    + 'other prop is the same.',
  );
}


/* The `light` variant is a SURFACE, not a theme.
 *
 * This was a map to {Color}-Light — nine names, none of which is a theme any
 * more. Every one bound nothing, so the light variant's unselected segments
 * took whatever palette the page was on: a light error group and a light
 * success group rendered identically. Default-Light was never a theme even
 * before the shades went.
 *
 * The palette is just the group's own color now, and the level does the
 * lightening. Nothing to map. */
const LIGHT_SURFACE = 'Surface-Brightest';

/* A segment is a NARROWER thing than a Button, and the design says so.
 
   Figma keeps two segment sets, and neither offers everything Button does:
 
     Button                    text · iconOnly · letterNumber · Avatar
                               solid · outline · ghost
     Button-Group-Segments     text · iconOnly · letterNumber   (no Avatar)
                               outline · ghost                  (no solid)
                               Position: left · center · right
     Separated-Button-Segments outline · ghost, and no Type axis at all
 
   The library builds all three from the same Button, so it can put an avatar in
   a segment, or a solid one, and the design has no drawing for either. Warning
   rather than refusing: the render is still reasonable, and a group that threw
   would be worse than one that renders and complains. */
const warnedSegments = new Set();

function warnSegmentShape(props = {}, separated = false) {
  if (process.env.NODE_ENV === 'production') return;
  const bad = [];
  if (props.avatar || props.contentType === 'avatar') {
    bad.push('an Avatar segment — Button-Group-Segments has only text, iconOnly and letterNumber');
  }
  const v = String(props.variant || '');
  if (v && !/-outline$/.test(v) && v !== 'ghost' && v !== 'text') {
    bad.push(`a solid segment (variant="${v}") — segments are outline or ghost; the GROUP paints the selected one`);
  }
  if (separated && (props.iconOnly || props.letterNumber || props.contentType)) {
    bad.push('a typed SEPARATED segment — Separated-Button-Segments has no Type axis');
  }
  for (const msg of bad) {
    if (warnedSegments.has(msg)) continue;
    warnedSegments.add(msg);
    // eslint-disable-next-line no-console
    console.warn('[ButtonGroup] ' + msg + '.');
  }
}

/* The segment sheet. A segment used to be styled by an sx merged into its
   Button's own style object, which REPLACED the Button's hover and pressed
   rules on an unselected segment. Button now takes its colors from custom
   properties, so a segment re-points those through `style` (see segmentVars)
   and these rules carry the rest: the joined corners and overlap, the
   selected freeze, the no-lift, the focus ring.

   Written against `.omni-btn.omni-seg…` (two classes): this sheet lands ahead
   of Button's in <head>, so it needs the extra weight to win a tie, as the
   merged sx did by coming last. */
const SxBox = lazySxBox('ButtonGroup');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

registerStaticStyles('omni-button-group', [
  '.omni-btn.omni-seg-fill{flex:1 1 0;min-width:0}',
  '.omni-btn.omni-seg-joined{border-radius:var(--_seg-r);position:relative}',
  '.omni-btn.omni-seg-mh{margin-left:calc(-1 * var(--Button-Border-Width))}',
  '.omni-btn.omni-seg-mv{margin-top:calc(-1 * var(--Button-Border-Width))}',
  '.omni-btn.omni-seg-joined:hover,.omni-btn.omni-seg-joined:focus-visible{z-index:1}',
  /* A segment must not LIFT: segments share edges, and one rising breaks the
     shared border and shifts its baseline against its neighbours. */
  '.omni-btn.omni-seg-nolift,.omni-btn.omni-seg-nolift:hover,.omni-btn.omni-seg-nolift:active,.omni-btn.omni-seg-nolift:focus-visible{transform:none !important}',
  /* Selected: the fill and edge frozen across every state, the label held at
     the pair's Text end. --Buttons-{C}-Hover is a lighter tone, so a selected
     segment lightened on hover and read as deselecting. */
  '.omni-btn.omni-seg-sel{background-color:var(--_seg-bg) !important;border-color:var(--_seg-bd) !important;color:var(--_seg-fg) !important}',
  '.omni-btn.omni-seg-un:hover{z-index:1}',
  /* Ghost: an unselected segment draws no border. */
  '.omni-btn.omni-seg-ghostoff,.omni-btn.omni-seg-ghostoff:hover{border:none !important}',
  /* The ring every control wears, 2px out here, following the segment's own
     corner; last, so nothing shadows it. */
  '.omni-btn.omni-seg:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:2px;z-index:2}',
  '.omni-btn.omni-seg-fr:focus-visible{border-radius:var(--_seg-fr)}',
].join('\n'));

export function ButtonGroup({
  variant = 'outlined',    // 'outlined' | 'light' | 'ghost'
  color = 'default',       // 'default' | 'primary' | 'secondary' | …
  size = 'medium',
  disabled = false,
  orientation = 'horizontal',
  /* Figma's STYLE axis: Default (joined) | Separated.
 
     It was inferred from `spacing === 0`, so the choice the design makes
     explicitly was a side effect of a number here. Named `separated` rather
     than `style`, which is the DOM attribute, and rather than `variant`, which
     already carries outlined / light / ghost.
 
     The gap is --Platform-Spacer, which Figma binds and which is platform-aware
     (4px on desktop, 10px on touch) — not a fixed 4. Joined is -2: the segments
     OVERLAP so the shared edge collapses to one border rather than two sitting
     side by side. */
  /* SEPARATED by default, which is what Figma's ButtonGroup is: all four of
     its variants are gap 4, there is no Style axis, and joined does not
     appear on that page at all. Joined belongs to ToggleButtonGroup, whose
     Style=Default overlaps the segments so the shared edge collapses to one
     border — because a toggle group is ONE control, and a row of actions is
     three things that happen to be next to each other.
     Passing false still joins them and warns: a joined row of actions looks
     like a control with nothing selected, which is the confusion the two
     components were split to end. */
  separated = true,
  spacing,
  // fit — the group's WIDTH variant (in Figma, a "Width"/"Fit" variant property):
  //   'hug'   (default) each button sizes to its own content
  //   'fill'  group fills its container; buttons share the width equally
  //   'equal' group HUGS its content but every button matches the WIDEST one
  //           (horizontal group laid out as inline-grid with equal 1fr columns,
  //           whose fr tracks resolve to the widest column's max-content; a
  //           vertical group already equalizes width via alignItems:stretch).
  fit,
  fullWidth = false,    // back-compat alias → fit="fill"
  equalWidth = false,   // back-compat alias → fit="equal"

  // Selection
  //   multiple=false (default) — one segment at a time; `value` is that value.
  //   multiple=true            — any number; `value` is an ARRAY of values, and
  //                              onChange receives the next array. Clicking a
  //                              selected segment deselects it.
  multiple = false,
  /* Can the group end up with NOTHING selected?
     Defaults to true, which is the existing behaviour: a filter row genuinely
     can be cleared, and a multi-select with no way to deselect is a one-way
     door. ToggleButtonGroup passes false, because a toggle group always has
     at least one segment on.
     Only meaningful with `multiple` — single mode has never been able to
     empty, because clicking the selected segment re-selects it. */
  allowEmpty = true,
  /* Set by ToggleButtonGroup so the deprecation warning below does not fire
     on the path that is NOT deprecated. A boolean rather than a check on the
     caller, because there is no way to ask "who rendered me" and guessing
     from props would warn on exactly the usage being recommended. */
  __selectionOwner = false,
  value: controlledValue,
  defaultValue,
  onChange,

  children,
  className = '',
  sx,
  style,
  'aria-label': ariaLabel,
  ...props
}) {
  useStaticStyles('omni-button-group');
  const askedForSelection = controlledValue !== undefined || defaultValue !== undefined
      || onChange !== undefined || multiple;

  if (!__selectionOwner && askedForSelection) {
    warnSelectionMoved();
  }

  /* Whether this group HAS a selection at all, which is a different question
     from who owns it. ToggleButtonGroup always does. A plain ButtonGroup does
     only on the legacy path — the warning above says to move, and until the
     caller does, the old behaviour has to keep working rather than quietly
     turning into a row of unpressable outlines. A plain group with none is a
     row of peers: no pressed state to report, nothing to escalate from. */
  const hasSelection = __selectionOwner || askedForSelection;

  /* A plain ButtonGroup CANNOT be joined, so this corrects rather than warns.
   *
   * It warned and complied, which left the shape reachable: a row of actions
   * with shared edges reads as one control with one of them chosen, which is
   * the exact misreading the split into two components was made to end. A
   * warning that still renders the wrong thing is a note in a console nobody
   * has open, attached to a component that went out looking wrong.
   *
   * Joined is ToggleButtonGroup's Style=Default, and its segments are a
   * separate Figma set because joining is not something a button can express
   * about itself — its corners depend on where it sits in the row.
   *
   * Only when the caller ASKED to join: ToggleButtonGroup joins by default and
   * passes `separated` through, so testing the value alone would fire on the
   * component that is supposed to be joined. */
  if (!__selectionOwner && separated === false) {
    warnJoined();
    separated = true;
  }

  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (multiple ? [] : null),
  );
  const isControlled   = controlledValue !== undefined;
  const selectedValue  = isControlled ? controlledValue : internalValue;

  /* In multiple mode the value is an array. Normalised here so a caller that
     passes a bare value — or nothing — does not crash `.includes`. */
  const selectedList = multiple
    ? (Array.isArray(selectedValue) ? selectedValue : selectedValue == null ? [] : [selectedValue])
    : null;
  const isValueSelected = (v) => multiple ? selectedList.includes(v) : selectedValue === v;

  const isHorizontal = orientation === 'horizontal';
  /* An explicit `spacing` still wins, so existing callers are untouched. */
  const effectiveSpacing = spacing !== undefined
    ? spacing
    : (separated ? 'var(--Platform-Spacer)' : 0);
  const isConnected  = !separated && (effectiveSpacing === 0);
  const isLight      = variant === 'light';
  const isGhost      = variant === 'ghost';

  // Resolve the width variant (fit) from the prop or the back-compat booleans.
  const fitMode = fit ?? (fullWidth ? 'fill' : equalWidth ? 'equal' : 'hug');
  const isFill  = fitMode === 'fill';
  const isEqual = fitMode === 'equal';
  const useGrid = isEqual && isHorizontal;   // equal-width-hug uses an inline-grid

  /* The TOKEN segment, not cap(): `black-white` capitalises to `Black-white`,
     a name nothing defines, so BlackWhiteToggleButtonGroup painted no fill,
     border or label. The design system emits --Buttons-BlackWhite-*, and
     tokenSegment is the one mapping Button already uses for it. */
  const C            = tokenSegment(color);                      // 'Default', 'Primary', 'BlackWhite', …
  const btnBorder    = 'var(--Buttons-' + C + '-Border)';
  const btnBg        = 'var(--Buttons-' + C + '-Button)';
  const btnText      = 'var(--Buttons-' + C + '-Text)';
  /* The UNSELECTED segment's label, which is a button token and not a surface
     one. Figma binds Buttons/Outline-Quiet at rest and Buttons/Outline-Text on
     hover, pressed and focus — across both segment sets, both styles and all
     180 variants. This file used --Quiet and --Text, which are the SURFACE
     roles: the right shape, the wrong table, so an outline segment in a
     success group had exactly the same label as one in an error group. Same
     drift that Button itself carried until the Buttons table gained a
     consumer. */
  // Falls back to the surface's --Outline-Quiet, which published systems emit
  // per scope; the per-palette name exists there only for Default.
  const btnOutlineQuiet = 'var(--Buttons-' + C + '-Outline-Quiet, var(--Outline-Quiet))';
  const btnOutlineText  = 'var(--Buttons-' + C + '-Outline-Text)';
  /* `default` gets no data-theme at all — it INHERITS. Naming the Default
     mode would pin the group to the app's theme and override whatever themed
     section it sits in, which is the bug the Modal had. The other eight name
     their palette, because that is the whole point of asking for one. */
  // Black-white has no Theme mode to name either — it is a Buttons palette,
  // not a theme — so, like default, it inherits.
  const lightTheme   = color === 'default' || color === 'black-white' ? undefined : C;

  const childArray = React.Children.toArray(children).filter(Boolean);
  const count = childArray.length;

  const handleClick = (childValue, childOnClick) => (e) => {
    /* Single mode passes the value; multiple passes the NEXT ARRAY, so a
       controlled caller can set state from it directly without reimplementing
       the toggle. Clicking a selected segment removes it — a multi-select with
       no way to deselect is a one-way door. */
    const next = multiple
      ? (selectedList.includes(childValue)
          ? selectedList.filter(v => v !== childValue)
          : [...selectedList, childValue])
      : childValue;

    /* The LAST one cannot be turned off when the group may not be empty.
       Dropped silently rather than reported: the click is on a segment that
       is already on, so the state the user is asking for is the state they
       already have minus something they cannot remove. Firing onChange with
       an unchanged array would make a controlled caller re-render for nothing
       and look like a bug in their reducer. */
    if (multiple && !allowEmpty && next.length === 0) {
      childOnClick?.(e);
      return;
    }

    if (!isControlled) setInternalValue(next);
    onChange?.(next, e);
    childOnClick?.(e);
  };

  const wrappedChildren = childArray.map((child, index) => {
    if (!React.isValidElement(child)) return child;

    const isFirst    = index === 0;
    const isLast     = index === count - 1;
    const childValue = child.props.value ?? index;
    const isSelected = isValueSelected(childValue);

    /* ── Border radius in connected mode ───────────────────────────────────
       The end caps, and the two orientations do NOT use the same corner.

       Figma binds Button/Button-Radius on the left and right caps of a
       horizontal group, and Button/Vertical-Button-Radius — half of it — on
       the top and bottom caps of a vertical one. The full corner is drawn for
       a control as wide as a button is; on the short edge of a stacked
       segment it reads as a pill cap.

       Both were --Style-Border-Radius here, which is the brand's generic
       corner rather than the button's. The two can differ, so a group could
       round differently from the buttons beside it even horizontally. */
    let borderRadius;
    if (isConnected && count > 1) {
      const r = isHorizontal
        ? 'var(--Button-Radius)'
        : 'var(--Vertical-Button-Radius)';
      if (isHorizontal) {
        borderRadius = (isFirst && isLast) ? r
          : isFirst ? r + ' 0 0 ' + r
          : isLast  ? '0 ' + r + ' ' + r + ' 0'
          : '0';
      } else {
        borderRadius = (isFirst && isLast) ? r
          : isFirst ? r + ' ' + r + ' 0 0'
          : isLast  ? '0 0 ' + r + ' ' + r
          : '0';
      }
    }

    /* The focus ring follows the corner it surrounds. Figma binds
       Vertical-Button-Focus-Radius on the ring of a vertical end cap — the
       corner plus 3, so the gap stays even. A middle segment has square
       corners, so its ring is square too. */
    let focusRadius;
    if (isConnected && count > 1) {
      const fr = isHorizontal
        ? 'var(--Button-Focus-Radius)'
        : 'var(--Vertical-Button-Focus-Radius)';
      if (isHorizontal) {
        focusRadius = (isFirst && isLast) ? fr
          : isFirst ? fr + ' 0 0 ' + fr
          : isLast  ? '0 ' + fr + ' ' + fr + ' 0'
          : '0';
      } else {
        focusRadius = (isFirst && isLast) ? fr
          : isFirst ? fr + ' ' + fr + ' 0 0'
          : isLast  ? '0 0 ' + fr + ' ' + fr
          : '0';
      }
    }

    // ── Per-segment classes and custom properties ─────────────────────────
    const joined = isConnected && count > 1;
    const segClasses = ['omni-seg'];
    const segVars = {};
    /* Fill + horizontal: the SEGMENTS have to grow, not just the container. A
       vertical group's column already stretches them; flex-grow there would
       distribute HEIGHT, which Fit=Fill does not mean. minWidth:0 so a long
       label shrinks rather than forcing the group wider than its container. */
    if (isFill && isHorizontal) segClasses.push('omni-seg-fill');
    if (joined) {
      segClasses.push('omni-seg-joined');
      segVars['--_seg-r'] = borderRadius;
      if (!isFirst) segClasses.push(isHorizontal ? 'omni-seg-mh' : 'omni-seg-mv');
    }

    /* The segment treatment — selected / unselected paint, ghost borders, no
       lift — is a TOGGLE's. A plain group of actions owns no selection, so
       here its buttons stay ordinary Buttons, lift on hover included (they are
       spaced apart, with no shared edge for a lift to break). */
    if (hasSelection || isConnected) segClasses.push('omni-seg-nolift');

    if (hasSelection && isSelected) {
      /* Selection escalates by ONE step: an outlined (or light) group goes
         outline -> SOLID; a ghost group goes ghost -> OUTLINE, which keeps the
         surface fill and marks selection with its border. The label holds
         Text at rest and on interaction: a selected segment is the engaged
         one, and muting it would make the chosen option read quieter than the
         options beside it. The FILL stays frozen across the pointer states and
         the label does not move either; Figma does move the fill (selected/
         Hover binds Buttons/Hover), so this is a deliberate divergence. */
      segClasses.push('omni-seg-sel');
      segVars['--_seg-bg'] = isGhost ? 'var(--Background)' : btnBg;
      segVars['--_seg-bd'] = btnBorder;
      segVars['--_seg-fg'] = isGhost ? btnOutlineText : btnText;
    }

    if (hasSelection && !isSelected) {
      /* The FILLS stay on the surface and the LABELS come from the buttons
         table, which is what Figma does: an unselected segment has no fill of
         its own, so its hover and pressed tints are the surface's scrims — but
         its label belongs to the group's palette, the only thing that tells a
         success group from an error one while nothing is selected. Hover and
         pressed keep the resting shadow: the segment's states replace the
         Button's, they do not add to them. Focus-Visible is one of the three
         active states in Figma, so it takes the interaction label too. */
      segClasses.push('omni-seg-un');
      Object.assign(segVars, {
        '--_b-fg': btnOutlineQuiet,
        '--_b-bg': 'transparent',
        '--_b-bg-h': 'var(--Hover)', '--_b-fg-h': btnOutlineText, '--_b-sh-h': 'var(--_b-sh)',
        '--_b-bg-a': 'var(--Pressed)', '--_b-fg-a': btnOutlineText, '--_b-sh-a': 'var(--_b-sh)',
        '--_b-fg-f': btnOutlineText,
      });
      if (isGhost) segClasses.push('omni-seg-ghostoff');
    }

    /* The focus ring's own corner, on every segment that has one. */
    if (focusRadius) {
      segClasses.push('omni-seg-fr');
      segVars['--_seg-fr'] = focusRadius;
    }

    warnSegmentShape(child.props, separated);

    const clonedButton = React.cloneElement(child, {
      /* One step of escalation from the group's own style:
           outlined / light   unselected `-outline`  ->  selected SOLID
           ghost              unselected `ghost`     ->  selected `-outline`
         An explicit child.variant always wins.

         Escalation only means something where there is something to escalate
         TO. A plain ButtonGroup has no selection, so every segment sits on the
         unselected rung forever — a row of outlines waiting for a solid that
         never arrives. Its segments are peers instead, and peers look alike:
         the group's own style, same for all of them. */
      variant: child.props.variant ?? (
        !hasSelection
          ? (isGhost ? 'ghost' : color)
          : isGhost
            ? (isSelected ? color + '-outline' : 'ghost')
            : isSelected
              ? color
              : color + '-outline'
      ),
      /* SEPARATED segments are whole buttons, and Figma's selected one is
         Button's own selected look — the edge thickened to
         --Button-Selected-Border-Width (2px) with its selected bevel — so the
         Button draws it. Joined segments share edges and keep theirs at 1px. */
      ...(separated && hasSelection && isSelected && child.props.selected === undefined && { selected: true }),
      size:    child.props.size ?? size,
      disabled: child.props.disabled ?? disabled,
      onClick: handleClick(childValue, child.props.onClick),
      /* aria-pressed is a TOGGLE's word. On a plain group of actions,
         aria-pressed="false" tells a screen reader there is an off state to
         turn on — "Delete, not pressed" — which is a promise the button does
         not keep. Omitted entirely unless the group owns a selection. */
      ...(hasSelection ? { 'aria-pressed': isSelected } : {}),
      className: segClasses.join(' ') + (child.props.className ? ' ' + child.props.className : ''),
      style: { ...segVars, ...child.props.style },
    });

    // ── Light variant: wrap unselected buttons in themed Box ──────────────
    if (isLight && hasSelection && !isSelected) {
      return (
        <div
          key={index}
          data-theme={lightTheme}
          data-surface={LIGHT_SURFACE}
          style={{ display: 'contents' }}
        >
          {clonedButton}
        </div>
      );
    }

    return React.cloneElement(clonedButton, { key: index });
  });

  // ── Container — no border on the outer wrapper ──────────────────────────
  const containerBorder = 'none';

  /* A numeric spacing is MUI's 8px unit, as it was when this was an sx. */
  const gap = isConnected ? 0 : (typeof effectiveSpacing === 'number' ? effectiveSpacing * 8 + 'px' : effectiveSpacing);
  const containerStyle = {
    ...(useGrid
      ? {
          // equal-width-hug: inline-grid, equal 1fr columns → every button
          // matches the widest; inline-grid shrink-wraps so the group hugs.
          display:         isFill ? 'grid' : 'inline-grid',
          gridAutoFlow:    'column',
          gridAutoColumns: '1fr',
          justifyItems:    'stretch',
          // Buttons fill the row height: if one wraps to 2 lines, all match.
          alignItems:      'stretch',
          width:           isFill ? '100%' : 'fit-content',
        }
      : {
          display:       isFill ? 'flex' : 'inline-flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          alignItems:    'stretch',
          width:         isFill ? '100%' : 'auto',
        }),
    gap,
    border:       containerBorder,
    borderRadius: 'var(--Style-Border-Radius)',
    // No overflow:hidden — it would clip button borders and focus rings.
    ...style,
  };
  const groupProps = {
    /* role="group" only when the group has a NAME. An unnamed group is
     * announced as "group" and nothing else; named — aria-label="Text
     * formatting" — the boundary carries information. ToggleButtonGroup always
     * passes a name: there the group IS the control. */
    role: ariaLabel ? 'group' : undefined,
    'aria-label': ariaLabel,
    className: 'btn-group btn-group-' + variant + ' btn-group-' + color + ' ' + className,
    style: containerStyle,
    ...props,
  };

  if (hasSx(sx)) return <SxBox sx={sx} {...groupProps}>{wrappedChildren}</SxBox>;
  return <div {...groupProps}>{wrappedChildren}</div>;
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Outlined
export const DefaultOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="default"   {...p} />;
export const PrimaryOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="primary"   {...p} />;
export const SecondaryOutlineButtonGroup = (p) => <ButtonGroup variant="outlined" color="secondary" {...p} />;
export const TertiaryOutlineButtonGroup  = (p) => <ButtonGroup variant="outlined" color="tertiary"  {...p} />;
export const NeutralOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="neutral"   {...p} />;
export const InfoOutlineButtonGroup      = (p) => <ButtonGroup variant="outlined" color="info"      {...p} />;
export const SuccessOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="success"   {...p} />;
export const WarningOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="warning"   {...p} />;
export const ErrorOutlineButtonGroup     = (p) => <ButtonGroup variant="outlined" color="error"     {...p} />;

/* Light. No DefaultLight — "default" means inherit whatever palette is
   around, and a lighter version of inherit names nothing to lighten. A group
   that wants to be paler on the page's own palette asks for the surface, not
   for a color it does not have. */
export const PrimaryLightButtonGroup    = (p) => <ButtonGroup variant="light" color="primary"   {...p} />;
export const SecondaryLightButtonGroup  = (p) => <ButtonGroup variant="light" color="secondary" {...p} />;
export const TertiaryLightButtonGroup   = (p) => <ButtonGroup variant="light" color="tertiary"  {...p} />;
export const NeutralLightButtonGroup    = (p) => <ButtonGroup variant="light" color="neutral"   {...p} />;
export const InfoLightButtonGroup       = (p) => <ButtonGroup variant="light" color="info"      {...p} />;
export const SuccessLightButtonGroup    = (p) => <ButtonGroup variant="light" color="success"   {...p} />;
export const WarningLightButtonGroup    = (p) => <ButtonGroup variant="light" color="warning"   {...p} />;
export const ErrorLightButtonGroup      = (p) => <ButtonGroup variant="light" color="error"     {...p} />;

// Ghost
export const GhostButtonGroup = (p) => <ButtonGroup variant="ghost" {...p} />;

// Backward-compat aliases
export const PrimaryButtonGroup  = (p) => <ButtonGroup variant="outlined" color="primary" {...p} />;
export const OutlineButtonGroup  = (p) => <ButtonGroup variant="outlined" color="default" {...p} />;

export default ButtonGroup;