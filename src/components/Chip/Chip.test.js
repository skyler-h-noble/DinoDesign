// src/components/Chip/Chip.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Chip,
  PrimaryChip,
  ErrorChip,
  PrimaryOutlineChip,
  SuccessLightChip,
} from './Chip';
import { axe } from 'jest-axe';

describe('Chip Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Chip label="Test" />);
    expect(container).toBeInTheDocument();
  });

  test('renders label text', () => {
    render(<Chip label="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('renders children as label', () => {
    render(<Chip>Child Label</Chip>);
    expect(screen.getByText('Child Label')).toBeInTheDocument();
  });

  test('defaults to primary variant', () => {
    const { container } = render(<Chip label="Test" />);
    expect(container.querySelector('.chip-primary')).toBeInTheDocument();
  });

  test.each([
    ['primary'], ['secondary'], ['tertiary'], ['neutral'],
    ['info'], ['success'], ['warning'], ['error'],
  ])('applies solid %s variant class', (color) => {
    const { container } = render(<Chip variant={color} label="Test" />);
    expect(container.querySelector(`.chip-${color}`)).toBeInTheDocument();
  });

  test.each([['primary-outline'], ['error-outline']])('applies %s variant class', (variant) => {
    const { container } = render(<Chip variant={variant} label="Test" />);
    expect(container.querySelector(`.chip-${variant}`)).toBeInTheDocument();
  });

  test.each([['primary-light'], ['success-light']])('applies %s variant class', (variant) => {
    const { container } = render(<Chip variant={variant} label="Test" />);
    expect(container.querySelector(`.chip-${variant}`)).toBeInTheDocument();
  });

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(<Chip size={size} label="Test" />);
    expect(container).toBeInTheDocument();
  });

  test('fires onClick when clickable', () => {
    const handleClick = jest.fn();
    render(<Chip label="Click Me" clickable onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders disabled state', () => {
    const { container } = render(<Chip label="Disabled" disabled />);
    expect(container).toBeInTheDocument();
  });

  test('renders delete button when onDelete provided', () => {
    const { container } = render(<Chip label="Deletable" onDelete={() => {}} />);
    const deleteBtn = container.querySelector('[aria-label="Remove"]');
    expect(deleteBtn).toBeInTheDocument();
  });

  test('fires onDelete when delete button clicked', () => {
    const handleDelete = jest.fn();
    const { container } = render(<Chip label="Delete" onDelete={handleDelete} />);
    const deleteBtn = container.querySelector('[aria-label="Remove"]');
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  test('radio mode sets role and aria-checked', () => {
    const { container } = render(
      <Chip label="Radio" selectionMode="radio" selected={true} onClick={() => {}} />
    );
    const chip = container.querySelector('[role="radio"]');
    expect(chip).toBeInTheDocument();
    expect(chip.getAttribute('aria-checked')).toBe('true');
  });

  test('checkbox mode sets role and aria-checked', () => {
    const { container } = render(
      <Chip label="Check" selectionMode="checkbox" selected={false} onClick={() => {}} />
    );
    const chip = container.querySelector('[role="checkbox"]');
    expect(chip).toBeInTheDocument();
    expect(chip.getAttribute('aria-checked')).toBe('false');
  });

  test('renders start decorator', () => {
    render(<Chip label="Deco" startDecorator={<span data-testid="start">S</span>} />);
    expect(screen.getByTestId('start')).toBeInTheDocument();
  });

  test('renders end decorator', () => {
    render(<Chip label="Deco" endDecorator={<span data-testid="end">E</span>} />);
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });
});

describe('Convenience Exports', () => {
  test('PrimaryChip renders', () => {
    const { container } = render(<PrimaryChip label="Test" />);
    expect(container.querySelector('.chip-primary')).toBeInTheDocument();
  });

  test('ErrorChip renders', () => {
    const { container } = render(<ErrorChip label="Test" />);
    expect(container.querySelector('.chip-error')).toBeInTheDocument();
  });

  test('PrimaryOutlineChip renders', () => {
    const { container } = render(<PrimaryOutlineChip label="Test" />);
    expect(container.querySelector('.chip-primary-outline')).toBeInTheDocument();
  });

  test('SuccessLightChip renders', () => {
    const { container } = render(<SuccessLightChip label="Test" />);
    expect(container.querySelector('.chip-success-light')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Chip — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Chip label="Test chip" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Chip label="Test chip" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Chip label="Test chip" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
