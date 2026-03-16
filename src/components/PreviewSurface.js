// src/components/PreviewSurface.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * PreviewSurface (controlled)
 *
 * Wraps the component preview area with data-theme and data-surface="Surface"
 * so all tokens resolve correctly for the chosen surface.
 *
 * Props:
 *   theme     — the data-theme value (null = Default)
 *   children  — the component being previewed
 *
 * Use BackgroundPicker in the playground tab to let the user choose the theme.
 */

export function PreviewSurface({ theme = null, children, minHeight = 160, sx = {} }) {
  return (
    <Box
      data-theme={theme || undefined}
      data-surface="Surface"
      sx={{
        p: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight,
        backgroundColor: 'var(--Background)',
        borderBottom: '1px solid var(--Border)',
        ...sx,
      }}>
      {children}
    </Box>
  );
}

export default PreviewSurface;