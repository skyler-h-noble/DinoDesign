// src/components/Checkbox/Checkbox.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  // Render tests
  test('renders checkbox', () => {
    render(<Checkbox aria-label="test" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('renders without label', () => {
    render(<Checkbox aria-label="test checkbox" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  // Checked state tests
  test('renders unchecked by default', () => {
    render(<Checkbox aria-label="test" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('renders checked when defaultChecked', () => {
    render(<Checkbox aria-label="test" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('renders checked when checked prop is true', () => {
    render(<Checkbox aria-label="test" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  // Variant tests
  test('applies variant class for primary', () => {
    const { container } = render(<Checkbox variant="primary" aria-label="test" />);
    expect(container.querySelector('.chk-primary')).toBeInTheDocument();
  });

  test('applies variant class for outline', () => {
    const { container } = render(<Checkbox variant="primary-outline" aria-label="test" />);
    expect(container.querySelector('.chk-primary-outline')).toBeInTheDocument();
  });

  test('applies variant class for light', () => {
    const { container } = render(<Checkbox variant="primary-light" aria-label="test" />);
    expect(container.querySelector('.chk-primary-light')).toBeInTheDocument();
  });

  test('applies secondary outline variant', () => {
    const { container } = render(<Checkbox variant="secondary-outline" aria-label="test" />);
    expect(container.querySelector('.chk-secondary-outline')).toBeInTheDocument();
  });

  test('applies error outline variant', () => {
    const { container } = render(<Checkbox variant="error-outline" aria-label="test" />);
    expect(container.querySelector('.chk-error-outline')).toBeInTheDocument();
  });

  test('applies success light variant', () => {
    const { container } = render(<Checkbox variant="success-light" aria-label="test" />);
    expect(container.querySelector('.chk-success-light')).toBeInTheDocument();
  });

  // Disabled state tests
  test('disables checkbox when disabled prop is true', () => {
    render(<Checkbox aria-label="test" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  test('disables checkbox with label', () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  // Event handling tests
  test('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<Checkbox aria-label="test" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<Checkbox aria-label="test" onChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('toggles checked state', () => {
    const handleChange = jest.fn();
    render(<Checkbox aria-label="test" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ checked: true }),
    }));
  });

  // Indeterminate tests
  test('renders indeterminate state', () => {
    render(<Checkbox aria-label="test" indeterminate />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
  });

  // Accessibility tests
  test('checkbox is focusable', () => {
    render(<Checkbox aria-label="test" />);
    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    expect(checkbox).toHaveFocus();
  });

  test('checkbox with label is associated correctly', () => {
    render(<Checkbox label="My checkbox" />);
    expect(screen.getByText('My checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  // Class tests
  test('accepts additional className', () => {
    const { container } = render(<Checkbox className="custom-class" aria-label="test" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  // Props forwarding tests
  test('forwards name prop', () => {
    render(<Checkbox aria-label="test" name="terms" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'terms');
  });

  test('forwards value prop', () => {
    render(<Checkbox aria-label="test" value="accepted" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'accepted');
  });
});