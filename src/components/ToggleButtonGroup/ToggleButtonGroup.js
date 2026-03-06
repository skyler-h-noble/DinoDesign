// src/components/ToggleButtonGroup/ToggleButtonGroup.js
import React from 'react';
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButton as MuiToggleButton,
} from '@mui/material';
import { Body, BodySmall } from '../Typography';

/**
 * ToggleButtonGroup Component
 * Full-featured toggle button group with design system integration
 *
 * VARIANTS:
 *   PRIMARY   variant="primary"           primary color only
 *   LIGHT     variant="{color}-light"     light tint, all 8 colors
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
 *   LIGHT:
 *     Group border:   var(--Buttons-{Color}-Light-Border)
 *     Selected bg:    var(--Buttons-{Color}-Light-Button)
 *     Selected text:  var(--Buttons-{Color}-Light-Text)
 *     Unselected bg:  transparent
 *     Unselected text:var(--Quiet)
 *     Hover bg:       var(--Buttons-Primary-Hover)
 *
 * SIZES: small | medium | large
 * ORIENTATION: horizontal (default) | vertical
 * SELECTION: exclusive (single) | non-exclusive (multiple)
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

function primaryStyles() {
  return {
    border:       'var(--Buttons-Primary-Border)',
    bg:           'transparent',
    text:         'var(--Quiet)',
    hover:        'var(--Buttons-Primary-Hover)',
    hoverText:    'var(--Buttons-Primary-Text)',
    selectedBg:   'var(--Buttons-Primary-Button)',
    selectedText: 'var(--Buttons-Primary-Text)',
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    border:       'var(--Buttons-' + C + '-Light-Border)',
    bg:           'transparent',
    text:         'var(--Quiet)',
    hover:        'var(--Buttons-Primary-Hover)',
    hoverText:    'var(--Buttons-Primary-Text)',
    selectedBg:   'var(--Buttons-' + C + '-Light-Button)',
    selectedText: 'var(--Buttons-' + C + '-Light-Text)',
  };
}

function buildVariantMap() {
  const map = {};
  map['primary'] = primaryStyles();
  COLORS.forEach((color) => {
    map[color + '-light'] = lightStyles(color);
  });
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { height: '32px', fontSize: '13px', padding: '4px 10px', iconSize: 16, gap: 4 },
  medium: { height: 'var(--Button-Height)', fontSize: '15px', padding: '6px 14px', iconSize: 18, gap: 6 },
  large:  { height: '48px', fontSize: '17px', padding: '8px 18px', iconSize: 20, gap: 8 },
};

// --- ToggleButton (individual) -----------------------------------------------

export function ToggleButton({
  value,
  children,
  disabled = false,
  sx = {},
  ...props
}) {
  return (
    <MuiToggleButton
      value={value}
      disabled={disabled}
      sx={sx}
      {...props}
    >
      {children}
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
  const styles = variantMap[variant] || variantMap['primary'];
  const sc = SIZE_MAP[size] || SIZE_MAP.medium;
  const isVertical = orientation === 'vertical';

  const groupSx = {
    // Group container
    gap: 0,
    border: '1px solid ' + styles.border,
    borderRadius: 'var(--Style-Border-Radius)',
    overflow: 'hidden',
    ...(fullWidth && { width: '100%' }),
    ...(isVertical && { flexDirection: 'column' }),

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
      ...(fullWidth && { flex: 1 }),

      // Dividers between buttons
      ...(isVertical ? {
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

      // Selected
      '&.Mui-selected': {
        backgroundColor: styles.selectedBg,
        color: styles.selectedText,
      },

      // Selected + hover
      '&.Mui-selected:hover': {
        backgroundColor: styles.selectedBg,
        color: styles.selectedText,
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
export const PrimaryToggleButtonGroup         = (p) => <ToggleButtonGroup variant="primary"              {...p} />;

// Light
export const PrimaryLightToggleButtonGroup    = (p) => <ToggleButtonGroup variant="primary-light"        {...p} />;
export const SecondaryLightToggleButtonGroup  = (p) => <ToggleButtonGroup variant="secondary-light"      {...p} />;
export const TertiaryLightToggleButtonGroup   = (p) => <ToggleButtonGroup variant="tertiary-light"       {...p} />;
export const NeutralLightToggleButtonGroup    = (p) => <ToggleButtonGroup variant="neutral-light"        {...p} />;
export const InfoLightToggleButtonGroup       = (p) => <ToggleButtonGroup variant="info-light"           {...p} />;
export const SuccessLightToggleButtonGroup    = (p) => <ToggleButtonGroup variant="success-light"        {...p} />;
export const WarningLightToggleButtonGroup    = (p) => <ToggleButtonGroup variant="warning-light"        {...p} />;
export const ErrorLightToggleButtonGroup      = (p) => <ToggleButtonGroup variant="error-light"          {...p} />;

export default ToggleButtonGroup;
