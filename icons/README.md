# @omni-design/icons

The Material Icons as plain SVG React components — the same names, glyphs and
props as `@mui/icons-material` v7, without MUI's styling engine. An icon costs
its path data, not ~70 KB of MUI and emotion.

```bash
npm install @omni-design/icons
```

```jsx
import HomeIcon from '@omni-design/icons/Home';
import { Search } from '@omni-design/icons';
import { HomeOutlined, DeleteOutlined } from '@omni-design/icons/outlined';

<HomeIcon />
<HomeIcon fontSize="small" />          {/* small | medium | large | inherit */}
<HomeIcon titleAccess="Home" />         {/* gives it an accessible name */}
```

## Styles

Every icon comes in five styles, as in MUI, with MUI's names: `Home`,
`HomeOutlined`, `HomeRounded`, `HomeSharp`, `HomeTwoTone`. Figma's Icon component
draws the Default, Round and Sharp styles from the same Material Icons fonts.

| Style | Import |
| --- | --- |
| Filled | `import HomeIcon from '@omni-design/icons/Home'` |
| Outlined | `import { HomeOutlined } from '@omni-design/icons/outlined'` |
| Rounded | `import { HomeRounded } from '@omni-design/icons/rounded'` |
| Sharp | `import { HomeSharp } from '@omni-design/icons/sharp'` |
| Two tone | `import { HomeTwoTone } from '@omni-design/icons/twotone'` |
| Any | `import { Home, HomeOutlined } from '@omni-design/icons'` |

Each style module exports every icon of that style by name, and the bundler
keeps only the ones imported (`sideEffects: false`, every export pure).

### Migrating from 0.1.x

0.1.x had a file per icon in every style — 43,103 files, which made `npm install`
slow. From 0.2.0 only the filled icons have a file each; the other four styles
are one module per style. Filled imports do not change. A styled one moves from
a default import of its own path to a named import from its style:

```diff
- import HomeOutlinedIcon from '@omni-design/icons/HomeOutlined';
+ import { HomeOutlined as HomeOutlinedIcon } from '@omni-design/icons/outlined';
```

The name is unchanged, so `import { HomeOutlined } from '@omni-design/icons'`
works in both versions.

## ES modules and require()

The package is ES modules. `require()` is supported for the root and the four
style entries, which ship a CommonJS build:

```js
const { Home, HomeOutlined } = require('@omni-design/icons');
const { HomeRounded } = require('@omni-design/icons/rounded');
```

A per-icon path (`@omni-design/icons/Home`) is ES only. `require()` of it works
on Node 20.19+ / 22.12+ (`require(esm)`); a test runner that does not transform
`node_modules` (Jest) should import from the root instead, or add
`@omni-design/icons` to its transform allow-list.

## From @mui/icons-material

Moving from `@mui/icons-material` is a change of import path (for the styled
icons, the named import above). The icons keep MUI's class names
(`MuiSvgIcon-root`, `MuiSvgIcon-fontSize…`), so styles written against them keep
working. Two differences:

- `color="primary"` (and the other palette names) reads the design system's
  `--Icons-*` tokens instead of MUI's own default palette.
- `sx` takes plain CSS properties and the spacing shorthands (`mr`, `px` …);
  selectors and theme callbacks are MUI-only — use `style` or `className`.

The path data is generated from `@mui/icons-material` (MIT) at build time;
the icons are Google's Material Icons (Apache 2.0).
