// src/components/Grid/Grid.js
import React, { createContext, useContext } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazyFallback, lazySxBox } from '../_lazyFallback';
const GridMui = lazyFallback('Grid', () => import('./Grid.mui'));

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
/* ── The helpers ─────────────────────────────────────────────────────────
   GridContainer, GridItem, the *WidthGrid items, ResponsiveGrid, CenteredGrid
   and ColumnGrid were MUI 7 Grids. They render MUI 7's markup and rules from
   the static sheet now: a container is a wrapping flex row whose gap is its
   spacing and which hands --Grid-parent-* to its children; an item is a plain
   min-width:0 box.

   Their xs / sm / md / lg / xl / item props are MUI 5's Grid API, which MUI 7
   DELETES before rendering (with a console warning), so every one of these
   items always rendered unsized — a FullWidthGrid was not full width, a
   HalfWidthGrid not half. That is reproduced, not fixed: fixing it would
   reflow every page that uses them. The props are dropped here too.

   A caller's sx goes on top through the lazy Box. A prop only MUI's Grid
   understands (responsive spacing, size, offset, columns, direction, …) hands
   the call to MUI's own Grid, loaded on demand. */
const RawGridMui = lazyFallback('GridHelper', () => import('./Grid.mui').then((m) => ({ default: m.RawGrid })));
const GridSxBox = lazySxBox('Grid');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
/* MUI writes its spacing into each child as a literal (--Grid-parent-*), so a
   nested container's own spacing cannot leak into what its children read as
   their parent's. Here the container hands it down through a private
   property; alternating its name per nesting level keeps a nested container's
   own value from shadowing the one its parent gave it. */
const HelperLevel = createContext(0);
const LEGACY = ['item', 'zeroMinWidth', 'xs', 'sm', 'md', 'lg', 'xl'];
const MUI_ONLY = ['size', 'offset', 'columns', 'rowSpacing', 'columnSpacing', 'direction', 'wrap', 'unstable_level'];
/* MUI's own test for a spacing class: a positive number or a numeric string. */
const spacingClass = (v) => ((typeof v === 'string' && !Number.isNaN(Number(v))) || (typeof v === 'number' && v > 0)
  ? ' MuiGrid-spacing-xs-' + String(v) : '');

