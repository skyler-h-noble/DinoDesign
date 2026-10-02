// src/components/FigmaIcon.js
//
// The Figma mark, as an inline SVG.
//
// Inline rather than from @mui/icons-material because that set ships Material
// icons only — there is no brand glyph in it — and the lib deliberately ships
// no icons of its own. It is drawn at 1em so it sizes with the text beside it
// and inherits `currentColor`, which keeps it on whatever text role its link
// resolves to rather than pinning Figma's five brand colours into a themed UI.
//
// aria-hidden: it decorates a link whose text already says where it goes, so
// announcing it again would read the destination twice.
import React from 'react';

export function FigmaIcon({ size = '1em', ...props }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false"
      style={{ flexShrink: 0, verticalAlign: '-0.125em' }}
      {...props}
    >
      <rect x="8" y="2" width="8" height="6.667" rx="3.333" />
      <rect x="8" y="8.667" width="8" height="6.667" rx="3.333" />
      <rect x="8" y="15.333" width="4" height="6.667" rx="3.333" />
      <circle cx="19.333" cy="12" r="3.333" />
    </svg>
  );
}

export default FigmaIcon;
