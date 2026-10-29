// src/components/Icon/Icon.stories.js
import React from 'react';
import { Icon } from './Icon';
import { Box, Stack } from '@mui/material';
import HomeIcon from '@omni-design/icons/Home';
import HomeOutlinedIcon from '@omni-design/icons/HomeOutlined';
import HomeRoundedIcon from '@omni-design/icons/HomeRounded';
import HomeTwoToneIcon from '@omni-design/icons/HomeTwoTone';
import HomeSharpIcon from '@omni-design/icons/HomeSharp';
import FavoriteIcon from '@omni-design/icons/Favorite';
import FavoriteTwoToneIcon from '@omni-design/icons/FavoriteTwoTone';

export default { title: 'Data Display/Icon', component: Icon };

const COLORS = ['default', 'primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error'];

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Icon><HomeIcon /></Icon>
    </Box>
  ),
};

export const AllColors = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={2}>
        {COLORS.map((c) => (
          <Icon key={c} color={c} size="large"><FavoriteIcon /></Icon>
        ))}
      </Stack>
    </Box>
  ),
};

export const AllStyles = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="large"><HomeIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Filled</Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="large"><HomeOutlinedIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Outlined</Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="large"><HomeRoundedIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Rounded</Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="large" twoTone><HomeTwoToneIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Two Tone</Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="large"><HomeSharpIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Sharp</Box>
        </Box>
      </Stack>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="small"><HomeIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Small (20px)</Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="medium"><HomeIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Medium (24px)</Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="large"><HomeIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Large (36px)</Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Icon color="primary" size="custom" fontSize={48}><HomeIcon /></Icon>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5 }}>Custom (48px)</Box>
        </Box>
      </Stack>
    </Box>
  ),
};

export const TwoToneColors = {
  name: 'Two Tone — All Colors',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={2}>
        {COLORS.map((c) => (
          <Icon key={c} color={c} size="large" twoTone><FavoriteTwoToneIcon /></Icon>
        ))}
      </Stack>
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={3}>
        <Icon color="primary" size="large"><HomeIcon /></Icon>
        <Icon color="primary" size="large" disabled><HomeIcon /></Icon>
      </Stack>
    </Box>
  ),
};
