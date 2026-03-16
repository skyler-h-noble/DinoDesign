// src/components/Snackbar/Snackbar.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Snackbar } from './Snackbar';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderSnackbar = (props = {}) =>
  render(
    <Snackbar open={true} onClose={jest.fn()} {...props}>
      Test notification
    </Snackbar>
  );

/* ─── Basic Rendering ─── */
describe('Snackbar', () => {
  test('renders when open', () => {
    renderSnackbar();
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<Snackbar open={false} onClose={jest.fn()}>Hidden</Snackbar>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  test('has role="alert"', () => {
    renderSnackbar();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('has aria-live="polite"', () => {
    renderSnackbar();
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
  });

  test('has aria-atomic="true"', () => {
    renderSnackbar();
    expect(screen.getByRole('alert')).toHaveAttribute('aria-atomic', 'true');
  });
});

/* ─── data-surface ─── */
describe('data-surface', () => {
  test('always has data-surface="Container-High"', () => {
    renderSnackbar();
    expect(screen.getByRole('alert')).toHaveAttribute('data-surface', 'Container-High');
  });

  test('data-surface="Container-High" on standard', () => {
    renderSnackbar({ variant: 'standard' });
    expect(screen.getByRole('alert')).toHaveAttribute('data-surface', 'Container-High');
  });

  test('data-surface="Container-High" on solid', () => {
    renderSnackbar({ variant: 'solid', color: 'primary' });
    expect(screen.getByRole('alert')).toHaveAttribute('data-surface', 'Container-High');
  });

  test('data-surface="Container-High" on light', () => {
    renderSnackbar({ variant: 'light', color: 'primary' });
    expect(screen.getByRole('alert')).toHaveAttribute('data-surface', 'Container-High');
  });
});

/* ─── Standard variant ─── */
describe('Standard variant', () => {
  test('no data-theme on standard', () => {
    const { container } = renderSnackbar({ variant: 'standard' });
    expect(container.querySelector('.snackbar')).not.toHaveAttribute('data-theme');
  });

  test('has snackbar-standard class', () => {
    const { container } = renderSnackbar({ variant: 'standard' });
    expect(container.querySelector('.snackbar-standard')).toBeInTheDocument();
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info-Medium'], ['success', 'Success-Medium'],
    ['warning', 'Warning-Medium'], ['error', 'Error-Medium'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderSnackbar({ variant: 'solid', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme', () => {
  const cases = [
    ['primary', 'Primary-Light'], ['secondary', 'Secondary-Light'], ['tertiary', 'Tertiary-Light'],
    ['neutral', 'Neutral-Light'], ['info', 'Info-Light'], ['success', 'Success-Light'],
    ['warning', 'Warning-Light'], ['error', 'Error-Light'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderSnackbar({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderSnackbar({ size: s });
      expect(container.querySelector('.snackbar-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Anchors ─── */
describe('Anchor classes', () => {
  ['top', 'bottom'].forEach((a) => {
    test(a + ' anchor class', () => {
      const { container } = renderSnackbar({ anchor: a });
      expect(container.querySelector('.snackbar-' + a)).toBeInTheDocument();
    });
  });
});

/* ─── Close mechanisms ─── */
describe('Close mechanisms', () => {
  test('Escape key triggers onClose with reason "escapeKeyDown"', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'escapeKeyDown');
  });

  test('close button triggers onClose with reason "closeClick"', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose });
    fireEvent.click(screen.getByLabelText('Close notification'));
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'closeClick');
  });

  test('close button has aria-label', () => {
    renderSnackbar();
    expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
  });

  test('close button is a button element', () => {
    renderSnackbar();
    expect(screen.getByLabelText('Close notification').tagName).toBe('BUTTON');
  });

  test('close button has snackbar-close class', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-close')).toBeInTheDocument();
  });
});

/* ─── Auto-hide ─── */
describe('Auto-hide', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  test('triggers onClose after autoHideDuration', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose, autoHideDuration: 3000 });
    expect(onClose).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(3000); });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'timeout');
  });

  test('does not auto-close without autoHideDuration', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose });
    act(() => { jest.advanceTimersByTime(10000); });
    expect(onClose).not.toHaveBeenCalledWith(expect.anything(), 'timeout');
  });
});

/* ─── Decorators ─── */
describe('Decorators', () => {
  test('startDecorator renders', () => {
    render(
      <Snackbar open={true} onClose={jest.fn()} startDecorator={<span data-testid="start">★</span>}>
        Message
      </Snackbar>
    );
    expect(screen.getByTestId('start')).toBeInTheDocument();
  });

  test('startDecorator has snackbar-start-decorator class', () => {
    const { container } = render(
      <Snackbar open={true} onClose={jest.fn()} startDecorator={<span>★</span>}>
        Message
      </Snackbar>
    );
    expect(container.querySelector('.snackbar-start-decorator')).toBeInTheDocument();
  });

  test('endDecorator renders', () => {
    render(
      <Snackbar open={true} onClose={jest.fn()} endDecorator={<span data-testid="end">✓</span>}>
        Message
      </Snackbar>
    );
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });

  test('endDecorator has snackbar-end-decorator class', () => {
    const { container } = render(
      <Snackbar open={true} onClose={jest.fn()} endDecorator={<span>✓</span>}>
        Message
      </Snackbar>
    );
    expect(container.querySelector('.snackbar-end-decorator')).toBeInTheDocument();
  });
});

/* ─── Action ─── */
describe('Action slot', () => {
  test('action renders', () => {
    render(
      <Snackbar open={true} onClose={jest.fn()} action={<button data-testid="action-btn">Undo</button>}>
        Message
      </Snackbar>
    );
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  test('action has snackbar-action class', () => {
    const { container } = render(
      <Snackbar open={true} onClose={jest.fn()} action={<button>Undo</button>}>
        Message
      </Snackbar>
    );
    expect(container.querySelector('.snackbar-action')).toBeInTheDocument();
  });
});

/* ─── Message ─── */
describe('Message', () => {
  test('message has snackbar-message class', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-message')).toBeInTheDocument();
  });

  test('renders children as message', () => {
    renderSnackbar();
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });
});

/* ─── No close button when no onClose ─── */
describe('No onClose', () => {
  test('no close button rendered when onClose is undefined', () => {
    render(<Snackbar open={true}>No close</Snackbar>);
    expect(screen.queryByLabelText('Close notification')).not.toBeInTheDocument();
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default anchor is bottom', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-bottom')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-medium')).toBeInTheDocument();
  });

  test('default variant is standard', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-standard')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Snackbar — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Snackbar open={false} message="Test message" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Snackbar open={false} message="Test message" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Snackbar open={false} message="Test message" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
