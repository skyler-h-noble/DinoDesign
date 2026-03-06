// src/components/Header/Header.js
import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Container,
  Stack,
} from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';

/**
 * Header Component
 * App header with navigation and theme toggle
 * Uses design system variables for styling
 * 
 * @param {string} title - App title/brand name
 * @param {string} mode - Theme mode: light or dark
 * @param {Array} navItems - Navigation menu items
 * @param {ReactNode} rightContent - Right side content
 * @param {object} props - Additional props
 */
export function Header({
  title = 'My App',
  mode = 'light',
  navItems = [
    { label: 'HOME', href: '#' },
    { label: 'ABOUT', href: '#' },
    { label: 'SERVICES', href: '#' },
    { label: 'CONTACT', href: '#' },
  ],
  rightContent,
  sx = {},
  ...props
}) {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        background: 'var(--Background)',
        color: 'var(--Text)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid var(--Border-Variant)',
        transition: 'all 0.2s ease-in-out',
        zIndex: 1201, // Higher than drawer (1200)
        ...sx,
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 0,
          }}
        >
          {/* Left side - Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'var(--Text)',
              mr: 'auto',
              transition: 'color 0.2s ease-in-out',
            }}
          >
            {title}
          </Typography>

          {/* Center - Navigation Links */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 3,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {navItems.map((item, index) => (
              <Typography
                key={index}
                component="a"
                href={item.href}
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: 'var(--Text)',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: 'var(--Primary-Color-11)',
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Right side - Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {rightContent}
          </Stack>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

/**
 * SimpleHeader Component
 * Minimal header with just title and theme toggle
 * 
 * @param {string} title - App title
 * @param {string} mode - Theme mode
 * @param {function} onModeChange - Theme toggle handler
 * @param {object} props - Additional props
 */
export function SimpleHeader({
  title = 'My App',
  mode = 'light',
  onModeChange,
  sx = {},
  ...props
}) {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        background: 'var(--Background)',
        color: 'var(--Text)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid var(--Border-Variant)',
        transition: 'all 0.2s ease-in-out',
        zIndex: 1201, // Higher than drawer (1200)
        ...sx,
      }}
      {...props}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'var(--Text)',
          }}
        >
          {title}
        </Typography>
        {onModeChange && (
          <IconButton
            onClick={onModeChange}
            sx={{
              color: 'var(--Text)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            {mode === 'light' ? (
              <DarkModeIcon sx={{ fontSize: '1.5rem' }} />
            ) : (
              <LightModeIcon sx={{ fontSize: '1.5rem' }} />
            )}
          </IconButton>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}

/**
 * MinimalHeader Component
 * Very minimal header with just title
 * 
 * @param {string} title - App title
 * @param {object} props - Additional props
 */
export function MinimalHeader({
  title = 'My App',
  sx = {},
  ...props
}) {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        background: 'var(--Background)',
        color: 'var(--Text)',
        boxShadow: 'none',
        borderBottom: '1px solid var(--Border-Variant)',
        transition: 'all 0.2s ease-in-out',
        zIndex: 1201, // Higher than drawer (1200)
        ...sx,
      }}
      {...props}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'var(--Text)',
          }}
        >
          {title}
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
}

/**
 * CenteredHeader Component
 * Header with centered navigation
 * 
 * @param {string} title - App title
 * @param {Array} navItems - Navigation items
 * @param {string} mode - Theme mode
 * @param {function} onModeChange - Theme toggle handler
 * @param {object} props - Additional props
 */
export function CenteredHeader({
  title = 'My App',
  navItems = [],
  mode = 'light',
  onModeChange,
  sx = {},
  ...props
}) {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        background: 'var(--Background)',
        color: 'var(--Text)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid var(--Border-Variant)',
        transition: 'all 0.2s ease-in-out',
        zIndex: 1201, // Higher than drawer (1200)
        ...sx,
      }}
      {...props}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          py: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'var(--Text)',
            }}
          >
            {title}
          </Typography>
          {onModeChange && (
            <IconButton
              onClick={onModeChange}
              sx={{
                color: 'var(--Text)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              {mode === 'light' ? (
                <DarkModeIcon sx={{ fontSize: '1.5rem' }} />
              ) : (
                <LightModeIcon sx={{ fontSize: '1.5rem' }} />
              )}
            </IconButton>
          )}
        </Stack>

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {navItems.map((item, index) => (
            <Typography
              key={index}
              component="a"
              href={item.href}
              variant="body2"
              sx={{
                textDecoration: 'none',
                color: 'var(--Text)',
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: 'var(--Primary-Color-11)',
                },
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}

/**
 * StickyHeader Component
 * Header that sticks to top on scroll
 * 
 * @param {string} title - App title
 * @param {Array} navItems - Navigation items
 * @param {string} mode - Theme mode
 * @param {function} onModeChange - Theme toggle handler
 * @param {object} props - Additional props
 */
export function StickyHeader({
  title = 'My App',
  navItems = [],
  mode = 'light',
  onModeChange,
  sx = {},
  ...props
}) {
  return (
    <MuiAppBar
      position="sticky"
      sx={{
        background: 'var(--Background)',
        color: 'var(--Text)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid var(--Border-Variant)',
        transition: 'all 0.2s ease-in-out',
        zIndex: 1201, // Higher than drawer (1200)
        ...sx,
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'var(--Text)',
              mr: 'auto',
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 3,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {navItems.map((item, index) => (
              <Typography
                key={index}
                component="a"
                href={item.href}
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: 'var(--Text)',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: 'var(--Primary-Color-11)',
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

export default Header;