// src/components/Input/Input.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { axe } from 'jest-axe';

describe('Input Component', () => {
  // Render tests
  test('renders input element', () => {
    render(<Input aria-label="test" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders with standard label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders with floating label', () => {
    render(<Input label="Email" labelPosition="floating" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('renders placeholder', () => {
    render(<Input placeholder="Enter text" aria-label="test" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  // Variant tests
  test('applies variant class for outline', () => {
    const { container } = render(<Input variant="primary-outline" aria-label="test" />);
    expect(container.querySelector('.inp-primary-outline')).toBeInTheDocument();
  });

  test('applies variant class for secondary outline', () => {
    const { container } = render(<Input variant="secondary-outline" aria-label="test" />);
    expect(container.querySelector('.inp-secondary-outline')).toBeInTheDocument();
  });

  test('applies variant class for error outline', () => {
    const { container } = render(<Input variant="error-outline" aria-label="test" />);
    expect(container.querySelector('.inp-error-outline')).toBeInTheDocument();
  });

  // Value tests
  test('renders with defaultValue', () => {
    render(<Input defaultValue="Hello" aria-label="test" />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  test('renders controlled value', () => {
    render(<Input value="Controlled" onChange={() => {}} aria-label="test" />);
    expect(screen.getByRole('textbox')).toHaveValue('Controlled');
  });

  // Disabled tests
  test('disables input when disabled prop is true', () => {
    render(<Input disabled aria-label="test" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  test('disables input with label', () => {
    render(<Input label="Disabled" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  // Event handling
  test('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} aria-label="test" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('does not allow typing when disabled', () => {
    render(<Input disabled defaultValue="locked" aria-label="test" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveValue('locked');
  });

  // Helper text
  test('renders helper text', () => {
    render(<Input helperText="Some help" aria-label="test" />);
    expect(screen.getByText('Some help')).toBeInTheDocument();
  });

  // Validation
  test('renders validation message for error', () => {
    render(<Input validation="error" validationMessage="Required field" aria-label="test" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  test('renders validation message for success', () => {
    render(<Input validation="success" validationMessage="Looks good" aria-label="test" />);
    expect(screen.getByText('Looks good')).toBeInTheDocument();
  });

  test('renders validation message for warning', () => {
    render(<Input validation="warning" validationMessage="Check this" aria-label="test" />);
    expect(screen.getByText('Check this')).toBeInTheDocument();
  });

  test('renders validation message for info', () => {
    render(<Input validation="info" validationMessage="Just so you know" aria-label="test" />);
    expect(screen.getByText('Just so you know')).toBeInTheDocument();
  });

  // Accessibility
  test('input is focusable', () => {
    render(<Input aria-label="test" />);
    const input = screen.getByRole('textbox');
    input.focus();
    expect(input).toHaveFocus();
  });

  test('forwards name prop', () => {
    render(<Input name="email" aria-label="test" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
  });

  // Class tests
  test('accepts additional className', () => {
    const { container } = render(<Input className="custom" aria-label="test" />);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });

  // Props forwarding
  test('forwards type prop', () => {
    render(<Input type="password" aria-label="test" />);
    // Password inputs may not have textbox role, check by container
    const { container } = render(<Input type="email" aria-label="test2" />);
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Input — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Input aria-label="Test input" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Input aria-label="Test input" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Input aria-label="Test input" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
