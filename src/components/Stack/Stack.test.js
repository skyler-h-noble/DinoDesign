// src/components/Stack/Stack.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OmniStack, HStack, VStack, WrapStack, CenteredStack, SpaceBetweenStack } from './Stack';
import { axe } from 'jest-axe';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NormalChild = () => <div data-testid="child">Normal</div>;
/* The marker prop has to be on the ELEMENT Stack receives, not inside a
   component it renders. isSmallChild reads child.props, and a wrapper like
   `() => <div size="small"/>` has no props of its own — Stack cannot see what
   its children render internally, which is a React constraint rather than a
   gap in the detection. Written the old way these three could never pass
   however correct the component was. */
const SmallBySizeProp = (p) => <div data-testid="small-size" {...p}>Small</div>;
const SmallByDataAttr = (p) => <div data-testid="small-attr" {...p}>Small</div>;
const SmallByHeight   = (p) => <div data-testid="small-height" {...p}>Small</div>;

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
      <OmniStack><SmallBySizeProp size="small" /></OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).toBeInTheDocument();
  });

  test('child with data-size="small" — adds enforcement class', () => {
    const { container } = render(
      <OmniStack><SmallByDataAttr data-size="small" /></OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).toBeInTheDocument();
  });

  test('child with height={24} — adds enforcement class', () => {
    const { container } = render(
      <OmniStack><SmallByHeight height={24} /></OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).toBeInTheDocument();
  });

  test('mixed children — one small is enough to enforce', () => {
    const { container } = render(
      <OmniStack>
        <NormalChild />
        <SmallBySizeProp size="small" />
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
        <SmallBySizeProp size="small" />
      </OmniStack>
    );
    expect(container.querySelector('.omni-stack-min-gap-enforced')).not.toBeInTheDocument();
  });
});

// ─── data-min-gap-enforced attribute ──────────────────────────────────────────

describe('data-min-gap-enforced attribute', () => {
  test('set to "true" when enforcement is active', () => {
    const { container } = render(
      <OmniStack><SmallBySizeProp size="small" /></OmniStack>
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

/* --- A layout primitive does not paint --- */
describe('Background', () => {
  /* It painted var(--Background) unconditionally, on the reasoning that with
     no surface set it resolves to the inherited value and is a no-op. That
     holds only while the parent is painting the same flat colour. Over a hero
     image, a gradient, or a Card at a Container level, an unsurfaced Stack
     punches an opaque rectangle through it — which is how a row of buttons
     ends up with a visible slab behind it. */
  test('no background when no surface is declared', () => {
    const { container } = render(<OmniStack><span>a</span></OmniStack>);
    const el = container.querySelector('.omni-stack');
    expect(el.style.background).toBe('');
  });

  test('paints when given a surface', () => {
    const { container } = render(<OmniStack data-surface="Container"><span>a</span></OmniStack>);
    expect(container.querySelector('.omni-stack')).toHaveAttribute('data-surface', 'Container');
  });

  test('paints when given a theme', () => {
    const { container } = render(<OmniStack data-theme="Primary"><span>a</span></OmniStack>);
    expect(container.querySelector('.omni-stack')).toHaveAttribute('data-theme', 'Primary');
  });
});
