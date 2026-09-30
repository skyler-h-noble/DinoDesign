// src/components/Avatar/AvatarGlyph.js
//
// The brand's own "no image" avatar — a person silhouette filling the whole
// disc, rather than a glyph floating inside a coloured circle.
//
// It replaces @mui/icons-material/Person as the placeholder. Two reasons:
//
//  1. The silhouette IS the circle. MUI's Person is a shape drawn inside a box,
//     so it had to be sized to ~50% of the diameter and centred, leaving the
//     avatar's background doing the circular work. This path carries the disc
//     itself, so it fills edge to edge at any size with no inner ratio to tune.
//
//  2. It is the brand's, not Material's. Icons from @mui/icons-material are
//     allowed — the lib ships no icon set — but a placeholder that appears
//     wherever a user has no photo is closer to a brand mark than to an icon.
//
// FILL IS `currentColor`, NOT the #8A4043 the export carried. The source SVG
// was exported at one brand's Primary, and hardcoding it would put that brand's
// maroon in every other brand's avatar. `currentColor` inherits the colour the
// Avatar already sets from --Buttons-{C}-Text, so the glyph follows the palette
// and both modes for free.
import React from 'react';

export function AvatarGlyph({ size = '100%', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      /* Decoration: the Avatar itself carries the accessible name via `alt`
         or the surrounding control's label. A title here would announce the
         placeholder twice — the same double-announcement rule icon-only
         Buttons follow. */
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M24.9375 24.0125C23.5562 21.6125 20.9625 20 18 20H14C11.0375 20 8.44375 21.6125 7.0625 24.0125C9.2625 26.4625 12.45 28 16 28C19.55 28 22.7375 26.4563 24.9375 24.0125ZM0 16C0 11.7565 1.68571 7.68687 4.68629 4.68629C7.68687 1.68571 11.7565 0 16 0C20.2435 0 24.3131 1.68571 27.3137 4.68629C30.3143 7.68687 32 11.7565 32 16C32 20.2435 30.3143 24.3131 27.3137 27.3137C24.3131 30.3143 20.2435 32 16 32C11.7565 32 7.68687 30.3143 4.68629 27.3137C1.68571 24.3131 0 20.2435 0 16ZM16 17C17.1935 17 18.3381 16.5259 19.182 15.682C20.0259 14.8381 20.5 13.6935 20.5 12.5C20.5 11.3065 20.0259 10.1619 19.182 9.31802C18.3381 8.47411 17.1935 8 16 8C14.8065 8 13.6619 8.47411 12.818 9.31802C11.9741 10.1619 11.5 11.3065 11.5 12.5C11.5 13.6935 11.9741 14.8381 12.818 15.682C13.6619 16.5259 14.8065 17 16 17Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default AvatarGlyph;
