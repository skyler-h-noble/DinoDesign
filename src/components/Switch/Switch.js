// src/components/Switch/Switch.js
import React from 'react';
import { Switch as MuiSwitch, FormControlLabel } from '@mui/material';
import { Body, BodySmall } from '../Typography';

/**
 * Switch Component
 * Full-featured toggle switch with complete design system integration
 *
 * VARIANTS:
 *   SOLID   variant="{color}"           filled track when ON, all 8 colors
 *   OUTLINE variant="{color}-outline"   bordered track + colored thumb, all 8 colors
 *   LIGHT   variant="{color}-light"     tinted track when ON, all 8 colors
 *
 * SIZES: small (10px thumb, 26×14 track) | medium (15px thumb, 34×18 track) | large (18px thumb, 42×22 track)
 *   Root always has min 24×24px for WCAG 2.2 AA touch target.
 *   Thumb is var(--Quiet) in the OFF state, styles.thumb in the ON state.
 *   switchBase uses display:flex + justify-content for thumb positioning.
 *
 * STATES: checked | unchecked | disabled | hover | active | focus-visible
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

function solidStyles(color) {
  const C = cap(color);
  return {
    thumb:          'var(--Buttons-' + C + '-Button)',
    trackOn:        'var(--Buttons-' + C + '-Border)',
    trackOnBorder:  'none',
    trackOff:       'var(--Border-Variant)',
    trackOffBorder: 'none',
    hoverOn:        'var(--Buttons-' + C + '-Hover)',
    hoverOff:       'var(--Surface-Dim)',
    activeOn:       'var(--Buttons-' + C + '-Active)',
    activeOff:      'var(--Border)',
  };
}

function outlineStyles(color) {
  const C = cap(color);
  return {
    thumb:          'var(--Buttons-' + C + '-Border)',
    trackOn:        'transparent',
    trackOnBorder:  '2px solid var(--Buttons-' + C + '-Border)',
    trackOff:       'transparent',
    trackOffBorder: '2px solid var(--Border-Variant)',
    hoverOn:        'var(--Buttons-' + C + '-Hover)',
    hoverOff:       'var(--Surface-Dim)',
    activeOn:       'var(--Buttons-' + C + '-Active)',
    activeOff:      'var(--Border)',
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    thumb:          'var(--Buttons-' + C + '-Border)',
    trackOn:        'var(--' + C + '-Color-11)',
    trackOnBorder:  'none',
    trackOff:       'var(--Border-Variant)',
    trackOffBorder: 'none',
    hoverOn:        'var(--Hover-' + C + '-Color-11)',
    hoverOff:       'var(--Surface-Dim)',
    activeOn:       'var(--Buttons-' + C + '-Active)',
    activeOff:      'var(--Border)',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color]              = solidStyles(color);
    map[color + '-outline'] = outlineStyles(color);
    map[color + '-light']   = lightStyles(color);
  });
  return map;
}

// --- Sizing ------------------------------------------------------------------

const TOUCH_MIN = 24;

const SIZE_MAP = {
  small:  { thumb: 10, trackW: 26, trackH: 14 },
  medium: { thumb: 15, trackW: 34, trackH: 18 },
  large:  { thumb: 18, trackW: 42, trackH: 22 },
};

// Outline variant needs 1px smaller thumb so it doesn't touch the border
const OUTLINE_SIZE_MAP = {
  small:  { thumb: 9,  trackW: 26, trackH: 14 },
  medium: { thumb: 14, trackW: 34, trackH: 18 },
  large:  { thumb: 17, trackW: 42, trackH: 22 },
};

// --- Component ---------------------------------------------------------------

export function Switch({
  variant = 'primary',
  size = 'medium',
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  labelPlacement = 'end',
  name,
  value,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['primary'];
  const isOutline = variant.includes('-outline') || variant === 'outline';
  const sc = (isOutline ? OUTLINE_SIZE_MAP : SIZE_MAP)[size] || (isOutline ? OUTLINE_SIZE_MAP : SIZE_MAP).medium;
  const LabelComp = size === 'small' ? BodySmall : Body;

  const rootH = Math.max(TOUCH_MIN, sc.trackH);
  const trackTop = (rootH - sc.trackH) / 2;

  const switchSx = {
    width: sc.trackW,
    minWidth: TOUCH_MIN,
    height: rootH,
    minHeight: TOUCH_MIN,
    padding: 0,
    overflow: 'visible',

    '& .MuiSwitch-switchBase': {
      width: 'calc(100% - 4px)',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 0,
      left: '2px',
      top: trackTop,
      height: sc.trackH,
      color: 'var(--Quiet)',
      transition: 'justify-content 0.15s ease',
      transform: 'none',

      '& .MuiSwitch-input': {
        left: 0,
        width: '100%',
      },

      // ON state — thumb uses variant color
      // Outline checked: left 3px + width calc(100% - 6px) so thumb clears both borders
      '&.Mui-checked': {
        justifyContent: 'flex-end',
        transform: 'none',
        color: styles.thumb,
        ...(isOutline && { left: '3px', width: 'calc(100% - 6px)' }),

        '& + .MuiSwitch-track': {
          backgroundColor: styles.trackOn,
          border: styles.trackOnBorder,
          opacity: 1,
        },
      },

      // Hover OFF
      '&:hover': {
        backgroundColor: 'transparent',
        '& + .MuiSwitch-track': {
          backgroundColor: styles.hoverOff,
        },
      },

      // Hover ON
      '&.Mui-checked:hover': {
        backgroundColor: 'transparent',
        '& + .MuiSwitch-track': {
          backgroundColor: styles.hoverOn,
          border: styles.trackOnBorder,
          opacity: 1,
        },
      },

      // Active OFF
      '&:active + .MuiSwitch-track': {
        backgroundColor: styles.activeOff,
      },

      // Active ON
      '&.Mui-checked:active + .MuiSwitch-track': {
        backgroundColor: styles.activeOn,
        border: styles.trackOnBorder,
        opacity: 1,
      },

      // Focus visible
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        outline: '2px solid var(--Focus-Visible)',
        outlineOffset: '2px',
      },

      // Disabled
      '&.Mui-disabled': {
        opacity: 0.6,
        color: 'var(--Quiet)',
        '& + .MuiSwitch-track': {
          opacity: 0.6,
        },
      },
      '&.Mui-disabled.Mui-checked': {
        color: styles.thumb,
      },
    },

    '& .MuiSwitch-thumb': {
      width: sc.thumb,
      height: sc.thumb,
      boxShadow: 'none',
      border: 'none',
    },

    '& .MuiSwitch-track': {
      width: sc.trackW,
      height: sc.trackH,
      borderRadius: '56px',
      backgroundColor: styles.trackOff,
      border: styles.trackOffBorder,
      boxSizing: 'border-box',
      opacity: 1,
      position: 'absolute',
      top: trackTop,
      left: 0,
      transition: 'background-color 0.15s ease, border-color 0.15s ease',
    },

    ...sx,
  };

  const switchElement = (
    <MuiSwitch
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      name={name}
      value={value}
      inputProps={{
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
      }}
      className={'switch-' + variant + ' ' + className}
      sx={switchSx}
      disableRipple
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={switchElement}
        label={
          <LabelComp
            component="span"
            sx={{
              color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
              fontSize: size === 'small' ? '13px' : '15px',
              fontWeight: 500,
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {label}
          </LabelComp>
        }
        labelPlacement={labelPlacement}
        sx={{ gap: '8px', marginLeft: 0, marginRight: 0 }}
      />
    );
  }

  return switchElement;
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Solid
export const PrimarySwitch                = (p) => <Switch variant="primary"              {...p} />;
export const SecondarySwitch              = (p) => <Switch variant="secondary"            {...p} />;
export const TertiarySwitch               = (p) => <Switch variant="tertiary"             {...p} />;
export const NeutralSwitch                = (p) => <Switch variant="neutral"              {...p} />;
export const InfoSwitch                   = (p) => <Switch variant="info"                 {...p} />;
export const SuccessSwitch                = (p) => <Switch variant="success"              {...p} />;
export const WarningSwitch                = (p) => <Switch variant="warning"              {...p} />;
export const ErrorSwitch                  = (p) => <Switch variant="error"                {...p} />;

// Outline
export const PrimaryOutlineSwitch         = (p) => <Switch variant="primary-outline"      {...p} />;
export const SecondaryOutlineSwitch       = (p) => <Switch variant="secondary-outline"    {...p} />;
export const TertiaryOutlineSwitch        = (p) => <Switch variant="tertiary-outline"     {...p} />;
export const NeutralOutlineSwitch         = (p) => <Switch variant="neutral-outline"      {...p} />;
export const InfoOutlineSwitch            = (p) => <Switch variant="info-outline"         {...p} />;
export const SuccessOutlineSwitch         = (p) => <Switch variant="success-outline"      {...p} />;
export const WarningOutlineSwitch         = (p) => <Switch variant="warning-outline"      {...p} />;
export const ErrorOutlineSwitch           = (p) => <Switch variant="error-outline"        {...p} />;

// Light
export const PrimaryLightSwitch           = (p) => <Switch variant="primary-light"        {...p} />;
export const SecondaryLightSwitch         = (p) => <Switch variant="secondary-light"      {...p} />;
export const TertiaryLightSwitch          = (p) => <Switch variant="tertiary-light"       {...p} />;
export const NeutralLightSwitch           = (p) => <Switch variant="neutral-light"        {...p} />;
export const InfoLightSwitch              = (p) => <Switch variant="info-light"           {...p} />;
export const SuccessLightSwitch           = (p) => <Switch variant="success-light"        {...p} />;
export const WarningLightSwitch           = (p) => <Switch variant="warning-light"        {...p} />;
export const ErrorLightSwitch             = (p) => <Switch variant="error-light"          {...p} />;

// Legacy alias
export const SwitchInput = Switch;

export default Switch;