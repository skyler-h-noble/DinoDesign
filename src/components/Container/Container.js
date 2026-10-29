// src/components/Container/Container.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazyFallback, lazySxBox } from '../_lazyFallback';
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
.omni-container-centered{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.omni-ctr-box{transition:all .2s ease-in-out}
.omni-ctr-fluid{width:100%}
.omni-ctr-pad-small{padding:var(--Spacing-2)}
.omni-ctr-pad-medium{padding:var(--Spacing-3)}
.omni-ctr-pad-large{padding:var(--Spacing-4)}
.omni-ctr-constrained{margin:0 auto;padding:var(--Spacing-3)}
.omni-ctr-max-compact{max-width:600px}
.omni-ctr-max-standard{max-width:960px}
.omni-ctr-max-wide{max-width:1200px}
.omni-ctr-max-full{max-width:100%}
.omni-ctr-layout{display:flex;flex-direction:column;min-height:auto;width:100%}
.omni-ctr-layout-full{min-height:100vh}
.omni-ctr-grid{display:grid;grid-template-columns:repeat(var(--_ctr-cols), 1fr);width:100%;padding:var(--Spacing-3)}
.omni-ctr-stack{display:flex;flex-direction:var(--_ctr-dir);align-items:var(--_ctr-align);width:100%;padding:var(--Spacing-3)}
.omni-ctr-gap-small{gap:var(--Spacing-2)}
.omni-ctr-gap-medium{gap:var(--Spacing-3)}
.omni-ctr-gap-large{gap:var(--Spacing-4)}
`);
const cap = (x) => String(x).charAt(0).toUpperCase() + String(x).slice(1);
const SxBox = lazySxBox('Container');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* The layout helpers below were MUI Boxes with an sx each. They render a div
   with static classes now; a caller's sx goes on top through the lazy Box and
   wins, as its keys did when they were spread into the one sx object. */
function CtrBox({ cls, sx, style, vars, children, ...props }) {
  useStaticStyles('omni-container');
  const className = 'MuiBox-root omni-ctr-box ' + cls + (props.className ? ' ' + props.className : '');
  const st = vars ? { ...vars, ...style } : style;
  if (hasSx(sx)) return <SxBox {...props} sx={sx} className={className} style={st}>{children}</SxBox>;
  return <div {...props} className={className} style={st}>{children}</div>;
}

export function Container(props) {
  useStaticStyles('omni-container');
  const { children, maxWidth = 'lg', disableGutters = false, sx, className = '', fixed, component, ...rest } = props;
  if ((sx && Object.keys(sx).length) || fixed || component) return <ContainerMui {...props} />;
  return (
    <div
      className={'MuiContainer-root omni-container' + (disableGutters ? ' MuiContainer-disableGutters' : ' omni-container-gutters')
        + (maxWidth ? ' MuiContainer-maxWidth' + cap(maxWidth) + ' omni-container-' + maxWidth : '') + (className ? ' ' + className : '')}
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
  className = '',
  ...props
}) {
  /* Centred is a class on the static Container. With the caller's sx it
     keeps the MUI Container, as plain Container does — there MUI's own media
     queries come after the sx and win over it, which only the MUI version
     reproduces. */
  if (hasSx(sx)) {
    return (
      <Container maxWidth={maxWidth} className={className}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...sx }}
        {...props}>
        {children}
      </Container>
    );
  }
  return (
    <Container maxWidth={maxWidth} className={'omni-container-centered' + (className ? ' ' + className : '')} {...props}>
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
  const pad = ['small', 'medium', 'large'].includes(padding) ? ' omni-ctr-pad-' + padding : '';
  return <CtrBox cls={'omni-ctr-fluid' + pad} sx={sx} {...props}>{children}</CtrBox>;
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
  const max = ['compact', 'standard', 'wide', 'full'].includes(size) ? ' omni-ctr-max-' + size : '';
  return <CtrBox cls={'omni-ctr-constrained' + max} sx={sx} {...props}>{children}</CtrBox>;
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
  return <CtrBox cls={'omni-ctr-layout' + (fullHeight ? ' omni-ctr-layout-full' : '')} sx={sx} {...props}>{children}</CtrBox>;
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
  const g = ['small', 'medium', 'large'].includes(gap) ? ' omni-ctr-gap-' + gap : '';
  return <CtrBox cls={'omni-ctr-grid' + g} vars={{ '--_ctr-cols': columns }} sx={sx} {...props}>{children}</CtrBox>;
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
  const g = ['small', 'medium', 'large'].includes(spacing) ? ' omni-ctr-gap-' + spacing : '';
  return <CtrBox cls={'omni-ctr-stack' + g} vars={{ '--_ctr-dir': direction, '--_ctr-align': align }} sx={sx} {...props}>{children}</CtrBox>;
}

export default Container;
