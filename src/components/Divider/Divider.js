// src/components/Divider/Divider.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Divider Component
 * Visual separator with optional text indicator
 *
 * COLORS:
 *   default           var(--Border-Variant)
 *   {color}           var(--Buttons-{Color}-Border) for all 8 brand colors
 *
 * ORIENTATION: horizontal | vertical
 *
 * SIZES:
 *   small   1px
 *   medium  2px
 *   large   4px
 *
 * INDICATOR (optional text label centered on the divider):
 *   Works on both horizontal and vertical orientations.
 *
 *   indicatorStyle="outline"
 *     BG:     var(--Background)
 *     Text:   var(--Text)
 *     Border: 1px solid var(--Buttons-{Color}-Border)
 *
 *   indicatorStyle="light"
 *     BG:     var(--Buttons-{Color}-Button)
 *     Text:   var(--Buttons-{Color}-Text)
 *     Border: 1px solid var(--Buttons-{Color}-Border)
 *
 *   textAlign (horizontal): left | center | right
 *   textAlign (vertical):   top  | center | bottom
 */

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function getLineColor(color) {
  if (!color || color === 'default') return 'var(--Border-Variant)';
  return 'var(--Buttons-' + cap(color) + '-Border)';
}

function getIndicatorStyles(color, indicatorStyle) {
  const C = cap(color && color !== 'default' ? color : 'primary');
  if (indicatorStyle === 'light') {
    return {
      bg:     'var(--Buttons-' + C + '-Button)',
      text:   'var(--Buttons-' + C + '-Text)',
      border: '1px solid var(--Buttons-' + C + '-Border)',
    };
  }
  return {
    bg:     'var(--Background)',
    text:   'var(--Text)',
    border: '1px solid var(--Buttons-' + C + '-Border)',
  };
}

const SIZE_MAP = { small: 1, medium: 2, large: 4 };

export function Divider({
  color = 'default',
  orientation = 'horizontal',
  size = 'small',
  children,
  indicatorText,
  indicatorStyle = 'outline',
  textAlign = 'center',
  className = '',
  sx = {},
  ...props
}) {
  const lineColor = getLineColor(color);
  const thickness = SIZE_MAP[size] || SIZE_MAP.small;
  const hasIndicator = !!(children || indicatorText);
  const displayText = children || indicatorText;
  const isVertical = orientation === 'vertical';

  // --- Vertical without indicator ---
  if (isVertical && !hasIndicator) {
    return (
      <Box
        role="separator"
        aria-orientation="vertical"
        className={'divider-vertical divider-' + color + ' ' + className}
        sx={{
          display: 'inline-block',
          width: thickness + 'px',
          alignSelf: 'stretch',
          minHeight: 24,
          backgroundColor: lineColor,
          flexShrink: 0,
          ...sx,
        }}
        {...props}
      />
    );
  }

  // --- Vertical with indicator ---
  if (isVertical && hasIndicator) {
    const indStyles = getIndicatorStyles(color, indicatorStyle);
    const topFlex = textAlign === 'top' ? '0 0 10%' : textAlign === 'bottom' ? '1 1 auto' : '1 1 auto';
    const bottomFlex = textAlign === 'top' ? '1 1 auto' : textAlign === 'bottom' ? '0 0 10%' : '1 1 auto';

    return (
      <Box
        role="separator"
        aria-orientation="vertical"
        className={'divider-vertical divider-' + color + ' divider-indicator ' + className}
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignSelf: 'stretch',
          minHeight: 24,
          flexShrink: 0,
          ...sx,
        }}
        {...props}
      >
        <Box sx={{ flex: topFlex, width: thickness + 'px', backgroundColor: lineColor }} />
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, my: 1, px: 0.75, py: 0.5,
            borderRadius: '12px', fontSize: '11px', fontWeight: 500,
            fontFamily: 'inherit', lineHeight: 1.2, whiteSpace: 'nowrap',
            backgroundColor: indStyles.bg, color: indStyles.text, border: indStyles.border,
            boxSizing: 'border-box',
          }}
        >
          {displayText}
        </Box>
        <Box sx={{ flex: bottomFlex, width: thickness + 'px', backgroundColor: lineColor }} />
      </Box>
    );
  }

  // --- Horizontal without indicator ---
  if (!hasIndicator) {
    return (
      <Box
        role="separator"
        aria-orientation="horizontal"
        className={'divider-horizontal divider-' + color + ' ' + className}
        sx={{
          width: '100%',
          height: thickness + 'px',
          backgroundColor: lineColor,
          flexShrink: 0,
          ...sx,
        }}
        {...props}
      />
    );
  }

  // --- Horizontal with indicator ---
  const indStyles = getIndicatorStyles(color, indicatorStyle);
  const leftFlex = textAlign === 'left' ? '0 0 10%' : textAlign === 'right' ? '1 1 auto' : '1 1 auto';
  const rightFlex = textAlign === 'left' ? '1 1 auto' : textAlign === 'right' ? '0 0 10%' : '1 1 auto';

  return (
    <Box
      role="separator"
      aria-orientation="horizontal"
      className={'divider-horizontal divider-' + color + ' divider-indicator ' + className}
      sx={{ display: 'flex', alignItems: 'center', width: '100%', ...sx }}
      {...props}
    >
      <Box sx={{ flex: leftFlex, height: thickness + 'px', backgroundColor: lineColor }} />
      <Box
        sx={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, mx: 2, px: 1.5, py: 0.5,
          borderRadius: '12px', fontSize: '12px', fontWeight: 500,
          fontFamily: 'inherit', lineHeight: 1.2, whiteSpace: 'nowrap',
          backgroundColor: indStyles.bg, color: indStyles.text, border: indStyles.border,
          boxSizing: 'border-box',
        }}
      >
        {displayText}
      </Box>
      <Box sx={{ flex: rightFlex, height: thickness + 'px', backgroundColor: lineColor }} />
    </Box>
  );
}

// Convenience Exports
export const DefaultDivider   = (p) => <Divider color="default"   {...p} />;
export const PrimaryDivider   = (p) => <Divider color="primary"   {...p} />;
export const SecondaryDivider = (p) => <Divider color="secondary" {...p} />;
export const TertiaryDivider  = (p) => <Divider color="tertiary"  {...p} />;
export const NeutralDivider   = (p) => <Divider color="neutral"   {...p} />;
export const InfoDivider      = (p) => <Divider color="info"      {...p} />;
export const SuccessDivider   = (p) => <Divider color="success"   {...p} />;
export const WarningDivider   = (p) => <Divider color="warning"   {...p} />;
export const ErrorDivider     = (p) => <Divider color="error"     {...p} />;

export default Divider;