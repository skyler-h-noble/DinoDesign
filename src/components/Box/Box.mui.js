// src/components/Box/Box.mui.js
// The MUI version of Box, loaded on demand (see _lazyFallback.js):
// only a caller passing an MUI-only prop such as sx ever downloads it.
import React from 'react';
import { Box as MuiBox } from '@mui/material';
import { SHADOWS } from '../_shadows';
import { RATIO_MAP } from '../Ratio/Ratio';

const RADIUS = {
  none: undefined,
  small: 'var(--Sm-Card-Radius, var(--Card-Radius))',
  medium: 'var(--Card-Radius)',
  large: 'var(--Lg-Card-Radius, var(--Card-Radius))',
};

function BoxMui({
  children,
  theme,
  surface,
  radius = 'none',
  elevation = 0,
  ratio,
  component = 'div',
  className = '',
  sx = {},
  style,
  ...props
}) {
  const level = Math.max(0, Math.min(5, elevation | 0));
  // Unknown values fall back to bare rather than throwing — a typo should not
  // take a layout down.
  const radiusValue = RADIUS[radius];
  const aspect = typeof ratio === 'number' ? String(ratio) : (ratio ? RATIO_MAP[ratio] : undefined);
  const ratioSx = aspect ? { aspectRatio: aspect } : {};

  // Flat (no elevation): a single bare element — children are direct, so any
  // flex/gap/padding the caller passes works as-is.
  if (!level) {
    return (
      <MuiBox
        component={component}
        data-theme={theme || undefined}
        data-surface={surface || undefined}
        className={'omni-box' + (className ? ' ' + className : '')}
        sx={{ background: 'var(--Background)', boxSizing: 'border-box', ...ratioSx, ...(radiusValue ? { borderRadius: radiusValue } : {}), ...sx }}
        style={style}
        {...props}
      >
        {children}
      </MuiBox>
    );
  }

  // Elevated: an OUTER shadow wrapper + an INNER content box. The wrapper carries
  // SIZE + SHAPE + the shadow (and NO surface, so the shadow takes the PARENT
  // surface's dropshadow color). The INNER box paints the surface AND holds the
  // children — so LAYOUT styles (padding, display/flex/gap/align/justify) must go
  // on the INNER, or a flex gap would only space the single inner child (i.e. do
  // nothing). We split the caller's style/sx accordingly.
  const s = style || {};
  const {
    width, height, minWidth, minHeight, maxWidth, maxHeight, borderRadius,
    margin, marginTop, marginRight, marginBottom, marginLeft,
    ...innerStyle
  } = s;
  const outerStyle = {
    width, height, minWidth, minHeight, maxWidth, maxHeight, borderRadius,
    margin, marginTop, marginRight, marginBottom, marginLeft,
  };

  const {
    width: sxW, height: sxH, borderRadius: sxR, ...innerSx
  } = sx;

  return (
    <MuiBox
      component={component}
      className={'omni-box-elevation' + (className ? ' ' + className : '')}
      /* The class name is the same for every level, so the DOM said a box was
         elevated and never by how much — reading the level meant opening
         Computed and counting comma-separated shadow layers. This makes it a
         glance, which matters most when a design-to-code conversion picks the
         wrong level: the wrong number is visible next to the right one. */
      data-elevation={level}
      /* Radius goes on the OUTER shell so the shadow follows the corner rather
         than squaring off behind a rounded surface; the inner box already
         inherits it. An explicit sx.borderRadius still wins. */
      sx={{ boxShadow: SHADOWS[level], boxSizing: 'border-box', ...ratioSx, width: sxW, height: sxH, borderRadius: sxR !== undefined ? sxR : radiusValue }}
      style={outerStyle}
      {...props}
    >
      <MuiBox
        data-theme={theme || undefined}
        data-surface={surface || undefined}
        className="omni-box"
        // Fills the wrapper, paints the surface, inherits the wrapper's radius so
        // the surface matches the rounded shadowed box. Carries the caller's
        // layout (flex/gap/padding) so children are actually spaced.
        sx={{ width: '100%', height: '100%', background: 'var(--Background)', borderRadius: 'inherit', boxSizing: 'border-box', ...innerSx }}
        style={innerStyle}
      >
        {children}
      </MuiBox>
    </MuiBox>
  );
}

export default BoxMui;
