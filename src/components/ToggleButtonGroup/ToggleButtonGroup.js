// src/components/ToggleButtonGroup/ToggleButtonGroup.js
import React from 'react';
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButton as MuiToggleButton,
} from '@mui/material';
import { Body, BodySmall } from '../Typography';
import { bevelShadow, tokenSegment } from '../_shadows';

/**
 * ToggleButtonGroup Component
 * Full-featured toggle button group with design system integration
 *
 * VARIANTS (variant="{color}"):
 *   Default    default
 *   Theme      primary | secondary | tertiary | neutral | black-white
 *   State      info | success | warning | error
 *
 * The selected segment is a filled button in that colour; the rest are
 * transparent with a --Quiet label.
 *
 * There was a `{color}-light` variant. It read --Buttons-{Color}-Light-Border
 * / -Light-Button / -Light-Text, and no design system publishes those tokens,
 * so it rendered an unbordered group with invisible selection. Removed rather
 * than left as a trap.
 *
 * Token mapping:
 *   PRIMARY:
 *     Group border:   var(--Buttons-Primary-Border)
 *     Selected bg:    var(--Buttons-Primary-Button)
 *     Selected text:  var(--Buttons-Primary-Text)
 *     Unselected bg:  transparent
 *     Unselected text:var(--Quiet)
 *     Hover bg:       var(--Buttons-Primary-Hover)
 *
 * SIZES: small | medium | large
 * ORIENTATION: horizontal (default) | vertical
 * SELECTION: exclusive (single) | non-exclusive (multiple)
 */


// --- Variant Style Builders --------------------------------------------------

// Three styles, each a different answer to "what does SELECTED look like".
// Unselected is transparent in all three — a segmented control reads by
// contrast between the chosen segment and the rest, so only the chosen one
// carries weight.
//
// tokenSegment handles black-white, whose tokens are --Buttons-BlackWhite-*
// rather than the capitalised prop name.
function colorStyles(color, style) {
  const C = tokenSegment(color);
  const base = {
    color,
    style,
    bg:        'transparent',
    text:      'var(--Quiet)',
    hover:     'var(--Buttons-' + C + '-Hover)',
    hoverText: 'var(--Buttons-' + C + '-Text)',
  };

  if (style === 'ghost') {
    // No chrome until something is chosen: no group border, no dividers. The
    // selected segment is OUTLINED rather than filled, so the control is
    // invisible at rest and shows exactly one ring once you pick. For
    // toolbars, where the group shouldn't compete with the content.
    return {
      ...base,
      border:        'transparent',
      selectedBg:    'transparent',
      selectedText:  'var(--Buttons-' + C + '-Border)',
      selectedRing:  'inset 0 0 0 2px var(--Buttons-' + C + '-Border)',
      bevel:         false,
    };
  }

  if (style === 'outline') {
    // The selected segment is ringed rather than filled, so the group keeps
    // the page background showing through.
    return {
      ...base,
      border:       'var(--Buttons-' + C + '-Border)',
      selectedBg:   'transparent',
      selectedText: 'var(--Buttons-' + C + '-Border)',
      selectedRing: 'inset 0 0 0 2px var(--Buttons-' + C + '-Border)',
      bevel:        false,
    };
  }

  // fill — the default. A solid button in that colour, bevel and all.
  return {
    ...base,
    border:       'var(--Buttons-' + C + '-Border)',
    selectedBg:   'var(--Buttons-' + C + '-Button)',
    selectedText: 'var(--Buttons-' + C + '-Text)',
    selectedRing: null,
    bevel:        true,
  };
}

const COLORS = [
  'default',
  'primary', 'secondary', 'tertiary', 'neutral', 'black-white',
  'info', 'success', 'warning', 'error',
];

const STYLES = ['fill', 'outline', 'ghost'];

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    STYLES.forEach((style) => {
      // `primary` means primary+fill; `primary-outline` and `primary-ghost`
      // name the other two.
      map[style === 'fill' ? color : color + '-' + style] = colorStyles(color, style);
    });
  });
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', padding: '4px 10px', iconSize: 16, gap: 4,
            swatchRadius: 'var(--Sm-Input-Swatch-Radius, 18px)' },
  medium: { height: 'var(--Button-Height)',       fontSize: '15px', padding: '6px 14px', iconSize: 18, gap: 6,
            swatchRadius: 'var(--Input-Swatch-Radius, 26px)' },
  large:  { height: 'var(--Large-Button-Height)', fontSize: '17px', padding: '8px 18px', iconSize: 20, gap: 8,
            swatchRadius: 'var(--Lg-Input-Swatch-Radius, 50px)' },
};

