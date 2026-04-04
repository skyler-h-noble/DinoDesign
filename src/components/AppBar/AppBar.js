// src/components/AppBar/AppBar.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SearchField } from '../SearchField/SearchField';
import { Tabs, TabList, Tab } from '../Tabs/Tabs';
import { Drawer } from '../Drawer/Drawer';
import { Button } from '../Button/Button';

/**
 * AppBar Component
 *
 * Always: bg var(--Background), text var(--Text), box-shadow var(--Effect-Level-1)
 *
 * BAR COLORS (sets data-theme):
 *   default        data-theme="App-Bar"
 *   primary        data-theme="Primary"
 *   primary-light  data-theme="Primary-Light"
 *   white          data-theme="White"
 *   black          data-theme="Black"
 *
 * SURFACE (sets data-surface, default "Surface"):
 *   Surface | Surface-Bright | Surface-Dim | Surface-Dimmest
 *
 * DESKTOP: Login, Menu (expanded only <=3 links), Branding, Search, Right buttons
 * MOBILE: search, small, medium, large
 */

const THEME_MAP = {
  'default':        'App-Bar',
  'primary':        'Primary',
  'primary-light':  'Primary-Light',
  'white':          'White',
  'black':          'Black',
};

/* --- Icon Button (uses Button component) --- */
function AppBarIconButton({ children, onClick, ariaLabel }) {
  return (
    <Button iconOnly variant="ghost" size="medium" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Button>
  );
}

/* --- Desktop AppBar --- */
function DesktopAppBar({
  barColor = 'default',
  surface = 'Surface',
  loginType = 'login', menuType = 'hamburger', brandType = 'name',
  searchPosition = 'right', companyName = 'Company',
  navLinks = ['Home', 'Products', 'About'],
  rightButtons = [], showRightButtons = false,
  children,
  className = '', sx = {},
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dataTheme = THEME_MAP[barColor] || THEME_MAP.default;
  const effectiveMenu = (menuType === 'expanded' && navLinks.length > 3) ? 'hamburger' : menuType;

  const searchField = (
    <SearchField
      placeholder="Search..."
      size="medium"
      sx={{ flex: searchPosition === 'left' ? '0 1 400px' : '0 1 280px', minWidth: 0 }}
    />
  );

  return (
    <>
    <Box
      component="header" role="banner"
      data-theme={dataTheme}
      data-surface={surface}
      className={'appbar appbar-desktop appbar-' + barColor + (className ? ' ' + className : '')}
      sx={{
        display: 'flex', alignItems: 'center', height: 64,
        px: 2, gap: 2,
        backgroundColor: 'var(--Background)', color: 'var(--Text)',
        boxShadow: 'var(--Effect-Level-1)',
        fontFamily: 'inherit',
        ...sx,
      }}
    >
      {children || (
        <>
          {effectiveMenu === 'hamburger' && (
            <AppBarIconButton ariaLabel="Open navigation menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ fontSize: 'inherit' }} />
            </AppBarIconButton>
          )}

          {brandType === 'logo' ? (
            <Box sx={{ width: 32, height: 32, borderRadius: '6px', backgroundColor: 'var(--Text)', opacity: 0.8, flexShrink: 0 }} aria-label="Company logo" />
          ) : (
            <Box sx={{ fontWeight: 700, fontSize: '18px', whiteSpace: 'nowrap', flexShrink: 0 }}>{companyName}</Box>
          )}

          {searchPosition === 'left' && searchField}

          {effectiveMenu === 'expanded' && (
            <Tabs defaultValue={0} variant="standard" color="default" sx={{ ml: 2, minHeight: 0 }}>
              <TabList aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Tab key={link}>{link}</Tab>
                ))}
              </TabList>
            </Tabs>
          )}

          <Box sx={{ flex: 1 }} />

          {searchPosition === 'right' && searchField}

          {showRightButtons && rightButtons.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {rightButtons.map((btn, i) => (
                <AppBarIconButton key={i} ariaLabel={btn.label || 'Action ' + (i + 1)}>
                  {btn.icon}
                </AppBarIconButton>
              ))}
            </Box>
          )}

          {loginType === 'avatar' ? (
            <Button iconOnly variant="ghost" size="medium" aria-label="Account">
              <AccountCircleIcon sx={{ fontSize: 28 }} />
            </Button>
          ) : (
            <Button variant="default-outline" size="small">
              Login
            </Button>
          )}
        </>
      )}
    </Box>

    {/* Navigation Drawer */}
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left" size="small">
      <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 1 }}>
        {navLinks.map((link) => (
          <Button
            key={link}
            variant="ghost"
            size="medium"
            onClick={() => setDrawerOpen(false)}
            sx={{ justifyContent: 'flex-start', width: '100%' }}
          >
            {link}
          </Button>
        ))}
      </Box>
    </Drawer>
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
  navLinks = ['Home', 'Products', 'About'],
  className = '', sx = {},
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dataTheme = THEME_MAP[barColor] || THEME_MAP.default;

  const containerSx = {
    backgroundColor: 'var(--Background)', color: 'var(--Text)',
    boxShadow: 'var(--Effect-Level-1)',
    fontFamily: 'inherit', width: '100%', maxWidth: 420,
    ...sx,
  };

  const commonProps = {
    'data-theme': dataTheme,
    'data-surface': surface,
  };

  const navDrawer = (
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left" size="small">
      <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 1 }}>
        {navLinks.map((link) => (
          <Button
            key={link}
            variant="ghost"
            size="medium"
            onClick={() => setDrawerOpen(false)}
            sx={{ justifyContent: 'flex-start', width: '100%' }}
          >
            {link}
          </Button>
        ))}
      </Box>
    </Drawer>
  );

  if (mobileVariant === 'search') {
    return (
      <>
      <Box component="header" role="banner" className={'appbar appbar-mobile appbar-mobile-search appbar-' + barColor + ' ' + className}
        {...commonProps}
        sx={{ ...containerSx, display: 'flex', alignItems: 'center', height: 64, px: 1.5, gap: 1.5 }}>
        <AppBarIconButton ariaLabel="Open navigation menu" onClick={() => setDrawerOpen(true)}>
          <MenuIcon sx={{ fontSize: 'inherit' }} />
        </AppBarIconButton>
        <SearchField
          placeholder={'Search ' + companyName}
          size="small"
          sx={{ flex: 1, minWidth: 0 }}
        />
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
        sx={{ ...containerSx, display: 'flex', alignItems: 'center', height: 64, px: 1.5, gap: 1 }}>
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

export function AppBar({ mode = 'desktop', ...props }) {
  if (mode === 'mobile') return <MobileAppBar {...props} />;
  return <DesktopAppBar {...props} />;
}

export { DesktopAppBar, MobileAppBar };
export default AppBar;
