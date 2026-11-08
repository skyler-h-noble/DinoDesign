import React from 'react';
import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { mountApp } from './mount';
import { ClientOnly } from './components/ClientOnly';

function App() {
  return (
    <main>
      <h1>Shop</h1>
      <input aria-label="Search" />
      <img alt="" loading="lazy" src="a.jpg" />
      <ClientOnly fallback={<span>Your cart</span>}><span>Your cart (3)</span></ClientOnly>
    </main>
  );
}

/* What the plugin saves: the rendered page, the lazy image's address parked. */
function prerendered() {
  const el = document.createElement('div');
  el.id = 'root';
  el.setAttribute('data-omni-prerendered', '');
  el.innerHTML = renderToString(<App />).replace(' src="a.jpg"', ' data-omni-src="a.jpg"');
  document.body.appendChild(el);
  return el;
}

afterEach(() => { document.body.innerHTML = ''; });

test('a prerendered page is taken over, not redrawn: same nodes, typed text kept', async () => {
  const el = prerendered();
  const input = el.querySelector('input');
  input.value = 'linen';
  await act(async () => { mountApp(el, <App />); });
  expect(el.querySelector('input')).toBe(input);
  expect(el.querySelector('input').value).toBe('linen');
});

test('parked lazy images get their address back', async () => {
  const el = prerendered();
  await act(async () => { mountApp(el, <App />); });
  const img = el.querySelector('img');
  expect(img.getAttribute('src')).toBe('a.jpg');
  expect(img.hasAttribute('data-omni-src')).toBe(false);
});

test('ClientOnly: the saved page shows the fallback, the running app the content', async () => {
  const el = prerendered();
  expect(el.textContent).toContain('Your cart');
  expect(el.textContent).not.toContain('(3)');
  await act(async () => { mountApp(el, <App />); });
  expect(el.textContent).toContain('Your cart (3)');
});

test('not prerendered: an ordinary createRoot', async () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  await act(async () => { mountApp(el, <App />); });
  expect(el.querySelector('h1').textContent).toBe('Shop');
});
