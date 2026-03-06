// src/components/Divider/Divider.stories.js
import React from 'react';
import { Divider } from './Divider';
import { Stack, Box } from '@mui/material';

export default {
  title: 'Layout/Divider',
  component: Divider,
  argTypes: {
    color: {
      control: 'select',
      options: [
        'default', 'primary', 'secondary', 'tertiary',
        'neutral', 'info', 'success', 'warning', 'error',
      ],
    },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    indicatorStyle: { control: 'select', options: ['outline', 'light'] },
    indicatorText: { control: 'text' },
  },
};

export const Default = {
  render: () => (
    <Box sx={{ p: 4, width: 400 }}>
      <Box sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>Content above</Box>
      <Divider />
      <Box sx={{ mt: 2, color: 'var(--Text-Quiet)' }}>Content below</Box>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={4} sx={{ p: 4, width: 400 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>Small (1px)</Box>
        <Divider size="small" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>Medium (2px)</Box>
        <Divider size="medium" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>Large (4px)</Box>
        <Divider size="large" />
      </Box>
    </Stack>
  ),
};

export const AllColors = {
  name: 'All Colors',
  render: () => {
    const colors = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
    return (
      <Stack spacing={3} sx={{ p: 4, width: 400 }}>
        {colors.map((c) => (
          <Box key={c}>
            <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>{c}</Box>
            <Divider color={c} size="medium" />
          </Box>
        ))}
      </Stack>
    );
  },
};

export const Vertical = {
  render: () => (
    <Stack direction="row" alignItems="stretch" sx={{ p: 4, height: 80 }}>
      <Box sx={{ px: 3, display: 'flex', alignItems: 'center', color: 'var(--Text-Quiet)' }}>Left</Box>
      <Divider orientation="vertical" color="primary" size="medium" />
      <Box sx={{ px: 3, display: 'flex', alignItems: 'center', color: 'var(--Text-Quiet)' }}>Right</Box>
    </Stack>
  ),
};

export const WithIndicator = {
  name: 'With Text Indicator',
  render: () => (
    <Stack spacing={4} sx={{ p: 4, width: 400 }}>
      <Divider indicatorText="OR" color="primary" indicatorStyle="outline" />
      <Divider indicatorText="OR" color="primary" indicatorStyle="light" />
      <Divider indicatorText="Section 2" color="info" indicatorStyle="light" size="medium" />
    </Stack>
  ),
};

export const IndicatorComparison = {
  name: 'Outline vs Light Indicator',
  render: () => {
    const colors = ['primary', 'info', 'success', 'error'];
    return (
      <Stack spacing={4} sx={{ p: 4, width: 400 }}>
        {colors.map((c) => (
          <Stack key={c} spacing={2}>
            <Box sx={{ fontSize: 12, fontWeight: 600, color: 'var(--Text-Quiet)' }}>{c}</Box>
            <Divider color={c} indicatorText="Outline" indicatorStyle="outline" />
            <Divider color={c} indicatorText="Light" indicatorStyle="light" />
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const TextAlign = {
  name: 'Text Alignment',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, width: 400 }}>
      <Divider indicatorText="Left" color="info" indicatorStyle="outline" textAlign="left" />
      <Divider indicatorText="Center" color="info" indicatorStyle="outline" textAlign="center" />
      <Divider indicatorText="Right" color="info" indicatorStyle="outline" textAlign="right" />
    </Stack>
  ),
};
