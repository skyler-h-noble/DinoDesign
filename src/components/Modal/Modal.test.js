// src/components/Modal/Modal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

const renderModal = (props = {}) =>
  render(<Modal open={true} onClose={jest.fn()} title="Test Modal" {...props}>Modal content</Modal>);

/* --- Basic --- */
describe('Modal', () => {
  test('renders when open', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  test('does not render when closed', () => {
    render(<Modal open={false} onClose={jest.fn()}>Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  test('renders children', () => {
    renderModal();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
  test('renders title', () => {
    renderModal();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });
});

/* --- data-surface --- */
describe('Surface', () => {
  test('has data-surface="Container-High"', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-surface', 'Container-High');
  });
});

/* --- Variants --- */
describe('Variants', () => {
  test('default — no data-theme', () => {
    renderModal({ variant: 'default' });
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-theme');
  });
  test('soft — data-theme Primary-Light', () => {
    renderModal({ variant: 'soft', color: 'primary' });
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'Primary-Light');
  });
  test('solid — data-theme Primary', () => {
    renderModal({ variant: 'solid', color: 'primary' });
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'Primary');
  });
  test('solid info → Info-Medium', () => {
    renderModal({ variant: 'solid', color: 'info' });
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'Info-Medium');
  });
  test('soft success → Success-Light', () => {
    renderModal({ variant: 'soft', color: 'success' });
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'Success-Light');
  });
});

/* --- Classes --- */
describe('Classes', () => {
  test('variant class', () => {
    const { container } = renderModal({ variant: 'solid' });
    expect(container.querySelector('.modal-solid')).toBeInTheDocument();
  });
  test('size class', () => {
    const { container } = renderModal({ size: 'large' });
    expect(container.querySelector('.modal-large')).toBeInTheDocument();
  });
  test('layout class', () => {
    const { container } = renderModal({ layout: 'fullscreen' });
    expect(container.querySelector('.modal-fullscreen')).toBeInTheDocument();
  });
  test('color class for themed', () => {
    const { container } = renderModal({ variant: 'soft', color: 'error' });
    expect(container.querySelector('.modal-error')).toBeInTheDocument();
  });
});

/* --- ARIA --- */
describe('ARIA', () => {
  test('aria-modal', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
  test('aria-label from title', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Test Modal');
  });
});

/* --- Close --- */
describe('Close', () => {
  test('close button present', () => {
    renderModal();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });
  test('close button fires onClose', () => {
    const onClose = jest.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });
  test('Escape fires onClose', () => {
    const onClose = jest.fn();
    renderModal({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
  test('backdrop click fires onClose', () => {
    const onClose = jest.fn();
    const { container } = renderModal({ onClose, closeOnBackdrop: true });
    const backdrop = container.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
  test('backdrop click does not fire when disabled', () => {
    const onClose = jest.fn();
    const { container } = renderModal({ onClose, closeOnBackdrop: false });
    const backdrop = container.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });
  test('no close button when showCloseButton=false', () => {
    renderModal({ showCloseButton: false });
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });
});

/* --- Sizes --- */
describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' class', () => {
      const { container } = renderModal({ size: s });
      expect(container.querySelector('.modal-' + s)).toBeInTheDocument();
    });
  });
});

/* --- Defaults --- */
describe('Defaults', () => {
  test('default variant', () => {
    const { container } = renderModal();
    expect(container.querySelector('.modal-default')).toBeInTheDocument();
  });
  test('default size medium', () => {
    const { container } = renderModal();
    expect(container.querySelector('.modal-medium')).toBeInTheDocument();
  });
  test('default layout center', () => {
    const { container } = renderModal();
    expect(container.querySelector('.modal-center')).toBeInTheDocument();
  });
});
