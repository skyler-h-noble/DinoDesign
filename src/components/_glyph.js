// src/components/_glyph.js
//
// A fixed MUI icon drawn as plain SVG — for converted components that use one
// internal glyph (a check, a close, a chevron) and would otherwise pull in
// SvgIcon and emotion for it.
//
// The markup is SvgIcon's own: the same classes (MuiSvgIcon-root /
// MuiSvgIcon-fontSizeMedium, which a parent's rule may target), the same
// attributes (focusable, aria-hidden, viewBox, data-testid = the icon's
// export name), and SVG_ICON_DECLS is the declaration block SvgIcon's emotion
// class carried. Each component puts those declarations in ITS OWN class rule,
// one class deep, as SvgIcon's emotion class was — so a parent's
// `.x .MuiSvgIcon-root` rule outweighs it exactly as it did before.
import React from 'react';

export const GLYPHS = {
  Check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  Remove: 'M19 13H5v-2h14z',
  Close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  ExpandMore: 'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z',
  InfoOutlined: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8',
  CheckCircleOutline: 'M16.59 7.58 10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8',
  WarningAmber: ['M12 5.99 19.53 19H4.47zM12 2 1 21h22z', 'M13 16h-2v2h2zm0-6h-2v5h2z'],
  ErrorOutline: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8',
};

/** SvgIcon's base declarations, minus font-size and color, which each use sets. */
export const SVG_ICON_DECLS = 'user-select:none;width:1em;height:1em;display:inline-block;flex-shrink:0;'
  + 'transition:fill 200ms cubic-bezier(0.4, 0, 0.2, 1);fill:currentColor';

export function Glyph({ name, className = '', ...props }) {
  const d = GLYPHS[name];
  return (
    <svg
      className={'MuiSvgIcon-root MuiSvgIcon-fontSizeMedium ' + className}
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid={name + 'Icon'}
      {...props}
    >
      {Array.isArray(d) ? d.map((p) => <path key={p} d={p} />) : <path d={d} />}
    </svg>
  );
}
