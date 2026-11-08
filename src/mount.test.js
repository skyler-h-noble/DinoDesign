import React, { useState, Suspense, lazy } from 'react';
import { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mountApp } from './mount';
import { ClientOnly } from './components/ClientOnly';

function Page() {
  const [q, setQ] = useState('');
  return (
    <main>
      <h1>Shop</h1>
      <input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      <output>{q}</output>
      <ClientOnly fallback={<span>Your cart</span>}><span>Your cart (3)</span></ClientOnly>
    </main>
  );
}

function prerendered(markup = renderToStaticMarkup(<Page />)) {
  const el = document.createElement('div');
  el.id = 'root';
  el.setAttribute('data-omni-prerendered', '');
  el.innerHTML = markup;
  document.body.appendChild(el);
  return el;
}
const frames = (n) => act(async () => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)); });

afterEach(() => { document.body.innerHTML = ''; });

test('the saved page stays until the app draws the same page, then they swap', async () => {
  const saved = prerendered();
  await act(async () => { mountApp(saved, <Page />); });
  await frames(3);
  expect(saved.isConnected).toBe(false);
  const live = document.getElementById('root');
  expect(live).not.toBe(saved);
  expect(live.querySelector('h1').textContent).toBe('Shop');
  expect(live.style.visibility).toBe('');
  expect(live.hasAttribute('inert')).toBe(false);
});

test('what was typed before the app started carries over, into the app\'s state', async () => {
  const saved = prerendered();
  const input = saved.querySelector('input');
  input.value = 'linen';
  input.focus();
  await act(async () => { mountApp(saved, <Page />); });
  await frames(3);
  const live = document.getElementById('root');
  expect(live.querySelector('input').value).toBe('linen');
  expect(live.querySelector('output').textContent).toBe('linen');
  expect(document.activeElement).toBe(live.querySelector('input'));
});

test('a lazy page: the saved copy stays on screen while the app shows its loader', async () => {
  let release;
  const Lazy = lazy(() => new Promise((r) => { release = () => r({ default: Page }); }));
  const saved = prerendered();
  await act(async () => { mountApp(saved, <Suspense fallback={<p>Loading…</p>}><Lazy /></Suspense>); });
  await frames(3);
  expect(saved.isConnected).toBe(true); // the loader never showed
  await act(async () => { release(); });
  await frames(3);
  expect(saved.isConnected).toBe(false);
  expect(document.getElementById('root').querySelector('h1').textContent).toBe('Shop');
});

test('ClientOnly: the saved page shows the fallback, the app the content', async () => {
  const saved = prerendered();
  expect(saved.textContent).not.toContain('(3)');
  await act(async () => { mountApp(saved, <Page />); });
  await frames(3);
  expect(document.getElementById('root').textContent).toContain('Your cart (3)');
});

test('not prerendered: an ordinary createRoot', async () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  await act(async () => { mountApp(el, <Page />); });
  expect(el.querySelector('h1').textContent).toBe('Shop');
});

describe('taps before the app is ready', () => {
  function Shop({ onAdd, onToggle }) {
    return (
      <main>
        <h1>Shop</h1>
        <button type="button" onClick={onAdd}>Add to cart</button>
        <button type="button" aria-label="Dark mode" onClick={onToggle}>☾</button>
        <a href="/cart">Cart</a>
      </main>
    );
  }
  const saved = () => prerendered(renderToStaticMarkup(<Shop />));

  test('a tap is held, shown pressed, and played once on the app\'s button', async () => {
    const onAdd = jest.fn();
    const el = saved();
    await act(async () => { mountApp(el, <Shop onAdd={onAdd} onToggle={() => {}} />); });
    const btn = el.querySelector('button');
    btn.click();
    btn.click(); // a double tap counts once
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.hasAttribute('data-omni-pending')).toBe(true);
    expect(onAdd).not.toHaveBeenCalled();
    await frames(3);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  test('the tap lands on the matching button by name, not another one', async () => {
    const onAdd = jest.fn(); const onToggle = jest.fn();
    const el = saved();
    await act(async () => { mountApp(el, <Shop onAdd={onAdd} onToggle={onToggle} />); });
    el.querySelector('button[aria-label="Dark mode"]').click();
    await frames(3);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('links are left to the browser', async () => {
    const el = saved();
    await act(async () => { mountApp(el, <Shop onAdd={() => {}} onToggle={() => {}} />); });
    const a = el.querySelector('a');
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
    a.dispatchEvent(ev);
    expect(a.hasAttribute('data-omni-pending')).toBe(false);
  });
});

test('ClientOnly stays on its fallback while the page is being prerendered', async () => {
  window.__OMNI_PRERENDER__ = true;
  try {
    const el = document.createElement('div');
    document.body.appendChild(el);
    await act(async () => { mountApp(el, <ClientOnly fallback={<span>Cart</span>}><span>Cart, 0 items</span></ClientOnly>); });
    expect(el.textContent).toBe('Cart');
  } finally {
    delete window.__OMNI_PRERENDER__;
  }
});
