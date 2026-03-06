// src/components/Card/Card.stories.js
import React from 'react';
import { Card, CardContent, CardOverflow, CardCover, CardActions } from './Card';
import { Box, Stack } from '@mui/material';

export default { title: 'Surfaces/Card', component: Card };

const SAMPLE_TITLE = 'Card Title';
const SAMPLE_DESC = 'A brief description of the card content with supporting details.';

export const Default = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 320 }}>
      <Card>
        <CardContent>
          <Box sx={{ fontWeight: 700, fontSize: '16px' }}>{SAMPLE_TITLE}</Box>
          <Box sx={{ color: 'var(--Text-Quiet)' }}>{SAMPLE_DESC}</Box>
        </CardContent>
      </Card>
    </Box>
  ),
};

export const Variants = {
  name: 'All Variants (Default / Solid / Light)',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['default', 'solid', 'light'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</Box>
          <Card variant={v} color="primary">
            <CardContent>
              <Box sx={{ fontWeight: 700 }}>{v.charAt(0).toUpperCase() + v.slice(1)} Card</Box>
              <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px' }}>{SAMPLE_DESC}</Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Card key={c} variant="solid" color={c}>
          <CardContent>
            <Box sx={{ fontWeight: 700 }}>{c.charAt(0).toUpperCase() + c.slice(1)}</Box>
            <Box sx={{ fontSize: '13px' }}>{SAMPLE_DESC}</Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Card key={c} variant="light" color={c}>
          <CardContent>
            <Box sx={{ fontWeight: 700 }}>{c.charAt(0).toUpperCase() + c.slice(1)}</Box>
            <Box sx={{ fontSize: '13px' }}>{SAMPLE_DESC}</Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 360 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s}</Box>
          <Card size={s}>
            <CardContent>
              <Box sx={{ fontWeight: 700 }}>{s.charAt(0).toUpperCase() + s.slice(1)} Card</Box>
              <Box sx={{ color: 'var(--Text-Quiet)' }}>{SAMPLE_DESC}</Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Stack>
  ),
};

export const Horizontal = {
  name: 'Horizontal Orientation',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 480 }}>
      <Card orientation="horizontal" variant="light" color="info">
        <CardOverflow>
          <Box sx={{ width: 140, minHeight: 120, backgroundColor: 'var(--Surface-Dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ fontSize: '32px', opacity: 0.4 }}>📷</Box>
          </Box>
        </CardOverflow>
        <CardContent>
          <Box sx={{ fontWeight: 700 }}>Horizontal Card</Box>
          <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px' }}>Image beside text content in a row layout.</Box>
        </CardContent>
      </Card>
    </Box>
  ),
};

export const WithOverflow = {
  name: 'CardOverflow — Bleed to Edges',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 320 }}>
      <Card>
        <CardOverflow>
          <Box sx={{ width: '100%', height: 160, backgroundColor: 'var(--Surface-Dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ fontSize: '48px', opacity: 0.4 }}>📷</Box>
          </Box>
        </CardOverflow>
        <CardContent>
          <Box sx={{ fontWeight: 700 }}>{SAMPLE_TITLE}</Box>
          <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px' }}>{SAMPLE_DESC}</Box>
        </CardContent>
        <CardActions>
          <Box component="button" sx={{ px: 2, py: 0.5, border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)', backgroundColor: 'transparent', color: 'var(--Text)', cursor: 'pointer', fontFamily: 'inherit' }}>
            View
          </Box>
        </CardActions>
      </Card>
    </Box>
  ),
};

export const Clickable = {
  name: 'Clickable Card',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Default clickable (Border-Variant → Border)</Box>
        <Card clickable onClick={() => alert('Clicked!')}>
          <CardContent>
            <Box sx={{ fontWeight: 700 }}>Clickable Default</Box>
            <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px' }}>Border upgrades to var(--Border) when clickable.</Box>
          </CardContent>
        </Card>
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solid clickable</Box>
        <Card variant="solid" color="primary" clickable onClick={() => alert('Clicked!')}>
          <CardContent>
            <Box sx={{ fontWeight: 700 }}>Clickable Solid</Box>
            <Box sx={{ fontSize: '13px' }}>Hover shadow and active scale.</Box>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  ),
};

export const DataAttributes = {
  name: 'data-surface="Container" on All Cards',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 320 }}>
      {['default', 'solid', 'light'].map((v) => (
        <Card key={v} variant={v} color="primary">
          <CardContent>
            <Box sx={{ fontWeight: 700 }}>{v} — data-surface="Container"</Box>
            <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '13px' }}>Inspect DOM to confirm attribute.</Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  ),
};
