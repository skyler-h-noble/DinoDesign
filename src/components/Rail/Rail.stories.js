// src/components/Rail/Rail.stories.js
import React from 'react';
import { Rail } from './Rail';
import { Box, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

export default { title: 'Navigation/Rail', component: Rail };

const ITEMS = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <InboxIcon />, label: 'Inbox' },
  { icon: <SendIcon />, label: 'Outbox' },
  { icon: <FavoriteIcon />, label: 'Favorites' },
];

const wrap = (children) => (
  <Box sx={{ height: 500, display: 'flex', border: '1px solid var(--Border)', borderRadius: '8px', overflow: 'hidden' }}>
    {children}
    <Box sx={{ flex: 1, p: 3, backgroundColor: 'var(--Surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--Text-Quiet)' }}>
      Content area
    </Box>
  </Box>
);

export const Fixed = {
  render: () => wrap(<Rail items={ITEMS} />),
};

export const ExpandablePartial = {
  name: 'Expandable — Partial Width',
  render: () => wrap(<Rail items={ITEMS} expandable expandedWidth="partial" />),
};

export const ExpandableFull = {
  name: 'Expandable — Full Width',
  render: () => wrap(<Rail items={ITEMS} expandable expandedWidth="full" />),
};

export const WithFabAction = {
  name: 'With FAB Action',
  render: () => wrap(
    <Rail items={ITEMS} expandable
      fabAction={{ icon: <EditIcon />, label: 'Compose', onClick: () => {} }} />
  ),
};

export const WithSections = {
  name: 'With Sections + Divider',
  render: () => wrap(
    <Rail expandable sections={[
      { items: [
        { icon: <HomeIcon />, label: 'Home' },
        { icon: <InboxIcon />, label: 'Inbox' },
        { icon: <SendIcon />, label: 'Outbox', badge: 3 },
        { icon: <FavoriteIcon />, label: 'Favorites' },
      ]},
      { items: [
        { icon: <SettingsIcon />, label: 'Settings' },
        { icon: <PersonIcon />, label: 'Profile' },
        { icon: <DeleteIcon />, label: 'Trash' },
      ]},
    ]} fabAction={{ icon: <EditIcon />, label: 'Compose', onClick: () => {} }} />
  ),
};

export const WithBadges = {
  name: 'With Badges',
  render: () => wrap(
    <Rail items={[
      { icon: <HomeIcon />, label: 'Home' },
      { icon: <InboxIcon />, label: 'Inbox', badge: 5 },
      { icon: <SendIcon />, label: 'Outbox', badge: 3 },
      { icon: <FavoriteIcon />, label: 'Favorites' },
    ]} />
  ),
};
