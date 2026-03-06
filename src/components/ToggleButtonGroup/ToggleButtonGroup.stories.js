// src/components/ToggleButtonGroup/ToggleButtonGroup.stories.js
import { ToggleButtonGroup, ToggleButton } from './ToggleButtonGroup';
import { Stack, Box } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

export default {
  title: 'Forms/ToggleButtonGroup',
  component: ToggleButtonGroup,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'primary-light', 'secondary-light', 'tertiary-light', 'neutral-light',
        'info-light', 'success-light', 'warning-light', 'error-light',
      ],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    exclusive: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <ToggleButtonGroup value="left" exclusive aria-label="text alignment">
        <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
        <ToggleButton value="justify"><FormatAlignJustifyIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  ),
};

export const WithText = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <ToggleButtonGroup value="web" exclusive aria-label="platform">
        <ToggleButton value="web">Web</ToggleButton>
        <ToggleButton value="android">Android</ToggleButton>
        <ToggleButton value="ios">iOS</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <ToggleButtonGroup value="left" exclusive disabled aria-label="disabled">
        <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  ),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 2 }}>
      {['small', 'medium', 'large'].map((s) => (
        <ToggleButtonGroup key={s} value="left" exclusive size={s} aria-label={s}>
          <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
          <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
          <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
        </ToggleButtonGroup>
      ))}
    </Stack>
  ),
};

// ─── Primary ─────────────────────────────────────────────────────────────────

export const Primary = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <ToggleButtonGroup variant="primary" value="center" exclusive aria-label="alignment">
        <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  ),
};

// ─── Light — All Colors ──────────────────────────────────────────────────────

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 2 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Stack key={c} spacing={1}>
          <Box sx={{ fontSize: '13px', color: 'var(--Text-Quiet)', textTransform: 'capitalize' }}>{c}</Box>
          <ToggleButtonGroup variant={c + '-light'} value="bold" exclusive aria-label={c + ' light'}>
            <ToggleButton value="bold"><FormatBoldIcon /></ToggleButton>
            <ToggleButton value="italic"><FormatItalicIcon /></ToggleButton>
            <ToggleButton value="underline"><FormatUnderlinedIcon /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      ))}
    </Stack>
  ),
};

// ─── Multiple Selection ──────────────────────────────────────────────────────

export const MultipleSelection = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <ToggleButtonGroup value={['bold', 'italic']} aria-label="formatting">
        <ToggleButton value="bold"><FormatBoldIcon /></ToggleButton>
        <ToggleButton value="italic"><FormatItalicIcon /></ToggleButton>
        <ToggleButton value="underline"><FormatUnderlinedIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  ),
};

// ─── Vertical ────────────────────────────────────────────────────────────────

export const Vertical = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 2 }}>
      <ToggleButtonGroup value="left" exclusive orientation="vertical" aria-label="vertical primary">
        <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup variant="info-light" value="left" exclusive orientation="vertical" aria-label="vertical light">
        <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  ),
};

// ─── Full Width ──────────────────────────────────────────────────────────────

export const FullWidth = {
  render: () => (
    <Box sx={{ width: 400, p: 2 }}>
      <ToggleButtonGroup value="web" exclusive fullWidth aria-label="platform">
        <ToggleButton value="web">Web</ToggleButton>
        <ToggleButton value="android">Android</ToggleButton>
        <ToggleButton value="ios">iOS</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  ),
};

// ─── Style Comparison ────────────────────────────────────────────────────────

export const StyleComparison = {
  name: 'Side-by-Side: Primary vs Light',
  render: () => (
    <Stack spacing={3} sx={{ p: 2 }}>
      <ToggleButtonGroup variant="primary" value="center" exclusive aria-label="primary">
        <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup variant="primary-light" value="center" exclusive aria-label="light">
        <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  ),
};
