// dev-server.js
// Local development API for receiving CSS files from dinodesign-studio.
// Run alongside CRA dev server: node dev-server.js
// Studio POSTs generated CSS files here, and they're written to public/styles/.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3100;
const STYLES_DIR = path.join(__dirname, 'public', 'styles');

const ALLOWED_FILES = [
  'foundation.css',
  'core.css',
  'Light-Mode.css',
  'Dark-Mode.css',
  'base.css',
  'styles.css',
];

const server = http.createServer((req, res) => {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // POST /push-css — receive all CSS files as JSON
  if (req.method === 'POST' && req.url === '/push-css') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const files = JSON.parse(body);
        const written = [];

        Object.entries(files).forEach(([filename, content]) => {
          if (!ALLOWED_FILES.includes(filename)) {
            console.warn('Skipped disallowed file:', filename);
            return;
          }
          const filePath = path.join(STYLES_DIR, filename);
          fs.writeFileSync(filePath, content, 'utf-8');
          written.push(filename);
          console.log('  ✓', filename, '(' + content.length + ' bytes)');
        });

        console.log('Received', written.length, 'CSS files from Studio');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, files: written }));
      } catch (err) {
        console.error('Error processing CSS push:', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // POST /push-css/:filename — receive a single CSS file
  const singleMatch = req.url.match(/^\/push-css\/(.+)$/);
  if (req.method === 'POST' && singleMatch) {
    const filename = singleMatch[1];
    if (!ALLOWED_FILES.includes(filename)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'File not allowed: ' + filename }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const filePath = path.join(STYLES_DIR, filename);
      fs.writeFileSync(filePath, body, 'utf-8');
      console.log('  ✓', filename, '(' + body.length + ' bytes)');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, file: filename }));
    });
    return;
  }

  // GET /status — health check
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, stylesDir: STYLES_DIR, allowedFiles: ALLOWED_FILES }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('DinoDesign dev API running on http://localhost:' + PORT);
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /push-css          — receive all CSS files as JSON { "Light-Mode.css": "...", ... }');
  console.log('  POST /push-css/:file    — receive a single CSS file as raw body');
  console.log('  GET  /status            — health check');
  console.log('');
  console.log('Studio usage:');
  console.log('  fetch("http://localhost:' + PORT + '/push-css", {');
  console.log('    method: "POST",');
  console.log('    headers: { "Content-Type": "application/json" },');
  console.log('    body: JSON.stringify({');
  console.log('      "Light-Mode.css": cssContent,');
  console.log('      "Dark-Mode.css": darkContent,');
  console.log('      ...etc');
  console.log('    })');
  console.log('  });');
  console.log('');
});
