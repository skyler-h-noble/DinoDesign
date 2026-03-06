// src/components/Sidebar/Sidebar.stories.js
import {
  Sidebar,
  CollapsibleSidebar,
  UserProfileSidebar,
  MinimalSidebar,
} from './Sidebar';
import { useState } from 'react';
import { Box, Stack, Typography, Paper, AppBar, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StorageIcon from '@mui/icons-material/Storage';
import IconButton from '@mui/material/IconButton';

export default {
  title: 'Navigation/Sidebar',
  component: Sidebar,
};

const mockItems = [
  { label: 'Home', icon: <HomeIcon />, tooltip: 'Go to home' },
  { label: 'Dashboard', icon: <DashboardIcon />, tooltip: 'View dashboard' },
  { label: 'Analytics', icon: <AnalyticsIcon />, tooltip: 'View analytics' },
  { label: 'Settings', icon: <SettingsIcon />, tooltip: 'Open settings' },
  { label: 'About', icon: <HelpIcon />, tooltip: 'About us' },
];

const mockItemsWithSubmenu = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    submenu: [
      { label: 'Overview', icon: <HomeIcon /> },
      { label: 'Analytics', icon: <AnalyticsIcon /> },
    ],
  },
  {
    label: 'Database',
    icon: <StorageIcon />,
    submenu: [
      { label: 'Tables', icon: <StorageIcon /> },
      { label: 'Backups', icon: <HomeIcon /> },
    ],
  },
  { label: 'Settings', icon: <SettingsIcon /> },
  { label: 'Help', icon: <HelpIcon /> },
];

const mockItemsWithBadge = [
  { label: 'Home', icon: <HomeIcon /> },
  { label: 'Notifications', icon: <NotificationsIcon />, badge: 5 },
  { label: 'Messages', icon: <AccountCircleIcon />, badge: 3 },
  { label: 'Settings', icon: <SettingsIcon /> },
];

// Basic Sidebar
export const Basic = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Box sx={{ display: 'flex', height: 400 }}>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          items={mockItems}
          onItemClick={(item) => console.log('Clicked:', item.label)}
          header="Menu"
          footer="© 2024 MyApp"
        />
        <Box sx={{ flex: 1, p: 2, backgroundColor: 'var(--Background)' }}>
          <Typography>Sidebar content area</Typography>
        </Box>
      </Box>
    );
  },
};

// Permanent Sidebar
export const Permanent = {
  render: () => {
    return (
      <Box sx={{ display: 'flex', height: 500 }}>
        <Sidebar
          open={true}
          onClose={() => {}}
          items={mockItems}
          onItemClick={(item) => console.log('Clicked:', item.label)}
          variant="permanent"
          header="Navigation"
        />
        <Box sx={{ flex: 1, p: 3, backgroundColor: 'var(--Background)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Main Content
          </Typography>
          <Typography>
            This sidebar is permanently visible and doesn't close when items are clicked.
          </Typography>
        </Box>
      </Box>
    );
  },
};

// With Submenu
export const WithSubmenu = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Box sx={{ display: 'flex', height: 500 }}>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          items={mockItemsWithSubmenu}
          onItemClick={(item) => console.log('Clicked:', item.label)}
          header="Navigation"
          footer="© 2024 MyApp"
        />
        <Box sx={{ flex: 1, p: 3, backgroundColor: 'var(--Background)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Expandable Menus
          </Typography>
          <Typography>
            Click on items with arrows to expand/collapse submenus
          </Typography>
        </Box>
      </Box>
    );
  },
};

// With Badges
export const WithBadges = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Box sx={{ display: 'flex', height: 400 }}>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          items={mockItemsWithBadge}
          onItemClick={(item) => console.log('Clicked:', item.label)}
          header="Menu with Notifications"
        />
        <Box sx={{ flex: 1, p: 2, backgroundColor: 'var(--Background)' }}>
          <Typography>Badge notifications on menu items</Typography>
        </Box>
      </Box>
    );
  },
};

// Collapsible Sidebar
export const Collapsible = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <Box sx={{ display: 'flex', height: 500 }}>
        <CollapsibleSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          items={mockItems}
          onItemClick={(item) => console.log('Clicked:', item.label)}
          header="Menu"
        />
        <Box sx={{ flex: 1, p: 3, backgroundColor: 'var(--Background)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Collapsible Navigation
          </Typography>
          <Typography>
            Click the chevron button to collapse the sidebar to icon-only mode
          </Typography>
        </Box>
      </Box>
    );
  },
};

