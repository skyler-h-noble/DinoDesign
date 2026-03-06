// src/components/ToggleButtonGroup/ToggleButtonGroup.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ToggleButtonGroup,
  ToggleButton,
  PrimaryToggleButtonGroup,
  PrimaryLightToggleButtonGroup,
  ErrorLightToggleButtonGroup,
  SuccessLightToggleButtonGroup,
} from './ToggleButtonGroup';

// ─── ToggleButtonGroup ───────────────────────────────────────────────────────

describe('ToggleButtonGroup Component', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <ToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(container).toBeInTheDocument();
  });

  test('renders all buttons', () => {
    render(
      <ToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">Alpha</ToggleButton>
        <ToggleButton value="b">Beta</ToggleButton>
        <ToggleButton value="c">Charlie</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('selected button has aria-pressed', () => {
    render(
      <ToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByText('A').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('B').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  test('calls onChange when button clicked', () => {
    const handleChange = jest.fn();
    render(
      <ToggleButtonGroup value="a" exclusive onChange={handleChange} aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    fireEvent.click(screen.getByText('B'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // --- Variants ---

  test('defaults to primary variant', () => {
    const { container } = render(
      <ToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(container.querySelector('.toggle-group-primary')).toBeInTheDocument();
  });

  test.each([
    ['primary-light'], ['secondary-light'], ['error-light'], ['success-light'],
  ])('applies %s variant class', (variant) => {
    const { container } = render(
      <ToggleButtonGroup variant={variant} value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(container.querySelector(`.toggle-group-${variant}`)).toBeInTheDocument();
  });

  // --- Sizes ---

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(
      <ToggleButtonGroup size={size} value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(container).toBeInTheDocument();
  });

  // --- Exclusive vs Multiple ---

  test('exclusive mode allows single selection', () => {
    render(
      <ToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByText('A').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('B').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  test('non-exclusive mode allows multiple selection', () => {
    render(
      <ToggleButtonGroup value={['a', 'b']} aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
        <ToggleButton value="c">C</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByText('A').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('B').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('C').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  // --- Disabled ---

  test('disables all buttons when group disabled', () => {
    render(
      <ToggleButtonGroup value="a" exclusive disabled aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByText('A').closest('button')).toBeDisabled();
    expect(screen.getByText('B').closest('button')).toBeDisabled();
  });

  test('individual button can be disabled', () => {
    render(
      <ToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b" disabled>B</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByText('A').closest('button')).not.toBeDisabled();
    expect(screen.getByText('B').closest('button')).toBeDisabled();
  });

  // --- Orientation ---

  test('renders vertical orientation', () => {
    const { container } = render(
      <ToggleButtonGroup value="a" exclusive orientation="vertical" aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(container.querySelector('.MuiToggleButtonGroup-vertical')).toBeInTheDocument();
  });

  // --- Full width ---

  test('renders full width', () => {
    const { container } = render(
      <ToggleButtonGroup value="a" exclusive fullWidth aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(container).toBeInTheDocument();
  });
});

// ─── Convenience Exports ─────────────────────────────────────────────────────

describe('Convenience Exports', () => {
  test('PrimaryToggleButtonGroup renders', () => {
    const { container } = render(
      <PrimaryToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </PrimaryToggleButtonGroup>
    );
    expect(container.querySelector('.toggle-group-primary')).toBeInTheDocument();
  });

  test('PrimaryLightToggleButtonGroup renders', () => {
    const { container } = render(
      <PrimaryLightToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </PrimaryLightToggleButtonGroup>
    );
    expect(container.querySelector('.toggle-group-primary-light')).toBeInTheDocument();
  });

  test('ErrorLightToggleButtonGroup renders', () => {
    const { container } = render(
      <ErrorLightToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </ErrorLightToggleButtonGroup>
    );
    expect(container.querySelector('.toggle-group-error-light')).toBeInTheDocument();
  });

  test('SuccessLightToggleButtonGroup renders', () => {
    const { container } = render(
      <SuccessLightToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </SuccessLightToggleButtonGroup>
    );
    expect(container.querySelector('.toggle-group-success-light')).toBeInTheDocument();
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────────

describe('Accessibility', () => {
  test('group has aria-label', () => {
    render(
      <ToggleButtonGroup value="a" exclusive aria-label="alignment options">
        <ToggleButton value="a">A</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'alignment options');
  });

  test('buttons have aria-pressed', () => {
    render(
      <ToggleButtonGroup value="a" exclusive aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
        <ToggleButton value="b">B</ToggleButton>
      </ToggleButtonGroup>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
  });

  test('disabled buttons are aria-disabled', () => {
    render(
      <ToggleButtonGroup value="a" exclusive disabled aria-label="test">
        <ToggleButton value="a">A</ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
