// src/components/AppBar/AppBar.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Tabs, TabList, Tab } from '../Tabs/Tabs';
import { H3 } from '../Typography';
import { Button } from '../Button/Button';
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */
import { SHADOW_LEVEL_2 } from '../_shadows';

/* Loaded only when used. Most bars never open the drawer and many show no
   search, so neither belongs in the first download. The drawer starts loading
   when the menu button is first pointed at or focused, so it is there by the
   time the press lands; Drawer renders nothing while closed, so mounting it
   then loses no animation. */
const loadDrawer = () => import('../Drawer/Drawer');
const Drawer = lazy(() => loadDrawer().then((m) => ({ default: m.Drawer })));
const SearchField = lazy(() => import('../SearchField/SearchField').then((m) => ({ default: m.SearchField })));

/** Drawer state that also records whether the drawer has been wanted yet. */
function useNavDrawer() {
  const [open, setOpenState] = useState(false);
  const [wanted, setWanted] = useState(false);
  const setOpen = (v) => { if (v) setWanted(true); setOpenState(v); };
  const prefetch = () => { loadDrawer(); setWanted(true); };
  return [open, setOpen, wanted, prefetch];
}

/**
 * AppBar Component
 *
 * Always: bg var(--Background), text var(--Text), box-shadow var(--Effect-Level-1)
 *
 * BAR COLORS (sets data-theme):
 *   default        data-theme="App-Bar"
 *   primary        data-theme="Primary"
 *   primary-light  data-theme="Primary"  data-surface="Surface-Brightest"
 *   white          data-theme="Neutral"  data-surface="Surface-Brightest"
 *   black          data-theme="Neutral"  data-surface="Surface-Dimmest"
 *
 * SURFACE (sets data-surface, default "Surface"):
 *   Surface-Dimmest | Surface-Dim | Surface | Surface-Bright | Surface-Brightest
 *
 * DESKTOP: Login, Menu (expanded only <=3 links), Branding, Search, Right buttons
 * MOBILE: search, small, medium, large
 */

// Each bar color is a THEME plus, where the color implies a lightness, a
// SURFACE. Lightness stopped being a theme: White, Black and the *-Light
// themes no longer exist in any design system, so `barColor="black"` used to
// set a data-theme with no matching CSS and the bar rendered unthemed.
//
// A `surface` here overrides the component's own surface prop; without one the
// prop stands.
const THEME_MAP = {
  'default':        { theme: 'App-Bar' },
  'primary':        { theme: 'Primary' },
  'primary-light':  { theme: 'Primary', surface: 'Surface-Brightest' },
  'white':          { theme: 'Neutral', surface: 'Surface-Brightest' },
  'black':          { theme: 'Neutral', surface: 'Surface-Dimmest' },
};

/* --- Size ---
   small | medium | large — the Component-Size mode. The bar is that size's
   App-Bar-Height (Button-Height + 2 × Sizing-2: 56 / 64 / 88 at the default
   buttons), so it always holds that size's buttons and tabs; the bar's own
   icon buttons take the same size. */
const BAR_HEIGHT = {
  small: 'var(--Sm-App-Bar-Height, 56px)',
  medium: 'var(--App-Bar-Height, 64px)',
  large: 'var(--Lg-App-Bar-Height, 88px)',
};
const AppBarSizeContext = React.createContext('medium');
const barHeight = (size) => BAR_HEIGHT[size] || BAR_HEIGHT.medium;

/* --- Icon Button (uses Button component) --- */
function AppBarIconButton({ children, onClick, ariaLabel, onIntent }) {
  const size = React.useContext(AppBarSizeContext);
  return (
    <Button iconOnly variant="ghost" size={size} onClick={onClick} aria-label={ariaLabel}
      onPointerEnter={onIntent} onFocus={onIntent}>
      {children}
    </Button>
  );
}

/* --- Desktop AppBar ---
 * Slot props (override hardcoded defaults when provided):
 *   brand        — string or ReactNode shown in the brand spot (overrides companyName)
 *   onBrandClick — click handler for the brand (makes it a button)
 *   centerSlot   — ReactNode replacing the default search/tabs in the middle
 *   endSlot      — ReactNode replacing the default right buttons + login on the right
 *
 * When a slot is NOT provided, the previous hardcoded UI renders unchanged
 * (backward compatible).
 */
