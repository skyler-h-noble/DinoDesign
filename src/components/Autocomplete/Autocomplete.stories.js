// src/components/Autocomplete/Autocomplete.stories.js
import React from 'react';
import { Autocomplete } from './Autocomplete';
import { Box, Stack } from '@mui/material';

export default { title: 'Inputs/Autocomplete', component: Autocomplete };

const COUNTRIES = [
  { label: 'United States', value: 'us' }, { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' }, { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' }, { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' }, { label: 'Brazil', value: 'br' },
];

export const Default = {
  render: () => <Box sx={{ p: 4, maxWidth: 320 }}><Autocomplete label="Country" options={COUNTRIES} fullWidth /></Box>,
};

export const FloatingLabel = {
  render: () => <Box sx={{ p: 4, maxWidth: 320 }}><Autocomplete label="Country" labelPosition="floating" options={COUNTRIES} fullWidth /></Box>,
};

export const SelectionStyles = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['default', 'light', 'solid'].map((s) => (
        <Autocomplete key={s} label={s} style={s} options={COUNTRIES} defaultValue={COUNTRIES[0]} fullWidth />
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Autocomplete key={s} label={s} size={s} options={COUNTRIES} fullWidth />
      ))}
    </Stack>
  ),
};

export const WithHelperText = {
  render: () => <Box sx={{ p: 4, maxWidth: 320 }}><Autocomplete label="Country" options={COUNTRIES} helperText="Start typing to filter" fullWidth /></Box>,
};

export const FreeSolo = {
  render: () => <Box sx={{ p: 4, maxWidth: 320 }}><Autocomplete label="Tag" options={COUNTRIES} freeSolo placeholder="Type anything" fullWidth /></Box>,
};

export const Disabled = {
  render: () => <Box sx={{ p: 4, maxWidth: 320 }}><Autocomplete label="Country" options={COUNTRIES} disabled defaultValue={COUNTRIES[1]} fullWidth /></Box>,
};

export const NotClearable = {
  render: () => <Box sx={{ p: 4, maxWidth: 320 }}><Autocomplete label="Country" options={COUNTRIES} clearable={false} defaultValue={COUNTRIES[0]} fullWidth /></Box>,
};
