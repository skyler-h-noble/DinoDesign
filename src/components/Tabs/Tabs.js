// src/components/Tabs/Tabs.js
import React, { createContext, useContext, useState, useRef, useCallback, useId, useEffect } from 'react';
import { Box } from '@mui/material';
import { BodySmall, Caption } from '../Typography';

/**
 * Tabs Component Suite
 *
 * Tabs      — context provider + LAYOUT wrapper. Carries no data-theme or
 *             data-surface: it paints nothing (flex + overflow only), and the
 *             pair belongs on whatever paints. That is TabList, which sets
 *             backgroundColor: var(--Background).
 * TabList   — container for Tab items (no data attributes)
 * Tab       — individual tab trigger
 * TabPanel  — content pane shown when tab is selected
 *
 * DATA ATTRIBUTES (on Tabs wrapper):
 *   standard  No data-theme, no data-surface. Indicator: var(--Buttons-{Color}-Border).
 *   solid     data-theme="{Color}", data-surface="Surface".
 *   light     data-theme="{Color}", data-surface="Surface-Brightest".
 *   dark      data-theme="{Color}", data-surface="Surface-Dimmest".
 *
 * TABS (individual):
 *   Unselected: text var(--Text-Quiet), fontWeight 400
 *   Selected:   text var(--Text), fontWeight 600
 *   Indicator (2px): var(--Buttons-{Color}-Border) for standard, var(--Text) for solid/light/dark
 *   Baseline (1px):  var(--Border-Variant) — the rule the tabs sit on
 *   Hover: var(--Hover)
 *   Active: var(--Pressed)
 *   Focus: 3px inset var(--Focus-Visible)
 *   TabList border: var(--Border-Variant)
 *
 * SIZES: small | medium | large
 * ORIENTATION: horizontal | vertical-left | vertical-right ('vertical' = right)
 * DECORATORS: startDecorator / endDecorator per tab
 * ICON ONLY: tabs show only icon, no text
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SOLID_THEME_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
// Light is the same THEME as solid — lightness lives on the surface axis now,
// exactly as dark already does it (dark = the same theme on Surface-Dimmest).
// The *-Light themes this used to name no longer exist in any design system,
// so every light-variant TabList was resolving to nothing.
const LIGHT_THEME_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const DARK_THEME_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

/* A tab is built from BUTTON metrics, which is what keeps it the same size and
 * type as the buttons beside it in a nav bar. These were hardcoded — 10/14/18px
 * padding, 4/6/8px gap, 32/40/48px heights — so a design system that changed
 * its button padding moved every button and left the tabs where they were.
 *
 * The numbers kept as fallbacks are the ones that shipped, so a consumer with
 * no design system CSS loaded sees exactly what it saw before.
 *
 * The indicator is 2px, not 3. The design draws a 2px selector, and the extra
 * pixel came from nowhere in particular.
 */
const SIZE_MAP = {
  small: {
    px: 'var(--Sm-Button-Padding, 8px)',
    fontSize: 'var(--Sm-Button-Text, 14px)',
    iconSize: 'var(--Sm-Button-Icon, 20px)',
    textPad: 'var(--Sm-Button-Text-Padding, 4px)',
    indicatorThickness: '2px',
    minHeight: 'var(--Sm-Button-Height, 24px)',
  },
  medium: {
    px: 'var(--Button-Padding, 8px)',
    fontSize: 'var(--Button-Text, 16px)',
    iconSize: 'var(--Button-Icon, 20px)',
    textPad: 'var(--Button-Text-Padding, 4px)',
    indicatorThickness: '2px',
    minHeight: 'var(--Button-Height, 32px)',
  },
  large: {
    px: 'var(--Lg-Button-Padding, 16px)',
    fontSize: 'var(--Lg-Button-Text, 20px)',
    iconSize: 'var(--Lg-Button-Icon, 32px)',
    textPad: 'var(--Lg-Button-Text-Padding, 8px)',
    indicatorThickness: '2px',
    minHeight: 'var(--Lg-Button-Height, 56px)',
  },
};

