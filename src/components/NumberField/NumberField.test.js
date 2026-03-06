// src/components/NumberField/NumberField.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberField } from './NumberField';

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
  test('has data-surface', () => {
    const { container } = renderField();
    expect(container.querySelector('[data-surface="Container-Lowest"]')).toBeInTheDocument();
  });
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
describe('Validation', () => {
  ['success', 'warning', 'error', 'info'].forEach((v) => {
    test(v + ' class', () => {
      const { container } = renderField({ validation: v, validationMessage: 'msg' });
      expect(container.querySelector('.numberfield-' + v)).toBeInTheDocument();
    });
  });
  test('validation message displayed', () => {
    renderField({ validation: 'error', validationMessage: 'Invalid number' });
    expect(screen.getByText('Invalid number')).toBeInTheDocument();
  });
});

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

/* --- Spinner sizes --- */
describe('Spinner sizes', () => {
  test('standard size class', () => {
    const { container } = renderField({ variant: 'spinner', size: 'standard' });
    expect(container.querySelector('.numberfield-standard')).toBeInTheDocument();
  });
  test('small size class', () => {
    const { container } = renderField({ variant: 'spinner', size: 'small' });
    expect(container.querySelector('.numberfield-small')).toBeInTheDocument();
  });
});
