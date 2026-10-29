// src/components/Tabs/Tabs.js
import React, { createContext, useContext, useState, useRef, useCallback, useId, useEffect, useLayoutEffect } from 'react';
import { Box } from '@mui/material';
import { Button as ButtonTypography, ButtonSmall as ButtonSmallTypography, CAP_HEIGHT_TRIM, Body } from '../Typography';
import { Button } from '../Button/Button';
import { Popover } from '../Popover/Popover';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';

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
 * OVERFLOW (Figma's Overflow axis) — what happens when the tabs don't fit:
 *   none    nothing; the tabs are expected to fit (default)
 *   scroll  the row scrolls, with ghost icon Buttons at either end — ‹ › when
 *           horizontal, up / down when vertical (`scrollable` is the old name)
 *   more    horizontal only: the tabs that fit, then a ghost … Button opening
 *           a Popover of the rest. Picking one selects it; while the selected
 *           tab is in the list, the … shows selected. Vertical tabs can just
 *           scroll, so `more` on a vertical list falls back to scroll and warns.
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
  color: 'default',
  size: 'medium',
  orientation: 'horizontal',
  scrollable: false,
  overflow: 'none',
  baseline: true,
  tabsId: '',
});
export const useTabsContext = () => useContext(TabsContext);

let warnedVerticalMore = false;
/* The … Button's square, per size — what the More measurement reserves before
   the button exists. Button-Height, as Button's own icon-only square. */
const MORE_SIZE = { small: 24, medium: 32, large: 40 };

