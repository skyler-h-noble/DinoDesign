// src/components/Progress/Progress.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * Progress Component Color Mapping
 * Maps variant names to color variables
 */
const colorVariants = {
  primary: {
    filledColor: 'var(--Buttons-Primary-Button)',
    emptyColor: 'var(--Border-Variant)',
  },
  secondary: {
    filledColor: '#9c27b0',
    emptyColor: 'var(--Border-Variant)',
  },
  tertiary: {
    filledColor: '#ff9800',
    emptyColor: 'var(--Border-Variant)',
  },
  neutral: {
    filledColor: 'var(--Text)',
    emptyColor: 'var(--Border-Variant)',
  },
  success: {
    filledColor: '#4caf50',
    emptyColor: 'var(--Border-Variant)',
  },
  warning: {
    filledColor: '#ff9800',
    emptyColor: 'var(--Border-Variant)',
  },
  error: {
    filledColor: '#f44336',
    emptyColor: 'var(--Border-Variant)',
  },
  info: {
    filledColor: '#2196f3',
    emptyColor: 'var(--Border-Variant)',
  },
};

/* ── Static sheet ───────────────────────────────────────────────────────
   These helpers were MUI's LinearProgress, CircularProgress, Stack, Box and
   Typography with an sx each. They render MUI's markup and class names from
   this sheet now, with MUI's default-theme values (Roboto, its type scale,
   theme.shape.borderRadius 4 — an sx borderRadius of 1 is 4px), so nothing
   moves; only the styling engine is gone.

   Progress's bar rule (`.omni-pg-own .MuiLinearProgress-bar`) weighs what the
   old nested sx rule did, which outweighed MUI's own bar styles — including
   their indeterminate animation, so an indeterminate Progress has always shown
   an empty track. Kept as it was. */
const MUI_FONT = '"Roboto","Helvetica","Arial",sans-serif';
const STRIPES = 'linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.2) 50%, '
  + 'transparent 50%, transparent 75%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.2))';
const stackRules = (k, v) => `.omni-pg-c${k}>:not(style):not(style){margin:0}.omni-pg-c${k}>:not(style)~:not(style){margin-top:${v}}`
  + `.omni-pg-r${k}>:not(style):not(style){margin:0}.omni-pg-r${k}>:not(style)~:not(style){margin-left:${v}}`;
