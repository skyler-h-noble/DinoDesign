// src/components/Radio/Radio.stories.js
import { Radio, RadioGroup } from './Radio';
import { Stack } from '@mui/material';

export default {
  title: 'Forms/Radio',
  component: Radio,
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
  },
};

const SAMPLE_OPTIONS = [
  { label: 'Option One', value: 'opt1' },
  { label: 'Option Two', value: 'opt2' },
  { label: 'Option Three', value: 'opt3' },
];

const ALL_COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

// ─── Single Radio ────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Radio color="primary" label="Accept terms" value="accept" />
  ),
};

export const Checked = {
  render: () => (
    <Radio color="primary" label="Selected option" checked value="selected" />
  ),
};

export const Disabled = {
  render: () => (
    <Stack spacing={2}>
      <Radio color="primary" label="Disabled unchecked" disabled value="a" />
      <Radio color="primary" label="Disabled checked" disabled checked value="b" />
    </Stack>
  ),
};

export const NoLabel = {
  render: () => (
    <Radio color="primary" aria-label="Standalone radio" value="standalone" />
  ),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes = {
  render: () => (
    <Stack spacing={3}>
      <Radio color="primary" size="small"  label="Small (16×16 ring, 8×8 dot, BodySmall, 4px gap)"  checked value="sm" />
      <Radio color="primary" size="medium" label="Medium (20×20 ring, 9.5×9.5 dot, Body, 8px gap)"  checked value="md" />
      <Radio color="primary" size="large"  label="Large (24×24 ring, 9.5×9.5 dot, BodyLarge, 12px gap)" checked value="lg" />
    </Stack>
  ),
};

// ─── All Colors ──────────────────────────────────────────────────────────────

export const AllColors = {
  name: 'All Colors',
  render: () => (
    <Stack spacing={2}>
      {ALL_COLORS.map((c) => (
        <Radio key={c} color={c} label={`${c.charAt(0).toUpperCase() + c.slice(1)}`} checked value={c} />
      ))}
    </Stack>
  ),
};

// ─── RadioGroup ──────────────────────────────────────────────────────────────

export const GroupVertical = {
  name: 'RadioGroup — Vertical',
  render: () => (
    <RadioGroup
      color="primary"
      label="Select an option"
      options={SAMPLE_OPTIONS}
      value="opt1"
      onChange={() => {}}
    />
  ),
};

export const GroupHorizontal = {
  name: 'RadioGroup — Horizontal',
  render: () => (
    <RadioGroup
      color="primary"
      label="Select an option"
      options={SAMPLE_OPTIONS}
      value="opt2"
      onChange={() => {}}
      orientation="horizontal"
    />
  ),
};

export const GroupSizes = {
  name: 'RadioGroup — Sizes',
  render: () => (
    <Stack spacing={4}>
      {['small', 'medium', 'large'].map((s) => (
        <RadioGroup
          key={s}
          color="primary"
          size={s}
          label={`Size: ${s}`}
          options={SAMPLE_OPTIONS}
          value="opt1"
          onChange={() => {}}
        />
      ))}
    </Stack>
  ),
};

export const GroupAllColors = {
  name: 'RadioGroup — All Colors',
  render: () => (
    <Stack spacing={4}>
      {ALL_COLORS.map((c) => (
        <RadioGroup
          key={c}
          color={c}
          label={`${c.charAt(0).toUpperCase() + c.slice(1)}`}
          options={SAMPLE_OPTIONS}
          value="opt1"
          onChange={() => {}}
          orientation="horizontal"
        />
      ))}
    </Stack>
  ),
};

export const GroupDisabled = {
  name: 'RadioGroup — Disabled',
  render: () => (
    <RadioGroup
      color="primary"
      label="Disabled group"
      options={SAMPLE_OPTIONS}
      value="opt1"
      onChange={() => {}}
      disabled
    />
  ),
};

export const GroupPartialDisabled = {
  name: 'RadioGroup — Partial Disabled',
  render: () => (
    <RadioGroup
      color="primary"
      label="Some options disabled"
      options={[
        { label: 'Available', value: 'a' },
        { label: 'Disabled', value: 'b', disabled: true },
        { label: 'Also available', value: 'c' },
      ]}
      value="a"
      onChange={() => {}}
    />
  ),
};

export const GroupNoLabel = {
  name: 'RadioGroup — No visible label',
  render: () => (
    <RadioGroup
      color="primary"
      aria-label="Invisible group label"
      options={SAMPLE_OPTIONS}
      value="opt3"
      onChange={() => {}}
    />
  ),
};
