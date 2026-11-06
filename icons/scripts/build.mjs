// Builds @omni-design/icons from @mui/icons-material's own data.
//
// Each MUI icon module is `createSvgIcon(<path d="…"/>, 'Name')`. Loading the
// CommonJS build with createSvgIcon swapped for a recorder gives back the
// exact element tree — no path is retyped, so no glyph can drift.
//
// LAYOUT (0.2.0). Installing is dominated by FILE COUNT, not bytes: 0.1.0 was
// 43,103 files (every icon in five styles, as ESM + CommonJS + two .d.ts), and
// `npm install` spent most of its time writing them. Now:
//
//   Add.js …        one tiny ES module per FILLED icon, at the package root,
//                   so `import AddIcon from '@omni-design/icons/Add'` works and
//                   a bundler keeps only what is imported.
//   outlined.js …   ONE module per other style (outlined, rounded, sharp,
//                   twotone), every icon a pure named export, tree-shaken the
//                   same way: `import { HomeOutlined } from
//                   '@omni-design/icons/outlined'`.
//   index.js        all of the above, named:
//                   `import { Add, HomeOutlined } from '@omni-design/icons'`.
//   *.cjs           require() for the ROOT and the style entries only
//                   (index.cjs, outlined.cjs …). Per-icon subpaths are ESM;
//                   require() of one needs Node's require(esm) (20.19+/22.12+).
//   icon.d.ts       the one type every per-icon subpath resolves to (the ~2,200
//                   per-icon .d.ts files of 0.1.0 were byte-identical).
//
// The files sit at the ROOT, not in esm/, so a resolver that ignores the
// exports map (Jest before 28, which Create React App ships) still finds
// @omni-design/icons/Home as a real Home.js.
import { createRequire } from 'module';
import Module from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(path.join(root, '..', 'package.json'));
const muiDir = path.dirname(require.resolve('@mui/icons-material'));
const muiVersion = JSON.parse(fs.readFileSync(path.join(muiDir, 'package.json'), 'utf8')).version;

// Record instead of render.
const realLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (/[\\/]utils[\\/]createSvgIcon$|^\.\/utils\/createSvgIcon$/.test(request)) {
    return { __esModule: true, default: (node, name) => ({ node, name }) };
  }
  return realLoad.call(this, request, parent, isMain);
};

/* A list of [type, attrs, children?] nodes. A React.Fragment (121 icons wrap
   their paths in one) has no element of its own, so its children are lifted
   into the list where it stood. */
const serializeList = (els) => (Array.isArray(els) ? els : [els]).flatMap((el) => {
  if (el == null || el === false) return [];
  const { children, ...attrs } = el.props || {};
  if (typeof el.type !== 'string') {
    if (el.type === Symbol.for('react.fragment')) return serializeList(children);
    throw new Error('Unexpected element type in an icon: ' + String(el.type));
  }
  const kids = children == null ? null : serializeList(children);
  return [kids && kids.length ? [el.type, attrs, kids] : [el.type, attrs]];
});

/* Style by MUI's naming rule: the suffix decides. 18 styled icons have no
   filled sibling (FaceUnlockOutlined, WifiCalling1TwoTone …); they still go
   with their style, since that is the glyph they are. */
const STYLES = [
  ['outlined', 'Outlined'],
  ['rounded', 'Rounded'],
  ['sharp', 'Sharp'],
  ['twotone', 'TwoTone'],
];
const styleOf = (name) => {
  const hit = STYLES.find(([, suffix]) => name.endsWith(suffix) && name.length > suffix.length);
  return hit ? hit[0] : 'filled';
};

const names = fs.readdirSync(path.join(muiDir, 'esm'))
  .filter((f) => f.endsWith('.js') && f !== 'index.js')
  .map((f) => f.slice(0, -3))
  .sort();

// Clear every generated file (and 0.1.0's esm/ tree).
for (const f of fs.readdirSync(root)) if (/\.(js|cjs|d\.c?ts)$/.test(f)) fs.rmSync(path.join(root, f));
fs.rmSync(path.join(root, 'esm'), { recursive: true, force: true });
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
const write = (file, text) => fs.writeFileSync(path.join(root, file), text);
/* Types twice: .d.ts for import, .d.cts for require. Under TypeScript's
   node16/nodenext resolution a "type": "module" package's .d.ts is ESM, so a
   CommonJS caller needs its own copy pointing at the .cjs files. */
const writeTypes = (base, make) => {
  write(base + '.d.ts', make('js'));
  write(base + '.d.cts', make('cjs'));
};

// createIcon: the source is ESM; the CommonJS copy is a direct translation.
const src = fs.readFileSync(path.join(root, 'src', 'createIcon.js'), 'utf8');
write('createIcon.js', src);
write('createIcon.cjs', src
  .replace("import * as React from 'react';", "'use strict';\nObject.defineProperty(exports, '__esModule', { value: true });\nconst React = require('react');")
  .replace('export function getIconStyles', 'function getIconStyles')
  .replace('export default function createIcon', 'function createIcon')
  + '\nexports.default = createIcon;\nexports.getIconStyles = getIconStyles;\n');

