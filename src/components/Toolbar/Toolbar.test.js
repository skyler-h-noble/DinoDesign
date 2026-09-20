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
/* The prop is `color`, not `barColor`. Passed under the old name it fell into
   ...props, never reached THEME_MAP, and every one of these assertions was
   really testing the DEFAULT toolbar. And "Nav-Bar" is not a theme: App-Bar,
   Nav-Bar and Status are generated but excluded from the Theme collection —
   generateFigmaJSON warns about exactly these three — so a bar takes a real
   palette and says which surface of it. Lightness is the SURFACE axis now,
   which is why white and black both resolve to Neutral. */
describe('Theme', () => {
  const cases = [
    ['default',       'Default', undefined],
    ['primary',       'Primary', undefined],
    ['primary-light', 'Primary', 'Surface-Brightest'],
    ['white',         'Neutral', 'Surface-Brightest'],
    ['black',         'Neutral', 'Surface-Dimmest'],
  ];

  cases.forEach(([color, theme, surface]) => {
    test(color + ' → data-theme="' + theme + '"' + (surface ? ' + ' + surface : ''), () => {
      const { container } = renderToolbar({ color });
      const bar = container.querySelector('.toolbar');
      expect(bar).toHaveAttribute('data-theme', theme);
      expect(bar).toHaveAttribute('data-surface', surface || 'Surface');
    });
  });

  /* primary-medium and primary-dark were colours once. They are not in
     THEME_MAP now, so they fall through to default rather than silently
     painting a shade that no longer exists. */
  test.each(['primary-medium', 'primary-dark'])('%s is not a colour and falls back', (color) => {
    const { container } = renderToolbar({ color });
    expect(container.querySelector('.toolbar')).toHaveAttribute('data-theme', 'Default');
  });
});

/* --- Types --- */
/* There is no `mode` prop, and no basicLeft/basicRight. The axis is `type`:
   floating (pill, shadow) or contextual (standard radius, no shadow). */
describe('Types', () => {
  test.each(['floating', 'contextual'])('%s adds its class', (type) => {
    const { container } = renderToolbar({ type });
    expect(container.querySelector('.toolbar-' + type)).toBeInTheDocument();
  });

  test('floating is the default', () => {
    const { container } = renderToolbar();
    expect(container.querySelector('.toolbar-floating')).toBeInTheDocument();
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

/* The old "Bar colors" block is folded into Theme above — it asserted the
   same table through the same wrong prop name, plus two colours that no
   longer exist. */

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
