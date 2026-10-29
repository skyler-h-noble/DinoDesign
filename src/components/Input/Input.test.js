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
  test('the colour edges are retired: any variant renders the one edge and warns once', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<><Input variant="primary-outline" aria-label="a" /><Input variant="error-outline" aria-label="b" /></>);
    expect(container.querySelectorAll('.inp-default').length).toBe(2);
    expect(container.querySelector('.inp-primary-outline')).toBeNull();
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Input] variant')).length).toBe(1);
    warn.mockRestore();
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

describe('the light variant is gone', () => {
  /* It shipped with no test at all, which is part of why it survived: its only
     difference from outline was a background token no design system publishes,
     so the fallback always fired and the two variants rendered identically.
     Nothing looked wrong, and nothing asserted otherwise. */

  test('a *-light variant falls back to outline rather than rendering blank', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    for (const v of ['primary-light', 'secondary-light', 'light']) {
      const { container } = render(<Input variant={v} label="Amount" />);
      // It still renders a usable field — the fallback is the point.
      expect(container.querySelector('input')).toBeInTheDocument();
    }
    // (The one-time variant warning may already have fired in an earlier test.)
    warn.mockRestore();
  });

  test('the colour-named convenience exports are gone with the colour edges', () => {
    const mod = require('./Input');
    for (const name of ['PrimaryOutlineInput', 'ErrorOutlineInput', 'OutlineInput', 'PrimaryInput']) {
      expect(mod[name]).toBeUndefined();
    }
  });

  test('the light convenience exports are gone', () => {
    // They were never in src/components/index.js, so removing them cannot
    // break a consumer — but a re-export added later would bring the variant
    // back without anyone deciding to.
    const mod = require('./Input');
    for (const name of [
      'PrimaryLightInput', 'SecondaryLightInput', 'TertiaryLightInput',
      'NeutralLightInput', 'LightInput',
    ]) {
      expect(mod[name]).toBeUndefined();
    }
  });
});

/* Figma's Prefix and Suffix: text tight against the value. */
describe('prefix / suffix', () => {
  test('render beside the value, with the icon and decorator still in place', () => {
    const { container } = render(<Input aria-label="Price" prefix="$" suffix="USD" startAdornment={<span data-testid="ico" />} endAdornment={<span data-testid="end" />} />);
    expect(container.querySelector('.inp-prefix')).toHaveTextContent('$');
    expect(container.querySelector('.inp-suffix')).toHaveTextContent('USD');
    expect(screen.getByTestId('ico')).toBeInTheDocument();
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });
});

/* Props only MUI's TextField understands hand the whole call to Input's MUI
   version (loaded on demand), so a caller using them keeps working. */
describe('MUI-only props fall back to the MUI version', () => {
  test('InputProps still renders its adornment', async () => {
    render(<Input aria-label="Handle" InputProps={{ startAdornment: <span>@</span> }} />);
    expect(await screen.findByText('@')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Handle' })).toBeInTheDocument();
  });
});
