// src/components/DatePicker/DatePicker.test.js
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { DatePicker, DayCell } from './DatePicker';

const SEPT_15 = new Date(2026, 8, 15, 12);
const day = (n) => screen.getByRole('button', { name: new RegExp(`September ${n}, 2026`) });

function Single(props) {
  const [v, setV] = useState(props.initial ?? null);
  return <DatePicker today={SEPT_15} defaultMonth={SEPT_15} value={v} onChange={setV} {...props} />;
}
function Range(props) {
  const [v, setV] = useState(props.initial ?? [null, null]);
  return <DatePicker selectionMode="range" today={SEPT_15} defaultMonth={SEPT_15} value={v} onChange={setV} {...props} />;
}

describe('DatePicker — the month', () => {
  test('draws the month name and every day, Sunday first', () => {
    render(<Single />);
    expect(screen.getByText('September 2026')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    for (let n = 1; n <= 30; n++) expect(day(n)).toBeInTheDocument();
  });

  test('six rows of seven, with leading blanks — Sept 1 2026 is a Tuesday', () => {
    const { container } = render(<Single />);
    const rows = container.querySelectorAll('[role="grid"] > [role="row"]');
    expect(rows).toHaveLength(7); // weekday row + 6 weeks
    const firstWeek = rows[1].querySelectorAll('[role="gridcell"]');
    expect(firstWeek).toHaveLength(7);
    expect(firstWeek[1].textContent).toBe('');
    expect(firstWeek[1].querySelector('button')).toBeNull();
    expect(firstWeek[2].textContent).toBe('1');
  });

  test('weekStartsOn moves the first column', () => {
    render(<Single weekStartsOn={1} />);
    expect(screen.getAllByRole('columnheader')[0].textContent).toBe('Mo');
  });

  test('previous / next change the month', () => {
    render(<Single />);
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('October 2026')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('August 2026')).toBeInTheDocument();
  });

  test('today is marked aria-current="date" and drawn as a ring', () => {
    render(<Single />);
    expect(day(15)).toHaveAttribute('aria-current', 'date');
    expect(day(15).closest('.day-cell')).toHaveClass('day-cell-today');
  });
});

describe('DatePicker — single selection', () => {
  test('clicking a day selects it', () => {
    render(<Single />);
    fireEvent.click(day(20));
    expect(day(20).closest('.day-cell')).toHaveClass('day-cell-selected');
    expect(day(20).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
  });

  test('disabled days do not select and are disabled buttons', () => {
    const onChange = jest.fn();
    render(<DatePicker today={SEPT_15} defaultMonth={SEPT_15} minDate={new Date(2026, 8, 10)} onChange={onChange} />);
    expect(day(5)).toBeDisabled();
    fireEvent.click(day(5));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(day(12));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('DatePicker — range selection', () => {
  test('two clicks make a range: start, middle, end', () => {
    render(<Range />);
    fireEvent.click(day(10));
    fireEvent.click(day(14));
    expect(day(10).closest('.day-cell')).toHaveClass('day-cell-range-start');
    expect(day(12).closest('.day-cell')).toHaveClass('day-cell-range-middle');
    expect(day(14).closest('.day-cell')).toHaveClass('day-cell-range-end');
  });

  test('a click before the start restarts the range', () => {
    render(<Range />);
    fireEvent.click(day(10));
    fireEvent.click(day(4));
    expect(day(4).closest('.day-cell')).toHaveClass('day-cell-selected');
    expect(day(10).closest('.day-cell')).toHaveClass('day-cell-default');
  });

  test('the range band is drawn behind start, middle and end only', () => {
    const { container } = render(<Range initial={[new Date(2026, 8, 10), new Date(2026, 8, 12)]} />);
    expect(container.querySelectorAll('.day-cell-band')).toHaveLength(3);
  });
});

describe('DatePicker — keyboard', () => {
  test('one day is in the tab order (roving tabindex)', () => {
    render(<Single initial={new Date(2026, 8, 20, 12)} />);
    const tabbable = screen.getAllByRole('button').filter((b) => b.getAttribute('tabindex') === '0' && /September/.test(b.getAttribute('aria-label') || ''));
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toBe(day(20));
  });

  test('arrows move focus by a day and a week; PageDown changes month', () => {
    render(<Single initial={new Date(2026, 8, 20, 12)} />);
    day(20).focus();
    fireEvent.keyDown(day(20), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(day(21));
    fireEvent.keyDown(day(21), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(day(28));
    fireEvent.keyDown(day(28), { key: 'PageDown' });
    expect(screen.getByText('October 2026')).toBeInTheDocument();
    expect(document.activeElement).toHaveAccessibleName(/October 28, 2026/);
  });

  test('Home / End go to the start and end of the week', () => {
    render(<Single initial={new Date(2026, 8, 16, 12)} />); // a Wednesday
    day(16).focus();
    fireEvent.keyDown(day(16), { key: 'Home' });
    expect(document.activeElement).toBe(day(13));
    fireEvent.keyDown(day(13), { key: 'End' });
    expect(document.activeElement).toBe(day(19));
  });
});

describe('DayCell — paint follows the fill', () => {
  const css = (el) => {
    const out = [];
    for (const sheet of document.styleSheets) for (const r of sheet.cssRules) {
      try { if (el.matches(r.selectorText)) out.push(r.cssText); } catch (e) { /* skip */ }
    }
    return out.join('\n');
  };

  test('a filled day takes the palette text paired with the fill', () => {
    const { container } = render(<DayCell day={3} selection="selected" />);
    const c = css(container.querySelector('.day-cell-day'));
    expect(c).toContain('var(--Buttons-Default-Button)');
    expect(c).toContain('var(--Buttons-Default-Text)');
  });

  test('an unfilled day reads the palette Outline-Quiet, not the button text', () => {
    const { container } = render(<DayCell day={3} color="secondary" />);
    const c = css(container.querySelector('.day-cell-day'));
    expect(c).toContain('var(--Buttons-Secondary-Outline-Quiet');
    expect(c).not.toContain('var(--Buttons-Secondary-Text)');
  });

  test('today is a ring with no fill', () => {
    const { container } = render(<DayCell day={3} selection="today" />);
    const c = css(container.querySelector('.day-cell-day'));
    expect(c).toContain('var(--Buttons-Default-Border)');
    expect(c).not.toContain('var(--Buttons-Default-Button)');
  });
});

describe('DatePicker — accessibility (jest-axe)', () => {
  test('no violations, single', async () => {
    const { container } = render(<Single initial={new Date(2026, 8, 20, 12)} />);
    expect(await axe(container)).toHaveNoViolations();
  });
  test('no violations, range', async () => {
    const { container } = render(<Range initial={[new Date(2026, 8, 10), new Date(2026, 8, 14)]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
