/**
 * Every mark the showcase offers has to draw something.
 *
 * BrandIcon resolves a NAME to a Font Awesome glyph, and an unresolved name
 * renders null — it warns in development and draws nothing. So a typo in the
 * list below is a blank button in the gallery rather than an error, which is
 * the same failure the free-collection filter on the doc link guards against
 * from the other end.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrandIconShowcase } from './BrandIconShowcase';
import { BrandIcon } from './BrandIcon';

/* Mirrors the list in the showcase. Kept here rather than exported from it
   so the test states what it expects instead of agreeing with whatever the
   file happens to hold. */
const EXPECTED = [
  'github', 'x-twitter', 'linkedin', 'instagram', 'dribbble',
  'figma', 'youtube', 'facebook', 'slack', 'medium',
  'behance', 'google', 'apple', 'android', 'spotify',
];

describe('every offered mark resolves', () => {
  it.each(EXPECTED)('%s draws a glyph', (name) => {
    const { container } = render(<BrandIcon name={name} title={name} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    const path = svg.querySelector('path');
    expect(path).not.toBeNull();
    expect((path.getAttribute('d') || '').length).toBeGreaterThan(10);
  });

  /* Guards the guard: if BrandIcon silently returned an svg for anything,
     the cases above would pass on a list of nonsense. */
  it('draws nothing for a name that does not exist', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<BrandIcon name="not-a-real-brand" />);
    spy.mockRestore();
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('the showcase', () => {
  it('renders with the four standard tabs', () => {
    render(<BrandIconShowcase />);
    for (const t of ['Summary', 'Playground', 'Accessibility', 'Change Log']) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
  });

  /* The mark buttons live in Playground, which is not the default tab, so
     the tab has to be opened first — Summary is what a reader lands on. */
  it('offers every mark as a control in Playground', () => {
    render(<BrandIconShowcase />);
    fireEvent.click(screen.getByText('Playground'));
    for (const name of EXPECTED) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });
});
