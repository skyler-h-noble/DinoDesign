// src/components/BevelText/BevelText.js
import React from 'react';
import {
  bevelColor,
  resolveBevelConfig,
  angleToOffset,
  textFallbackColor,
} from '../_bevelPresets';

/**
 * BevelText
 *
 * Straight-line text rendered with an SVG inset-bevel filter + optional drop
 * shadow. Colors are locked to --Buttons-{Theme}-{Button|Highlight|Lowlight}
 * so the same preset reads correctly under any theme.
 *
 * Props:
 *   text           — string to render
 *   theme          — 'Default' | 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral'
 *   preset         — preset name from BEVEL_PRESETS, or 'custom'
 *   custom         — { angle, depth, softness, bevel, shadow, shadowDistance,
 *                      shadowBlur, shadowOpacity }
 *                    Only honored when preset === 'custom'. Starts from
 *                    Classic defaults; only override the fields you care about.
 *   textStyle      — 'display-large' | 'display-small' (Typography token preset)
 *   fontSize       — px override (number) or CSS string
 *   fontFamily     — CSS string override
 *   fontWeight     — number / CSS string
 *   letterSpacing  — px (number) or CSS string
 *   className, style, ...rest — forwarded to the <svg>
 */
const TEXT_STYLE_MAP = {
  'display-large': {
    fontFamily: 'var(--Header-Font-Family)',
    fontSize: 'var(--Display-Large-Font-Size)',
    fontWeight: 'var(--Display-Large-Font-Weight)',
    letterSpacing: 'var(--Display-Large-Letter-Spacing)',
    pxHint: 96,
  },
  'display-small': {
    fontFamily: 'var(--Header-Font-Family)',
    fontSize: 'var(--Display-Small-Font-Size)',
    fontWeight: 'var(--Display-Small-Font-Weight)',
    letterSpacing: 'var(--Display-Small-Letter-Spacing)',
    pxHint: 64,
  },
};

