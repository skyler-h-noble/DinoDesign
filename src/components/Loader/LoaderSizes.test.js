import React from 'react';
import { render } from '@testing-library/react';
import { cssFor, stateRules } from '../_testCss';
import { Loader } from './Loader';

/* The design's Loader binds its diameter to Component-Size Other/Loader —
   24 / 32 / 56 across small / medium / large. It was mapped to the icon scale
   (16 / 24 / 32) from the set's lone "Size=Large" variant, which names the
   frame, not the size mode it is drawn in (medium: 32). */
/* Figma's Loader: Component-Size Other/Loader, 24 / 32 / 56. */
describe('Loader sizes follow Figma (Other/Loader)', () => {
  const ring = (c) => c.querySelector('.loader-ring');
  test.each([['small', 24], ['medium', 32], ['large', 56]])('%s is %ipx', (name, px) => {
    const { container } = render(<Loader size={name} message="" />);
    // The diameter is a custom property; stateRules follows it to the value.
    const base = stateRules(ring(container)).base;
    expect(base).toContain('width: ' + px + 'px;');
    expect(base).toContain('height: ' + px + 'px;');
  });

  test('a number passes straight through', () => {
    const { container } = render(<Loader size={48} message="" />);
    expect(stateRules(ring(container)).base).toContain('width: 48px;');
  });

  test('a ring with no track: the sweep runs from the palette border into the background', () => {
    const { container } = render(<Loader color="success" message="" />);
    const css = cssFor(ring(container));
    expect(css).toContain('--Buttons-Success-Border');
    expect(css).not.toContain('--Primary-Color-11');
    expect(container.querySelector('svg')).toBeNull();
  });
});
