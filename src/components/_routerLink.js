/* _routerLink.js — the one place a component decides how an href is followed.
 *
 * WHY THIS EXISTS
 * An app with a client-side router (React Router, Next.js, TanStack, …) needs
 * a click on an internal link to change the page WITHOUT reloading the
 * document, while the link stays a real <a href> that can be right-clicked,
 * opened in a new tab and copied. Without help from the library, every app had
 * to hand-write a wrapper around each component that takes `href`. And if each
 * component made the decision on its own, a Button and a Card pointing at the
 * same URL could behave differently. So every component that renders an <a>
 * from an href asks this file, and nothing else.
 *
 * HOW AN APP TURNS IT ON (OmniDesignProvider props)
 *   linkComponent — the router's own link component (react-router's `Link`,
 *                   Next's `Link`). For an internal href the library renders
 *                   it INSTEAD of a plain <a>, passing every anchor prop plus
 *                   `href` and `to` (React Router, TanStack and Gatsby call it
 *                   `to`; Next and wouter call it `href` — passing both means
 *                   no adapter is needed for either).
 *   navigate      — a function `(href, event) => void`. Used only when there is
 *                   no linkComponent: the library keeps its plain <a> and calls
 *                   this on an unmodified left click instead of letting the
 *                   browser reload the page.
 *
 * WHICH LINKS STAY PLAIN <a> (always — a router cannot open these):
 *   - an href with a scheme (https:, mailto:, tel:, …) or starting with `//`.
 *     Even a full URL on the same site counts as external: deciding "same
 *     origin" needs `window.location`, which does not exist during server
 *     rendering, so the server and the browser would disagree about which
 *     element to draw. Write internal links as paths ("/about").
 *   - `#section` links: the browser already jumps without a reload, and a
 *     router would take over the jump and stop scrolling to the section.
 *   - target other than _self (target="_blank" opens a new tab), or download.
 *   - any component given `reloadDocument` — the per-link escape hatch, for a
 *     path the router does not own (a server-rendered page, a file).
 *
 * With neither provider prop set, this returns exactly what it was given, so
 * the DOM is byte-for-byte what it was before routing support existed.
 */
import { createContext, useContext } from 'react';

/* null = no router configured. Kept separate from the theme context so that
   components work without any provider at all (the theme hook throws there),
   and so a theme change never re-renders every link. */
export const OmniLinkContext = createContext(null);

/* `mailto:`, `https:`, `tel:`, `javascript:` … (RFC 3986 scheme). */
const HAS_SCHEME = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

/** True when an href should be followed by the app's router. */
export function isRoutableHref(href, { target, download } = {}) {
  if (typeof href !== 'string' || href === '') return false;
  if (download != null && download !== false) return false;
  if (target && target !== '_self') return false;
  if (href.charAt(0) === '#') return false;
  if (href.startsWith('//') || HAS_SCHEME.test(href)) return false;
  return true;
}

/* A click the browser would treat as "follow this link here". Cmd / Ctrl /
   Shift / Alt and the middle button mean "new tab", "new window", "download"
   — the user asked for the browser's behavior, so the router stays out of it. */
export function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/**
 * Decide what element to render for a link.
 *
 *   const { Tag, props } = useRouterLink(Tag, props, { reloadDocument });
 *
 * `Tag` is what the component would have rendered ('a' for a link). It is
 * swapped for the router's link component only when it is a plain 'a' — a
 * caller who passed their own `component` keeps it. `props` are the final
 * props for that element (href, target, download and onClick are read from
 * them, so the decision sees exactly what the DOM would have got).
 */
export function useRouterLink(Tag, props, { reloadDocument = false } = {}) {
  const router = useContext(OmniLinkContext);
  if (!router || Tag !== 'a' || reloadDocument || !isRoutableHref(props.href, props)) {
    return { Tag, props };
  }
  if (router.linkComponent) {
    return { Tag: router.linkComponent, props: { ...props, to: props.href } };
  }
  if (router.navigate) {
    const { href, onClick } = props;
    const navigate = router.navigate;
    return {
      Tag,
      props: {
        ...props,
        onClick: (e) => {
          // The component's own handler runs first and can veto with
          // preventDefault(), as it could veto the browser's navigation.
          if (onClick) onClick(e);
          if (e.defaultPrevented || !isPlainLeftClick(e)) return;
          e.preventDefault();
          navigate(href, e);
        },
      },
    };
  }
  return { Tag, props };
}
