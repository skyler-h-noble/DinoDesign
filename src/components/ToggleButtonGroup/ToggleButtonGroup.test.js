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

describe('ToggleButtonGroup — the selection control', () => {
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

  /* THE ONE BREAKING CHANGE in un-retiring this component, recorded here
     because it cannot be detected at runtime and so cannot be warned about
     precisely.

     A bare `<ToggleButtonGroup onChange={fn}>` is ambiguous: it is equally a
     caller written against MUI's (event, value) and one written against this
     system's (value, event). Nothing in the call distinguishes them — arity
     lies, because `(e) => …` is a legal one-argument handler for either.

     Resolved toward the SYSTEM's order, for two reasons. The component spent
     its retirement warning every caller to leave, so the population still on
     the MUI shape is both small and already being told. And going forward
     this is the system's selection control; an onChange that disagreed with
     every other component in the library would be a permanent wrong note to
     avoid a temporary one.

     Callers who signal the old API in any other way — `exclusive`, or a
     colour in `variant` — still get MUI's order, because there the signal is
     unambiguous. */
  it('calls onChange with the system order, (value, event)', () => {
    const onChange = jest.fn();
    render(<Group onChange={onChange} />);
    fireEvent.click(screen.getByText('Grid'));
    expect(onChange).toHaveBeenCalled();
    const [first, second] = onChange.mock.calls[0];
    expect(first).toBe('grid');
    expect(second).toHaveProperty('type', 'click');
  });

  it('keeps MUI order when the caller signals the old API', () => {
    const onChange = jest.fn();
    render(<Group exclusive onChange={onChange} />);
    fireEvent.click(screen.getByText('Grid'));
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
