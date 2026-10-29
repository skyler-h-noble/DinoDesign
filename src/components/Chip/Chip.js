// src/components/Chip/Chip.js
import React, { forwardRef } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button/Button';
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * Chip Component
 * Compact element representing an input, attribute, or action
 *
 * COLOUR:   variant="{color}"  — color only, all 8. There is no shape axis.
 *
 * SELECTION is the only other axis, and it is a SURFACE level rather than a
 * different fill. A chip is a small surface you can toggle, not a button:
 *
 *   unselected  data-surface="Surface-Brightest"
 *   selected    data-surface="Surface-Dimmest"
 *
 * Both paint var(--Background) with a var(--Border) edge, so one data-theme
 * drives both states and --Text, --Hover and --Pressed come along paired.
 *
 * The SOLID/OUTLINE shapes are gone — `-outline` was the unselected chip under
 * another name, which let the component express four combinations against the
 * design's two. `-light` went earlier for a related reason. Both still render
 * and warn once; see normalizeChipVariant.
 *
 * SIZE: one — 24px, matching the Figma set, which has no size axis. There is
 *       no `size` prop; one passed anyway is ignored and warns once.
 *   - The 24x24 minimum touch target (WCAG 2.5.8) is carried by an ::after
 *     pseudo-element, so the TARGET meets the minimum without the chip growing.
 *
 * FEATURES:
 *   clickable:       onClick handler, cursor pointer, hover/active states
 *   disabled:        reduced opacity, no interactions
 *   onDelete:        Figma's Deletable — a small ghost icon-only Button
 *                    (close) after the label, named "Remove {label}"
 *   startDecorator:  icon or avatar before label
 *   endDecorator:    icon or avatar after label (before delete if present)
 *   selectionMode:   'radio' | 'checkbox' -- adds aria role, visual selected state
 *   selected:        controlled selected state for radio/checkbox mode
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Painting ----------------------------------------------------------------
//
// ONE set of tokens for every chip, in both states.
//
// A chip is a small SURFACE you can toggle, not a button, so selection is a
// surface level rather than a different fill: the element carries
// data-theme="{color}" and data-surface="Surface-Brightest" unselected /
// "Surface-Dimmest" selected, and every token below resolves from that zone.
// Change the theme and both states follow, along with --Text, --Border,
// --Hover and --Pressed, all paired for that surface.
//
// This replaces solid/outline style builders picked by `variant`. Those made
// the component able to express four combinations — solid, outline, and each
// of them selected — where the design has two. A converter reading a chip
// could not know which to emit, which is what blocked Chip and Tag from
// mapping deterministically.
//
// Hover and Pressed are the zone's own --Hover / --Pressed rather than the
// button palette's, for the same reason: they must move with the surface, and
// --Buttons-{C}-Hover is tuned against the button fill, not against
// --Background.
const CHIP_SURFACE = { selected: 'Surface-Dimmest', unselected: 'Surface-Brightest' };

// The `-light` shape is removed. It was solidStyles PLUS a border — the SAME
// --Buttons-{C}-Button fill as the solid chip — so `success-light` painted the
// solid button green, never the light surface its name promised. In this
// system "light" is a SURFACE, not a shape: data-theme="{Color}" +
// data-surface="Surface-Brightest" on a `-outline` chip, whose bg is
// var(--Background) and text var(--Text), so both follow the zone.
//
// Not a hard delete. Chip resolves an unknown variant as
// `variantMap[variant] || variantMap['primary']`, so deleting the entries
// would have repainted every `success-light` chip as PRIMARY with no error.
// Strip the suffix to the solid chip of the same name and say so once in dev.
const LIGHT_SUFFIX = /-light$/;
/* `-outline` goes the same way, and for a closer reason than -light did.
 *
 * It was never a second SHAPE — outlineStyles painted var(--Background) with a
 * border, which is exactly what an UNSELECTED chip is. So the component could
 * say the same thing two ways, and say contradictory things too: solid-and-
 * selected, outline-and-selected. Four combinations against the design's two,
 * and a converter reading a chip in Figma had no way to choose.
 *
 * Selection is the only axis now. `variant` means color, as it does on every
 * other component. */
