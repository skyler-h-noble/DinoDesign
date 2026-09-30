// src/components/Charts/tokens.js
//
// The chart role → token mapping, in ONE place so all three charts agree and a
// change lands everywhere at once.
//
// These are the surface-paired tokens, not the --Chart-1..10 palette. That
// palette exists for multi-series charts, where each series needs its own
// distinguishable hue. Everything in this folder is single-series: one accent
// against a track, which is what the design calls for and what stays legible
// when the surface flips dark or moves to another Color-N — because every
// token here re-resolves with data-surface, and a --Chart-N does not.
export const CHART_TOKENS = {
  /** The filled part of a bar, the line itself, the pie slice. */
  fill: 'var(--Icons-Primary)',
  /** The unfilled remainder of a bar — the track it sits in. */
  track: 'var(--Border-Variant)',
  /** Axis lines, gridlines, the pie's separators. */
  line: 'var(--Border-Variant)',
  /** Axis and category labels — secondary information. */
  quietLabel: 'var(--Quiet)',
  /** Value labels and anything the reader is meant to take away. */
  label: 'var(--Text)',
  /** The far end of a line chart's area gradient; it fades to transparent. */
  gradient: 'var(--Icons-Primary-Variant)',
};

/**
 * Label type. SVG <text> cannot host a lib Typography component, so the chart
 * reads the same tokens Typography would rather than picking sizes by hand —
 * a brand that re-picks its body face moves its chart labels with it.
 */
/**
 * The icon palettes a pie's wedges cycle through.
 *
 * Brand accents lead, because a category has no inherent meaning and should
 * not borrow one — a green wedge next to a red one reads as pass/fail whether
 * or not that is what the data says. The state colours are still available for
 * charts with more categories than accents, and a caller can pass its own
 * subset (or reorder it) via the `colors` prop when the categories DO carry
 * semantics: `colors={['Success', 'Warning', 'Error']}`.
 *
 * Every entry has a matching --Icons-On-<name> at 4.5:1, so a wedge label can
 * sit on its own fill without anyone checking contrast by hand.
 */
export const CHART_PALETTES = [
  'Primary', 'Secondary', 'Tertiary', 'Neutral',
  'Info', 'Success', 'Warning', 'Error',
];

/** Fill and matching label colour for one wedge. */
export const paletteTokens = (name) => ({
  fill: `var(--Icons-${name})`,
  onFill: `var(--Icons-On-${name})`,
});

export const CHART_LABEL_TYPE = {
  fontFamily: 'var(--Label-Small-Font-Family)',
  fontSize: 'var(--Label-Small-Font-Size)',
  fontWeight: 'var(--Label-Small-Font-Weight)',
  letterSpacing: 'var(--Label-Small-Letter-Spacing)',
};
