// src/components/Container/Container.test.js
import React from 'react';
import { render } from '@testing-library/react';
import {
  Container,
  CenteredContainer,
  FluidContainer,
  ConstrainedContainer,
  LayoutContainer,
  GridContainer,
  StackContainer,
} from './Container';

describe('Container Component', () => {
  test('renders Container with children', () => {
    const { container } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with default maxWidth lg', () => {
    const { container } = render(
      <Container>
        <div>Test</div>
      </Container>
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom maxWidth', () => {
    const { container } = render(
      <Container maxWidth="md">
        <div>Test</div>
      </Container>
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with disableGutters', () => {
    const { container } = render(
      <Container disableGutters>
        <div>Test</div>
      </Container>
    );
    expect(container).toBeInTheDocument();
  });

  test('applies design system variables', () => {
    const { container } = render(
      <Container>
        <div>Test</div>
      </Container>
    );
    const element = container.querySelector('[class*="MuiContainer"]');
    expect(element).toHaveStyle('background-color: var(--Background)');
  });
});

describe('CenteredContainer Component', () => {
  test('renders CenteredContainer', () => {
    const { container } = render(
      <CenteredContainer>
        <div>Centered content</div>
      </CenteredContainer>
    );
    expect(container).toBeInTheDocument();
  });

  test('centers content horizontally and vertically', () => {
    const { container } = render(
      <CenteredContainer>
        <div>Centered</div>
      </CenteredContainer>
    );
    const element = container.querySelector('[class*="MuiContainer"]');
    expect(element).toHaveStyle('display: flex');
    expect(element).toHaveStyle('align-items: center');
    expect(element).toHaveStyle('justify-content: center');
  });

  test('renders with custom maxWidth', () => {
    const { container } = render(
      <CenteredContainer maxWidth="sm">
        <div>Test</div>
      </CenteredContainer>
    );
    expect(container).toBeInTheDocument();
  });
});

describe('FluidContainer Component', () => {
  test('renders FluidContainer', () => {
    const { container } = render(
      <FluidContainer>
        <div>Fluid content</div>
      </FluidContainer>
    );
    expect(container).toBeInTheDocument();
  });

  test('takes full width', () => {
    const { container } = render(
      <FluidContainer>
        <div>Test</div>
      </FluidContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('width: 100%');
  });

  test('renders with different padding sizes', () => {
    const sizes = ['small', 'medium', 'large'];
    sizes.forEach(size => {
      const { container } = render(
        <FluidContainer padding={size}>
          <div>Test</div>
        </FluidContainer>
      );
      expect(container).toBeInTheDocument();
    });
  });
});

describe('ConstrainedContainer Component', () => {
  test('renders ConstrainedContainer', () => {
    const { container } = render(
      <ConstrainedContainer>
        <div>Constrained content</div>
      </ConstrainedContainer>
    );
    expect(container).toBeInTheDocument();
  });

  test('centers with margin auto', () => {
    const { container } = render(
      <ConstrainedContainer>
        <div>Test</div>
      </ConstrainedContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('margin: 0 auto');
  });

  test('renders with different sizes', () => {
    const sizes = ['compact', 'standard', 'wide', 'full'];
    sizes.forEach(size => {
      const { container } = render(
        <ConstrainedContainer size={size}>
          <div>Test</div>
        </ConstrainedContainer>
      );
      expect(container).toBeInTheDocument();
    });
  });

  test('compact size has 600px maxWidth', () => {
    const { container } = render(
      <ConstrainedContainer size="compact">
        <div>Test</div>
      </ConstrainedContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('max-width: 600px');
  });

  test('standard size has 960px maxWidth', () => {
    const { container } = render(
      <ConstrainedContainer size="standard">
        <div>Test</div>
      </ConstrainedContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('max-width: 960px');
  });

  test('wide size has 1200px maxWidth', () => {
    const { container } = render(
      <ConstrainedContainer size="wide">
        <div>Test</div>
      </ConstrainedContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('max-width: 1200px');
  });
});

describe('LayoutContainer Component', () => {
  test('renders LayoutContainer', () => {
    const { container } = render(
      <LayoutContainer>
        <div>Layout content</div>
      </LayoutContainer>
    );
    expect(container).toBeInTheDocument();
  });

  test('uses flex column layout', () => {
    const { container } = render(
      <LayoutContainer>
        <div>Test</div>
      </LayoutContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('display: flex');
    expect(element).toHaveStyle('flex-direction: column');
  });

  test('has full viewport height by default', () => {
    const { container } = render(
      <LayoutContainer>
        <div>Test</div>
      </LayoutContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('min-height: 100vh');
  });

  test('renders without full height when disabled', () => {
    const { container } = render(
      <LayoutContainer fullHeight={false}>
        <div>Test</div>
      </LayoutContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('min-height: auto');
  });
});

describe('GridContainer Component', () => {
  test('renders GridContainer', () => {
    const { container } = render(
      <GridContainer>
        <div>Grid item 1</div>
        <div>Grid item 2</div>
      </GridContainer>
    );
    expect(container).toBeInTheDocument();
  });

  test('uses grid layout', () => {
    const { container } = render(
      <GridContainer>
        <div>Test</div>
      </GridContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('display: grid');
  });

  test('renders with different column counts', () => {
    const columns = [1, 2, 3, 4, 6, 12];
    columns.forEach(col => {
      const { container } = render(
        <GridContainer columns={col}>
          <div>Test</div>
        </GridContainer>
      );
      const element = container.firstChild;
      expect(element).toHaveStyle(`grid-template-columns: repeat(${col}, 1fr)`);
    });
  });

  test('renders with different gap sizes', () => {
    const gaps = ['small', 'medium', 'large'];
    gaps.forEach(gap => {
      const { container } = render(
        <GridContainer gap={gap}>
          <div>Test</div>
        </GridContainer>
      );
      expect(container).toBeInTheDocument();
    });
  });
});

describe('StackContainer Component', () => {
  test('renders StackContainer', () => {
    const { container } = render(
      <StackContainer>
        <div>Item 1</div>
        <div>Item 2</div>
      </StackContainer>
    );
    expect(container).toBeInTheDocument();
  });

  test('uses flex layout', () => {
    const { container } = render(
      <StackContainer>
        <div>Test</div>
      </StackContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('display: flex');
  });

  test('renders with column direction by default', () => {
    const { container } = render(
      <StackContainer>
        <div>Test</div>
      </StackContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('flex-direction: column');
  });

  test('renders with row direction', () => {
    const { container } = render(
      <StackContainer direction="row">
        <div>Test</div>
      </StackContainer>
    );
    const element = container.firstChild;
    expect(element).toHaveStyle('flex-direction: row');
  });

  test('renders with different spacing sizes', () => {
    const spacings = ['small', 'medium', 'large'];
    spacings.forEach(spacing => {
      const { container } = render(
        <StackContainer spacing={spacing}>
          <div>Test</div>
        </StackContainer>
      );
      expect(container).toBeInTheDocument();
    });
  });

  test('renders with different alignments', () => {
    const alignments = ['flex-start', 'center', 'flex-end', 'stretch'];
    alignments.forEach(align => {
      const { container } = render(
        <StackContainer align={align}>
          <div>Test</div>
        </StackContainer>
      );
      const element = container.firstChild;
      expect(element).toHaveStyle(`align-items: ${align}`);
    });
  });
});
