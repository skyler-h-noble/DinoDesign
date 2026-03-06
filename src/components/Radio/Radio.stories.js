// src/components/Radio/Radio.stories.js
import { Radio, RadioGroup } from './Radio';
import { Stack, Box } from '@mui/material';

export default {
  title: 'Forms/Radio',
  component: Radio,
  argTypes: {
    variant: {
      control: 'select',
      options: [
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

const SAMPLE_OPTIONS = [
  { label: 'Option One', value: 'opt1' },
  { label: 'Option Two', value: 'opt2' },
  { label: 'Option Three', value: 'opt3' },
];

// ─── Single Radio ────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <Radio variant="primary-outline" label="Accept terms" value="accept" />
  ),
};

export const Checked = {
  render: () => (
    <Radio variant="primary-outline" label="Selected option" checked value="selected" />
  ),
};

export const Disabled = {
  render: () => (
    <Stack spacing={2}>
      <Radio variant="primary-outline" label="Disabled unchecked" disabled value="a" />
      <Radio variant="primary-outline" label="Disabled checked" disabled checked value="b" />
    </Stack>
  ),
};

export const NoLabel = {
  render: () => (
    <Radio variant="primary-outline" aria-label="Standalone radio" value="standalone" />
  ),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes = {
  render: () => (
    <Stack spacing={3}>
      <Radio variant="primary-outline" size="small" label="Small (16px circle, 28px touch)" checked value="sm" />
      <Radio variant="primary-outline" size="medium" label="Medium (20px circle, 32px touch)" checked value="md" />
      <Radio variant="primary-outline" size="large" label="Large (24px circle, 40px touch)" checked value="lg" />
    </Stack>
  ),
};

// ─── Outline Variants ────────────────────────────────────────────────────────

export const OutlineColors = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Radio key={c} variant={`${c}-outline`} label={`${c.charAt(0).toUpperCase() + c.slice(1)} Outline`} checked value={c} />
      ))}
    </Stack>
  ),
};

// ─── Light Variants ──────────────────────────────────────────────────────────

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={2}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Radio key={c} variant={`${c}-light`} label={`${c.charAt(0).toUpperCase() + c.slice(1)} Light`} checked value={c} />
      ))}
    </Stack>
  ),
};

// ─── RadioGroup ──────────────────────────────────────────────────────────────

export const GroupVertical = {
  name: 'RadioGroup — Vertical',
  render: () => (
    <RadioGroup
      variant="primary-outline"
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
      variant="primary-outline"
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
          variant="primary-outline"
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

export const GroupOutlineColors = {
  name: 'RadioGroup — Outline Colors',
  render: () => (
    <Stack spacing={4}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <RadioGroup
          key={c}
          variant={`${c}-outline`}
          label={`${c.charAt(0).toUpperCase() + c.slice(1)} Outline`}
          options={SAMPLE_OPTIONS}
          value="opt1"
          onChange={() => {}}
          orientation="horizontal"
        />
      ))}
    </Stack>
  ),
};

export const GroupLightColors = {
  name: 'RadioGroup — Light Colors',
  render: () => (
    <Stack spacing={4}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <RadioGroup
          key={c}
          variant={`${c}-light`}
          label={`${c.charAt(0).toUpperCase() + c.slice(1)} Light`}
          options={SAMPLE_OPTIONS}
          value="opt2"
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
      variant="primary-outline"
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
      variant="primary-outline"
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
      variant="primary-outline"
      aria-label="Invisible group label"
      options={SAMPLE_OPTIONS}
      value="opt3"
      onChange={() => {}}
    />
  ),
};

// ─── Style Comparison ────────────────────────────────────────────────────────

export const StyleComparison = {
  name: 'Side-by-Side: Outline vs Light',
  render: () => (
    <Stack direction="row" spacing={6}>
      <RadioGroup
        variant="primary-outline"
        label="Outline"
        options={SAMPLE_OPTIONS}
        value="opt1"
        onChange={() => {}}
      />
      <RadioGroup
        variant="primary-light"
        label="Light"
        options={SAMPLE_OPTIONS}
        value="opt1"
        onChange={() => {}}
      />
    </Stack>
  ),
};
