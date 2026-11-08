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
 * A tap on a button before the app is ready is not lost either: that one
 * button shows it was pressed (and is announced busy), and the tap is played
 * again on the same button in the app once it is. Links are left alone — they
 * already work as ordinary page loads.
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

/* Controls whose taps are held and replayed. Links (a[href]) are not: the
   browser follows them as ordinary page loads. */
const CONTROL = 'button, [role="button"], [role="switch"], [role="checkbox"], [role="tab"], [role="menuitem"], '
  + 'input[type="checkbox"], input[type="radio"], summary';
const MAX_TAPS = 3;
const PENDING_CSS = '[data-omni-pending]{opacity:.72;cursor:progress}';

/* A control's identity across the two copies: its kind, its name (aria-label
   or text), and which one it is among controls with that kind and name. */
const controlName = (el) => `${el.tagName}|${el.getAttribute('role') || el.type || ''}|${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80)}`;
function controlKey(root, el) {
  const name = controlName(el);
  const same = Array.from(root.querySelectorAll(CONTROL)).filter((c) => controlName(c) === name);
  return { name, index: same.indexOf(el) };
}
function findControl(root, key) {
  const same = Array.from(root.querySelectorAll(CONTROL)).filter((c) => controlName(c) === key.name);
  return same[key.index] || null;
}

/* Hold taps on the saved page's controls until the app is ready. */
function holdTaps(saved) {
  const taps = [];
  if (!document.getElementById('omni-pending-style')) {
    const st = document.createElement('style');
    st.id = 'omni-pending-style';
    st.textContent = PENDING_CSS;
    document.head.appendChild(st);
  }
  const onClick = (e) => {
    const el = e.target instanceof Element ? e.target.closest(CONTROL) : null;
    if (!el || !saved.contains(el) || el.closest('a[href]')) return;
    e.preventDefault();
    e.stopPropagation();
    if (taps.some((t) => t.el === el) || taps.length >= MAX_TAPS) return; // a double tap counts once
    taps.push({ el, key: controlKey(saved, el) });
    el.setAttribute('data-omni-pending', '');
    el.setAttribute('aria-busy', 'true');
  };
  saved.addEventListener('click', onClick, true);
  return {
    release: () => saved.removeEventListener('click', onClick, true),
    taps,
  };
}

/* Play the held taps on the app's matching controls; a tap with no match
   (the app drew a different page) is dropped, not guessed. */
function replayTaps(next, taps) {
  taps.forEach((t) => {
    const el = findControl(next, t.key);
    if (el && !el.disabled) el.click();
  });
}

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

  const held = holdTaps(el);
  const root = createRoot(next, options);
  root.render(element);

  const started = Date.now();
  const swap = () => {
    held.release();
    const fields = snapshotFields(el);
    HIDE.forEach((p) => { next.style[p] = ''; });
    next.removeAttribute('aria-hidden');
    next.removeAttribute('inert');
    el.remove();
    if (id) next.id = id;
    restoreFields(next, fields);
    replayTaps(next, held.taps);
  };
  const tick = () => {
    if (drawn(next, el) || Date.now() - started > SWAP_TIMEOUT_MS) swap();
    else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return root;
}
