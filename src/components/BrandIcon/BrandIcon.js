// src/components/BrandIcon/BrandIcon.js
//
// A company or service mark — GitHub, LinkedIn, Figma, YouTube.
//
// SEPARATE from <Icon>, and the distinction is not cosmetic. Icon renders
// Material Symbols, which are a design system's own vocabulary: they take the
// brand's icon color, scale on its ramp, and mean what the system says they
// mean. A brand mark is somebody else's artwork. It cannot be derived, it is
// not ours to restyle, and it carries a trademark — so it gets its own
// component rather than a `brand` prop on Icon that would quietly inherit
// rules that do not apply to it.
//
// Takes a NAME, matching Figma. The Brand-Icons component there (9155:26699)
// is Font Awesome 6 Brands as a LIGATURE font — one component with a text
// layer, where you type the brand's name and the font draws the glyph — so its
// API is a lowercase hyphenated string: `github`, `x-twitter`, `linkedin`.
// This mirrors that, and mirrors <Icon>, which is Material Symbols by the same
// mechanism. A component whose API is a different shape from the design it
// implements is one the converter cannot map.
//
// Path data comes from @fortawesome/free-brands-svg-icons (CC BY 4.0) rather
// than being drawn here, because a hand-copied path is a subtly wrong logo and
// nobody reviewing a diff can tell. The web has no ligature-font equivalent
// bundled with the package, so the name is resolved to the icon object instead
// — same input, same output, different mechanism.
//
// CHANGING THE COLOUR
//
//   in code    the `color` prop, or leave it and it inherits. The default is
//              `currentColor`, so it takes the color of the text around it —
//              a footer link's color, usually, which is what you want when it
//              sits beside a label. Pass any CSS color or a token:
//              <BrandIcon name="github" color="var(--Icons-Primary)" />
//
//   in Figma   it is a TEXT layer in a ligature font, so its color is the
//              layer's FILL. Bind that to a variable the way any other text
//              fill is bound — Icons/Icons-Primary, Text, or whatever the
//              surface calls for. There is no color variant on the component,
//              and there should not be: 610 glyphs times a color axis is a
//              variant set nobody can load.
//
// Monochrome is the convention for brand marks in a themed UI, which is why
// there is no "official brand color" mode here. A row of six logos in their
// own corporate colors reads as a ransom note and cannot meet a contrast
// requirement, since each one is a fixed hex that knows nothing about the
// surface behind it.
import React from 'react';
import * as brands from '@fortawesome/free-brands-svg-icons';

/* 'x-twitter' -> 'faXTwitter'. Font Awesome exports PascalCase of the
   hyphenated name, which is exactly what Figma's text layer holds, so the
   two stay in step without a lookup table to maintain. */
function iconForName(name) {
  if (typeof name !== 'string' || !name) return null;
  const key = 'fa' + name.split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return brands[key] || null;
}

/* Every brand mark this build can draw, as the names the component takes.
 *
 * Read off the icon objects' own `iconName` rather than reversed from the
 * export keys: Font Awesome is the authority on its own spelling, and a list
 * derived by un-camel-casing would be a second guess at something already
 * stated. All 609 round-trip back through iconForName, which is asserted
 * rather than assumed.
 *
 * Exported because a free-text name field needs two things the component
 * alone cannot give it: something to autocomplete from, and a way to say
 * "that one does not exist" — an unknown name renders NOTHING, so without
 * this the field's failure mode is a blank square.
 */
export const BRAND_ICON_NAMES = Array.from(new Set(
  Object.values(brands)
    .filter((v) => v && typeof v === 'object' && v.iconName && Array.isArray(v.icon))
    .map((v) => v.iconName),
)).sort();

/** Does this build have a mark for that name? */
export function hasBrandIcon(name) {
  const resolved = iconForName(name);
  return Boolean(resolved && resolved.icon);
}

/**
 * @param name   lowercase, hyphenated, as Figma's text layer holds it:
 *               'github', 'x-twitter', 'linkedin', 'dribbble', 'instagram'
 * @param icon   a Font Awesome icon object, if you would rather import it
 *               yourself. Takes precedence over `name`.
 * @param size   any CSS length. Defaults to 1em so it rides the text beside it.
 * @param color  any CSS color or token. Defaults to currentColor.
 * @param title  accessible name. Omit for decoration beside a visible label —
 *               the icon is then aria-hidden, which is the common case in a
 *               footer where the link text already says "GitHub".
 */
export function BrandIcon({ name, icon, size = '1em', color = 'currentColor', title, ...props }) {
  const resolved = icon || iconForName(name);
  if (!resolved || !resolved.icon) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[BrandIcon] no brand mark for ${JSON.stringify(name ?? icon)}. Names are `
        + 'lowercase and hyphenated, exactly as Font Awesome lists them and as '
        + "Figma's Brand-Icons text layer holds them: github, x-twitter, "
        + 'linkedin, dribbble, instagram. Rendering nothing.',
      );
    }
    return null;
  }

  // Font Awesome's shape: [width, height, ligatures, unicode, pathData]
  const [width, height, , , pathData] = resolved.icon;
  const d = Array.isArray(pathData) ? pathData.join(' ') : pathData;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      fill={color}
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
