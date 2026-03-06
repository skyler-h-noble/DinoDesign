// src/components/Checkbox/Checkbox.stories.js
import React from 'react';
import { Stack, Box } from '@mui/material';
import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    variant: {
      options: [
        'primary',
        'primary-outline', 'secondary-outline', 'tertiary-outline', 'neutral-outline',
        'info-outline', 'success-outline', 'warning-outline', 'error-outline',
        'primary-light', 'secondary-light', 'tertiary-light', 'neutral-light',
        'info-light', 'success-light', 'warning-light', 'error-light',
      ],
      control: { type: 'select' },
      description: 'Checkbox style variant',
    },
    size: { options: ['small', 'medium', 'large'], control: { type: 'radio' } },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

// --- Sandbox -----------------------------------------------------------------

export const Sandbox = {
  args: {
    variant: 'primary',
    size: 'medium',
    label: 'Accept terms',
    disabled: false,
    indeterminate: false,
  },
};

// --- Primary variant (primary color only) ------------------------------------

export const PrimaryVariant = {
  name: 'Primary',
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Checkbox variant="primary" label="Checked" defaultChecked />
        <Checkbox variant="primary" label="Unchecked" />
        <Checkbox variant="primary" label="Indeterminate" indeterminate />
        <Checkbox variant="primary" label="Disabled" disabled defaultChecked />
      </Stack>
    </Stack>
  ),
};

// --- Outline variants --------------------------------------------------------

export const OutlineVariants = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={3} alignItems="center">
          <Box sx={{ width: 80, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <Checkbox variant={color + '-outline'} label={color} defaultChecked />
          <Checkbox variant={color + '-outline'} label="unchecked" />
          <Checkbox variant={color + '-outline'} label="disabled" disabled defaultChecked />
        </Stack>
      ))}
    </Stack>
  ),
};

// --- Light variants ----------------------------------------------------------

export const LightVariants = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={3} alignItems="center">
          <Box sx={{ width: 80, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <Checkbox variant={color + '-light'} label={color} defaultChecked />
          <Checkbox variant={color + '-light'} label="unchecked" />
          <Checkbox variant={color + '-light'} label="disabled" disabled defaultChecked />
        </Stack>
      ))}
    </Stack>
  ),
};

// --- Sizes -------------------------------------------------------------------

export const Sizes = {
  render: () => (
    <Stack spacing={3}>
      {['small', 'medium', 'large'].map((size) => (
        <Box key={size}>
          <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1, textTransform: 'uppercase' }}>{size}</Box>
          <Stack direction="row" spacing={3}>
            <Checkbox variant="primary" size={size} label={'Checked ' + size} defaultChecked />
            <Checkbox variant="primary-outline" size={size} label={'Outline ' + size} defaultChecked />
            <Checkbox variant="primary-light" size={size} label={'Light ' + size} defaultChecked />
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};

// --- Indeterminate ------------------------------------------------------------

export const Indeterminate = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox variant="primary" label="Solid indeterminate" indeterminate />
      <Checkbox variant="primary-outline" label="Outline indeterminate" indeterminate />
      <Checkbox variant="primary-light" label="Light indeterminate" indeterminate />
    </Stack>
  ),
};

// --- Without label -----------------------------------------------------------

export const WithoutLabel = {
  name: 'Without Label',
  render: () => (
    <Stack direction="row" spacing={2}>
      <Checkbox variant="primary" defaultChecked aria-label="Primary checkbox" />
      <Checkbox variant="secondary" defaultChecked aria-label="Secondary checkbox" />
      <Checkbox variant="info-outline" defaultChecked aria-label="Info outline checkbox" />
      <Checkbox variant="success-light" defaultChecked aria-label="Success light checkbox" />
    </Stack>
  ),
};

// --- Disabled ----------------------------------------------------------------

export const Disabled = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox variant="primary" label="Checked disabled" defaultChecked disabled />
      <Checkbox variant="primary" label="Unchecked disabled" disabled />
      <Checkbox variant="primary" label="Indeterminate disabled" indeterminate disabled />
    </Stack>
  ),
};

// --- Style comparison matrix -------------------------------------------------

export const StyleMatrix = {
  name: 'Style × Color Matrix',
  render: () => (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Box sx={{ width: 80 }} />
        {['Primary', 'Outline', 'Light'].map((s) => (
          <Box key={s} sx={{ width: 140, fontSize: 11, fontWeight: 600, color: 'var(--Text-Quiet)' }}>{s}</Box>
        ))}
      </Stack>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 80, fontSize: 11, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <Box sx={{ width: 140 }}>
            {color === 'primary'
              ? <Checkbox variant="primary" label="primary" defaultChecked />
              : <Box sx={{ opacity: 0.25, fontSize: 11, color: 'var(--Text-Quiet)', pt: 1 }}>N/A</Box>
            }
          </Box>
          <Box sx={{ width: 140 }}><Checkbox variant={color + '-outline'} label={color} defaultChecked /></Box>
          <Box sx={{ width: 140 }}><Checkbox variant={color + '-light'} label={color} defaultChecked /></Box>
        </Stack>
      ))}
    </Stack>
  ),
};