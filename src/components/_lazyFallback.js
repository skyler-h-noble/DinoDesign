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

export function lazyFallback(name, load) {
  const Mui = lazy(load);
  function Fallback(props) {
    if (process.env.NODE_ENV !== 'production' && !warned.has(name)) {
      warned.add(name);
      // eslint-disable-next-line no-console
      console.warn(`[OmniDesign] ${name} was given an MUI-only prop (sx or a responsive value), `
        + 'so its MUI version loads on demand. For layout, style / className keep it static.');
    }
    return <Suspense fallback={null}><Mui {...props} /></Suspense>;
  }
  Fallback.displayName = name + 'Fallback';
  return Fallback;
}
