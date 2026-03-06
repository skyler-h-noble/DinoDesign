// src/components/Avatar/Avatar.stories.js
import React from 'react';
import { Avatar, AvatarGroup } from './Avatar';
import { Box, Stack } from '@mui/material';

export default { title: 'Data Display/Avatar', component: Avatar };

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

export const Initials = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Avatar initials="AB" size="small" />
      <Avatar initials="CD" size="medium" />
      <Avatar initials="EF" size="large" />
    </Stack>
  ),
};

export const Fallback = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Avatar size="small" />
      <Avatar size="medium" />
      <Avatar size="large" />
    </Stack>
  ),
};

export const AllColors = {
  render: () => (
    <Stack direction="row" spacing={1} sx={{ p: 4, flexWrap: 'wrap' }}>
      {COLORS.map((c) => <Avatar key={c} initials={c.slice(0, 2).toUpperCase()} color={c} />)}
    </Stack>
  ),
};

export const Clickable = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Avatar initials="AB" clickable onClick={() => alert('Clicked!')} />
      <Avatar initials="CD" clickable color="primary" />
      <Avatar clickable color="error" />
    </Stack>
  ),
};

export const Group = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <AvatarGroup max={4}>
        <Avatar initials="AB" color="primary" />
        <Avatar initials="CD" color="secondary" />
        <Avatar initials="EF" color="tertiary" />
        <Avatar initials="GH" color="info" />
        <Avatar initials="IJ" color="success" />
        <Avatar initials="KL" color="warning" />
      </AvatarGroup>
    </Box>
  ),
};

export const ImageWithFallback = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Avatar src="https://i.pravatar.cc/80?u=1" alt="User 1" />
      <Avatar src="https://broken-url.jpg" alt="Broken — falls back" />
    </Stack>
  ),
};