const OUTLINE_SUFFIX = /-outline$/;
const warnedVariants = new Set();

export function normalizeChipVariant(variant) {
  const v = String(variant || 'primary');
  if (OUTLINE_SUFFIX.test(v)) {
    const base = v.replace(OUTLINE_SUFFIX, '');
    if (process.env.NODE_ENV !== 'production' && !warnedVariants.has(v)) {
      warnedVariants.add(v);
      console.warn(
        '[Chip] variant="' + v + '" — there is no outline shape. An outline ' +
        'chip WAS the unselected chip: same var(--Background) fill, same ' +
        'border. Rendering variant="' + base + '" unselected. Pass ' +
        'selected={true} for the filled state.',
      );
    }
    return base;
  }
  if (!LIGHT_SUFFIX.test(v)) return v;
  const base = v.replace(LIGHT_SUFFIX, '');
  if (process.env.NODE_ENV !== 'production' && !warnedVariants.has(v)) {
    warnedVariants.add(v);
    console.warn(
      '[Chip] variant="' + v + '" — the -light shape was removed. Rendering ' +
      'variant="' + base + '" (solid). For a light chip use variant="' + base +
      '-outline" with data-theme + data-surface="Surface-Brightest".',
    );
  }
  return base;
}

// --- Sizing ------------------------------------------------------------------

/* ONE size, measured off the Figma Chip set (8927:15447), which has no size
   axis at all: a 24px body, `Sizing-Half` (4px) padding either side of the body
   plus 4px on the label holder — 8px in total — `Sizing-3` for the radius, and
   `Sizing-4` (32px) as the minimum width. Icons and avatars inside it pin the
   `Icons & Avatars` mode to `xxs`, which is 16px.

   There used to be small/medium/large, with `medium` the default. Figma has
   never drawn a 32px or 40px chip, so the DEFAULT chip was the one size that did
   not exist in the design — the other two were extrapolated from the 24px one.
   Sizes in this system come from the `Component-Size` collection's modes anyway,
   not from a per-component ladder; Button carries no Size axis either. */
/* Figma's layout, read off the set: 4px on the body either side, the
   decorators flush against the label, and the 4px label holder carrying the
   rest — so a label-only chip still has 8px a side, and a chip with an avatar
   and an icon has 4px outside them rather than 8px plus a 4px gap. The body
   padding is 3px because the 1px border is inside the box here (border-box):
   border + padding = Figma's 4px. */
const CHIP_SIZE = {
  height: 24, iconSize: 16, padding: '0 3px', labelPadding: '0 4px', deleteSize: 16, gap: 0,
  minWidth: 32,
};

/* `size` is accepted and ignored, the same treatment Badge's removed `size` and
   the removed `-light` shape get: dropping the prop outright would let it fall
   into ...props and reach MuiChip, which forwards unknown props to the DOM. */
const warnedSizes = new Set();

function warnRemovedSize(size) {
  if (size === undefined) return;
  if (process.env.NODE_ENV === 'production' || warnedSizes.has(size)) return;
  warnedSizes.add(size);
  // eslint-disable-next-line no-console
  console.warn(
    '[Chip] size="' + size + '" — Chip has one size (24px) and the prop was ' +
    'removed. Figma draws no other, and component sizing comes from the ' +
    'Component-Size modes rather than a per-component ladder.',
  );
}

// --- Delete Icon Button ------------------------------------------------------

