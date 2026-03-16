// src/components/Toolbar/Toolbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import { axe } from 'jest-axe';

const ITEMS = [
  { icon: <UndoIcon />, label: 'Undo' },
  { icon: <RedoIcon />, label: 'Redo' },
  { icon: <AddIcon />, label: 'Add' },
];

const renderToolbar = (props = {}) =>
  render(<Toolbar items={ITEMS} {...props} />);

/* --- Basic --- */
describe('Toolbar', () => {
  test('renders', () => {
    const { container } = renderToolbar();
    expect(container.querySelector('.toolbar')).toBeInTheDocument();
  });
  test('has role toolbar', () => {
    renderToolbar();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });
  test('has aria-label', () => {
    renderToolbar();
    expect(screen.getByLabelText('Toolbar')).toBeInTheDocument();
  });
});

/* --- Theme --- */
describe('Theme', () => {
  test('default → data-theme="Nav-Bar"', () => {
    const { container } = renderToolbar();
    expect(container.querySelector('[data-theme="Nav-Bar"]')).toBeInTheDocument();
  });
  test('primary → data-theme="Primary"', () => {
    const { container } = renderToolbar({ barColor: 'primary' });
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });
  test('black → data-theme="Neutral-Dark"', () => {
    const { container } = renderToolbar({ barColor: 'black' });
    expect(container.querySelector('[data-theme="Neutral-Dark"]')).toBeInTheDocument();
  });
  test('data-surface="Surface"', () => {
    const { container } = renderToolbar();
    expect(container.querySelector('[data-surface="Surface"]')).toBeInTheDocument();
  });
});

/* --- Modes --- */
describe('Modes', () => {
  test('icon mode class', () => {
    const { container } = renderToolbar({ mode: 'icon' });
    expect(container.querySelector('.toolbar-icon')).toBeInTheDocument();
  });
  test('basic mode class', () => {
    const { container } = renderToolbar({ mode: 'basic', basicLeft: { label: 'Back' }, basicRight: { label: 'Next' } });
    expect(container.querySelector('.toolbar-basic')).toBeInTheDocument();
  });
  test('basic renders two buttons', () => {
    renderToolbar({ mode: 'basic', basicLeft: { label: 'Back' }, basicRight: { label: 'Next' } });
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});

/* --- Orientation --- */
describe('Orientation', () => {
  test('horizontal class', () => {
    const { container } = renderToolbar({ orientation: 'horizontal' });
    expect(container.querySelector('.toolbar-horizontal')).toBeInTheDocument();
  });
  test('vertical class', () => {
    const { container } = renderToolbar({ orientation: 'vertical' });
    expect(container.querySelector('.toolbar-vertical')).toBeInTheDocument();
  });
  test('aria-orientation', () => {
    renderToolbar({ orientation: 'vertical' });
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

/* --- Icon selection --- */
describe('Icon selection', () => {
  test('renders radio buttons', () => {
    renderToolbar();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });
  test('clicking selects item', () => {
    renderToolbar();
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });
  test('clicking again deselects', () => {
    renderToolbar({ defaultValue: 1 });
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');
  });
  test('onChange fires', () => {
    const onChange = jest.fn();
    renderToolbar({ onChange });
    fireEvent.click(screen.getAllByRole('radio')[0]);
    expect(onChange).toHaveBeenCalledWith(0);
  });
  test('controlled value', () => {
    renderToolbar({ value: 2 });
    expect(screen.getAllByRole('radio')[2]).toHaveAttribute('aria-checked', 'true');
  });
});

/* --- FAB --- */
describe('FAB', () => {
  test('shows FAB when provided', () => {
    renderToolbar({ fab: { icon: <AddIcon />, label: 'Create' } });
    expect(screen.getByLabelText('Create')).toBeInTheDocument();
  });
  test('no FAB by default', () => {
    renderToolbar();
    expect(screen.queryByLabelText('Action')).not.toBeInTheDocument();
  });
});

/* --- Bar colors --- */
describe('Bar colors', () => {
  const cases = [
    ['default', 'Nav-Bar'], ['primary', 'Primary'],
    ['primary-light', 'Primary-Light'], ['primary-medium', 'Primary-Medium'],
    ['primary-dark', 'Primary-Dark'], ['white', 'Neutral'], ['black', 'Neutral-Dark'],
  ];
  cases.forEach(([color, theme]) => {
    test(color + ' → ' + theme, () => {
      const { container } = renderToolbar({ barColor: color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Toolbar — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Toolbar />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Toolbar />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Toolbar />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
