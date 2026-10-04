/**
 * Marks are dots on the bar, and `step={null}` restricts the thumb to them.
 *
 * They were `width: 2, height: totalTrack` filled with styles.rail — the full
 * thickness of the bar, in --Background. Each mark therefore cut a
 * background-colored notch clean through the track, so a row of them read as a
 * dashed line rather than a scale; on a vertical slider the track itself looked
 * dotted. Nothing about that is obviously a bug in the source: a 2px-wide
 * full-height rectangle is a plausible tick, and --Background is a real token.
 *
 * RESTRICTED VALUES is MUI's `step={null}`: the thumb may only land on the
 * values in the marks array. It already worked by passthrough, but the mark
 * density guard divided by step, so null gave Infinity and warned on every
 * render of the one configuration that is always correct.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Slider } from './Slider';

const MARKS = [
  { value: 0, label: '0°C' },
  { value: 20, label: '20°C' },
  { value: 37, label: '37°C' },
  { value: 100, label: '100°C' },
];

describe('Slider marks', () => {
  it('renders one mark per entry, with its label', () => {
    const { container } = render(<Slider value={20} marks={MARKS} step={null} />);
    expect(container.querySelectorAll('.MuiSlider-mark')).toHaveLength(MARKS.length);
    expect(container.querySelectorAll('.MuiSlider-markLabel')).toHaveLength(MARKS.length);
  });

  it('restricts the thumb to the mark values when step is null', () => {
    /* The whole point of restricted values: MUI drops the step grid and snaps
       to the marks. aria-valuemin/max still describe the range, so the control
       stays announceable. */
    const { container } = render(<Slider value={37} marks={MARKS} step={null} />);
    const input = container.querySelector('input[type="range"]');
    expect(input.getAttribute('aria-valuenow')).toBe('37');
    expect(input.step).toBe('any');
  });

  it('survives marks={true} with step={null} instead of throwing', () => {
    /* MUI maps over the marks array in restricted-values mode, so `true` throws
       "marks.map is not a function" — a message naming neither prop. The
       combination is meaningless anyway: restricted values means snap to THESE
       values, and `true` names none. Coerced to no marks, with a warning that
       says which prop to change. */
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => render(<Slider value={20} marks step={null} />)).not.toThrow();
    const told = warn.mock.calls.filter((c) => /restricted values needs the/i.test(String(c[0])));
    expect(told.length).toBeGreaterThan(0);
    warn.mockRestore();
  });

  it('does not warn about density when the thumb snaps to marks', () => {
    /* step={null} has no step to count, so the density guard must not fire. */
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Slider value={20} marks={MARKS} step={null} />);
    const hatched = warn.mock.calls.filter((c) => /hatched band/.test(String(c[0])));
    expect(hatched).toHaveLength(0);
    warn.mockRestore();
  });

  it('still warns when marks={true} would draw an unreadable number', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Slider value={50} marks step={1} />);
    const hatched = warn.mock.calls.filter((c) => /hatched band/.test(String(c[0])));
    expect(hatched.length).toBeGreaterThan(0);
    warn.mockRestore();
  });
});
