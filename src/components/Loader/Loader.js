// src/components/Loader/Loader.js
import React from 'react';
import { Body } from '../Typography';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

const LOADER_COLOR = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
  neutral: 'Neutral', info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

/* The spinner Figma draws (Loader, 5859:1629): a full ring, no track, filled
 * with an ANGULAR gradient that runs from the palette's --Buttons-{C}-Border
 * round to the surface's --Background — a comet whose tail fades into the
 * page. The ring's inner radius is 80% of its outer, so its thickness is a
 * tenth of the diameter. Position 1–4 are quarter turns, clockwise: it spins.
 *
 * It was the lib's CircularProgress, which is a different drawing — a quarter
 * arc over a --Border-Variant track — and is Progress Dial's job, not this.
 *
 * Size is Figma's Component-Size Other/Loader: 24 / 32 / 56. */
export const LOADER_SIZE_MAP = { small: 24, medium: 32, large: 56 };

export function LoaderRing({ size = 'medium', color = 'primary', className = '', sx = {}, style, ...props }) {
  useStaticStyles('omni-loader');
  const d = typeof size === 'number' ? size : (LOADER_SIZE_MAP[size] ?? LOADER_SIZE_MAP.medium);
  const C = LOADER_COLOR[color] || 'Primary';
  const ring = d * 0.1;
  /* Figma's Position 1: the hard edge at 6 o'clock, the border colour there
     fading clockwise round to the Background; the disc cut to the ring by a
     mask, transparent inside 90% of the radius. The sizes and the palette
     arrive as custom properties (see .omni-ld-ring). */
  const ringProps = {
    role: 'progressbar',
    className: 'loader-ring ' + className + ' MuiBox-root omni-ld-ring',
    ...props,
    style: { '--_lr-d': d + 'px', '--_lr-w': ring + 'px', '--_lr-c': 'var(--Buttons-' + C + '-Border)', ...style },
  };
  if (hasSx(sx)) return <SxBox sx={sx} {...ringProps} />;
  return <div {...ringProps} />;
}

/* ─── Loader styles ───────────────────────────────────────────────────────
 * Figma's Loader Styles set (10553:82): Spinner, Orbit, Bounce, Ripple,
 * Dual Ring, Bars — Spinner in one colour, the rest Multicolor or Single.
 *
 *   single  every piece in the palette's --Buttons-{C}-Border (the `color`
 *           prop; Figma: the Buttons mode on the instance)
 *   multi   the brand's Primary / Secondary / Tertiary Border, one per piece
 *
 * Border, not Button: these are the 3:1 tones — a loader is a graphic that
 * has to read on every surface, light and dark (Progress uses them too).
 *
 * Figma steps through four poses with Smart Animate; here the motion is
 * continuous. Reduced motion keeps every loader moving — a still loader reads
 * as frozen — but three times slower.
 *
 * Geometry is drawn at Figma's 32 and scaled: k = size / 32. */
export const LOADER_TYPES = ['spinner', 'orbit', 'bounce', 'ripple', 'dual-ring', 'bars'];
const MULTI = ['var(--Buttons-Primary-Border)', 'var(--Buttons-Secondary-Border)', 'var(--Buttons-Tertiary-Border)'];
/* ── Static sheet ───────────────────────────────────────────────────────
   Every part of every loader as plain classes (they were MUI Boxes, Stacks,
   Typography, Skeleton, Paper and LinearProgress with an sx each), over the
   same tokens. The MUI parts keep MUI's markup, class names and default-theme
   values — Roboto, its type scale, its grey Paper shadow — so the helpers look
   exactly as they did; only the engine is gone. */
