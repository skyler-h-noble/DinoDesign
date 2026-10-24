// src/components/Sheet/Sheet.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Sheet } from './Sheet';

describe('Sheet — a bottom sheet (Figma Sheet)', () => {
  test('renders nothing while closed', () => {
    render(<Sheet>Body</Sheet>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('open, it is a modal dialog anchored to the bottom', () => {
    render(<Sheet open aria-label="Share">Body</Sheet>);
    const d = screen.getByRole('dialog', { name: 'Share' });
    expect(d).toHaveAttribute('aria-modal', 'true');
    expect(d).toHaveClass('sheet', 'drawer-bottom');
  });

  test('paints the Container surface by default, and takes another', () => {
    const { rerender } = render(<Sheet open aria-label="S">x</Sheet>);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-surface', 'Container');
    rerender(<Sheet open aria-label="S" surface="Surface-Bright">x</Sheet>);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-surface', 'Surface-Bright');
  });

  test('Escape closes it', () => {
    const onClose = jest.fn();
    render(<Sheet open onClose={onClose} aria-label="S">x</Sheet>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  test('no axe violations', async () => {
    const { baseElement } = render(<Sheet open aria-label="Share"><button>Copy link</button></Sheet>);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
