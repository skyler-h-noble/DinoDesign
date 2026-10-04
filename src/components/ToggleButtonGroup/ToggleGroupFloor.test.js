/**
 * A toggle group always has at least one segment on.
 *
 * That is the whole distinction between the two components, and it is a
 * BEHAVIOUR rather than a style. ButtonGroup is a row of buttons that happen
 * to be joined — Save, Cancel, Delete, none of them "on", because none of
 * them is a state. ToggleButtonGroup is a control with a value: left / centre
 * / right alignment, where the text is aligned somehow whatever you click, so
 * "none selected" is not a state the thing being controlled can be in.
 *
 * The retirement collapsed the two on the reasoning that they rendered the
 * same. They do. That was never the difference.
 */
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleButtonGroup } from './ToggleButtonGroup';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { Button } from '../Button/Button';

function Multi({ Group, ...props }) {
  const [value, setValue] = useState(['left']);
  return (
    <Group multiple value={value} onChange={setValue} aria-label="Align" {...props}>
      <Button value="left">Left</Button>
      <Button value="center">Center</Button>
    </Group>
  );
}

const pressed = (name) =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed');

describe('the floor of one', () => {
  it('will not let the last segment be turned off', () => {
    render(<Multi Group={ToggleButtonGroup} />);
    expect(pressed('Left')).toBe('true');
    fireEvent.click(screen.getByText('Left'));
    expect(pressed('Left')).toBe('true');
  });

  /* The floor is only on the LAST one. A toggle group that refused every
     deselection would be a group of radio buttons wearing the wrong clothes. */
  it('still deselects while something else is on', () => {
    render(<Multi Group={ToggleButtonGroup} />);
    fireEvent.click(screen.getByText('Center'));
    expect(pressed('Center')).toBe('true');
    fireEvent.click(screen.getByText('Left'));
    expect(pressed('Left')).toBe('false');
    expect(pressed('Center')).toBe('true');
  });

  /* ButtonGroup keeps the old behaviour — a filter row genuinely can be
     cleared, and that is the case the default was written for. */
  it('ButtonGroup can still be emptied', () => {
    render(<Multi Group={ButtonGroup} />);
    fireEvent.click(screen.getByText('Left'));
    expect(pressed('Left')).toBe('false');
  });

  /* Opt out, for a clearable multi-select that wants toggle styling. Without
     it the only way to get one is ButtonGroup, which loses the floor for
     every other group in the file too. */
  it('lets a caller opt out of the floor', () => {
    render(<Multi Group={ToggleButtonGroup} allowEmpty />);
    fireEvent.click(screen.getByText('Left'));
    expect(pressed('Left')).toBe('false');
  });

  /* Blocked silently. The click asks for a state the user already has minus
     something they cannot remove, so firing onChange with an unchanged array
     would make a controlled caller re-render for nothing and read as a bug in
     their own reducer. */
  it('does not fire onChange when the click is refused', () => {
    const onChange = jest.fn();
    render(
      <ToggleButtonGroup multiple value={['left']} onChange={onChange} aria-label="Align">
        <Button value="left">Left</Button>
        <Button value="center">Center</Button>
      </ToggleButtonGroup>
    );
    fireEvent.click(screen.getByText('Left'));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Center'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  /* Single-select never could empty — clicking the selected segment
     re-selects it — so the floor is already there and `allowEmpty` has
     nothing to say about it. */
  it('is already true of single select, in both components', () => {
    for (const Group of [ToggleButtonGroup, ButtonGroup]) {
      const { unmount } = render(
        <Group value="left" onChange={() => {}} aria-label="Align">
          <Button value="left">Left</Button>
          <Button value="center">Center</Button>
        </Group>
      );
      fireEvent.click(screen.getByText('Left'));
      expect(pressed('Left')).toBe('true');
      unmount();
    }
  });
});
