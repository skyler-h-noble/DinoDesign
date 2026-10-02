// src/components/Button/buttonContentType.test.js
//
// Figma models TYPE as ONE axis — text | iconOnly | letterNumber | Avatar —
// and the code modelled it as three independent booleans, which can express
// combinations the design has no drawing for. `contentType` is that axis.
//
// It is NOT called `type`: that is the HTML button attribute, undeclared here
// and therefore passed to the DOM, so a form's type="submit" must keep working.
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button, BUTTON_CONTENT_TYPES } from './Button';

describe('Button — contentType is one axis', () => {
  let warn;
  beforeEach(() => { warn = jest.spyOn(console, 'warn').mockImplementation(() => {}); });
  afterEach(() => { warn.mockRestore(); });
  const warnings = () => warn.mock.calls.filter(([f]) => String(f).startsWith('[Button]'));

  test('the four values are the Figma axis, in order', () => {
    expect(BUTTON_CONTENT_TYPES).toEqual(['text', 'iconOnly', 'letterNumber', 'avatar']);
  });

  test.each(BUTTON_CONTENT_TYPES)('contentType="%s" renders without complaint', (t) => {
    render(<Button contentType={t} aria-label="Thing">X</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(warnings()).toHaveLength(0);
  });

  test('`type` still reaches the DOM — it is the HTML attribute, not the axis', () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  test('an unknown contentType warns and falls back to text', () => {
    render(<Button contentType="square">X</Button>);
    expect(warnings()).toHaveLength(1);
    expect(warnings()[0][0]).toMatch(/is not a type/);
  });

  test('two booleans at once warn — the design has no such drawing', () => {
    render(<Button iconOnly avatar aria-label="Both">X</Button>);
    expect(warnings()).toHaveLength(1);
    expect(warnings()[0][0]).toMatch(/Type is ONE axis/);
  });

  test('one boolean alone is still silent, so nothing existing breaks', () => {
    render(<Button iconOnly aria-label="Delete">X</Button>);
    expect(warnings()).toHaveLength(0);
  });
});
