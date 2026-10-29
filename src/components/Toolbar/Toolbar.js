// src/components/Toolbar/Toolbar.js
import React, { useState, useCallback } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
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
 *   (unset) → data-theme="Nav-Bar": the user's nav-bar pick, no data-surface
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

const SxBox = lazySxBox('Toolbar');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

/* The static sheet — what the bar handed emotion, as classes over the same
   tokens.
   HUGS ITS CONTENT, and says so in a way a parent cannot undo: `inline-flex`
   shrink-wraps only while the cross size is `auto`, so in a flex column
   `align-items: stretch` would span the bar across. An explicit fit-content
   width is not auto.
   THE PADDING TURNS WITH THE BAR. A pill needs room at its rounded ENDS,
   which is the long axis — 16 across and 8 through, and the other way round
   when vertical. */
registerStaticStyles('omni-toolbar', webkitBox([
  '.omni-tb{display:inline-flex;flex-direction:row;align-items:center;gap:4px;width:fit-content;background-color:var(--Background);'
    + 'border:1px solid var(--Border-Variant);border-radius:var(--Style-Border-Radius);padding:8px;font-family:inherit;flex-shrink:0}',
  '.omni-tb-v{flex-direction:column}',
  `.omni-tb-float{border-radius:56px;padding:8px 16px;box-shadow:${SHADOW_LEVEL_2}}`,
  '.omni-tb-float.omni-tb-v{padding:16px 8px}',
  '.omni-icon.omni-tb-ic{color:inherit}',
  '.omni-tb-fabrow{display:inline-flex;flex-direction:row;align-items:center;gap:8px}',
  '.omni-tb-fabrow-v{flex-direction:column}',
].join('\n')));

export function Toolbar({
  items = [],
  value: controlledValue,
  defaultValue,
  onChange,
  type = 'floating',
  orientation = 'horizontal',
  /* Unset, the bar is the Nav-Bar theme: the color the user picked for their
     nav bar in the studio. Figma's ToolBar page has ONE set, Nav-Bar, for the
     toolbar and the bottom nav alike, and the import pins every instance to
     that pick — so code does the same. No level is forced on top of it. */
  color,
  /* The LEVEL, separate from the theme. `white` and `black` used to be
     colours here, which is how a lightness ended up wearing a colour name. */
  surface,
  fab,
  className = '',
  sx = {},
  ...props
}) {
  useStaticStyles('omni-toolbar');
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const isControlled = controlledValue !== undefined;
  const activeIndex = isControlled ? controlledValue : internalValue;

  const handleSelect = useCallback((index) => {
    const next = activeIndex === index ? null : index;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [isControlled, activeIndex, onChange]);

  const barTheme = color ? (THEME_MAP[color] || LEGACY_COLORS[color] || THEME_MAP.default) : { theme: 'Nav-Bar' };
  const dataTheme = barTheme.theme;
  /* An explicit surface wins; otherwise a legacy colour's implied one; else
     none — the parent's level. */
  const dataSurface = surface || barTheme.surface;
  const isVertical = orientation === 'vertical';
  const isFloating = type === 'floating';

  const Root = hasSx(sx) ? SxBox : 'div';
  const toolbar = (
    <Root
      {...(Root === 'div' ? {} : { sx })}
      role="toolbar"
      aria-orientation={orientation}
      aria-label="Toolbar"
      data-theme={dataTheme}
      data-surface={dataSurface}
      className={'toolbar toolbar-' + type + ' toolbar-' + orientation + ' toolbar-' + (color || 'nav-bar') + ' ' + className
        + ' MuiBox-root omni-tb' + (isVertical ? ' omni-tb-v' : '') + (isFloating ? ' omni-tb-float' : '')}
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
            <Icon size="small" className="omni-tb-ic">{item.icon}</Icon>
          </Button>
        );
      })}
    </Root>
  );

  // With FAB: toolbar + FAB side by side
  if (fab && isFloating) {
    return (
      <div className={'MuiBox-root omni-tb-fabrow' + (isVertical ? ' omni-tb-fabrow-v' : '')}>
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
          color={fab.color || color || 'default'}
          size={fab.size || 'medium'}
          onClick={fab.onClick}
          aria-label={fab.label || 'Action'}
        >
          {fab.icon}
        </Fab>
      </div>
    );
  }

  return toolbar;
}

export default Toolbar;
