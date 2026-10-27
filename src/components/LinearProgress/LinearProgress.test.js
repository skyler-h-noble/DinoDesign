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
  test('default color is match (the theme\'s own palette)', () => {
    const { container } = renderLP();
    expect(container.querySelector('.linear-progress-match')).toBeInTheDocument();
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

/* ─── Figma's Progress Bar drawing ─── */
describe('Matches Figma', () => {
  const cssFor = (el) => {
    const out = [];
    for (const sheet of document.styleSheets) for (const r of sheet.cssRules) {
      try { if (el.matches(r.selectorText)) out.push(r.cssText); } catch (e) { /* skip */ }
    }
    return out.join('\n');
  };

  test('the track has no fill and a 1px Border outside', () => {
    const { container } = render(<LinearProgress value={40} />);
    const c = cssFor(container.querySelector('.linear-progress'));
    expect(c).toContain('box-shadow: 0 0 0 1px var(--Border)');
    expect(c).not.toContain('background-color');
  });

  test('the indicator is Buttons-Border with a Background ring inside', () => {
    const { container } = render(<LinearProgress value={40} />);
    const c = cssFor(container.querySelector('.linear-progress-bar'));
    // Buttons › Match by default, falling back to Default for an older system.
    expect(c).toContain('background-color: var(--Buttons-Match-Border, var(--Buttons-Default-Border))');
    expect(c).toContain('box-shadow: inset 0 0 0 1px var(--Background)');
  });
});

describe('showValue (Figma Progress Text)', () => {
  test('shows the rounded percentage under a determinate bar, hidden from screen readers', () => {
    const { container } = render(<LinearProgress value={47.6} showValue />);
    const v = container.querySelector('.linear-progress-value');
    expect(v).toHaveTextContent('48%');
    expect(v).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '48');
  });
  test('no value text when indeterminate or off', () => {
    const a = render(<LinearProgress showValue />).container;
    expect(a.querySelector('.linear-progress-value')).toBeNull();
    const b = render(<LinearProgress value={40} />).container;
    expect(b.querySelector('.linear-progress-value')).toBeNull();
  });
});

describe('color', () => {
  test('a palette name still pins one', () => {
    const { container } = render(<LinearProgress value={40} color="success" />);
    const sheets = [...document.styleSheets].flatMap((sh) => [...sh.cssRules]);
    const bar = container.querySelector('.linear-progress-bar');
    const css = sheets.filter((r) => { try { return bar.matches(r.selectorText); } catch (e) { return false; } }).map((r) => r.cssText).join('\n');
    expect(css).toContain('var(--Buttons-Success-Border)');
    expect(css).not.toContain('Buttons-Match');
  });
});
