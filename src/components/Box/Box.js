// src/components/Box/Box.js
import React from 'react';
import { Box as MuiBox } from '@mui/material';

/**
 * Box Component — bare layout primitive.
 *
 * A theme-aware container with no visual styling of its own. Use it when you
 * need a slot that participates in the design-system cascade (data-theme /
 * data-surface) without inheriting any of the chrome that Ratio or Card
 * would bring.
 *
 * Props:
 *   theme      — optional data-theme override for everything inside
 *   surface    — optional data-surface override (Surface | Container | Container-Low | etc.)
 *   component  — root element tag (default: 'div')
 *   children, className, sx, ...props — forwarded
 *
 * For a themed shell with border + shadow + padding, use <Ratio> (sized) or
 * <Card> (with header/actions). Box is intentionally bare so that nested
 * tokens resolve correctly without competing styling.
 */

export function Box({
  children,
  theme,
  surface,
  component = 'div',
  className = '',
  sx = {},
  ...props
}) {
  return (
    <MuiBox
      component={component}
      data-theme={theme || undefined}
      data-surface={surface || undefined}
      className={'dyno-box' + (className ? ' ' + className : '')}
      sx={sx}
      {...props}
    >
      {children}
    </MuiBox>
  );
}

export default Box;
