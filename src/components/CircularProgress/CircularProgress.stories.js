// src/components/CircularProgress/CircularProgress.stories.js
import React from 'react';
import { CircularProgress } from './CircularProgress';
import { Box, Stack } from '@mui/material';

export default { title: 'Feedback/CircularProgress', component: CircularProgress };

export const Default = {
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={s} />
          <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)' }}>{s}</Box>
        </Box>
      ))}
    </Box>
  ),
};

export const AllColors = {
  name: 'All Colors — Indeterminate',
  render: () => {
    const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
    return (
      <Box sx={{ p: 4, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        {colors.map((c) => (
          <Box key={c} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <CircularProgress color={c} />
            <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const AllColorsDeterminate = {
  name: 'All Colors — Determinate 75%',
  render: () => {
    const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
    return (
      <Box sx={{ p: 4, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        {colors.map((c) => (
          <Box key={c} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <CircularProgress color={c} value={75} showValue />
            <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const DeterminateSizes = {
  name: 'Determinate — All Sizes',
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
      <CircularProgress size="small" value={60} />
      <CircularProgress size="medium" value={60} showValue />
      <CircularProgress size="large" value={60} showValue />
    </Box>
  ),
};

export const ValueRange = {
  name: 'Determinate — Value Range',
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'center' }}>
      {[0, 25, 50, 75, 100].map((v) => (
        <CircularProgress key={v} value={v} showValue color="primary" />
      ))}
    </Box>
  ),
};

export const WithChildren = {
  name: 'Custom Center Content',
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
      <CircularProgress value={80} size="large" color="success">
        <Box sx={{ fontSize: '11px', fontWeight: 700, color: 'var(--Text)' }}>A+</Box>
      </CircularProgress>
      <CircularProgress value={45} size="large" color="warning">
        <Box sx={{ fontSize: '11px', fontWeight: 700, color: 'var(--Text)' }}>45</Box>
      </CircularProgress>
    </Box>
  ),
};

export const CustomThickness = {
  name: 'Custom Thickness',
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
      <CircularProgress size="large" thickness={2} value={70} showValue />
      <CircularProgress size="large" thickness={5} value={70} showValue />
      <CircularProgress size="large" thickness={8} value={70} showValue />
    </Box>
  ),
};
