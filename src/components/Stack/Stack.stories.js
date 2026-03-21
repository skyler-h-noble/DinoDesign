// src/components/Stack/Stack.stories.js
import React from 'react';
import { Box } from '@mui/material';
import { DynoStack, HStack, VStack, WrapStack, CenteredStack, SpaceBetweenStack, ResponsiveStack } from './Stack';

export default { title: 'Layout/Stack', component: DynoStack };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Block = ({ children, height = 40, color = 'var(--Primary-Color-9, #dde)' }) => (
  <Box sx={{
    height, minWidth: 60, px: 2,
    backgroundColor: color,
    border: '1px solid var(--Border)',
    borderRadius: 'var(--Style-Border-Radius)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', color: 'var(--Text)', whiteSpace: 'nowrap',
  }}>
    {children}
  </Box>
);

const SmallBlock = ({ children }) => (
  <Box sx={{
    height: 24, px: 1.5,
    backgroundColor: 'var(--Tags-Info-BG, #dbeafe)',
    border: '1px solid var(--Border)',
    borderRadius: 'var(--Style-Border-Radius)',
    display: 'flex', alignItems: 'center',
    fontSize: '12px', color: 'var(--Text)',
  }}
    data-size="small"
  >
    {children}
  </Box>
);

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <DynoStack gap={2}>
        <Block>Item A</Block>
        <Block>Item B</Block>
        <Block>Item C</Block>
      </DynoStack>
    </Box>
  ),
};

export const Row = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <HStack gap={2}>
        <Block>Left</Block>
        <Block>Center</Block>
        <Block>Right</Block>
      </HStack>
    </Box>
  ),
};

export const SmartGapEnforced = {
  name: 'Smart Gap — Enforced (small children)',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
        gap=&#123;0.5&#125; but small children → raised to var(--min-stack-gap)
      </Box>
      <DynoStack gap={0.5} direction="row" alignItems="center">
        <SmallBlock>Terms</SmallBlock>
        <SmallBlock>Privacy</SmallBlock>
        <SmallBlock>Cookies</SmallBlock>
      </DynoStack>
    </Box>
  ),
};

export const SmartGapDisabled = {
  name: 'Smart Gap — Disabled (enforceMinGap=false)',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
        enforceMinGap=false — gap used exactly as specified
      </Box>
      <DynoStack gap={0.5} direction="row" alignItems="center" enforceMinGap={false}>
        <SmallBlock>Terms</SmallBlock>
        <SmallBlock>Privacy</SmallBlock>
        <SmallBlock>Cookies</SmallBlock>
      </DynoStack>
    </Box>
  ),
};

export const MixedSizes = {
  name: 'Mixed — Normal + Small children',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
        One small child triggers enforcement for the whole stack
      </Box>
      <DynoStack gap={1}>
        <Block height={40}>Normal button</Block>
        <SmallBlock>Small link — triggers min gap</SmallBlock>
        <Block height={40}>Another normal item</Block>
      </DynoStack>
    </Box>
  ),
};

export const RowDirections = {
  name: 'All Directions',
  render: () => (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {['row', 'column', 'row-reverse', 'column-reverse'].map((dir) => (
        <Box key={dir}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{dir}</Box>
          <DynoStack direction={dir} gap={2} alignItems="center">
            <Block>A</Block>
            <Block>B</Block>
            <Block>C</Block>
          </DynoStack>
        </Box>
      ))}
    </Box>
  ),
};

export const Wrap = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 300 }}>
      <WrapStack gap={1}>
        {['React', 'TypeScript', 'MUI', 'Design System', 'Tokens', 'WCAG'].map((t) => (
          <SmallBlock key={t}>{t}</SmallBlock>
        ))}
      </WrapStack>
    </Box>
  ),
};

export const SpaceBetween = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <SpaceBetweenStack>
        <Block>Left</Block>
        <Block>Right</Block>
      </SpaceBetweenStack>
    </Box>
  ),
};

export const Centered = {
  render: () => (
    <Box sx={{ p: 4, height: 200, border: '1px dashed var(--Border)' }}>
      <CenteredStack sx={{ height: '100%' }}>
        <Block>Centered content</Block>
      </CenteredStack>
    </Box>
  ),
};

export const Responsive = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
        column on xs, row on sm+
      </Box>
      <ResponsiveStack gap={2}>
        <Block>First</Block>
        <Block>Second</Block>
        <Block>Third</Block>
      </ResponsiveStack>
    </Box>
  ),
};

export const CustomMinGapToken = {
  name: 'Custom minGapToken',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>
        Uses --my-custom-min-gap token instead of default
      </Box>
      <DynoStack
        direction="row"
        gap={0.5}
        minGapToken="--my-custom-min-gap"
        alignItems="center"
      >
        <SmallBlock>A</SmallBlock>
        <SmallBlock>B</SmallBlock>
        <SmallBlock>C</SmallBlock>
      </DynoStack>
    </Box>
  ),
};
