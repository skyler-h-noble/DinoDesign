// src/components/Charts/LineChart.js
import React, { useEffect, useId, useState } from 'react';
import { Box } from '@mui/material';
import {
  toNumbers, toLabels, extent, bands, scaleY,
  linePath, smoothPath, areaPath, ticks,
} from './geometry';
import { CHART_TOKENS, CHART_LABEL_TYPE } from './tokens';
import { ChartTable, ChartReadout, ChartHitTargets, useChartHover, CHART_MOTION } from './a11y';

/**
 * LineChart — one series, straight or curved, with an optional area fill.
 *
 * The curve is Catmull-Rom, so it passes THROUGH every data point rather than
 * near it (see geometry.js). `curve="smooth"` is the shape in the reference
 * design; `curve="straight"` is a plain polyline.
 *
 * COLOURS
 *   line      var(--Icons-Primary)
 *   area      var(--Icons-Primary-Variant), fading to transparent at the base
 *   gridlines var(--Border-Variant)
 *   labels    var(--Text) / var(--Quiet)
 *
 * PROPS
 *   data       number[] or { value, label }[]
 *   curve      'smooth' | 'straight'      (default 'smooth')
 *   gradient   fill the area under the line (default true)
 *   fromZero   anchor the value axis at zero (default false — a line encodes
 *              shape, so a floating baseline is honest here in a way it is not
 *              for bars)
 *   showGrid   horizontal gridlines at round values (default false)
 */
export function LineChart({
  data = [],
  curve = 'smooth',
  gradient = true,
  fromZero = false,
  showGrid = false,
  showLabels = false,
  animate = true,
  interactive = true,
  height = 200,
  strokeWidth = 3,
  tension = 0,
  label,
  className = '',
  sx = {},
  ...props
}) {
  // A gradient's id must be unique per instance — two charts on one page with
  // the same id both resolve to whichever appeared first, so the second chart
  // silently borrows the first one's fill.
  const gid = 'lc-' + useId().replace(/:/g, '');
  const values = toNumbers(data);
  const labels = toLabels(data);
  const { active, handlers } = useChartHover(values.length);

  // Draw the line on. `pathLength="1"` normalises the path so the dash offset
  // is a fraction rather than a measured length — no getTotalLength(), which
  // would need a ref, a layout pass, and would return 0 during SSR.
  const [drawn, setDrawn] = useState(!animate);
  useEffect(() => {
    if (!animate) return undefined;
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const width = 320;
  const padTop = 8;
  const padBottom = showLabels ? 22 : 8;
  const plotH = Math.max(0, height - padTop - padBottom);
  const ext = extent(values, { fromZero });
  const xs = bands(values.length, 0, width, { inset: strokeWidth });
  const points = values.map((v, i) => ({ x: xs[i], y: scaleY(v, ext, padTop, plotH) }));
  const d = curve === 'straight' ? linePath(points) : smoothPath(points, { tension });
  const baseY = padTop + plotH;

  return (
    <Box
      component="figure"
      className={'line-chart ' + className}
      sx={{ display: 'block', width: '100%', m: 0, position: 'relative', ...sx }}
      {...props}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%" height={height}
        preserveAspectRatio="none" focusable="false" aria-hidden="true"
      >
        {gradient && (
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_TOKENS.gradient} stopOpacity="1" />
              <stop offset="100%" stopColor={CHART_TOKENS.gradient} stopOpacity="0" />
            </linearGradient>
          </defs>
        )}
        {showGrid && ticks(ext, 4).map((t) => (
          <line
            key={t}
            x1={0} x2={width}
            y1={scaleY(t, ext, padTop, plotH)} y2={scaleY(t, ext, padTop, plotH)}
            stroke={CHART_TOKENS.line} strokeWidth="1"
          />
        ))}
        {gradient && points.length > 1 && (
          <path
            d={areaPath(d, points, baseY)}
            fill={`url(#${gid})`}
            style={{
              opacity: drawn ? 1 : 0,
              transition: `opacity ${CHART_MOTION.grow}`,
            }}
          />
        )}
        {points.length > 1 && (
          <path
            d={d}
            fill="none"
            stroke={CHART_TOKENS.fill}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transition: `stroke-dashoffset ${CHART_MOTION.grow}`,
            }}
          />
        )}
        {/* One point has no line to draw; show it as a dot so the chart is not
            silently blank. */}
        {points.length === 1 && (
          <circle cx={points[0].x} cy={points[0].y} r={strokeWidth} fill={CHART_TOKENS.fill} />
        )}
        {interactive && active >= 0 && (
          <>
            <line
              x1={xs[active]} x2={xs[active]} y1={padTop} y2={baseY}
              stroke={CHART_TOKENS.line} strokeWidth="1"
            />
            <circle
              cx={points[active].x} cy={points[active].y} r={strokeWidth + 1}
              fill={CHART_TOKENS.fill}
              stroke="var(--Background)" strokeWidth="2"
            />
            <ChartReadout
              x={points[active].x} y={points[active].y}
              text={values[active]} width={width} tokens={CHART_TOKENS}
            />
          </>
        )}
        {showLabels && labels.map((l, i) => (
          <text
            key={i} x={xs[i]} y={height - 6}
            textAnchor="middle" fill={CHART_TOKENS.quietLabel} {...CHART_LABEL_TYPE}
          >
            {l}
          </text>
        ))}
      </svg>
      {interactive && (
        <ChartHitTargets
          count={values.length} width={width}
          centres={xs} bandWidth={values.length ? width / values.length : 0}
          labels={labels} values={values} handlers={handlers}
        />
      )}
      <ChartTable
        caption={label || `Line chart, ${values.length} points`}
        labels={labels} values={values}
      />
    </Box>
  );
}

export default LineChart;
