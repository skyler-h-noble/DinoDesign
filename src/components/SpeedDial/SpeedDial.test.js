// src/components/SpeedDial/SpeedDial.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpeedDial } from './SpeedDial';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const ACTIONS = [
  { icon: <span data-testid="icon-edit">E</span>, name: 'Edit' },
  { icon: <span data-testid="icon-share">S</span>, name: 'Share' },
  { icon: <span data-testid="icon-delete">D</span>, name: 'Delete' },
];

const renderDial = (props = {}) =>
  render(<SpeedDial actions={ACTIONS} ariaLabel="Test Speed Dial" {...props} />);

/* ─── Basic Rendering ─── */
describe('SpeedDial', () => {
  test('renders', () => {
    const { container } = renderDial();
    expect(container.querySelector('.speed-dial')).toBeInTheDocument();
  });

  test('renders FAB button', () => {
    const { container } = renderDial();
    expect(container.querySelector('.speed-dial-fab')).toBeInTheDocument();
  });

  test('FAB has aria-label', () => {
    renderDial();
    expect(screen.getByLabelText('Test Speed Dial')).toBeInTheDocument();
  });

  test('FAB has aria-haspopup="menu"', () => {
    renderDial();
    expect(screen.getByLabelText('Test Speed Dial')).toHaveAttribute('aria-haspopup', 'menu');
  });

  test('FAB has aria-expanded="false" initially', () => {
    renderDial();
    expect(screen.getByLabelText('Test Speed Dial')).toHaveAttribute('aria-expanded', 'false');
  });
});

/* ─── Open / Close ─── */
describe('Open / Close', () => {
  test('clicking FAB sets aria-expanded="true"', () => {
    renderDial();
    fireEvent.click(screen.getByLabelText('Test Speed Dial'));
    expect(screen.getByLabelText('Test Speed Dial')).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking FAB again closes', () => {
    renderDial();
    const fab = screen.getByLabelText('Test Speed Dial');
    fireEvent.click(fab);
    expect(fab).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(fab);
    expect(fab).toHaveAttribute('aria-expanded', 'false');
  });

  test('onOpen callback fires', () => {
    const onOpen = jest.fn();
    renderDial({ onOpen });
    fireEvent.click(screen.getByLabelText('Test Speed Dial'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test('onClose callback fires', () => {
    const onClose = jest.fn();
    renderDial({ onClose });
    const fab = screen.getByLabelText('Test Speed Dial');
    fireEvent.click(fab); // open
    fireEvent.click(fab); // close
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Escape closes the dial', () => {
    renderDial();
    fireEvent.click(screen.getByLabelText('Test Speed Dial'));
    expect(screen.getByLabelText('Test Speed Dial')).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByLabelText('Test Speed Dial')).toHaveAttribute('aria-expanded', 'false');
  });
});

/* ─── Actions ─── */
describe('Actions', () => {
  test('renders action buttons', () => {
    const { container } = renderDial();
    const actions = container.querySelectorAll('.speed-dial-action');
    expect(actions.length).toBe(3);
  });

  test('actions have role="menuitem"', () => {
    renderDial();
    const items = screen.getAllByRole('menuitem');
    expect(items.length).toBe(3);
  });

  test('actions have aria-label from name', () => {
    renderDial();
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
    expect(screen.getByLabelText('Share')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });

  test('action container has role="menu"', () => {
    renderDial();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('clicking action calls onClick', () => {
    const onClick = jest.fn();
    const actionsWithClick = ACTIONS.map((a, i) => ({ ...a, onClick }));
    renderDial({ actions: actionsWithClick });
    fireEvent.click(screen.getByLabelText('Test Speed Dial')); // open
    fireEvent.click(screen.getByLabelText('Edit'));
    expect(onClick).toHaveBeenCalled();
  });

  test('clicking action closes the dial', () => {
    renderDial();
    const fab = screen.getByLabelText('Test Speed Dial');
    fireEvent.click(fab); // open
    fireEvent.click(screen.getByLabelText('Edit'));
    expect(fab).toHaveAttribute('aria-expanded', 'false');
  });
});

/* ─── Variant classes ─── */
describe('Variant classes', () => {
  test('solid variant class', () => {
    const { container } = renderDial({ variant: 'solid' });
    expect(container.querySelector('.speed-dial-solid')).toBeInTheDocument();
  });

  test('light variant class', () => {
    const { container } = renderDial({ variant: 'light' });
    expect(container.querySelector('.speed-dial-light')).toBeInTheDocument();
  });
});

/* ─── Color classes ─── */
describe('Color classes', () => {
  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  colors.forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderDial({ color: c });
      expect(container.querySelector('.speed-dial-' + c)).toBeInTheDocument();
    });
  });
});

/* ─── Direction classes ─── */
describe('Direction classes', () => {
  ['up', 'down', 'left', 'right'].forEach((d) => {
    test(d + ' direction class', () => {
      const { container } = renderDial({ direction: d });
      expect(container.querySelector('.speed-dial-' + d)).toBeInTheDocument();
    });
  });
});

/* ─── Tooltips ─── */
describe('Tooltips', () => {
  test('tooltips hidden when showTooltips=false', () => {
    renderDial({ showTooltips: false });
    // Actions still have aria-labels but no MUI Tooltip wrapper
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
  });
});

/* ─── Controlled mode ─── */
describe('Controlled mode', () => {
  test('respects controlled open prop', () => {
    renderDial({ open: true });
    expect(screen.getByLabelText('Test Speed Dial')).toHaveAttribute('aria-expanded', 'true');
  });

  test('respects controlled open=false', () => {
    renderDial({ open: false });
    expect(screen.getByLabelText('Test Speed Dial')).toHaveAttribute('aria-expanded', 'false');
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default variant is solid', () => {
    const { container } = renderDial();
    expect(container.querySelector('.speed-dial-solid')).toBeInTheDocument();
  });

  test('default color is primary', () => {
    const { container } = renderDial();
    expect(container.querySelector('.speed-dial-primary')).toBeInTheDocument();
  });

  test('default direction is up', () => {
    const { container } = renderDial();
    expect(container.querySelector('.speed-dial-up')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('SpeedDial — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <SpeedDial open={false} ariaLabel="Speed dial actions" icon={<span>+</span>} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <SpeedDial open={false} ariaLabel="Speed dial actions" icon={<span>+</span>} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <SpeedDial open={false} ariaLabel="Speed dial actions" icon={<span>+</span>} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
