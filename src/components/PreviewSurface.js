// src/components/PreviewSurface.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * PreviewSurface (controlled)
 *
 * Wraps the component preview area with data-theme and data-surface
 * so all tokens resolve correctly for the chosen background environment.
 *
 * Props:
 *   theme      — data-theme value (null = Default)
 *   surface    — data-surface value (default: 'Surface')
 *   children   — the component being previewed
 *   minHeight  — minimum height of the preview area (default: 160)
 *   sx         — additional MUI sx overrides
 *
 * Use BackgroundPicker in the playground tab to let the user choose
 * both the theme and surface.
 */

export const PreviewSurface = React.forwardRef(function PreviewSurface({
  theme     = null,
  surface   = 'Surface',
  children,
  minHeight = 160,
  sx        = {},
}, ref) {
  return (
    <Box
      ref={ref}
      data-theme={theme || undefined}
      data-surface={surface}
      sx={{
        p: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight,
        backgroundColor: 'var(--Background)',
        borderBottom: '1px solid var(--Border)',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
});

export default PreviewSurface;