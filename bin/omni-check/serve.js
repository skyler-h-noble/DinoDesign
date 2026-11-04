'use strict';
/* A static file server for a build folder, with the SPA fallback: a path that
 * is not a file gets index.html, so client-side routes load. Bound to
 * 127.0.0.1 only. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.map': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };

/** The file to serve for a URL path, or null (404). Never leaves `root`. */
function resolveFile(root, urlPath) {
  let p;
  try { p = decodeURIComponent(String(urlPath).split('?')[0].split('#')[0]); } catch { return null; }
  const abs = path.resolve(root, '.' + path.posix.normalize('/' + p));
  if (abs !== root && !abs.startsWith(root + path.sep)) return null;
  if (isFile(abs)) return abs;
  if (isFile(path.join(abs, 'index.html'))) return path.join(abs, 'index.html');
  if (isFile(abs + '.html')) return abs + '.html';
  // A path with an extension is a missing file; anything else is an app route.
  if (path.extname(abs)) return null;
  const index = path.join(root, 'index.html');
  return isFile(index) ? index : null;
}

function serveDir(dir, port = 0) {
  const root = path.resolve(dir);
  const server = http.createServer((req, res) => {
    const file = resolveFile(root, req.url || '/');
    if (!file) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const { port: p } = server.address();
      resolve({ url: 'http://127.0.0.1:' + p, close: () => new Promise((r) => server.close(() => r())) });
    });
  });
}

module.exports = { serveDir, resolveFile };
