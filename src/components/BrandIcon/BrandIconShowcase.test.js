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

describe('a representative sample of marks resolves', () => {
  /* Not "every offered mark" any more — the showcase offers all of them, and
     the exported list is derived from the icon objects themselves, so
     checking it against itself would prove nothing. These are the names the
     component's own docblock promises. */
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

  /* A NAME FIELD, not a grid of buttons. The grid offered fifteen of the 609
     this build carries, which was a guess at which marks matter dressed up as
     a feature. */
  it('takes any mark by name', () => {
    render(<BrandIconShowcase />);
    fireEvent.click(screen.getByText('Playground'));
    const field = screen.getByLabelText('Brand mark name');
    fireEvent.change(field, { target: { value: 'spotify' } });
    expect(field.value).toBe('spotify');
  });

  it('suggests from the real list rather than a curated one', () => {
    const { container } = render(<BrandIconShowcase />);
    fireEvent.click(screen.getByText('Playground'));
    const options = container.querySelectorAll('#brand-icon-names option');
    expect(options.length).toBeGreaterThan(200);
    const values = Array.from(options).map((o) => o.value);
    for (const n of ['github', 'x-twitter', 'square-github']) {
      expect(values).toContain(n);
    }
  });

  /* The failure the field makes possible, and the reason it has to be
     handled: an unknown name renders null, so without a message the result
     is a blank square that reads as the component being broken. */
  it('says so when a name does not exist', () => {
    render(<BrandIconShowcase />);
    fireEvent.click(screen.getByText('Playground'));
    const field = screen.getByLabelText('Brand mark name');
    fireEvent.change(field, { target: { value: 'not-a-real-brand' } });
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/No mark named/)).toBeInTheDocument();
  });

  it('accepts a real name without complaining', () => {
    render(<BrandIconShowcase />);
    fireEvent.click(screen.getByText('Playground'));
    const field = screen.getByLabelText('Brand mark name');
    fireEvent.change(field, { target: { value: 'figma' } });
    expect(field).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText(/No mark named/)).toBeNull();
  });

  it('links out to the list, in the Playground where the choice is made', () => {
    render(<BrandIconShowcase />);
    fireEvent.click(screen.getByText('Playground'));
    const links = screen.getAllByRole('link', { name: /Font Awesome Brands/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('free-collection'));
  });
});
