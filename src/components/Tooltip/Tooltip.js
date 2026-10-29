// src/components/Tooltip/Tooltip.js
import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { tokenSegment } from '../_shadows';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox, lazyFallback } from '../_lazyFallback';
import { computePosition } from './position';

/**
 * Tooltip Component
 *
 * STYLES:
 *   solid    data-theme: the bare palette + data-surface="Surface"
 *            bg: var(--Buttons-{C}-Button)  text: var(--Buttons-{C}-Text)
 *
 *   One style, as Figma's Tooltip. `light` and `outline` were removed
 *   (2026-10-26): they render the solid tooltip and warn once in development.
 *   A rich, light panel on hover is a hover card — the Popover with
 *   role="tooltip" (see AvatarGroup) — not a tooltip.
 *
 * COLOR defaults to `black-white`, which is the mode Figma pins on
 * `Button-Theme-Tooltip`. Pass another palette to recolor — that is the code
 * equivalent of re-pinning the Buttons mode on that frame.
 *
 * SIZES: small | medium | large
 * PLACEMENT: 12 positions — Figma's Location: Top-Middle = top, Top-Left =
 *   top-start, Top-Right = top-end, Left-Top = left-start … Bottom-Center =
 *   bottom. The arrow stays on every one.
 * ICONS: `icon` (Leading Icon) and `trailingIcon` (Trailing Icon), 24px.
 * ARROW: boolean, default TRUE — every Figma variant carries the arrow
 * OPEN: undefined (uncontrolled) | true | false
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const warnedVariants = new Set();
function warnVariantOnce(v) {
  if (process.env.NODE_ENV === 'production' || warnedVariants.has(v)) return;
  warnedVariants.add(v);
  // eslint-disable-next-line no-console
  console.warn('[Tooltip] variant="' + v + '" was removed — a tooltip has one style. Rendering the solid tooltip. For a light panel on hover, use Popover with role="tooltip".');
}

/* `black-white` capitalises to `Black-white`, which is not a token — the design
   system emits --Buttons-BlackWhite-*. Same shared mapping Button uses, rather
   than a second copy of the special case here. */
const seg = tokenSegment;

const SOLID_THEME_MAP = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  /* Bare, like the other four. The -Medium shades were removed and these
     bound nothing, so a solid info tooltip took the page's palette instead of
     Info — the same hole the light map above was already fixed for. */
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

/* The design system owns the geometry; the literals are the values it emits, as
   fallbacks for an older system with no Tooltip tokens.
   The height's token is `Tooltip-Arrow-Height`. It was `Tooltip-Arrow` until the
   width got its own, at which point a bare `Arrow` no longer said which
   dimension it meant.
   `arrowSize` is gone. It was ONE number driving MUI's `fontSize`, from which
   MUI derives `width: 1em; height: 0.71em` — a rotated square. That can express
   neither the 2:1 the design draws nor a width and height that move apart, so
   the arrow now takes both dimensions explicitly. */
const SIZE_MAP = {
  small: {
    fontSize: '12px',
    py: 'var(--Sm-Tooltip-Padding, 4px)',
    px: 'var(--Sm-Tooltip-Padding, 4px)',
    gap: 'var(--Sm-Tooltip-Gap, 2px)',
    arrowW: 'var(--Sm-Tooltip-Arrow-Width, 12px)',
    arrowH: 'var(--Sm-Tooltip-Arrow-Height, 6px)',
    arrowVisible: 'var(--Sm-Tooltip-Visible-Arrow-Height, 4px)',
    maxWidth: 200,
  },
  medium: {
    fontSize: '13px',
    py: 'var(--Tooltip-Padding, 8px)',
    px: 'var(--Tooltip-Padding, 8px)',
    gap: 'var(--Tooltip-Gap, 4px)',
    arrowW: 'var(--Tooltip-Arrow-Width, 16px)',
    arrowH: 'var(--Tooltip-Arrow-Height, 8px)',
    arrowVisible: 'var(--Tooltip-Visible-Arrow-Height, 6px)',
    maxWidth: 280,
  },
  large: {
    fontSize: '14px',
    py: 'var(--Lg-Tooltip-Padding, 12px)',
    px: 'var(--Lg-Tooltip-Padding, 12px)',
    gap: 'var(--Lg-Tooltip-Gap, 8px)',
    arrowW: 'var(--Lg-Tooltip-Arrow-Width, 20px)',
    arrowH: 'var(--Lg-Tooltip-Arrow-Height, 10px)',
    arrowVisible: 'var(--Lg-Tooltip-Visible-Arrow-Height, 7px)',
    maxWidth: 360,
  },
};


