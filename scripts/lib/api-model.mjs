// scripts/lib/api-model.mjs — reads the hand-written prop types in types/ into
// one model that three scripts share:
//
//   fix-dts.mjs        swaps each component's inferred signature for its type
//   build-api-doc.mjs  writes docs/API.md
//   audit-types.mjs    checks the published result
//
// Why one model: the types and the reference are the same facts. Written twice
// they drift — the old docs/components.md listed `startIcon` on Button for
// months after the prop was renamed — so the reference is GENERATED from the
// types, and the types are checked against the component source.
//
// The format, on any interface in types/:
//
//   /**
//    * One line: what it is for.            ← purpose (first paragraph)
//    * @category Overlays                   ← section in docs/API.md
//    * @exports Drawer                      ← public names using these props
//    * @ref HTMLDivElement                  ← forwardRef target (optional)
//    * @source Drawer/Drawer#Drawer         ← drift-check override (optional; `none` skips)
//    * @parent Inside <Tabs>.               ← required parent (optional)
//    * @example
//    * <Drawer open={open} onClose={close}>…</Drawer>
//    */
//   export interface DrawerProps extends Native { /** meaning. @default 'right' */ anchor?: … }
//
// A prop's default comes from `@default`, or else from the component source's
// destructuring (`size = 'medium'`), so the documented default is the real one.
import { createRequire } from 'module';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
// typescript 4.9 is in the tree as react-scripts' peer. Used here only to PARSE
// hand-written .d.ts, which it does fine; the declarations themselves are
// emitted by the pinned 5.9 (see tsconfig.dts.json).
export const ts = require('typescript');

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const TYPES_DIR = join(ROOT, 'types');
export const SRC_COMPONENTS = join(ROOT, 'src/components');

export function typeFiles() {
  const out = [];
  (function walk(dir) {
    for (const f of readdirSync(dir).sort()) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith('.d.ts')) out.push(p);
    }
  })(TYPES_DIR);
  return out;
}

const TAGS = ['category', 'exports', 'ref', 'source', 'parent', 'example', 'default'];

/** JSDoc of a node: { text, tags: { name: [values] } }. Parsed from the raw
 *  comment rather than ts.getJSDocTags so an @example keeps its line breaks
 *  and its JSX braces exactly as written. */
function jsdoc(node, sf) {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.pos) || [];
  const r = ranges.filter((c) => sf.text.slice(c.pos, c.pos + 3) === '/**').pop();
  if (!r) return { text: '', tags: {} };
  const body = sf.text.slice(r.pos + 3, r.end - 2)
    .split('\n').map((l) => l.replace(/^\s*\* ?/, '')).join('\n');
  const tags = {};
  const parts = body.split(new RegExp('^@(?=(?:' + TAGS.join('|') + ')\\b)', 'm'));
  // Inline tags on one line: "Meaning. @default 'x'"
  let text = parts.shift();
  const inline = text.match(/\s@default\s+(.+)$/m);
  if (inline) { (tags.default = tags.default || []).push(inline[1].trim()); text = text.replace(inline[0], ''); }
  const inlineDep = text.match(/\s?@deprecated\b\s*(.*)$/m);
  if (inlineDep) { tags.deprecated = [inlineDep[1].trim()]; text = text.replace(inlineDep[0], ''); }
  for (const part of parts) {
    const m = part.match(/^(\w+)\s?([\s\S]*)$/);
    const value = m[1] === 'example' ? m[2].replace(/\s+$/, '') : m[2].trim();
    (tags[m[1]] = tags[m[1]] || []).push(value);
  }
  return { text: text.trim().replace(/\s*\n\s*/g, ' '), tags };
}

/** Parse every interface / type alias in types/ that carries an @exports tag.
 *  Returns { entries, program, checker, aliases } where an entry is
 *  { type, file, purpose, category, exports[], ref, sources[], parent,
 *    example, props: [{ name, type, optional, doc, default, deprecated }] }. */
