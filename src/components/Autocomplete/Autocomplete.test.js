// src/components/Autocomplete/Autocomplete.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Autocomplete } from './Autocomplete';
import { axe } from 'jest-axe';

const OPTIONS = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
];

const renderAC = (props = {}) =>
  render(<Autocomplete options={OPTIONS} label="Country" {...props} />);

// ─── Basic ────────────────────────────────────────────────────────────────────

describe('Autocomplete', () => {
  test('renders', () => {
    const { container } = renderAC();
    expect(container.querySelector('.autocomplete')).toBeInTheDocument();
  });

  test('renders combobox', () => {
    renderAC();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('has data-surface', () => {
    const { container } = renderAC();
    expect(container.querySelector('[data-surface="Container-Lowest"]')).toBeInTheDocument();
  });
});

// ─── Label ───────────────────────────────────────────────────────────────────

describe('Label', () => {
  test('top label', () => {
    renderAC({ labelPosition: 'top' });
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  test('no label', () => {
    renderAC({ labelPosition: 'none', label: undefined });
    expect(screen.queryByText('Country')).not.toBeInTheDocument();
  });
});

// ─── Dropdown ─────────────────────────────────────────────────────────────────

describe('Dropdown', () => {
  test('closed by default', () => {
    renderAC();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('opens on focus', () => {
    renderAC();
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('shows all options', () => {
    renderAC();
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  test('filters on type', () => {
    renderAC();
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'can' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  test('closes on Escape', () => {
    renderAC();
    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('no options message', () => {
    renderAC();
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText('No options')).toBeInTheDocument();
  });
});

// ─── Selection ────────────────────────────────────────────────────────────────

describe('Selection', () => {
  test('clicking option selects it', () => {
    const onChange = jest.fn();
    renderAC({ onChange });
    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Canada'));
    expect(onChange).toHaveBeenCalled();
  });

  test('input filled after selection', () => {
    renderAC();
    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Canada'));
    expect(screen.getByRole('combobox')).toHaveValue('Canada');
  });

  test('selected option has aria-selected', () => {
    // Pass both value and inputValue so the component knows selection state
    renderAC({ value: OPTIONS[1], inputValue: 'Canada' });
    fireEvent.focus(screen.getByRole('combobox'));
    const opts = screen.getAllByRole('option');
    expect(opts[1]).toHaveAttribute('aria-selected', 'true');
  });
});

// ─── Clear ────────────────────────────────────────────────────────────────────

describe('Clear', () => {
  test('clear button shows when has value', () => {
    // Must pass inputValue — clear button renders based on currentInput not value
    renderAC({ value: OPTIONS[0], inputValue: 'United States' });
    expect(screen.getByLabelText('Clear')).toBeInTheDocument();
  });

  test('clear button clears value', () => {
    const onChange = jest.fn();
    renderAC({ value: OPTIONS[0], inputValue: 'United States', onChange });
    fireEvent.click(screen.getByLabelText('Clear'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  test('no clear button when clearable=false', () => {
    renderAC({ value: OPTIONS[0], inputValue: 'United States', clearable: false });
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
  });

  test('clear button shows after typing', () => {
    renderAC();
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Can' } });
    expect(screen.getByLabelText('Clear')).toBeInTheDocument();
  });
});

// ─── Keyboard ─────────────────────────────────────────────────────────────────

describe('Keyboard', () => {
  test('ArrowDown opens dropdown', () => {
    renderAC();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('Enter selects highlighted', () => {
    const onChange = jest.fn();
    renderAC({ onChange });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalled();
  });
});

// ─── Sizes ────────────────────────────────────────────────────────────────────

describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' class', () => {
      const { container } = renderAC({ size: s });
      expect(container.querySelector('.autocomplete-' + s)).toBeInTheDocument();
    });
  });
});

// ─── Styles ───────────────────────────────────────────────────────────────────

describe('Styles', () => {
  ['default', 'solid'].forEach((st) => {
    test(st + ' class', () => {
      const { container } = renderAC({ style: st });
      expect(container.querySelector('.autocomplete-style-' + st)).toBeInTheDocument();
    });
  });
});

// ─── Disabled ─────────────────────────────────────────────────────────────────

describe('Disabled', () => {
  test('disabled class', () => {
    const { container } = renderAC({ disabled: true });
    expect(container.querySelector('.autocomplete-disabled')).toBeInTheDocument();
  });

  test('input disabled', () => {
    renderAC({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});

// ─── Loading ──────────────────────────────────────────────────────────────────

describe('Loading', () => {
  test('shows loading text', () => {
    renderAC({ loading: true });
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getByText('Loading\u2026')).toBeInTheDocument();
  });
});

// ─── Helper text ──────────────────────────────────────────────────────────────

describe('Helper text', () => {
  test('displays helper text', () => {
    renderAC({ helperText: 'Pick a country' });
    expect(screen.getByText('Pick a country')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Autocomplete — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Autocomplete aria-label="test" options={[]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Autocomplete aria-label="test" options={[]} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Autocomplete aria-label="test" options={[]} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});