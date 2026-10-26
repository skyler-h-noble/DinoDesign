// CarouselDots: Figma's Carousel Dot, and the row a carousel uses.
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { CarouselDots } from './CarouselDots';

function Controlled({ count = 5, start = 0 }) {
  const [v, setV] = useState(start);
  return <CarouselDots count={count} value={v} onChange={setV} />;
}

describe('CarouselDots', () => {
  test('each dot is named for its slide; the current one is aria-current', () => {
    render(<Controlled start={2} />);
    expect(screen.getByRole('button', { name: 'Slide 3 of 5' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Slide 1 of 5' })).not.toHaveAttribute('aria-current');
  });

  test('one tab stop — the current dot', () => {
    render(<Controlled start={1} />);
    const dots = screen.getAllByRole('button');
    expect(dots.filter((d) => d.tabIndex === 0)).toEqual([dots[1]]);
  });

  test('arrows, Home and End move the selection and the focus', () => {
    render(<Controlled start={0} />);
    const first = screen.getByRole('button', { name: 'Slide 1 of 5' });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'Slide 2 of 5' })).toHaveAttribute('aria-current', 'true');
    expect(document.activeElement).toHaveAccessibleName('Slide 2 of 5');
    fireEvent.keyDown(document.activeElement, { key: 'End' });
    expect(document.activeElement).toHaveAccessibleName('Slide 5 of 5');
    fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveAccessibleName('Slide 1 of 5');
  });

  test('clicking a dot selects it', () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Slide 4 of 5' }));
    expect(screen.getByRole('button', { name: 'Slide 4 of 5' })).toHaveAttribute('aria-current', 'true');
  });

  test('no axe violations', async () => {
    const { container } = render(<Controlled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
