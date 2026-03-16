// src/components/Select/Select.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';
import SearchIcon from '@mui/icons-material/Search';
import { axe } from 'jest-axe';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

const renderSelect = (props = {}) =>
  render(<Select options={OPTIONS} label="Test" {...props} />);

/* --- Basic --- */
describe('Select', () => {
  test('renders', () => {
    const { container } = renderSelect();
    expect(container.querySelector('.select-wrapper')).toBeInTheDocument();
  });
  test('renders combobox trigger', () => {
    renderSelect();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  test('has data-surface', () => {
    const { container } = renderSelect();
    expect(container.querySelector('[data-surface="Container-Lowest"]')).toBeInTheDocument();
  });
});

/* --- Label --- */
describe('Label', () => {
  test('top label rendered', () => {
    renderSelect({ labelPosition: 'top' });
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  test('no label when none', () => {
    renderSelect({ labelPosition: 'none', label: undefined });
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });
});

/* --- Opening/Closing --- */
describe('Dropdown', () => {
  test('closed by default', () => {
    renderSelect();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  test('opens on click', () => {
    renderSelect();
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
  test('shows options when open', () => {
    renderSelect();
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
  test('closes on option click', () => {
    renderSelect();
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Beta'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  test('closes on Escape', () => {
    renderSelect();
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

/* --- Selection --- */
describe('Selection', () => {
  test('selecting option fires onChange', () => {
    const onChange = jest.fn();
    renderSelect({ onChange });
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Beta'));
    expect(onChange).toHaveBeenCalledWith('b');
  });
  test('controlled value', () => {
    renderSelect({ value: 'b' });
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
  test('selected option has aria-selected', () => {
    renderSelect({ value: 'b' });
    fireEvent.click(screen.getByRole('combobox'));
    const opts = screen.getAllByRole('option');
    expect(opts[1]).toHaveAttribute('aria-selected', 'true');
  });
});

/* --- Sizes --- */
describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' class', () => {
      const { container } = renderSelect({ size: s });
      expect(container.querySelector('.select-' + s)).toBeInTheDocument();
    });
  });
});

/* --- Selection styles --- */
describe('Selection styles', () => {
  ['default', 'light', 'solid'].forEach((ss) => {
    test(ss + ' class', () => {
      const { container } = renderSelect({ selectionStyle: ss });
      expect(container.querySelector('.select-style-' + ss)).toBeInTheDocument();
    });
  });
});

/* --- Disabled --- */
describe('Disabled', () => {
  test('disabled class', () => {
    const { container } = renderSelect({ disabled: true });
    expect(container.querySelector('.select-disabled')).toBeInTheDocument();
  });
  test('does not open when disabled', () => {
    renderSelect({ disabled: true });
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

/* --- Start decoration --- */
describe('Start decoration', () => {
  test('renders icon decoration', () => {
    renderSelect({ startDecoration: <SearchIcon data-testid="deco" /> });
    expect(screen.getByTestId('deco')).toBeInTheDocument();
  });
});

/* --- Keyboard --- */
describe('Keyboard', () => {
  test('Enter toggles dropdown', () => {
    renderSelect();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
  test('Space toggles dropdown', () => {
    renderSelect();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: ' ' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Select — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Select aria-label="Select option"><option value="1">Option 1</option></Select>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Select aria-label="Select option"><option value="1">Option 1</option></Select>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Select aria-label="Select option"><option value="1">Option 1</option></Select>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
