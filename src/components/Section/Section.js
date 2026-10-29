// src/components/Section/Section.js
import React from 'react';
import { keyframes } from '@mui/system';
import { Box } from '@mui/material';
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
/* Stretched edges cannot slide, so they breathe: the edge grows from its
   baseline and settles back. scaleY keeps the shape and only changes how far
   it reaches. */
const swell = (flip) => keyframes`from { transform: scaleY(${flip ? -0.7 : 0.7}); } to { transform: scaleY(${flip ? -1 : 1}); }`;

const drift = (tile) => keyframes`from { -webkit-mask-position: 0 0; mask-position: 0 0; } to { -webkit-mask-position: ${tile}px 0; mask-position: ${tile}px 0; }`;

const warned = new Set();

/** The section's own color, shaped, reaching into its neighbour. */
function SectionEdge({ name, side, height, animate, seed }) {
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
  return (
    <Box
      aria-hidden="true"
      className={'section-edge section-edge-' + side + ' section-edge-' + name}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        height,
        ...(side === 'top' ? { bottom: '100%' } : { top: '100%', transform: 'scaleY(-1)' }),
        /* The section's own --Background: the edge is the section, so it can
           never disagree with it. */
        backgroundColor: 'var(--Background)',
        WebkitMask: mask,
        mask,
        pointerEvents: 'none',
        zIndex: 1,
        ...(animate && {
          '@media (prefers-reduced-motion: no-preference)': tile
            ? { animation: drift(tile) + ' ' + Math.round(tile / 12) + 's linear infinite' }
            : {
                /* From the baseline, so it grows out of the section rather
                   than floating. */
                transformOrigin: 'bottom',
                animation: swell(side === 'bottom') + ' 5s ease-in-out infinite alternate',
              },
        }),
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
