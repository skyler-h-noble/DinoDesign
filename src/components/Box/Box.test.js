// src/components/Box/Box.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Box } from './Box';
import { axe } from 'jest-axe';

const renderBox = (props = {}) =>
  render(<Box {...props}>Test content</Box>);

/* Box was rewritten as a BARE LAYOUT PRIMITIVE: theme / surface / radius /
 * elevation, and no chrome of its own. These tests targeted the component it
 * replaced — `color` and `border` props, a `.themed-box-<color>` class ladder,
 * and a `themed-box` root that the DynoDesign -> OmniDesign rename turned into
 * `omni-box`. Nothing here was testing Box; it was testing a component that no
 * longer exists, on a class name that no longer exists.
 *
 * (It also declared test('Primary') three times, identically, so three of the
 * counted assertions were one assertion.)
 */

/* --- Basic Rendering --- */
describe('Box', () => {
  test('renders', () => {
    const { container } = renderBox();
    expect(container.querySelector('.omni-box')).toBeInTheDocument();
  });

  test('renders children', () => {
    renderBox();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders as div by default', () => {
    const { container } = renderBox();
    expect(container.querySelector('div.omni-box')).toBeInTheDocument();
  });

  test('renders with component prop', () => {
    const { container } = renderBox({ component: 'section' });
    expect(container.querySelector('section.omni-box')).toBeInTheDocument();
  });
});

/* --- theme / surface --- */
describe('theme and surface are direct props', () => {
  test.each(['Primary', 'Secondary', 'Info', 'Error'])('theme="%s"', (theme) => {
    const { container } = renderBox({ theme });
    expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
  });

  test('surface is set independently', () => {
    const { container } = renderBox({ surface: 'Container' });
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });

  /* Bare by default is the whole point: Box INHERITS its parent's theme so a
     nested slot does not reset the cascade. */
  test('neither is set by default', () => {
    const { container } = renderBox();
    expect(container.querySelector('[data-theme]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-surface]')).not.toBeInTheDocument();
  });
});

/* --- radius --- */
describe('radius opts in, and is not a boolean', () => {
  /* Three sizes, reading the brand's Card radii rather than a parallel scale.
     'none' stays the default — silently rounding every existing Box would
     change every layout slot already built on it. */
  test('defaults to none', () => {
    const { container } = renderBox();
    expect(container.querySelector('.omni-box').getAttribute('style') || '')
      .not.toContain('border-radius');
  });

  test.each(['small', 'medium', 'large'])('%s reads a Card radius token', (radius) => {
    const { container } = renderBox({ radius });
    const cls = (container.querySelector('.omni-box').className || '')
      .split(/\s+/).find((c) => c.startsWith('css-'));
    const css = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText).join('');
    expect(css).toMatch(/border-radius:\s*var\(--/);
  });
});

/* --- elevation --- */
describe('elevation wraps rather than paints', () => {
  /* Above 0 the shadow goes on an OUTER wrapper that sets NO surface, so it
     resolves from the surface the box SITS ON — physically where the shadow
     falls — not from the box's own. */
  test('flat by default: one element, no wrapper', () => {
    const { container } = renderBox();
    expect(container.querySelector('.omni-box-elevation')).toBeNull();
  });

  test('elevated adds the wrapper', () => {
    const { container } = renderBox({ elevation: 2 });
    expect(container.querySelector('.omni-box-elevation')).toBeInTheDocument();
  });

  test('and the wrapper carries no surface of its own', () => {
    const { container } = renderBox({ elevation: 2, surface: 'Container' });
    const wrapper = container.querySelector('.omni-box-elevation');
    expect(wrapper).not.toHaveAttribute('data-surface');
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });
});

/* --- Custom className --- */
describe('Custom props', () => {
  test('accepts custom className', () => {
    const { container } = renderBox({ className: 'my-box' });
    expect(container.querySelector('.my-box')).toBeInTheDocument();
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
