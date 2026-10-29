// src/components/Card/Card.js
import React, { createContext, useContext } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2, SHADOW_LEVEL_3, SHADOW_LEVEL_4 } from '../_shadows';

const SxBox = lazySxBox('Card');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

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

/* --- Static sheet ---
   Every declaration the parts used to hand emotion per render, as classes over
   the same tokens.

   Shadows: Level 1 at rest, not 2 — read off the file. The five Effect-Levels
   ARE the five named effect styles (Level 1 = Elevations/Level-1, the Card
   style; Level 2 = Card-Hover; Level 3 = Card-Drag / Elevated-Card-Hover;
   Level 4 = Elevated-Card-Drag). `elevated` moves the whole set up one, which
   keeps Card and Card-Hover one step apart at either setting. The set is
   three custom properties, so elevated is one class that re-points them.

   Pressed keeps the RESTING elevation: Figma's Pressed card wears the same
   Card style as Default.

   The border is ALWAYS 1px. Figma draws the selected ring as a frame laid OVER
   a card whose border stays put, so the second pixel is an inset ring on the
   inner surface and selecting a card moves nothing. --_cd-sel carries the
   selected palette's border to the outer edge, --_cd-ring to the ring.

   State rules weigh one class + one pseudo-class, as emotion's `&:hover` did,
   so a caller's sx state rule still wins. */
const sizeRules = (sel) => Object.entries(SIZE_MAP).map(([k, v]) => `${sel}-${k}{gap:${v.gap}}`);