registerStaticStyles('omni-progress', [
  /* MUI LinearProgress */
  '.omni-pg{position:relative;overflow:hidden;display:block;z-index:0;height:var(--_pg-h);border-radius:var(--_pg-r);'
    + 'background-color:var(--Border-Variant);transition:all 0.3s ease-in-out}',
  '.omni-pg-still{transition:none}',
  '@media print{.omni-pg{-webkit-print-color-adjust:exact;print-color-adjust:exact}}',
  '.omni-pg-b{position:absolute;left:0;bottom:0;top:0;transform-origin:left}',
  '.omni-pg-b1d{width:100%;background-color:#1976d2;transition:transform .4s linear}',
  '.omni-pg-b1i,.omni-pg-b2i{transition:transform .2s linear;width:auto}',
  '.omni-pg-b1i{background-color:#1976d2;animation:omni-pg-indeterminate1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite}',
  '.omni-pg-b2i{--LinearProgressBar2-barColor:#1976d2;background-color:var(--LinearProgressBar2-barColor, currentColor);'
    + 'animation:omni-pg-indeterminate2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite}',
  '@keyframes omni-pg-indeterminate1{0%{left:-35%;right:100%}60%{left:100%;right:-90%}100%{left:100%;right:-90%}}',
  '@keyframes omni-pg-indeterminate2{0%{left:-200%;right:100%}60%{left:107%;right:-8%}100%{left:107%;right:-8%}}',
  '.omni-pg-own .MuiLinearProgress-bar{background-color:var(--_pg-fill);border-radius:var(--_pg-r);'
    + 'background-image:var(--_pg-img);background-size:var(--_pg-bgs);animation:var(--_pg-anim)}',
  '@keyframes progress-stripes{0%{background-position:0 0}100%{background-position:20px 20px}}',
  /* MUI CircularProgress */
  '.omni-pg-cp{display:inline-block;color:var(--_pg-fill)}',
  '.omni-pg-cp-d{transition:transform 300ms cubic-bezier(0.4, 0, 0.2, 1)}',
  '.omni-pg-cp-i{animation:omni-pg-rotate 1.4s linear infinite}',
  '.omni-pg-cp-svg{display:block}',
  '.omni-pg-cp-c{stroke:currentColor}',
  '.omni-pg-cp-cd{transition:stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1)}',
  '.omni-pg-cp-ci{stroke-dasharray:80px, 200px;stroke-dashoffset:0;animation:omni-pg-dash 1.4s ease-in-out infinite}',
  '@keyframes omni-pg-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}',
  '@keyframes omni-pg-dash{0%{stroke-dasharray:1px, 200px;stroke-dashoffset:0}50%{stroke-dasharray:100px, 200px;stroke-dashoffset:-15px}'
    + '100%{stroke-dasharray:1px, 200px;stroke-dashoffset:-126px}}',
  '.omni-pg-cpwrap{position:relative;display:inline-flex}',
  '.omni-pg-cpmid{inset:0;position:absolute;display:flex;align-items:center;justify-content:center;pointer-events:none}',
  /* MUI Typography (default theme) with the helpers' own color / weight */
  `.omni-pg-ty{margin:0;font-family:${MUI_FONT}}`,
  '.omni-pg-cap{font-weight:400;font-size:0.75rem;line-height:1.66;letter-spacing:0.03333em;color:var(--Text-Secondary)}',
  '.omni-pg-cap-text{color:var(--Text);font-weight:600}',
  '.omni-pg-cap-on{color:#fff;font-weight:600}',
  '.omni-pg-cap-b{font-weight:600}',
  '.omni-pg-b2{font-weight:500;font-size:0.875rem;line-height:1.43;letter-spacing:0.01071em;color:var(--Text)}',
  '.omni-pg-s2{margin:0 0 8px;font-weight:600;font-size:0.875rem;line-height:1.57;letter-spacing:0.00714em;color:var(--Text)}',
  '.omni-pg-cap-word{text-transform:capitalize}',
  /* MUI Stack */
  '.omni-pg-st{display:flex;flex-direction:column}',
  '.omni-pg-row{flex-direction:row}',
  stackRules('h', '4px'), stackRules('1', '8px'), stackRules('2', '16px'), stackRules('3', '24px'),
  /* Boxes */
  '.omni-pg-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}',
  '.omni-pg-between{justify-content:space-between}',
  '.omni-pg-step{flex:1;padding:8px;background-color:var(--_pg-tile);border-radius:4px;text-align:center;transition:all 0.3s ease-in-out}',
  '.omni-pg-buf{position:relative;height:8px;border-radius:16px;overflow:hidden}',
  '.omni-pg-buf-bg{position:absolute;top:0;left:0;right:0;bottom:0;background-color:var(--Border-Variant)}',
  '.omni-pg-buf-l{position:absolute;top:0;left:0;height:100%;width:var(--_pg-w);background-color:var(--_pg-fill);transition:width 0.3s ease-in-out}',
  '.omni-pg-buf-dim{opacity:0.3}',
  '.omni-pg-mt1{margin-top:8px}',
  '.omni-pg-mt2{margin-top:16px}',
  '.omni-pg-wrap{flex-wrap:wrap}',
  '.omni-pg-segs{height:8px;border-radius:16px;overflow:hidden}',
  '.omni-pg-seg{background-color:var(--_pg-fill);transition:all 0.3s ease-in-out}',
  '.omni-pg-key{display:flex;align-items:center;gap:8px}',
  '.omni-pg-sw{width:12px;height:12px;border-radius:2px;background-color:var(--_pg-fill)}',
].join('\n'));