/* The gap BETWEEN a tab's parts, distinct from the padding around its text.
 *
 * The design has both and they do different jobs: 2px separates the icon from
 * the label's box, and Button-Text-Padding pads the label inside that box. One
 * number cannot stand in for the pair — collapsing them either crowds the icon
 * or over-pads the text. */
const TAB_CONTENT_GAP = '2px';

/* Baseline and indicator are DIFFERENT thicknesses and that is the design.
 *
 * The baseline is a 1px rule the whole list sits on; the indicator is the 2px
 * mark under the selected tab. Figma draws them as two layers — `Baseline` at
 * 1px spanning the list, `Selector` at 2px per tab — flush at the same outer
 * edge, so the indicator covers the baseline where it lands.
 *
 * Collapsing them to one number is the obvious "simplification" and it is
 * wrong in both directions: a 2px baseline reads as a border, and a 1px
 * indicator disappears next to it. */
const BASELINE_THICKNESS = '1px';

/* Which edge the baseline and indicator sit on, per orientation.
 *
 * 'vertical' is kept as an alias for 'vertical-right' — that is what the
 * component drew before Vertical-Left existed, so an existing consumer keeps
 * its rendering. Figma names the two explicitly, hence the pair here. */
const EDGE = {
  'horizontal': 'Bottom',
  'vertical-left': 'Left',
  'vertical-right': 'Right',
  'vertical': 'Right',
};
export const edgeFor = (orientation) => EDGE[orientation] || 'Bottom';
export const isHorizontalOrientation = (orientation) => orientation === 'horizontal';

/* The baseline and indicator as plain objects, so they can be asserted
 * directly.
 *
 * Not an aesthetic preference: jsdom cannot parse a border shorthand whose
 * color is a var(), so `toHaveStyle('border-bottom: 1px solid var(--X)')`
 * reduces to an empty expectation and PASSES against anything. A DOM test of
 * these two would be green whatever the component drew. */
export function baselineStyle(orientation, baseline = true) {
  if (!baseline) return {};
  return { ['border' + edgeFor(orientation)]: BASELINE_THICKNESS + ' solid var(--Border-Variant)' };
}

/* Hover previews the indicator at half strength.
 *
 * It uses the SAME token as the selector, not --Border-Variant. The baseline is
 * already --Border-Variant, so a hover mark in that color would land a 2px
 * line on top of the 1px rule in the same tone — reading as "the baseline got
 * thicker" rather than "this tab is hovered". And on a vertical list, where
 * there is no baseline behind the tab, it would be a neutral grey unrelated to
 * the brand-colored selector it is previewing.
 *
 * color-mix, not opacity: Figma dims the Hover LAYER to 50%, which in CSS is a
 * half-transparent border color. `opacity: 0.5` on the tab would fade the
 * label and icon too.
 *
 * A selected tab gets nothing — it already draws the indicator at full
 * strength, and painting a 50% mark over it would lighten the selection. */
export function hoverIndicatorStyle(orientation, isSelected, thickness, color) {
  if (isSelected) return {};
  return {
    ['border' + edgeFor(orientation)]:
      thickness + ' solid color-mix(in srgb, ' + color + ' 50%, transparent)',
  };
}

export function indicatorStyle(orientation, isSelected, thickness, color) {
  /* Every edge is stated, three of them 'none', so switching orientation
     cannot leave a stale border behind from the previous one. */
  return {
    borderBottom: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    ['border' + edgeFor(orientation)]:
      thickness + ' solid ' + (isSelected ? color : 'transparent'),
  };
}

/* ─── Context ─── */
const TabsContext = createContext({
  value: 0,
  setValue: () => {},
  variant: 'standard',
  color: 'primary',
  size: 'medium',
  orientation: 'horizontal',
  scrollable: false,
  baseline: true,
  tabsId: '',
});
export const useTabsContext = () => useContext(TabsContext);