const PURE = '/*#__PURE__*/';
const groups = { filled: [] };
for (const [style] of STYLES) groups[style] = [];
for (const name of names) {
  const mod = require(path.join(muiDir, name + '.js'));
  const rec = mod && mod.default;
  if (!rec || !rec.node) throw new Error('Not a createSvgIcon module: ' + name);
  groups[styleOf(name)].push({ name, args: `${JSON.stringify(serializeList(rec.node))}, ${JSON.stringify(rec.name)}` });
}

const CJS_HEAD = "'use strict';\nObject.defineProperty(exports, '__esModule', { value: true });\n";

// Filled: one ES module per icon.
for (const { name, args } of groups.filled) {
  write(name + '.js', `import createIcon from './createIcon.js';\nexport default ${PURE}createIcon(${args});\n`);
}

// Other styles: one module per style, in both formats, plus its types.
for (const [style] of STYLES) {
  const list = groups[style];
  write(style + '.js', "import createIcon from './createIcon.js';\n"
    + list.map(({ name, args }) => `export const ${name} = ${PURE}createIcon(${args});\n`).join(''));
  write(style + '.cjs', CJS_HEAD + "const c = require('./createIcon.cjs').default;\n"
    + list.map(({ name, args }) => `exports.${name} = c(${args});\n`).join(''));
  writeTypes(style, (ext) => `import { OmniIcon } from './createIcon.${ext}';\n`
    + list.map(({ name }) => `export declare const ${name}: OmniIcon;\n`).join(''));
}

// Root, ESM: filled re-exported from their own files (one component per icon
// however it is imported), styles re-exported whole.
write('index.js', "export { default as createIcon, getIconStyles } from './createIcon.js';\n"
  + groups.filled.map(({ name }) => `export { default as ${name} } from './${name}.js';\n`).join('')
  + STYLES.map(([style]) => `export * from './${style}.js';\n`).join(''));

/* Root, CommonJS: filled icons defined here, in one file (a require() cannot
   tree-shake anyway); each style is read on first use of one of its icons, so
   a test that only needs Add does not parse four other styles. */
write('index.cjs', CJS_HEAD
  + "const cm = require('./createIcon.cjs');\nconst c = cm.default;\n"
  + 'exports.createIcon = c;\nexports.getIconStyles = cm.getIconStyles;\n'
  + groups.filled.map(({ name, args }) => `exports.${name} = c(${args});\n`).join('')
  + 'const lazy = (file, names) => { let m; for (const n of names) Object.defineProperty(exports, n, { enumerable: true, get: () => (m || (m = require(file)))[n] }); };\n'
  + STYLES.map(([style]) => `lazy('./${style}.cjs', ${JSON.stringify(groups[style].map((g) => g.name))});\n`).join(''));

writeTypes('index', (ext) => `export { default as createIcon, getIconStyles, OmniIcon, OmniIconProps } from './createIcon.${ext}';\n`
  + `import { OmniIcon } from './createIcon.${ext}';\n`
  + groups.filled.map(({ name }) => `export declare const ${name}: OmniIcon;\n`).join('')
  + STYLES.map(([style]) => `export * from './${style}.${ext}';\n`).join(''));

// The one type every per-icon subpath (`@omni-design/icons/Add`) resolves to.
write('icon.d.ts', "import { OmniIcon } from './createIcon.js';\ndeclare const Icon: OmniIcon;\nexport default Icon;\n");

writeTypes('createIcon', () => `import * as React from 'react';

export interface OmniIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color' | 'fontSize' | 'ref'> {
  /** small 1.25rem | medium 1.5rem (default) | large 2.1875rem | inherit */
  fontSize?: 'inherit' | 'small' | 'medium' | 'large';
  /** inherit (default) follows the text; the others read the design system's icon tokens. */
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'action' | 'disabled';
  /** A color attribute on the <svg> itself. */
  htmlColor?: string;
  /** Gives the icon an accessible name (role="img" + <title>). Leave unset for decoration. */
  titleAccess?: string;
  viewBox?: string;
  /** Plain CSS properties only (plus MUI spacing shorthands such as mr). */
  sx?: Record<string, string | number>;
}
export type OmniIcon = React.MemoExoticComponent<React.ForwardRefExoticComponent<OmniIconProps & React.RefAttributes<SVGSVGElement>>> & { muiName: string };
export default function createIcon(nodes: unknown[], displayName: string): OmniIcon;
export function getIconStyles(): string;
`);

const counts = Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length]));
console.log(`@omni-design/icons: ${names.length} icons from @mui/icons-material ${muiVersion}`, counts);
