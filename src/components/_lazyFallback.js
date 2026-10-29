// src/components/_lazyFallback.js
//
// The MUI version of a converted component, loaded only when it is needed.
//
// A converted component renders from its static sheet unless it is handed an
// MUI-only prop (sx, a responsive object value, …), in which case it hands the
// call to its MUI version — so nothing that worked before breaks. That
// version lives in its own *.mui.js module and is imported on demand: a page
// that never passes sx never downloads MUI or emotion for these components. A
// direct import would keep MUI in every bundle, since whether the fallback is
// needed is only known at runtime.
import React, { Suspense, lazy } from 'react';

const warned = new Set();

export function lazyFallback(name, load, { placeholder: Placeholder = null, warn = true } = {}) {
  const Mui = lazy(load);
  /* forwardRef all the way down: a component handed sx must still give its
     caller the DOM node — a Tooltip or Popover anchors to it. */
  const Fallback = React.forwardRef(function Fallback(props, ref) {
    if (warn && process.env.NODE_ENV !== 'production' && !warned.has(name)) {
      warned.add(name);
      // eslint-disable-next-line no-console
      console.warn(`[OmniDesign] ${name} was given an MUI-only prop (sx or a responsive value), `
        + 'so its MUI version loads on demand. For layout, style / className keep it static.');
    }
    return (
      <Suspense fallback={Placeholder ? <Placeholder {...props} ref={ref} /> : null}>
        <Mui {...props} ref={ref} />
      </Suspense>
    );
  });
  Fallback.displayName = name + 'Fallback';
  return Fallback;
}

/* The plain element, minus sx: what an sx-carrying component shows while its
   MUI box loads. It already wears every static class, so the first frame is
   the component as designed and only the sx override arrives a moment later —
   rather than a blank where the text should be. */
const StaticBox = React.forwardRef(function StaticBox({ component: Tag = 'div', sx, ...props }, ref) {
  return <Tag {...props} ref={ref} />;
});

/** An MUI Box that adds a caller's sx on top of a component's static classes.
 *  sx is supported API on these components (and lib components pass it), so
 *  there is no warning. */
export function lazySxBox(name) {
  return lazyFallback(name, () => import('./_sxBox.mui'), { placeholder: StaticBox, warn: false });
}
