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
  ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderStepper({ activeStep: 0, color: c });
      expect(container.querySelector('.stepper-' + c)).toBeInTheDocument();
    });
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
