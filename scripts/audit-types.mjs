// scripts/audit-types.mjs — run after build:types (part of `npm run test:types`).
//
// Loads the PUBLISHED declarations (dist/types) the way a consumer's compiler
// does and checks every exported component's props. Why a script and not just
// a .tsx test: a .tsx test only checks the usages someone thought to write.
// This walks the export list, so a component added tomorrow with `any` props
// fails the build the day it is added, not the day someone notices an editor
// offering no completions.
//
// A component fails when its props are `any`, carry an `[x: string]: any`
// index signature (which accepts every misspelling), or declare a prop typed
// `any`. `--report` prints the full list instead of failing, for measuring.
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { loadModel } from './lib/api-model.mjs';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const here = dirname(fileURLToPath(import.meta.url));
const entry = join(here, '../dist/types/components/index.d.ts');
const report = process.argv.includes('--report');
const asJson = process.argv.includes('--json');

const program = ts.createProgram([entry], {
  strict: true, skipLibCheck: true, jsx: ts.JsxEmit.ReactJSX, noEmit: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs, target: ts.ScriptTarget.ES2020,
  typeRoots: [join(here, '../node_modules/@types')],
});
const checker = program.getTypeChecker();
const sf = program.getSourceFile(entry);
const mod = checker.getSymbolAtLocation(sf);
const exportsList = checker.getExportsOfModule(mod);

const isAny = (t) => (t.flags & ts.TypeFlags.Any) !== 0;

/** Props type of a component, or null if the export is not a component.
 *  A component is a value with a capitalised name whose call signature takes
 *  at most one parameter and returns JSX / a React element / null — or a
 *  forwardRef / memo exotic component. */
function propsOf(sym) {
  const name = sym.getName();
  if (!/^[A-Z]/.test(name) || /^[A-Z0-9_]+$/.test(name)) return null;
  let s = sym;
  if (s.flags & ts.SymbolFlags.Alias) s = checker.getAliasedSymbol(s);
  // An export the index names but no file declares: tsc dropped it (the
  // ToggleButtonGroup presets were nine such names), so importing it is a
  // type error for every consumer.
  if (!s.declarations || !s.declarations.length) return { props: null, unresolved: true };
  if (!(s.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) return null;
  const decl = s.valueDeclaration || (s.declarations || [])[0];
  if (!decl) return null;
  const type = checker.getTypeOfSymbolAtLocation(s, decl);
  if (isAny(type)) return { props: type, whole: true };
  const sigs = type.getCallSignatures();
  if (!sigs.length) return null;
  const sig = sigs[0];
  const ret = checker.typeToString(sig.getReturnType());
  if (!/\bElement\b|ReactElement|ReactNode|null|^any$/.test(ret)) return null;
  if (sig.parameters.length > 1) return null;
  if (!sig.parameters.length) return { props: null };
  const p = sig.parameters[0];
  return { props: checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration) };
}

const results = [];
for (const sym of exportsList) {
  const info = propsOf(sym);
  if (!info) continue;
  const problems = [];
  const t = info.props;
  if (info.unresolved) problems.push('exported but declared nowhere');
  else if (info.whole) problems.push('the component itself is any');
  else if (t && isAny(t)) problems.push('props: any');
  else if (t) {
    const idx = checker.getIndexInfosOfType(t).filter((i) => isAny(i.type));
    if (idx.length) problems.push('[x: string]: any');
    for (const prop of checker.getPropertiesOfType(t)) {
      // Only the component's OWN declarations — inherited DOM attributes from
      // @types/react are not ours to fix and are not `any` anyway.
      const d = (prop.declarations || [])[0];
      if (!d || d.getSourceFile().fileName.includes('node_modules')) continue;
      const pt = checker.getTypeOfSymbolAtLocation(prop, d);
      if (isAny(pt)) problems.push(prop.getName() + ': any');
    }
  }
  results.push({ name: sym.getName(), problems });
}

// Every component needs a props type in types/ — that is also what puts it in
// docs/API.md, so this is the check that the reference lists every component.
const model = loadModel();
const claimed = new Set(model.entries.flatMap((e) => e.exports));
const apiDoc = join(here, '../docs/API.md');
const api = existsSync(apiDoc) ? readFileSync(apiDoc, 'utf8') : '';
const headings = new Set([...api.matchAll(/^### (.+)$/gm)].flatMap((m) => m[1].split(' · ')));
for (const r of results) {
  if (!claimed.has(r.name)) r.problems.push('no props type in types/ (@exports)');
  else if (!headings.has(r.name)) r.problems.push('missing from docs/API.md');
}

const bad = results.filter((r) => r.problems.length);
if (asJson) { console.log(JSON.stringify({ components: results.length, bad }, null, 1)); process.exit(0); }
if (report) {
  for (const r of bad) console.log(r.name.padEnd(28) + r.problems.join(', '));
}
console.log(`audit-types: ${results.length} exported components, ${bad.length} with any in their props`);
if (!report && bad.length) {
  for (const r of bad) console.error('  ' + r.name + ': ' + r.problems.join(', '));
  process.exit(1);
}
