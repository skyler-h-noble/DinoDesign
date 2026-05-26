// src/components/_bevelPresets.js
//
// Shared bevel preset catalog. Color is intentionally NOT stored in a preset —
// the renderer resolves --Buttons-{Theme}-{Button|Highlight|Lowlight} at paint
// time so the same preset name looks correct under any theme.
//
// Used by:
//   <BevelText>    — straight-line text, full SVG filter pipeline (bevel + drop-shadow)
//   <CurvedText>   — text-on-path, simpler stacked-text rendering
//
// CurvedText silently downgrades: presets with bevel:false (e.g. "Shadow Only")
// render nothing because SVG drop-shadow filters don't behave reliably on
// <textPath>. The angle and softness fields are also ignored by CurvedText.

export const BEVEL_THEMES = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral'];

export const BEVEL_PRESETS = {
  Classic: {
    name: 'Classic',
    description: 'Raised + soft shadow',
    angle: 135,
    bevel: true,
    depth: 5,
    softness: 1,
    shadow: true,
    shadowDistance: 6,
    shadowBlur: 8,
    shadowOpacity: 0.6,
  },
  Carved: {
    name: 'Carved',
    description: 'Deep inset, no shadow',
    angle: 135,
    bevel: true,
    depth: 10,
    softness: 2,
    shadow: false,
    shadowDistance: 4,
    shadowBlur: 4,
    shadowOpacity: 0.4,
  },
  Embossed: {
    name: 'Embossed',
    description: 'Inset + heavy shadow',
    angle: 135,
    bevel: true,
    depth: 7,
    softness: 1.5,
    shadow: true,
    shadowDistance: 10,
    shadowBlur: 14,
    shadowOpacity: 0.7,
  },
  Stamp: {
    name: 'Stamp',
    description: 'Reversed light + shadow',
    angle: 315,
    bevel: true,
    depth: 6,
    softness: 1,
    shadow: true,
    shadowDistance: 5,
    shadowBlur: 6,
    shadowOpacity: 0.8,
  },
  'Night Cut': {
    name: 'Night Cut',
    description: 'Inset on dark background',
    angle: 135,
    bevel: true,
    depth: 8,
    softness: 2,
    shadow: false,
    shadowDistance: 6,
    shadowBlur: 8,
    shadowOpacity: 0.6,
  },
  'Shadow Only': {
    name: 'Shadow Only',
    description: 'Flat fill + drop shadow',
    angle: 135,
    bevel: false,
    depth: 4,
    softness: 1,
    shadow: true,
    shadowDistance: 8,
    shadowBlur: 12,
    shadowOpacity: 0.5,
  },
};

export const BEVEL_PRESET_NAMES = Object.keys(BEVEL_PRESETS);

// Resolve a preset name + optional custom overrides to a fully-populated config.
// preset === 'custom' starts from Classic defaults so `custom` only needs to
// override the fields the caller actually wants to change.
export function resolveBevelConfig(preset, custom) {
  if (preset === 'custom') {
    return { ...BEVEL_PRESETS.Classic, name: 'Custom', description: 'Custom', ...(custom || {}) };
  }
  const found = BEVEL_PRESETS[preset];
  if (!found) return { ...BEVEL_PRESETS.Classic };
  return { ...found };
}

// CSS color values for each slot. Highlight/Lowlight are stored as
// space-separated RGB triplets so they need rgb(...) wrapping; Button is a
// plain color value. (Matches the contract CurvedText already uses.)
export function bevelColor(theme, slot) {
  const t = theme || 'Primary';
  if (slot === 'base') return 'var(--Buttons-' + t + '-Button)';
  if (slot === 'highlight') return 'rgb(var(--Buttons-' + t + '-Highlight))';
  if (slot === 'lowlight') return 'rgb(var(--Buttons-' + t + '-Lowlight))';
  return undefined;
}

/**
 * The small-text fallback color for a given bevel theme.
 *
 * The bevel's `--Buttons-{Theme}-Button` fill is tuned for button bodies and
 * pairs with the Highlight / Lowlight at the WCAG 3:1 large-text minimum.
 * Once rendered text drops below 19px, contrast needs to hit 4.5:1 — at that
 * size we swap the bevel fill for `--Text-{Theme}` (or plain `--Text` for
 * Default), which IS contrast-tuned for body text.
 */
export function textFallbackColor(theme) {
  const t = theme || 'Primary';
  if (t === 'Default') return 'var(--Text)';
  return 'var(--Text-' + t + ')';
}

// Angle in degrees -> {dx, dy} offset on a circle of radius `dist`.
// 0° points right, 90° points down (matches the BevelText.html mock).
export function angleToOffset(deg, dist) {
  const r = ((deg - 90) * Math.PI) / 180;
  return { dx: Math.cos(r) * dist, dy: Math.sin(r) * dist };
}
