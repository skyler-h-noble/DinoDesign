// src/components/BrandIcon/BrandIcon.js
//
// A company or service mark — GitHub, LinkedIn, Figma, YouTube.
//
// SEPARATE from <Icon>, and the distinction is not cosmetic. Icon renders
// Material Symbols, which are a design system's own vocabulary: they take the
// brand's icon colour, scale on its ramp, and mean what the system says they
// mean. A brand mark is somebody else's artwork. It cannot be derived, it is
// not ours to restyle, and it carries a trademark — so it gets its own
// component rather than a `brand` prop on Icon that would quietly inherit
// rules that do not apply to it.
//
// Path data comes from @fortawesome/free-brands-svg-icons (CC BY 4.0) rather
// than being drawn here, because a hand-copied path is a subtly wrong logo and
// nobody reviewing a diff can tell. Icons are imported BY NAME at the call
// site, so a bundler ships only the marks actually used — the package holds
// 610 and a footer wants four.
//
// Colour: `currentColor` by default, so it takes the text role of whatever it
// sits in — a footer link's colour, usually. Brand guidelines often require
// the official colour instead, which is what `color="brand"` is for; it is
// opt-in because a row of six official brand colours in a themed footer looks
// like a ransom note, and monochrome is the convention for exactly that reason.
import React from 'react';

/**
 * @param icon   a Font Awesome brand icon object, e.g. `faGithub`
 * @param size   any CSS length. Defaults to 1em so it rides the text beside it.
 * @param color  'currentColor' (default) | 'brand' | any CSS colour
 * @param title  accessible name. Omit for decoration beside a visible label —
 *               the icon is then aria-hidden, which is the common case in a
 *               footer where the link text already says "GitHub".
 */
export function BrandIcon({ icon, size = '1em', color = 'currentColor', title, ...props }) {
  if (!icon || !icon.icon) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[BrandIcon] needs an `icon` from @fortawesome/free-brands-svg-icons, '
        + 'e.g. import { faGithub } from "@fortawesome/free-brands-svg-icons". '
        + 'Rendering nothing.',
      );
    }
    return null;
  }

  // Font Awesome's shape: [width, height, ligatures, unicode, pathData]
  const [width, height, , , pathData] = icon.icon;
  const d = Array.isArray(pathData) ? pathData.join(' ') : pathData;
  const fill = color === 'brand' ? undefined : color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      fill={fill}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
      style={{ flexShrink: 0, verticalAlign: '-0.125em' }}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}

export default BrandIcon;