export function BevelText({
  text = 'DinoDesign',
  theme = 'Primary',
  preset = 'Classic',
  custom,
  textStyle = 'display-large',
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  className,
  style,
  ...rest
}) {
  const stylePreset = TEXT_STYLE_MAP[textStyle] || TEXT_STYLE_MAP['display-large'];
  const effFontFamily = fontFamily ?? stylePreset.fontFamily;
  const effFontSize = fontSize ?? stylePreset.fontSize;
  const effFontWeight = fontWeight ?? stylePreset.fontWeight;
  const effLetterSpacing = letterSpacing ?? stylePreset.letterSpacing;
  const sizeForLayout = typeof fontSize === 'number' ? fontSize : stylePreset.pxHint;

  const cfg = resolveBevelConfig(preset, custom);

  // Per-instance filter ids so multiple <BevelText> on a page don't collide.
  const reactId = React.useId();
  const bevelFilterId = 'dino-bevel-' + reactId.replace(/:/g, '');
  const shadowFilterId = bevelFilterId + '-s';

  // Measure the SVG's painted width vs its intrinsic viewBox to derive the
  // effective rendered glyph size. When it drops below 19px we drop the
  // bevel + shadow (3:1 contrast minimum is no longer enough) and swap the
  // fill to the theme's body-text token (4.5:1).
  const svgRef = React.useRef(null);
  const [renderedPx, setRenderedPx] = React.useState(sizeForLayout);

  // Layout — rough text bounds based on character count. The filter regions
  // are oversized below so the bevel + drop shadow don't clip.
  const charW = sizeForLayout * 0.60;
  const w = Math.max(400, text.length * charW + 80);
  const h = sizeForLayout * 1.9;
  const cx = w / 2;
  const cy = h * 0.70;

  React.useEffect(() => {
    if (!svgRef.current || typeof ResizeObserver === 'undefined') return;
    const el = svgRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (!w || !rect.width) return;
      setRenderedPx(sizeForLayout * (rect.width / w));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [w, sizeForLayout]);

  // Decorative styling only applies when text is large enough for the 3:1
  // contrast minimum (≥19px rendered). Below that we paint plain body text.
  const decorationsEnabled = renderedPx >= 19;

  // Light direction = opposite of angle (highlight pushes toward the source).
  // Shadow direction = same as angle (shadow falls away from the source).
  const lightDir = cfg.bevel ? angleToOffset(cfg.angle + 180, cfg.depth) : { dx: 0, dy: 0 };
  const shadowDir = cfg.bevel ? angleToOffset(cfg.angle, cfg.depth) : { dx: 0, dy: 0 };
  const dropDir = cfg.shadow ? angleToOffset(cfg.angle, cfg.shadowDistance ?? 6) : { dx: 0, dy: 0 };

  // Use the button-body fill when the bevel is in play AND text is large
  // enough; otherwise fall back to the theme's body-text token (4.5:1).
  const baseColor = decorationsEnabled ? bevelColor(theme, 'base') : textFallbackColor(theme);
  const hiColor = bevelColor(theme, 'highlight');
  const loColor = bevelColor(theme, 'lowlight');

  const textStyleObj = {
    fontFamily: effFontFamily,
    fontSize: typeof effFontSize === 'number' ? effFontSize + 'px' : effFontSize,
    fontWeight: effFontWeight,
    letterSpacing: typeof effLetterSpacing === 'number' ? effLetterSpacing + 'px' : effLetterSpacing,
  };

  const filterAttr = cfg.bevel && decorationsEnabled ? 'url(#' + bevelFilterId + ')' : undefined;
  const shadowAttr = cfg.shadow && decorationsEnabled ? 'url(#' + shadowFilterId + ')' : undefined;

  return (
    <svg
      ref={svgRef}
      viewBox={'0 0 ' + w + ' ' + h}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        overflow: 'visible',
        ...style,
      }}
      aria-label={text}
      role="img"
      className={['dino-bevel-text', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <defs>
        {cfg.shadow && (
          <filter id={shadowFilterId} x="-30%" y="-30%" width="160%" height="160%">
            {/* CSS var() in flood-color must go through `style` so the CSS
                engine resolves it — attribute form doesn't resolve var() in
                every browser. */}
            <feDropShadow
              dx={dropDir.dx.toFixed(2)}
              dy={dropDir.dy.toFixed(2)}
              stdDeviation={cfg.shadowBlur ?? 8}
              style={{ floodColor: loColor, floodOpacity: cfg.shadowOpacity ?? 0.6 }}
            />
          </filter>
        )}
        {cfg.bevel && (
          <filter
            id={bevelFilterId}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceAlpha"
              stdDeviation={(cfg.softness ?? 1) + 0.5}
              result="blur-alpha"
            />
            {/* Lowlight (shadow side) — opposite of light source */}
            <feOffset in="blur-alpha" dx={shadowDir.dx.toFixed(2)} dy={shadowDir.dy.toFixed(2)} result="shadow-offset" />
            <feFlood style={{ floodColor: loColor, floodOpacity: 0.95 }} result="shadow-flood" />
            <feComposite in="shadow-flood" in2="shadow-offset" operator="in" result="shadow-shaped" />
            <feComposite in="shadow-shaped" in2="SourceAlpha" operator="in" result="shadow-clipped" />
            {/* Highlight (light side) */}
            <feOffset in="blur-alpha" dx={lightDir.dx.toFixed(2)} dy={lightDir.dy.toFixed(2)} result="hi-offset" />
            <feFlood style={{ floodColor: hiColor, floodOpacity: 0.95 }} result="hi-flood" />
            <feComposite in="hi-flood" in2="hi-offset" operator="in" result="hi-shaped" />
            <feComposite in="hi-shaped" in2="SourceAlpha" operator="in" result="hi-clipped" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="shadow-clipped" />
              <feMergeNode in="hi-clipped" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Drop shadow sits behind the bevel'd text. We render it as a separate
          text layer so the inset bevel filter doesn't double-process the
          shadow's blur output. Hidden when text drops below the 3:1 size
          threshold (decorationsEnabled). */}
      {cfg.shadow && decorationsEnabled && (
        <text
          className="dino-bevel-layer dino-bevel-layer--shadow"
          x={cx}
          y={cy}
          textAnchor="middle"
          fill={baseColor}
          filter={shadowAttr}
          style={textStyleObj}
          aria-hidden="true"
        >
          {text}
        </text>
      )}

      <text
        className={cfg.bevel ? 'dino-bevel-text__base dino-bevel-layer' : 'dino-bevel-text__base'}
        x={cx}
        y={cy}
        textAnchor="middle"
        fill={baseColor}
        filter={filterAttr}
        style={textStyleObj}
      >
        {text}
      </text>
    </svg>
  );
}

export default BevelText;
