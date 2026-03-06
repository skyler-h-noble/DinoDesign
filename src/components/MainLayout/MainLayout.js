// src/components/MainLayout/MainLayout.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';

/**
 * MainLayout Component
 * Flexible layout with multiple navigation options
 * Supports: SideNav, RailNav, TopNav, or combinations
 * Fully responsive - adapts to mobile/tablet/desktop
 * 
 * @param {string} layout - Layout type: 'side' | 'rail' | 'top' | 'side-rail'
 * @param {Array} navItems - Navigation items
 * @param {string} title - App title
 * @param {ReactNode} children - Page content
 * @param {function} onLayoutChange - Layout change handler
 * @param {object} props - Additional props
 */
export function MainLayout({
  layout = 'side',
  navItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'About', icon: <InfoIcon />, path: '/about' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { label: 'Help', icon: <HelpIcon />, path: '/help' },
  ],
  title = 'My App',
  children,
  onLayoutChange,
  onNavigate,
  sx = {},
  ...props
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);

  // Responsive layout selection
  const effectiveLayout = isMobile ? 'top' : layout;

  // Navigation content
  const NavItemsList = ({ compact = false }) => (
    <List sx={{ py: 1 }}>
      {navItems.map((item, index) => (
        <Tooltip
          key={index}
          title={compact ? item.label : ''}
          placement="right"
        >
          <ListItemButton
            onClick={() => {
              onNavigate?.(item);
              setMobileDrawerOpen(false);
            }}
            sx={{
              color: 'var(--Text)',
              '&:hover': {
                backgroundColor: 'var(--Container-High)',
              },
              transition: 'all 0.2s ease-in-out',
              justifyContent: compact ? 'center' : 'flex-start',
              px: compact ? 1 : 2,
            }}
          >
            <ListItemIcon
              sx={{
                color: 'var(--Icons-Primary)',
                minWidth: compact ? 'auto' : 40,
                mr: compact ? 0 : 1,
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!compact && (
              <ListItemText primary={item.label} />
            )}
          </ListItemButton>
        </Tooltip>
      ))}
    </List>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...props}
    >
      {/* TOP BAR - Always visible */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'var(--Header)',
          color: 'var(--Text)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          borderBottom: '1px solid var(--Border-Variant)',
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && effectiveLayout !== 'rail' && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              sx={{ mr: 2 }}
            >
              {mobileDrawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>

          {/* Layout Selector (Desktop only) */}
          {!isMobile && onLayoutChange && (
            <ToggleButtonGroup
              value={layout}
              exclusive
              onChange={(e, newLayout) => {
                if (newLayout) onLayoutChange(newLayout);
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'var(--Text)',
                  border: '1px solid var(--Border)',
                  '&.Mui-selected': {
                    backgroundColor: 'var(--Button-Primary-Button)',
                    color: '#fff',
                    borderColor: 'var(--Button-Primary-Button)',
                  },
                },
              }}
            >
              <ToggleButton value="side" aria-label="side nav">
                ☰ Side
              </ToggleButton>
              <ToggleButton value="rail" aria-label="rail nav">
                ⫷ Rail
              </ToggleButton>
              <ToggleButton value="side-rail" aria-label="side-rail nav">
                ☰⫷ Both
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT AREA */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        {/* RAIL NAVIGATION (Left side, compact) */}
        {(effectiveLayout === 'rail' || effectiveLayout === 'side-rail') && !isMobile && (
          <Box
            sx={{
              width: 80,
              backgroundColor: 'var(--Container)',
              borderRight: '1px solid var(--Border-Variant)',
              display: 'flex',
              flexDirection: 'column',
              py: 2,
            }}
          >
            <NavItemsList compact={true} />
          </Box>
        )}

        {/* SIDE NAVIGATION (Left side, expandable) */}
        {(effectiveLayout === 'side' || effectiveLayout === 'side-rail') && !isMobile && (
          <Box
            sx={{
              width: sideNavCollapsed ? 80 : 280,
              backgroundColor: 'var(--Container)',
              borderRight: '1px solid var(--Border-Variant)',
              transition: 'width 0.3s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--Border-Variant)',
                minHeight: 64,
              }}
            >
              {!sideNavCollapsed && (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'var(--Text)',
                  }}
                >
                  Menu
                </Typography>
              )}
              <IconButton
                size="small"
                onClick={() => setSideNavCollapsed(!sideNavCollapsed)}
                sx={{ color: 'var(--Icons-Primary)' }}
              >
                {sideNavCollapsed ? '›' : '‹'}
              </IconButton>
            </Box>

            {/* Nav Items */}
            <NavItemsList compact={sideNavCollapsed} />
          </Box>
        )}

        {/* MOBILE DRAWER */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                backgroundColor: 'var(--Container)',
                width: 280,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid var(--Border-Variant)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Menu
              </Typography>
            </Box>
            <NavItemsList compact={false} />
          </Drawer>
        )}

        {/* MAIN CONTENT */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'var(--Background)',
          }}
        >
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * DefaultMainLayout Component
 * MainLayout with default demo content
 * Shows design system documentation
 */
