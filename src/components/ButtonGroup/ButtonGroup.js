// src/components/ButtonGroup/ButtonGroup.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * ButtonGroup Component
 * Groups multiple Button components into a connected or spaced strip
 *
 * ─── VARIANTS ────────────────────────────────────────────────────────────────
 *   Inherits all Button variants — passed down to all child buttons
 *
 *   PRIMARY — variant="primary"  (primary color only)
 *   OUTLINE — variant="{color}-outline"
 *   LIGHT   — variant="{color}-light"
 *   GHOST   — variant="ghost"
 *
 * ─── SIZES ───────────────────────────────────────────────────────────────────
 *   small | medium (default) | large — passed down to all child buttons
 *
 * ─── ORIENTATION ─────────────────────────────────────────────────────────────
 *   horizontal (default) | vertical
 *
 * ─── SPACING ─────────────────────────────────────────────────────────────────
 *   0 (default): connected — borders collapse, only first/last get radius
 *   > 0: gap between buttons, all buttons keep their full border radius
 *
 * ─── CONTENT TYPES ───────────────────────────────────────────────────────────
 *   All child content types supported: text, icon, letter/number, avatar
 *   Each child can override group-level variant/size/disabled individually
 */

export function ButtonGroup({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  orientation = 'horizontal',
  spacing = 0,
  fullWidth = false,
  children,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
  const isHorizontal = orientation === 'horizontal';
  const isConnected = spacing === 0;
  const childArray = React.Children.toArray(children).filter(Boolean);
  const count = childArray.length;

  // Clone children with group-level props + positional border/radius styling
  const clonedChildren = childArray.map((child, index) => {
    if (!React.isValidElement(child)) return child;

    const isFirst = index === 0;
    const isLast = index === count - 1;

    // Group props cascade — child props always win
    const groupProps = {
      variant: child.props.variant ?? variant,
      size: child.props.size ?? size,
      disabled: child.props.disabled ?? disabled,
    };

    // Connected mode: collapse borders and radius between adjacent buttons
    let positionalSx = {};
    if (isConnected && count > 1) {
      const r = 'var(--Style-Border-Radius)';
      if (isHorizontal) {
        const radius = (isFirst && isLast) ? r
          : isFirst ? `${r} 0 0 ${r}`
          : isLast  ? `0 ${r} ${r} 0`
          : '0';
        positionalSx = {
          borderRadius: radius,
          // Collapse adjacent borders — shift left by border width
          ...(!isFirst && { marginLeft: '-2px' }),
          // Hovered/focused button renders above neighbors
          position: 'relative',
          '&:hover, &:focus-visible, &.Mui-focusVisible': { zIndex: 1 },
        };
      } else {
        const radius = (isFirst && isLast) ? r
          : isFirst ? `${r} ${r} 0 0`
          : isLast  ? `0 0 ${r} ${r}`
          : '0';
        positionalSx = {
          borderRadius: radius,
          ...(!isFirst && { marginTop: '-2px' }),
          position: 'relative',
          '&:hover, &:focus-visible, &.Mui-focusVisible': { zIndex: 1 },
        };
      }
    }

    // fullWidth only applies to text children — not icon/avatar/letterNumber
    const isCompact = child.props.iconOnly || child.props.avatar || child.props.letterNumber;

    return React.cloneElement(child, {
      ...groupProps,
      ...(fullWidth && !isCompact && { fullWidth: true }),
      sx: {
        ...positionalSx,
        ...child.props.sx,
      },
    });
  });

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      className={`btn-group ${className}`}
      sx={{
        display: fullWidth ? 'flex' : 'inline-flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'stretch',
        gap: isConnected ? 0 : spacing,
        width: fullWidth ? '100%' : 'auto',
        ...sx,
      }}
      {...props}
    >
      {clonedChildren}
    </Box>
  );
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Primary
export const PrimaryButtonGroup          = (p) => <ButtonGroup variant="primary"            {...p} />;

// Outline
export const PrimaryOutlineButtonGroup   = (p) => <ButtonGroup variant="primary-outline"    {...p} />;
export const SecondaryOutlineButtonGroup = (p) => <ButtonGroup variant="secondary-outline"  {...p} />;
export const TertiaryOutlineButtonGroup  = (p) => <ButtonGroup variant="tertiary-outline"   {...p} />;
export const NeutralOutlineButtonGroup   = (p) => <ButtonGroup variant="neutral-outline"    {...p} />;
export const InfoOutlineButtonGroup      = (p) => <ButtonGroup variant="info-outline"       {...p} />;
export const SuccessOutlineButtonGroup   = (p) => <ButtonGroup variant="success-outline"    {...p} />;
export const WarningOutlineButtonGroup   = (p) => <ButtonGroup variant="warning-outline"    {...p} />;
export const ErrorOutlineButtonGroup     = (p) => <ButtonGroup variant="error-outline"      {...p} />;

// Light
export const PrimaryLightButtonGroup     = (p) => <ButtonGroup variant="primary-light"      {...p} />;
export const SecondaryLightButtonGroup   = (p) => <ButtonGroup variant="secondary-light"    {...p} />;
export const TertiaryLightButtonGroup    = (p) => <ButtonGroup variant="tertiary-light"     {...p} />;
export const NeutralLightButtonGroup     = (p) => <ButtonGroup variant="neutral-light"      {...p} />;
export const InfoLightButtonGroup        = (p) => <ButtonGroup variant="info-light"         {...p} />;
export const SuccessLightButtonGroup     = (p) => <ButtonGroup variant="success-light"      {...p} />;
export const WarningLightButtonGroup     = (p) => <ButtonGroup variant="warning-light"      {...p} />;
export const ErrorLightButtonGroup       = (p) => <ButtonGroup variant="error-light"        {...p} />;

// Ghost
export const GhostButtonGroup  = (p) => <ButtonGroup variant="ghost" {...p} />;

// Aliases
export const OutlineButtonGroup = (p) => <ButtonGroup variant="primary-outline" {...p} />;

export default ButtonGroup;