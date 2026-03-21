// src/components/Tag/Tag.stories.js
import React from 'react';
import { Box, Stack } from '@mui/material';
import {
  Tag, TAG_COLORS,
  PrimaryTag, SecondaryTag, TertiaryTag, NeutralTag,
  InfoTag, SuccessTag, WarningTag, ErrorTag, BlackTag, WhiteTag,
} from './Tag';

export default { title: 'Data Display/Tag', component: Tag };

// ─── All Colors ───────────────────────────────────────────────────────────────

export const AllColors = {
  name: 'All Colors',
  render: () => (
    <Box sx={{ p: 4, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
      {TAG_COLORS.map((color) => (
        <Tag key={color} color={color}>{color.toUpperCase()}</Tag>
      ))}
    </Box>
  ),
};

// ─── Individual ───────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Tag>NEW</Tag>
    </Box>
  ),
};

export const Primary = {
  render: () => <Box sx={{ p: 4 }}><PrimaryTag>PRIMARY</PrimaryTag></Box>,
};
export const Secondary = {
  render: () => <Box sx={{ p: 4 }}><SecondaryTag>SECONDARY</SecondaryTag></Box>,
};
export const Tertiary = {
  render: () => <Box sx={{ p: 4 }}><TertiaryTag>TERTIARY</TertiaryTag></Box>,
};
export const Neutral = {
  render: () => <Box sx={{ p: 4 }}><NeutralTag>NEUTRAL</NeutralTag></Box>,
};
export const Info = {
  render: () => <Box sx={{ p: 4 }}><InfoTag>INFO</InfoTag></Box>,
};
export const Success = {
  render: () => <Box sx={{ p: 4 }}><SuccessTag>SUCCESS</SuccessTag></Box>,
};
export const Warning = {
  render: () => <Box sx={{ p: 4 }}><WarningTag>WARNING</WarningTag></Box>,
};
export const Error = {
  render: () => <Box sx={{ p: 4 }}><ErrorTag>ERROR</ErrorTag></Box>,
};
export const Black = {
  render: () => <Box sx={{ p: 4 }}><BlackTag>BLACK</BlackTag></Box>,
};
export const White = {
  render: () => (
    <Box sx={{ p: 4, backgroundColor: '#555' }}>
      <WhiteTag>WHITE</WhiteTag>
    </Box>
  ),
};

// ─── Label presets ────────────────────────────────────────────────────────────

export const LabelPresets = {
  name: 'Common Labels',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
        <Tag color="success">LIVE</Tag>
        <Tag color="info">BETA</Tag>
        <Tag color="primary">NEW</Tag>
        <Tag color="warning">DRAFT</Tag>
        <Tag color="error">DEPRECATED</Tag>
        <Tag color="neutral">ARCHIVED</Tag>
        <Tag color="tertiary">v2.0</Tag>
        <Tag color="secondary">PRO</Tag>
      </Stack>
    </Box>
  ),
};

// ─── Inline with text ─────────────────────────────────────────────────────────

export const InlineWithText = {
  name: 'Inline with Text',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400, fontFamily: 'inherit' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontSize: '16px', color: 'var(--Text)' }}>
        <span>Design Tokens</span>
        <Tag color="primary">NEW</Tag>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontSize: '16px', color: 'var(--Text)' }}>
        <span>Component Library</span>
        <Tag color="success">STABLE</Tag>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '16px', color: 'var(--Text)' }}>
        <span>AI Integration</span>
        <Tag color="info">BETA</Tag>
      </Box>
    </Box>
  ),
};

// ─── On different backgrounds ─────────────────────────────────────────────────

export const OnSurfaces = {
  name: 'On Different Surfaces',
  render: () => (
    <Stack spacing={2} sx={{ p: 4, maxWidth: 400 }}>
      {[
        { surface: 'var(--Background)', label: 'Background' },
        { surface: 'var(--Surface)',    label: 'Surface' },
        { surface: 'var(--Surface-Dim)', label: 'Surface-Dim' },
      ].map(({ surface, label }) => (
        <Box key={label} sx={{ p: 2, backgroundColor: surface, borderRadius: '8px', border: '1px solid var(--Border)' }}>
          <Box sx={{ fontSize: '11px', color: 'var(--Text-Quiet)', mb: 1, fontFamily: 'monospace' }}>
            {label}
          </Box>
          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
            {['primary', 'success', 'warning', 'error', 'info'].map((c) => (
              <Tag key={c} color={c}>{c.toUpperCase()}</Tag>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};
