// src/components/TreeView/TreeView.stories.js
import React, { useState } from 'react';
import { DynoTreeView, DefaultTreeView, SolidTreeView, LightTreeView, DEFAULT_ITEMS } from './TreeView';
import { Box, Stack } from '@mui/material';

export default { title: 'Surfaces/TreeView', component: DynoTreeView };

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

const EXPANDED = ['1', '1-1', '2'];

const FILE_TREE = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.js' },
          { id: 'input',  label: 'Input.js'  },
        ],
      },
      { id: 'app', label: 'App.js' },
      { id: 'index', label: 'index.js' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'index-html', label: 'index.html' },
    ],
  },
  { id: 'package', label: 'package.json' },
];

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 360 }}>
      <DefaultTreeView items={DEFAULT_ITEMS} defaultExpandedItems={EXPANDED} />
    </Box>
  ),
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants = {
  name: 'All Variants (Default / Solid / Light)',
  render: () => (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 360 }}>
      {['default', 'solid', 'light'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</Box>
          <DynoTreeView variant={v} color="primary" items={DEFAULT_ITEMS} defaultExpandedItems={EXPANDED} />
        </Box>
      ))}
    </Stack>
  ),
};

// ─── Solid Colors ─────────────────────────────────────────────────────────────

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 360 }}>
      {COLORS.map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c}</Box>
          <SolidTreeView color={c} items={DEFAULT_ITEMS} defaultExpandedItems={['1']} />
        </Box>
      ))}
    </Stack>
  ),
};

// ─── Light Colors ─────────────────────────────────────────────────────────────

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 360 }}>
      {COLORS.map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c}</Box>
          <LightTreeView color={c} items={DEFAULT_ITEMS} defaultExpandedItems={['1']} />
        </Box>
      ))}
    </Stack>
  ),
};

// ─── Density ──────────────────────────────────────────────────────────────────

export const Density = {
  render: () => (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 360 }}>
      {['compact', 'default'].map((d) => (
        <Box key={d}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {d} ({d === 'compact' ? '24px' : '32px'})
          </Box>
          <DynoTreeView density={d} variant="solid" color="primary" items={DEFAULT_ITEMS} defaultExpandedItems={EXPANDED} />
        </Box>
      ))}
    </Stack>
  ),
};

// ─── Multi Select ─────────────────────────────────────────────────────────────

export const MultiSelect = {
  name: 'Multi-Select',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 360 }}>
      <DynoTreeView
        selectionMode="multi"
        variant="light"
        color="primary"
        items={DEFAULT_ITEMS}
        defaultExpandedItems={EXPANDED}
      />
    </Box>
  ),
};

// ─── Checkbox Selection ───────────────────────────────────────────────────────

export const CheckboxSelection = {
  name: 'Checkbox Selection',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 360 }}>
      <DynoTreeView
        checkboxSelection
        selectionMode="multi"
        variant="solid"
        color="secondary"
        items={DEFAULT_ITEMS}
        defaultExpandedItems={EXPANDED}
      />
    </Box>
  ),
};

// ─── Disable Selection ────────────────────────────────────────────────────────

export const DisableSelection = {
  name: 'Selection Disabled',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 360 }}>
      <DynoTreeView
        disableSelection
        variant="light"
        color="neutral"
        items={DEFAULT_ITEMS}
        defaultExpandedItems={EXPANDED}
      />
    </Box>
  ),
};

// ─── Controlled Expansion ────────────────────────────────────────────────────

export const ControlledExpansion = {
  name: 'Controlled Expansion',
  render: () => {
    const [expanded, setExpanded] = useState(['1']);
    return (
      <Box sx={{ p: 4, maxWidth: 360 }}>
        <Box sx={{ mb: 2, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
          Expanded: [{expanded.join(', ')}]
        </Box>
        <DynoTreeView
          variant="light"
          color="info"
          items={DEFAULT_ITEMS}
          expandedItems={expanded}
          onExpandedItemsChange={(e, ids) => setExpanded(ids)}
        />
      </Box>
    );
  },
};

// ─── Controlled Selection ────────────────────────────────────────────────────

export const ControlledSelection = {
  name: 'Controlled Selection',
  render: () => {
    const [selected, setSelected] = useState(null);
    return (
      <Box sx={{ p: 4, maxWidth: 360 }}>
        <Box sx={{ mb: 2, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
          Selected: {selected || 'none'}
        </Box>
        <DynoTreeView
          variant="solid"
          color="success"
          items={DEFAULT_ITEMS}
          defaultExpandedItems={EXPANDED}
          selectedItems={selected}
          onSelectedItemsChange={(e, id) => setSelected(id)}
        />
      </Box>
    );
  },
};

// ─── File Tree ────────────────────────────────────────────────────────────────

export const FileTree = {
  name: 'File Tree Example',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 360 }}>
      <DynoTreeView
        variant="default"
        density="compact"
        items={FILE_TREE}
        defaultExpandedItems={['src', 'components']}
      />
    </Box>
  ),
};

// ─── Disabled Items ───────────────────────────────────────────────────────────

export const DisabledItems = {
  name: 'With Disabled Items',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 360 }}>
      <DynoTreeView
        variant="solid"
        color="warning"
        items={DEFAULT_ITEMS}
        defaultExpandedItems={EXPANDED}
        disabledItemsFocusable
      />
    </Box>
  ),
};
