// src/components/Stack/Stack.stories.js
import { Box, Typography } from '@mui/material';
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
  StackShowcase,
} from './Stack';

export default {
  title: 'Layout/Stack',
  component: Stack,
};

// Basic Stacks
export const BasicStack = {
  render: () => (
    <Stack spacing={2}>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)' }}>Item 1</Box>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)' }}>Item 2</Box>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)' }}>Item 3</Box>
    </Stack>
  ),
};

export const HorizontalStack = {
  render: () => (
    <HStack spacing={2}>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)', flex: 1 }}>Item 1</Box>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)', flex: 1 }}>Item 2</Box>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)', flex: 1 }}>Item 3</Box>
    </HStack>
  ),
};

export const CenteredContent = {
  render: () => (
    <CenteredStack spacing={2} sx={{ minHeight: 300, backgroundColor: 'var(--Container-Low)' }}>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)' }}>Centered</Box>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)' }}>Content</Box>
    </CenteredStack>
  ),
};

export const SpaceBetween = {
  render: () => (
    <SpaceBetweenStack spacing={0} sx={{ p: 2, backgroundColor: 'var(--Container-Low)' }}>
      <Box>Start</Box>
      <Box>Middle</Box>
      <Box>End</Box>
    </SpaceBetweenStack>
  ),
};

export const ResponsiveLayout = {
  render: () => (
    <ResponsiveStack
      mobileDirection="column"
      desktopDirection="row"
      spacing={2}
    >
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)', flex: 1 }}>
        Mobile: Column, Desktop: Row
      </Box>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)', flex: 1 }}>
        Responsive Layout
      </Box>
    </ResponsiveStack>
  ),
};

export const WithDividers = {
  render: () => (
    <StackDivider spacing={2}>
      <Box sx={{ p: 2 }}>Section 1</Box>
      <Box sx={{ p: 2 }}>Section 2</Box>
      <Box sx={{ p: 2 }}>Section 3</Box>
    </StackDivider>
  ),
};

export const GridLayout = {
  render: () => (
    <GridStack
      items={Array.from({ length: 9 }, (_, i) => `Item ${i + 1}`)}
      columns={3}
      spacing={2}
      renderItem={(item) => (
        <Box sx={{ p: 2, backgroundColor: 'var(--Container)', textAlign: 'center' }}>
          {item}
        </Box>
      )}
    />
  ),
};

export const WrappingItems = {
  render: () => (
    <WrapStack spacing={1}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            p: 1,
            backgroundColor: 'var(--Container)',
            borderRadius: 1,
            minWidth: '100px',
            textAlign: 'center',
          }}
        >
          Tag {i + 1}
        </Box>
      ))}
    </WrapStack>
  ),
};

export const ScrollableContent = {
  render: () => (
    <ScrollStack maxHeight={200}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            p: 2,
            backgroundColor: 'var(--Container)',
            borderBottom: '1px solid var(--Border)',
          }}
        >
          Item {i + 1}
        </Box>
      ))}
    </ScrollStack>
  ),
};

export const InsetContent = {
  render: () => (
    <InsetStack spacing={2} sx={{ backgroundColor: 'var(--Container-Low)' }}>
      <Typography variant="h6">Content with Padding</Typography>
      <Typography variant="body2">
        This stack has consistent padding around its content using design system spacing variables.
      </Typography>
      <Box sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1 }}>
        Nested content
      </Box>
    </InsetStack>
  ),
};

export const DifferentSpacings = {
  render: () => (
    <VStack spacing={1} sx={{ p: 2, backgroundColor: 'var(--Container-Low)' }}>
      <Typography variant="subtitle2">Spacing Scale</Typography>
      {[1, 2, 3, 4].map((spacing) => (
        <Box key={spacing}>
          <Typography variant="caption">Spacing: {spacing}</Typography>
          <Stack spacing={spacing} sx={{ mt: 1 }}>
            <Box sx={{ p: 1, backgroundColor: 'var(--Container)' }}>Item A</Box>
            <Box sx={{ p: 1, backgroundColor: 'var(--Container)' }}>Item B</Box>
          </Stack>
        </Box>
      ))}
    </VStack>
  ),
};

export const AllShowcase = {
  render: () => <StackShowcase />,
};
