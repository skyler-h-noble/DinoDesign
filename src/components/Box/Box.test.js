// src/components/Box/Box.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Box } from './Box';
import { axe } from 'jest-axe';

const renderBox = (props = {}) =>
  render(<Box {...props}>Test content</Box>);

/* --- Basic Rendering --- */
describe('Box', () => {
  test('renders', () => {
    const { container } = renderBox();
    expect(container.querySelector('.themed-box')).toBeInTheDocument();
  });

  test('renders children', () => {
    renderBox();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders as div by default', () => {
    const { container } = renderBox();
    expect(container.querySelector('div.themed-box')).toBeInTheDocument();
  });

  test('renders with component prop', () => {
    const { container } = renderBox({ component: 'section' });
    expect(container.querySelector('section.themed-box')).toBeInTheDocument();
  });
});

/* --- data-theme --- */
describe('data-theme', () => {
  test('sets data-theme when color provided', () => {
    const { container } = renderBox({ color: 'Primary' });
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });

  test('no data-theme when color omitted', () => {
    const { container } = renderBox();
    expect(container.querySelector('[data-theme]')).not.toBeInTheDocument();
  });

  test('Primary-Light', () => {
    const { container } = renderBox({ color: 'Primary-Light' });
    expect(container.querySelector('[data-theme="Primary-Light"]')).toBeInTheDocument();
  });

  test('Primary-Medium', () => {
    const { container } = renderBox({ color: 'Primary-Medium' });
    expect(container.querySelector('[data-theme="Primary-Medium"]')).toBeInTheDocument();
  });

  test('Primary-Dark', () => {
    const { container } = renderBox({ color: 'Primary-Dark' });
    expect(container.querySelector('[data-theme="Primary-Dark"]')).toBeInTheDocument();
  });

  test('Secondary', () => {
    const { container } = renderBox({ color: 'Secondary' });
    expect(container.querySelector('[data-theme="Secondary"]')).toBeInTheDocument();
  });

  test('Info-Light', () => {
    const { container } = renderBox({ color: 'Info-Light' });
    expect(container.querySelector('[data-theme="Info-Light"]')).toBeInTheDocument();
  });

  test('Error-Dark', () => {
    const { container } = renderBox({ color: 'Error-Dark' });
    expect(container.querySelector('[data-theme="Error-Dark"]')).toBeInTheDocument();
  });
});

/* --- Color class --- */
describe('Color class', () => {
  test('adds lowercase color class', () => {
    const { container } = renderBox({ color: 'Primary' });
    expect(container.querySelector('.themed-box-primary')).toBeInTheDocument();
  });

  test('adds lowercase color class for compound', () => {
    const { container } = renderBox({ color: 'Success-Light' });
    expect(container.querySelector('.themed-box-success-light')).toBeInTheDocument();
  });

  test('no color class when color omitted', () => {
    const { container } = renderBox();
    const el = container.querySelector('.themed-box');
    expect(el.className).not.toContain('themed-box-');
  });
});

/* --- Border --- */
describe('Border', () => {
  test('bordered class when border=true', () => {
    const { container } = renderBox({ border: true });
    expect(container.querySelector('.themed-box-bordered')).toBeInTheDocument();
  });

  test('no bordered class by default', () => {
    const { container } = renderBox();
    expect(container.querySelector('.themed-box-bordered')).not.toBeInTheDocument();
  });
});

/* --- Custom className --- */
describe('Custom props', () => {
  test('accepts custom className', () => {
    const { container } = renderBox({ className: 'my-box' });
    expect(container.querySelector('.my-box')).toBeInTheDocument();
  });
});

/* --- Defaults --- */
describe('Defaults', () => {
  test('no data-theme by default', () => {
    const { container } = renderBox();
    expect(container.querySelector('[data-theme]')).not.toBeInTheDocument();
  });

  test('not bordered by default', () => {
    const { container } = renderBox();
    expect(container.querySelector('.themed-box-bordered')).not.toBeInTheDocument();
  });
});

/* --- data-surface --- */
describe('data-surface', () => {
  test('sets data-surface="Surface" when color provided', () => {
    const { container } = renderBox({ color: 'Primary' });
    expect(container.querySelector('[data-surface="Surface"]')).toBeInTheDocument();
  });

  test('no data-surface when color omitted', () => {
    const { container } = renderBox();
    expect(container.querySelector('[data-surface]')).not.toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Box — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Box>Content</Box>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Box>Content</Box>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Box>Content</Box>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
