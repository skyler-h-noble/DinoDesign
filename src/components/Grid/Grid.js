// src/components/Grid/Grid.js
import React from 'react';
import { Grid as MuiGrid, Box } from '@mui/material';

/**
 * Grid Component
 * Responsive grid container and item wrapper
 * Uses MUI Grid system with design system styling
 * 
 * @param {boolean} container - Use as grid container (default: false)
 * @param {boolean} item - Use as grid item (default: false)
 * @param {number} xs - Columns on extra small screens (1-12)
 * @param {number} sm - Columns on small screens (1-12)
 * @param {number} md - Columns on medium screens (1-12)
 * @param {number} lg - Columns on large screens (1-12)
 * @param {number} xl - Columns on extra large screens (1-12)
 * @param {string} spacing - Spacing between items: 0-10
 * @param {ReactNode} children - Grid content
 * @param {object} props - Additional MUI Grid props
 */
export function Grid({
  children,
  container = false,
  item = false,
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      container={container}
      item={item}
      spacing={spacing}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * GridContainer Component
 * Pre-configured grid container
 * 
 * @param {number} spacing - Spacing between items (default: 2)
 * @param {boolean} fullWidth - Take full width
 * @param {ReactNode} children - Grid content
 * @param {object} props - Additional props
 */
export function GridContainer({
  children,
  spacing = 2,
  fullWidth = true,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      container
      spacing={spacing}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * GridItem Component
 * Pre-configured grid item
 * 
 * @param {number} xs - Columns on extra small screens
 * @param {number} sm - Columns on small screens
 * @param {number} md - Columns on medium screens
 * @param {number} lg - Columns on large screens
 * @param {number} xl - Columns on extra large screens
 * @param {ReactNode} children - Item content
 * @param {object} props - Additional props
 */
export function GridItem({
  children,
  xs = 12,
  sm = 6,
  md = 4,
  lg = 3,
  xl = 2,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      item
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * FullWidthGrid Component
 * Grid item that spans full width
 * 
 * @param {ReactNode} children - Item content
 * @param {object} props - Additional props
 */
export function FullWidthGrid({
  children,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      item
      xs={12}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * HalfWidthGrid Component
 * Grid item that spans half width on medium+ screens
 * 
 * @param {ReactNode} children - Item content
 * @param {object} props - Additional props
 */
export function HalfWidthGrid({
  children,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      item
      xs={12}
      md={6}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * ThirdWidthGrid Component
 * Grid item that spans one-third width on medium+ screens
 * 
 * @param {ReactNode} children - Item content
 * @param {object} props - Additional props
 */
export function ThirdWidthGrid({
  children,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      item
      xs={12}
      md={4}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * QuarterWidthGrid Component
 * Grid item that spans one-quarter width on medium+ screens
 * 
 * @param {ReactNode} children - Item content
 * @param {object} props - Additional props
 */
export function QuarterWidthGrid({
  children,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      item
      xs={12}
      sm={6}
      md={3}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * ResponsiveGrid Component
 * Grid with responsive column configuration
 * 
 * @param {number} columns - Number of columns on desktop
 * @param {number} mobileColumns - Number of columns on mobile
 * @param {number} spacing - Spacing between items
 * @param {ReactNode} children - Grid content
 * @param {object} props - Additional props
 */
export function ResponsiveGrid({
  children,
  columns = 12,
  mobileColumns = 1,
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      container
      spacing={spacing}
      sx={{
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <MuiGrid
          item
          xs={12 / mobileColumns}
          md={12 / columns}
        >
          {child}
        </MuiGrid>
      ))}
    </MuiGrid>
  );
}

/**
 * AutoGrid Component
 * Auto-sizing grid items
 * 
 * @param {number} minWidth - Minimum item width in pixels
 * @param {number} spacing - Spacing between items
 * @param {ReactNode} children - Grid content
 * @param {object} props - Additional props
 */
export function AutoGrid({
  children,
  minWidth = 250,
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
        gap: `var(--Spacing-${spacing})`,
        width: '100%',
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
 * CenteredGrid Component
 * Grid with centered content
 * 
 * @param {number} spacing - Spacing between items
 * @param {ReactNode} children - Grid content
 * @param {object} props - Additional props
 */
export function CenteredGrid({
  children,
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      container
      spacing={spacing}
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

/**
 * ColumnGrid Component
 * Grid item that takes specific column width
 * 
 * @param {number} columns - Column width (1-12)
 * @param {ReactNode} children - Item content
 * @param {object} props - Additional props
 */
export function ColumnGrid({
  children,
  columns = 6,
  sx = {},
  ...props
}) {
  return (
    <MuiGrid
      item
      xs={12}
      md={columns}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
}

export default Grid;
