// src/components/LinearProgress/LinearProgress.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LinearProgress } from './LinearProgress';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderLP = (props = {}) => render(<LinearProgress {...props} />);

/* ─── Basic Rendering ─── */
describe('LinearProgress', () => {
  test('renders', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress')).toBeInTheDocument();
  });

  test('has role="progressbar"', () => {
    renderLP();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders fill bar element', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-bar')).toBeInTheDocument();
  });
});

/* ─── Indeterminate (no value) ─── */
describe('Indeterminate mode', () => {
  test('has linear-progress-indeterminate class', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-indeterminate')).toBeInTheDocument();
  });

  test('does not have linear-progress-determinate class', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-determinate')).not.toBeInTheDocument();
  });

  test('no aria-valuenow', () => {
    renderLP();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  test('no aria-valuemin', () => {
    renderLP();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuemin');
  });

  test('no aria-valuemax', () => {
    renderLP();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuemax');
  });

  test('aria-label="Loading"', () => {
    renderLP();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading');
  });
});

/* ─── Determinate (with value) ─── */
describe('Determinate mode', () => {
  test('has linear-progress-determinate class', () => {
    const { container } = renderLP({ value: 50 });
    expect(container.querySelector('.linear-progress-determinate')).toBeInTheDocument();
  });

  test('does not have linear-progress-indeterminate class', () => {
    const { container } = renderLP({ value: 50 });
    expect(container.querySelector('.linear-progress-indeterminate')).not.toBeInTheDocument();
  });

  test('aria-valuenow matches value', () => {
    renderLP({ value: 75 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  test('aria-valuemin="0"', () => {
    renderLP({ value: 50 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
  });

  test('aria-valuemax="100"', () => {
    renderLP({ value: 50 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
  });

  test('aria-label includes percentage', () => {
    renderLP({ value: 42 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', '42% progress');
  });

  test('clamps value below 0 to 0', () => {
    renderLP({ value: -10 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  test('clamps value above 100 to 100', () => {
    renderLP({ value: 150 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  test('rounds value for aria-valuenow', () => {
    renderLP({ value: 33.7 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '34');
  });

  test('value 0 shows 0%', () => {
    renderLP({ value: 0 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', '0% progress');
  });

  test('value 100 shows 100%', () => {
    renderLP({ value: 100 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', '100% progress');
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderLP({ size: s });
      expect(container.querySelector('.linear-progress-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Colors ─── */
describe('Color classes', () => {
  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  colors.forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderLP({ color: c });
      expect(container.querySelector('.linear-progress-' + c)).toBeInTheDocument();
    });
  });
});

/* ─── Bar element ─── */
describe('Bar element', () => {
  test('bar has linear-progress-bar class', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-bar')).toBeInTheDocument();
  });

  test('bar is inside the track', () => {
    const { container } = renderLP();
    const track = container.querySelector('.linear-progress');
    const bar = container.querySelector('.linear-progress-bar');
    expect(track.contains(bar)).toBe(true);
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default color is primary', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-primary')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-medium')).toBeInTheDocument();
  });

  test('default mode is indeterminate', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-indeterminate')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('LinearProgress — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <LinearProgress aria-label="Loading" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <LinearProgress aria-label="Loading" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <LinearProgress aria-label="Loading" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
