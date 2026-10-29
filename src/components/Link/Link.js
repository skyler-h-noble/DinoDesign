// src/components/Link/Link.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('Link');

/**
 * Link Component
 *
 * An anchor element that inherits Typography styles from the design system.
 * Underlined at rest — no option to remove it there.
 *
 * ALLOWED textStyle values (NO headers, display, or eyebrow):
 *   body, body-small, body-large, body-semibold, body-bold
 *   button, label, caption
 *
 * COLORS:
 *   primary    var(--Link, --Hotlink)   — default link color
 *   standard   var(--Text)              — blends with body text
 *   (No quiet: removed — a subdued link is hard to find. color="quiet"
 *   renders as standard and warns once in development.)
 *
 * STATES: hover / pressed → the underline goes away, color unchanged. Focus
 *   keeps it: the ring is added to the resting link, not swapped for it. visited →
 *   var(--Link-Visited, --Hotlink-Visited). The design system emits the
 *   --Hotlink spelling; see the note above COLOR_MAP for why the mapping lives
 *   here and not in CSS.
 * DISABLED: opacity 0.5, pointer-events none
 *
 * TOUCH TARGET:
 *   minHeight: 24px, minWidth: 24px — meets WCAG 2.5.8.
 *   display: inline-flex + alignItems: center so min dimensions
 *   take effect without breaking inline text flow.
 */

const STYLE_MAP = {
  body: {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Body-Line-Height)',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
  },
  'body-small': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Body-Small-Line-Height)',
    fontSize: 'var(--Body-Small-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Small-Letter-Spacing)',
  },
  'body-large': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Body-Large-Line-Height)',
    fontSize: 'var(--Body-Large-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Large-Letter-Spacing)',
  },
  'body-semibold': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Body-Line-Height)',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Semibold-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
  },
  'body-bold': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Body-Line-Height)',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Bold-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
  },
  button: {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Button-Line-Height)',
    fontSize: 'var(--Button-Font-Size)',
    fontWeight: 'var(--Button-Font-Weight)',
    letterSpacing: 'var(--Button-Letter-Spacing)',
  },
  label: {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Label-Line-Height)',
    fontSize: 'var(--Label-Font-Size)',
    fontWeight: 'var(--Label-Font-Weight)',
    letterSpacing: 'var(--Label-Letter-Spacing)',
  },
  caption: {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'var(--Body-Small-Line-Height)',
    fontSize: 'var(--Body-Small-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Small-Letter-Spacing)',
  },
};

/*
 * --Link / --Link-Hover / --Link-Visited are the names THIS component reads.
 * Nothing has ever defined them: the design system emits --Hotlink and
 * --Hotlink-Visited, and no lib stylesheet declares the --Link spelling. So
 * every link resolved to an empty value and simply inherited its parent's
 * color — no error, no fallback, just a link that is not link-colored.
 *
 * Mapped here rather than in CSS on purpose. The studio's export overwrites
 * every stylesheet in the cascade (foundation, core, typography, the mode
 * sheets, base, styles), so an alias added to a lib CSS file is erased by the
 * next export — and the CSS already published for existing design systems is
 * frozen in Storage and can never be regenerated. A var() fallback in the
 * component fixes every system, past and future, without anyone re-exporting.
 *
 * The fallback genuinely applies here: a var() fallback is used only when the
 * variable is UNDEFINED, and --Link truly is. (Contrast --Font-Family-Display,
 * which IS defined and therefore never reaches its fallback.)
 *
 * --Link-Hover is intentionally absent. Links do not change color on hover;
 * the underline goes away instead. Do not add a hover color here — the design
 * system emits no hover tone for links, so any value would be invented rather
 * than derived, and it would land on text that carries a 4.5:1 requirement.
 */
const LINK_BASE    = 'var(--Link, var(--Hotlink))';
const LINK_VISITED = 'var(--Link-Visited, var(--Hotlink-Visited))';

const COLOR_MAP = {
  primary:  { base: LINK_BASE,           visited: LINK_VISITED },
  standard: { base: 'var(--Text)',       visited: LINK_VISITED },
};

