// src/components/Card/Card.js
import React, { createContext, useContext } from 'react';
import { Box } from '@mui/material';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2, SHADOW_LEVEL_3, SHADOW_LEVEL_4 } from '../_shadows';

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
 *   light     data-theme="{Theme}"        data-surface="Surface-Brightest" bg: var(--Background)
 *   dark      data-theme="{Theme}"        data-surface="Surface-Dimmest"  bg: var(--Background)
 *
 * BORDERS:
 *   not clickable                -> 1px solid var(--Border-Variant)
 *   clickable                    -> 1px solid var(--Buttons-Default-Border)
 *   clickable + selected         -> 2px solid var(--Buttons-Default-Border)
 *
 * ELEVATION SHADOWS:
 *   default:   Level 1 rest, Level 2 hover, Level 3 drag   (Figma's Card)
 *   elevated:  Level 2 rest, Level 3 hover, Level 4 drag   (Elevated=true:
 *              one level up in every state)
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
// A light card is the SOLID theme at its brightest surface, not a *-Light
// theme. Generated design systems do not emit *-Light — their sheets carry
// Default, Primary, Secondary, Tertiary, Neutral and the states — so the old
// LIGHT_THEME_MAP matched no rule and --Background resolved to nothing.
// Light and dark now differ from solid only by surface level, as dark already did.

const SIZE_MAP = {
  /* Medium is Figma's: the card's padded slot stacks its content 4px apart
     (it was 12, which put 8px more air between a title and its body than the
     design has). Small and large keep their old proportion to medium. */
  small:  { gap: '2px', fontSize: '13px', padding: 'var(--Card-Padding)' },
  medium: { gap: '4px', fontSize: '14px', padding: 'var(--Card-Padding)' },
  large:  { gap: '8px', fontSize: '16px', padding: 'var(--Card-Padding)' },
};

/* --- Context --- */
const CardContext = createContext({
  variant: 'default', color: 'primary', size: 'medium', orientation: 'vertical',
});
export const useCardContext = () => useContext(CardContext);

/* --- Card --- */
export function Card({
  children,
  variant = 'solid',
  color = 'default',
  // Optional explicit surface override for the inner content. By default a
  // default-color card uses "Container"; pass surface="Surface" when the card
  // is actually a Surface-level region (so tokens like --Header resolve to the
  // Surface tone, not the Container tone).
  surface,
  size = 'medium',
  orientation = 'vertical',
  clickable = false,
  selected = false,
  elevated = false,
  draggable: draggableProp = false,
  onClick,
  disabled = false,
  href,
  className = '',
  sx = {},
  ...props
}) {
  const isDark = variant === 'dark';
  // Default-color cards inherit the parent theme and override Container
  // surface so they pick up the consumer's card-coloring choice (white/black/
  // tonal). Themed cards (color="primary" etc.) stamp their own theme +
  // Surface so the card paints the brand color directly.
  const isDefaultColor = color === 'default';

  // Theme for inner content — omitted for default-color cards so the parent
  // theme inherits through.
  const dataTheme = isDefaultColor ? '' : SOLID_THEME_MAP[color];

  // Surface for inner content — Container for default-color cards so they
  // respect the consumer's card-coloring tokens; Surface (or Surface-Dimmest
  // for dark variant) for themed cards.
  const dataSurface = surface
    ? surface
    : isDefaultColor
      ? 'Container'
      : isDark
        ? 'Surface-Dimmest'
        : variant === 'light'
          ? 'Surface-Brightest'
          : 'Surface';

  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isHorizontal = orientation === 'horizontal';
  const isDraggable = !!draggableProp;
  /* A disabled card is not clickable. Deriving it here rather than guarding
     each state means the role, tabIndex and onClick all drop together — a card
     that merely LOOKED disabled but kept role="button" and tabIndex={0} would
     still be reachable by keyboard and still fire. */
  const isClickable = !disabled && (clickable || !!onClick || !!href || selected || isDraggable);
  const component = href ? 'a' : 'div';

  // Border color token — selected uses theme-specific border
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const borderColorToken = selected
    ? `var(--Buttons-${cap(color === 'default' ? 'Default' : color)}-Border)`
    : 'var(--Buttons-Default-Border)';

  /* The border is ALWAYS 1px. Selected used to be a 2px border, which pushed
     the content 1px in and made the card 2px larger than an unselected one —
     Figma draws the selected ring as a frame laid OVER a card whose border
     stays put. So the second pixel is an inset ring on the inner surface (see
     selectedRing), and selecting a card moves nothing.

     Selected is tested before clickable on purpose: a disabled card is not
     clickable, and the selected ring went with it — Figma's Disabled variant
     keeps the ring at the disabled opacity, because "chosen, but unavailable"
     is still chosen. */
  const borderStyle = selected
    ? `1px solid ${borderColorToken}`
    : !isClickable
      ? '1px solid var(--Border-Variant)'
      : '1px solid var(--Buttons-Default-Border)';
  const selectedRing = selected ? `inset 0 0 0 1px ${borderColorToken}` : 'none';

  // Elevation shadows (on outer shell, inherits parent dropshadow-color)
  /* Level 1 at rest, not 2 — read off the file rather than chosen.
     The five Effect-Levels ARE the five named effect styles, and the mapping
     is exact once you line up the alphas and radii in a published bundle:

       Level 1  a=0.145 r=1.6   Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
       Level 2  a=0.169 r=3.6   Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover)
       Level 3  a=0.200 r=8.1   Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
       Level 4  a=0.184 r=18.1  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
       Level 5  a=0.251 r=40.4  Elevations/Level-5 (Dialog & Modal)

     So Figma's `Card` style is Level ONE. This sat at Level 2, which is the
     App-bar step — every card in every brand wore a shadow a full level too
     heavy, and a card nested in a card wore it twice. It reads as a glow rather
     than as a mistake, because an over-heavy shadow is still a plausible
     shadow, and the number 2 looks as reasonable in the source as 1 does.

     elevated moves the whole set up one, which is what the prop means and what
     keeps `Card` and `Card-Hover` one step apart at either setting. */
  const restShadow  = elevated ? SHADOW_LEVEL_2 : SHADOW_LEVEL_1;
  const hoverShadow = elevated ? SHADOW_LEVEL_3 : SHADOW_LEVEL_2;
  const dragShadow  = elevated ? SHADOW_LEVEL_4 : SHADOW_LEVEL_3;
  /* Pressed keeps the RESTING elevation: Figma's Pressed card wears the same
     Card style as Default. It used to drop a level and shrink to 99.5%. */
  const activeShadow = restShadow;

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
        aria-disabled={disabled || undefined}
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
          ...(disabled && {
            opacity: 'var(--Disabled, 0.38)',
            cursor: 'not-allowed',
            pointerEvents: 'none',
          }),
          ...(isClickable && !isDraggable && {
            cursor: 'pointer',
            '&:hover': {
              // A selected card keeps its selected border color on hover.
              ...(!selected && { borderColor: 'var(--Buttons-Default-Border)' }),
              boxShadow: hoverShadow,
              transform: 'translateY(-1px)',
            },
            '&:active': {
              // Settles back from the hover lift, at rest elevation, no scale.
              transform: 'translateY(0)',
              boxShadow: activeShadow,
            },
            /* No borderRadius here. It was calc(--Card-Radius + 3px), meant
               for the ring — but it rounded the CARD to 27px whenever it had
               focus. The browser already draws an outline around the box's
               own corners, offset included. */
            '&:focus-visible': {
              // Figma: a 2px ring, 1px outside the card.
              outline: '2px solid var(--Focus-Visible)',
              outlineOffset: '1px',
            },
          }),
          ...(isDraggable && {
            cursor: 'grab',
            '&:hover': {
              borderColor: 'var(--Buttons-Default-Border)',
              boxShadow: hoverShadow,
              transform: 'translateY(-1px)',
            },
            '&:active': {
              cursor: 'grabbing',
              zIndex: 10,
              /* Figma's State=Drag: lifted 1px like Hover (the variant loses
                 its 1px padding), two shadow levels above rest — Level 3, or
                 Level 4 for an elevated card. Same edge as rest: it used to
                 scale to 102% and swap to a 2px Primary border, neither of
                 which the design has. */
              boxShadow: dragShadow,
              transform: 'translateY(-1px)',
            },
            '&:focus-visible': {
              // Figma: a 2px ring, 1px outside the card.
              outline: '2px solid var(--Focus-Visible)',
              outlineOffset: '1px',
            },
          }),
          ...sx,
        }}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
        } : undefined}
        {...props}
      >
        {/* Inner content — scoped theme and surface. `borderRadius: inherit`
            picks up the outer Card's rounding (whatever --Card-Radius
            resolves to under the active theme) so the two always agree,
            even if the token changes. The outer also has overflow:hidden,
            so nested images/media get clipped to the outer's rounded
            corners without needing extra math here. */}
        <Box
          data-theme={dataTheme || undefined}
          data-surface={dataSurface}
          sx={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            gap: s.gap,
            padding: s.padding,
            backgroundColor: 'var(--Background)',
            // The selected ring's second pixel, inside the 1px border.
            boxShadow: selectedRing,
            color: 'var(--Text)',
            fontSize: s.fontSize,
            fontFamily: 'inherit',
            /* The card's radius MINUS its 1px border, so this surface's edge
               is concentric with the border's inner edge. At `inherit` it
               curved 1px too tight, and the selected ring drawn on it pulled
               away from the border at every corner — a hairline gap that read
               as two rings. */
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