const MUI_FONT = '"Roboto","Helvetica","Arial",sans-serif';
registerStaticStyles('omni-loader', [
  /* LoaderRing */
  '.omni-ld-ring{width:var(--_lr-d);height:var(--_lr-d);flex-shrink:0;border-radius:50%;'
    + 'background:conic-gradient(from 180deg, var(--_lr-c), var(--Background));'
    + '-webkit-mask:radial-gradient(farthest-side, transparent calc(100% - var(--_lr-w)), #000 calc(100% - var(--_lr-w)));'
    + 'mask:radial-gradient(farthest-side, transparent calc(100% - var(--_lr-w)), #000 calc(100% - var(--_lr-w)));'
    + 'animation:loader-ring-spin 1s linear infinite}',
  '@keyframes loader-ring-spin{to{transform:rotate(360deg)}}',
  '@media (prefers-reduced-motion: reduce){.omni-ld-ring{animation-duration:3s}}',
  /* The loader styles. Geometry is per piece, inline (k = size / 32). */
  '.omni-ld-g{position:relative;width:var(--_lg-d);height:var(--_lg-d);flex-shrink:0}',
  '.omni-ld-p{position:absolute;box-sizing:border-box}',
  /* A piece's tone arrives as a custom property (--_ld-tone, its palette's
     Border), declared on the piece itself. */
  '.omni-ld-bg{background-color:var(--_ld-tone)}',
  '.omni-ld-bd{border-color:var(--_ld-tone)}',
  '.omni-ld-arc{border-top-color:var(--_ld-tone);border-bottom-color:var(--_ld-tone)}',
  '@keyframes omni-loader-turn{to{transform:rotate(360deg)}}',
  '@keyframes omni-loader-turn-back{to{transform:rotate(-360deg)}}',
  '@keyframes omni-loader-pop{0%,100%{transform:scale(.6)}50%{transform:scale(1)}}',
  '@keyframes omni-loader-hop{0%,60%,100%{transform:translateY(0);animation-timing-function:cubic-bezier(.3, 0, .2, 1)}'
    + '30%{transform:translateY(calc(var(--omni-loader-k) * -9px));animation-timing-function:cubic-bezier(.6, 0, .8, 1)}}',
  /* Grows the ring's box, not its scale: scaling thinned the 2px stroke to a
     hairline on the small rings, which is where the ripple starts. */
  '@keyframes omni-loader-ripple{0%{inset:calc(var(--omni-loader-k) * 13px);opacity:1}70%{opacity:0.6}100%{inset:calc(var(--omni-loader-k) * 1px);opacity:0}}',
  '@keyframes omni-loader-bar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}',
  /* Reduced motion keeps every loader moving — a still loader reads as
     frozen — but three times slower. */
  '@media (prefers-reduced-motion: reduce){.omni-ld-g,.omni-ld-g *{animation-duration:3s !important}}',
  /* MUI Stack: a flex column (or row); `spacing` is a margin on every child
     after the first, which the child's own margin cannot outweigh. */
  '.omni-ld-st{display:flex;flex-direction:column}',
  '.omni-ld-row{flex-direction:row}',
  '.omni-ld-center{align-items:center;justify-content:center}',
  '.omni-ld-between{justify-content:space-between}',
  ...[['1', '8px'], ['2', '16px'], ['v', 'var(--_ld-sp)']].map(([k, v]) => `.omni-ld-sp${k}>:not(style):not(style){margin:0}.omni-ld-sp${k}>:not(style)~:not(style){margin-top:${v}}`),
  '.omni-ld-loader{gap:var(--Sizing-2, 16px);padding-top:32px;padding-bottom:32px}',
  '.omni-ld-py4{padding-top:32px;padding-bottom:32px}',
  /* MUI Typography, default theme */
  `.omni-ld-ty{margin:0;font-family:${MUI_FONT}}`,
  '.omni-ld-body2{font-weight:500;font-size:0.875rem;line-height:1.43;letter-spacing:0.01071em;color:var(--Text)}',
  '.omni-ld-caption{font-weight:400;font-size:0.75rem;line-height:1.66;letter-spacing:0.03333em;color:var(--Text-Secondary)}',
  /* MUI LinearProgress (LinearLoader) */
  '.omni-ld-lp{position:relative;overflow:hidden;display:block;z-index:0;background-color:var(--Border-Variant);height:4px;border-radius:8px}',
  '@media print{.omni-ld-lp{-webkit-print-color-adjust:exact;print-color-adjust:exact}}',
  '.omni-ld-lpb{position:absolute;left:0;bottom:0;top:0;transform-origin:left;background-color:var(--Primary-Color-11)}',
  '.omni-ld-lpb-d{width:100%;transition:transform .4s linear}',
  '.omni-ld-lpb-1,.omni-ld-lpb-2{transition:transform .2s linear;width:auto}',
  '.omni-ld-lpb-1{animation:omni-ld-indeterminate1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite}',
  '.omni-ld-lpb-2{--LinearProgressBar2-barColor:#1976d2;animation:omni-ld-indeterminate2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite}',
  '@keyframes omni-ld-indeterminate1{0%{left:-35%;right:100%}60%{left:100%;right:-90%}100%{left:100%;right:-90%}}',
  '@keyframes omni-ld-indeterminate2{0%{left:-200%;right:100%}60%{left:107%;right:-8%}100%{left:107%;right:-8%}}',
  /* MUI Skeleton (pulse) and Paper (elevation 1) */
  '.omni-ld-sk{display:block;height:1.2em;animation:omni-ld-pulse 2s ease-in-out 0.5s infinite;background-color:var(--Container-Low)}',
  '.omni-ld-sk-r8{border-radius:8px}',
  '.omni-ld-sk-r4{border-radius:4px}',
  '.omni-ld-sk-text{margin-top:0;margin-bottom:0;height:auto;transform-origin:0 55%;transform:scale(1, 0.60);border-radius:4px/6.7px}',
  '.omni-ld-sk-text:empty:before{content:"\\00a0"}',
  '@keyframes omni-ld-pulse{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}',
  '.omni-ld-paper{color:rgba(0, 0, 0, 0.87);transition:box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);border-radius:4px;'
    + '--Paper-shadow:0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12);'
    + 'box-shadow:var(--Paper-shadow);background-image:var(--Paper-overlay);padding:16px;background-color:var(--Container)}',
  /* DotsLoader */
  '.omni-ld-dots{display:flex;gap:8px}',
  '.omni-ld-dot{width:8px;height:8px;border-radius:50%;background-color:var(--Primary-Color-11);animation:pulse 1.4s infinite;animation-delay:var(--_ld-delay)}',
  '@keyframes pulse{0%{opacity:1}50%{opacity:0.5}100%{opacity:1}}',
  /* PageLoader, OverlayLoader */
  '.omni-ld-page{display:flex;align-items:center;justify-content:center;min-height:100vh;background-color:var(--Background)}',
  '.omni-ld-ov{position:relative}',
  '.omni-ld-ov-veil{position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0, 0, 0, 0.3);display:flex;'
    + 'align-items:center;justify-content:center;border-radius:inherit;z-index:1000;backdrop-filter:blur(4px)}',
].join('\n'));

