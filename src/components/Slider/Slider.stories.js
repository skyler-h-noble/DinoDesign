// src/components/Slider/Slider.stories.js
import { Slider } from './Slider';
import { Stack, Box } from '@mui/material';

export default {
  title: 'Forms/Slider',
  component: Slider,
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
    disabled: { control: 'boolean' },
  },
};

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={40} aria-label="Default slider" />
    </Box>
  ),
};

export const WithLabel = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={60} label="Volume" />
    </Box>
  ),
};

export const Disabled = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={30} disabled aria-label="Disabled slider" />
    </Box>
  ),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes = {
  render: () => (
    <Stack spacing={4} sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={40} size="small" label="Small (12px dot, 24px touch)" />
      <Slider defaultValue={50} size="medium" label="Medium (16px dot, 24px touch)" />
      <Slider defaultValue={60} size="large" label="Large (20px dot, 24px touch)" />
    </Stack>
  ),
};

// ─── Primary ─────────────────────────────────────────────────────────────────

export const Primary = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider variant="primary" defaultValue={50} label="Primary" valueLabelDisplay="on" />
    </Box>
  ),
};

// ─── Light — All Colors ──────────────────────────────────────────────────────

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ width: 300, p: 2 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Slider key={c} variant={`${c}-light`} defaultValue={50} label={`${c.charAt(0).toUpperCase() + c.slice(1)} Light`} />
      ))}
    </Stack>
  ),
};

// ─── Value Label Display ─────────────────────────────────────────────────────

export const ValueLabelOff = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={40} valueLabelDisplay="off" label="Label Off" />
    </Box>
  ),
};

export const ValueLabelOn = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={40} valueLabelDisplay="on" label="Label On (always)" />
    </Box>
  ),
};

export const ValueLabelAuto = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={40} valueLabelDisplay="auto" label="Label Auto (hover/focus)" />
    </Box>
  ),
};

// ─── Range Slider ────────────────────────────────────────────────────────────

export const RangeSlider = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider
        defaultValue={[25, 75]}
        valueLabelDisplay="auto"
        label="Price Range"
        getAriaLabel={(i) => i === 0 ? 'Min price' : 'Max price'}
      />
    </Box>
  ),
};

export const RangeLight = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider
        variant="success-light"
        defaultValue={[30, 80]}
        valueLabelDisplay="on"
        label="Light Range"
        getAriaLabel={(i) => i === 0 ? 'Min' : 'Max'}
      />
    </Box>
  ),
};

// ─── Orientation ─────────────────────────────────────────────────────────────

export const Vertical = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ height: 200, p: 2 }}>
      <Slider orientation="vertical" defaultValue={40} aria-label="Vertical primary" />
      <Slider orientation="vertical" variant="secondary-light" defaultValue={60} aria-label="Vertical light" />
      <Slider orientation="vertical" variant="success-light" defaultValue={80} aria-label="Vertical light 2" />
    </Stack>
  ),
};

// ─── Track ───────────────────────────────────────────────────────────────────

export const InvertedTrack = {
  render: () => (
    <Stack spacing={3} sx={{ width: 300, p: 2 }}>
      <Slider defaultValue={40} track="normal" label="Standard Track" />
      <Slider defaultValue={40} track="inverted" label="Inverted Track" />
    </Stack>
  ),
};

// ─── Marks & Steps ───────────────────────────────────────────────────────────

export const WithMarks = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider
        defaultValue={20}
        step={10}
        marks
        min={0}
        max={100}
        valueLabelDisplay="auto"
        label="With Marks (step 10)"
      />
    </Box>
  ),
};

export const CustomMarks = {
  render: () => (
    <Box sx={{ width: 300, p: 2 }}>
      <Slider
        defaultValue={37}
        marks={[
          { value: 0, label: '0°C' },
          { value: 20, label: '20°C' },
          { value: 37, label: '37°C' },
          { value: 100, label: '100°C' },
        ]}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        label="Temperature"
      />
    </Box>
  ),
};

// ─── Style Comparison ────────────────────────────────────────────────────────

export const StyleComparison = {
  name: 'Side-by-Side: Primary vs Light',
  render: () => (
    <Stack spacing={4} sx={{ width: 300, p: 2 }}>
      <Slider variant="primary" defaultValue={50} label="Primary" valueLabelDisplay="on" />
      <Slider variant="primary-light" defaultValue={50} label="Light" valueLabelDisplay="on" />
    </Stack>
  ),
};
