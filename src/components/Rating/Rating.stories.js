// src/components/Rating/Rating.stories.js
import React from 'react';
import { Rating } from './Rating';
import { Box, Stack } from '@mui/material';

export default { title: 'Inputs/Rating', component: Rating };

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'];

export const Default = {
  render: () => <Box sx={{ p: 4 }}><Rating defaultValue={3} /></Box>,
};

export const AllColors = {
  render: () => (
    <Stack spacing={2} sx={{ p: 4 }}>
      {COLORS.map((c) => (
        <Box key={c} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 80, fontSize: '12px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          <Rating color={c} defaultValue={3} />
        </Box>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 80, fontSize: '12px', color: 'var(--Text-Quiet)' }}>{s}</Box>
          <Rating size={s} defaultValue={3} />
        </Box>
      ))}
    </Stack>
  ),
};

export const HalfPrecision = {
  render: () => <Box sx={{ p: 4 }}><Rating defaultValue={2.5} precision={0.5} /></Box>,
};

export const ReadOnly = {
  render: () => <Box sx={{ p: 4 }}><Rating value={4} readOnly /></Box>,
};

export const NoRating = {
  render: () => <Box sx={{ p: 4 }}><Rating value={null} /></Box>,
};

export const TenStars = {
  render: () => <Box sx={{ p: 4 }}><Rating defaultValue={7} max={10} size="small" /></Box>,
};

export const Disabled = {
  render: () => <Box sx={{ p: 4 }}><Rating value={3} disabled /></Box>,
};
