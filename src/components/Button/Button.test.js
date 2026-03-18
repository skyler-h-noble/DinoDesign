// src/components/Button/Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from './Button';

// ─── Render ───────────────────────────────────────────────────────────────────

describe('Button — Render', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('renders as a button element', () => {
    const { container } = render(<Button>Test</Button>);
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});

// ─── Variants ─────────────────────────────────────────────────────────────────

describe('Button — Variants', () => {
  test('applies btn-default class by default', () => {
    const { container } = render(<Button>Default</Button>);
    expect(container.querySelector('.btn-default')).toBeInTheDocument();
  });

  test('applies btn-default class', () => {
    const { container } = render(<Button variant="default">Default</Button>);
    expect(container.querySelector('.btn-default')).toBeInTheDocument();
  });

  test('applies btn-default-outline class', () => {
    const { container } = render(<Button variant="default-outline">Default Outline</Button>);
    expect(container.querySelector('.btn-default-outline')).toBeInTheDocument();
  });

  test('applies btn-secondary class', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    expect(container.querySelector('.btn-secondary')).toBeInTheDocument();
  });

  test('applies btn-tertiary class', () => {
    const { container } = render(<Button variant="tertiary">Tertiary</Button>);
    expect(container.querySelector('.btn-tertiary')).toBeInTheDocument();
  });

  test('applies btn-primary-outline class', () => {
    const { container } = render(<Button variant="primary-outline">Outline</Button>);
    expect(container.querySelector('.btn-primary-outline')).toBeInTheDocument();
  });

  test('applies btn-info class', () => {
    const { container } = render(<Button variant="info">Info</Button>);
    expect(container.querySelector('.btn-info')).toBeInTheDocument();
  });

  test('applies btn-success class', () => {
    const { container } = render(<Button variant="success">Success</Button>);
    expect(container.querySelector('.btn-success')).toBeInTheDocument();
  });

  test('applies btn-warning class', () => {
    const { container } = render(<Button variant="warning">Warning</Button>);
    expect(container.querySelector('.btn-warning')).toBeInTheDocument();
  });

  test('applies btn-error class', () => {
    const { container } = render(<Button variant="error">Error</Button>);
    expect(container.querySelector('.btn-error')).toBeInTheDocument();
  });

  test('applies btn-ghost class', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    expect(container.querySelector('.btn-ghost')).toBeInTheDocument();
  });
});

// ─── Sizes ────────────────────────────────────────────────────────────────────

describe('Button — Sizes', () => {
  test('renders small size', () => {
    render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toBeInTheDocument();
  });

  test('renders medium size by default', () => {
    render(<Button>Medium</Button>);
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
  });

  test('renders large size', () => {
    render(<Button size="large">Large</Button>);
    expect(screen.getByRole('button', { name: /large/i })).toBeInTheDocument();
  });
});

// ─── Disabled ─────────────────────────────────────────────────────────────────

describe('Button — Disabled', () => {
  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ─── Click ────────────────────────────────────────────────────────────────────

describe('Button — Click', () => {
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ─── Focus ────────────────────────────────────────────────────────────────────

describe('Button — Focus', () => {
  test('button is focusable', () => {
    render(<Button>Focus me</Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });
});

// ─── Props ────────────────────────────────────────────────────────────────────

describe('Button — Props', () => {
  test('accepts additional className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('forwards aria-label', () => {
    render(<Button aria-label="test-button">Button</Button>);
    expect(screen.getByRole('button', { name: 'test-button' })).toBeInTheDocument();
  });

  test('forwards data-testid', () => {
    render(<Button data-testid="my-btn">Button</Button>);
    expect(screen.getByTestId('my-btn')).toBeInTheDocument();
  });

  test('forwards type attribute', () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    expect(container.querySelector('button')).toHaveAttribute('type', 'submit');
  });

  test('renders fullWidth', () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Button — Accessibility (jest-axe)', () => {
  test('has no accessibility violations — default', async () => {
    const { container } = render(<Button variant="default">Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations — default outline', async () => {
    const { container } = render(<Button variant="default-outline">Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations — primary', async () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations — outline', async () => {
    const { container } = render(<Button variant="primary-outline">Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations — ghost', async () => {
    const { container } = render(<Button variant="ghost">Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations — disabled', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations — icon only', async () => {
    const { container } = render(<Button iconOnly aria-label="Add item">+</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary"><Button variant="primary">Click me</Button></div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary"><Button variant="primary">Click me</Button></div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no accessibility violations in Tertiary theme', async () => {
    const { container } = render(
      <div data-theme="Tertiary"><Button variant="primary">Click me</Button></div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});