// src/components/CurvedText/CurvedText.js
import React from 'react';
import { resolveBevelConfig, textFallbackColor } from '../_bevelPresets';

/**
 * CurvedText
 *
 * Renders text along an SVG path made of one or more arcs. Letters follow
 * the path tangent (so each glyph naturally rotates with the curve) and the
 * whole text block can be rotated as a unit via the `rotation` prop.
 *
 * Pass a single `arc`/`radius`/`direction` for one curve, or a `curves`
 * array of those triples for a multi-arc wave.
 *
 * Props:
 *   text          — string to render
 *   curves        — [{ arc: deg, radius: px, direction: 'up'|'down' }]
 *                   If omitted, falls back to a single curve.
 *   arc           — single-curve shortcut (default 160)
 *   radius        — single-curve shortcut (default 300)
 *   direction     — single-curve shortcut: 'up' | 'down' (default 'up')
 *   rotation      — degrees, rotate the whole text block around its center
 *                   (default 0)
 *   textStyle     — 'display-large' | 'display-small' — picks the lib's
 *                   Typography token set (font-family / size / weight /
 *                   letter-spacing). Default 'display-large'.
 *   fontSize      — px override (number); falls back to the textStyle token
 *   fontFamily    — CSS string override
 *   fontWeight    — number or CSS string override
 *   letterSpacing — px override (number); 'normal'/null = use the token
 *   color         — CSS color (default `var(--Text)`)
 *   bevel         — boolean: simple 3-stack bevel using bevelTheme tokens
 *   bevelTheme    — 'Default' | 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral'
 *   bevelPreset   — preset name from BEVEL_PRESETS (or 'custom'). When set,
 *                   overrides `bevel` and tunes the stack offsets to the
 *                   preset's depth. Stacked rendering can't faithfully
 *                   reproduce angle / softness / drop-shadow on textPath, so
 *                   those preset fields are ignored here; presets with
 *                   bevel:false (e.g. "Shadow Only") render nothing.
 *   bevelCustom   — overrides for preset='custom' (see _bevelPresets.js)
 *   className, style, ...rest — forwarded to the <svg>
 */
const TEXT_STYLE_MAP = {
  'display-large': {
    fontFamily: 'var(--Header-Font-Family)',
    fontSize: 'var(--Display-Large-Font-Size)',
    fontWeight: 'var(--Display-Large-Font-Weight)',
    letterSpacing: 'var(--Display-Large-Letter-Spacing)',
    pxHint: 64,
  },
  'display-small': {
    fontFamily: 'var(--Header-Font-Family)',
    fontSize: 'var(--Display-Small-Font-Size)',
    fontWeight: 'var(--Display-Small-Font-Weight)',
    letterSpacing: 'var(--Display-Small-Letter-Spacing)',
    pxHint: 48,
  },
};

