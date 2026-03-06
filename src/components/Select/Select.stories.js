// src/components/Select/Select.stories.js
import React from 'react';
import { Select } from './Select';
import { Box, Stack, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

export default { title: 'Inputs/Select', component: Select };

const OPTS = [
  { value: 'none', label: 'None' },
  { value: 'ten', label: 'Ten' },
  { value: 'twenty', label: 'Twenty' },
  { value: 'thirty', label: 'Thirty' },
  { value: 'forty', label: 'Forty' },
];

const COLORS = [
  { value: '#e53935', label: 'Red', color: '#e53935' },
  { value: '#1e88e5', label: 'Blue', color: '#1e88e5' },
  { value: '#43a047', label: 'Green', color: '#43a047' },
  { value: '#fb8c00', label: 'Orange', color: '#fb8c00' },
];

export const TopLabel = {
  render: () => <Box sx={{ p: 4, maxWidth: 300 }}><Select options={OPTS} label="Category" labelPosition="top" /></Box>,
};

export const FloatingLabel = {
  render: () => <Box sx={{ p: 4, maxWidth: 300 }}><Select options={OPTS} label="Category" labelPosition="floating" /></Box>,
};

export const NoLabel = {
  render: () => <Box sx={{ p: 4, maxWidth: 300 }}><Select options={OPTS} labelPosition="none" placeholder="Choose…" /></Box>,
};

export const Sizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 300 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Select key={s} options={OPTS} label={s} size={s} labelPosition="top" />
      ))}
    </Stack>
  ),
};

export const FloatingSizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 300 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Select key={s} options={OPTS} label={'Floating ' + s} size={s} labelPosition="floating" />
      ))}
    </Stack>
  ),
};

export const SelectionStyles = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 300 }}>
      {['default', 'light', 'solid'].map((ss) => (
        <Select key={ss} options={OPTS} label={ss} selectionStyle={ss} defaultValue="twenty" />
      ))}
    </Stack>
  ),
};

export const ColorSelect = {
  render: () => <Box sx={{ p: 4, maxWidth: 300 }}><Select mode="color" options={COLORS} label="Color" /></Box>,
};

export const WithIconDecoration = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 300 }}>
      <Select options={OPTS} label="Search" startDecoration={<SearchIcon sx={{ fontSize: 18 }} />} />
    </Box>
  ),
};

export const WithAvatarDecoration = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 300 }}>
      <Select options={OPTS} label="User" startDecoration={
        <Avatar sx={{ width: 24, height: 24, fontSize: '11px' }}>AB</Avatar>
      } />
    </Box>
  ),
};

export const Disabled = {
  render: () => <Box sx={{ p: 4, maxWidth: 300 }}><Select options={OPTS} label="Disabled" disabled defaultValue="ten" /></Box>,
};
