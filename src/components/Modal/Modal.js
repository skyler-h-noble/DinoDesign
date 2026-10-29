// src/components/Modal/Modal.js
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */
import { SHADOW_SCRIM_LEVEL_5 } from '../_shadows';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import CloseIcon from '@omni-design/icons/Close';
import { useOmniDesign } from '../../OmniDesignProvider';
import { Button } from '../Button/Button';
import { Body, Eyebrow, H3 } from '../Typography/Typography';

/**
 * Modal Component
 *
 * VARIANTS:
 *   default  provider's theme,  data-surface="Container-High"
 *   solid    data-theme={Color}, data-surface="Container-High"
 *   soft     data-theme={Color}, data-surface="Surface-Brightest"
 *
 * The two colored variants now differ by SURFACE rather than by theme name.
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
  /* Figma's Modal Content sits at Container-Highest — the raised tone itself. */
  default: 'Container-Highest',
  solid: 'Container-Highest',
  soft: 'Surface-Brightest',
};

/* Figma's Modal is Modal-Max wide (960). small / large stay as narrower and
   in-between widths for code; the padding is the design's Modal-Padding at
   every size, so it is no longer per size. */
const SIZE_MAP = {
  small:  { maxWidth: '400px' },
  medium: { maxWidth: 'var(--Modal-Max, 960px)' },
  large:  { maxWidth: '720px' },
};
const PAD = 'var(--Modal-Padding, 45px)';

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

const SxBox = lazySxBox('Modal');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const decl = (o) => Object.entries(o).map(([k, v]) => k + ':' + v).join(';');

/* ─── Static sheet ───
   The four enter animations (and the backdrop's fade) live here rather than
   in a <style> the modal rendered beside itself. The speed is per instance,
   so it arrives as --_md-speed. */
registerStaticStyles('omni-modal', [
  ...Object.values(TRANSITION_KEYFRAMES).map((t) => `@keyframes ${t.name}{from{${decl(t.enter.from)}}to{${decl(t.enter.to)}}}`
    + `@keyframes ${t.name}-backdrop{from{opacity:0}to{opacity:1}}`),
  '.omni-md-backdrop{position:fixed;inset:0;z-index:10000000;background-color:rgba(0,0,0,0.5)}',
  ...Object.values(TRANSITION_KEYFRAMES).map((t) => `.omni-md-backdrop.omni-md-a-${t.name}{animation:${t.name}-backdrop var(--_md-speed) ease-out forwards}`),
  `.omni-md{position:fixed;z-index:10000001;outline:none;box-sizing:border-box;box-shadow:${SHADOW_SCRIM_LEVEL_5};`
    + 'display:flex;flex-direction:column;overflow:hidden}',
  ...Object.values(TRANSITION_KEYFRAMES).map((t) => `.omni-md.omni-md-a-${t.name}{animation:${t.name} var(--_md-speed) ease-out forwards}`),
  '.omni-md-full{inset:0;border-radius:0}',
  /* Figma's frame: the 1px edge in the PAGE's Background, the Modal-Radius
     corners and the Level 5 shadow (neutral: it always sits over the black
     backdrop). */
  '.omni-md-center{top:50%;left:50%;transform:translate(-50%, -50%);max-width:var(--_md-max);width:calc(100% - 32px);max-height:calc(100vh - 64px);'
    + 'border-radius:var(--Modal-Radius, var(--Style-Border-Radius));border:1px solid var(--Background)}',
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-md-${k}{--_md-max:${v.maxWidth}}`),
  '.omni-md-content{display:flex;flex-direction:column;flex:1;min-height:var(--Card-Min-Height, auto);overflow-y:auto;border-radius:inherit}',
  '.omni-md-content[data-surface]{background-color:var(--Background);color:var(--Text)}',
  `.omni-md-header{display:flex;align-items:flex-start;gap:var(--Sizing-1, 8px);padding:${PAD};flex-shrink:0}`,
  '.omni-md-title{display:flex;flex-direction:column;gap:var(--Sizing-Half, 4px);flex:1;min-width:0}',
  `.omni-md-body{display:flex;flex-direction:column;gap:var(--Sizing-Half, 4px);padding:var(--Sizing-2, 16px) ${PAD};flex:1}`,
  `.omni-md-footer{display:flex;flex-direction:column;gap:var(--Sizing-Half, 4px);padding:${PAD};flex-shrink:0}`,
].join('\n'));

export function Modal({
  open,
  onClose,
  children,
  title,
  /* Figma's title slot: an Eyebrow line over the H3 title. */
  eyebrow,
  /* Figma's Modal Footer slot — typically a ButtonGroup. */
  actions,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  layout = 'center',
  transition = 'fade',
  transitionSpeed = 250,
  closeOnBackdrop = true,
  showCloseButton = true,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-modal');
  const modalRef = useRef(null);
  /* With sx the frame is an MUI box that loads on demand, and it REPLACES the
     plain one when it arrives — taking the focus placed on it. Once focused,
     a new frame takes the focus back, so it ends where it always did. */
  const focusedRef = useRef(false);
  const setModalRef = useCallback((node) => {
    modalRef.current = node;
    if (node && focusedRef.current && !node.contains(document.activeElement)) node.focus();
  }, []);
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

  const sizeKey = SIZE_MAP[size] ? size : 'medium';
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
        focusedRef.current = true;
      });
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      focusedRef.current = false;
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

  const anim = animationName ? ' omni-md-a-' + animationName : '';
  const speedVar = animationName ? { '--_md-speed': speed } : undefined;
  const modalProps = {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': title || 'Modal',
    ref: setModalRef,
    tabIndex: -1,
    'data-style': providerStyle,
    className: 'modal modal-' + variant + ' modal-' + size + ' modal-' + layout +
      (isSoft || isSolid ? ' modal-' + color : '') +
      ' omni-md omni-md-' + sizeKey + (isFullscreen ? ' omni-md-full' : ' omni-md-center') + anim +
      (className ? ' ' + className : ''),
    ...props,
    style: speedVar || props.style ? { ...speedVar, ...props.style } : undefined,
  };
  const content = (
    /* Modal Content — Container-Highest (No data-theme on `default`:
       inherit, do not pin. Naming the provider's theme here made a default
       modal opened from a themed section snap back to the app's theme.) */
    <div className="modal-content omni-md-content" data-surface={dataSurface} data-theme={dataTheme || undefined}>
      {/* Header: the title slot and the close Button, Modal-Padding round. */}
      {(title || eyebrow || showCloseButton) && (
        <div className="modal-header omni-md-header">
          <div className="modal-title omni-md-title">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <H3 component="h2">{title}</H3>}
          </div>
          {/* Button keeps itself from shrinking (flex-shrink: 0). */}
          {showCloseButton && (
            <Button iconOnly variant="ghost" aria-label="Close modal" onClick={onClose} className="modal-close">
              <CloseIcon />
            </Button>
          )}
        </div>
      )}

      {/* Body slot: Sizing-2 above and below, Modal-Padding either side. */}
      <div className="modal-body omni-md-body">
        {typeof children === 'string' ? <Body>{children}</Body> : children}
      </div>

      {/* Footer slot: Modal-Padding round. */}
      {actions && (
        <div className="modal-footer omni-md-footer">
          {actions}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        className={'omni-md-backdrop' + anim}
        style={speedVar}
      />
      {hasSx(sx)
        ? <SxBox sx={sx} {...modalProps}>{content}</SxBox>
        : <div {...modalProps}>{content}</div>}
    </>
  );
}

export default Modal;
