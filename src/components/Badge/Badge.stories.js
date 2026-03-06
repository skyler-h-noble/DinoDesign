// src/components/Badge/Badge.stories.js
import { Badge } from './Badge';
import { Stack, Box } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default {
  title: 'Data Display/Badge',
  component: Badge,
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
    badgeContent: { control: 'text' },
    dot: { control: 'boolean' },
    showZero: { control: 'boolean' },
    invisible: { control: 'boolean' },
  },
};

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Badge badgeContent={4}>
        <MailIcon sx={{ fontSize: 32 }} />
      </Badge>
    </Box>
  ),
};

export const StringContent = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4 }}>
      <Badge badgeContent="NEW">
        <MailIcon sx={{ fontSize: 32 }} />
      </Badge>
      <Badge badgeContent="!" variant="error">
        <NotificationsIcon sx={{ fontSize: 32 }} />
      </Badge>
    </Stack>
  ),
};

export const DotVariant = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4 }}>
      <Badge dot><MailIcon sx={{ fontSize: 32 }} /></Badge>
      <Badge dot variant="error"><NotificationsIcon sx={{ fontSize: 32 }} /></Badge>
      <Badge dot variant="success"><ShoppingCartIcon sx={{ fontSize: 32 }} /></Badge>
    </Stack>
  ),
};

export const MaxValue = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4 }}>
      <Badge badgeContent={99}><MailIcon sx={{ fontSize: 32 }} /></Badge>
      <Badge badgeContent={100}><MailIcon sx={{ fontSize: 32 }} /></Badge>
      <Badge badgeContent={1000} max={999}><MailIcon sx={{ fontSize: 32 }} /></Badge>
    </Stack>
  ),
};

export const ShowZero = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4 }}>
      <Badge badgeContent={0}><MailIcon sx={{ fontSize: 32 }} /></Badge>
      <Badge badgeContent={0} showZero><MailIcon sx={{ fontSize: 32 }} /></Badge>
    </Stack>
  ),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={6} sx={{ p: 4 }}>
      <Badge badgeContent={5} size="small"><MailIcon sx={{ fontSize: 32 }} /></Badge>
      <Badge badgeContent={5} size="medium"><MailIcon sx={{ fontSize: 32 }} /></Badge>
      <Badge badgeContent={5} size="large"><MailIcon sx={{ fontSize: 32 }} /></Badge>
    </Stack>
  ),
};

// ─── Solid — All Colors ─────────────────────────────────────────────────────

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4, flexWrap: 'wrap', gap: 3 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Badge key={c} variant={c} badgeContent={8}>
          <MailIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} />
        </Badge>
      ))}
    </Stack>
  ),
};

// ─── Outline — All Colors ────────────────────────────────────────────────────

export const OutlineColors = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4, flexWrap: 'wrap', gap: 3 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Badge key={c} variant={c + '-outline'} badgeContent={8}>
          <MailIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} />
        </Badge>
      ))}
    </Stack>
  ),
};

// ─── Light — All Colors ──────────────────────────────────────────────────────

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4, flexWrap: 'wrap', gap: 3 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Badge key={c} variant={c + '-light'} badgeContent={8}>
          <MailIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} />
        </Badge>
      ))}
    </Stack>
  ),
};

// ─── Style Comparison ────────────────────────────────────────────────────────

export const StyleComparison = {
  name: 'Side-by-Side: Solid vs Outline vs Light',
  render: () => (
    <Stack direction="row" spacing={6} sx={{ p: 4 }}>
      <Badge variant="primary" badgeContent={3}><MailIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} /></Badge>
      <Badge variant="primary-outline" badgeContent={3}><MailIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} /></Badge>
      <Badge variant="primary-light" badgeContent={3}><MailIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} /></Badge>
    </Stack>
  ),
};
