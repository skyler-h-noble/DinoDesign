// src/components/Modal/Modal.js
import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useOmniDesign } from '../../OmniDesignProvider';

/**
 * Modal Component
 *
 * VARIANTS:
 *   default  provider's theme,  data-surface="Container-High"
 *   solid    data-theme={Color}, data-surface="Container-High"
 *   soft     data-theme={Color}, data-surface="Surface-Brightest"
 *
 * The two coloured variants now differ by SURFACE rather than by theme name.
 * soft used to ask for {Color}-Light, and there is no such theme — the shades
 * were removed and a level does that job. It bound nothing, so a soft modal
 * silently inherited whatever palette the page was on: soft error and soft
 * success rendered identically, and both looked like the page.
 *
 * Soft moves to the SURFACE ladder rather than dropping a container level,
 * and the distinction matters. Containers are an ELEVATION axis — the levels
 * are opacities against the page, and Container-Highest is the tone itself —
 * so Container-Low would have made the modal more transparent, not paler. On
 * black cards that ramp even runs the other way.
 *
 * COLORS: primary, secondary, tertiary, neutral, info, success, warning, error
 *
 * SIZES: small (400px), medium (560px), large (720px)
 * LAYOUT: center | fullscreen
 *
 * TRANSITIONS: none, fade, slide-up, slide-down, zoom
 * TRANSITION SPEED: 150ms – 600ms
 *
 * BACKDROP: semi-transparent overlay, click to close (optional)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* One map, not two. The palette is the same for solid and soft — what
   differs is the level it sits on — so a second map was a second place to
   keep the same eight names in step, and the copy that fell behind was the
   one naming themes that no longer exist. */
const THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

/** Where each variant sits. Solid stays a raised container; soft is the same
 *  palette at the brightest surface, which is what {Color}-Light meant. */
const VARIANT_SURFACE = {
  default: 'Container-High',
  solid: 'Container-High',
  soft: 'Surface-Brightest',
};

const SIZE_MAP = {
  small:  { maxWidth: 400, padding: '24px' },
  medium: { maxWidth: 560, padding: '32px' },
  large:  { maxWidth: 720, padding: '40px' },
};

const TRANSITION_KEYFRAMES = {
  fade: {
    enter: { from: { opacity: 0 }, to: { opacity: 1 } },
    name: 'modal-fade',
  },
  'slide-up': {
    enter: { from: { opacity: 0, transform: 'translateY(40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    name: 'modal-slide-up',
  },
  'slide-down': {
    enter: { from: { opacity: 0, transform: 'translateY(-40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    name: 'modal-slide-down',
  },
  zoom: {
    enter: { from: { opacity: 0, transform: 'scale(0.85)' }, to: { opacity: 1, transform: 'scale(1)' } },
    name: 'modal-zoom',
  },
};

function buildKeyframeCSS(transition) {
  const config = TRANSITION_KEYFRAMES[transition];
  if (!config) return '';
  const { from, to } = config.enter;
  const fromStr = Object.entries(from).map(([k, v]) => k + ':' + v).join(';');
  const toStr = Object.entries(to).map(([k, v]) => k + ':' + v).join(';');
  return '@keyframes ' + config.name + ' { from {' + fromStr + '} to {' + toStr + '} }' +
    '@keyframes ' + config.name + '-backdrop { from { opacity: 0 } to { opacity: 1 } }';
}

export function Modal({
  open,
  onClose,
  children,
  title,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  layout = 'center',
  transition = 'fade',
  transitionSpeed = 250,
  closeOnBackdrop = true,
  showCloseButton = true,
  className = '',
  sx = {},
  ...props
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Get current theme context so the portal inherits the right tokens
  let omniCtx;
  try { omniCtx = useOmniDesign(); } catch { omniCtx = null; }
  /* The provider's THEME is deliberately not read any more — see the
     data-theme note below. Its style still is: data-style is a different
     axis and the modal does pin that. */
  const providerStyle = omniCtx?.style || 'Modern';

  const isDefault = variant === 'default';
  const isSoft = variant === 'soft';
  const isSolid = variant === 'solid';
  const isFullscreen = layout === 'fullscreen';

  const dataTheme = (isSolid || isSoft) ? THEME_MAP[color] : null;
  const dataSurface = VARIANT_SURFACE[variant] || VARIANT_SURFACE.default;

  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const transConfig = TRANSITION_KEYFRAMES[transition];
  const animationName = transConfig ? transConfig.name : undefined;
  const speed = transitionSpeed + 'ms';

  // Open/close with animation
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      setVisible(true);
      // Focus trap
      requestAnimationFrame(() => {
        modalRef.current?.focus();
      });
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open && !visible) return null;

  return (
    <>
      {transition !== 'none' && <style>{buildKeyframeCSS(transition)}</style>}

      {/* Backdrop */}
      <Box
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        sx={{
          position: 'fixed', inset: 0, zIndex: 10000000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          ...(animationName && {
            animation: animationName + '-backdrop ' + speed + ' ease-out forwards',
          }),
        }}
      />

      {/* Modal container */}
      <Box
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Modal'}
        ref={modalRef}
        tabIndex={-1}
        data-surface={dataSurface}
        /* No data-theme on `default` — INHERIT, do not pin.
           
           This was `dataTheme || providerTheme`, which is never empty, so a
           default modal always stamped the app-level theme onto itself. Inside
           a themed section that overrides the section: open a default modal
           from a Primary region and it snaps back to whatever the provider is
           set to, which reads as the modal ignoring its surroundings.
           
           Default means "whatever is around me". Omitting the attribute is how
           the cascade is asked for; naming a theme is how it is refused. */
        data-theme={dataTheme || undefined}
        data-style={providerStyle}
        className={'modal modal-' + variant + ' modal-' + size + ' modal-' + layout +
          (isSoft || isSolid ? ' modal-' + color : '') +
          (className ? ' ' + className : '')}
        sx={{
          position: 'fixed',
          zIndex: 10000001,
          outline: 'none',
          fontFamily: 'inherit',
          // Layout
          ...(isFullscreen ? {
            inset: 0,
            borderRadius: 0,
          } : {
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: s.maxWidth + 'px',
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 'var(--Modal-Radius, var(--Style-Border-Radius))',
          }),
          // Visual
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          // Animation
          ...(animationName && {
            animation: animationName + ' ' + speed + ' ease-out forwards',
          }),
          ...sx,
        }}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: isFullscreen ? 4 : s.padding,
            pt: isFullscreen ? 3 : s.padding,
            pb: 0,
            flexShrink: 0,
          }}>
            {title && (
              <Box sx={{ fontSize: size === 'small' ? '18px' : size === 'large' ? '24px' : '20px', fontWeight: 700, color: 'var(--Text)', flex: 1 }}>
                {title}
              </Box>
            )}
            {showCloseButton && (
              <Box
                component="button" type="button"
                aria-label="Close modal"
                onClick={onClose}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: '50%',
                  border: 'none', backgroundColor: 'transparent',
                  color: 'var(--Text-Quiet)', cursor: 'pointer',
                  flexShrink: 0, ml: 1,
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </Box>
            )}
          </Box>
        )}

        {/* Body */}
        <Box sx={{
          flex: 1, overflowY: 'auto',
          px: isFullscreen ? 4 : s.padding,
          pt: isFullscreen ? 3 : '16px',
          pb: isFullscreen ? 3 : s.padding,
          color: 'var(--Text)',
          fontSize: size === 'small' ? '13px' : '14px',
          lineHeight: 1.6,
        }}>
          {children}
        </Box>
      </Box>
    </>
  );
}

export default Modal;
