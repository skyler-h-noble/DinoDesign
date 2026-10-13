// src/components/colorChoices.js
//
// WHICH BUTTON COLORS A PLAYGROUND MAY OFFER, given the surface it is on.
//
// On a STATE-themed surface the only palettes that mean anything are the
// state's own, Neutral, and BlackWhite. Offering Primary on an Error surface
// invites a combination the design system does not describe — and until the
// per-surface Buttons tones were fixed it was worse than meaningless, because
// every palette resolved to the surface's own color, so all eight accent
// choices rendered the same button and the picker looked broken.
//
// BlackWhite is always offered on a state surface even when the showcase's own
// group list omits it. It is the one palette that cannot collapse into a
// themed ground — which is exactly why it is the one you want available there.
import { useEffect } from 'react';

export const STATE_THEMES = ['Info', 'Success', 'Warning', 'Error'];

const isState = (theme) =>
  STATE_THEMES.some((s) => s.toLowerCase() === String(theme || '').toLowerCase());

/** The colors a playground may offer on `theme`. Null means "no restriction". */
export function allowedColors(theme) {
  if (!isState(theme)) return null;
  return [String(theme).toLowerCase(), 'neutral', 'black-white'];
}

/**
 * Filter a showcase's COLOR_GROUPS for the surface it is being viewed on.
 * Groups that empty out are dropped rather than left as a bare heading.
 */
export function colorGroupsFor(groups, theme) {
  const allowed = allowedColors(theme);
  if (!allowed) return groups;
  const out = groups
    .map((g) => ({ ...g, colors: g.colors.filter((c) => allowed.includes(c)) }))
    .filter((g) => g.colors.length);
  const shown = out.flatMap((g) => g.colors);
  const missing = allowed.filter((c) => !shown.includes(c));
  return missing.length ? out.concat([{ label: 'Buttons only', colors: missing }]) : out;
}

/**
 * Move the selection somewhere legal when the surface changes under it.
 *
 * Without this the picker hides a color but the PREVIEW keeps rendering it,
 * so the page shows a button the controls say is not available — and the one
 * swatch that looks selected is not on screen.
 */
export function useRestrictedColor(color, setColor, theme) {
  useEffect(() => {
    const allowed = allowedColors(theme);
    if (allowed && !allowed.includes(color)) setColor(allowed[0]);
  }, [color, setColor, theme]);
}
