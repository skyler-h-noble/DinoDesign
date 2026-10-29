// scripts/fix-dts.mjs — runs after `tsc -p tsconfig.dts.json`.
//
// The declarations are inferred from plain JS, which gets two things wrong
// that make the package unusable from strict TypeScript:
//
// 1. A destructured prop with no default is inferred as REQUIRED. Every
//    component handles a missing prop at runtime, so <Section>, <Card>,
//    <Link>, <Footer> and <OmniDesignProvider themeURL> all failed to compile
//    for want of props nobody has to pass. Every prop is made optional.
//
// 2. A JSDoc `@param {boolean} container` (no `props.` prefix) is read as the
//    type of the WHOLE props object, so Grid's props were typed `boolean` and
//    forty-odd components accepted no props at all. Those get an object type
//    built from the destructured names.
//
// Plus: React 19's types drop the global JSX namespace, so `JSX.Element`
// becomes `import("react").JSX.Element`, which resolves on React 18 and 19.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const root = new URL('../dist/types', import.meta.url).pathname;
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.d.ts')) files.push(p);
  }
})(root);

const stats = { files: 0, wholeParam: 0, optional: 0, jsx: 0 };

function namesOf(destructured) {
  return destructured.split(',')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('...'))
    .map((s) => s.split(':')[0].trim())
    .filter((s) => /^[A-Za-z_$][\w$]*$/.test(s));
}

for (const file of files) {
  let s = readFileSync(file, 'utf8');
  const before = s;

  // 2. `({ a, b: B, ...rest }: boolean)` → an object type of optional props.
  s = s.replace(/\(\{([^(){}]*)\}: (boolean|number|string|object|Object|any|ReactNode|React\.ReactNode)\)/g,
    (_, destructured) => {
      stats.wholeParam++;
      const props = namesOf(destructured).map((n) => `    ${n}?: any;`).join('\n');
      return `({${destructured}}: {\n    [x: string]: any;\n${props}\n})`;
    });

  // 1. Inside a destructured-props object type, every top-level member optional.
  s = s.replace(/\}: \{\n([\s\S]*?)\n\}\)/g, (whole, body) => {
    const fixed = body.replace(/^ {4}([A-Za-z_$][\w$]*|"[^"]+"): /gm, (m, name) => {
      stats.optional++;
      return `    ${name}?: `;
    });
    return whole.replace(body, fixed);
  });

  const jsx = (s.match(/(?<![\w.")])JSX\.Element/g) || []).length;
  if (jsx) {
    stats.jsx += jsx;
    s = s.replace(/(?<![\w.")])JSX\.Element/g, 'import("react").JSX.Element');
  }

  if (s !== before) { writeFileSync(file, s); stats.files++; }
}

console.log(`fix-dts: ${stats.files} files — ${stats.wholeParam} whole-param types replaced, `
  + `${stats.optional} props made optional, ${stats.jsx} JSX.Element references qualified`);
