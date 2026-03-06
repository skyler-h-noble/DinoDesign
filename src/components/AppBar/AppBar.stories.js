// src/components/AppBar/AppBar.stories.js
import React from 'react';
import { AppBar } from './AppBar';
import { Box, Stack } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default { title: 'Navigation/AppBar', component: AppBar };

export const DesktopDefault = {
  render: () => <AppBar mode="desktop" />,
};

export const DesktopExpandedMenu = {
  render: () => <AppBar mode="desktop" menuType="expanded" loginType="avatar" companyName="Acme Inc" navLinks={['Home', 'About', 'Help']} />,
};

export const DesktopWithRightButtons = {
  render: () => (
    <AppBar mode="desktop" showRightButtons
      rightButtons={[
        { icon: <NotificationsIcon sx={{ fontSize: 'inherit' }} />, label: 'Notifications' },
        { icon: <SettingsIcon sx={{ fontSize: 'inherit' }} />, label: 'Settings' },
      ]}
      loginType="avatar" />
  ),
};

export const AllBarColors = {
  render: () => (
    <Stack spacing={2}>
      {['default', 'primary', 'primary-light', 'primary-medium', 'primary-dark', 'white', 'black'].map((c) => (
        <AppBar key={c} mode="desktop" barColor={c} companyName={c} />
      ))}
    </Stack>
  ),
};

export const MobileSearch = {
  render: () => (
    <Box sx={{ maxWidth: 420 }}>
      <AppBar mode="mobile" mobileVariant="search" companyName="News" />
    </Box>
  ),
};

export const MobileSmall = {
  render: () => (
    <Box sx={{ maxWidth: 420 }}>
      <AppBar mode="mobile" mobileVariant="small" title="Image editor" subtitle="Refine your photo"
        actionIcon={<CheckIcon sx={{ fontSize: 'inherit' }} />} />
    </Box>
  ),
};

export const MobileMedium = {
  render: () => (
    <Box sx={{ maxWidth: 420 }}>
      <AppBar mode="mobile" mobileVariant="medium" title="Daily activities" subtitle="Record new fitness goals"
        actionIcon={<AddIcon sx={{ fontSize: 'inherit' }} />} />
    </Box>
  ),
};

export const MobileLarge = {
  render: () => (
    <Box sx={{ maxWidth: 420 }}>
      <AppBar mode="mobile" mobileVariant="large" title="Top 10 hiking trails" subtitle="Discover popular trails"
        actionIcon={<BookmarkIcon sx={{ fontSize: 'inherit' }} />} />
    </Box>
  ),
};
