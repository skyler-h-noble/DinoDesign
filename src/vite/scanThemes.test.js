import { mkdtempSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { themesInSource, importedComponents, scanAppThemes } from './scanThemes';

const NAMES = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral', 'Info', 'Success', 'Warning', 'Error', 'App-Bar', 'Nav-Bar', 'Status'];

test('literals name themes in any case, and as the start of a variant', () => {
  const src = `<Alert color="error" /><Section theme='Primary' /><Button variant="warning-outline" /><div data-theme={\`nav-bar\`} />`;
  expect([...themesInSource(src, NAMES)].sort()).toEqual(['Error', 'Nav-Bar', 'Primary', 'Warning']);
});

test('ordinary strings do not count', () => {
  expect([...themesInSource(`const a = "primary school"; const b = 'errors'; log("information")`, NAMES)]).toEqual([]);
});

test('lib imports are read, aliases and types included', () => {
  const src = `import { AppBar, Button as B, type ButtonProps } from '@omni-design/components';\nimport X from 'other';`;
  expect([...importedComponents(src)].sort()).toEqual(['AppBar', 'Button', 'ButtonProps']);
});

test('an app: Default always, literals, imported components and extras, in system order', () => {
  const root = mkdtempSync(join(tmpdir(), 'omni-scan-'));
  mkdirSync(join(root, 'src'));
  mkdirSync(join(root, 'node_modules'));
  writeFileSync(join(root, 'src', 'App.jsx'), `import { AppBar, CodeBlock } from '@omni-design/components';\nexport default () => <Alert color="success" />;`);
  writeFileSync(join(root, 'node_modules', 'x.js'), `"Error"`);
  const r = scanAppThemes(root, NAMES, { extra: ['Tertiary'] });
  expect(r.themes).toEqual(['Default', 'Tertiary', 'Neutral', 'Success', 'App-Bar']);
});
