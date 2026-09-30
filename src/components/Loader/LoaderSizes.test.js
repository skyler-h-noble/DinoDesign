import React from 'react';
import { render } from '@testing-library/react';
import { Loader } from './Loader';

/* The design's Loader is 32px at Large — the ICON scale, not CircularProgress's
   own 24/40/56. These pin the mapping, because "large" meaning 56 elsewhere in
   the lib makes 32 look like a mistake rather than a decision. */
describe('Loader sizes follow the icon scale', () => {
  test.each([['small', 16], ['medium', 24], ['large', 32]])('%s is %ipx', (name, px) => {
    const { container } = render(<Loader size={name} message="" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', String(px));
    expect(svg).toHaveAttribute('height', String(px));
  });

  test('a number passes straight through', () => {
    const { container } = render(<Loader size={48} message="" />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '48');
  });

  test('colour comes from a token, never a raw tone', () => {
    const { container } = render(<Loader color="success" message="" />);
    expect(container.innerHTML).toContain('--Buttons-Success-Border');
    expect(container.innerHTML).not.toContain('--Primary-Color-11');
  });
});
