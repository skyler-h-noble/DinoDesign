// src/components/Stepper/Stepper.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper, Step } from './Stepper';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const LABELS = ['Order', 'Processing', 'Shipped', 'Delivered'];

const renderStepper = (stepperProps = {}, stepProps = {}) =>
  render(
    <Stepper {...stepperProps}>
      {LABELS.map((l, i) => <Step key={i} label={l} {...stepProps} />)}
    </Stepper>
  );

/* ─── Basic Rendering ─── */
describe('Stepper', () => {
  test('renders all steps', () => {
    renderStepper({ activeStep: 0 });
    LABELS.forEach((l) => expect(screen.getByText(l)).toBeInTheDocument());
  });

  test('renders as ol', () => {
    const { container } = renderStepper({ activeStep: 0 });
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  test('has role="list"', () => {
    const { container } = renderStepper({ activeStep: 0 });
    expect(container.querySelector('ol')).toHaveAttribute('role', 'list');
  });

  test('has aria-label="Progress"', () => {
    const { container } = renderStepper({ activeStep: 0 });
    expect(container.querySelector('ol')).toHaveAttribute('aria-label', 'Progress');
  });

  test('steps are li elements', () => {
    const { container } = renderStepper({ activeStep: 0 });
    const items = container.querySelectorAll('li.step');
    expect(items.length).toBe(4);
  });
});

/* ─── Active Step ─── */
describe('Active step', () => {
  test('active step has step-active class', () => {
    const { container } = renderStepper({ activeStep: 1 });
    const steps = container.querySelectorAll('.step');
    expect(steps[1]).toHaveClass('step-active');
  });

  test('active indicator has aria-current="step"', () => {
    const { container } = renderStepper({ activeStep: 1 });
    const indicators = container.querySelectorAll('.step-indicator');
    expect(indicators[1]).toHaveAttribute('aria-current', 'step');
  });

  test('completed steps have step-completed class', () => {
    const { container } = renderStepper({ activeStep: 2 });
    const steps = container.querySelectorAll('.step');
    expect(steps[0]).toHaveClass('step-completed');
    expect(steps[1]).toHaveClass('step-completed');
  });

  test('incomplete steps have step-incomplete class', () => {
    const { container } = renderStepper({ activeStep: 1 });
    const steps = container.querySelectorAll('.step');
    expect(steps[2]).toHaveClass('step-incomplete');
    expect(steps[3]).toHaveClass('step-incomplete');
  });

  test('active indicator has step-indicator-active class', () => {
    const { container } = renderStepper({ activeStep: 1 });
    const indicators = container.querySelectorAll('.step-indicator');
    expect(indicators[1]).toHaveClass('step-indicator-active');
  });

  test('completed indicator has step-indicator-completed class', () => {
    const { container } = renderStepper({ activeStep: 2 });
    const indicators = container.querySelectorAll('.step-indicator');
    expect(indicators[0]).toHaveClass('step-indicator-completed');
    expect(indicators[1]).toHaveClass('step-indicator-completed');
  });
});

/* ─── Sizes ─── */
describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class on stepper', () => {
      const { container } = renderStepper({ activeStep: 0, size: s });
      expect(container.querySelector('.stepper-' + s)).toBeInTheDocument();
    });

    test(s + ' size class on indicator', () => {
      const { container } = renderStepper({ activeStep: 0, size: s });
      expect(container.querySelector('.step-indicator-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Orientation ─── */
describe('Orientation', () => {
  test('horizontal class by default', () => {
    const { container } = renderStepper({ activeStep: 0 });
    expect(container.querySelector('.stepper-horizontal')).toBeInTheDocument();
  });

  test('vertical class', () => {
    const { container } = renderStepper({ activeStep: 0, orientation: 'vertical' });
    expect(container.querySelector('.stepper-vertical')).toBeInTheDocument();
  });

  test('steps have step-horizontal class', () => {
    const { container } = renderStepper({ activeStep: 0 });
    expect(container.querySelector('.step-horizontal')).toBeInTheDocument();
  });

  test('steps have step-vertical class', () => {
    const { container } = renderStepper({ activeStep: 0, orientation: 'vertical' });
    expect(container.querySelector('.step-vertical')).toBeInTheDocument();
  });
});

/* ─── Colors ─── */
describe('Color classes', () => {
  ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderStepper({ activeStep: 0, color: c });
      expect(container.querySelector('.stepper-' + c)).toBeInTheDocument();
    });
  });

  /* The default is the one value a converter never writes out, so it is the
     one nothing else covers. Figma's `Count Step` pins no Buttons mode, so the
     circle inherits Default — and --Buttons-Primary-Button is a real color
     from the same system, which is why defaulting to primary read as a design
     choice instead of the wrong token. */
  test('defaults to the Default palette, not Primary', () => {
    const { container } = renderStepper({ activeStep: 0 });
    expect(container.querySelector('.stepper-default')).toBeInTheDocument();
    expect(container.querySelector('.stepper-primary')).not.toBeInTheDocument();
  });
});

