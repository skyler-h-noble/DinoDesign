// SwatchField: Figma's SwatchField — a Swatch with its field label.
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SwatchField } from './SwatchField';

describe('SwatchField', () => {
  test('the label names the swatch and sits above it by default', () => {
    const { container } = render(<SwatchField label="Brand color" color="#e79999" onClick={() => {}} />);
    const field = container.querySelector('.swatch-field');
    expect(field.firstChild).toHaveTextContent('Brand color');
    const labelId = field.firstChild.id || field.firstChild.querySelector('[id]')?.id;
    expect(container.querySelector('[aria-labelledby="' + labelId + '"]')).toBeTruthy();
  });

  test.each([['bottom', 'last'], ['right', 'last'], ['left', 'first']])('labelPosition=%s puts the label %s', (pos, where) => {
    const { container } = render(<SwatchField label="Color" labelPosition={pos} color="#e79999" />);
    const field = container.querySelector('.swatch-field');
    const el = where === 'first' ? field.firstChild : field.lastChild;
    expect(el).toHaveTextContent('Color');
  });

  test('no label is the swatch alone', () => {
    const { container } = render(<SwatchField color="#e79999" aria-label="Color" />);
    expect(container.querySelector('.swatch-field')).toBeNull();
  });
});