// --- ToggleButton (individual) -----------------------------------------------

/**
 * One segment.
 *
 * startDecorator / endDecorator mirror Button: a node either side of the
 * label, separated by the same 2px gap. They are DECORATION — the segment's
 * accessible name comes from its text (or from aria-label on an icon-only
 * segment), so a decorator must not add a second one.
 *
 * The group sizes whatever lands in these slots, so an <Icon> or <Avatar>
 * follows the group's size prop without being told twice.
 */
export function ToggleButton({
  value,
  children,
  startDecorator,
  endDecorator,
  // A colour chip. Any CSS colour — pass a token, e.g. "var(--Primary-Color-7)".
  // The GROUP sizes it, so it follows the group's size prop; the radius comes
  // from --*-Input-Swatch-Radius, which is what the system publishes for a
  // swatch (there is no --Button-Swatch token in the CSS export).
  swatch,
  disabled = false,
  sx = {},
  ...props
}) {
  const hasSlots = startDecorator !== undefined || endDecorator !== undefined || swatch !== undefined;
  return (
    <MuiToggleButton
      value={value}
      disabled={disabled}
      sx={sx}
      {...props}
    >
      {hasSlots ? (
        <>
          {swatch !== undefined && (
            <span className="tbtn-swatch" aria-hidden="true" style={{ backgroundColor: swatch }} />
          )}
          {startDecorator !== undefined && (
            <span className="tbtn-start" aria-hidden="true">{startDecorator}</span>
          )}
          {children !== undefined && children !== null && (
            <span className="tbtn-label">{children}</span>
          )}
          {endDecorator !== undefined && (
            <span className="tbtn-end" aria-hidden="true">{endDecorator}</span>
          )}
        </>
      ) : children}
    </MuiToggleButton>
  );
}

// --- ToggleButtonGroup -------------------------------------------------------

