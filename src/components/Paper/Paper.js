// src/components/Paper/Paper.js
import React from 'react';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('Paper');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* ── The MUI Paper this was, as static CSS ─────────────────────────────────
   Every component here was an MUI Paper styled by sx. The Paper's own rules
   (from MUI's default theme — the library installs no MUI theme, so these are
   the values it always rendered with) come first, then each wrapper's sx as
   classes after them, so the later rule wins exactly as the sx did inside the
   one emotion rule. The MuiPaper-* class names are kept for consumers.

   The elevation is MUI's: the variant draws box-shadow: var(--Paper-shadow)
   and the element carries --Paper-shadow inline, from MUI's default 25-step
   shadow table (copied below). An elevation outside the table leaves the
   variable undefined and draws no shadow, as MUI did. */
const umbra = 'rgba(0,0,0,0.2)';
const penumbra = 'rgba(0,0,0,0.14)';
const ambient = 'rgba(0,0,0,0.12)';
const mk = (...px) => `${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px ${umbra},${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px ${penumbra},${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px ${ambient}`;
const MUI_SHADOWS = ['none', mk(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), mk(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), mk(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), mk(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), mk(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), mk(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), mk(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), mk(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), mk(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), mk(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), mk(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), mk(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), mk(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), mk(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), mk(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), mk(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), mk(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), mk(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), mk(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), mk(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), mk(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), mk(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), mk(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), mk(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];

const CARD_PADDING = { none: 0, small: 1, medium: 2, large: 3 };

registerBoxStyles('omni-paper', [
  // MUI Paper.
  '.omni-paper{background-color:#fff;color:rgba(0, 0, 0, 0.87);transition:box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms}',
  '.omni-paper-rounded{border-radius:4px}',
  '.omni-paper-outlined{border:1px solid rgba(0, 0, 0, 0.12)}',
  '.omni-paper-elevation{box-shadow:var(--Paper-shadow);background-image:var(--Paper-overlay)}',
  // The wrappers' sx.
  '.omni-paper-lib{padding:16px;border-radius:8px}',
  ...Object.entries(CARD_PADDING).map(([k, v]) => `.omni-paper-p-${k}{padding:${v * 8}px}`),
  '.omni-paper-nopad{padding:0}',
  '.omni-paper-fade{transition:all 0.2s ease-in-out}',
  '.omni-paper-edge{border:1px solid var(--Border)}',
  '.omni-paper-i{cursor:default}',
  '.omni-paper-click{cursor:pointer}',
  /* `hoverable` already swaps the surface and elevation, but that is a
     separate opt-in: a Paper given only an onClick got cursor:pointer and no
     feedback whatsoever, and no keyboard route in either. */
  '.omni-paper-off{opacity:var(--Disabled, 0.38);cursor:not-allowed;pointer-events:none}',
  '.omni-paper-on:hover{background-color:var(--Hover)}',
  '.omni-paper-on:active{background-color:var(--Pressed)}',
  '.omni-paper-on:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:2px}',
  '.omni-paper-float{position:relative;z-index:var(--_pp-z)}',
  '@media (max-width: 600px){.omni-paper-resp[data-surface]{--elevation:var(--_pp-m)}}',
  '@media (min-width: 601px) and (max-width: 1024px){.omni-paper-resp[data-surface]{--elevation:var(--_pp-t)}}',
  '.omni-paper-tier{flex:1 1 200px;min-height:100px;display:flex;align-items:center;justify-content:center;text-align:center}',
  '.omni-paper-tiers{display:flex;gap:16px;flex-wrap:wrap}',
  '.omni-paper-tier-note{font-size:0.75rem;color:var(--Text-Secondary)}',
].join('\n'));

/* The MUI Paper's markup, classes and rules, plus the wrapper's own classes
   (`lib`). A caller's sx renders through the lazily loaded MUI Box, whose
   emotion rule comes after this sheet and wins, as sx did. */
function PaperBase({
  component: Tag = 'div',
  elevation = 1,
  square = false,
  variant = 'elevation',
  className,
  sx,
  style,
  lib = '',
  children,
  ...other
}) {
  useStaticStyles('omni-paper');
  const isElevation = variant === 'elevation';
  const root = {
    className: 'MuiPaper-root MuiPaper-' + variant + (square ? '' : ' MuiPaper-rounded')
      + (isElevation ? ' MuiPaper-elevation' + elevation : '') + (className ? ' ' + className : '')
      + ' omni-paper' + (square ? '' : ' omni-paper-rounded')
      + (variant === 'outlined' ? ' omni-paper-outlined' : '') + (isElevation ? ' omni-paper-elevation' : '')
      + (lib ? ' ' + lib : ''),
    style: isElevation ? { '--Paper-shadow': MUI_SHADOWS[elevation], ...style } : style,
    ...other,
  };
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...root}>{children}</SxBox>;
  return <Tag {...root}>{children}</Tag>;
}

