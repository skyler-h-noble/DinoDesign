// src/components/Sheet/Sheet.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sheet } from './Sheet';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderSheet = (props = {}) =>
  render(<Sheet {...props}><span>Content</span></Sheet>);

/* ─── Basic Rendering ─── */
describe('Sheet', () => {
  test('renders children', () => {
    renderSheet();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('renders as div by default', () => {
    const { container } = renderSheet();
    expect(container.querySelector('.sheet').tagName).toBe('DIV');
  });
});

/* ─── data-surface ─── */
/* Sheet never emitted data-surface="Container" — that is Card's behaviour for
   a default-COLOUR card. This block asserted it for three variants, one of
   which ('default') Sheet has never had: commit 77efe68 moved "default" from
   being a variant to being a COLOUR, and the test was not updated, so
   `DefaultSheet` resolved to undefined and took the whole suite down with it.
   Surface is now a direct prop with no variant mapping in front of it. */
describe('data-surface is whatever the caller asks for', () => {
  test('defaults to Surface', () => {
    const { container } = renderSheet({ color: 'primary' });
    expect(container.querySelector('[data-surface="Surface"]')).toBeInTheDocument();
  });

  test.each(['Surface-Brightest', 'Surface-Dimmest', 'Container', 'Surface-Dim'])(
    'takes %s directly', (level) => {
      const { container } = renderSheet({ color: 'primary', surface: level });
      expect(container.querySelector('[data-surface="' + level + '"]')).toBeInTheDocument();
    });

  test('reaches all five levels, which the old three variants could not', () => {
    /* solid / light / dark chose between Surface, Surface-Brightest and
       Surface-Dimmest under names that said nothing about which. */
    for (const level of ['Surface', 'Surface-Bright', 'Surface-Brightest', 'Surface-Dim', 'Surface-Dimmest']) {
      const { container } = renderSheet({ surface: level });
      expect(container.querySelector('[data-surface="' + level + '"]')).toBeInTheDocument();
    }
  });
});

/* ─── data-theme ─── */
describe('data-theme follows color', () => {
  const cases = [
    ['primary', 'Primary'],
    ['secondary', 'Secondary'],
    ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'],
    ['info', 'Info'],
    ['success', 'Success'],
    ['warning', 'Warning'],
    ['error', 'Error'],
  ];

  cases.forEach(([color, theme]) => {
    test(color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderSheet({ color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });

  test('and is Default when no color is given', () => {
    const { container } = renderSheet({});
    expect(container.querySelector('[data-theme="Default"]')).toBeInTheDocument();
  });
});

/* ─── The removed variant axis ─── */
describe('variant is accepted and ignored', () => {
  test('does not reach the DOM as an attribute', () => {
    const { container } = renderSheet({ variant: 'light' });
    expect(container.querySelector('[variant]')).toBeNull();
  });

  test('and no longer selects a surface', () => {
    const { container } = renderSheet({ variant: 'dark' });
    expect(container.querySelector('[data-surface="Surface"]')).toBeInTheDocument();
    expect(container.querySelector('[data-surface="Surface-Dimmest"]')).toBeNull();
  });

  test('no sheet-<variant> class is emitted', () => {
    const { container } = renderSheet({ variant: 'solid' });
    expect(container.querySelector('.sheet-solid')).toBeNull();
  });
});

/* ─── Elevation ─── */
/* Sheet has one elevation control: the `elevated` BOOLEAN, which picks between
   two shadow levels. The blocks removed here asserted `bordered`, `rounded`
   and a numeric `elevation` prop — none of which Sheet has ever had on this
   shape of the component. One of them (`bordered={false} removes the class`)
   was even passing, because the class is absent either way: a test green for
   the wrong reason, which is worse than a red one. */
describe('elevated', () => {
  test('adds the elevated class', () => {
    const { container } = renderSheet({ elevated: true });
    expect(container.querySelector('.sheet-elevated')).toBeInTheDocument();
  });

  test('and is off by default', () => {
    const { container } = renderSheet();
    expect(container.querySelector('.sheet-elevated')).toBeNull();
  });
});

/* ─── Component override ─── */
describe('Component override', () => {
  test('renders as section', () => {
    const { container } = renderSheet({ component: 'section' });
    expect(container.querySelector('.sheet').tagName).toBe('SECTION');
  });

  test('renders as aside', () => {
    const { container } = renderSheet({ component: 'aside' });
    expect(container.querySelector('.sheet').tagName).toBe('ASIDE');
  });
});

/* SolidSheet / LightSheet / DarkSheet are gone with the variant axis — each
   was a surface level wearing a name that did not say which one. The
   replacement is `surface`, covered above. */

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Sheet — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Sheet>Content</Sheet>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Sheet>Content</Sheet>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Sheet>Content</Sheet>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
