// src/components/CircularProgress/CircularProgress.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CircularProgress } from './CircularProgress';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderCP = (props = {}) => render(<CircularProgress {...props} />);

/* ─── Basic Rendering ─── */
describe('CircularProgress', () => {
  test('renders', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress')).toBeInTheDocument();
  });

  test('has role="progressbar"', () => {
    renderCP();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

/* ─── Indeterminate (no value) ─── */
describe('Indeterminate mode', () => {
  test('has circular-progress-indeterminate class', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-indeterminate')).toBeInTheDocument();
  });

  test('does not have circular-progress-value class', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-value')).not.toBeInTheDocument();
  });

  test('no aria-valuenow', () => {
    renderCP();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  test('no aria-valuemin', () => {
    renderCP();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuemin');
  });

  test('no aria-valuemax', () => {
    renderCP();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuemax');
  });

  test('aria-label="Loading"', () => {
    renderCP();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading');
  });
});

/* ─── Determinate (with value) ─── */
describe('Determinate mode', () => {
  test('has circular-progress-value class', () => {
    const { container } = renderCP({ value: 50 });
    expect(container.querySelector('.circular-progress-value')).toBeInTheDocument();
  });

  test('does not have circular-progress-indeterminate class', () => {
    const { container } = renderCP({ value: 50 });
    expect(container.querySelector('.circular-progress-indeterminate')).not.toBeInTheDocument();
  });

  test('aria-valuenow matches value', () => {
    renderCP({ value: 75 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  test('aria-valuemin="0"', () => {
    renderCP({ value: 50 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
  });

  test('aria-valuemax="100"', () => {
    renderCP({ value: 50 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
  });

  test('aria-label includes percentage', () => {
    renderCP({ value: 42 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', '42% progress');
  });

  test('clamps value below 0 to 0', () => {
    renderCP({ value: -10 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  test('clamps value above 100 to 100', () => {
    renderCP({ value: 150 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  test('rounds value for aria-valuenow', () => {
    renderCP({ value: 33.7 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '34');
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderCP({ size: s });
      expect(container.querySelector('.circular-progress-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Colors ─── */
describe('Color classes', () => {
  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  colors.forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderCP({ color: c });
      expect(container.querySelector('.circular-progress-' + c)).toBeInTheDocument();
    });
  });
});

/* ─── SVG structure ─── */
describe('SVG structure', () => {
  test('renders an SVG element', () => {
    const { container } = renderCP();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('renders track circle', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-track')).toBeInTheDocument();
  });

  test('renders indicator circle', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-indicator')).toBeInTheDocument();
  });

  test('track and indicator are both circle elements', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-track').tagName).toBe('circle');
    expect(container.querySelector('.circular-progress-indicator').tagName).toBe('circle');
  });

  test('indicator has strokeLinecap="round"', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-indicator')).toHaveAttribute('stroke-linecap', 'round');
  });
});

/* ─── Label / showValue ─── */
describe('Value label', () => {
  test('no label when indeterminate', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-label')).not.toBeInTheDocument();
  });

  test('no label when determinate but showValue is false', () => {
    const { container } = renderCP({ value: 50 });
    expect(container.querySelector('.circular-progress-label')).not.toBeInTheDocument();
  });

  test('label shown when determinate and showValue', () => {
    const { container } = renderCP({ value: 50, showValue: true });
    expect(container.querySelector('.circular-progress-label')).toBeInTheDocument();
  });

  test('label text displays rounded percentage', () => {
    renderCP({ value: 66.6, showValue: true });
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  test('label has aria-hidden="true"', () => {
    const { container } = renderCP({ value: 50, showValue: true });
    expect(container.querySelector('.circular-progress-label')).toHaveAttribute('aria-hidden', 'true');
  });

  test('0% label', () => {
    renderCP({ value: 0, showValue: true });
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('100% label', () => {
    renderCP({ value: 100, showValue: true });
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

/* ─── Children override label ─── */
describe('Children content', () => {
  test('children render in center when value is set', () => {
    render(<CircularProgress value={80}><span data-testid="custom">A+</span></CircularProgress>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  test('children do not render when indeterminate', () => {
    render(<CircularProgress><span data-testid="custom">A+</span></CircularProgress>);
    expect(screen.queryByTestId('custom')).not.toBeInTheDocument();
  });

  test('children override showValue text', () => {
    render(<CircularProgress value={80} showValue><span>Custom</span></CircularProgress>);
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.queryByText('80%')).not.toBeInTheDocument();
  });
});

/* ─── Thickness override ─── */
describe('Custom thickness', () => {
  test('custom thickness applies to track', () => {
    const { container } = renderCP({ thickness: 8 });
    const track = container.querySelector('.circular-progress-track');
    expect(track).toHaveAttribute('stroke-width', '8');
  });

  test('custom thickness applies to indicator', () => {
    const { container } = renderCP({ thickness: 8 });
    const indicator = container.querySelector('.circular-progress-indicator');
    expect(indicator).toHaveAttribute('stroke-width', '8');
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default color is primary', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-primary')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-medium')).toBeInTheDocument();
  });

  test('default mode is indeterminate', () => {
    const { container } = renderCP();
    expect(container.querySelector('.circular-progress-indeterminate')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('CircularProgress — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <CircularProgress aria-label="Loading" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <CircularProgress aria-label="Loading" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <CircularProgress aria-label="Loading" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