export function ToggleButtonGroup({
  variant = 'primary',
  size = 'medium',
  value,
  defaultValue,
  onChange,
  exclusive = true,
  orientation = 'horizontal',
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['default'];
  const sc = SIZE_MAP[size] || SIZE_MAP.medium;
  const isVertical = orientation === 'vertical';

  const groupSx = {
    // Group container
    gap: 0,
    border: styles.style === 'ghost' ? 'none' : '1px solid ' + styles.border,
    borderRadius: 'var(--Style-Border-Radius)',
    overflow: 'hidden',
    ...(fullWidth && { width: '100%' }),

    // EQUAL SEGMENTS, and they must not resize as the selection moves.
    //
    // MUI groups buttons by putting margin-left:-1px and a transparent left
    // border on every button after the first, then REMOVING both when two
    // adjacent buttons are selected — so the control changed width as you
    // clicked. On top of that the divider sits on :not(:last-of-type), which
    // left the final segment 1px narrower than its neighbours at rest.
    //
    // Grid tracks size the segments identically whatever the content or the
    // state, so nothing reflows on hover, focus or selection.
    display: 'grid',
    gridAutoFlow: isVertical ? 'row' : 'column',
    ...(isVertical ? { gridAutoRows: '1fr' } : { gridAutoColumns: '1fr' }),

    // Neutralise MUI's grouped margin/border rules, including the
    // adjacent-selected reset that was the actual source of the movement.
    '& .MuiToggleButtonGroup-grouped': {
      margin: 0,
      borderLeft: 0,
      borderTop: 0,
      '&.Mui-selected + &.Mui-selected': { marginLeft: 0, marginTop: 0, borderLeft: 0, borderTop: 0 },
    },

    // All toggle buttons in the group
    '& .MuiToggleButton-root': {
      height: sc.height,
      fontSize: sc.fontSize,
      padding: sc.padding,
      fontFamily: 'inherit',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0',
      lineHeight: 1.4,
      backgroundColor: styles.bg,
      color: styles.text,
      border: 'none',
      borderRadius: 0,
      transition: 'background-color 0.15s ease, color 0.15s ease',

      // Slot layout — the same 2px gap Button uses between its decorators
      // and label, so the two components space their contents identically.
      '& .tbtn-start, & .tbtn-end': {
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        '& > *': { width: sc.iconSize, height: sc.iconSize, display: 'block' },
      },
      '& .tbtn-start': { marginRight: '2px' },
      '& .tbtn-end': { marginLeft: '2px' },

      // Swatch — a colour chip, sized to the segment's icon box so it lines up
      // with an icon in the same slot position.
      '& .tbtn-swatch': {
        display: 'block',
        flexShrink: 0,
        width: sc.iconSize,
        height: sc.iconSize,
        borderRadius: sc.swatchRadius,
        border: '1px solid var(--Border-Variant)',
      },
      '& .tbtn-swatch:not(:only-child)': { marginRight: '2px' },

      // Bevel geometry, same contract as Button and Slider: the consuming
      // element sets --_height and --_bevel, bevelShadow() reads them.
      '--_height': sc.height,
      '--_bevel': 'var(--Button-Bevel-Px, min(calc(var(--Button-Bevel, 0) * var(--_height) / 100), calc(var(--_height) / 5)))',
      ...(fullWidth && { flex: 1 }),

      // Dividers between buttons
      // Ghost has no dividers either — it is chromeless by definition.
      ...(styles.style === 'ghost' ? {} : isVertical ? {
        '&:not(:last-of-type)': {
          borderBottom: '1px solid ' + styles.border,
        },
      } : {
        '&:not(:last-of-type)': {
          borderRight: '1px solid ' + styles.border,
        },
      }),

      // Hover
      '&:hover': {
        backgroundColor: styles.hover,
        color: styles.hoverText,
      },

      // Selected — the filled segment carries the bevel, like a solid Button.
      // Unselected segments are transparent, so a bevel there would draw an
      // edge around nothing.
      '&.Mui-selected': {
        backgroundColor: styles.selectedBg,
        color: styles.selectedText,
        ...(styles.bevel ? { boxShadow: bevelShadow(styles.color) } : {}),
        ...(styles.selectedRing ? { boxShadow: styles.selectedRing } : {}),
      },

      // Selected + hover
      '&.Mui-selected:hover': {
        backgroundColor: styles.selectedBg,
        color: styles.selectedText,
        ...(styles.bevel ? { boxShadow: bevelShadow(styles.color) } : {}),
        ...(styles.selectedRing ? { boxShadow: styles.selectedRing } : {}),
      },

      // Focus visible
      '&.Mui-focusVisible': {
        outline: '2px solid var(--Focus-Visible)',
        outlineOffset: '-2px',
        zIndex: 1,
      },

      // Disabled
      '&.Mui-disabled': {
        opacity: 0.6,
        color: styles.text,
        backgroundColor: styles.bg,
      },
      '&.Mui-disabled.Mui-selected': {
        opacity: 0.6,
        backgroundColor: styles.selectedBg,
        color: styles.selectedText,
      },

      // Icon sizing
      '& .MuiSvgIcon-root': {
        fontSize: sc.iconSize,
      },

      // Gap between icon and text
      '& > *:not(:only-child)': {
        marginRight: sc.gap / 2,
        marginLeft: sc.gap / 2,
      },
    },

    ...sx,
  };

  return (
    <MuiToggleButtonGroup
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      exclusive={exclusive}
      orientation={orientation}
      disabled={disabled}
      className={'toggle-group-' + variant + ' ' + className}
      sx={groupSx}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </MuiToggleButtonGroup>
  );
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Primary (single variant)
export const DefaultToggleButtonGroup     = (p) => <ToggleButtonGroup variant="default"     {...p} />;
export const PrimaryToggleButtonGroup     = (p) => <ToggleButtonGroup variant="primary"     {...p} />;
export const SecondaryToggleButtonGroup   = (p) => <ToggleButtonGroup variant="secondary"   {...p} />;
export const TertiaryToggleButtonGroup    = (p) => <ToggleButtonGroup variant="tertiary"    {...p} />;
export const NeutralToggleButtonGroup     = (p) => <ToggleButtonGroup variant="neutral"     {...p} />;
export const BlackWhiteToggleButtonGroup  = (p) => <ToggleButtonGroup variant="black-white" {...p} />;
export const InfoToggleButtonGroup        = (p) => <ToggleButtonGroup variant="info"        {...p} />;
export const SuccessToggleButtonGroup     = (p) => <ToggleButtonGroup variant="success"     {...p} />;
export const WarningToggleButtonGroup     = (p) => <ToggleButtonGroup variant="warning"     {...p} />;
export const ErrorToggleButtonGroup       = (p) => <ToggleButtonGroup variant="error"       {...p} />;


export default ToggleButtonGroup;
