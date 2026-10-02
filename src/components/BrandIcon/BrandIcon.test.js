import React from 'react';
import { render } from '@testing-library/react';
import { BrandIcon } from './BrandIcon';

/* The names are the CONTRACT with Figma. Brand-Icons there (9155:26699) is
   Font Awesome 6 Brands as a ligature font, so its text layer holds exactly
   these strings — lowercase and hyphenated. If this mapping drifts, a design
   says "x-twitter" and the code renders nothing, silently. */
describe('BrandIcon resolves the names Figma uses', () => {
  test.each(['github', 'linkedin', 'instagram', 'dribbble', 'x-twitter', 'figma'])(
    '%s draws a path', (name) => {
      const { container } = render(<BrandIcon name={name} />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path.getAttribute('d').length).toBeGreaterThan(20);
    });

  test('an unknown name renders nothing rather than a broken glyph', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<BrandIcon name="not-a-brand" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  test('decorative by default, named when given a title', () => {
    const { container, rerender } = render(<BrandIcon name="github" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    rerender(<BrandIcon name="github" title="GitHub" />);
    expect(container.querySelector('svg')).toHaveAttribute('role', 'img');
  });

  test('color is currentColor unless asked otherwise', () => {
    const { container, rerender } = render(<BrandIcon name="github" />);
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor');
    rerender(<BrandIcon name="github" color="var(--Icons-Primary)" />);
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'var(--Icons-Primary)');
  });
});
