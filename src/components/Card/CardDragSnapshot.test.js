// A draggable card drops its shadow and lift for the drag-image snapshot,
// then restores; the consumer's onDragStart still runs.
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Card } from './Card';

test('dragstart strips the shadow for one frame and calls the consumer', () => {
  const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 1; });
  const onDragStart = jest.fn();
  const { container } = render(<Card draggable onDragStart={onDragStart}>x</Card>);
  const el = container.querySelector('.omni-card');
  let duringSnapshot = null;
  raf.mockImplementationOnce((cb) => { duringSnapshot = el.classList.contains('omni-card-snap'); cb(0); return 1; });
  fireEvent.dragStart(el);
  expect(duringSnapshot).toBe(true);
  expect(el.classList.contains('omni-card-snap')).toBe(false);
  expect(onDragStart).toHaveBeenCalledTimes(1);
  raf.mockRestore();
});

test('a non-draggable card gets no dragstart handler', () => {
  const { container } = render(<Card>x</Card>);
  expect(container.querySelector('.omni-card').getAttribute('draggable')).toBeNull();
});
