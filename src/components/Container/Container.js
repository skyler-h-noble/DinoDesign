// src/components/Container/Container.js
import React from 'react';
import { Container as MuiContainer, Box } from '@mui/material';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazyFallback } from '../_lazyFallback';
const ContainerMui = lazyFallback('Container', () => import('./Container.mui'));

/**
 * Container Component
 * Wrapper component that centers content and constrains max-width.
 * LAYOUT ONLY — it paints nothing. It used to set data-surface="Surface" and
 * paint --Background, which dropped a Surface-colored panel inside whatever
 * Section it sat in (a white box in a Container or Secondary band). To paint
 * a region, use <Section theme surface>; put a Container inside it.
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {string} maxWidth - Max width: xs, sm, md, lg, xl (default: lg)
 * @param {boolean} disableGutters - Remove padding on sides (default: false)
 * @param {string} sx - Additional MUI sx props
 * @param {object} ...props - Other MUI Container props
 */
/* Static path (no emotion): MUI Container's own rules as a plain sheet —
   full width, centred, 16px gutters (24px from 600px), and a max width that
   applies from its breakpoint up (xs 444, sm 600, md 900, lg 1200, xl 1536).
   sx or a `fixed` / `component` prop keeps the MUI version. */
registerStaticStyles('omni-container', `
.omni-container{width:100%;margin-left:auto;margin-right:auto;box-sizing:border-box;display:block;transition:all .2s ease-in-out}
.omni-container-gutters{padding-left:16px;padding-right:16px}
@media (min-width:600px){.omni-container-gutters{padding-left:24px;padding-right:24px}}
.omni-container-xs{max-width:444px}
@media (min-width:600px){.omni-container-sm{max-width:600px}}
@media (min-width:900px){.omni-container-md{max-width:900px}}
@media (min-width:1200px){.omni-container-lg{max-width:1200px}}
@media (min-width:1536px){.omni-container-xl{max-width:1536px}}
`);

export function Container(props) {
  useStaticStyles('omni-container');
  const { children, maxWidth = 'lg', disableGutters = false, sx, className = '', fixed, component, ...rest } = props;
  if ((sx && Object.keys(sx).length) || fixed || component) return <ContainerMui {...props} />;
  return (
    <div
      className={'MuiContainer-root omni-container' + (disableGutters ? '' : ' omni-container-gutters')
        + (maxWidth ? ' omni-container-' + maxWidth : '') + (className ? ' ' + className : '')}
      {...rest}
    >
      {children}
    </div>
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
