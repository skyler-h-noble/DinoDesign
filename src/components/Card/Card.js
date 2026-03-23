// src/components/Card/Card.js
import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';

/**
 * Card Component
 *
 * VARIANTS + DATA ATTRIBUTES:
 *   default   No data-theme.              data-surface="Container"    bg: var(--Background)
 *   solid     data-theme="{Color}"        data-surface="Surface"      bg: var(--Surface)
 *   light     data-theme="{Color}-Light"  data-surface="Surface"      bg: var(--Surface)
 *   dark      data-theme="{Color}"        data-surface="Surface-Dimmest"  bg: var(--Surface)
 *
 * BORDERS:
 *   not clickable                → 1px solid var(--Border-Variant)
 *   clickable                    → 1px solid var(--Buttons-Default-Border)
 *   clickable + selected         → 2px solid var(--Buttons-Default-Border)
 *   elevated                     → class card-elevated only, no border change
 *
 * SIZES: small | medium | large  (padding: var(--Card-Padding) for all, gap + font-size scale)
 * ORIENTATION: vertical | horizontal
 * CLICKABLE: adds hover/active/focus. Focus ring is outset 3px with calc(--Card-Radius + 3px).
 */

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
// Dark uses the same theme name as solid but data-surface="Surface-Dimmest"
const DARK_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};

const SIZE_MAP = {
  small:  { gap: '8px',  fontSize: '13px', padding: 'var(--Card-Padding)' },
  medium: { gap: '12px', fontSize: '14px', padding: 'var(--Card-Padding)' },
  large:  { gap: '16px', fontSize: '16px', padding: 'var(--Card-Padding)' },
};

/* ─── Context ─── */
const CardContext = createContext({
  variant: 'default', color: 'primary', size: 'medium', orientation: 'vertical',
});
export const useCardContext = () => useContext(CardContext);

/* ─── Card ─── */
export function Card({
  children,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  orientation = 'vertical',
  clickable = false,
  selected = false,
  elevated = false,
  onClick,
  href,
  className = '',
  sx = {},
  ...props
}) {
  const isDefault = variant === 'default';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDark  = variant === 'dark';

  // Inherit data-theme from nearest ancestor, unless explicitly overridden
  const ref = useRef(null);
  const [inheritedTheme, setInheritedTheme] = useState(null);
  useEffect(() => {
    if (!ref.current) return;
    const closest = ref.current.parentElement?.closest('[data-theme]');
    if (closest) setInheritedTheme(closest.dataset.theme);
  }, []);

  const dataTheme = props['data-theme']   // explicit override always wins
    ?? (isSolid
      ? SOLID_THEME_MAP[color]
      : isLight
        ? LIGHT_THEME_MAP[color]
        : isDark
          ? DARK_THEME_MAP[color]
          : inheritedTheme);

  // data-surface per variant
  const dataSurface = isDefault ? 'Container' : isDark ? 'Surface-Dimmest' : 'Surface';

  const bg = 'var(--Background)';

  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isHorizontal = orientation === 'horizontal';
  const isClickable = clickable || !!onClick || !!href || selected;
  const component = href ? 'a' : isClickable ? 'div' : 'div';

  // Border rules:
  //   not clickable                    → 1px solid var(--Border-Variant)
  //   clickable (not selected)         → 1px solid var(--Buttons-Default-Border)
  //   clickable + selected             → 2px solid var(--Buttons-Default-Border)
  //   elevated                         → class only, no border change
  const borderStyle = !isClickable
    ? '1px solid var(--Border-Variant)'
    : selected
      ? '2px solid var(--Buttons-Default-Border)'
      : '1px solid var(--Buttons-Default-Border)';

  return (
    <CardContext.Provider value={{ variant, color, size, orientation }}>
      <Box
        component={component}
        href={href || undefined}
        onClick={isClickable ? onClick : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-pressed={selected ? true : undefined}
        ref={ref}
        data-theme={dataTheme || undefined}
        data-surface={dataSurface}
        className={
          'card card-' + variant + ' card-' + size + ' card-' + orientation
          + (isClickable ? ' card-clickable' : '')
          + (selected   ? ' card-selected'  : '')
          + (elevated   ? ' card-elevated'  : '')
          + ' ' + className
        }
        sx={{
          display: 'flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          gap: s.gap,
          padding: s.padding,
          backgroundColor: bg,
          border: borderStyle,
          borderRadius: 'var(--Card-Radius)',
          fontSize: s.fontSize,
          fontFamily: 'inherit',
          color: 'var(--Text)',
          textDecoration: 'none',
          overflow: 'hidden',
          position: 'relative',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease',
          ...(isClickable && {
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'var(--Buttons-Default-Border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            },
            '&:active': {
              transform: 'scale(0.995)',
            },
            '&:focus-visible': {
              outline: '3px solid var(--Focus-Visible)',
              outlineOffset: '3px',
              borderRadius: 'calc(var(--Card-Radius) + 3px)',
            },
          }),
          ...(selected && {
            boxShadow: '0 0 0 2px var(--Buttons-Primary-Border)',
            '&:hover': {
              boxShadow: '0 0 0 2px var(--Buttons-Primary-Border)',
            },
          }),
          ...sx,
        }}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
        } : undefined}
        {...props}
      >
        {children}
      </Box>
    </CardContext.Provider>
  );
}

/* ─── CardContent ─── */
export function CardContent({
  children,
  className = '',
  sx = {},
  ...props
}) {
  const { size, orientation } = useCardContext();
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

/* ─── CardOverflow ─── */
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

/* ─── CardCover ─── */
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

/* ─── CardActions ─── */
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

/* ─── Convenience Exports ─── */
export const DefaultCard    = (p) => <Card variant="default" {...p} />;
export const SolidCard      = (p) => <Card variant="solid"   {...p} />;
export const LightCard      = (p) => <Card variant="light"   {...p} />;
export const DarkCard       = (p) => <Card variant="dark"    {...p} />;
export const SelectableCard = (p) => <Card clickable selected={p.selected} {...p} />;
export const StaticCard     = (p) => <Card {...p} />;

export default Card;