import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldGroup } from './FieldGroup';
import { Checkbox } from '../Checkbox';

const options = (
  <>
    <Checkbox label="Colors" />
    <Checkbox label="Typography" />
  </>
);

/* A <legend> inside a <fieldset> is the only markup that makes a set of
   controls announce as ONE question. Without it a screen reader reads two
   unrelated checkboxes and the user never learns what they are choosing
   between. */
describe('it is a real group', () => {
  test('renders a fieldset with a legend', () => {
    const { container } = render(<FieldGroup label="Delivery">{options}</FieldGroup>);
    const fs = container.querySelector('fieldset');
    expect(fs).toBeInTheDocument();
    expect(fs.querySelector('legend')).toHaveTextContent('Delivery');
  });

  /* THE REGRESSION THIS FILE EXISTS TO CATCH. A fieldset takes its name from
     its first <legend> CHILD, so wrapping the legend in anything — FormLabel's
     row div, say — leaves role="group" with no name at all. The caption still
     renders and sighted users still read it; only a screen reader notices. */
  test('the legend is a DIRECT child of the fieldset', () => {
    const { container } = render(<FieldGroup label="Delivery">{options}</FieldGroup>);
    const fs = container.querySelector('fieldset');
    const legend = container.querySelector('legend');
    expect(legend.parentElement).toBe(fs);
  });

  test('and keeps its name when More Info is present', () => {
    render(
      <FieldGroup label="Delivery" moreInfo={{ label: 'About delivery', href: '#' }}>
        {options}
      </FieldGroup>);
    expect(screen.getByRole('group', { name: 'Delivery' })).toBeInTheDocument();
  });

  /* More Info sits OUTSIDE the legend for the same reason it sits outside a
     label: inside, its name joins the group's — "Delivery About delivery". */
  test('More Info is a sibling of the legend, not a child', () => {
    const { container } = render(
      <FieldGroup label="Delivery" moreInfo={{ label: 'About delivery', href: '#' }}>
        {options}
      </FieldGroup>);
    const legend = container.querySelector('legend');
    expect(container.querySelector('.form-label-more-info')).toBeInTheDocument();
    expect(legend.querySelector('.form-label-more-info')).toBeNull();
  });

  test('the legend is not a label, so it claims no control', () => {
    const { container } = render(<FieldGroup label="Delivery">{options}</FieldGroup>);
    expect(container.querySelector('legend')).not.toHaveAttribute('for');
  });

  test('is reachable by its group name', () => {
    render(<FieldGroup label="Delivery">{options}</FieldGroup>);
    expect(screen.getByRole('group', { name: 'Delivery' })).toBeInTheDocument();
  });

  /* A fieldset arrives with a border, margin and padding of its own. Correct
     markup should not cost an inherited appearance. */
  test('the browser fieldset chrome is reset', () => {
    const { container } = render(<FieldGroup label="D">{options}</FieldGroup>);
    const el = container.querySelector('fieldset');
    const cls = (el.getAttribute('class') || '').split(/\s+/).find((c) => c.startsWith('css-'));
    const css = Array.from(document.styleSheets)
      .flatMap((s) => Array.from(s.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText).join('\n');
    expect(css).toContain('border: 0');
    expect(css).toContain('padding: 0');
  });
});

/* "Choose one" is a fact about the SET, not about any option in it. Putting
   the wiring on an option would announce the same error once per option and
   leave the group itself valid. */
describe('validation belongs to the group', () => {
  test('aria-invalid lands on the fieldset', () => {
    const { container } = render(
      <FieldGroup label="Delivery" validation="error" validationMessage="Choose one">
        {options}
      </FieldGroup>);
    expect(container.querySelector('fieldset')).toHaveAttribute('aria-invalid', 'true');
  });

  test('and not on any option', () => {
    const { container } = render(
      <FieldGroup label="Delivery" validation="error" validationMessage="Choose one">
        {options}
      </FieldGroup>);
    for (const input of container.querySelectorAll('input')) {
      expect(input).not.toHaveAttribute('aria-invalid');
    }
  });

  test('the message is described by the fieldset, in helper-then-message order', () => {
    const { container } = render(
      <FieldGroup label="Delivery" helperText="Pick a speed"
                  validation="error" validationMessage="Choose one">
        {options}
      </FieldGroup>);
    const ids = container.querySelector('fieldset').getAttribute('aria-describedby').split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0])).toHaveTextContent('Pick a speed');
    expect(document.getElementById(ids[1])).toHaveTextContent('Choose one');
  });

  test('no describedby when there is nothing to describe', () => {
    const { container } = render(
      <FieldGroup label="Delivery" showHelper={false}>{options}</FieldGroup>);
    expect(container.querySelector('fieldset')).not.toHaveAttribute('aria-describedby');
  });

  test('a non-error validation does not mark it invalid', () => {
    const { container } = render(
      <FieldGroup label="D" validation="success" validationMessage="Looks good">
        {options}
      </FieldGroup>);
    expect(container.querySelector('fieldset')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByText('Looks good')).toBeInTheDocument();
  });
});

/* A group can be required too — and it is the case where the marker matters
   most, since the error belongs to the set rather than to any one option. */
describe('the group can be required', () => {
  test('the legend takes the marker', () => {
    render(<FieldGroup label="Delivery" type="required">{options}</FieldGroup>);
    expect(screen.getByText(/Required/)).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('orientation', () => {
  test.each([['vertical', 'column'], ['horizontal', 'row']])(
    '%s stacks the options as %s', (orientation, direction) => {
      const { container } = render(
        <FieldGroup label="D" orientation={orientation}>{options}</FieldGroup>);
      const el = container.querySelector('.field-group-options');
      const cls = (el.getAttribute('class') || '').split(/\s+/).find((c) => c.startsWith('css-'));
      const css = Array.from(document.styleSheets)
        .flatMap((s) => Array.from(s.cssRules || []))
        .filter((r) => (r.selectorText || '').includes('.' + cls))
        .map((r) => r.cssText).join('\n');
      expect(css).toContain('flex-direction: ' + direction);
    });
});
