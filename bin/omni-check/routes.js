'use strict';
/* Route handling for omni-check: turning hrefs into same-origin paths, and the
 * breadth-first crawl that discovers pages from the start page's links. */

/* Links that are files, not pages. */
const FILE_EXT = /\.(pdf|zip|gz|tgz|rar|7z|png|jpe?g|gif|svg|webp|avif|ico|bmp|mp4|webm|mov|mp3|wav|ogg|json|xml|txt|csv|ics|css|js|mjs|map|woff2?|ttf|otf|eot|dmg|exe|apk)$/i;

/** A same-origin page path ("/cart?x=1") from an href, or null for an
 *  external link, a file, a non-http scheme or an unparsable href. The hash is
 *  dropped: /#a and /#b are the same page. */
function normalizeRoute(href, origin) {
  if (typeof href !== 'string' || !href.trim()) return null;
  let u;
  try { u = new URL(href.trim(), origin); } catch { return null; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (u.origin !== new URL(origin).origin) return null;
  if (FILE_EXT.test(u.pathname)) return null;
  return u.pathname + u.search;
}

/** `--routes /,/cart,checkout` → ['/', '/cart', '/checkout'], deduplicated. */
function parseRoutesArg(value) {
  const out = [];
  for (const raw of String(value || '').split(',')) {
    const r = raw.trim();
    if (!r) continue;
    const route = r.startsWith('/') ? r : '/' + r;
    if (!out.includes(route)) out.push(route);
  }
  return out;
}

/**
 * Breadth-first route queue.
 *   const c = createCrawler({ start: '/', cap: 30, crawl: true });
 *   c.next()            → '/' (then the next unvisited route, or null)
 *   c.add(hrefs, origin) → queues new same-origin routes (when crawling)
 * With `routes` given the list is fixed and add() does nothing.
 */
function createCrawler({ start = '/', routes = null, cap = 30, crawl = true } = {}) {
  const fixed = Array.isArray(routes) && routes.length > 0;
  const queue = fixed ? routes.slice(0, cap) : [start];
  const seen = new Set(queue);
  let i = 0;
  return {
    next() { return i < queue.length ? queue[i++] : null; },
    add(hrefs, origin) {
      if (fixed || !crawl) return 0;
      let added = 0;
      for (const h of hrefs || []) {
        if (seen.size >= cap) break;
        const r = normalizeRoute(h, origin);
        if (r && !seen.has(r)) { seen.add(r); queue.push(r); added++; }
      }
      return added;
    },
    get routes() { return queue.slice(); },
  };
}

module.exports = { normalizeRoute, parseRoutesArg, createCrawler, FILE_EXT };
