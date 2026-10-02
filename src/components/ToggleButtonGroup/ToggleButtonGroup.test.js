/**
 * ToggleButtonGroup is retired — these test the SHIM, not the old component.
 *
 * The suite that was here asserted MUI class names and MUI's DOM, which is the
 * implementation that was removed. Keeping those would have pinned the very
 * thing being retired. What matters now is that the public names still work,
 * that the two prop translations are right, and that nobody is left with a
 * silently broken selection.
 */
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ToggleButtonGroup, ToggleButton,
  PrimaryToggleButtonGroup, BlackWhiteToggleButtonGroup,
} from './ToggleButtonGroup';

const Group = (props) => (
  <ToggleButtonGroup aria-label="View" {...props}>
    <ToggleButton value="list">List</ToggleButton>
    <ToggleButton value="grid">Grid</ToggleButton>
  </ToggleButtonGroup>
);

describe('ToggleButtonGroup (retired shim)', () => {
  it('still renders its segments', () => {
    render(<Group />);
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Grid')).toBeInTheDocument();
  });

  it('conveys the selected segment to a screen reader', () => {
    /* The one capability worth protecting through the swap. ButtonGroup sets
       aria-pressed on each segment; MUI's ToggleButton did too. A shim that
       dropped it would look identical and be unusable without sight. */
    render(<Group value="grid" />);
    expect(screen.getByText('Grid').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('List').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('SWAPS the onChange arguments', () => {
    /* The dangerous translation. MUI calls (event, value); ButtonGroup calls
       (value, event). Not swapping would hand every existing caller an event
       where it expects a value — no error, no warning, a selection that never
       updates. Asserted on the first argument's SHAPE, because both are
       objects and a wrong order still "works" until someone reads it. */
    const onChange = jest.fn();
    render(<Group onChange={onChange} />);
    fireEvent.click(screen.getByText('Grid'));
    expect(onChange).toHaveBeenCalled();
    /* The shim hands back MUI's order — (event, value) — because that is what
       existing callers were written against. ButtonGroup's own order is the
       reverse, which is exactly what the shim exists to translate. */
    const [first, second] = onChange.mock.calls[0];
    expect(first).toHaveProperty('type', 'click');
    expect(second).toBe('grid');
  });

  it('inverts exclusive into multiple', () => {
    /* exclusive=true (the default) is multiple=false. The two are the same
       selection model named oppositely, which is most of why the duplication
       survived this long.

       Two independent renders rather than a rerender: rerender keeps the same
       component instance, so useState would not reinitialise and the array
       mode would start life holding the single mode's string. */
    const Controlled = ({ exclusive, initial }) => {
      const [v, setV] = useState(initial);
      /* MUI order, matching what the shim emits. */
      return <Group exclusive={exclusive} value={v} onChange={(_e, next) => setV(next)} />;
    };

    const single = render(<Controlled exclusive initial="list" />);
    fireEvent.click(screen.getByText('Grid'));
    expect(screen.getByText('List').closest('button')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Grid').closest('button')).toHaveAttribute('aria-pressed', 'true');
    single.unmount();

    render(<Controlled exclusive={false} initial={['list']} />);
    fireEvent.click(screen.getByText('Grid'));
    expect(screen.getByText('List').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Grid').closest('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps the color presets working', () => {
    /* They ship publicly, so a stale import must not become a build error —
       the same reason variant="{color}-light" still renders after 0.9.0. */
    render(
      <PrimaryToggleButtonGroup aria-label="a">
        <ToggleButton value="x">X</ToggleButton>
      </PrimaryToggleButtonGroup>,
    );
    render(
      <BlackWhiteToggleButtonGroup aria-label="b">
        <ToggleButton value="y">Y</ToggleButton>
      </BlackWhiteToggleButtonGroup>,
    );
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Y')).toBeInTheDocument();
  });

  it('warns once, not on every render', () => {
    /* A deprecation that fires per render is noise people learn to ignore.
       Module-level flag, same as the -light variant warning. */
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Group />);
    render(<Group />);
    expect(spy.mock.calls.filter(c => String(c[0]).includes('ToggleButtonGroup')).length)
      .toBeLessThanOrEqual(1);
    spy.mockRestore();
  });
});
