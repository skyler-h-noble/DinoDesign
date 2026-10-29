// src/components/Rail/Rail.stories.js
import React from 'react';
import { Rail } from './Rail';
import { Box, Stack } from '@mui/material';
import HomeIcon from '@omni-design/icons/Home';
import InboxIcon from '@omni-design/icons/Inbox';
import SendIcon from '@omni-design/icons/Send';
import FavoriteIcon from '@omni-design/icons/Favorite';
import DeleteIcon from '@omni-design/icons/Delete';
import SettingsIcon from '@omni-design/icons/Settings';
import PersonIcon from '@omni-design/icons/Person';
import EditIcon from '@omni-design/icons/Edit';

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

export const Expandable = {
  name: 'Expandable — 240 (default)',
  render: () => wrap(<Rail items={ITEMS} expandable />),
};

export const ExpandableCustomWidth = {
  name: 'Expandable — your own width',
  render: () => wrap(<Rail items={ITEMS} expandable expandedWidth={300} />),
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
