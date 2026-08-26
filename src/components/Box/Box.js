// src/components/Box/Box.js
import React from 'react';
import { Box as MuiBox } from '@mui/material';
import { SHADOWS } from '../_shadows';

/**
 * Box Component — bare layout primitive.
 *
 * A theme-aware container with no visual styling of its own. Use it when you
 * need a slot that participates in the design-system cascade (data-theme /
 * data-surface) without inheriting any of the chrome that Ratio or Card
 * would bring. No border-radius, no padding, no data-theme of its own —
 * it inherits theme from its parent unless you pass `theme`.
 *
 * Props:
 *   theme      — optional data-theme override for everything inside
 *   surface    — optional data-surface override (Surface | Container | Container-Low | etc.)
 *   elevation  — 0–5. When > 0, the Box renders an OUTER wrapper that carries
 *                the layered shadow but sets NO surface, so the shadow color
 *                resolves from the PARENT surface (the surface the box sits on,
 *                physically where the shadow falls) rather than the box's own.
 *                The inner element paints `surface` and fills the wrapper.
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
  elevation = 0,
  component = 'div',
  className = '',
  sx = {},
  style,
  ...props
}) {
  const level = Math.max(0, Math.min(5, elevation | 0));

  // Flat (no elevation): a single bare element — children are direct, so any
  // flex/gap/padding the caller passes works as-is.
  if (!level) {
    return (
      <MuiBox
        component={component}
        data-theme={theme || undefined}
        data-surface={surface || undefined}
        className={'omni-box' + (className ? ' ' + className : '')}
        sx={{ background: 'var(--Background)', boxSizing: 'border-box', ...sx }}
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
      sx={{ boxShadow: SHADOWS[level], boxSizing: 'border-box', width: sxW, height: sxH, borderRadius: sxR }}
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

export default Box;
