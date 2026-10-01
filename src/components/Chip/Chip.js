// src/components/Chip/Chip.js
import React, { forwardRef } from 'react';
import { Chip as MuiChip, Avatar as MuiAvatar, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Chip Component
 * Compact element representing an input, attribute, or action
 *
 * COLOUR:   variant="{color}"  — colour only, all 8. There is no shape axis.
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
 *   onDelete:        shows a 16px delete glyph; its 24x24 target is the
 *                    pseudo-element, not the chip's height
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
 * Selection is the only axis now. `variant` means colour, as it does on every
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
const CHIP_SIZE = {
  height: 24, fontSize: '12px', iconSize: 16, padding: '0 8px', deleteSize: 16, gap: 4,
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

const ChipDeleteButton = forwardRef(function ChipDeleteButton({ onClick, ...props }, ref) {
  /* 16px glyph, 24x24 touch area (the `deleteSize < 24` branch below). This was
     a ladder off the chip's size; there is one chip size now, so the glyph is
     fixed and the TARGET is what carries the WCAG 2.5.8 minimum — the two are
     different things, and conflating them is what pushed a deletable chip to
     40px to fit a 24px icon. */
  const deleteSize = 16;
  return (
    <Box
      ref={ref}
      component="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
          e.stopPropagation();
          if (onClick) onClick(e);
        }
      }}
      aria-label="Remove"
      role="button"
      tabIndex={0}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        minHeight: 24,
        width: deleteSize,
        height: deleteSize,
        padding: 0,
        margin: 0,
        marginLeft: '2px',
        marginRight: '-4px',
        border: 'none',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        color: 'inherit',
        opacity: 0.7,
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'opacity 0.15s ease, background-color 0.15s ease',
        '&:hover': {
          opacity: 1,
          backgroundColor: 'rgba(0,0,0,0.08)',
        },
        '&:focus-visible': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '1px',
        },
        ...(deleteSize < 24 && {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: 24,
            minHeight: 24,
          },
        }),
      }}
      {...props}
    >
      <CancelIcon sx={{ fontSize: deleteSize, pointerEvents: 'none' }} />
    </Box>
  );
});

// --- Component ---------------------------------------------------------------

export function Chip({
  variant = 'primary',
  size: sizeProp,
  label,
  clickable = false,
  disabled = false,
  selected = false,
  selectionMode,
  onDelete,
  onClick,
  startDecorator,
  endDecorator,
  children,
  className = '',
  sx = {},
  ...props
}) {
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
     be the wrong colour. */

  const displayLabel = label || children;

  const chipSx = {
    height: sc.height,
    fontSize: sc.fontSize,
    fontWeight: 500,
    fontFamily: 'inherit',
    borderRadius: (sc.height / 2) + 'px',
    padding: sc.padding,
    // `Sizing-4` on the Figma variant — a chip never narrower than 32px.
    minWidth: sc.minWidth,
    boxSizing: 'border-box',
    position: 'relative',

    backgroundColor: styles.bg,
    color: styles.text,
    border: styles.border,


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
      '&:hover': {
        backgroundColor: styles.hoverBg,
      },
      '&:active': {
        backgroundColor: styles.activeBg,
      },
    } : {}),

    '&:focus-visible, &.Mui-focusVisible': {
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
    },

    ...(disabled ? {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    } : {}),

    boxShadow: 'none',

    '& .MuiChip-label': {
      padding: 0,
      fontSize: 'inherit',
      fontWeight: 'inherit',
      fontFamily: 'inherit',
      lineHeight: 1.2,
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
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sc.gap + 'px',
        lineHeight: 1,
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
            '& .MuiAvatar-root': {
              width: sc.iconSize + 4,
              height: sc.iconSize + 4,
              fontSize: Math.round(sc.iconSize * 0.65) + 'px',
            },
          }}
        >
          {startDecorator}
        </Box>
      )}
      {displayLabel}
      {endDecorator && (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& .MuiSvgIcon-root': { fontSize: sc.iconSize },
            '& .MuiAvatar-root': {
              width: sc.iconSize + 4,
              height: sc.iconSize + 4,
              fontSize: Math.round(sc.iconSize * 0.65) + 'px',
            },
          }}
        >
          {endDecorator}
        </Box>
      )}
      {onDelete && (
        <ChipDeleteButton onClick={onDelete} />
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
      /* The attributes are the paint. Every token in chipSx — --Background,
         --Text, --Border, --Hover, --Pressed — resolves from this pair, so
         without them the chip falls through to the page's own zone and a
         Success chip renders in the page colour. */
      data-theme={chipTheme}
      data-surface={chipSurface}
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
