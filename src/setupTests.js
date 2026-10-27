// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// jest-axe adds accessibility testing matchers
import { configureAxe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Configure axe with WCAG AA rules
configureAxe({
  rules: {
    'color-contrast': { enabled: true },
    'label': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'button-name': { enabled: true },
    'image-alt': { enabled: true },
    'input-button-name': { enabled: true },
    'link-name': { enabled: true },
  },
});
/* jsdom does not implement ResizeObserver, and three components construct one
   in an effect — Tabs (scroll affordances), BevelText and CurvedText. The
   constructor throws, React unmounts the tree, and EVERY test in those files
   fails with a stack trace rather than an assertion. That accounted for 33 of
   the Tabs suite's failures on its own, and none of them were about Tabs.

   A no-op is the right shape here rather than a fake that fires callbacks: the
   components only use it to recompute scroll affordances on resize, and jsdom
   has no layout to resize. Firing a synthetic callback would invent a resize
   that never happened and assert against numbers jsdom cannot produce
   (every dimension is 0). Silence is honest; a fake would not be. */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

/* TextEncoder / TextDecoder — jsdom does not provide them, and react-router 7
   reaches for TextEncoder at import time, so App.test.js could not even load.
   Unlike the ResizeObserver stub above these are NOT no-ops: Node has real,
   spec-correct implementations in `util`, so the right move is to hand those
   through rather than invent a substitute. */
const { TextEncoder, TextDecoder } = require('util');
if (typeof globalThis.TextEncoder === 'undefined') globalThis.TextEncoder = TextEncoder;
if (typeof globalThis.TextDecoder === 'undefined') globalThis.TextDecoder = TextDecoder;

/* jsdom's selector engine (nwsapi) cannot parse a relative selector inside
   :has() — `:has(> .accordion-summary:hover)` in Accordion, valid in every
   browser. getComputedStyle walks EVERY stylesheet rule and throws on that
   one, so any test that computes a style while an Accordion's CSS is in the
   document fails with "is not a valid selector". It surfaced when SpeedDial's
   labels became open tooltips: MUI's Popper calls getComputedStyle to place
   them, and the docs suites render an Accordion sample alongside.

   Retry once against the element alone with no stylesheet in play rather
   than crash: the components do not depend on computed values in jsdom (it
   has no layout), and swallowing the error here keeps the real selector in
   the component instead of weakening it for a test engine. */
{
  const realGCS = window.getComputedStyle.bind(window);
  window.getComputedStyle = (el, pseudo) => {
    try {
      return realGCS(el, pseudo);
    } catch (e) {
      if (e && e.name === 'SyntaxError' && /not a valid selector|unknown pseudo-class selector/.test(e.message)) {
        return el && el.style ? el.style : realGCS(document.createElement('div'));
      }
      throw e;
    }
  };
}
