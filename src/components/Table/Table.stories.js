import React from 'react';
import { Table } from './Table';
import { Stack, Box } from '@mui/material';

export default {
  title: 'Data Display/Table',
  component: Table,
};

const columns = [
  { label: 'Dessert (100g)', field: 'name', width: '40%' },
  { label: 'Calories', field: 'calories', align: 'right' },
  { label: 'Fat (g)', field: 'fat', align: 'right' },
  { label: 'Carbs (g)', field: 'carbs', align: 'right' },
  { label: 'Protein (g)', field: 'protein', align: 'right' },
];
const rows = [
  { name: 'Frozen yoghurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
  { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4.3 },
  { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
  { name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 3.9 },
];
const footer = [
  { name: 'Total (avg)', calories: 264, fat: 10.1, carbs: 40.2, protein: 4.5 },
];

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Table columns={columns} rows={rows} />
    </Box>
  ),
};

export const Variants = {
  name: 'All Variants',
  render: () => (
    <Stack spacing={4} sx={{ p: 4 }}>
      {['default', 'outlined', 'light', 'solid'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>{v}</Box>
          <Table variant={v} color="primary" columns={columns} rows={rows.slice(0, 3)} />
        </Box>
      ))}
    </Stack>
  ),
};

export const AllColors = {
  name: 'Solid Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>{c}</Box>
          <Table variant="solid" color={c} columns={columns} rows={rows.slice(0, 2)} size="small" />
        </Box>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={4} sx={{ p: 4 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontSize: 12, color: 'var(--Text-Quiet)' }}>{s}</Box>
          <Table variant="outlined" color="primary" size={s} columns={columns} rows={rows.slice(0, 3)} />
        </Box>
      ))}
    </Stack>
  ),
};

export const StripedOdd = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Table stripe="odd" columns={columns} rows={rows} />
    </Box>
  ),
};

export const StickyHeader = {
  render: () => (
    <Box sx={{ p: 4, maxHeight: 240, overflow: 'auto' }}>
      <Table stickyHeader columns={columns} rows={[...rows, ...rows]} />
    </Box>
  ),
};

export const WithFooter = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Table variant="light" color="primary" columns={columns} rows={rows} footerRows={footer} />
    </Box>
  ),
};