export function CurvedText({
  text = 'Your Brand. Perfected.',
  curves,
  arc = 160,
  radius = 300,
  direction = 'up',
  rotation = 0,
  autoCrop = true,
  textStyle = 'display-large',
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  color = 'var(--Text, #1a1a1a)',
  bevel = false,
  bevelTheme = 'Primary',
  bevelPreset,
  bevelCustom,
  className,
  style,
  ...rest
}) {
  // If bevelPreset is provided, it takes precedence over the boolean `bevel`
  // prop. Presets with bevel:false (Shadow Only) render no bevel at all.
  const bevelCfg = bevelPreset ? resolveBevelConfig(bevelPreset, bevelCustom) : null;
  const bevelEnabled = bevelCfg ? !!bevelCfg.bevel : !!bevel;
  const preset = TEXT_STYLE_MAP[textStyle] || TEXT_STYLE_MAP['display-large'];
  const effectiveFontFamily = fontFamily ?? preset.fontFamily;
  const effectiveFontSize = fontSize ?? preset.fontSize;
  const effectiveFontWeight = fontWeight ?? preset.fontWeight;
  const effectiveLetterSpacing = letterSpacing ?? preset.letterSpacing;
  const sizeForLayout = typeof fontSize === 'number' ? fontSize : preset.pxHint;

  const arcList = (curves && curves.length > 0) ? curves : [{ arc, radius, direction }];
  const { d, width, upMax, downMax, pathId } = useMemoizedPath(arcList);

  // Pad so glyphs (which extend ~fontSize perpendicular to the path) aren't
  // clipped on either side of the wave.
  const padTop = Math.ceil(upMax + sizeForLayout);
  const padBottom = Math.ceil(downMax + sizeForLayout);
  const padX = Math.ceil(sizeForLayout);
  const viewW = Math.ceil(width + padX * 2);
  const viewH = padTop + padBottom;
  const translateX = padX;
  const translateY = padTop;

  // Rotate the whole text block around the SVG viewport center.
  const rotateTransform = rotation
    ? 'rotate(' + rotation + ' ' + viewW / 2 + ' ' + viewH / 2 + ')'
    : undefined;

  // ── auto-crop ────────────────────────────────────────────────────────
  // After paint, measure the text's local bounding box, apply the rotation
  // transform manually to its four corners, and tighten the viewBox + SVG
  // intrinsic dimensions to fit. Each later render measures again but bails
  // out if the rectangle hasn't moved significantly — keeps it stable.
  const svgRef = React.useRef(null);
  const [cropBox, setCropBox] = React.useState(null);
  // The bevel highlight/lowlight tones meet 3:1 contrast (WCAG large-text
  // minimum), not 4.5:1 normal-text. When the rendered glyph height drops
  // below 19px we hide the bevel layers so small text stays legible.
  const [renderedPx, setRenderedPx] = React.useState(sizeForLayout);
  React.useEffect(() => {
    if (!svgRef.current || typeof ResizeObserver === 'undefined') return;
    const el = svgRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const baseViewW = cropBox ? cropBox.width : viewW;
      if (!baseViewW || !rect.width) return;
      const ratio = rect.width / baseViewW;
      setRenderedPx(sizeForLayout * ratio);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewW, sizeForLayout, cropBox]);
  const bevelVisible = bevelEnabled && renderedPx >= 19;
  React.useLayoutEffect(() => {
    if (!autoCrop) {
      setCropBox(null);
      return;
    }
    const svg = svgRef.current;
    if (!svg) return;
    const textEl = svg.querySelector('text');
    if (!textEl) return;
    let bbox;
    try {
      bbox = textEl.getBBox();
    } catch (e) {
      return;
    }
    if (!bbox || !bbox.width || !bbox.height) return;

    const cx = viewW / 2;
    const cy = viewH / 2;
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotate = (x, y) => {
      const dx = x - cx;
      const dy = y - cy;
      return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
    };
    const pts = [
      rotate(bbox.x, bbox.y),
      rotate(bbox.x + bbox.width, bbox.y),
      rotate(bbox.x, bbox.y + bbox.height),
      rotate(bbox.x + bbox.width, bbox.y + bbox.height),
    ];
    const minX = Math.min(...pts.map((p) => p.x));
    const maxX = Math.max(...pts.map((p) => p.x));
    const minY = Math.min(...pts.map((p) => p.y));
    const maxY = Math.max(...pts.map((p) => p.y));
    const pad = sizeForLayout * 0.12;
    const next = {
      x: minX - pad,
      y: minY - pad,
      width: maxX - minX + 2 * pad,
      height: maxY - minY + 2 * pad,
    };
    setCropBox((prev) => {
      if (
        prev &&
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.y - next.y) < 0.5 &&
        Math.abs(prev.width - next.width) < 0.5 &&
        Math.abs(prev.height - next.height) < 0.5
      ) {
        return prev;
      }
      return next;
    });
  }, [autoCrop, text, JSON.stringify(arcList), rotation, sizeForLayout, effectiveLetterSpacing, effectiveFontFamily, effectiveFontWeight, bevelEnabled, bevelTheme, bevelPreset, JSON.stringify(bevelCustom)]);

  const effectiveViewBox = cropBox
    ? cropBox.x + ' ' + cropBox.y + ' ' + cropBox.width + ' ' + cropBox.height
    : '0 0 ' + viewW + ' ' + viewH;
  const effectiveW = cropBox ? cropBox.width : viewW;
  const effectiveH = cropBox ? cropBox.height : viewH;

  return (
    <svg
      ref={svgRef}
      viewBox={effectiveViewBox}
      width={effectiveW}
      height={effectiveH}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        // Intrinsic size = the natural content size (no horizontal padding
        // beyond the glyph allowance). `max-width: 100%` lets it scale down
        // when the parent is narrower, and `height: auto` keeps the aspect
        // ratio so it never gets squished.
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        overflow: 'visible',
        ...style,
      }}
      aria-label={text}
      role="img"
      className={['dino-curved-text', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <defs>
        <path id={pathId} d={d} transform={'translate(' + translateX + ' ' + translateY + ')'} />
      </defs>
      <g transform={rotateTransform}>
        {bevelVisible && (() => {
          // Bevel offsets scale with the font size hint so a Display Small
          // gets thinner highlight/lowlight stripes than a Display Large.
          // When a preset is in play, scale the BevelText.html depth value
          // (calibrated at 96px) down to the actual layout size.
          const depthRatio = bevelCfg ? bevelCfg.depth / 96 : 0.045;
          const lowOffset = Math.max(2, Math.round(sizeForLayout * depthRatio));
          const hiOffset = Math.max(1, Math.round(sizeForLayout * depthRatio * 0.67));
          const baseStyle = {
            fontFamily: effectiveFontFamily,
            fontSize: typeof effectiveFontSize === 'number' ? effectiveFontSize + 'px' : effectiveFontSize,
            fontWeight: effectiveFontWeight,
            letterSpacing: typeof effectiveLetterSpacing === 'number' ? effectiveLetterSpacing + 'px' : effectiveLetterSpacing,
          };
          return (
            <>
              {/* Lowlight — painted first (lowest layer), shifted down */}
              <text
                className="dino-bevel-layer dino-bevel-layer--lowlight"
                fill={'rgb(var(--Buttons-' + bevelTheme + '-Lowlight))'}
                transform={'translate(0 ' + lowOffset + ')'}
                style={baseStyle}
              >
                <textPath href={'#' + pathId} startOffset="50%" textAnchor="middle">
                  {text}
                </textPath>
              </text>
              {/* Highlight — middle layer, shifted up */}
              <text
                className="dino-bevel-layer dino-bevel-layer--highlight"
                fill={'rgb(var(--Buttons-' + bevelTheme + '-Highlight))'}
                transform={'translate(0 -' + hiOffset + ')'}
                style={baseStyle}
              >
                <textPath href={'#' + pathId} startOffset="50%" textAnchor="middle">
                  {text}
                </textPath>
              </text>
            </>
          );
        })()}
        <text
          className="dino-curved-text__base"
          fill={
            bevelVisible
              // Large-enough text with bevel: button-body fill on top.
              ? 'var(--Buttons-' + bevelTheme + '-Button)'
              : (bevelEnabled
                  // Bevel was requested but text dropped below 19px — switch
                  // to the theme's body-text token so we hit 4.5:1 contrast.
                  ? textFallbackColor(bevelTheme)
                  // No bevel at all — honor the explicit color prop.
                  : color)
          }
          style={{
            fontFamily: effectiveFontFamily,
            fontSize: typeof effectiveFontSize === 'number' ? effectiveFontSize + 'px' : effectiveFontSize,
            fontWeight: effectiveFontWeight,
            letterSpacing: typeof effectiveLetterSpacing === 'number' ? effectiveLetterSpacing + 'px' : effectiveLetterSpacing,
          }}
        >
          <textPath href={'#' + pathId} startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </g>
    </svg>
  );
}

