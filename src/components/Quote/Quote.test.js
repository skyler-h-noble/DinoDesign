import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Quote } from './Quote';

describe('Quote', () => {
  test('is a figure: the words in a blockquote, the attribution in a figcaption', () => {
    const { container } = render(<Quote cite="Priya Shah" detail="Studio Lead">Set up in an afternoon.</Quote>);
    expect(container.querySelector('figure blockquote')).toHaveTextContent('Set up in an afternoon.');
    expect(container.querySelector('figure figcaption')).toHaveTextContent('Priya Shah');
    expect(screen.getByText('Studio Lead')).toBeInTheDocument();
  });

  test('the words are a paragraph, not a heading — the page outline is untouched', () => {
    const { container } = render(<Quote>Words.</Quote>);
    expect(container.querySelector('blockquote p')).not.toBeNull();
    expect(container.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull();
  });

  test('the mark is decorative, and can be left out', () => {
    const { container, rerender } = render(<Quote>Words.</Quote>);
    expect(container.querySelector('.quote-mark')).toHaveAttribute('aria-hidden', 'true');
    rerender(<Quote mark={false}>Words.</Quote>);
    expect(container.querySelector('.quote-mark')).toBeNull();
  });

  test('has no axe violations', async () => {
    const { container } = render(<Quote cite="Priya Shah" avatarInitials="PS">Words.</Quote>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
