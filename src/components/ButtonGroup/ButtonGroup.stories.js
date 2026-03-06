// src/components/ButtonGroup/ButtonGroup.stories.js
import React from 'react';
import { Stack, Box } from '@mui/material';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    variant: {
      options: [
        'primary', 'secondary', 'tertiary', 'neutral',
        'info', 'success', 'warning', 'error',
        'primary-outline', 'secondary-outline', 'tertiary-outline', 'neutral-outline',
        'info-outline', 'success-outline', 'warning-outline', 'error-outline',
        'primary-light', 'secondary-light', 'tertiary-light', 'neutral-light',
        'info-light', 'success-light', 'warning-light', 'error-light',
        'ghost',
      ],
      control: { type: 'select' },
      description: 'Variant passed down to all child buttons',
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
    spacing:   { control: { type: 'number', min: 0, max: 4, step: 0.5 } },
    disabled:  { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

// --- Single group sandbox ---

export const Sandbox = {
  args: {
    variant: 'primary-outline',
    size: 'medium',
    orientation: 'horizontal',
    spacing: 0,
    disabled: false,
    fullWidth: false,
  },
  render: (args) => (
    <ButtonGroup {...args} aria-label="button group sandbox">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  ),
};

// --- Solid variants ---

export const SolidVariants = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 100, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <ButtonGroup variant={color} aria-label={`${color} solid group`}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Stack>
      ))}
    </Stack>
  ),
};

// --- Outline variants ---

export const OutlineVariants = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 100, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <ButtonGroup variant={`${color}-outline`} aria-label={`${color} outline group`}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Stack>
      ))}
    </Stack>
  ),
};

// --- Light variants ---

export const LightVariants = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 100, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <ButtonGroup variant={`${color}-light`} aria-label={`${color} light group`}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Stack>
      ))}
    </Stack>
  ),
};

// --- Ghost variant ---

export const GhostVariant = {
  name: 'Ghost',
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>TEXT</Box>
        <ButtonGroup variant="ghost" aria-label="ghost text group">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>ICON-ONLY</Box>
        <ButtonGroup variant="ghost" aria-label="ghost icon group">
          <Button iconOnly aria-label="Bold"><FormatBoldIcon aria-hidden="true" alt="" /></Button>
          <Button iconOnly aria-label="Italic"><FormatItalicIcon aria-hidden="true" alt="" /></Button>
          <Button iconOnly aria-label="Underline"><FormatUnderlinedIcon aria-hidden="true" alt="" /></Button>
        </ButtonGroup>
      </Box>
    </Stack>
  ),
};

// --- Sizes ---

export const Sizes = {
  render: () => (
    <Stack spacing={3}>
      {['small', 'medium', 'large'].map((size) => (
        <Box key={size}>
          <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1, textTransform: 'uppercase' }}>{size}</Box>
          <ButtonGroup variant="primary-outline" size={size} aria-label={`${size} group`}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Box>
      ))}
    </Stack>
  ),
};

// --- Orientation ---

export const Orientation = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>HORIZONTAL (DEFAULT)</Box>
        <ButtonGroup variant="primary-outline" aria-label="horizontal group">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>VERTICAL</Box>
        <ButtonGroup variant="primary-outline" orientation="vertical" aria-label="vertical group">
          <Button>Top</Button>
          <Button>Middle</Button>
          <Button>Bottom</Button>
        </ButtonGroup>
      </Box>
    </Stack>
  ),
};

// --- Spacing ---

export const Spacing = {
  name: 'Spacing — Connected vs Spaced',
  render: () => (
    <Stack spacing={3}>
      {[0, 0.5, 1, 2].map((sp) => (
        <Box key={sp}>
          <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>
            {sp === 0 ? 'CONNECTED (spacing=0)' : `SPACING=${sp}`}
          </Box>
          <ButtonGroup variant="primary-outline" spacing={sp} aria-label={`spacing ${sp} group`}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Box>
      ))}
    </Stack>
  ),
};

// --- With icons ---

export const WithIcons = {
  name: 'With Icons',
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>TEXT + START ICONS</Box>
        <ButtonGroup variant="primary-outline" aria-label="text and icon group">
          <Button startIcon={<SaveIcon aria-hidden="true" alt="" />}>Save</Button>
          <Button startIcon={<EditIcon aria-hidden="true" alt="" />}>Edit</Button>
          <Button startIcon={<DeleteIcon aria-hidden="true" alt="" />}>Delete</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>ICON-ONLY TOOLBAR</Box>
        <ButtonGroup variant="primary-outline" aria-label="formatting toolbar">
          <Button iconOnly aria-label="Bold"><FormatBoldIcon aria-hidden="true" alt="" /></Button>
          <Button iconOnly aria-label="Italic"><FormatItalicIcon aria-hidden="true" alt="" /></Button>
          <Button iconOnly aria-label="Underline"><FormatUnderlinedIcon aria-hidden="true" alt="" /></Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>MIXED — TEXT + ICON</Box>
        <ButtonGroup variant="primary-outline" aria-label="mixed content group">
          <Button>Action</Button>
          <Button iconOnly aria-label="Add"><AddIcon aria-hidden="true" alt="" /></Button>
        </ButtonGroup>
      </Box>
    </Stack>
  ),
};

// --- Disabled ---

export const Disabled = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>GROUP DISABLED</Box>
        <ButtonGroup variant="primary-outline" disabled aria-label="disabled group">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>INDIVIDUAL OVERRIDE</Box>
        <ButtonGroup variant="primary-outline" disabled aria-label="partial disabled group">
          <Button>Disabled</Button>
          <Button disabled={false}>Enabled</Button>
          <Button>Disabled</Button>
        </ButtonGroup>
      </Box>
    </Stack>
  ),
};

// --- Full width ---

export const FullWidth = {
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <ButtonGroup variant="primary" fullWidth aria-label="full width solid">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="primary-outline" fullWidth aria-label="full width outline">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="primary-light" fullWidth aria-label="full width light">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Stack>
  ),
};

// --- Style comparison matrix ---

export const StyleMatrix = {
  name: 'Style x Orientation Matrix',
  render: () => (
    <Stack spacing={4}>
      <Stack direction="row" spacing={4}>
        <Box sx={{ width: 80 }} />
        <Box sx={{ fontSize: 11, fontWeight: 600, color: 'var(--Text-Quiet)', width: 200 }}>Horizontal</Box>
        <Box sx={{ fontSize: 11, fontWeight: 600, color: 'var(--Text-Quiet)' }}>Vertical</Box>
      </Stack>
      {[
        { label: 'Solid',   variant: 'primary' },
        { label: 'Outline', variant: 'primary-outline' },
        { label: 'Light',   variant: 'primary-light' },
        { label: 'Ghost',   variant: 'ghost' },
      ].map(({ label, variant }) => (
        <Stack key={variant} direction="row" spacing={4} alignItems="flex-start">
          <Box sx={{ width: 80, fontSize: 12, color: 'var(--Text-Quiet)', pt: 1 }}>{label}</Box>
          <Box sx={{ width: 200 }}>
            <ButtonGroup variant={variant} aria-label={`${label} horizontal`}>
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Box>
          <ButtonGroup variant={variant} orientation="vertical" aria-label={`${label} vertical`}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Stack>
      ))}
    </Stack>
  ),
};
