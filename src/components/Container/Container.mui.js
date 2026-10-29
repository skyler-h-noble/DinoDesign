// src/components/Container/Container.mui.js
// The MUI version of Container, loaded on demand (see _lazyFallback.js):
// only a caller passing an MUI-only prop such as sx ever downloads it.
import React from 'react';
import { Container as MuiContainer, Box } from '@mui/material';

function ContainerMui({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  sx = {},
  ...props
}) {
  return (
    <MuiContainer
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiContainer>
  );
}

export default ContainerMui;
