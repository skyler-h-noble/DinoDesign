// src/components/Badge/Badge.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Badge,
  PrimaryBadge,
  ErrorBadge,
  PrimaryOutlineBadge,
} from './Badge';
import { axe } from 'jest-axe';

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

  /* The -light shape was removed. Badge resolves an unknown variant as
     `variantMap[variant] || variantMap['primary']`, so a hard delete would
     have repainted success-light as PRIMARY silently; normalizeBadgeVariant
     strips the suffix to the solid badge of the SAME colour, and the class
     names what painted rather than what was asked for. */
  test.each([
    ['primary-light', 'badge-primary'], ['success-light', 'badge-success'],
  ])('%s renders as %s, with no -light class', (variant, expected) => {
    const { container } = render(
      <Badge variant={variant} badgeContent={1}><span>Child</span></Badge>
    );
    expect(container.querySelector('.' + expected)).toBeInTheDocument();
    expect(container.querySelector('[class*="-light"]')).not.toBeInTheDocument();
  });

  // --- Sizes ---

  /* One size. The three-row ladder was extrapolated from the single badge the
     design draws, and its middle row — 6px padding, 10px dot — could not even
     be written in the Sizing scale, which steps in 4s. Counter vs dot is a
     TYPE, carried by `dot`, not a size. */
  test('is 16px with 4px side padding, and the dot is 8px', () => {
    const css = () => Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .map((rule) => rule.cssText).join('');

    render(<Badge badgeContent={1}><span>Child</span></Badge>);
    expect(css()).toContain('var(--Sizing-2)');
    expect(css()).toContain('var(--Sizing-Half)');
  });

  test('accepts a removed size prop without passing it to the DOM', () => {
    const { container } = render(
      <Badge size="large" badgeContent={1}><span>Child</span></Badge>
    );
    expect(container.querySelector('[size]')).toBeNull();
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

  /* Colour comes from the ICONS palette, matching the design's
     Icons/<palette> + Icons/On-<palette> binding — not the Buttons palette,
     whose fill token carries no 3:1 contract for a non-text element. */
  test('a solid badge paints from the Icons pair, not Buttons', () => {
    render(<Badge variant="error" badgeContent={1}><span>Child</span></Badge>);
    /* Read the rule emotion injected. jsdom will not resolve a var() to a
       colour, but the DECLARATION is what this is about: which token family
       the badge asks for. */
    /* emotion runs in speedy mode, inserting through CSSOM — so the <style>
       nodes are EMPTY and only cssRules has the text. Reading textContent
       here returned '' and the assertion failed on a correct render. */
    const css = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .map((rule) => rule.cssText)
      .join('');
    expect(css).toContain('var(--Icons-Error)');
    expect(css).toContain('var(--Icons-On-Error)');
    expect(css).not.toContain('var(--Buttons-Error-Button)');
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Badge — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Badge badgeContent={4}><span>Item</span></Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Badge badgeContent={4}><span>Item</span></Badge>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Badge badgeContent={4}><span>Item</span></Badge>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* `type` is the design's own axis name (Figma: Type = standard | status), added
   so the Figma property and the React prop read the same. `dot` is the older
   spelling of the same thing and keeps working — the two are OR'd, never a
   precedence rule, so no existing call site changes behaviour. */
describe('type mirrors the design axis', () => {
  const dotSize = (c) => c.querySelector('.MuiBadge-badge')?.className || '';

  test('type="standard" is the default and carries content', () => {
    const { container } = render(<Badge badgeContent={7}><span>C</span></Badge>);
    expect(container.textContent).toContain('7');
    expect(dotSize(container)).not.toContain('Dot');
  });

  test('type="status" renders the dot and drops the content', () => {
    const { container } = render(
      <Badge type="status" badgeContent={7}><span>C</span></Badge>
    );
    expect(container.textContent).not.toContain('7');
  });

  test('dot still means status', () => {
    const { container } = render(<Badge dot badgeContent={7}><span>C</span></Badge>);
    expect(container.textContent).not.toContain('7');
  });

  test('and neither silently cancels the other', () => {
    const { container } = render(
      <Badge type="standard" dot badgeContent={7}><span>C</span></Badge>
    );
    expect(container.textContent).not.toContain('7');
  });
});
