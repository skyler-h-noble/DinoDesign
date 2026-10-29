// src/components/Dialog/Dialog.js
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */
import { SHADOW_LEVEL_5, SHADOW_SCRIM_LEVEL_5 } from '../_shadows';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from '@omni-design/icons/Close';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazyFallback } from '../_lazyFallback';
import { useOmniDesign } from '../../OmniDesignProvider';
import { IconButton } from '../Button/Button';
import { Body, Subtitle } from '../Typography/Typography';
/* The lib's own icon button — <Button iconOnly> — not MUI's, so hover,
   pressed, focus-visible and disabled all come from Button rather than
   being re-derived at each call site. */

/**
 * Dialog Component
 *
 * SIZES: xs, sm, md, lg, xl, fullScreen
 *   xs: maxWidth 444px    sm: 600px    md: 900px
 *   lg: 1200px            xl: 1536px   fullScreen: 100vw×100vh
 *
 * MODES:
 *   standard  — close icon, Escape key, backdrop click
 *   alert     — no close icon, no Escape, must use action buttons (role="alertdialog")
 *   nonModal  — no backdrop, no focus trap
 *
 * TRANSITIONS: none, fade, grow, zoom, slide-up, slide-down, slide-left, slide-right
 *
 * SCROLL: 'body' (default) or 'paper' (content scrolls inside dialog)
 *
 * TOKENS:
 *   Paper:   bg var(--Container), border var(--Border), radius var(--Style-Border-Radius)
 *   Title:   color var(--Text), border-bottom var(--Border)
 *   Content: color var(--Text)
 *   Actions: border-top var(--Border)
 *   Primary btn:  bg var(--Buttons-Primary-Button), text var(--Buttons-Primary-Text)
 *   Outline btn:  border var(--Border), text var(--Text)
 *
 * Accessibility:
 *   aria-labelledby → DialogTitle id
 *   aria-describedby → DialogContent id
 *   role="dialog" (standard) or role="alertdialog" (alert)
 *   Focus trapped in modal mode, returned to trigger on close
 */

const DIALOG_WIDTH = 'var(--Dialog-Width, 560px)';

const btnBase = {
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '14px',
  borderRadius: 'var(--Style-Border-Radius)',
  padding: '6px 16px',
  cursor: 'pointer',
  border: 'none',
  transition: 'background-color 0.15s, color 0.15s',
  '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '1px' },
};

export const dialogButtonStyles = {
  primary: {
    ...btnBase,
    backgroundColor: 'var(--Buttons-Primary-Button)',
    color: 'var(--Buttons-Primary-Text)',
    border: '1px solid var(--Buttons-Primary-Border)',
    '&:hover': { backgroundColor: 'var(--Buttons-Primary-Hover)' },
    '&:active': { backgroundColor: 'var(--Buttons-Primary-Pressed)' },
    '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
  },
  outline: {
    ...btnBase,
    backgroundColor: 'transparent',
    color: 'var(--Text)',
    border: '1px solid var(--Border)',
    '&:hover': { backgroundColor: 'var(--Hover)' },
    '&:active': { backgroundColor: 'var(--Pressed)' },
    '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
  },
};


const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Props only MUI's Dialog / Modal understand. A caller passing one gets the
   MUI version, loaded on demand — nothing that worked before breaks. */
const DialogMui = lazyFallback('Dialog', () => import('./Dialog.mui'));
const MUI_ONLY = ['slots', 'slotProps', 'components', 'componentsProps', 'classes', 'TransitionComponent', 'TransitionProps',
  'BackdropComponent', 'BackdropProps', 'PaperComponent', 'keepMounted', 'disablePortal', 'container', 'component',
  'onTransitionEnter', 'onTransitionExited', 'closeAfterTransition', 'hideBackdrop', 'disableEnforceFocus',
  'disableEscapeKeyDown', 'fullWidth', 'aria-labelledby', 'aria-describedby', 'aria-modal', 'theme'];