export const LINK_STYLES = Object.keys(STYLE_MAP);
export const LINK_COLORS = Object.keys(COLOR_MAP);

let warnedQuiet = false;
function warnQuietOnce() {
  if (warnedQuiet || process.env.NODE_ENV === 'production') return;
  warnedQuiet = true;
  // eslint-disable-next-line no-console
  console.warn('[Link] color="quiet" was removed — a subdued link is hard to find. Rendering color="standard".');
}

/* The static sheet: every declaration the component used to hand emotion per
   render, as plain classes over the same tokens. State rules sit in :where()
   so they weigh what emotion's `&:hover` did (one class + one pseudo-class)
   and a caller's sx state rule still wins over them. */
const kebab = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const decls = (o) => Object.entries(o).map(([k, v]) => `${kebab(k)}:${v}`).join(';');
const ON = '.omni-link:where(:not(.omni-link-off))';

registerStaticStyles('omni-link', [
  // Always underlined; inline-flex so min-height / min-width give the WCAG
  // 2.5.8 touch target while the link still flows in text.
  '.omni-link{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;cursor:pointer;opacity:1;pointer-events:auto;display:inline-flex;align-items:center;min-height:24px;min-width:24px;transition:color 0.15s ease, text-decoration-color 0.15s ease}',
  ...Object.entries(STYLE_MAP).map(([k, t]) => `.omni-link-s-${k}{${decls(t)}}`),
  ...Object.entries(COLOR_MAP).flatMap(([k, c]) => [
    `.omni-link-c-${k}{color:${c.base}}`,
    `.omni-link-c-${k}-v{color:${c.visited}}`,
    `${ON}.omni-link-c-${k}:visited,${ON}.omni-link-c-${k}-v:visited{color:${c.visited}}`,
  ]),
  '.omni-link-off{cursor:not-allowed;opacity:var(--Disabled, 0.38);pointer-events:none}',
  // No color change on hover — deliberate. The design system emits no hover
  // tone for links, and inventing one would put an unverified color on text
  // that has a contrast requirement. The underline going away carries the
  // change instead (Figma's Hover and Pressed draw none). Focus keeps the
  // underline: a keyboard user lands on a link that still looks like one.
  `${ON}:hover,${ON}:active{text-decoration:none}`,
  // The ring every control wears: 2px, 1px outside. Square — a link's text
  // box has no corner to follow.
  `${ON}:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}`,
].join('\n'));

const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

export function Link({
  children,
  href,
  target,
  rel,
  textStyle = 'body',
  color = 'primary',
  disabled = false,
  /* Figma's Status = Visited, stated rather than left to the browser: for a
     visited state the APP tracks (an article read, a step done), and because
     a page cannot force or read :visited. Hover, pressed, focus and disabled
     apply on top, as in the Figma set. */
  visited = false,
  onClick,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-link');
  if (color === 'quiet') warnQuietOnce();
  const styleKey = STYLE_MAP[textStyle] ? textStyle : 'body';
  const effColor = color === 'quiet' ? 'standard' : color;
  const colorKey = COLOR_MAP[effColor] ? effColor : 'primary';

  const resolvedRel = target === '_blank'
    ? (rel || 'noopener noreferrer')
    : rel;

  const linkProps = {
    href: disabled ? undefined : href,
    target,
    rel: resolvedRel,
    onClick: disabled ? (e) => e.preventDefault() : onClick,
    'aria-disabled': disabled || undefined,
    tabIndex: disabled ? -1 : undefined,
    className:
      'link link-' + textStyle + ' link-color-' + effColor +
      (disabled ? ' link-disabled' : '') +
      (visited ? ' link-visited' : '') +
      ' omni-link omni-link-s-' + styleKey +
      ' omni-link-c-' + colorKey + (visited ? '-v' : '') +
      (disabled ? ' omni-link-off' : '') +
      ' ' + className,
    ...props,
  };

  if (hasSx(sx)) return <SxBox component="a" sx={sx} {...linkProps}>{children}</SxBox>;
  return <a {...linkProps}>{children}</a>;
}

export default Link;
