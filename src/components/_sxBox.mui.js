// src/components/_sxBox.mui.js
//
// An MUI Box that carries nothing but a caller's `sx`, loaded on demand (see
// _lazyFallback.js). A converted component renders its static classes either
// way; when it is handed sx it renders through this instead of a plain tag, so
// emotion adds the override on top. The static sheet sits first in <head> and
// emotion's rules come after it, so sx still wins over the component's own
// declarations at equal specificity, as it did when both were one sx object.
import React from 'react';
import { Box } from '@mui/material';

const SxBox = React.forwardRef(function SxBox(props, ref) {
  return <Box {...props} ref={ref} />;
});

export default SxBox;
