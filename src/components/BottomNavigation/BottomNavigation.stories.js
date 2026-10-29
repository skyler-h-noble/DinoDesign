// src/components/BottomNavigation/BottomNavigation.stories.js
import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { Box, Stack } from '@mui/material';
import HomeIcon from '@omni-design/icons/Home';
import ExploreIcon from '@omni-design/icons/Explore';
import RadioIcon from '@omni-design/icons/Radio';
import LibraryMusicIcon from '@omni-design/icons/LibraryMusic';
import FavoriteIcon from '@omni-design/icons/Favorite';

export default { title: 'Navigation/BottomNavigation', component: BottomNavigation };

const ITEMS = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <ExploreIcon />, label: 'Browse' },
  { icon: <RadioIcon />, label: 'Radio' },
  { icon: <LibraryMusicIcon />, label: 'Library' },
];

export const Default = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} />
    </Box>
  ),
};

export const VerticalLabelsBackfill = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} showLabels />
    </Box>
  ),
};

export const HorizontalLabelsBackfill = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} showLabels />
    </Box>
  ),
};

export const NoLabels = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} showLabels={false} />
    </Box>
  ),
};

export const NoBackfill = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} showLabels />
    </Box>
  ),
};

export const FiveItems = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={[...ITEMS, { icon: <FavoriteIcon />, label: 'Favorites' }]} showLabels />
    </Box>
  ),
};

export const Comparison = {
  name: 'Vertical vs Horizontal',
  render: () => (
    <Stack spacing={4} sx={{ maxWidth: 500 }}>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>Labels under the icon</Box>
        <BottomNavigation items={ITEMS} showLabels />
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>Icons only</Box>
        <BottomNavigation items={ITEMS} showLabels />
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>Floating bar</Box>
        <BottomNavigation items={ITEMS} showLabels />
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>Vertical bar</Box>
        <BottomNavigation items={ITEMS} showLabels={false} />
      </Box>
    </Stack>
  ),
};