const SxBox = lazySxBox('Progress');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const join = (...c) => c.filter(Boolean).join(' ');
/** A helper's root: its static classes, plus the caller's sx when there is one. */
function Root({ sx, className, children, ...props }) {
  useStaticStyles('omni-progress');
  if (hasSx(sx)) return <SxBox sx={sx} className={className} {...props}>{children}</SxBox>;
  return <div className={className} {...props}>{children}</div>;
}

/**
 * LinearProgress Component
 * Horizontal progress bar with color variants
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} variant - Color variant: primary, secondary, tertiary, neutral, success, warning, error, info
 * @param {string} size - Bar size: small, medium, large
 * @param {boolean} indeterminate - Indeterminate progress
 * @param {boolean} striped - Add striped pattern
 * @param {boolean} animated - Animate progress
 * @param {object} props - Additional props
 */
export function Progress({
  value = 0,
  variant = 'primary',
  size = 'medium',
  indeterminate = false,
  striped = false,
  animated = true,
  sx = {},
  className,
  style,
  ...props
}) {
  useStaticStyles('omni-progress');
  const colors = colorVariants[variant] || colorVariants.primary;

  const sizeMap = {
    small: 4,
    medium: 8,
    large: 12,
  };

  const height = sizeMap[size];
  /* A caller's sx key for the bar REPLACED the bar's own rule (it was one sx
     object), so with one the bar keeps only MUI's defaults and the caller's. */
  const ownBar = !(sx && typeof sx === 'object' && !Array.isArray(sx) && '& .MuiLinearProgress-bar' in sx);
  const vars = {
    ...(height !== undefined && { '--_pg-h': height + 'px', '--_pg-r': (height / 2) * 4 + 'px' }),
    '--_pg-fill': colors.filledColor,
    '--_pg-img': striped ? STRIPES : 'none',
    '--_pg-bgs': striped ? '20px 20px' : 'auto',
    '--_pg-anim': striped && animated ? 'progress-stripes 1s linear infinite' : 'none',
  };
  const det = !indeterminate;
  const rootProps = {
    className: join('MuiLinearProgress-root MuiLinearProgress-colorPrimary MuiLinearProgress-' + (det ? 'determinate' : 'indeterminate'),
      className, 'omni-pg', !animated && 'omni-pg-still', ownBar && 'omni-pg-own'),
    role: 'progressbar',
    ...(det ? { 'aria-valuenow': Math.round(value), 'aria-valuemin': 0, 'aria-valuemax': 100 } : {}),
    ...props,
    style: { ...vars, ...style },
  };
  const bars = det ? (
    <span className="MuiLinearProgress-bar MuiLinearProgress-bar1 MuiLinearProgress-barColorPrimary MuiLinearProgress-bar1Determinate omni-pg-b omni-pg-b1d"
      style={{ transform: `translateX(${value - 100}%)` }} />
  ) : (
    <>
      <span className="MuiLinearProgress-bar MuiLinearProgress-bar1 MuiLinearProgress-barColorPrimary MuiLinearProgress-bar1Indeterminate omni-pg-b omni-pg-b1i" />
      <span className="MuiLinearProgress-bar MuiLinearProgress-bar2 MuiLinearProgress-barColorPrimary MuiLinearProgress-bar2Indeterminate omni-pg-b omni-pg-b2i" />
    </>
  );
  if (hasSx(sx)) return <SxBox component="span" sx={sx} {...rootProps}>{bars}</SxBox>;
  return <span {...rootProps}>{bars}</span>;
}

/**
 * CircularProgress Component
 * Circular progress indicator with color variants
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} variant - Color variant
 * @param {number} size - Diameter in pixels
 * @param {number} thickness - Stroke thickness
 * @param {boolean} indeterminate - Indeterminate progress
 * @param {object} props - Additional props
 */
