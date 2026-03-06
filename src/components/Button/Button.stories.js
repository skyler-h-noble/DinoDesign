// src/components/Button/Button.stories.js
import React from 'react';
import { Stack, Box } from '@mui/material';
import { Button } from './Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/FileDownload';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      options: [
        // Solid
        'primary', 'secondary', 'tertiary', 'neutral',
        'info', 'success', 'warning', 'error',
        // Outline
        'primary-outline', 'secondary-outline', 'tertiary-outline', 'neutral-outline',
        'info-outline', 'success-outline', 'warning-outline', 'error-outline',
        // Light
        'primary-light', 'secondary-light', 'tertiary-light', 'neutral-light',
        'info-light', 'success-light', 'warning-light', 'error-light',
        // Ghost
        'ghost', 'text',
      ],
      control: { type: 'select' },
      description: 'Button style variant — {color} | {color}-outline | {color}-light | ghost',
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    disabled:     { control: 'boolean' },
    iconOnly:     { control: 'boolean' },
    letterNumber: { control: 'boolean' },
    fullWidth:    { control: 'boolean' },
    children:     { control: 'text' },
  },
  parameters: { layout: 'centered' },
};

// ─── Single button sandbox ────────────────────────────────────────────────────

export const Sandbox = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Button',
    disabled: false,
    iconOnly: false,
    letterNumber: false,
    fullWidth: false,
  },
};

// ─── Solid variants ───────────────────────────────────────────────────────────

export const SolidVariants = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 100, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <Button variant={color}>{color}</Button>
          <Button variant={color} disabled>{color} disabled</Button>
          <Button variant={color} startIcon={<AddIcon aria-hidden="true" alt="" />}>With icon</Button>
          <Button variant={color} iconOnly aria-label={color}><AddIcon aria-hidden="true" alt="" /></Button>
        </Stack>
      ))}
    </Stack>
  ),
};

// ─── Outline variants ─────────────────────────────────────────────────────────

export const OutlineVariants = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 100, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <Button variant={`${color}-outline`}>{color}</Button>
          <Button variant={`${color}-outline`} disabled>{color} disabled</Button>
          <Button variant={`${color}-outline`} startIcon={<AddIcon aria-hidden="true" alt="" />}>With icon</Button>
          <Button variant={`${color}-outline`} iconOnly aria-label={color}><AddIcon aria-hidden="true" alt="" /></Button>
        </Stack>
      ))}
    </Stack>
  ),
};

// ─── Light variants ───────────────────────────────────────────────────────────

export const LightVariants = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 100, fontSize: 12, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <Button variant={`${color}-light`}>{color}</Button>
          <Button variant={`${color}-light`} disabled>{color} disabled</Button>
          <Button variant={`${color}-light`} startIcon={<AddIcon aria-hidden="true" alt="" />}>With icon</Button>
          <Button variant={`${color}-light`} iconOnly aria-label={color}><AddIcon aria-hidden="true" alt="" /></Button>
        </Stack>
      ))}
    </Stack>
  ),
};

// ─── Ghost variants ───────────────────────────────────────────────────────────