const SxBox = lazySxBox('Tooltip');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Props only MUI's Tooltip understands. A caller passing one gets the MUI
   version, loaded on demand — nothing that worked before breaks. */
const TooltipMui = lazyFallback('Tooltip', () => import('./Tooltip.mui'));
const MUI_ONLY = ['slots', 'slotProps', 'components', 'componentsProps', 'classes', 'TransitionComponent', 'TransitionProps', 'PopperComponent', 'followCursor'];
const POPPER_PROPS_HANDLED = ['disablePortal', 'container', 'className', 'style'];
const needsMui = (p) => MUI_ONLY.some((k) => p[k] !== undefined)
  || (p.PopperProps && Object.keys(p.PopperProps).some((k) => !POPPER_PROPS_HANDLED.includes(k)));

/* ─── Static sheet ───
   The popper, the tooltip box and the arrow keep MUI's class names (the
   parity page and consumers style them) and the computed styles MUI's own
   rules gave them: Roboto 11px / 500 / white, overflow-wrap: break-word,
   4px corners, z-index 1500 — inherited by anything the bubble does not
   restate. The bubble is the design's; its fill comes from the Buttons
   collection (--_tt-fill / --_tt-ink, declared on the bubble so they resolve
   against its own theme), the arrow's from --_tt-arrow on the box (which sits
   outside the bubble's data-theme, where the arrow is). */
const SIDES = ['top', 'bottom', 'left', 'right'];
const ORIGIN = { left: 'right center', right: 'left center', top: 'center bottom', bottom: 'center top' };
const MARGIN_SIDE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const ARROW_ORIGIN = { bottom: '0 100%', top: '100% 0', right: '100% 100%', left: '0 0' };
const BODY_STEP = { small: 'Body-Small', medium: 'Body-Medium', large: 'Body-Large' };
const P = (side) => `.omni-tt-popper[data-popper-placement*="${side}"]`;

