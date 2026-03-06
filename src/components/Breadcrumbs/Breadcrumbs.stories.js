// src/components/Breadcrumbs/Breadcrumbs.stories.js
import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { Box, Stack } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default { title: 'Navigation/Breadcrumbs', component: Breadcrumbs };

const CRUMBS = ['Home', 'Products', 'Electronics', 'Computers', 'Laptops', 'MacBook Pro'];

const renderCrumbs = (items = CRUMBS) =>
  items.map((label, i) => (
    <BreadcrumbItem key={label} href={i < items.length - 1 ? '#' : undefined}>
      {label}
    </BreadcrumbItem>
  ));

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Breadcrumbs>{renderCrumbs()}</Breadcrumbs>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={4} sx={{ p: 4 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s}</Box>
          <Breadcrumbs size={s}>{renderCrumbs()}</Breadcrumbs>
        </Box>
      ))}
    </Stack>
  ),
};

export const Separators = {
  name: 'Custom Separators',
  render: () => (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>Default: /</Box>
        <Breadcrumbs>{renderCrumbs(['Home', 'Products', 'Detail'])}</Breadcrumbs>
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>Angle: {'>'}</Box>
        <Breadcrumbs separator=">">{renderCrumbs(['Home', 'Products', 'Detail'])}</Breadcrumbs>
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>Dash: —</Box>
        <Breadcrumbs separator="—">{renderCrumbs(['Home', 'Products', 'Detail'])}</Breadcrumbs>
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>Arrow: ›</Box>
        <Breadcrumbs separator="›">{renderCrumbs(['Home', 'Products', 'Detail'])}</Breadcrumbs>
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>Icon: NavigateNextIcon</Box>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 'inherit' }} />}>
          {renderCrumbs(['Home', 'Products', 'Detail'])}
        </Breadcrumbs>
      </Box>
    </Stack>
  ),
};

export const Condensed = {
  name: 'Condensed — Collapsed Middle Items',
  render: () => (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>6 crumbs, maxItems=4 (collapsed)</Box>
        <Breadcrumbs condense maxItems={4}>{renderCrumbs()}</Breadcrumbs>
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>3 crumbs, maxItems=4 (not collapsed)</Box>
        <Breadcrumbs condense maxItems={4}>{renderCrumbs(['Home', 'Products', 'Detail'])}</Breadcrumbs>
      </Box>
    </Stack>
  ),
};

export const BackOnlyMobile = {
  name: 'Back Only on Mobile',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 600 }}>
      <Box sx={{ mb: 2, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
        Resize browser to ≤600px to see the "← Parent" back link.
      </Box>
      <Breadcrumbs backOnlyMobile>{renderCrumbs()}</Breadcrumbs>
    </Box>
  ),
};

export const ThreeCrumbs = {
  name: 'Simple — 3 Items',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Breadcrumbs>
        {renderCrumbs(['Home', 'Settings', 'Profile'])}
      </Breadcrumbs>
    </Box>
  ),
};

export const TwoCrumbs = {
  name: 'Minimal — 2 Items',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Breadcrumbs>
        {renderCrumbs(['Dashboard', 'Analytics'])}
      </Breadcrumbs>
    </Box>
  ),
};

export const AllFeatures = {
  name: 'All Features Combined',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 600 }}>
      <Breadcrumbs
        size="large"
        separator="›"
        condense
        maxItems={4}
        backOnlyMobile
      >
        {renderCrumbs()}
      </Breadcrumbs>
    </Box>
  ),
};
