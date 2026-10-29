// src/components/_staticStyles.js
//
// Component styles as plain, static CSS — the replacement for emotion's
// runtime styling, one component at a time.
//
// The CSS reads the same tokens through the same data-theme / data-surface
// cascade; only the delivery changes. Each component registers its sheet once
// and inserts it as a <style> on first render — no styling engine at runtime,
// no CSS-in-JS work per render. getStaticStyles() hands a server renderer the
// registered sheets, so a prerendered page ships them in its HTML.
import { useInsertionEffect, useLayoutEffect } from 'react';

const REGISTRY = new Map();
const useEarlyEffect = useInsertionEffect || useLayoutEffect;

/** Register a component sheet. Call at module level: register('omni-icon-badge', css). */
export function registerStaticStyles(id, css) {
  REGISTRY.set(id, css);
}

/** Insert a registered sheet once per document, before the first paint. */
export function useStaticStyles(id) {
  useEarlyEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.setAttribute('data-omni-component', '');
    el.textContent = REGISTRY.get(id) || '';
    // First in <head>: a consumer's own stylesheet comes later and can still
    // win at equal specificity, as it could over emotion's.
    document.head.insertBefore(el, document.head.firstChild);
  }, [id]);
}

/** Every registered sheet as <style> tags — for a server render's <head>. */
export function getStaticStyles() {
  return [...REGISTRY].map(([id, css]) => `<style id="${id}" data-omni-component>${css}</style>`).join('');
}
