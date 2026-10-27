// src/components/Loader/Loader.js
import React from 'react';
import {
  LinearProgress,
  Box,
  Stack,
  Typography,
  Skeleton,
  Paper,
} from '@mui/material';
import { Body } from '../Typography';

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

export function LoaderRing({ size = 'medium', color = 'primary', className = '', sx = {}, ...props }) {
  const d = typeof size === 'number' ? size : (LOADER_SIZE_MAP[size] ?? LOADER_SIZE_MAP.medium);
  const C = LOADER_COLOR[color] || 'Primary';
  const ring = d * 0.1;
  return (
    <Box
      role="progressbar"
      className={'loader-ring ' + className}
      sx={{
        width: d, height: d, flexShrink: 0, borderRadius: '50%',
        /* Figma's Position 1: the hard edge at 6 o'clock, the border colour
           there fading clockwise round to the Background. */
        background: 'conic-gradient(from 180deg, var(--Buttons-' + C + '-Border), var(--Background))',
        // Cut the disc to the ring: transparent inside 90% of the radius.
        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - ' + ring + 'px), #000 calc(100% - ' + ring + 'px))',
        mask: 'radial-gradient(farthest-side, transparent calc(100% - ' + ring + 'px), #000 calc(100% - ' + ring + 'px))',
        animation: 'loader-ring-spin 1s linear infinite',
        '@keyframes loader-ring-spin': { to: { transform: 'rotate(360deg)' } },
        '@media (prefers-reduced-motion: reduce)': { animationDuration: '3s' },
        ...sx,
      }}
      {...props}
    />
  );
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
const KEYFRAMES = {
  '@keyframes omni-loader-turn': { to: { transform: 'rotate(360deg)' } },
  '@keyframes omni-loader-turn-back': { to: { transform: 'rotate(-360deg)' } },
  '@keyframes omni-loader-pop': { '0%, 100%': { transform: 'scale(.6)' }, '50%': { transform: 'scale(1)' } },
  '@keyframes omni-loader-hop': {
    '0%, 60%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(.3, 0, .2, 1)' },
    '30%': { transform: 'translateY(calc(var(--omni-loader-k) * -9px))', animationTimingFunction: 'cubic-bezier(.6, 0, .8, 1)' },
  },
  /* Grows the ring's box, not its scale: scaling thinned the 2px stroke to a
     hairline on the small rings, which is where the ripple starts. */
  '@keyframes omni-loader-ripple': {
    '0%': { inset: 'calc(var(--omni-loader-k) * 13px)', opacity: 1 },
    '70%': { opacity: 0.6 },
    '100%': { inset: 'calc(var(--omni-loader-k) * 1px)', opacity: 0 },
  },
  '@keyframes omni-loader-bar': { '0%, 100%': { transform: 'scaleY(.3)' }, '50%': { transform: 'scaleY(1)' } },
};
const SLOW = { '@media (prefers-reduced-motion: reduce)': { '&, & *': { animationDuration: '3s !important' } } };

