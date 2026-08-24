// src/components/Section/Section.js
import React from 'react';

/**
 * Section Component
 *
 * The one-liner for painting a region with the design system. Sets
 * `data-theme` + `data-surface` and paints `--Background` / `--Text` so all
 * nested components (text, buttons, cards) automatically pick up the
 * correct tone — no inline `background: var(--Surface)` or hex needed.
 *
 * Use this anywhere you'd otherwise reach for:
 *   <section data-theme=".." data-surface=".."
 *            style={{ background: 'var(--Background)', color: 'var(--Text)' }}>
 *
 * Props:
 *   theme    — OmniDesign theme name (e.g. "Primary-Light", "Neutral-Dark").
 *              Optional: omit to inherit from the parent theme zone.
 *   surface  — "Surface" (default) | "Surface-Dim" | "Surface-Dimmest" |
 *              "Surface-Bright" | "Surface-Brightest" |
 *              "Container" | "Container-Low" | "Container-Lowest" |
 *              "Container-High" | "Container-Highest"
 *
 *              Five surface levels, darkest to lightest. Surface-Brightest is
 *              the level that replaced the <Palette>-Light themes: it lands on
 *              the same tone their Surface used, so `theme="Primary"
 *              surface="Surface-Brightest"` is what `theme="Primary-Light"`
 *              used to be. Passed through unvalidated — an unknown value
 *              simply matches no rule and inherits the parent's paint.
 *   as       — element tag, defaults to "section"
 *   padding  — CSS padding value (string or number). Optional.
 *   className, style, children, ...rest — forwarded.
 *
 * For wrapping without painting (e.g. AppBar's themed zone), use ThemedZone
 * instead.
 */
export function Section({
  theme,
  surface = 'Surface',
  as: Tag = 'section',
  padding,
  className,
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      {...(theme ? { 'data-theme': theme } : {})}
      data-surface={surface}
      className={className}
      style={{
        background: 'var(--Background)',
        color: 'var(--Text)',
        ...(padding !== undefined ? { padding } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Section;