/* The static sheet. Chip used to be MUI's Chip with an sx override; it is now
   its own markup, so this sheet carries both the base MUI gave it and the
   design's own layer on top, over the same tokens.

   The root is NOT the surface. The paint — fill, border, text — is on the
   inner .chip-surface, which carries data-theme + data-surface. The root keeps
   the PARENT's tokens, so the focus ring, which sits outside the chip on the
   page, takes the page's --Focus-Visible. Same split as Card's outer shell and
   inner surface, and as Figma's set, where Focus-Visible is a sibling of
   Theme-Chip-Body, not inside it.

   Type is the Legal-Semibold style, which is what the Figma label is bound to.
   Never `inherit`: the generated CSS gives the page no font, so outside a
   styled parent the chip would come out in the UA serif.

   State rules weigh what emotion's did, so a caller's sx state rule still
   wins over them. */
const SxBox = lazySxBox('Chip');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const R = (CHIP_SIZE.height / 2) + 'px';
const DECORATOR_RULES = (sel) => [
  `${sel}{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}`,
  `${sel} .MuiSvgIcon-root{font-size:${CHIP_SIZE.iconSize}px}`,
  /* The lib's Avatar is `.avatar` — `.MuiAvatar-root` alone missed it. Figma
     pins Icons & Avatars to xxs: 16. Avatar takes its size from --_av-size, so
     this rule can still set it. */
  `${sel} .MuiAvatar-root,${sel} .avatar{width:${CHIP_SIZE.iconSize}px;height:${CHIP_SIZE.iconSize}px;min-width:${CHIP_SIZE.iconSize}px;font-size:9px}`,
];

registerStaticStyles('omni-chip', [
  '.omni-chip{max-width:100%;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;'
    + 'transition:background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;'
    + 'cursor:unset;outline:0;text-decoration:none;border:0;vertical-align:middle;color:inherit;line-height:1.5;'
    + `height:${CHIP_SIZE.height}px;font-size:var(--Legal-Font-Size, 10px);font-weight:var(--Legal-Semibold-Font-Weight, 600);`
    + 'letter-spacing:var(--Legal-Letter-Spacing, 0);font-family:var(--Legal-Font-Family, var(--Font-Family-Body, inherit));'
    + `border-radius:${R};padding:0;min-width:${CHIP_SIZE.minWidth}px;box-sizing:border-box;position:relative;`
    + 'background-color:transparent;box-shadow:none}',
  /* The 24x24 touch target (WCAG 2.5.8), centred on the chip. */
  '.omni-chip::after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);min-width:24px;min-height:24px;width:100%;height:100%}',
  '.omni-chip-click{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;'
    + 'transition:background-color 0.15s ease, box-shadow 0.15s ease, outline 0.15s ease}',
  /* Figma's Hover chip wears the Level-1 elevation; Pressed drops back to none. */
  `.omni-chip-click:hover{background-color:transparent;box-shadow:${SHADOW_LEVEL_1}}`,
  '.omni-chip-click:hover .chip-surface{background-color:var(--Hover)}',
  '.omni-chip-click:active{background-color:transparent;box-shadow:none}',
  '.omni-chip-click:active .chip-surface{background-color:var(--Pressed)}',
  /* 2px ring 1px outside, as on Card and Checkbox. */
  '.omni-chip:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  // Figma's Disabled chip, as on Swatch.
  '.omni-chip-off{opacity:0.38;cursor:not-allowed;pointer-events:none}',
  '.omni-chip-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0;height:100%;align-self:stretch;flex:1;'
    + 'font-size:inherit;font-weight:inherit;font-family:inherit;line-height:var(--Legal-Line-Height, 15px);letter-spacing:inherit;'
    + `display:flex;align-items:center;gap:${CHIP_SIZE.gap}px}`,
  /* The surface: its attributes are the paint. Its radius is stated, not
     `inherit` — the parent label has no radius. */
  `.omni-chip-surface{display:inline-flex;align-items:center;gap:${CHIP_SIZE.gap}px;line-height:1;height:100%;width:100%;`
    + `justify-content:center;box-sizing:border-box;padding:${CHIP_SIZE.padding};border-radius:${R};`
    + 'background-color:var(--Background);color:var(--Text);border-width:1px;border-style:solid;border-color:var(--Border);'
    + 'transition:background-color 0.15s ease}',
  /* Figma's selected chip has no stroke. The border stays as a transparent
     1px so the content does not move between states. */
  '.omni-chip-surface-sel{border-color:transparent}',
  ...DECORATOR_RULES('.omni-chip-dec'),
  `.omni-chip-text{padding:${CHIP_SIZE.labelPadding};display:inline-flex;align-items:center;line-height:var(--Legal-Line-Height, 15px)}`,
].join('\n'));