const PAPER_MUI_ONLY = ['component', 'elevation', 'square', 'variant', 'classes'];
/* PaperProps.sx goes to MUI too: an sx'd paper would load its box on demand
   and swap elements under the focus the dialog has just placed on it. */
const needsMui = (p) => MUI_ONLY.some((k) => p[k] !== undefined)
  || (p.PaperProps && (PAPER_MUI_ONLY.some((k) => p.PaperProps[k] !== undefined) || hasSx(p.PaperProps.sx)));

/* MUI's theme numbers, as its Dialog used them. */
const EASE = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};
const ms = (n) => `${Math.round(n)}ms`;
const create = (prop, duration, easing = EASE.easeInOut, delay = 0) => `${prop} ${ms(duration)} ${easing} ${ms(delay)}`;
const BREAKPOINTS = { xs: 444, sm: 600, md: 900, lg: 1200, xl: 1536 };

/* ─── Static sheet ───
   MUI's Modal / Backdrop / Dialog container / Paper rules, as they computed,
   with the design's paper on top: Dialog-Width wide, Card-Radius corners, a
   1px edge in the Background of its Container-Highest zone, the Level 5
   shadow (neutral over the backdrop; a non-modal dialog keeps its tint). The
   1px edge is INSIDE the width, as Figma's stroke is: 560 overall, not 562. */
registerStaticStyles('omni-dialog', [
  '.omni-dlg{position:fixed;z-index:1300;inset:0}',
  '@media print{.omni-dlg{position:absolute !important}}',
  '.omni-dlg-backdrop{position:fixed;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;inset:0;'
    + '-webkit-tap-highlight-color:transparent;z-index:-1;background-color:rgba(0,0,0,0.5)}',
  '.omni-dlg-container{height:100%;outline:0}',
  '@media print{.omni-dlg-container{height:auto}}',
  '.omni-dlg-container-paper{display:flex;-webkit-box-pack:center;justify-content:center;-webkit-box-align:center;align-items:center}',
  '.omni-dlg-container-body{overflow-y:auto;overflow-x:hidden;text-align:center}',
  '.omni-dlg-container-body::after{content:"";display:inline-block;vertical-align:middle;height:100%;width:0}',
  '.omni-dlg-paper{transition:box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);background-image:var(--Paper-overlay);margin:32px;position:relative;'
    + 'background-color:var(--Background);color:var(--Text);border:1px solid var(--Background);'
    + `border-radius:var(--Card-Radius, var(--Style-Border-Radius));box-shadow:${SHADOW_SCRIM_LEVEL_5};overflow:hidden;box-sizing:border-box;`
    + 'max-width:calc(100% - 64px);width:calc(100% - 64px)}',
  '@media print{.omni-dlg-paper{overflow-y:visible;box-shadow:none}}',
  `.omni-dlg-paper-flat{box-shadow:${SHADOW_LEVEL_5}}`,
  '.omni-dlg-paper-paper{display:flex;flex-direction:column;max-height:calc(100% - 64px)}',
  '.omni-dlg-paper-body{display:inline-block;vertical-align:middle;text-align:initial}',
  `.omni-dlg-paper-dialog{max-width:${DIALOG_WIDTH}}`,
  ...Object.entries(BREAKPOINTS).flatMap(([k, px]) => [
    `.omni-dlg-paper-${k}{max-width:${px}px}`,
    `@media (max-width:${px + 64 - 0.05}px){.omni-dlg-paper-${k}.MuiDialog-paperScrollBody{max-width:calc(100% - 64px)}}`,
  ]),
  '.omni-dlg-paper.omni-dlg-paper-full{margin:0;width:100%;max-width:100%;height:100%;max-height:none;border-radius:0;border:none}',
  /* The Container zone, one padded slot: Card-Padding round, Sizing-Half
     between title and body. */
  '.omni-dlg-content{display:flex;flex-direction:column;gap:var(--Sizing-Half, 4px);padding:var(--Card-Padding, 30px)}',
  '.omni-dlg-content[data-surface]{background-color:var(--Background);color:var(--Text)}',
  '.omni-dlg-content-scroll{max-height:400px;overflow-y:auto}',
  '.omni-dlg-content-scroll.omni-dlg-content-full{max-height:none}',
  '.omni-dlg-title{display:flex;align-items:flex-start;-webkit-box-pack:justify;justify-content:space-between;gap:var(--Sizing-1, 8px)}',
  '.omni-dlg-actions{display:flex;-webkit-box-pack:end;justify-content:flex-end;gap:var(--Sizing-1, 8px);margin-top:var(--Sizing-2, 16px)}',
  /* AlertDialog / FormDialog's buttons: dialogButtonStyles, as classes. */
  '.omni-dlg-btn{font-family:inherit;font-weight:500;font-size:14px;border-radius:var(--Style-Border-Radius);padding:6px 16px;'
    + 'cursor:pointer;border:none;transition:background-color 0.15s, color 0.15s}',
  '.omni-dlg-btn-primary{background-color:var(--Buttons-Primary-Button);color:var(--Buttons-Primary-Text);border:1px solid var(--Buttons-Primary-Border)}',
  '.omni-dlg-btn-outline{background-color:transparent;color:var(--Text);border:1px solid var(--Border)}',
  '.omni-dlg-btn:focus-visible{outline:3px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-dlg-btn-primary:hover{background-color:var(--Buttons-Primary-Hover)}',
  '.omni-dlg-btn-outline:hover{background-color:var(--Hover)}',
  '.omni-dlg-btn-primary:active{background-color:var(--Buttons-Primary-Pressed)}',
  '.omni-dlg-btn-outline:active{background-color:var(--Pressed)}',
  '.omni-dlg-btn:disabled{opacity:var(--Disabled, 0.38);cursor:not-allowed}',
].join('\n'));

