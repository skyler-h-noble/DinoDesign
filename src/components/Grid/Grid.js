// src/components/Grid/Grid.js
import React, { createContext, useContext } from 'react';
import { Grid as MuiGrid, Box } from '@mui/material';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';

/**
 * Grid Component
 * Responsive grid container and item wrapper
 * Uses MUI Grid system with design system styling
 * 
 * @param {boolean} container - Use as grid container (default: false)
 * @param {object} size - Columns per breakpoint, MUI 7: {{ xs: 12, md: 4 }}
 * @param {boolean} item - Accepted for MUI 5 code; has no effect
 * @param {number} xs - Columns on extra small screens (1-12) — mapped to size
 * @param {number} sm - Columns on small screens (1-12)
 * @param {number} md - Columns on medium screens (1-12)
 * @param {number} lg - Columns on large screens (1-12)
 * @param {number} xl - Columns on extra large screens (1-12)
 * @param {string} spacing - Spacing between items: 0-10
 * @param {ReactNode} children - Grid content
 * @param {object} props - Additional MUI Grid props
 */
function GridMui({
  children,
  container = false,
  item = false,
  spacing = 2,
  size,
  xs, sm, md, lg, xl,
  sx = {},
  ...props
}) {
  /* MUI 7's Grid takes `size={{ xs: 12, md: 4 }}`; `item` and the bare
     breakpoint props (xs/sm/md/lg/xl) are MUI 5's API and MUI 7 ignores them,
     so every column collapsed to full width. Both spellings are accepted here
     and mapped to `size`; an explicit `size` wins. `item` has no meaning in
     MUI 7 (every child of a container is an item) and is dropped. */
  const bp = { xs, sm, md, lg, xl };
  const fromBreakpoints = Object.fromEntries(Object.entries(bp).filter(([, v]) => v !== undefined));
  const resolvedSize = size ?? (Object.keys(fromBreakpoints).length ? fromBreakpoints : undefined);
  return (
    <MuiGrid
      container={container}
      spacing={container ? spacing : undefined}
      size={resolvedSize}
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

/* ── Static path (no emotion) ─────────────────────────────────────────────
   MUI 7's Grid, reproduced: the container is a wrapping flex row with a gap
   of its spacing; an item's width at each breakpoint is
     calc(100% * N / C - (C - N) * (S / C))
   where C and S are the PARENT container's columns and column spacing. MUI
   writes those parent values into the children as literals, which is what
   lets a nested grid with a different spacing work — a CSS variable would
   read the nested grid's own value instead. So an item takes its parent's
   values from context, computes the width literally, and the static sheet
   applies it per breakpoint through a custom property. */
const GridContext = createContext(null);
const BREAKPOINTS = [['xs', 0], ['sm', 600], ['md', 900], ['lg', 1200], ['xl', 1536]];
registerStaticStyles('omni-grid', [
  '.omni-grid{min-width:0;box-sizing:border-box;transition:all .2s ease-in-out}',
  '.omni-grid-container{display:flex;flex-flow:wrap;gap:var(--Grid-rowSpacing) var(--Grid-columnSpacing)}',
  ...BREAKPOINTS.map(([bp, px]) => {
    const r = `.omni-grid-n-${bp}{flex-grow:0;flex-basis:auto;width:var(--gw-${bp})}`
      + `.omni-grid-grow-${bp}{flex-basis:0;flex-grow:1;max-width:100%}`
      + `.omni-grid-auto-${bp}{flex:0 0 auto;max-width:none;width:auto}`;
    return px ? `@media (min-width:${px}px){${r}}` : r;
  }),
].join('\n'));

const isPlainSize = (v) => typeof v === 'number' || v === 'grow' || v === 'auto';
const spacingPx = (v) => (typeof v === 'number' ? v * 8 + 'px' : v);

export function Grid(props) {
  useStaticStyles('omni-grid');
  const parent = useContext(GridContext);
  const {
    children, container = false, item, spacing = 2, size, xs, sm, md, lg, xl, sx, className = '', style,
    component: Tag = 'div', offset, columns, rowSpacing, columnSpacing, direction, wrap, ...rest
  } = props;
  const fromBreakpoints = Object.fromEntries(Object.entries({ xs, sm, md, lg, xl }).filter(([, v]) => v !== undefined));
  const resolvedSize = size ?? (Object.keys(fromBreakpoints).length ? fromBreakpoints : undefined);
  const sizes = resolvedSize === undefined ? {} : (typeof resolvedSize === 'object' ? resolvedSize : { xs: resolvedSize });
  const staticOK = !(sx && Object.keys(sx).length)
    && [offset, columns, rowSpacing, columnSpacing, direction, wrap].every((v) => v === undefined)
    && (typeof spacing === 'number' || typeof spacing === 'string')
    && Object.values(sizes).every(isPlainSize)
    && (Object.keys(sizes).length === 0 || parent);
  if (!staticOK) return <GridMui {...props} />;

  const classes = ['MuiGrid-root', 'omni-grid'];
  const vars = {};
  for (const [bp] of BREAKPOINTS) {
    const v = sizes[bp];
    if (v === undefined) continue;
    classes.push(`MuiGrid-grid-${bp}-${v}`); // MUI's own class names, for any CSS that targets them
    if (v === 'grow' || v === 'auto') { classes.push(`omni-grid-${v}-${bp}`); continue; }
    const C = parent.columns, S = parent.columnSpacing;
    classes.push(`omni-grid-n-${bp}`);
    vars[`--gw-${bp}`] = `calc(100% * ${v} / ${C} - (${C} - ${v}) * (${S} / ${C}))`;
  }
  let ctx = null;
  if (container) {
    const S = spacingPx(spacing);
    classes.push('MuiGrid-container', 'omni-grid-container');
    Object.assign(vars, { '--Grid-columns': 12, '--Grid-columnSpacing': S, '--Grid-rowSpacing': S });
    ctx = { columns: 12, columnSpacing: S };
  }
  if (className) classes.push(className);
  const el = (
    <Tag className={classes.join(' ')} style={style ? { ...vars, ...style } : vars} {...rest}>
      {children}
    </Tag>
  );
  return ctx ? <GridContext.Provider value={ctx}>{el}</GridContext.Provider> : el;
}

export default Grid;
