// src/components/SpeedDial/SpeedDial.stories.js
import React from 'react';
import { SpeedDial } from './SpeedDial';
import { Box, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default { title: 'Navigation/SpeedDial', component: SpeedDial };

const ACTIONS = [
  { icon: <EditIcon sx={{ fontSize: 'inherit' }} />, name: 'Edit' },
  { icon: <ShareIcon sx={{ fontSize: 'inherit' }} />, name: 'Share' },
  { icon: <DeleteIcon sx={{ fontSize: 'inherit' }} />, name: 'Delete' },
  { icon: <PrintIcon sx={{ fontSize: 'inherit' }} />, name: 'Print' },
];

export const Default = {
  render: () => (
    <Box sx={{ p: 4, height: 400, position: 'relative' }}>
      <Box sx={{ position: 'absolute', bottom: 24, right: 24 }}>
        <SpeedDial actions={ACTIONS} ariaLabel="Speed Dial" />
      </Box>
    </Box>
  ),
};

export const Variants = {
  render: () => (
    <Box sx={{ p: 4, height: 400, position: 'relative' }}>
      <Box sx={{ position: 'absolute', bottom: 24, left: 24 }}>
        <SpeedDial variant="solid" color="primary" actions={ACTIONS} ariaLabel="Solid" />
      </Box>
      <Box sx={{ position: 'absolute', bottom: 24, right: 24 }}>
        <SpeedDial variant="light" color="primary" actions={ACTIONS} ariaLabel="Light" />
      </Box>
    </Box>
  ),
};

export const AllDirections = {
  render: () => (
    <Box sx={{ p: 4, height: 500, position: 'relative' }}>
      <Box sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)' }}>
        <SpeedDial direction="up" actions={ACTIONS} ariaLabel="Up" />
      </Box>
      <Box sx={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)' }}>
        <SpeedDial direction="down" actions={ACTIONS} ariaLabel="Down" />
      </Box>
      <Box sx={{ position: 'absolute', top: '50%', right: 24, transform: 'translateY(-50%)' }}>
        <SpeedDial direction="left" actions={ACTIONS} ariaLabel="Left" />
      </Box>
      <Box sx={{ position: 'absolute', top: '50%', left: 24, transform: 'translateY(-50%)' }}>
        <SpeedDial direction="right" actions={ACTIONS} ariaLabel="Right" />
      </Box>
    </Box>
  ),
};

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

export const AllColors = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={4} flexWrap="wrap" sx={{ gap: 4 }}>
        {COLORS.map((c) => (
          <Box key={c} sx={{ height: 320, position: 'relative', width: 80 }}>
            <Box sx={{ position: 'absolute', bottom: 0 }}>
              <SpeedDial variant="solid" color={c} actions={ACTIONS.slice(0, 3)} ariaLabel={c} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  ),
};

export const NoTooltips = {
  render: () => (
    <Box sx={{ p: 4, height: 400, position: 'relative' }}>
      <Box sx={{ position: 'absolute', bottom: 24, right: 24 }}>
        <SpeedDial actions={ACTIONS} showTooltips={false} ariaLabel="No Tooltips" />
      </Box>
    </Box>
  ),
};

export const SixActions = {
  render: () => (
    <Box sx={{ p: 4, height: 500, position: 'relative' }}>
      <Box sx={{ position: 'absolute', bottom: 24, right: 24 }}>
        <SpeedDial actions={[
          ...ACTIONS,
          { icon: <SaveIcon sx={{ fontSize: 'inherit' }} />, name: 'Save' },
          { icon: <FavoriteIcon sx={{ fontSize: 'inherit' }} />, name: 'Favorite' },
        ]} ariaLabel="Six Actions" />
      </Box>
    </Box>
  ),
};
