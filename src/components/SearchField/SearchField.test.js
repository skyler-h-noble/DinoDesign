// src/components/SearchField/SearchField.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchField } from './SearchField';
import { axe } from 'jest-axe';

const renderField = (props = {}) =>
  render(<SearchField {...props} />);

/* --- Basic Rendering --- */
describe('SearchField', () => {
  test('renders', () => {
    const { container } = renderField();
    expect(container.querySelector('.search-field')).toBeInTheDocument();
  });

  test('renders input with role="searchbox"', () => {
    renderField();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  test('has aria-label', () => {
    renderField();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  test('custom aria-label', () => {
    renderField({ ariaLabel: 'Find products' });
    expect(screen.getByLabelText('Find products')).toBeInTheDocument();
  });

  test('renders placeholder', () => {
    renderField({ placeholder: 'Search items…' });
    expect(screen.getByPlaceholderText('Search items…')).toBeInTheDocument();
  });
});

/* --- Structure --- */
describe('Structure', () => {
  test('has data-surface="Container-Lowest"', () => {
    const { container } = renderField();
    expect(container.querySelector('[data-surface="Container-Lowest"]')).toBeInTheDocument();
  });

  test('border parent wraps surface container', () => {
    const { container } = renderField();
    const borderBox = container.querySelector('.search-field');
    const surfaceBox = container.querySelector('[data-surface="Container-Lowest"]');
    expect(borderBox).toContainElement(surfaceBox);
  });
});

/* --- Input behavior --- */
describe('Input', () => {
  test('uncontrolled: typing updates value', () => {
    renderField();
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input.value).toBe('hello');
  });

  test('controlled: value prop controls input', () => {
    renderField({ value: 'test', onChange: jest.fn() });
    expect(screen.getByRole('searchbox').value).toBe('test');
  });

  test('onChange fires with value', () => {
    const onChange = jest.fn();
    renderField({ onChange });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledWith('abc', expect.anything());
  });

  test('onSubmit fires on Enter', () => {
    const onSubmit = jest.fn();
    renderField({ onSubmit, defaultValue: 'query' });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledWith('query', expect.anything());
  });
});

/* --- Focus states --- */
describe('Focus states', () => {
  test('focused class on focus', () => {
    const { container } = renderField();
    fireEvent.focus(screen.getByRole('searchbox'));
    expect(container.querySelector('.search-field-focused')).toBeInTheDocument();
  });

  test('focused class removed on blur', () => {
    const { container } = renderField();
    const input = screen.getByRole('searchbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(container.querySelector('.search-field-focused')).not.toBeInTheDocument();
  });

  test('onFocus callback', () => {
    const onFocus = jest.fn();
    renderField({ onFocus });
    fireEvent.focus(screen.getByRole('searchbox'));
    expect(onFocus).toHaveBeenCalled();
  });

  test('onBlur callback', () => {
    const onBlur = jest.fn();
    renderField({ onBlur });
    const input = screen.getByRole('searchbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });
});

/* --- Clear button --- */
describe('Clear button', () => {
  test('not visible when empty', () => {
    renderField();
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  test('visible when has value', () => {
    renderField({ defaultValue: 'hello' });
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  test('clicking clears value', () => {
    renderField({ defaultValue: 'hello' });
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(screen.getByRole('searchbox').value).toBe('');
  });

  test('onClear callback fires', () => {
    const onClear = jest.fn();
    renderField({ defaultValue: 'hello', onClear });
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onClear).toHaveBeenCalled();
  });

  test('Escape clears value', () => {
    renderField({ defaultValue: 'hello' });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    expect(screen.getByRole('searchbox').value).toBe('');
  });

  test('hidden when showClearButton=false', () => {
    renderField({ defaultValue: 'hello', showClearButton: false });
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  test('hidden when disabled', () => {
    renderField({ defaultValue: 'hello', disabled: true });
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });
});

/* --- Filled class --- */
describe('Filled state', () => {
  test('filled class when has value', () => {
    const { container } = renderField({ defaultValue: 'test' });
    expect(container.querySelector('.search-field-filled')).toBeInTheDocument();
  });

  test('no filled class when empty', () => {
    const { container } = renderField();
    expect(container.querySelector('.search-field-filled')).not.toBeInTheDocument();
  });
});

/* --- Sizes --- */
describe('Sizes', () => {
  test('small class', () => {
    const { container } = renderField({ size: 'small' });
    expect(container.querySelector('.search-field-small')).toBeInTheDocument();
  });

  test('medium class (default)', () => {
    const { container } = renderField();
    expect(container.querySelector('.search-field-medium')).toBeInTheDocument();
  });

  test('large class', () => {
    const { container } = renderField({ size: 'large' });
    expect(container.querySelector('.search-field-large')).toBeInTheDocument();
  });
});

/* --- Disabled --- */
describe('Disabled', () => {
  test('disabled class', () => {
    const { container } = renderField({ disabled: true });
    expect(container.querySelector('.search-field-disabled')).toBeInTheDocument();
  });

  test('input is disabled', () => {
    renderField({ disabled: true });
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  test('not disabled by default', () => {
    const { container } = renderField();
    expect(container.querySelector('.search-field-disabled')).not.toBeInTheDocument();
  });
});

/* --- Defaults --- */
describe('Defaults', () => {
  test('default size is medium', () => {
    const { container } = renderField();
    expect(container.querySelector('.search-field-medium')).toBeInTheDocument();
  });

  test('default placeholder', () => {
    renderField();
    expect(screen.getByPlaceholderText('Search\u2026')).toBeInTheDocument();
  });

  test('clear button shown by default', () => {
    renderField({ defaultValue: 'test' });
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('SearchField — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <SearchField aria-label="Search" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <SearchField aria-label="Search" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <SearchField aria-label="Search" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
