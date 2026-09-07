import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';
import { TextArea } from '../TextField/TextField';

/* The standard label must be ASSOCIATED with the field, not merely adjacent.
 *
 * It rendered as a bare <label> with no htmlFor, and the input is its SIBLING
 * rather than its child — so there was no association, explicit or implicit.
 * With labelPosition="standard", which is the default, a screen reader
 * announced the field as unlabelled while sighted users saw the label right
 * above it. Nothing about the render looked wrong. */

describe('standard label is associated with its field', () => {
  test('getByLabelText finds the input', () => {
    // This query mirrors the accessibility tree — if it cannot find the field,
    // neither can a screen reader.
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('the label htmlFor matches the field id', () => {
    const { container } = render(<Input label="Email" />);
    const label = container.querySelector('label');
    const field = container.querySelector('input');
    expect(label.getAttribute('for')).toBeTruthy();
    expect(label.getAttribute('for')).toBe(field.getAttribute('id'));
  });

  test('a caller-supplied id wins', () => {
    const { container } = render(<Input label="Email" id="my-field" />);
    expect(container.querySelector('input').id).toBe('my-field');
    expect(container.querySelector('label').getAttribute('for')).toBe('my-field');
  });

  test('two fields on one page do not collide', () => {
    // useId, not a module counter — two instances must not share an id.
    const { container } = render(
      <><Input label="First" /><Input label="Second" /></>,
    );
    const ids = Array.from(container.querySelectorAll('input')).map(i => i.id);
    expect(new Set(ids).size).toBe(2);
  });

  test('multiline associates too', () => {
    render(<Input label="Message" multiline rows={3} />);
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
  });
});

describe('TextArea is Input, multiline', () => {
  /* It used to be a second implementation wrapping MUI directly, and had
     drifted: no borderRadius (so it inherited MUI's corner instead of
     --Input-Radius, which the STUDIO ships a CSS override to paper over),
     error/errorMessage where Input says validation, and no size, variant,
     colour, adornments or floating label. */
  test('renders a textarea with the requested rows', () => {
    render(<TextArea label="Message" rows={4} />);
    const ta = screen.getByLabelText('Message');
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta.getAttribute('rows')).toBe('4');
  });

  test('error maps onto Input validation', () => {
    render(<TextArea label="Bio" error errorMessage="Too long" />);
    expect(screen.getByText('Too long')).toBeInTheDocument();
  });

  test('inherits everything Input has — adornments, sizes, floating label', () => {
    expect(() => render(
      <TextArea label="Bio" size="large" labelPosition="floating"
                variant="success-outline" />,
    )).not.toThrow();
  });

  test('resize defaults to vertical, never the browser default', () => {
    /* The browser default is `both`, which lets a user drag a textarea wider
       than its column and break the layout. `none` is deliberately not the
       default either — enlarging a textarea to read what you have typed is a
       real affordance for low-vision and motor users. */
    const { container } = render(<TextArea label="Bio" />);
    const css = Array.from(document.styleSheets)
      .flatMap(ss => { try { return Array.from(ss.cssRules); } catch { return []; } })
      .map(r => r.cssText).join('');
    expect(css.replace(/\s+/g, '')).toContain('resize:vertical');
    expect(container.querySelector('textarea')).toBeInTheDocument();
  });
});
