/**
 * @omni-design/components/mount — start the app without losing the
 * prerendered page.
 *
 *   import { mountApp } from '@omni-design/components/mount';
 *   mountApp(document.getElementById('root'), <App />);
 *
 * The Vite plugin prerenders each page (vite/prerender.js) by saving what a
 * browser drew. With plain createRoot, React empties that page and draws its
 * own: a lazily loaded page shows its loading fallback first (a flash), and
 * anything typed meanwhile is gone.
 *
 * Why not hydrateRoot: taking over HTML needs the markers React writes when it
 * renders to HTML itself (Suspense boundaries are comment nodes). A page saved
 * from a browser has none, so every page with a lazy route failed to hydrate
 * and was redrawn anyway, with errors (React #418 / #423).
 *
 * So mountApp keeps the saved page on screen and draws the app out of sight,
 * underneath it. When the app's page is drawn — the same <h1> as the saved
 * page, or 3 s — it swaps them in one frame, carrying over what was typed in
 * each field and where the cursor was. A page that was not prerendered starts
 * with createRoot as before.
 *
 * Content that depends on the visitor (cart, signed-in name) belongs in
 * <ClientOnly fallback={…}>: the saved page shows the fallback, so it never
 * shows the wrong cart.
 *
 * Its own entry because react-dom/client is React 18+; the main entry still
 * supports React 17.
 */
import { createRoot } from 'react-dom/client';

const SWAP_TIMEOUT_MS = 3000;

/* A field's identity across the two copies of the page. */
const fieldKey = (el, i) => el.getAttribute('name') || el.id || el.getAttribute('aria-label') || el.getAttribute('placeholder') || `#${i}`;
const fieldsIn = (root) => Array.from(root.querySelectorAll('input, textarea, select'))
  .filter((el) => !['hidden', 'submit', 'button', 'reset', 'file'].includes(el.type));

/* Put a value into a field React controls: the native setter, then the event
   React listens for, so the app's state takes it. */
function setFieldValue(el, value) {
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype
    : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const prop = el.type === 'checkbox' || el.type === 'radio' ? 'checked' : 'value';
  const desc = Object.getOwnPropertyDescriptor(proto, prop);
  if (desc && desc.set) desc.set.call(el, value); else el[prop] = value;
  el.dispatchEvent(new Event(el.tagName === 'SELECT' || prop === 'checked' ? 'change' : 'input', { bubbles: true }));
}

function snapshotFields(root) {
  const active = document.activeElement;
  return fieldsIn(root).map((el, i) => {
    const prop = el.type === 'checkbox' || el.type === 'radio' ? 'checked' : 'value';
    const initial = prop === 'checked' ? el.defaultChecked : el.defaultValue;
    return {
      key: fieldKey(el, i), value: el[prop], changed: el[prop] !== initial, focused: el === active,
      sel: el === active && typeof el.selectionStart === 'number' ? [el.selectionStart, el.selectionEnd] : null,
    };
  });
}

function restoreFields(root, saved) {
  const fields = fieldsIn(root);
  saved.forEach((s) => {
    const el = fields.find((f, i) => fieldKey(f, i) === s.key);
    if (!el) return;
    if (s.changed) setFieldValue(el, s.value);
    if (s.focused) {
      el.focus({ preventScroll: true });
      if (s.sel) { try { el.setSelectionRange(s.sel[0], s.sel[1]); } catch (e) { /* not a text field */ } }
    }
  });
}

/* The app has drawn the page the saved copy shows: the same main heading. A
   page without one is ready as soon as the app has drawn anything. */
function drawn(next, saved) {
  const h = saved.querySelector('h1');
  const want = h && h.textContent.trim();
  if (want) { const g = next.querySelector('h1'); return !!g && g.textContent.trim() === want; }
  return next.childElementCount > 0;
}

const HIDE = ['position', 'top', 'left', 'right', 'visibility', 'pointerEvents'];

export function mountApp(el, element, options) {
  if (!el) throw new Error('mountApp: no element to mount into');
  const prerendered = el.hasAttribute('data-omni-prerendered') && el.firstElementChild;
  if (!prerendered || typeof window === 'undefined') {
    const root = createRoot(el, options);
    root.render(element);
    return root;
  }

  /* The app's copy: same id and classes, drawn out of sight under the saved page. */
  const next = el.cloneNode(false);
  const id = el.id;
  next.removeAttribute('id'); // the saved page keeps #root (and its CSS) until the swap
  next.removeAttribute('data-omni-prerendered');
  next.setAttribute('aria-hidden', 'true');
  next.setAttribute('inert', '');
  Object.assign(next.style, { position: 'absolute', top: '0', left: '0', right: '0', visibility: 'hidden', pointerEvents: 'none' });
  el.parentNode.insertBefore(next, el.nextSibling);

  const root = createRoot(next, options);
  root.render(element);

  const started = Date.now();
  const swap = () => {
    const fields = snapshotFields(el);
    HIDE.forEach((p) => { next.style[p] = ''; });
    next.removeAttribute('aria-hidden');
    next.removeAttribute('inert');
    el.remove();
    if (id) next.id = id;
    restoreFields(next, fields);
  };
  const tick = () => {
    if (drawn(next, el) || Date.now() - started > SWAP_TIMEOUT_MS) swap();
    else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return root;
}
