// src/components/Pagination/Pagination.stories.js
import React from 'react';
import { Pagination } from './Pagination';
import { Box, Stack } from '@mui/material';

export default { title: 'Navigation/Pagination', component: Pagination };

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Pagination count={10} defaultPage={3} />
    </Box>
  ),
};

export const Variants = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Box sx={{ mb: 1, fontSize: '13px', color: 'var(--Text-Quiet)' }}>Solid</Box>
          <Pagination variant="solid" color="primary" count={10} defaultPage={3} />
        </Box>
        <Box>
          <Box sx={{ mb: 1, fontSize: '13px', color: 'var(--Text-Quiet)' }}>Light</Box>
          <Pagination variant="light" color="primary" count={10} defaultPage={3} />
        </Box>
      </Stack>
    </Box>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2}>
        {COLORS.map((c) => (
          <Pagination key={c} variant="solid" color={c} count={7} defaultPage={4} />
        ))}
      </Stack>
    </Box>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2}>
        {COLORS.map((c) => (
          <Pagination key={c} variant="light" color={c} count={7} defaultPage={4} />
        ))}
      </Stack>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack spacing={3}>
        {['small', 'medium', 'large'].map((s) => (
          <Box key={s}>
            <Box sx={{ mb: 1, fontSize: '13px', color: 'var(--Text-Quiet)' }}>{s}</Box>
            <Pagination size={s} count={7} defaultPage={4} />
          </Box>
        ))}
      </Stack>
    </Box>
  ),
};

export const SiblingBoundary = {
  name: 'Sibling & Boundary Count',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Box sx={{ mb: 1, fontSize: '13px', color: 'var(--Text-Quiet)' }}>siblingCount=0, boundaryCount=1</Box>
          <Pagination count={20} defaultPage={10} siblingCount={0} boundaryCount={1} />
        </Box>
        <Box>
          <Box sx={{ mb: 1, fontSize: '13px', color: 'var(--Text-Quiet)' }}>siblingCount=2, boundaryCount=1</Box>
          <Pagination count={20} defaultPage={10} siblingCount={2} boundaryCount={1} />
        </Box>
        <Box>
          <Box sx={{ mb: 1, fontSize: '13px', color: 'var(--Text-Quiet)' }}>siblingCount=1, boundaryCount=2</Box>
          <Pagination count={20} defaultPage={10} siblingCount={1} boundaryCount={2} />
        </Box>
      </Stack>
    </Box>
  ),
};

export const FirstLastButtons = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Pagination count={20} defaultPage={10} showFirstButton showLastButton />
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Pagination count={10} defaultPage={3} disabled />
    </Box>
  ),
};
