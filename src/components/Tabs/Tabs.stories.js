// src/components/Tabs/Tabs.stories.js
import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { Box, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default { title: 'Navigation/Tabs', component: Tabs };

const TABS = ['Home', 'Settings', 'Profile'];

export const Default = {
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Tabs defaultValue={0}>
        <TabList>
          {TABS.map((t, i) => <Tab key={i}>{t}</Tab>)}
        </TabList>
        {TABS.map((t, i) => (
          <TabPanel key={i} value={i}>Content of {t}</TabPanel>
        ))}
      </Tabs>
    </Box>
  ),
};

export const Variants = {
  name: 'All Variants (Standard / Solid / Light)',
  render: () => (
    <Stack spacing={6} sx={{ p: 4, width: '100%' }}>
      {['standard', 'solid', 'light'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</Box>
          <Tabs variant={v} color="primary" defaultValue={0}>
            <TabList>
              {TABS.map((t, i) => <Tab key={i}>{t}</Tab>)}
            </TabList>
          </Tabs>
        </Box>
      ))}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={4} sx={{ p: 4, width: '100%' }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          <Tabs variant="solid" color={c} defaultValue={0}>
            <TabList>
              {['Tab 1', 'Tab 2', 'Tab 3'].map((t, i) => <Tab key={i}>{t}</Tab>)}
            </TabList>
          </Tabs>
        </Box>
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={4} sx={{ p: 4, width: '100%' }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          <Tabs variant="light" color={c} defaultValue={0}>
            <TabList>
              {['Tab 1', 'Tab 2', 'Tab 3'].map((t, i) => <Tab key={i}>{t}</Tab>)}
            </TabList>
          </Tabs>
        </Box>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={6} sx={{ p: 4, width: '100%' }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s}</Box>
          <Tabs size={s} defaultValue={0}>
            <TabList>
              {TABS.map((t, i) => <Tab key={i}>{t}</Tab>)}
            </TabList>
          </Tabs>
        </Box>
      ))}
    </Stack>
  ),
};

export const Vertical = {
  render: () => (
    <Box sx={{ p: 4, width: '100%', maxWidth: 500 }}>
      <Tabs orientation="vertical" defaultValue={0}>
        <TabList>
          {TABS.map((t, i) => <Tab key={i}>{t}</Tab>)}
        </TabList>
        {TABS.map((t, i) => (
          <TabPanel key={i} value={i}>Content of {t}</TabPanel>
        ))}
      </Tabs>
    </Box>
  ),
};

export const WithDecorators = {
  name: 'Start & End Decorators',
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Tabs defaultValue={0}>
        <TabList>
          <Tab startDecorator={<HomeIcon sx={{ fontSize: 'inherit' }} />}>Home</Tab>
          <Tab startDecorator={<SettingsIcon sx={{ fontSize: 'inherit' }} />} endDecorator={<Box component="span" sx={{ fontSize: '11px', bg: 'var(--Surface-Dim)', borderRadius: '8px', px: '6px', py: '1px' }}>New</Box>}>Settings</Tab>
          <Tab startDecorator={<PersonIcon sx={{ fontSize: 'inherit' }} />}>Profile</Tab>
        </TabList>
      </Tabs>
    </Box>
  ),
};

export const IconOnly = {
  name: 'Icon Only Tabs',
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Tabs defaultValue={0}>
        <TabList>
          <Tab iconOnly startDecorator={<HomeIcon sx={{ fontSize: 'inherit' }} />}>Home</Tab>
          <Tab iconOnly startDecorator={<SettingsIcon sx={{ fontSize: 'inherit' }} />}>Settings</Tab>
          <Tab iconOnly startDecorator={<PersonIcon sx={{ fontSize: 'inherit' }} />}>Profile</Tab>
          <Tab iconOnly startDecorator={<FavoriteIcon sx={{ fontSize: 'inherit' }} />}>Favorites</Tab>
        </TabList>
      </Tabs>
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Tabs defaultValue={0}>
        <TabList>
          <Tab>Active</Tab>
          <Tab disabled>Disabled</Tab>
          <Tab>Active</Tab>
        </TabList>
      </Tabs>
    </Box>
  ),
};

export const ManyTabs = {
  name: '12 Tabs',
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Tabs defaultValue={0} size="small">
        <TabList>
          {Array.from({ length: 12 }, (_, i) => (
            <Tab key={i}>Tab {i + 1}</Tab>
          ))}
        </TabList>
      </Tabs>
    </Box>
  ),
};

export const Scrollable = {
  name: 'Scrollable Tabs',
  render: () => (
    <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <Tabs defaultValue={0} scrollable>
        <TabList>
          {Array.from({ length: 10 }, (_, i) => (
            <Tab key={i}>Tab {i + 1}</Tab>
          ))}
        </TabList>
      </Tabs>
    </Box>
  ),
};

export const ScrollableWithIcons = {
  name: 'Scrollable + Icons + Solid',
  render: () => (
    <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <Tabs defaultValue={0} scrollable variant="solid" color="primary">
        <TabList>
          <Tab startDecorator={<HomeIcon sx={{ fontSize: 'inherit' }} />}>Home</Tab>
          <Tab startDecorator={<SettingsIcon sx={{ fontSize: 'inherit' }} />}>Settings</Tab>
          <Tab startDecorator={<PersonIcon sx={{ fontSize: 'inherit' }} />}>Profile</Tab>
          <Tab startDecorator={<FavoriteIcon sx={{ fontSize: 'inherit' }} />}>Favorites</Tab>
          <Tab>Notifications</Tab>
          <Tab>Messages</Tab>
          <Tab>Analytics</Tab>
          <Tab>Reports</Tab>
        </TabList>
      </Tabs>
    </Box>
  ),
};
