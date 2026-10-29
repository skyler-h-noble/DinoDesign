// src/components/DatePicker/DatePicker.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ChevronLeftIcon from '@omni-design/icons/ChevronLeft';
import ChevronRightIcon from '@omni-design/icons/ChevronRight';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * DatePicker — a month calendar, single date or a range.
 *
 * Built off the Figma `Month` component (Date Picker page): a Calendar Header
 * (ghost icon buttons either side of the month name), a weekday row, and six
 * week rows of Day Cells. DayCell is exported on its own too — the Figma set
 * `Day Cell` (Selection x State) is what the parity page compares.
 *
 *   <DatePicker value={date} onChange={setDate} />
 *   <DatePicker selectionMode="range" value={[start, end]} onChange={setRange} />
 *
 * COLOR: one Buttons palette for the selected day and the range band,
 * `default` unless the design pins one — same rule as Stepper and Checkbox.
 *
 * KEYBOARD (the WAI-ARIA date grid pattern):
 *   arrows        a day / a week
 *   Home / End    start / end of the week
 *   PageUp/Down   previous / next month (with Shift: year)
 *   Enter, Space  select
 * One day is in the tab order at a time (roving tabindex), so Tab moves out of
 * the grid rather than through 31 buttons.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const PALETTES = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

/* ── date helpers (local time, no library) ─────────────────────────────── */
const atNoon = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
const sameDay = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d, n) => { const x = atNoon(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d, n) => {
  const x = atNoon(d); const day = x.getDate();
  x.setDate(1); x.setMonth(x.getMonth() + n);
  const last = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
  x.setDate(Math.min(day, last));
  return x;
};
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 12);
const before = (a, b) => atNoon(a) < atNoon(b);

/* ── DayCell ───────────────────────────────────────────────────────────── */

/* One day, 36px square: Sizing-Quarter (2px) round a Button-Height circle.
 *
 *   selection   default | today | selected | range-start | range-middle | range-end
 *
 * The RANGE BAND is a 32px strip behind the circle, the Button fill at 50% —
 * full width on range-middle, the inner half on range-start / range-end, so
 * the band runs edge to edge across a row and the ends are round. The circle
 * itself fills only on selected / range-start / range-end; today is a ring.
 *
 * Text follows its fill: --Buttons-<C>-Text on a filled circle (invariant 3:
 * the label is derived from the fill), the palette's Outline-Quiet elsewhere.
 */

