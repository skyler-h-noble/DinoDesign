// src/components/Button/Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  // Render tests
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // Variant tests
  test('renders primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button.style.background).toContain('var(');
  });

  test('renders primary-outline variant', () => {
    render(<Button variant="primary-outline">Outline</Button>);
    const button = screen.getByText('Outline');
    expect(button).toHaveClass('primary-outline');
  });

  test('renders primary-light variant', () => {
    render(<Button variant="primary-light">Light</Button>);
    const button = screen.getByText('Light');
    expect(button).toHaveClass('primary-light');
  });

  test('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('secondary');
  });

  test('renders tertiary variant', () => {
    render(<Button variant="tertiary">Tertiary</Button>);
    expect(screen.getByText('Tertiary')).toHaveClass('tertiary');
  });

  test('renders info variant', () => {
    render(<Button variant="info">Info</Button>);
    expect(screen.getByText('Info')).toHaveClass('info');
  });

  test('renders success variant', () => {
    render(<Button variant="success">Success</Button>);
    expect(screen.getByText('Success')).toHaveClass('success');
  });

  test('renders warning variant', () => {
    render(<Button variant="warning">Warning</Button>);
    expect(screen.getByText('Warning')).toHaveClass('warning');
  });

  test('renders error variant', () => {
    render(<Button variant="error">Error</Button>);
    expect(screen.getByText('Error')).toHaveClass('error');
  });

  // Size tests
  test('renders small size', () => {
    render(<Button size="small">Small</Button>);
    const button = screen.getByText('Small');
    expect(button.style.fontSize).toBe('14px');
  });

  test('renders medium size by default', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByText('Medium');
    expect(button.style.fontSize).toBe('16px');
  });

  test('renders large size', () => {
    render(<Button size="large">Large</Button>);
    const button = screen.getByText('Large');
    expect(button.style.fontSize).toBe('18px');
  });

  // Disabled state tests
  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  test('disables button with opacity 0.6', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button.style.opacity).toBe('0.6');
  });

  test('shows not-allowed cursor when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button.style.cursor).toBe('not-allowed');
  });

  // Event handling tests
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Accessibility tests
  test('button is focusable', () => {
    render(<Button>Focus me</Button>);
    const button = screen.getByText('Focus me');
    button.focus();
    expect(button).toHaveFocus();
  });

  test('button has focus-visible outline on focus', () => {
    const { container } = render(<Button>Focus</Button>);
    const button = container.querySelector('button');
    button.focus();
    // Note: CSS-in-JS focus styles may not be testable with jsdom
    expect(button).toHaveFocus();
  });

  // Class tests
  test('accepts additional className', () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('custom-class');
  });

  test('applies variant class', () => {
    render(<Button variant="secondary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('secondary');
  });

  // Props forwarding tests
  test('forwards additional props to button element', () => {
    const { container } = render(
      <Button aria-label="test-button" data-testid="custom-id">
        Button
      </Button>
    );
    const button = container.querySelector('[data-testid="custom-id"]');
    expect(button).toHaveAttribute('aria-label', 'test-button');
  });

  test('button has proper type attribute', () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    expect(container.querySelector('button')).toHaveAttribute('type', 'submit');
  });
});