registerStaticStyles('omni-tooltip', [
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-tt-${k}{--_tt-aw:${v.arrowW};--_tt-av:${v.arrowVisible}}`),
  '.omni-tt-popper{z-index:1500;pointer-events:auto}',
  '.omni-tt-popper.omni-tt-shut{pointer-events:none}',
  '.omni-tt{border-radius:4px;color:#fff;font-family:"Roboto","Helvetica","Arial",sans-serif;font-size:0.6875rem;'
    + 'overflow-wrap:break-word;font-weight:500;margin:2px;background-color:transparent;padding:0;max-width:none;box-shadow:none;--_tt-gap:0px}',
  '.omni-tt.omni-tt-arrowed{position:relative;margin:0;--_tt-gap:var(--_tt-av)}',
  '.omni-tt.MuiTooltip-touch{font-size:0.875rem;line-height:1.14286em;font-weight:400}',
  /* PlainTooltip: MUI's own default tooltip, as CodeBlock's copy button has
     always shown it — grey, 14px off the anchor, no arrow. */
  '.omni-tt-plain{background-color:rgba(97, 97, 97, 0.92);border-radius:4px;color:#fff;font-family:"Roboto","Helvetica","Arial",sans-serif;'
    + 'padding:4px 8px;font-size:0.6875rem;max-width:300px;margin:2px;overflow-wrap:break-word;font-weight:500}',
  '.omni-tt-plain.MuiTooltip-touch{padding:8px 16px;font-size:0.875rem;line-height:1.14286em;font-weight:400}',
  ...SIDES.map((s) => `${P(s)} .omni-tt-plain{transform-origin:${ORIGIN[s]};margin-${MARGIN_SIDE[s]}:14px}`),
  ...SIDES.map((s) => `${P(s)} .omni-tt-plain.MuiTooltip-touch{margin-${MARGIN_SIDE[s]}:24px}`),
  /* The arrow TIP touches the anchor: the box stands off by the visible arrow
     and nothing more. There is no offset token — the distance is the arrow. */
  ...SIDES.map((s) => `${P(s)} .omni-tt{transform-origin:${ORIGIN[s]};margin-${MARGIN_SIDE[s]}:var(--_tt-gap)}`),
  /* The ARROW BOX carries the design's two dimensions; `arrowVisible` is how
     much protrudes, and the margin is minus the box, so the arrow sits flush
     on the box's edge. */
  '.omni-tt-arrow{overflow:hidden;position:absolute;box-sizing:border-box;color:var(--_tt-arrow);width:var(--_tt-aw);height:var(--_tt-av)}',
  '.omni-tt-arrow::before{content:"";margin:auto;display:block;width:100%;height:100%;background-color:var(--_tt-arrow);'
    + 'transform:rotate(45deg);border:none;box-sizing:border-box}',
  `${P('bottom')} .omni-tt-arrow{top:0;width:var(--_tt-aw);height:var(--_tt-av);margin-top:calc(-1 * var(--_tt-av))}`,
  `${P('top')} .omni-tt-arrow{bottom:0;width:var(--_tt-aw);height:var(--_tt-av);margin-bottom:calc(-1 * var(--_tt-av))}`,
  `${P('right')} .omni-tt-arrow{left:0;width:var(--_tt-av);height:var(--_tt-aw);margin-left:calc(-1 * var(--_tt-av))}`,
  `${P('left')} .omni-tt-arrow{right:0;width:var(--_tt-av);height:var(--_tt-aw);margin-right:calc(-1 * var(--_tt-av))}`,
  ...SIDES.map((s) => `${P(s)} .omni-tt-arrow::before{transform-origin:${ARROW_ORIGIN[s]}}`),
  /* The bubble. Its fill is stated with the zone attributes too: the design
     system paints every [data-surface] element its Background and Text, which
     beat a single class and turned the black-white bubble the page's color.
     The doubled class keeps the fill out of a caller's sx, as it always was.
     --Tooltip-Radius, not --Style-Border-Radius: the design pins the corner
     flat at 8 at every size and brand; the fallback keeps older systems on
     what they shipped with. The face is the Body style (Figma's Dynamic Body),
     not MUI's Roboto. Elevation 2 — the resting level of the AppBar, Toolbars,
     Menus group a tooltip shares. */
  '.omni-tt-bubble.omni-tt-bubble,.omni-tt-bubble[data-surface],.omni-tt-bubble[data-theme][data-surface]{background-color:var(--_tt-fill);color:var(--_tt-ink)}',
  '.omni-tt-bubble{border:none;border-radius:var(--Tooltip-Radius, var(--Style-Border-Radius));'
    + 'font-family:var(--Body-Font-Family, var(--Font-Family-Body, inherit));display:flex;-webkit-box-align:center;align-items:center;box-shadow:var(--Effect-Level-2)}',
  ...Object.entries(SIZE_MAP).map(([k, v]) => {
    const b = BODY_STEP[k];
    return `.omni-tt-bubble-${k}{font-size:var(--${b}-Font-Size, ${v.fontSize});font-weight:var(--${b}-Font-Weight, 400);`
      + `line-height:var(--${b}-Line-Height, 1.5);letter-spacing:var(--${b}-Letter-Spacing, normal);`
      + `padding:${v.py} ${v.px};max-width:${v.maxWidth}px;gap:${v.gap}}`;
  }),
  '.omni-tt-icon{display:inline-flex;flex-shrink:0}',
  '.omni-tt-icon .MuiSvgIcon-root{font-size:24px}',
  '.omni-tt-label{padding:0 var(--Sizing-Half, 4px)}',
  /* In place: the bubble at the placement's side of the child, centred on it,
     standing off by the visible arrow; the arrow is a triangle in the
     bubble's fill on the facing edge. */
  '.omni-tt-inline{position:relative;display:inline-flex}',
  '.omni-tt-inline-box{position:absolute;z-index:1;pointer-events:none;white-space:nowrap}',
  '.omni-tt-at-left{right:calc(100% + var(--_tt-av));top:50%;transform:translateY(-50%)}',
  '.omni-tt-at-right{left:calc(100% + var(--_tt-av));top:50%;transform:translateY(-50%)}',
  '.omni-tt-at-top{bottom:calc(100% + var(--_tt-av));left:50%;transform:translateX(-50%)}',
  '.omni-tt-at-bottom{top:calc(100% + var(--_tt-av));left:50%;transform:translateX(-50%)}',
  '.omni-tt-tip{position:absolute;background-color:var(--_tt-arrow);width:var(--_tt-aw);height:var(--_tt-av)}',
  '.omni-tt-at-left>.omni-tt-tip,.omni-tt-at-right>.omni-tt-tip{width:var(--_tt-av);height:var(--_tt-aw)}',
  '.omni-tt-at-left>.omni-tt-tip{left:100%;top:50%;transform:translateY(-50%);clip-path:polygon(0 0, 100% 50%, 0 100%)}',
  '.omni-tt-at-right>.omni-tt-tip{right:100%;top:50%;transform:translateY(-50%);clip-path:polygon(100% 0, 0 50%, 100% 100%)}',
  '.omni-tt-at-top>.omni-tt-tip{top:100%;left:50%;transform:translateX(-50%);clip-path:polygon(0 0, 100% 0, 50% 100%)}',
  '.omni-tt-at-bottom>.omni-tt-tip{bottom:100%;left:50%;transform:translateX(-50%);clip-path:polygon(0 100%, 100% 100%, 50% 0)}',
].join('\n'));

/* ─── Behaviour, as MUI's Tooltip had it ───
   Hover (enterDelay, then open; leaveDelay, then close; the panel itself is
   hoverable), keyboard focus (only when :focus-visible), touch (a 700ms long
   press, closing 1500ms after the finger lifts), Escape. Recently-closed
   hysteresis: within 800ms of one tooltip closing, the next opens after
   enterNextDelay instead of enterDelay. */
let hysteresisOpen = false;
let hysteresisTimer = null;
const SHORTEST = 150; // theme.transitions.duration.shortest
const ENTER_MS = 200; // theme.transitions.duration.shorter — the Grow
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const growScale = (v) => `scale(${v}, ${v ** 2})`;

function useTimer() {
  const ref = useRef(null);
  const clear = useCallback(() => { if (ref.current) { clearTimeout(ref.current); ref.current = null; } }, []);
  const start = useCallback((ms, fn) => { clear(); ref.current = setTimeout(() => { ref.current = null; fn(); }, ms); }, [clear]);
  useEffect(() => clear, [clear]);
  return useMemo(() => ({ start, clear }), [start, clear]);
}

const isFocusVisible = (el) => { try { return el.matches(':focus-visible'); } catch (e) { return false; } };
const elementRef = (el) => (parseInt(React.version, 10) >= 19 ? el?.props?.ref : el?.ref) || null;
function setRef(ref, v) { if (typeof ref === 'function') ref(v); else if (ref) ref.current = v; }
const compose = (handler, own) => (event, ...rest) => { if (own) own(event, ...rest); handler(event, ...rest); };

/* The enter / exit of MUI's Grow: from opacity 0 at scale(0.75, 0.5625) to 1
   and none, opacity over 200ms and transform over two thirds of it; leaving,
   the transform waits a third. Its state lives here, below the Popper, so a
   step of the animation re-renders only this box — the panel is positioned
   when the TOOLTIP renders (as MUI's was), not again mid-animation. */
const GrowBox = React.forwardRef(function GrowBox({ in: inProp, onEnter, onExited, className, style, children }, ref) {
  const nodeRef = useRef(null);
  const [state, setState] = useState('exited');
  const timer = useTimer();
  useLayoutEffect(() => {
    const n = nodeRef.current;
    if (inProp && (state === 'exited' || state === 'exiting')) {
      if (!n) return;
      n.scrollTop; // eslint-disable-line no-unused-expressions -- reflow, so the transition starts from the start
      n.style.transition = `opacity ${ENTER_MS}ms ${EASE} 0ms,transform ${Math.round(ENTER_MS * 0.666)}ms ${EASE} 0ms`;
      if (onEnter) onEnter();
      setState('entering');
      timer.start(ENTER_MS, () => setState('entered'));
    } else if (!inProp && (state === 'entering' || state === 'entered')) {
      if (n) {
        n.style.transition = `opacity ${ENTER_MS}ms ${EASE} 0ms,transform ${Math.round(ENTER_MS * 0.666)}ms ${EASE} ${Math.round(ENTER_MS * 0.333)}ms`;
        n.style.opacity = 0;
        n.style.transform = growScale(0.75);
      }
      setState('exiting');
      timer.start(ENTER_MS, () => {
        if (nodeRef.current) nodeRef.current.style.transition = '';
        setState('exited');
        if (onExited) onExited();
      });
    }
  });
  const grow = state === 'entering' ? { opacity: 1, transform: growScale(1) }
    : state === 'entered' ? { opacity: 1, transform: 'none' }
      : { opacity: 0, transform: growScale(0.75), ...(state === 'exited' && !inProp ? { visibility: 'hidden' } : null) };
  const setRefs = useCallback((node) => { nodeRef.current = node; setRef(ref, node); }, [ref]);
  return <div ref={setRefs} className={className} style={{ ...grow, ...style }}>{children}</div>;
});

/* The floating part: positioned against the anchor (see position.js) when it
   renders and on scroll / resize, portalled to the anchor's <body>. Mounted
   from open until the exit has run. */
function Popper({ anchor, open, placement, arrow, id, sizeKey, arrowColor, plain, touch, interactive, listeners, PopperProps = {}, children }) {
  const [exited, setExited] = useState(true);
  const mounted = open || !exited;
  const popperRef = useRef(null);
  const arrowRef = useRef(null);
  const place = useCallback(() => {
    const p = popperRef.current;
    if (!p || !anchor) return;
    let side = placement;
    for (let i = 0; i < 3; i++) {
      p.setAttribute('data-popper-placement', side);
      const next = computePosition({ reference: anchor, popper: p, arrow: arrowRef.current, placement, altBoundary: !!PopperProps.disablePortal });
      if (next === side) break;
      side = next;
    }
  }, [anchor, placement, PopperProps.disablePortal]);
  useLayoutEffect(() => { if (mounted) place(); });
  useEffect(() => {
    if (!mounted) return undefined;
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    /* Content replaced inside the panel (a bubble with sx swaps in its MUI
       box when that loads) can change its size: place it again. */
    const mo = typeof MutationObserver !== 'undefined' && popperRef.current ? new MutationObserver(place) : null;
    if (mo) mo.observe(popperRef.current, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      if (mo) mo.disconnect();
    };
  }, [mounted, place]);
  if (!mounted || !anchor) return null;
  const base = placement.split('-')[0];
  const panel = (
    <div
      ref={popperRef}
      role="tooltip"
      id={id}
      className={'MuiPopper-root MuiTooltip-popper' + (interactive ? ' MuiTooltip-popperInteractive' : '') + (arrow ? ' MuiTooltip-popperArrow' : '')
        + ' omni-tt-popper' + (open && interactive ? '' : ' omni-tt-shut') + (PopperProps.className ? ' ' + PopperProps.className : '')}
      style={{ position: 'fixed', top: 0, left: 0, ...PopperProps.style }}
      {...listeners}
    >
      <GrowBox
        in={open}
        onEnter={() => setExited(false)}
        onExited={() => setExited(true)}
        className={'MuiTooltip-tooltip' + (arrow ? ' MuiTooltip-tooltipArrow' : '') + (touch ? ' MuiTooltip-touch' : '')
          + ' MuiTooltip-tooltipPlacement' + base.charAt(0).toUpperCase() + base.slice(1)
          + (plain ? ' omni-tt-plain' : ' omni-tt omni-tt-' + sizeKey + (arrow ? ' omni-tt-arrowed' : ''))}
        style={plain ? undefined : { '--_tt-arrow': arrowColor }}
      >
        {children}
        {arrow ? <span ref={arrowRef} className="MuiTooltip-arrow omni-tt-arrow" /> : null}
      </GrowBox>
    </div>
  );
  if (PopperProps.disablePortal) return panel;
  const container = PopperProps.container || (anchor.ownerDocument || document).body;
  return ReactDOM.createPortal(panel, typeof container === 'function' ? container() : container);
}

function PortalTooltip({
  children: childrenProp, bubble, placement, arrow, sizeKey, arrowColor, plain = false,
  open: openProp, enterDelay, leaveDelay, enterNextDelay = 0, enterTouchDelay = 700, leaveTouchDelay = 1500,
  describeChild, disableFocusListener = false, disableHoverListener = false, disableInteractive = false,
  disableTouchListener = false, onOpen, onClose, id: idProp, PopperProps, ...other
}) {
  const children = React.isValidElement(childrenProp) ? childrenProp : <span>{childrenProp}</span>;
  const [childNode, setChildNode] = useState(null);
  const ignoreNonTouch = useRef(false);
  const closeTimer = useTimer();
  const enterTimer = useTimer();
  const leaveTimer = useTimer();
  const touchTimer = useTimer();
  const controlled = useRef(openProp !== undefined).current;
  const [openState, setOpenState] = useState(false);
  let open = controlled ? !!openProp : openState;
  const reactId = useId();
  const id = idProp ?? reactId;
  const prevUserSelect = useRef();

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- process.env never changes
    useEffect(() => {
      if (childNode && childNode.disabled && !controlled && bubble !== '' && childNode.tagName.toLowerCase() === 'button') {
        // eslint-disable-next-line no-console
        console.warn(['MUI: You are providing a disabled `button` child to the Tooltip component.', 'A disabled element does not fire events.', "Tooltip needs to listen to the child element's events to display the title.", '', 'Add a simple wrapper element, such as a `span`.'].join('\n'));
      }
    }, [bubble, childNode, controlled]);
  }

  const stopTouch = useCallback(() => {
    if (prevUserSelect.current !== undefined) {
      document.body.style.WebkitUserSelect = prevUserSelect.current;
      prevUserSelect.current = undefined;
    }
    touchTimer.clear();
  }, [touchTimer]);
  useEffect(() => stopTouch, [stopTouch]);

  const openRef = useRef(open);
  openRef.current = open;
  const handleOpen = (event) => {
    if (hysteresisTimer) { clearTimeout(hysteresisTimer); hysteresisTimer = null; }
    hysteresisOpen = true;
    if (!controlled) setOpenState(true);
    if (onOpen && !openRef.current) onOpen(event);
  };
  const handleClose = useCallback((event) => {
    if (hysteresisTimer) clearTimeout(hysteresisTimer);
    hysteresisTimer = setTimeout(() => { hysteresisOpen = false; hysteresisTimer = null; }, 800 + leaveDelay);
    if (!controlled) setOpenState(false);
    if (onClose && openRef.current) onClose(event);
    closeTimer.start(SHORTEST, () => { ignoreNonTouch.current = false; });
  }, [controlled, leaveDelay, onClose, closeTimer]);

  const handleMouseOver = (event) => {
    if (ignoreNonTouch.current && event.type !== 'touchstart') return;
    // The child's own title goes now, so two tooltips never show at once.
    if (childNode) childNode.removeAttribute('title');
    enterTimer.clear();
    leaveTimer.clear();
    if (enterDelay || (hysteresisOpen && enterNextDelay)) {
      enterTimer.start(hysteresisOpen ? enterNextDelay : enterDelay, () => handleOpen(event));
    } else {
      handleOpen(event);
    }
  };
  const handleMouseLeave = (event) => {
    enterTimer.clear();
    leaveTimer.start(leaveDelay, () => handleClose(event));
  };
  /* Never read: the re-render it causes re-places the panel when keyboard
     focus arrives or leaves, as MUI's Tooltip did. */
  const [, setChildIsFocusVisible] = useState(false);
  const handleBlur = (event) => {
    const target = event?.target ?? childNode;
    if (!target || !isFocusVisible(target)) {
      setChildIsFocusVisible(false);
      handleMouseLeave(event ?? new Event('blur'));
    }
  };
  const handleFocus = (event) => {
    if (!childNode) setChildNode(event.currentTarget);
    if (isFocusVisible(event.target)) {
      setChildIsFocusVisible(true);
      handleMouseOver(event);
    }
  };
  const detectTouchStart = (event) => {
    ignoreNonTouch.current = true;
    if (children.props.onTouchStart) children.props.onTouchStart(event);
  };
  const handleTouchStart = (event) => {
    detectTouchStart(event);
    leaveTimer.clear();
    closeTimer.clear();
    stopTouch();
    prevUserSelect.current = document.body.style.WebkitUserSelect;
    document.body.style.WebkitUserSelect = 'none';
    touchTimer.start(enterTouchDelay, () => {
      document.body.style.WebkitUserSelect = prevUserSelect.current;
      handleMouseOver(event);
    });
  };
  const handleTouchEnd = (event) => {
    if (children.props.onTouchEnd) children.props.onTouchEnd(event);
    stopTouch();
    leaveTimer.start(leaveTouchDelay, () => handleClose(event));
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(e); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleClose, open]);

  const ownRef = elementRef(children);
  const handleRef = useCallback((node) => { setRef(ownRef, node); setChildNode(node); }, [ownRef]);

  // No point showing an empty tooltip.
  if (!bubble && bubble !== 0) open = false;

  /* A string title names the child (aria-label); a node — the bubble —
     LABELS it while open (aria-labelledby). With describeChild it describes
     instead. Exactly MUI's rules, including an empty string. */
  const titleIsString = typeof bubble === 'string';
  const nameOrDesc = describeChild
    ? { title: !open && titleIsString && !disableHoverListener ? bubble : null, 'aria-describedby': open ? id : null }
    : { 'aria-label': titleIsString ? bubble : null, 'aria-labelledby': open && !titleIsString ? id : null };
  const childProps = {
    ...nameOrDesc,
    ...other,
    ...children.props,
    className: [other.className, children.props.className].filter(Boolean).join(' '),
    onTouchStart: detectTouchStart,
    ref: handleRef,
  };
  if (process.env.NODE_ENV !== 'production') {
    childProps['data-mui-internal-clone-element'] = true;
    // eslint-disable-next-line react-hooks/rules-of-hooks -- process.env never changes
    useEffect(() => {
      if (childNode && !childNode.getAttribute('data-mui-internal-clone-element')) {
        // eslint-disable-next-line no-console
        console.error(['MUI: The `children` component of the Tooltip is not forwarding its props correctly.', 'Please make sure that props are spread on the same element that the ref is applied to.'].join('\n'));
      }
    }, [childNode]);
    if (children.props.title) {
      // eslint-disable-next-line no-console
      console.error(['MUI: You have provided a `title` prop to the child of <Tooltip />.', `Remove this title prop \`${children.props.title}\` or the Tooltip component.`].join('\n'));
    }
  }
  const interactive = !disableInteractive;
  const listeners = {};
  if (!disableTouchListener) {
    childProps.onTouchStart = handleTouchStart;
    childProps.onTouchEnd = handleTouchEnd;
  }
  if (!disableHoverListener) {
    childProps.onMouseOver = compose(handleMouseOver, childProps.onMouseOver);
    childProps.onMouseLeave = compose(handleMouseLeave, childProps.onMouseLeave);
    if (interactive) { listeners.onMouseOver = handleMouseOver; listeners.onMouseLeave = handleMouseLeave; }
  }
  if (!disableFocusListener) {
    childProps.onFocus = compose(handleFocus, childProps.onFocus);
    childProps.onBlur = compose(handleBlur, childProps.onBlur);
    if (interactive) { listeners.onFocus = handleFocus; listeners.onBlur = handleBlur; }
  }

  return (
    <>
      {React.cloneElement(children, childProps)}
      <Popper
        anchor={childNode}
        open={childNode ? open : false}
        placement={placement}
        arrow={arrow}
        id={id}
        sizeKey={sizeKey}
        arrowColor={arrowColor}
        plain={plain}
        touch={ignoreNonTouch.current}
        interactive={interactive}
        listeners={listeners}
        PopperProps={PopperProps}
      >
        {bubble}
      </Popper>
    </>
  );
}