const SxBox = lazySxBox('Loader');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
/** The root of a helper: its static classes, plus the caller's sx when there is one. */
function Root({ sx, className = '', children, ...props }) {
  useStaticStyles('omni-loader');
  if (hasSx(sx)) return <SxBox sx={sx} className={className} {...props}>{children}</SxBox>;
  return <div className={className} {...props}>{children}</div>;
}
const join = (...c) => c.filter(Boolean).join(' ');

function LoaderGraphic({ type, d, color, multicolor, ...rest }) {
  const C = LOADER_COLOR[color] || 'Primary';
  const tone = (i) => (multicolor ? MULTI[i] : 'var(--Buttons-' + C + '-Border)');
  const k = d / 32;
  const px = (n) => n * k + 'px';
  useStaticStyles('omni-loader');
  const rootStyle = { '--_lg-d': d + 'px', '--omni-loader-k': k };
  const P = 'MuiBox-root omni-ld-p';
  const BG = P + ' omni-ld-bg';

  if (type === 'orbit') {
    return (
      <div className="loader-graphic loader-orbit MuiBox-root omni-ld-g" style={rootStyle} {...rest}>
        <div aria-hidden="true" className={P} style={{ inset: 0, animation: 'omni-loader-turn 1.2s linear infinite' }}>
          {[0, 1, 2].map((i) => {
            const a = (-90 + i * 120) * Math.PI / 180;
            return <div key={i} className={BG} style={{ '--_ld-tone': tone(i), width: px(8), height: px(8), borderRadius: '50%',
              left: px(16 + 11 * Math.cos(a) - 4), top: px(16 + 11 * Math.sin(a) - 4),
              animation: 'omni-loader-pop 1.2s ease-in-out ' + (i * -0.4) + 's infinite' }} />;
          })}
        </div>
      </div>
    );
  }
  if (type === 'bounce') {
    return (
      <div className="loader-graphic loader-bounce MuiBox-root omni-ld-g" style={rootStyle} {...rest}>
        {[0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className={BG} style={{ '--_ld-tone': tone(i), width: px(8), height: px(8), borderRadius: '50%',
            left: px(i * 12), top: px(12), animation: 'omni-loader-hop .9s ' + (i * 0.12) + 's infinite' }} />
        ))}
      </div>
    );
  }
  if (type === 'ripple') {
    return (
      <div className="loader-graphic loader-ripple MuiBox-root omni-ld-g" style={rootStyle} {...rest}>
        {[0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className={P + ' omni-ld-bd'} style={{ '--_ld-tone': tone(i), inset: px(13), borderRadius: '50%', borderWidth: px(2), borderStyle: 'solid',
            opacity: 0, animation: 'omni-loader-ripple 1.8s linear ' + (i * -0.6) + 's infinite' }} />
        ))}
      </div>
    );
  }
  if (type === 'dual-ring') {
    const arcs = (c) => ({ '--_ld-tone': c, borderLeftColor: 'transparent', borderRightColor: 'transparent' });
    return (
      <div className="loader-graphic loader-dual-ring MuiBox-root omni-ld-g" style={rootStyle} {...rest}>
        <div aria-hidden="true" className={P + ' omni-ld-arc'} style={{ inset: 0, borderRadius: '50%', borderWidth: px(3), borderStyle: 'solid', ...arcs(tone(0)),
          animation: 'omni-loader-turn 1.1s linear infinite' }} />
        <div aria-hidden="true" className={P + ' omni-ld-arc'} style={{ inset: px(6), borderRadius: '50%', borderWidth: px(3), borderStyle: 'solid', ...arcs(tone(1)),
          transform: 'rotate(45deg)', animation: 'omni-loader-turn-back .9s linear infinite' }} />
        <div aria-hidden="true" className={BG} style={{ '--_ld-tone': tone(2), left: px(13), top: px(13), width: px(6), height: px(6), borderRadius: '50%',
          animation: 'omni-loader-pop 1.1s ease-in-out infinite' }} />
      </div>
    );
  }
  if (type === 'bars') {
    return (
      <div className="loader-graphic loader-bars MuiBox-root omni-ld-g" style={rootStyle} {...rest}>
        {[0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className={BG} style={{ '--_ld-tone': tone(i), left: px(2 + i * 11), top: px(3), width: px(6), height: px(26), borderRadius: px(3),
            transformOrigin: 'center', transform: 'scaleY(.3)',
            animation: 'omni-loader-bar .9s ease-in-out ' + (i * 0.15) + 's infinite' }} />
        ))}
      </div>
    );
  }
  // spinner — one colour, always (Figma has no Multicolor Spinner)
  return <LoaderRing size={d} color={color} {...rest} />;
}