export const DayCell = React.forwardRef(function DayCell({
  day,
  selection = 'default',
  color = 'default',
  disabled = false,
  focusable = true,
  onClick,
  /* Props for the 36px cell itself (a grid puts role="gridcell" here); the
     rest go to the day button. */
  cellProps = {},
  className = '',
  sx = {},
  ...props
}, ref) {
  const C = cap(PALETTES.includes(color) ? color : 'default');
  const filled = selection === 'selected' || selection === 'range-start' || selection === 'range-end';
  const ringed = filled || selection === 'today';
  const band = selection === 'range-middle' ? 'full'
    : selection === 'range-start' ? 'right'
    : selection === 'range-end' ? 'left' : null;

  return (
    <Box
      {...cellProps}
      className={'day-cell day-cell-' + selection + ' ' + className}
      sx={{
        position: 'relative',
        width: 'calc(var(--Button-Height, 32px) + 4px)',
        height: 'calc(var(--Button-Height, 32px) + 4px)',
        padding: 'var(--Sizing-Quarter, 2px)',
        boxSizing: 'border-box',
        flexShrink: 0,
        ...(disabled && { opacity: 'var(--Disabled, 0.38)' }),
        ...sx,
      }}
    >
      {band && (
        <Box
          aria-hidden="true"
          className="day-cell-band"
          sx={{
            position: 'absolute',
            top: 'var(--Sizing-Quarter, 2px)',
            height: 'var(--Button-Height, 32px)',
            left: band === 'right' ? '50%' : 0,
            right: band === 'left' ? '50%' : 0,
            /* The Button fill at 50%, as Figma's Backfill / Left-Fill /
               Right-Fill draw it. In the color rather than as layer opacity so
               a disabled cell's 38% multiplies the band once, not twice. */
            backgroundColor: 'color-mix(in srgb, var(--Buttons-' + C + '-Button) 50%, transparent)',
          }}
        />
      )}
      <Box
        ref={ref}
        component="button"
        type="button"
        disabled={disabled}
        tabIndex={focusable ? 0 : -1}
        onClick={onClick}
        className="day-cell-day"
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'var(--Button-Height, 32px)',
          height: 'var(--Button-Height, 32px)',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          borderRadius: '50%',
          border: ringed ? 'var(--Button-Border-Width, 1px) solid var(--Buttons-' + C + '-Border)' : 'none',
          backgroundColor: filled ? 'var(--Buttons-' + C + '-Button)' : 'transparent',
          /* Filled: the text paired with the fill. Unfilled: the outline
             button's quiet label for this palette — Figma binds
             Buttons › Outline-Quiet, which is Quiet-<Palette> under Tonal
             text and the surface's Quiet under Black & White. */
          /* range-middle sits on the 50% band, where the quiet label fails
             (4.19:1 on Surf's Up) — it takes the fill's text, as Figma binds. */
          color: filled || selection === 'range-middle' ? 'var(--Buttons-' + C + '-Text)'
            : 'var(--Buttons-' + C + '-Outline-Quiet, var(--Outline-Quiet, var(--Quiet)))',
          /* The step number's type: Button-Numbers at the button weight, the
             button face (see Stepper for why the body face is the 2nd step). */
          fontFamily: 'var(--Font-Family-Button, var(--Font-Family-Body, inherit))',
          fontSize: 'var(--Button-Numbers, 14px)',
          fontWeight: 'var(--Button-Font-Weight, 600)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
          ...(!disabled && {
            /* Hover lifts every day to Level-1 elevation; a filled one also
               takes the palette's Hover. Pressed drops the lift. */
            '&:hover': {
              boxShadow: SHADOW_LEVEL_1,
              ...(filled && { backgroundColor: 'var(--Buttons-' + C + '-Hover)' }),
            },
            '&:active': {
              boxShadow: 'none',
              ...(filled && { backgroundColor: 'var(--Buttons-' + C + '-Pressed)' }),
            },
          }),
          '&:focus-visible, &.Mui-focusVisible': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '1px',
          },
        }}
        {...props}
      >
        {day}
      </Box>
    </Box>
  );
});