registerStaticStyles('omni-card', [
  `.omni-card{--_cd-rest:${SHADOW_LEVEL_1};--_cd-hover:${SHADOW_LEVEL_2};--_cd-drag:${SHADOW_LEVEL_3};`
    + 'display:flex;border-width:1px;border-style:solid;border-color:var(--Border-Variant);border-radius:var(--Card-Radius);'
    + 'box-shadow:var(--_cd-rest);overflow:hidden;text-decoration:none;'
    + 'transition:box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease}',
  `.omni-card-elev{--_cd-rest:${SHADOW_LEVEL_2};--_cd-hover:${SHADOW_LEVEL_3};--_cd-drag:${SHADOW_LEVEL_4}}`,
  '.omni-card-ia{border-color:var(--Buttons-Default-Border)}',
  '.omni-card-sel{border-color:var(--_cd-sel)}',
  '.omni-card-off{opacity:var(--Disabled, 0.38);cursor:not-allowed;pointer-events:none}',
  '.omni-card-click{cursor:pointer}',
  '.omni-card-drag{cursor:grab}',
  '.omni-card-click:hover,.omni-card-drag:hover{box-shadow:var(--_cd-hover);transform:translateY(-1px)}',
  '.omni-card-click:where(:not(.omni-card-sel)):hover,.omni-card-drag:hover{border-color:var(--Buttons-Default-Border)}',
  '.omni-card-click:active{transform:translateY(0);box-shadow:var(--_cd-rest)}',
  /* Figma's State=Drag: lifted 1px like Hover, two shadow levels above rest. */
  '.omni-card-drag:active{cursor:grabbing;z-index:10;box-shadow:var(--_cd-drag);transform:translateY(-1px)}',
  /* No border-radius on the ring: the browser draws the outline around the
     box's own corners, offset included. */
  '.omni-card-click:focus-visible,.omni-card-drag:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  /* Inner surface: the scoped theme and surface. Its radius is the card's
     MINUS the 1px border, so its edge is concentric with the border's inner
     edge and the selected ring never pulls away at the corners. */
  '.omni-card-inner{display:flex;flex-direction:column;padding:var(--Card-Padding);background-color:var(--Background);'
    + 'box-shadow:none;color:var(--Text);font-family:inherit;border-radius:calc(var(--Card-Radius) - 1px);'
    + 'position:relative;flex:1;min-width:0;overflow:hidden}',
  '.omni-card-inner-h{flex-direction:row}',
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-card-inner-${k}{gap:${v.gap};font-size:${v.fontSize}}`),
  /* The ring is declared on the inner element (--_cd-ring) so the token
     resolves against the card's OWN theme and surface — the ring sits on the
     inner surface, the border on the parent's, and each is tuned to its own. */
  '.omni-card-sel>.omni-card-inner{box-shadow:inset 0 0 0 1px var(--_cd-ring)}',
  '.omni-card-content{display:flex;flex-direction:column;flex:1;min-width:0}',
  ...sizeRules('.omni-card-content'),
  '.omni-card-overflow{overflow:hidden;flex-shrink:0}',
  '.omni-card-overflow-v{margin-left:calc(var(--Card-Padding) * -1);margin-right:calc(var(--Card-Padding) * -1)}',
  '.omni-card-overflow-v:first-of-type{margin-top:calc(var(--Card-Padding) * -1)}',
  '.omni-card-overflow-v:last-of-type{margin-bottom:calc(var(--Card-Padding) * -1)}',
  '.omni-card-overflow-h{margin-top:calc(var(--Card-Padding) * -1);margin-bottom:calc(var(--Card-Padding) * -1)}',
  '.omni-card-overflow-h:first-of-type{margin-left:calc(var(--Card-Padding) * -1)}',
  '.omni-card-overflow-h:last-of-type{margin-right:calc(var(--Card-Padding) * -1)}',
  '.omni-card-cover{position:absolute;inset:0;z-index:0;overflow:hidden;border-radius:inherit}',
  '.omni-card-cover img,.omni-card-cover video{width:100%;height:100%;object-fit:cover}',
  '.omni-card-actions{display:flex;align-items:center;flex-wrap:wrap}',
  ...sizeRules('.omni-card-actions'),
].join('\n'));

/** A part's root: static classes, plus an MUI box only when given sx. */
function Part({ sx, component: Tag = 'div', ...props }) {
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...props} />;
  return <Tag {...props} />;
}

/* --- Card --- */
export function Card({
  children,
  variant = 'solid',
  color = 'default',
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
  style,
  sx,
  ...props
}) {
  useStaticStyles('omni-card');
  const isDark = variant === 'dark';
  const isDefaultColor = color === 'default';

  const dataTheme = isDefaultColor ? '' : SOLID_THEME_MAP[color];

  const dataSurface = surface
    ? surface
    : isDefaultColor
      ? 'Container'
      : isDark
        ? 'Surface-Dimmest'
        : variant === 'light'
          ? 'Surface-Brightest'
          : 'Surface';

  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const isHorizontal = orientation === 'horizontal';
  const isDraggable = !!draggableProp;
  /* A disabled card is not clickable. Deriving it here rather than guarding
     each state means the role, tabIndex and onClick all drop together — a card
     that merely LOOKED disabled but kept role="button" and tabIndex={0} would
     still be reachable by keyboard and still fire. */
  const isClickable = !disabled && (clickable || !!onClick || !!href || selected || isDraggable);

  const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const selBorder = `var(--Buttons-${cap(color === 'default' ? 'Default' : color)}-Border)`;
  const selStyle = selected ? { '--_cd-sel': selBorder } : null;

  return (
    <CardContext.Provider value={{ variant, color, size, orientation }}>
      {/* Outer shell — no data-surface, inherits parent dropshadow-color */}
      <Part
        component={href ? 'a' : 'div'}
        sx={sx}
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
          + ' omni-card'
          + (elevated ? ' omni-card-elev' : '')
          + (isClickable ? ' omni-card-ia' : '')
          + (selected ? ' omni-card-sel' : '')
          + (disabled ? ' omni-card-off' : '')
          + (isClickable && !isDraggable ? ' omni-card-click' : '')
          + (isDraggable ? ' omni-card-drag' : '')
          + ' ' + className
        }
        style={selStyle || style ? { ...selStyle, ...style } : undefined}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
        } : undefined}
        {...props}
      >
        {/* Inner content — scoped theme and surface. The outer has
            overflow:hidden, so nested images/media get clipped to its rounded
            corners without extra math here. */}
        <div
          data-theme={dataTheme || undefined}
          data-surface={dataSurface}
          className={'omni-card-inner omni-card-inner-' + sizeKey + (isHorizontal ? ' omni-card-inner-h' : '')}
          style={selected ? { '--_cd-ring': selBorder } : undefined}
        >
          {children}
        </div>
      </Part>
    </CardContext.Provider>
  );
}

/* --- CardContent --- */
export function CardContent({ children, className = '', ...props }) {
  useStaticStyles('omni-card');
  const { size } = useCardContext();
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  return (
    <Part className={'card-content omni-card-content omni-card-content-' + sizeKey + ' ' + className} {...props}>
      {children}
    </Part>
  );
}

/* --- CardOverflow --- */
export function CardOverflow({ children, className = '', ...props }) {
  useStaticStyles('omni-card');
  const { orientation } = useCardContext();
  return (
    <Part className={'card-overflow omni-card-overflow omni-card-overflow-' + (orientation === 'horizontal' ? 'h' : 'v') + ' ' + className} {...props}>
      {children}
    </Part>
  );
}

/* --- CardCover --- */
export function CardCover({ children, className = '', ...props }) {
  useStaticStyles('omni-card');
  return (
    <Part className={'card-cover omni-card-cover ' + className} {...props}>
      {children}
    </Part>
  );
}

/* --- CardActions --- */
export function CardActions({ children, className = '', ...props }) {
  useStaticStyles('omni-card');
  const { size } = useCardContext();
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  return (
    <Part className={'card-actions omni-card-actions omni-card-actions-' + sizeKey + ' ' + className} {...props}>
      {children}
    </Part>
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
