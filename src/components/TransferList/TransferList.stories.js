// src/components/TransferList/TransferList.stories.js
import React from 'react';
import { TransferList } from './TransferList';
import { Box } from '@mui/material';

export default { title: 'Inputs/TransferList', component: TransferList };

const LEFT = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
const RIGHT = ['Item 5', 'Item 6'];

export const Basic = {
  render: () => <Box sx={{ p: 4 }}><TransferList defaultLeftItems={LEFT} defaultRightItems={RIGHT} /></Box>,
};

export const Enhanced = {
  render: () => <Box sx={{ p: 4 }}><TransferList mode="enhanced" defaultLeftItems={LEFT} defaultRightItems={RIGHT} /></Box>,
};

export const CustomTitles = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <TransferList mode="enhanced" leftTitle="Source" rightTitle="Destination"
        defaultLeftItems={['Alice', 'Bob', 'Charlie', 'Diana']}
        defaultRightItems={['Eve', 'Frank']} />
    </Box>
  ),
};

export const Disabled = {
  render: () => <Box sx={{ p: 4 }}><TransferList defaultLeftItems={LEFT} defaultRightItems={RIGHT} disabled /></Box>,
};

export const Empty = {
  render: () => <Box sx={{ p: 4 }}><TransferList defaultLeftItems={[]} defaultRightItems={[]} /></Box>,
};

export const ManyItems = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <TransferList mode="enhanced"
        defaultLeftItems={Array.from({ length: 15 }, (_, i) => 'Option ' + (i + 1))}
        defaultRightItems={['Selected A', 'Selected B']} />
    </Box>
  ),
};
