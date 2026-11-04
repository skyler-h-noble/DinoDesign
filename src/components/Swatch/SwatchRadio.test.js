// A radio-style swatch is one control: no nested form input, and it reports
// its state as a radio, not a toggle button.
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Swatch } from './Swatch';

describe('Swatch radio', () => {
  const setup = () => render(
    <div role="radiogroup" aria-label="Color">
      <Swatch color="#556b2f" radio selected aria-label="Olive" onClick={() => {}} />
      <Swatch color="#ffc0cb" radio aria-label="Pink" onClick={() => {}} />
    </div>
  );
  test('is a radio with aria-checked, not a pressed button', () => {
    setup();
    const olive = screen.getByRole('radio', { name: 'Olive' });
    expect(olive).toHaveAttribute('aria-checked', 'true');
    expect(olive).not.toHaveAttribute('aria-pressed');
    expect(screen.getByRole('radio', { name: 'Pink' })).toHaveAttribute('aria-checked', 'false');
  });
  test('contains no nested input', () => {
    const { container } = setup();
    expect(container.querySelector('button input')).toBeNull();
  });
  test('passes axe', async () => {
    const { container } = setup();
    expect(await axe(container)).toHaveNoViolations();
  });
  test('a plain clickable swatch is still a toggle button', () => {
    render(<Swatch color="#556b2f" selected aria-label="Olive" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Olive' })).toHaveAttribute('aria-pressed', 'true');
  });
});
