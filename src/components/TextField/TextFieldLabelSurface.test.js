/* The label reads the surface the field sits on — the same surface whose
   Hover fills the field (Figma's Input) and whose Quiet the design system
   solves to clear that Hover. No element of the field pins a surface. */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { TextField } from './TextField';
import { getStaticStyles } from '../_staticStyles';

test('the label sits on the surface the field sits on — no surface of its own', () => {
  const { container } = render(<TextField label="Email address" />);
  expect(container.querySelector('label').closest('[data-surface]')).toBeNull();
});

test('a disabled field pins no surface either', () => {
  const { container } = render(<TextField label="Email" disabled />);
  expect(container.querySelectorAll('[data-surface]')).toHaveLength(0);
});

test('the resting label uses --Quiet (re-resolved per surface), not --Text-Quiet', () => {
  expect(getStaticStyles()).toContain('.omni-tf .MuiInputLabel-root{color:var(--Quiet, var(--Text-Quiet))');
});

test('the MUI path (MUI-only props, loaded on demand) does the same', async () => {
  const { container } = render(<TextField label="Email" slotProps={{}} />);
  await waitFor(() => expect(container.querySelector('label')).not.toBeNull(), { timeout: 4000 });
  expect(container.querySelectorAll('[data-surface]')).toHaveLength(0);
});
