// src/components/Divider/Divider.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Divider,
  DefaultDivider,
  PrimaryDivider,
  InfoDivider,
  ErrorDivider,
} from './Divider';
import { axe } from 'jest-axe';

describe('Divider Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Divider />);
    expect(container).toBeInTheDocument();
  });

  test('renders horizontal by default', () => {
    const { container } = render(<Divider />);
    const el = container.querySelector('[role="separator"]');
    expect(el).toBeInTheDocument();
    expect(el.getAttribute('aria-orientation')).toBe('horizontal');
  });

  test('renders vertical orientation', () => {
    const { container } = render(
      <div style={{ display: 'flex', height: 100 }}>
        <Divider orientation="vertical" />
      </div>
    );
    const el = container.querySelector('[role="separator"]');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });

  test('applies default color class', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('.divider-default')).toBeInTheDocument();
  });

  test.each([
    ['primary'], ['secondary'], ['tertiary'], ['neutral'],
    ['info'], ['success'], ['warning'], ['error'],
  ])('applies %s color class', (color) => {
    const { container } = render(<Divider color={color} />);
    expect(container.querySelector('.divider-' + color)).toBeInTheDocument();
  });

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(<Divider size={size} />);
    expect(container).toBeInTheDocument();
  });

  test('renders indicator text', () => {
    render(<Divider indicatorText="OR" color="primary" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  test('renders children as indicator', () => {
    render(<Divider color="primary">Section Break</Divider>);
    expect(screen.getByText('Section Break')).toBeInTheDocument();
  });

  test('adds divider-indicator class when indicator present', () => {
    const { container } = render(<Divider indicatorText="OR" color="primary" />);
    expect(container.querySelector('.divider-indicator')).toBeInTheDocument();
  });
});

describe('Convenience Exports', () => {
  test('DefaultDivider renders', () => {
    const { container } = render(<DefaultDivider />);
    expect(container.querySelector('.divider-default')).toBeInTheDocument();
  });

  test('PrimaryDivider renders', () => {
    const { container } = render(<PrimaryDivider />);
    expect(container.querySelector('.divider-primary')).toBeInTheDocument();
  });

  test('InfoDivider renders', () => {
    const { container } = render(<InfoDivider />);
    expect(container.querySelector('.divider-info')).toBeInTheDocument();
  });

  test('ErrorDivider renders', () => {
    const { container } = render(<ErrorDivider />);
    expect(container.querySelector('.divider-error')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Divider — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Divider />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Divider />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Divider />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* Thickness comes from Component-Size `Divider` — 0.5 / 1 / 2.
 *
 * It was 1 / 2 / 4, one step heavy at every size. That ramp is the one the
 * design assigns to the STEP BAR (the stepper's connector), which the lib had
 * pinned flat at 2 — so the two ramps had effectively been swapped between the
 * two components.
 *
 * 0.5px is a deliberate hairline: a true half-pixel on a 2x display, rounded
 * by the browser on 1x. That is the usual hairline trade, not a rounding bug.
 */
describe('thickness follows the Divider ramp, not the step bar ramp', () => {
  const cssFor = (el) => {
    const cls = (el.className || '').split(/\s+/).find((c) => c.startsWith('css-'));
    if (!cls) return '';
    return Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText)
      .join('\n');
  };

  test.each([
    ['small', '0.5px'],
    ['medium', '1px'],
    ['large', '2px'],
  ])('vertical %s is %s wide', (size, expected) => {
    const { container } = render(<Divider orientation="vertical" size={size} />);
    const el = container.querySelector('.divider-vertical');
    expect(cssFor(el)).toContain('width: ' + expected);
  });

  test('large is 2px, not the 4px the step bar uses', () => {
    const { container } = render(<Divider orientation="vertical" size="large" />);
    const el = container.querySelector('.divider-vertical');
    expect(cssFor(el)).not.toContain('width: 4px');
  });
});