/**
 * Loader Component
 *
 * Circular progress indicator with an optional message.
 *
 * SIZES: small (24px) | medium (32px) | large (56px) — Figma's Other/Loader —
 *   or a number in px.
 *
 * COLORS: the 8 brand colors, via --Buttons-{Color}-Border.
 *   Previously hardcoded to var(--Primary-Color-11): a raw palette TONE rather
 *   than a semantic token, so it ignored the surface it sat on and could not
 *   follow a themed section.
 */

/* ZONE PROPS — `theme` and `surface`. They become data-theme / data-surface on
 * the root, so the loader takes its colors from the zone it sits in rather
 * than from a prop. Undefined when not passed, so it INHERITS its ancestor's
 * zone; an empty string would match [data-theme] and pin it to nothing.
 *
 * Not derived from `color`: that picks the PALETTE the spinner draws from,
 * while `theme` moves the surface the message text reads from. */
export function Loader({
  theme,
  surface,
  /* Figma's Style: spinner | orbit | bounce | ripple | dual-ring | bars. */
  type = 'spinner',
  /* Figma's Color = Multicolor: Primary / Secondary / Tertiary, one per piece.
     Off, every piece is the `color` palette. Spinner is always one colour. */
  multicolor = false,
  size = 'medium',
  color = 'primary',
  message = 'Loading...',
  sx = {},
  // Names the progressbar, not the Stack wrapper. Left in ...props it landed
  // on the wrapper and role="progressbar" had no accessible name.
  'aria-label': ariaLabel = 'Loading',
  'aria-labelledby': ariaLabelledby,
  className,
  ...props
}) {
  /* A centred column, Sizing-2 between the graphic and the message, 32px
     above and below (MUI Stack's markup and class name, kept). */
  return (
    <Root sx={sx} className={join('MuiStack-root', className, 'omni-ld-st omni-ld-center omni-ld-loader')} {...props}
      data-theme={theme || undefined}
      data-surface={surface || undefined}
    >
      <LoaderGraphic
        type={LOADER_TYPES.includes(type) ? type : 'spinner'}
        d={typeof size === 'number' ? size : (LOADER_SIZE_MAP[size] ?? LOADER_SIZE_MAP.medium)}
        color={color}
        multicolor={multicolor && type !== 'spinner'}
        role="progressbar"
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
      />
      {/* Figma's Message: Body in --Text, Sizing-2 under the ring. It was
          --Text-Secondary (the secondary palette's text, not a muted one) at
          a literal 500 weight. */}
      {message && <Body>{message}</Body>}
    </Root>
  );
}

