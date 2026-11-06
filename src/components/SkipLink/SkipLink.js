// src/components/SkipLink/SkipLink.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { SHADOW_LEVEL_3 } from '../_shadows';

/**
 * SkipLink — "Skip to main content", the first thing a keyboard user tabs to.
 *
 * Put it FIRST in the app, before the AppBar, and give the page's main region
 * the id it points at (default "main"):
 *
 *   <SkipLink />
 *   <AppBar … />
 *   <Section as="main" id="main">…</Section>   (or <main id="main">)
 *
 * Hidden until it has focus, then fixed at the top-left above everything.
 * It is its OWN surface — data-surface="Surface-Brightest" on the page's
 * theme, painting that surface's --Background — so its text (--Hotlink,
 * 4.5:1) and its focus ring (--Focus-Visible, 3:1, drawn inside its edge so
 * it sits on that same background) are the colors the design system checked
 * for it, whatever the page beneath looks like.
 *
 * Why a component: a hand-built one in a benchmark styled `.wrapper:focus`
 * while focus landed on the inner link, so it never appeared. Here the
 * hidden / shown rules are on the <a> itself, which is what takes focus.
 *
 * Activating it moves focus to the target (giving it tabindex="-1" if it is
 * not focusable), so the next Tab continues from the main content in every
 * browser, and it does not touch the URL or a client-side router.
 */
registerStaticStyles('omni-skip-link', [
  /* At rest: out of sight but in the accessibility tree and the tab order. */
  '.omni-skip{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);'
    + 'clip-path:inset(50%);white-space:nowrap;border:0}',
  /* Weighed over the design system's own paint rule for a surface
     ([data-theme] [data-surface]:not([data-theme]), which comes later). */
  'a.omni-skip.omni-skip:focus{position:fixed;top:var(--Sizing-1, 8px);left:var(--Sizing-1, 8px);z-index:2147483647;'
    + 'width:auto;height:auto;margin:0;overflow:visible;clip:auto;clip-path:none;white-space:nowrap;'
    + 'padding:var(--Sizing-1-and-Half, 12px) var(--Sizing-2, 16px);'
    + 'background-color:var(--Background);color:var(--Hotlink);text-decoration:underline;'
    + 'font-family:var(--Font-Family-Body, var(--Body-Font-Family, inherit));font-size:var(--Body-Medium-Font-Size, 16px);'
    + 'line-height:var(--Body-Medium-Line-Height, 24px);font-weight:600;'
    + 'border:1px solid var(--Border);border-radius:var(--Button-Radius, var(--Style-Border-Radius, 4px));'
    /* Tinted, not the black set: neutral shadows are Modal, Dialog, Toast and
       Popover only (floatingShadows.test.js pins the list). */
    + 'box-shadow:' + SHADOW_LEVEL_3 + ';'
    + 'outline:2px solid var(--Focus-Visible);outline-offset:-5px}',
].join('\n'));

export function SkipLink({
  href = '#main',
  children = 'Skip to main content',
  className,
  onClick,
  ...rest
}) {
  useStaticStyles('omni-skip-link');
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || typeof document === 'undefined' || typeof href !== 'string' || !href.startsWith('#')) return;
    let target = null;
    try { target = document.getElementById(decodeURIComponent(href.slice(1))); } catch { target = null; }
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute('tabindex') && target.tabIndex < 0) target.setAttribute('tabindex', '-1');
    target.focus();
    if (typeof target.scrollIntoView === 'function') target.scrollIntoView({ block: 'start' });
  };
  return (
    <a
      href={href}
      data-surface="Surface-Brightest"
      className={'omni-skip' + (className ? ' ' + className : '')}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}

export default SkipLink;
