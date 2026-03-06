// src/components/LinearProgress/LinearProgress.stories.js
import React from 'react';
import { LinearProgress } from './LinearProgress';
import { Box, Stack } from '@mui/material';

export default { title: 'Feedback/LinearProgress', component: LinearProgress };

export const Default = {
  render: () => (
    <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <LinearProgress />
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <Stack spacing={3}>
        {['small', 'medium', 'large'].map((s) => (
          <Box key={s}>
            <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 0.5 }}>{s}</Box>
            <LinearProgress size={s} />
          </Box>
        ))}
      </Stack>
    </Box>
  ),
};

export const AllColors = {
  name: 'All Colors — Indeterminate',
  render: () => {
    const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
    return (
      <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Stack spacing={2}>
          {colors.map((c) => (
            <Box key={c}>
              <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mb: 0.5 }}>{c}</Box>
              <LinearProgress color={c} />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  },
};

export const AllColorsDeterminate = {
  name: 'All Colors — Determinate 75%',
  render: () => {
    const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
    return (
      <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Stack spacing={2}>
          {colors.map((c) => (
            <Box key={c}>
              <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mb: 0.5 }}>{c}</Box>
              <LinearProgress color={c} value={75} />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  },
};

export const DeterminateSizes = {
  name: 'Determinate — All Sizes',
  render: () => (
    <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <Stack spacing={3}>
        {['small', 'medium', 'large'].map((s) => (
          <Box key={s}>
            <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 0.5 }}>{s} — 60%</Box>
            <LinearProgress size={s} value={60} />
          </Box>
        ))}
      </Stack>
    </Box>
  ),
};

export const ValueRange = {
  name: 'Determinate — Value Range',
  render: () => (
    <Box sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <Stack spacing={2}>
        {[0, 25, 50, 75, 100].map((v) => (
          <Box key={v}>
            <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mb: 0.5 }}>{v}%</Box>
            <LinearProgress value={v} />
          </Box>
        ))}
      </Stack>
    </Box>
  ),
};
