// src/components/_ghost.js
import React from 'react';

/**
 * Ghost — the loading placeholder, as a state of the real components.
 *
 * WHY NOT A <Skeleton> COMPONENT
 * A separate skeleton drifts. Draw a card-shaped placeholder, change Card's
 * padding, and the placeholder is silently wrong — a second definition of the
 * same layout, which is the failure this library's architecture exists to
 * prevent. A ghosting Card IS a Card, so its geometry cannot disagree with
 * itself and nothing shifts when the data lands.
 *
 * WHY CONTEXT AND NOT A PROP
 * Ghosting is a property of a REGION, not of each piece of text in it. A prop
 * would have to be threaded through every intermediate component and passed at
 * every call site; miss one and that element stays real inside a ghosting card,
 * which reads as a rendering bug rather than as a missed prop. Context makes
 * the region the unit, which is what it actually is.
 *
 * WHY IT IS NOT IN FIGMA
 * It introduces no brand variable — it reuses --Border-Variant, which every
 * customer already has — and no structure. Block heights and radii are
 * library-owned, not brand-owned, so there is nothing for the plugin to read
 * and nothing for the add-on to rebind.
 *
 * WHY --Border-Variant
 * It is the only token in the system whose PERCEIVED weight is held constant
 * across every theme and surface: an adaptive alpha, floor 0.20, rising toward
 * 0.41 as the colour approaches its background. A flat tint measured a 27x
 * spread over the 324 theme x surface contexts, invisible on some brands. A
 * placeholder has to read as quietly present everywhere, which is the same
 * requirement. Variants are also exempt from contrast rules by contract, and a
 * placeholder carries no information — the same contract.
 *
 * DO NOT SET OPACITY ON A GHOST BLOCK. The alpha is already baked into the
 * token (variantHex8 returns 8 digits). Halving it takes the brands that were
 * at the 0.20 floor down to 0.10 — under the shift the adaptive alpha exists to
 * prevent — so an opacity multiplies the tuning away, worst on exactly the
 * brands that needed it most.
 */

/* null, not false: the provider supplies an options object, so a boolean
   default makes the type read as a union by accident rather than by design. */
const GhostContext = React.createContext(null);

/** The ghost options for this subtree, or null when not ghosting. */
export function useGhost() {
  return React.useContext(GhostContext);
}

/* One sweep, defined once. Figma cannot express it, so it lives only here. */
export const GHOST_KEYFRAMES = `
@keyframes omni-ghost-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

/**
 * The block itself.
 *
 * `currentColor` is deliberate: the sweep is the SURFACE showing through the
 * block, so it needs no second token and cannot disagree with the background
 * it sits on.
 */
export function ghostBlockSx({ radius = 'var(--Ghost-Radius, 4px)', animate = true } = {}) {
  return {
    backgroundColor: 'var(--Border-Variant)',
    borderRadius: radius,
    /* The text is still THERE — transparent, not removed. It keeps the box at
       the exact size the real content will occupy, which is the whole point:
       nothing reflows when the data arrives. It is hidden from assistive tech
       by the aria-hidden + aria-busy on the region, not by deleting it. */
    color: 'transparent',
    userSelect: 'none',
    pointerEvents: 'none',
    ...(animate && {
      backgroundImage:
        'linear-gradient(90deg, transparent 0%, var(--Background) 50%, transparent 100%)',
      backgroundSize: '200% 100%',
      backgroundRepeat: 'no-repeat',
      animation: 'omni-ghost-sweep 1.4s linear infinite',
      /* A full page of sweeping blocks is a genuine vestibular trigger, so the
         resting state is the un-animated block — which is also exactly what a
         static design file can show. */
      '@media (prefers-reduced-motion: reduce)': {
        backgroundImage: 'none',
        animation: 'none',
      },
    }),
  };
}

/**
 * Marks a region as loading. Everything inside renders as a placeholder.
 *
 * @param {boolean} active     ghost while true; render normally when false
 * @param {boolean} animate    sweep; false for a static block
 * @param {string}  label      announced while loading
 */
export function Ghost({
  active = true,
  animate = true,
  label = 'Loading',
  children,
  ...props
}) {
  if (!active) return <>{children}</>;

  return (
    <GhostContext.Provider value={{ animate }}>
      {/* aria-busy tells assistive tech the region is in flux; aria-hidden on
          the CONTENT stops a screen reader reading placeholder text aloud,
          while the live label says what is happening. Doing only one of the
          two is how a skeleton ends up announced as a page of blank
          paragraphs. */}
      <style>{GHOST_KEYFRAMES}</style>
      <div aria-busy="true" data-ghost="true" {...props}>
        <span
          style={{
            position: 'absolute', width: 1, height: 1, overflow: 'hidden',
            clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <div aria-hidden="true">{children}</div>
      </div>
    </GhostContext.Provider>
  );
}

export default Ghost;
