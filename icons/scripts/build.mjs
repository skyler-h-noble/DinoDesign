// Builds @omni-design/icons from @mui/icons-material's own data.
//
// Each MUI icon module is `createSvgIcon(<path d="…"/>, 'Name')`. Loading the
// CommonJS build with createSvgIcon swapped for a recorder gives back the
// exact element tree — no path is retyped, so no glyph can drift. The output is
// one tiny module per icon (ESM + CommonJS + types) over src/createIcon.js.
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

const names = fs.readdirSync(path.join(muiDir, 'esm'))
  .filter((f) => f.endsWith('.js') && f !== 'index.js')
  .map((f) => f.slice(0, -3))
  .sort();

/* MUI's layout, for the same reason MUI uses it: CommonJS files and their
   types at the package ROOT, ESM in esm/. A resolver that ignores the exports
   map (Jest before 28, which Create React App ships) finds
   @omni-design/icons/Home as a real Home.js. */
const OUT = { cjs: root, esm: path.join(root, 'esm'), types: root, esmTypes: path.join(root, 'esm') };
for (const f of fs.readdirSync(root)) if (/\.(js|d\.ts)$/.test(f)) fs.rmSync(path.join(root, f));
fs.rmSync(path.join(root, 'esm'), { recursive: true, force: true });
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
fs.mkdirSync(OUT.esm, { recursive: true });
const write = (kind, file, text) => fs.writeFileSync(path.join(OUT[kind], file), text);

// createIcon: the source is ESM; the CommonJS copy is a direct translation.
const src = fs.readFileSync(path.join(root, 'src', 'createIcon.js'), 'utf8');
write('esm', 'createIcon.js', src);
const cjs = src
  .replace("import * as React from 'react';", "'use strict';\nObject.defineProperty(exports, '__esModule', { value: true });\nconst React = require('react');")
  .replace('export function getIconStyles', 'function getIconStyles')
  .replace('export default function createIcon', 'function createIcon')
  + '\nexports.default = createIcon;\nexports.getIconStyles = getIconStyles;\n';
write('cjs', 'createIcon.js', cjs);

let esmIndex = "export { default as createIcon, getIconStyles } from './createIcon.js';\n";
let cjsIndex = "'use strict';\nObject.defineProperty(exports, '__esModule', { value: true });\n"
  + "const c = require('./createIcon.js');\nexports.createIcon = c.default;\nexports.getIconStyles = c.getIconStyles;\n";
let dtsIndex = "export { default as createIcon, getIconStyles, OmniIcon, OmniIconProps } from './createIcon';\n";
let count = 0;
for (const name of names) {
  const mod = require(path.join(muiDir, name + '.js'));
  const rec = mod && mod.default;
  if (!rec || !rec.node) throw new Error('Not a createSvgIcon module: ' + name);
  const nodes = JSON.stringify(serializeList(rec.node));
  const display = JSON.stringify(rec.name);
  const dts = "import { OmniIcon } from './createIcon';\ndeclare const Icon: OmniIcon;\nexport default Icon;\n";
  write('esm', name + '.js', `import createIcon from './createIcon.js';\nexport default createIcon(${nodes}, ${display});\n`);
  write('cjs', name + '.js', `'use strict';\nObject.defineProperty(exports, '__esModule', { value: true });\nexports.default = require('./createIcon.js').default(${nodes}, ${display});\n`);
  write('types', name + '.d.ts', dts);
  write('esmTypes', name + '.d.ts', dts);
  esmIndex += `export { default as ${name} } from './${name}.js';\n`;
  cjsIndex += `Object.defineProperty(exports, ${JSON.stringify(name)}, { enumerable: true, get: () => require('./${name}.js').default });\n`;
  dtsIndex += `export { default as ${name} } from './${name}';\n`;
  count++;
}
write('esm', 'index.js', esmIndex);
write('cjs', 'index.js', cjsIndex);
write('types', 'index.d.ts', dtsIndex);
write('esmTypes', 'index.d.ts', dtsIndex);
const createIconDts = `import * as React from 'react';

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
`;
write('types', 'createIcon.d.ts', createIconDts);
write('esmTypes', 'createIcon.d.ts', createIconDts);
console.log(`@omni-design/icons: ${count} icons from @mui/icons-material ${muiVersion}`);
