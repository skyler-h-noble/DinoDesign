// src/components/Chip/Chip.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Chip,
  PrimaryChip,
  ErrorChip,
  PrimaryOutlineChip,
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

  test.each([['primary-outline'], ['error-outline']])('%s renders as the plain colour, unselected', (variant) => {
    /* There is no outline shape. `-outline` WAS the unselected chip — the same
       var(--Background) fill and border — so it resolves to the colour and the
       selection axis decides the rest. */
    const base = variant.replace('-outline', '');
    const { container } = render(<Chip variant={variant} label="Test" />);
    expect(container.querySelector(`.chip-${base}`)).toBeInTheDocument();
    expect(container.querySelector(`.chip-${variant}`)).toBeNull();
    expect(container.querySelector(`.chip-${base}`).getAttribute('data-surface'))
      .toBe('Surface-Brightest');
  });

  test('selection is the surface level, not a different fill', () => {
    /* The model the design uses: one theme, two surfaces. Both states paint
       var(--Background); the zone decides what that resolves to. */
    const un = render(<Chip variant="success" label="A" />).container
      .querySelector('.chip-success');
    expect(un.getAttribute('data-surface')).toBe('Surface-Brightest');
    const sel = render(<Chip variant="success" selected label="B" />).container
      .querySelector('.chip-success.chip-selected');
    expect(sel.getAttribute('data-surface')).toBe('Surface-Dimmest');
    expect(sel.getAttribute('data-theme')).toBe('Success');
  });

  test('default INHERITS its theme rather than pinning one', () => {
    /* Same rule as ButtonGroup: naming a Default theme would pin the chip to
       the brand default even inside a themed zone. */
    const { container } = render(<Chip variant="default" label="Test" />);
    expect(container.querySelector('.chip-default').hasAttribute('data-theme')).toBe(false);
  });

  /* The -light shape was removed. Chip resolves an unknown variant as
     `variantMap[variant] || variantMap['primary']`, so a hard delete would
     have repainted success-light as PRIMARY silently; normalizeChipVariant
     strips the suffix to the solid chip of the SAME colour instead, and the
     class names what painted rather than what was asked for. */
  test.each([['primary-light', 'chip-primary'], ['success-light', 'chip-success']])(
    '%s renders as %s, with no -light class',
    (variant, expected) => {
      const { container } = render(<Chip variant={variant} label="Test" />);
      expect(container.querySelector('.' + expected)).toBeInTheDocument();
      expect(container.querySelector('[class*="-light"]')).not.toBeInTheDocument();
    },
  );

  /* Chip has ONE size, matching the Figma set, which carries no size axis.
     This block used to be `test.each(['small','medium','large'])` asserting
     `expect(container).toBeInTheDocument()` — true of any render, including one
     that drew nothing, so it went on passing while the sizes were removed. */
  describe('one size', () => {
    let warn;
    beforeEach(() => { warn = jest.spyOn(console, 'warn').mockImplementation(() => {}); });
    afterEach(() => { warn.mockRestore(); });

    const chipWarnings = () =>
      warn.mock.calls.filter(([first]) => String(first).startsWith('[Chip] size='));

    test('a chip with no size prop warns nothing', () => {
      render(<Chip label="Test" />);
      expect(chipWarnings()).toHaveLength(0);
    });

    test.each(['small', 'medium', 'large'])('size="%s" warns once and still renders', (size) => {
      render(<Chip size={size} label={'Test ' + size} />);
      expect(screen.getByText('Test ' + size)).toBeInTheDocument();
      expect(chipWarnings()).toHaveLength(1);
      expect(chipWarnings()[0][0]).toMatch(/Chip has one size \(24px\)/);
    });

    test('a deletable chip is not pushed to a bigger size', () => {
      render(<Chip label="Deletable" onDelete={() => {}} />);
      expect(screen.getByText('Deletable')).toBeInTheDocument();
      expect(chipWarnings()).toHaveLength(0);
    });
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

  test('PrimaryOutlineChip still renders — a stale import is not a build error', () => {
    const { container } = render(<PrimaryOutlineChip label="Test" />);
    expect(container.querySelector('.chip-primary')).toBeInTheDocument();
  });

  /* A "light" chip needs no special handling now — it is just an unselected
     chip, which already sits in the palette's brightest zone. The shape that
     used to be spelled `-light`, then `-outline`, is the default state. */
  test('a light chip is simply an unselected chip', () => {
    const { container } = render(<Chip variant="success" label="Test" />);
    const chip = container.querySelector('.chip-success');
    expect(chip.getAttribute('data-theme')).toBe('Success');
    expect(chip.getAttribute('data-surface')).toBe('Surface-Brightest');
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
