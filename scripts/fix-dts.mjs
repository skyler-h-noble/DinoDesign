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
import { readdirSync, readFileSync, writeFileSync, statSync, copyFileSync, mkdirSync } from 'fs';
import { loadModel, acceptedProps, destructured, resolveExports, srcPathOf, typeFiles, TYPES_DIR, ROOT, ts } from './lib/api-model.mjs';
import { join, relative, dirname } from 'path';
import { buildApiDoc, API_DOC } from './build-api-doc.mjs';

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

// ─── Exact prop types for every component ────────────────────────────────────
// types/ holds hand-written props for every exported component (see
// scripts/lib/api-model.mjs for the format). Each component's inferred
// declaration is replaced by one typed with its props interface, and the build
// FAILS when:
//   - a component destructures a prop its type does not declare (the type is
//     behind the source — add the prop), or
//   - an @exports name does not exist in the package (the type is ahead).
// So the types cannot drift from the components, and docs/API.md, generated
// from the same files, cannot drift from either.
const model = loadModel();
const typesOut = root;
for (const f of typeFiles()) {
  const dest = join(typesOut, relative(TYPES_DIR, f));
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(f, dest);
}

/** Index just past the `;` that ends a declaration starting at `from`,
 *  skipping over nested (), {}, [] and <> so an object type's own `;` does
 *  not end it early. */
function declEnd(text, from) {
  let depth = 0;
  for (let i = from; i < text.length; i++) {
    const c = text[i];
    if ('({['.includes(c)) depth++;
    else if (')}]'.includes(c)) depth--;
    else if (c === ';' && depth === 0) return i + 1;
  }
  return text.length;
}

/** Remove every declaration of `name` — function overloads, consts, and
 *  (for a const replacement) namespaces — returning the stripped text. tsc
 *  sometimes emits the same function several times (the ToggleButtonGroup
 *  presets came out as nine copies of one name), so all of them go. */
function stripDecls(text, name, dropNamespaces) {
  const starts = [
    new RegExp('^export (?:declare )?function ' + name + '\\b', 'm'),
    new RegExp('^export (?:declare )?const ' + name + '\\s*:', 'm'),
    ...(dropNamespaces ? [new RegExp('^export (?:declare )?namespace ' + name + ' \\{[^}]*\\}\\n?', 'm')] : []),
  ];
  for (;;) {
    let hit = -1, re = null;
    for (const r of starts) { const i = text.search(r); if (i >= 0 && (hit < 0 || i < hit)) { hit = i; re = r; } }
    if (hit < 0) break;
    const end = /namespace/.test(re.source) ? hit + text.slice(hit).match(re)[0].length : declEnd(text, hit);
    text = text.slice(0, hit) + text.slice(end).replace(/^\n/, '');
  }
  // Keep one copy of a namespace that merges with the function.
  const nsRe = new RegExp('^export namespace ' + name + ' \\{ \\}\\n', 'gm');
  let n = 0;
  text = text.replace(nsRe, (m) => (n++ ? '' : m));
  return text;
}

const where = resolveExports(root);
const claimed = new Map();   // file#local → type, so two types cannot claim one component
const perFile = new Map();   // file → [{ local, decl }]
const problems = [];
let typed = 0;
const SKIP_DRIFT = new Set(['className', 'style']);

for (const e of model.entries) {
  const accepted = acceptedProps(model, e);
  const checkedSources = new Set();
  for (const name of e.exports) {
    const at = where.get(name);
    if (!at) { problems.push(e.type + ': @exports ' + name + ' — the package exports no such name'); continue; }
    const key = at.file + '#' + at.local;
    if (claimed.has(key)) {
      if (claimed.get(key) !== e.type) problems.push(name + ' is claimed by both ' + claimed.get(key) + ' and ' + e.type);
      continue;
    }
    claimed.set(key, e.type);
    const rel = relative(dirname(at.file), join(typesOut, relative(TYPES_DIR, e.file).replace(/\.d\.ts$/, ''))).split('\\').join('/');
    const T = 'import("' + (rel.startsWith('.') ? rel : './' + rel) + '").' + e.type;
    const decl = e.ref
      ? 'export declare const ' + at.local + ': import("react").ForwardRefExoticComponent<' + T + ' & import("react").RefAttributes<' + e.ref + '>>;'
      : 'export declare function ' + at.local + '(props: ' + T + '): import("react").JSX.Element;';
    if (!perFile.has(at.file)) perFile.set(at.file, []);
    perFile.get(at.file).push({ local: at.local, decl, isConst: !!e.ref });

    // Drift: what the source destructures must be accepted by the type.
    const sources = e.sources.length ? e.sources : [srcPathOf(root, at.file) + '#' + at.local];
    for (const s of sources) {
      if (s === 'none' || checkedSources.has(s)) continue;
      checkedSources.add(s);
      const [file, fn] = s.split('#');
      const got = destructured(file, fn);
      if (got === undefined && e.sources.length) problems.push(e.type + ': @source ' + s + ' — no such function');
      if (!got) continue;
      const missing = got.map((p) => p.name)
        .filter((p) => !accepted.has(p) && !SKIP_DRIFT.has(p) && !/^(aria|data)-/.test(p));
      if (missing.length) problems.push(fn + ' takes ' + missing.join(', ') + ' — not in ' + e.type + ' (' + relative(ROOT, e.file) + ')');
    }
  }
}

for (const [file, list] of perFile) {
  let text = readFileSync(file, 'utf8');
  for (const { local, isConst } of list) text = stripDecls(text, local, isConst);
  text = text.replace(/\n*$/, '\n') + list.map((x) => x.decl).join('\n') + '\n';
  writeFileSync(file, text);
  typed += list.length;
}

if (problems.length) {
  console.error('fix-dts: the prop types in types/ do not match the package:\n  ' + problems.join('\n  '));
  process.exit(1);
}

// Export the vocabulary and every props interface, so consumers can type
// their own wrappers (`function MyCard(p: CardProps)`).
const indexDts = join(root, 'components', 'index.d.ts');
const byFile = new Map();
for (const [name, a] of model.aliases) {
  if (!byFile.has(a.file)) byFile.set(a.file, new Set());
  byFile.get(a.file).add(name);
}
for (const [name, d] of model.decls) {
  const exported = (d.node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
  if (!exported) continue;
  if (!byFile.has(d.sf.fileName)) byFile.set(d.sf.fileName, new Set());
  byFile.get(d.sf.fileName).add(name);
}
const seenTypes = new Set();
let typeExports = '';
for (const [file, names] of byFile) {
  const fresh = [...names].filter((n) => !seenTypes.has(n));
  fresh.forEach((n) => seenTypes.add(n));
  if (!fresh.length) continue;
  const rel = relative(join(root, 'components'), join(typesOut, relative(TYPES_DIR, file).replace(/\.d\.ts$/, ''))).split('\\').join('/');
  typeExports += 'export type { ' + fresh.sort().join(', ') + ' } from "' + rel + '";\n';
}
writeFileSync(indexDts, readFileSync(indexDts, 'utf8') + '\n' + typeExports);
console.log('fix-dts: ' + typed + ' component declarations given exact prop types from types/');

// The reference is generated from the same model, in the same step, so a
// build that ships new types always ships the matching docs/API.md.
const doc = buildApiDoc(root, model);
writeFileSync(API_DOC, doc);
console.log('fix-dts: wrote docs/API.md (' + doc.length + ' chars, ~' + Math.round(doc.length / 4) + ' tokens)');
