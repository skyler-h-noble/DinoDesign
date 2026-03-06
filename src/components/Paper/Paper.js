// src/components/Paper/Paper.js
import React, { useMemo } from 'react';
import { Paper as MuiPaper, Box } from '@mui/material';

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
  sx = {},
  ...props
}) {
  const { dataSurface, elevation } = usePaperSurface(surface);

  return (
    <MuiPaper
      variant={variant}
      elevation={outlined ? 0 : elevation}
      data-surface={dataSurface}
      sx={{
        padding: 2,
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
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
  hoverable = true,
  sx = {},
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
    <MuiPaper
      data-surface={hoverable && isHovered ? hoverSurface : dataSurface}
      elevation={hoverable && isHovered ? hoverElevation : elevation}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      sx={{
        padding: 2,
        borderRadius: '8px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
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
  sx = {},
  ...props
}) {
  const { dataSurface, elevation } = usePaperSurface(surface);

  return (
    <MuiPaper
      variant="elevation"
      elevation={elevation}
      data-surface={dataSurface}
      sx={{
        padding: 2,
        borderRadius: '8px',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
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
  sx = {},
  ...props
}) {
  const { dataSurface } = usePaperSurface(surface);

  return (
    <MuiPaper
      variant="outlined"
      data-surface={dataSurface}
      sx={{
        padding: 2,
        borderRadius: '8px',
        border: '1px solid var(--Border)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
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
  sx = {},
  ...props
}) {
  const { dataSurface, elevation } = usePaperSurface(surface);

  const paddingMap = {
    none: 0,
    small: 1,
    medium: 2,
    large: 3,
  };

  return (
    <MuiPaper
      elevation={elevation}
      data-surface={dataSurface}
      sx={{
        padding: paddingMap[padding],
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
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
  sx = {},
  ...props
}) {
  const outerConfig = usePaperSurface(outerSurface);
  const innerConfig = usePaperSurface(innerSurface);

  return (
    <MuiPaper
      elevation={outerConfig.elevation}
      data-surface={outerConfig.dataSurface}
      sx={{
        padding: 2,
        borderRadius: '8px',
        ...sx,
      }}
      {...props}
    >
      <MuiPaper
        elevation={innerConfig.elevation}
        data-surface={innerConfig.dataSurface}
        sx={{
          padding: 2,
          borderRadius: '8px',
        }}
      >
        {children}
      </MuiPaper>
    </MuiPaper>
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
  sx = {},
  ...props
}) {
  const surfaces = ['Container-Lowest', 'Container-Low', 'Container', 'Container-High', 'Container-Highest'];

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', ...sx }}>
      {surfaces.map((surface) => {
        const config = usePaperSurface(surface);
        return (
          <MuiPaper
            key={surface}
            elevation={config.elevation}
            data-surface={surface}
            sx={{
              flex: '1 1 200px',
              padding: 2,
              borderRadius: '8px',
              minHeight: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Box>
              <strong>{surface}</strong>
              <Box sx={{ fontSize: '0.75rem', color: 'var(--Text-Secondary)' }}>
                elevation: {config.elevation}dp
              </Box>
            </Box>
          </MuiPaper>
        );
      })}
    </Box>
  );
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
  sx = {},
  ...props
}) {
  const mobileConfig = usePaperSurface(mobileSurface);
  const tabletConfig = usePaperSurface(tabletSurface);
  const desktopConfig = usePaperSurface(desktopSurface);

  return (
    <MuiPaper
      data-surface={desktopSurface}
      elevation={desktopConfig.elevation}
      sx={{
        padding: 2,
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        '&[data-surface]': {
          // Mobile
          '@media (max-width: 600px)': {
            elevation: mobileConfig.elevation,
            '&': {
              '--elevation': mobileConfig.elevation,
            },
          },
          // Tablet
          '@media (min-width: 601px) and (max-width: 1024px)': {
            elevation: tabletConfig.elevation,
            '&': {
              '--elevation': tabletConfig.elevation,
            },
          },
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
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
  sx = {},
  ...props
}) {
  const config = usePaperSurface('Container-Highest');

  return (
    <MuiPaper
      elevation={config.elevation}
      data-surface="Container-Highest"
      sx={{
        padding: 2,
        borderRadius: '8px',
        position: 'relative',
        zIndex: config.zIndex,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
  );
}

export default Paper;
