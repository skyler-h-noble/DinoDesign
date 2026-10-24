// src/components/ImagePlaceholder/ImagePlaceholder.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ImagePlaceholder } from './ImagePlaceholder';

const allCss = () => Array.from(document.styleSheets).flatMap((s) => Array.from(s.cssRules).map((r) => r.cssText)).join('\n');

describe('ImagePlaceholder', () => {
  test('a Border-Variant tint with the photo glyph in Quiet', () => {
    const { container } = render(<ImagePlaceholder />);
    expect(container.querySelector('svg.image-placeholder-icon')).not.toBeNull();
    const css = allCss();
    expect(css).toContain('background-color: var(--Border-Variant)');
    expect(css).toContain('color: var(--Quiet)');
  });
  test('decorative by default; announced when given a name', () => {
    const { container, unmount } = render(<ImagePlaceholder />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    unmount();
    render(<ImagePlaceholder role="img" aria-label="No photo uploaded" />);
    expect(screen.getByRole('img', { name: 'No photo uploaded' })).toBeInTheDocument();
  });
  test('no accessibility violations', async () => {
    const { container } = render(<ImagePlaceholder />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