/* ── DatePicker ────────────────────────────────────────────────────────── */

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DatePicker({
  value = null,
  onChange,
  selectionMode = 'single',
  defaultMonth,
  month: monthProp,
  onMonthChange,
  minDate,
  maxDate,
  isDateDisabled,
  today: todayProp,
  weekStartsOn = 0,
  color = 'default',
  locale,
  className = '',
  sx = {},
  ...props
}) {
  const today = useMemo(() => atNoon(todayProp || new Date()), [todayProp]);
  const isRange = selectionMode === 'range';
  const [start, end] = isRange ? (Array.isArray(value) ? value : [null, null]) : [value, null];

  const [ownMonth, setOwnMonth] = useState(() => startOfMonth(defaultMonth || start || today));
  const month = monthProp ? startOfMonth(monthProp) : ownMonth;
  const setMonth = useCallback((m) => {
    const next = startOfMonth(m);
    if (!monthProp) setOwnMonth(next);
    onMonthChange?.(next);
  }, [monthProp, onMonthChange]);

  const [focusDate, setFocusDate] = useState(() => atNoon(start || today));
  const shouldFocus = useRef(false);
  const dayRefs = useRef(new Map());

  const disabledDay = useCallback((d) =>
    (minDate && before(d, minDate)) || (maxDate && before(maxDate, d)) || !!isDateDisabled?.(d),
  [minDate, maxDate, isDateDisabled]);

  // Keep the roving focus inside the visible month.
  const focusInMonth = focusDate.getMonth() === month.getMonth() && focusDate.getFullYear() === month.getFullYear()
    ? focusDate : month;

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    dayRefs.current.get(focusInMonth.getDate())?.focus();
  });

  const moveFocus = (d) => {
    shouldFocus.current = true;
    setFocusDate(d);
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) setMonth(d);
  };

  const select = (d) => {
    if (disabledDay(d)) return;
    if (!isRange) { onChange?.(d); return; }
    // First click starts a range; a second click on or after it ends it; a
    // click before the start restarts from there.
    if (!start || end || before(d, start)) onChange?.([d, null]);
    else onChange?.([start, d]);
  };

  const onKeyDown = (e) => {
    const k = e.key;
    const map = {
      ArrowLeft: () => addDays(focusInMonth, -1),
      ArrowRight: () => addDays(focusInMonth, 1),
      ArrowUp: () => addDays(focusInMonth, -7),
      ArrowDown: () => addDays(focusInMonth, 7),
      Home: () => addDays(focusInMonth, -((focusInMonth.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focusInMonth, 6 - ((focusInMonth.getDay() - weekStartsOn + 7) % 7)),
      PageUp: () => addMonths(focusInMonth, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focusInMonth, e.shiftKey ? 12 : 1),
    };
    if (map[k]) { e.preventDefault(); moveFocus(map[k]()); }
  };

  const selectionFor = (d) => {
    if (isRange && start && end) {
      if (sameDay(d, start) && sameDay(d, end)) return 'selected';
      if (sameDay(d, start)) return 'range-start';
      if (sameDay(d, end)) return 'range-end';
      if (before(start, d) && before(d, end)) return 'range-middle';
    } else if (sameDay(d, start)) return 'selected';
    if (sameDay(d, today)) return 'today';
    return 'default';
  };

  // Six rows of seven, leading and trailing blanks, as Figma's Month draws.
  const lead = (month.getDay() - weekStartsOn + 7) % 7;
  const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const n = i - lead + 1;
    return n >= 1 && n <= daysIn ? new Date(month.getFullYear(), month.getMonth(), n, 12) : null;
  });
  const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const weekdays = Array.from({ length: 7 }, (_, i) => WEEKDAYS[(i + weekStartsOn) % 7]);

  const fmtMonth = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const fmtWeekday = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const titleId = useMemo(() => 'dp-title-' + Math.random().toString(36).slice(2, 8), []);

  return (
    <Box
      className={'date-picker ' + className}
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        width: 'calc((var(--Button-Height, 32px) + 4px) * 7)',
        backgroundColor: 'var(--Background)',
        /* Figma's Month: an unbound 4px corner. */
        borderRadius: '4px',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {/* Calendar Header — Figma pins it to the Primary theme at Surface-Dim. */}
      <Box
        className="date-picker-header"
        data-theme="Primary"
        data-surface="Surface-Dim"
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 48, backgroundColor: 'var(--Background)', color: 'var(--Text)',
        }}
      >
        <Button iconOnly variant="ghost" aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronLeftIcon />
        </Button>
        <Typography id={titleId} textStyle="body-semibold" aria-live="polite">{fmtMonth.format(month)}</Typography>
        <Button iconOnly variant="ghost" aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRightIcon />
        </Button>
      </Box>

      {/* Month Grid — Container-Highest. */}
      <Box
        className="date-picker-grid"
        data-surface="Container-Highest"
        role="grid"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--Background)' }}
      >
        <Box role="row" sx={{ display: 'flex' }}>
          {weekdays.map((w, i) => (
            <Box
              key={w}
              role="columnheader"
              aria-label={fmtWeekday.format(new Date(2026, 1, 1 + ((i + weekStartsOn) % 7), 12))}
              sx={{ width: 'calc(var(--Button-Height, 32px) + 4px)', height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Typography textStyle="label-small" color="quiet">{w}</Typography>
            </Box>
          ))}
        </Box>
        {weeks.map((week, wi) => (
          <Box key={wi} role="row" sx={{ display: 'flex' }}>
            {week.map((d, di) => {
              if (!d) return <Box key={di} role="gridcell" sx={{ width: 'calc(var(--Button-Height, 32px) + 4px)', height: 'calc(var(--Button-Height, 32px) + 4px)' }} />;
              const sel = selectionFor(d);
              const chosen = sel === 'selected' || sel === 'range-start' || sel === 'range-end' || sel === 'range-middle';
              return (
                  <DayCell
                    key={di}
                    cellProps={{ role: 'gridcell', 'aria-selected': chosen }}
                    ref={(el) => { if (el) dayRefs.current.set(d.getDate(), el); else dayRefs.current.delete(d.getDate()); }}
                    day={d.getDate()}
                    selection={sel}
                    color={color}
                    disabled={disabledDay(d)}
                    focusable={sameDay(d, focusInMonth)}
                    aria-label={fmtDay.format(d)}
                    aria-current={sameDay(d, today) ? 'date' : undefined}
                    onClick={() => { setFocusDate(d); select(d); }}
                  />
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default DatePicker;