function LoaderGraphic({ type, d, color, multicolor, ...rest }) {
  const C = LOADER_COLOR[color] || 'Primary';
  const tone = (i) => (multicolor ? MULTI[i] : 'var(--Buttons-' + C + '-Border)');
  const k = d / 32;
  const px = (n) => n * k + 'px';
  const root = {
    position: 'relative', width: d, height: d, flexShrink: 0,
    '--omni-loader-k': k, ...KEYFRAMES, ...SLOW,
  };
  const piece = { position: 'absolute', boxSizing: 'border-box' };

  if (type === 'orbit') {
    return (
      <Box className="loader-graphic loader-orbit" sx={root} {...rest}>
        <Box aria-hidden="true" sx={{ ...piece, inset: 0, animation: 'omni-loader-turn 1.2s linear infinite' }}>
          {[0, 1, 2].map((i) => {
            const a = (-90 + i * 120) * Math.PI / 180;
            return <Box key={i} sx={{ ...piece, width: px(8), height: px(8), borderRadius: '50%', backgroundColor: tone(i),
              left: px(16 + 11 * Math.cos(a) - 4), top: px(16 + 11 * Math.sin(a) - 4),
              animation: 'omni-loader-pop 1.2s ease-in-out ' + (i * -0.4) + 's infinite' }} />;
          })}
        </Box>
      </Box>
    );
  }
  if (type === 'bounce') {
    return (
      <Box className="loader-graphic loader-bounce" sx={root} {...rest}>
        {[0, 1, 2].map((i) => (
          <Box key={i} aria-hidden="true" sx={{ ...piece, width: px(8), height: px(8), borderRadius: '50%', backgroundColor: tone(i),
            left: px(i * 12), top: px(12), animation: 'omni-loader-hop .9s ' + (i * 0.12) + 's infinite' }} />
        ))}
      </Box>
    );
  }
  if (type === 'ripple') {
    return (
      <Box className="loader-graphic loader-ripple" sx={root} {...rest}>
        {[0, 1, 2].map((i) => (
          <Box key={i} aria-hidden="true" sx={{ ...piece, inset: px(13), borderRadius: '50%', border: px(2) + ' solid ' + tone(i),
            opacity: 0, animation: 'omni-loader-ripple 1.8s linear ' + (i * -0.6) + 's infinite' }} />
        ))}
      </Box>
    );
  }
  if (type === 'dual-ring') {
    const arcs = (c) => ({ borderTopColor: c, borderBottomColor: c, borderLeftColor: 'transparent', borderRightColor: 'transparent' });
    return (
      <Box className="loader-graphic loader-dual-ring" sx={root} {...rest}>
        <Box aria-hidden="true" sx={{ ...piece, inset: 0, borderRadius: '50%', borderWidth: px(3), borderStyle: 'solid', ...arcs(tone(0)),
          animation: 'omni-loader-turn 1.1s linear infinite' }} />
        <Box aria-hidden="true" sx={{ ...piece, inset: px(6), borderRadius: '50%', borderWidth: px(3), borderStyle: 'solid', ...arcs(tone(1)),
          transform: 'rotate(45deg)', animation: 'omni-loader-turn-back .9s linear infinite' }} />
        <Box aria-hidden="true" sx={{ ...piece, left: px(13), top: px(13), width: px(6), height: px(6), borderRadius: '50%', backgroundColor: tone(2),
          animation: 'omni-loader-pop 1.1s ease-in-out infinite' }} />
      </Box>
    );
  }
  if (type === 'bars') {
    return (
      <Box className="loader-graphic loader-bars" sx={root} {...rest}>
        {[0, 1, 2].map((i) => (
          <Box key={i} aria-hidden="true" sx={{ ...piece, left: px(2 + i * 11), top: px(3), width: px(6), height: px(26), borderRadius: px(3),
            backgroundColor: tone(i), transformOrigin: 'center', transform: 'scaleY(.3)',
            animation: 'omni-loader-bar .9s ease-in-out ' + (i * 0.15) + 's infinite' }} />
        ))}
      </Box>
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
  ...props
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        gap: 'var(--Sizing-2, 16px)',
        py: 4,
        ...sx,
      }}
      {...props}
    
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
    </Stack>
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
  ...props
}) {
  return (
    <Stack spacing={1} sx={{ ...sx }} {...props}>
      {label && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'var(--Text)', fontWeight: 500 }}>
            {label}
          </Typography>
          {value !== undefined && (
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
              {value}%
            </Typography>
          )}
        </Stack>
      )}
      <LinearProgress
        variant={value !== undefined ? 'determinate' : 'indeterminate'}
        value={value}
        sx={{
          backgroundColor: 'var(--Border-Variant)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'var(--Primary-Color-11)',
          },
          height: 4,
          borderRadius: 2,
        }}
      />
    </Stack>
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
  ...props
}) {
  return (
    <Stack spacing={spacing} sx={{ ...sx }} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={height}
          sx={{
            backgroundColor: 'var(--Container-Low)',
            borderRadius: '8px',
          }}
        />
      ))}
    </Stack>
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
  ...props
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        py: 4,
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--Primary-Color-11)',
              animation: `pulse 1.4s infinite`,
              animationDelay: `${i * 0.2}s`,
              '@keyframes pulse': {
                '0%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.5,
                },
                '100%': {
                  opacity: 1,
                },
              },
            }}
          />
        ))}
      </Box>
      {/* Figma's Message: Body in --Text, Sizing-2 under the ring. It was
          --Text-Secondary (the secondary palette's text, not a muted one) at
          a literal 500 weight. */}
      {message && <Body>{message}</Body>}
    </Stack>
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
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--Background)',
        ...sx,
      }}
      {...props}
    >
      <Loader size={size} message={message} />
    </Box>
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
  ...props
}) {
  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: 'var(--Container)',
        ...sx,
      }}
      {...props}
    >
      <Stack spacing={2}>
        {showImage && (
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{
              backgroundColor: 'var(--Container-Low)',
              borderRadius: 1,
            }}
          />
        )}
        <Stack spacing={1}>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={i === 0 ? 24 : 16}
              sx={{
                backgroundColor: 'var(--Container-Low)',
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
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
  ...props
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...props}
    >
      {children}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'inherit',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Loader size={40} message={message} />
        </Box>
      )}
    </Box>
  );
}

export default Loader;
