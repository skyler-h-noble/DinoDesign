// src/components/Input/Input.stories.js
import React from 'react';
import { Stack, Box } from '@mui/material';
import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    variant: {
      options: [
        'primary-outline', 'secondary-outline', 'tertiary-outline', 'neutral-outline',
        'info-outline', 'success-outline', 'warning-outline', 'error-outline',
      ],
      control: { type: 'select' },
    },
    size: { options: ['small', 'medium', 'large'], control: { type: 'radio' } },
    labelPosition: { options: ['standard', 'floating'], control: { type: 'radio' } },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    validation: { options: [undefined, 'info', 'success', 'warning', 'error'], control: { type: 'select' } },
    validationMessage: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

// --- Sandbox -----------------------------------------------------------------

export const Sandbox = {
  args: {
    variant: 'primary-outline',
    size: 'medium',
    label: 'Email',
    labelPosition: 'standard',
    placeholder: 'you@example.com',
    disabled: false,
    fullWidth: false,
  },
};

// --- Outline variants (all colors) -------------------------------------------

export const OutlineVariants = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Input key={color} variant={color + '-outline'} label={color} placeholder={'Enter ' + color} fullWidth />
      ))}
    </Stack>
  ),
};

// --- Sizes -------------------------------------------------------------------

export const Sizes = {
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      {['small', 'medium', 'large'].map((size) => (
        <Input key={size} variant="primary-outline" size={size} label={size + ' input'} placeholder="Placeholder" fullWidth />
      ))}
    </Stack>
  ),
};

// --- Label positions ---------------------------------------------------------

export const LabelStandard = {
  name: 'Standard Label',
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Input variant="primary-outline" label="Standard Label" labelPosition="standard" placeholder="you@example.com" fullWidth />
      <Input variant="secondary-outline" label="With Helper" labelPosition="standard" placeholder="Enter text" helperText="Helper text below" fullWidth />
    </Stack>
  ),
};

export const LabelFloating = {
  name: 'Floating Label',
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Input variant="primary-outline" label="Email Address" labelPosition="floating" fullWidth />
      <Input variant="secondary-outline" label="Full Name" labelPosition="floating" fullWidth />
      <Input variant="neutral-outline" label="Floating Large" labelPosition="floating" size="large" fullWidth />
    </Stack>
  ),
};

export const FloatingSizes = {
  name: 'Floating Label — All Sizes',
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      {['small', 'medium', 'large'].map((size) => (
        <Input key={size} variant="primary-outline" size={size} label={size + ' floating'} labelPosition="floating" fullWidth />
      ))}
    </Stack>
  ),
};

// --- Helper text -------------------------------------------------------------

export const HelperText = {
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Input variant="primary-outline" label="Email" helperText="We will never share your email." placeholder="you@example.com" fullWidth />
      <Input variant="primary-outline" label="Password" helperText="Must be at least 8 characters." placeholder="Enter password" type="password" fullWidth />
    </Stack>
  ),
};

// --- Validation states -------------------------------------------------------

export const Validation = {
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Input variant="primary-outline" label="Info" validation="info" validationMessage="Your username will be visible to others." defaultValue="johndoe" fullWidth />
      <Input variant="primary-outline" label="Success" validation="success" validationMessage="Looks good!" defaultValue="valid@email.com" fullWidth />
      <Input variant="primary-outline" label="Warning" validation="warning" validationMessage="This email is already in use." defaultValue="taken@email.com" fullWidth />
      <Input variant="primary-outline" label="Error" validation="error" validationMessage="Please enter a valid email." defaultValue="not-an-email" fullWidth />
    </Stack>
  ),
};

// --- Disabled ----------------------------------------------------------------

export const Disabled = {
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Input variant="primary-outline" label="Disabled empty" disabled fullWidth />
      <Input variant="primary-outline" label="Disabled with value" disabled defaultValue="Disabled content" fullWidth />
      <Input variant="secondary-outline" label="Secondary disabled" disabled defaultValue="Secondary" fullWidth />
    </Stack>
  ),
};

// --- Color x Size matrix -----------------------------------------------------

export const ColorSizeMatrix = {
  name: 'Color × Size Matrix',
  render: () => (
    <Stack spacing={4}>
      {['primary', 'secondary', 'tertiary', 'neutral'].map((color) => (
        <Box key={color}>
          <Box sx={{ fontSize: 11, fontWeight: 600, color: 'var(--Text-Quiet)', mb: 2, textTransform: 'uppercase' }}>{color}</Box>
          <Stack direction="row" spacing={2}>
            {['small', 'medium', 'large'].map((size) => (
              <Input
                key={size}
                variant={color + '-outline'}
                size={size}
                label={size}
                placeholder="Type here"
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};
