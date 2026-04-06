// src/components/Card/Card.js
import React, { createContext, useContext } from 'react';
import { Box } from '@mui/material';

/**
 * Card Component
 *
 * STRUCTURE (two-layer):
 *   Outer Shell — no data-surface. Inherits parent dropshadow-color for shadows.
 *     border, border-radius, box-shadow (Effect Levels), hover/focus/active states
 *
 *   Inner Content — data-theme + data-surface. Background, text, tokens.
 *     border-radius: calc(var(--Card-Radius) - 1px)  (accounts for border)
 *
 * VARIANTS + DATA ATTRIBUTES (on inner content):
 *   default   No data-theme.              data-surface="Container"        bg: var(--Background)
 *   solid     data-theme="{Theme}"        data-surface="Surface"          bg: var(--Background)
 *   light     data-theme="{Theme}-Light"  data-surface="Surface"          bg: var(--Background)
 *   dark      data-theme="{Theme}"        data-surface="Surface-Dimmest"  bg: var(--Background)
 *
 * BORDERS:
 *   not clickable                -> 1px solid var(--Border-Variant)
 *   clickable                    -> 1px solid var(--Buttons-Default-Border)
 *   clickable + selected         -> 2px solid var(--Buttons-Default-Border)
 *
 * ELEVATION SHADOWS:
 *   default:   Level 2 rest, Level 3 hover (if clickable)
 *   elevated:  Level 3 rest, Level 4 hover (if clickable)
 *   active:    one level down from rest
 *
 * SIZES: small | medium | large  (padding: var(--Card-Padding) for all, gap + font-size scale)
 * ORIENTATION: vertical | horizontal
 * CLICKABLE: adds hover/active/focus. Focus ring is outset 3px with calc(--Card-Radius + 3px).
 */

const SOLID_THEME_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const LIGHT_THEME_MAP = {
  default: 'Default', primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
// Dark uses same theme map as solid — difference is the surface level

const SIZE_MAP = {
  small:  { gap: '8px',  fontSize: '13px', padding: 'var(--Card-Padding)' },
  medium: { gap: '12px', fontSize: '14px', padding: 'var(--Card-Padding)' },
  large:  { gap: '16px', fontSize: '16px', padding: 'var(--Card-Padding)' },
};

/* --- Context --- */
const CardContext = createContext({
  variant: 'default', color: 'primary', size: 'medium', orientation: 'vertical',
});
export const useCardContext = () => useContext(CardContext);

/* --- Card --- */
export function Card({
  children,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  orientation = 'vertical',
  clickable = false,
  selected = false,
  elevated = false,
  draggable: draggableProp = false,
  onClick,
  href,
  className = '',
  sx = {},
  ...props
}) {
  const isDefault = variant === 'default';
  const isDark  = variant === 'dark';

  // Theme for inner content
  // solid + dark use {Theme}, light uses {Theme}-Light
  const dataTheme = isDefault
    ? undefined
    : variant === 'light'
      ? LIGHT_THEME_MAP[color]
      : SOLID_THEME_MAP[color];

  // Surface for inner content
  // solid + light use Surface, dark uses Surface-Dimmest
  const dataSurface = isDefault ? 'Container' : isDark ? 'Surface-Dimmest' : 'Surface';

  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isHorizontal = orientation === 'horizontal';
  const isDraggable = !!draggableProp;
  const isClickable = clickable || !!onClick || !!href || selected || isDraggable;
  const component = href ? 'a' : 'div';

  // Border color token — selected uses theme-specific border
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const borderColorToken = selected && !isDefault
    ? `var(--Buttons-${cap(color === 'default' ? 'default' : color)}-Border, var(--Buttons-Default-Border))`
    : 'var(--Buttons-Default-Border)';

  const borderStyle = !isClickable
    ? '1px solid var(--Border-Variant)'
    : selected
      ? `2px solid ${borderColorToken}`
      : '1px solid var(--Buttons-Default-Border)';

  // Elevation shadows (on outer shell, inherits parent dropshadow-color)
  const restShadow  = elevated ? 'var(--Effect-Level-3)' : 'var(--Effect-Level-2)';
  const hoverShadow = elevated ? 'var(--Effect-Level-4)' : 'var(--Effect-Level-3)';
  const activeShadow = elevated ? 'var(--Effect-Level-2)' : 'var(--Effect-Level-1)';

  return (
    <CardContext.Provider value={{ variant, color, size, orientation }}>
      {/* Outer shell — no data-surface, inherits parent dropshadow-color */}
      <Box
        component={component}
        href={href || undefined}
        onClick={isClickable ? onClick : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-pressed={selected ? true : undefined}
        draggable={isDraggable || undefined}
        className={
          'card card-' + variant + ' card-' + size + ' card-' + orientation
          + (isClickable ? ' card-clickable' : '')
          + (selected   ? ' card-selected'  : '')
          + (elevated   ? ' card-elevated'  : '')
          + (isDraggable ? ' card-draggable' : '')
          + ' ' + className
        }
        sx={{
          display: 'flex',
          border: borderStyle,
          borderRadius: 'var(--Card-Radius)',
          boxShadow: restShadow,
          overflow: 'hidden',
          textDecoration: 'none',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease',
          ...(isClickable && !isDraggable && {
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'var(--Buttons-Default-Border)',
              boxShadow: hoverShadow,
            },
            '&:active': {
              transform: 'scale(0.995)',
              boxShadow: activeShadow,
            },
            '&:focus-visible': {
              outline: '3px solid var(--Focus-Visible)',
              outlineOffset: '3px',
              borderRadius: 'calc(var(--Card-Radius) + 3px)',
            },
          }),
          ...(isDraggable && {
            cursor: 'grab',
            '&:hover': {
              borderColor: 'var(--Buttons-Default-Border)',
              boxShadow: hoverShadow,
            },
            '&:active': {
              cursor: 'grabbing',
              zIndex: 10,
              boxShadow: 'var(--Effect-Level-4)',
              transform: 'scale(1.02)',
            },
            '&:focus-visible': {
              outline: '3px solid var(--Focus-Visible)',
              outlineOffset: '3px',
            },
          }),
          ...sx,
        }}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
        } : undefined}
        {...props}
      >
        {/* Inner content — scoped theme and surface */}
        <Box
          data-theme={dataTheme || undefined}
          data-surface={dataSurface}
          sx={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            gap: s.gap,
            padding: s.padding,
            backgroundColor: 'var(--Background)',
            color: 'var(--Text)',
            fontSize: s.fontSize,
            fontFamily: 'inherit',
            borderRadius: 'calc(var(--Card-Radius) - 1px)',
            position: 'relative',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </CardContext.Provider>
  );
}