/**
 * usePaperSurface Hook
 * Manages data-surface attribute and elevation mapping
 * 
 * Surface Elevations:
 * - Container-Lowest: Lowest elevation (0dp)
 * - Container-Low: Low elevation (1dp)
 * - Container: Medium elevation (4dp) - default
 * - Container-High: High elevation (8dp)
 * - Container-Highest: Highest elevation (12dp)
 * 
 * @param {string} surface - Surface elevation level
 * @returns {object} - Data-surface object and elevation level
 */
export function usePaperSurface(surface = 'Container') {
  const surfaceMap = {
    'Container-Lowest': { elevation: 0, zIndex: 0 },
    'Container-Low': { elevation: 1, zIndex: 100 },
    'Container': { elevation: 4, zIndex: 200 },
    'Container-High': { elevation: 8, zIndex: 300 },
    'Container-Highest': { elevation: 12, zIndex: 400 },
  };

  const config = surfaceMap[surface] || surfaceMap['Container'];

  return {
    dataSurface: surface,
    elevation: config.elevation,
    zIndex: config.zIndex,
  };
}

/**
 * Paper Component
 * Base paper component with elevation levels
 * Styling applied via data-surface CSS variables
 * 
 * Surface Levels:
 * - Container-Lowest: Flat, no shadow
 * - Container-Low: Subtle shadow
 * - Container: Standard elevation
 * - Container-High: Elevated appearance
 * - Container-Highest: Most elevated
 * 
 * @param {string} surface - Elevation surface level (Container-Lowest to Container-Highest)
 * @param {ReactNode} children - Paper content
 * @param {boolean} outlined - Use outline variant instead of elevation
 * @param {object} props - Additional MUI Paper props
 */
export function Paper({
  children,
  surface = 'Container',
  outlined = false,
  variant = outlined ? 'outlined' : 'elevation',
  sx,
  ...props
}) {
  const { dataSurface, elevation } = usePaperSurface(surface);

  /* Read the ELEVATION off the variant, not off the `outlined` shorthand.
     `outlined` defaults `variant`, but the two are independent inputs — pass
     `variant="outlined"` on its own and `outlined` is still false, so the
     elevation came through non-zero and MUI warned that combining
     `elevation={4}` with `variant="outlined"` has no effect.
     A border and a shadow are two answers to the same question, so the
     variant is the one that decides: whichever way the caller says it, an
     outlined Paper is flat. */
  const isOutlined = variant === 'outlined' || outlined;

  return (
    <PaperBase
      variant={variant}
      elevation={isOutlined ? 0 : elevation}
      data-surface={dataSurface}
      lib="omni-paper-lib omni-paper-fade"
      sx={sx}
      {...props}
    >
      {children}
    </PaperBase>
  );
}

/**
 * InteractivePaper Component
 * Paper that responds to hover and focus
 * 
 * @param {string} surface - Elevation surface level
 * @param {ReactNode} children - Paper content
 * @param {function} onClick - Click handler
 * @param {boolean} hoverable - Enable hover elevation
 * @param {object} props - Additional props
 */
export function InteractivePaper({
  children,
  surface = 'Container',
  onClick,
  disabled = false,
  hoverable = true,
  sx,
  ...props
}) {
  const { dataSurface, elevation } = usePaperSurface(surface);
  const [isHovered, setIsHovered] = React.useState(false);

  // Determine elevation on hover
  const hoverSurface = surface === 'Container-Lowest' ? 'Container-Low' :
                        surface === 'Container-Low' ? 'Container' :
                        surface === 'Container' ? 'Container-High' :
                        surface === 'Container-High' ? 'Container-Highest' :
                        'Container-Highest';

  const { elevation: hoverElevation } = usePaperSurface(
    hoverable && isHovered ? hoverSurface : surface
  );

  return (
    <PaperBase
      data-surface={hoverable && isHovered ? hoverSurface : dataSurface}
      elevation={hoverable && isHovered ? hoverElevation : elevation}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={onClick && !disabled ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); }
      } : undefined}
      lib={'omni-paper-lib omni-paper-i' + (onClick ? ' omni-paper-click' : '') + ' omni-paper-fade'
        + (disabled ? ' omni-paper-off' : '') + (onClick && !disabled ? ' omni-paper-on' : '')}
      sx={sx}
      {...props}
    >
      {children}
    </PaperBase>
  );
}

/**
 * ElevatedPaper Component
 * Paper with explicit elevation control
 * 
 * @param {string} surface - Elevation surface level
 * @param {ReactNode} children - Paper content
 * @param {object} props - Additional props
 */
export function ElevatedPaper({
  children,
  surface = 'Container',
  sx,
  ...props
}) {
  const { dataSurface, elevation } = usePaperSurface(surface);

  return (
    <PaperBase variant="elevation" elevation={elevation} data-surface={dataSurface} lib="omni-paper-lib" sx={sx} {...props}>
      {children}
    </PaperBase>
  );
}

/**
 * OutlinedPaper Component
 * Paper with outlined variant (no elevation/shadow)
 * 
 * @param {string} surface - Surface level for styling
 * @param {ReactNode} children - Paper content
 * @param {object} props - Additional props
 */
