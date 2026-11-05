/**
 * A selected segment must look like the Button it stands for — bevel
 * included. The group paints the selected fill, edge and label through
 * .omni-seg-sel; the BEVEL is the Button variant's own box-shadow, so the
 * segment has to be rendered as that variant.
 *
 * A child that names a segment shape (`-outline`, which warnSegmentShape asks
 * segments to be) used to keep it when selected: the right fill from the
 * group, the outline's flat shadow from the Button — "flat in the right
 * color" next to a beveled Button of the same color.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button/Button';
import { ButtonGroup } from './ButtonGroup';
import { ToggleButtonGroup } from '../ToggleButtonGroup/ToggleButtonGroup';

const vars = (el) => ['--_b-sh', '--_b-sh-h', '--_b-sh-a', '--_b-bg', '--_b-bd']
  .map((p) => el.style.getPropertyValue(p));
const btn = (name) => screen.getByRole('button', { name });

describe('a selected segment carries the Button bevel', () => {
  test.each(['default', 'secondary', 'black-white'])('%s: a joined toggle segment matches the Button of that variant', (color) => {
    render(
      <>
        <Button variant={color}>Ref</Button>
        <ToggleButtonGroup color={color} value="b" onChange={() => {}} aria-label="g">
          <Button value="a">A</Button>
          <Button value="b">B</Button>
          <Button value="c">C</Button>
        </ToggleButtonGroup>
      </>
    );
    const ref = btn('Ref'); const seg = btn('B');
    expect(vars(seg)).toEqual(vars(ref));
    expect(vars(ref)[0]).toMatch(/inset/);      // the bevel is really there
    expect(seg.className).toContain('btn-' + color + ' ');
    expect(seg.className).toContain('omni-btn-solid');
  });

  test('a child that names an outline variant still gets the bevel when selected', () => {
    render(
      <>
        <Button variant="secondary">Ref</Button>
        <ToggleButtonGroup color="secondary" value="b" onChange={() => {}} aria-label="g">
          <Button value="a" variant="secondary-outline">A</Button>
          <Button value="b" variant="secondary-outline">B</Button>
        </ToggleButtonGroup>
      </>
    );
    expect(vars(btn('B'))).toEqual(vars(btn('Ref')));
    expect(btn('B').className).toMatch(/\bbtn-secondary\b(?!-)/);
    // The unselected one keeps the outline it asked for — same as an outline Button.
    expect(btn('A').className).toContain('btn-secondary-outline');
    expect(btn('A').style.getPropertyValue('--_b-sh')).toBe('none');
  });

  test('size follows through: a small selected segment = a small Button', () => {
    render(
      <>
        <Button variant="primary" size="small">Ref</Button>
        <ToggleButtonGroup color="primary" size="small" value="b" onChange={() => {}} aria-label="g">
          <Button value="a" variant="primary-outline">A</Button>
          <Button value="b" variant="primary-outline">B</Button>
        </ToggleButtonGroup>
      </>
    );
    expect(vars(btn('B'))).toEqual(vars(btn('Ref')));
    expect(vars(btn('B'))[0]).toContain('--Sm-Button-Highlight-Offset-x');
  });

  test('a child that names a SOLID variant still wins (and warns)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ButtonGroup color="secondary" value="b" onChange={() => {}}>
        <Button value="a">A</Button>
        <Button value="b" variant="error">B</Button>
      </ButtonGroup>
    );
    expect(btn('B').className).toContain('btn-error');
    warn.mockRestore();
  });
});
