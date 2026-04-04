// src/components/Chip/Chip.js
import React, { forwardRef } from 'react';
import { Chip as MuiChip, Avatar as MuiAvatar, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Chip Component
 * Compact element representing an input, attribute, or action
 *
 * VARIANTS:
 *   SOLID   variant="{color}"           filled chip, all 8 colors
 *   OUTLINE variant="{color}-outline"   bordered chip, all 8 colors
 *   LIGHT   variant="{color}-light"     filled + bordered chip, all 8 colors
 *
 * SIZES: small (24px) | medium (32px) | large (40px)
 *   - All sizes maintain 24x24 minimum touch target (WCAG 2.2 AA)
 *   - Small chips use ::after pseudo-element for touch area
 *   - Delete button is always 24x24, so deletable chips are forced to large
 *
 * FEATURES:
 *   clickable:       onClick handler, cursor pointer, hover/active states
 *   disabled:        reduced opacity, no interactions
 *   onDelete:        shows delete icon, forces large size (24x24 delete target)
 *   startDecorator:  icon or avatar before label
 *   endDecorator:    icon or avatar after label (before delete if present)
 *   selectionMode:   'radio' | 'checkbox' -- adds aria role, visual selected state
 *   selected:        controlled selected state for radio/checkbox mode
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

function solidStyles(color) {
  const C = cap(color);
  return {
    bg:       'var(--Buttons-' + C + '-Button)',
    text:     'var(--Buttons-' + C + '-Text)',
    border:   'none',
    hoverBg:  'var(--Buttons-' + C + '-Hover)',
    activeBg: 'var(--Buttons-' + C + '-Active)',
  };
}

function outlineStyles(color) {
  const C = cap(color);
  return {
    bg:       'var(--Background)',
    text:     'var(--Text)',
    border:   '1px solid var(--Buttons-' + C + '-Border)',
    hoverBg:  'var(--Hover)',
    activeBg: 'var(--Hover)',
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    bg:       'var(--Buttons-' + C + '-Button)',
    text:     'var(--Buttons-' + C + '-Text)',
    border:   '1px solid var(--Buttons-' + C + '-Border)',
    hoverBg:  'var(--Buttons-' + C + '-Hover)',
    activeBg: 'var(--Buttons-' + C + '-Active)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color]                = solidStyles(color);
    map[color + '-outline']   = outlineStyles(color);
    map[color + '-light']     = lightStyles(color);
  });
  return map;
}

// --- Sizing ------------------------------------------------------------------

const SIZE_MAP = {
  small:  { height: 24, fontSize: '12px', iconSize: 16, padding: '0 8px',  deleteSize: 16, gap: 4 },
  medium: { height: 32, fontSize: '13px', iconSize: 18, padding: '0 12px', deleteSize: 18, gap: 6 },
  large:  { height: 40, fontSize: '14px', iconSize: 20, padding: '0 16px', deleteSize: 24, gap: 8 },
};

// --- Delete Icon Button ------------------------------------------------------

const ChipDeleteButton = forwardRef(function ChipDeleteButton({ size, onClick, ...props }, ref) {
  const deleteSize = size === 'large' ? 24 : size === 'medium' ? 18 : 16;
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
  size: sizeProp = 'medium',
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
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['primary'];

  // Delete button requires large chip (24x24 delete icon needs space)
  const effectiveSize = onDelete ? 'large' : sizeProp;
  const sc = SIZE_MAP[effectiveSize] || SIZE_MAP.medium;

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

  // Selected visual state
  const selectedOutline = selected ? {
    outline: '2px solid var(--Buttons-Primary-Button)',
    outlineOffset: '1px',
  } : {};

  const displayLabel = label || children;

  const chipSx = {
    height: sc.height,
    fontSize: sc.fontSize,
    fontWeight: 500,
    fontFamily: 'inherit',
    borderRadius: (sc.height / 2) + 'px',
    padding: sc.padding,
    boxSizing: 'border-box',
    position: 'relative',

    backgroundColor: styles.bg,
    color: styles.text,
    border: styles.border,

    ...selectedOutline,

    // 24x24 minimum touch target for small chips
    ...(effectiveSize === 'small' && {
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
    }),

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
        <ChipDeleteButton
          size={effectiveSize}
          onClick={onDelete}
        />
      )}
    </Box>
  );

  return (
    <MuiChip
      label={labelContent}
      clickable={isClickable && !disabled}
      disabled={disabled}
      onClick={isClickable ? onClick : undefined}
      className={'chip-' + variant + ' ' + className}
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

// Outline
export const PrimaryOutlineChip    = (p) => <Chip variant="primary-outline"    {...p} />;
export const SecondaryOutlineChip  = (p) => <Chip variant="secondary-outline"  {...p} />;
export const TertiaryOutlineChip   = (p) => <Chip variant="tertiary-outline"   {...p} />;
export const NeutralOutlineChip    = (p) => <Chip variant="neutral-outline"    {...p} />;
export const InfoOutlineChip       = (p) => <Chip variant="info-outline"       {...p} />;
export const SuccessOutlineChip    = (p) => <Chip variant="success-outline"    {...p} />;
export const WarningOutlineChip    = (p) => <Chip variant="warning-outline"    {...p} />;
export const ErrorOutlineChip      = (p) => <Chip variant="error-outline"      {...p} />;

// Light
export const PrimaryLightChip    = (p) => <Chip variant="primary-light"    {...p} />;
export const SecondaryLightChip  = (p) => <Chip variant="secondary-light"  {...p} />;
export const TertiaryLightChip   = (p) => <Chip variant="tertiary-light"   {...p} />;
export const NeutralLightChip    = (p) => <Chip variant="neutral-light"    {...p} />;
export const InfoLightChip       = (p) => <Chip variant="info-light"       {...p} />;
export const SuccessLightChip    = (p) => <Chip variant="success-light"    {...p} />;
export const WarningLightChip    = (p) => <Chip variant="warning-light"    {...p} />;
export const ErrorLightChip      = (p) => <Chip variant="error-light"      {...p} />;

export default Chip;
