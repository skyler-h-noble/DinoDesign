// src/components/Chip/Chip.stories.js
import { Chip } from './Chip';
import { Stack, Box, Avatar } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';

export default {
  title: 'Data Display/Chip',
  component: Chip,
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
    label: { control: 'text' },
    clickable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
};

export const Default = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Chip label="Chip" />
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center" sx={{ p: 4 }}>
      <Chip label="Small" size="small" />
      <Chip label="Medium" size="medium" />
      <Chip label="Large" size="large" />
    </Stack>
  ),
};

export const SolidColors = {
  name: "Solid - All Colors",
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4, flexWrap: "wrap", gap: 2 }}>
      {["primary", "secondary", "tertiary", "neutral", "info", "success", "warning", "error"].map((c) => (
        <Chip key={c} variant={c} label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </Stack>
  ),
};

export const OutlineColors = {
  name: "Outline - All Colors",
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4, flexWrap: "wrap", gap: 2 }}>
      {["primary", "secondary", "tertiary", "neutral", "info", "success", "warning", "error"].map((c) => (
        <Chip key={c} variant={c + "-outline"} label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: "Light - All Colors",
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4, flexWrap: "wrap", gap: 2 }}>
      {["primary", "secondary", "tertiary", "neutral", "info", "success", "warning", "error"].map((c) => (
        <Chip key={c} variant={c + "-light"} label={c.charAt(0).toUpperCase() + c.slice(1)} />
      ))}
    </Stack>
  ),
};

export const StyleComparison = {
  name: "Side-by-Side: Solid vs Outline vs Light",
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 4 }}>
      <Chip variant="info" label="Solid" />
      <Chip variant="info-outline" label="Outline" />
      <Chip variant="info-light" label="Light" />
    </Stack>
  ),
};

export const Deletable = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Chip label="Delete Me" onDelete={() => {}} />
      <Chip label="Delete Me" variant="error" onDelete={() => {}} />
    </Stack>
  ),
};

export const WithDecorators = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Chip label="With Icon" startDecorator={<FaceIcon />} />
      <Chip label="Check" endDecorator={<CheckIcon />} variant="success" />
      <Chip label="Both" startDecorator={<StarIcon />} endDecorator={<CheckIcon />} variant="info-light" />
    </Stack>
  ),
};

export const WithAvatar = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Chip label="Jane" startDecorator={<Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>J</Avatar>} />
      <Chip label="Deletable" startDecorator={<Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>D</Avatar>} onDelete={() => {}} />
    </Stack>
  ),
};
