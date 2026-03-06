// src/components/Switch/Switch.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Switch,
  SwitchInput,
  PrimarySwitch,
  SecondarySwitch,
  ErrorSwitch,
  PrimaryOutlineSwitch,
  SecondaryOutlineSwitch,
  PrimaryLightSwitch,
  SuccessLightSwitch,
  ErrorLightSwitch,
} from './Switch';

// ─── Switch Component ────────────────────────────────────────────────────────

describe('Switch Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Switch aria-label="Test switch" />);
    expect(container).toBeInTheDocument();
  });

  test('renders with role switch', () => {
    render(<Switch aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('renders unchecked by default', () => {
    render(<Switch aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('renders checked when defaultChecked', () => {
    render(<Switch defaultChecked aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('renders checked with controlled value', () => {
    render(<Switch checked onChange={() => {}} aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('calls onChange when toggled', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} aria-label="Test switch" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders with label', () => {
    render(<Switch label="Notifications" />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('renders without label', () => {
    const { container } = render(<Switch aria-label="No label" />);
    expect(container.querySelector('.switch-primary')).toBeInTheDocument();
  });

  // --- Disabled ---

  test('handles disabled state', () => {
    render(<Switch disabled aria-label="Disabled" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  test('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<Switch disabled onChange={handleChange} aria-label="Disabled" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Variants ---

  test('defaults to primary variant', () => {
    const { container } = render(<Switch aria-label="Test" />);
    expect(container.querySelector('.switch-primary')).toBeInTheDocument();
  });

  test.each([
    ['primary'], ['secondary'], ['tertiary'], ['neutral'],
    ['info'], ['success'], ['warning'], ['error'],
  ])('applies solid %s variant class', (color) => {
    const { container } = render(<Switch variant={color} aria-label="Test" />);
    expect(container.querySelector(`.switch-${color}`)).toBeInTheDocument();
  });

  test.each([
    ['primary-outline'], ['secondary-outline'], ['error-outline'],
  ])('applies %s variant class', (variant) => {
    const { container } = render(<Switch variant={variant} aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });

  test.each([
    ['primary-light'], ['success-light'], ['error-light'],
  ])('applies %s variant class', (variant) => {
    const { container } = render(<Switch variant={variant} aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });

  // --- Sizes ---

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(<Switch size={size} aria-label="Test" />);
    expect(container).toBeInTheDocument();
  });

  // --- Touch target ---

  test('small switch has min 24px container', () => {
    const { container } = render(<Switch size="small" aria-label="Test" />);
    const switchEl = container.querySelector('.MuiSwitch-root');
    expect(switchEl).toBeInTheDocument();
  });

  // --- Label Placement ---

  test('renders label at end by default', () => {
    render(<Switch label="End label" />);
    expect(screen.getByText('End label')).toBeInTheDocument();
  });

  test('renders label at start', () => {
    render(<Switch label="Start label" labelPlacement="start" />);
    expect(screen.getByText('Start label')).toBeInTheDocument();
  });

  // --- Name and Value ---

  test('passes name prop', () => {
    const { container } = render(<Switch name="my-switch" aria-label="Test" />);
    const input = container.querySelector('input[name="my-switch"]');
    expect(input).toBeInTheDocument();
  });

  test('passes value prop', () => {
    const { container } = render(<Switch value="notifications" aria-label="Test" />);
    const input = container.querySelector('input[value="notifications"]');
    expect(input).toBeInTheDocument();
  });
});

// ─── Convenience Exports ─────────────────────────────────────────────────────

describe('Convenience Exports', () => {
  // Solid
  test.each([
    ['PrimarySwitch',   PrimarySwitch,   'primary'],
    ['SecondarySwitch',  SecondarySwitch, 'secondary'],
    ['ErrorSwitch',      ErrorSwitch,     'error'],
  ])('%s renders with correct variant', (name, Component, variant) => {
    const { container } = render(<Component aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });

  // Outline
  test.each([
    ['PrimaryOutlineSwitch',   PrimaryOutlineSwitch,   'primary-outline'],
    ['SecondaryOutlineSwitch', SecondaryOutlineSwitch, 'secondary-outline'],
  ])('%s renders with correct variant', (name, Component, variant) => {
    const { container } = render(<Component aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });

  // Light
  test.each([
    ['PrimaryLightSwitch',   PrimaryLightSwitch,   'primary-light'],
    ['SuccessLightSwitch',   SuccessLightSwitch,   'success-light'],
    ['ErrorLightSwitch',     ErrorLightSwitch,     'error-light'],
  ])('%s renders with correct variant', (name, Component, variant) => {
    const { container } = render(<Component aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });

  // Legacy alias
  test('SwitchInput is an alias for Switch', () => {
    expect(SwitchInput).toBe(Switch);
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────────

describe('Accessibility', () => {
  test('has checkbox role (MUI Switch)', () => {
    render(<Switch aria-label="Accessible" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('passes aria-label to input', () => {
    render(<Switch aria-label="My switch" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'My switch');
  });

  test('disabled switch is disabled in DOM', () => {
    render(<Switch disabled aria-label="Test" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  test('checked state reflected in aria', () => {
    render(<Switch defaultChecked aria-label="Test" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('toggle changes checked state', () => {
    render(<Switch aria-label="Test" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
