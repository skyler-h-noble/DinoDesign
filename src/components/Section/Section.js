// src/components/Section/Section.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { EDGE_NAMES, edgeMaskURL, edgeTile, edgeDefaultHeight, EDGE_SIZES, SIZED_EDGES } from './edges';

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
 *   theme    — Default | Primary | Secondary | Tertiary | Neutral | Info |
 *              Success | Warning | Error. (No -Light / -Dark themes — that is
 *              the surface axis.)
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
 *   edgeTop / edgeBottom — the shape where this section meets the one above
 *              / below: wave | random-wave | scallop | zigzag | steps | curve | slant.
 *              The section reaches INTO its neighbour by `edgeHeight`, in its
 *              own color, so the edge needs no colors of its own and follows
 *              any theme and surface. The neighbour's content should leave
 *              that much room.
 *   edgeSize — small | medium | large (16 / 24 / 48) for scallop, zigzag
 *              and steps: smaller bumps, teeth and steps. Default large.
 *   edgeHeight — px, overriding the size. Default 48, and 96 for the wide
 *              gentle edges (random-wave, curve, slant), which need it.
 *   edgeAnimate — the repeating edges (wave, random-wave, scallop, zigzag,
 *              steps) drift slowly sideways; curve and slant, which cannot
 *              slide, swell and settle. Off by default; never runs for someone
 *              who has asked their device to reduce motion.
 *   edgeSeed — a number that varies random-wave, so stacked sections do not
 *              match. Default 0, which is the one Figma draws.
 *   className, style, children, ...rest — forwarded.
 *
 * For wrapping without painting (e.g. AppBar's themed zone), use ThemedZone
 * instead.
 */
/* The edge's static sheet. The per-edge values — height, mask, tile width —
   go inline as custom properties; the keyframes read them, so one drift and
   one swell serve every edge.

   Stretched edges cannot slide, so they breathe: the edge grows from its
   baseline and settles back. scaleY keeps the shape and only changes how far
   it reaches. */
registerStaticStyles('omni-section-edge', [
  /* The section's own --Background: the edge is the section, so it can never
     disagree with it. */
  '.omni-section-edge{position:absolute;left:0;right:0;background-color:var(--Background);pointer-events:none;z-index:1}',
  '.omni-section-edge-top{bottom:100%}',
  '.omni-section-edge-bottom{top:100%;transform:scaleY(-1)}',
  '@keyframes omni-edge-drift{from{-webkit-mask-position:0 0;mask-position:0 0}to{-webkit-mask-position:var(--_edge-tile) 0;mask-position:var(--_edge-tile) 0}}',
  '@keyframes omni-edge-swell{from{transform:scaleY(0.7)}to{transform:scaleY(1)}}',
  '@keyframes omni-edge-swell-flip{from{transform:scaleY(-0.7)}to{transform:scaleY(-1)}}',
  '@media (prefers-reduced-motion: no-preference){'
    + '.omni-section-edge-drift{animation:omni-edge-drift var(--_edge-dur) linear infinite}'
    /* From the baseline, so it grows out of the section rather than floating. */
    + '.omni-section-edge-swell{transform-origin:bottom;animation:omni-edge-swell 5s ease-in-out infinite alternate}'
    + '.omni-section-edge-swell.omni-section-edge-bottom{animation-name:omni-edge-swell-flip}}',
].join('\n'));

const warned = new Set();

/** The section's own color, shaped, reaching into its neighbour. */
function SectionEdge({ name, side, height, animate, seed }) {
  useStaticStyles('omni-section-edge');
  if (!EDGE_NAMES.includes(name)) {
    if (process.env.NODE_ENV !== 'production' && !warned.has(name)) {
      warned.add(name);
      // eslint-disable-next-line no-console
      console.warn('[Section] "' + name + '" is not an edge. Use one of: ' + EDGE_NAMES.join(', ') + '.');
    }
    return null;
  }
  const tile = edgeTile(name, height);
  const url = edgeMaskURL(name, seed);
  const mask = url + (tile ? ' 0 0 / ' + tile + 'px 100% repeat-x' : ' center / 100% 100% no-repeat');
  const motion = animate ? (tile ? ' omni-section-edge-drift' : ' omni-section-edge-swell') : '';
  return (
    <div
      aria-hidden="true"
      className={'section-edge section-edge-' + side + ' section-edge-' + name
        + ' omni-section-edge omni-section-edge-' + side + motion}
      style={{
        height,
        WebkitMask: mask,
        mask,
        ...(tile ? { '--_edge-tile': tile + 'px', '--_edge-dur': Math.round(tile / 12) + 's' } : {}),
      }}
    />
  );
}

export function Section({
  theme,
  surface = 'Surface',
  as: Tag = 'section',
  padding,
  edgeTop,
  edgeBottom,
  edgeHeight,
  edgeSize = 'large',
  edgeAnimate = false,
  edgeSeed = 0,
  className,
  style,
  children,
  ...rest
}) {
  const hasEdge = Boolean(edgeTop || edgeBottom);
  const heightFor = (name) => edgeHeight
    ?? (SIZED_EDGES.includes(name) ? (EDGE_SIZES[edgeSize] || EDGE_SIZES.large) : edgeDefaultHeight(name));
  return (
    <Tag
      {...(theme ? { 'data-theme': theme } : {})}
      data-surface={surface}
      className={className}
      style={{
        background: 'var(--Background)',
        color: 'var(--Text)',
        ...(hasEdge ? { position: 'relative' } : {}),
        ...(padding !== undefined ? { padding } : {}),
        ...style,
      }}
      {...rest}
    >
      {edgeTop && <SectionEdge name={edgeTop} side="top" height={heightFor(edgeTop)} animate={edgeAnimate} seed={edgeSeed} />}
      {children}
      {edgeBottom && <SectionEdge name={edgeBottom} side="bottom" height={heightFor(edgeBottom)} animate={edgeAnimate} seed={edgeSeed} />}
    </Tag>
  );
}

export default Section;
