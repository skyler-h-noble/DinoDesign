// Copies CLAUDE.md's "A page" example into types-test/quickstart.tsx so
// `npm run test:types` compiles it. A quickstart that does not compile is
// worse than none: it is the first thing an AI tool copies.
import { readFileSync, writeFileSync } from 'fs';
const doc = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8');
const a = doc.indexOf('## 4. A page');
const start = doc.indexOf('```jsx', a) + 6;
const code = doc.slice(start, doc.indexOf('```', start));
const at = code.indexOf('<>');
const src = '// GENERATED from CLAUDE.md section 4 by scripts/check-quickstart.mjs — the\n'
  + '// quickstart example must compile against the published types.\n'
  + code.slice(0, at) + '\nexport function QuickstartPage() {\n  return (\n' + code.slice(at) + '  );\n}\n';
writeFileSync(new URL('../types-test/quickstart.tsx', import.meta.url), src);