export function CircularProgressComponent({
  value = 0,
  variant = 'primary',
  size = 40,
  thickness = 3.6,
  indeterminate = false,
  sx = {},
  className,
  style,
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;
  const det = !indeterminate;
  /* MUI's CircularProgress: a 44-unit viewBox, the ring's dash drawn from the
     value; the arc is the variant's fill color. */
  const SIZE = 44;
  const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
  const circleStyle = det
    ? { strokeDasharray: circumference.toFixed(3), strokeDashoffset: `${((100 - value) / 100 * circumference).toFixed(3)}px` }
    : {};

  return (
    <Root sx={sx} className="MuiBox-root omni-pg-cpwrap">
      <span
        className={join('MuiCircularProgress-root MuiCircularProgress-' + (det ? 'determinate' : 'indeterminate') + ' MuiCircularProgress-colorPrimary',
          className, 'omni-pg-cp', det ? 'omni-pg-cp-d' : 'omni-pg-cp-i')}
        role="progressbar"
        {...(det ? { 'aria-valuenow': Math.round(value) } : {})}
        {...props}
        style={{ width: size, height: size, ...(det && { transform: 'rotate(-90deg)' }), '--_pg-fill': colors.filledColor, ...style }}
      >
        <svg className="MuiCircularProgress-svg omni-pg-cp-svg" viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
          <circle className={'MuiCircularProgress-circle MuiCircularProgress-circle' + (det ? 'Determinate' : 'Indeterminate') + ' omni-pg-cp-c ' + (det ? 'omni-pg-cp-cd' : 'omni-pg-cp-ci')}
            style={circleStyle} cx={SIZE} cy={SIZE} r={(SIZE - thickness) / 2} fill="none" strokeWidth={thickness} />
        </svg>
      </span>
      {!indeterminate && (
        <div className="MuiBox-root omni-pg-cpmid">
          <div className="MuiTypography-root MuiTypography-caption omni-pg-ty omni-pg-cap omni-pg-cap-text">
            {`${Math.round(value)}%`}
          </div>
        </div>
      )}
    </Root>
  );
}

/**
 * ProgressWithLabel Component
 * Linear progress with percentage label
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} label - Progress label text
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function ProgressWithLabel({
  value = 0,
  label,
  variant = 'primary',
  sx = {},
  className,
  ...props
}) {
  return (
    <Root sx={sx} className={join(className, 'MuiBox-root')} {...props}>
      <div className="MuiBox-root omni-pg-head">
        {label && (
          <p className="MuiTypography-root MuiTypography-body2 omni-pg-ty omni-pg-b2">
            {label}
          </p>
        )}
        <span className="MuiTypography-root MuiTypography-caption omni-pg-ty omni-pg-cap">
          {value}%
        </span>
      </div>
      <Progress
        value={value}
        variant={variant}
        size="medium"
      />
    </Root>
  );
}

/**
 * StepProgress Component
 * Progress showing specific steps/milestones
 * 
 * @param {Array} steps - Array of step objects with label and completed
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function StepProgress({
  steps = [],
  variant = 'primary',
  sx = {},
  className,
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;
  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Root sx={sx} className={join(className, 'MuiBox-root')} {...props}>
      <div className="MuiStack-root omni-pg-st omni-pg-c2">
        <Progress
          value={percentage}
          variant={variant}
          size="medium"
        />
        <div className="MuiStack-root omni-pg-st omni-pg-row omni-pg-r1 omni-pg-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className="MuiBox-root omni-pg-step"
              style={{ '--_pg-tile': step.completed ? colors.filledColor : colors.emptyColor }}
            >
              <span className={'MuiTypography-root MuiTypography-caption omni-pg-ty omni-pg-cap ' + (step.completed ? 'omni-pg-cap-on' : 'omni-pg-cap-b')}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Root>
  );
}

/**
 * BufferedProgress Component
 * Shows both buffered and progress values
 * 
 * @param {number} value - Actual progress value
 * @param {number} buffer - Buffered value
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function BufferedProgress({
  value = 0,
  buffer = 0,
  variant = 'primary',
  sx = {},
  className,
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;

  return (
    <Root sx={sx} className={join(className, 'MuiBox-root')} {...props}>
      <div className="MuiBox-root omni-pg-buf" style={{ '--_pg-fill': colors.filledColor }}>
        {/* Background (empty) */}
        <div className="MuiBox-root omni-pg-buf-bg" />
        {/* Buffer layer */}
        <div className="MuiBox-root omni-pg-buf-l omni-pg-buf-dim" style={{ '--_pg-w': `${buffer}%` }} />
        {/* Actual progress */}
        <div className="MuiBox-root omni-pg-buf-l" style={{ '--_pg-w': `${value}%` }} />
      </div>
      <div className="MuiStack-root omni-pg-st omni-pg-row omni-pg-r1 omni-pg-mt1 omni-pg-between">
        <span className="MuiTypography-root MuiTypography-caption omni-pg-ty omni-pg-cap">
          Progress: {value}%
        </span>
        <span className="MuiTypography-root MuiTypography-caption omni-pg-ty omni-pg-cap">
          Buffered: {buffer}%
        </span>
      </div>
    </Root>
  );
}

