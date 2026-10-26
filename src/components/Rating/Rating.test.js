// src/components/Rating/Rating.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Rating } from './Rating';
import { axe } from 'jest-axe';

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

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Rating — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Rating aria-label="Rating" value={3} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Rating aria-label="Rating" value={3} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Rating aria-label="Rating" value={3} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ─── Figma's Star / RatingField ─── */
describe('Matches Figma', () => {
  const cssFor = (el) => {
    const out = [];
    for (const sheet of document.styleSheets) for (const r of sheet.cssRules) {
      try { if (el.matches(r.selectorText)) out.push(r.cssText); } catch (e) { /* skip */ }
    }
    return out.join('\n');
  };

  test('stars are icons: --Icons-{C}, no stroke or shadow', () => {
    const { container } = render(<Rating defaultValue={3} color="primary" />);
    const star = container.querySelector('button');
    const c = cssFor(star);
    expect(c).toContain('color: var(--Icons-Primary)');
    expect(c).not.toMatch(/drop-shadow|stroke/);
  });

  test('a solid star when selected, an outline when not', () => {
    const { container } = render(<Rating defaultValue={1} max={2} />);
    expect(container.querySelector('[data-testid="StarIcon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="StarBorderIcon"]')).toBeInTheDocument();
  });

  test('label names the group and sits above by default', () => {
    const { container } = render(<Rating label="Quality" defaultValue={2} />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName(/Quality/);
    const field = container.querySelector('.rating-field');
    expect(field.firstChild).toHaveTextContent('Quality');
  });

  test('labelPosition="bottom" puts the label under the stars', () => {
    const { container } = render(<Rating label="Quality" labelPosition="bottom" />);
    expect(container.querySelector('.rating-field').lastChild).toHaveTextContent('Quality');
  });
});

describe('Half precision is keyboard-usable', () => {
  test('every star is a focusable radio, and arrows step by a half', () => {
    const onChange = jest.fn();
    render(<Rating precision={0.5} defaultValue={2} onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);
    radios.forEach((r) => expect(r).toHaveAttribute('tabindex', '0'));
    radios[1].focus();
    fireEvent.keyDown(radios[1], { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(2.5);
  });

  test('clicking the left half picks the half value', () => {
    const onChange = jest.fn();
    const { container } = render(<Rating precision={0.5} onChange={onChange} />);
    const firstStar = screen.getAllByRole('radio')[2];
    fireEvent.click(firstStar.querySelector('[aria-hidden="true"]'));
    expect(onChange).toHaveBeenCalledWith(2.5);
    expect(container).toBeTruthy();
  });
});