function DesktopAppBar({
  barColor = 'default',
  surface = 'Surface',
  /* menuType — how navLinks show:
       auto      (default) inline on a wide bar; below `collapseAt` they fold
                 into a menu button that opens a drawer of the SAME links
       hamburger always the menu button
       expanded  always inline, as tabs
       none      no menu at all
     It defaulted to 'hamburger' with navLinks defaulting to Home / Products /
     About, so every bar — including ones whose links lived in centerSlot —
     drew a menu button that opened a drawer of placeholder links. */
  loginType = 'login', menuType = 'auto', brandType = 'name',
  /* 'left' | 'right' | 'none'. Unset: a bar with navLinks is a site nav and
     gets no search; a bar without keeps the search it always had. */
  searchPosition: searchPositionProp, companyName = 'Company',
  /* Links: { label, href } / { label, onClick }, or plain strings. */
  navLinks = [],
  /* Width (px) below which `auto` folds the links into the menu button —
     900 is the Adaptive Nav's tablet-horizontal breakpoint. */
  collapseAt = 900,
  rightButtons = [], showRightButtons = false,
  onMenuClick,
  user,
  onLogin,
  onSignOut,
  brand,
  onBrandClick,
  centerSlot,
  endSlot,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  /* Figma's AppBar `Layout`: 'left-brand' | 'center-brand' | 'title'. When
     set, the bar is built the way the Figma set draws it (see layoutBar
     below) from `brand`, `title`, `centerSlot` and `endSlot`; when unset the
     bar renders as it always has, so existing callers do not move. */
  layout,
  title,
  // Figma's `Menu` boolean: the ghost menu button at the start.
  showMenu = true,
  children,
  className = '', sx = {},
}) {
  const barSize = React.useContext(AppBarSizeContext);
  const [drawerOpen, setDrawerOpen, drawerWanted, prefetchDrawer] = useNavDrawer();
  const barTheme = THEME_MAP[barColor] || THEME_MAP.default;
  const dataTheme = barTheme.theme;
  const dataSurface = barTheme.surface || surface;
  const links = navLinks.map((l) => (typeof l === 'string' ? { label: l } : l));
  /* Which link is current: an explicit `current` wins; otherwise, for links
     to sections on this page (#id), the section on screen as you scroll; a
     click marks its link at once. */
  const explicit = links.findIndex((l) => l.current);
  const [spied, setSpied] = useState(-1);
  const [clicked, setClicked] = useState(-1);
  const currentIndex = explicit >= 0 ? explicit : (spied >= 0 ? spied : clicked);
  const setCurrentIndex = (i) => setClicked(i);
  const hashKey = links.map((l) => l.href || '').join('|');
  useEffect(() => {
    if (explicit >= 0 || typeof window === 'undefined' || !('IntersectionObserver' in window)) return undefined;
    const targets = links.map((l, i) => ({ i, el: l.href && l.href.startsWith('#') && l.href.length > 1 ? document.getElementById(l.href.slice(1)) : null }))
      .filter((t) => t.el);
    if (!targets.length) return undefined;
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { const t = targets.find((x) => x.el === e.target); if (t) visible.set(t.i, e.isIntersecting); });
      const on = targets.filter((t) => visible.get(t.i));
      setSpied(on.length ? on[0].i : -1);
    }, { rootMargin: '-35% 0px -60% 0px' });
    targets.forEach((t) => io.observe(t.el));
    return () => io.disconnect();
  // eslint-disable-next-line
  }, [explicit, hashKey]);
  const searchPosition = searchPositionProp ?? (links.length ? 'none' : 'right');
  const effectiveMenu = (menuType === 'expanded' && links.length > 3) ? 'hamburger' : menuType;
  /* The menu button only appears when it opens something: links for the
     drawer, or the caller's own onMenuClick. showMenu={false} hides it in
     every layout (it used to reach the `layout` bar only). */
  /* endSlot as a fragment or array is a list of actions. On a collapsed bar
     every action but the LAST moves into the drawer under the links, and the
     last (the primary — "Get started") stays in the bar: two small buttons
     beside a brand and a menu button overflowed a 390px phone. */
  const flatten = (node) => React.Children.toArray(node).flatMap((c) => (
    React.isValidElement(c) && c.type === React.Fragment ? flatten(c.props.children) : [c]));
  const endItems = endSlot !== undefined ? flatten(endSlot) : [];
  const movesActions = menuType === 'auto' && endItems.length > 1;
  const canOpen = links.length > 0 || Boolean(onMenuClick) || movesActions;
  const menuButton = showMenu && canOpen && (effectiveMenu === 'hamburger' || effectiveMenu === 'auto');
  const below = '@media (max-width: ' + (collapseAt - 0.02) + 'px)';

  // The navigation drawer the menu button opens — shared by both bars.
  const navDrawer = drawerWanted && (
      <Suspense fallback={null}>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left" size="small">
        <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 'var(--Sizing-2, 16px)' }}>
          {links.map((link, i) => (
            <Button
              key={typeof link.label === 'string' ? link.label : i}
              variant="ghost"
              size="medium"
              href={link.href}
              aria-current={i === currentIndex ? 'location' : undefined}
              selected={i === currentIndex}
              onClick={(e) => { setDrawerOpen(false); setCurrentIndex(i); if (link.onClick) link.onClick(e); }}
              sx={{ justifyContent: 'flex-start', width: '100%' }}
            >
              {link.label}
            </Button>
          ))}
          {movesActions && (
            <Box className="appbar-drawer-actions" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--Sizing-1, 8px)', mt: 'var(--Sizing-2, 16px)' }}>
              {endItems.slice(0, -1)}
            </Box>
          )}
        </Box>
      </Drawer>
      </Suspense>
  );

  if (layout) {
    /* As the Figma AppBar (7442:31333): App-Bar-Height tall, the page Margin
       either side (the Title layout starts at Sizing-2), the Level 2 shadow,
       and three groups spread across the bar —
         left-brand    menu + brand · tabs centred on the bottom edge · end
         center-brand  menu · tabs from the left · end, brand centred on the bar
         title         H3 title · end
       The end group is whatever endSlot holds (Figma: a ButtonGroup and an
       avatar button, Sizing-2 apart). */
    const menu = showMenu && layout !== 'title' && (
      <AppBarIconButton ariaLabel="Open navigation menu" onClick={onMenuClick || (() => setDrawerOpen(true))} onIntent={onMenuClick ? undefined : prefetchDrawer}>
        <MenuIcon sx={{ fontSize: 'inherit' }} />
      </AppBarIconButton>
    );
    const brandNode = typeof brand === 'string' ? <H3 component="span">{brand}</H3> : brand;
    return (
      <>
      <Box
        component="header" role="banner"
        data-theme={dataTheme}
        data-surface={dataSurface}
        className={'appbar appbar-desktop appbar-layout-' + layout + ' appbar-' + barColor + (className ? ' ' + className : '')}
        sx={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          // The Margin padding sits INSIDE the bar's width, as in Figma: a bar
          // given 1920px is 1920px, not 1920 plus 128 of padding.
          boxSizing: 'border-box',
          height: barHeight(barSize),
          paddingLeft: layout === 'title' ? 'var(--Sizing-2, 16px)' : 'var(--Margin, 64px)',
          paddingRight: 'var(--Margin, 64px)',
          backgroundColor: 'var(--Background)', color: 'var(--Text)',
          boxShadow: SHADOW_LEVEL_2,  // App bars
          fontFamily: 'inherit',
          ...sx,
        }}
      >
        {layout === 'title' ? (
          <H3 className="appbar-title">{title}</H3>
        ) : (
          <Box className="appbar-start" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1, 8px)', flexShrink: 0 }}>
            {menu}
            {layout === 'left-brand' && brandNode}
          </Box>
        )}
        {layout !== 'title' && (
          <Box
            className="appbar-center"
            sx={{
              flex: 1, alignSelf: 'stretch', minWidth: 0,
              display: 'flex', alignItems: 'flex-end',
              justifyContent: layout === 'left-brand' ? 'center' : 'flex-start',
            }}
          >
            {centerSlot}
          </Box>
        )}
        <Box className="appbar-end" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-2, 16px)', flexShrink: 0 }}>
          {endSlot}
        </Box>
        {layout === 'center-brand' && (
          // Centred on the whole bar, not on the space between the groups.
          <Box className="appbar-brand-centre" sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', '& > *': { pointerEvents: 'auto' } }}>
            {brandNode}
          </Box>
        )}
      </Box>
      {navDrawer}
      </>
    );
  }

  const searchFlex = searchPosition === 'left' ? '0 1 400px' : '0 1 280px';
  /* The placeholder holds the field's room in the bar, so nothing moves when
     it arrives. */
  const searchField = (
    <Suspense fallback={<div aria-hidden="true" style={{ flex: searchFlex, minWidth: 0 }} />}>
      <SearchField
        placeholder={searchPlaceholder}
        size="medium"
        value={searchValue}
        onChange={onSearchChange}
        sx={{ flex: searchFlex, minWidth: 0 }}
      />
    </Suspense>
  );

  return (
    <>
    <Box
      component="header" role="banner"
      data-theme={dataTheme}
      data-surface={dataSurface}
      className={'appbar appbar-desktop appbar-' + barColor + (className ? ' ' + className : '')}
      sx={{
        display: 'flex', alignItems: 'center', height: barHeight(barSize),
        px: 2, gap: 2,
        backgroundColor: 'var(--Background)', color: 'var(--Text)',
        boxShadow: SHADOW_LEVEL_2,  // App bars

        fontFamily: 'inherit',
        ...sx,
      }}
    >
      {children || (
        <>
          {menuButton && (
            <Box
              className="appbar-menu"
              sx={effectiveMenu === 'auto' ? { display: 'none', [below]: { display: 'contents' } } : { display: 'contents' }}
            >
              <AppBarIconButton ariaLabel="Open navigation menu" onClick={onMenuClick || (() => setDrawerOpen(true))} onIntent={onMenuClick ? undefined : prefetchDrawer}>
                <MenuIcon sx={{ fontSize: 'inherit' }} />
              </AppBarIconButton>
            </Box>
          )}

          {/* The wordmark is H3 — the STYLE, on a span or a button.
              It was `fontWeight: 700, fontSize: '18px'` and no font-family at
              all, so it inherited whatever face the bar happened to give it and
              the brand name came out in a typeface nobody had chosen. H3 reads
              --Font-Family-Header, --H3-Font-Weight and --Font-Variation-Header,
              so the wordmark picks up every Google Sans Flex axis the design
              tunes — weight, width, optical size, slant, grade, roundness —
              instead of sitting at the variable font's defaults beside headings
              that do not.

              component="span" / "button" on purpose: H3 renders an <h3>, and a
              wordmark is not a section heading. Left as one it joins the
              document outline above the page's own H1 and a screen reader
              announces the brand as a heading on every screen. The style is
              what was wanted here; the semantics were not.

              Nothing new in Figma — this IS H3, so there is no wordmark
              variable or style to keep in step.

              width="hug" is REQUIRED. Headings default to width="fill", and
              with flexShrink: 0 a filling wordmark takes the whole bar and
              pushes centerSlot and endSlot off the right edge — Login rendered,
              in the DOM, and unreachable on every screen width. */}
          {/* Brand: slot overrides default rendering */}
          {brand !== undefined ? (
            onBrandClick ? (
              <H3
                component="button"
                type="button"
                width="hug"
                onClick={onBrandClick}
                sx={{
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {brand}
              </H3>
            ) : (
              <H3 component="span" width="hug" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{brand}</H3>
            )
          ) : brandType === 'logo' ? (
            <Box sx={{ width: 32, height: 32, borderRadius: '6px', backgroundColor: 'var(--Text)', opacity: 0.8, flexShrink: 0 }} aria-label="Company logo" />
          ) : (
            <H3 component="span" width="hug" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{companyName}</H3>
          )}

          {/* Center: slot overrides default search/tabs.
              Uses equal-flex spacers on both sides so the slot stays visually
              centered in the AppBar regardless of brand or end-slot widths. */}
          {centerSlot !== undefined ? (
            <>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {centerSlot}
              </Box>
              <Box sx={{ flex: 1 }} />
            </>
          ) : (
            <>
              {searchPosition === 'left' && searchField}

              {effectiveMenu === 'expanded' && (
                <Tabs defaultValue={0} variant="standard" color="default" size={barSize} sx={{ ml: 2, minHeight: 0 }}>
                  <TabList aria-label="Main navigation">
                    {links.map((link, i) => (
                      <Tab key={i}>{link.label}</Tab>
                    ))}
                  </TabList>
                </Tabs>
              )}

              {/* auto: the links inline and centred on a wide bar; hidden below
                  collapseAt, where the menu button opens the same list. */}
              {effectiveMenu === 'auto' && links.length > 0 ? (
                <>
                  <Box sx={{ flex: 1 }} />
                  {/* The system's Tabs, as links: same look and selected marker
                      as every other tab bar, with aria-current on the section
                      you are at (a site nav goes to a place; it does not
                      switch a panel, so no tab roles). */}
                  {/* Centred on the bar's height, like the brand and the actions beside it. */}
                  <Box className="appbar-links" sx={{ display: 'flex', alignItems: 'center', alignSelf: 'center', flexShrink: 0, [below]: { display: 'none' } }}>
                    <Tabs navigation value={currentIndex} onChange={setCurrentIndex} baseline={false} size={barSize}
                          sx={{ display: 'flex', alignItems: 'center' }}>
                      <TabList aria-label="Main navigation">
                        {links.map((link, i) => (
                          <Tab key={typeof link.label === 'string' ? link.label : i} value={i} href={link.href} onClick={link.onClick}>{link.label}</Tab>
                        ))}
                      </TabList>
                    </Tabs>
                  </Box>
                </>
              ) : null}

              <Box sx={{ flex: 1 }} />

              {searchPosition === 'right' && searchField}
            </>
          )}

          {/* End: slot overrides default right buttons + login.
              Wrap consumer children in a flex container with an 8px gap so
              multiple direct children space themselves consistently without
              each consumer needing its own HStack/Box wrapper. */}
          {endSlot !== undefined ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {movesActions ? (
                <>
                  <Box className="appbar-end-secondary" sx={{ display: 'contents', [below]: { display: 'none' } }}>
                    {endItems.slice(0, -1)}
                  </Box>
                  {endItems[endItems.length - 1]}
                </>
              ) : endSlot}
            </Box>
          ) : (
            <>
              {showRightButtons && rightButtons.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {rightButtons.map((btn, i) =>
                    btn.raw ? (
                      <React.Fragment key={i}>{btn.icon}</React.Fragment>
                    ) : (
                      <AppBarIconButton key={i} ariaLabel={btn.label || 'Action ' + (i + 1)}>
                        {btn.icon}
                      </AppBarIconButton>
                    )
                  )}
                </Box>
              )}

              {user ? (
                <Button variant="ghost" size="small" onClick={onSignOut} aria-label="Sign out"
                  startIcon={
                    user.photoURL ? (
                      <Box component="img" src={user.photoURL} alt=""
                        sx={{ width: 24, height: 24, borderRadius: '50%' }} />
                    ) : (
                      <AccountCircleIcon sx={{ fontSize: 24 }} />
                    )
                  }>
                  {user.displayName?.split(' ')[0] || 'Account'}
                </Button>
              ) : onLogin ? (
                <Button variant="default-outline" size="small" onClick={onLogin}>
                  Login
                </Button>
              ) : loginType === 'avatar' ? (
                <Button iconOnly variant="ghost" size="medium" aria-label="Account">
                  <AccountCircleIcon sx={{ fontSize: 28 }} />
                </Button>
              ) : null}
            </>
          )}
        </>
      )}
    </Box>

    {navDrawer}
    </>
  );
}