/* ─── The modal stack (MUI's ModalManager) ───
   Opening hides every other child of <body> from assistive tech
   (aria-hidden), locks the page's scroll (overflow: hidden, the scrollbar's
   width added as padding so nothing shifts), and remembers what to restore.
   Only the TOP dialog answers Escape and keeps focus. */
const stack = [];
let containerInfo = null;
const FORBIDDEN = ['TEMPLATE', 'SCRIPT', 'STYLE', 'LINK', 'MAP', 'META', 'NOSCRIPT', 'PICTURE', 'COL', 'COLGROUP', 'PARAM', 'SLOT', 'SOURCE', 'TRACK'];
const ariaHide = (el, hide) => { if (hide) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden'); };
function ariaHideSiblings(container, current, exclude, hide) {
  [].forEach.call(container.children, (el) => {
    const forbidden = FORBIDDEN.includes(el.tagName) || (el.tagName === 'INPUT' && el.getAttribute('type') === 'hidden');
    if (el !== current && !exclude.includes(el) && !forbidden) ariaHide(el, hide);
  });
}
function lockScroll(container) {
  const restore = [];
  const win = container.ownerDocument.defaultView || window;
  const doc = container.ownerDocument;
  if (win.innerWidth > doc.documentElement.clientWidth) {
    const bar = win.innerWidth - doc.documentElement.clientWidth;
    const pad = (el) => parseFloat(win.getComputedStyle(el).paddingRight) || 0;
    restore.push({ value: container.style.paddingRight, property: 'padding-right', el: container });
    container.style.paddingRight = `${pad(container) + bar}px`;
    [].forEach.call(doc.querySelectorAll('.mui-fixed'), (el) => {
      restore.push({ value: el.style.paddingRight, property: 'padding-right', el });
      el.style.paddingRight = `${pad(el) + bar}px`;
    });
  }
  const parent = container.parentElement;
  const scroller = parent?.nodeName === 'HTML' && win.getComputedStyle(parent).overflowY === 'scroll' ? parent : container;
  restore.push(
    { value: scroller.style.overflow, property: 'overflow', el: scroller },
    { value: scroller.style.overflowX, property: 'overflow-x', el: scroller },
    { value: scroller.style.overflowY, property: 'overflow-y', el: scroller },
  );
  scroller.style.overflow = 'hidden';
  return () => restore.forEach(({ value, el, property }) => {
    if (value) el.style.setProperty(property, value); else el.style.removeProperty(property);
  });
}
const manager = {
  add(modal, container) {
    if (stack.includes(modal)) return;
    stack.push(modal);
    if (modal.root) ariaHide(modal.root, false);
    const hidden = [].filter.call(container.children, (el) => el.getAttribute('aria-hidden') === 'true');
    ariaHideSiblings(container, modal.root, hidden, true);
    if (containerInfo) { containerInfo.modals.push(modal); return; }
    containerInfo = { modals: [modal], container, restore: null, hidden };
  },
  mount(modal, disableScrollLock) {
    if (containerInfo && containerInfo.modals.includes(modal) && !containerInfo.restore) {
      containerInfo.restore = disableScrollLock ? () => {} : lockScroll(containerInfo.container);
    }
  },
  remove(modal) {
    const i = stack.indexOf(modal);
    if (i === -1) return;
    stack.splice(i, 1);
    const info = containerInfo;
    info.modals.splice(info.modals.indexOf(modal), 1);
    if (info.modals.length === 0) {
      if (info.restore) info.restore();
      if (modal.root) ariaHide(modal.root, true);
      ariaHideSiblings(info.container, modal.root, info.hidden, false);
      containerInfo = null;
    } else {
      const top = info.modals[info.modals.length - 1];
      if (top.root) ariaHide(top.root, false);
    }
  },
  isTop: (modal) => stack.length > 0 && stack[stack.length - 1] === modal,
};

/* ─── Transitions (MUI's Fade / Grow / Zoom / Slide, as the Dialog ran them) ─── */
const growScale = (v) => `scale(${v}, ${v ** 2})`;
const TRANSITION_STYLES = {
  fade: { entering: { opacity: 1 }, entered: { opacity: 1 }, exiting: { opacity: 0 }, exited: { opacity: 0 }, hidden: { opacity: 0, visibility: 'hidden' } },
  grow: {
    entering: { opacity: 1, transform: growScale(1) }, entered: { opacity: 1, transform: 'none' },
    exiting: { opacity: 0, transform: growScale(0.75) }, exited: { opacity: 0, transform: growScale(0.75) },
    hidden: { opacity: 0, transform: growScale(0.75), visibility: 'hidden' },
  },
  zoom: {
    entering: { transform: 'none' }, entered: { transform: 'none' }, exiting: { transform: 'scale(0)' }, exited: { transform: 'scale(0)' },
    hidden: { transform: 'scale(0)', visibility: 'hidden' },
  },
  slide: { hidden: { visibility: 'hidden' } },
};
function slideTranslate(direction, node) {
  const win = node.ownerDocument.defaultView || window;
  const prevTransform = node.style.transform;
  const prevTransition = node.style.transition;
  node.style.transition = '';
  node.style.transform = '';
  const rect = node.getBoundingClientRect();
  const t = win.getComputedStyle(node).getPropertyValue('transform');
  node.style.transform = prevTransform;
  node.style.transition = prevTransition;
  let x = 0; let y = 0;
  if (t && t !== 'none') { const v = t.split('(')[1].split(')')[0].split(','); x = parseInt(v[4], 10); y = parseInt(v[5], 10); }
  if (direction === 'left') return `translateX(${win.innerWidth + x - rect.left}px)`;
  if (direction === 'right') return `translateX(-${rect.left + rect.width - x}px)`;
  if (direction === 'up') return `translateY(${win.innerHeight + y - rect.top}px)`;
  return `translateY(-${rect.top + rect.height - y}px)`;
}
const setSlide = (direction, node) => { const v = slideTranslate(direction, node); node.style.webkitTransform = v; node.style.transform = v; };

/** The enter / exit state of one element, applied as MUI's transitions did:
 *  the state's styles on render, the transition itself set on the node. */
function useMuiTransition(inProp, kind, timeout, direction, { onEnter, onExited } = {}) {
  const nodeRef = useRef(null);
  const [state, setState] = useState('exited');
  const timer = useRef(null);
  const started = useRef(false);
  const later = (fn) => { clearTimeout(timer.current); timer.current = setTimeout(fn, timeout); };
  useEffect(() => () => clearTimeout(timer.current), []);
  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (inProp && (state === 'exited' || state === 'exiting') && (started.current || state === 'exited')) {
      if (!node) return;
      started.current = true;
      if (kind === 'slide') setSlide(direction, node);
      node.scrollTop; // eslint-disable-line no-unused-expressions -- reflow: the transition starts from the start
      if (kind === 'fade') node.style.transition = create('opacity', timeout);
      else if (kind === 'grow') node.style.transition = [create('opacity', timeout), create('transform', timeout * 0.666)].join(',');
      else if (kind === 'zoom') node.style.transition = create('transform', timeout);
      if (onEnter) onEnter(node);
      setState('entering');
      if (kind === 'slide') {
        node.style.webkitTransition = create('-webkit-transform', timeout, EASE.easeOut);
        node.style.transition = create('transform', timeout, EASE.easeOut);
        node.style.webkitTransform = 'none';
        node.style.transform = 'none';
      }
      later(() => setState('entered'));
    } else if (!inProp && (state === 'entering' || state === 'entered')) {
      if (node) {
        if (kind === 'fade') node.style.transition = create('opacity', timeout);
        else if (kind === 'grow') {
          node.style.transition = [create('opacity', timeout), create('transform', timeout * 0.666, EASE.easeInOut, timeout * 0.333)].join(',');
          node.style.opacity = 0;
          node.style.transform = growScale(0.75);
        } else if (kind === 'zoom') node.style.transition = create('transform', timeout);
        else if (kind === 'slide') {
          node.style.webkitTransition = create('-webkit-transform', timeout, EASE.sharp);
          node.style.transition = create('transform', timeout, EASE.sharp);
          setSlide(direction, node);
        }
      }
      setState('exiting');
      later(() => {
        const n = nodeRef.current;
        if (n) { n.style.transition = ''; if (kind === 'slide') n.style.webkitTransition = ''; }
        setState('exited');
        started.current = false;
        if (onExited) onExited();
      });
    }
  });
  const styles = TRANSITION_STYLES[kind];
  const style = state === 'exited' && !inProp ? styles.hidden : (styles[state] || styles.exited || {});
  return { nodeRef, style, state };
}

