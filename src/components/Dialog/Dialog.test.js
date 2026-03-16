// src/components/Dialog/Dialog.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, AlertDialog, FormDialog } from './Dialog';
import { Box } from '@mui/material';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderDialog = (props = {}) =>
  render(
    <Dialog open title="Test Dialog" onClose={jest.fn()} {...props}>
      <p>Dialog content</p>
    </Dialog>
  );

/* ─── Basic Rendering ─── */
describe('Dialog', () => {
  test('renders when open', () => {
    renderDialog();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <Dialog open={false} title="Hidden Dialog" onClose={jest.fn()}>
        <p>Content</p>
      </Dialog>
    );
    expect(screen.queryByText('Hidden Dialog')).not.toBeInTheDocument();
  });

  test('renders children', () => {
    renderDialog();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  test('renders title', () => {
    renderDialog();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });
});

/* ─── ARIA ─── */
describe('ARIA', () => {
  test('has aria-labelledby pointing to title', () => {
    renderDialog();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
  });

  test('has aria-describedby pointing to content', () => {
    renderDialog();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description');
  });

  test('alert dialog has role="alertdialog"', () => {
    renderDialog({ alert: true });
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  test('standard dialog has role="dialog"', () => {
    renderDialog();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

/* ─── Close Button ─── */
describe('Close button', () => {
  test('shows close button for standard dialog', () => {
    renderDialog();
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  test('hides close button for alert dialog', () => {
    renderDialog({ alert: true });
    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });

  test('close button calls onClose', () => {
    const onClose = jest.fn();
    renderDialog({ onClose });
    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalled();
  });
});

/* ─── Actions ─── */
describe('Actions', () => {
  test('renders actions', () => {
    renderDialog({
      actions: <button>Confirm</button>,
    });
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('no actions section when actions prop not provided', () => {
    const { container } = renderDialog();
    expect(container.querySelector('.MuiDialogActions-root')).not.toBeInTheDocument();
  });
});

/* ─── Sizes ─── */
describe('Sizes', () => {
  test('renders with class dialog-sm', () => {
    const { baseElement } = renderDialog({ maxWidth: 'sm' });
    expect(baseElement.querySelector('.dialog-sm')).toBeInTheDocument();
  });

  test('renders with class dialog-lg', () => {
    const { baseElement } = renderDialog({ maxWidth: 'lg' });
    expect(baseElement.querySelector('.dialog-lg')).toBeInTheDocument();
  });

  test('fullscreen class', () => {
    const { baseElement } = renderDialog({ fullScreen: true });
    expect(baseElement.querySelector('.dialog-fullscreen')).toBeInTheDocument();
  });
});

/* ─── Alert mode ─── */
describe('Alert mode', () => {
  test('alert class', () => {
    const { baseElement } = renderDialog({ alert: true });
    expect(baseElement.querySelector('.dialog-alert')).toBeInTheDocument();
  });

  test('no alert class by default', () => {
    const { baseElement } = renderDialog();
    expect(baseElement.querySelector('.dialog-alert')).not.toBeInTheDocument();
  });
});

/* ─── AlertDialog convenience ─── */
describe('AlertDialog', () => {
  test('renders with confirm and cancel buttons', () => {
    render(
      <AlertDialog open title="Delete?" onClose={jest.fn()} confirmText="Delete" cancelText="Keep">
        Are you sure?
      </AlertDialog>
    );
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  test('has alertdialog role', () => {
    render(
      <AlertDialog open title="Confirm" onClose={jest.fn()}>
        Content
      </AlertDialog>
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  test('onConfirm fires', () => {
    const onConfirm = jest.fn();
    render(
      <AlertDialog open title="Confirm" onClose={jest.fn()} onConfirm={onConfirm}>
        Content
      </AlertDialog>
    );
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });
});

/* ─── FormDialog convenience ─── */
describe('FormDialog', () => {
  test('renders with submit and cancel', () => {
    render(
      <FormDialog open title="Form" onClose={jest.fn()} submitText="Save" cancelText="Discard">
        <input />
      </FormDialog>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Discard')).toBeInTheDocument();
  });

  test('has dialog role (not alertdialog)', () => {
    render(
      <FormDialog open title="Form" onClose={jest.fn()}>
        <input />
      </FormDialog>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('shows close button', () => {
    render(
      <FormDialog open title="Form" onClose={jest.fn()}>
        <input />
      </FormDialog>
    );
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default maxWidth is sm', () => {
    const { baseElement } = renderDialog();
    expect(baseElement.querySelector('.dialog-sm')).toBeInTheDocument();
  });

  test('not fullscreen by default', () => {
    const { baseElement } = renderDialog();
    expect(baseElement.querySelector('.dialog-fullscreen')).not.toBeInTheDocument();
  });

  test('not alert by default', () => {
    const { baseElement } = renderDialog();
    expect(baseElement.querySelector('.dialog-alert')).not.toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Dialog — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Dialog open={false} aria-labelledby="dialog-title"><div id="dialog-title">Title</div></Dialog>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Dialog open={false} aria-labelledby="dialog-title"><div id="dialog-title">Title</div></Dialog>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Dialog open={false} aria-labelledby="dialog-title"><div id="dialog-title">Title</div></Dialog>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