function HelperGrid({ container = false, spacing, transition = true, extra = '', sx, className, style, component: Tag = 'div', children, ...props }) {
  useStaticStyles('omni-grid');
  const level = useContext(HelperLevel);
  const rest = {};
  for (const [k, v] of Object.entries(props)) if (!LEGACY.includes(k)) rest[k] = v;
  const muiOnly = MUI_ONLY.some((k) => rest[k] !== undefined)
    || (container && !(typeof spacing === 'number' || typeof spacing === 'string'));
  if (muiOnly) {
    return (
      <RawGridMui container={container} spacing={container ? spacing : undefined} className={className} style={style} component={Tag}
        sx={{ ...(transition && { transition: 'all 0.2s ease-in-out' }), ...(extra === 'centered' && { justifyContent: 'center', alignItems: 'center' }),
          ...(container && { width: extra === 'auto' ? 'auto' : '100%' }), ...sx }} {...rest}>
        {children}
      </RawGridMui>
    );
  }
  let cls = 'MuiGrid-root' + (container ? ' MuiGrid-container' : '') + ' MuiGrid-direction-xs-row' + (container ? spacingClass(spacing) : '')
    + ' omni-gh' + (transition ? ' omni-gh-t' : '');
  let st = style;
  if (container) {
    const p = level % 2;
    cls += ' omni-gh-c omni-gh-p' + p + (extra === 'auto' ? ' omni-gh-auto' : '') + (extra === 'centered' ? ' omni-gh-center' : '');
    const S = spacingPx(spacing);
    st = { '--Grid-columns': 12, '--Grid-columnSpacing': S, '--Grid-rowSpacing': S, ['--_gh-s' + p]: S, ...style };
  }
  if (className) cls += ' ' + className;
  const el = hasSx(sx)
    ? <GridSxBox component={Tag} sx={sx} className={cls} style={st} {...rest}>{children}</GridSxBox>
    : <Tag className={cls} style={st} {...rest}>{children}</Tag>;
  return container ? <HelperLevel.Provider value={level + 1}>{el}</HelperLevel.Provider> : el;
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
export function GridContainer({ children, spacing = 2, fullWidth = true, sx = {}, ...props }) {
  return <HelperGrid container spacing={spacing} extra={fullWidth ? '' : 'auto'} sx={sx} {...props}>{children}</HelperGrid>;
}

/**
 * GridItem Component — a pre-configured grid item. xs / sm / md / lg / xl are
 * accepted and, as under MUI 7, have no effect (see the note above).
 */
export function GridItem({ children, xs = 12, sm = 6, md = 4, lg = 3, xl = 2, sx = {}, ...props }) {
  return <HelperGrid sx={sx} {...props}>{children}</HelperGrid>;
}

/** FullWidthGrid — a grid item meant to span the full width. */
export function FullWidthGrid({ children, sx = {}, ...props }) {
  return <HelperGrid sx={sx} {...props}>{children}</HelperGrid>;
}

/** HalfWidthGrid — a grid item meant to span half the width on medium+ screens. */
export function HalfWidthGrid({ children, sx = {}, ...props }) {
  return <HelperGrid sx={sx} {...props}>{children}</HelperGrid>;
}

/** ThirdWidthGrid — a grid item meant to span a third on medium+ screens. */
export function ThirdWidthGrid({ children, sx = {}, ...props }) {
  return <HelperGrid sx={sx} {...props}>{children}</HelperGrid>;
}

/** QuarterWidthGrid — a grid item meant to span a quarter on medium+ screens. */
export function QuarterWidthGrid({ children, sx = {}, ...props }) {
  return <HelperGrid sx={sx} {...props}>{children}</HelperGrid>;
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
export function ResponsiveGrid({ children, columns = 12, mobileColumns = 1, spacing = 2, sx = {}, ...props }) {
  return (
    <HelperGrid container spacing={spacing} sx={sx} {...props}>
      {React.Children.map(children, (child) => (
        <HelperGrid transition={false}>{child}</HelperGrid>
      ))}
    </HelperGrid>
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
export function AutoGrid({ children, minWidth = 250, spacing = 2, sx = {}, className, style, ...props }) {
  useStaticStyles('omni-grid');
  const cls = 'MuiBox-root omni-autogrid' + (className ? ' ' + className : '');
  const st = { '--_ag-min': minWidth + 'px', '--_ag-gap': `var(--Spacing-${spacing})`, ...style };
  if (hasSx(sx)) return <GridSxBox sx={sx} className={cls} style={st} {...props}>{children}</GridSxBox>;
  return <div className={cls} style={st} {...props}>{children}</div>;
}

/**
 * CenteredGrid Component
 * Grid with centered content
 *
 * @param {number} spacing - Spacing between items
 * @param {ReactNode} children - Grid content
 * @param {object} props - Additional props
 */
export function CenteredGrid({ children, spacing = 2, sx = {}, ...props }) {
  return <HelperGrid container spacing={spacing} extra="centered" sx={sx} {...props}>{children}</HelperGrid>;
}

/**
 * ColumnGrid Component — a grid item meant to take `columns` of 12 on
 * medium+ screens (no effect under MUI 7, see the note above).
 */
export function ColumnGrid({ children, columns = 6, sx = {}, ...props }) {
  return <HelperGrid sx={sx} {...props}>{children}</HelperGrid>;
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
  /* The helpers (GridContainer, GridItem, …): MUI 7's container and item. */
  '.omni-gh{min-width:0;box-sizing:border-box}',
  '.omni-gh-t{transition:all .2s ease-in-out}',
  '.omni-gh-c{flex-flow:wrap;display:flex;gap:var(--Grid-rowSpacing) var(--Grid-columnSpacing);width:100%}',
  ...[0, 1].map((p) => `.omni-gh-p${p}>*{--Grid-parent-columns:12;--Grid-parent-columnSpacing:var(--_gh-s${p});--Grid-parent-rowSpacing:var(--_gh-s${p})}`),
  '.omni-gh-auto{width:auto}',
  '.omni-gh-center{justify-content:center;align-items:center}',
  '.omni-autogrid{display:grid;grid-template-columns:repeat(auto-fit, minmax(var(--_ag-min), 1fr));gap:var(--_ag-gap);width:100%;transition:all .2s ease-in-out}',
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
