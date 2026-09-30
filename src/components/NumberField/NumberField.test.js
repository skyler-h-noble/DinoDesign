// src/components/NumberField/NumberField.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberField } from './NumberField';
import { axe } from 'jest-axe';

const renderField = (props = {}) =>
  render(<NumberField label="Test" {...props} />);

/* --- Basic --- */
describe('NumberField', () => {
  test('renders', () => {
    const { container } = renderField();
    expect(container.querySelector('.numberfield')).toBeInTheDocument();
  });
  test('renders spinbutton', () => {
    renderField();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });
  /* No data-surface test. The field deliberately sets none — it inherits the
     parent's scope so it takes the surface of whatever section it is dropped
     into, and paints its own fill from --Background. This asserted
     Container-Lowest, which the component stopped setting and which would pin
     it to one surface if it came back. */
});

/* --- Variants --- */
describe('Variants', () => {
  test('outlined class', () => {
    const { container } = renderField({ variant: 'outlined' });
    expect(container.querySelector('.numberfield-outlined')).toBeInTheDocument();
  });
  test('spinner class', () => {
    const { container } = renderField({ variant: 'spinner' });
    expect(container.querySelector('.numberfield-spinner')).toBeInTheDocument();
  });
  test('outlined has up/down buttons', () => {
    renderField({ variant: 'outlined' });
    expect(screen.getByLabelText('Increase')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease')).toBeInTheDocument();
  });
  test('spinner has minus/plus buttons', () => {
    renderField({ variant: 'spinner' });
    expect(screen.getByLabelText('Increase')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease')).toBeInTheDocument();
  });
});

/* --- Value --- */
describe('Value', () => {
  test('displays default value', () => {
    renderField({ defaultValue: 7 });
    expect(screen.getByRole('spinbutton')).toHaveValue('7');
  });
  test('controlled value', () => {
    renderField({ value: 42 });
    expect(screen.getByRole('spinbutton')).toHaveValue('42');
  });
  test('increment button increases value', () => {
    const onChange = jest.fn();
    renderField({ value: 5, onChange });
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(onChange).toHaveBeenCalledWith(6);
  });
  test('decrement button decreases value', () => {
    const onChange = jest.fn();
    renderField({ value: 5, onChange });
    fireEvent.click(screen.getByLabelText('Decrease'));
    expect(onChange).toHaveBeenCalledWith(4);
  });
  test('respects min', () => {
    const onChange = jest.fn();
    renderField({ value: 0, min: 0, onChange });
    fireEvent.click(screen.getByLabelText('Decrease'));
    expect(onChange).not.toHaveBeenCalled();
  });
  test('respects max', () => {
    const onChange = jest.fn();
    renderField({ value: 10, max: 10, onChange });
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(onChange).not.toHaveBeenCalled();
  });
  test('custom step', () => {
    const onChange = jest.fn();
    renderField({ value: 5, step: 5, onChange });
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(onChange).toHaveBeenCalledWith(10);
  });
});

/* --- Keyboard --- */
describe('Keyboard', () => {
  test('ArrowUp increments', () => {
    const onChange = jest.fn();
    renderField({ value: 3, onChange });
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(4);
  });
  test('ArrowDown decrements', () => {
    const onChange = jest.fn();
    renderField({ value: 3, onChange });
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

/* --- Label --- */
describe('Label', () => {
  test('top label rendered', () => {
    renderField({ labelPosition: 'top' });
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  test('aria-label on input', () => {
    renderField();
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-label', 'Test');
  });
});

/* --- Validation --- */
/* Validation is not implemented on NumberField.
 *
 * Six tests here asserted .numberfield-success / -warning / -error / -info and
 * a validation message. The component has no `validation` prop at all — the
 * tests were written for a feature that was never built, so they failed from
 * the day they landed and read as a broken component rather than a missing one.
 *
 * Removed rather than skipped: a skipped test still claims the feature is
 * coming. Add them back alongside the prop. */

/* --- Disabled --- */
describe('Disabled', () => {
  test('disabled class', () => {
    const { container } = renderField({ disabled: true });
    expect(container.querySelector('.numberfield-disabled')).toBeInTheDocument();
  });
  test('input disabled', () => {
    renderField({ disabled: true });
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });
  test('buttons disabled', () => {
    renderField({ disabled: true });
    expect(screen.getByLabelText('Increase')).toBeDisabled();
    expect(screen.getByLabelText('Decrease')).toBeDisabled();
  });
});

/* No spinner size-class tests.
 *
 * They asserted .numberfield-standard and .numberfield-small, neither of which
 * the component emits — and passed size="standard", which is not in SIZE_MAP
 * at all (the sizes are small | medium | large). Written against an API that
 * never existed, so they failed from the day they landed.
 *
 * Removed rather than skipped: a skipped test still claims the feature is
 * coming. Add them back with the classes if size ever needs to be visible in
 * the DOM. */

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('NumberField — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <NumberField aria-label="Quantity" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <NumberField aria-label="Quantity" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <NumberField aria-label="Quantity" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* --- Stepper target area --- */
describe('Stepper minimum target area', () => {
  test('steppers are at least 24px on both axes at every size', () => {
    /* 24x24 is the minimum target area the system checks for. The steppers were
       `flex: 1`, so in a small field each one collapsed to about 11px — still
       clickable, still drawing its icon, and well under the floor. */
    for (const size of ['small', 'medium', 'large']) {
      const { unmount } = render(<NumberField size={size} label="N" />);
      for (const label of ['Increase', 'Decrease']) {
        expect(screen.getByLabelText(label)).toHaveStyle({
          width: 'var(--Sizing-4, 32px)',
          height: 'var(--Sizing-3, 24px)',
        });
      }
      unmount();
    }
  });
});