/* ─── Tabs ─── */
export function Tabs({
  children,
  defaultValue = 0,
  value: controlledValue,
  onChange,
  variant = 'standard',
  color = 'primary',
  size = 'medium',
  orientation = 'horizontal',
  scrollable = false,
  /* The rule the tabs sit on. Default true, matching the Figma component's
     Baseline boolean, which also defaults on. Turned off where the container
     already provides the separation — an AppBar's own edge, for instance. */
  baseline = true,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const controlled = controlledValue !== undefined;
  const value = controlled ? controlledValue : internalValue;
  const tabsId = useId();

  const setValue = useCallback((val) => {
    if (controlled) {
      onChange?.(val);
    } else {
      setInternalValue(val);
      onChange?.(val);
    }
  }, [controlled, onChange]);

  return (
    <TabsContext.Provider value={{ value, setValue, variant, color, size, orientation, scrollable, baseline, tabsId }}>
      <Box
        className={'tabs tabs-' + orientation + ' tabs-' + size + ' tabs-' + variant
          + (variant !== 'standard' ? ' tabs-' + color : '')
          + (scrollable ? ' tabs-scrollable' : '') + ' ' + className}
        sx={{
          display: 'flex',
          flexDirection: isHorizontalOrientation(orientation) ? 'column' : 'row',
          width: '100%',
          overflow: 'hidden',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </TabsContext.Provider>
  );
}

/* ─── TabList ─── */
export function TabList({
  children,
  rounded = false,
  className = '',
  sx = {},
  ...props
}) {
  const { variant, color, size, orientation, scrollable, baseline, tabsId } = useTabsContext();
  const tabListRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isHorizontal = isHorizontalOrientation(orientation);
  const isStandard = variant === 'standard';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDark = variant === 'dark';

  /* The baseline goes on the same edge the indicator does, so the 2px
     indicator lands on top of the 1px rule rather than beside it. */
  const baselineSx = baselineStyle(orientation, baseline);

  // Theme/surface for the TabList (and individual Tabs inherit via context)
  const dataTheme = isStandard ? undefined
    : isSolid ? SOLID_THEME_MAP[color]
    : isLight ? LIGHT_THEME_MAP[color]
    : isDark ? DARK_THEME_MAP[color]
    : undefined;
  const dataSurface = isStandard ? undefined
    : isDark ? 'Surface-Dimmest'
    : isLight ? 'Surface-Brightest'
    : 'Surface';

  // Scroll state detection
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || !scrollable || !isHorizontal) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, [scrollable, isHorizontal]);

  useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (!el || !scrollable) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [scrollable, updateScrollState]);

  const scrollBy = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  // Keyboard navigation within tab list
  const handleKeyDown = (e) => {
    const container = scrollable ? scrollContainerRef.current : tabListRef.current;
    const tabs = container?.querySelectorAll('[role="tab"]:not([aria-disabled="true"])');
    if (!tabs?.length) return;
    const current = Array.from(tabs).indexOf(document.activeElement);
    if (current < 0) return;

    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    if (e.key === nextKey) {
      e.preventDefault();
      const next = tabs[(current + 1) % tabs.length];
      next.focus();
      if (scrollable) next.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    } else if (e.key === prevKey) {
      e.preventDefault();
      const prev = tabs[(current - 1 + tabs.length) % tabs.length];
      prev.focus();
      if (scrollable) prev.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    } else if (e.key === 'Home') {
      e.preventDefault();
      tabs[0].focus();
      if (scrollable) tabs[0].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    } else if (e.key === 'End') {
      e.preventDefault();
      tabs[tabs.length - 1].focus();
      if (scrollable) tabs[tabs.length - 1].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  };

  const items = React.Children.toArray(children).filter(React.isValidElement);

  const scrollBtnSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    minWidth: '28px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--Text-Quiet)',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'inherit',
    lineHeight: 1,
    flexShrink: 0,
    transition: 'color 0.15s ease, background-color 0.15s ease',
    '&:hover': { color: 'var(--Text)', backgroundColor: 'var(--Hover)' },
    '&:active': { backgroundColor: 'var(--Pressed)' },
    /* The ring sits 1px IN from the edge, not flush against it.
     *
     * outline-offset is measured to the outline's INNER edge, so a 3px outline at
     * -3px lands its outer edge exactly on the border — flush. -4px moves it one
     * more pixel in, leaving the 1px gap Figma draws: the Focus-Visible frame is
     * 129x30 at (1,1) inside a 131x32 tab, with a 3px INSIDE stroke.
     *
     * The arithmetic is why this is easy to get wrong in either direction: the
     * number is the ring's thickness PLUS the gap, not the gap. */
    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-4px' },
    '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'default', '&:hover': { backgroundColor: 'transparent', color: 'var(--Text-Quiet)' } },
  };

  const tabListContent = items.map((child, index) =>
    React.cloneElement(child, { _index: index, key: child.key || index })
  );

  return (
    <Box
      ref={tabListRef}
      data-theme={dataTheme || undefined}
      data-surface={dataSurface || undefined}
      className={
        'tab-list tab-list-' + variant + ' tab-list-' + size + ' tab-list-' + orientation
        + (scrollable ? ' tab-list-scrollable' : '')
        + ' ' + className
      }
      onKeyDown={handleKeyDown}
      sx={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: 0,
        position: 'relative',
        backgroundColor: 'var(--Background)',
        ...baselineSx,
        /* Figma's Tabs frame has no padding: the tabs sit flush and the
           baseline runs the full width. The 4px is for the variants that
           paint a surface behind the tabs, where a selected tab's background
           would otherwise touch the container's edge. Standard has no such
           background, so it takes Figma's zero. */
        padding: (isStandard && !rounded) ? 0 : '4px',
        // overflow: hidden so the active Tab's square-cornered background gets
        // clipped by the parent's border radius when `rounded` is on. Harmless
        // when rounded is off (nothing pokes out of a square container).
        overflow: 'hidden',
        borderRadius: rounded ? 'var(--Style-Border-Radius)' : 0,
        ...sx,
      }}
      {...props}
    >
      {/* Scroll left button */}
      {scrollable && isHorizontal && (
        <Box
          component="button"
          aria-label="Scroll tabs left"
          onClick={() => scrollBy(-1)}
          disabled={!canScrollLeft}
          className="tab-list-scroll-btn tab-list-scroll-btn-left"
          sx={scrollBtnSx}
        >
          ‹
        </Box>
      )}

      {/* Scrollable container or static list */}
      {scrollable && isHorizontal ? (
        <Box
          ref={scrollContainerRef}
          role="tablist"
          aria-orientation={orientation}
          className="tab-list-scroll-container"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            flex: 1,
            minWidth: 0,
          }}
        >
          {tabListContent}
        </Box>
      ) : (
        <Box
          ref={scrollContainerRef}
          role="tablist"
          aria-orientation={orientation}
          sx={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            flex: 1,
          }}
        >
          {tabListContent}
        </Box>
      )}

      {/* Scroll right button */}
      {scrollable && isHorizontal && (
        <Box
          component="button"
          aria-label="Scroll tabs right"
          onClick={() => scrollBy(1)}
          disabled={!canScrollRight}
          className="tab-list-scroll-btn tab-list-scroll-btn-right"
          sx={scrollBtnSx}
        >
          ›
        </Box>
      )}
    </Box>
  );
}