/**
 * LinearLoader Component
 * Linear progress bar
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} label - Optional label
 * @param {object} props - Additional props
 */
export function LinearLoader({
  value,
  label,
  sx = {},
  className,
  ...props
}) {
  const det = value !== undefined;
  /* MUI's LinearProgress markup and default theme, the bar in
     --Primary-Color-11 over a --Border-Variant track. */
  return (
    <Root sx={sx} className={join('MuiStack-root', className, 'omni-ld-st omni-ld-sp1')} {...props}>
      {label && (
        <div className="MuiStack-root omni-ld-st omni-ld-row omni-ld-between">
          <p className="MuiTypography-root MuiTypography-body2 omni-ld-ty omni-ld-body2">
            {label}
          </p>
          {value !== undefined && (
            <span className="MuiTypography-root MuiTypography-caption omni-ld-ty omni-ld-caption">
              {value}%
            </span>
          )}
        </div>
      )}
      <span className={'MuiLinearProgress-root MuiLinearProgress-colorPrimary MuiLinearProgress-' + (det ? 'determinate' : 'indeterminate') + ' omni-ld-lp'}
        role="progressbar" {...(det ? { 'aria-valuenow': Math.round(value), 'aria-valuemin': 0, 'aria-valuemax': 100 } : {})}>
        {det ? (
          <span className="MuiLinearProgress-bar MuiLinearProgress-bar1 MuiLinearProgress-barColorPrimary MuiLinearProgress-bar1Determinate omni-ld-lpb omni-ld-lpb-d"
            style={{ transform: `translateX(${value - 100}%)` }} />
        ) : (
          <>
            <span className="MuiLinearProgress-bar MuiLinearProgress-bar1 MuiLinearProgress-barColorPrimary MuiLinearProgress-bar1Indeterminate omni-ld-lpb omni-ld-lpb-1" />
            <span className="MuiLinearProgress-bar MuiLinearProgress-bar2 MuiLinearProgress-barColorPrimary MuiLinearProgress-bar2Indeterminate omni-ld-lpb omni-ld-lpb-2" />
          </>
        )}
      </span>
    </Root>
  );
}

