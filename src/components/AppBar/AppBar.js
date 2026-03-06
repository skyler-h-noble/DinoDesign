// src/components/AppBar/AppBar.js
import React from 'react';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SearchField } from '../SearchField/SearchField';

/**
 * AppBar Component
 *
 * Always: data-surface="Surface-Bright", bg var(--Background), text var(--Text)
 *
 * BAR COLORS (sets data-theme):
 *   default        data-theme="App-Bar"
 *   primary        data-theme="Primary"
 *   primary-light  data-theme="Primary-Light"
 *   primary-medium data-theme="Primary-Medium"
 *   primary-dark   data-theme="Primary-Dark"
 *   white          data-theme="Neutral"
 *   black          data-theme="Neutral-Dark"
 *
 * DESKTOP: Login, Menu (expanded only <=3 links), Branding, Search, Right buttons
 * MOBILE: search, small, medium, large
 */

const THEME_MAP = {
  'default':        'App-Bar',
  'primary':        'Primary',
  'primary-light':  'Primary-Light',
  'primary-medium': 'Primary-Medium',
  'primary-dark':   'Primary-Dark',
  'white':          'Neutral',
  'black':          'Neutral-Dark',
};

/* --- Icon Button --- */
function AppBarIconButton({ children, onClick, sx: sxOver, ariaLabel }) {
  return (
    <Box
      component="button" type="button" onClick={onClick} aria-label={ariaLabel}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 40, height: 40, borderRadius: '50%', border: 'none',
        backgroundColor: 'transparent', color: 'var(--Text)',
        cursor: 'pointer', flexShrink: 0, fontSize: '24px',
        transition: 'background-color 0.15s',
        '&:hover': { backgroundColor: 'var(--Hover, rgba(0,0,0,0.06))' },
        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '1px' },
        ...sxOver,
      }}
    >
      {children}
    </Box>
  );
}

/* --- Desktop AppBar --- */
function DesktopAppBar({
  barColor = 'default',
  loginType = 'login', menuType = 'hamburger', brandType = 'name',
  searchPosition = 'right', companyName = 'Company',
  navLinks = ['Home', 'Products', 'About'],
  rightButtons = [], showRightButtons = false,
  className = '', sx = {},
}) {
  const dataTheme = THEME_MAP[barColor] || THEME_MAP.default;
  const effectiveMenu = (menuType === 'expanded' && navLinks.length > 3) ? 'hamburger' : menuType;

  const searchField = (
    <SearchField
      placeholder="Search…"
      size="medium"
      sx={{ flex: searchPosition === 'left' ? '0 1 400px' : '0 1 280px', minWidth: 0 }}
    />
  );

  return (
    <Box
      component="header" role="banner"
      data-theme={dataTheme}
      data-surface="Surface-Bright"
      className={'appbar appbar-desktop appbar-' + barColor + (className ? ' ' + className : '')}
      sx={{
        display: 'flex', alignItems: 'center', height: 64,
        px: 2, gap: 2,
        backgroundColor: 'var(--Background)', color: 'var(--Text)',
        borderBottom: '1px solid var(--Border)',
        fontFamily: 'inherit',
        ...sx,
      }}
    >
      {effectiveMenu === 'hamburger' && (
        <AppBarIconButton ariaLabel="Menu">
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
        <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
          {navLinks.map((link) => (
            <Box key={link} component="button" type="button"
              sx={{
                border: 'none', backgroundColor: 'transparent', color: 'var(--Text)',
                fontFamily: 'inherit', fontSize: '14px', fontWeight: 500,
                padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
                '&:hover': { backgroundColor: 'var(--Hover, rgba(0,0,0,0.06))' },
                '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
              }}>
              {link}
            </Box>
          ))}
        </Box>
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
        <Box sx={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          backgroundColor: 'var(--Text)', opacity: 0.3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AccountCircleIcon sx={{ fontSize: 36, color: 'var(--Text)', opacity: 1 }} />
        </Box>
      ) : (
        <Box component="button" type="button"
          sx={{
            fontFamily: 'inherit', fontWeight: 500, fontSize: '14px',
            padding: '6px 20px', borderRadius: 'var(--Style-Border-Radius)',
            border: '1px solid var(--Border)', backgroundColor: 'transparent',
            color: 'var(--Text)', cursor: 'pointer', flexShrink: 0,
            '&:hover': { backgroundColor: 'var(--Hover, rgba(0,0,0,0.06))' },
            '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
          }}>
          Login
        </Box>
      )}
    </Box>
  );
}

/* --- Mobile AppBar --- */
function MobileAppBar({
  mobileVariant = 'search',
  barColor = 'default',
  title = 'Page Title', subtitle = 'Subtitle text',
  actionIcon, companyName = 'Company',
  className = '', sx = {},
}) {
  const dataTheme = THEME_MAP[barColor] || THEME_MAP.default;

  const containerSx = {
    backgroundColor: 'var(--Background)', color: 'var(--Text)',
    borderBottom: '1px solid var(--Border)',
    fontFamily: 'inherit', width: '100%', maxWidth: 420,
    ...sx,
  };

  const commonProps = {
    'data-theme': dataTheme,
    'data-surface': 'Surface-Bright',
  };

  if (mobileVariant === 'search') {
    return (
      <Box component="header" role="banner" className={'appbar appbar-mobile appbar-mobile-search appbar-' + barColor + ' ' + className}
        {...commonProps}
        sx={{ ...containerSx, display: 'flex', alignItems: 'center', height: 64, px: 1.5, gap: 1.5 }}>
        <AppBarIconButton ariaLabel="Menu">
          <MenuIcon sx={{ fontSize: 'inherit' }} />
        </AppBarIconButton>
        <SearchField
          placeholder={'Search ' + companyName}
          size="small"
          sx={{ flex: 1, minWidth: 0 }}
        />
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', backgroundColor: 'var(--Text)', opacity: 0.3 }}>
          <AccountCircleIcon sx={{ fontSize: 36, color: 'var(--Text)', opacity: 1 }} />
        </Box>
      </Box>
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
