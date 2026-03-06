// src/components/Sheet/Sheet.stories.js
import React from 'react';
import { Sheet } from './Sheet';
import { Box, Stack } from '@mui/material';

export default { title: 'Surfaces/Sheet', component: Sheet };

export const Default = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Sheet>
        <Box sx={{ fontWeight: 700, mb: 1 }}>Default Sheet</Box>
        <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '14px' }}>
          A generic surface container with var(--Background) and var(--Border-Variant).
        </Box>
      </Sheet>
    </Box>
  ),
};

export const Variants = {
  name: 'All Variants (Default / Solid / Light)',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 400 }}>
      {['default', 'solid', 'light'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</Box>
          <Sheet variant={v} color="primary">
            <Box sx={{ fontWeight: 700 }}>{v.charAt(0).toUpperCase() + v.slice(1)} Sheet</Box>
            <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px', mt: 0.5 }}>Content within the sheet surface.</Box>
          </Sheet>
        </Box>
      ))}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={2} sx={{ p: 4, maxWidth: 400 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Sheet key={c} variant="solid" color={c}>
          <Box sx={{ fontWeight: 700 }}>{c.charAt(0).toUpperCase() + c.slice(1)}</Box>
        </Sheet>
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={2} sx={{ p: 4, maxWidth: 400 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Sheet key={c} variant="light" color={c}>
          <Box sx={{ fontWeight: 700 }}>{c.charAt(0).toUpperCase() + c.slice(1)}</Box>
        </Sheet>
      ))}
    </Stack>
  ),
};

export const Elevations = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 400 }}>
      {[0, 1, 2, 3].map((e) => (
        <Sheet key={e} elevation={e}>
          <Box sx={{ fontWeight: 700 }}>Elevation {e}</Box>
          <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px', mt: 0.5 }}>
            {e === 0 ? 'No shadow.' : 'box-shadow depth ' + e + '.'}
          </Box>
        </Sheet>
      ))}
    </Stack>
  ),
};

export const NoBorder = {
  name: 'Bordered={false}',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Sheet bordered={false} elevation={2}>
        <Box sx={{ fontWeight: 700 }}>No Border, Elevation 2</Box>
        <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px', mt: 0.5 }}>Shadow provides container definition instead of border.</Box>
      </Sheet>
    </Box>
  ),
};

export const NoRounding = {
  name: 'Rounded={false}',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Sheet rounded={false}>
        <Box sx={{ fontWeight: 700 }}>Sharp Corners</Box>
        <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px', mt: 0.5 }}>border-radius: 0</Box>
      </Sheet>
    </Box>
  ),
};

export const ComponentOverride = {
  name: 'Component Override — section and aside',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 400 }}>
      <Sheet component="section">
        <Box sx={{ fontWeight: 700 }}>Renders as {'<section>'}</Box>
      </Sheet>
      <Sheet component="aside" variant="light" color="info">
        <Box sx={{ fontWeight: 700 }}>Renders as {'<aside>'}</Box>
      </Sheet>
    </Stack>
  ),
};

export const Nested = {
  name: 'Nested Sheets',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Sheet variant="light" color="neutral">
        <Box sx={{ fontWeight: 700, mb: 1 }}>Outer Sheet (Light/Neutral)</Box>
        <Sheet variant="solid" color="primary" sx={{ mt: 1 }}>
          <Box sx={{ fontWeight: 700 }}>Inner Sheet (Solid/Primary)</Box>
          <Box sx={{ fontSize: '13px', mt: 0.5 }}>Nested within the outer sheet.</Box>
        </Sheet>
      </Sheet>
    </Box>
  ),
};
