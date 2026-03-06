// src/components/BottomNavigation/BottomNavigation.stories.js
import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { Box, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import RadioIcon from '@mui/icons-material/Radio';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
      <BottomNavigation items={ITEMS} showLabels labelOrientation="vertical" backfill />
    </Box>
  ),
};

export const HorizontalLabelsBackfill = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} showLabels labelOrientation="horizontal" backfill />
    </Box>
  ),
};

export const NoLabels = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} showLabels={false} backfill />
    </Box>
  ),
};

export const NoBackfill = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={ITEMS} showLabels backfill={false} />
    </Box>
  ),
};

export const FiveItems = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <BottomNavigation items={[...ITEMS, { icon: <FavoriteIcon />, label: 'Favorites' }]} showLabels backfill />
    </Box>
  ),
};

export const Comparison = {
  name: 'Vertical vs Horizontal',
  render: () => (
    <Stack spacing={4} sx={{ maxWidth: 500 }}>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>Vertical (backfill)</Box>
        <BottomNavigation items={ITEMS} showLabels labelOrientation="vertical" backfill />
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>Horizontal (backfill)</Box>
        <BottomNavigation items={ITEMS} showLabels labelOrientation="horizontal" backfill />
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>No backfill</Box>
        <BottomNavigation items={ITEMS} showLabels labelOrientation="vertical" backfill={false} />
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 1 }}>Icons only (backfill)</Box>
        <BottomNavigation items={ITEMS} showLabels={false} backfill />
      </Box>
    </Stack>
  ),
};
