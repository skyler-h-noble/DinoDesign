import React from 'react';
import { render } from '@testing-library/react';
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
    const cs = getComputedStyle(ring(container));
    expect(cs.width).toBe(px + 'px');
    expect(cs.height).toBe(px + 'px');
  });

  test('a number passes straight through', () => {
    const { container } = render(<Loader size={48} message="" />);
    expect(getComputedStyle(ring(container)).width).toBe('48px');
  });

  test('a ring with no track: the sweep runs from the palette border into the background', () => {
    const { container } = render(<Loader color="success" message="" />);
    const css = Array.from(document.styleSheets).flatMap((sh) => Array.from(sh.cssRules).map((r) => r.cssText)).join('\n');
    expect(css).toContain('--Buttons-Success-Border');
    expect(css).not.toContain('--Primary-Color-11');
    expect(container.querySelector('svg')).toBeNull();
  });
});