export function loadModel() {
  const files = typeFiles();
  const program = ts.createProgram(files, {
    strict: true, skipLibCheck: true, noEmit: true, jsx: ts.JsxEmit.ReactJSX,
    moduleResolution: ts.ModuleResolutionKind.NodeJs, target: ts.ScriptTarget.ES2020,
    typeRoots: [join(ROOT, 'node_modules/@types')],
  });
  const checker = program.getTypeChecker();
  const entries = [];
  const decls = new Map();    // interface name → { node, sf }
  const aliases = new Map();  // exported `type X = …` → { text, doc }

  for (const file of files) {
    const sf = program.getSourceFile(file);
    for (const st of sf.statements) {
      if (ts.isInterfaceDeclaration(st)) decls.set(st.name.text, { node: st, sf });
      if (ts.isTypeAliasDeclaration(st)) {
        decls.set(st.name.text, { node: st, sf });
        const exported = (st.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
        if (exported) aliases.set(st.name.text, { text: st.type.getText(sf).replace(/\s+/g, ' '), doc: jsdoc(st, sf).text, file });
      }
    }
  }

  /** Own members, then members of extended interfaces declared in types/. */
  function members(name, seen = new Set()) {
    if (seen.has(name)) return [];
    seen.add(name);
    const d = decls.get(name);
    if (!d) return [];
    const { node, sf } = d;
    const out = [];
    const memberList = ts.isInterfaceDeclaration(node) ? node.members
      : ts.isTypeLiteralNode(node.type) ? node.type.members : [];
    for (const m of memberList) {
      if (!ts.isPropertySignature(m) && !ts.isMethodSignature(m)) continue;
      const pname = m.name.getText(sf).replace(/^['"]|['"]$/g, '');
      const doc = jsdoc(m, sf);
      out.push({
        name: pname,
        type: m.type ? m.type.getText(sf).replace(/\s+/g, ' ') : 'unknown',
        optional: !!m.questionToken,
        doc: doc.text,
        default: (doc.tags.default || [])[0],
        deprecated: doc.tags.deprecated ? (doc.tags.deprecated[0] || true) : undefined,
      });
    }
    const heritage = ts.isInterfaceDeclaration(node) ? (node.heritageClauses || []).flatMap((h) => h.types) : [];
    for (const h of heritage) {
      const base = h.expression.getText(sf);
      if (decls.has(base)) {
        for (const m of members(base, seen)) if (!out.some((o) => o.name === m.name)) out.push(m);
      }
    }
    return out;
  }

  /** Native attributes a props type forwards: `Native<HTMLButtonElement>` → "button". */
  function nativeOf(node, sf) {
    if (!ts.isInterfaceDeclaration(node)) return null;
    for (const h of (node.heritageClauses || []).flatMap((c) => c.types)) {
      const t = h.getText(sf);
      // Native<HTMLButtonElement> — the shared helper; its argument names the element.
      if (h.expression.getText(sf) === 'Native') return t === 'Native' ? 'Native<HTMLDivElement>' : t;
      if (decls.has(h.expression.getText(sf))) {
        const inner = nativeOf(decls.get(h.expression.getText(sf)).node, sf);
        if (inner) return inner;
        continue;
      }
      return t;
    }
    return null;
  }

  for (const [name, { node, sf }] of decls) {
    const doc = jsdoc(node, sf);
    if (!doc.tags.exports) continue;
    const exportsList = doc.tags.exports.join(' ').split(/[\s,]+/).filter(Boolean);
    entries.push({
      type: name,
      file: sf.fileName,
      purpose: doc.text,
      category: (doc.tags.category || ['Other'])[0],
      exports: exportsList,
      ref: (doc.tags.ref || [])[0],
      sources: doc.tags.source || [],
      parent: (doc.tags.parent || [])[0],
      example: (doc.tags.example || [])[0],
      native: nativeOf(node, sf),
      props: members(name),
      node, sf,
    });
  }
  return { entries, program, checker, decls, aliases };
}

/** Every prop name the type accepts, inherited native attributes included —
 *  what the drift check compares the source's destructuring against. */
export function acceptedProps(model, entry) {
  const sym = model.checker.getSymbolAtLocation(entry.node.name);
  const t = model.checker.getDeclaredTypeOfSymbol(sym);
  return new Set(model.checker.getPropertiesOfType(t).map((p) => p.getName()));
}

// ─── Component source ────────────────────────────────────────────────────────

/** The props a source function destructures, with their default text:
 *  `function X({ a, b = 1, ...rest })` → [{ name: 'a' }, { name: 'b', default: '1' }].
 *  Returns null when the function exists but takes `props` whole. */
export function destructured(file, fn) {
  const path = join(SRC_COMPONENTS, file + '.js');
  if (!existsSync(path)) return undefined;
  const src = readFileSync(path, 'utf8');
  const at = [
    new RegExp('function ' + fn + '\\s*\\('),
    new RegExp('\\b' + fn + '\\s*=\\s*(?:React\\.)?(?:forwardRef|memo)\\(\\s*(?:(?:React\\.)?forwardRef\\(\\s*)?function\\s*\\w*\\s*\\('),
    new RegExp('\\b' + fn + '\\s*=\\s*(?:React\\.)?(?:forwardRef|memo)\\(\\s*\\('),
    new RegExp('\\bconst ' + fn + '\\s*=\\s*\\('),
  ].map((re) => src.search(re)).find((i) => i >= 0);
  if (at === undefined) return undefined;
  const paren = src.indexOf('(', src.indexOf(fn, at) + fn.length);
  let k = paren + 1;
  while (/\s/.test(src[k])) k++;
  if (src[k] !== '{') return null;
  let depth = 0, i = k;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; continue; }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); continue; }
    if (c === "'" || c === '"' || c === '`') { const q = c; i++; while (src[i] !== q) { if (src[i] === '\\') i++; i++; } continue; }
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') { depth--; if (depth === 0) break; }
  }
  const body = src.slice(k + 1, i).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const parts = []; let d = 0, cur = '', q = null;
  for (const c of body) {
    if (q) { if (c === q) q = null; cur += c; continue; }
    if (c === "'" || c === '"' || c === '`') q = c;
    if ('({['.includes(c)) d++; else if (')}]'.includes(c)) d--;
    if (c === ',' && d === 0) { parts.push(cur); cur = ''; } else cur += c;
  }
  parts.push(cur);
  return parts.map((n) => n.trim()).filter((n) => n && !n.startsWith('...')).map((n) => {
    const eq = n.indexOf('=');
    const head = (eq >= 0 ? n.slice(0, eq) : n).split(':')[0].trim().replace(/^['"]|['"]$/g, '');
    return { name: head, default: eq >= 0 ? n.slice(eq + 1).trim().replace(/\s+/g, ' ') : undefined };
  }).filter((p) => p.name);
}

/** Where the published declaration of each public export lives, resolved
 *  through dist/types/components/index.d.ts the way a consumer's compiler
 *  resolves it: name → { file (dist path), local (declared name) }.
 *  An export that resolves to nothing (tsc dropped it) maps to the module
 *  file named in index.d.ts's `export { … } from`, with found=false. */
export function resolveExports(distTypes) {
  const entry = join(distTypes, 'components/index.d.ts');
  const program = ts.createProgram([entry], {
    skipLibCheck: true, noEmit: true, moduleResolution: ts.ModuleResolutionKind.NodeJs,
    typeRoots: [join(ROOT, 'node_modules/@types')],
  });
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(entry);
  const out = new Map();
  const fromOf = new Map();
  for (const st of sf.statements) {
    if (ts.isExportDeclaration(st) && st.moduleSpecifier && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const el of st.exportClause.elements) {
        fromOf.set(el.name.text, { spec: st.moduleSpecifier.text, local: (el.propertyName || el.name).text });
      }
    }
  }
  for (const sym of checker.getExportsOfModule(checker.getSymbolAtLocation(sf))) {
    const name = sym.getName();
    let s = sym;
    if (s.flags & ts.SymbolFlags.Alias) s = checker.getAliasedSymbol(s);
    const d = s.valueDeclaration || (s.declarations || [])[0];
    if (d) out.set(name, { file: d.getSourceFile().fileName, local: s.getName(), found: true });
    else if (fromOf.has(name)) {
      const { spec, local } = fromOf.get(name);
      let file = join(distTypes, 'components', spec);
      file = existsSync(file + '.d.ts') ? file + '.d.ts' : join(file, 'index.d.ts');
      // An index.d.ts that re-exports: follow one `export … from` hop.
      if (file.endsWith('index.d.ts')) {
        const txt = readFileSync(file, 'utf8');
        const m = txt.match(new RegExp('export \\{[^}]*\\b' + local + '\\b[^}]*\\} from ["\']([^"\']+)["\']'));
        if (m) file = join(dirname(file), m[1] + '.d.ts');
      }
      out.set(name, { file, local, found: false });
    }
  }
  return out;
}

/** dist/types/components/X/Y.d.ts → 'X/Y' (the matching src/components path). */
export function srcPathOf(distTypes, dtsFile) {
  return relative(join(distTypes, 'components'), dtsFile).replace(/\.d\.ts$/, '');
}
