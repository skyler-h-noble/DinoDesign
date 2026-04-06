// src/components/Tabs/Tabs.js
import React, { createContext, useContext, useState, useRef, useCallback, useId, useEffect } from 'react';
import { Box } from '@mui/material';
import { BodySmall, Caption } from '../Typography';

/**
 * Tabs Component Suite
 *
 * Tabs      — context provider + wrapper (carries data-theme, data-surface)
 * TabList   — container for Tab items (no data attributes)
 * Tab       — individual tab trigger
 * TabPanel  — content pane shown when tab is selected
 *
 * DATA ATTRIBUTES (on Tabs wrapper):
 *   standard  No data-theme, no data-surface. Indicator: var(--Buttons-{Color}-Border).
 *   solid     data-theme="{Color}", data-surface="Surface".
 *   light     data-theme="{Color}-Light", data-surface="Surface".
 *   dark      data-theme="{Color}", data-surface="Surface-Dimmest".
 *
 * TABS (individual):
 *   Unselected: text var(--Text-Quiet), fontWeight 400
 *   Selected:   text var(--Text), fontWeight 600
 *   Indicator (3px): var(--Buttons-{Color}-Border) for standard, var(--Text) for solid/light/dark
 *   Hover: var(--Hover)
 *   Active: var(--Active)
 *   Focus: 3px inset var(--Focus-Visible)
 *   TabList border: var(--Border-Variant)
 *
 * SIZES: small | medium | large
 * ORIENTATION: horizontal | vertical
 * DECORATORS: startDecorator / endDecorator per tab
 * ICON ONLY: tabs show only icon, no text
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SOLID_THEME_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const LIGHT_THEME_MAP = {
  default: 'Default', primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
const DARK_THEME_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { px: '10px', py: '6px',  fontSize: '13px', iconSize: '16px', gap: '4px', indicatorThickness: '3px', minHeight: '32px' },
  medium: { px: '14px', py: '8px',  fontSize: '14px', iconSize: '18px', gap: '6px', indicatorThickness: '3px', minHeight: '40px' },
  large:  { px: '18px', py: '10px', fontSize: '16px', iconSize: '20px', gap: '8px', indicatorThickness: '3px', minHeight: '48px' },
};

/* ─── Context ─── */
const TabsContext = createContext({
  value: 0,
  setValue: () => {},
  variant: 'standard',
  color: 'primary',
  size: 'medium',
  orientation: 'horizontal',
  scrollable: false,
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
    <TabsContext.Provider value={{ value, setValue, variant, color, size, orientation, scrollable, tabsId }}>
      <Box
        className={'tabs tabs-' + orientation + ' tabs-' + size + ' tabs-' + variant
          + (variant !== 'standard' ? ' tabs-' + color : '')
          + (scrollable ? ' tabs-scrollable' : '') + ' ' + className}
        sx={{
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'column' : 'row',
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
  className = '',
  sx = {},
  ...props
}) {
  const { variant, color, size, orientation, scrollable, tabsId } = useTabsContext();
  const tabListRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isHorizontal = orientation === 'horizontal';
  const isStandard = variant === 'standard';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDark = variant === 'dark';

  // Theme/surface for the TabList (and individual Tabs inherit via context)
  const dataTheme = isStandard ? undefined
    : isSolid ? SOLID_THEME_MAP[color]
    : isLight ? LIGHT_THEME_MAP[color]
    : isDark ? DARK_THEME_MAP[color]
    : undefined;
  const dataSurface = isStandard ? undefined
    : isDark ? 'Surface-Dimmest'
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
    '&:active': { backgroundColor: 'var(--Active)' },
    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
    '&:disabled': { opacity: 0.3, cursor: 'default', '&:hover': { backgroundColor: 'transparent', color: 'var(--Text-Quiet)' } },
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
        ...(isHorizontal && {
          borderBottom: '1px solid var(--Border-Variant)',
        }),
        ...(!isHorizontal && {
          borderRight: '1px solid var(--Border-Variant)',
        }),
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
  const isHorizontal = orientation === 'horizontal';
  const isStandard = variant === 'standard';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDark = variant === 'dark';
  const C = { default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
    neutral: 'Neutral', white: 'White', black: 'Black',
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
        gap: s.gap,
        padding: iconOnly ? s.py + ' ' + s.py : s.py + ' ' + s.px,
        minHeight: s.minHeight,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        fontWeight: isSelected ? 600 : 400,
        lineHeight: 1.3,
        color: isSelected ? 'var(--Text)' : 'var(--Quiet)',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: isHorizontal
          ? (isSelected ? s.indicatorThickness + ' solid ' + indicatorColor : s.indicatorThickness + ' solid transparent')
          : 'none',
        borderRight: !isHorizontal
          ? (isSelected ? s.indicatorThickness + ' solid ' + indicatorColor : s.indicatorThickness + ' solid transparent')
          : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        outline: 'none',
        transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
        flexShrink: 0,
        whiteSpace: 'nowrap',

        // Offset the tab-list border for indicator alignment
        ...(isHorizontal && {
          marginBottom: '-1px',
        }),
        ...(!isHorizontal && {
          marginRight: '-1px',
        }),

        ...(!disabled && {
          '&:hover': {
            backgroundColor: 'var(--Hover)',
            ...(isHorizontal && !isSelected && {
              borderBottomColor: 'var(--Border-Variant)',
            }),
            ...(!isHorizontal && !isSelected && {
              borderRightColor: 'var(--Border-Variant)',
            }),
          },
          '&:active': {
            backgroundColor: 'var(--Active)',
          },
          '&:focus-visible': {
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: '-3px',
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
        return <LabelComp style={{ color: 'inherit', fontWeight: 'inherit' }}>{children}</LabelComp>;
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
        padding: '16px',
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