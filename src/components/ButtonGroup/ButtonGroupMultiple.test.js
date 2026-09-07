import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';

const Group = (props) => (
  <ButtonGroup aria-label="Filters" {...props}>
    <Button value="a">A</Button>
    <Button value="b">B</Button>
    <Button value="c">C</Button>
  </ButtonGroup>
);

describe('multiple selection', () => {
  test('uncontrolled: selects more than one', () => {
    /* The whole point. Without `multiple` the group is a radio set — every
       click replaced the previous selection, so a "select many" group could
       never hold two. */
    const onChange = jest.fn();
    render(<Group multiple onChange={onChange} />);
    fireEvent.click(screen.getByText('A'));
    expect(onChange).toHaveBeenLastCalledWith(['a'], expect.anything());
    fireEvent.click(screen.getByText('C'));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'], expect.anything());
  });

  test('clicking a selected segment deselects it', () => {
    // A multi-select with no way to deselect is a one-way door.
    const onChange = jest.fn();
    render(<Group multiple defaultValue={['a', 'b']} onChange={onChange} />);
    fireEvent.click(screen.getByText('a'.toUpperCase()));
    expect(onChange).toHaveBeenLastCalledWith(['b'], expect.anything());
  });

  test('onChange hands back the NEXT ARRAY, not the clicked value', () => {
    /* So a controlled caller can setState straight from it instead of
       reimplementing the toggle at every call site. */
    const seen = [];
    const Controlled = () => {
      const [v, setV] = useState([]);
      return <Group multiple value={v} onChange={(next) => { seen.push(next); setV(next); }} />;
    };
    render(<Controlled />);
    fireEvent.click(screen.getByText('B'));
    fireEvent.click(screen.getByText('C'));
    expect(seen).toEqual([['b'], ['b', 'c']]);
  });

  test('tolerates a bare value where an array was expected', () => {
    // Guards `.includes` on a caller that passed value="a" with multiple.
    expect(() => render(<Group multiple value="a" />)).not.toThrow();
  });

  test('single mode is unchanged — one at a time, value not an array', () => {
    const onChange = jest.fn();
    render(<Group onChange={onChange} />);
    fireEvent.click(screen.getByText('A'));
    expect(onChange).toHaveBeenLastCalledWith('a', expect.anything());
    fireEvent.click(screen.getByText('B'));
    expect(onChange).toHaveBeenLastCalledWith('b', expect.anything());
  });
});

describe('segments do not lift on hover', () => {
  test('transform is suppressed on every segment', () => {
    /* Button raises itself 1px on hover, which is right alone and wrong in a
       segmented control: one segment rising breaks the shared border and reads
       as the group resizing. */
    const { container } = render(<Group />);
    for (const btn of container.querySelectorAll('button')) {
      expect(window.getComputedStyle(btn).transform).toMatch(/none|^$/);
    }
  });
});