/* --- Mobile AppBar --- */
function MobileAppBar({
  mobileVariant = 'search',
  barColor = 'default',
  surface = 'Surface',
  title = 'Page Title', subtitle = 'Subtitle text',
  actionIcon, companyName = 'Company',
  /* { label, href } / { label, onClick } or strings. No placeholder default:
     the menu button only appears when there are links to open. */
  navLinks = [],
  className = '', sx = {},
}) {
  const barSize = React.useContext(AppBarSizeContext);
  const [drawerOpen, setDrawerOpen, drawerWanted, prefetchDrawer] = useNavDrawer();
  const barTheme = THEME_MAP[barColor] || THEME_MAP.default;
  const dataTheme = barTheme.theme;
  const dataSurface = barTheme.surface || surface;

  const containerSx = {
    backgroundColor: 'var(--Background)', color: 'var(--Text)',
    boxShadow: SHADOW_LEVEL_2,  // App bars

    fontFamily: 'inherit', width: '100%', maxWidth: 420,
    ...sx,
  };

  const commonProps = {
    'data-theme': dataTheme,
    'data-surface': dataSurface,
  };

  const links = navLinks.map((l) => (typeof l === 'string' ? { label: l } : l));
  const navDrawer = drawerWanted && (
    <Suspense fallback={null}>
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left" size="small">
      <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 1 }}>
        {links.map((link, i) => (
          <Button
            key={typeof link.label === 'string' ? link.label : i}
            variant="ghost"
            size="medium"
            href={link.href}
            onClick={(e) => { setDrawerOpen(false); if (link.onClick) link.onClick(e); }}
            sx={{ justifyContent: 'flex-start', width: '100%' }}
          >
            {link.label}
          </Button>
        ))}
      </Box>
    </Drawer>
    </Suspense>
  );

  if (mobileVariant === 'search') {
    return (
      <>
      <Box component="header" role="banner" className={'appbar appbar-mobile appbar-mobile-search appbar-' + barColor + ' ' + className}
        {...commonProps}
        sx={{ ...containerSx, display: 'flex', alignItems: 'center', height: barHeight(barSize), px: 1.5, gap: 1.5 }}>
        {links.length > 0 && (
          <AppBarIconButton ariaLabel="Open navigation menu" onClick={() => setDrawerOpen(true)} onIntent={prefetchDrawer}>
            <MenuIcon sx={{ fontSize: 'inherit' }} />
          </AppBarIconButton>
        )}
        <Suspense fallback={<div aria-hidden="true" style={{ flex: 1, minWidth: 0 }} />}>
          <SearchField
            placeholder={'Search ' + companyName}
            size="small"
            sx={{ flex: 1, minWidth: 0 }}
          />
        </Suspense>
        <Button iconOnly variant="ghost" size="medium" aria-label="Account">
          <AccountCircleIcon sx={{ fontSize: 28 }} />
        </Button>
      </Box>
      {navDrawer}
      </>
    );
  }

  if (mobileVariant === 'small') {
    return (
      <Box component="header" role="banner" className={'appbar appbar-mobile appbar-mobile-small appbar-' + barColor + ' ' + className}
        {...commonProps}
        sx={{ ...containerSx, display: 'flex', alignItems: 'center', height: barHeight(barSize), px: 1.5, gap: 1 }}>
        <AppBarIconButton ariaLabel="Back">
          <ArrowBackIcon sx={{ fontSize: 'inherit' }} />
        </AppBarIconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Box>
          {subtitle && <Box sx={{ fontSize: '12px', opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</Box>}
        </Box>
        {actionIcon && (
          <AppBarIconButton ariaLabel="Action">
            {actionIcon}
          </AppBarIconButton>
        )}
      </Box>
    );
  }

  if (mobileVariant === 'medium') {
    return (
      <Box component="header" role="banner" className={'appbar appbar-mobile appbar-mobile-medium appbar-' + barColor + ' ' + className}
        {...commonProps}
        sx={{ ...containerSx, px: 1.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 56, gap: 1 }}>
          <AppBarIconButton ariaLabel="Back">
            <ArrowBackIcon sx={{ fontSize: 'inherit' }} />
          </AppBarIconButton>
          <Box sx={{ flex: 1 }} />
          {actionIcon && (
            <AppBarIconButton ariaLabel="Action">
              {actionIcon}
            </AppBarIconButton>
          )}
        </Box>
        <Box sx={{ px: 1.5 }}>
          <Box sx={{ fontWeight: 600, fontSize: '24px', lineHeight: 1.2 }}>{title}</Box>
          {subtitle && <Box sx={{ fontSize: '14px', opacity: 0.7, mt: 0.5 }}>{subtitle}</Box>}
        </Box>
      </Box>
    );
  }

  // large
  return (
    <Box component="header" role="banner" className={'appbar appbar-mobile appbar-mobile-large appbar-' + barColor + ' ' + className}
      {...commonProps}
      sx={{ ...containerSx, px: 1.5, pb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', height: 56, gap: 1 }}>
        <AppBarIconButton ariaLabel="Back">
          <ArrowBackIcon sx={{ fontSize: 'inherit' }} />
        </AppBarIconButton>
        <Box sx={{ flex: 1 }} />
        {actionIcon && (
          <AppBarIconButton ariaLabel="Action">
            {actionIcon}
          </AppBarIconButton>
        )}
      </Box>
      <Box sx={{ px: 1.5, mt: 1 }}>
        <Box sx={{ fontWeight: 600, fontSize: '36px', lineHeight: 1.1 }}>{title}</Box>
        {subtitle && <Box sx={{ fontSize: '14px', opacity: 0.7, mt: 0.5 }}>{subtitle}</Box>}
      </Box>
    </Box>
  );
}

export function AppBar({ mode = 'desktop', size = 'medium', ...props }) {
  const s = BAR_HEIGHT[size] ? size : 'medium';
  return (
    <AppBarSizeContext.Provider value={s}>
      {mode === 'mobile' ? <MobileAppBar {...props} /> : <DesktopAppBar {...props} />}
    </AppBarSizeContext.Provider>
  );
}

export { DesktopAppBar, MobileAppBar };
export default AppBar;
