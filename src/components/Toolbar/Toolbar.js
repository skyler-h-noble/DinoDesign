// src/components/Toolbar/Toolbar.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Fab } from '../Fab/Fab';
import { SHADOW_LEVEL_2 } from '../_shadows';

/**
 * Toolbar Component
 *
 * TYPES:
 *   floating     — pill shape (borderRadius 56px), padding 16px, shadow Level-2
 *   contextual   — standard border-radius, padding 8px, no shadow
 *
 * COLORS: default | primary | primary-light | white | black
 *   default → data-theme="Default"
 *   primary → data-theme="Primary"
 *   primary-light → data-theme="Primary" + data-surface="Surface-Brightest"
 *   white → data-theme="Neutral" + data-surface="Surface-Brightest"
 *   black → data-theme="Neutral" + data-surface="Surface-Dimmest"
 *
 * FAB: optional Fab to the right of a floating toolbar. Takes the bar's own
 *      colour and sits at FAB-Width medium unless `fab.size` says otherwise.
 *
 * ORIENTATION: horizontal | vertical
 *
 * NO LABELS AXIS, deliberately. A `showLabels` prop was added here and taken
 * back out: the design has one, but on Nav-Bar (Labels: Default | No Labels)
 * and Nav Item (Show Labels), where the caption sits UNDER the icon. Nothing
 * on the ToolBar page carries it. Rendering it here as icon-plus-text also
 * went wrong in a way worth recording — a ghost Button with text takes
 * --Hotlink, by design, so every action came out looking like a link.
 * BottomNavigation and Rail are where that axis lives.
 */

/* EVERY THEME, not a hand-picked five.
 *
 * This offered default / primary / primary-light / white / black, which mixed
 * two different ideas: three themes and two LIGHTNESSES. Lightness is the
 * surface axis, so `white` and `black` were Neutral at a surface level wearing
 * colour names, and `primary-light` was the -Light shade pattern that no
 * longer exists anywhere else in the system.
 *
 * So the two ideas are two props now: `color` picks the THEME and `surface`
 * picks the LEVEL. The three legacy names still resolve — they are spelled out
 * below as the theme-plus-surface pairs they always meant — but they are not
 * offered as choices, because every pair they named is now reachable by
 * saying both. */
/* The five a toolbar can be. NOT the four state palettes: Info / Success /
   Warning / Error say something has happened, and a bar of formatting actions
   is not an event. */
const THEMES = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral'];

const THEME_MAP = Object.fromEntries(
  THEMES.map((t) => [t.toLowerCase(), { theme: t }]),
);

/* Kept resolving rather than removed: a call site passing one of these should
   keep rendering what it rendered before, not fall through to Default. */
const LEGACY_COLORS = {
  'primary-light': { theme: 'Primary', surface: 'Surface-Brightest' },
  white:           { theme: 'Neutral', surface: 'Surface-Brightest' },
  black:           { theme: 'Neutral', surface: 'Surface-Dimmest' },
};

export const TOOLBAR_COLORS = Object.keys(THEME_MAP);

/* The five SURFACE levels, in the order the ladder runs — and no Containers.
   A toolbar sits ON a surface; a Container is the level a card or a panel
   takes when it is nested INSIDE one, and a bar floating over the page is not
   that. Offering both would be offering two answers to "how far off the page
   am I" when only one of them applies. The Bright end is the lift. */
export const TOOLBAR_SURFACES = [
  'Surface', 'Surface-Dim', 'Surface-Dimmest',
  'Surface-Bright', 'Surface-Brightest',
];

export function Toolbar({
  items = [],
  value: controlledValue,
  defaultValue,
  onChange,
  type = 'floating',
  orientation = 'horizontal',
  color = 'default',
  /* The LEVEL, separate from the theme. `white` and `black` used to be
     colours here, which is how a lightness ended up wearing a colour name. */
  surface,
  fab,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const isControlled = controlledValue !== undefined;
  const activeIndex = isControlled ? controlledValue : internalValue;

  const handleSelect = useCallback((index) => {
    const next = activeIndex === index ? null : index;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [isControlled, activeIndex, onChange]);

  const barTheme = THEME_MAP[color] || LEGACY_COLORS[color] || THEME_MAP.default;
  const dataTheme = barTheme.theme;
  /* An explicit surface wins; otherwise a legacy colour's implied one; else
     the ordinary Surface. */
  const dataSurface = surface || barTheme.surface;
  const isVertical = orientation === 'vertical';
  const isFloating = type === 'floating';

  const toolbar = (
    <Box
      role="toolbar"
      aria-orientation={orientation}
      aria-label="Toolbar"
      data-theme={dataTheme}
      data-surface={dataSurface || 'Surface'}
      className={'toolbar toolbar-' + type + ' toolbar-' + orientation + ' toolbar-' + color + ' ' + className}
      sx={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        gap: '4px',
        /* HUGS ITS CONTENT, and says so in a way a parent cannot undo.
           `inline-flex` already shrink-wraps, but only while the cross size is
           `auto` — drop the bar into a flex column, which is what a stacked
           sample or a sidebar is, and `align-items: stretch` makes it span the
           full width with the actions bunched at one end. An explicit
           fit-content width is not auto, so stretch no longer applies. */
        width: 'fit-content',
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border-Variant)',
        borderRadius: isFloating ? '56px' : 'var(--Style-Border-Radius)',
        /* THE PADDING TURNS WITH THE BAR. A pill needs room at its rounded
           ENDS, which is the long axis — 16 across and 8 through. Vertically
           that is the same two numbers the other way round; leaving them put
           padded the short axis instead and the vertical bar came out wider
           than its own buttons needed. */
        padding: isFloating
          ? (isVertical ? '16px 8px' : '8px 16px')
          : '8px',
        fontFamily: 'inherit',
        flexShrink: 0,
        ...(isFloating && { boxShadow: SHADOW_LEVEL_2 }),
        ...sx,
      }}
      {...props}
    >
      {items.map((item, index) => {
        const isSelected = activeIndex === index;
        return (
          <Button
            key={item.key || index}
            iconOnly
            variant={isSelected ? 'default' : 'ghost'}
            size="small"
            onClick={() => handleSelect(index)}
            aria-label={item.label}
            aria-checked={isSelected}
            role="radio"
          >
            <Icon size="small" sx={{ color: 'inherit' }}>{item.icon}</Icon>
          </Button>
        );
      })}
    </Box>
  );

  // With FAB: toolbar + FAB side by side
  if (fab && isFloating) {
    return (
      <Box sx={{ display: 'inline-flex', flexDirection: isVertical ? 'column' : 'row', alignItems: 'center', gap: 1 }}>
        {toolbar}
        {/* THE Fab COMPONENT, not a Button pretending to be one.
            This was a Button forced round with a hardcoded 56x56 — the large
            end of FAB-Width, next to a bar of SMALL buttons, so it towered
            over the thing it belongs to. Fab owns that ramp (32 / 48 / 56 off
            FAB-Width) and medium is the one that reads as the primary action
            without dwarfing the bar; `fab.size` overrides.
            It also takes the bar's own COLOUR. Hardcoding variant="default"
            painted the brand's default button on a themed toolbar, which is
            why a green bar came with a pink FAB. */}
        <Fab
          color={fab.color || color}
          size={fab.size || 'medium'}
          onClick={fab.onClick}
          aria-label={fab.label || 'Action'}
        >
          {fab.icon}
        </Fab>
      </Box>
    );
  }

  return toolbar;
}

export default Toolbar;