export function DefaultMainLayout({
  layout = 'side',
  mode = 'light',
  onModeChange,
  onLayoutChange,
  sx = {},
  ...props
}) {
  return (
    <MainLayout
      layout={layout}
      title="Design System"
      onLayoutChange={onLayoutChange}
      sx={sx}
      {...props}
    >
      <Stack spacing={4}>
        {/* Theme Selector */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'var(--Container)',
            borderRadius: 2,
            border: '1px solid var(--Border-Variant)',
          }}
        >
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            Current Theme Mode:
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {mode === 'light' && '☀️ Light Mode (Tonal)'}
            {mode === 'professional' && '💼 Light Mode (Professional)'}
            {mode === 'dark' && '🌙 Dark Mode'}
          </Typography>
          {onModeChange && (
            <Stack direction="row" gap={2} flexWrap="wrap">
              <Button
                variant={mode === 'light' ? 'contained' : 'outlined'}
                onClick={() => onModeChange('light')}
              >
                Light
              </Button>
              <Button
                variant={mode === 'professional' ? 'contained' : 'outlined'}
                onClick={() => onModeChange('professional')}
              >
                Professional
              </Button>
              <Button
                variant={mode === 'dark' ? 'contained' : 'outlined'}
                onClick={() => onModeChange('dark')}
              >
                Dark
              </Button>
            </Stack>
          )}
        </Paper>

        {/* Typography Section */}
        <Box>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Typography
          </Typography>
          <Paper sx={{ p: 3, backgroundColor: 'var(--Container)' }}>
            <Stack spacing={2}>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="body1">
                Body text - This is the default paragraph text using your design system.
              </Typography>
            </Stack>
          </Paper>
        </Box>

        {/* Buttons Section */}
        <Box>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Buttons
          </Typography>
          <Paper sx={{ p: 3, backgroundColor: 'var(--Container)' }}>
            <Stack spacing={2}>
              <Stack direction="row" gap={2} flexWrap="wrap">
                <Button variant="contained" color="primary">
                  Primary
                </Button>
                <Button variant="contained" color="secondary">
                  Secondary
                </Button>
                <Button variant="contained" color="error">
                  Error
                </Button>
                <Button variant="contained" color="success">
                  Success
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Cards Section */}
        <Box>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Cards
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    backgroundColor: 'var(--Container)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                      Card {i}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)', mb: 2 }}>
                      Sample card using your design system with responsive layout.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Action
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Layout Info */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'var(--Container)',
            borderLeft: '4px solid var(--Primary-Color-11)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Layout Information
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
            This layout is fully responsive. On mobile devices, navigation switches to a drawer menu.
            On desktop, you can toggle between Side Navigation, Rail Navigation, or both.
          </Typography>
        </Paper>
      </Stack>
    </MainLayout>
  );
}

export default MainLayout;
