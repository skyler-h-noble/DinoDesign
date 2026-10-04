// src/components/ButtonGroup/ButtonGroup.js
import React, { useState } from 'react';
import { Box } from '@mui/material';

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
 *              deselects it.
 *
 * ─── SIZES ───────────────────────────────────────────────────────────────────
 *   small | medium (default) | large
 *
 * ─── ORIENTATION ─────────────────────────────────────────────────────────────
 *   horizontal (default) | vertical
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
  separated = false,
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
  value: controlledValue,
  defaultValue,
  onChange,

  children,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
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

  const C            = cap(color);                               // 'Default', 'Primary', …
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
  const btnOutlineQuiet = 'var(--Buttons-' + C + '-Outline-Quiet)';
  const btnOutlineText  = 'var(--Buttons-' + C + '-Outline-Text)';
  /* `default` gets no data-theme at all — it INHERITS. Naming the Default
     mode would pin the group to the app's theme and override whatever themed
     section it sits in, which is the bug the Modal had. The other eight name
     their palette, because that is the whole point of asking for one. */
  const lightTheme   = color === 'default' ? undefined : C;

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

    // ── Border radius in connected mode ───────────────────────────────────
    let borderRadius;
    if (isConnected && count > 1) {
      const r = 'var(--Style-Border-Radius)';
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

    // ── Per-button sx ─────────────────────────────────────────────────────
    const positionalSx = isConnected && count > 1 ? {
      borderRadius,
      ...(!isFirst && (isHorizontal ? { marginLeft: 'calc(-1 * var(--Button-Border-Width))' } : { marginTop: 'calc(-1 * var(--Button-Border-Width))' })),
      position: 'relative',
      '&:hover, &:focus-visible': { zIndex: 1 },
    } : {};

    // ── Selected styles ───────────────────────────────────────────────────
    /* Selection escalates by ONE step, and where it lands depends on the group
       style. An outlined (or light) group goes outline -> SOLID; a ghost group
       goes ghost -> OUTLINE, not ghost -> solid. A ghost group is chosen when
       the control should stay quiet, and filling a segment undoes exactly
       that; an outline still reads clearly against two borderless neighbours.
       (This used to fill on both: the variant stayed 'ghost' while the rules
       below painted btnBg at !important, so a selected ghost segment rendered
       as a solid fill with no border.)

       Either way the segment is "on" and must NOT react to hover. Without the
       freeze it inherits the Button's own &:hover — var(--Buttons-{C}-Hover),
       a near-white scrim — and flips light on hover. Frozen across active and
       focus for the same reason. The focus RING still shows: it is an
       `outline`, which none of these three properties touch. */
    const selectedPaint = isGhost
      ? {
          // The `-outline` variant's own paint, pinned so hover cannot move it.
          backgroundColor: 'var(--Background) !important',
          color:           'var(--Text) !important',
          borderColor:     btnBorder + ' !important',
        }
      : {
          backgroundColor: btnBg     + ' !important',
          color:           btnText   + ' !important',
          borderColor:     btnBorder + ' !important',
        };

    const selectedSx = isSelected ? {
      ...selectedPaint,
      '&:hover, &:active, &.Mui-focusVisible, &:focus-visible': selectedPaint,
    } : {};

    // ── Unselected styles ─────────────────────────────────────────────────
    /* The FILLS stay on the surface and the LABELS come from the buttons
       table, which is what Figma does and is not a mix-up: an unselected
       segment has no fill of its own, so its hover and pressed tints are the
       surface's scrims — but its label belongs to the group's palette, which
       is the only thing distinguishing a success group from an error one
       while nothing is selected.

       The pressed label was --Buttons-Default-Text once, pinned to the
       DEFAULT palette whatever colour the group was. It was corrected to
       --Text, which fixed the pinning and lost the palette; Outline-Text is
       the token that was wanted both times — it follows the group's colour
       AND is contrast-checked against the surface rather than against a
       button fill. */
    const unselectedSx = !isSelected ? {
      color:           btnOutlineQuiet,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'var(--Hover)',
        color:           btnOutlineText,
        zIndex:          1,
      },
      '&:active': {
        backgroundColor: 'var(--Pressed)',
        color:           btnOutlineText,
      },
      /* Focus-Visible is one of the three active states in Figma, and it was
         the only one here with no label of its own — so keyboard focus said
         less than hover did. */
      '&.Mui-focusVisible, &:focus-visible': {
        color:           btnOutlineText,
      },
    } : {};

    /* Ghost: no border on individual buttons — UNSELECTED ones only.
       This is spread AFTER selectedSx, so an unscoped `border: none` erased
       the border that IS the selected ghost segment's whole treatment. */
    const ghostSx = isGhost && !isSelected ? {
      border: 'none !important',
      '&:hover': { border: 'none !important' },
    } : {};

    /* A segment must not LIFT on hover.
     *
     * Button raises itself 1px on hover — right for a standalone button, wrong
     * for a segmented control, where the segments share edges. One segment
     * rising breaks the shared border, shifts its own baseline against its
     * neighbours, and reads as the group resizing rather than as a hover.
     *
     * Suppressed for every state, not just hover: :active restores
     * translateY(0), which is a no-op here but would otherwise leave the two
     * declarations disagreeing about who owns the transform. */
    const noLiftSx = {
      transform: 'none !important',
      '&:hover, &:active, &:focus-visible': { transform: 'none !important' },
    };

    const buttonSx = {
      /* Fill + horizontal: the SEGMENTS have to grow, not just the container.
 
         `useGrid` is `isEqual && isHorizontal`, so fill takes the flex branch —
         where the container got width:100% and the children got nothing. The
         group stretched and the buttons stayed their natural width, bunched at
         the start, which is not what Fit=Fill draws.
 
         Only horizontal needs this. A vertical group is a column, and
         alignItems:stretch already makes its segments full width; adding
         flex-grow there would distribute HEIGHT instead, which Fit=Fill does
         not mean. minWidth:0 so a long label shrinks rather than forcing the
         group wider than its container. */
      ...(isFill && isHorizontal && { flex: '1 1 0', minWidth: 0 }),
      // Grid items stretch to fill their 1fr cell via the default
      // justify-self:stretch — do NOT set width:100% here. An explicit
      // width:100% fixes each segment to exactly the cell width, so the
      // -Button-Border-Width marginLeft only makes neighbors TOUCH (two 2px
      // borders side by side = a 4px double border). Letting them stretch lets
      // that negative margin OVERLAP the shared edge into a single border —
      // the same collapse the flex (hug/fill) modes already get.
      ...positionalSx,
      ...noLiftSx,
      ...selectedSx,
      ...unselectedSx,
      ...ghostSx,
      '&:focus-visible': {
        outline:       '2px solid var(--Focus-Visible)',
        outlineOffset: '2px',
        zIndex:        2,
      },
      ...child.props.sx,
    };

    warnSegmentShape(child.props, separated);

    const clonedButton = React.cloneElement(child, {
      /* One step of escalation from the group's own style:
           outlined / light   unselected `-outline`  ->  selected SOLID
           ghost              unselected `ghost`     ->  selected `-outline`
         An explicit child.variant always wins. */
      variant: child.props.variant ?? (
        isGhost
          ? (isSelected ? color + '-outline' : 'ghost')
          : isSelected
            ? color
            : color + '-outline'
      ),
      size:    child.props.size ?? size,
      disabled: child.props.disabled ?? disabled,
      onClick: handleClick(childValue, child.props.onClick),
      'aria-pressed': isSelected,
      sx: buttonSx,
    });

    // ── Light variant: wrap unselected buttons in themed Box ──────────────
    if (isLight && !isSelected) {
      return (
        <Box
          key={index}
          data-theme={lightTheme}
          data-surface={LIGHT_SURFACE}
          sx={{ display: 'contents' }}
        >
          {clonedButton}
        </Box>
      );
    }

    return React.cloneElement(clonedButton, { key: index });
  });

  // ── Container — no border on the outer wrapper ──────────────────────────
  const containerBorder = 'none';

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      className={'btn-group btn-group-' + variant + ' btn-group-' + color + ' ' + className}
      sx={{
        ...(useGrid
          ? {
              // equal-width-hug: inline-grid, equal 1fr columns → every button
              // matches the widest; inline-grid shrink-wraps so the group hugs.
              display:        isFill ? 'grid' : 'inline-grid',
              gridAutoFlow:   'column',
              gridAutoColumns:'1fr',
              justifyItems:   'stretch',   // buttons fill their column width (equal)
              alignItems:     'stretch',   // buttons fill the row height → if one
                                           // wraps to 2 lines, all match the tallest
              width:          isFill ? '100%' : 'fit-content',
            }
          : {
              display:        isFill ? 'flex' : 'inline-flex',
              flexDirection:  isHorizontal ? 'row' : 'column',
              alignItems:     'stretch',
              width:          isFill ? '100%' : 'auto',
            }),
        gap:            isConnected ? 0 : effectiveSpacing,
        border:         containerBorder,
        borderRadius:   'var(--Style-Border-Radius)',
        // No overflow:hidden — would clip button borders, focus rings, and
        // the outline-offset on focus-visible. Connected-mode corner shaping
        // is already handled per-button via the borderRadius logic above.
        ...sx,
      }}
      {...props}
    >
      {wrappedChildren}
    </Box>
  );
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