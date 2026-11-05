/**
 * Passing `sx` must not change how a Button is painted. With sx the Button
 * renders through an MUI Box (loaded on demand) instead of a plain tag; the
 * static classes, the bevel variables and the --_bevel derivation have to be
 * the same either way — sx only adds its own override on top.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Button } from './Button';
import { declared } from '../_testCss';

const paint = (el) => ({
  classes: el.className.split(/\s+/).filter((c) => c.startsWith('omni-btn') || c.startsWith('btn-')).sort(),
  vars: ['--_b-sh', '--_b-sh-h', '--_b-sh-a', '--_b-bg', '--_b-bd'].map((p) => el.style.getPropertyValue(p)),
  bevel: declared(el, '--_bevel'),
  shadow: declared(el, 'box-shadow'),
  radius: declared(el, 'border-radius'),
});

describe('Button with and without sx: the same bevel', () => {
  test.each(['default', 'secondary', 'primary-outline'])('%s', async (variant) => {
    render(
      <>
        <Button variant={variant}>Plain</Button>
        <Button variant={variant} sx={{ minHeight: '32px' }}>Sx</Button>
      </>
    );
    // The sx path swaps in its MUI box once loaded; compare after that.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sx' }).className).toMatch(/MuiBox-root/));
    const plain = paint(screen.getByRole('button', { name: 'Plain' }));
    const sx = paint(screen.getByRole('button', { name: 'Sx' }));
    expect(sx).toEqual(plain);
    expect(plain.bevel).toMatch(/--Button-Bevel/);
    expect(plain.shadow).toBe('var(--_b-sh)');
    if (!variant.endsWith('-outline')) expect(plain.vars[0]).toMatch(/inset/);
  });
});
