// src/components/Rating/Rating.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Rating } from './Rating';

const renderRating = (props = {}) =>
  render(<Rating {...props} />);

/* --- Basic --- */
describe('Rating', () => {
  test('renders', () => {
    const { container } = renderRating({ value: 3 });
    expect(container.querySelector('.rating')).toBeInTheDocument();
  });
  test('renders 5 stars by default', () => {
    renderRating({ value: 3 });
    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);
  });
  test('custom max', () => {
    renderRating({ value: 2, max: 10 });
    expect(screen.getAllByRole('radio')).toHaveLength(10);
  });
});

/* --- Colors --- */
describe('Colors', () => {
  ['default', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'].forEach((c) => {
    test(c + ' class', () => {
      const { container } = renderRating({ value: 3, color: c });
      expect(container.querySelector('.rating-' + c)).toBeInTheDocument();
    });
  });
});

/* --- Sizes --- */
describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' class', () => {
      const { container } = renderRating({ value: 3, size: s });
      expect(container.querySelector('.rating-' + s)).toBeInTheDocument();
    });
  });
});

/* --- Controlled --- */
describe('Controlled', () => {
  test('displays correct value', () => {
    renderRating({ value: 4 });
    const stars = screen.getAllByRole('radio');
    expect(stars[3]).toHaveAttribute('aria-checked', 'true');
    expect(stars[4]).toHaveAttribute('aria-checked', 'false');
  });
  test('onChange fires on click', () => {
    const onChange = jest.fn();
    renderRating({ value: 2, onChange });
    fireEvent.click(screen.getAllByRole('radio')[3]);
    expect(onChange).toHaveBeenCalledWith(4);
  });
  test('clicking same value clears', () => {
    const onChange = jest.fn();
    renderRating({ value: 3, onChange });
    fireEvent.click(screen.getAllByRole('radio')[2]);
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

/* --- Uncontrolled --- */
describe('Uncontrolled', () => {
  test('starts with defaultValue', () => {
    renderRating({ defaultValue: 2 });
    const stars = screen.getAllByRole('radio');
    expect(stars[1]).toHaveAttribute('aria-checked', 'true');
  });
});

/* --- Read only --- */
describe('Read only', () => {
  test('readonly class', () => {
    const { container } = renderRating({ value: 3, readOnly: true });
    expect(container.querySelector('.rating-readonly')).toBeInTheDocument();
  });
  test('uses role img', () => {
    renderRating({ value: 3, readOnly: true });
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  test('no radio roles', () => {
    renderRating({ value: 3, readOnly: true });
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });
});

/* --- No rating --- */
describe('No rating', () => {
  test('empty class', () => {
    const { container } = renderRating({ value: null });
    expect(container.querySelector('.rating-empty')).toBeInTheDocument();
  });
  test('shows empty label', () => {
    renderRating({ value: null });
    expect(screen.getByText('No rating')).toBeInTheDocument();
  });
  test('custom empty label', () => {
    renderRating({ value: null, emptyLabel: 'Not rated yet' });
    expect(screen.getByText('Not rated yet')).toBeInTheDocument();
  });
});

/* --- Disabled --- */
describe('Disabled', () => {
  test('disabled class', () => {
    const { container } = renderRating({ value: 3, disabled: true });
    expect(container.querySelector('.rating-disabled')).toBeInTheDocument();
  });
});

/* --- Keyboard --- */
describe('Keyboard', () => {
  test('ArrowRight increases', () => {
    const onChange = jest.fn();
    renderRating({ value: 2, onChange });
    fireEvent.keyDown(screen.getAllByRole('radio')[1], { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(3);
  });
  test('ArrowLeft decreases', () => {
    const onChange = jest.fn();
    renderRating({ value: 2, onChange });
    fireEvent.keyDown(screen.getAllByRole('radio')[1], { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