/* ─── Tab ─── */
export function Tab({
  children,
  value: tabValue,
  _index = 0,
  disabled = false,
  startDecorator,
  endDecorator,
  iconOnly = false,
  className = '',
  sx = {},
  ...props
}) {
  const { value, setValue, variant, color, size, orientation, tabsId } = useTabsContext();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isHorizontal = isHorizontalOrientation(orientation);
  const isStandard = variant === 'standard';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDark = variant === 'dark';
  // No white/black: they were never themes with --Buttons-*-Border tokens, and
  // the White/Black themes they named are gone. Neutral on a Bright/Dim
  // surface is the replacement.
  const C = { default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
    neutral: 'Neutral',
    info: 'Info', success: 'Success', warning: 'Warning', error: 'Error' }[color] || 'Default';

  const resolvedValue = tabValue !== undefined ? tabValue : _index;
  const isSelected = value === resolvedValue;

  // Standard: color-specific indicator. Solid/Light/Dark: var(--Text) resolves within themed context.
  const indicatorColor = isStandard
    ? 'var(--Buttons-' + C + '-Border)'
    : 'var(--Text)';

  // data-theme/data-surface on each Tab for themed variants
  const tabDataTheme = isStandard ? undefined
    : isSolid ? SOLID_THEME_MAP[color]
    : isLight ? LIGHT_THEME_MAP[color]
    : isDark ? DARK_THEME_MAP[color]
    : undefined;
  const tabDataSurface = isStandard ? undefined
    : isDark ? 'Surface-Dimmest'
    : isLight ? 'Surface-Brightest'
    : 'Surface';

  const tabId = 'tab-' + tabsId + '-' + resolvedValue;
  const panelId = 'tabpanel-' + tabsId + '-' + resolvedValue;

  const handleClick = () => {
    if (!disabled) setValue(resolvedValue);
  };

  return (
    <Box
      component="button"
      role="tab"
      id={tabId}
      data-theme={tabDataTheme || undefined}
      data-surface={tabDataSurface || undefined}
      aria-selected={isSelected}
      aria-controls={panelId}
      aria-disabled={disabled || undefined}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      className={
        'tab tab-' + size
        + (isSelected ? ' tab-selected' : '')
        + (disabled ? ' tab-disabled' : '')
        + (iconOnly ? ' tab-icon-only' : '')
        + ' ' + className
      }
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: TAB_CONTENT_GAP,
        /* Horizontal padding only. Height comes from minHeight with the
           content centred, which is how the design builds it — a vertical
           padding on top of a min-height specifies the same measurement twice
           and the two disagree the moment either changes. */
        padding: '0 ' + (iconOnly ? '0' : s.px),
        minHeight: s.minHeight,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        fontWeight: 500,
        lineHeight: 1.3,
        color: isSelected ? 'var(--Text)' : 'var(--Quiet)',
        backgroundColor: 'transparent',
        border: 'none',
        /* The indicator sits on ONE edge, chosen by orientation — bottom when
           horizontal, left or right when vertical. Transparent when
           unselected rather than absent, so selecting a tab cannot change its
           size; Figma gets the same result by absolutely positioning the
           Selector with an edge constraint, which is why all fifteen of its
           Tab variants measure the same. */
        ...indicatorStyle(orientation, isSelected, s.indicatorThickness, indicatorColor),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        position: 'relative',
        outline: 'none',
        transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
        flexShrink: 0,
        whiteSpace: 'nowrap',


        ...(!disabled && {
          '&:hover': {
            backgroundColor: 'var(--Hover)',
            ...hoverIndicatorStyle(orientation, isSelected, s.indicatorThickness, indicatorColor),
          },
          '&:active': {
            backgroundColor: 'var(--Pressed)',
          },
          '&:focus-visible': {
            outline: '3px solid var(--Focus-Visible)',
            // 3px ring + 1px gap; see the note on the TabList ring above.
            outlineOffset: '-4px',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {startDecorator && (
        <Box
          className="tab-start-decorator"
          sx={{ display: 'inline-flex', fontSize: s.iconSize, lineHeight: 1, flexShrink: 0 }}
        >
          {startDecorator}
        </Box>
      )}
      {!iconOnly && children && (() => {
        const LabelComp = size === 'small' ? Caption : BodySmall;
        /* The label's own padding, matching the design's Typography Holder.
           It is what separates the text from an icon beside it without moving
           the icon away from the tab's edge — which a single gap would do. */
        return (
          <Box
            className="tab-label"
            sx={{ display: 'inline-flex', alignItems: 'center', padding: '4px ' + s.textPad }}
          >
            <LabelComp style={{ color: 'inherit', fontWeight: 'inherit' }}>{children}</LabelComp>
          </Box>
        );
      })()}
      {endDecorator && (
        <Box
          className="tab-end-decorator"
          sx={{ display: 'inline-flex', fontSize: s.iconSize, lineHeight: 1, flexShrink: 0 }}
        >
          {endDecorator}
        </Box>
      )}
    </Box>
  );
}

/* ─── TabPanel ─── */
export function TabPanel({
  children,
  value: panelValue,
  className = '',
  sx = {},
  ...props
}) {
  const { value, size, tabsId } = useTabsContext();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isActive = value === panelValue;

  const tabId = 'tab-' + tabsId + '-' + panelValue;
  const panelId = 'tabpanel-' + tabsId + '-' + panelValue;

  if (!isActive) return null;

  return (
    <Box
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      className={'tab-panel tab-panel-' + size + ' ' + className}
      sx={{
        paddingTop: '16px',
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        color: 'var(--Text)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Tabs;