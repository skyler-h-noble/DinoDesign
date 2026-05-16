// src/components/Button/Button.js
import React from 'react';
import { Button as MuiButton, Avatar as MuiAvatar, Box, GlobalStyles } from '@mui/material';
import { Button as ButtonTypography, ButtonSmall as ButtonSmallTypography, ButtonExtraSmall as ButtonExtraSmallTypography } from '../Typography';
import { Avatar as DDAvatar } from '../Avatar/Avatar';
import { Icon as DDIcon } from '../Icon/Icon';
import { Badge as DDBadge } from '../Badge/Badge';

// Auto-size mapping for start/end decorators based on Button size
const DECORATOR_SIZE_MAP = {
  small:  { avatar: 'xxx-small', icon: 'small'  },
  medium: { avatar: 'xx-small',  icon: 'medium' },
  large:  { avatar: 'small',     icon: 'large'  },
};

// Auto-detect decorator type by React element type and resize it.
// - Avatar → cloned with avatar size for the button size
// - Icon   → cloned with icon size for the button size
// - Other (raw MUI SvgIcon, etc.) → returned as-is so MUI's startIcon/endIcon
//   slot can size it via inherited font-size.
function resolveDecorator(node, buttonSize) {
  if (!React.isValidElement(node)) return node;
  const mapping = DECORATOR_SIZE_MAP[buttonSize] || DECORATOR_SIZE_MAP.medium;
  if (node.type === DDAvatar) {
    return React.cloneElement(node, { size: mapping.avatar });
  }
  if (node.type === DDIcon) {
    return React.cloneElement(node, { size: mapping.icon });
  }
  return node;
}

