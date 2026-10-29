// src/components/Drawer/Drawer.js
import React, { useEffect, useRef, useCallback } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import CloseIcon from '@omni-design/icons/Close';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { useOmniDesign } from '../../OmniDesignProvider';
import { SHADOW_LEVEL_3, SHADOW_SCRIM_LEVEL_3 } from '../_shadows';

/**
 * Drawer Component
 *
 * A navigation panel that slides in from an edge of the viewport.
 * No color prop — content (TreeView, nav items, etc.) handles its own theming.
 *
 * SIZES: small (240px) | medium (320px) | large (420px)
 * ANCHOR: left | right | top | bottom
 *
 * The drawer inherits the provider's theme context and uses Surface-Dim
 * for the background, matching the sidebar pattern.
 *
 * Closes on Escape, backdrop click, or close button.
 * Focus is trapped within the drawer while open.
 */

const SIZE_DIMENSION = {
  small:  { width: '240px', height: '200px' },
  medium: { width: '320px', height: '280px' },
  large:  { width: '420px', height: '380px' },
};

const BORDER_SIDE = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };

const SLIDE_CLOSED = {
  left:   'translateX(-100%)',
  right:  'translateX(100%)',
  top:    'translateY(-100%)',
  bottom: 'translateY(100%)',
};

const SxBox = lazySxBox('Drawer');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* ─── Static sheet ───
   One @keyframes for every edge: it reads where to start from --_dr-from,
   which the anchor's class sets. */
registerStaticStyles('omni-drawer', [
  '@keyframes drawer-slide-in{from{transform:var(--_dr-from)}to{transform:translate(0, 0)}}',
  '.omni-dr-backdrop{position:fixed;inset:0;z-index:10000000;background-color:rgba(0, 0, 0, 0.5);transition:opacity 0.3s ease}',
  '.omni-dr{position:fixed;z-index:10000001;background-color:var(--Background);color:var(--Text);'
    + `box-shadow:${SHADOW_SCRIM_LEVEL_3};display:flex;flex-direction:column;outline:none;overflow:hidden;`
    + 'animation:drawer-slide-in 0.3s ease forwards}',
  // Neutral over its backdrop; the page's tint when there is none.
  `.omni-dr-flat{box-shadow:${SHADOW_LEVEL_3}}`,
  '.omni-dr-left{top:0;left:0;bottom:0}',
  '.omni-dr-right{top:0;right:0;bottom:0}',
  '.omni-dr-top{top:0;left:0;right:0}',
  '.omni-dr-bottom{bottom:0;left:0;right:0}',
  ...Object.entries(BORDER_SIDE).map(([a, side]) => `.omni-dr-${a}{border-${side}:1px solid var(--Border);--_dr-from:${SLIDE_CLOSED[a]}}`),
  ...Object.entries(SIZE_DIMENSION).map(([k, d]) => `.omni-dr-h-${k}{width:${d.width};height:100%}`),
  ...Object.entries(SIZE_DIMENSION).map(([k, d]) => `.omni-dr-v-${k}{height:${d.height};width:100%}`),
  '.omni-dr-close{position:absolute;top:12px;right:12px;z-index:1}',
  '.omni-dr-header{display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between;padding:16px;border-bottom:1px solid var(--Border);flex-shrink:0}',
  '.omni-dr-content{flex:1;overflow-y:auto;padding:16px}',
].join('\n'));

/** A part's root: plain element, or an MUI box only when given sx. */
const Part = React.forwardRef(function Part({ sx, ...props }, ref) {
  if (hasSx(sx)) return <SxBox sx={sx} ref={ref} {...props} />;
  return <div ref={ref} {...props} />;
});

