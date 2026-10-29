// src/components/List/List.stories.js
import React, { useState } from 'react';
import { List, ListItem } from './List';
import { Stack, Box, Avatar } from '@mui/material';
import HomeIcon from '@omni-design/icons/Home';
import InboxIcon from '@omni-design/icons/Inbox';
import SettingsIcon from '@omni-design/icons/Settings';
import FolderIcon from '@omni-design/icons/Folder';
import ChevronRightIcon from '@omni-design/icons/ChevronRight';
import DeleteIcon from '@omni-design/icons/Delete';
import StarIcon from '@omni-design/icons/Star';

export default { title: 'Data Display/List', component: List };

const basicItems = [
  { label: 'Home' }, { label: 'Inbox' }, { label: 'Projects' }, { label: 'Settings' },
];

export const Default = {
  render: () => <Box sx={{ p: 4, maxWidth: 320 }}><List items={basicItems} /></Box>,
};

export const Variants = {
  name: 'All Variants (Default / Solid / Light)',
  render: () => (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 320 }}>
      {['default', 'solid', 'light'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>{v}</Box>
          <List variant={v} color="primary" items={basicItems} />
        </Box>
      ))}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid All Colors (data-theme)',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>{c}</Box>
          <List variant="solid" color={c} size="small" items={basicItems.slice(0, 3)} />
        </Box>
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: 'Light All Colors (data-theme)',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>{c}</Box>
          <List variant="light" color={c} size="small" items={basicItems.slice(0, 3)} />
        </Box>
      ))}
    </Stack>
  ),
};

export const Clickable = {
  name: 'Clickable Items with Hover/Active/Focus',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 320 }}>
      <List variant="light" color="primary" clickable dividers items={[
        { label: 'Home', startDecorator: <HomeIcon /> },
        { label: 'Inbox', startDecorator: <InboxIcon /> },
        { label: 'Settings', startDecorator: <SettingsIcon />, endDecorator: <ChevronRightIcon /> },
      ]} />
    </Box>
  ),
};

export const CheckboxSelection = {
  name: 'Checkbox Selection',
  render: () => {
    const [sel, setSel] = useState([0, 2]);
    return (
      <Box sx={{ p: 4, maxWidth: 320 }}>
        <List variant="solid" color="primary" selectionMode="checkbox" dividers
          selectedIndices={sel} onSelectionChange={setSel} items={basicItems} />
        <Box sx={{ mt: 2, fontSize: 12 }}>Selected: {JSON.stringify(sel)}</Box>
      </Box>
    );
  },
};

export const RadioSelection = {
  name: 'Radio Selection',
  render: () => {
    const [sel, setSel] = useState([1]);
    return (
      <Box sx={{ p: 4, maxWidth: 320 }}>
        <List variant="light" color="info" selectionMode="radio"
          selectedIndices={sel} onSelectionChange={setSel} items={basicItems} />
        <Box sx={{ mt: 2, fontSize: 12 }}>Selected: {JSON.stringify(sel)}</Box>
      </Box>
    );
  },
};

export const IconButtons = {
  name: 'Clickable Icon Button Decorators',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 360 }}>
      <List variant="light" color="neutral" dividers clickable items={[
        { label: 'Doc A', startDecorator: <StarIcon />, startDecoratorIsButton: true,
          startDecoratorAriaLabel: 'Star', endDecorator: <DeleteIcon />,
          endDecoratorIsButton: true, endDecoratorAriaLabel: 'Delete' },
        { label: 'Doc B', startDecorator: <StarIcon />, startDecoratorIsButton: true,
          startDecoratorAriaLabel: 'Star', endDecorator: <DeleteIcon />,
          endDecoratorIsButton: true, endDecoratorAriaLabel: 'Delete' },
      ]} />
    </Box>
  ),
};
