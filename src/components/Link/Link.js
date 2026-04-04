// src/components/Link/Link.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Link Component
 *
 * An anchor element that inherits Typography styles from the design system.
 * ALWAYS underlined — no option to remove underline.
 *
 * ALLOWED textStyle values (NO headers, display, or overline):
 *   body, body-small, body-large, body-semibold, body-bold
 *   button, label, caption
 *
 * COLORS:
 *   primary    var(--Link)              — default link color
 *   standard   var(--Text)              — blends with body text
 *   quiet      var(--Text-Quiet)        — subdued links
 *
 * STATES: hover → var(--Link-Hover), visited → var(--Link-Visited)
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

const COLOR_MAP = {
  primary:  { base: 'var(--Link)',       hover: 'var(--Link-Hover)', visited: 'var(--Link-Visited)' },
  standard: { base: 'var(--Text)',       hover: 'var(--Link-Hover)', visited: 'var(--Link-Visited)' },
  quiet:    { base: 'var(--Text-Quiet)', hover: 'var(--Link-Hover)', visited: 'var(--Link-Visited)' },
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
          '&:hover': {
            color:                   colors.hover,
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