/** MUI's default tooltip — a grey string label below the anchor, no arrow —
 *  without MUI. Internal: CodeBlock's copy button. */
export function PlainTooltip({ title, children, placement = 'bottom', enterDelay = 100, leaveDelay = 0, ...props }) {
  useStaticStyles('omni-tooltip');
  return (
    <PortalTooltip bubble={title} plain placement={placement} arrow={false} sizeKey="medium" enterDelay={enterDelay} leaveDelay={leaveDelay} {...props}>
      {children}
    </PortalTooltip>
  );
}

export function Tooltip(allProps) {
  useStaticStyles('omni-tooltip');
  if (needsMui(allProps)) return <TooltipMui {...allProps} />;
  return <StaticTooltip {...allProps} />;
}

function StaticTooltip({
  children,
  title,
  /* Figma's Tooltip container: Icon · Text · Icon · Button. `icon` leads
     (Figma's Leading Icon), `trailingIcon` follows the label (Trailing Icon),
     `action` (e.g. a close button) trails; the label sits in a Sizing-Half pad. */
  icon,
  trailingIcon,
  action,
  variant = 'solid',
  color = 'black-white',
  size = 'medium',
  placement = 'bottom',
  arrow = true,
  open,
  enterDelay = 100,
  leaveDelay = 0,
  describeChild = false,
  /* Draw the bubble IN PLACE, beside the child, with CSS — no portal and no
     positioning. For a tooltip inside a scaled preview: portalled it escapes
     the transform and draws at full size, and measuring in place works in
     screen pixels, so it lands far from a scaled anchor. Placed by CSS, it
     scales with everything around it. Shown when `open`; a real page keeps
     the portal, so no clipped ancestor can cut the bubble off. */
  inline = false,
  className = '',
  sx,
  ...props
}) {
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  if (variant !== 'solid') warnVariantOnce(variant);
  const C = seg(color);
  const dataTheme = SOLID_THEME_MAP[color];

  /* The bubble and its label come from the BUTTONS collection, which is what
     Figma binds: `Button-Theme-Tooltip` pins a Buttons mode (black-white by
     default) and every fill under it reads Buttons::Button, with the label and
     icon on Buttons::Text. They were --Background / --Text — the SURFACE —
     which painted a tooltip the color of the page it floated over and gave
     the consumer no way to recolor it. The arrow is part of the bubble, so it
     takes the bubble's fill (in Figma, Polygon 11, bound to the same
     Buttons::Button and seated by a -2 gap). */
  const tooltipBg = 'var(--Buttons-' + C + '-Button)';
  const tooltipText = 'var(--Buttons-' + C + '-Text)';

  const bubbleProps = {
    'data-theme': dataTheme || undefined,
    'data-surface': 'Surface',
    className: 'tooltip-content tooltip-solid tooltip-' + color + ' tooltip-' + size + ' omni-tt-bubble omni-tt-bubble-' + sizeKey + ' ' + className,
    style: { '--_tt-fill': tooltipBg, '--_tt-ink': tooltipText },
  };
  const bubbleKids = (
    <>
      {icon && <div className="tooltip-icon omni-tt-icon" aria-hidden="true">{icon}</div>}
      {/* A string (or anything beside an icon / action) sits in Figma's Text
          frame: Sizing-Half either side. A bare node is the caller's layout. */}
      {typeof title === 'string' || icon || trailingIcon || action
        ? <span className="tooltip-label omni-tt-label">{title}</span>
        : title}
      {trailingIcon && <div className="tooltip-icon tooltip-trailing-icon omni-tt-icon" aria-hidden="true">{trailingIcon}</div>}
      {action}
    </>
  );
  const bubble = title
    ? (hasSx(sx) ? <SxBox sx={sx} {...bubbleProps}>{bubbleKids}</SxBox> : <div {...bubbleProps}>{bubbleKids}</div>)
    : '';

  if (inline) {
    const side = placement.split('-')[0];
    return (
      <span className="omni-tt-inline">
        {children}
        {open && title ? (
          <div role="tooltip" className={'omni-tt-inline-box omni-tt-' + sizeKey + ' omni-tt-at-' + side} style={{ '--_tt-arrow': tooltipBg }}>
            {bubble}
            {arrow && <span aria-hidden="true" className="omni-tt-tip" />}
          </div>
        ) : null}
      </span>
    );
  }

  return (
    <PortalTooltip
      bubble={bubble}
      placement={placement}
      arrow={arrow}
      sizeKey={sizeKey}
      arrowColor={tooltipBg}
      open={open}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      describeChild={describeChild}
      {...props}
    >
      {children}
    </PortalTooltip>
  );
}

// Convenience exports
export const SolidTooltip   = (p) => <Tooltip variant="solid"   {...p} />;

export default Tooltip;
