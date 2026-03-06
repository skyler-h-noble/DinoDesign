// src/components/Switch/Switch.stories.js
import { Switch } from './Switch';
import { Stack, Box } from '@mui/material';

export default {
  title: 'Forms/Switch',
  component: Switch,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary', 'secondary', 'tertiary', 'neutral',
        'info', 'success', 'warning', 'error',
        'primary-outline', 'secondary-outline', 'tertiary-outline', 'neutral-outline',
        'info-outline', 'success-outline', 'warning-outline', 'error-outline',
        'primary-light', 'secondary-light', 'tertiary-light', 'neutral-light',
        'info-light', 'success-light', 'warning-light', 'error-light',
      ],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
  },
};

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <Switch defaultChecked label="Notifications" />
    </Box>
  ),
};

export const Unchecked = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <Switch label="Dark mode" />
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Switch defaultChecked disabled label="Checked disabled" />
      <Switch disabled label="Unchecked disabled" />
    </Stack>
  ),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes = {
  render: () => (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Switch size="small" defaultChecked label="Small (10px thumb, 24px min touch target)" />
      <Switch size="medium" defaultChecked label="Medium (15px thumb)" />
      <Switch size="large" defaultChecked label="Large (18px thumb)" />
    </Stack>
  ),
};

// ─── Solid — All Colors ─────────────────────────────────────────────────────

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={2} sx={{ p: 2 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Switch key={c} variant={c} defaultChecked label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </Stack>
  ),
};

// ─── Outline — All Colors ────────────────────────────────────────────────────

export const OutlineColors = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack spacing={2} sx={{ p: 2 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Switch key={c} variant={`${c}-outline`} defaultChecked label={`${c.charAt(0).toUpperCase() + c.slice(1)} Outline`} />
      ))}
    </Stack>
  ),
};

// ─── Light — All Colors ──────────────────────────────────────────────────────

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={2} sx={{ p: 2 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Switch key={c} variant={`${c}-light`} defaultChecked label={`${c.charAt(0).toUpperCase() + c.slice(1)} Light`} />
      ))}
    </Stack>
  ),
};

// ─── Label Placement ─────────────────────────────────────────────────────────

export const LabelPlacement = {
  render: () => (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Switch defaultChecked label="Label End (default)" labelPlacement="end" />
      <Switch defaultChecked label="Label Start" labelPlacement="start" />
      <Switch defaultChecked label="Label Top" labelPlacement="top" />
      <Switch defaultChecked label="Label Bottom" labelPlacement="bottom" />
    </Stack>
  ),
};

// ─── Without Label ───────────────────────────────────────────────────────────

export const WithoutLabel = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 2 }}>
      <Switch defaultChecked aria-label="Toggle on" />
      <Switch aria-label="Toggle off" />
    </Stack>
  ),
};

// ─── Style Comparison ────────────────────────────────────────────────────────

export const StyleComparison = {
  name: 'Side-by-Side: Solid vs Outline vs Light',
  render: () => (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Switch variant="primary" defaultChecked label="Solid" />
      <Switch variant="primary-outline" defaultChecked label="Outline" />
      <Switch variant="primary-light" defaultChecked label="Light" />
    </Stack>
  ),
};

// ─── All Sizes × Styles ─────────────────────────────────────────────────────

export const SizeStyleMatrix = {
  name: 'Size × Style Matrix',
  render: () => (
    <Stack spacing={4} sx={{ p: 2 }}>
      {['solid', 'outline', 'light'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontWeight: 600, textTransform: 'capitalize' }}>{s}</Box>
          <Stack direction="row" spacing={3} alignItems="center">
            {['small', 'medium', 'large'].map((sz) => (
              <Switch
                key={sz}
                variant={s === 'solid' ? 'primary' : 'primary-' + s}
                size={sz}
                defaultChecked
                label={sz}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};
