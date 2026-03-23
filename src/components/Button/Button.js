// src/components/Button/Button.js
import React from 'react';
import { Button as MuiButton, Avatar as MuiAvatar, Box, GlobalStyles } from '@mui/material';
import { Button as ButtonTypography, ButtonSmall as ButtonSmallTypography } from '../Typography';

/**
 * Button Component
 * Full-featured button with complete design system integration
 *
 * ─── VARIANTS ────────────────────────────────────────────────────────────────
 *
 * SOLID   — variant="{color}"
 *   BG:         var(--Buttons-{Color}-Button)
 *   Border:     2px solid var(--Buttons-{Color}-Button)
 *   Text:       var(--Buttons-{Color}-Text)
 *   Hover:      var(--Buttons-{Color}-Hover)
 *   Active:     var(--Buttons-{Color}-Active)
 *
 * OUTLINE — variant="{color}-outline"
 *   BG:         transparent
 *   Border:     2px solid var(--Buttons-{Color}-Button)
 *   Text:       var(--Text)
 *   Hover:      var(--Surface-Dim)
 *   Active:     var(--Surface-Dim)
 *
 * LIGHT   — variant="{color}-light"
 *   BG:         var(--{Color}-Color-11)
 *   Border:     2px solid var(--Buttons-{Color}-Button)
 *   Text:       var(--Text-{Color}-Color-11)
 *   Hover:      var(--Hover-{Color}-Color-11)
 *   Active:     var(--Active-{Color}-Color-11)
 *
 * GHOST   — variant="ghost"
 *   BG:         transparent
 *   Border:     2px solid transparent
 *   Text:       var(--Hotlink), underlined
 *   Hover:      var(--Background-Hover)
 *   Active:     var(--Background-Active)
 *
 * ─── SIZES ───────────────────────────────────────────────────────────────────
 *   small:  20px minHeight, 4px padding
 *   medium: var(--Button-Height) minHeight, 4px padding
 *   large:  56px minHeight, var(--Sizing-Half) var(--Sizing-2) padding
 *
 * ─── CONTENT TYPES ───────────────────────────────────────────────────────────
 *   text:       Typography wrapper, padding on button shell
 *   number:     letterNumber prop, padding on inner text box
 *   letter:     letterNumber prop, padding on inner text box
 *   icon:       iconOnly prop, no padding
 *   avatar:     avatar prop, circular, no padding
 *   swatch:     swatch prop, square color block, no content, wrappable in Tooltip
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Variant Style Builders ───────────────────────────────────────────────────

function solidStyles(color) {
  const C = cap(color);
  return {
    backgroundColor: `var(--Buttons-${C}-Button)`,
    color: `var(--Buttons-${C}-Text)`,
    border: `2px solid var(--Buttons-${C}-Border)`,
    boxShadow: 'var(--Shadow-1), var(--Shadow-2), var(--Effect-Level-3)',
    position: 'relative',
    zIndex: 1,
    '& .MuiTouchRipple-rippleVisible': {
      color: `var(--Buttons-${C}-Hover)`,
      zIndex: -1,
    },
    '&:hover': {
      backgroundColor: `var(--Buttons-${C}-Hover)`,
      boxShadow: 'var(--Shadow-1), var(--Shadow-2), var(--Effect-Level-3)',
    },
    '&:active': {
      backgroundColor: 'var(--Buttons-Primary-Active)',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'var(--Focus-Visible)',
    },
    '& .MuiTouchRipple-root': {
      zIndex: -1,
    },
    '& .MuiTypography-root': {
      zIndex: 1,
    }, 
    '& .MuiButton-icon': {
      zIndex: 1,
    }, 

  };
}

function outlineStyles(color) {
  const C = cap(color);
  return {
    backgroundColor: 'transparent',
    color: 'var(--Text)',
    border: `2px solid var(--Buttons-${C}-Border)`,
    boxShadow: 'none',
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Surface-Dim)',
    },
    '&:hover': {
      backgroundColor: 'var(--Buttons-Primary-Hover',
      boxShadow: 'none',
    },
    '&:active': {
      backgroundColor: 'var(--Buttons-Primary-Active)',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'var(--Focus-Visible)',
    },
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    backgroundColor: `var(--${C}-Color-11)`,
    color: `var(--Text-${C}-Color-11)`,
    border: `2px solid var(--Buttons-${C}-Border)`,
    boxShadow: 'var(--Shadow-1), var(--Shadow-2), var(--Effect-Level-3)',
    '& .MuiTouchRipple-rippleVisible': {
      color: `var(--Hover-${C}-Color-11)`,
    },
    '&:hover': {
      backgroundColor: `var(--Hover-${C}-Color-11)`,
      boxShadow: 'var(--Shadow-1), var(--Shadow-2), var(--Effect-Level-3)',
    },
    '&:active': {
      backgroundColor: `var(--Active-${C}-Color-11)`,
    },
    '&.Mui-focusVisible': {
      backgroundColor: `var(--Active-${C}-Color-11)`,
    },
  };
}

function ghostStyles(isTextContent) {
  return {
    backgroundColor: 'transparent',
    color: 'var(--Hotlink)',
    border: '2px solid transparent',
    boxShadow: 'none',
    // Underline for text/letter/number, not for icons
    ...(isTextContent && {
      '& .MuiButton-root, & span, &': { textDecoration: 'underline' },
      textDecoration: 'underline',
    }),
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Background-Hover)',
    },
    // Icons explicitly excluded from underline
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      textDecoration: 'none',
    },
    '&:hover': {
      backgroundColor: 'var(--Background-Hover)',
      boxShadow: 'none',
      ...(isTextContent && {
        textDecoration: 'none',
        '& span': { textDecoration: 'none' },
      }),
    },
    '&:active': {
      backgroundColor: 'var(--Background-Active)',
      ...(isTextContent && {
        textDecoration: 'none',
        '& span': { textDecoration: 'none' },
      }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'var(--Background-Active)',
      ...(isTextContent && {
        textDecoration: 'none',
        '& span': { textDecoration: 'none' },
      }),
    },
  };
}

function buildVariantMap(isTextContent) {
  const map = {};
  COLORS.forEach((color) => {
    map[color]                = solidStyles(color);
    map[`${color}-outline`]   = outlineStyles(color);
    map[`${color}-light`]     = lightStyles(color);
  });
  map['danger']         = solidStyles('error');
  map['outline']        = outlineStyles('default');
  map['ghost']          = ghostStyles(isTextContent);
  map['text']           = ghostStyles(isTextContent);
  return map;
}

// ─── Sizing ───────────────────────────────────────────────────────────────────
// All styles share identical minHeight/minWidth per size
// Padding rules:
//   text          → 0 var(--Sizing-1) on button shell
//   letter/number → 0 on button shell; 4px padding on inner text box
//   icon/avatar   → 0 on button shell; no inner wrapper

const SIZE_BASE = {
  small:  { minHeight: '24px', minWidth: '24px',  fontSize: '13px' },
  large:  { minHeight: '56px', minWidth: '56px',  fontSize: '17px' },
  medium: {
    minHeight: 'var(--Button-Height)',
    minWidth:  'max(var(--Min-Button-Width), var(--Button-Height))',
    fontSize: '15px',
  },
};

function getSizingStyles({ size, iconOnly, letterNumber, avatar }) {
  const base = SIZE_BASE[size] || SIZE_BASE.medium;

  // Icon / Avatar — no padding, fixed square
  if (iconOnly) {
    const squareSize = size === 'small' ? '24px' : 
                       size === 'large' ? '64px' : 
                       'var(--Button-Height)';
    const fontSize = avatar
      ? (size === 'small' ? '12px' : size === 'large' ? '18px' : '14px')
      : (size === 'small' ? '1rem' : base.fontSize);
    return {
      minHeight: squareSize,
      minWidth: squareSize,
      maxWidth: squareSize,
      fontSize,
      padding: '0',
    };
  }

  // Letter / Number — no maxWidth, grows with content, no padding on shell
  if (letterNumber) {
    const letterHeight = size === 'small' ? '24px'
                       : size === 'large' ? '64px'
                       : 'var(--Button-Height)';
    return {
      ...base,
      minHeight: letterHeight,
      minWidth:  letterHeight,
      padding: '0',
    };
  }

  // Text — horizontal padding on shell
  return {
    ...base,
    padding: size === 'large'
      ? 'var(--Sizing-Half) var(--Sizing-2)'
      : 'var(--Sizing-Half) var(--Sizing-1)',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  iconOnly = false,
  letterNumber = false,
  avatar = false,
  swatch = false,
  startIcon,
  endIcon,
  children,
  className = '',
  sx = {},
  ...props
}) {
  // avatar/swatch implies iconOnly sizing
  const isIconOnly     = iconOnly || avatar || swatch;
  const isTextContent  = !isIconOnly;  // text, letter, number all get ghost underline
  
  // Icon, Letter, Number, Avatar, Swatch cannot be full width
  const effectiveFullWidth = fullWidth && !isIconOnly && !letterNumber;
  
  // Ghost avatars/swatches are not clickable-looking, fallback to primary
  const effectiveVariant = ((avatar || swatch) && (variant === 'ghost' || variant === 'text')) 
    ? 'primary' 
    : variant;
  
  const variantMap     = buildVariantMap(isTextContent);
  const variantStyles  = variantMap[effectiveVariant] || variantMap.default;
  const sizingStyles   = getSizingStyles({ size, iconOnly: isIconOnly, letterNumber, avatar });

  // Typography component: small for small size, regular otherwise
  const TypographyComp = size === 'small' ? ButtonSmallTypography : ButtonTypography;

  // Wrap text children in typography, adjust padding based on icon presence
  const renderChildren = () => {
    // Icon/avatar — render as-is, no wrapper
    if (isIconOnly) return children;

    // Letter/Number — 4px padding on inner text box
    if (letterNumber) {
      return (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            color: 'inherit',
            lineHeight: 1,
          }}
        >
          {children}
        </Box>
      );
    }

    // Text — wrap in typography, padding adjusts based on icon position
    if (typeof children === 'string' || typeof children === 'number') {
      const hasLeft  = !!startIcon;
      const hasRight = !!endIcon;
      const paddingLeft  = hasLeft  ? '0' : 'var(--Sizing-Half)';
      const paddingRight = hasRight ? '0' : 'var(--Sizing-Half)';
      const textPadding  = `0 ${paddingRight} 0 ${paddingLeft}`;

      return (
        <TypographyComp
          component="span"
          sx={{
            color: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            padding: textPadding,
          }}
        >
          {children}
        </TypographyComp>
      );
    }
    return children;
  };

  // Avatar variant: circular with sized MuiAvatar - matches button size exactly
  const renderStartIcon = () => {
    if (avatar && children) {
      // Avatar must fill entire button
      const avatarSize = size === 'small' ? '24px' : 
                        size === 'large' ? '64px' : 
                        'var(--Button-Height)';
      const avatarFontSize = size === 'small' ? '12px' :
                             size === 'large' ? '18px' : '14px';
      return (
        <MuiAvatar
          sx={{
            width: avatarSize,
            height: avatarSize,
            backgroundColor: 'inherit',
            color: 'inherit',
            fontSize: avatarFontSize,
          }}
        >
          {children}
        </MuiAvatar>
      );
    }
    return startIcon;
  };

  return (
    <>
      <GlobalStyles styles={{
        '[class*="btn-"] .MuiButton-startIcon, [class*="btn-"] .MuiButton-icon': {
          marginLeft: '0px !important',
          marginRight: '4px !important',
        },
        '[class*="btn-"] .MuiButton-endIcon': {
          marginLeft: '4px !important',
          marginRight: '0px !important',
        },
        '[class*="btn-"] .MuiButton-iconSizeSmall .MuiSvgIcon-root, [class*="btn-"] .MuiButton-iconSizeSmall > *': {
          fontSize: '1rem !important',
        },
      }} />
      <MuiButton
      size={size}
      {...(effectiveFullWidth && { fullWidth: true })}
      disabled={disabled}
      startIcon={avatar ? renderStartIcon() : startIcon}
      endIcon={endIcon}
      className={`btn-${variant} ${className}`}
      role="button"
      sx={{
        borderRadius: avatar ? '50%' : 'var(--Style-Border-Radius)',
        textTransform: 'none',
        fontWeight: 'inherit',
        lineHeight: 1,
        transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',

        ...sizingStyles,
        ...variantStyles,

        // Force padding override — MUI's default 6px 16px wins via class specificity
        '&.MuiButton-root': {
          padding: sizingStyles.padding ?? '0 var(--Sizing-1)',
        },

        // Icon margins
        '& .MuiButton-startIcon': {
          display: 'inherit',
          marginLeft: '0px !important',
          marginRight: avatar ? '0px !important' : '4px !important',
        },
        // Avatar font size override — MUI's .MuiAvatar-root default wins over sx
        ...(avatar && {
          '& .MuiAvatar-root': {
            fontSize: size === 'small' ? '12px' : size === 'large' ? '18px' : '14px',
          },
        }),
        '& .MuiButton-endIcon': {
          display: 'inherit',
          marginLeft: '4px !important',
          marginRight: '0px !important',
        },

        '&:focus-visible, &.Mui-focusVisible': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },

        '&.Mui-disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          pointerEvents: 'none',
          backgroundColor: variantStyles.backgroundColor,
          color: variantStyles.color,
          border: variantStyles.border,
        },

        ...(effectiveFullWidth && { width: '100%' }),
        ...sx,
      }}
      {...props}
    >
      {avatar || swatch ? null : renderChildren()}
    </MuiButton>
    </>
  );
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Default
export const DefaultButton        = (p) => <Button variant="default"           {...p} />;
export const DefaultOutlineButton = (p) => <Button variant="default-outline"   {...p} />;

// Solid
export const PrimaryButton          = (p) => <Button variant="primary"            {...p} />;
export const SecondaryButton        = (p) => <Button variant="secondary"          {...p} />;
export const TertiaryButton         = (p) => <Button variant="tertiary"           {...p} />;
export const NeutralButton          = (p) => <Button variant="neutral"            {...p} />;
export const InfoButton             = (p) => <Button variant="info"               {...p} />;
export const SuccessButton          = (p) => <Button variant="success"            {...p} />;
export const WarningButton          = (p) => <Button variant="warning"            {...p} />;
export const ErrorButton            = (p) => <Button variant="error"              {...p} />;
export const DangerButton           = (p) => <Button variant="error"              {...p} />;

// Outline
export const PrimaryOutlineButton   = (p) => <Button variant="primary-outline"    {...p} />;
export const SecondaryOutlineButton = (p) => <Button variant="secondary-outline"  {...p} />;
export const TertiaryOutlineButton  = (p) => <Button variant="tertiary-outline"   {...p} />;
export const NeutralOutlineButton   = (p) => <Button variant="neutral-outline"    {...p} />;
export const InfoOutlineButton      = (p) => <Button variant="info-outline"       {...p} />;
export const SuccessOutlineButton   = (p) => <Button variant="success-outline"    {...p} />;
export const WarningOutlineButton   = (p) => <Button variant="warning-outline"    {...p} />;
export const ErrorOutlineButton     = (p) => <Button variant="error-outline"      {...p} />;

// Light
export const PrimaryLightButton     = (p) => <Button variant="primary-light"      {...p} />;
export const SecondaryLightButton   = (p) => <Button variant="secondary-light"    {...p} />;
export const TertiaryLightButton    = (p) => <Button variant="tertiary-light"     {...p} />;
export const NeutralLightButton     = (p) => <Button variant="neutral-light"      {...p} />;
export const InfoLightButton        = (p) => <Button variant="info-light"         {...p} />;
export const SuccessLightButton     = (p) => <Button variant="success-light"      {...p} />;
export const WarningLightButton     = (p) => <Button variant="warning-light"      {...p} />;
export const ErrorLightButton       = (p) => <Button variant="error-light"        {...p} />;

// Ghost / Text
export const GhostButton  = (p) => <Button variant="ghost" {...p} />;
export const TextButton   = (p) => <Button variant="text"  {...p} />;

// Aliases
export const OutlineButton = (p) => <Button variant="primary-outline" {...p} />;
export const IconButton    = (p) => <Button iconOnly     {...p} />;
export const LetterButton  = (p) => <Button letterNumber {...p} />;
export const AvatarButton  = (p) => <Button avatar       {...p} />;
export const SwatchButton  = (p) => <Button swatch       {...p} />;

export default Button;