/* ─── Tabs ─── */
export function Tabs({
  children,
  defaultValue = 0,
  value: controlledValue,
  onChange,
  variant = 'standard',
  color = 'default',  // the brand's default, as Figma's Tabs — never primary
  size = 'medium',
  orientation = 'horizontal',
  scrollable = false,
  /* 'none' | 'scroll' | 'more' — see OVERFLOW above. Unset follows the old
     `scrollable` (true = 'scroll'). */
  overflow: overflowProp,
  /* The rule the tabs sit on. Default true, matching the Figma component's
     Baseline boolean, which also defaults on. Turned off where the container
     already provides the separation — an AppBar's own edge, for instance. */
  baseline = true,
  /* NAVIGATION mode: the same look and marker, as a <nav> of links.
     Tabs switch a panel (role="tab", aria-selected); a site nav goes to a
     place — WAI-ARIA says links, with aria-current on the one you are at.
     Each Tab takes an href; the selected one gets aria-current="location". */
  navigation = false,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const controlled = controlledValue !== undefined;
  const value = controlled ? controlledValue : internalValue;
  const tabsId = useId();
  let overflow = overflowProp || (scrollable ? 'scroll' : 'none');
  if (overflow === 'more' && !isHorizontalOrientation(orientation)) {
    if (process.env.NODE_ENV !== 'production' && !warnedVerticalMore) {
      warnedVerticalMore = true;
      // eslint-disable-next-line no-console
      console.warn('[OmniDesign] <Tabs overflow="more"> is horizontal only — a vertical list scrolls. Rendering overflow="scroll".');
    }
    overflow = 'scroll';
  }
  const isScroll = overflow === 'scroll';

  const setValue = useCallback((val) => {
    if (controlled) {
      onChange?.(val);
    } else {
      setInternalValue(val);
      onChange?.(val);
    }
  }, [controlled, onChange]);

  return (
    <TabsContext.Provider value={{ value, setValue, variant, color, size, orientation, scrollable: isScroll, overflow, baseline, tabsId, navigation }}>
      <Box
        className={'tabs tabs-' + orientation + ' tabs-' + size + ' tabs-' + variant
          + (variant !== 'standard' ? ' tabs-' + color : '')
          + (isScroll ? ' tabs-scrollable' : '') + (overflow === 'more' ? ' tabs-more' : '') + ' ' + className}
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
let warnedRounded = false;
export function TabList({
  children,
  /* Retired: Figma's Tabs frame is square and flush. Accepted so an old call
     doesn't leak `rounded` onto the DOM; renders square and warns once. */
  rounded,
  className = '',
  sx = {},
  ...props
}) {
  const { value, setValue, variant, color, size, orientation, scrollable, overflow, baseline, tabsId, navigation } = useTabsContext();
  const tabListRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const moreRef = useRef(null);
  const widthsRef = useRef([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [visibleCount, setVisibleCount] = useState(null); // null = all
  const [moreOpen, setMoreOpen] = useState(false);
  const isHorizontal = isHorizontalOrientation(orientation);
  const isMore = overflow === 'more' && isHorizontal;
  const isStandard = variant === 'standard';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDark = variant === 'dark';
  if (process.env.NODE_ENV !== 'production' && rounded && !warnedRounded) {
    warnedRounded = true;
    // eslint-disable-next-line no-console
    console.warn('[OmniDesign] <TabList rounded> is retired — the tab list is square and flush, as Figma. Rendering it square.');
  }

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
  // Back / forward: left / right when horizontal, up / down when vertical.
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || !scrollable) return;
    const pos = isHorizontal ? el.scrollLeft : el.scrollTop;
    const max = isHorizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    setCanScrollLeft(pos > 1);
    setCanScrollRight(pos < max - 1);
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
    if (isHorizontal) el.scrollBy({ left: direction * el.clientWidth * 0.6, behavior: 'smooth' });
    else el.scrollBy({ top: direction * el.clientHeight * 0.6, behavior: 'smooth' });
  };

  // Keyboard navigation within tab list
  const handleKeyDown = (e) => {
    // Links keep the browser's own Tab order; arrow-key roving is for tablists.
    if (navigation) return;
    const container = scrollable ? scrollContainerRef.current : tabListRef.current;
    // Tabs folded into More are not in the row, so arrows skip them.
    const tabs = container?.querySelectorAll('[role="tab"]:not([aria-disabled="true"]):not(.tab-overflowed)');
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

  /* More: measure which tabs fit. Widths are read while every tab is shown
     and cached, so hiding the overflow never changes what is measured. The …
     Button's square is reserved first whenever anything has to fold. */
  const measure = useCallback(() => {
    if (!isMore) return;
    const root = tabListRef.current, list = scrollContainerRef.current;
    if (!root || !list) return;
    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    if (!tabs.some((t) => t.classList.contains('tab-overflowed'))) widthsRef.current = tabs.map((t) => t.offsetWidth);
    const widths = widthsRef.current;
    if (!widths.length) return;
    const avail = root.clientWidth;
    const total = widths.reduce((a, b) => a + b, 0);
    if (!avail || total <= avail) { setVisibleCount(null); return; }
    let used = moreRef.current?.offsetWidth || MORE_SIZE[size] || MORE_SIZE.medium;
    let n = 0;
    while (n < widths.length && used + widths[n] <= avail) { used += widths[n]; n += 1; }
    setVisibleCount(Math.max(1, n));
  }, [isMore, size]);

  const childCount = React.Children.toArray(children).filter(React.isValidElement).length;
  useLayoutEffect(() => { if (isMore) { setVisibleCount(null); widthsRef.current = []; } }, [isMore, childCount]);
  useLayoutEffect(() => { measure(); });
  useEffect(() => {
    if (!isMore || typeof ResizeObserver === 'undefined' || !tabListRef.current) return undefined;
    const ro = new ResizeObserver(() => measure());
    ro.observe(tabListRef.current);
    return () => ro.disconnect();
  }, [isMore, measure]);

  const items = React.Children.toArray(children).filter(React.isValidElement);
  const shown = isMore && visibleCount != null ? visibleCount : items.length;
  const overflowed = items.slice(shown).map((child, i) => {
    const index = shown + i;
    return { index, value: child.props.value !== undefined ? child.props.value : index,
      label: child.props.children, icon: child.props.startDecorator, disabled: child.props.disabled };
  });
  const selectedHidden = overflowed.find((o) => o.value === value);

  /* The arrows are the library's icon-only ghost Button (Figma: a ghost
     iconOnly Button at either end). They were raw buttons with a hand-drawn
     glyph, hover and focus ring. */
  const btnSize = size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium';
  /* Overlap the baseline by its 1px, as a Tab does, so the arrows and the …
     sit on the rule instead of adding a pixel to the bar (33 against Figma's 32)
     and centre across the whole width of a vertical list. */
  const btnSx = { flexShrink: 0, alignSelf: 'center', ...(baseline && { ['margin' + edgeFor(orientation)]: '-' + BASELINE_THICKNESS }) };
  const scrollButton = (dir) => (
    <Button iconOnly variant="ghost" size={btnSize}
      aria-label={isHorizontal ? (dir < 0 ? 'Scroll tabs left' : 'Scroll tabs right') : (dir < 0 ? 'Scroll tabs up' : 'Scroll tabs down')}
      onClick={() => scrollBy(dir)} disabled={dir < 0 ? !canScrollLeft : !canScrollRight}
      className={'tab-list-scroll-btn tab-list-scroll-btn-' + (dir < 0 ? (isHorizontal ? 'left' : 'up') : (isHorizontal ? 'right' : 'down'))}
      sx={btnSx}>
      {isHorizontal ? (dir < 0 ? <ChevronLeftIcon /> : <ChevronRightIcon />) : (dir < 0 ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
    </Button>
  );

  const tabListContent = items.map((child, index) =>
    React.cloneElement(child, { _index: index, _overflowed: index >= shown, key: child.key || index })
  );

  const rowSx = {
    display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1, 8px)', width: '100%',
    border: 'none', background: 'transparent', font: 'inherit', color: 'var(--Text)', textAlign: 'left',
    padding: 'var(--Sizing-1, 8px) var(--Sizing-1-and-Half, 12px)', cursor: 'pointer',
    borderRadius: 'var(--Menu-Item-Radius, 0px)',
    '&:hover': { backgroundColor: 'var(--Hover)' },
    '&:active': { backgroundColor: 'var(--Pressed)' },
    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
    '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
  };

  return (
    <Box
      ref={tabListRef}
      data-theme={dataTheme || undefined}
      data-surface={dataSurface || undefined}
      className={
        'tab-list tab-list-' + variant + ' tab-list-' + size + ' tab-list-' + orientation
        + (scrollable ? ' tab-list-scrollable' : '') + (isMore ? ' tab-list-more' : '')
        + ' ' + className
      }
      onKeyDown={handleKeyDown}
      component={navigation ? 'nav' : undefined}
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
        padding: isStandard ? 0 : '4px',
        overflow: 'hidden',
        borderRadius: 0,
        ...sx,
      }}
      {...props}
    >
      {/* Scroll back button */}
      {scrollable && scrollButton(-1)}

      {/* Scrollable container or static list */}
      {scrollable ? (
        <Box
          ref={scrollContainerRef}
          role={navigation ? undefined : 'tablist'}
          aria-orientation={navigation ? undefined : orientation}
          className="tab-list-scroll-container"
          sx={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            ...(isHorizontal ? { overflowX: 'auto' } : { overflowY: 'auto', minHeight: 0 }),
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
          role={navigation ? undefined : 'tablist'}
          aria-orientation={navigation ? undefined : orientation}
          sx={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            flex: 1,
          }}
        >
          {tabListContent}
        </Box>
      )}

      {/* Scroll forward button */}
      {scrollable && scrollButton(1)}

      {/* More: a ghost … Button after the tablist (outside it — it is not a
          tab), opening a Popover of the tabs that did not fit. */}
      {isMore && overflowed.length > 0 && (
        <>
          <Button ref={moreRef} iconOnly variant="ghost" size={btnSize} selected={!!selectedHidden}
            className="tab-list-more-btn" aria-haspopup="dialog" aria-expanded={moreOpen}
            aria-label={overflowed.length + ' more tabs' + (selectedHidden && typeof selectedHidden.label === 'string' ? ', ' + selectedHidden.label + ' selected' : '')}
            onClick={() => setMoreOpen((o) => !o)} sx={btnSx}>
            <MoreHorizIcon />
          </Button>
          <Popover open={moreOpen} onClose={() => setMoreOpen(false)} anchorEl={moreRef.current}
            placement="bottom-end" arrow width="auto" theme={null} aria-label="More tabs">
            <Box className="tab-list-more-menu" sx={{ display: 'flex', flexDirection: 'column', p: 'var(--Sizing-1, 8px)', minWidth: 160 }}>
              {overflowed.map((o) => (
                <Box key={'more-' + o.index} component="button" type="button" className="tab-list-more-item"
                  aria-current={o.value === value ? 'true' : undefined} disabled={o.disabled}
                  onClick={() => { setValue(o.value); setMoreOpen(false); }} sx={rowSx}>
                  {o.icon && <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>{o.icon}</Box>}
                  <Body component="span" sx={{ flex: 1, color: 'inherit', fontWeight: o.value === value ? 600 : undefined }}>{o.label}</Body>
                  {o.value === value && <CheckIcon aria-hidden="true" sx={{ fontSize: 'var(--Button-Icon, 20px)' }} />}
                </Box>
              ))}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  );
}

/* ─── Tab ─── */
export function Tab({
  children,
  value: tabValue,
  _index = 0,
  /* Folded into the TabList's More list — not drawn in the row. */
  _overflowed = false,
  disabled = false,
  startDecorator,
  endDecorator,
  iconOnly = false,
  className = '',
  sx = {},
  ...props
}) {
  const { value, setValue, variant, color, size, orientation, tabsId, baseline, navigation } = useTabsContext();
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

  const { href, onClick: onClickProp, ...restProps } = props;
  const handleClick = (e) => {
    if (!disabled) setValue(resolvedValue);
    if (onClickProp) onClickProp(e);
  };
  /* A link in navigation mode, a tab otherwise — same styles either way. */
  const semantics = navigation
    ? { component: 'a', href, 'aria-current': isSelected ? 'location' : undefined, 'aria-disabled': disabled || undefined }
    : { component: 'button', role: 'tab', id: tabId, 'aria-selected': isSelected, 'aria-controls': panelId,
        'aria-disabled': disabled || undefined, tabIndex: isSelected ? 0 : -1 };

  return (
    <Box
      {...semantics}
      data-theme={tabDataTheme || undefined}
      data-surface={tabDataSurface || undefined}
      onClick={handleClick}
      className={
        'tab tab-' + size
        + (isSelected ? ' tab-selected' : '')
        + (disabled ? ' tab-disabled' : '')
        + (iconOnly ? ' tab-icon-only' : '')
        + (_overflowed ? ' tab-overflowed' : '')
        + ' ' + className
      }
      sx={{
        display: _overflowed ? 'none' : 'inline-flex',
        textDecoration: 'none', // a link in navigation mode looks like a tab
        alignItems: 'center',
        justifyContent: 'center',
        gap: TAB_CONTENT_GAP,
        /* Horizontal padding only. Height comes from minHeight with the
           content centred, which is how the design builds it — a vertical
           padding on top of a min-height specifies the same measurement twice
           and the two disagree the moment either changes. */
        padding: '0 ' + (iconOnly ? '0' : s.px),
        minHeight: s.minHeight,
        fontFamily: 'inherit',
        color: isSelected ? 'var(--Text)' : 'var(--Quiet)',
        /* Transparent, over the list's Background. A tab overlaps the
           baseline by its 1px (below) so the rule runs UNDER the tabs as in
           Figma — visible through an unselected tab, covered by a selected
           one's indicator — instead of beside them, where it pushed a
           Vertical-Left list's tabs 1px in. An opaque tab would hide it. */
        backgroundColor: 'transparent',
        ...(baseline && { ['margin' + edgeFor(orientation)]: '-' + BASELINE_THICKNESS }),
        border: 'none',
        /* The indicator sits on ONE edge, chosen by orientation — bottom when
           horizontal, left or right when vertical. Transparent when
           unselected rather than absent, so selecting a tab cannot change its
           size; Figma gets the same result by absolutely positioning the
           Selector with an edge constraint, which is why all fifteen of its
           Tab variants measure the same. */
        ...indicatorStyle(orientation, isSelected, s.indicatorThickness, indicatorColor),
        /* The indicator border takes layout space; Figma's Selector does not
           (it is positioned over the tab). Give the space back so the content
           sits where Figma's does: horizontally, the same amount on the top
           edge, so the content centres in the full height; vertically, out of
           the bar edge's own padding (an icon-only tab has none, so it goes on
           the opposite edge). */
        ...(isHorizontal
          ? { paddingTop: s.indicatorThickness }
          : iconOnly
            ? { ['padding' + (edgeFor(orientation) === 'Left' ? 'Right' : 'Left')]: s.indicatorThickness }
            : { ['padding' + edgeFor(orientation)]: 'calc(' + s.px + ' - ' + s.indicatorThickness + ')' }),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        position: 'relative',
        outline: 'none',
        transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
        flexShrink: 0,
        whiteSpace: 'nowrap',


        ...(!disabled && {
          /* Engaged, the label turns Text and the fill stays (Figma's Tab draws
             no Hover / Pressed fill); hover previews the selector at 50%. */
          '&:hover': {
            color: 'var(--Text)',
            ...hoverIndicatorStyle(orientation, isSelected, s.indicatorThickness, indicatorColor),
          },
          '&:active': { color: 'var(--Text)' },
          '&:focus-visible': {
            color: 'var(--Text)',
            outline: '3px solid var(--Focus-Visible)',
            // 3px ring + 1px gap; see the note on the TabList ring above.
            outlineOffset: '-4px',
          },
        }),
        ...sx,
      }}
      {...restProps}
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
        // The Button type style (Figma's Dynamic Button), cap-height trimmed as
        // Button's own label is — a tab is a button in a row.
        const LabelComp = size === 'small' ? ButtonSmallTypography : ButtonTypography;
        /* The label's own padding, matching the design's Typography Holder.
           It is what separates the text from an icon beside it without moving
           the icon away from the tab's edge — which a single gap would do. */
        return (
          <Box
            className="tab-label"
            sx={{ display: 'inline-flex', alignItems: 'center', padding: '4px ' + s.textPad }}
          >
            <LabelComp component="span" sx={{ color: 'inherit', ...CAP_HEIGHT_TRIM }}>{children}</LabelComp>
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