// src/components/Alert/Alert.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

/* ─── Helpers ─── */
const renderAlert = (props = {}) => render(<Alert {...props}>Test message</Alert>);

/* ─── Basic Rendering ─── */
describe('Alert', () => {
  test('renders', () => {
    const { container } = renderAlert();
    expect(container.querySelector('.alert')).toBeInTheDocument();
  });

  test('has role="alert"', () => {
    renderAlert();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('renders children', () => {
    renderAlert();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('renders message in alert-message element', () => {
    const { container } = renderAlert();
    expect(container.querySelector('.alert-message')).toBeInTheDocument();
  });
});

/* ─── Standard variant ─── */
describe('Standard variant', () => {
  test('has alert-standard class', () => {
    const { container } = renderAlert({ variant: 'standard' });
    expect(container.querySelector('.alert-standard')).toBeInTheDocument();
  });

  test('no data-theme', () => {
    renderAlert({ variant: 'standard' });
    expect(screen.getByRole('alert')).not.toHaveAttribute('data-theme');
  });

  test('no data-surface', () => {
    renderAlert({ variant: 'standard' });
    expect(screen.getByRole('alert')).not.toHaveAttribute('data-surface');
  });

  test('no alert-inner element', () => {
    const { container } = renderAlert({ variant: 'standard' });
    expect(container.querySelector('.alert-inner')).not.toBeInTheDocument();
  });
});

/* ─── Outline variant ─── */
describe('Outline variant', () => {
  test('has alert-outline class', () => {
    const { container } = renderAlert({ variant: 'outline' });
    expect(container.querySelector('.alert-outline')).toBeInTheDocument();
  });

  test('no data-theme', () => {
    renderAlert({ variant: 'outline' });
    expect(screen.getByRole('alert')).not.toHaveAttribute('data-theme');
  });

  test('no data-surface', () => {
    renderAlert({ variant: 'outline' });
    expect(screen.getByRole('alert')).not.toHaveAttribute('data-surface');
  });

  test('no alert-inner element', () => {
    const { container } = renderAlert({ variant: 'outline' });
    expect(container.querySelector('.alert-inner')).not.toBeInTheDocument();
  });

  test('has color class', () => {
    const { container } = renderAlert({ variant: 'outline', color: 'error' });
    expect(container.querySelector('.alert-error')).toBeInTheDocument();
  });
});

/* ─── Light variant ─── */
describe('Light variant', () => {
  test('has alert-light class', () => {
    const { container } = renderAlert({ variant: 'light' });
    expect(container.querySelector('.alert-light')).toBeInTheDocument();
  });

  test('has alert-inner element', () => {
    const { container } = renderAlert({ variant: 'light' });
    expect(container.querySelector('.alert-inner')).toBeInTheDocument();
  });

  test('alert-inner has data-surface="Surface"', () => {
    const { container } = renderAlert({ variant: 'light' });
    expect(container.querySelector('.alert-inner')).toHaveAttribute('data-surface', 'Surface');
  });

  test('outer wrapper (role="alert") has NO data-theme', () => {
    renderAlert({ variant: 'light', color: 'primary' });
    expect(screen.getByRole('alert')).not.toHaveAttribute('data-theme');
  });

  test('alert-inner has data-theme for primary', () => {
    const { container } = renderAlert({ variant: 'light', color: 'primary' });
    expect(container.querySelector('.alert-inner')).toHaveAttribute('data-theme', 'Primary-Light');
  });

  const lightCases = [
    ['primary', 'Primary-Light'], ['secondary', 'Secondary-Light'], ['tertiary', 'Tertiary-Light'],
    ['neutral', 'Neutral-Light'], ['info', 'Info-Light'], ['success', 'Success-Light'],
    ['warning', 'Warning-Light'], ['error', 'Error-Light'],
  ];
  lightCases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderAlert({ variant: 'light', color });
      expect(container.querySelector('.alert-inner')).toHaveAttribute('data-theme', theme);
    });
  });
});