/* ─── Clickable ─── */
describe('Clickable', () => {
  test('non-clickable indicators are div elements', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: false });
    const indicator = container.querySelector('.step-indicator');
    expect(indicator.tagName).toBe('DIV');
  });

  test('clickable indicators are button elements', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: jest.fn() });
    const indicator = container.querySelector('.step-indicator');
    expect(indicator.tagName).toBe('BUTTON');
  });

  test('clickable indicators have role="button"', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: jest.fn() });
    const indicator = container.querySelector('.step-indicator');
    expect(indicator).toHaveAttribute('role', 'button');
  });

  test('clickable indicators have aria-label', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: jest.fn() });
    const indicators = container.querySelectorAll('.step-indicator');
    expect(indicators[0]).toHaveAttribute('aria-label', 'Go to step 1');
    expect(indicators[2]).toHaveAttribute('aria-label', 'Go to step 3');
  });

  test('clickable indicators have step-indicator-clickable class', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: jest.fn() });
    expect(container.querySelector('.step-indicator-clickable')).toBeInTheDocument();
  });

  test('clicking a step calls onStepClick', () => {
    const onClick = jest.fn();
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: onClick });
    const indicators = container.querySelectorAll('.step-indicator');
    fireEvent.click(indicators[2]);
    expect(onClick).toHaveBeenCalledWith(2);
  });

  test('Enter key activates clickable step', () => {
    const onClick = jest.fn();
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: onClick });
    const indicators = container.querySelectorAll('.step-indicator');
    fireEvent.keyDown(indicators[1], { key: 'Enter' });
    expect(onClick).toHaveBeenCalledWith(1);
  });

  test('Space key activates clickable step', () => {
    const onClick = jest.fn();
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: onClick });
    const indicators = container.querySelectorAll('.step-indicator');
    fireEvent.keyDown(indicators[1], { key: ' ' });
    expect(onClick).toHaveBeenCalledWith(1);
  });

  test('clickable indicators have tabIndex 0', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: true, onStepClick: jest.fn() });
    const indicator = container.querySelector('.step-indicator');
    expect(indicator).toHaveAttribute('tabindex', '0');
  });
});

/* ─── Non-clickable ─── */
describe('Non-clickable', () => {
  test('indicators have no tabIndex', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: false });
    const indicator = container.querySelector('.step-indicator');
    expect(indicator).not.toHaveAttribute('tabindex');
  });

  test('indicators have no role', () => {
    const { container } = renderStepper({ activeStep: 0, clickable: false });
    const indicator = container.querySelector('.step-indicator');
    expect(indicator).not.toHaveAttribute('role');
  });
});

/* ─── Connectors ─── */
describe('Connectors', () => {
  test('renders N-1 connectors', () => {
    const { container } = renderStepper({ activeStep: 0 });
    const connectors = container.querySelectorAll('.step-connector');
    expect(connectors.length).toBe(LABELS.length - 1);
  });

  test('connectors are aria-hidden', () => {
    const { container } = renderStepper({ activeStep: 0 });
    const connectors = container.querySelectorAll('.step-connector');
    connectors.forEach((c) => expect(c).toHaveAttribute('aria-hidden', 'true'));
  });

  test('completed connectors have step-connector-completed class', () => {
    const { container } = renderStepper({ activeStep: 2 });
    const connectors = container.querySelectorAll('.step-connector');
    expect(connectors[0]).toHaveClass('step-connector-completed');
    expect(connectors[1]).toHaveClass('step-connector-completed');
  });

  test('incomplete connectors have step-connector-incomplete class', () => {
    const { container } = renderStepper({ activeStep: 1 });
    const connectors = container.querySelectorAll('.step-connector');
    expect(connectors[1]).toHaveClass('step-connector-incomplete');
    expect(connectors[2]).toHaveClass('step-connector-incomplete');
  });
});

