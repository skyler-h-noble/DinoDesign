// src/components/AppBar/AppBar.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
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

/* --- Static sheet ---
   The bar itself as classes over the tokens, so a caller's own CSS can still
   reach it. Its inner layout boxes are plain elements with inline styles; the
   one thing that has to be a stylesheet is the collapse, a media query whose
   width is the `collapseAt` prop — so each width in use gets its own small
   sheet (collapseSheet). */
const SxBox = lazySxBox('AppBar');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

registerStaticStyles('omni-appbar', [
  `.omni-ab{background-color:var(--Background);color:var(--Text);box-shadow:${SHADOW_LEVEL_2};font-family:inherit}`,
  '.omni-ab-sticky{position:sticky;top:0;z-index:1100}',
  '.omni-ab-rel{position:relative}',
  '.omni-ab-desk{display:flex;align-items:center;height:var(--_ab-h);padding-left:16px;padding-right:16px;gap:16px}',
  // The Margin padding sits INSIDE the bar's width, as in Figma.
  '.omni-ab-layout{display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;height:var(--_ab-h);padding-left:var(--Margin, 64px);padding-right:var(--Margin, 64px)}',
  '.omni-ab-layout-title{padding-left:var(--Sizing-2, 16px)}',
  '.omni-ab-mob{width:100%;max-width:420px}',
  '.omni-ab-brand-centre{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}',
  '.omni-ab-brand-centre > *{pointer-events:auto}',
  // auto: the menu button exists only below collapseAt (see collapseSheet).
  '.omni-ab-menu-auto{display:none}',
  '.omni-ab-menu{display:contents}',
  /* Display lives here, not inline, so the collapse rule can hide them. */
  '.omni-ab-links{display:flex;align-items:center;align-self:center;flex-shrink:0}',
  '.omni-ab-endsec{display:contents}',
].join('\n'));

/* Below collapseAt the links fold into the menu button, and every end action
   but the last moves into the drawer. */
function useCollapseSheet(collapseAt) {
  const id = 'omni-appbar-below-' + String(collapseAt).replace(/[^\w-]/g, '_');
  const c = String(collapseAt).replace(/[^\w-]/g, '_');
  registerStaticStyles(id, `@media (max-width: ${collapseAt - 0.02}px){`
    + `.omni-ab-below-${c} .omni-ab-menu-auto{display:contents}`
    + `.omni-ab-below-${c} .appbar-links,.omni-ab-below-${c} .appbar-end-secondary{display:none}}`);
  useStaticStyles(id);
  return 'omni-ab-below-' + c;
}

