// src/components/PreviewSurface.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from './_staticStyles';
import { lazySxBox } from './_lazyFallback';

const SxBox = lazySxBox('PreviewSurface');

/* Static sheet. minHeight is per instance, so it travels as a custom property
   declared on the element itself. A caller's sx goes through the MUI box and
   lands after this sheet, so its keys still win as they did when they were
   merged into the one sx object. */
registerStaticStyles('omni-preview-surface', [
  '.omni-preview-surface{padding:32px;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;'
    + 'min-height:var(--_ps-mh);background-color:var(--Background);border-bottom:1px solid var(--Border)}',
].join('\n'));

/* MUI's sizing rule for a number, which minHeight went through as an sx key:
   (0, 1] is a fraction of the parent, anything else is px. */
const size = (v) => (typeof v === 'number' ? (v > 0 && v <= 1 ? v * 100 + '%' : v + 'px') : v);

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
  useStaticStyles('omni-preview-surface');
  const props = {
    ref,
    'data-theme': theme || undefined,
    'data-surface': surface,
    className: 'MuiBox-root omni-preview-surface',
    style: { '--_ps-mh': size(minHeight) },
  };
  if (sx && Object.keys(sx).length) return <SxBox {...props} sx={sx}>{children}</SxBox>;
  return <div {...props}>{children}</div>;
});

export default PreviewSurface;