/* ─── Solid variant ─── */
describe('Solid variant', () => {
  test('has alert-solid class', () => {
    const { container } = renderAlert({ variant: 'solid' });
    expect(container.querySelector('.alert-solid')).toBeInTheDocument();
  });

  test('has alert-inner element', () => {
    const { container } = renderAlert({ variant: 'solid' });
    expect(container.querySelector('.alert-inner')).toBeInTheDocument();
  });

  test('alert-inner has data-surface="Surface"', () => {
    const { container } = renderAlert({ variant: 'solid' });
    expect(container.querySelector('.alert-inner')).toHaveAttribute('data-surface', 'Surface');
  });

  test('outer wrapper (role="alert") has NO data-theme', () => {
    renderAlert({ variant: 'solid', color: 'primary' });
    expect(screen.getByRole('alert')).not.toHaveAttribute('data-theme');
  });

  const solidCases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info-Medium'], ['success', 'Success-Medium'],
    ['warning', 'Warning-Medium'], ['error', 'Error-Medium'],
  ];
  solidCases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderAlert({ variant: 'solid', color });
      expect(container.querySelector('.alert-inner')).toHaveAttribute('data-theme', theme);
    });
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderAlert({ size: s });
      expect(container.querySelector('.alert-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Color classes ─── */
describe('Color classes', () => {
  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  colors.forEach((c) => {
    test(c + ' color class on outline', () => {
      const { container } = renderAlert({ variant: 'outline', color: c });
      expect(container.querySelector('.alert-' + c)).toBeInTheDocument();
    });
  });
});

/* ─── Decorators ─── */
describe('Start decorator', () => {
  test('renders start decorator', () => {
    const { container } = render(
      <Alert startDecorator={<span data-testid="start">icon</span>}>msg</Alert>
    );
    expect(container.querySelector('.alert-start-decorator')).toBeInTheDocument();
    expect(screen.getByTestId('start')).toBeInTheDocument();
  });

  test('no start decorator when omitted', () => {
    const { container } = renderAlert();
    expect(container.querySelector('.alert-start-decorator')).not.toBeInTheDocument();
  });
});

describe('End decorator', () => {
  test('renders end decorator', () => {
    const { container } = render(
      <Alert endDecorator={<span data-testid="end">action</span>}>msg</Alert>
    );
    expect(container.querySelector('.alert-end-decorator')).toBeInTheDocument();
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });

  test('no end decorator when omitted', () => {
    const { container } = renderAlert();
    expect(container.querySelector('.alert-end-decorator')).not.toBeInTheDocument();
  });
});

/* ─── Structure: border outside themed area ─── */
describe('Border structure for themed variants', () => {
  test('light: outer wrapper contains alert-inner', () => {
    const { container } = renderAlert({ variant: 'light', color: 'info' });
    const outer = screen.getByRole('alert');
    const inner = container.querySelector('.alert-inner');
    expect(outer.contains(inner)).toBe(true);
  });

  test('solid: outer wrapper contains alert-inner', () => {
    const { container } = renderAlert({ variant: 'solid', color: 'info' });
    const outer = screen.getByRole('alert');
    const inner = container.querySelector('.alert-inner');
    expect(outer.contains(inner)).toBe(true);
  });

  test('light: data-theme is on inner, not outer', () => {
    const { container } = renderAlert({ variant: 'light', color: 'info' });
    const outer = screen.getByRole('alert');
    const inner = container.querySelector('.alert-inner');
    expect(outer).not.toHaveAttribute('data-theme');
    expect(inner).toHaveAttribute('data-theme', 'Info-Light');
  });

  test('solid: data-theme is on inner, not outer', () => {
    const { container } = renderAlert({ variant: 'solid', color: 'info' });
    const outer = screen.getByRole('alert');
    const inner = container.querySelector('.alert-inner');
    expect(outer).not.toHaveAttribute('data-theme');
    expect(inner).toHaveAttribute('data-theme', 'Info-Medium');
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default variant is standard', () => {
    const { container } = renderAlert();
    expect(container.querySelector('.alert-standard')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderAlert();
    expect(container.querySelector('.alert-medium')).toBeInTheDocument();
  });
});