export const GhostVariants = {
  name: 'Ghost',
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>TEXT / LETTER / NUMBER — Info color only, underlined</Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="ghost">Ghost Text</Button>
          <Button variant="ghost" letterNumber>A</Button>
          <Button variant="ghost" letterNumber>1</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </Stack>
      </Box>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>GHOST WITH ICON — icon uses var(--Hotlink), no underline on icon</Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="ghost" startIcon={<AddIcon aria-hidden="true" alt="" />}>With Left Icon</Button>
          <Button variant="ghost" endIcon={<SendIcon aria-hidden="true" alt="" />}>With Right Icon</Button>
        </Stack>
      </Box>
      <Box>
        <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1 }}>ICON ONLY GHOST — all colors</Box>
        <Stack direction="row" spacing={2} alignItems="center">
          {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
            <Button key={color} variant="ghost" iconOnly aria-label={color}>
              <AddIcon aria-hidden="true" alt="" />
            </Button>
          ))}
        </Stack>
      </Box>
    </Stack>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes = {
  render: () => (
    <Stack spacing={3}>
      {['solid','outline','light'].map((style) => (
        <Box key={style}>
          <Box sx={{ fontSize: 11, color: 'var(--Text-Quiet)', mb: 1, textTransform: 'uppercase' }}>{style}</Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant={style === 'solid' ? 'primary' : `primary-${style}`} size="small">Small</Button>
            <Button variant={style === 'solid' ? 'primary' : `primary-${style}`} size="medium">Medium</Button>
            <Button variant={style === 'solid' ? 'primary' : `primary-${style}`} size="large">Large</Button>
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};

// ─── Icon positions ───────────────────────────────────────────────────────────

export const IconPositions = {
  name: 'Icon Positions',
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="primary" startIcon={<AddIcon aria-hidden="true" alt="" />}>Left Icon</Button>
        <Button variant="primary" endIcon={<SendIcon aria-hidden="true" alt="" />}>Right Icon</Button>
        <Button variant="primary" iconOnly aria-label="Add"><AddIcon aria-hidden="true" alt="" /></Button>
        <Button variant="primary" iconOnly size="small" aria-label="Add"><AddIcon aria-hidden="true" alt="" /></Button>
        <Button variant="primary" iconOnly size="large" aria-label="Add"><AddIcon aria-hidden="true" alt="" /></Button>
      </Stack>
    </Stack>
  ),
};

// ─── Letter / Number ──────────────────────────────────────────────────────────

export const LetterNumber = {
  name: 'Letter & Number',
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        {['A','B','C','D'].map((l) => (
          <Button key={l} variant="primary" letterNumber>{l}</Button>
        ))}
        {[1,2,3,4].map((n) => (
          <Button key={n} variant="secondary" letterNumber>{n}</Button>
        ))}
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        {['A','B','C'].map((l) => (
          <Button key={l} variant="primary-outline" letterNumber>{l}</Button>
        ))}
        {['A','B','C'].map((l) => (
          <Button key={l} variant="primary-light" letterNumber>{l}</Button>
        ))}
      </Stack>
    </Stack>
  ),
};

// ─── Full width ───────────────────────────────────────────────────────────────

export const FullWidth = {
  render: () => (
    <Stack spacing={2} sx={{ width: 320 }}>
      <Button variant="primary" fullWidth>Full Width Solid</Button>
      <Button variant="primary-outline" fullWidth>Full Width Outline</Button>
      <Button variant="primary-light" fullWidth>Full Width Light</Button>
      <Button variant="ghost" fullWidth>Full Width Ghost</Button>
    </Stack>
  ),
};

// ─── Style comparison matrix ──────────────────────────────────────────────────

export const StyleMatrix = {
  name: 'Style × Color Matrix',
  render: () => (
    <Stack spacing={1}>
      {/* Header row */}
      <Stack direction="row" spacing={1}>
        <Box sx={{ width: 80 }} />
        {['Solid','Outline','Light','Ghost'].map((s) => (
          <Box key={s} sx={{ width: 110, fontSize: 11, fontWeight: 600, color: 'var(--Text-Quiet)' }}>{s}</Box>
        ))}
      </Stack>
      {['primary','secondary','tertiary','neutral','info','success','warning','error'].map((color) => (
        <Stack key={color} direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 80, fontSize: 11, color: 'var(--Text-Quiet)' }}>{color}</Box>
          <Box sx={{ width: 110 }}><Button variant={color} size="small">{color}</Button></Box>
          <Box sx={{ width: 110 }}><Button variant={`${color}-outline`} size="small">{color}</Button></Box>
          <Box sx={{ width: 110 }}><Button variant={`${color}-light`} size="small">{color}</Button></Box>
          <Box sx={{ width: 110 }}>
            <Button variant="ghost" size="small">{color === 'info' ? color : '—'}</Button>
          </Box>
        </Stack>
      ))}
    </Stack>
  ),
};