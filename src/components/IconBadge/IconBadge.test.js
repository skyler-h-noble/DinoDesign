// src/components/IconBadge/IconBadge.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { IconBadge } from './IconBadge';
import HomeIcon from '@mui/icons-material/Home';

/* ─── Helpers ─── */
const renderBadge = (props = {}) =>
  render(<IconBadge {...props}><HomeIcon data-testid="inner-icon" /></IconBadge>);

/* ─── Basic Rendering ─── */
describe('IconBadge', () => {
  test('renders', () => {
    const { container } = renderBadge();
    expect(container.querySelector('.icon-badge')).toBeInTheDocument();
  });

  test('renders children', () => {
    renderBadge();
    expect(screen.getByTestId('inner-icon')).toBeInTheDocument();
  });

  /* ─── Variants ─── */
  test('solid variant sets data-theme and data-surface="Surface"', () => {
    const { container } = renderBadge({ color: 'primary', variant: 'solid' });
    const el = container.querySelector('.icon-badge');
    expect(el).toHaveAttribute('data-theme', 'Primary');
    expect(el).toHaveAttribute('data-surface', 'Surface');
  });

  test('light variant sets data-theme="{Theme}-Light"', () => {
    const { container } = renderBadge({ color: 'primary', variant: 'light' });
    const el = container.querySelector('.icon-badge');
    expect(el).toHaveAttribute('data-theme', 'Primary-Light');
    expect(el).toHaveAttribute('data-surface', 'Surface');
  });

  test('dark variant sets data-surface="Surface-Dimmest"', () => {
    const { container } = renderBadge({ color: 'error', variant: 'dark' });
    const el = container.querySelector('.icon-badge');
    expect(el).toHaveAttribute('data-theme', 'Error');
    expect(el).toHaveAttribute('data-surface', 'Surface-Dimmest');
  });

  /* ─── Colors ─── */
  test('default color maps to Default theme', () => {
    const { container } = renderBadge({ color: 'default' });
    expect(container.querySelector('.icon-badge')).toHaveAttribute('data-theme', 'Default');
  });

  test('semantic colors map correctly', () => {
    ['info', 'success', 'warning', 'error'].forEach(color => {
      const { container } = render(
        <IconBadge color={color}><HomeIcon /></IconBadge>
      );
      const expected = color.charAt(0).toUpperCase() + color.slice(1);
      expect(container.querySelector('.icon-badge')).toHaveAttribute('data-theme', expected);
    });
  });

  /* ─── Sizes ─── */
  test('size classes are applied', () => {
    ['small', 'medium', 'large'].forEach(size => {
      const { container } = render(
        <IconBadge size={size}><HomeIcon /></IconBadge>
      );
      expect(container.querySelector('.icon-badge-' + size)).toBeInTheDocument();
    });
  });

  /* ─── Custom className ─── */
  test('custom className is applied', () => {
    const { container } = renderBadge({ className: 'my-badge' });
    expect(container.querySelector('.my-badge')).toBeInTheDocument();
  });
});