/** The bar's root: static classes, plus an MUI box only when given sx. */
function BarRoot({ sx, ...props }) {
  if (hasSx(sx)) return <SxBox component="header" sx={sx} {...props} />;
  return <header {...props} />;
}

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
  /* A site's nav stays at the top of the page as it scrolls. On by default;
     sticky={false} lets the bar scroll away with the content. It sticks within
     its scrolling parent, so inside a scroll pane it stays at that pane's top. */
  sticky = true,
  children,
  className = '', sx,
}) {
  useStaticStyles('omni-appbar');
  const barSize = React.useContext(AppBarSizeContext);
  const placement = sticky ? ' omni-ab-sticky' : ' omni-ab-rel';
  const belowClass = useCollapseSheet(collapseAt);
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

  // The navigation drawer the menu button opens — shared by both bars.
  const navDrawer = drawerWanted && (
      <Suspense fallback={null}>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left" size="small">
        <nav aria-label="Main navigation" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 'var(--Sizing-2, 16px)' }}>
          {links.map((link, i) => (
            <Button
              key={typeof link.label === 'string' ? link.label : i}
              variant="ghost"
              size="medium"
              href={link.href}
              aria-current={i === currentIndex ? 'location' : undefined}
              selected={i === currentIndex}
              onClick={(e) => { setDrawerOpen(false); setCurrentIndex(i); if (link.onClick) link.onClick(e); }}
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              {link.label}
            </Button>
          ))}
          {movesActions && (
            <div className="appbar-drawer-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--Sizing-1, 8px)', marginTop: 'var(--Sizing-2, 16px)' }}>
              {endItems.slice(0, -1)}
            </div>
          )}
        </nav>
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
        <MenuIcon />
      </AppBarIconButton>
    );
    const brandNode = typeof brand === 'string' ? <H3 component="span">{brand}</H3> : brand;
    return (
      <>
      <BarRoot
        role="banner"
        data-theme={dataTheme}
        data-surface={dataSurface}
        className={'appbar appbar-desktop appbar-layout-' + layout + ' appbar-' + barColor
          + ' omni-ab omni-ab-layout' + (layout === 'title' ? ' omni-ab-layout-title' : '') + placement
          + (className ? ' ' + className : '')}
        style={{ '--_ab-h': barHeight(barSize) }}
        sx={sx}
      >
        {layout === 'title' ? (
          <H3 className="appbar-title">{title}</H3>
        ) : (
          <div className="appbar-start" style={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1, 8px)', flexShrink: 0 }}>
            {menu}
            {layout === 'left-brand' && brandNode}
          </div>
        )}
        {layout !== 'title' && (
          <div
            className="appbar-center"
            style={{
              flex: 1, alignSelf: 'stretch', minWidth: 0,
              display: 'flex', alignItems: 'flex-end',
              justifyContent: layout === 'left-brand' ? 'center' : 'flex-start',
            }}
          >
            {centerSlot}
          </div>
        )}
        <div className="appbar-end" style={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-2, 16px)', flexShrink: 0 }}>
          {endSlot}
        </div>
        {layout === 'center-brand' && (
          // Centred on the whole bar, not on the space between the groups.
          <div className="appbar-brand-centre omni-ab-brand-centre">
            {brandNode}
          </div>
        )}
      </BarRoot>
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
  const spacer = <div style={{ flex: 1 }} />;

  return (
    <>
    <BarRoot
      role="banner"
      data-theme={dataTheme}
      data-surface={dataSurface}
      className={'appbar appbar-desktop appbar-' + barColor + ' omni-ab omni-ab-desk ' + belowClass + placement
        + (className ? ' ' + className : '')}
      style={{ '--_ab-h': barHeight(barSize) }}
      sx={sx}
    >
      {children || (
        <>
          {menuButton && (
            <div className={'appbar-menu ' + (effectiveMenu === 'auto' ? 'omni-ab-menu-auto' : 'omni-ab-menu')}>
              <AppBarIconButton ariaLabel="Open navigation menu" onClick={onMenuClick || (() => setDrawerOpen(true))} onIntent={onMenuClick ? undefined : prefetchDrawer}>
                <MenuIcon />
              </AppBarIconButton>
            </div>
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
                style={{
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {brand}
              </H3>
            ) : (
              <H3 component="span" width="hug" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{brand}</H3>
            )
          ) : brandType === 'logo' ? (
            <div style={{ width: 32, height: 32, borderRadius: '6px', backgroundColor: 'var(--Text)', opacity: 0.8, flexShrink: 0 }} aria-label="Company logo" />
          ) : (
            <H3 component="span" width="hug" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{companyName}</H3>
          )}

          {/* Center: slot overrides default search/tabs.
              Uses equal-flex spacers on both sides so the slot stays visually
              centered in the AppBar regardless of brand or end-slot widths. */}
          {centerSlot !== undefined ? (
            <>
              {spacer}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {centerSlot}
              </div>
              <div style={{ flex: 1 }} />
            </>
          ) : (
            <>
              {searchPosition === 'left' && searchField}

              {effectiveMenu === 'expanded' && (
                <Tabs defaultValue={0} variant="standard" color="default" size={barSize} style={{ marginLeft: 16, minHeight: 0 }}>
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
                  {spacer}
                  {/* The system's Tabs, as links: same look and selected marker
                      as every other tab bar, with aria-current on the section
                      you are at (a site nav goes to a place; it does not
                      switch a panel, so no tab roles). */}
                  {/* Centred on the bar's height, like the brand and the actions beside it. */}
                  <div className="appbar-links omni-ab-links">
                    <Tabs navigation value={currentIndex} onChange={setCurrentIndex} baseline={false} size={barSize}
                          style={{ display: 'flex', alignItems: 'center' }}>
                      <TabList aria-label="Main navigation">
                        {links.map((link, i) => (
                          <Tab key={typeof link.label === 'string' ? link.label : i} value={i} href={link.href} onClick={link.onClick}>{link.label}</Tab>
                        ))}
                      </TabList>
                    </Tabs>
                  </div>
                </>
              ) : null}

              <div style={{ flex: 1 }} />

              {searchPosition === 'right' && searchField}
            </>
          )}

          {/* End: slot overrides default right buttons + login.
              Wrap consumer children in a flex container with an 8px gap so
              multiple direct children space themselves consistently without
              each consumer needing its own HStack/Box wrapper. */}
          {endSlot !== undefined ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {movesActions ? (
                <>
                  <div className="appbar-end-secondary omni-ab-endsec">
                    {endItems.slice(0, -1)}
                  </div>
                  {endItems[endItems.length - 1]}
                </>
              ) : endSlot}
            </div>
          ) : (
            <>
              {showRightButtons && rightButtons.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {rightButtons.map((btn, i) =>
                    btn.raw ? (
                      <React.Fragment key={i}>{btn.icon}</React.Fragment>
                    ) : (
                      <AppBarIconButton key={i} ariaLabel={btn.label || 'Action ' + (i + 1)}>
                        {btn.icon}
                      </AppBarIconButton>
                    )
                  )}
                </div>
              )}

              {user ? (
                <Button variant="ghost" size="small" onClick={onSignOut} aria-label="Sign out"
                  startIcon={
                    user.photoURL ? (
                      <img src={user.photoURL} alt=""
                        style={{ width: 24, height: 24, borderRadius: '50%' }} />
                    ) : (
                      <AccountCircleIcon />
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
                  <AccountCircleIcon />
                </Button>
              ) : null}
            </>
          )}
        </>
      )}
    </BarRoot>

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
  className = '', sx,
}) {
  useStaticStyles('omni-appbar');
  const barSize = React.useContext(AppBarSizeContext);
  const [drawerOpen, setDrawerOpen, drawerWanted, prefetchDrawer] = useNavDrawer();
  const barTheme = THEME_MAP[barColor] || THEME_MAP.default;
  const dataTheme = barTheme.theme;
  const dataSurface = barTheme.surface || surface;

  /* The phone bar: the same paint as the desktop bar, at most 420px wide. */
  const rootProps = (variant, style) => ({
    role: 'banner',
    'data-theme': dataTheme,
    'data-surface': dataSurface,
    className: 'appbar appbar-mobile appbar-mobile-' + variant + ' appbar-' + barColor + ' omni-ab omni-ab-mob ' + className,
    style,
    sx,
  });
  const ellipsis = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };

  const links = navLinks.map((l) => (typeof l === 'string' ? { label: l } : l));
  const navDrawer = drawerWanted && (
    <Suspense fallback={null}>
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left" size="small">
      <nav aria-label="Main navigation" style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 8, paddingBottom: 8 }}>
        {links.map((link, i) => (
          <Button
            key={typeof link.label === 'string' ? link.label : i}
            variant="ghost"
            size="medium"
            href={link.href}
            onClick={(e) => { setDrawerOpen(false); if (link.onClick) link.onClick(e); }}
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            {link.label}
          </Button>
        ))}
      </nav>
    </Drawer>
    </Suspense>
  );

  if (mobileVariant === 'search') {
    return (
      <>
      <BarRoot {...rootProps('search', { display: 'flex', alignItems: 'center', height: barHeight(barSize), paddingLeft: 12, paddingRight: 12, gap: 12 })}>
        {links.length > 0 && (
          <AppBarIconButton ariaLabel="Open navigation menu" onClick={() => setDrawerOpen(true)} onIntent={prefetchDrawer}>
            <MenuIcon />
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
          <AccountCircleIcon />
        </Button>
      </BarRoot>
      {navDrawer}
      </>
    );
  }

  if (mobileVariant === 'small') {
    return (
      <BarRoot {...rootProps('small', { display: 'flex', alignItems: 'center', height: barHeight(barSize), paddingLeft: 12, paddingRight: 12, gap: 8 })}>
        <AppBarIconButton ariaLabel="Back">
          <ArrowBackIcon />
        </AppBarIconButton>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.3, ...ellipsis }}>{title}</div>
          {subtitle && <div style={{ fontSize: '12px', opacity: 0.7, ...ellipsis }}>{subtitle}</div>}
        </div>
        {actionIcon && (
          <AppBarIconButton ariaLabel="Action">
            {actionIcon}
          </AppBarIconButton>
        )}
      </BarRoot>
    );
  }

  const topRow = (
    <div style={{ display: 'flex', alignItems: 'center', height: 56, gap: 8 }}>
      <AppBarIconButton ariaLabel="Back">
        <ArrowBackIcon />
      </AppBarIconButton>
      <div style={{ flex: 1 }} />
      {actionIcon && (
        <AppBarIconButton ariaLabel="Action">
          {actionIcon}
        </AppBarIconButton>
      )}
    </div>
  );

  if (mobileVariant === 'medium') {
    return (
      <BarRoot {...rootProps('medium', { paddingLeft: 12, paddingRight: 12, paddingBottom: 16 })}>
        {topRow}
        <div style={{ paddingLeft: 12, paddingRight: 12 }}>
          <div style={{ fontWeight: 600, fontSize: '24px', lineHeight: 1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: '14px', opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
        </div>
      </BarRoot>
    );
  }

  // large
  return (
    <BarRoot {...rootProps('large', { paddingLeft: 12, paddingRight: 12, paddingBottom: 24 })}>
      {topRow}
      <div style={{ paddingLeft: 12, paddingRight: 12, marginTop: 8 }}>
        <div style={{ fontWeight: 600, fontSize: '36px', lineHeight: 1.1 }}>{title}</div>
        {subtitle && <div style={{ fontSize: '14px', opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
    </BarRoot>
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
