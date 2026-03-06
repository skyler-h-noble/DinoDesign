// src/components/SearchField/SearchField.stories.js
import React from 'react';
import { SearchField } from './SearchField';
import { Box, Stack } from '@mui/material';

export default { title: 'Inputs/SearchField', component: SearchField };

export const Default = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <SearchField placeholder="Search…" />
    </Box>
  ),
};

export const AllSizes = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Stack spacing={2}>
        <SearchField size="small" placeholder="Small search…" />
        <SearchField size="medium" placeholder="Medium search…" />
        <SearchField size="large" placeholder="Large search…" />
      </Stack>
    </Box>
  ),
};

export const WithValue = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <SearchField defaultValue="Design tokens" />
    </Box>
  ),
};

export const NoClearButton = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <SearchField defaultValue="No clear" showClearButton={false} />
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <SearchField disabled placeholder="Disabled search" />
    </Box>
  ),
};

export const InDarkContext = {
  name: 'In Dark Theme Context',
  render: () => (
    <Box data-theme="Neutral-Dark" data-surface="Surface-Dim"
      sx={{ p: 4, maxWidth: 400, backgroundColor: 'var(--Background)', borderRadius: '8px' }}>
      <SearchField placeholder="Search in dark context…" />
    </Box>
  ),
};

export const FullWidth = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <SearchField placeholder="Full width search…" sx={{ width: '100%' }} />
    </Box>
  ),
};
