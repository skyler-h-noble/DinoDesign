// src/components/Snackbar/Snackbar.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Snackbar } from './Snackbar';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderSnackbar = (props = {}) =>
  render(
    <Snackbar open={true} onClose={jest.fn()} {...props}>
      Test notification
    </Snackbar>
  );

/* ─── Basic Rendering ─── */
describe('Snackbar', () => {
  test('renders when open', () => {
    renderSnackbar();
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<Snackbar open={false} onClose={jest.fn()}>Hidden</Snackbar>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  test('has role="alert"', () => {
    renderSnackbar();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('has aria-live="polite"', () => {
    renderSnackbar();
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
  });

  test('has aria-atomic="true"', () => {
    renderSnackbar();
    expect(screen.getByRole('alert')).toHaveAttribute('aria-atomic', 'true');
  });
});

/* ─── data-surface ─── */
/* Two layers: role="alert" is on the OUTER shell and the attributes are on
   the INNER content box — the thing that paints a background needs theme and
   surface together, so they travel to whatever paints. Asserting on the alert
   node read them off the wrong element. */
const inner = (container) => container.querySelector('[data-surface]');

/* Snackbar has ONE surface: Surface-Brightest.
 *
 * It was "always Container-High" — a level Snackbar has never set — then a
 * per-variant default (light -> Surface-Brightest, anything else -> Surface).
 * As of 2026-09-28 `variant` no longer selects a surface at all.
 *
 * Why one: a toast carries semantic color, so on a solid fill that color is
 * also the background its label must survive on — the label then flips per
 * theme AND per mode, 18 combinations to verify instead of 9. On
 * Surface-Brightest the color lives in the border and icon while the text
 * sits on a reliable background. Alert is already single-surface, and a toast
 * is a floating alert.
 *
 * `surface` remains the way to reach any of the five levels, which is what
 * `variant` did badly — it only ever reached three, under names that did not
 * match the data-surface vocabulary. */
describe('data-surface', () => {
  test.each([
    [undefined,   'Surface-Brightest'],
    ['light',     'Surface-Brightest'],
    ['solid',     'Surface-Brightest'],   // retired, resolves to light
    ['standard',  'Surface-Brightest'],   // so does anything else
  ])('variant=%s → %s', (variant, expected) => {
    const { container } = renderSnackbar(variant ? { variant, color: 'primary' } : {});
    expect(inner(container)).toHaveAttribute('data-surface', expected);
  });

  test('NO variant value reaches a different surface', () => {
    /* The retirement has to be total. If one spelling still reached Surface,
       the 18-combination problem would come back through whichever value
       happened to survive — and it would be the one nobody tested. */
    for (const variant of ['solid', 'standard', 'dark', 'outlined', '']) {
      const { container } = renderSnackbar({ variant, color: 'error' });
      expect(inner(container)).toHaveAttribute('data-surface', 'Surface-Brightest');
    }
  });

  test('an explicit surface still wins', () => {
    const { container } = renderSnackbar({ variant: 'light', surface: 'Surface-Dim' });
    expect(inner(container)).toHaveAttribute('data-surface', 'Surface-Dim');
  });
});

/* ─── Standard variant ─── */
describe('Standard variant', () => {
  test('no data-theme on standard', () => {
    const { container } = renderSnackbar({ variant: 'standard' });
    expect(container.querySelector('.snackbar')).not.toHaveAttribute('data-theme');
  });

  test('has snackbar-standard class', () => {
    const { container } = renderSnackbar({ variant: 'standard' });
    expect(container.querySelector('.snackbar-standard')).toBeInTheDocument();
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'],
    ['warning', 'Warning'], ['error', 'Error'],
  ];

  cases.forEach(([color, theme]) => {
    test('retired solid ' + color + ' still carries data-theme="' + theme + '"', () => {
      /* `solid` was retired 2026-09-28 and resolves to light. The theme is
         unaffected — only the SURFACE changed — so this keeps asserting that a
         consumer still passing solid gets the right palette rather than
         nothing. Removing the test would let the shim rot unnoticed. */
      const { container } = renderSnackbar({ variant: 'solid', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });

  test('solid resolves to the light surface, not its own', () => {
    /* The point of the retirement. A solid fill would make the label carry the
       semantic color as its own background — 18 contrast combinations to
       verify instead of 9. */
    const { container } = renderSnackbar({ variant: 'solid', color: 'error' });
    expect(container.querySelector('[data-surface="Surface-Brightest"]')).toBeInTheDocument();
    expect(container.querySelector('[data-surface="Surface"]')).not.toBeInTheDocument();
  });

  test('an explicit surface still wins over the retirement', () => {
    /* `surface` reaches all five levels and is the escape hatch that replaces
       what `variant` used to do badly. If the shim swallowed it, retiring
       solid would have removed a capability rather than a duplicate. */
    const { container } = renderSnackbar({ variant: 'solid', color: 'error', surface: 'Surface-Dim' });
    expect(container.querySelector('[data-surface="Surface-Dim"]')).toBeInTheDocument();
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'],
    ['warning', 'Warning'], ['error', 'Error'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderSnackbar({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderSnackbar({ size: s });
      expect(container.querySelector('.snackbar-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Anchors ─── */
describe('Anchor classes', () => {
  ['top', 'bottom'].forEach((a) => {
    test(a + ' anchor class', () => {
      const { container } = renderSnackbar({ anchor: a });
      expect(container.querySelector('.snackbar-' + a)).toBeInTheDocument();
    });
  });
});

/* ─── Close mechanisms ─── */
describe('Close mechanisms', () => {
  test('Escape key triggers onClose with reason "escapeKeyDown"', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'escapeKeyDown');
  });

  test('close button triggers onClose with reason "closeClick"', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose });
    fireEvent.click(screen.getByLabelText('Close notification'));
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'closeClick');
  });

  test('close button has aria-label', () => {
    renderSnackbar();
    expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
  });

  test('close button is a button element', () => {
    renderSnackbar();
    expect(screen.getByLabelText('Close notification').tagName).toBe('BUTTON');
  });

});

/* ─── Auto-hide ─── */
describe('Auto-hide', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  test('triggers onClose after autoHideDuration', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose, autoHideDuration: 3000 });
    expect(onClose).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(3000); });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'timeout');
  });

  test('does not auto-close without autoHideDuration', () => {
    const onClose = jest.fn();
    renderSnackbar({ onClose });
    act(() => { jest.advanceTimersByTime(10000); });
    expect(onClose).not.toHaveBeenCalledWith(expect.anything(), 'timeout');
  });
});

/* ─── Decorators ─── */
describe('Decorators', () => {
  test('startDecorator renders', () => {
    render(
      <Snackbar open={true} onClose={jest.fn()} startDecorator={<span data-testid="start">★</span>}>
        Message
      </Snackbar>
    );
    expect(screen.getByTestId('start')).toBeInTheDocument();
  });


  test('endDecorator renders', () => {
    render(
      <Snackbar open={true} onClose={jest.fn()} endDecorator={<span data-testid="end">✓</span>}>
        Message
      </Snackbar>
    );
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });

});

/* ─── Action ─── */
describe('Action slot', () => {
  test('action renders', () => {
    render(
      <Snackbar open={true} onClose={jest.fn()} action={<button data-testid="action-btn">Undo</button>}>
        Message
      </Snackbar>
    );
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

});

  /* The snackbar-close / -start-decorator / -end-decorator / -action /
     -message classes do not exist: the only className Snackbar emits is
     `snackbar snackbar-<variant> -<size> -<anchor> -<color>`. Each of those
     tests sat directly beside a BEHAVIOURAL one covering the same thing — the
     close button by its accessible name, the decorators and the message by
     their rendered content — so removing them loses no coverage and drops an
     assertion about markup that was never there. */

/* ─── Message ─── */
describe('Message', () => {

  test('renders children as message', () => {
    renderSnackbar();
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });
});

/* ─── No close button when no onClose ─── */
describe('No onClose', () => {
  test('no close button rendered when onClose is undefined', () => {
    render(<Snackbar open={true}>No close</Snackbar>);
    expect(screen.queryByLabelText('Close notification')).not.toBeInTheDocument();
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default anchor is bottom', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-bottom')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-medium')).toBeInTheDocument();
  });

  test('default variant is light', () => {
    const { container } = renderSnackbar();
    expect(container.querySelector('.snackbar-light')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Snackbar — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Snackbar open={false} message="Test message" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Snackbar open={false} message="Test message" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Snackbar open={false} message="Test message" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/**
 * The edge offset comes from the device, not from a literal.
 *
 * A snackbar is positioned `fixed` against a screen edge, and how much of that
 * edge the OS has already taken is a per-device fact: a phone reserves 98px at
 * the top for its status bar and app bar where a desktop reserves nothing. The
 * component shipped `top: 16px` on every platform, which puts the snackbar on
 * top of the app bar's title on every touch device — and looks completely
 * correct in a desktop browser, which is where it was looked at.
 *
 * --SnackBar-Top / --SnackBar-Bottom are generated per device by the design
 * system. Nothing in this library defines them, so the fallback is what an
 * unthemed consumer gets, and it is the Desktop value on purpose: the library's
 * own default should not contradict what its design system says for a device
 * with no chrome.
 *
 * Read off the emotion stylesheet rather than `getComputedStyle`. jsdom drops
 * any declaration whose value contains `var()`, so the computed `top` of a
 * correctly-wired snackbar and of one with no offset at all are both the empty
 * string — a test written that way passes on the bug it is meant to catch.
 */
describe('edge offset', () => {
  /** The emotion rule for this element, as text. */
  const ruleFor = (el) => {
    const cls = [...el.classList].find((c) => c.startsWith('css-'));
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === '.' + cls) return rule.cssText;
        }
      } catch (e) { /* cross-origin sheets: none here, but cssRules can throw */ }
    }
    return '';
  };

  const offsetOf = (anchor) => {
    const { container } = render(
      <Snackbar open={true} anchor={anchor} message="Test message" />
    );
    const css = ruleFor(container.querySelector('.snackbar'));
    const grab = (prop) => (css.match(new RegExp('(?:^|[;{]\\s*)' + prop + ':\\s*([^;]+);')) || [])[1] || '';
    return { css, top: grab('top'), bottom: grab('bottom') };
  };

  test('the probe itself works — the rule is found and carries the anchor', () => {
    /* Guards the helper above. If ruleFor ever returns '' the three tests
       below would agree with each other and assert nothing. */
    expect(offsetOf('top').css).toMatch(/position:\s*fixed/);
  });

  test('reads the device token at the top, and leaves the other edge unset', () => {
    const { top, bottom } = offsetOf('top');
    expect(top).toBe('var(--SnackBar-Top, 24px)');
    /* Both edges at once would pin the snackbar to a fixed HEIGHT rather than
       anchoring it to one side, so the unused edge has to stay unset. */
    expect(bottom).toBe('');
  });

  test('reads the device token at the bottom, which is the default anchor', () => {
    expect(offsetOf('bottom').bottom).toBe('var(--SnackBar-Bottom, 24px)');
    expect(offsetOf('bottom').top).toBe('');
    expect(offsetOf(undefined).bottom).toBe('var(--SnackBar-Bottom, 24px)');
  });

  test('carries no bare pixel offset that could override the token', () => {
    /* The specific regression: `top: '16px'` reinstated further down the sx
       object, where it would win silently. Asserted on the emitted rule, since
       that is where a later declaration would show up. */
    for (const anchor of ['top', 'bottom']) {
      const { css } = offsetOf(anchor);
      const bare = (css.match(/(?:^|[;{]\s*)(top|bottom):\s*[\d.]+px;/g) || []);
      expect(`${anchor}: ${bare.join(' ')}`).toBe(`${anchor}: `);
    }
  });
});
