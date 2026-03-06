// src/components/Stack/Stack.js
import React from 'react';
import { Stack as MuiStack, Box } from '@mui/material';

/**
 * Stack Component - Design System Implementation
 * 
 * Flexible layout component for arranging items in a row or column
 * Uses design system spacing variables for consistent gaps
 * 
 * WCAG 2.1 AA accessibility compliant
 * 
 * @param {React.ReactNode} children - Stack content
 * @param {string} direction - Direction: row, column (default: column)
 * @param {string | number} spacing - Gap between items (uses var(--Spacing-[n]))
 * @param {string} justifyContent - Horizontal alignment: flex-start, center, flex-end, space-between, space-around, space-evenly
 * @param {string} alignItems - Vertical alignment: flex-start, center, flex-end, stretch
 * @param {boolean} fullWidth - Stretch to full width (default: false)
 * @param {boolean} fullHeight - Stretch to full height (default: false)
 * @param {string} sx - Additional MUI sx props
 * @param {object} ...props - Other MUI Stack props
 */
export function Stack({
  children,
  direction = 'column',
  spacing = 2,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  fullWidth = false,
  fullHeight = false,
  sx = {},
  ...props
}) {
  // Convert spacing to design system variable if number
  const gapValue = typeof spacing === 'number'
    ? `var(--Spacing-${spacing})`
    : spacing;

  return (
    <MuiStack
      direction={direction}
      spacing={spacing}
      justifyContent={justifyContent}
      alignItems={alignItems}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        height: fullHeight ? '100%' : 'auto',
        gap: gapValue,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiStack>
  );
}

/**
 * HStack Component - Horizontal Stack
 * Convenience wrapper for row direction
 */
