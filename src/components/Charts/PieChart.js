// src/components/Charts/PieChart.js
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { toNumbers, toLabels, sliceAngles, arcPath } from './geometry';
import { CHART_LABEL_TYPE, CHART_PALETTES, paletteTokens } from './tokens';
import { ChartTable, useChartHover, CHART_MOTION } from './a11y';

/**
 * PieChart — parts of a whole. Pass `donut` for a ring.
 *
 * COLOURING
 *   Wedges cycle the icon palettes — var(--Icons-Primary), -Secondary,
 *   -Tertiary, -Neutral, then the states. Unlike the bar and line charts,
 *   which are single-series and use one accent, a pie's categories have to be
 *   told apart, and hue does that better than anything else.
 *
 *   Each wedge is separated by a stroke in var(--Background) — the SURFACE's
 *   own background, so the gap reads as a gap on any surface, in either mode,
 *   rather than as a grey line that happens to look like a gap on white.
 *
 *   Wedge labels use var(--Icons-On-<palette>), the token generated to clear
 *   4.5:1 against that exact fill, so a label never has to be contrast-checked
 *   by hand.
 *
 * COLOURS
 *   wedges     var(--Icons-{Primary,Secondary,…})
 *   separator  var(--Background)
 *   labels     var(--Icons-On-{…}) inside a wedge, var(--Text) outside
 */
export function PieChart({
  data = [],
  donut = false,
  donutRatio = 0.6,
  colors = CHART_PALETTES,
  separatorWidth = 2,
  size = 200,
  showLabels = false,
  animate = true,
  interactive = true,
  label,
  className = '',
  sx = {},
  ...props
}) {
  const values = toNumbers(data);
  const labels = toLabels(data);
  const { slices, total, dropped } = sliceAngles(values);
  const { active, handlers } = useChartHover(values.length);

  const [grown, setGrown] = useState(!animate);
  useEffect(() => {
    if (!animate) return undefined;
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 1;                    // room for the hairline
  const innerR = donut ? outerR * donutRatio : 0;

  // Cycle the palette. With more slices than palettes the colours repeat —
  // a pie with nine categories is already past the point of being readable,
  // and the hidden table still carries every exact value.
  const paletteFor = (i) => paletteTokens(colors[i % colors.length]);

  return (
    <Box
      component="figure"
      className={'pie-chart ' + className}
      sx={{ display: 'block', m: 0, position: 'relative', ...sx }}
      {...props}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size} height={size}
        focusable="false" aria-hidden="true"
      >
        {slices.map((s, i) => {
          // Nudge the hovered wedge outward along its own mid-angle — the
          // clearest way to single out one wedge without recolouring it, which
          // would break the single-accent scheme.
          const mid = (s.start + s.end) / 2;
          const lift = interactive && active === i ? 4 : 0;
          return (
            <path
              key={i}
              d={arcPath(cx, cy, innerR, outerR, s.start, s.end)}
              fill={paletteFor(i).fill}
              stroke="var(--Background)"
              strokeWidth={separatorWidth}
              strokeLinejoin="round"
              {...(interactive ? handlers(i) : {})}
              style={{
                transform: `translate(${lift * Math.sin(mid)}px, ${-lift * Math.cos(mid)}px) scale(${grown ? 1 : 0})`,
                transformOrigin: `${cx}px ${cy}px`,
                transformBox: 'view-box',
                transition: `transform ${grown ? CHART_MOTION.hover : CHART_MOTION.grow}`,
              }}
            />
          );
        })}
        {showLabels && slices.map((s, i) => {
          const mid = (s.start + s.end) / 2;
          const r = innerR + (outerR - innerR) * 0.62;
          // Below ~7% a wedge is too narrow to hold its own label legibly; the
          // text would overflow into its neighbours.
          if (s.fraction < 0.07) return null;
          return (
            <text
              key={i}
              x={cx + r * Math.sin(mid)}
              y={cy - r * Math.cos(mid)}
              textAnchor="middle" dominantBaseline="middle"
              fill={paletteFor(i).onFill} {...CHART_LABEL_TYPE}
            >
              {labels[i]}
            </text>
          );
        })}
      </svg>
      <ChartTable
        caption={
          (label || `${donut ? 'Donut' : 'Pie'} chart, ${slices.length} segments`) +
          (dropped ? `, ${dropped} non-positive values omitted` : '')
        }
        labels={labels} values={values}
      />
    </Box>
  );
}

export default PieChart;
