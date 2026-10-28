import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ShapeButton } from './ShapeButton';
import { shapePath } from '../Shape/shapes';

const d = (c) => c.querySelector('svg.shape-button-shape path').getAttribute('d');

describe('ShapeButton', () => {
  test('draws its shape behind the icon, named by its aria-label', () => {
    const { container } = render(<ShapeButton shape="cookie-9" aria-label="Add to favourites"><span>i</span></ShapeButton>);
    expect(screen.getByRole('button', { name: 'Add to favourites' })).toBeInTheDocument();
    expect(d(container)).toBe(shapePath('cookie-9'));
  });

  test('morphOn="selected" is a toggle: it morphs and reports aria-pressed', () => {
    const { container, rerender } = render(<ShapeButton shape="circle" morphTo="cookie-9" selected={false} aria-label="Fav">i</ShapeButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    expect(d(container)).toBe(shapePath('circle'));
    rerender(<ShapeButton shape="circle" morphTo="cookie-9" selected aria-label="Fav">i</ShapeButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(d(container)).toBe(shapePath('cookie-9'));
  });

  test('morphOn="hover" morphs while the pointer is over it', () => {
    const { container } = render(<ShapeButton shape="circle" morphTo="flower" morphOn="hover" aria-label="Fav">i</ShapeButton>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(d(container)).toBe(shapePath('flower'));
    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(d(container)).toBe(shapePath('circle'));
  });

  test('disabled does not morph', () => {
    const { container } = render(<ShapeButton shape="circle" morphTo="cookie-9" selected disabled aria-label="Fav">i</ShapeButton>);
    expect(d(container)).toBe(shapePath('circle'));
  });

  test('warns once for a pair that cannot blend, and for a missing name', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ShapeButton shape="circle" morphTo="gem" aria-label="Fav">i</ShapeButton>);
    render(<ShapeButton shape="circle">i</ShapeButton>);
    const msgs = warn.mock.calls.map((c) => String(c[0]));
    expect(msgs.some((m) => m.includes('will snap'))).toBe(true);
    expect(msgs.some((m) => m.includes('needs a label or an aria-label'))).toBe(true);
    warn.mockRestore();
  });

  test('a label below names the button, so no aria-label is needed', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<ShapeButton shape="cookie-9" label="Favourites">i</ShapeButton>);
    expect(screen.getByRole('button', { name: 'Favourites' })).toBeInTheDocument();
    expect(container.querySelector('.shape-button-label-below')).not.toBeNull();
    expect(warn.mock.calls.some((c) => String(c[0]).includes('needs a label'))).toBe(false);
    warn.mockRestore();
  });

  test('an image fills the shape instead of a color', () => {
    const { container } = render(<ShapeButton shape="cookie-9" imageSrc="/me.jpg" label="Profile" />);
    const img = container.querySelector('.shape-button-image img');
    expect(img).toHaveAttribute('src', '/me.jpg');
    // Only the edge is drawn over it.
    expect(container.querySelector('svg.shape-button-shape path.shape-button-outline')).not.toBeNull();
    expect(container.querySelector('path.shape-button-fill')).toBeNull();
  });

  test('limits itself to the avatar shapes: anything else draws a circle and warns', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<ShapeButton shape="burst" aria-label="Fav">i</ShapeButton>);
    expect(d(container)).toBe(shapePath('circle'));
    expect(warn.mock.calls.some((c) => String(c[0]).includes('not a button shape'))).toBe(true);
    warn.mockRestore();
  });

  test('may morph into a livelier shape than it rests as', () => {
    const { container } = render(<ShapeButton shape="circle" morphTo="sunny" selected aria-label="Fav">i</ShapeButton>);
    expect(d(container)).toBe(shapePath('sunny'));
  });

  test('has no axe violations', async () => {
    const { container } = render(<ShapeButton shape="cookie-9" aria-label="Add to favourites">i</ShapeButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