export function Drawer({
  children,
  open = false,
  onClose,
  size = 'medium',
  anchor = 'left',
  hideBackdrop = false,
  /* The panel's surface level. Surface-Dim, the sidebar pattern, unless a
     caller (Sheet: Container) says otherwise. */
  surface = 'Surface-Dim',
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-drawer');
  const drawerRef = useRef(null);
  /* With sx the panel is an MUI box that loads on demand and REPLACES the
     plain one — remounting what was focused inside it. Once focus has been
     placed, a new panel gets the same first-focus again. */
  const focusedRef = useRef(false);
  const focusTarget = useRef(null);
  const observer = useRef(null);
  const focusFirst = (node) => {
    const focusable = node?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusTarget.current = focusable || node || null;
    if (focusable) focusable.focus();
    else node?.focus();
  };
  /* The same goes for a part inside it (a DrawerClose or DrawerHeader with
     sx): if the element focus was placed on is swapped out, focus goes to its
     replacement. */
  const watch = (node) => {
    if (observer.current) observer.current.disconnect();
    if (typeof MutationObserver === 'undefined') return;
    observer.current = new MutationObserver(() => {
      const t = focusTarget.current;
      if (focusedRef.current && t && !t.isConnected && !node.contains(document.activeElement)) focusFirst(node);
    });
    observer.current.observe(node, { childList: true, subtree: true });
  };
  useEffect(() => () => observer.current && observer.current.disconnect(), []);
  const setDrawerRef = useCallback((node) => {
    drawerRef.current = node;
    if (!node) return;
    watch(node);
    if (focusedRef.current && !node.contains(document.activeElement)) focusFirst(node);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const previousFocus = useRef(null);
  const isHorizontal = anchor === 'left' || anchor === 'right';

  // Get provider theme for the portal
  let omniCtx;
  try { omniCtx = useOmniDesign(); } catch { omniCtx = null; }
  const providerTheme = omniCtx?.theme || 'Default';
  const providerStyle = omniCtx?.style || 'Modern';

  const sizeKey = SIZE_DIMENSION[size] ? size : 'medium';

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Without a backdrop the drawer is NOT modal — what the docs already said
     ("it stops trapping focus"): the page stays scrollable and focus is not
     pulled in or trapped. Before, it locked scroll and grabbed focus anyway. */
  const modal = !hideBackdrop;

  // Focus management
  useEffect(() => {
    if (!modal) return;
    if (open) {
      previousFocus.current = document.activeElement;
      requestAnimationFrame(() => {
        focusFirst(drawerRef.current);
        focusedRef.current = true;
      });
    } else if (previousFocus.current) {
      focusedRef.current = false;
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [open, modal]);

  // Lock body scroll
  useEffect(() => {
    if (open && modal) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = orig; };
    }
  }, [open, modal]);

  // Focus trap
  const handleKeyDown = useCallback((e) => {
    if (!modal || e.key !== 'Tab' || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, [modal]);

  if (!open) return null;

  const edge = BORDER_SIDE[anchor] ? anchor : 'left';
  return (
    <>
      {/* Backdrop */}
      {!hideBackdrop && (
        <div onClick={() => onClose?.()} aria-hidden="true" className="omni-dr-backdrop" />
      )}

      {/* Drawer panel */}
      <Part
        ref={setDrawerRef}
        role="dialog"
        aria-modal={modal ? 'true' : undefined}
        tabIndex={-1}
        data-theme={providerTheme}
        data-style={providerStyle}
        data-surface={surface}
        onKeyDown={handleKeyDown}
        className={'drawer drawer-' + size + ' drawer-' + anchor
          + ' omni-dr omni-dr-' + edge + ' omni-dr-' + (isHorizontal ? 'h-' : 'v-') + sizeKey + (hideBackdrop ? ' omni-dr-flat' : '')
          + ' ' + className}
        sx={sx}
        {...props}
      >
        {children}
      </Part>
    </>
  );
}

/* ─── DrawerClose ─── */
export function DrawerClose({ onClick, className = '', sx, ...props }) {
  useStaticStyles('omni-drawer');
  return (
    <Part className={'omni-dr-close' + (className ? ' ' + className : '')} sx={sx} {...props}>
      <Button iconOnly variant="ghost" size="small" onClick={onClick} aria-label="Close drawer">
        <Icon size="small"><CloseIcon /></Icon>
      </Button>
    </Part>
  );
}

/* ─── DrawerHeader ─── */
export function DrawerHeader({ children, className = '', sx, ...props }) {
  useStaticStyles('omni-drawer');
  return (
    <Part className={'drawer-header omni-dr-header ' + className} sx={sx} {...props}>
      {children}
    </Part>
  );
}

/* ─── DrawerContent ─── */
export function DrawerContent({ children, className = '', sx, ...props }) {
  useStaticStyles('omni-drawer');
  return (
    <Part className={'drawer-content omni-dr-content ' + className} sx={sx} {...props}>
      {children}
    </Part>
  );
}

export default Drawer;
