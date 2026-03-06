// src/components/Box/Box.stories.js
import React from 'react';
import { Box } from './Box';
import { Stack, Box as MuiBox } from '@mui/material';

export default { title: 'Layout/Box', component: Box };

const FAMILIES = ['Primary', 'Secondary', 'Tertiary', 'Neutral', 'Info', 'Success', 'Warning', 'Error'];

export const Default = {
  render: () => (
    <Box color="Primary" border>
      Primary box with border
    </Box>
  ),
};

export const AllBaseTones = {
  render: () => (
    <Stack spacing={2}>
      {FAMILIES.map((f) => (
        <Box key={f} color={f} border padding="sm">
          {f}
        </Box>
      ))}
    </Stack>
  ),
};

export const AllTonesOneFamily = {
  name: 'Primary — All Tones',
  render: () => (
    <Stack spacing={2}>
      {['Primary', 'Primary-Light', 'Primary-Medium', 'Primary-Dark'].map((c) => (
        <Box key={c} color={c} border padding="sm">
          {c}
        </Box>
      ))}
    </Stack>
  ),
};

export const Elevations = {
  render: () => (
    <Stack spacing={3} sx={{ p: 2 }}>
      {[0, 1, 2, 3, 4].map((e) => (
        <Box key={e} color="Neutral-Light" elevation={e} padding="md">
          Elevation {e}
        </Box>
      ))}
    </Stack>
  ),
};

export const BorderRadii = {
  render: () => (
    <Stack spacing={2}>
      {['none', 'sm', 'md', 'lg', 'full'].map((r) => (
        <Box key={r} color="Info" borderRadius={r} border padding="sm">
          Radius: {r}
        </Box>
      ))}
    </Stack>
  ),
};

export const Nested = {
  render: () => (
    <Box color="Primary-Light" padding="lg" border>
      <MuiBox sx={{ mb: 2, fontWeight: 600 }}>Outer: Primary-Light</MuiBox>
      <Box color="Primary-Dark" padding="md" border>
        <MuiBox sx={{ fontWeight: 600 }}>Inner: Primary-Dark</MuiBox>
        <MuiBox sx={{ fontSize: '14px', opacity: 0.8, mt: 1 }}>
          Inner box overrides theme. Text automatically adjusts.
        </MuiBox>
      </Box>
    </Box>
  ),
};

export const SemanticHTML = {
  render: () => (
    <Stack spacing={2}>
      <Box color="Success-Light" component="section" border padding="md">
        component="section"
      </Box>
      <Box color="Warning-Light" component="aside" border padding="md">
        component="aside"
      </Box>
      <Box color="Error-Light" component="article" border padding="md">
        component="article"
      </Box>
    </Stack>
  ),
};