/* ─── Dialog ─── */
export function Dialog(allProps) {
  useStaticStyles('omni-dialog');
  if (needsMui(allProps)) return <DialogMui {...allProps} />;
  return <StaticDialog {...allProps} />;
}

const TRANSITION_KIND = { fade: ['fade'], grow: ['grow'], zoom: ['zoom'], 'slide-up': ['slide', 'up'], 'slide-down': ['slide', 'down'], 'slide-left': ['slide', 'left'], 'slide-right': ['slide', 'right'] };
const TABBABLE = ['input', 'select', 'textarea', 'a[href]', 'button', '[tabindex]', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])'].join(',');
function tabbables(root) {
  const regular = []; const ordered = [];
  Array.from(root.querySelectorAll(TABBABLE)).forEach((node, i) => {
    let ti = parseInt(node.getAttribute('tabindex') || '', 10);
    if (Number.isNaN(ti)) ti = node.contentEditable === 'true' || ((node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO' || node.nodeName === 'DETAILS') && node.getAttribute('tabindex') === null) ? 0 : node.tabIndex;
    if (ti === -1 || node.disabled || (node.tagName === 'INPUT' && node.type === 'hidden')) return;
    if (node.tagName === 'INPUT' && node.type === 'radio' && node.name) {
      const q = (s) => node.ownerDocument.querySelector(`input[type="radio"]${s}`);
      const roving = q(`[name="${node.name}"]:checked`) || q(`[name="${node.name}"]`);
      if (roving !== node) return;
    }
    if (ti === 0) regular.push(node); else ordered.push({ i, ti, node });
  });
  return ordered.sort((a, b) => (a.ti === b.ti ? a.i - b.i : a.ti - b.ti)).map((a) => a.node).concat(regular);
}

function StaticDialog({
  open = false,
  onClose,
  title,
  children,
  actions,
  /* 'dialog' (default) is Figma's Dialog-Width (560); xs / sm / md / lg / xl
     are MUI's wider breakpoints for code that needs them. */
  maxWidth = 'dialog',
  fullScreen = false,
  scroll = 'body',
  alert = false,
  nonModal = false,
  transition,
  transitionDuration = 300,
  titleId = 'dialog-title',
  contentId = 'dialog-description',
  className = '',
  sx,
  PaperProps = {},
  disableAutoFocus = false,
  disableRestoreFocus = false,
  disableScrollLock = false,
  style,
  ...props
}) {
  // Get current theme context so the portal inherits the right tokens
  let omniCtx;
  try { omniCtx = useOmniDesign(); } catch { omniCtx = null; }
  const currentTheme = omniCtx?.theme || 'Default';
  const currentStyle = omniCtx?.style || 'Modern';
  const [kind, direction] = TRANSITION_KIND[transition] || ['fade'];
  const timeout = typeof transitionDuration === 'number' ? transitionDuration : 300;

  const handleClose = (event, reason) => {
    if (alert && reason === 'backdropClick') return;
    if (alert && reason === 'escapeKeyDown') return;
    onClose?.(event, reason);
  };

  /* Mounted from open until the exit has run (MUI's closeAfterTransition):
     the page stays locked and hidden from assistive tech until then. */
  const [exited, setExited] = useState(!open);
  const modal = useRef({}).current;
  const rootRef = useRef(null);
  const container = useMuiTransition(open, kind, timeout, direction, {
    onEnter: () => setExited(false),
    onExited: () => { setExited(true); manager.remove(modal); },
  });
  const backdrop = useMuiTransition(open, 'fade', timeout);
  const mounted = open || !exited;

  useEffect(() => {
    if (!open) return;
    modal.root = rootRef.current;
    manager.add(modal, document.body);
    if (rootRef.current) {
      manager.mount(modal, disableScrollLock);
      rootRef.current.scrollTop = 0;
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => manager.remove(modal), [modal]);

  /* ─── Focus (MUI's FocusTrap) ───
     On open, focus moves to the dialog itself; Tab and Shift+Tab wrap inside
     it (the two sentinels catch focus leaving either end); focus that strays
     outside is pulled back; on close it returns to whatever had it before.
     A non-modal dialog does not hold focus, but still takes and returns it. */
  const containerEl = container.nodeRef;
  const sentinelStart = useRef(null);
  const sentinelEnd = useRef(null);
  const nodeToRestore = useRef(null);
  const reactFocusTarget = useRef(null);
  const activated = useRef(false);
  const ignoreNext = useRef(false);
  const lastKeydown = useRef(null);
  const enforce = !nonModal;
  useEffect(() => {
    if (!open || !containerEl.current) return;
    activated.current = !disableAutoFocus;
  }, [disableAutoFocus, open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    ignoreNext.current = false;
    const root = containerEl.current;
    if (!open || !root) return undefined;
    const target = root.hasAttribute('data-mui-focusable') ? root : (root.querySelector('[data-mui-focusable]') || root);
    if (!root.contains(document.activeElement)) {
      if (!target.hasAttribute('tabIndex')) target.setAttribute('tabIndex', '-1');
      if (activated.current) target.focus();
    }
    return () => {
      if (!disableRestoreFocus) {
        if (nodeToRestore.current && nodeToRestore.current.focus) {
          ignoreNext.current = true;
          nodeToRestore.current.focus();
        }
        nodeToRestore.current = null;
      }
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const root0 = containerEl.current;
    if (!open || !root0) return undefined;
    const doc = root0.ownerDocument;
    const isEnabled = () => manager.isTop(modal);
    const loopFocus = (e) => {
      lastKeydown.current = e;
      if (!enforce || !isEnabled() || e.key !== 'Tab') return;
      if (doc.activeElement === containerEl.current && e.shiftKey) {
        ignoreNext.current = true;
        if (sentinelEnd.current) sentinelEnd.current.focus();
      }
    };
    const contain = () => {
      const root = containerEl.current;
      if (root === null) return;
      const active = doc.activeElement;
      if (!doc.hasFocus() || !isEnabled() || ignoreNext.current) { ignoreNext.current = false; return; }
      if (root.contains(active)) return;
      if (!enforce && active !== sentinelStart.current && active !== sentinelEnd.current) return;
      if (active !== reactFocusTarget.current) reactFocusTarget.current = null;
      else if (reactFocusTarget.current !== null) return;
      if (!activated.current) return;
      const list = active === sentinelStart.current || active === sentinelEnd.current ? tabbables(root) : [];
      if (list.length > 0) {
        const shiftTab = Boolean(lastKeydown.current?.shiftKey && lastKeydown.current?.key === 'Tab');
        (shiftTab ? list[list.length - 1] : list[0]).focus();
      } else {
        root.focus();
      }
    };
    doc.addEventListener('focusin', contain);
    doc.addEventListener('keydown', loopFocus, true);
    const interval = setInterval(() => {
      const active = doc.activeElement;
      if (active && active.tagName === 'BODY') contain();
    }, 50);
    return () => {
      clearInterval(interval);
      doc.removeEventListener('focusin', contain);
      doc.removeEventListener('keydown', loopFocus, true);
    };
  }, [disableAutoFocus, enforce, disableRestoreFocus, open]); // eslint-disable-line react-hooks/exhaustive-deps
  const onTrapFocus = (event) => {
    if (nodeToRestore.current === null) nodeToRestore.current = event.relatedTarget;
    activated.current = true;
    reactFocusTarget.current = event.target;
  };
  const onSentinelFocus = (event) => {
    if (nodeToRestore.current === null) nodeToRestore.current = event.relatedTarget;
    activated.current = true;
  };

  /* Escape (top dialog only) and a click on the backdrop close it — a click
     counts only if it both started and ended on the container itself. */
  const backdropClick = useRef(null);
  const onRootKeyDown = (event) => {
    props.onKeyDown?.(event);
    if (event.key !== 'Escape' || event.which === 229 || !manager.isTop(modal)) return;
    if (!alert) {
      event.stopPropagation();
      handleClose(event, 'escapeKeyDown');
    }
  };
  const onRootClick = (event) => {
    props.onClick?.(event);
    if (!backdropClick.current) return;
    backdropClick.current = null;
    handleClose(event, 'backdropClick');
  };
  const onBackdropOwnClick = (event) => {
    if (event.target !== event.currentTarget) return;
    handleClose(event, 'backdropClick');
  };

  if (!mounted) return null;

  const widthKey = maxWidth === 'dialog' ? 'dialog' : maxWidth;
  const muiWidth = fullScreen || maxWidth === 'dialog' ? 'False' : String(maxWidth).charAt(0).toUpperCase() + String(maxWidth).slice(1);
  const scrollCap = scroll === 'paper' ? 'Paper' : 'Body';
  const { className: paperClass, sx: _paperSx, style: paperStyle, role: paperRole, ...paperRest } = PaperProps;
  const paperProps = {
    ...paperRest,
    role: paperRole || (alert ? 'alertdialog' : 'dialog'),
    'aria-describedby': contentId,
    'aria-labelledby': titleId,
    'aria-modal': true,
    tabIndex: -1,
    'data-mui-focusable': '',
    'data-theme': currentTheme,
    'data-style': currentStyle,
    'data-surface': 'Container-Highest',
    style: paperStyle,
    className: 'MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScroll' + scrollCap
      + ' MuiDialog-paperWidth' + muiWidth + (fullScreen ? ' MuiDialog-paperFullScreen' : ' MuiDialog-paperFullWidth')
      + ' omni-dlg-paper omni-dlg-paper-' + (scroll === 'paper' ? 'paper' : 'body')
      + (fullScreen ? ' omni-dlg-paper-full' : (BREAKPOINTS[widthKey] || widthKey === 'dialog' ? ' omni-dlg-paper-' + widthKey : ''))
      + (nonModal ? ' omni-dlg-paper-flat' : '')
      + (paperClass ? ' ' + paperClass : ''),
  };
  const content = (
    /* Dialog Content — the Container zone, one padded slot. */
    <div className={'dialog-content omni-dlg-content' + (scroll === 'paper' ? ' omni-dlg-content-scroll' + (fullScreen ? ' omni-dlg-content-full' : '') : '')} data-surface="Container">
      {title && (
        <div className="dialog-title omni-dlg-title">
          {/* Figma: Dynamic Subtitle — bold body, in --Text. */}
          <Subtitle component="h2" id={titleId}>{title}</Subtitle>
          {!alert && onClose && (
            <IconButton aria-label="Close dialog" onClick={(e) => onClose(e, 'closeButton')} size="small" variant="ghost">
              <CloseIcon />
            </IconButton>
          )}
        </div>
      )}
      <div id={contentId} className="dialog-body">
        {typeof children === 'string' ? <Body>{children}</Body> : children}
      </div>
      {actions && (
        <div className="dialog-actions omni-dlg-actions">
          {actions}
        </div>
      )}
    </div>
  );

  const { onKeyDown: _k, onClick: _c, ...rootRest } = props;
  return ReactDOM.createPortal(
    <div
      role="presentation"
      {...rootRest}
      ref={rootRef}
      className={'MuiDialog-root dialog dialog-' + maxWidth + (fullScreen ? ' dialog-fullscreen' : '') + (alert ? ' dialog-alert' : '') + (className ? ' ' + className : '')
        + ' MuiModal-root omni-dlg'}
      style={style !== undefined ? style : { zIndex: 10000000 }}
      onKeyDown={onRootKeyDown}
      onClick={onRootClick}
    >
      {!nonModal && (
        <div
          aria-hidden="true"
          ref={backdrop.nodeRef}
          className="MuiBackdrop-root MuiModal-backdrop MuiDialog-backdrop omni-dlg-backdrop"
          style={backdrop.style}
          onClick={onBackdropOwnClick}
        />
      )}
      <div tabIndex={open ? 0 : -1} onFocus={onSentinelFocus} ref={sentinelStart} data-testid="sentinelStart" />
      <div
        ref={container.nodeRef}
        className={'MuiDialog-container MuiDialog-scroll' + scrollCap + ' omni-dlg-container omni-dlg-container-' + (scroll === 'paper' ? 'paper' : 'body')}
        role="presentation"
        tabIndex="-1"
        style={container.style}
        onMouseDown={(event) => { backdropClick.current = event.target === event.currentTarget; }}
        onFocus={onTrapFocus}
      >
        <div {...paperProps}>{content}</div>
      </div>
      <div tabIndex={open ? 0 : -1} onFocus={onSentinelFocus} ref={sentinelEnd} data-testid="sentinelEnd" />
    </div>,
    document.body,
  );
}

/* ─── Convenience: AlertDialog ─── */
export function AlertDialog({
  open, onClose, title, children, confirmText = 'Confirm', cancelText = 'Cancel',
  onConfirm, onCancel, ...rest
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} alert {...rest}
      actions={
        <>
          <button type="button" onClick={onCancel || onClose} className="omni-dlg-btn omni-dlg-btn-outline">{cancelText}</button>
          <button type="button" onClick={onConfirm || onClose} className="omni-dlg-btn omni-dlg-btn-primary">{confirmText}</button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}

/* ─── Convenience: FormDialog ─── */
export function FormDialog({
  open, onClose, title, children, submitText = 'Submit', cancelText = 'Cancel',
  onSubmit, ...rest
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} {...rest}
      actions={
        <>
          <button type="button" onClick={onClose} className="omni-dlg-btn omni-dlg-btn-outline">{cancelText}</button>
          <button type="button" onClick={onSubmit} className="omni-dlg-btn omni-dlg-btn-primary">{submitText}</button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}

export default Dialog;
