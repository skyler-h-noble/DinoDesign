// src/components/Badge/Badge.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Badge,
  PrimaryBadge,
  ErrorBadge,
  PrimaryOutlineBadge,
  SuccessLightBadge,
} from './Badge';

// ─── Badge Component ─────────────────────────────────────────────────────────

describe('Badge Component', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <Badge badgeContent={5}><span>Child</span></Badge>
    );
    expect(container).toBeInTheDocument();
  });

  test('renders child element', () => {
    render(<Badge badgeContent={3}><span>Mail</span></Badge>);
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  test('renders numeric badge content', () => {
    render(<Badge badgeContent={42}><span>Child</span></Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('renders string badge content', () => {
    render(<Badge badgeContent="NEW"><span>Child</span></Badge>);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  test('caps content at max value', () => {
    render(<Badge badgeContent={150} max={99}><span>Child</span></Badge>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  test('custom max value', () => {
    render(<Badge badgeContent={1500} max={999}><span>Child</span></Badge>);
    expect(screen.getByText('999+')).toBeInTheDocument();
  });

  test('hides badge when content is 0 by default', () => {
    const { container } = render(
      <Badge badgeContent={0}><span>Child</span></Badge>
    );
    const badge = container.querySelector('.MuiBadge-invisible');
    expect(badge).toBeInTheDocument();
  });

  test('shows badge when content is 0 with showZero', () => {
    render(
      <Badge badgeContent={0} showZero><span>Child</span></Badge>
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('hides badge when invisible', () => {
    const { container } = render(
      <Badge badgeContent={5} invisible><span>Child</span></Badge>
    );
    const badge = container.querySelector('.MuiBadge-invisible');
    expect(badge).toBeInTheDocument();
  });

  test('renders dot variant', () => {
    const { container } = render(
      <Badge dot><span>Child</span></Badge>
    );
    const dot = container.querySelector('.MuiBadge-dot');
    expect(dot).toBeInTheDocument();
  });

  // --- Variants ---

  test('defaults to primary variant', () => {
    const { container } = render(
      <Badge badgeContent={1}><span>Child</span></Badge>
    );
    expect(container.querySelector('.badge-primary')).toBeInTheDocument();
  });

  test.each([
    ['primary'], ['secondary'], ['tertiary'], ['neutral'],
    ['info'], ['success'], ['warning'], ['error'],
  ])('applies solid %s variant class', (color) => {
    const { container } = render(
      <Badge variant={color} badgeContent={1}><span>Child</span></Badge>
    );
    expect(container.querySelector(`.badge-${color}`)).toBeInTheDocument();
  });

  test.each([
    ['primary-outline'], ['error-outline'],
  ])('applies %s variant class', (variant) => {
    const { container } = render(
      <Badge variant={variant} badgeContent={1}><span>Child</span></Badge>
    );
    expect(container.querySelector(`.badge-${variant}`)).toBeInTheDocument();
  });

  test.each([
    ['primary-light'], ['success-light'],
  ])('applies %s variant class', (variant) => {
    const { container } = render(
      <Badge variant={variant} badgeContent={1}><span>Child</span></Badge>
    );
    expect(container.querySelector(`.badge-${variant}`)).toBeInTheDocument();
  });

  // --- Sizes ---

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(
      <Badge size={size} badgeContent={1}><span>Child</span></Badge>
    );
    expect(container).toBeInTheDocument();
  });

  // --- Anchor origin ---

  test('renders with custom anchor origin', () => {
    const { container } = render(
      <Badge badgeContent={1} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <span>Child</span>
      </Badge>
    );
    expect(container).toBeInTheDocument();
  });
});

// ─── Convenience Exports ─────────────────────────────────────────────────────

describe('Convenience Exports', () => {
  test('PrimaryBadge renders', () => {
    const { container } = render(
      <PrimaryBadge badgeContent={1}><span>Child</span></PrimaryBadge>
    );
    expect(container.querySelector('.badge-primary')).toBeInTheDocument();
  });

  test('ErrorBadge renders', () => {
    const { container } = render(
      <ErrorBadge badgeContent={1}><span>Child</span></ErrorBadge>
    );
    expect(container.querySelector('.badge-error')).toBeInTheDocument();
  });

  test('PrimaryOutlineBadge renders', () => {
    const { container } = render(
      <PrimaryOutlineBadge badgeContent={1}><span>Child</span></PrimaryOutlineBadge>
    );
    expect(container.querySelector('.badge-primary-outline')).toBeInTheDocument();
  });

  test('SuccessLightBadge renders', () => {
    const { container } = render(
      <SuccessLightBadge badgeContent={1}><span>Child</span></SuccessLightBadge>
    );
    expect(container.querySelector('.badge-success-light')).toBeInTheDocument();
  });
});