export function OutlinedPaper({
  children,
  surface = 'Container-Lowest',
  sx,
  ...props
}) {
  const { dataSurface } = usePaperSurface(surface);

  return (
    <PaperBase variant="outlined" data-surface={dataSurface} lib="omni-paper-lib omni-paper-edge" sx={sx} {...props}>
      {children}
    </PaperBase>
  );
}

/**
 * CardPaper Component
 * Card-style paper with padding options
 * 
 * @param {string} surface - Elevation surface level
 * @param {ReactNode} children - Paper content
 * @param {string} padding - Padding size: 'none' | 'small' | 'medium' | 'large'
 * @param {object} props - Additional props
 */
export function CardPaper({
  children,
  surface = 'Container',
  padding = 'medium',
  sx,
  ...props
}) {
  const { dataSurface, elevation } = usePaperSurface(surface);
  /* An unknown padding left sx's padding undefined: MUI Paper's own (none). */
  const pad = CARD_PADDING[padding] !== undefined ? ' omni-paper-p-' + padding : '';

  return (
    <PaperBase
      elevation={elevation}
      data-surface={dataSurface}
      lib={'omni-paper-lib' + (pad || ' omni-paper-nopad') + ' omni-paper-fade'}
      sx={sx}
      {...props}
    >
      {children}
    </PaperBase>
  );
}

/**
 * NestedPaper Component
 * Paper with nested/layered effect
 * 
 * @param {string} outerSurface - Outer paper elevation
 * @param {string} innerSurface - Inner paper elevation
 * @param {ReactNode} children - Paper content
 * @param {object} props - Additional props
 */
export function NestedPaper({
  children,
  outerSurface = 'Container-Low',
  innerSurface = 'Container',
  sx,
  ...props
}) {
  const outerConfig = usePaperSurface(outerSurface);
  const innerConfig = usePaperSurface(innerSurface);

  return (
    <PaperBase elevation={outerConfig.elevation} data-surface={outerConfig.dataSurface} lib="omni-paper-lib" sx={sx} {...props}>
      <PaperBase elevation={innerConfig.elevation} data-surface={innerConfig.dataSurface} lib="omni-paper-lib">
        {children}
      </PaperBase>
    </PaperBase>
  );
}

/**
 * TieredPaper Component
 * Paper showing all elevation levels
 * Useful for documentation and testing
 * 
 * @param {ReactNode} children - Paper content
 * @param {object} props - Additional props
 */
export function TieredPaper({
  children,
  label,
  sx,
  ...props
}) {
  useStaticStyles('omni-paper');
  const surfaces = ['Container-Lowest', 'Container-Low', 'Container', 'Container-High', 'Container-Highest'];

  const tiers = surfaces.map((surface) => {
    const config = usePaperSurface(surface);
    return (
      <PaperBase key={surface} elevation={config.elevation} data-surface={surface} lib="omni-paper-lib omni-paper-tier">
        <div className="MuiBox-root">
          <strong>{surface}</strong>
          <div className="MuiBox-root omni-paper-tier-note">
            elevation: {config.elevation}dp
          </div>
        </div>
      </PaperBase>
    );
  });
  if (hasSx(sx)) return <SxBox sx={sx} className="MuiBox-root omni-paper-tiers">{tiers}</SxBox>;
  return <div className="MuiBox-root omni-paper-tiers">{tiers}</div>;
}

/**
 * ResponsivePaper Component
 * Paper that adapts elevation based on screen size
 * 
 * @param {string} mobileSurface - Surface on mobile
 * @param {string} tabletSurface - Surface on tablet
 * @param {string} desktopSurface - Surface on desktop
 * @param {ReactNode} children - Paper content
 * @param {object} props - Additional props
 */
export function ResponsivePaper({
  children,
  mobileSurface = 'Container-Low',
  tabletSurface = 'Container',
  desktopSurface = 'Container-High',
  sx,
  style,
  ...props
}) {
  const mobileConfig = usePaperSurface(mobileSurface);
  const tabletConfig = usePaperSurface(tabletSurface);
  const desktopConfig = usePaperSurface(desktopSurface);

  /* --elevation follows the breakpoint (the media rules in the sheet read
     these two). */
  return (
    <PaperBase
      data-surface={desktopSurface}
      elevation={desktopConfig.elevation}
      lib="omni-paper-lib omni-paper-fade omni-paper-resp"
      style={{ '--_pp-m': mobileConfig.elevation, '--_pp-t': tabletConfig.elevation, ...style }}
      sx={sx}
      {...props}
    >
      {children}
    </PaperBase>
  );
}

/**
 * FloatingPaper Component
 * Paper that appears to float above the page
 * 
 * @param {ReactNode} children - Paper content
 * @param {object} props - Additional props
 */
export function FloatingPaper({
  children,
  sx,
  style,
  ...props
}) {
  const config = usePaperSurface('Container-Highest');

  return (
    <PaperBase
      elevation={config.elevation}
      data-surface="Container-Highest"
      lib="omni-paper-lib omni-paper-float"
      style={{ '--_pp-z': config.zIndex, ...style }}
      sx={sx}
      {...props}
    >
      {children}
    </PaperBase>
  );
}

export default Paper;