/**
 * SegmentedProgress Component
 * Progress divided into segments
 * 
 * @param {Array} segments - Array with value and label
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function SegmentedProgress({
  segments = [],
  variant = 'primary',
  sx = {},
  className,
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  void total;

  return (
    <Root sx={sx} className={join(className, 'MuiBox-root')} {...props}>
      <div className="MuiStack-root omni-pg-st omni-pg-row omni-pg-rh omni-pg-segs">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="MuiBox-root omni-pg-seg"
            style={{ flex: segment.value, '--_pg-fill': segment.color || colors.filledColor }}
          />
        ))}
      </div>
      <div className="MuiStack-root omni-pg-st omni-pg-row omni-pg-r2 omni-pg-mt2 omni-pg-wrap">
        {segments.map((segment, index) => (
          <div key={index} className="MuiBox-root omni-pg-key">
            <div className="MuiBox-root omni-pg-sw" style={{ '--_pg-fill': segment.color || colors.filledColor }} />
            <span className="MuiTypography-root MuiTypography-caption omni-pg-ty omni-pg-cap">
              {segment.label}: {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </Root>
  );
}

/**
 * AllVariantsProgress Component
 * Showcase of all color variants
 * 
 * @param {number} value - Progress value
 * @param {object} props - Additional props
 */
export function AllVariantsProgress({
  value = 65,
  sx = {},
  className,
  ...props
}) {
  const variants = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];

  return (
    <Root sx={sx} className={join('MuiStack-root', className, 'omni-pg-st omni-pg-c3')} {...props}>
      {variants.map(variant => (
        <div key={variant} className="MuiBox-root">
          <h6 className="MuiTypography-root MuiTypography-subtitle2 omni-pg-ty omni-pg-s2 omni-pg-cap-word">
            {variant}
          </h6>
          <Progress value={value} variant={variant} size="medium" />
        </div>
      ))}
    </Root>
  );
}

/**
 * ProgressWithStates Component
 * Progress showing different states
 * 
 * @param {object} props - Additional props
 */
export function ProgressWithStates({
  sx = {},
  className,
  ...props
}) {
  const row = (title, progress) => (
    <div className="MuiBox-root">
      <h6 className="MuiTypography-root MuiTypography-subtitle2 omni-pg-ty omni-pg-s2">
        {title}
      </h6>
      {progress}
    </div>
  );
  return (
    <Root sx={sx} className={join('MuiStack-root', className, 'omni-pg-st omni-pg-c3')} {...props}>
      {row('Determinate (0%)', <Progress value={0} variant="primary" size="medium" />)}
      {row('Progress (50%)', <Progress value={50} variant="primary" size="medium" />)}
      {row('Complete (100%)', <Progress value={100} variant="success" size="medium" />)}
      {row('Indeterminate', <Progress indeterminate variant="primary" size="medium" />)}
      {row('Striped', <Progress value={70} variant="warning" striped size="medium" />)}
    </Root>
  );
}

export default Progress;
