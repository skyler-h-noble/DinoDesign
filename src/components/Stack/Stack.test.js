// src/components/Stack/Stack.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OmniStack, HStack, VStack, WrapStack, CenteredStack, SpaceBetweenStack } from './Stack';
import { axe } from 'jest-axe';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NormalChild = () => <div data-testid="child">Normal</div>;
const SmallBySizeProp = () => <div data-testid="small-size" size="small">Small</div>;
const SmallByDataAttr = () => <div data-testid="small-attr" data-size="small">Small</div>;
const SmallByHeight   = () => <div data-testid="small-height" height={24}>Small</div>;

// ─── Basic rendering ──────────────────────────────────────────────────────────

describe('OmniStack', () => {
  test('renders children', () => {
    render(<OmniStack><NormalChild /></OmniStack>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('renders multiple children', () => {
    render(
      <OmniStack>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
        <div data-testid="c">C</div>
      </OmniStack>
    );
    expect(screen.getByTestId('a')).toBeInTheDocument();
    expect(screen.getByTestId('b')).toBeInTheDocument();
    expect(screen.getByTestId('c')).toBeInTheDocument();
  });

  test('has omni-stack class', () => {
    const { container } = render(<OmniStack><NormalChild /></OmniStack>);
    expect(container.querySelector('.omni-stack')).toBeInTheDocument();
  });
});

// ─── Smart gap — detection ────────────────────────────────────────────────────

describe('Smart gap detection', () => {
  test('no small child — does NOT add enforcement class', () => {
    const { container } = render(
      <OmniStack><NormalChild /></OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).not.toBeInTheDocument();
  });

  test('child with size="small" — adds enforcement class', () => {
    const { container } = render(
      <OmniStack><SmallBySizeProp /></OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).toBeInTheDocument();
  });

  test('child with data-size="small" — adds enforcement class', () => {
    const { container } = render(
      <OmniStack><SmallByDataAttr /></OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).toBeInTheDocument();
  });

  test('child with height={24} — adds enforcement class', () => {
    const { container } = render(
      <OmniStack><SmallByHeight /></OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).toBeInTheDocument();
  });

  test('mixed children — one small is enough to enforce', () => {
    const { container } = render(
      <OmniStack>
        <NormalChild />
        <SmallBySizeProp />
        <NormalChild />
      </OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).toBeInTheDocument();
  });
});

// ─── enforceMinGap=false ──────────────────────────────────────────────────────

describe('enforceMinGap=false', () => {
  test('does not add enforcement class even with small children', () => {
    const { container } = render(
      <OmniStack enforceMinGap={false}>
        <SmallBySizeProp />
      </OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).not.toBeInTheDocument();
  });
});

// ─── data-min-gap-enforced attribute ──────────────────────────────────────────

describe('data-min-gap-enforced attribute', () => {
  test('set to "true" when enforcement is active', () => {
    const { container } = render(
      <OmniStack><SmallBySizeProp /></OmniStack>
    );
    const stack = container.querySelector('.omni-stack');
    expect(stack).toHaveAttribute('data-min-gap-enforced', 'true');
  });

  test('not present when no small children', () => {
    const { container } = render(
      <OmniStack><NormalChild /></OmniStack>
    );
    const stack = container.querySelector('.omni-stack');
    expect(stack).not.toHaveAttribute('data-min-gap-enforced');
  });
});

// ─── Convenience exports ──────────────────────────────────────────────────────

describe('Convenience exports', () => {
  test('HStack renders', () => {
    const { container } = render(<HStack><NormalChild /></HStack>);
    expect(container.querySelector('.omni-stack')).toBeInTheDocument();
  });

  test('VStack renders', () => {
    const { container } = render(<VStack><NormalChild /></VStack>);
    expect(container.querySelector('.omni-stack')).toBeInTheDocument();
  });

  test('WrapStack renders', () => {
    const { container } = render(<WrapStack><NormalChild /></WrapStack>);
    expect(container.querySelector('.omni-stack')).toBeInTheDocument();
  });

  test('CenteredStack renders', () => {
    const { container } = render(<CenteredStack><NormalChild /></CenteredStack>);
    expect(container.querySelector('.omni-stack')).toBeInTheDocument();
  });

  test('SpaceBetweenStack renders', () => {
    const { container } = render(<SpaceBetweenStack><NormalChild /></SpaceBetweenStack>);
    expect(container.querySelector('.omni-stack')).toBeInTheDocument();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('Edge cases', () => {
  test('null/undefined children do not crash', () => {
    expect(() =>
      render(<OmniStack>{null}{undefined}<NormalChild /></OmniStack>)
    ).not.toThrow();
  });

  test('empty children renders without error', () => {
    expect(() => render(<OmniStack />)).not.toThrow();
  });

  test('className prop is forwarded', () => {
    const { container } = render(
      <OmniStack className="my-custom"><NormalChild /></OmniStack>
    );
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Stack — Accessibility (jest-axe)', () => {
  test('has no violations with normal children', async () => {
    const { container } = render(
      <OmniStack>
        <div>Item A</div>
        <div>Item B</div>
      </OmniStack>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations with small children and enforcement active', async () => {
    const { container } = render(
      <OmniStack>
        <button size="small">Small button A</button>
        <button size="small">Small button B</button>
      </OmniStack>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations for HStack row layout', async () => {
    const { container } = render(
      <HStack>
        <div>Left</div>
        <div>Right</div>
      </HStack>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
