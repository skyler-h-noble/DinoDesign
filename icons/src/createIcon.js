// @omni-design/icons — createIcon
//
// One Material icon as a plain <svg>. Same names, same path data and the same
// rendered result as @mui/icons-material (the data is read out of that package
// at build time), without MUI's styling engine: an icon here costs its path,
// not ~70 KB of emotion and MUI system.
//
// It keeps MUI's class names (MuiSvgIcon-root, MuiSvgIcon-fontSize{Size}) so
// every rule written against them — a Button sizing its icon, an Icon wrapper
// inheriting its size — keeps working, and `muiName = 'SvgIcon'`, so the MUI
// components still in use recognise it as an icon.
import * as React from 'react';

const STYLE_ID = 'omni-component-icons';
const CSS = [
  '.omni-svg{user-select:none;width:1em;height:1em;display:inline-block;flex-shrink:0;fill:currentColor;'
    + 'transition:fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms}',
  '.omni-svg-fs-inherit{font-size:inherit}',
  '.omni-svg-fs-small{font-size:1.25rem}',
  '.omni-svg-fs-medium{font-size:1.5rem}',
  '.omni-svg-fs-large{font-size:2.1875rem}',
  /* MUI's palette colors were its OWN theme's (a fixed blue for primary),
     never the brand's. Here they read the design system's icon tokens. */
  '.omni-svg-c-primary{color:var(--Icons-Primary)}',
  '.omni-svg-c-secondary{color:var(--Icons-Secondary)}',
  '.omni-svg-c-error{color:var(--Icons-Error)}',
  '.omni-svg-c-info{color:var(--Icons-Info)}',
  '.omni-svg-c-success{color:var(--Icons-Success)}',
  '.omni-svg-c-warning{color:var(--Icons-Warning)}',
  '.omni-svg-c-action{color:var(--Quiet)}',
  '.omni-svg-c-disabled{color:var(--Quiet);opacity:var(--Disabled, 0.38)}',
].join('\n');

const useEarlyEffect = React.useInsertionEffect || React.useLayoutEffect;
function useIconStyles() {
  useEarlyEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.setAttribute('data-omni-component', '');
    el.textContent = CSS;
    document.head.insertBefore(el, document.head.firstChild);
  }, []);
}

/** The icon sheet as a <style> tag, for a server render's <head>. */
export function getIconStyles() {
  return `<style id="${STYLE_ID}" data-omni-component>${CSS}</style>`;
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const SPACING = { m: 'margin', p: 'padding' };
const SIDES = { t: ['Top'], r: ['Right'], b: ['Bottom'], l: ['Left'], x: ['Left', 'Right'], y: ['Top', 'Bottom'], '': [''] };
const SIZE_KEYS = new Set(['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight']);
let warnedSx = false;

/* The common cases of an MUI `sx` on an icon, as inline style: plain CSS
   properties, the spacing shorthands (m, mr, px … in 8px steps) and MUI's
   number rules (a size of 1 or less is a fraction, other numbers are px).
   Selectors, breakpoints and theme callbacks are MUI-only; they are dropped
   with a warning rather than half-applied. */
function sxToStyle(sx) {
  if (!sx || typeof sx !== 'object' || Array.isArray(sx)) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(sx)) {
    if (v && typeof v === 'object' || typeof v === 'function') {
      if (process.env.NODE_ENV !== 'production' && !warnedSx) {
        warnedSx = true;
        // eslint-disable-next-line no-console
        console.warn('[@omni-design/icons] sx supports plain CSS properties only; "' + k + '" was ignored. Use style, className or a wrapper.');
      }
      continue;
    }
    const m = /^([mp])([trblxy]?)$/.exec(k);
    if (m) {
      const val = typeof v === 'number' ? v * 8 + 'px' : v;
      for (const side of SIDES[m[2]]) out[SPACING[m[1]] + side] = val;
    } else if (SIZE_KEYS.has(k) && typeof v === 'number') {
      out[k] = v > 0 && v <= 1 ? v * 100 + '%' : v + 'px';
    } else if (k === 'fontSize' && typeof v === 'number') {
      out[k] = v + 'px';
    } else {
      out[k] = v;
    }
  }
  return out;
}

function renderNode(node, i) {
  const [type, attrs, children] = node;
  return React.createElement(type, { key: i, ...attrs }, children ? children.map(renderNode) : undefined);
}

export default function createIcon(nodes, displayName) {
  const content = nodes.map(renderNode);
  const Icon = React.forwardRef(function Icon({
    fontSize = 'medium',
    color = 'inherit',
    htmlColor,
    titleAccess,
    viewBox = '0 0 24 24',
    className,
    style,
    sx,
    children,
    ...props
  }, ref) {
    useIconStyles();
    const sxStyle = sxToStyle(sx);
    return React.createElement('svg', {
      ref,
      'data-testid': process.env.NODE_ENV !== 'production' ? displayName + 'Icon' : undefined,
      className: 'MuiSvgIcon-root MuiSvgIcon-fontSize' + cap(fontSize)
        + (color !== 'inherit' ? ' MuiSvgIcon-color' + cap(color) : '')
        + ' omni-svg omni-svg-fs-' + fontSize + (color !== 'inherit' ? ' omni-svg-c-' + color : '')
        + (className ? ' ' + className : ''),
      focusable: 'false',
      color: htmlColor,
      'aria-hidden': titleAccess ? undefined : true,
      role: titleAccess ? 'img' : undefined,
      viewBox,
      style: sxStyle || style ? { ...sxStyle, ...style } : undefined,
      ...props,
    }, content, children, titleAccess ? React.createElement('title', null, titleAccess) : null);
  });
  Icon.displayName = displayName + 'Icon';
  const Memo = React.memo(Icon);
  Memo.muiName = 'SvgIcon';
  return Memo;
}
