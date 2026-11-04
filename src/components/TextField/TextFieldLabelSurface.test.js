/* The resting label is drawn over the input's Container fill, so it must take
   the Container's colors. It used to read the SECTION's quiet tone (tuned for
   the lighter page): 4.46:1 on #f3f3f3 in a clean-room store. */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { TextField } from './TextField';
import { getStaticStyles } from '../_staticStyles';

test('the label sits inside the field surface', () => {
  const { container } = render(<TextField label="Email address" />);
  const label = container.querySelector('label');
  expect(label.closest('[data-surface]')).toHaveAttribute('data-surface', 'Container');
});

test('a disabled field puts its label on Container-Low', () => {
  const { container } = render(<TextField label="Email" disabled />);
  expect(container.querySelector('label').closest('[data-surface]')).toHaveAttribute('data-surface', 'Container-Low');
});

test('the resting label uses --Quiet (re-resolved per surface), not --Text-Quiet', () => {
  expect(getStaticStyles()).toContain('.omni-tf .MuiInputLabel-root{color:var(--Quiet, var(--Text-Quiet))');
});

test('the MUI path (MUI-only props, loaded on demand) does the same', async () => {
  const { container } = render(<TextField label="Email" slotProps={{}} />);
  await waitFor(() => expect(container.querySelector('label')).not.toBeNull(), { timeout: 4000 });
  expect(container.querySelector('label').closest('[data-surface]')).toHaveAttribute('data-surface', 'Container');
});
