// src/components/Link/Link.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Link, LINK_STYLES, LINK_COLORS } from './Link';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderLink = (props = {}) =>
  render(<Link href="#" {...props}>Test Link</Link>);

/* ─── Basic Rendering ─── */
describe('Link', () => {
  test('renders children', () => {
    renderLink();
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  test('renders as anchor element', () => {
    renderLink();
    const el = screen.getByText('Test Link');
    expect(el.tagName).toBe('A');
  });

  test('has href', () => {
    renderLink({ href: 'https://example.com' });
    expect(screen.getByText('Test Link')).toHaveAttribute('href', 'https://example.com');
  });
});

/* ─── Always Underlined ─── */
describe('Always underlined', () => {
  test('has link class (underline enforced via styles)', () => {
    const { container } = renderLink();
    expect(container.querySelector('.link')).toBeInTheDocument();
  });

  // No underline prop exists — verify it's not accepted
  test('no underline prop exists on the component', () => {
    // Passing an unknown prop shouldn't break anything
    const { container } = renderLink({ underline: 'none' });
    expect(container.querySelector('.link')).toBeInTheDocument();
  });
});

/* ─── Allowed Typography Styles ─── */
describe('Allowed typography styles', () => {
  const allowed = ['body', 'body-small', 'body-large', 'body-semibold', 'body-bold', 'button', 'label', 'caption'];

  allowed.forEach((style) => {
    test(style + ' style applies class', () => {
      const { container } = renderLink({ textStyle: style });
      expect(container.querySelector('.link-' + style)).toBeInTheDocument();
    });
  });

  test('LINK_STYLES exports match allowed list', () => {
    expect(LINK_STYLES).toEqual(allowed);
  });
});

/* ─── Blocked Styles Not in LINK_STYLES ─── */
describe('Blocked styles excluded from LINK_STYLES', () => {
  const blocked = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'overline'];

  blocked.forEach((style) => {
    test(style + ' is not in LINK_STYLES', () => {
      expect(LINK_STYLES).not.toContain(style);
    });
  });
});

/* ─── Colors ─── */
describe('Colors', () => {
  test('primary color class (default)', () => {
    const { container } = renderLink();
    expect(container.querySelector('.link-color-primary')).toBeInTheDocument();
  });

  test('standard color class', () => {
    const { container } = renderLink({ color: 'standard' });
    expect(container.querySelector('.link-color-standard')).toBeInTheDocument();
  });

  test('quiet color class', () => {
    const { container } = renderLink({ color: 'quiet' });
    expect(container.querySelector('.link-color-quiet')).toBeInTheDocument();
  });

  test('LINK_COLORS exports match expected', () => {
    expect(LINK_COLORS).toEqual(['primary', 'standard', 'quiet']);
  });
});

/* ─── Disabled ─── */
describe('Disabled', () => {
  test('disabled link has aria-disabled', () => {
    renderLink({ disabled: true });
    expect(screen.getByText('Test Link')).toHaveAttribute('aria-disabled', 'true');
  });

  test('disabled link has tabIndex -1', () => {
    renderLink({ disabled: true });
    expect(screen.getByText('Test Link')).toHaveAttribute('tabindex', '-1');
  });

  test('disabled link has no href', () => {
    renderLink({ disabled: true });
    expect(screen.getByText('Test Link')).not.toHaveAttribute('href');
  });

  test('disabled link has disabled class', () => {
    const { container } = renderLink({ disabled: true });
    expect(container.querySelector('.link-disabled')).toBeInTheDocument();
  });

  test('enabled link has no aria-disabled', () => {
    renderLink();
    expect(screen.getByText('Test Link')).not.toHaveAttribute('aria-disabled');
  });
});

/* ─── External Links ─── */
describe('External links', () => {
  test('target="_blank" auto-adds rel="noopener noreferrer"', () => {
    renderLink({ target: '_blank' });
    expect(screen.getByText('Test Link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('custom rel is preserved', () => {
    renderLink({ target: '_blank', rel: 'custom' });
    expect(screen.getByText('Test Link')).toHaveAttribute('rel', 'custom');
  });

  test('no target does not add rel', () => {
    renderLink();
    expect(screen.getByText('Test Link')).not.toHaveAttribute('rel');
  });
});

/* ─── onClick ─── */
describe('onClick', () => {
  test('fires onClick when enabled', () => {
    const onClick = jest.fn();
    renderLink({ onClick });
    fireEvent.click(screen.getByText('Test Link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does not fire onClick when disabled', () => {
    const onClick = jest.fn();
    renderLink({ disabled: true, onClick });
    fireEvent.click(screen.getByText('Test Link'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default textStyle is body', () => {
    const { container } = renderLink();
    expect(container.querySelector('.link-body')).toBeInTheDocument();
  });

  test('default color is primary', () => {
    const { container } = renderLink();
    expect(container.querySelector('.link-color-primary')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Link — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Link href="#">Test link</Link>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Link href="#">Test link</Link>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Link href="#">Test link</Link>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
