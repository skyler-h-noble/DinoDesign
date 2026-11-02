// The default photo is its own module, loaded only when an avatar shows it.
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('default photo', () => {
  test('shows as a photo avatar at once, then the WebP photo — never the glyph', async () => {
    const { container } = render(<Avatar defaultPhoto alt="Sample person" />);
    // First frame: the photo avatar's empty circle, not the person glyph.
    expect(container.querySelector('.avatar-image')).toBeInTheDocument();
    expect(container.querySelector('.avatar-fallback')).toBeNull();
    const img = await screen.findByAltText('Sample person');
    expect(img.getAttribute('src')).toMatch(/^data:image\/webp;base64,/);
  });

  test('a later default-photo avatar has the photo on its first frame', async () => {
    render(<Avatar defaultPhoto alt="First" />);
    await screen.findByAltText('First');
    render(<Avatar defaultPhoto alt="Second" />);
    expect(screen.getByAltText('Second')).toBeInTheDocument();
  });

  test('src and initials win over the default photo', () => {
    const { container, rerender } = render(<Avatar defaultPhoto src="me.jpg" alt="Me" />);
    expect(container.querySelector('img').getAttribute('src')).toBe('me.jpg');
    rerender(<Avatar defaultPhoto initials="LN" />);
    expect(container.querySelector('.avatar-initials')).toBeInTheDocument();
  });
});
