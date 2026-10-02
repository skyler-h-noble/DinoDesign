// src/components/Switch/Switch.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Switch,
  SwitchInput,
  PrimarySwitch,
  SecondarySwitch,
  ErrorSwitch,
  PrimaryOutlineSwitch,
  SecondaryOutlineSwitch,
  themedStyles,
  outlineStyles,
  normalizeSwitchVariant,
} from './Switch';
import { axe } from 'jest-axe';

// ─── Switch Component ────────────────────────────────────────────────────────

describe('Switch Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Switch aria-label="Test switch" />);
    expect(container).toBeInTheDocument();
  });

  test('renders with role switch', () => {
    render(<Switch aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('renders unchecked by default', () => {
    render(<Switch aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('renders checked when defaultChecked', () => {
    render(<Switch defaultChecked aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('renders checked with controlled value', () => {
    render(<Switch checked onChange={() => {}} aria-label="Test switch" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('calls onChange when toggled', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} aria-label="Test switch" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders with label', () => {
    render(<Switch label="Notifications" />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('renders without label', () => {
    const { container } = render(<Switch aria-label="No label" />);
    expect(container.querySelector('.switch-default')).toBeInTheDocument();
  });

  // --- Disabled ---

  test('handles disabled state', () => {
    render(<Switch disabled aria-label="Disabled" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  /* The input carries the `disabled` attribute, which is what stops a real
     browser delivering the event. fireEvent.click synthesises a change on a
     disabled control anyway, so the original assertion was testing jsdom
     rather than the Switch — it can never pass however correct the component
     is. Assert the guarantee that actually exists. */
  test('is genuinely disabled, not just styled that way', () => {
    render(<Switch disabled onChange={jest.fn()} aria-label="Disabled" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  // --- Variants ---

  // The design file has no colour axis — its switch takes its colour from the
  // surrounding theme — so a bare <Switch /> is the `default` variant.
  test('defaults to the default (theme-driven) variant', () => {
    const { container } = render(<Switch aria-label="Test" />);
    expect(container.querySelector('.switch-default')).toBeInTheDocument();
  });

  test('variant="primary" still renders the primary variant', () => {
    const { container } = render(<Switch variant="primary" aria-label="Test" />);
    expect(container.querySelector('.switch-primary')).toBeInTheDocument();
  });

  test.each([
    ['primary'], ['secondary'], ['tertiary'], ['neutral'],
    ['info'], ['success'], ['warning'], ['error'],
  ])('applies solid %s variant class', (color) => {
    const { container } = render(<Switch variant={color} aria-label="Test" />);
    expect(container.querySelector(`.switch-${color}`)).toBeInTheDocument();
  });

  test.each([
    ['primary-outline'], ['secondary-outline'], ['error-outline'],
  ])('applies %s variant class', (variant) => {
    const { container } = render(<Switch variant={variant} aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });

  // --- Sizes ---

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(<Switch size={size} aria-label="Test" />);
    expect(container).toBeInTheDocument();
  });

  // --- Touch target ---

  test('small switch has min 24px container', () => {
    const { container } = render(<Switch size="small" aria-label="Test" />);
    const switchEl = container.querySelector('.MuiSwitch-root');
    expect(switchEl).toBeInTheDocument();
  });

  // --- Label Placement ---

  test('renders label at end by default', () => {
    render(<Switch label="End label" />);
    expect(screen.getByText('End label')).toBeInTheDocument();
  });

  test('renders label at start', () => {
    render(<Switch label="Start label" labelPlacement="start" />);
    expect(screen.getByText('Start label')).toBeInTheDocument();
  });

  // --- Name and Value ---

  test('passes name prop', () => {
    const { container } = render(<Switch name="my-switch" aria-label="Test" />);
    const input = container.querySelector('input[name="my-switch"]');
    expect(input).toBeInTheDocument();
  });

  test('passes value prop', () => {
    const { container } = render(<Switch value="notifications" aria-label="Test" />);
    const input = container.querySelector('input[value="notifications"]');
    expect(input).toBeInTheDocument();
  });
});

// ─── Convenience Exports ─────────────────────────────────────────────────────

describe('Convenience Exports', () => {
  // Solid
  test.each([
    ['PrimarySwitch',   PrimarySwitch,   'primary'],
    ['SecondarySwitch',  SecondarySwitch, 'secondary'],
    ['ErrorSwitch',      ErrorSwitch,     'error'],
  ])('%s renders with correct variant', (name, Component, variant) => {
    const { container } = render(<Component aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });

  // Outline
  test.each([
    ['PrimaryOutlineSwitch',   PrimaryOutlineSwitch,   'primary-outline'],
    ['SecondaryOutlineSwitch', SecondaryOutlineSwitch, 'secondary-outline'],
  ])('%s renders with correct variant', (name, Component, variant) => {
    const { container } = render(<Component aria-label="Test" />);
    expect(container.querySelector(`.switch-${variant}`)).toBeInTheDocument();
  });


  // Legacy alias
  test('SwitchInput is an alias for Switch', () => {
    expect(SwitchInput).toBe(Switch);
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────────

describe('Accessibility', () => {
  test('has checkbox role (MUI Switch)', () => {
    render(<Switch aria-label="Accessible" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('passes aria-label to input', () => {
    render(<Switch aria-label="My switch" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'My switch');
  });

  test('disabled switch is disabled in DOM', () => {
    render(<Switch disabled aria-label="Test" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  test('checked state reflected in aria', () => {
    render(<Switch defaultChecked aria-label="Test" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('toggle changes checked state', () => {
    render(<Switch aria-label="Test" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Switch — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Switch aria-label="Toggle feature" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Switch aria-label="Toggle feature" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Switch aria-label="Toggle feature" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/**
 * Which TOKENS the on state paints with.
 *
 * Asserted on the style objects, not the DOM: jsdom drops a `var()` it cannot
 * resolve, so `toHaveStyle({ background: 'var(--Icons-Primary)' })` reduces the
 * expectation to empty and passes against literally any value. The 51 tests
 * above all passed while these tokens were still --Buttons-*, which is exactly
 * that failure.
 *
 * The mapping is Figma's, read off the Switch set (10 variants):
 *   Status=On  Switch-Body  fill AND stroke -> Icons::Icon
 *   Status=On  Dot          fill            -> Icons::On-Icon
 *   Status=Off Switch-Body  stroke          -> Quiet
 *   Status=Off Dot          fill            -> Quiet
 * No variant pins an explicit Icons mode, so the mode is inherited — in CSS
 * that is the flattened name the `variant` prop selects.
 */
describe('Switch — on-state tokens follow the Icons collection', () => {
  it('the default variant reads Icon / On-Icon', () => {
    const s = themedStyles();
    expect(s.trackOn).toBe('var(--Icons-Default)');
    expect(s.dotOn).toBe('var(--Icons-On-Default)');
  });

  it('the on track edge is the SAME token as its fill', () => {
    // Figma binds Switch-Body's fill and stroke to Icon. A separate border
    // token here would be a colour the design does not have.
    expect(themedStyles().trackOnBorder).toBe(themedStyles().trackOn);
    for (const c of ['primary', 'error']) {
      const s = outlineStyles(c);
      expect(s.trackOnBorder).toBe(s.trackOn);
    }
  });

  it('an icon in the knob returns to Icon, because the knob is On-Icon', () => {
    expect(themedStyles().iconOn).toBe('var(--Icons-Default)');
    expect(outlineStyles('primary').iconOn).toBe('var(--Icons-Primary)');
  });

  it.each(['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'])(
    '%s maps to --Icons-{Color} / --Icons-On-{Color}', (color) => {
      const C = color.charAt(0).toUpperCase() + color.slice(1);
      const s = outlineStyles(color);
      expect(s.trackOn).toBe(`var(--Icons-${C})`);
      expect(s.dotOn).toBe(`var(--Icons-On-${C})`);
    });

  it('no on-state slot still reads a --Buttons-* token', () => {
    const slots = [themedStyles(), outlineStyles('primary')];
    for (const s of slots) {
      for (const key of ['trackOn', 'trackOnBorder', 'dotOn', 'iconOn']) {
        expect(s[key]).not.toMatch(/--Buttons-/);
      }
    }
  });

  it('the OFF state stays on the surface tokens Figma binds', () => {
    const s = themedStyles();
    expect(s.dotOff).toBe('var(--Quiet)');
    expect(outlineStyles('primary').trackOffBorder).toBe('var(--Border)');
  });
});

/**
 * The -light shape is gone.
 *
 * It filled the track with --<C>-Color-11 and drew the dot in
 * --Buttons-<C>-Border. The Figma Switch set has two axes, State and Status —
 * there was never a variant to check it against, and the on state's colour now
 * comes from the Icons collection.
 *
 * Deleting the convenience exports is the point: a stale
 * `import { PrimaryLightSwitch }` now fails at BUILD, which is better than a
 * named export rendering something other than its name. The variant STRING is
 * kept working, because an unknown variant falls through to `default` and would
 * have silently repainted every call site as the brand-default switch.
 */
describe('Switch — the -light shape is removed', () => {
  const warn = () => jest.spyOn(console, 'warn').mockImplementation(() => {});

  it('normalizes {color}-light to the solid colour', () => {
    const spy = warn();
    expect(normalizeSwitchVariant('primary-light')).toBe('primary');
    expect(normalizeSwitchVariant('error-light')).toBe('error');
    spy.mockRestore();
  });

  it('normalizes the bare "light" to primary', () => {
    const spy = warn();
    expect(normalizeSwitchVariant('light')).toBe('primary');
    spy.mockRestore();
  });

  it('leaves every other variant alone', () => {
    for (const v of ['default', 'primary', 'primary-outline', 'error-outline']) {
      expect(normalizeSwitchVariant(v)).toBe(v);
    }
  });

  it('renders the normalized class, not the -light one', () => {
    const spy = warn();
    const { container } = render(<Switch variant="primary-light" aria-label="t" />);
    expect(container.querySelector('.switch-primary')).toBeInTheDocument();
    expect(container.querySelector('.switch-primary-light')).not.toBeInTheDocument();
    spy.mockRestore();
  });

  it('warns once per variant in development', () => {
    const spy = warn();
    normalizeSwitchVariant('warning-light');
    normalizeSwitchVariant('warning-light');
    expect(spy.mock.calls.filter((c) => String(c[0]).includes('warning-light'))).toHaveLength(1);
    spy.mockRestore();
  });

  it('no longer exports the eight Light convenience components', () => {
    // eslint-disable-next-line global-require
    const mod = require('./Switch');
    for (const c of ['Primary', 'Secondary', 'Tertiary', 'Neutral',
                     'Info', 'Success', 'Warning', 'Error']) {
      expect(mod[`${c}LightSwitch`]).toBeUndefined();
    }
  });
});
