// src/components/Container/Container.stories.js
import {
  Container,
  CenteredContainer,
  FluidContainer,
  ConstrainedContainer,
  LayoutContainer,
  GridContainer,
  StackContainer,
} from './Container';
import { Box, Typography } from '@mui/material';

export default {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
};

// Basic Container
export const Basic = {
  render: () => (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Basic Container
        </Typography>
        <Typography variant="body1">
          This is a container with maxWidth "lg" and centered content.
        </Typography>
      </Box>
    </Container>
  ),
};

// All MaxWidth Options
export const AllMaxWidths = {
  render: () => {
    const maxWidths = ['xs', 'sm', 'md', 'lg', 'xl'];
    return (
      <Box>
        {maxWidths.map(width => (
          <Container key={width} maxWidth={width} sx={{ py: 3, border: '1px solid var(--Border)' }}>
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
              maxWidth: {width}
            </Typography>
            <Typography variant="body2">Container content</Typography>
          </Container>
        ))}
      </Box>
    );
  },
};

// Centered Container
export const Centered = {
  render: () => (
    <CenteredContainer maxWidth="md">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Centered Content
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--Text-Secondary)' }}>
          This content is centered horizontally and vertically
        </Typography>
      </Box>
    </CenteredContainer>
  ),
};

// Fluid Container with Padding Sizes
export const FluidWithPadding = {
  render: () => {
    const paddings = ['small', 'medium', 'large'];
    return (
      <Box>
        {paddings.map(padding => (
          <FluidContainer key={padding} padding={padding} sx={{ borderBottom: '1px solid var(--Border)' }}>
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
              padding: {padding}
            </Typography>
            <Typography variant="body2">Fluid container content</Typography>
          </FluidContainer>
        ))}
      </Box>
    );
  },
};

// Constrained Container Sizes
export const ConstrainedSizes = {
  render: () => {
    const sizes = ['compact', 'standard', 'wide', 'full'];
    return (
      <Box sx={{ py: 4 }}>
        {sizes.map(size => (
          <ConstrainedContainer key={size} size={size} sx={{ mb: 2, border: '1px solid var(--Border)' }}>
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
              size: {size}
            </Typography>
            <Typography variant="body2">Constrained container - {size} size</Typography>
          </ConstrainedContainer>
        ))}
      </Box>
    );
  },
};

// Layout Container
export const Layout = {
  render: () => (
    <LayoutContainer fullHeight={false}>
      <Box sx={{ bg: 'var(--Header)', p: 3, borderBottom: '1px solid var(--Border)' }}>
        <Typography variant="h6">Header</Typography>
      </Box>
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Main Content
        </Typography>
        <Typography variant="body1">This is the main layout content area</Typography>
      </Box>
      <Box sx={{ p: 3, borderTop: '1px solid var(--Border)' }}>
        <Typography variant="body2">Footer</Typography>
      </Box>
    </LayoutContainer>
  ),
};

// Grid Container with Different Columns
export const GridLayout = {
  render: () => (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        2 Columns
      </Typography>
      <GridContainer columns={2} gap="medium">
        {[1, 2, 3, 4].map(i => (
          <Box
            key={i}
            sx={{
              p: 2,
              backgroundColor: 'var(--Container)',
              borderRadius: 1,
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Item {i}</Typography>
          </Box>
        ))}
      </GridContainer>

      <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
        3 Columns
      </Typography>
      <GridContainer columns={3} gap="medium">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Box
            key={i}
            sx={{
              p: 2,
              backgroundColor: 'var(--Container)',
              borderRadius: 1,
              minHeight: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Item {i}</Typography>
          </Box>
        ))}
      </GridContainer>
    </Box>
  ),
};

// Stack Container - Column
export const StackColumn = {
  render: () => (
    <StackContainer direction="column" spacing="medium">
      {[1, 2, 3].map(i => (
        <Box
          key={i}
          sx={{
            p: 2,
            backgroundColor: 'var(--Container)',
            borderRadius: 1,
          }}
        >
          <Typography>Stacked Item {i}</Typography>
        </Box>
      ))}
    </StackContainer>
  ),
};

// Stack Container - Row
export const StackRow = {
  render: () => (
    <StackContainer direction="row" spacing="medium" align="stretch">
      {[1, 2, 3].map(i => (
        <Box
          key={i}
          sx={{
            p: 2,
            backgroundColor: 'var(--Container)',
            borderRadius: 1,
            flex: 1,
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>Item {i}</Typography>
        </Box>
      ))}
    </StackContainer>
  ),
};

// Stack Container - Different Alignments
export const StackAlignments = {
  render: () => {
    const alignments = ['flex-start', 'center', 'flex-end'];
    return (
      <Box sx={{ py: 4 }}>
        {alignments.map(align => (
          <Box key={align} sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)', mb: 1, display: 'block' }}>
              align: {align}
            </Typography>
            <StackContainer direction="row" spacing="medium" align={align}>
              {[1, 2, 3].map(i => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    backgroundColor: 'var(--Container)',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">Item {i}</Typography>
                </Box>
              ))}
            </StackContainer>
          </Box>
        ))}
      </Box>
    );
  },
};

// Grid with Different Gap Sizes
export const GridGapSizes = {
  render: () => {
    const gaps = ['small', 'medium', 'large'];
    return (
      <Box sx={{ py: 4 }}>
        {gaps.map(gap => (
          <Box key={gap} sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)', mb: 1, display: 'block' }}>
              gap: {gap}
            </Typography>
            <GridContainer columns={3} gap={gap}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    backgroundColor: 'var(--Container)',
                    borderRadius: 1,
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography>{i}</Typography>
                </Box>
              ))}
            </GridContainer>
          </Box>
        ))}
      </Box>
    );
  },
};

// Responsive Container Example
export const Responsive = {
  render: () => (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Responsive Container
        </Typography>
        <GridContainer columns={2} gap="medium">
          {[1, 2, 3, 4].map(i => (
            <Box
              key={i}
              sx={{
                p: 3,
                backgroundColor: 'var(--Container)',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Card {i}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
                This grid container automatically adjusts columns on smaller screens
              </Typography>
            </Box>
          ))}
        </GridContainer>
      </Box>
    </Container>
  ),
};