/**
 * Button Component
 * Full-featured button with complete design system integration
 *
 * ─── STRUCTURE (matches Figma) ─────────────────────────────────────────────────
 *
 * Button-Container (outer)
 *   border: 1px solid var(--Buttons-{Color}-Border)
 *   border-radius: var(--Button-Radius)
 *   box-shadow: elevation (5 dropshadow layers)
 *   padding: 1px (gap between border and inner)
 *
 *   Button-Contents (inner)
 *     background: var(--Buttons-{Color}-Button)
 *     border-radius: var(--Button-Inner-Radius)  ← radius - 1
 *     contains: Slot (icon) + Typography + Slot2 (icon)
 *
 *     Bevel Overlay (pseudo-element)
 *       pointer-events: none
 *       inset shadow: highlight top-left, lowlight bottom-right
 *
 * ─── VARIANTS ────────────────────────────────────────────────────────────────
 *
 * SOLID   — variant="{color}"
 * OUTLINE — variant="{color}-outline"
 * LIGHT   — variant="{color}-light"
 * GHOST   — variant="ghost"
 *
 * ─── SIZES ───────────────────────────────────────────────────────────────────
 *   small:  var(--Small-Button-Height)
 *   medium: var(--Button-Height)
 *   large:  var(--Large-Button-Height)
 *
 * ─── CONTENT TYPES ───────────────────────────────────────────────────────────
 *   text, number/letter, icon, avatar, swatch
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Effect Levels (from base.css) ──────────────────────────────────────────
// Normal buttons:   Level 1 resting, Level 2 hover
// Elevated buttons: Level 2 resting, Level 3 hover

// ─── Bevel Shadow (per-color, per-size) ─────────────────────────────────────
// Uses --_bevel (computed from % × height) and per-color Highlight/Lowlight

function bevelShadow(color) {
  const C = cap(color);
  return [
    `inset calc(-1 * var(--_bevel)) calc(-1 * var(--_bevel)) var(--_bevel) rgba(var(--Buttons-${C}-Lowlight), var(--Button-Bevel-Opacity, 0.5))`,
    `inset var(--_bevel) var(--_bevel) var(--_bevel) rgba(var(--Buttons-${C}-Highlight), var(--Button-Bevel-Opacity, 0.5))`,
  ].join(', ');
}

// ─── Variant Style Builders ───────────────────────────────────────────────────

function solidStyles(color, elevated = false) {
  const C = cap(color);
  const bevel = bevelShadow(color);
  const restLevel = elevated ? 'var(--Effect-Level-1)' : 'none';
  const hoverLevel = elevated ? 'var(--Effect-Level-2)' : 'var(--Effect-Level-1)';
  const restShadow = restLevel === 'none' ? bevel : `${bevel}, ${restLevel}`;
  const hoverShadow = `${bevel}, ${hoverLevel}`;
  return {
    backgroundColor: `var(--Buttons-${C}-Button)`,
    color: `var(--Buttons-${C}-Text)`,
    border: `var(--Button-Border-Width) solid var(--Buttons-${C}-Border)`,
    boxShadow: restShadow,
    position: 'relative',
    zIndex: 1,
    '& .MuiTouchRipple-rippleVisible': {
      color: `var(--Buttons-${C}-Hover)`,
      zIndex: -1,
    },
    '&:hover': {
      backgroundColor: `var(--Buttons-${C}-Hover)`,
      boxShadow: hoverShadow,
    },
    '&:active': {
      backgroundColor: `var(--Buttons-${C}-Active)`,
      boxShadow: bevel, // No elevation on press
    },
    '&.Mui-focusVisible': {
      backgroundColor: `var(--Buttons-${C}-Button)`,
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
    },
    '& .MuiTouchRipple-root': { zIndex: -1 },
    '& .MuiTypography-root': { zIndex: 1 },
    '& .MuiButton-icon': { zIndex: 1 },
  };
}

function outlineStyles(color) {
  const C = cap(color);
  return {
    backgroundColor: 'transparent',
    color: 'var(--Text)',
    border: `var(--Button-Border-Width) solid var(--Buttons-${C}-Border)`,
    boxShadow: 'none',
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Hover)',
    },
    '&:hover': {
      backgroundColor: 'var(--Hover)',
      boxShadow: 'none',
    },
    '&:active': {
      backgroundColor: 'var(--Active)',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'transparent',
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
    },
  };
}

function lightStyles(color, elevated = false) {
  const C = cap(color);
  const restLevel = elevated ? 'var(--Effect-Level-1)' : 'none';
  const hoverLevel = elevated ? 'var(--Effect-Level-2)' : 'var(--Effect-Level-1)';
  return {
    backgroundColor: `var(--${C}-Color-11)`,
    color: `var(--Text-${C}-Color-11)`,
    border: `var(--Button-Border-Width) solid var(--Buttons-${C}-Border)`,
    boxShadow: restLevel,
    '& .MuiTouchRipple-rippleVisible': {
      color: `var(--Hover-${C}-Color-11)`,
    },
    '&:hover': {
      backgroundColor: `var(--Hover-${C}-Color-11)`,
      boxShadow: hoverLevel,
    },
    '&:active': {
      backgroundColor: `var(--Active-${C}-Color-11)`,
      boxShadow: 'none',
    },
    '&.Mui-focusVisible': {
      backgroundColor: `var(--${C}-Color-11)`,
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
    },
  };
}

function ghostStyles(isTextContent) {
  return {
    backgroundColor: 'transparent',
    color: 'var(--Hotlink)',
    border: 'var(--Button-Border-Width) solid transparent',
    boxShadow: 'none',
    textDecoration: 'none',
    ...(isTextContent && {
      // Underline lives on the text wrapper only — not on the button root or
      // arbitrary spans — so it never propagates into the start/end decorator
      // slots (icons, avatars and their inner spans).
      '& .btn-text-content': { textDecoration: 'underline' },
    }),
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Hover)',
    },
    '&:hover': {
      backgroundColor: 'var(--Hover)',
      boxShadow: 'none',
      ...(isTextContent && {
        '& .btn-text-content': { textDecoration: 'none' },
      }),
    },
    '&:active': {
      backgroundColor: 'var(--Active)',
      ...(isTextContent && {
        '& .btn-text-content': { textDecoration: 'none' },
      }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'transparent',
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
      ...(isTextContent && {
        '& .btn-text-content': { textDecoration: 'none' },
      }),
    },
  };
}

function buildVariantMap(isTextContent, elevated = false) {
  const map = {};
  COLORS.forEach((color) => {
    map[color]                = solidStyles(color, elevated);
    map[`${color}-outline`]   = outlineStyles(color);
    map[`${color}-light`]     = lightStyles(color, elevated);
  });
  map['danger']         = solidStyles('error', elevated);
  map['outline']        = outlineStyles('default');
  map['ghost']          = ghostStyles(isTextContent);
  map['text']           = ghostStyles(isTextContent);
  return map;
}

// ─── Sizing ───────────────────────────────────────────────────────────────────

const SIZE_HEIGHT = {
  small:  'var(--Small-Button-Height)',
  medium: 'var(--Button-Height)',
  large:  'var(--Large-Button-Height)',
};

const SIZE_BASE = {
  small:  { minHeight: 'var(--Small-Button-Height)', minWidth: 'var(--Small-Button-Height)', fontSize: '13px', '--_height': 'var(--Small-Button-Height)' },
  large:  { minHeight: 'var(--Large-Button-Height)', minWidth: 'var(--Large-Button-Height)', fontSize: '17px', '--_height': 'var(--Large-Button-Height)' },
  medium: {
    minHeight: 'var(--Button-Height)',
    minWidth:  'var(--Button-Min-Width)',
    fontSize:  '15px',
    '--_height': 'var(--Button-Height)',
  },
};

function getSizingStyles({ size, iconOnly, letterNumber, avatar }) {
  const base       = SIZE_BASE[size] || SIZE_BASE.medium;
  const squareSize = SIZE_HEIGHT[size] || SIZE_HEIGHT.medium;

  // Icon / Avatar — fixed square, no padding, no min-width/height
  if (iconOnly) {
    const fontSize = avatar
      ? (size === 'small' ? 'var(--Button-ExtraSmall-Font-Size)' : size === 'large' ? '18px' : '14px')
      : (size === 'small' ? '0.875rem' : base.fontSize);
    return {
      height:  squareSize,
      width:   squareSize,
      minWidth: 'unset',
      minHeight: 'unset',
      fontSize,
      padding: '0',
      '--_height': squareSize,
    };
  }

  // Letter / Number — square minimum, grows with content, no padding on shell
  if (letterNumber) {
    return {
      ...base,
      minHeight: squareSize,
      minWidth:  squareSize,
      padding: '0',
    };
  }

  // Text — minHeight from token, minWidth from SIZE_BASE
  const PADDING_X_BY_SIZE = {
    small:  'var(--Sm-Button-Padding)',
    medium: 'var(--Button-Padding)',
    large:  'var(--Large-Button-Padding)',
  };
  return {
    ...base,
    padding: `0 ${PADDING_X_BY_SIZE[size] || PADDING_X_BY_SIZE.medium}`,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'default',
  size = 'medium',
  elevated = false,
  fullWidth = false,
  disabled = false,
  iconOnly = false,
  letterNumber = false,
  avatar = false,
  swatch = false,
  swatchColor,
  startIcon,
  endIcon,
  startDecorator,
  endDecorator,
  // Badge — optional count/status indicator anchored to the button corner.
  // When `badge` is true, the rendered button is wrapped in the design-system
  // Badge so positioning, colors, and theming match the standalone component.
  badge = false,
  badgeContent,
  badgeVariant = 'error',
  badgeSize,
  badgeDot = false,
  badgeMax = 99,
  badgeAnchorOrigin = { vertical: 'top', horizontal: 'right' },
  children,
  className = '',
  sx = {},
  ...props
}) {
  const isIconOnly     = iconOnly || avatar || swatch;
  const isTextContent  = !isIconOnly;
  const effectiveFullWidth = fullWidth && !isIconOnly && !letterNumber;

  // Ghost avatars/swatches fallback to primary
  const effectiveVariant = ((avatar || swatch) && (variant === 'ghost' || variant === 'text'))
    ? 'primary'
    : variant;

  const variantMap     = buildVariantMap(isTextContent, elevated);
  const variantStyles  = variantMap[effectiveVariant] || variantMap.default;
  const sizingStyles   = getSizingStyles({ size, iconOnly: isIconOnly, letterNumber, avatar });

  const TypographyComp = size === 'small' ? ButtonSmallTypography : ButtonTypography;

  const renderChildren = () => {
    if (isIconOnly) return children;

    if (letterNumber) {
      const LetterComp = size === 'small' ? ButtonExtraSmallTypography : TypographyComp;
      return (
        <LetterComp
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
        </LetterComp>
      );
    }

    if (typeof children === 'string' || typeof children === 'number') {
      return (
        <Box
          component="span"
          className="btn-text-content"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          <TypographyComp
            component="span"
            sx={{
              color: 'inherit',
              lineHeight: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            {children}
          </TypographyComp>
        </Box>
      );
    }
    return children;
  };

  const renderStartIcon = () => {
    if (avatar && children) {
      const avatarSize     = SIZE_HEIGHT[size] || SIZE_HEIGHT.medium;
      const avatarFontSize = size === 'small' ? 'var(--Button-ExtraSmall-Font-Size)' : size === 'large' ? '18px' : '14px';
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

  // Decorators take precedence over legacy startIcon/endIcon
  const resolvedStartDecorator = startDecorator !== undefined
    ? resolveDecorator(startDecorator, size)
    : undefined;
  const resolvedEndDecorator = endDecorator !== undefined
    ? resolveDecorator(endDecorator, size)
    : undefined;

  // Default the badge size to match the button size when not explicitly set.
  // Badge only ships small/medium/large; "medium" is a safe fallback for any
  // future button sizes that don't have a 1:1 badge mapping.
  const resolvedBadgeSize = badgeSize
    || (size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium');

  const out = (
    <>
      <GlobalStyles styles={{
        '[class*="btn-"] .MuiButton-startIcon, [class*="btn-"] .MuiButton-icon': {
          marginLeft: '0px !important',
          marginRight: '2px !important',
        },
        '[class*="btn-"] .MuiButton-endIcon': {
          marginLeft: '2px !important',
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
      startIcon={resolvedStartDecorator !== undefined
        ? resolvedStartDecorator
        : (avatar ? renderStartIcon() : startIcon)}
      endIcon={resolvedEndDecorator !== undefined ? resolvedEndDecorator : endIcon}
      className={`btn-${variant} ${className}`}
      role="button"
      sx={{
        borderRadius: avatar
          ? 'var(--Large-Button-Height)'
          : (iconOnly || swatch)
            ? 'var(--Button-Icon-Radius)'
            : 'var(--Button-Radius)',
        textTransform: 'none',
        fontWeight: 'inherit',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        '--_bevel': 'calc(var(--Button-Bevel) * var(--_height) / 100)',

        ...sizingStyles,
        ...variantStyles,

        // Force padding override
        '&.MuiButton-root': {
          padding: sizingStyles.padding ?? '0 var(--Sizing-1)',
        },

        // Icon margins + color inheritance
        '& .MuiButton-startIcon': {
          display: 'inherit',
          color: 'inherit',
          padding: '0 2px',
          marginLeft: '0px !important',
          marginRight: avatar ? '0px !important' : '2px !important',
        },
        ...(avatar && {
          '& .MuiAvatar-root': {
            fontSize: size === 'small' ? 'var(--Button-ExtraSmall-Font-Size)' : size === 'large' ? '18px' : '14px',
          },
        }),
        '& .MuiButton-endIcon': {
          display: 'inherit',
          color: 'inherit',
          padding: '0 2px',
          marginLeft: '2px !important',
          marginRight: '0px !important',
        },
        '& .MuiSvgIcon-root': { color: 'inherit' },

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
          boxShadow: 'none',
        },

        ...(swatch && {
          border: 'var(--Button-Border-Width) solid var(--Border)',
          padding: '1px',
          width: SIZE_HEIGHT[size] || SIZE_HEIGHT.medium,
          height: SIZE_HEIGHT[size] || SIZE_HEIGHT.medium,
          minWidth: 'unset',
          minHeight: 'unset',
          boxShadow: 'none',
          '--_bevel': '0',
          backgroundColor: 'transparent !important',
          '&:hover': { backgroundColor: 'transparent !important', boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
          '&:hover .btn-swatch-inner': { filter: 'brightness(0.9)' },
        }),
        ...(effectiveFullWidth && { width: '100%' }),
        ...sx,
      }}
      {...props}
      {...(swatch ? { style: { backgroundColor: 'transparent' } } : {})}
    >
      {avatar ? null : swatch ? (
        <Box
          className="btn-swatch-inner"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'calc(var(--Button-Icon-Radius) - 2px)',
            ...(swatchColor ? { backgroundColor: swatchColor } : {}),
          }}
        />
      ) : renderChildren()}
    </MuiButton>
    </>
  );

  // Wrap in Badge if requested. Done after assembly so all the button-internal
  // styling (variant, size, sizing overrides, focus, etc.) is unaffected — the
  // badge just decorates the corner.
  if (badge) {
    return (
      <DDBadge
        variant={badgeVariant}
        size={resolvedBadgeSize}
        badgeContent={badgeContent}
        dot={badgeDot}
        max={badgeMax}
        anchorOrigin={badgeAnchorOrigin}
        showZero={badgeContent === 0}
      >
        {out}
      </DDBadge>
    );
  }
  return out;
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
