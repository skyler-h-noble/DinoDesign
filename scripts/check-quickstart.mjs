// Copies CLAUDE.md's code into types-test/ so `npm run test:types` compiles
// it against the published types. A quickstart that does not compile is
// worse than none: it is the first thing an AI tool copies.
import { readFileSync, writeFileSync } from 'fs';
const doc = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8');
const block = (heading) => {
  const a = doc.indexOf(heading);
  if (a < 0) throw new Error('check-quickstart: CLAUDE.md has no "' + heading + '"');
  const start = doc.indexOf('```jsx', a) + 6;
  return doc.slice(start, doc.indexOf('```', start));
};
const header = (n) => '// GENERATED from CLAUDE.md section ' + n + ' by scripts/check-quickstart.mjs —\n'
  + '// the quickstart must compile against the published types.\n';
const write = (file, src) => writeFileSync(new URL('../types-test/' + file, import.meta.url), src);

// Section 4: the light/dark toggle — a complete component as written.
write('modetoggle.tsx', header(4) + block('## 4. ').replace('function ModeToggle', 'export function ModeToggle'));

// Section 5: the page — imports, then a JSX expression to wrap.
const page = block('## 5. A page');
const at = page.indexOf('<>');
write('quickstart.tsx', header(5) + page.slice(0, at)
  + '\nexport function QuickstartPage() {\n  return (\n' + page.slice(at) + '  );\n}\n');

// Every theme and surface the types allow must be named in CLAUDE.md. The doc
// listed nine themes while the types had twelve, so an AI tool reading it
// never learned App-Bar / Nav-Bar existed and picked a palette for its bars.
const types = readFileSync(new URL('../types/core-props.d.ts', import.meta.url), 'utf8');
const union = (name) => {
  const m = types.match(new RegExp('export type ' + name + ' =([^;]+);'));
  if (!m) throw new Error('check-quickstart: core-props.d.ts has no type ' + name);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
};
const missing = [...union('Theme'), ...union('Surface')].filter((v) => !doc.includes('`' + v + '`'));
if (missing.length) throw new Error('check-quickstart: CLAUDE.md does not name ' + missing.join(', '));
