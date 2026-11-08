import { clean, linksIn, guard, prerenderSite } from './prerender';

test('links: same-origin page paths only, no files, query or hash', () => {
  const html = '<a href="/p/a?x=1#y">a</a><a href="/c/home/">b</a><a href="https://x.com/p">c</a><a href="//cdn/x">d</a><a href="/img/a.png">e</a><a href="#top">f</a>';
  expect(linksIn(html).sort()).toEqual(['/c/home', '/p/a']);
});

test('clean: the head script\'s links and the provider\'s injected sheets come out; component sheets stay', () => {
  const html = '<head><link rel="stylesheet" data-omni="head" href="a.css"><link rel="prefetch" data-omni="prefetch" href="b.css">'
    + '<style data-omni="true">x{}</style><style id="omni-static">.omni-btn{}</style></head>';
  const out = clean(html);
  expect(out).not.toContain('a.css');
  expect(out).not.toContain('b.css');
  expect(out).not.toContain('x{}');
  expect(out).toContain('.omni-btn{}');
});

test('guard: the page empties itself when shown at another address', () => {
  const out = guard('<html><body><div id="root"><main>Home</main></div></body></html>', '/');
  expect(out).toContain('<div id="root" data-omni-prerendered>');
  expect(out).toMatch(/if\(p!=="\/"\)/);
  expect(out.indexOf('<script>')).toBeGreaterThan(out.indexOf('</div>'));
});

test('no index.html: skipped, nothing written', async () => {
  const r = await prerenderSite('/nonexistent-dir-for-omni-test');
  expect(r.written).toEqual([]);
  expect(r.skipped).toBeTruthy();
});

test('routes in code: static router paths, not params, assets or API', async () => {
  const { routesInCode } = await import('./prerender');
  const js = 'path:"/checkout",path:"/p/:slug",path:"*",fetch("/api/orders"),"/assets/a.js",x="/order/confirmed/",`/account`';
  expect(routesInCode(js).sort()).toEqual(['/account', '/checkout', '/order/confirmed']);
});