/* Figma's Deletable: a SMALL GHOST ICON-ONLY Button (close) after the label.
   It was a hand-rolled <button> with a Cancel glyph, an rgba hover and its
   own focus ring — states the lib Button already has, drawn from the
   design's tokens. Small is 24px, the chip's own height, so it is its own
   WCAG 2.5.8 target. Named for what it removes. */
const ChipDeleteButton = forwardRef(function ChipDeleteButton({ onClick, label, disabled, ...props }, ref) {
  return (
    <Button
      ref={ref}
      iconOnly
      variant="ghost"
      size="small"
      disabled={disabled}
      aria-label={typeof label === 'string' && label ? 'Remove ' + label : 'Remove'}
      className="chip-delete"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.stopPropagation();
          if (onClick) onClick(e);
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
      sx={{ flexShrink: 0 }}
      {...props}
    >
      <CloseIcon />
    </Button>
  );
});

// --- Component ---------------------------------------------------------------

export function Chip({
  /* Neutral, as Figma's Chip draws it unpinned — a chip is a quiet surface;
     a palette is a choice. It defaulted to primary. */
  variant = 'neutral',
  size: sizeProp,
  label,
  clickable = false,
  disabled = false,
  selected = false,
  selectionMode,
  onDelete,
  onClick,
  startDecorator: startDecoratorProp,
  endDecorator,
  /* MUI's name for the leading icon. Passed through, MUI drew it OUTSIDE the
     chip's body (the body is drawn inside the label), so a check icon sat
     beside the pill. It is the start decorator under another name. */
  icon,
  children,
  className = '',
  sx,
  onKeyDown,
  onKeyUp,
  ...props
}) {
  useStaticStyles('omni-chip');
  const startDecorator = startDecoratorProp ?? icon;
  const chipColor = normalizeChipVariant(variant);
  /* `default` gets no data-theme and INHERITS, matching ButtonGroup. Naming a
     Default theme would pin the chip to the brand's default palette even inside
     a themed zone, which is the opposite of what inheriting means. */
  const chipTheme = chipColor === 'default' ? undefined : cap(chipColor);
  const chipSurface = selected ? CHIP_SURFACE.selected : CHIP_SURFACE.unselected;

  warnRemovedSize(sizeProp);
  /* No size switch any more, and so no `onDelete` forcing one. The delete
     control used to push the chip to `large` to fit a 24x24 target; it is 16px
     now and the ::after below carries the 24x24 touch area, which is what the
     target has to be — not the glyph. */
  const sc = CHIP_SIZE;

  // Clickable if onClick, selectionMode, or explicit clickable
  const isClickable = clickable || !!onClick || !!selectionMode;

  // Selection ARIA
  const selectionProps = {};
  if (selectionMode === 'radio') {
    selectionProps.role = 'radio';
    selectionProps['aria-checked'] = selected;
  } else if (selectionMode === 'checkbox') {
    selectionProps.role = 'checkbox';
    selectionProps['aria-checked'] = selected;
  }

  /* No selected ring. It used to draw `2px solid var(--Buttons-Primary-Button)`
     — PRIMARY, hardcoded, so a selected Success chip wore a primary ring — and
     it sat on top of whichever fill the variant chose. Selection is now the
     surface level, which is both the design's model and a signal that cannot
     be the wrong color. */

  const displayLabel = label || children;

  /* The root is a button when it can be pressed: focusable, named a button
     unless a selection role says otherwise, Enter presses on key-down and
     Space on key-up — the behaviour MUI's ButtonBase gave it. Disabled is not
     pressable at all, so it is a plain element again. */
  const pressable = isClickable && !disabled;
  const handleKeyDown = (e) => {
    if (pressable && e.target === e.currentTarget) {
      if (e.key === ' ') e.preventDefault();
      if (e.key === 'Enter') { e.preventDefault(); if (onClick) onClick(e); }
    }
    if (onKeyDown) onKeyDown(e);
  };
  const handleKeyUp = (e) => {
    if (pressable && e.target === e.currentTarget && e.key === ' ' && onClick) onClick(e);
    if (e.target === e.currentTarget && e.key === 'Escape') e.currentTarget.blur();
    if (onKeyUp) onKeyUp(e);
  };

  const decorator = (node) => <span className="omni-chip-dec">{node}</span>;
  const labelContent = (
    <span
      className={'chip-surface omni-chip-surface' + (selected ? ' omni-chip-surface-sel' : '')}
      /* The attributes are the paint. Every token here — --Background,
         --Text, --Border, --Hover, --Pressed — resolves from this pair, so
         without them the chip falls through to the page's own zone and a
         Success chip renders in the page color. */
      data-theme={chipTheme}
      data-surface={chipSurface}
    >
      {startDecorator && decorator(startDecorator)}
      {displayLabel != null && displayLabel !== '' && (
        <span className="omni-chip-text">{displayLabel}</span>
      )}
      {endDecorator && decorator(endDecorator)}
      {onDelete && (
        <ChipDeleteButton onClick={onDelete} label={typeof displayLabel === 'string' ? displayLabel : undefined} disabled={disabled} />
      )}
    </span>
  );

  const rootProps = {
    role: pressable ? 'button' : undefined,
    tabIndex: pressable ? 0 : undefined,
    onClick: pressable ? onClick : undefined,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    className: 'MuiChip-root omni-chip' + (pressable ? ' MuiChip-clickable omni-chip-click' : '')
      + (disabled ? ' Mui-disabled omni-chip-off' : '')
      + ' chip-' + chipColor + (selected ? ' chip-selected' : '') + ' ' + className,
    ...selectionProps,
    ...props,
  };
  const body = <span className="MuiChip-label omni-chip-label">{labelContent}</span>;
  if (hasSx(sx)) return <SxBox sx={sx} {...rootProps}>{body}</SxBox>;
  return <div {...rootProps}>{body}</div>;
}

