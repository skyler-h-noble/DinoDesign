// src/components/Fab/Fab.stories.js
import React from 'react';
import { Fab } from './Fab';
import { Box, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import NavigationIcon from '@mui/icons-material/Navigation';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default { title: 'Inputs/Fab', component: Fab };

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

export const Default = {
  render: () => <Box sx={{ p: 4 }}><Fab ariaLabel="Add" /></Box>,
};

export const Variants = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={3}>
        <Fab variant="solid" ariaLabel="Solid" />
        <Fab variant="light" ariaLabel="Light" />
      </Stack>
    </Box>
  ),
};

export const SolidColors = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {COLORS.map((c) => <Fab key={c} color={c} ariaLabel={c} />)}
      </Stack>
    </Box>
  ),
};

export const LightColors = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {COLORS.map((c) => <Fab key={c} variant="light" color={c} ariaLabel={c} />)}
      </Stack>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Fab size="small" ariaLabel="Small" />
        <Fab size="medium" ariaLabel="Medium" />
        <Fab size="large" ariaLabel="Large" />
      </Stack>
    </Box>
  ),
};

export const Extended = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Fab extended label="Navigate" icon={<NavigationIcon sx={{ fontSize: 'inherit' }} />} ariaLabel="Navigate" />
        <Fab extended label="Edit" icon={<EditIcon sx={{ fontSize: 'inherit' }} />} color="secondary" ariaLabel="Edit" />
        <Fab extended label="Like" icon={<FavoriteIcon sx={{ fontSize: 'inherit' }} />} variant="light" color="error" ariaLabel="Like" />
      </Stack>
    </Box>
  ),
};

export const Animated = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={3}>
        <Fab animate ariaLabel="Animated" />
        <Fab animate extended label="New Item" ariaLabel="New Item" />
      </Stack>
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={3}>
        <Fab disabled ariaLabel="Disabled" />
        <Fab disabled extended label="Disabled" ariaLabel="Disabled" />
      </Stack>
    </Box>
  ),
};
