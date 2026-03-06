// src/components/Container/Container.js
import React from 'react';
import { Container as MuiContainer, Box } from '@mui/material';

/**
 * Container Component
 * Wrapper component that centers content and constrains max-width
 * Uses design system variables for spacing and responsive behavior
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {string} maxWidth - Max width: xs, sm, md, lg, xl (default: lg)
 * @param {boolean} disableGutters - Remove padding on sides (default: false)
 * @param {string} sx - Additional MUI sx props
 * @param {object} ...props - Other MUI Container props
 */
export function Container({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  sx = {},
  ...props
}) {
  return (
    <MuiContainer
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiContainer>
  );
}

/**
 * Centered Container Component
 * Container with centered content alignment
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {string} maxWidth - Max width constraint
 * @param {object} props - Additional props
 */
export function CenteredContainer({
  children,
  maxWidth = 'md',
  sx = {},
  ...props
}) {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}

/**
 * Fluid Container Component
 * Container that takes full width with side padding
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {string} padding - Padding size: small, medium, large
 * @param {object} props - Additional props
 */
export function FluidContainer({
  children,
  padding = 'medium',
  sx = {},
  ...props
}) {
  const paddingMap = {
    small: 'var(--Spacing-2)',
    medium: 'var(--Spacing-3)',
    large: 'var(--Spacing-4)',
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: paddingMap[padding],
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * Constrained Container Component
 * Container with max-width and centered margins
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {string} size - Size: compact, standard, wide, full
 * @param {object} props - Additional props
 */
export function ConstrainedContainer({
  children,
  size = 'standard',
  sx = {},
  ...props
}) {
  const sizeMap = {
    compact: { maxWidth: '600px' },
    standard: { maxWidth: '960px' },
    wide: { maxWidth: '1200px' },
    full: { maxWidth: '100%' },
  };

  return (
    <Box
      sx={{
        margin: '0 auto',
        padding: 'var(--Spacing-3)',
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        transition: 'all 0.2s ease-in-out',
        ...sizeMap[size],
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * Layout Container Component
 * Container for page layouts with header, content, and footer
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {boolean} fullHeight - Take full viewport height
 * @param {object} props - Additional props
 */
export function LayoutContainer({
  children,
  fullHeight = true,
  sx = {},
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: fullHeight ? '100vh' : 'auto',
        width: '100%',
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * Grid Container Component
 * Container with grid layout support
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {number} columns - Number of columns: 1, 2, 3, 4, 6, 12
 * @param {string} gap - Gap between items: small, medium, large
 * @param {object} props - Additional props
 */
export function GridContainer({
  children,
  columns = 12,
  gap = 'medium',
  sx = {},
  ...props
}) {
  const gapMap = {
    small: 'var(--Spacing-2)',
    medium: 'var(--Spacing-3)',
    large: 'var(--Spacing-4)',
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gapMap[gap],
        width: '100%',
        padding: 'var(--Spacing-3)',
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * Stack Container Component
 * Container with flex stack layout
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {string} direction - Direction: row, column
 * @param {string} spacing - Spacing between items: small, medium, large
 * @param {string} align - Alignment: flex-start, center, flex-end, stretch
 * @param {object} props - Additional props
 */
export function StackContainer({
  children,
  direction = 'column',
  spacing = 'medium',
  align = 'flex-start',
  sx = {},
  ...props
}) {
  const spacingMap = {
    small: 'var(--Spacing-2)',
    medium: 'var(--Spacing-3)',
    large: 'var(--Spacing-4)',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        gap: spacingMap[spacing],
        alignItems: align,
        width: '100%',
        padding: 'var(--Spacing-3)',
        backgroundColor: 'var(--Background)',
        color: 'var(--Text)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Container;
