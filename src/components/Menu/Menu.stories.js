// src/components/Menu/Menu.stories.js
import React from 'react';
import { Dropdown, MenuButton, Menu, MenuItem, MenuDivider } from './Menu';
import { Box, Stack } from '@mui/material';

export default { title: 'Navigation/Menu', component: Menu };

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Dropdown>
        <MenuButton>Actions</MenuButton>
        <Menu>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Dropdown>
    </Box>
  ),
};

export const Variants = {
  name: 'All Variants (Default / Solid / Light)',
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4 }}>
      {['default', 'solid', 'light'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</Box>
          <Dropdown variant={v} color="primary" open={true}>
            <MenuButton>{v.charAt(0).toUpperCase() + v.slice(1)}</MenuButton>
            <Menu>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      ))}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack direction="row" flexWrap="wrap" sx={{ p: 4, gap: 4 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          <Dropdown variant="solid" color={c} open={true}>
            <MenuButton>{c}</MenuButton>
            <Menu>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack direction="row" flexWrap="wrap" sx={{ p: 4, gap: 4 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          <Dropdown variant="light" color={c} open={true}>
            <MenuButton>{c}</MenuButton>
            <Menu>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s}</Box>
          <Dropdown size={s} open={true}>
            <MenuButton>{s}</MenuButton>
            <Menu>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      ))}
    </Stack>
  ),
};

export const WithDividerAndSelected = {
  name: 'Divider + Selected + Disabled',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Dropdown open={true}>
        <MenuButton>Dashboard</MenuButton>
        <Menu>
          <MenuItem selected>Home</MenuItem>
          <MenuItem>Analytics</MenuItem>
          <MenuItem>Reports</MenuItem>
          <MenuDivider />
          <MenuItem disabled>Admin (disabled)</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Dropdown>
    </Box>
  ),
};

export const ControlledOpen = {
  name: 'Controlled: open={true}',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Dropdown open={true}>
        <MenuButton>Always Open</MenuButton>
        <Menu>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
        </Menu>
      </Dropdown>
    </Box>
  ),
};

export const ControlledClosed = {
  name: 'Controlled: open={false}',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Dropdown open={false}>
        <MenuButton>Always Closed</MenuButton>
        <Menu>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
        </Menu>
      </Dropdown>
    </Box>
  ),
};
