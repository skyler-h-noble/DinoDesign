// src/components/Charts/a11y.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * The text equivalent of a chart.
 *
 * A design system's colours can make a chart LEGIBLE — contrast against the
 * surface, a fill that is distinguishable from its track. What no colour can do
 * is make it READABLE to a screen reader: an <svg> full of <path> is a picture,
 * and a picture of a number is not a number.
 *
 * So the SVG is marked aria-hidden and the same data ships as a real table,
 * visually hidden. Screen readers then get rows and columns they can navigate
 * — which beats an aria-label summary, because a summary can only say what the
 * chart is about while a table says what it SAYS.
 *
 * Not `display: none` or `visibility: hidden` — both remove the element from
 * the accessibility tree too, which would hide it from exactly the users it is
 * for. The clip-rect technique keeps it rendered and reachable.
 */
export const VISUALLY_HIDDEN = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

export function ChartTable({ caption, labels, values, valueHeader = 'Value' }) {
  return (
    <Box component="table" sx={VISUALLY_HIDDEN}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">{valueHeader}</th>
        </tr>
      </thead>
      <tbody>
        {values.map((v, i) => (
          <tr key={i}>
            <th scope="row">{labels[i]}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </Box>
  );
}

/**
 * Motion, on the brand's own tokens.
 *
 * These resolve to 0s under prefers-reduced-motion, because the system already
 * redefines --Motion-Duration-* in that mode (see utils/motion.ts). That is the
 * whole reason these animations are CSS rather than JS: a JS-driven tween has
 * to be TOLD about the preference and will happily animate through it.
 */
export const CHART_MOTION = {
  grow: 'var(--Motion-Duration-Slow, 300ms) var(--Motion-Easing-Enter, cubic-bezier(0, 0, 0, 1))',
  hover: 'var(--Motion-Duration-Fast, 150ms) var(--Motion-Easing-Standard, cubic-bezier(0.2, 0, 0, 1))',
};

/**
 * Hover + keyboard state for a set of marks.
 *
 * Keyboard is not an afterthought here: the marks carry tabIndex, so the same
 * readout a mouse gets on hover is what a keyboard gets on focus. A chart whose
 * detail is mouse-only is a chart half its readers cannot interrogate.
 */
export function useChartHover(count) {
  const [active, setActive] = React.useState(-1);
  const handlers = React.useCallback(
    (i) => ({
      onMouseEnter: () => setActive(i),
      onMouseLeave: () => setActive((cur) => (cur === i ? -1 : cur)),
      onFocus: () => setActive(i),
      onBlur: () => setActive((cur) => (cur === i ? -1 : cur)),
    }),
    [],
  );
  React.useEffect(() => {
    // A shrinking dataset must not leave the readout pointing past the end.
    setActive((cur) => (cur >= count ? -1 : cur));
  }, [count]);
  return { active, setActive, handlers };
}

/**
 * Focusable hit targets, as real <button>s OUTSIDE the SVG.
 *
 * They cannot live inside the <svg>, because the SVG is aria-hidden — and a
 * focusable element inside an aria-hidden subtree is invalid ARIA: a keyboard
 * user can land on something a screen reader will not announce. Positioning
 * them as an absolute overlay keeps them in the accessibility tree, gives
 * them real button semantics for free, and means the hover readout is
 * reachable by keyboard as well as pointer.
 *
 * Percentages, not pixels: the SVG scales to its container, so the overlay has
 * to scale with it.
 */
export function ChartHitTargets({ count, width, centres, bandWidth, labels, values, handlers }) {
  if (!count) return null;
  return (
    <Box
      sx={{
        position: 'absolute', inset: 0,
        display: 'block', pointerEvents: 'none',
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Box
          component="button"
          type="button"
          key={i}
          aria-label={`${labels[i]}: ${values[i]}`}
          {...handlers(i)}
          sx={{
            position: 'absolute',
            top: 0, height: '100%',
            left: `${((centres[i] - bandWidth / 2) / width) * 100}%`,
            width: `${(bandWidth / width) * 100}%`,
            padding: 0, margin: 0, border: 0,
            background: 'transparent',
            cursor: 'pointer',
            pointerEvents: 'auto',
            '&:focus-visible': {
              outline: '2px solid var(--Focus-Visible)',
              outlineOffset: '-2px',
              borderRadius: '4px',
            },
          }}
        />
      ))}
    </Box>
  );
}

/** In-SVG readout for the hovered mark — no portal, so nothing can be clipped
 *  by an ancestor's overflow, and nothing needs a popover the lib lacks. */
export function ChartReadout({ x, y, text, width, tokens }) {
  if (text == null) return null;
  const w = Math.max(28, String(text).length * 8 + 14);
  // Clamp horizontally so a readout on the first or last mark does not hang
  // off the edge of the viewBox and get cut.
  const cx = Math.min(Math.max(x, w / 2 + 2), width - w / 2 - 2);
  // And vertically: a tall bar's top sits near y=0, so the default position
  // above it lands OUTSIDE the viewBox and the readout silently disappears —
  // exactly on the largest value, which is the one most worth reading. Flip it
  // below the mark when there is no room above.
  const above = y - 26 >= 2;
  const top = above ? y - 26 : y + 6;
  return (
    <g pointerEvents="none">
      <rect
        x={cx - w / 2} y={top} width={w} height={20} rx={6}
        fill={tokens.fill}
      />
      <text
        x={cx} y={top + 14} textAnchor="middle"
        fill="var(--Icons-On-Primary)"
        style={{
          fontFamily: 'var(--Label-Small-Font-Family)',
          fontSize: 'var(--Label-Small-Font-Size)',
          fontWeight: 'var(--Label-Small-Font-Weight)',
        }}
      >
        {text}
      </text>
    </g>
  );
}
