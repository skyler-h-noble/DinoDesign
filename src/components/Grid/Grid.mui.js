// src/components/Grid/Grid.mui.js
// The MUI version of Grid, loaded on demand (see _lazyFallback.js):
// only a caller passing an MUI-only prop such as sx ever downloads it.
import React, { createContext, useContext } from 'react';
import { Grid as MuiGrid, Box } from '@mui/material';

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

/* MUI's Grid as it is, for the helpers in Grid.js (GridContainer, …) when
   they are handed a prop only MUI's Grid understands. Unlike GridMui above it
   does NOT map xs / md / item to size: the helpers never did. */
export const RawGrid = React.forwardRef(function RawGrid(props, ref) {
  return <MuiGrid ref={ref} {...props} />;
});

export default GridMui;
