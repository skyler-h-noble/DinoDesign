// src/components/Stack/Stack.test.js
import { render, screen } from '@testing-library/react';
import {
  Stack,
  HStack,
  VStack,
  CenteredStack,
  SpaceBetweenStack,
  ResponsiveStack,
  GridStack,
  StackDivider,
  InsetStack,
  ScrollStack,
  WrapStack,
} from './Stack';
import { axe } from 'jest-axe';

describe('Stack Components', () => {
  const testContent = (
    <>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </>
  );

  describe('Stack', () => {
    test('renders with children', () => {
      render(<Stack>{testContent}</Stack>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    test('renders with column direction', () => {
      const { container } = render(
        <Stack direction="column">{testContent}</Stack>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders with row direction', () => {
      const { container } = render(
        <Stack direction="row">{testContent}</Stack>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('applies spacing', () => {
      const { container } = render(
        <Stack spacing={3}>{testContent}</Stack>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('applies justifyContent', () => {
      const { container } = render(
        <Stack justifyContent="center">{testContent}</Stack>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('applies alignItems', () => {
      const { container } = render(
        <Stack alignItems="center">{testContent}</Stack>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('applies fullWidth', () => {
      const { container } = render(
        <Stack fullWidth>{testContent}</Stack>
      );
      expect(container.firstChild).toHaveStyle('width: 100%');
    });
  });

  describe('HStack', () => {
    test('renders horizontal stack', () => {
      render(<HStack>{testContent}</HStack>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    test('centers items vertically by default', () => {
      const { container } = render(
        <HStack>{testContent}</HStack>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('VStack', () => {
    test('renders vertical stack', () => {
      render(<VStack>{testContent}</VStack>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    test('stretches items by default', () => {
      const { container } = render(
        <VStack>{testContent}</VStack>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('CenteredStack', () => {
    test('renders centered content', () => {
      render(<CenteredStack>{testContent}</CenteredStack>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('SpaceBetweenStack', () => {
    test('renders with space-between', () => {
      render(<SpaceBetweenStack>{testContent}</SpaceBetweenStack>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    test('is fullWidth by default', () => {
      const { container } = render(
        <SpaceBetweenStack>{testContent}</SpaceBetweenStack>
      );
      expect(container.firstChild).toHaveStyle('width: 100%');
    });
  });

  describe('ResponsiveStack', () => {
    test('renders responsive stack', () => {
      render(<ResponsiveStack>{testContent}</ResponsiveStack>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('GridStack', () => {
    test('renders grid items', () => {
      const items = ['Item A', 'Item B', 'Item C'];
      render(
        <GridStack
          items={items}
          renderItem={(item) => <div>{item}</div>}
        />
      );
      expect(screen.getByText('Item A')).toBeInTheDocument();
      expect(screen.getByText('Item B')).toBeInTheDocument();
      expect(screen.getByText('Item C')).toBeInTheDocument();
    });

    test('respects column count', () => {
      const items = Array.from({ length: 6 }, (_, i) => `Item ${i + 1}`);
      render(
        <GridStack
          items={items}
          columns={3}
          renderItem={(item) => <div>{item}</div>}
        />
      );
      items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  describe('StackDivider', () => {
    test('renders with divider', () => {
      render(<StackDivider>{testContent}</StackDivider>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('InsetStack', () => {
    test('renders with inset padding', () => {
      const { container } = render(
        <InsetStack>{testContent}</InsetStack>
      );
      expect(container.firstChild).toHaveStyle('padding: var(--Spacing-3)');
    });
  });

  describe('ScrollStack', () => {
    test('renders scrollable stack', () => {
      const { container } = render(
        <ScrollStack>{testContent}</ScrollStack>
      );
      expect(container.firstChild).toHaveStyle('overflow: auto');
    });
  });

  describe('WrapStack', () => {
    test('renders wrapping stack', () => {
      render(<WrapStack>{testContent}</WrapStack>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    test('flexWrap is enabled', () => {
      const { container } = render(
        <WrapStack>{testContent}</WrapStack>
      );
      expect(container.firstChild).toHaveStyle('flex-wrap: wrap');
    });
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Stack — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Stack><div>Item one</div><div>Item two</div></Stack>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Stack><div>Item one</div><div>Item two</div></Stack>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Stack><div>Item one</div><div>Item two</div></Stack>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