/* --- CardContent --- */
export function CardContent({
  children,
  className = '',
  sx = {},
  ...props
}) {
  const { size } = useCardContext();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  return (
    <Box
      className={'card-content ' + className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: s.gap,
        flex: 1,
        minWidth: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* --- CardOverflow --- */
export function CardOverflow({
  children,
  className = '',
  sx = {},
  ...props
}) {
  const { size, orientation } = useCardContext();
  const isHorizontal = orientation === 'horizontal';
  const pad = (SIZE_MAP[size] || SIZE_MAP.medium).padding;

  return (
    <Box
      className={'card-overflow ' + className}
      sx={{
        // Negative margin to bleed to card edges
        ...(isHorizontal
          ? {
              marginTop: 'calc(' + pad + ' * -1)',
              marginBottom: 'calc(' + pad + ' * -1)',
              '&:first-of-type': { marginLeft: 'calc(' + pad + ' * -1)' },
              '&:last-of-type': { marginRight: 'calc(' + pad + ' * -1)' },
            }
          : {
              marginLeft: 'calc(' + pad + ' * -1)',
              marginRight: 'calc(' + pad + ' * -1)',
              '&:first-of-type': { marginTop: 'calc(' + pad + ' * -1)' },
              '&:last-of-type': { marginBottom: 'calc(' + pad + ' * -1)' },
            }),
        overflow: 'hidden',
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* --- CardCover --- */
export function CardCover({
  children,
  className = '',
  sx = {},
  ...props
}) {
  return (
    <Box
      className={'card-cover ' + className}
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        borderRadius: 'inherit',
        '& img, & video': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* --- CardActions --- */
export function CardActions({
  children,
  className = '',
  sx = {},
  ...props
}) {
  const { size } = useCardContext();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  return (
    <Box
      className={'card-actions ' + className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: s.gap,
        flexWrap: 'wrap',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* --- Convenience Exports --- */
export const DefaultCard    = (p) => <Card variant="default" {...p} />;
export const SolidCard      = (p) => <Card variant="solid"   {...p} />;
export const LightCard      = (p) => <Card variant="light"   {...p} />;
export const DarkCard       = (p) => <Card variant="dark"    {...p} />;
export const SelectableCard = (p) => <Card clickable selected={p.selected} {...p} />;
export const StaticCard     = (p) => <Card {...p} />;

export default Card;
