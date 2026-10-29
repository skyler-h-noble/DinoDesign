// src/components/Chip/Chip.js
import React, { forwardRef } from 'react';
import { Chip as MuiChip, Avatar as MuiAvatar, Box } from '@mui/material';
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

const chipStyles = () => ({
  bg:       'var(--Background)',
  text:     'var(--Text)',
  border:   '1px solid var(--Border)',
  hoverBg:  'var(--Hover)',
  activeBg: 'var(--Pressed)',
});

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
  sx = {},
  ...props
}) {
  const startDecorator = startDecoratorProp ?? icon;
  const chipColor = normalizeChipVariant(variant);
  const styles = chipStyles();
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

  const chipSx = {
    height: sc.height,
    /* The Legal-Semibold type style, which is what the Figma label is bound to
       (size, leading, tracking and face from Legal-*, weight from
       Legal-Semibold-Font-Weight). It used to be
       the button's face at 12px / 500, which no chip in the file draws. Never
       `inherit`: the generated CSS gives the page no font, so outside a styled
       parent the chip would come out in the UA serif. */
    fontSize: 'var(--Legal-Font-Size, 10px)',
    fontWeight: 'var(--Legal-Semibold-Font-Weight, 600)',
    letterSpacing: 'var(--Legal-Letter-Spacing, 0)',
    fontFamily: 'var(--Legal-Font-Family, var(--Font-Family-Body, inherit))',
    borderRadius: (sc.height / 2) + 'px',
    padding: 0,
    // `Sizing-4` on the Figma variant — a chip never narrower than 32px.
    minWidth: sc.minWidth,
    boxSizing: 'border-box',
    position: 'relative',

    /* The root is NOT the surface. The paint — fill, border, text — is on the
       inner `.chip-surface`, which carries data-theme + data-surface. The
       root keeps the PARENT's tokens, so the focus ring, which sits outside
       the chip on the page, takes the page's --Focus-Visible. On the root, a
       selected chip (Surface-Dimmest) drew its ring in the dark surface's
       light blue — about 2:1 on a light page. Same split as Card's outer
       shell and inner surface, and as Figma's set, where Focus-Visible is a
       sibling of Theme-Chip-Body, not inside it. */
    backgroundColor: 'transparent',


    // 24x24 minimum touch target (WCAG 2.5.8) — always, there being one size.
    ...{
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 24,
        minHeight: 24,
        width: '100%',
        height: '100%',
      },
    },

    ...(isClickable && !disabled ? {
      cursor: 'pointer',
      transition: 'background-color 0.15s ease, outline 0.15s ease',
      transition: 'background-color 0.15s ease, box-shadow 0.15s ease, outline 0.15s ease',
      /* Figma's Hover chip wears the Level-1 elevation; Pressed drops back to
         none. MUI's clickable chip adds its own shadow on :active, which is
         why Pressed has to say `none` rather than leave it unset. */
      '&:hover': {
        backgroundColor: 'transparent',
        '& .chip-surface': { backgroundColor: styles.hoverBg },
        boxShadow: SHADOW_LEVEL_1,
      },
      '&:active': {
        backgroundColor: 'transparent',
        '& .chip-surface': { backgroundColor: styles.activeBg },
        boxShadow: 'none',
      },
    } : {}),

    /* 2px ring 1px outside, as on Card and Checkbox — Figma's Focus-Visible
       frame sits 3px out with its 2px stroke inside. */
    '&:focus-visible, &.Mui-focusVisible': {
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '1px',
    },

    ...(disabled ? {
      opacity: 0.38, // Figma's Disabled chip, as on Swatch
      cursor: 'not-allowed',
      pointerEvents: 'none',
    } : {}),

    boxShadow: 'none',

    '& .MuiChip-label': {
      padding: 0,
      height: '100%',
      alignSelf: 'stretch',
      flex: 1,
      fontSize: 'inherit',
      fontWeight: 'inherit',
      fontFamily: 'inherit',
      lineHeight: 'var(--Legal-Line-Height, 15px)',
      letterSpacing: 'inherit',
      display: 'flex',
      alignItems: 'center',
      gap: sc.gap + 'px',
    },

    '& .MuiChip-icon': {
      margin: 0,
      marginLeft: '-2px',
      color: 'inherit',
      fontSize: sc.iconSize,
    },

    '& .MuiChip-deleteIcon': {
      display: 'none',
    },

    ...sx,
  };

  const labelContent = (
    <Box
      component="span"
      className="chip-surface"
      /* The attributes are the paint. Every token here — --Background,
         --Text, --Border, --Hover, --Pressed — resolves from this pair, so
         without them the chip falls through to the page's own zone and a
         Success chip renders in the page color. */
      data-theme={chipTheme}
      data-surface={chipSurface}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sc.gap + 'px',
        lineHeight: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: sc.padding,
        /* Stated, not `inherit`: the parent is .MuiChip-label, which has no
           radius, so inherit drew a square chip. */
        borderRadius: (sc.height / 2) + 'px',
        backgroundColor: styles.bg,
        color: styles.text,
        border: styles.border,
        /* Figma's selected chip has no stroke. The border stays as a
           transparent 1px so the content does not move between states; the
           fill paints under it, so the edge is the fill. */
        ...(selected ? { borderColor: 'transparent' } : {}),
        transition: 'background-color 0.15s ease',
      }}
    >
      {startDecorator && (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& .MuiSvgIcon-root': { fontSize: sc.iconSize },
            /* The lib's Avatar is `.avatar` — `.MuiAvatar-root` alone missed it,
               so an avatar decorator rendered at its own 32px default and
               overflowed the 24px chip. Figma pins Icons & Avatars to xxs: 16. */
            '& .MuiAvatar-root, & .avatar': {
              width: sc.iconSize,
              height: sc.iconSize,
              minWidth: sc.iconSize,
              fontSize: '9px',
            },
          }}
        >
          {startDecorator}
        </Box>
      )}
      {displayLabel != null && displayLabel !== '' && (
        <Box component="span" sx={{ padding: sc.labelPadding, display: 'inline-flex', alignItems: 'center', lineHeight: 'var(--Legal-Line-Height, 15px)' }}>
          {displayLabel}
        </Box>
      )}
      {endDecorator && (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& .MuiSvgIcon-root': { fontSize: sc.iconSize },
            /* The lib's Avatar is `.avatar` — `.MuiAvatar-root` alone missed it,
               so an avatar decorator rendered at its own 32px default and
               overflowed the 24px chip. Figma pins Icons & Avatars to xxs: 16. */
            '& .MuiAvatar-root, & .avatar': {
              width: sc.iconSize,
              height: sc.iconSize,
              minWidth: sc.iconSize,
              fontSize: '9px',
            },
          }}
        >
          {endDecorator}
        </Box>
      )}
      {onDelete && (
        <ChipDeleteButton onClick={onDelete} label={typeof displayLabel === 'string' ? displayLabel : undefined} disabled={disabled} />
      )}
    </Box>
  );

  return (
    <MuiChip
      label={labelContent}
      clickable={isClickable && !disabled}
      disabled={disabled}
      onClick={isClickable ? onClick : undefined}
      className={'chip-' + chipColor + (selected ? ' chip-selected' : '') + ' ' + className}
      sx={chipSx}
      {...selectionProps}
      {...props}
    />
  );
}

// --- Convenience Exports -----------------------------------------------------

// Solid
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
