// src/components/NumberField/NumberField.stories.js
import React from 'react';
import { NumberField } from './NumberField';
import { Box, Stack } from '@mui/material';

export default { title: 'Inputs/NumberField', component: NumberField };

export const OutlinedDefault = {
  render: () => <Box sx={{ p: 4, maxWidth: 280 }}><NumberField label="Quantity" defaultValue={5} min={0} max={100} fullWidth /></Box>,
};

export const OutlinedFloating = {
  render: () => <Box sx={{ p: 4, maxWidth: 280 }}><NumberField label="Amount" labelPosition="floating" defaultValue={10} fullWidth /></Box>,
};

export const OutlinedNoLabel = {
  render: () => <Box sx={{ p: 4, maxWidth: 280 }}><NumberField labelPosition="none" defaultValue={0} fullWidth /></Box>,
};

export const SpinnerStandard = {
  render: () => <Box sx={{ p: 4 }}><NumberField variant="spinner" label="Count" defaultValue={3} min={0} max={20} /></Box>,
};

export const SpinnerSmall = {
  render: () => <Box sx={{ p: 4 }}><NumberField variant="spinner" size="small" label="Qty" defaultValue={1} min={0} max={10} /></Box>,
};

export const SpinnerSizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      <NumberField variant="spinner" size="standard" label="Standard" defaultValue={5} />
      <NumberField variant="spinner" size="small" label="Small" defaultValue={3} />
    </Stack>
  ),
};

export const Validation = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 280 }}>
      <NumberField label="Success" defaultValue={5} validation="success" validationMessage="Looks good!" fullWidth />
      <NumberField label="Warning" defaultValue={99} validation="warning" validationMessage="Close to limit." fullWidth />
      <NumberField label="Error" defaultValue={-1} validation="error" validationMessage="Must be positive." fullWidth />
      <NumberField label="Info" defaultValue={50} validation="info" validationMessage="Default is 50." fullWidth />
    </Stack>
  ),
};

export const WithStep = {
  render: () => <Box sx={{ p: 4, maxWidth: 280 }}><NumberField label="Price" defaultValue={10} step={0.5} min={0} max={100} fullWidth /></Box>,
};

export const Disabled = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 280 }}>
      <NumberField label="Outlined" defaultValue={5} disabled fullWidth />
      <NumberField variant="spinner" label="Spinner" defaultValue={3} disabled />
    </Stack>
  ),
};
