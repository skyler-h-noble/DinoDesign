/**
 * @omni-design/components/mount — start the app, taking over a prerendered
 * page instead of drawing it again.
 *
 *   import { mountApp } from '@omni-design/components/mount';
 *   mountApp(document.getElementById('root'), <App />);
 *
 * The Vite plugin prerenders each page (vite/prerender.js). With createRoot,
 * React throws that HTML away and draws the page again when it starts: text
 * someone already typed is lost and the page redraws. mountApp hydrates
 * instead — React adopts the markup that is there. Pages that were not
 * prerendered (or emptied themselves at another address) start with
 * createRoot, exactly as before.
 *
 * Hydration needs React's first render to match the saved HTML. Anything that
 * depends on the visitor — cart, signed-in name, saved choices — goes inside
 * <ClientOnly fallback={…}>: both sides draw the fallback, then the real
 * content appears.
 *
 * Its own entry because react-dom/client is React 18+; the main entry still
 * supports React 17.
 */
import { createRoot, hydrateRoot } from 'react-dom/client';

/* The prerendered HTML parks a lazy image's address (data-omni-src) so it
   does not download before the theme CSS gives the page a layout. React does
   not patch attributes while hydrating, so put them back first. */
function restoreParkedImages(el) {
  el.querySelectorAll('img[data-omni-src], img[data-omni-srcset]').forEach((img) => {
    const src = img.getAttribute('data-omni-src');
    const srcset = img.getAttribute('data-omni-srcset');
    if (srcset !== null) { img.setAttribute('srcset', srcset); img.removeAttribute('data-omni-srcset'); }
    if (src !== null) { img.setAttribute('src', src); img.removeAttribute('data-omni-src'); }
  });
}

export function mountApp(el, element, options) {
  if (!el) throw new Error('mountApp: no element to mount into');
  if (el.hasAttribute('data-omni-prerendered') && el.firstElementChild) {
    restoreParkedImages(el);
    return hydrateRoot(el, element, options);
  }
  const root = createRoot(el, options);
  root.render(element);
  return root;
}