/**
 * SkeletonLoader Component
 * Skeleton placeholder for loading content
 * 
 * @param {number} rows - Number of skeleton rows
 * @param {number} height - Height of each skeleton
 * @param {object} props - Additional props
 */
export function SkeletonLoader({
  rows = 3,
  height = 100,
  spacing = 2,
  sx = {},
  className,
  style,
  ...props
}) {
  return (
    <Root sx={sx} className={join('MuiStack-root', className, 'omni-ld-st omni-ld-spv')}
      style={{ '--_ld-sp': typeof spacing === 'number' ? spacing * 8 + 'px' : spacing, ...style }} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <span key={i} className="MuiSkeleton-root MuiSkeleton-rectangular MuiSkeleton-pulse omni-ld-sk omni-ld-sk-r8"
          style={{ height }} />
      ))}
    </Root>
  );
}

/**
 * DotsLoader Component
 * Animated dots loader
 * 
 * @param {string} message - Loading message
 * @param {object} props - Additional props
 */
export function DotsLoader({
  message = 'Loading',
  sx = {},
  className,
  ...props
}) {
  return (
    <Root sx={sx} className={join('MuiStack-root', className, 'omni-ld-st omni-ld-center omni-ld-sp2 omni-ld-py4')} {...props}>
      <div className="MuiBox-root omni-ld-dots">
        {[0, 1, 2].map((i) => (
          <div key={i} className="MuiBox-root omni-ld-dot" style={{ '--_ld-delay': `${i * 0.2}s` }} />
        ))}
      </div>
      {/* Figma's Message: Body in --Text, Sizing-2 under the ring. It was
          --Text-Secondary (the secondary palette's text, not a muted one) at
          a literal 500 weight. */}
      {message && <Body>{message}</Body>}
    </Root>
  );
}

/**
 * PageLoader Component
 * Full page loader overlay
 * 
 * @param {string} message - Loading message
 * @param {number} size - Loader size
 * @param {object} props - Additional props
 */
export function PageLoader({
  message = 'Loading page...',
  size = 60,
  sx = {},
  className,
  ...props
}) {
  return (
    <Root sx={sx} className={join(className, 'MuiBox-root omni-ld-page')} {...props}>
      <Loader size={size} message={message} />
    </Root>
  );
}

/**
 * SkeletonCard Component
 * Skeleton loading state for cards
 * 
 * @param {number} lines - Number of text lines
 * @param {boolean} showImage - Show image skeleton
 * @param {object} props - Additional props
 */
export function SkeletonCard({
  lines = 3,
  showImage = true,
  sx = {},
  className,
  ...props
}) {
  return (
    <Root sx={sx} className={join('MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1', className, 'omni-ld-paper')} {...props}>
      <div className="MuiStack-root omni-ld-st omni-ld-sp2">
        {showImage && (
          <span className="MuiSkeleton-root MuiSkeleton-rectangular MuiSkeleton-pulse omni-ld-sk omni-ld-sk-r4" style={{ height: 200 }} />
        )}
        <div className="MuiStack-root omni-ld-st omni-ld-sp1">
          {Array.from({ length: lines }).map((_, i) => (
            <span key={i} className="MuiSkeleton-root MuiSkeleton-text MuiSkeleton-pulse omni-ld-sk omni-ld-sk-text"
              style={{ height: i === 0 ? 24 : 16 }} />
          ))}
        </div>
      </div>
    </Root>
  );
}

/**
 * OverlayLoader Component
 * Loader overlay for async operations
 * 
 * @param {boolean} isLoading - Show loader
 * @param {string} message - Loading message
 * @param {ReactNode} children - Content to overlay
 * @param {object} props - Additional props
 */
export function OverlayLoader({
  isLoading = false,
  message = 'Loading...',
  children,
  sx = {},
  className,
  ...props
}) {
  return (
    <Root sx={sx} className={join(className, 'MuiBox-root omni-ld-ov')} {...props}>
      {children}
      {isLoading && (
        <div className="MuiBox-root omni-ld-ov-veil">
          <Loader size={40} message={message} />
        </div>
      )}
    </Root>
  );
}

export default Loader;
