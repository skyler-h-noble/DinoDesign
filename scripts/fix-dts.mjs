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
import { readdirSync, readFileSync, writeFileSync, statSync, copyFileSync } from 'fs';
import { join, relative, dirname } from 'path';

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

// ─── Exact prop types for the core components ────────────────────────────────
// types/core-props.d.ts holds hand-written props for the components a page is
// built from. Each export below gets `(props: XProps)` in place of the
// inferred signature, and the build FAILS if the component destructures a
// prop the hand-written type does not declare — so the file cannot drift.
const srcRoot = new URL('../src/components', import.meta.url).pathname;
copyFileSync(new URL('../types/core-props.d.ts', import.meta.url).pathname, join(root, 'core-props.d.ts'));
const coreProps = readFileSync(join(root, 'core-props.d.ts'), 'utf8');

const TEXT = ['Body', 'BodyLarge', 'BodySmall', 'Caption', 'Eyebrow', 'EyebrowSmall', 'EyebrowLarge',
  'Subtitle', 'SubtitleLarge', 'SubtitleSmall', 'Label', 'Overline'];
const HEADING = ['DisplayLarge', 'DisplayMedium', 'DisplaySmall', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
// file → [type, the source function whose props it must cover, exports]
const CORE = [
  ['Section/Section', 'SectionProps', 'Section', ['Section']],
  ['Container/Container', 'ContainerProps', 'ContainerMui', ['Container'], 'Container/Container.mui'],
  ['Grid/Grid', 'GridProps', 'GridMui', ['Grid'], 'Grid/Grid.mui'],
  ['Stack/Stack', 'StackProps', 'OmniStackMui', ['VStack', 'HStack', 'Stack'], 'Stack/Stack.mui'],
  ['Card/Card', 'CardProps', 'Card', ['Card']],
  ['Button/Button', 'ButtonProps', 'Button', ['Button']],
  ['ToggleButtonGroup/ToggleButtonGroup', 'ToggleButtonGroupProps', 'ToggleButtonGroup', ['ToggleButtonGroup']],
  ['Link/Link', 'LinkProps', 'Link', ['Link']],
  ['Typography/Typography', 'TypographyProps', 'Typography', ['Typography']],
  ['Typography/Typography', 'TextProps', null, TEXT],
  ['Typography/Typography', 'HeadingProps', null, HEADING],
  ['Icon/Icon', 'IconProps', 'Icon', ['Icon']],
  ['IconBadge/IconBadge', 'IconBadgeProps', 'IconBadgeEmotion', ['IconBadge'], 'IconBadge/IconBadge.mui'],
  ['Chip/Chip', 'ChipProps', 'Chip', ['Chip']],
  ['Avatar/Avatar', 'AvatarProps', 'Avatar', ['Avatar']],
  ['TextField/TextField', 'TextFieldProps', 'TextField', ['TextField']],
  ['Footer/Footer', 'FooterProps', 'Footer', ['Footer']],
  ['AppBar/AppBar', 'AppBarProps', 'DesktopAppBar', ['AppBar']],
  ['AppBar/AppBar', 'AppBarProps', 'MobileAppBar', []],
];

/** Every member a props interface declares, following `extends` of local
 *  interfaces (TypographyBase). Inherited native attributes are not listed —
 *  they are the passthrough, not the component's own props. */
function declaredProps(type) {
  const m = coreProps.match(new RegExp('interface ' + type + '(?: extends ([\\w<>, |\'.]+))? \\{([\\s\\S]*?)\\n\\}'))
    || coreProps.match(new RegExp('interface ' + type + '(?: extends ([^{]+))? \\{([^}]*)\\}'));
  if (!m) throw new Error('fix-dts: core-props.d.ts has no interface ' + type);
  const own = [...m[2].matchAll(/^\s*([A-Za-z_$][\w$]*)\??:/gm)].map((x) => x[1]);
  const inline = [...m[2].matchAll(/(?:^|;)\s*([A-Za-z_$][\w$]*)\??:/g)].map((x) => x[1]);
  const base = (m[1] || '').split(/[ ,<]/).map((t) => t.trim()).filter((t) => /^[A-Z]\w*$/.test(t) && coreProps.includes('interface ' + t + ' '));
  return new Set([...own, ...inline, ...base.flatMap((b) => [...declaredProps(b)])]);
}

/** The props a source function destructures: `function X({ a, b = 1, ...rest })`. */
function destructured(file, fn) {
  const src = readFileSync(join(srcRoot, file + '.js'), 'utf8');
  const at = [new RegExp('function ' + fn + '\\s*\\('), new RegExp(fn + '\\s*=\\s*(?:React\\.)?forwardRef\\(\\s*function\\s*\\w*\\s*\\(')]
    .map((re) => src.search(re)).find((i) => i >= 0);
  if (at === undefined) throw new Error('fix-dts: no function ' + fn + ' in ' + file);
  const open = src.indexOf('({', at);
  let depth = 0, i = open;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') { depth--; if (depth === 0) break; }
  }
  const body = src.slice(open + 2, i - 1).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const names = []; let d = 0, cur = '';
  for (const c of body) {
    if ('({['.includes(c)) d++; else if (')}]'.includes(c)) d--;
    if (c === ',' && d === 0) { names.push(cur); cur = ''; } else cur += c;
  }
  names.push(cur);
  return names.map((n) => n.trim()).filter((n) => n && !n.startsWith('...'))
    .map((n) => n.split(/[=:]/)[0].trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    // aria-* and data-* come with the native attributes every props type extends.
    .filter((n) => !/^(aria|data)-/.test(n));
}

/** Replace `export function Name(...)...;` or `export const Name: ...;`. */
function replaceDecl(text, name, decl) {
  const fnAt = text.search(new RegExp('^export function ' + name + '\\(', 'm'));
  if (fnAt >= 0) {
    let depth = 0, i = text.indexOf('(', fnAt);
    for (; i < text.length; i++) {
      const c = text[i];
      if (c === '(' || c === '{') depth++;
      else if (c === ')' || c === '}') { depth--; if (depth === 0) break; }
    }
    const end = text.indexOf(';', i) + 1;
    return text.slice(0, fnAt) + decl + text.slice(end);
  }
  const constRe = new RegExp('^export const ' + name + ': [^;]*;', 'm');
  if (constRe.test(text)) return text.replace(constRe, decl);
  return null;
}

let typed = 0;
const drift = [];
for (const [file, type, fn, names, source] of CORE) {
  const dts = join(root, 'components', file + '.d.ts');
  let text = readFileSync(dts, 'utf8');
  const rel = relative(dirname(dts), join(root, 'core-props')).split('\\').join('/');
  const T = 'import("' + (rel.startsWith('.') ? rel : './' + rel) + '").' + type;
  if (fn) {
    const declared = declaredProps(type);
    const missing = destructured(source || file, fn).filter((p) => !declared.has(p) && !['className', 'style'].includes(p));
    if (missing.length) drift.push(fn + ' takes ' + missing.join(', ') + ' — not in ' + type);
  }
  for (const name of names) {
    const isButton = name === 'Button' && type === 'ButtonProps';
    const decl = isButton
      ? 'export const Button: import("react").ForwardRefExoticComponent<' + T + ' & import("react").RefAttributes<HTMLButtonElement>>;'
      : 'export function ' + name + '(props: ' + T + '): import("react").JSX.Element;';
    const next = replaceDecl(text, name, decl);
    if (next !== null) { text = next; typed++; }
  }
  writeFileSync(dts, text);
}
if (drift.length) {
  console.error('fix-dts: types/core-props.d.ts is behind the components:\n  ' + drift.join('\n  '));
  process.exit(1);
}

// Export the vocabulary so consumers can type their own wrappers.
const indexDts = join(root, 'components', 'index.d.ts');
writeFileSync(indexDts, readFileSync(indexDts, 'utf8')
  + '\nexport type { Theme, Surface, Color, Size, ButtonVariant, TextColor, HeadingColor, IconShape, AvatarShape, '
  + 'SectionProps, ContainerProps, GridProps, StackProps, CardProps, ButtonProps, ToggleButtonGroupProps, LinkProps, '
  + 'TextProps, HeadingProps, TypographyProps, IconProps, IconBadgeProps, ChipProps, AvatarProps, TextFieldProps, '
  + 'FooterProps, FooterColumn, FooterLink, FooterSocialLink, AppBarProps, AppBarLink } from "../core-props";\n');
console.log('fix-dts: ' + typed + ' core components given exact prop types');