export function HStack({
  children,
  spacing = 2,
  justifyContent = 'flex-start',
  alignItems = 'center',
  fullWidth = false,
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction="row"
      spacing={spacing}
      justifyContent={justifyContent}
      alignItems={alignItems}
      fullWidth={fullWidth}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * VStack Component - Vertical Stack
 * Convenience wrapper for column direction
 */
export function VStack({
  children,
  spacing = 2,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  fullWidth = false,
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction="column"
      spacing={spacing}
      justifyContent={justifyContent}
      alignItems={alignItems}
      fullWidth={fullWidth}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * CenteredStack Component - Centered content
 * Stack with items centered both horizontally and vertically
 */
export function CenteredStack({
  children,
  direction = 'column',
  spacing = 2,
  fullWidth = false,
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      justifyContent="center"
      alignItems="center"
      fullWidth={fullWidth}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * SpaceBetweenStack Component - Space between items
 * Stack with maximum spacing between items
 */
export function SpaceBetweenStack({
  children,
  direction = 'row',
  spacing = 0,
  fullWidth = true,
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      justifyContent="space-between"
      alignItems="center"
      fullWidth={fullWidth}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * ResponsiveStack Component - Responsive direction
 * Changes direction based on screen size
 */
export function ResponsiveStack({
  children,
  mobileDirection = 'column',
  desktopDirection = 'row',
  spacing = 2,
  mobileSpacing = spacing,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction={{ xs: mobileDirection, md: desktopDirection }}
      spacing={{ xs: mobileSpacing, md: spacing }}
      justifyContent={justifyContent}
      alignItems={alignItems}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * GridStack Component - Multiple stacks side by side
 * Arranges stacks in a grid pattern
 */
export function GridStack({
  items = [],
  columns = 3,
  spacing = 2,
  itemSpacing = 2,
  sx = {},
  renderItem,
  ...props
}) {
  return (
    <Stack
      direction="row"
      spacing={spacing}
      sx={{
        flexWrap: 'wrap',
        ...sx,
      }}
      {...props}
    >
      {items.map((item, index) => (
        <Box
          key={item.id || index}
          sx={{
            flex: `0 0 calc(${100 / columns}% - ${spacing}px)`,
          }}
        >
          {renderItem ? renderItem(item) : item}
        </Box>
      ))}
    </Stack>
  );
}

/**
 * StackDivider Component - Stack with divider between items
 * Adds visual separator between stack items
 */
export function StackDivider({
  children,
  direction = 'column',
  spacing = 2,
  dividerColor = 'var(--Border)',
  dividerThickness = '1px',
  dividerStyle = 'solid',
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      sx={{
        '& > :not(:last-child)': {
          paddingBottom: direction === 'column' ? spacing : 0,
          paddingRight: direction === 'row' ? spacing : 0,
          borderBottom: direction === 'column'
            ? `${dividerThickness} ${dividerStyle} ${dividerColor}`
            : 'none',
          borderRight: direction === 'row'
            ? `${dividerThickness} ${dividerStyle} ${dividerColor}`
            : 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * InsetStack Component - Stack with padding/inset
 * Adds consistent padding around content
 */
export function InsetStack({
  children,
  direction = 'column',
  spacing = 2,
  inset = 'var(--Spacing-3)',
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      sx={{
        padding: inset,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * ScrollStack Component - Scrollable stack
 * Stack that scrolls when content overflows
 */
export function ScrollStack({
  children,
  direction = 'row',
  spacing = 2,
  maxHeight = '400px',
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      sx={{
        maxHeight,
        overflow: 'auto',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * WrapStack Component - Wrapping stack
 * Stack that wraps items to next line
 */
export function WrapStack({
  children,
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <Stack
      direction="row"
      spacing={spacing}
      sx={{
        flexWrap: 'wrap',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

/**
 * StackShowcase Component - All stack variants
 */
export function StackShowcase() {
  const items = ['Item 1', 'Item 2', 'Item 3'];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Basic Vertical Stack */}
      <Box>
        <h3>Vertical Stack (Column)</h3>
        <Stack spacing={2} sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}>
          {items.map((item, i) => (
            <Box key={i} sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1 }}>
              {item}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Basic Horizontal Stack */}
      <Box>
        <h3>Horizontal Stack (Row)</h3>
        <HStack spacing={2} sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}>
          {items.map((item, i) => (
            <Box key={i} sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1 }}>
              {item}
            </Box>
          ))}
        </HStack>
      </Box>

      {/* Centered Stack */}
      <Box>
        <h3>Centered Stack</h3>
        <CenteredStack spacing={2} sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1, minHeight: 200 }}>
          {items.map((item, i) => (
            <Box key={i} sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1 }}>
              {item}
            </Box>
          ))}
        </CenteredStack>
      </Box>

      {/* Space Between Stack */}
      <Box>
        <h3>Space Between Stack</h3>
        <SpaceBetweenStack spacing={0} sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}>
          {items.map((item, i) => (
            <Box key={i} sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1 }}>
              {item}
            </Box>
          ))}
        </SpaceBetweenStack>
      </Box>

      {/* Responsive Stack */}
      <Box>
        <h3>Responsive Stack (Column on mobile, Row on desktop)</h3>
        <ResponsiveStack
          mobileDirection="column"
          desktopDirection="row"
          spacing={2}
          sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}
        >
          {items.map((item, i) => (
            <Box key={i} sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1, flex: 1 }}>
              {item}
            </Box>
          ))}
        </ResponsiveStack>
      </Box>

      {/* Stack with Divider */}
      <Box>
        <h3>Stack with Divider</h3>
        <StackDivider spacing={2} sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}>
          {items.map((item, i) => (
            <Box key={i} sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1 }}>
              {item}
            </Box>
          ))}
        </StackDivider>
      </Box>

      {/* Wrap Stack */}
      <Box>
        <h3>Wrap Stack</h3>
        <WrapStack spacing={2} sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Box key={i} sx={{ p: 2, backgroundColor: 'var(--Container)', borderRadius: 1, flexBasis: '100px' }}>
              Item {i + 1}
            </Box>
          ))}
        </WrapStack>
      </Box>
    </Box>
  );
}

export default Stack;
