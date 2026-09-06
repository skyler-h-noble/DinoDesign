// src/components/Charts/BarChart.js
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { toNumbers, toLabels, extent, slots, scaleY } from './geometry';
import { CHART_TOKENS, CHART_LABEL_TYPE } from './tokens';
import { ChartTable, ChartReadout, ChartHitTargets, useChartHover, CHART_MOTION } from './a11y';

/**
 * BarChart — single-series bars in a track.
 *
 * COLOURS (all surface-paired, so the chart re-themes with its container):
 *   filled bar   var(--Icons-Primary)
 *   track        var(--Border-Variant)
 *   hover slot   var(--Hover)
 *   labels       var(--Text)  /  var(--Quiet) for categories
 *
 * MOTION  Bars grow from the baseline on mount, over the brand's own
 *   --Motion-Duration-Slow / --Motion-Easing-Enter. Because that is CSS reading
 *   a token, prefers-reduced-motion collapses it to 0s automatically.
 *
 * ACCESS  The SVG is aria-hidden and the data ships as a visually-hidden table,
 *   so a screen reader gets the numbers rather than a picture of them. Bars are
 *   focusable, so the hover readout is reachable from the keyboard.
 */
export function BarChart({
  data = [],
  showTrack = true,
  rounded = true,
  showValues = false,
  showLabels = true,
  animate = true,
  interactive = true,
  height = 200,
  gapRatio = 0.4,
  label,
  className = '',
  sx = {},
  ...props
}) {
  const values = toNumbers(data);
  const labels = toLabels(data);
  const { active, handlers } = useChartHover(values.length);

  // Grow on mount. Starting at `!animate` means a non-animated chart is already
  // at its final size on the very first paint rather than flashing from zero.
  const [grown, setGrown] = useState(!animate);
  useEffect(() => {
    if (!animate) return undefined;
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const width = 320;
  const padTop = showValues ? 20 : 8;
  const padBottom = showLabels ? 22 : 8;
  const plotH = Math.max(0, height - padTop - padBottom);
  const ext = extent(values, { fromZero: true });
  const { centres, bandWidth } = slots(values.length, 0, width, { gapRatio });
  const baseY = padTop + plotH;
  const radius = rounded ? bandWidth / 2 : 0;
  const slotW = values.length ? width / values.length : 0;

  return (
    <Box
      component="figure"
      className={'bar-chart ' + className}
      sx={{ display: 'block', width: '100%', m: 0, position: 'relative', ...sx }}
      {...props}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%" height={height}
        preserveAspectRatio="none" focusable="false" aria-hidden="true"
      >
        {interactive && active >= 0 && (
          <rect
            x={centres[active] - slotW / 2} y={0}
            width={slotW} height={height}
            fill="var(--Hover)" rx={6}
          />
        )}
        {values.map((v, i) => {
          const x = centres[i] - bandWidth / 2;
          const y = scaleY(v, ext, padTop, plotH);
          const h = Math.max(0, baseY - y);
          return (
            <g key={i}>
              {showTrack && (
                <rect
                  x={x} y={padTop} width={bandWidth} height={plotH}
                  rx={radius} ry={radius} fill={CHART_TOKENS.track}
                />
              )}
              {/* A zero-height bar is omitted rather than drawn: a rounded rect
                  of height 0 still paints its two end caps, so a value of zero
                  would show up as a visible stub. */}
              {h > 0 && (
                <rect
                  x={x} y={y} width={bandWidth} height={h}
                  rx={Math.min(radius, h / 2)} ry={Math.min(radius, h / 2)}
                  fill={CHART_TOKENS.fill}
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'bottom',
                    transform: grown ? 'scaleY(1)' : 'scaleY(0)',
                    transition: `transform ${CHART_MOTION.grow}`,
                  }}
                />
              )}
            </g>
          );
        })}
        {showValues && values.map((v, i) => (
          <text
            key={'v' + i}
            x={centres[i]} y={scaleY(v, ext, padTop, plotH) - 6}
            textAnchor="middle" fill={CHART_TOKENS.label} {...CHART_LABEL_TYPE}
          >
            {v}
          </text>
        ))}
        {showLabels && labels.map((l, i) => (
          <text
            key={'l' + i} x={centres[i]} y={height - 6}
            textAnchor="middle" fill={CHART_TOKENS.quietLabel} {...CHART_LABEL_TYPE}
          >
            {l}
          </text>
        ))}
        {interactive && active >= 0 && !showValues && (
          <ChartReadout
            x={centres[active]}
            y={scaleY(values[active], ext, padTop, plotH)}
            text={values[active]} width={width} tokens={CHART_TOKENS}
          />
        )}
      </svg>
      {interactive && (
        <ChartHitTargets
          count={values.length} width={width}
          centres={centres} bandWidth={slotW}
          labels={labels} values={values} handlers={handlers}
        />
      )}
      <ChartTable
        caption={label || `Bar chart, ${values.length} values`}
        labels={labels} values={values}
      />
    </Box>
  );
}

export default BarChart;