// User Profile Sidebar
export const UserProfile = {
  render: () => {
    const [open, setOpen] = useState(true);
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    };

    return (
      <Box sx={{ display: 'flex', height: 500 }}>
        <UserProfileSidebar
          open={open}
          onClose={() => setOpen(false)}
          user={user}
          items={mockItems}
          onItemClick={(item) => console.log('Clicked:', item.label)}
          onUserClick={() => console.log('User profile clicked')}
        />
        <Box sx={{ flex: 1, p: 3, backgroundColor: 'var(--Background)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            User Profile Sidebar
          </Typography>
          <Typography>
            Sidebar with user profile section at the top
          </Typography>
        </Box>
      </Box>
    );
  },
};

// Minimal Icon-Only Sidebar
export const Minimal = {
  render: () => {
    return (
      <Box sx={{ display: 'flex', height: 500 }}>
        <MinimalSidebar
          items={mockItems}
          onItemClick={(item) => console.log('Clicked:', item.label)}
        />
        <Box sx={{ flex: 1, p: 3, backgroundColor: 'var(--Background)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Minimal Icon Sidebar
          </Typography>
          <Typography>
            Compact icon-only navigation on the left side
          </Typography>
        </Box>
      </Box>
    );
  },
};

// With AppBar Integration
export const WithAppBar = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 600 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setOpen(!open)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1 }}>
              My App
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Sidebar
            open={open}
            onClose={() => setOpen(false)}
            items={mockItems}
            onItemClick={(item) => console.log('Clicked:', item.label)}
            header="Menu"
          />
          <Box sx={{ flex: 1, p: 3, backgroundColor: 'var(--Background)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Sidebar with AppBar
            </Typography>
            <Typography>
              Toggle the menu icon in the app bar to open/close the sidebar
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  },
};

// Design System Demo
export const DesignSystemDemo = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          Sidebar Design System Styling
        </Typography>

        <Stack spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Background:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
              • Sidebar: var(--Container)
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
              • Text: var(--Text)
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Selected Item:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
              • Background: var(--Buttons-Primary-Button)
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
              • Text: var(--Buttons-Primary-Text)
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Borders:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
              • Dividers: var(--Border-Variant)
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', height: 400 }}>
          <Sidebar
            open={open}
            onClose={() => setOpen(false)}
            items={mockItems}
            onItemClick={(item) => console.log('Clicked:', item.label)}
            header="Design System"
            footer="© 2024 MyApp"
          />
          <Box sx={{ flex: 1, p: 2, backgroundColor: 'var(--Background)' }}>
            <Typography>
              Click menu items to see the primary button styling in action
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  },
};

// All Variants
export const AllVariants = {
  render: () => {
    const [states, setStates] = useState({
      basic: true,
      submenu: true,
      badges: true,
      profile: true,
      collapsible: false,
    });

    const user = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    return (
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Basic Sidebar
          </Typography>
          <Box sx={{ display: 'flex', height: 300, border: '1px solid var(--Border)' }}>
            <Sidebar
              open={states.basic}
              onClose={() => setStates({ ...states, basic: false })}
              items={mockItems}
              onItemClick={(item) => console.log('Clicked:', item.label)}
              header="Menu"
            />
            <Box sx={{ flex: 1, p: 2, backgroundColor: 'var(--Container-Low)' }}>
              <Typography variant="caption">Sidebar content area</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Collapsible Sidebar
          </Typography>
          <Box sx={{ display: 'flex', height: 300, border: '1px solid var(--Border)' }}>
            <CollapsibleSidebar
              collapsed={states.collapsible}
              onToggle={() => setStates({ ...states, collapsible: !states.collapsible })}
              items={mockItems}
              onItemClick={(item) => console.log('Clicked:', item.label)}
              header="Menu"
            />
            <Box sx={{ flex: 1, p: 2, backgroundColor: 'var(--Container-Low)' }}>
              <Typography variant="caption">Toggle collapse button</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            User Profile Sidebar
          </Typography>
          <Box sx={{ display: 'flex', height: 300, border: '1px solid var(--Border)' }}>
            <UserProfileSidebar
              open={states.profile}
              onClose={() => setStates({ ...states, profile: false })}
              user={user}
              items={mockItems}
              onItemClick={(item) => console.log('Clicked:', item.label)}
            />
            <Box sx={{ flex: 1, p: 2, backgroundColor: 'var(--Container-Low)' }}>
              <Typography variant="caption">With user profile section</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Minimal Icon Sidebar
          </Typography>
          <Box sx={{ display: 'flex', height: 300, border: '1px solid var(--Border)' }}>
            <MinimalSidebar
              items={mockItems}
              onItemClick={(item) => console.log('Clicked:', item.label)}
            />
            <Box sx={{ flex: 1, p: 2, backgroundColor: 'var(--Container-Low)' }}>
              <Typography variant="caption">Icon-only compact navigation</Typography>
            </Box>
          </Box>
        </Box>
      </Stack>
    );
  },
};
