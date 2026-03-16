// src/components/Icon/Icon.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import HomeIcon from '@mui/icons-material/Home';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderIcon = (props = {}) =>
  render(<Icon {...props}><HomeIcon data-testid="inner-icon" /></Icon>);

/* ─── Basic Rendering ─── */
describe('Icon', () => {
  test('renders', () => {
    const { container } = renderIcon();
    expect(container.querySelector('.icon')).toBeInTheDocument();
  });

  test('renders children', () => {
    renderIcon();
    expect(screen.getByTestId('inner-icon')).toBeInTheDocument();
  });

  test('aria-hidden="true" by default (decorative)', () => {
    const { container } = renderIcon();
    expect(container.querySelector('.icon')).toHaveAttribute('aria-hidden', 'true');
  });

  test('aria-label removes aria-hidden and adds role="img"', () => {
    const { container } = renderIcon({ 'aria-label': 'Home' });
    const el = container.querySelector('.icon');
    expect(el).not.toHaveAttribute('aria-hidden');
    expect(el).toHaveAttribute('aria-label', 'Home');
    expect(el).toHaveAttribute('role', 'img');
  });
});

/* ─── Color classes ─── */
describe('Color classes', () => {
  const colors = ['default', 'primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error'];
  colors.forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderIcon({ color: c });
      expect(container.querySelector('.icon-' + c)).toBeInTheDocument();
    });
  });
});

/* ─── Size classes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large', 'custom'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderIcon({ size: s, fontSize: s === 'custom' ? 40 : undefined });
      expect(container.querySelector('.icon-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Disabled ─── */
describe('Disabled', () => {
  test('adds icon-disabled class', () => {
    const { container } = renderIcon({ disabled: true });
    expect(container.querySelector('.icon-disabled')).toBeInTheDocument();
  });

  test('no icon-disabled class when not disabled', () => {
    const { container } = renderIcon({ disabled: false });
    expect(container.querySelector('.icon-disabled')).not.toBeInTheDocument();
  });
});

/* ─── Two-tone ─── */
describe('Two-tone', () => {
  test('adds icon-twotone class', () => {
    const { container } = renderIcon({ twoTone: true });
    expect(container.querySelector('.icon-twotone')).toBeInTheDocument();
  });

  test('no icon-twotone class by default', () => {
    const { container } = renderIcon();
    expect(container.querySelector('.icon-twotone')).not.toBeInTheDocument();
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default color is default', () => {
    const { container } = renderIcon();
    expect(container.querySelector('.icon-default')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderIcon();
    expect(container.querySelector('.icon-medium')).toBeInTheDocument();
  });

  test('not disabled by default', () => {
    const { container } = renderIcon();
    expect(container.querySelector('.icon-disabled')).not.toBeInTheDocument();
  });

  test('not twotone by default', () => {
    const { container } = renderIcon();
    expect(container.querySelector('.icon-twotone')).not.toBeInTheDocument();
  });
});

/* ─── Custom className ─── */
describe('Custom props', () => {
  test('accepts custom className', () => {
    const { container } = renderIcon({ className: 'my-icon' });
    expect(container.querySelector('.my-icon')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Icon — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Icon aria-hidden="true" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Icon aria-hidden="true" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Icon aria-hidden="true" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
