// scripts/check-api-examples.mjs — copies every @example in types/ into
// types-test/api-examples.tsx, so `npm run test:types` compiles each one
// against the published types.
//
// Why: docs/API.md gives each component ONE example, and that example is what
// an AI tool copies. An example that does not compile teaches the wrong prop
// to every project that reads it — so each one is checked like code.
//
// Examples may use these names without declaring them (see PRELUDE): open /
// setOpen, value / setValue, text / setText, checked / setChecked, page /
// setPage, anchorRef, and any `XxxIcon` (imported from @omni-design/icons/Xxx).
import { writeFileSync } from 'fs';
import { join } from 'path';
import { loadModel, ROOT } from './lib/api-model.mjs';

const PRELUDE = `
declare const open: boolean;
declare const setOpen: (open: boolean) => void;
declare const value: any;
declare const setValue: (value: any) => void;
declare const text: string;
declare const setText: (text: string) => void;
declare const checked: boolean;
declare const setChecked: (checked: boolean) => void;
declare const page: number;
declare const setPage: (page: number) => void;
declare const anchorRef: React.RefObject<HTMLButtonElement>;
`;

const { entries } = loadModel();
const exported = new Set(entries.flatMap((e) => e.exports));
const used = new Set();
const icons = new Set();
const blocks = [];
for (const e of entries) {
  if (!e.example) { continue; }
  for (const m of e.example.matchAll(/<([A-Z]\w*)/g)) {
    const n = m[1];
    if (/Icon$/.test(n) && !exported.has(n)) icons.add(n);
    else used.add(n);
  }
  blocks.push('// ' + e.type + ' (' + e.exports[0] + ')\nexport const Example_' + e.type + ' = () => (\n<>\n' + e.example.trim() + '\n</>\n);\n');
}

const missing = entries.filter((e) => !e.example).map((e) => e.type);
if (missing.length) {
  console.error('check-api-examples: no @example on ' + missing.join(', '));
  process.exit(1);
}

const src = '// GENERATED from the @example tags in types/ by scripts/check-api-examples.mjs.\n'
  + '// Every example in docs/API.md must compile against the published types.\n'
  + "import * as React from 'react';\n"
  + 'import { ' + [...used].sort().join(', ') + " } from '@omni-design/components';\n"
  + [...icons].sort().map((n) => 'import ' + n + " from '@omni-design/icons/" + n.replace(/Icon$/, '') + "';").join('\n') + '\n'
  + PRELUDE + '\n'
  + blocks.join('\n');
writeFileSync(join(ROOT, 'types-test/api-examples.tsx'), src);
console.log('check-api-examples: ' + blocks.length + ' examples written to types-test/api-examples.tsx');