export const PrimaryChip    = (p) => <Chip variant="primary"    {...p} />;
export const SecondaryChip  = (p) => <Chip variant="secondary"  {...p} />;
export const TertiaryChip   = (p) => <Chip variant="tertiary"   {...p} />;
export const NeutralChip    = (p) => <Chip variant="neutral"    {...p} />;
export const InfoChip       = (p) => <Chip variant="info"       {...p} />;
export const SuccessChip    = (p) => <Chip variant="success"    {...p} />;
export const WarningChip    = (p) => <Chip variant="warning"    {...p} />;
export const ErrorChip      = (p) => <Chip variant="error"      {...p} />;

/* The eight outline presets are kept and now render the plain chip unselected,
   which is what they always drew. Deleting them would turn a stale import into
   a build error in someone else's project; leaving them is one line each and
   the shared warning fires once. */
export const PrimaryOutlineChip    = (p) => <Chip variant="primary-outline"    {...p} />;
export const SecondaryOutlineChip  = (p) => <Chip variant="secondary-outline"  {...p} />;
export const TertiaryOutlineChip   = (p) => <Chip variant="tertiary-outline"   {...p} />;
export const NeutralOutlineChip    = (p) => <Chip variant="neutral-outline"    {...p} />;
export const InfoOutlineChip       = (p) => <Chip variant="info-outline"       {...p} />;
export const SuccessOutlineChip    = (p) => <Chip variant="success-outline"    {...p} />;
export const WarningOutlineChip    = (p) => <Chip variant="warning-outline"    {...p} />;
export const ErrorOutlineChip      = (p) => <Chip variant="error-outline"      {...p} />;

// Light

export default Chip;
