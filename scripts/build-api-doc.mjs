// scripts/build-api-doc.mjs — writes docs/API.md from the prop types in types/.
//
// Run by fix-dts.mjs at the end of build:types, so the reference is rebuilt
// from the same files as the published .d.ts every time the package builds.
// It is generated rather than written because a hand-kept prop list drifts:
// an AI tool that cannot trust the list opens dist/ to check, which is the
// cost this file exists to remove (80 lookups into dist/ in one clean-room
// build before it existed).
//
//   node scripts/build-api-doc.mjs           regenerate (needs dist/types)
//   node scripts/build-api-doc.mjs --check   fail if docs/API.md is stale
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { loadModel, resolveExports, destructured, srcPathOf, ROOT } from './lib/api-model.mjs';

export const API_DOC = join(ROOT, 'docs/API.md');

/** The order sections appear in — CLAUDE.md's grouping. */
const CATEGORIES = [
  'Provider', 'Layout', 'Text', 'Buttons', 'Inputs', 'Selection', 'Dates', 'Surfaces',
  'Navigation', 'Overlays', 'Feedback', 'Data display', 'Media', 'Charts', 'App structure', 'Utilities',
];

/** Shared unions written once at the top instead of in every table. */
const VOCAB = ['Theme', 'Surface', 'Color', 'Size', 'ButtonVariant', 'TextColor', 'HeadingColor', 'TextStyle', 'IconShape', 'AvatarShape', 'Breakpoint', 'Sx'];

const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
// React.ReactNode → ReactNode: the namespace is noise in a table read per token.
const tidy = (s) => String(s).replace(/\bReact\./g, '');
const code = (s) => { const t = cell(tidy(s)); return t.includes('`') ? '`` ' + t + ' ``' : '`' + t + '`'; };

function shortDefault(d) {
  if (d === undefined || d === null || d === '') return '';
  const s = String(d).replace(/\s+/g, ' ');
  if (s.length > 28 || /=>|function|\{\s*\w+\s*:/.test(s)) return '';
  return code(s);
}

function nativeLabel(native) {
  if (!native) return '';
  const m = native.match(/HTML(\w*?)Element/) || [null, 'Div'];
  const el = { Button: 'button', Anchor: 'a', Input: 'input', TextArea: 'textarea', Div: 'div', Span: 'span', Paragraph: 'p', Heading: 'h1–h6', Image: 'img', UList: 'ul', LI: 'li', Select: 'select', Form: 'form' }[m && m[1]];
  return el ? '<' + el + '>' : 'HTML element';
}

/** Render the whole reference. `defaultsFor(entry)` returns name → default
 *  text read from the component source. */
export function renderApiDoc(model, defaultsFor) {
  const out = [];
  const total = model.entries.reduce((n, e) => n + e.exports.length, 0);
  out.push('# Component API — @omni-design/components');
  out.push('');
  out.push('Every exported component: purpose, props, required parent, one example. ' +
    'GENERATED from `types/` by `scripts/build-api-doc.mjs` — the same files the published ' +
    '.d.ts come from, so this cannot drift from the types. Do not edit by hand. ' +
    'Do not open `dist/` to learn a prop: if it is not here, the component does not take it. ' +
    'Rules (colour, surfaces, layout) are in `CLAUDE.md`.');
  out.push('');
  out.push('Read a section, not the file: search for `### Name`. ' + total + ' components.');
  out.push('');
  out.push('Conventions: every prop is optional unless marked **required**. "+ `<div>`" means the ' +
    'native attributes of that element pass through (id, className, style, aria-*, data-*, on*). ' +
    'Defaults come from the component source.');
  out.push('');
  out.push('## Shared types');
  out.push('');
  for (const name of VOCAB) {
    const a = model.aliases.get(name);
    if (!a) continue;
    out.push('- `' + name + '` = ' + code(a.text.replace(/^\| /, '')) + (a.doc ? ' — ' + a.doc : ''));
  }
  out.push('');

  const byCat = new Map();
  for (const e of model.entries) {
    if (!byCat.has(e.category)) byCat.set(e.category, []);
    byCat.get(e.category).push(e);
  }
  const cats = [...CATEGORIES.filter((c) => byCat.has(c)), ...[...byCat.keys()].filter((c) => !CATEGORIES.includes(c))];
  out.push('Sections: ' + cats.map((c) => c).join(' · '));
  out.push('');

  for (const cat of cats) {
    out.push('## ' + cat);
    out.push('');
    for (const e of byCat.get(cat)) {
      const [primary, ...rest] = e.exports;
      out.push('### ' + [primary, ...rest].join(' · '));
      const meta = [e.purpose];
      if (e.parent) meta.push('**Parent:** ' + e.parent);
      if (e.ref) meta.push('Ref: `' + e.ref + '`.');
      out.push(meta.filter(Boolean).join(' '));
      const defaults = defaultsFor(e);
      const rows = e.props.filter((p) => p.name !== 'sx' || e.props.length < 3);
      if (rows.length) {
        out.push('');
        out.push('| Prop | Type | Default | Meaning |');
        out.push('|---|---|---|---|');
        for (const p of rows) {
          const def = p.default !== undefined ? code(p.default) : shortDefault(defaults.get(p.name));
          let meaning = p.doc || '';
          if (p.deprecated) meaning = '**Deprecated.** ' + (typeof p.deprecated === 'string' ? p.deprecated + ' ' : '') + meaning;
          if (!p.optional) meaning = '**required.** ' + meaning;
          out.push('| ' + code(p.name) + ' | ' + code(p.type) + ' | ' + def + ' | ' + cell(meaning.trim()) + ' |');
        }
      }
      const nat = nativeLabel(e.native);
      if (nat) out.push((rows.length ? '' : '\n') + '+ `' + nat + '`');
      if (e.example) {
        out.push('');
        out.push('```jsx');
        out.push(e.example.trim());
        out.push('```');
      }
      out.push('');
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** name → source default, across every function the entry's exports name. */
export function makeDefaultsFor(where, distTypes) {
  return (e) => {
    const map = new Map();
    const sources = e.sources.filter((s) => s !== 'none');
    const list = sources.length ? sources
      : e.exports.map((n) => where.get(n)).filter(Boolean).map((at) => srcPathOf(distTypes, at.file) + '#' + at.local);
    for (const s of list) {
      const [file, fn] = s.split('#');
      for (const p of destructured(file, fn) || []) if (!map.has(p.name) && p.default !== undefined) map.set(p.name, p.default);
    }
    return map;
  };
}

export function buildApiDoc(distTypes, model = loadModel()) {
  const where = resolveExports(distTypes);
  return renderApiDoc(model, makeDefaultsFor(where, distTypes));
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const distTypes = join(ROOT, 'dist/types');
  if (!existsSync(join(distTypes, 'components/index.d.ts'))) {
    console.error('build-api-doc: run `npm run build:types` first (needs dist/types)');
    process.exit(1);
  }
  const doc = buildApiDoc(distTypes);
  if (process.argv.includes('--check')) {
    const have = existsSync(API_DOC) ? readFileSync(API_DOC, 'utf8') : '';
    if (have !== doc) {
      console.error('build-api-doc: docs/API.md is stale — run `npm run build:types` and commit it');
      process.exit(1);
    }
    console.log('build-api-doc: docs/API.md is current');
  } else {
    writeFileSync(API_DOC, doc);
    console.log('build-api-doc: wrote ' + relative(ROOT, API_DOC) + ' (' + doc.length + ' chars)');
  }
}