/* ─── Dashed Incomplete ─── */
describe('Dashed incomplete', () => {
  test('incomplete connectors have dashed class when dashedIncomplete', () => {
    const { container } = renderStepper({ activeStep: 1, dashedIncomplete: true });
    const connectors = container.querySelectorAll('.step-connector');
    expect(connectors[1]).toHaveClass('step-connector-dashed');
    expect(connectors[2]).toHaveClass('step-connector-dashed');
  });

  test('completed connectors do NOT have dashed class', () => {
    const { container } = renderStepper({ activeStep: 2, dashedIncomplete: true });
    const connectors = container.querySelectorAll('.step-connector');
    expect(connectors[0]).not.toHaveClass('step-connector-dashed');
    expect(connectors[1]).not.toHaveClass('step-connector-dashed');
  });

  test('no dashed class when dashedIncomplete is false', () => {
    const { container } = renderStepper({ activeStep: 1, dashedIncomplete: false });
    const connectors = container.querySelectorAll('.step-connector');
    connectors.forEach((c) => expect(c).not.toHaveClass('step-connector-dashed'));
  });
});

/* ─── Icons ─── */
describe('Icons', () => {
  test('renders icon instead of number when icon prop provided', () => {
    const { container } = render(
      <Stepper activeStep={0}>
        <Step label="Cart" icon={<span data-testid="custom-icon">★</span>} />
        <Step label="Done" />
      </Stepper>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  test('renders number when no icon prop', () => {
    const { container } = render(
      <Stepper activeStep={0}>
        <Step label="First" />
        <Step label="Second" />
      </Stepper>
    );
    const indicators = container.querySelectorAll('.step-indicator');
    expect(indicators[0].textContent).toBe('1');
    expect(indicators[1].textContent).toBe('2');
  });
});

/* ─── Step count ─── */
describe('Step count', () => {
  test('renders correct number of steps', () => {
    const { container } = render(
      <Stepper activeStep={0}>
        <Step label="A" />
        <Step label="B" />
        <Step label="C" />
        <Step label="D" />
        <Step label="E" />
        <Step label="F" />
      </Stepper>
    );
    expect(container.querySelectorAll('.step').length).toBe(6);
    expect(container.querySelectorAll('.step-connector').length).toBe(5);
  });
});

/* ─── Labels ─── */
describe('Labels', () => {
  test('step label text renders', () => {
    renderStepper({ activeStep: 1 });
    expect(screen.getByText('Order')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
  });

  test('active step label is bold (has step-active class)', () => {
    const { container } = renderStepper({ activeStep: 1 });
    const steps = container.querySelectorAll('.step');
    expect(steps[1]).toHaveClass('step-active');
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Stepper — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Stepper activeStep={0}><Step label="Step 1" /><Step label="Step 2" /></Stepper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Stepper activeStep={0}><Step label="Step 1" /><Step label="Step 2" /></Stepper>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Stepper activeStep={0}><Step label="Step 1" /><Step label="Step 2" /></Stepper>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* The status ladder — three separable steps, only one of them filled.
 *
 *   incomplete   Quiet outline, Quiet number,  no fill
 *   complete     brand outline, --Text number, no fill
 *   current      brand outline, brand FILL
 *
 * This used to fill complete AND current (`isActive || isCompleted`), leaving
 * the two one pixel of border apart while incomplete was the only one that
 * looked different — so the step you are ON was the hardest to pick out.
 * Incomplete also drew its ring in the brand color; Quiet is what stops a
 * column of unreached steps reading as a row of buttons.
 */
describe('the status ladder', () => {
  const cssFor = (el) => {
    const cls = (el.className || '').split(/\s+/).find((c) => c.startsWith('css-'));
    if (!cls) return '';
    return Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText)
      .join('\n');
  };

  const threeSteps = (extra = {}) => render(
    <Stepper activeStep={1} color="primary" {...extra}>
      <Step label="One" /><Step label="Two" /><Step label="Three" />
    </Stepper>
  );

  /* The default palette is the one value a converter never writes out, so it
     is the one nothing else covers. Figma's `Count Step` pins no Buttons mode,
     so the circle inherits Default — and --Buttons-Primary-Button is a real
     color from the same system, which is why defaulting to primary read as a
     design choice rather than the wrong token. */
  test('with no color prop the current step fills from the Default palette', () => {
    const { container } = render(
      <Stepper activeStep={1}>
        <Step label="One" /><Step label="Two" /><Step label="Three" />
      </Stepper>
    );
    const now = container.querySelector('.step-indicator-active');
    expect(cssFor(now)).toContain('background-color: var(--Buttons-Default-Button)');
    expect(cssFor(now)).toContain('color: var(--Buttons-Default-Text)');
    expect(cssFor(now)).not.toContain('--Buttons-Primary-');
  });

  test('an unrecognised color name falls back to Default, not Primary', () => {
    const { container } = threeSteps({ color: 'nonsense' });
    const now = container.querySelector('.step-indicator-active');
    expect(cssFor(now)).toContain('background-color: var(--Buttons-Default-Button)');
  });

  /* Background, NOT transparent. The design fills every unselected circle
     with Background, which looks identical on a plain surface and differs the
     moment a step sits on a Container: transparent lets the container tone
     through the ring, Background punches the surface back out. */
  test('only the CURRENT step is filled; the rest take Background', () => {
    const { container } = threeSteps();
    const done = container.querySelector('.step-indicator-completed');
    const now  = container.querySelector('.step-indicator-active');
    const todo = container.querySelector('.step-indicator-incomplete');

    expect(cssFor(now)).toContain('background-color: var(--Buttons-Primary-Button)');
    expect(cssFor(done)).toContain('background-color: var(--Background)');
    expect(cssFor(todo)).toContain('background-color: var(--Background)');
    expect(cssFor(done)).not.toContain('background-color: transparent');
  });

  /* The completed circle has no fill, which makes it an outline button, so
     its digit is the outline button's text token rather than the surface's
     --Text. The file binds Outline-Text to the CURRENT one too, where the
     fill is solid — that one stays on the paired token, see the test below
     and docs/figma-parity.md. */
  test('the completed circle numbers in the outline button text token', () => {
    const { container } = threeSteps();
    const done = container.querySelector('.step-indicator-completed');
    expect(cssFor(done)).toContain('color: var(--Buttons-Primary-Outline-Text)');
  });

  /* Hover and Pressed are Buttons tokens at EVERY status. The lib read the
     surface's --Hover/--Pressed for complete and incomplete, so hovering
     those two picked up the page's grey instead of the palette's. */
  test('hover and pressed come from the palette at every status', () => {
    const { container } = threeSteps({ clickable: true, onStepClick: jest.fn() });
    for (const sel of ['.step-indicator-active', '.step-indicator-completed',
                       '.step-indicator-incomplete']) {
      const css = cssFor(container.querySelector(sel));
      expect(css).toContain('var(--Buttons-Primary-Hover)');
      expect(css).toContain('var(--Buttons-Primary-Pressed)');
    }
  });

  test('incomplete draws its ring and number in Quiet, not the brand', () => {
    const { container } = threeSteps();
    const todo = container.querySelector('.step-indicator-incomplete');
    expect(cssFor(todo)).toContain('var(--Quiet)');
    expect(cssFor(todo)).not.toContain('var(--Buttons-Primary-Border)');
  });

  test('a filled indicator takes the token PAIRED with its fill', () => {
    /* Not --Text: per invariant 3 the label is derived from the fill, so a
       palette whose button is light would put light text on a light fill. */
    const { container } = threeSteps();
    const now = container.querySelector('.step-indicator-active');
    expect(cssFor(now)).toContain('var(--Buttons-Primary-Text)');
  });

  /* THE CONNECTOR MEETS THE CIRCLE. Figma's Step Holder is a horizontal
     auto-layout with itemSpacing 0 and no padding, and the three children sit
     at x=0 / x=32 / x=273 against 32px circles — the line starts exactly where
     the circle ends. The lib put 8px either side of the horizontal connector
     and 4px above and below the vertical one, so every segment floated clear
     of the steps it joins. Margins, not gap, which is why `gap: 0` in the size
     table did not catch it. */
  /* Count Step is FIXED at Button-Height with clipsContent false, and its
     Bottom Label sits at x = -6: 44px of text centred on a 32px column. The
     lib let the column size to the LABEL, so a long one pushed the connector
     away — the margins were only half the gap. */
  test('the step column is one circle wide, whatever the label says', () => {
    const { container } = render(
      <Stepper activeStep={1}>
        <Step label="A" />
        <Step label="An extremely long step label that dwarfs the circle" />
        <Step label="C" />
      </Stepper>
    );
    const cols = container.querySelectorAll('.step-horizontal > div:first-of-type');
    for (const col of cols) expect(cssFor(col)).toContain('width: 32px');
  });

  test('the connector carries no margin, so it meets the circle', () => {
    const { container } = threeSteps();
    const css = cssFor(container.querySelector('.step-connector'));
    expect(css).not.toContain('margin-left: 8px');
    expect(css).not.toContain('margin-right: 8px');
  });

  test('and the same vertically', () => {
    const { container } = threeSteps({ orientation: 'vertical' });
    const css = cssFor(container.querySelector('.step-connector'));
    expect(css).not.toContain('margin-top: 4px');
    expect(css).not.toContain('margin-bottom: 4px');
  });

  /* Step-Line strokes Border when complete and Quiet when not — a BUTTONS
     token on one side and a SURFACE one on the other, so a travelled segment
     follows the palette and an untravelled one follows the page. The lib drew
     the travelled one in --Buttons-{C}-Button, a full-strength fill where the
     design draws a border tone. */
  test('the connector reads Border behind you and Quiet ahead', () => {
    const { container } = threeSteps();
    const segs = container.querySelectorAll('.step-connector');
    expect(cssFor(segs[0])).toContain('background-color: var(--Buttons-Primary-Border)');
    expect(cssFor(segs[1])).toContain('background-color: var(--Quiet)');
    expect(cssFor(segs[0])).not.toContain('var(--Buttons-Primary-Button)');
  });

  /* The dashed incomplete line is NOT library-only — the file has it, as the
     Step-Line variant confusingly named `incomplete-solid`. 2 on / 2 off
     across and 4/4 down, from the file's own dash arrays. */
  test('dashedIncomplete dots the untravelled segment in Quiet', () => {
    const { container } = threeSteps({ dashedIncomplete: true });
    const css = cssFor(container.querySelector('.step-connector-dashed'));
    expect(css).toContain('var(--Quiet)');
    expect(css).toContain('2px');
    expect(css).not.toContain('var(--Border)');
  });

  /* The COMPLETE ring is 2px; current and incomplete are 1. Button-Fill's
     strokeWeight is a plain 2 on all five complete states and 1 on the other
     ten. This file briefly consolidated to one width — right about the
     current step, which is filled and says so with its fill, and wrong about
     the complete one, which is an outline and has only its ring. */
  /* THE DOT AND THE RULE SHARE A BAND. Measured in the file: in the noCount
     stepper the dot's Ellipse sits at relY 10 of a 32px row, so its centre is
     16, and the Step-Line's 2px rule centres on 16 too. The dot is not
     centred on itself — it is centred in a Button-Height band, which is what
     lets a 12px dot and a 32px circle sit on one rule. A version of this
     halved the dot instead and ran the line along the bottom edge of the
     dots. */
  test('the dot sits in a Button-Height band, not its own box', () => {
    const { container } = threeSteps({ variant: 'noCount' });
    const band = container.querySelector('.step-indicator').parentElement;
    expect(cssFor(band)).toContain('height: 32px');
    expect(cssFor(band)).toContain('align-items: center');
  });

  test('so the rule is offset by half the band at either style', () => {
    for (const variant of ['count', 'noCount']) {
      const { container, unmount } = threeSteps({ variant });
      const css = cssFor(container.querySelector('.step-connector'));
      expect(css).toContain('margin-top: calc(16px -');
      unmount();
    }
  });

  /* Button-Height, read off Component-Size: 24 / 32 / 56. Large was 40, a
     number the lib chose rather than read. */
  test('large is Button-Height 56, not 40', () => {
    const { container } = threeSteps({ size: 'large' });
    const css = cssFor(container.querySelector('.step-indicator'));
    expect(css).toContain('width: 56px');
    expect(css).not.toContain('width: 40px');
  });

  test('current and incomplete rings are one border width', () => {
    const { container } = threeSteps();
    for (const sel of ['.step-indicator-active', '.step-indicator-incomplete']) {
      expect(cssFor(container.querySelector(sel))).toContain('var(--Button-Border-Width, 1px)');
    }
  });

  test('the completed ring is 2px', () => {
    const { container } = threeSteps();
    const css = cssFor(container.querySelector('.step-indicator-completed'));
    expect(css).toContain('border: 2px solid var(--Buttons-Primary-Border)');
  });

  /* typography-tokens.css declares --Font-Family-Button as
     var(--Platform-Font-Families-Body) with NO fallback, and nothing defines
     that outside a brand's own device blocks — so in the bundled CSS it is
     the guaranteed-invalid value. A lone `var(--Font-Family-Button, inherit)`
     dropped to the page font and the digit came out in the host's face. */
  test('the digit names the body face before giving up to inherit', () => {
    const { container } = threeSteps();
    const css = cssFor(container.querySelector('.step-indicator-active'));
    expect(css).toContain('var(--Font-Family-Button, var(--Font-Family-Body, inherit))');
  });
});

/* noCount — the dot stepper. The lib had no equivalent at all: StepIndicator
 * always rendered `icon || index+1` inside a 24/32/40 circle, so an 8px dot
 * was unreachable. Diameters are Component-Size `No Count Step` (8/12/16). */
describe('variant="noCount" draws dots', () => {
  const cssFor = (el) => {
    const cls = (el.className || '').split(/\s+/).find((c) => c.startsWith('css-'));
    if (!cls) return '';
    return Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText)
      .join('\n');
  };

  /* Token AND fallback: the number alone would pass on a hardcoded literal,
     the variable alone on a wrong fallback. */
  test.each([
    ['small',  'var(--Sm-No-Count-Step, 8px)'],
    ['medium', 'var(--No-Count-Step, 12px)'],
    ['large',  'var(--Lg-No-Count-Step, 16px)'],
  ])('%s dot reads %s', (size, expected) => {
      const { container } = render(
        <Stepper activeStep={0} size={size} variant="noCount">
          <Step label="One" /><Step label="Two" />
        </Stepper>
      );
      expect(cssFor(container.querySelector('.step-indicator'))).toContain('width: ' + expected);
    });

  test('and shows no number', () => {
    const { container } = render(
      <Stepper activeStep={0} variant="noCount">
        <Step label="One" /><Step label="Two" />
      </Stepper>
    );
    expect(container.querySelector('.step-indicator').textContent).toBe('');
  });

  test('while the default variant still numbers them', () => {
    const { container } = render(
      <Stepper activeStep={0}><Step label="One" /><Step label="Two" /></Stepper>
    );
    expect(container.querySelector('.step-indicator').textContent).toBe('1');
  });
});

describe('the step reads its type and focus from tokens', () => {
  /* Same technique the dot tests use: emotion puts sx into a generated class,
     so the value is in the stylesheet rather than the inline style. */
  const cssFor = (el) => {
    const cls = (el.className || '').split(/\s+/).find((c) => c.startsWith('css-'));
    if (!cls) return '';
    return Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText)
      .join('\n');
  };

  it('takes the digit weight from the Button-Small type style, not a literal', () => {
    /* The design binds Typography/Buttons/Small to the step's digit. It was a
       hard-coded 700, so a brand picking a lighter button face moved the
       design's numbers and not the lib's. Token AND fallback, for the reason
       the dot tests give: the number alone would pass on a literal. */
    const { container } = render(
      <Stepper activeStep={1}>
        {LABELS.map((l, i) => <Step key={i} label={l} />)}
      </Stepper>,
    );
    const indicator = container.querySelector('[class*="step-indicator"]');
    expect(indicator).toBeTruthy();
    expect(cssFor(indicator)).toContain('var(--Button-Small-Font-Weight, 700)');
  });

  it('draws a 2px focus ring at a 1px offset', () => {
    /* 2px is what the design draws and what 35 other components use; this was
       one of the 21 on 3px. The 1px offset keeps the ring clear of the step's
       own border without swallowing it. */
    const src = require('fs').readFileSync(__dirname + '/Stepper.js', 'utf8');
    expect(src).toContain("outline: '2px solid var(--Focus-Visible)'");
    expect(src).toContain("outlineOffset: '1px'");
    expect(src).not.toContain("outline: '3px solid var(--Focus-Visible)'");
  });

  it('carries no dead size config', () => {
    /* labelFontSize sat in SIZE_MAP as 13/14/16 literal pixels and nothing ever
       read it — labels render through BodySmall and Caption, which size
       themselves from the type tokens. A dead entry that looks like
       configuration is worse than none: the next person tunes it and nothing
       happens. It survives only in the comment that says why it is gone. */
    const src = require('fs').readFileSync(__dirname + '/Stepper.js', 'utf8');
    const lines = src.split('\n').filter((l) => l.includes('labelFontSize'));
    expect(lines.every((l) => l.trim().startsWith('/*') || l.includes('is NOT here'))).toBe(true);
  });
});
