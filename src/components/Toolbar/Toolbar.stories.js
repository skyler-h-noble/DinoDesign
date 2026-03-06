// src/components/Toolbar/Toolbar.stories.js
import React from 'react';
import { Toolbar } from './Toolbar';
import { Box, Stack } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default { title: 'Navigation/Toolbar', component: Toolbar };

const DRAW_ITEMS = [
  { icon: <UndoIcon />, label: 'Undo' },
  { icon: <RedoIcon />, label: 'Redo' },
  { icon: <AddIcon />, label: 'Add' },
  { icon: <TextFieldsIcon />, label: 'Text' },
  { icon: <MoreVertIcon />, label: 'More' },
];

const FORMAT_ITEMS = [
  { icon: <FormatBoldIcon />, label: 'Bold' },
  { icon: <FormatItalicIcon />, label: 'Italic' },
  { icon: <FormatUnderlinedIcon />, label: 'Underline' },
];

export const Horizontal = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Toolbar items={DRAW_ITEMS} defaultValue={2} />
    </Box>
  ),
};

export const Vertical = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Toolbar items={DRAW_ITEMS} orientation="vertical" defaultValue={0} />
    </Box>
  ),
};

export const WithFab = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Toolbar items={FORMAT_ITEMS} defaultValue={0}
        fab={{ icon: <AddIcon />, label: 'Add' }} />
    </Box>
  ),
};

export const BasicMode = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Toolbar mode="basic"
        basicLeft={{ label: 'Back', icon: <ArrowBackIcon /> }}
        basicRight={{ label: 'Next', icon: <ArrowForwardIcon /> }} />
    </Box>
  ),
};

export const AllBarColors = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      {['default', 'primary', 'primary-light', 'primary-medium', 'primary-dark', 'white', 'black'].map((bc) => (
        <Box key={bc}>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mb: 1, textTransform: 'uppercase' }}>{bc}</Box>
          <Toolbar items={FORMAT_ITEMS} barColor={bc} defaultValue={0} />
        </Box>
      ))}
    </Stack>
  ),
};

export const VerticalDrawingTools = {
  name: 'Vertical — Drawing Tools',
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 4 }}>
      <Toolbar items={DRAW_ITEMS} orientation="vertical" defaultValue={2} />
      <Toolbar items={FORMAT_ITEMS} defaultValue={0}
        fab={{ icon: <AddIcon />, label: 'Add' }} barColor="primary-light" />
    </Box>
  ),
};
