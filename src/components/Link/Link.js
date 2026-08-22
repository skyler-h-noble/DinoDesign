// src/components/Link/Link.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Link Component
 *
 * An anchor element that inherits Typography styles from the design system.
 * ALWAYS underlined — no option to remove underline.
 *
 * ALLOWED textStyle values (NO headers, display, or eyebrow):
 *   body, body-small, body-large, body-semibold, body-bold
 *   button, label, caption
 *
 * COLORS:
 *   primary    var(--Link, --Hotlink)   — default link color
 *   standard   var(--Text)              — blends with body text
 *   quiet      var(--Text-Quiet)        — subdued links
 *
 * STATES: hover → underline thickens, colour unchanged. visited →
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
    lineHeight: 'calc(var(--Body-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
  },
  'body-small': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Small-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Small-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Small-Letter-Spacing)',
  },
  'body-large': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Large-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Large-Font-Size)',
    fontWeight: 'var(--Body-Font-Weight)',
    letterSpacing: 'var(--Body-Large-Letter-Spacing)',
  },
  'body-semibold': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Line-Height) * var(--Cognitive-Multiplier, 1))',
    fontSize: 'var(--Body-Font-Size)',
    fontWeight: 'var(--Body-Semibold-Font-Weight)',
    letterSpacing: 'var(--Body-Letter-Spacing)',
  },
  'body-bold': {
    fontFamily: 'var(--Body-Font-Family)',
    lineHeight: 'calc(var(--Body-Line-Height) * var(--Cognitive-Multiplier, 1))',
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
    lineHeight: 'calc(var(--Body-Small-Line-Height) * var(--Cognitive-Multiplier, 1))',
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
 * colour — no error, no fallback, just a link that is not link-coloured.
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
 * --Link-Hover is intentionally absent. Links do not change colour on hover;
 * the underline thickens instead. Do not add a hover colour here — the design
 * system emits no hover tone for links, so any value would be invented rather
 * than derived, and it would land on text that carries a 4.5:1 requirement.
 */
const LINK_BASE    = 'var(--Link, var(--Hotlink))';
const LINK_VISITED = 'var(--Link-Visited, var(--Hotlink-Visited))';

const COLOR_MAP = {
  primary:  { base: LINK_BASE,           visited: LINK_VISITED },
  standard: { base: 'var(--Text)',       visited: LINK_VISITED },
  quiet:    { base: 'var(--Text-Quiet)', visited: LINK_VISITED },
};

export const LINK_STYLES = Object.keys(STYLE_MAP);
export const LINK_COLORS = Object.keys(COLOR_MAP);

export function Link({
  children,
  href,
  target,
  rel,
  textStyle = 'body',
  color = 'primary',
  disabled = false,
  onClick,
  className = '',
  sx = {},
  ...props
}) {
  const typo   = STYLE_MAP[textStyle] || STYLE_MAP.body;
  const colors = COLOR_MAP[color]     || COLOR_MAP.primary;

  const resolvedRel = target === '_blank'
    ? (rel || 'noopener noreferrer')
    : rel;

  return (
    <Box
      component="a"
      href={disabled ? undefined : href}
      target={target}
      rel={resolvedRel}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={
        'link link-' + textStyle + ' link-color-' + color +
        (disabled ? ' link-disabled' : '') +
        ' ' + className
      }
      sx={{
        // ── Typography ───────────────────────────────────────────
        fontFamily:    typo.fontFamily,
        lineHeight:    typo.lineHeight,
        fontSize:      typo.fontSize,
        fontWeight:    typo.fontWeight,
        letterSpacing: typo.letterSpacing,

        // ── Always underlined ────────────────────────────────────
        textDecoration:          'underline',
        textUnderlineOffset:     '3px',
        textDecorationThickness: '1px',

        // ── Color ────────────────────────────────────────────────
        color:         colors.base,
        cursor:        disabled ? 'not-allowed' : 'pointer',
        opacity:       disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',

        // ── Touch target (WCAG 2.5.8) ────────────────────────────
        // inline-flex keeps the link flowing in text while allowing
        // min-height / min-width to take effect on the element box.
        display:     'inline-flex',
        alignItems:  'center',
        minHeight:   '24px',
        minWidth:    '24px',

        // ── Transitions ──────────────────────────────────────────
        transition: 'color 0.15s ease, text-decoration-color 0.15s ease',

        // ── States ───────────────────────────────────────────────
        ...(!disabled && {
          // No colour change on hover — deliberate. The design system emits no
          // hover tone for links, and inventing one would put an unverified
          // colour on text that has a contrast requirement. The underline
          // thickening carries the affordance instead, which is a non-colour
          // cue and so does not rely on colour perception either.
          '&:hover': {
            textDecorationThickness: '2px',
          },
          '&:visited': {
            color: colors.visited,
          },
          '&:focus-visible': {
            outline:       '3px solid var(--Focus-Visible)',
            outlineOffset: '2px',
            borderRadius:  '2px',
          },
          '&:active': {
            textDecorationThickness: '2px',
          },
        }),

        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Link;