// Builds the composite SVG arc path. The path starts at (0, 0) and chains
// each curve end-to-end with all chord endpoints on the y=0 baseline.
function useMemoizedPath(arcList) {
  return React.useMemo(() => {
    const pathId = 'dino-curved-text-' + Math.random().toString(36).slice(2, 9);
    let x = 0;
    const y = 0;
    let d = 'M ' + x + ' ' + y;
    let upMax = 0;
    let downMax = 0;

    for (const { arc, radius, direction } of arcList) {
      const arcDeg = clamp(arc, 1, 359);
      const r = Math.max(10, radius);
      const arcRad = (arcDeg * Math.PI) / 180;
      const segmentWidth = 2 * r * Math.sin(arcRad / 2);
      const sagitta = r * (1 - Math.cos(arcRad / 2));
      const largeArc = arcDeg > 180 ? 1 : 0;
      // sweep=1 → arc curves above the chord (smile-up)
      // sweep=0 → arc curves below the chord (frown-down)
      const sweep = direction === 'up' ? 1 : 0;
      x += segmentWidth;
      d += ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' ' + sweep + ' ' + x + ' ' + y;
      if (direction === 'up') upMax = Math.max(upMax, sagitta);
      else downMax = Math.max(downMax, sagitta);
    }

    return { d, width: x, upMax, downMax, pathId };
  }, [JSON.stringify(arcList)]);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export default CurvedText;
