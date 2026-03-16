// src/components/Fab/Fab.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Fab } from './Fab';
import EditIcon from '@mui/icons-material/Edit';
import { axe } from 'jest-axe';

const renderFab = (props = {}) =>
  render(<Fab ariaLabel="Test action" {...props} />);

/* --- Basic --- */
describe('Fab', () => {
  test('renders', () => {
    const { container } = renderFab();
    expect(container.querySelector('.fab')).toBeInTheDocument();
  });

  test('renders as button', () => {
    renderFab();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('has aria-label', () => {
    renderFab();
    expect(screen.getByLabelText('Test action')).toBeInTheDocument();
  });

  test('onClick fires', () => {
    const onClick = jest.fn();
    renderFab({ onClick });
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});

/* --- Variants --- */
describe('Variants', () => {
  test('solid class', () => {
    const { container } = renderFab({ variant: 'solid' });
    expect(container.querySelector('.fab-solid')).toBeInTheDocument();
  });

  test('light class', () => {
    const { container } = renderFab({ variant: 'light' });
    expect(container.querySelector('.fab-light')).toBeInTheDocument();
  });
});

/* --- Colors --- */
describe('Colors', () => {
  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  colors.forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderFab({ color: c });
      expect(container.querySelector('.fab-' + c)).toBeInTheDocument();
    });
  });
});

/* --- Sizes --- */
describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderFab({ size: s });
      expect(container.querySelector('.fab-' + s)).toBeInTheDocument();
    });
  });
});

/* --- Extended --- */
describe('Extended', () => {
  test('extended class', () => {
    const { container } = renderFab({ extended: true, label: 'Create' });
    expect(container.querySelector('.fab-extended')).toBeInTheDocument();
  });

  test('renders label text', () => {
    renderFab({ extended: true, label: 'Create' });
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('no extended class by default', () => {
    const { container } = renderFab();
    expect(container.querySelector('.fab-extended')).not.toBeInTheDocument();
  });
});

/* --- Animation --- */
describe('Animation', () => {
  test('animate class', () => {
    const { container } = renderFab({ animate: true });
    expect(container.querySelector('.fab-animate')).toBeInTheDocument();
  });

  test('no animate class by default', () => {
    const { container } = renderFab();
    expect(container.querySelector('.fab-animate')).not.toBeInTheDocument();
  });
});

/* --- Disabled --- */
describe('Disabled', () => {
  test('disabled class', () => {
    const { container } = renderFab({ disabled: true });
    expect(container.querySelector('.fab-disabled')).toBeInTheDocument();
  });

  test('button is disabled', () => {
    renderFab({ disabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('not disabled by default', () => {
    const { container } = renderFab();
    expect(container.querySelector('.fab-disabled')).not.toBeInTheDocument();
  });
});

/* --- Custom icon --- */
describe('Custom icon', () => {
  test('renders custom icon', () => {
    renderFab({ icon: <EditIcon data-testid="edit-icon" /> });
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });
});

/* --- Defaults --- */
describe('Defaults', () => {
  test('default variant is solid', () => {
    const { container } = renderFab();
    expect(container.querySelector('.fab-solid')).toBeInTheDocument();
  });

  test('default color is primary', () => {
    const { container } = renderFab();
    expect(container.querySelector('.fab-primary')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderFab();
    expect(container.querySelector('.fab-medium')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Fab — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Fab aria-label="Add">+</Fab>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Fab aria-label="Add">+</Fab>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Fab aria-label="Add">+</Fab>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
