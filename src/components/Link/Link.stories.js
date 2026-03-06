// src/components/Link/Link.stories.js
import React from 'react';
import { Link } from './Link';
import { Box, Stack } from '@mui/material';

export default { title: 'Navigation/Link', component: Link };

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Link href="#">Default link</Link>
    </Box>
  ),
};

export const AllStyles = {
  name: 'All Typography Styles',
  render: () => (
    <Stack spacing={2} sx={{ p: 4 }}>
      {[
        ['body', 'Body'],
        ['body-small', 'Body Small'],
        ['body-large', 'Body Large'],
        ['body-semibold', 'Body Semibold'],
        ['body-bold', 'Body Bold'],
        ['button', 'Button'],
        ['label', 'Label'],
        ['caption', 'Caption'],
      ].map(([style, label]) => (
        <Box key={style} sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <Box sx={{ width: 120, fontSize: '12px', color: 'var(--Text-Quiet)', flexShrink: 0 }}>{label}</Box>
          <Link href="#" textStyle={style}>Example link text</Link>
        </Box>
      ))}
    </Stack>
  ),
};

export const Colors = {
  name: 'Colors — Primary / Standard / Quiet',
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 0.5 }}>Primary — var(--Link)</Box>
        <Link href="#" color="primary">Primary link color</Link>
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 0.5 }}>Standard — var(--Text)</Box>
        <Link href="#" color="standard">Standard link color (blends with body text)</Link>
      </Box>
      <Box>
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 0.5 }}>Quiet — var(--Text-Quiet)</Box>
        <Link href="#" color="quiet">Quiet link color (subdued)</Link>
      </Box>
    </Stack>
  ),
};

export const InlineUsage = {
  name: 'Inline Within Text',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 480 }}>
      <Box sx={{ fontSize: 'var(--Body-Font-Size)', fontFamily: 'var(--Body-Font-Family)', color: 'var(--Text)', lineHeight: 1.6 }}>
        Typography is the art and technique of arranging type to make written language{' '}
        <Link href="#">legible, readable, and appealing</Link>{' '}
        when displayed. The arrangement involves selecting{' '}
        <Link href="#" textStyle="body-bold">typefaces</Link>,{' '}
        point sizes, line lengths, and letter-spacing. Read the{' '}
        <Link href="#" target="_blank">full article</Link>{' '}
        for more details.
      </Box>
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Link href="#">Enabled link</Link>
      <Link href="#" disabled>Disabled link</Link>
    </Stack>
  ),
};

export const ExternalLink = {
  name: 'External Link — target="_blank"',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Link href="https://example.com" target="_blank">
        Opens in new tab (rel auto-added)
      </Link>
    </Box>
  ),
};

export const BodyVariants = {
  name: 'Body Size × Color Matrix',
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      {['body-small', 'body', 'body-large'].map((s) => (
        <Stack key={s} direction="row" spacing={3}>
          {['primary', 'standard', 'quiet'].map((c) => (
            <Link key={c} href="#" textStyle={s} color={c}>
              {s} / {c}
            </Link>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const AlwaysUnderlined = {
  name: 'Always Underlined — No Option to Remove',
  render: () => (
    <Box sx={{ p: 4 }}>
      <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mb: 2 }}>
        Unlike MUI Joy Link, this component has NO underline prop. Links are always underlined for WCAG 1.4.1 compliance.
      </Box>
      <Stack spacing={2}>
        <Link href="#">Default state — underlined</Link>
        <Link href="#" textStyle="body-bold" color="standard">Bold standard — underlined</Link>
        <Link href="#" textStyle="caption" color="quiet">Caption quiet — underlined</Link>
      </Stack>
    </Box>
  ),
};
