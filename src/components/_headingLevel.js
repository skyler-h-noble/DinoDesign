/* _headingLevel.js — the heading level a region's titles should use.
 *
 * WHY THIS EXISTS
 * "Headings go down one level at a time" is a rule an author has to keep in
 * their head across files: the filter panel, the cart summary and the checkout
 * steps each picked H3 because H3 LOOKED right, and each sat directly under the
 * page's h1 — axe heading-order, on every page of a clean-room store build.
 * The look and the level were one choice; here they are two. The level comes
 * from nesting, the look from a prop.
 *
 * THE MODEL
 * Outside any Section the level is 1 — the page title. Every <Section> (and
 * every <HeadingLevel>) adds one for what is inside it, capped at 6. So the
 * titles of a page's bands are h2, a panel in a nested Section is h3, and a
 * level can never be skipped by picking a size. <AutoHeading> renders the
 * level it is given; H1–H6 keep rendering exactly the tag they name.
 *
 * Kept in its own module, apart from Typography, so Section can provide the
 * level without importing the whole type system.
 */
import React, { createContext, useContext } from 'react';

export const HeadingLevelContext = createContext(1);

const clamp = (n) => Math.max(1, Math.min(6, Math.round(Number(n)) || 1));

/** The level (1–6) an <AutoHeading> renders at this point in the tree. */
export function useHeadingLevel() {
  return useContext(HeadingLevelContext);
}

/**
 * Starts a sub-level for the titles inside it without painting anything — for
 * a group that is a subsection but not a Section (a card's own sub-titles, a
 * sidebar). `level` sets it outright instead of adding one.
 */
export function HeadingLevel({ level, children }) {
  const parent = useContext(HeadingLevelContext);
  const value = level != null ? clamp(level) : Math.min(parent + 1, 6);
  return <HeadingLevelContext.Provider value={value}>{children}</HeadingLevelContext.Provider>;
}

export default HeadingLevel;
